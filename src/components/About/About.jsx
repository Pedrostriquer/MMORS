import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="container about-container">
        <motion.div 
          className="about-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <span className="section-subtitle">A Grife</span>
          <h2>Sobre a M MORS</h2>
        </motion.div>

        <div className="about-content-grid">
          <motion.div 
            className="about-text-main"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="lead-text">
              A M MORS nasce como uma grife de luxo dedicada a criar joias exclusivas que combinam <strong>arte, raridade e patrimônio</strong>.
            </p>
            <p>
              Somos especialistas em peças feitas com diamantes de certificação internacional e pedras preciosas naturais, todas selecionadas com rigor absoluto.
            </p>
            <p>
              Cada joia é criada para pessoas que desejam expressar poder, estilo e sofisticação — e que entendem que elegância verdadeira também fortalece seu patrimônio.
            </p>
          </motion.div>

          <motion.div 
            className="about-partnership"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="golden-brasil-card">
              <span className="card-label">Ecossistema</span>
              <h3>Golden Brasil</h3>
              <p>
                A M MORS traz ao universo da alta joalheria a mesma credibilidade, seriedade e expertise do mercado de minérios e pedras preciosas.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;