import { useState, useEffect } from "react";

const API = "https://fake-agency-cars.vercel.app/productos/";

export default function useFetchData() {
  const [datos, setDatos] = useState([]);
 

  useEffect(() => {
    async function carga() {
      try {
        const respuesta = await fetch(API);
        const res = await respuesta.json();
        setDatos(res);
      } catch (error) {
        console.log("error en la carga de datos:", error);
      } finally {
       
      }
    }
    carga();
  }, []);

  return { datos, };
}