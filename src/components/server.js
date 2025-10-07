import express from "express";
import cors from "cors";
import mysql from "mysql2";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authRoutes from "./auth.js"; // ✅ importamos el router de autenticación

const app = express();

// ✅ Middleware
app.use(cors({ origin: "http://localhost:3000" })); // Permitir conexión desde React
app.use(express.json());

// ✅ Rutas de autenticación
app.use("/auth", authRoutes);

// ✅ Conexión a la base de datos
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "junio152001",
  database: "tienda",
});

// ✅ CRUD de productos
app.get("/api/productos", (req, res) => {
  db.query("SELECT * FROM productos", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/api/productos", (req, res) => {
  const { nombre, descripcion, precio, cantidad, categoria } = req.body;
  db.query(
    "INSERT INTO productos (nombre, descripcion, precio, cantidad, categoria) VALUES (?, ?, ?, ?, ?)",
    [nombre, descripcion, precio, cantidad, categoria],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ id: result.insertId, nombre, descripcion, precio, cantidad, categoria });
    }
  );
});

// ✅ Arranque del servidor
app.listen(5000, () => console.log("✅ Servidor corriendo en http://localhost:5000"));



