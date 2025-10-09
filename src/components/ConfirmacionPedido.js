import React from "react";
import "./ConfirmacionPedido.css";

export default function ConfirmacionPedido({ pedido }) {
  if (!pedido) {
    return (
      <div className="confirmacion-container">
        <h2>No se encontró información del pedido</h2>
      </div>
    );
  }

  const { numeroPedido, cliente, carrito, subtotal, envio, total } = pedido;

  return (
    <div className="confirmacion-container">
      <div className="confirmacion-card">
        <h2>✅ ¡Pedido confirmado!</h2>
        <p>Gracias por tu compra, {cliente.nombre} 🎉</p>

        <div className="pedido-info">
          <p><strong>Número de pedido:</strong> {numeroPedido}</p>
          <p><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleString()}</p>
        </div>

        <h3>Detalles del pedido</h3>
        <ul>
          {carrito.map((item, i) => (
            <li key={i}>
              {item.nombre} × {item.cantidad} — Q{(item.precio * item.cantidad).toFixed(2)}
            </li>
          ))}
        </ul>

        <div className="resumen-final">
          <p><strong>Subtotal:</strong> Q{subtotal.toFixed(2)}</p>
          <p><strong>Envío:</strong> Q{envio.toFixed(2)}</p>
          <hr />
          <p className="total"><strong>Total:</strong> Q{total.toFixed(2)}</p>
        </div>

        <p className="mensaje-final">
          Te contactaremos al número <strong>{cliente.telefono}</strong> o correo <strong>{cliente.email}</strong> para coordinar la entrega.
        </p>
      </div>
    </div>
  );
}

