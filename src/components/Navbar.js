import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import Logo from './img/Logo.jpeg';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const user = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar-container">
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/inicio">
          <img src={Logo} alt="Logo" />
        </Link>
      </div>

      {/* Links principales */}
      <ul className="nav">
        <li className="nav-item">
          <NavLink to="/inicio" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Inicio
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/quienes-somos" className={({ isActive }) => (isActive ? 'active' : '')}>
            ¿Quiénes somos?
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/catalogo" className={({ isActive }) => (isActive ? 'active' : '')}>
            Catálogo
          </NavLink>
        </li>
      </ul>

      {/* Sección derecha: carrito + botones */}
      <div className="navbar-right">
  <Link to="/carrito" className="cart-button">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      className="cart-icon"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.6 8h13.2L17 13H7z"
      />
    </svg>
  </Link>

  <div className="auth-buttons">
    {user && (
      <Link to="/admin" className="navbar-button">
        Panel Admin
      </Link>
    )}

    {user ? (
      <button className="navbar-button" onClick={handleLogout}>
        Cerrar sesión
      </button>
    ) : (
      <Link to="/login" className="navbar-button">
        Iniciar sesión
      </Link>
    )}
  </div>
</div>
    </nav>
  );
}

export default Navbar;
