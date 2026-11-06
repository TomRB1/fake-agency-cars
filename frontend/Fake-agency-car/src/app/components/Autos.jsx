import { Text, View, StyleSheet, Pressable, Image} from "react-native"


export default function AutoInfo({Info, onPress }) {

    return (
        <View style={styles.card}>
            <View style={styles.info}>
                 <Image source={{ uri: Info.imagen }} style={styles.imagen} resizeMode="cover" />
                <Text style= {styles.nombre}> {Info.nombre}</Text>

                <Text style= {styles.detalle}>  {Info.descripcion}</Text>

                <Text style={styles.precio}> Precio: {Info.precio}</Text>

                <Pressable style={styles.boton} onPress={onPress}>
                        <Text style={styles.botonTexto}>Ver detalles</Text>
                </Pressable>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#271d16",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#8a8a89",
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: "hidden",
  
  }, 
  imagen: { width: "100%", height: 180, backgroundColor: "#ddd" },
  info: { padding: 12 },
  nombre: { fontSize: 18, fontWeight: "bold", color: "#f8dcb2fb" },
  detalle: { fontSize: 14, color: "#ad9985", marginTop: 2 },
  precio: { fontSize: 20, fontWeight: "bold", color: "#583620", marginTop: 8 },
  boton: {
    backgroundColor: "#afafaf",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  botonTexto: { color: "#fdf8cbfd", fontWeight: "600" },
});