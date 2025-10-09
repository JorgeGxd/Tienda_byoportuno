import React, { useEffect, useState } from "react";
import "./Checkout.css";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [carrito, setCarrito] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const envio = 35.0;
  const [total, setTotal] = useState(0);
  const [cliente, setCliente] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    direccion: "",
    casa: "",
    departamento: "",
    ciudad: "",
  });

  const navigate = useNavigate();

  // 🔄 Carga el carrito desde localStorage y recalcula totales
  const cargarCarritoYCalcular = () => {
    const datos = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(datos);

    const s = datos.reduce((acc, item) => {
      const precioNum = Number(item.precio) || 0;
      const cantidadNum = Number(item.cantidad) || 0;
      return acc + precioNum * cantidadNum;
    }, 0);

    setSubtotal(s);
    setTotal(s + envio);
  };

  useEffect(() => {
    cargarCarritoYCalcular();

    const onCartUpdated = () => cargarCarritoYCalcular();
    window.addEventListener("cartUpdated", onCartUpdated);
    window.addEventListener("storage", onCartUpdated);

    return () => {
      window.removeEventListener("cartUpdated", onCartUpdated);
      window.removeEventListener("storage", onCartUpdated);
    };
  }, []);

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const numeroPedido = "PED-" + Math.floor(10000 + Math.random() * 90000);

    const orden = {
      numeroPedido,
      cliente,
      carrito,
      subtotal,
      envio,
      total,
      fecha: new Date().toISOString(),
    };

    // 💾 Guardar pedido temporal
    localStorage.setItem("ordenEnProgreso", JSON.stringify(orden));

    // 🧹 Vaciar carrito del localStorage
    localStorage.removeItem("carrito");

    // 🚀 Redirigir a confirmación
    navigate("/confirmacion", { state: { pedido: orden } });
  };

  return (
    <div className="checkout-container">
      <div className="checkout-form">
        <h2>Datos del cliente</h2>

        <div className="form-row">
          <input name="nombre" value={cliente.nombre} onChange={handleChange} placeholder="Nombre" />
          <input name="apellido" value={cliente.apellido} onChange={handleChange} placeholder="Apellido" />
        </div>

        <input name="telefono" value={cliente.telefono} onChange={handleChange} placeholder="Número de teléfono" />
        <input name="email" value={cliente.email} onChange={handleChange} placeholder="Correo electrónico" />

        <h2>Datos para entrega</h2>
        <div className="form-row">
          <input name="direccion" value={cliente.direccion} onChange={handleChange} placeholder="Dirección" />
          <input name="casa" value={cliente.casa} onChange={handleChange} placeholder="No. casa o apto" />
        </div>

        <input name="departamento" value={cliente.departamento} onChange={handleChange} placeholder="Departamento" />
        <input name="ciudad" value={cliente.ciudad} onChange={handleChange} placeholder="Ciudad" />

        <button className="btn-continuar" onClick={handleSubmit}>
          Confirmar pedido
        </button>
      </div>

      <div className="checkout-summary">
        <h3>Resumen</h3>

        <div className="summary-row">
          <span>SubTotal:</span>
          <span>Q. {subtotal.toFixed(2)}</span>
        </div>

        <div className="summary-row">
          <span>Envío:</span>
          <span>Q. {envio.toFixed(2)}</span>
        </div>

        <hr />

        <div className="summary-row total">
          <strong>Total:</strong>
          <strong>Q. {total.toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
}




