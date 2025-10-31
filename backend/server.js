import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const pool = new pg.Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "12345678",
  database: process.env.DB_NAME || "Task1",
  port: 5432,
});

// ✅ LOGIN
app.post("/api/login", async (req, res) => {
  const { mail_users, password_users } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE mail_users=$1", [mail_users]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });
    const user = result.rows[0];
    const valid = await bcrypt.compare(password_users, user.password_users);
    if (!valid) return res.status(401).json({ error: "Contraseña incorrecta" });
    res.json({ message: "Login exitoso", id_user: user.id_users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ CRUD Usuarios
app.get("/api/users", async (req, res) => {
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
});

app.post("/api/users", async (req, res) => {
  const { mail_users, password_users } = req.body;
  const hash = await bcrypt.hash(password_users, 10);
  const result = await pool.query(
    "INSERT INTO users (mail_users, password_users) VALUES ($1, $2) RETURNING *",
    [mail_users, hash]
  );
  res.json(result.rows[0]);
});

// ✅ Guardar búsquedas
app.post("/api/searches", async (req, res) => {
  const { id_user, words } = req.body;
  await pool.query("INSERT INTO searches (id_user, words) VALUES ($1, $2)", [id_user, words]);
  res.json({ message: "Búsqueda guardada" });
});

// ✅ API proxy (para frontend)
app.get("/api/images", async (req, res) => {
  try {
    const response = await fetch("https://picsum.photos/v2/list");
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener imágenes" });
  }
});

app.listen(3000, () => console.log("🚀 Backend running on port 3000"));
