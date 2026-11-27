import { FlatList, Text, TextInput, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import useFetchData from "../../hooks/useFetchData";
import useSearch from "../../hooks/useSearch";
import { useCart } from "../../context/CartContext";
import AutoInfo from "./components/Autos";
import BotonCarrito from "./components/BotonCarrito";

export default function Index() {

  const { datos } = useFetchData();
  const { busqueda, setBusqueda, filtrados } = useSearch(datos);
  const { carrito, addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = (auto) => {
    const agregado = addToCart(auto);
    Alert.alert(agregado ? "Listo" : "Ya está en el carrito", auto.nombre);
  };

  return (
    <SafeAreaView style={styles.container}>
      

      <BotonCarrito cantidad={carrito.length} onPress={() => router.push("/Carrito")} />

      <TextInput
        style={styles.input}
        placeholder="Buscar por nombre..."
        value={busqueda}
        onChangeText={setBusqueda}
        autoCorrect={false}
      />

      <FlatList
        data={filtrados}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <AutoInfo
            Info={item}
            onPress={() => router.push(`/detalle/${item.id}`)}
            addToCart={() => handleAddToCart(item)}
          />
        )}
        ListEmptyComponent={<Text style={styles.texto}>No se encontraron autos</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#645748" },
  texto: { fontSize: 18, padding: 12, color: "black" },
  input: {
    backgroundColor: "white",
    marginHorizontal: 12,
    marginBottom: 8,
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
});