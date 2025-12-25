import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';
// Importando a logo
import logo from '../../assets/Captura de Tela 2025-12-25 às 16.30.16 (1).png';

const Footer = () => {
  const slogans = [
    "M MORS – O luxo que permanece.",
    "Arte lapidada em valor.",
    "Beleza rara, patrimônio eterno.",
    "Elegância que atravessa gerações."
  ];

  return (
    <footer className="footer">
      <div className="container">
        
        {/* Área Superior: Logo e Slogans (O Mantra) */}
        <div className="footer-mantra">
          <motion.div 
            className="footer-logo-wrapper"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <img src={logo} alt="M MORS Logo" className="footer-logo-img" />
          </motion.div>

          <div className="slogans-container">
            {slogans.map((slogan, index) => (
              <motion.p 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="slogan-text"
              >
                {slogan}
              </motion.p>
            ))}
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-grid">
          {/* Coluna 1: Manifesto Curto */}
          <div className="footer-col brand-info">
            <h4>A Grife</h4>
            <p>Especialistas em alta joalheria, transformando raridade em patrimônio eterno para gerações de prestígio.</p>
            <div className="social-links">
              <a href="#" aria-label="Instagram"><Instagram size={22} strokeWidth={1} /></a>
              <a href="#" aria-label="E-mail"><Mail size={22} strokeWidth={1} /></a>
            </div>
          </div>

          {/* Coluna 2: Navegação */}
          <div className="footer-col">
            <h4>Explorar</h4>
            <ul>
              <li><a href="#about">A Marca</a></li>
              <li><a href="#products">Coleções</a></li>
              <li><a href="#bespoke">Design Sob Medida</a></li>
              <li><a href="#certification">Certificações</a></li>
            </ul>
          </div>

          {/* Coluna 3: Contato Direct */}
          <div className="footer-col">
            <h4>Privé</h4>
            <ul className="contact-list">
              <li><Phone size={16} strokeWidth={1} /> +55 (XX) XXXXX-XXXX</li>
              <li><MapPin size={16} strokeWidth={1} /> Atendimento Exclusivo</li>
              <li><Mail size={16} strokeWidth={1} /> concierge@mmors.com.br</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} M MORS. Todos os direitos reservados.</p>
          <p className="partnership">Integrante do Ecossistema <strong>Golden Brasil</strong></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;