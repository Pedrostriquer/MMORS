import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { Plus, Trash2, Layout, Globe, Star } from 'lucide-react'; 
import './NavbarManager.css';

const NavbarManager = () => {
  const [categories, setCategories] = useState([]);
  const [characteristics, setCharacteristics] = useState([]);
  const [allAttributes, setAllAttributes] = useState([]);
  
  // Dados de Coleções
  const [collectionCats, setCollectionCats] = useState([]);
  const [collections, setCollections] = useState([]);

  const [navbarConfig, setNavbarConfig] = useState({ items: [] });
  const [activeCatId, setActiveCatId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const cats = await getDocs(collection(db, "categories"));
      const chars = await getDocs(collection(db, "characteristics"));
      const attrs = await getDocs(collection(db, "attributes"));
      const colCats = await getDocs(collection(db, "collection_categories"));
      const cols = await getDocs(collection(db, "collections"));
      
      setCategories(cats.docs.map(d => ({ id: d.id, ...d.data() })));
      setCharacteristics(chars.docs.map(d => ({ id: d.id, ...d.data() })));
      setAllAttributes(attrs.docs.map(d => ({ id: d.id, ...d.data() })));
      setCollectionCats(colCats.docs.map(d => ({ id: d.id, ...d.data() })));
      setCollections(cols.docs.map(d => ({ id: d.id, ...d.data() })));

      const configDoc = await getDoc(doc(db, "settings", "navbar"));
      if (configDoc.exists()) setNavbarConfig(configDoc.data());
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  const saveConfig = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, "settings", "navbar"), navbarConfig);
      alert("Navbar M MORS atualizada com sucesso!");
    } catch (error) {
      alert("Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  // Funções de Adição (Produtos e Coleções)
  const addItemToNav = (id, nome, type) => {
    if (navbarConfig.items.find(i => i.id === id)) return;
    setNavbarConfig({
      ...navbarConfig,
      items: [...navbarConfig.items, { id, nome, type, columns: [] }]
    });
    setActiveCatId(id);
  };

  const addColumn = (sourceId, titulo) => {
    const updatedItems = navbarConfig.items.map(item => {
      if (item.id === activeCatId) {
        return { ...item, columns: [...item.columns, { sourceId, titulo, links: [] }] };
      }
      return item;
    });
    setNavbarConfig({ ...navbarConfig, items: updatedItems });
  };

  const addLinkToColumn = (colIdx, label, id) => {
    const updatedItems = navbarConfig.items.map(item => {
      if (item.id === activeCatId) {
        const newCols = [...item.columns];
        newCols[colIdx].links.push({ label, id });
        return { ...item, columns: newCols };
      }
      return item;
    });
    setNavbarConfig({ ...navbarConfig, items: updatedItems });
  };

  const activeItem = navbarConfig.items.find(i => i.id === activeCatId);

  return (
    <div className="navbar-manager">
      <header className="manager-header">
        <div className="header-title">
          <Globe size={20} />
          <h2>Arquiteto de Navegação</h2>
        </div>
        <button className="btn-save-lux" onClick={saveConfig} disabled={loading}>
          {loading ? "Sincronizando..." : "Publicar no Site"}
        </button>
      </header>

      {/* --- MOCKUP DA NAVBAR --- */}
      <section className="nav-bar-editor">
        <h3>Menu Superior</h3>
        <div className="nav-bar-mockup">
          {navbarConfig.items.map(item => (
            <div 
              key={item.id} 
              className={`nav-item-btn ${activeCatId === item.id ? 'active' : ''}`}
              onClick={() => setActiveCatId(item.id)}
            >
              {item.nome}
              <button className="remove-item" onClick={(e) => {
                e.stopPropagation();
                setNavbarConfig({ ...navbarConfig, items: navbarConfig.items.filter(i => i.id !== item.id) });
              }}><Trash2 size={12} /></button>
            </div>
          ))}
          
          <div className="add-menu-dropdown">
             <Plus size={18} />
             <div className="dropdown-content">
                <span className="drop-label">Categorias</span>
                {categories.map(c => (
                  <button key={c.id} onClick={() => addItemToNav(c.id, c.nome, 'product')}>{c.nome}</button>
                ))}
                <div className="divider"></div>
                <span className="drop-label">Especiais</span>
                <button onClick={() => addItemToNav('collections_main', 'Coleções', 'collection')}>Menu Coleções</button>
             </div>
          </div>
        </div>
      </section>

      {/* --- BUILDER DO MEGA MENU --- */}
      {activeItem ? (
        <section className="mega-menu-builder animate-fade">
          <div className="builder-header">
             <div className="badge-type">{activeItem.type === 'product' ? 'Produtos' : 'Campanhas'}</div>
             <h3>Editando: <strong>{activeItem.nome}</strong></h3>
          </div>

          <div className="mega-menu-grid">
            {activeItem.columns.map((col, colIdx) => (
              <div key={colIdx} className="mega-column-editor">
                <div className="column-head">
                  <input 
                    value={col.titulo} 
                    onChange={(e) => {
                      const newItems = [...navbarConfig.items];
                      const itemIdx = newItems.findIndex(i => i.id === activeCatId);
                      newItems[itemIdx].columns[colIdx].titulo = e.target.value;
                      setNavbarConfig({ ...navbarConfig, items: newItems });
                    }}
                  />
                  <button type="button" onClick={() => {
                     const newItems = [...navbarConfig.items];
                     const itemIdx = newItems.findIndex(i => i.id === activeCatId);
                     newItems[itemIdx].columns.splice(colIdx, 1);
                     setNavbarConfig({ ...navbarConfig, items: newItems });
                  }}><Trash2 size={14} /></button>
                </div>

                <div className="column-links">
                  {col.links.map((link, lIdx) => (
                    <div key={lIdx} className="link-pill">
                      {link.label}
                      <button onClick={() => {
                        const newItems = [...navbarConfig.items];
                        const itemIdx = newItems.findIndex(i => i.id === activeCatId);
                        newItems[itemIdx].columns[colIdx].links.splice(lIdx, 1);
                        setNavbarConfig({ ...navbarConfig, items: newItems });
                      }}>×</button>
                    </div>
                  ))}
                </div>

                {/* PICKER DINÂMICO (PRODUTOS OU COLEÇÕES) */}
                <div className="add-link-section">
                   <span>+ Adicionar Link</span>
                   <div className="attribute-picker">
                      {activeItem.type === 'product' ? (
                        allAttributes.filter(a => a.characteristicId === col.sourceId).map(attr => (
                          <div key={attr.id} className="picker-group">
                            <button onClick={() => addLinkToColumn(colIdx, attr.nome, attr.id)}>• {attr.nome}</button>
                            {attr.subAttributes?.map(sub => (
                              <button key={sub.id} className="sub" onClick={() => addLinkToColumn(colIdx, sub.valor, sub.id)}>{sub.valor}</button>
                            ))}
                          </div>
                        ))
                      ) : (
                        collections.filter(c => c.categoriaId === col.sourceId).map(c => (
                          <button key={c.id} className="col-link-btn" onClick={() => addLinkToColumn(colIdx, c.nome, c.id)}>
                            <Star size={10} /> {c.nome}
                          </button>
                        ))
                      )}
                   </div>
                </div>
              </div>
            ))}

            <div className="add-column-slot">
              <Plus size={24} />
              <span>Nova Coluna</span>
              <div className="char-select-overlay">
                 {activeItem.type === 'product' ? (
                   characteristics.filter(c => c.categoriesIds.includes(activeCatId)).map(char => (
                     <button key={char.id} onClick={() => addColumn(char.id, char.nome)}>{char.nome}</button>
                   ))
                 ) : (
                   collectionCats.map(cc => (
                     <button key={cc.id} onClick={() => addColumn(cc.id, cc.nome)}>{cc.nome}</button>
                   ))
                 )}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="empty-state">
          <Layout size={40} />
          <p>Selecione um item do menu acima para editar o seu Mega Menu.</p>
        </div>
      )}
    </div>
  );
};

export default NavbarManager;