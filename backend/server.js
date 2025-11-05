import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// db local
// const pool = new pg.Pool({
//   host: process.env.DB_HOST || "localhost",  
//   user: process.env.DB_USER || "admin",       
//   password: process.env.DB_PASS || "123456",  
//   database: process.env.DB_NAME || "searchdb",
//   port: 5433,                                 
// });

//db docker
const pool = new pg.Pool({
  host: "localhost",       
  user: "admin",
  password: "123456",
  database: "searchdb",
  port: 5432,             
});


// LOGIN
app.post("/api/login", async (req, res) => {
  const { mail_users, password_users } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE mail_users=$1", [mail_users]);
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
    const user = result.rows[0];
    const valid = await bcrypt.compare(password_users, user.password_users);
    if (!valid) return res.status(401).json({ error: "Wrong password" });
    res.json({ message: "Login success", id_user: user.id_users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CRUD USERS

// List users
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Users by id
app.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM users WHERE id_users = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Users not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create user
app.post("/api/users", async (req, res) => {
  const { mail_users, password_users } = req.body;
  try {
    const hash = await bcrypt.hash(password_users, 10);
    const result = await pool.query(
      "INSERT INTO users (mail_users, password_users) VALUES ($1, $2) RETURNING *",
      [mail_users, hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user by id
app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { mail_users, password_users } = req.body;
  try {
    const hash = password_users ? await bcrypt.hash(password_users, 10) : null;
    const result = await pool.query(
      "UPDATE users SET mail_users = COALESCE($1, mail_users), password_users = COALESCE($2, password_users) WHERE id_users = $3 RETURNING *",
      [mail_users, hash, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Users not found" });
    res.json({ message: "User updated", user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user by id
app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM users WHERE id_users = $1 RETURNING *", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Users not found" });
    res.json({ message: "User deleted", user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Save searches
app.post("/api/searches", async (req, res) => {
  const { id_user, words } = req.body;
  try {
    await pool.query("INSERT INTO searches (id_user, words) VALUES ($1, $2)", [id_user, words]);
    res.json({ message: "Search saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ API images picsum.photos
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
