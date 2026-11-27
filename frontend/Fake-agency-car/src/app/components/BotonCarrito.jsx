import { Pressable, Text, StyleSheet } from "react-native";

export default function BotonCarrito({ cantidad, onPress }) {
  return (
    <Pressable style={styles.boton} onPress={onPress}>
      <Text style={styles.texto}>🛒 Ver carrito ({cantidad})</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    backgroundColor: "white",
    marginHorizontal: 12,
    marginBottom: 8,
    padding: 10,
    borderRadius: 8,
  },
  texto: { fontSize: 16, textAlign: "center" },
});