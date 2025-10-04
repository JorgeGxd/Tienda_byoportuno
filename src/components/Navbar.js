// Navbar.js
import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import Logo from './img/Logo.jpeg';
import './Navbar.css';

function Navbar() {
  
  const navigate = useNavigate();
  //const cartCount = 3;
  // Leer si el usuario está logueado desde localStorage
  const user = localStorage.getItem("token");
  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token"); // Elimina el token
    navigate("/login"); // Redirige al login
  };

  return (
    <nav className="navbar-container">
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/inicio">
          <img src={Logo} alt="Tu foto" />
        </Link>
      </div>

      {/* Links */}
      <ul className="nav">
        <li className="nav-item">
          <NavLink
            to="/inicio"
            end
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Inicio
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/quienes-somos"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            ¿Quienes somos?
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/catalogo"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Catálogo
          </NavLink>
        </li>
      </ul>

      {/* Botón Carrito */}
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
          {/*cartCount > 0 && <span className="cart-badge">{cartCount}</span>*/}
        </Link>
        {/* Botón Login / Logout */}
        {user ? (
          <button className="login-button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        ) : (
          <Link to="/login" className="login-button">
            Iniciar sesión
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
