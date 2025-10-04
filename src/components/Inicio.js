// Inicio.js
import React from "react";
import "./Inicio.css";
import banner from "./img/banner.jpeg";     // 🔹 reemplaza con tu imagen
import misionImg from "./img/mision.jpeg";  // 🔹 reemplaza con tu imagen
import visionImg from "./img/vision.jpeg";  // 🔹 reemplaza con tu imagen

function Inicio() {
  return (
    <div className="inicio-container">
      
      {/* Banner superior */}
      <div className="inicio-banner">
        <img src={banner} alt="Banner" />
      </div>

      {/* Secciones Misión / Visión */}
      <div className="inicio-grid-container">
        {/* Fila 1 */}
        <div className="inicio-card">
          <h2>Misión</h2>
          <p>
            Ofrecer a nuestros clientes una amplia variedad de accesorios y joyería de alta
            calidad, con diseños exclusivos y precios accesibles, proporcionando una
            experiencia de compra excepcional y personalizada que realce su estilo y
            personalidad.
          </p>
        </div>
        <div className="inicio-img-box">
          <img src={misionImg} alt="Misión imagen" />
        </div>

        {/* Fila 2 */}
        <div className="inicio-img-box">
          <img src={visionImg} alt="Visión imagen" />
        </div>
        <div className="inicio-card">
          <h2>Visión</h2>
          <p>
            Ser la tienda en línea líder en el mercado de accesorios y joyería, reconocida por
            nuestra innovación, calidad y compromiso con la satisfacción del cliente,
            convirtiéndonos en la primera opción para quienes buscan piezas únicas y elegantes.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Inicio;
