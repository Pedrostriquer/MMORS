import React from 'react';
import { motion } from 'framer-motion';
import './Bespoke.css';
// Importando a imagem do caminho fornecido
import sketchImg from '../../assets/80534856b751e3611f7f2d95b21741d6.jpg';

const Bespoke = () => {
  return (
    <section id="bespoke" className="bespoke-section">
      <div className="bespoke-container">
        
        {/* Lado da Imagem (Vertical) */}
        <motion.div 
          className="bespoke-image"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
        >
          <img src={sketchImg} alt="Desenho autoral de joia M MORS" />
          <div className="image-caption">O Ateliê M MORS</div>
        </motion.div>

        {/* Lado do Texto */}
        <div className="bespoke-content">
          <motion.div 
            className="text-wrapper"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <span className="section-label">Exclusividade Absoluta</span>
            <h2>Design Sob Medida</h2>
            <p className="lead">Transformamos histórias em joias.</p>
            
            <div className="bespoke-description">
              <p>
                O cliente participa de cada etapa da criação: da escolha cuidadosa da pedra ao design autoral, passando pela definição da lapidação e do acabamento final.
              </p>
              <p>
                Cada peça é concebida como uma obra única e <strong>jamais será reproduzida para outro cliente</strong>. É a materialização da sua identidade em forma de arte eterna.
              </p>
            </div>

            <motion.button 
              className="btn-outline"
              whileHover={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
              transition={{ duration: 0.3 }}
            >
              AGENDAR CONSULTA NO ATELIÊ
            </motion.button>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Bespoke;