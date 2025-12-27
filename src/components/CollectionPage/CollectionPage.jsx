import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsData } from '../../data/productsData';
import './CollectionPage.css';

// Reutilizando o placeholder de imagem que você usou na Vitrine
const ImagePlaceholder = () => (
  <div className="collection-img-placeholder">
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
    <span>M MORS</span>
  </div>
);

// Dados das histórias das coleções
const collectionsInfo = {
  "essence": {
    title: "Essence",
    dbName: "Essence",
    story: "A coleção Essence celebra a pureza das gemas em seu estado mais sublime. Cada peça é desenhada para destacar a luz natural e a cor vibrante das pedras preciosas, criando um elo entre a natureza e a sofisticação eterna."
  },
  "patrimony": {
    title: "Patrimony",
    dbName: "Patrimony",
    story: "Concebida para atravessar gerações, a Patrimony une a tradição da alta joalheria com designs que desafiam o tempo. São joias criadas para se tornarem heranças de família, carregando memórias e valores."
  },
  "bridal": {
    title: "Bridal / Noivas",
    dbName: "Bridal",
    story: "O símbolo do compromisso eterno. Nossa linha Bridal apresenta diamantes de pureza excepcional e lapidações perfeitas, pensados para os momentos mais significativos da vida a dois."
  },
  "identidade": {
    title: "M MORS Icon",
    dbName: "M MORS Icon",
    story: "A expressão máxima da nossa marca. A coleção Icon utiliza formas geométricas e o DNA da M MORS para criar peças contemporâneas que afirmam a identidade e a força de quem as usa."
  }
};

const CollectionPage = () => {
  const { collectionId } = useParams();
  const info = collectionsInfo[collectionId];

  // Filtra os produtos que pertencem a esta coleção específica
  const collectionProducts = useMemo(() => {
    if (!info) return [];
    return productsData.filter(p => p.colecao === info.dbName);
  }, [info]);

  if (!info) {
    return <div className="collection-not-found">Coleção não encontrada.</div>;
  }

  return (
    <div className="collection-page">
      {/* SEÇÃO SUPERIOR: IMAGEM E HISTÓRIA */}
      <header className="collection-header">
        <div className="collection-hero-container">
          <div className="collection-image-side">
            <ImagePlaceholder />
          </div>
          <div className="collection-text-side">
            <span className="collection-label">COLEÇÃO EXCLUSIVA</span>
            <h1>{info.title}</h1>
            <div className="divider"></div>
            <p className="collection-story">{info.story}</p>
          </div>
        </div>
      </header>

      {/* SEÇÃO INFERIOR: GRID DE PRODUTOS */}
      <main className="collection-grid-section">
        <div className="section-title">
          <h2>Peças da Coleção</h2>
          <span>{collectionProducts.length} itens encontrados</span>
        </div>

        <div className="product-grid">
          {collectionProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-box">
                <div className="img-placeholder-small">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    </svg>
                </div>
                <button className="view-btn">DETALHES</button>
              </div>
              <div className="product-meta">
                <h3>{product.nome}</h3>
                <p className="material-text">{product.material}</p>
                <p className="product-price">
                  {product.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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