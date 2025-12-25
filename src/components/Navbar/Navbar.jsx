import React from 'react';
import './Navbar.css';
// Importamos a imagem. Dica: se o nome do arquivo for muito longo, 
// você pode renomeá-lo para logo.png na pasta assets para facilitar.
import logo from '../../assets/Captura de Tela 2025-12-25 às 16.30.16 (1).png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-links">
          <a href="#about">A MARCA</a>
          <a href="#products">COLEÇÕES</a>
        </div>
        
        <div className="nav-logo">
          <img src={logo} alt="M MORS Logo" className="logo-img" />
        </div>
        
        <div className="nav-links">
          <a href="#bespoke">SOB MEDIDA</a>
          <a href="#contact">CONTATO</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;