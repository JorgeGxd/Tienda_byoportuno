import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Inicio from './components/Inicio';
import Navbar from './components/Navbar';
import QuienesSomos from './components/QuienesSomos';
import Catalogo from './components/catalogo';
import Login from "./components/login";
import AdminPanel from "./components/AdminPanel";
import ProductoDetalle from "./components/ProductoDetalle";
import Carrito from "./components/Carrito";
import Checkout from "./components/Checkout";
import ConfirmacionPedido from "./components/ConfirmacionPedido";
import Footer from "./components/Footer"; // ✅ Nuevo import del Footer

// ✅ Componente auxiliar para Confirmación de pedido
function ConfirmacionPedidoWrapper() {
  const location = useLocation();
  const pedido = location.state?.pedido || JSON.parse(localStorage.getItem("ordenEnProgreso"));
  return <ConfirmacionPedido pedido={pedido} />;
}

// ✅ Componente que controla la visibilidad del Footer según la ruta
function AppContent({ user, setUser }) {
  const location = useLocation();

  // ✅ Mostrar el footer solo en estas páginas
  const mostrarFooter = ["/inicio", "/quienes-somos", "/catalogo"].includes(location.pathname);

  return (
    <>
      <Navbar user={user} setUser={setUser} />

      <Routes>
        <Route path="/" element={<Navigate to="/inicio" />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/quienes-somos" element={<QuienesSomos />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmacion" element={<ConfirmacionPedidoWrapper />} />

        <Route
          path="/admin"
          element={
            user?.rol === "admin" ? <AdminPanel /> : <Navigate to="/login" />
          }
        />
      </Routes>

      {/* ✅ Footer solo visible en Inicio, Quienes Somos y Catálogo */}
      {mostrarFooter && <Footer />}
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);
  return (
    <Router>
      <AppContent user={user} setUser={setUser} />
    </Router>
  );
}

export default App;
