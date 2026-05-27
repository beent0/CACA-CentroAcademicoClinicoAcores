import React from 'react';

// Componente Services - Secção com os cartões dos serviços da clínica
function Services() {
  return (
    <section id="servicos" className="section">
      <div className="container">
        <div className="section-header">
          <span className="subtitle" data-i18n="servicos_subtitle">SERVIÇOS</span>
          <h2 data-i18n="servicos_title">Explore os nossos serviços</h2>
        </div>
        
        <div className="cards-flex">
          {/* Card: Ensino */}
          <article className="card service-card">
            <div className="card-icon">🎓</div>
            <h3 data-i18n="ensino_title">Ensino</h3>
            <div className="service-card-details">
              <p data-i18n="ensino_text">
                Promovemos a formação académica e profissional de excelência.
              </p>
              <a href="#" className="btn-text" data-i18n="ensino_btn">
                Saber mais →
              </a>
            </div>
          </article>
          
          {/* Card: Investigação */}
          <article className="card service-card">
            <div className="card-icon">🧬</div>
            <h3 data-i18n="investigacao_title">Investigação</h3>
            <div className="service-card-details">
              <p data-i18n="investigacao_text">
                Desenvolvemos ciência para melhorar os cuidados de saúde.
              </p>
              <a href="#" className="btn-text" data-i18n="investigacao_btn">
                Saber mais →
              </a>
            </div>
          </article>
          
          {/* Card: Prática Clínica */}
          <article className="card service-card">
            <div className="card-icon">🩺</div>
            <h3 data-i18n="pratica_title">Prática Clínica</h3>
            <div className="service-card-details">
              <p data-i18n="pratica_text">
                Prestamos cuidados de saúde diferenciados e inovadores.
              </p>
              <a href="#" className="btn-text" data-i18n="pratica_btn">
                Saber mais →
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default Services;
