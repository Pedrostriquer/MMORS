import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase/config'; 
import { doc, getDoc } from 'firebase/firestore'; 
import { ShoppingBag, Menu, X, ChevronDown } from 'lucide-react'; 
import { useCart } from '../../context/CartContext'; 
import './Navbar.css';
import logo from '../../assets/Captura de Tela 2025-12-25 às 16.30.16 (1).png'; 

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [navbarConfig, setNavbarConfig] = useState({ items: [] });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const { cart } = useCart();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const fetchNavbar = async () => {
      try {
        const configDoc = await getDoc(doc(db, "settings", "navbar")); 
        if (configDoc.exists()) {
          setNavbarConfig(configDoc.data());
        }
      } catch (error) {
        console.error("Erro ao carregar configuração da navbar:", error);
      }
    };
    fetchNavbar();
  }, []);

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <nav className="navbar" onMouseLeave={() => setActiveMenu(null)}>
      {/* LINHA PRINCIPAL: LOGO E ÍCONES */}
      <div className="nav-main-row">
        <div className="nav-container">
          <div className="nav-links mobile-menu-toggle">
            <button onClick={() => setIsMobileOpen(true)} className="burger-btn">
              <Menu size={24} />
            </button>
          </div>

          <div className="nav-logo">
            <Link to="/" onClick={() => setIsMobileOpen(false)}>
              <img src={logo} alt="M MORS" className="logo-img" />
            </Link>
          </div>

          <div className="nav-links icons-nav">
            <Link to="/carrinho" className="nav-icon-link cart-link" title="Sua Sacola">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </div>

      {/* LINHA DE PRODUTOS (DESKTOP) */}
      <div className="nav-products-row desktop-only">
        <ul className="products-menu">
          {navbarConfig.items.map((item) => (
            <li key={item.id} onMouseEnter={() => setActiveMenu(item.id)}>
              <Link 
                to={item.type === 'product' ? `/categoria/${item.id}` : '#'} 
                className={`nav-item-link ${activeMenu === item.id ? 'active' : ''}`}
              >
                {item.nome.toUpperCase()}
              </Link>
              
              {activeMenu === item.id && item.columns && item.columns.length > 0 && (
                <div className="mega-menu-wrapper">
                  <div className="mega-menu">
                    <div className="mega-content">
                      {item.columns.map((col, idx) => (
                        <div key={idx} className="mega-col">
                          <h4>{col.titulo.toUpperCase()}</h4>
                          {col.links.map((link, lIdx) => (
                            <Link 
                              key={lIdx} 
                              to={item.type === 'product' ? `/categoria/${item.id}/${link.id}` : `/colecao/${link.id}`} 
                              onClick={() => setActiveMenu(null)}
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* MENU LATERAL (MOBILE) */}
      <div className={`mobile-sidebar-overlay ${isMobileOpen ? 'active' : ''}`} onClick={() => setIsMobileOpen(false)}>
        <div className="mobile-sidebar" onClick={(e) => e.stopPropagation()}>
          <div className="sidebar-header">
            <button className="close-sidebar" onClick={() => setIsMobileOpen(false)}>
              <X size={24} />
            </button>
            <img src={logo} alt="M MORS" className="sidebar-logo" />
          </div>

          <ul className="sidebar-menu">
            {navbarConfig.items.map((item) => (
              <li key={item.id} className="sidebar-item">
                <div className="sidebar-item-row">
                  <Link 
                    to={item.type === 'product' ? `/categoria/${item.id}` : '#'} 
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {item.nome.toUpperCase()}
                  </Link>
                  {item.columns && item.columns.length > 0 && (
                    <button className="expand-btn" onClick={() => toggleAccordion(item.id)}>
                      <ChevronDown size={18} className={activeAccordion === item.id ? 'rotate' : ''} />
                    </button>
                  )}
                </div>

                {activeAccordion === item.id && item.columns && (
                  <div className="sidebar-accordion-content">
                    {item.columns.map((col, idx) => (
                      <div key={idx} className="accordion-col">
                        <span className="col-title">{col.titulo}</span>
                        {col.links.map((link, lIdx) => (
                          <Link 
                            key={lIdx} 
                            to={item.type === 'product' ? `/categoria/${item.id}/${link.id}` : `/colecao/${link.id}`}
                            onClick={() => setIsMobileOpen(false)}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
            <li className="sidebar-item all-products-link">
               <Link to="/categoria/todos" onClick={() => setIsMobileOpen(false)}>VER TODAS AS JOIAS</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;