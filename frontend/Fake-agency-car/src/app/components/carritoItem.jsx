import { View, Text, Pressable, StyleSheet } from "react-native";

export default function CarritoItem({ auto, onRemove }) {
  return (
    <View style={styles.item}>
      <View>
       <Text style={styles.nombre}>{auto.nombre}</Text>
        <Text>${auto.precio}</Text>
      </View>
      <Pressable onPress={onRemove}>
        <Text style={styles.quitar}>Quitar del carrito</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "white",
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nombre: { fontSize: 16, fontWeight: "bold" },
  quitar: { fontSize: 20 },
});