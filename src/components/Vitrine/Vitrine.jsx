import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import './Vitrine.css';

const Vitrine = () => {
  const { category: categoryRef, subcategory: initialSubId } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState(null);
  const [products, setProducts] = useState([]);
  const [characteristics, setCharacteristics] = useState([]);
  const [attributes, setAttributes] = useState([]);
  
  // Estado dos filtros: { [charId]: { attrId: string, subValue: string } }
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    const loadVitrineData = async () => {
      setLoading(true);
      try {
        const isAllProducts = categoryRef === 'todos';
        let currentCat = null;

        // 1. Lógica de Categoria (Específica ou Geral)
        if (isAllProducts) {
          currentCat = { id: 'todos', nome: 'Todas as Joias' };
        } else {
          const catSnap = await getDocs(collection(db, "categories"));
          const allCats = catSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          
          currentCat = allCats.find(c => 
            c.id === categoryRef || 
            (c.slug && c.slug.toLowerCase() === categoryRef.toLowerCase()) ||
            c.nome.toLowerCase() === categoryRef.toLowerCase()
          );
        }

        if (!currentCat) {
          setCategoryData(null);
          setLoading(false);
          return;
        }
        setCategoryData(currentCat);

        // 2. Preparar Queries baseadas no contexto (Tudo ou Categoria)
        let charQuery;
        let prodQuery;

        if (isAllProducts) {
          // Busca todas as características e todos os produtos
          charQuery = collection(db, "characteristics");
          prodQuery = collection(db, "products");
        } else {
          // Filtra características e produtos pela categoria selecionada
          charQuery = query(
            collection(db, "characteristics"), 
            where("categoriesIds", "array-contains", currentCat.id)
          );
          prodQuery = query(
            collection(db, "products"), 
            where("categoriaId", "==", currentCat.id)
          );
        }
        
        const [charSnap, attrSnap, prodSnap] = await Promise.all([
          getDocs(charQuery),
          getDocs(collection(db, "attributes")),
          getDocs(prodQuery)
        ]);

        const chars = charSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const attrs = attrSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const prods = prodSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        
        setCharacteristics(chars);
        setAttributes(attrs);
        setProducts(prods);

        // 3. Lógica de Seleção Inicial vinda da Navbar (Filtros pré-aplicados)
        if (initialSubId) {
          const targetAttr = attrs.find(a => a.id === initialSubId);
          if (targetAttr) {
            setActiveFilters({ 
              [targetAttr.characteristicId]: { attrId: targetAttr.id, subValue: '' } 
            });
          } else {
            const parentAttr = attrs.find(a => 
              a.subAttributes?.some(s => s.id === initialSubId)
            );
            if (parentAttr) {
              const sub = parentAttr.subAttributes.find(s => s.id === initialSubId);
              setActiveFilters({ 
                [parentAttr.characteristicId]: { attrId: parentAttr.id, subValue: sub.valor } 
              });
            }
          }
        }

      } catch (err) {
        console.error("Erro ao carregar vitrine:", err);
      } finally {
        setLoading(false);
      }
    };

    loadVitrineData();
  }, [categoryRef, initialSubId]);

  // --- LÓGICA DE FILTRAGEM ---
  const filteredProducts = useMemo(() => {
    if (Object.keys(activeFilters).length === 0) return products;

    return products.filter(product => {
      return Object.entries(activeFilters).every(([charId, filter]) => {
        const productSpec = product.caracteristicas?.[charId];
        if (!productSpec) return false;

        const matchAttr = productSpec.attrId === filter.attrId;
        const matchSub = filter.subValue ? productSpec.sub === filter.subValue : true;

        return matchAttr && matchSub;
      });
    });
  }, [products, activeFilters]);

  const toggleFilter = (charId, attrId, subValue = '') => {
    setActiveFilters(prev => {
      const next = { ...prev };
      if (next[charId]?.attrId === attrId && next[charId]?.subValue === subValue) {
        delete next[charId];
      } else {
        next[charId] = { attrId, subValue };
      }
      return next;
    });
  };

  // Se não encontrar a categoria após carregar
  if (!loading && !categoryData) {
    return (
      <div className="vitrine-error">
        <div className="container">
          <h2>Categoria não encontrada</h2>
          <Link to="/">Voltar para o início</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="vitrine-page animate-fade">
      <div className="vitrine-container">
        
        {/* SIDEBAR DE FILTROS DINÂMICOS */}
        <aside className="vitrine-sidebar">
          <div className="sidebar-header">
            <h3>FILTRAR POR</h3>
            {Object.keys(activeFilters).length > 0 && (
              <button className="btn-clear" onClick={() => setActiveFilters({})}>LIMPAR</button>
            )}
          </div>

          <div className="filters-scroll-area">
            {characteristics.map(char => (
              <div key={char.id} className="filter-group">
                <h4>{char.nome.toUpperCase()}</h4>
                <div className="options-list">
                  {attributes
                    .filter(a => a.characteristicId === char.id)
                    .map(attr => (
                      <div key={attr.id} className="attr-block">
                        <label className="filter-label">
                          <input 
                            type="checkbox"
                            checked={activeFilters[char.id]?.attrId === attr.id && !activeFilters[char.id]?.subValue}
                            onChange={() => toggleFilter(char.id, attr.id)}
                          />
                          <span className="checkbox-custom"></span>
                          <span className="label-text">{attr.nome}</span>
                        </label>

                        {attr.subAttributes?.map(sub => (
                          <label key={sub.id} className="filter-label sub-item">
                            <input 
                              type="checkbox"
                              checked={activeFilters[char.id]?.attrId === attr.id && activeFilters[char.id]?.subValue === sub.valor}
                              onChange={() => toggleFilter(char.id, attr.id, sub.valor)}
                            />
                            <span className="checkbox-custom"></span>
                            <span className="label-text">{sub.valor}</span>
                          </label>
                        ))}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* CONTEÚDO DA VITRINE */}
        <main className="vitrine-content">
          <div className="vitrine-info">
            <div className="breadcrumb">HOME / {categoryData?.nome?.toUpperCase() || '...'}</div>
            <div className="title-row">
              <div className="title-with-action">
                <h1>{categoryData?.nome || 'Carregando...'}</h1>
                {categoryRef !== 'todos' && (
                    <Link to="/categoria/todos" className="view-all-btn">VER TUDO</Link>
                )}
              </div>
              <p>{loading ? '--' : filteredProducts.length} JOIAS ENCONTRADAS</p>
            </div>
          </div>

          {loading ? (
            /* Loader interno para o corpo da vitrine */
            <div className="vitrine-loading-state">
              <div className="spinner-elegant"></div>
              <p>A carregar acervo M MORS...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image-box">
                    {/* O CSS deve garantir que este box tenha altura fixa/proporcional */}
                    {product.media && product.media[0] ? (
                      <img src={product.media[0].url} alt={product.nome} loading="lazy" />
                    ) : (
                      <div className="img-placeholder">M MORS</div>
                    )}
                    <Link to={`/produto/${product.id}`} className="view-btn">
                      DETALHES
                    </Link>
                  </div>
                  <div className="product-meta">
                    <h3>{product.nome}</h3>
                    <p className="material-text">
                      {Object.values(product.caracteristicas || {})[0]?.nome} 
                      {Object.values(product.caracteristicas || {})[0]?.sub ? ` (${Object.values(product.caracteristicas || {})[0]?.sub})` : ''}
                    </p>
                    <p className="product-price">
                      {Number(product.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-products">
              <p>Nenhuma joia corresponde aos filtros selecionados.</p>
              <button onClick={() => setActiveFilters({})}>Ver toda a coleção</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Vitrine;