import { useState } from "react";
import {  ScrollView, View,Text,TextInput,  Pressable, ActivityIndicator,Alert,StyleSheet,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useCart } from "../../context/CartContext";
import CarritoItem from "./components/carritoItem";

const API_URL = "https://fake-agency-cars.vercel.app";

export default function CarritoPantalla() {
  const { carrito, removeFromCart, clearCart, total } = useCart();
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  const [vence, setVence] = useState("");
  const [cvv, setCvv] = useState("");
  const [cargando, setCargando] = useState(false);
  const [orden, setOrden] = useState(null);

  const validar = () => {
    if (!nombre.trim() || !direccion.trim()) {
      return "Completá nombre y dirección";
    }
    if (tarjeta.replace(/\s/g, "").length !== 16) {
      return "El número de tarjeta debe tener 16 dígitos";
    }
    if (!/^\d{2}\/\d{2}$/.test(vence)) {
      return "El vencimiento debe tener formato MM/AA";
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      return "El código de seguridad debe tener 3 o 4 dígitos";
    }
    return null;
  };

  const handlePagar = async () => {
    const error = validar();
    if (error) {
      Alert.alert("Revisá los datos", error);
      return;
    }

    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comprador: {
            nombre: nombre.trim(),
            direccion: direccion.trim(),
            metodoPago: "Mercado Pago",
          },
          items: carrito.map((a) => ({ id: a.id, cantidad: 1 })),
          total,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const motivo =
          typeof data.detail === "string" ? data.detail : "Datos inválidos";
        throw new Error(motivo);
      }

      setOrden(data.numeroOrden);
      clearCart();
    } catch (e) {
      Alert.alert("No se pudo pagar", e.message);
    } finally {
      setCargando(false);
    }
  };

  // 1) Comprobante de éxito (primero, porque el carrito ya quedó vacío)
  if (orden) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centro}>
          <Text style={styles.exito}>¡Pago aprobado!</Text>
          <Text style={styles.texto}>Pagado con Mercado Pago</Text>
          <Text style={styles.texto}>Número de orden:</Text>
          <Text style={styles.orden}>{orden}</Text>
          <Pressable style={styles.boton} onPress={() => router.replace("/")}>
            <Text style={styles.botonTexto}>Volver al catálogo</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // 2) Carrito vacío (sin opción de pagar)
  if (carrito.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centro}>
          <Text style={styles.texto}>El carrito está vacío</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 3) Carrito con productos + pago
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {carrito.map((item) => (
          <CarritoItem
            key={item.id}
            auto={item}
            onRemove={() => removeFromCart(item.id)}
          />
        ))}

        <Pressable onPress={clearCart}>
          <Text style={styles.vaciar}>Vaciar carrito</Text>
        </Pressable>

        <Text style={styles.total}>Total: ${total}</Text>

        <Text style={styles.seccion}>Datos del comprador</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Dirección"
          value={direccion}
          onChangeText={setDireccion}
        />

        <View style={styles.mp}>
          <View style={styles.mpHeader}>
            <Text style={styles.mpLogo}>Mercado Pago</Text>
            <Text style={styles.mpSub}>Pago con tarjeta (simulado)</Text>
          </View>

          <TextInput
            style={styles.mpInput}
            placeholder="Número de tarjeta"
            value={tarjeta}
            onChangeText={setTarjeta}
            keyboardType="numeric"
            maxLength={19}
          />
          <View style={styles.fila}>
            <TextInput
              style={[styles.mpInput, styles.mitad]}
              placeholder="MM/AA"
              value={vence}
              onChangeText={setVence}
              maxLength={5}
            />
            <TextInput
              style={[styles.mpInput, styles.mitad]}
              placeholder="CVV"
              value={cvv}
              onChangeText={setCvv}
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
            />
          </View>
        </View>

        <Pressable
          style={[styles.boton, cargando && styles.botonDeshabilitado]}
          onPress={handlePagar}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color="#2d3277" />
          ) : (
            <Text style={styles.botonTexto}>Pagar con Mercado Pago</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#645748" },
  centro: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  texto: { fontSize: 18, color: "white", marginBottom: 8 },
  exito: { fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 16 },
  orden: { fontSize: 20, fontWeight: "bold", color: "#ffd183", marginBottom: 16 },
  vaciar: { color: "#ffd183", textAlign: "center", padding: 8 },
  total: { fontSize: 20, fontWeight: "bold", padding: 16, color: "white" },
  seccion: { color: "white", fontSize: 16, marginHorizontal: 12, marginBottom: 6 },
  input: {
    backgroundColor: "white",
    marginHorizontal: 12,
    marginBottom: 8,
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  }, 
  mp: {
    backgroundColor: "white",
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
    paddingBottom: 8,
  },
  mpHeader: { backgroundColor: "#009ee3", padding: 12, marginBottom: 8 },
  mpLogo: { color: "white", fontSize: 18, fontWeight: "bold" },
  mpSub: { color: "white", fontSize: 13 },
  mpInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 12,
    marginBottom: 8,
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  fila: { flexDirection: "row" },
  mitad: { flex: 1 },
  boton: {
    backgroundColor: "#ffe600",
    margin: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  botonDeshabilitado: { opacity: 0.6 },
  botonTexto: { color: "#2d3277", fontWeight: "700", fontSize: 16 },
});