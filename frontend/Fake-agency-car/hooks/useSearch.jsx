import { useState, useMemo } from "react";

export default function useSearch(datos) {
  const [busqueda, setBusqueda] = useState("");

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return datos ?? [];

     return (datos ?? []).filter((auto) =>
     auto.nombre.toLowerCase().includes(texto)
  );
  }, [datos, busqueda, ]);

  return { busqueda, setBusqueda, filtrados };
}