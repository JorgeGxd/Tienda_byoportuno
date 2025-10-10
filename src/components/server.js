import express from "express";
import cors from "cors";
import mysql from "mysql2";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authRoutes from "./auth.js"; // ✅ importamos el router de autenticación
import multer from "multer";
//import path from "path";

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

// Configuración de multer (carpeta para guardar imágenes)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // nombre único
  },
});

const upload = multer({ storage });

// Hacer pública la carpeta uploads para acceder desde el navegador
app.use("/uploads", express.static("uploads"));

// ✅ CRUD de productos
app.get("/api/productos", (req, res) => {
  db.query("SELECT * FROM productos", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/api/productos", upload.single("imagen"), (req, res) => {
  const { nombre, descripcion, precio, cantidad, categoria } = req.body;
  const imagen = req.file ? `/uploads/${req.file.filename}` : null;
  db.query(
    "INSERT INTO productos (nombre, descripcion, precio, cantidad, categoria, imagen) VALUES (?, ?, ?, ?, ?, ?)",
    [nombre, descripcion, precio, cantidad, categoria, imagen],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ id: result.insertId, nombre, descripcion, precio, cantidad, categoria, imagen });
    }
  );
});

// Obtener producto por ID
app.get("/api/productos/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM productos WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error en la base de datos:", err);
      return res.status(500).json({ error: "Error en la base de datos" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(results[0]); // 👈 devolvemos solo el producto
  });
});

// ✅ Arranque del servidor
app.listen(5000, () => console.log("✅ Servidor corriendo en http://localhost:5000"));



