import { useState } from "react";

export default function useCart() {
  const [carrito, setCarrito] = useState([]);

  // devuelve true si lo agregó, false si ya estaba
  const addToCart = (auto) => {
    if (carrito.some((a) => a.id === auto.id)) return false;
    setCarrito((prev) => [...prev, auto]);
    return true;
  };

  const removeFromCart = (id) => {
    setCarrito((prev) => prev.filter((a) => a.id !== id));
  };

  const clearCart = () => setCarrito([]);

  const total = carrito.reduce((acc, a) => acc + Number(a.precio), 0);

  return { carrito, addToCart, removeFromCart, clearCart, total };
}