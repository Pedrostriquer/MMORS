import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase/config';
import { 
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './ProductManager.css';

const ProductManager = () => {
  // Controle de Visualização
  const [view, setView] = useState('list'); // 'list' ou 'form'
  const [editingId, setEditingId] = useState(null);

  // Dados do Banco
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [availableChars, setAvailableChars] = useState([]);
  const [allAttributes, setAllAttributes] = useState([]);

  // Estado do Formulário
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    categoriaId: '',
    colecaoId: '',
    descricao: '',
    caracteristicas: {}
  });

  const [mediaItems, setMediaItems] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const prodSnap = await getDocs(query(collection(db, "products"), orderBy("criadoEm", "desc")));
    setProducts(prodSnap.docs.map(d => ({ id: d.id, ...d.data() })));

    const catSnap = await getDocs(collection(db, "categories"));
    setCategories(catSnap.docs.map(d => ({ id: d.id, ...d.data() })));

    const colSnap = await getDocs(collection(db, "collections"));
    setCollections(colSnap.docs.map(d => ({ id: d.id, ...d.data() })));

    const attrSnap = await getDocs(collection(db, "attributes"));
    setAllAttributes(attrSnap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const handleCategoryChange = async (catId, isEditing = false) => {
    setFormData(prev => ({ ...prev, categoriaId: catId }));
    if (!catId) return;

    const q = query(collection(db, "characteristics"), where("categoriesIds", "array-contains", catId));
    const charSnap = await getDocs(q);
    setAvailableChars(charSnap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  // --- LÓGICA DE EDIÇÃO E LISTA ---
  const startNewProduct = () => {
    setEditingId(null);
    setFormData({ nome: '', preco: '', categoriaId: '', colecaoId: '', descricao: '', caracteristicas: {} });
    setMediaItems([]);
    setAvailableChars([]);
    setView('form');
  };

  const handleEdit = async (product) => {
    setEditingId(product.id);
    setFormData({
      nome: product.nome,
      preco: product.preco,
      categoriaId: product.categoriaId,
      colecaoId: product.colecaoId || '',
      descricao: product.descricao || '',
      caracteristicas: product.caracteristicas || {}
    });
    // Prepara as mídias já existentes para o preview
    setMediaItems(product.media.map(m => ({ ...m, isExisting: true })));
    
    // Busca as características da categoria do produto editado
    await handleCategoryChange(product.categoriaId);
    setView('form');
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja apagar este produto permanentemente?")) {
      await deleteDoc(doc(db, "products", id));
      fetchData();
    }
  };

  // --- MÍDIA ---
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

  // --- SUBMISSÃO ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Faz upload apenas dos novos arquivos
      const finalMedia = await Promise.all(
        mediaItems.map(async (item, index) => {
          if (item.isExisting) return { ...item, ordem: index };

          const fileRef = ref(storage, `products/${Date.now()}-${item.file.name}`);
          await uploadBytes(fileRef, item.file);
          const url = await getDownloadURL(fileRef);
          return { url, tipo: item.tipo, ordem: index };
        })
      );

      const productData = {
        ...formData,
        preco: Number(formData.preco),
        media: finalMedia,
        criadoEm: editingId ? products.find(p => p.id === editingId).criadoEm : new Date(),
        atualizadoEm: new Date()
      };

      if (editingId) {
        await updateDoc(doc(db, "products", editingId), productData);
      } else {
        await addDoc(collection(db, "products"), productData);
      }

      alert(editingId ? "Joia atualizada!" : "Joia cadastrada!");
      setView('list');
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-manager">
      <header className="manager-header">
        <div className="header-info">
          <h2>Gestão de Estoque</h2>
          <p>{view === 'list' ? 'Lista de todas as joias' : editingId ? 'Editando Produto' : 'Novo Cadastro'}</p>
        </div>
        <div className="header-actions">
          <button 
            className={`tab-btn ${view === 'list' ? 'active' : ''}`} 
            onClick={() => setView('list')}
          >
            Listar Produtos
          </button>
          <button 
            className={`tab-btn ${view === 'form' ? 'active' : ''}`} 
            onClick={startNewProduct}
          >
            + Novo Produto
          </button>
        </div>
      </header>

      {view === 'list' ? (
        <section className="product-list-view">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mídia</th>
                <th>Nome</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    <img src={product.media[0]?.url} alt="" className="table-thumb" />
                  </td>
                  <td className="prod-name">{product.nome}</td>
                  <td>R$ {Number(product.preco).toLocaleString()}</td>
                  <td>{categories.find(c => c.id === product.categoriaId)?.nome || 'Sem Categoria'}</td>
                  <td className="table-actions">
                    <button onClick={() => handleEdit(product)} className="btn-edit">Editar</button>
                    <button onClick={() => handleDelete(product.id)} className="btn-delete">Apagar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <form onSubmit={handleSubmit} className="product-form animate-fade">
          <div className="form-grid">
            {/* O MESMO FORMULÁRIO DE ANTES */}
            <div className="form-column">
              <section className="form-card">
                <h3>Dados da Joia</h3>
                <div className="input-group">
                  <label>Nome</label>
                  <input type="text" value={formData.nome} required onChange={e => setFormData({...formData, nome: e.target.value})} />
                </div>
                <div className="input-row">
                  <div className="input-group">
                    <label>Preço</label>
                    <input type="number" value={formData.preco} required onChange={e => setFormData({...formData, preco: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label>Coleção</label>
                    <select value={formData.colecaoId} onChange={e => setFormData({...formData, colecaoId: e.target.value})}>
                      <option value="">Sem Coleção</option>
                      {collections.map(col => <option key={col.id} value={col.id}>{col.nome}</option>)}
                    </select>
                  </div>
                </div>
                <div className="input-group">
                  <label>Categoria</label>
                  <select value={formData.categoriaId} required onChange={e => handleCategoryChange(e.target.value)}>
                    <option value="">Selecione...</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label>Descrição</label>
                  <textarea value={formData.descricao} rows="5" onChange={e => setFormData({...formData, descricao: e.target.value})}></textarea>
                </div>
              </section>
            </div>

            <div className="form-column">
              <section className="form-card">
                <h3>Ordem de Exibição</h3>
                <div className="media-upload-area">
                  <input type="file" multiple accept="image/*,video/*" id="media-input" onChange={handleMediaSelect} />
                  <label htmlFor="media-input" className="upload-label"><span>+ Adicionar Mídia</span></label>
                </div>
                <div className="media-preview-grid">
                  {mediaItems.map((item, index) => (
                    <div key={index} className="media-item">
                      <img src={item.isExisting ? item.url : item.preview} alt="" />
                      <div className="media-controls">
                        <button type="button" onClick={() => moveMedia(index, -1)}>←</button>
                        <button type="button" className="remove" onClick={() => setMediaItems(mediaItems.filter((_, i) => i !== index))}>×</button>
                        <button type="button" onClick={() => moveMedia(index, 1)}>→</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ATRIBUTOS DINÂMICOS */}
              {availableChars.length > 0 && (
                <section className="form-card">
                  <h3>Especificações Técnicas</h3>
                  <div className="specs-grid">
                    {availableChars.map(char => (
                      <div key={char.id} className="spec-item">
                        <label>{char.nome}</label>
                        <select 
                          value={formData.caracteristicas[char.id]?.attrId || ''}
                          onChange={(e) => {
                            const attr = allAttributes.find(a => a.id === e.target.value);
                            setFormData({
                              ...formData,
                              caracteristicas: { ...formData.caracteristicas, [char.id]: { attrId: attr.id, nome: attr.nome, sub: '' } }
                            });
                          }}
                        >
                          <option value="">Selecione...</option>
                          {allAttributes.filter(a => a.characteristicId === char.id).map(attr => (
                            <option key={attr.id} value={attr.id}>{attr.nome}</option>
                          ))}
                        </select>
                        {formData.caracteristicas[char.id] && 
                         allAttributes.find(a => a.id === formData.caracteristicas[char.id].attrId)?.subAttributes?.length > 0 && (
                          <select 
                            className="sub-select"
                            value={formData.caracteristicas[char.id].sub || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              caracteristicas: { ...formData.caracteristicas, [char.id]: { ...formData.caracteristicas[char.id], sub: e.target.value } }
                            })}
                          >
                            <option value="">Detalhe...</option>
                            {allAttributes.find(a => a.id === formData.caracteristicas[char.id].attrId).subAttributes.map(s => (
                              <option key={s.id} value={s.valor}>{s.valor}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => setView('list')}>Cancelar</button>
            <button type="submit" className="submit-product-btn">
              {editingId ? "Atualizar Joia" : "Cadastrar Joia"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProductManager;