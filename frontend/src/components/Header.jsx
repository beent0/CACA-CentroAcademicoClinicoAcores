import React from 'react';

// Componente Header - Barra de navegação e seletor de idiomas
function Header() {
  return (
    <header className="header">
      <div className="header-flex">
        <div className="circle">
          <div className="logo"></div>
          <div className="text">
            <p>Centro Académico Clínico dos Açores</p>
          </div>
        </div>
        <span className="header-text">
          <strong data-i18n="header_title">Centro Académico Clínico dos Açores</strong>
        </span>

        <nav className="nav-links" id="nav-links">
          <ul>
            <li>
              <a href="#sobre" data-i18n="nav_sobre">Sobre nós</a>
            </li>
            <li>
              <a href="#servicos" data-i18n="nav_servicos">Serviços</a>
            </li>
            <li>
              <a href="#eventos" data-i18n="nav_eventos">Eventos</a>
            </li>
            <li>
              <a href="#noticias" data-i18n="nav_noticias">Notícias</a>
            </li>
            <li>
              <a href="#Localizacao" data-i18n="nav_localizacao">Localização</a>
            </li>
            <li>
              <a className="contacts" href="#contactos">
                <strong data-i18n="nav_contactos">Contacte-nos</strong>
              </a>
            </li>
            
            {/* Seletor de idiomas - Dropdown (Fase 2: Estático por agora) */}
            <li className="lang-dropdown-container">
              <div className="lang-dropdown-selected">
                <span className="fi fi-pt"></span> <span className="lang-code">PT</span>
              </div>
              <ul className="lang-dropdown-options" style={{ display: 'none' }}>
                <li data-lang="pt"><span className="fi fi-pt"></span> PT</li>
                <li data-lang="en"><span className="fi fi-gb"></span> EN</li>
                <li data-lang="es"><span className="fi fi-es"></span> ES</li>
                <li data-lang="fr"><span class="fi fi-fr"></span> FR</li>
                <li data-lang="de"><span class="fi fi-de"></span> DE</li>
              </ul>
            </li>
            
            {/* Botão de alternar tema (Fase 2: Estático por agora) */}
            <li>
              <button 
                id="theme-toggle" 
                className="btn theme-toggle-btn" 
                title="Alternar modo escuro"
              >
                🌙
              </button>
            </li>
          </ul>
          
          {/* Menu Hambúrguer (Mobile) */}
          <div className="header-menu" id="header-menu">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
