import React, { useEffect, useState } from "react";
import "./AdminPanel.css";

function AdminPanel() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria: "",
    imagen: ""
  });
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  // 🧾 Cargar productos desde el backend
  const fetchProductos = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/productos");
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // ✏️ Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 💾 Crear o actualizar producto
  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `http://localhost:5000/api/productos/${editId}`
      : "http://localhost:5000/api/productos";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Error en la operación: ${errorData}`);
      }

      await fetchProductos();

      // 🔄 Reiniciar formulario
      setForm({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        categoria: "",
        imagen: ""
      });
      setEditId(null);
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert("No se pudo guardar el producto. Revisa la consola para más detalles.");
    }
  };

  // 🧩 Cargar datos del producto al formulario
  const handleEdit = (producto) => {
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      categoria: producto.categoria,
      imagen: producto.imagen
    });
    setEditId(producto.id || producto._id);
  };

  // 🗑️ Eliminar producto
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/productos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Error al eliminar el producto.");

      setProductos(productos.filter((p) => p.id !== id && p._id !== id));
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar el producto.");
    }
  };

  return (
    <div className="admin-container">
      <h2>Panel de Administración</h2>

      {/* 🧾 Formulario */}
      <form onSubmit={handleSubmit} className="admin-form">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
        />
        <input
          type="number"
          step="0.01"
          name="precio"
          placeholder="Precio"
          value={form.precio}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
        />
        <input
          type="text"
          name="categoria"
          placeholder="Categoría"
          value={form.categoria}
          onChange={handleChange}
        />
        <input
          type="text"
          name="imagen"
          placeholder="URL de la imagen"
          value={form.imagen}
          onChange={handleChange}
        />

        <button type="submit">{editId ? "Actualizar" : "Agregar"}</button>
      </form>

      {/* 📋 Tabla de productos */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id || p._id}>
              <td>
                <img src={p.imagen} alt={p.nombre} width="60" />
              </td>
              <td>{p.nombre}</td>
              <td>{p.descripcion}</td>
              <td>Q{p.precio}</td>
              <td>{p.stock}</td>
              <td>{p.categoria}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Editar</button>
                <button onClick={() => handleDelete(p.id || p._id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;
