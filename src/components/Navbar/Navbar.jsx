import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase/config'; //
import { doc, getDoc } from 'firebase/firestore'; //
import { ShoppingBag, User } from 'lucide-react'; 
import { useCart } from '../../context/CartContext'; // Assumindo a criação do Contexto
import './Navbar.css';
import logo from '../../assets/Captura de Tela 2025-12-25 às 16.30.16 (1).png'; //

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [navbarConfig, setNavbarConfig] = useState({ items: [] });
  const { cart } = useCart();

  // Calcula o total de itens na sacola para o badge
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Busca a configuração da Navbar no Firebase (Arquiteto de Navegação)
  useEffect(() => {
    const fetchNavbar = async () => {
      try {
        const configDoc = await getDoc(doc(db, "settings", "navbar")); //
        if (configDoc.exists()) {
          setNavbarConfig(configDoc.data());
        }
      } catch (error) {
        console.error("Erro ao carregar configuração da navbar:", error);
      }
    };
    fetchNavbar();
  }, []);

  // Renderizador do Mega Menu Dinâmico
  const renderDynamicMegaMenu = (item) => {
    if (!item.columns || item.columns.length === 0) return null;

    return (
      <div className="mega-content">
        {item.columns.map((col, idx) => (
          <div key={idx} className="mega-col">
            <h4>{col.titulo.toUpperCase()}</h4>
            {col.links.map((link, lIdx) => {
              // URL baseada no tipo (Produto ou Coleção) configurado no Admin
              const url = item.type === 'product' 
                ? `/categoria/${item.id}/${link.id}` 
                : `/colecao/${link.id}`;
                
              return (
                <Link 
                  key={lIdx} 
                  to={url} 
                  onClick={() => setActiveMenu(null)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <nav className="navbar" onMouseLeave={() => setActiveMenu(null)}>
      <div className="nav-main-row">
        <div className="nav-container">
          {/* Lado Esquerdo: Textos removidos conforme solicitado */}
          <div className="nav-links">
            {/* Espaço reservado para manter o alinhamento central da logo */}
          </div>

          <div className="nav-logo">
            <Link to="/"><img src={logo} alt="M MORS" className="logo-img" /></Link>
          </div>

          {/* Lado Direito: Ícones de Login e Carrinho no lugar de "CONTATO / MINHA CONTA" */}
          <div className="nav-links icons-nav">
            {/* <Link to="/admin/login" className="nav-icon-link" title="Minha Conta">
              <User size={20} />
            </Link> */}
            <Link to="/carrinho" className="nav-icon-link cart-link" title="Sua Sacola">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </div>

      <div className="nav-products-row">
        <ul className="products-menu">
          {navbarConfig.items.map((item) => (
            <li 
              key={item.id} 
              onMouseEnter={() => setActiveMenu(item.id)}
            >
              <Link 
                to={item.type === 'product' ? `/categoria/${item.id}` : '#'} 
                className={`nav-item-link ${activeMenu === item.id ? 'active' : ''}`}
              >
                {item.nome.toUpperCase()}
              </Link>
              
              {activeMenu === item.id && item.columns && item.columns.length > 0 && (
                <div className="mega-menu-wrapper">
                  <div className="mega-menu">
                    {renderDynamicMegaMenu(item)}
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