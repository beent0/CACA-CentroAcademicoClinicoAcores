import React, { useState, useEffect, useRef } from 'react';
import { getAllEvents } from '../utils/db';

function Events() {
  const [events, setEvents] = useState([]);
  const [eventIndex, setEventIndex] = useState(0);
  const trackRef = useRef(null);
  const maskRef = useRef(null);

  const meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

  // Função para carregar os eventos da BD
  const loadEventsList = async () => {
    try {
      const data = await getAllEvents();
      // Ordena por data (opcional, para fazer sentido académico)
      const sorted = data.sort((a, b) => new Date(a.data) - new Date(b.data));
      setEvents(sorted);
    } catch (err) {
      console.warn("Erro ao obter eventos do IndexedDB:", err);
    }
  };

  useEffect(() => {
    loadEventsList();

    // Escuta evento personalizado de atualização (disparado pelo AdminPanel)
    const handleEventsUpdate = () => {
      loadEventsList();
      setEventIndex(0); // Faz reset à posição do carrossel
    };

    window.addEventListener('eventsUpdated', handleEventsUpdate);
    window.addEventListener('resize', resetCarouselPosition);

    return () => {
      window.removeEventListener('eventsUpdated', handleEventsUpdate);
      window.removeEventListener('resize', resetCarouselPosition);
    };
  }, []);

  const resetCarouselPosition = () => {
    setEventIndex(0);
  };

  // Efeito para mover o carrossel reativamente com base no eventIndex
  useEffect(() => {
    if (!trackRef.current || !maskRef.current || events.length === 0) return;

    const cards = trackRef.current.querySelectorAll('.event-card');
    if (cards.length === 0) return;

    const cardWidth = cards[0].offsetWidth;
    const gap = parseFloat(window.getComputedStyle(trackRef.current).gap) || 0;
    const slideWidth = cardWidth + gap;

    const maxTranslate = Math.max(0, trackRef.current.scrollWidth - maskRef.current.offsetWidth);
    let translateX = eventIndex * slideWidth;

    if (translateX > maxTranslate) {
      translateX = maxTranslate;
    }

    trackRef.current.style.transform = `translateX(-${translateX}px)`;
    trackRef.current.style.transition = "transform 0.5s ease-in-out";
  }, [eventIndex, events]);

  const handleNext = () => {
    if (!trackRef.current || !maskRef.current || events.length === 0) return;
    const cards = trackRef.current.querySelectorAll('.event-card');
    if (cards.length === 0) return;

    const cardWidth = cards[0].offsetWidth;
    const gap = parseFloat(window.getComputedStyle(trackRef.current).gap) || 0;
    const slideWidth = cardWidth + gap;
    const maxTranslate = Math.max(0, trackRef.current.scrollWidth - maskRef.current.offsetWidth);

    if (eventIndex * slideWidth < maxTranslate) {
      setEventIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (eventIndex > 0) {
      setEventIndex(prev => prev - 1);
    }
  };

  return (
    <section id="eventos" className="section">
      <div className="container">
        <div className="section-header">
          <span className="subtitle" data-i18n="eventos_subtitle">EVENTOS</span>
          <h2 data-i18n="eventos_title">Próximos eventos</h2>
        </div>
        
        {/* Estrutura do Carrossel de Eventos */}
        <div className="events-carousel-container">
          <div className="events-mask" ref={maskRef}>
            <div className="events-track" ref={trackRef} id="dynamic-events-track" style={{ display: 'flex', gap: '20px' }}>
              {events.length === 0 ? (
                <p style={{ color: '#666', fontStyle: 'italic', padding: '20px' }}>
                  Nenhum evento registado na base de dados.
                </p>
              ) : (
                events.map((evento) => {
                  let dia = "";
                  let mes = "";

                  if (evento.data) {
                    const dataParts = evento.data.split('-');
                    if (dataParts.length === 3) {
                      dia = parseInt(dataParts[2], 10);
                      mes = meses[parseInt(dataParts[1], 10) - 1] || "";
                    }
                  }

                  return (
                    <article key={evento.id} className="card event-card" style={{ flex: '0 0 300px' }}>
                      <div className="card-image">
                        <img src={evento.imagem || 'media/evento1.jpg'} alt={`Cartaz do evento: ${evento.titulo}`} />
                        {dia && mes && (
                          <div className="date-badge">
                            <span className="day">{dia}</span>
                            <span className="month">{mes}</span>
                          </div>
                        )}
                      </div>
                      <div className="card-content">
                        <h4>{evento.titulo}</h4>
                        <p style={{ fontSize: '0.9rem', color: '#666', margin: '8px 0', minHeight: '40px' }}>
                          {evento.descricao}
                        </p>
                        
                        {evento.clima && (
                          <div className="meta" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-color)', fontWeight: '500', marginBottom: '8px' }}>
                            <img className="weather-badge" src={evento.clima.icon} alt="Clima" style={{ width: '28px', height: '28px' }} />
                            <span style={{ fontSize: '0.85rem' }}>{evento.clima.temp} • {evento.clima.desc}</span>
                          </div>
                        )}
                        
                        <p className="meta">🕒 <span>{evento.hora}</span></p>
                        <p className="meta">📍 <span>{evento.local}</span></p>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
          
          {events.length > 0 && (
            <>
              <button 
                id="event-prev" 
                className="carrousel-btn event-nav-btn prev-btn" 
                aria-label="Evento Anterior"
                onClick={handlePrev}
                style={{ opacity: eventIndex === 0 ? 0.4 : 1 }}
              >
                &#10094;
              </button>
              <button 
                id="event-next" 
                className="carrousel-btn event-nav-btn next-btn" 
                aria-label="Próximo Evento"
                onClick={handleNext}
              >
                &#10095;
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Events;
