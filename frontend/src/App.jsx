
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function App() {
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🚀 App.jsx montado");

    // Si no hay usuario logueado, redirige al login
    const id_user = localStorage.getItem("id_user");
    console.log("🧾 id_user en localStorage:", id_user);

    if (!id_user) {
      console.warn("⚠️ No hay usuario logueado, redirigiendo al login...");
      navigate("/");
      return;
    }

    console.log("📡 Solicitando imágenes al backend...");
    axios
      .get("http://localhost:3000/api/images")
      .then((res) => {
        console.log("✅ Imágenes obtenidas:", res.data.length, "elementos");
        setImages(res.data);
      })
      .catch((err) => {
        console.error("❌ Error al obtener imágenes:", err);
      });
  }, [navigate]);

  // Filtro de búsqueda
  const filtered = images.filter((img) =>
    img.author.toLowerCase().includes(search.toLowerCase())
  );

  const logout = () => {
    console.log("👋 Cerrando sesión...");
    localStorage.removeItem("id_user");
    navigate("/");
  };

  console.log("🧠 Renderizando App.jsx con", filtered.length, "imágenes visibles");

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Picsum API</h2>
      <button
        onClick={logout}
        style={{
          float: "right",
          background: "#dc3545",
          color: "white",
          padding: "6px 12px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Cerrar sesión
      </button>

      <input
        type="text"
        placeholder="Buscar autor..."
        value={search}
        onChange={(e) => {
          console.log("🔍 Cambiando búsqueda a:", e.target.value);
          setSearch(e.target.value);
        }}
        style={{ padding: "8px", width: "300px", marginBottom: "20px" }}
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {filtered.map((img) => (
          <div
            key={img.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "10px",
              width: "250px",
              textAlign: "center",
            }}
          >
            <img
              src={`https://picsum.photos/id/${img.id}/250/250`}
              alt={img.author}
              style={{ borderRadius: "10px", width: "100%" }}
            />
            <h4>{img.author}</h4>
            <a href={img.url} target="_blank" rel="noreferrer">
              Ver en Unsplash
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
