import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Inicio from './components/Inicio';
import Navbar from './components/Navbar'; // Importa el componente Navbar
import QuienesSomos from './components/QuienesSomos';
import Catalogo from './components/catalogo';
import Login from "./components/login";
import AdminPanel from "./components/AdminPanel";
/*import Descripcion from './components/Descripcion';*/

function App() {
  const [user, setUser] = useState(null);
  return (
     <Router>
      <div>
        <Navbar user={user} setUser={setUser}/> {/* Componente de barra de navegación */}
        <Routes>
          <Route path="/" element={<Navigate to="/inicio" />} />
          <Route path="inicio" element={<Inicio />} />
          <Route path="quienes-somos" element={<QuienesSomos />} />
          <Route path="catalogo" element={<Catalogo />} />
          <Route path="/login" element={<Login setUser={setUser} />} />

          <Route
          path="/admin"
          element={
            user?.rol === "admin" ? <AdminPanel /> : <Navigate to="/login" />
          }
        />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
