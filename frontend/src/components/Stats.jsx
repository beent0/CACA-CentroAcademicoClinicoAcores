import React from 'react';

// Componente Stats - Secção de estatísticas e investigações (onde serão renderizados os gráficos D3.js)
function Stats() {
  return (
    <section id="dados" className="section">
      <div className="container">
        <div className="section-header">
          <span className="subtitle" data-i18n="investigacoes_subtitle">Investigações</span>
          <h2 data-i18n="investigacoes_title">As nossas Investigações</h2>
        </div>
        
        {/* Espaço reservado para os gráficos na Fase 2 */}
        <div id="graficos-holder">
          <div id="grafico-barras">
            <div style={{ padding: '20px', textAlign: 'center', color: '#666', border: '1px dashed #ccc' }}>
              [Gráfico de Barras D3.js será carregado aqui]
            </div>
          </div>
          <div id="grafico-donut">
            <div style={{ padding: '20px', textAlign: 'center', color: '#666', border: '1px dashed #ccc' }}>
              [Gráfico Donut D3.js será carregado aqui]
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Stats;
