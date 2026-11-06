import { useEffect, useState } from "react";
import { ScrollView, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

const API = "https://fake-agency-cars.vercel.app/productos/";

export default function Detalle() {
  const { id } = useLocalSearchParams();
  const [auto, setAuto] = useState(null);

  useEffect(() => {
    async function carga() {
      try {
        const res = await fetch(`${API}${id}`);
        setAuto(await res.json());
      } catch (e) {
        console.log(e);
      }
    }
    carga();
  }, [id]);

  if (!auto) {
    return (
      <SafeAreaView style={styles.centro}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image source={{ uri: auto.imagen }} style={styles.imagen} />
        <Text style={styles.nombre}>{auto.nombre}</Text>
        <Text style={styles.precio}>${Number(auto.precio).toLocaleString("es-AR")}</Text>
        <Text style={styles.descripcion}>{auto.descripcion}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centro: { flex: 1, justifyContent: "center", alignItems: "center" },
  imagen: { width: "100%", height: 260 },
  nombre: { fontSize: 24, fontWeight: "bold", margin: 16 },
  precio: { fontSize: 22, color: "#c0392b", fontWeight: "bold", marginHorizontal: 16 },
  descripcion: { fontSize: 16, color: "#444", margin: 16, lineHeight: 22 },
});