import React from 'react';
import { motion } from 'framer-motion';
import { PenTool, CheckCircle2, TrendingUp, Fingerprint } from 'lucide-react';
import './Patrimony.css';

const Patrimony = () => {
  const reasons = [
    {
      icon: <PenTool size={24} strokeWidth={1.5} />,
      title: "Design Sob Medida",
      text: "Joias exclusivas, desenhadas para contar a sua história única."
    },
    {
      icon: <CheckCircle2 size={24} strokeWidth={1.5} />,
      title: "Rigor Técnico",
      text: "Diamantes certificados e pedras naturais rigorosamente selecionadas."
    },
    {
      icon: <TrendingUp size={24} strokeWidth={1.5} />,
      title: "Patrimônio Familiar",
      text: "O luxo que não apenas embeleza, mas fortalece o legado da família."
    },
    {
      icon: <Fingerprint size={24} strokeWidth={1.5} />,
      title: "DNA Golden Brasil",
      text: "Expertise de mercado aplicada ao mais alto padrão da joalheria."
    }
  ];

  return (
    <section id="why-mors" className="why-section">
      <div className="container">
        <div className="why-grid">
          <motion.div 
            className="why-text-side"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <span className="section-label">Diferenciais</span>
            <h2>Por que escolher a <br /> M MORS?</h2>
            <p>
              Unimos a sofisticação da alta joalheria com a segurança de um patrimônio sólido e eterno.
            </p>
          </motion.div>

          <div className="reasons-list">
            {reasons.map((item, index) => (
              <motion.div 
                key={index}
                className="reason-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="reason-icon">{item.icon}</div>
                <div className="reason-content">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Patrimony;