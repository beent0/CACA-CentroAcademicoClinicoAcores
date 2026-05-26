import React, { useState } from 'react';

// Componente Header - Barra de navegação com tema dinâmico e menu hambúrguer interativo
function Header({ theme, toggleTheme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  // Texto circular - lógica de rotação de caracteres pura em React!
  const circularText = "Centro Académico Clínico dos Açores";
  const angle = 360 / circularText.length;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-flex">
        {/* Logotipo com texto circular reativo */}
        <div className="circle">
          <div className="logo"></div>
          <div className="text">
            <p>
              {circularText.split('').map((char, i) => (
                <span
                  key={i}
                  style={{
                    transform: `translate(-50%, -50%) rotate(${i * angle}deg) translateY(-52px)`,
                  }}
                >
                  {char}
                </span>
              ))}
            </p>
          </div>
        </div>
        
        <span className="header-text">
          <strong data-i18n="header_title">Centro Académico Clínico dos Açores</strong>
        </span>

        {/* Menu de navegação reativo */}
        <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`} id="nav-links">
          <ul>
            <li>
              <a href="#sobre" data-i18n="nav_sobre" onClick={closeMenu}>Sobre nós</a>
            </li>
            <li>
              <a href="#servicos" data-i18n="nav_servicos" onClick={closeMenu}>Serviços</a>
            </li>
            <li>
              <a href="#eventos" data-i18n="nav_eventos" onClick={closeMenu}>Eventos</a>
            </li>
            <li>
              <a href="#noticias" data-i18n="nav_noticias" onClick={closeMenu}>Notícias</a>
            </li>
            <li>
              <a href="#Localizacao" data-i18n="nav_localizacao" onClick={closeMenu}>Localização</a>
            </li>
            <li>
              <a className="contacts" href="#contactos" onClick={closeMenu}>
                <strong data-i18n="nav_contactos">Contacte-nos</strong>
              </a>
            </li>
            
            {/* Seletor de idiomas - Dropdown (Fase 4: Dinâmico) */}
            <li className="lang-dropdown-container">
              <div 
                className="lang-dropdown-selected"
                onClick={() => setIsLangOpen(!isLangOpen)}
              >
                <span className="fi fi-pt"></span> <span className="lang-code">PT</span>
              </div>
              <ul className={`lang-dropdown-options ${isLangOpen ? 'show' : ''}`}>
                <li data-lang="pt" onClick={() => { setIsLangOpen(false); }}><span className="fi fi-pt"></span> PT</li>
                <li data-lang="en" onClick={() => { setIsLangOpen(false); }}><span className="fi fi-gb"></span> EN</li>
                <li data-lang="es" onClick={() => { setIsLangOpen(false); }}><span className="fi fi-es"></span> ES</li>
                <li data-lang="fr" onClick={() => { setIsLangOpen(false); }}><span className="fi fi-fr"></span> FR</li>
                <li data-lang="de" onClick={() => { setIsLangOpen(false); }}><span className="fi fi-de"></span> DE</li>
              </ul>
            </li>
            
            {/* Botão de alternar tema (Fase 3: Funcional via props do App.jsx) */}
            <li>
              <button 
                id="theme-toggle" 
                className="btn theme-toggle-btn" 
                title="Alternar modo escuro"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </li>
          </ul>
          
          {/* Menu Hambúrguer interativo com classe ativa */}
          <div className="header-menu" id="header-menu" onClick={toggleMenu}>
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
