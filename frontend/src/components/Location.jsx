import React from 'react';

// Componente Location - Secção de Localização oficial usando OpenStreetMap (Livre de chaves de API!)
function Location() {
  return (
    <section id="Localizacao" className="section">
      <div className="container">
        <div className="section-header">
          <span className="subtitle" data-i18n="localizacao_subtitle">LOCALIZAÇÃO</span>
          <h2 data-i18n="localizacao_title">Onde estamos?</h2>
        </div>
        
        {/* Container do Mapa Interativo Gratuito e Oficial (OpenStreetMap) */}
        <div className="map-container" style={{ width: '100%', height: '400px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.1)' }}>
          <iframe
            title="Universidade dos Açores - OpenStreetMap"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-25.6690%2C37.7430%2C-25.6580%2C37.7490&layer=mapnik&marker=37.74634%2C-25.66380"
            style={{ border: 0 }}
          ></iframe>
        </div>
      </div>
    </section>
  );
}

export default Location;
