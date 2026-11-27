import { Stack } from "expo-router";
import { CartProvider } from "../../context/CartContext";

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Inicio" }} />
        <Stack.Screen name="detalle/[id]" options={{ title: "Detalle" }} />
        <Stack.Screen name="Carrito" options={{ title: "Carrito" }} />
      </Stack>
    </CartProvider>
  );
}