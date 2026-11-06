import { FlatList, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; 
import { useRouter } from "expo-router";
import useFetchData from "../../hooks/useFetchData";
import AutoInfo from "./components/Autos";

export default function Index() {
  
  const { datos } = useFetchData();
  const router = useRouter();
  console.log (datos)
 

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={datos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <AutoInfo 
          Info= {item}
          onPress= {() => router.push(`/detalle/${item.id}`)}/>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#645748" },
  texto: { fontSize: 18, padding: 12 , color:"Black"},
});