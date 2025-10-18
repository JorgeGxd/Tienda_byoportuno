// src/components/Footer.js
import React from "react";
import "./Footer.css";
import { FaFacebook, FaInstagram, FaTiktok, FaPhone, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-social">
          <a href="https://www.facebook.com/p/By-Oportuno-Accesorios-100084742885320" target="_blank" rel="noopener noreferrer">
            <FaFacebook />
          </a>
          <a href="https://www.instagram.com/by_oportunoaccesorios" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://www.tiktok.com/@by_oportuno" target="_blank" rel="noopener noreferrer">
            <FaTiktok />
          </a>
        </div>

        <div className="footer-contact">
          <p><FaPhone /> +502 3793-0451</p>
          <p><FaEnvelope /> By_oportuno@yahoo.com</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
