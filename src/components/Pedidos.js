import express from "express";
import { db } from "./server.js";

const router = express.Router();

// 📦 Registrar pedido
router.post("/", async (req, res) => {
  const { numeroPedido, subtotal, envio, total, fecha, cliente, carrito } = req.body;

  try {
    // Insertar cliente (siempre guardar dirección)
    const [clienteResult] = await db.promise().query(
      "INSERT INTO clientes (nombre, apellido, telefono, correo, direccion) VALUES (?, ?, ?, ?, ?)",
      [
        cliente.nombre,
        cliente.apellido,
        cliente.telefono,
        cliente.email,
        cliente.direccion
      ]
    );

    const id_cliente = clienteResult.insertId;

    // Insertar pedido
    const [pedidoResult] = await db.promise().query(
      "INSERT INTO pedidos (id_cliente, fecha_pedido, subtotal, envio, total, estado) VALUES (?, ?, ?, ?, ?, 'En proceso')",
      [id_cliente, fecha, subtotal, envio, total]
    );

    const id_pedido = pedidoResult.insertId;

    // Insertar detalle del pedido
    for (const item of carrito) {
      await db.promise().query(
        "INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)",
        [id_pedido, item.id, item.cantidad, item.precio]
      );
    }

    // Devolver información completa del pedido
    res.json({
      message: "Pedido registrado correctamente",
      numeroPedido,
      cliente,
      carrito,
      subtotal,
      envio,
      total,
      fecha,
    });
  } catch (err) {
    console.error("❌ Error al registrar pedido:", err);
    res.status(500).json({ error: "Error al registrar el pedido" });
  }
});

// 📋 Obtener todos los pedidos con información del cliente y productos
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        p.id_pedido,
        p.subtotal,
        p.envio,
        p.total,
        p.estado,
        p.fecha_pedido,
        c.nombre,
        c.apellido,
        c.telefono,
        c.correo,
        c.direccion
      FROM pedidos p
      JOIN clientes c ON p.id_cliente = c.id_cliente
      ORDER BY p.fecha_pedido DESC
    `);

    const pedidos = [];

    for (const pedido of rows) {
      const [productos] = await db.promise().query(`
        SELECT 
          dp.id_producto,
          pr.nombre AS nombre_producto,
          dp.cantidad,
          dp.precio_unitario
        FROM detalle_pedido dp
        JOIN productos pr ON dp.id_producto = pr.id
        WHERE dp.id_pedido = ?
      `, [pedido.id_pedido]);

      pedidos.push({ ...pedido, productos });
    }

    res.json(pedidos);
  } catch (err) {
    console.error("Error al obtener pedidos:", err);
    res.status(500).json({ error: "Error al obtener pedidos" });
  }
});

// 🟢 Cambiar estado del pedido
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    await db.promise().query("UPDATE pedidos SET estado = ? WHERE id_pedido = ?", [estado, id]);
    res.json({ message: "Estado del pedido actualizado correctamente" });
  } catch (err) {
    console.error("Error al actualizar estado:", err);
    res.status(500).json({ error: "Error al actualizar estado del pedido" });
  }
});

export default router;
