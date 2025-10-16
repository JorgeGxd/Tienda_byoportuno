import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./catalogo.css";
import banner2 from "./img/banner.jpeg"

function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [orden, setOrden] = useState("default");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error al cargar productos:", err));
  }, []);

  // --- Función para ordenar ---
  const ordenarProductos = (lista) => {
    let productosOrdenados = [...lista];

    switch (orden) {
      case "A-Z":
        productosOrdenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case "precio-asc":
        productosOrdenados.sort(
          (a, b) => Number(a.precio) - Number(b.precio)
        );
        break;
      case "precio-desc":
        productosOrdenados.sort(
          (a, b) => Number(b.precio) - Number(a.precio)
        );
        break;
      default:
        // No hacer nada (orden original)
        break;
    }

    return productosOrdenados;
  };

  return (
    <div className="catalogo-page">
      {/* Banner superior */}
      <div className="catalogo-banner">
                <img src={banner2} alt="Banner" />
              </div>


      {/* Título y botones */}
      <div className="titulo-section">
        <h2>Productos</h2>
        <div className="botones-orden">
          <button
            className={orden === "default" ? "activo" : ""}
            onClick={() => setOrden("default")}
          >
            Default
          </button>
          <button
            className={orden === "A-Z" ? "activo" : ""}
            onClick={() => setOrden("A-Z")}
          >
            A-Z
          </button>
          <button
            className={orden === "precio-asc" ? "activo" : ""}
            onClick={() => setOrden("precio-asc")}
          >
            Precio ↓
          </button>
          <button
            className={orden === "precio-desc" ? "activo" : ""}
            onClick={() => setOrden("precio-desc")}
          >
            Precio ↑
          </button>
        </div>
      </div>

      {/* Cuadrícula de productos */}
      <div className="catalogo-container">
        {ordenarProductos(productos).map((prod) => (
          <div
            key={prod.id}
            className="producto-card"
            onClick={() => navigate(`/producto/${prod.id}`)}
          >
            <div className="imagen-container">
              <img src={ prod.imagen?.startsWith("http")? prod.imagen: `http://localhost:5000${prod.imagen}`}
  alt={prod.nombre} />
            </div>
            <div className="producto-info">
              <h3>{prod.nombre}</h3>
              <p className="precio">Q.{Number(prod.precio).toFixed(2)}</p>
              <p className="descripcion">{prod.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalogo;



