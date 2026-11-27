import { createContext, useContext } from "react";
import useCarrito from "../hooks/useCarrito";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const carrito = useCarrito(); // tu hook de siempre, sin cambios
  return <CartContext.Provider value={carrito}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}