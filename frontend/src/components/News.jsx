import React from 'react';

// Componente News - Secção de notícias assíncronas (Fase 5: API GNews)
function News() {
  return (
    <section id="noticias" className="section">
      <div className="container">
        <div className="section-header">
          <div>
            <span className="subtitle" data-i18n="noticias_subtitle">NOTÍCIAS</span>
            <h2 data-i18n="noticias_title">Novidades e Artigos</h2>
          </div>
        </div>
        
        {/* Container das notícias */}
        <div id="apinoticias-container" className="cards-flex">
          {/* Cartões estáticos provisórios para a Fase 2 */}
          <article className="news-card">
            <img src="media/sobre_nos.png" alt="Notícia exemplo" />
            <h4>Avanços na Medicina Preventiva nos Açores</h4>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>Saúde Açores</p>
            <a href="#" className="link-blue">Saiba mais</a>
          </article>
          <article className="news-card">
            <img src="media/hero.png" alt="Notícia exemplo" />
            <h4>Parceria Universitária Reforça Investigação Regional</h4>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>UAc News</p>
            <a href="#" className="link-blue">Saiba mais</a>
          </article>
        </div>
      </div>
    </section>
  );
}

export default News;
