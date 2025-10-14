import express from "express";
import cors from "cors";
import mysql from "mysql2";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authRoutes from "./auth.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Necesario para usar __dirname con módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ Middleware
app.use(cors({ origin: "http://localhost:3000" }));
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

// ✅ Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Carpeta pública
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ CRUD de productos

// Obtener todos
app.get("/api/productos", (req, res) => {
  db.query("SELECT * FROM productos", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Crear producto
app.post("/api/productos", upload.single("imagen"), (req, res) => {
  const { nombre, descripcion, precio, stock, categoria } = req.body;
  const imagen = req.file ? `/uploads/${req.file.filename}` : req.body.imagen || null;

  db.query(
    "INSERT INTO productos (nombre, descripcion, precio, stock, categoria, imagen) VALUES (?, ?, ?, ?, ?, ?)",
    [nombre, descripcion, precio, stock, categoria, imagen],
    (err, result) => {
      if (err) {
        console.error("Error al insertar producto:", err);
        return res.status(500).send(err);
      }
      res.json({ id: result.insertId, nombre, descripcion, precio, stock, categoria, imagen });
    }
  );
});

// Actualizar producto
app.put("/api/productos/:id", upload.single("imagen"), (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock, categoria } = req.body;
  const imagen = req.file ? `/uploads/${req.file.filename}` : req.body.imagen;

  db.query(
    "UPDATE productos SET nombre=?, descripcion=?, precio=?, stock=?, categoria=?, imagen=? WHERE id=?",
    [nombre, descripcion, precio, stock, categoria, imagen, id],
    (err, result) => {
      if (err) {
        console.error("Error al actualizar producto:", err);
        return res.status(500).send(err);
      }
      res.json({ id, nombre, descripcion, precio, stock, categoria, imagen });
    }
  );
});

// Eliminar producto
app.delete("/api/productos/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM productos WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Producto eliminado correctamente" });
  });
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

    res.json(results[0]);
  });
});

// ✅ Arranque del servidor
app.listen(5000, () => console.log("✅ Servidor corriendo en http://localhost:5000"));
