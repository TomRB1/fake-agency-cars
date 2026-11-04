from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Cliente de Supabase (Python SDK)
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

# Modelos de request
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

# GET /productos
@app.get("/productos")
def get_productos():
    response = supabase.table("productos").select("*").execute()
    return response.data

# GET /productos/:id
@app.get("/productos/{producto_id}")
def get_producto(producto_id: int):
    response = supabase.table("productos").select("*").eq("id", producto_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return response.data[0]

# POST /checkout
@app.post("/checkout")
def checkout(data: CheckoutRequest):
    try:
        # 1. Descontar stock usando la función RPC
        for item in data.items:
            rpc_response = supabase.rpc("descontar_stock", {
                "producto_id": item.id,
                "cantidad": item.cantidad
            }).execute()
        
        # 2. Generar número de orden
        numero_orden = f"ORD-{int(__import__('time').time() * 1000)}"
        
        # 3. Guardar la orden
        supabase.table("ordenes").insert({
            "numero_orden": numero_orden,
            "comprador_nombre": data.comprador.nombre,
            "comprador_direccion": data.comprador.direccion,
            "metodo_pago": data.comprador.metodoPago,
            "total": data.total,
            "items": [item.dict() for item in data.items]
        }).execute()
        
        return {
            "success": True,
            "numeroOrden": numero_orden,
            "mensaje": "Compra confirmada"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))