import React, { useEffect, useState } from "react";
import "./AdminPanel.css";

function AdminPanel() {
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
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

  // 🧾 Cargar productos
  const fetchProductos = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/productos");
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  // 🧾 Cargar pedidos
  const fetchPedidos = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/pedidos");
      const data = await res.json();
      setPedidos(data);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
    fetchPedidos();
  }, []);

  // ✏️ Manejar cambios del formulario
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Error en la operación: ${errorData}`);
      }

      await fetchProductos();

      // Reiniciar formulario
      setForm({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        categoria: "",
        imagen: "",
      });
      setEditId(null);
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert("No se pudo guardar el producto. Revisa la consola para más detalles.");
    }
  };

  // 🧩 Editar producto
  const handleEdit = (producto) => {
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      categoria: producto.categoria,
      imagen: producto.imagen,
    });
    setEditId(producto.id || producto._id);
  };

  // 🗑️ Eliminar producto
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/productos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al eliminar el producto.");

      setProductos(productos.filter((p) => p.id !== id && p._id !== id));
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar el producto.");
    }
  };

  // 🔄 Cambiar estado del pedido
  const handleEstadoChange = async (id_pedido, nuevoEstado) => {
    try {
      const res = await fetch(`http://localhost:5000/api/pedidos/${id_pedido}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!res.ok) throw new Error("Error al actualizar estado del pedido");

      // Actualizar lista local
      setPedidos((prev) =>
        prev.map((p) =>
          p.id_pedido === id_pedido ? { ...p, estado: nuevoEstado } : p
        )
      );
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("No se pudo actualizar el estado del pedido.");
    }
  };

  return (
    <div className="admin-container">
      <h2>Panel de Administración</h2>

      {/* 🧾 FORMULARIO PRODUCTOS */}
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

      {/* 📦 TABLA PRODUCTOS */}
      <h3>📦 Productos</h3>
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
              <td><img src={p.imagen} alt={p.nombre} width="60" /></td>
              <td>{p.nombre}</td>
              <td>{p.descripcion}</td>
              <td>Q{p.precio}</td>
              <td>{p.stock}</td>
              <td>{p.categoria}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Editar</button>
                <button onClick={() => handleDelete(p.id || p._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🧾 TABLA PEDIDOS */}
      <h3>🧾 Pedidos</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Dirección</th>
            <th>Subtotal</th>
            <th>Envío</th>
            <th>Total</th>
            <th>Fecha</th>
            <th>Productos</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p.id_pedido}>
              <td>{p.id_pedido}</td>
              <td>{p.nombre} {p.apellido}</td>
              <td>{p.telefono}</td>
              <td>{p.correo}</td>
              <td>{p.direccion}</td>
              <td>Q{Number(p.subtotal || 0).toFixed(2)}</td>
              <td>Q{Number(p.envio || 0).toFixed(2)}</td>
              <td><strong>Q{Number(p.total || 0).toFixed(2)}</strong></td>
              <td>{new Date(p.fecha_pedido).toLocaleDateString()}</td>
              <td>
                {p.productos.map((prod) => (
                  <div key={prod.id_producto}>
                    {prod.nombre_producto} (x{prod.cantidad})
                  </div>
                ))}
              </td>
              <td>
                <select
                  value={p.estado || "En proceso"}
                  onChange={(e) => handleEstadoChange(p.id_pedido, e.target.value)}
                >
                  <option value="En proceso">En proceso</option>
                  <option value="Completo">Completo</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;
