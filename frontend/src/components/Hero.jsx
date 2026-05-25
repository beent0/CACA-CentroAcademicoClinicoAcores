import React from 'react';

// Componente Hero - Secção inicial com carrossel de imagens e texto de boas-vindas
function Hero() {
  return (
    <section id="hero" className="hero">
      <div id="carousel-track" className="carousel-track">
        {/* Slide ativo por defeito na Fase 2 */}
        <div 
          className="carousel-slide" 
          style={{ backgroundImage: "url('media/hero.png')" }}
        ></div>
      </div>
      
      {/* Controlos do carrossel */}
      <div className="hero-controls">
        <button id="prev" className="carrousel-btn">&#8249;</button>
        <button id="forward" className="carrousel-btn">&#8250;</button>
      </div>
      
      {/* Conteúdo sobreposto */}
      <div className="hero-overlay">
        <div className="container hero-content">
          <h1 data-i18n="hero_title">Centro Académico Clínico dos Açores</h1>
          <p data-i18n="hero_text">
            Excelência clínica com estreita integração entre prática clínica, educação e investigação.
          </p>
          <a href="#contactos" className="btn btn-primary" data-i18n="hero_btn">
            Junta-te a nós
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
