import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./catalogo.css";
import banner2 from "./img/banner.jpeg";

function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [orden, setOrden] = useState("default");
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 20;
  const navigate = useNavigate();

  // 🔄 Cargar productos del backend
  useEffect(() => {
    fetch("http://18.217.195.162:5000/api/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error al cargar productos:", err));
  }, []);

  // 🧩 Obtener lista única de categorías desde los productos
  const categorias = [
    "Todas",
    ...new Set(productos.map((p) => p.categoria?.trim() || "Sin categoría")),
  ];

  // 🔍 Filtrar productos por búsqueda y categoría
  const filtrarProductos = (lista) => {
    let filtrados = lista;

    if (categoriaSeleccionada !== "Todas") {
      filtrados = filtrados.filter(
        (prod) => prod.categoria === categoriaSeleccionada
      );
    }

    if (busqueda.trim()) {
      filtrados = filtrados.filter((prod) =>
        prod.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    return filtrados;
  };

  // ↕️ Ordenar productos
  const ordenarProductos = (lista) => {
    let productosOrdenados = [...lista];
    switch (orden) {
      case "A-Z":
        productosOrdenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case "precio-asc":
        productosOrdenados.sort((a, b) => Number(a.precio) - Number(b.precio));
        break;
      case "precio-desc":
        productosOrdenados.sort((a, b) => Number(b.precio) - Number(a.precio));
        break;
      default:
        break;
    }
    return productosOrdenados;
  };

  // 🔢 Calcular productos paginados
  const productosFiltrados = ordenarProductos(filtrarProductos(productos));
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const inicio = (paginaActual - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const productosPagina = productosFiltrados.slice(inicio, fin);

  const cambiarPagina = (num) => {
    if (num >= 1 && num <= totalPaginas) setPaginaActual(num);
  };

  return (
    <div className="catalogo-page">
      {/* 🖼️ Banner superior */}
      <div className="catalogo-banner">
        <img src={banner2} alt="Banner" />
      </div>

      {/* 🔍 Búsqueda, orden y categorías */}
      <div className="titulo-section">
        <h2>Productos</h2>

        <div className="busqueda-y-orden">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
          />

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

          {/* 🧩 Botón Categorías */}
          <button
            className="boton-categorias"
            onClick={() => setMostrarCategorias(!mostrarCategorias)}
          >
            Categorías ▾
          </button>
        </div>
      </div>

      {/* 📂 Acordeón de categorías */}
      {mostrarCategorias && (
        <div className="acordeon-categorias">
          {categorias.map((cat, index) => (
            <div
              key={index}
              className={`categoria-item ${
                categoriaSeleccionada === cat ? "activo" : ""
              }`}
              onClick={() => {
                setCategoriaSeleccionada(cat);
                setPaginaActual(1);
                setMostrarCategorias(false);
              }}
            >
              {cat}
            </div>
          ))}
        </div>
      )}

      {/* 🧱 Cuadrícula de productos */}
      <div className="catalogo-container">
        {productosPagina.length > 0 ? (
          productosPagina.map((prod) => (
            <div
              key={prod.id}
              className="producto-card"
              onClick={() => navigate(`/producto/${prod.id}`)}
            >
              <div className="imagen-container">
                <img
                  src={
                    prod.imagen?.startsWith("http")
                      ? prod.imagen
                      : `http://18.217.195.162:5000${prod.imagen}`
                  }
                  alt={prod.nombre}
                />
              </div>
              <div className="producto-info">
                <h3>{prod.nombre}</h3>
                <p className="precio">Q.{Number(prod.precio).toFixed(2)}</p>
                <p className="descripcion">{prod.descripcion}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="sin-resultados">No se encontraron productos</p>
        )}
      </div>

      {/* 📄 Paginación */}
      {totalPaginas > 1 && (
        <div className="paginacion">
          <button
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
          >
            ◀
          </button>

          {[...Array(totalPaginas)].map((_, i) => (
            <button
              key={i}
              className={paginaActual === i + 1 ? "activo" : ""}
              onClick={() => cambiarPagina(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
          >
            ▶
          </button>
        </div>
      )}

      {/* 🧭 Indicador de página */}
      <div className="pagina-indicador">
        Página {paginaActual} de {totalPaginas}
      </div>
    </div>
  );
}

export default Catalogo;
