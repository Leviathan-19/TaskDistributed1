import { useState, useEffect } from "react";
import axios from "axios";
import React from 'react';

export default function App() {
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3000/api/images").then(res => setImages(res.data));
  }, []);

  const filtered = images.filter(img =>
    img.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Picsum API</h2>
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "8px", width: "300px", marginBottom: "20px" }}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {filtered.map(img => (
          <div
            key={img.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "10px",
              width: "250px",
              textAlign: "center"
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
