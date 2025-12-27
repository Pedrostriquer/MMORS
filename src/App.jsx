import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext'; // Importação do contexto da sacola
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
import ProductPage from './components/ProductPage/ProductPage'; // Página de detalhes
import CartPage from './components/CartPage/CartPage'; // Página da sacola

// --- IMPORTAÇÃO DO ADMIN (Caminhos atualizados) ---
const Login = lazy(() => import('./admin/login/Login'));
const AdminDashboard = lazy(() => import('./admin/layout/AdminLayout'));
const ProtectedRoute = lazy(() => import('./admin/auth/ProtectedRoute'));

// Auxiliar: Reseta o scroll ao mudar de página
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Gerencia a exibição da Navbar/Footer (esconde no Admin)
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
};

// Composição da Home
const HomePage = () => (
  <>
    <Hero />
    <Products /> 
    <About />
    <Essence />
    <Certification />
    <Patrimony />
    <Bespoke />
    <PatrimonialLevel />
  </>
);

function App() {
  return (
    // O CartProvider deve envolver toda a estrutura para o useCart funcionar
    <CartProvider>
      <Router>
        <ScrollToTop />
        
        <main className="app-container">
          <LayoutWrapper>
            <Suspense fallback={<Loader />}>
              <Routes>
                {/* --- ROTAS PÚBLICAS --- */}
                <Route path="/" element={<HomePage />} />
                <Route path="/categoria/:category" element={<Vitrine />} />
                <Route path="/categoria/:category/:subcategory" element={<Vitrine />} />
                <Route path="/colecao/:collectionId" element={<CollectionPage />} />
                <Route path="/produto/:productId" element={<ProductPage />} />
                <Route path="/carrinho" element={<CartPage />} />
                <Route path="/a-marca" element={<About />} />
                <Route path="/sob-medida" element={<Bespoke />} />

                {/* --- ROTAS ADMIN --- */}
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
    </CartProvider>
  );
}

export default App;