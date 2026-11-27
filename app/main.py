import os
import time
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from supabase import create_client

load_dotenv()

app = FastAPI(redirect_slashes=False)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

#Que me diga el error si faltan datos
if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_URL o SUPABASE_KEY no estan en el env")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


#=============================================================
class Comprador(BaseModel):
    nombre: str
    direccion: str
    metodoPago: str


class ItemCarrito(BaseModel):
    id: int
    cantidad: int = Field(gt=0) 


class CheckoutRequest(BaseModel):
    comprador: Comprador
    items: list[ItemCarrito]
    total: float

#=============================================================
          #endpoints


@app.get("/")
def root():
    return {"status": "ok", "mensaje": "api funkando"}

@app.get("/productos/")
def get_productos():
    response = supabase.table("productos").select("*").execute()
    return response.data



@app.get("/productos/{producto_id}")
def get_producto(producto_id: int):
    response = (
        supabase.table("productos")
        .select("*")
        .eq("id", producto_id)
        .limit(1)
        .execute()
    )


    if not response.data:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    return response.data[0]



@app.post("/checkout")
def checkout(data: CheckoutRequest):
    try:
        #descontar el stock de supabase
        for item in data.items:
            supabase.rpc("descontar_stock", {
                "producto_id": item.id,
                "cantidad": item.cantidad
            }).execute()

        #generar numero de orden 
        numero_orden = f"ORD-{int(time.time() * 1000)}"

        #se guarda en la tabla temoporal
        supabase.table("ordenes").insert({
            "numero_orden": numero_orden,
            "comprador_nombre": data.comprador.nombre,
            "comprador_direccion": data.comprador.direccion,
            "metodo_pago": data.comprador.metodoPago,
            "total": data.total,
            "items": [item.model_dump() for item in data.items]
        }).execute()

        #Devuelve pago confirmado
        return {
            "success": True,
            "numeroOrden": numero_orden,
            "mensaje": "Compra confirmada"
        }

    except Exception as e:
        #devuelve el eror
        raise HTTPException(status_code=400, detail=str(e))
