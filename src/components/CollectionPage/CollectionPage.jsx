import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase/config';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import './CollectionPage.css';

const CollectionPage = () => {
  const { collectionId } = useParams();
  const [collectionData, setCollectionData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollectionAndProducts = async () => {
      setLoading(true);
      try {
        const colRef = doc(db, "collections", collectionId);
        const colSnap = await getDoc(colRef);

        if (colSnap.exists()) {
          const data = colSnap.data();
          setCollectionData({ id: colSnap.id, ...data });

          const q = query(
            collection(db, "products"), 
            where("colecaoId", "==", collectionId)
          );
          const prodSnap = await getDocs(q);
          const prodList = prodSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          setProducts(prodList);
        }
      } catch (error) {
        console.error("Erro ao carregar dados da coleção:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionAndProducts();
  }, [collectionId]);

  // Se o carregamento terminou e não há dados, mostra erro
  if (!loading && !collectionData) {
    return <div className="collection-not-found">Coleção não encontrada.</div>;
  }

  const heroImage = collectionData?.media?.[0]?.url || null;

  return (
    <div className="collection-page animate-fade">
      <header className="collection-header">
        <div className="collection-hero-container">
          <div className="collection-image-side">
            {loading ? (
              <div className="collection-img-placeholder skeleton-pulse">M MORS</div>
            ) : heroImage ? (
              <img src={heroImage} alt={collectionData.titulo} className="hero-main-img" />
            ) : (
              <div className="collection-img-placeholder">M MORS</div>
            )}
          </div>
          
          <div className="collection-text-side">
            <span className="collection-label">COLEÇÃO EXCLUSIVA</span>
            <h1 className={loading ? "skeleton-text" : ""}>
              {loading ? "CARREGANDO..." : collectionData.titulo}
            </h1>
            <div className="divider"></div>
            <div className="collection-story">
              {loading ? (
                <>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line" style={{ width: '80%' }}></div>
                  <div className="skeleton-line" style={{ width: '60%' }}></div>
                </>
              ) : (
                collectionData.descricao
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="collection-grid-section">
        <div className="section-title">
          <h2>Peças da Coleção</h2>
          <span>{loading ? "--" : products.length} itens encontrados</span>
        </div>

        {loading ? (
          <div className="vitrine-loading-state">
            <div className="spinner-elegant"></div>
            <p>A curar peças da coleção...</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image-box">
                  {product.media && product.media[0] ? (
                    <img src={product.media[0].url} alt={product.nome} />
                  ) : (
                    <div className="img-placeholder-small">M MORS</div>
                  )}
                  <button className="view-btn">DETALHES</button>
                </div>
                <div className="product-meta">
                  <h3>{product.nome}</h3>
                  <p className="material-text">
                    {Object.values(product.caracteristicas || {})[0]?.nome || "Alta Joalheria"}
                  </p>
                  <p className="product-price">
                    {Number(product.preco).toLocaleString('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CollectionPage;