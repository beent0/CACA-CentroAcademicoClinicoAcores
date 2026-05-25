import React from 'react';

// Componente Location - Secção do Mapa Google Maps (Fase 5: Google Maps API)
function Location() {
  return (
    <section id="Localizacao" className="section">
      <div className="container">
        <div className="section-header">
          <span className="subtitle" data-i18n="localizacao_subtitle">LOCALIZAÇÃO</span>
          <h2 data-i18n="localizacao_title">Onde estamos?</h2>
        </div>
        
        {/* Container do Mapa */}
        <div className="map-container">
          <div id="googlemap" className="map">
            <div style={{ padding: '40px', textAlign: 'center', color: '#666', border: '1px dashed #ccc', height: '100%' }}>
              [Google Maps Interativo será carregado aqui]
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Location;
