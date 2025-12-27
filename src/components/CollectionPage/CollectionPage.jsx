import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase/config'; //
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'; //
import Loader from '../Loader/Loader';
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
        // 1. Buscar os dados da coleção específica pelo ID vindo da URL
        const colRef = doc(db, "collections", collectionId);
        const colSnap = await getDoc(colRef);

        if (colSnap.exists()) {
          const data = colSnap.data();
          setCollectionData({ id: colSnap.id, ...data });

          // 2. Buscar todos os produtos que pertencem a esta coleção
          // No seu ProductManager, você usa o campo 'colecaoId'
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

  if (loading) return <Loader />;

  if (!collectionData) {
    return <div className="collection-not-found">Coleção não encontrada.</div>;
  }

  // Pega a primeira imagem da mídia da coleção para o Hero
  const heroImage = collectionData.media && collectionData.media.length > 0 
    ? collectionData.media[0].url 
    : null;

  return (
    <div className="collection-page animate-fade">
      {/* SEÇÃO SUPERIOR: IMAGEM E HISTÓRIA DINÂMICA */}
      <header className="collection-header">
        <div className="collection-hero-container">
          <div className="collection-image-side">
            {heroImage ? (
              <img src={heroImage} alt={collectionData.titulo} className="hero-main-img" />
            ) : (
              <div className="collection-img-placeholder">M MORS</div>
            )}
          </div>
          <div className="collection-text-side">
            <span className="collection-label">COLEÇÃO EXCLUSIVA</span>
            <h1>{collectionData.titulo}</h1> {/* Título de exibição */}
            <div className="divider"></div>
            <p className="collection-story">{collectionData.descricao}</p> {/* Manifesto */}
          </div>
        </div>
      </header>

      {/* SEÇÃO INFERIOR: GRID DE PRODUTOS VINCULADOS */}
      <main className="collection-grid-section">
        <div className="section-title">
          <h2>Peças da Coleção</h2>
          <span>{products.length} itens encontrados</span>
        </div>

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
                {/* Exemplo de como acessar uma característica (ex: Metal/Material) */}
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
      </main>
    </div>
  );
};

export default CollectionPage;