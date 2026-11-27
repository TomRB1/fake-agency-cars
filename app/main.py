from fastapi import FastAPI, HTTPException, Request   # [修改] 加了 Request
from pydantic import BaseModel
from supabase import create_client
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import mercadopago                                      # [新增]
import uuid                                             # [新增]

load_dotenv()

app = FastAPI(redirect_slashes=False)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

# [新增] SDK de Mercado Pago
sdk = mercadopago.SDK(os.getenv("MP_ACCESS_TOKEN"))

# Modelos (sin cambios)
class Comprador(BaseModel):
    nombre: str
    direccion: str
    metodoPago: str

class ItemCarrito(BaseModel):
    id: int
    cantidad: int

class CheckoutRequest(BaseModel):
    comprador: Comprador
    items: list[ItemCarrito]
    total: float


@app.get("/")
def root():
    return {"status": "ok", "mensaje": "La API de autos está funcionando!"}


@app.get("/productos/", include_in_schema=True)
def get_productos():
    response = supabase.table("productos").select("*").execute()
    return response.data


@app.get("/productos/{producto_id}")
def get_producto(producto_id: int):
    response = supabase.table("productos").select("*").eq("id", producto_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return response.data[0]


# [修改] El checkout ya no descuenta stock, solo crea la preferencia y devuelve init_point
@app.post("/checkout")
def checkout(data: CheckoutRequest):
    try:
        # Generar una referencia externa única para vincular con el Webhook
        external_ref = f"ORD-{uuid.uuid4().hex[:8].upper()}"

        # 1. Guardar los items del carrito en la tabla temporal de Supabase
        supabase.table("carritos_pendientes").insert({
            "external_reference": external_ref,
            "items": [item.dict() for item in data.items]
        }).execute()

        # 2. Construir los items de Mercado Pago (se recomienda obtener el precio real desde la base de datos de productos)
        items_mp = []
        for item in data.items:
            # Aquí se puede consultar el precio del producto desde la tabla productos según item.id
            # Por ahora se usa el total del request para calcular el promedio, solo como ejemplo
            pass

        # 3. Crear la preferencia de pago (igual que antes)
        preference_data = {
            "items": items_mp,
            "payer": {"name": data.comprador.nombre},
            "back_urls": {
                "success": "https://tu-frontend.com/success",
                "failure": "https://tu-frontend.com/failure",
                "pending": "https://tu-frontend.com/pending"
            },
            "auto_return": "approved",
            "external_reference": external_ref,
            "notification_url": "https://tu-backend.com/webhooks/mercadopago"
        }
        preference_response = sdk.preference().create(preference_data)
        preference = preference_response["response"]

        return {
            "success": True,
            "init_point": preference["init_point"],
            "external_reference": external_ref
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# [新增] Webhook: aquí se ejecuta la lógica original de descontar stock y crear orden
@app.post("/webhooks/mercadopago")
async def mercadopago_webhook(request: Request):
    try:
        body = await request.json()
        if body.get("type") != "payment":
            return {"status": "ignored"}

        payment_id = body["data"]["id"]
        payment_info = sdk.payment().get(payment_id)
        payment = payment_info["response"]

        if payment.get("status") == "approved":
            external_ref = payment.get("external_reference")

            # 1. Recuperar los items del carrito desde la tabla temporal
            cart_response = supabase.table("carritos_pendientes") \
                .select("items") \
                .eq("external_reference", external_ref) \
                .execute()

            if not cart_response.data:
                print(f"No se encontró el carrito para {external_ref}")
                return {"status": "ok"}

            items = cart_response.data[0]["items"]

            # 2. Ejecutar el descuento real de stock (usando tu función RPC original)
            for item in items:
                supabase.rpc("descontar_stock", {
                    "producto_id": item["id"],
                    "cantidad": item["cantidad"]
                }).execute()

            # 3. Crear la orden (opcional: guardar el registro de la orden)
            supabase.table("ordenes").insert({
                "numero_orden": external_ref,
                "comprador_nombre": payment["payer"].get("first_name", ""),
                "comprador_direccion": "",  # Se puede obtener de payment o del carrito
                "metodo_pago": "mercadopago",
                "total": payment["transaction_amount"],
                "items": items
            }).execute()

            # 4. Eliminar el carrito temporal (limpieza)
            supabase.table("carritos_pendientes") \
                .delete() \
                .eq("external_reference", external_ref) \
                .execute()

            print(f"Pago aprobado, stock descontado: {external_ref}")

        return {"status": "ok"}
    except Exception as e:
        print(f"Error en Webhook: {e}")
        return {"status": "error"}