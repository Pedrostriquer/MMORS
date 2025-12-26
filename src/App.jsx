import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

// --- IMPORTAÇÃO DOS COMPONENTES EXISTENTES ---
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Essence from './components/Essence/Essence';
import Certification from './components/Certification/Certification';
import Patrimony from './components/Patrimony/Patrimony';
import Products from './components/Products/Products'; // Grid da Home
import Bespoke from './components/Bespoke/Bespoke';
import PatrimonialLevel from './components/PatrimonialLevel/PatrimonialLevel';
import Footer from './components/Footer/Footer';

// --- NOVO COMPONENTE DE VITRINE ---
import Vitrine from './components/Vitrine/Vitrine';

// Auxiliar: Faz a página voltar ao topo automaticamente ao mudar de rota
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Componente que agrupa as seções da tua Página Inicial original
const HomePage = () => (
  <>
    <Hero />
    <About />
    <Essence />
    <Certification />
    <Patrimony />
    <Products /> 
    <Bespoke />
    <PatrimonialLevel />
  </>
);

function App() {
  return (
    <Router>
      {/* Garante que o scroll reseta ao navegar entre categorias */}
      <ScrollToTop />
      
      <main className="app-container">
        {/* Navbar fixa em todas as páginas */}
        <Navbar />
        
        <Routes>
          {/* Rota Principal: Landing Page Completa */}
          <Route path="/" element={<HomePage />} />
          
          {/* Rotas da Vitrine: Capturam categoria e subcategoria da URL */}
          <Route path="/categoria/:category" element={<Vitrine />} />
          <Route path="/categoria/:category/:subcategory" element={<Vitrine />} />
          
          {/* Rota de Coleções (também usa a Vitrine) */}
          <Route path="/colecoes" element={<Vitrine />} />
          <Route path="/colecoes/:subcategory" element={<Vitrine />} />

          {/* Rotas Institucionais diretas (opcional) */}
          <Route path="/a-marca" element={<About />} />
          <Route path="/sob-medida" element={<Bespoke />} />
        </Routes>

        {/* Rodapé fixo em todas as páginas */}
        <Footer />
      </main>
    </Router>
  );
}

export default App;