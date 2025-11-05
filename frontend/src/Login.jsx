import { useState } from "react";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("🔐 Intentando login con:", email, password);

    try {
      const res = await axios.post("http://localhost:3000/api/login", {
        mail_users: email,
        password_users: password,
      });

      console.log("📡 Respuesta del backend:", res.data);

      // Guardamos id_user en localStorage
      localStorage.setItem("id_user", res.data.id_user);

      // Redirigimos a App.jsx
      navigate("/app");
    } catch (err) {
      console.error("❌ Error al loguear:", err.response?.data || err);
      alert(err.response?.data?.error || "Error de login");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "8px", width: "300px", marginBottom: "10px", display: "block" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "8px", width: "300px", marginBottom: "10px", display: "block" }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
