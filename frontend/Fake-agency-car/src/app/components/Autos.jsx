import { Text, View, StyleSheet, Pressable, Image, TextInput} from "react-native"

export default function AutoInfo({Info, onPress, addToCart,}) {

    return (
        <View style={styles.card}>
            <View style={styles.info}>
                 <Image source={{ uri: Info.imagen }} style={styles.imagen} resizeMode="cover" />
                 
                <Text style= {styles.nombre}> {Info.nombre}</Text>

                <Text style= {styles.detalle}>  {Info.descripcion}</Text>

                <Text style={styles.precio}> Precio:$ {Info.precio}</Text>

                <Pressable style={styles.boton} onPress={onPress}>
                        <Text style={styles.botonTexto}>Ver detalles</Text>
                </Pressable>
                
                <Pressable onPress={addToCart} style={styles.boton}>
                 <Text>Agregar al carrito</Text>
                </Pressable>
                
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#47351a",
    borderRadius: 14,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: "hidden",
  
  }, 
  imagen: { width: "100%", height: 180, backgroundColor: "#ddd" },
  info: { padding: 12 },
  nombre: { fontSize: 18, fontWeight: "bold", color: "#ffcc80fb", textAlign:"center"},
  detalle: { fontSize: 14, color: "#f1cf85", marginTop: 2, textAlign: "center" },
  precio: { fontSize: 20, fontWeight: "bold", color: "#ffd183", marginTop: 8, textAlign:"center"},
  boton: {
    backgroundColor: "#ffaa29",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  botonTexto: { color: "#ca744cfd", fontWeight: "600" },
});