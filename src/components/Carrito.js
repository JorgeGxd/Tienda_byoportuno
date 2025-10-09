import React, { useState, useEffect } from "react";
import "./Carrito.css";
import { useNavigate } from "react-router-dom";

function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const costoEnvio = 35;
  const navigate = useNavigate();

  // 🛒 Cargar carrito desde localStorage al iniciar y al cambiar localStorage
  const cargarCarrito = () => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(carritoGuardado);
  };

  useEffect(() => {
    cargarCarrito();

    // 🔄 Escuchar cambios del carrito desde otras pestañas o componentes
    window.addEventListener("storage", cargarCarrito);

    // Limpieza del listener al desmontar
    return () => window.removeEventListener("storage", cargarCarrito);
  }, []);

  // 💰 Calcular subtotal y guardar valores actualizados en localStorage
  useEffect(() => {
    if (carrito.length === 0) {
      setSubtotal(0);
      localStorage.setItem("subtotal", "0");
      localStorage.setItem("total", "0");
      return;
    }

    const nuevoSubtotal = carrito.reduce(
      (acc, prod) => acc + Number(prod.precio) * prod.cantidad,
      0
    );
    setSubtotal(nuevoSubtotal);

    const totalActualizado = nuevoSubtotal + costoEnvio;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    localStorage.setItem("subtotal", nuevoSubtotal.toFixed(2));
    localStorage.setItem("total", totalActualizado.toFixed(2));
  }, [carrito]);

  // 🔄 Actualizar cantidad
  const actualizarCantidad = (id, cantidad) => {
    const nuevoCarrito = carrito.map((item) =>
      item.id === id ? { ...item, cantidad: Number(cantidad) } : item
    );
    setCarrito(nuevoCarrito);
  };

  // ❌ Eliminar producto
  const eliminarProducto = (id) => {
    const nuevoCarrito = carrito.filter((item) => item.id !== id);
    setCarrito(nuevoCarrito);
  };

  // 🧾 Total con envío
  const total = subtotal + costoEnvio;

  // 🚀 Ir a checkout
  const handleContinuar = () => {
    localStorage.setItem("subtotal", subtotal.toFixed(2));
    localStorage.setItem("total", total.toFixed(2));
    navigate("/checkout");
  };

  return (
    <div className="carrito-page">
      <div className="carrito-contenido">
        <div className="carrito-items">
          <h2>Carrito de compras</h2>

          {carrito.length === 0 ? (
            <p className="vacio">Tu carrito está vacío 🛒</p>
          ) : (
            <>
              <table className="tabla-carrito">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {carrito.map((prod) => (
                    <tr key={prod.id}>
                      <td className="col-item">
                        <img
                          src={prod.imagen_url}
                          alt={prod.nombre}
                          className="img-item"
                        />
                        <span>{prod.nombre}</span>
                      </td>
                      <td>Q{Number(prod.precio).toFixed(2)}</td>
                      <td>
                        <select
                          value={prod.cantidad}
                          onChange={(e) =>
                            actualizarCantidad(prod.id, e.target.value)
                          }
                        >
                          {[...Array(prod.cantidad_max || 10).keys()].map((n) => (
                            <option key={n + 1} value={n + 1}>
                              {n + 1}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>Q{(prod.precio * prod.cantidad).toFixed(2)}</td>
                      <td>
                        <button
                          className="btn-eliminar"
                          onClick={() => eliminarProducto(prod.id)}
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="subtotal">
                <strong>Subtotal:</strong> Q{subtotal.toFixed(2)}
              </div>
            </>
          )}
        </div>

        {/* 📦 Resumen de compra */}
        {carrito.length > 0 && (
          <div className="resumen-compra">
            <h3>Resumen</h3>
            <p>
              <strong>SubTotal:</strong> Q{subtotal.toFixed(2)}
            </p>
            <p>
              <strong>Envío:</strong> Q{costoEnvio.toFixed(2)}
            </p>
            <hr />
            <p className="total">
              <strong>Total:</strong> Q{total.toFixed(2)}
            </p>
            <button onClick={handleContinuar} className="btn-continuar">
              Continuar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Carrito;


