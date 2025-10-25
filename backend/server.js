import express from "express";
import cors from "cors";
import mysql from "mysql2";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authRoutes from "./auth.js";
import pedidosRoutes from "./Pedidos.js"; // ✅ Importa el router de pedidos
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();

// ✅ Middleware CORS actualizado
app.use(cors({
  origin: [
    "http://localhost:3000",             // Desarrollo local
    "https://tienda-byoportuno.vercel.app" // Producción en Vercel
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ✅ Conexión a la base de datos
export const db = mysql.createConnection({
  host: process.env.HOSTDB,
  user: process.env.USERDB,
  password: process.env.PASSWORDDB,
  database: process.env.DATABASE,
  port: process.env.PORTDB,
  decimalNumbers: true, // Convierte DECIMAL en números automáticamente
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

// ✅ Rutas principales
app.use("/auth", authRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ CRUD de productos
app.get("/api/productos", (req, res) => {
  db.query("SELECT * FROM productos", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/api/productos", upload.single("imagen"), (req, res) => {
  const { nombre, descripcion, precio, stock, categoria } = req.body;
  const imagen = req.file ? `/uploads/${req.file.filename}` : req.body.imagen || null;

  db.query(
    "INSERT INTO productos (nombre, descripcion, precio, stock, categoria, imagen) VALUES (?, ?, ?, ?, ?, ?)",
    [nombre, descripcion, precio, stock, categoria, imagen],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ id: result.insertId, nombre, descripcion, precio, stock, categoria, imagen });
    }
  );
});

app.put("/api/productos/:id", upload.single("imagen"), (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock, categoria } = req.body;
  const imagen = req.file ? `/uploads/${req.file.filename}` : req.body.imagen;

  db.query(
    "UPDATE productos SET nombre=?, descripcion=?, precio=?, stock=?, categoria=?, imagen=? WHERE id=?",
    [nombre, descripcion, precio, stock, categoria, imagen, id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ id, nombre, descripcion, precio, stock, categoria, imagen });
    }
  );
});

app.delete("/api/productos/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM productos WHERE id=?", [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Producto eliminado correctamente" });
  });
});

app.get("/api/productos/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM productos WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    if (results.length === 0) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(results[0]);
  });
});

// ✅ Arranque del servidor - accesible públicamente
app.listen(5000, "0.0.0.0", () => {
  console.log("✅ Servidor corriendo en el puerto 5000 y accesible públicamente");
});
