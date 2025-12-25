import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, History, Landmark } from 'lucide-react';
import './PatrimonialLevel.css';

const PatrimonialLevel = () => {
  return (
    <section id="patrimonial" className="patrimonial-section">
      <div className="container">
        <div className="patrimonial-wrapper">
          
          <motion.div 
            className="patrimonial-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="section-label">Segurança Patrimonial</span>
            <h2>Patamar Patrimonial</h2>
            <div className="cvm-badge">Seguro para CVM</div>
          </motion.div> {/* TAG CORRIGIDA AQUI */}
          
          <motion.p 
            className="patrimonial-intro"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          >
            As peças M MORS utilizam materiais legítimos que historicamente mantêm valor, atravessam gerações e fortalecem o patrimônio familiar.
          </motion.p>

          <div className="patrimonial-features">
            <motion.div 
              className="feature-box"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <History size={28} strokeWidth={1} />
              <h4>Valor Histórico</h4>
              <p>Diamantes e pedras naturais são ativos reais que preservam o poder de compra ao longo das décadas.</p>
            </motion.div>

            <motion.div 
              className="feature-box"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              viewport={{ once: true }}
            >
              <ShieldCheck size={28} strokeWidth={1} />
              <h4>Proteção de Ativos</h4>
              <p>A união perfeita entre a beleza da alta joalheria e a proteção patrimonial em um único produto de luxo.</p>
            </motion.div>

            <motion.div 
              className="feature-box"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              viewport={{ once: true }}
            >
              <Landmark size={28} strokeWidth={1} />
              <h4>Legado Familiar</h4>
              <p>Joias concebidas para serem heranças vivas, fortalecendo o patrimônio para as próximas gerações.</p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PatrimonialLevel;