import React, { useEffect, useState } from "react";
import "./catalogo.css";

function Catalogo() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/productos")
      .then(res => res.json())
      .then(data => setProductos(data));
  }, []);

  return (
    <div className="catalogo-container">
      {productos.map(prod => (
        <div className="producto-card" key={prod.id}>
          <img src={prod.imagen_url} alt={prod.nombre} />
          <h3>{prod.nombre}</h3>
          <p>{prod.descripcion}</p>
          <p><b>Categoría:</b> {prod.categoria}</p>
          <p><b>Precio:</b> Q.{prod.precio}</p>
          <p><b>Disponibles:</b> {prod.stock}</p>
        </div>
      ))}
    </div>
  );
}

export default Catalogo;
