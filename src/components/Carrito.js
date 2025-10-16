import React, { useState, useEffect } from "react";
import "./Carrito.css";
import { useNavigate } from "react-router-dom";

function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const costoEnvio = 35;
  const navigate = useNavigate();

  // 🛒 Cargar carrito desde localStorage
  const cargarCarrito = () => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(carritoGuardado);
  };

  // 🔁 Cargar carrito al iniciar y escuchar cambios
  useEffect(() => {
    cargarCarrito();
    window.addEventListener("storage", cargarCarrito);
    window.addEventListener("cartUpdated", cargarCarrito);

    return () => {
      window.removeEventListener("storage", cargarCarrito);
      window.removeEventListener("cartUpdated", cargarCarrito);
    };
  }, []);

  // 💰 Calcular subtotal y actualizar localStorage cuando cambie el carrito
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

  // 🔄 Actualizar cantidad de un producto (respetando el stock máximo)
  const actualizarCantidad = (id, cantidad) => {
    const nuevoCarrito = carrito.map((item) => {
      if (item.id === id) {
        const nuevaCantidad = Math.min(Number(cantidad), item.stock || 1);
        return { ...item, cantidad: nuevaCantidad };
      }
      return item;
    });

    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // ❌ Eliminar producto del carrito
  const eliminarProducto = (id) => {
    const nuevoCarrito = carrito.filter((item) => item.id !== id);
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // 🧾 Total con envío
  const total = subtotal + costoEnvio;

  // 🚀 Ir al checkout
  const handleContinuar = () => {
    localStorage.setItem("subtotal", subtotal.toFixed(2));
    localStorage.setItem("total", total.toFixed(2));
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/checkout");
  };

  return (
    <div className="carrito-page">
      <div className="carrito-contenido">
        <div className="carrito-items">
          <h2>Carrito de compras</h2>

          {carrito.length === 0 ? (
            <p className="vacio">Tu carrito está vacío </p>
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
                  {carrito.map((prod) => {
                    const maxCantidad = prod.stock > 0 ? prod.stock : 1;

                    return (
                      <tr key={prod.id}>
                        <td className="col-item">
                          <img
                            src={prod.imagen?.startsWith("http")?prod.imagen:'http://localhost:5000{prod.imagen}'}
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
                            disabled={prod.stock === 0}
                          >
                            {Array.from({ length: maxCantidad }, (_, i) => i + 1).map(
                              (n) => (
                                <option key={n} value={n}>
                                  {n}
                                </option>
                              )
                            )}
                          </select>
                          {prod.stock === 0 && (
                            <span className="agotado-texto">Sin stock</span>
                          )}
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
                    );
                  })}
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
