import React from 'react';
import { motion } from 'framer-motion';
import './Essence.css';

const Essence = () => {
  const pillars = [
    { title: "Beleza incomparável", desc: "Design autoral que transcende tendências." },
    { title: "Materiais legítimos", desc: "Gemas naturais com certificação internacional." },
    { title: "Fortalecimento patrimonial", desc: "Valor que atravessa gerações." }
  ];

  return (
    <section className="essence-section">
      <div className="container">
        {/* Faixa de Valores Centrais */}
        <motion.div 
          className="essence-values"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
        >
          <span>Exclusividade</span>
          <span className="dot">•</span>
          <span>Luxo</span>
          <span className="dot">•</span>
          <span>Raridade</span>
          <span className="dot">•</span>
          <span>Patrimônio</span>
        </motion.div>

        <div className="essence-content">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            A M MORS não entrega apenas joias. <br />
            <span>Entrega obras-primas.</span>
          </motion.h2>
          
          <motion.p 
            className="essence-description"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Unimos design autoral, pedras raras e valor duradouro em cada criação.
          </motion.p>

          {/* Pilares Fundamentais */}
          <div className="pillars-container">
            {pillars.map((pillar, index) => (
              <motion.div 
                key={index}
                className="pillar-item"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="pillar-number">0{index + 1}</div>
                <h3>{pillar.title}</h3>
                <div className="pillar-line"></div>
                <p>{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Essence;