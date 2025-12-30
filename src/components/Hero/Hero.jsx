import React from 'react';
import './Hero.css';

// Imagens
import mainWoman from '../../assets/Captura de Tela 2025-12-30 às 03.28.39.png';
import prod1 from '../../assets/BRacelete esmeralda.png';
import prod2 from '../../assets/Brincos perolas (1).png';
import prod3 from '../../assets/COlar safiras (1).png';

const Hero = () => {
  return (
    <section className="hero-container">
      <div className="hero-content">
        
        {/* LADO ESQUERDO COM ANIMAÇÃO */}
        <div className="hero-left animate-hero-left">
          
          <div className="title-group">
            <span className="hero-eyebrow">M MORS • ALTA JOALHERIA</span>
            <h1 className="hero-title">M MORS – O luxo <br/> que <em>permanece</em>.</h1>
          </div>
          
          <div className="left-assets-wrapper">
            
            {/* CTA ESTILO INPUT */}
            <div className="luxury-cta-box">
              <span className="cta-text">Conheça nossa coleção completa</span>
              <button className="btn-text">EXPLORAR</button>
            </div>

            {/* CARD VIDRO COM QUALIDADE E ÍCONE */}
            <div className="glass-card">
              <div className="avatar-overflow-container">
                <div className="frosted-frame left-out"><img src={prod1} alt="P1" /></div>
                <div className="frosted-frame center-out"><img src={prod2} alt="P2" /></div>
                <div className="frosted-frame right-out"><img src={prod3} alt="P3" /></div>
              </div>
              
              <div className="card-content-box">
                <p className="card-label">Qualidade & Certificação</p>
                <div className="card-certification">
                  {/* Ícone de brilho/pedra */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3l3.09 6.26L22 10.27l-5 4.87 1.18 6.88L12 18.77l-6.18 3.25L7 15.14 2 10.27l6.91-1.01L12 3z"/>
                  </svg>
                  <span className="separator">—</span>
                  <span className="score">Gemas com Certificado GIA</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* LADO DIREITO - SEM ANIMAÇÃO E COM CORTE */}
        <div className="hero-right">
          <img src={mainWoman} alt="Modelo M Mors" className="hero-image-flush" />
        </div>

      </div>
    </section>
  );
};

export default Hero;