import React, { useEffect, useState } from "react";
import "./Checkout.css";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [carrito, setCarrito] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const envio = 35.0;
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [cliente, setCliente] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    direccion: "",
  });

  const navigate = useNavigate();

  const cargarCarritoYCalcular = () => {
    const datos = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(datos);

    const s = datos.reduce((acc, item) => acc + Number(item.precio) * Number(item.cantidad), 0);
    setSubtotal(s);
    setTotal(s + envio);
  };

  useEffect(() => {
    cargarCarritoYCalcular();
    const actualizar = () => cargarCarritoYCalcular();
    window.addEventListener("cartUpdated", actualizar);
    window.addEventListener("storage", actualizar);
    return () => {
      window.removeEventListener("cartUpdated", actualizar);
      window.removeEventListener("storage", actualizar);
    };
  }, []);

  const handleChange = (e) => setCliente({ ...cliente, [e.target.name]: e.target.value });

  const validarFormulario = () => {
    const camposVacios = Object.entries(cliente).filter(([, v]) => !v || v.trim() === "");
    if (camposVacios.length > 0) {
      setError("Por favor, completa todos los campos.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.email)) {
      setError("Correo electrónico inválido.");
      return false;
    }
    if (!/^[0-9]{8,}$/.test(cliente.telefono)) {
      setError("El teléfono debe tener al menos 8 dígitos numéricos.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const numeroPedido = "PED-" + Math.floor(10000 + Math.random() * 90000);
    const fecha = new Date().toISOString().slice(0, 19).replace("T", " ");

    const pedido = { numeroPedido, subtotal, envio, total, fecha, cliente, carrito };

    try {
      const response = await fetch("http://18.217.195.162:5000/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido),
      });

      if (!response.ok) throw new Error("Error al registrar el pedido");
      const data = await response.json();

      console.log("✅ Pedido guardado:", data);
      localStorage.removeItem("carrito");
      navigate("/confirmacion", { state: { pedido: data } });
    } catch (err) {
      console.error("❌ Error al registrar el pedido:", err);
      setError("Ocurrió un error al procesar el pedido.");
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-form">
        <h2>Datos del cliente</h2>
        {error && <p className="mensaje-error">{error}</p>}

        <div className="form-row">
          <input name="nombre" value={cliente.nombre} onChange={handleChange} placeholder="Nombre" />
          <input name="apellido" value={cliente.apellido} onChange={handleChange} placeholder="Apellido" />
        </div>

        <input name="telefono" value={cliente.telefono} onChange={handleChange} placeholder="Teléfono" />
        <input name="email" value={cliente.email} onChange={handleChange} placeholder="Correo electrónico" />
        <input name="direccion" value={cliente.direccion} onChange={handleChange} placeholder="Dirección" />

        <button className="btn-continuar" onClick={handleSubmit}>Confirmar pedido</button>
      </div>

      <div className="checkout-summary">
        <h3>Resumen</h3>
        <div className="summary-row"><span>SubTotal:</span><span>Q. {subtotal.toFixed(2)}</span></div>
        <div className="summary-row"><span>Envío:</span><span>Q. {envio.toFixed(2)}</span></div>
        <hr />
        <div className="summary-row total"><strong>Total:</strong><strong>Q. {total.toFixed(2)}</strong></div>
      </div>
    </div>
  );
}
