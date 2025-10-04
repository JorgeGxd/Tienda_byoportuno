const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

// ================== CONFIG DB ==================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "junio152001",
  database: "tienda",
});

// ================== LOGIN ==================
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  db.query("SELECT * FROM usuarios WHERE username = ?", [username], async (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(401).json({ error: "Usuario no encontrado" });

    const user = results[0];
    const validPass = await bcrypt.compare(password, user.password);

    if (!validPass) return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user.id, rol: user.rol }, "secretkey", { expiresIn: "1h" });
    res.json({ message: "Login exitoso", token, rol: user.rol });
  });
});

// ================== CRUD PRODUCTOS ==================
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

app.put("/api/productos/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, cantidad, categoria } = req.body;
  db.query(
    "UPDATE productos SET nombre=?, descripcion=?, precio=?, cantidad=?, categoria=? WHERE id=?",
    [nombre, descripcion, precio, cantidad, categoria, id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("Producto actualizado");
    }
  );
});

app.delete("/api/productos/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM productos WHERE id=?", [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send("Producto eliminado");
  });
});

// ================== INICIAR SERVER ==================
app.listen(5000, () => {
  console.log("Servidor corriendo en http://localhost:5000");
});

