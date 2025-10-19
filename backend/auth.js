import express from "express";
import mysql from "mysql2";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config()

// Conexión a BD
const db = mysql.createConnection({
  host: process.env.HOSTDB,
  user: process.env.USERDB,
  password: process.env.PASSWORDDB,
  database: process.env.DATABASE,
  port: process.env.PORTDB,
  decimalNumbers: true, // ✅ convierte DECIMAL en números automáticamente
});

// 🔹 Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query("SELECT * FROM usuarios WHERE username = ?", [username], async (err, results) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });
    if (results.length === 0) return res.status(401).json({ error: "Usuario no encontrado" });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).json({ error: "Contraseña incorrecta" });

    // Crear token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, rol: user.rol },
      "secreto_super_seguro",
      { expiresIn: "1h" }
    );

    res.json({ message: "Login exitoso", token, rol: user.rol });
  });
});

// 🔹 Middleware para proteger rutas
function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(403).json({ error: "Token requerido" });

  jwt.verify(token, "secreto_super_seguro", (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    req.user = user;
    next();
  });
}

// 🔹 Ejemplo de ruta protegida (solo admin)
router.get("/admin", verificarToken, (req, res) => {
  if (req.user.rol !== "admin") return res.status(403).json({ error: "No autorizado" });
  res.json({ message: "Bienvenido al panel de administrador" });
});

export default router;