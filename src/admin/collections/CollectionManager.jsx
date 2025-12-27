import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase/config';
import { 
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './CollectionManager.css';

const CollectionManager = () => {
  const [view, setView] = useState('list');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Dados do Banco
  const [collectionsList, setCollectionsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Estados do Formulário
  const [newCatInput, setNewCatInput] = useState('');
  const [formData, setFormData] = useState({
    nome: '',      // Nome curto para Navbar
    titulo: '',    // Título de exibição na página
    categoriaId: '',
    descricao: '',
  });

  const [mediaItems, setMediaItems] = useState([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    // Coleções
    const qCol = query(collection(db, "collections"), orderBy("criadoEm", "desc"));
    const snapCol = await getDocs(qCol);
    setCollectionsList(snapCol.docs.map(d => ({ id: d.id, ...d.data() })));

    // Categorias de Coleções
    const snapCat = await getDocs(collection(db, "collection_categories"));
    setCategoriesList(snapCat.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const fetchRelatedProducts = async (collectionId) => {
    const q = query(collection(db, "products"), where("colecaoId", "==", collectionId));
    const snap = await getDocs(q);
    setRelatedProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  // Criar categoria rapidamente dentro do formulário
  const handleQuickAddCategory = async () => {
    if (!newCatInput) return;
    const docRef = await addDoc(collection(db, "collection_categories"), { nome: newCatInput });
    const newCat = { id: docRef.id, nome: newCatInput };
    setCategoriesList([...categoriesList, newCat]);
    setFormData({ ...formData, categoriaId: docRef.id });
    setNewCatInput('');
  };

  const handleEdit = (col) => {
    setEditingId(col.id);
    setFormData({
      nome: col.nome,
      titulo: col.titulo || '',
      categoriaId: col.categoriaId || '',
      descricao: col.descricao || '',
    });
    setMediaItems(col.media.map(m => ({ ...m, isExisting: true })));
    fetchRelatedProducts(col.id);
    setView('form');
  };

  const startNew = () => {
    setEditingId(null);
    setFormData({ nome: '', titulo: '', categoriaId: '', descricao: '' });
    setMediaItems([]);
    setRelatedProducts([]);
    setView('form');
  };

  // Mídia
  const handleMediaSelect = (e) => {
    const files = Array.from(e.target.files);
    const newItems = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      tipo: file.type.startsWith('video') ? 'video' : 'image',
      isExisting: false
    }));
    setMediaItems([...mediaItems, ...newItems]);
  };

  const moveMedia = (index, direction) => {
    const updated = [...mediaItems];
    const target = index + direction;
    if (target < 0 || target >= updated.length) return;
    [updated[index], updated[target]] = [updated[target], updated[index]];
    setMediaItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalMedia = await Promise.all(
        mediaItems.map(async (item, index) => {
          if (item.isExisting) return { ...item, ordem: index };
          const fileRef = ref(storage, `collections/${Date.now()}-${item.file.name}`);
          await uploadBytes(fileRef, item.file);
          const url = await getDownloadURL(fileRef);
          return { url, tipo: item.tipo, ordem: index };
        })
      );

      const collectionData = {
        ...formData,
        media: finalMedia,
        criadoEm: editingId ? collectionsList.find(c => c.id === editingId).criadoEm : new Date(),
        atualizadoEm: new Date()
      };

      if (editingId) {
        await updateDoc(doc(db, "collections", editingId), collectionData);
      } else {
        await addDoc(collection(db, "collections"), collectionData);
      }

      alert("Coleção salva!");
      setView('list');
      fetchInitialData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="collection-manager">
      <header className="manager-header">
        <div className="header-info">
          <h2>Coleções M MORS</h2>
          <p>{view === 'list' ? 'Listagem de Campanhas' : 'Editor de Coleção'}</p>
        </div>
        <div className="header-actions">
          <button className={`tab-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>Listar Todas</button>
          <button className="btn-new" onClick={startNew}>+ Nova Coleção</button>
        </div>
      </header>

      {view === 'list' ? (
        <div className="collection-grid">
          {collectionsList.map(col => (
            <div key={col.id} className="col-card-mini">
              <img src={col.media[0]?.url} alt="" />
              <div className="col-card-content">
                <span className="col-tag-ui">{categoriesList.find(c => c.id === col.categoriaId)?.nome || 'Campanha'}</span>
                <h4>{col.nome}</h4>
                <button onClick={() => handleEdit(col)}>Editar Coleção</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="collection-form animate-fade">
          <div className="form-layout">
            
            <div className="form-main">
              <section className="form-card">
                <h3>Identidade Visual e Textos</h3>
                
                <div className="input-row">
                  <div className="input-group">
                    <label>Nome (Navbar)</label>
                    <input type="text" value={formData.nome} required onChange={e => setFormData({...formData, nome: e.target.value})} placeholder="Ex: Essence" />
                  </div>
                  <div className="input-group">
                    <label>Título (Página)</label>
                    <input type="text" value={formData.titulo} required onChange={e => setFormData({...formData, titulo: e.target.value})} placeholder="Ex: The Essence Collection" />
                  </div>
                </div>

                <div className="input-group">
                  <label>Categoria da Coleção</label>
                  <div className="category-select-group">
                    <select 
                      value={formData.categoriaId} 
                      onChange={e => setFormData({...formData, categoriaId: e.target.value})}
                    >
                      <option value="">Selecione uma categoria...</option>
                      {categoriesList.map(cat => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
                    </select>
                    <div className="quick-add-cat">
                      <input 
                        type="text" 
                        placeholder="Nova categoria..." 
                        value={newCatInput} 
                        onChange={e => setNewCatInput(e.target.value)}
                      />
                      <button type="button" onClick={handleQuickAddCategory}>Criar</button>
                    </div>
                  </div>
                </div>

                <div className="input-group">
                  <label>Descrição / Manifesto</label>
                  <textarea rows="6" value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})}></textarea>
                </div>
              </section>

              {editingId && (
                <section className="form-card">
                  <h3>Joias Vinculadas</h3>
                  <div className="related-prods-list">
                    {relatedProducts.length > 0 ? relatedProducts.map(p => (
                      <div key={p.id} className="mini-item">
                        <img src={p.media[0]?.url} alt="" />
                        <span>{p.nome}</span>
                      </div>
                    )) : <p className="empty-txt">Vincule joias a esta coleção na página de Produtos.</p>}
                  </div>
                </section>
              )}
            </div>

            <div className="form-side">
              <section className="form-card">
                <h3>Mídia da Campanha</h3>
                <div className="upload-zone">
                  <input type="file" multiple id="media-col" onChange={handleMediaSelect} />
                  <label htmlFor="media-col">Carregar Fotos/Vídeos</label>
                </div>
                <div className="preview-list-vertical">
                  {mediaItems.map((item, index) => (
                    <div key={index} className="preview-node">
                      <img src={item.isExisting ? item.url : item.preview} alt="" />
                      <div className="node-ctrls">
                        <button type="button" onClick={() => moveMedia(index, -1)}>↑</button>
                        <button type="button" onClick={() => setMediaItems(mediaItems.filter((_, i) => i !== index))} className="del">×</button>
                        <button type="button" onClick={() => moveMedia(index, 1)}>↓</button>
                      </div>
                      <span className="order-n">{index + 1}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

          </div>

          <div className="form-footer">
            <button type="button" className="btn-back" onClick={() => setView('list')}>Voltar</button>
            <button type="submit" className="btn-save-lux" disabled={loading}>
              {loading ? "Sincronizando..." : "Salvar Coleção"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CollectionManager;