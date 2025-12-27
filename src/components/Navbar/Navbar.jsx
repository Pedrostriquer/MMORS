import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/Captura de Tela 2025-12-25 às 16.30.16 (1).png';

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  // Helper para renderizar o mega menu de forma limpa
  const renderMegaMenu = (category) => {
    const menus = {
      aneis: (
        <div className="mega-content">
          <div className="mega-col">
            <h4>ESTILOS</h4>
            <Link to="/categoria/aneis/solitarios">Solitários</Link>
            <Link to="/categoria/aneis/aliancas">Alianças</Link>
            <Link to="/categoria/aneis/chuveiros">Chuveiros</Link>
            <Link to="/categoria/aneis/aparadores">Aparadores</Link>
          </div>
          <div className="mega-col">
            <h4>MATERIAIS</h4>
            <Link to="/categoria/aneis/ouro">Ouro 18k</Link>
            <Link to="/categoria/aneis/diamantes">Diamantes</Link>
            <Link to="/categoria/aneis/pedras-preciosas">Pedras Preciosas</Link>
          </div>
        </div>
      ),
      brincos: (
        <div className="mega-content">
          <div className="mega-col">
            <h4>MODELOS</h4>
            <Link to="/categoria/brincos/argolas">Argolas</Link>
            <Link to="/categoria/brincos/pendentes">Pendentes</Link>
            <Link to="/categoria/brincos/ear-cuffs">Ear Cuffs</Link>
            <Link to="/categoria/brincos/piercings">Piercings</Link>
          </div>
          <div className="mega-col">
            <h4>OCASIÃO</h4>
            <Link to="/categoria/brincos/festa">Festa</Link>
            <Link to="/categoria/brincos/dia-a-dia">Dia a Dia</Link>
          </div>
        </div>
      ),
      pulseiras: (
        <div className="mega-content">
          <div className="mega-col">
            <h4>TIPOS</h4>
            <Link to="/categoria/pulseiras/braceletes">Braceletes</Link>
            <Link to="/categoria/pulseiras/rivieras">Rivieras</Link>
            <Link to="/categoria/pulseiras/correntes">Correntes</Link>
          </div>
          <div className="mega-col">
            <h4>COLEÇÕES</h4>
            <Link to="/colecao/identidade">M MORS Icon</Link>
          </div>
        </div>
      ),
      colecoes: (
        <div className="mega-content">
          <div className="mega-col">
            <h4>LANÇAMENTOS</h4>
            <Link to="/colecao/essence">Essence</Link>
            <Link to="/colecao/patrimony">Patrimony</Link>
          </div>
          <div className="mega-col">
            <h4>ESPECIAIS</h4>
            <Link to="/colecao/bridal">Bridal / Noivas</Link>
            <Link to="/colecao/identidade">M MORS Icon</Link>
          </div>
        </div>
      )
    };
    return menus[category] || null;
  };

  return (
    <nav className="navbar" onMouseLeave={() => setActiveMenu(null)}>
      <div className="nav-main-row">
        <div className="nav-container">
          <div className="nav-links">
            <Link to="/a-marca">A MARCA</Link>
            <Link to="/sob-medida">SOB MEDIDA</Link>
          </div>
          <div className="nav-logo">
            <Link to="/"><img src={logo} alt="M MORS" className="logo-img" /></Link>
          </div>
          <div className="nav-links">
            <Link to="/contato">CONTATO</Link>
            <Link to="/login">MINHA CONTA</Link>
          </div>
        </div>
      </div>

      <div className="nav-products-row">
        <ul className="products-menu">
          {['aneis', 'brincos', 'pulseiras', 'colecoes'].map((item) => (
            <li key={item} onMouseEnter={() => setActiveMenu(item)}>
              <Link to={`/categoria/${item}`} className="nav-item-link">
                {item.toUpperCase()}
              </Link>
              {activeMenu === item && (
                <div className="mega-menu-wrapper">
                  <div className="mega-menu">
                    {renderMegaMenu(item)}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;