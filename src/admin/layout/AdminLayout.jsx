import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import CategoryManager from '../categories/CategoryManager';
import ProductManager from '../products/ProductManager';
import CollectionManager from '../collections/CollectionManager';
import NavbarManager from '../navbar/NavbarManager';
import AcervoManager from '../acervo/AcervoManager'; // Nova Importação
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout-container">
      <Sidebar />
      <main className="admin-main-view">
        <Routes>
          <Route path="/" element={
            <div className="welcome-card">
              <h1>Olá, Pedro.</h1>
              <p>O painel de controle da <strong>M MORS</strong> está pronto.</p>
            </div>
          } />
          
          <Route path="/categorias" element={<CategoryManager />} />
          <Route path="/produtos" element={<ProductManager />} />
          <Route path="/colecoes" element={<CollectionManager />} />
          <Route path="/navbar" element={<NavbarManager />} />
          <Route path="/acervo" element={<AcervoManager />} /> {/* Nova Rota */}
          
          <Route path="/promocoes" element={<div className="welcome-card"><h2>Promoções</h2><p>Em breve.</p></div>} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminLayout;