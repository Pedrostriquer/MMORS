import React, { useState } from 'react';
// import { AnimatePresence } from 'framer-motion'; // Desabilitado para o desenvolvimento
import './App.css';

// --- IMPORTAÇÃO DOS COMPONENTES ---
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

// import Loader from './components/Loader/Loader'; // Desabilitado para o desenvolvimento

function App() {
  // Mantenha como 'false' durante o desenvolvimento para pular a animação de entrada
  const [loading, setLoading] = useState(false);

  return (
    <main className="app-container">
      {/* CONFIGURAÇÃO DA ANIMAÇÃO DE ENTRADA (SPLASH SCREEN)
        Para habilitar, altere o estado 'loading' para true e descomente o bloco abaixo.
      */}
      {/* <AnimatePresence mode='wait'>
        {loading && <Loader key="loader" setLoading={setLoading} />}
      </AnimatePresence> 
      */}

      {!loading && (
        <>
          <Navbar />
          
          {/* Seção Principal / Slogans */}
          <Hero />
          
          {/* 1. Sobre a M MORS */}
          <About />
          
          {/* 2. Essência e Propósito */}
          <Essence />
          
          {/* 3. Certificação e Origem */}
          <Certification />

          {/* 4. Por que escolher a M MORS? */}
          <Patrimony />

          {/* 5. Linhas de Produtos */}
          <Products />

          {/* 6. Design Sob Medida */}
          <Bespoke />

          {/* 7. Patamar Patrimonial (Seguro para CVM) */}
          <PatrimonialLevel />

          {/* 8. Rodapé e Slogans Oficiais */}
          <Footer />
        </>
      )}
    </main>
  );
}

export default App;