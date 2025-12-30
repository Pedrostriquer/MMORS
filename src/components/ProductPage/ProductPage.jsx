import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { useCart } from '../../context/CartContext';
import './ProductPage.css';

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [allCharacteristics, setAllCharacteristics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMedia, setActiveMedia] = useState(0);

  useEffect(() => {
    const fetchFullProductData = async () => {
      setLoading(true);
      try {
        // 1. Buscar Dados do Produto
        const prodSnap = await getDoc(doc(db, "products", productId));
        if (!prodSnap.exists()) {
          setLoading(false);
          return;
        }
        const pData = prodSnap.data();
        setProduct(pData);

        // 2. Buscar Categoria e todas as Características (para traduzir IDs em nomes)
        const [catSnap, charSnap] = await Promise.all([
          getDoc(doc(db, "categories", pData.categoriaId)),
          getDocs(collection(db, "characteristics"))
        ]);

        if (catSnap.exists()) setCategory(catSnap.data());
        setAllCharacteristics(charSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFullProductData();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: productId,
      nome: product.nome,
      preco: product.preco,
      media: product.media
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/carrinho');
  };

  if (loading) return null;
  if (!product) return <div className="product-error">Joia não encontrada.</div>;

  return (
    <div className="product-page-container animate-fade">
      <div className="product-layout">
        
        {/* GALERIA DE MÍDIA */}
        <div className="product-media-section">
          <div className="main-display">
            {product.media[activeMedia]?.tipo === 'video' ? (
              <video 
                src={product.media[activeMedia].url} 
                autoPlay loop muted playsInline 
                className="display-content"
              />
            ) : (
              <img 
                src={product.media[activeMedia]?.url} 
                alt={product.nome} 
                className="display-content" 
              />
            )}
          </div>
          
          <div className="thumbnails-grid">
            {product.media.map((item, idx) => (
              <div 
                key={idx} 
                className={`thumb-item ${activeMedia === idx ? 'active' : ''}`}
                onClick={() => setActiveMedia(idx)}
              >
                {item.tipo === 'video' ? (
                  <div className="video-thumb-placeholder">VÍDEO</div>
                ) : (
                  <img src={item.url} alt={`Preview ${idx}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* INFORMAÇÕES DO PRODUTO */}
        <div className="product-info-section">
          <header className="info-header">
            <span className="category-label">{category?.nome || 'Alta Joalheria'}</span>
            <h1>{product.nome}</h1>
            <p className="price-tag">
              {Number(product.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </header>

          <div className="product-description">
            <h3>DESCRIÇÃO</h3>
            <p>{product.descricao}</p>
          </div>

          {/* ESPECIFICAÇÕES TÉCNICAS DINÂMICAS */}
          <div className="technical-specs">
            <h3>ESPECIFICAÇÕES TÉCNICAS</h3>
            <div className="specs-list">
              {Object.entries(product.caracteristicas || {}).map(([charId, data]) => {
                const charName = allCharacteristics.find(c => c.id === charId)?.nome;
                return (
                  <div key={charId} className="spec-row">
                    <span className="spec-label">{charName}:</span>
                    <span className="spec-value">{data.nome} {data.sub ? `(${data.sub})` : ''}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="purchase-actions">
            <button className="btn-add-cart" onClick={handleAddToCart}>
              ADICIONAR À SACOLA
            </button>
            <button className="btn-buy-now" onClick={handleBuyNow}>
              COMPRAR AGORA
            </button>
          </div>

          <div className="shipping-info">
            <p>• Entrega segura e segurada para todo o Brasil</p>
            <p>• Certificado de autenticidade M MORS incluso</p>
            <p>• Embalagem de luxo exclusiva</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductPage;