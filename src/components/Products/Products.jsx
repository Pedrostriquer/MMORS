import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import './Products.css';

const Products = () => {
  const [acervoItems, setAcervoItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcervo = async () => {
      try {
        const docRef = doc(db, "settings", "acervo");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setAcervoItems(docSnap.data().items || []);
        }
      } catch (error) {
        console.error("Erro ao carregar o acervo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAcervo();
  }, []);

  // Função auxiliar para gerar a URL correta baseada na configuração do Admin
  const getDestinationLink = (item) => {
    switch (item.linkType) {
      case 'collection':
        return `/colecao/${item.linkValue}`;
      case 'product':
        return `/produto/${item.linkValue}`;
      case 'vitrine':
        // Se houver um filtro de atributo (ex: Ouro 18k), manda para a subcategoria
        if (item.filterAttributeId) {
          return `/categoria/${item.linkValue}/${item.filterAttributeId}`;
        }
        return `/categoria/${item.linkValue}`;
      default:
        return '#';
    }
  };

  if (loading) return null; // Ou um pequeno loader elegante

  return (
    <section className="products-section">
      <div className="products-header">
        <h2>ACERVO M MORS</h2>
        <p>A curadoria definitiva da alta joalharia</p>
      </div>

      <div className="products-grid">
        {acervoItems.map((item) => (
          <Link 
            key={item.id} 
            to={getDestinationLink(item)} 
            className="product-card"
          >
            <div className="product-image-placeholder">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title} className="acervo-img" />
              ) : (
                <div className="img-fallback">M MORS</div>
              )}
              
              <div className="image-overlay">
                <span className="category-tag">{item.category}</span>
                <h3>{item.title}</h3>
                <span className="view-more">DESCOBRIR</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Products;