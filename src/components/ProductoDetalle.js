import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductoDetalle.css";

function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    fetch(`http://18.217.195.162:5000/api/productos/${id}`)
      .then((res) => res.json())
      .then((data) => setProducto(data))
      .catch((err) => console.error("Error al cargar producto:", err));
  }, [id]);

  const agregarAlCarrito = () => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const existente = carrito.find((item) => item.id === producto.id);

    if (existente) {
      existente.cantidad += cantidad;
    } else {
      carrito.push({ ...producto, cantidad });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert("✅ Producto agregado al carrito");
  };

  if (!producto) return <p className="cargando">Cargando detalles...</p>;

  const sinStock = producto.stock === 0;

  return (
    <div className="detalle-contenedor">
      <div className="detalle-flex">
        <div className="detalle-imagen-box">
          <img
            src={producto.imagen?.startsWith("http")?producto.imagen:`http://18.217.195.162:5000${producto.imagen}`}
            alt={producto.nombre}
            className="detalle-imagen"
          />
        </div>

        <div className="detalle-info-box">
          <h2>
            {producto.nombre}{" "}
            <span className="precio">- Q{Number(producto.precio).toFixed(2)}</span>
          </h2>

          <p className="descripcion">{producto.descripcion}</p>
          <p className="categoria">
            <strong>Categoría:</strong> {producto.categoria}
          </p>

          <p className="stock">
            <strong>Disponibles:</strong>{" "}
            {sinStock ? (
              <span className="agotado-texto">Producto agotado</span>
            ) : (
              producto.stock
            )}
          </p>

          {!sinStock && (
            <div className="cantidad-section">
              <label htmlFor="cantidad">Cantidad</label>
              <select
                id="cantidad"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
              >
                {Array.from({ length: producto.stock }, (_, i) => i + 1).map(
                  (num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  )
                )}
              </select>
            </div>
          )}

          <button
            className="btn-agregar"
            onClick={agregarAlCarrito}
            disabled={sinStock}
            style={{
              backgroundColor: sinStock ? "#ccc" : "",
              cursor: sinStock ? "not-allowed" : "pointer",
            }}
          >
            {sinStock ? "🚫 No disponible" : "🛒 Añadir al carrito"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;
