import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { 
  collection, addDoc, getDocs, updateDoc, doc, arrayUnion, arrayRemove 
} from 'firebase/firestore';
import './CategoryManager.css';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [characteristics, setCharacteristics] = useState([]);
  const [attributes, setAttributes] = useState([]);

  const [selectedChar, setSelectedChar] = useState(null);

  const [newCat, setNewCat] = useState('');
  const [newChar, setNewChar] = useState('');
  const [newAttr, setNewAttr] = useState('');
  
  // SOLUÇÃO DO ERRO: Agora é um objeto para separar os inputs
  const [newSubAttr, setNewSubAttr] = useState({});

  useEffect(() => {
    fetchCategories();
    fetchCharacteristics();
  }, []);

  const fetchCategories = async () => {
    const snap = await getDocs(collection(db, "categories"));
    setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const fetchCharacteristics = async () => {
    const snap = await getDocs(collection(db, "characteristics"));
    setCharacteristics(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const fetchAttributes = async (charId) => {
    const snap = await getDocs(collection(db, "attributes"));
    const allAttrs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    setAttributes(allAttrs.filter(a => a.characteristicId === charId));
  };

  const toggleCategoryInChar = async (char, catId) => {
    const charRef = doc(db, "characteristics", char.id);
    const hasCategory = char.categoriesIds?.includes(catId);
    if (hasCategory) {
      await updateDoc(charRef, { categoriesIds: arrayRemove(catId) });
    } else {
      await updateDoc(charRef, { categoriesIds: arrayUnion(catId) });
    }
    fetchCharacteristics();
  };

  const handleSelectChar = (char) => {
    if (selectedChar?.id === char.id) {
      setSelectedChar(null);
      setAttributes([]);
    } else {
      setSelectedChar(char);
      fetchAttributes(char.id);
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCat) return;
    await addDoc(collection(db, "categories"), { nome: newCat });
    setNewCat('');
    fetchCategories();
  };

  const addCharacteristic = async (e) => {
    e.preventDefault();
    if (!newChar) return;
    await addDoc(collection(db, "characteristics"), { nome: newChar, categoriesIds: [] });
    setNewChar('');
    fetchCharacteristics();
  };

  const addAttribute = async (e) => {
    e.preventDefault();
    if (!newAttr || !selectedChar) return;
    await addDoc(collection(db, "attributes"), {
      characteristicId: selectedChar.id,
      nome: newAttr,
      subAttributes: []
    });
    setNewAttr('');
    fetchAttributes(selectedChar.id);
  };

  const addSubAttribute = async (attrId) => {
    const valor = newSubAttr[attrId]; // Pega o valor específico deste atributo
    if (!valor) return;

    await updateDoc(doc(db, "attributes", attrId), {
      subAttributes: arrayUnion({ id: Date.now().toString(), valor: valor })
    });
    
    // Limpa apenas o input deste atributo
    setNewSubAttr({ ...newSubAttr, [attrId]: '' });
    fetchAttributes(selectedChar.id);
  };

  return (
    <div className="manager-container">
      <section className="manager-column">
        <div className="column-header">
          <h3>Categorias de Produtos</h3>
          <p>Base do site</p>
        </div>
        <form onSubmit={addCategory} className="mini-form">
          <input value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="Nova Categoria..." />
          <button type="submit">+</button>
        </form>
        <div className="list">
          {categories.map(cat => (
            <div key={cat.id} className="list-item-static">{cat.nome}</div>
          ))}
        </div>
      </section>

      <section className="manager-column wide">
        <div className="column-header">
          <h3>Estrutura de Filtros</h3>
          <p>Características e Atributos</p>
        </div>
        <form onSubmit={addCharacteristic} className="mini-form">
          <input value={newChar} onChange={e => setNewChar(e.target.value)} placeholder="Ex: Material..." />
          <button type="submit">+</button>
        </form>
        
        <div className="char-tree">
          {characteristics.map(char => (
            <div key={char.id} className={`tree-node ${selectedChar?.id === char.id ? 'expanded' : ''}`}>
              <div className="node-main" onClick={() => handleSelectChar(char)}>
                <span className="arrow">{selectedChar?.id === char.id ? '▼' : '▶'}</span>
                <strong>{char.nome}</strong>
              </div>
              
              {selectedChar?.id === char.id && (
                <div className="node-content animate-slide">
                  <div className="relation-box">
                    <span>Vincular Categorias:</span>
                    <div className="chips">
                      {categories.map(cat => (
                        <label key={cat.id} className="chip">
                          <input 
                            type="checkbox" 
                            checked={char.categoriesIds?.includes(cat.id)} 
                            onChange={() => toggleCategoryInChar(char, cat.id)}
                          />
                          {cat.nome}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="attributes-branch">
                    <form onSubmit={addAttribute} className="mini-form small">
                      <input value={newAttr} onChange={e => setNewAttr(e.target.value)} placeholder="Novo Atributo (ex: Ouro)" />
                      <button type="submit">+</button>
                    </form>

                    <div className="attr-list">
                      {attributes.map(attr => (
                        <div key={attr.id} className="attr-leaf">
                          <div className="leaf-label">
                            <span className="dot">•</span> {attr.nome}
                          </div>
                          
                          <div className="sub-leaf-container">
                            <div className="tags">
                              {attr.subAttributes?.map(s => <span key={s.id} className="tag">{s.valor}</span>)}
                            </div>
                            
                            {/* INPUT COM BOTÃO DE + AGORA INDEPENDENTE */}
                            <div className="sub-add-row">
                              <input 
                                className="sub-input-tree"
                                placeholder="+ Sub-item (ex: 18k)" 
                                value={newSubAttr[attr.id] || ''}
                                onKeyDown={e => e.key === 'Enter' && addSubAttribute(attr.id)}
                                onChange={e => setNewSubAttr({ ...newSubAttr, [attr.id]: e.target.value })}
                              />
                              <button type="button" className="btn-add-sub" onClick={() => addSubAttribute(attr.id)}>+</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CategoryManager;