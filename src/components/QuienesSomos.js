import React from 'react';
import './QuienesSomos.css';
import banner2 from './img/banner2.jpeg';
import quienes from './img/quienes.jpeg';
import eventos from './img/eventos.png';

function QuienesSomos() {
  return (
      <div className="quienes-container">
        
        {/* Banner superior */}
        <div className="quienes-banner">
          <img src={banner2} alt="Banner" />
        </div>
  
        {/* Secciones Misión / Visión */}
        <div className="quienes-grid-container">
          {/* Fila 1 */}
          <div className="quienes-img-box">
            <img src={quienes} alt="Quienes imagen" />
          </div>
          <div className="quienes-card">
            <h2>¿Quienes somos?</h2>
            <p>
              ByOportuno accesorios es un tienda donde puedes encontrar accesorios de tus personajes favoritos de anime, videojuegos o películas. !También podrás comprar insumos si quieres armar tus propios accesorios o para proveer tu negocio!
            </p>
          </div>
          
          {/* Fila 2 */}
          <div className="quienes-card">
            <h2>También...</h2>
            <p>
              Podrás encontrarnos en eventos relacionados al Anime, videojuegos o temas Geek. Siempre llevamos accesorios, figuras y Hot wheels para que puedas pasar a vistarnos. !Puedes enterarte de los próximos eventos siguiéndonos en nuestras redes sociales para ver nuestros anuncios!
            </p>
          </div>
          <div className="quienes-img-box">
            <img src={eventos} alt="Eventos imagen" />
          </div>
  
        </div>
      </div>
    );
}

export default QuienesSomos;