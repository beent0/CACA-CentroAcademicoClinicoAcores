import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Componente Header
function Header({ theme, toggleTheme, lang, setLang, user, logout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Texto circular do logo
  const circularText = "Centro Académico Clínico dos Açores";
  const angle = 360 / circularText.length;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isHomePage = location.pathname === '/';

  return (
    <header className="header">
      <div className="header-flex">
        {/* Logotipo com texto circular reativo */}
        <Link to="/" className="circle-link">
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
        </Link>
        
        <span className="header-text">
          <strong data-i18n="header_title">Centro Académico Clínico dos Açores</strong>
        </span>

        {/* Menu de navegação reativo */}
        <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`} id="nav-links">
          <ul>
            <li>
              {isHomePage ? (
                <a href="#sobre" data-i18n="nav_sobre" onClick={closeMenu}>Sobre nós</a>
              ) : (
                <Link to="/#sobre" data-i18n="nav_sobre" onClick={closeMenu}>Sobre nós</Link>
              )}
            </li>
            <li>
              {isHomePage ? (
                <a href="#servicos" data-i18n="nav_servicos" onClick={closeMenu}>Serviços</a>
              ) : (
                <Link to="/#servicos" data-i18n="nav_servicos" onClick={closeMenu}>Serviços</Link>
              )}
            </li>
            <li>
              {isHomePage ? (
                <a href="#eventos" data-i18n="nav_eventos" onClick={closeMenu}>Eventos</a>
              ) : (
                <Link to="/#eventos" data-i18n="nav_eventos" onClick={closeMenu}>Eventos</Link>
              )}
            </li>
            
            {user && user.role === 'admin' && (
              <li>
                <Link to="/admin" onClick={closeMenu} style={{ color: '#29B89E', fontWeight: 'bold' }}>Admin</Link>
              </li>
            )}

            {user ? (
              <>
                <li className="user-info-nav">
                  <Link to="/perfil" onClick={closeMenu} style={{ fontSize: '0.9rem', marginRight: '10px', color: 'inherit' }}>
                    Olá, {user.nome.split(' ')[0]}
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="btn-sm btn-delete" style={{ border: 'none', cursor: 'pointer' }}>Sair</button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className="contacts" onClick={closeMenu}>
                  <strong data-i18n="nav_login">Entrar</strong>
                </Link>
              </li>
            )}
            
            {/* Seletor de idiomas */}
            <li className="lang-dropdown-container">
              <div 
                className="lang-dropdown-selected"
                onClick={() => setIsLangOpen(!isLangOpen)}
              >
                <span className={`fi fi-${(lang === 'en' ? 'gb' : lang) || 'pt'}`}></span> <span className="lang-code">{(lang || 'pt').toUpperCase()}</span>
              </div>
              <ul className={`lang-dropdown-options ${isLangOpen ? 'show' : ''}`}>
                <li data-lang="pt" onClick={() => { setLang('pt'); setIsLangOpen(false); }}><span className="fi fi-pt"></span> PT</li>
                <li data-lang="en" onClick={() => { setLang('en'); setIsLangOpen(false); }}><span className="fi fi-gb"></span> EN</li>
                <li data-lang="es" onClick={() => { setLang('es'); setIsLangOpen(false); }}><span className="fi fi-es"></span> ES</li>
                <li data-lang="fr" onClick={() => { setLang('fr'); setIsLangOpen(false); }}><span className="fi fi-fr"></span> FR</li>
                <li data-lang="de" onClick={() => { setLang('de'); setIsLangOpen(false); }}><span className="fi fi-de"></span> DE</li>
              </ul>
            </li>
            
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
