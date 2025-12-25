import React from 'react';
import { motion } from 'framer-motion';
import { Gem, ShieldCheck, Microscope, Award } from 'lucide-react';
import './Certification.css';

const Certification = () => {
  const gemList = [
    "Esmeraldas", "Rubis", "Safiras", "Turmalinas", 
    "Ametistas", "Topázios", "Pedras Raras"
  ];

  return (
    <section id="certification" className="certification-section">
      <div className="container">
        <motion.div 
          className="cert-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="section-label">Autenticidade</span>
          <h2>Certificação e Origem</h2>
        </motion.div>

        <div className="cert-grid">
          {/* Card 1: Diamantes */}
          <motion.div 
            className="cert-card"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="cert-icon-wrapper">
              <Gem size={32} strokeWidth={1} />
            </div>
            <h3>Diamantes Certificados</h3>
            <p>
              Todas as peças com diamantes contam com certificações como <strong>GIA, IGI</strong> ou equivalentes, garantindo autenticidade, pureza e origem regular.
            </p>
            <div className="cert-badge">Padrão Internacional</div>
          </motion.div>

          {/* Card 2: Pedras Naturais */}
          <motion.div 
            className="cert-card highlight-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="cert-icon-wrapper">
              <ShieldCheck size={32} strokeWidth={1} />
            </div>
            <h3>Pedras Preciosas Naturais</h3>
            <p>
              Trabalhamos apenas com gemas naturais, nunca sintéticas. Cada pedra é um fragmento único da natureza.
            </p>
            <div className="gem-tags">
              {gemList.map((gem, idx) => (
                <span key={idx} className="gem-tag">{gem}</span>
              ))}
            </div>
          </motion.div>

          {/* Card 3: Exame Individual */}
          <motion.div 
            className="cert-card"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="cert-icon-wrapper">
              <Microscope size={32} strokeWidth={1} />
            </div>
            <h3>Rigor Absoluto</h3>
            <p>
              Cada gema é examinada individualmente por especialistas para assegurar brilho, raridade e integridade mineral impecável.
            </p>
            <div className="cert-badge">Exame Individualizado</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Certification;