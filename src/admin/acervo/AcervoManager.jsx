import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase/config';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Plus, Trash2, Image as ImageIcon, Link as LinkIcon, Save } from 'lucide-react';
import './AcervoManager.css';

const AcervoManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Dados para os selects de link
  const [collections, setCollections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Busca configuração atual
      const docRef = doc(db, "settings", "acervo");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setItems(docSnap.data().items || []);
      }

      // Busca dados auxiliares para links
      const [colSnap, catSnap, attrSnap, prodSnap] = await Promise.all([
        getDocs(collection(db, "collections")),
        getDocs(collection(db, "categories")),
        getDocs(collection(db, "attributes")),
        getDocs(collection(db, "products"))
      ]);

      setCollections(colSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setCategories(catSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setAttributes(attrSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setProducts(prodSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    const newItem = {
      id: Date.now().toString(),
      title: '',
      category: '',
      imageUrl: '',
      linkType: 'none', // 'collection', 'product', 'vitrine'
      linkValue: '',
      filterAttributeId: '' // Usado apenas se linkType for 'vitrine'
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleChange = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleImageUpload = async (id, file) => {
    if (!file) return;
    const fileRef = ref(storage, `acervo/${Date.now()}-${file.name}`);
    try {
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      handleChange(id, 'imageUrl', url);
    } catch (err) {
      alert("Erro no upload da imagem");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "acervo"), { items });
      alert("Seção Acervo atualizada com sucesso!");
    } catch (err) {
      alert("Erro ao salvar configuração.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-admin">Carregando Arquiteto de Acervo...</div>;

  return (
    <div className="acervo-manager">
      <header className="manager-header">
        <div>
          <h2>Gestão do Acervo (Home)</h2>
          <p>Configure as 6 linhas de destaque que aparecem na página inicial.</p>
        </div>
        <button className="btn-save-lux" onClick={handleSave} disabled={saving}>
          <Save size={18} /> {saving ? "Salvando..." : "Publicar Alterações"}
        </button>
      </header>

      <div className="items-grid-admin">
        {items.map((item, index) => (
          <div key={item.id} className="acervo-card-admin">
            <div className="card-index">#{index + 1}</div>
            
            <div className="image-upload-section">
              {item.imageUrl ? (
                <div className="preview-container">
                  <img src={item.imageUrl} alt="Preview" />
                  <label className="change-img">
                    Alterar <input type="file" hidden onChange={e => handleImageUpload(item.id, e.target.files[0])} />
                  </label>
                </div>
              ) : (
                <label className="upload-placeholder">
                  <ImageIcon size={32} />
                  <span>Subir Imagem</span>
                  <input type="file" hidden onChange={e => handleImageUpload(item.id, e.target.files[0])} />
                </label>
              )}
            </div>

            <div className="card-fields">
              <input 
                type="text" 
                placeholder="Título (ex: Anéis de Diamante)" 
                value={item.title} 
                onChange={e => handleChange(item.id, 'title', e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Subtítulo (ex: Exclusividade)" 
                value={item.category} 
                onChange={e => handleChange(item.id, 'category', e.target.value)}
              />
              
              <div className="link-config">
                <div className="link-header">
                  <LinkIcon size={14} /> <span>Destino do Clique</span>
                </div>
                <select 
                  value={item.linkType} 
                  onChange={e => handleChange(item.id, 'linkType', e.target.value)}
                >
                  <option value="none">Nenhum</option>
                  <option value="collection">Coleção</option>
                  <option value="product">Produto Específico</option>
                  <option value="vitrine">Vitrine (Filtro)</option>
                </select>

                {item.linkType === 'collection' && (
                  <select value={item.linkValue} onChange={e => handleChange(item.id, 'linkValue', e.target.value)}>
                    <option value="">Selecionar Coleção...</option>
                    {collections.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                )}

                {item.linkType === 'product' && (
                  <select value={item.linkValue} onChange={e => handleChange(item.id, 'linkValue', e.target.value)}>
                    <option value="">Selecionar Produto...</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                  </select>
                )}

                {item.linkType === 'vitrine' && (
                  <div className="vitrine-link-group">
                    <select value={item.linkValue} onChange={e => handleChange(item.id, 'linkValue', e.target.value)}>
                      <option value="">Selecionar Categoria...</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                    </select>
                    <select 
                      value={item.filterAttributeId} 
                      onChange={e => handleChange(item.id, 'filterAttributeId', e.target.value)}
                    >
                      <option value="">Todos (Sem filtro extra)</option>
                      {attributes.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <button className="remove-card-btn" onClick={() => handleRemoveItem(item.id)}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {items.length < 6 && (
          <button className="add-card-slot" onClick={handleAddItem}>
            <Plus size={32} />
            <span>Adicionar Novo Card</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default AcervoManager;