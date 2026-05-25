import React from 'react';

// Componente Events - Secção do Carrossel de Eventos locais (IndexedDB na Fase 7)
function Events() {
  return (
    <section id="eventos" className="section">
      <div className="container">
        <div className="section-header">
          <span className="subtitle" data-i18n="eventos_subtitle">EVENTOS</span>
          <h2 data-i18n="eventos_title">Próximos eventos</h2>
        </div>
        
        {/* Estrutura do Carrossel de Eventos */}
        <div className="events-carousel-container">
          <div className="events-mask">
            <div className="events-track" id="dynamic-events-track">
              {/* Eventos estáticos temporários para a Fase 2 */}
              <article className="card event-card">
                <img src="media/evento1.png" alt="Evento Exemplo" />
                <div className="event-card-content">
                  <h4>Workshop de Investigação Clínica</h4>
                  <p>Um evento enriquecedor focado no futuro da medicina científica.</p>
                  <div className="event-meta">
                    <span>📅 15/06/2026</span>
                    <span>📍 Auditório UAc</span>
                  </div>
                </div>
              </article>
            </div>
          </div>
          <button 
            id="event-prev" 
            className="carrousel-btn event-nav-btn prev-btn" 
            aria-label="Evento Anterior"
          >
            &#10094;
          </button>
          <button 
            id="event-next" 
            className="carrousel-btn event-nav-btn next-btn" 
            aria-label="Próximo Evento"
          >
            &#10095;
          </button>
        </div>
      </div>
    </section>
  );
}

export default Events;
