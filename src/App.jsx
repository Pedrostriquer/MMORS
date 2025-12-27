import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

// --- IMPORTAÇÃO DOS COMPONENTES PÚBLICOS ---
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Essence from './components/Essence/Essence';
import Certification from './components/Certification/Certification';
import Patrimony from './components/Patrimony/Patrimony';
import Products from './components/Products/Products'; 
import Bespoke from './components/Bespoke/Bespoke';
import PatrimonialLevel from './components/PatrimonialLevel/PatrimonialLevel';
import Footer from './components/Footer/Footer';
import Vitrine from './components/Vitrine/Vitrine';
import CollectionPage from './components/CollectionPage/CollectionPage';
import Loader from './components/Loader/Loader';

// --- IMPORTAÇÃO DO ADMIN (Caminhos atualizados) ---
const Login = lazy(() => import('./admin/login/Login'));
const AdminDashboard = lazy(() => import('./admin/layout/AdminLayout'));
const ProtectedRoute = lazy(() => import('./admin/auth/ProtectedRoute'));

// Auxiliar: Reseta o scroll
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Componente para gerenciar a exibição do Layout Público (Navbar/Footer)
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  // Se a rota começar com /admin, não mostra Navbar nem Footer
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
};

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
      <ScrollToTop />
      
      <main className="app-container">
        {/* O LayoutWrapper decide se mostra ou não Navbar/Footer */}
        <LayoutWrapper>
          <Suspense fallback={<Loader />}>
            <Routes>
              {/* --- ROTAS PÚBLICAS --- */}
              <Route path="/" element={<HomePage />} />
              <Route path="/categoria/:category" element={<Vitrine />} />
              <Route path="/categoria/:category/:subcategory" element={<Vitrine />} />
              <Route path="/colecao/:collectionId" element={<CollectionPage />} />
              <Route path="/a-marca" element={<About />} />
              <Route path="/sob-medida" element={<Bespoke />} />

              {/* --- ROTAS ADMIN (Organizadas na nova estrutura) --- */}
              <Route path="/admin/login" element={<Login />} />
              
              <Route 
                path="/admin/dashboard/*" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Suspense>
        </LayoutWrapper>
      </main>
    </Router>
  );
}

export default App;