import React from 'react';
import { motion } from 'framer-motion';
import './Products.css';

const Products = () => {
  const productLines = [
    { title: "Anéis de Diamantes", category: "Exclusividade" },
    { title: "Pedras Preciosas", category: "Naturais" },
    { title: "Joalheria Premium", category: "Brincos, Colares e Pulseiras" },
    { title: "Alianças Especiais", category: "Momentos" },
    { title: "Peças Sob Encomenda", category: "Design Autoral" },
    { title: "Coleções Limitadas", category: "Peças Raras" }
  ];

  return (
    <section id="products" className="products-section">
      <div className="container">
        <motion.div 
          className="products-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="section-label">O Acervo</span>
          <h2>Linhas de Produtos</h2>
          <p>Explore a maestria artesanal em cada detalhe de nossas coleções.</p>
        </motion.div>

        <div className="products-grid">
          {productLines.map((item, index) => (
            <motion.div 
              key={index}
              className="product-card"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="product-image-placeholder">
                {/* Futuramente aqui entrará a tag <img src="..." /> */}
                <div className="image-overlay">
                  <span className="category-tag">{item.category}</span>
                  <h3>{item.title}</h3>
                  <div className="view-more">Ver Detalhes</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;