import React from 'react';

// Componente Partners
function Partners() {
  return (
    <section className="section partners-section">
      <div className="container">
        <h3 data-i18n="parceiros_title">Os nossos parceiros</h3>
        <div className="partners-flex">
          <a href="https://www.uac.pt/">
            <img src="media/uac.png" alt="Universidade dos Açores" />
          </a>
          <a href="https://www.facebook.com/p/UAcESS-Escola-Superior-de-Sa%C3%BAde-Universidade-dos-A%C3%A7ores-100063229659438/?locale=pt_BR">
            <img src="media/ess.png" alt="Escola Superior de Saúde" />
          </a>
          <a href="https://www.facebook.com/hdespd/?locale=pt_PT">
            <img src="media/hdes.jpg" alt="Hospital do Divino Espírito Santo" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default Partners;
