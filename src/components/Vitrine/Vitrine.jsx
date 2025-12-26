import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { productsData } from '../../data/productsData';
import './Vitrine.css';

// Ícone simples para o lugar da imagem
const ImagePlaceholder = () => (
  <div className="img-placeholder">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
    <span>M MORS</span>
  </div>
);

const Vitrine = () => {
  const { category, subcategory } = useParams();

  // Filtros selecionados
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedStones, setSelectedStones] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);

  // Se o usuário navegar para uma nova categoria/sub via Navbar, reseta filtros laterais
  useEffect(() => {
    setSelectedMaterials([]);
    setSelectedStones([]);
    setSelectedCollections([]);
  }, [category, subcategory]);

  const toggleFilter = (list, setList, value) => {
    setList(prev => prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]);
  };

  const filteredProducts = useMemo(() => {
    return productsData.filter(product => {
      // Filtro URL (Prioridade)
      if (category && product.categoria !== category) return false;
      if (subcategory && product.tipo !== subcategory) return false;

      // Filtros Laterais (Soma)
      if (selectedMaterials.length > 0 && !selectedMaterials.some(m => product.material.includes(m))) return false;
      if (selectedStones.length > 0 && (!product.pedra.temPedra || !selectedStones.includes(product.pedra.tipo))) return false;
      if (selectedCollections.length > 0 && !selectedCollections.includes(product.colecao)) return false;

      return true;
    });
  }, [category, subcategory, selectedMaterials, selectedStones, selectedCollections]);

  return (
    <div className="vitrine-page">
      <div className="vitrine-container">
        {/* BARRA LATERAL */}
        <aside className="vitrine-sidebar">
          <div className="sidebar-header">
            <h3>FILTROS</h3>
            <button className="btn-clear" onClick={() => {
              setSelectedMaterials([]); setSelectedStones([]); setSelectedCollections([]);
            }}>LIMPAR</button>
          </div>

          <div className="filter-group">
            <h4>MATERIAL</h4>
            {["Ouro Amarelo", "Ouro Branco", "Ouro Rosé", "Platina"].map(m => (
              <label key={m} className="filter-label">
                <input type="checkbox" checked={selectedMaterials.includes(m)} onChange={() => toggleFilter(selectedMaterials, setSelectedMaterials, m)} />
                <span className="checkbox-custom"></span> {m}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>PEDRA PRECIOSA</h4>
            {["Diamante", "Turmalina Paraíba", "Esmeralda", "Safira", "Rubi"].map(p => (
              <label key={p} className="filter-label">
                <input type="checkbox" checked={selectedStones.includes(p)} onChange={() => toggleFilter(selectedStones, setSelectedStones, p)} />
                <span className="checkbox-custom"></span> {p}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>COLEÇÃO</h4>
            {["M MORS Icon", "Essence", "Patrimony", "Bridal"].map(c => (
              <label key={c} className="filter-label">
                <input type="checkbox" checked={selectedCollections.includes(c)} onChange={() => toggleFilter(selectedCollections, setSelectedCollections, c)} />
                <span className="checkbox-custom"></span> {c}
              </label>
            ))}
          </div>
        </aside>

        {/* VITRINE */}
        <main className="vitrine-content">
          <header className="vitrine-info">
            <span className="breadcrumb">HOME / {category?.toUpperCase() || "JOIAS"}</span>
            <div className="title-row">
              <h1>{subcategory?.replace('-', ' ') || category || "Todas as Joias"}</h1>
              <p>{filteredProducts.length} itens</p>
            </div>
          </header>

          <div className="product-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image-box">
                  <ImagePlaceholder />
                  {product.colecao && <div className="badge-colecao">{product.colecao}</div>}
                  <button className="view-btn">VER DETALHES</button>
                </div>
                <div className="product-meta">
                  <h3>{product.nome}</h3>
                  <p className="material-text">{product.material}</p>
                  
                  {product.pedra.temPedra && (
                    <div className="gia-specs">
                      <span>{product.pedra.quilates}CT</span>
                      <span>{product.pedra.cor}</span>
                      <span>{product.pedra.clareza}</span>
                    </div>
                  )}
                  
                  <p className="product-price">
                    {product.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Vitrine;