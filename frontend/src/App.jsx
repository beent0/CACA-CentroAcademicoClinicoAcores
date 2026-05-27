import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Stats from './components/Stats';
import Partners from './components/Partners';
import Services from './components/Services';
import Events from './components/Events';
import News from './components/News';
import Location from './components/Location';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';

// App principal - Ponto de montagem de todas as secções da landing page com estado de tema global
function App() {
  // Inicialização do tema a partir do localStorage ou preferências do sistema operativo
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  // Inicialização do idioma a partir do localStorage ou preferências do browser
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('preferredLang');
    if (saved && ['pt', 'en', 'es', 'fr', 'de'].includes(saved)) return saved;
    const browserLang = navigator.language.slice(0, 2);
    if (['en', 'es', 'fr', 'de'].includes(browserLang)) return browserLang;
    return 'pt';
  });

  const [translations, setTranslations] = useState({});

  // Carrega o ficheiro JSON do idioma escolhido
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/lang/${lang}.json`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setTranslations(data);
        localStorage.setItem('preferredLang', lang);
        
        // Dispara evento para scripts externos (ex: gráficos D3)
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
      } catch (error) {
        console.warn('Erro ao carregar i18n:', error);
      }
    };
    loadTranslations();
  }, [lang]);

  // Efeito para traduzir a página (Fase 4 - Internacionalização Simples)
  useEffect(() => {
    if (!translations || Object.keys(translations).length === 0) return;

    // Traduz os textos com data-i18n
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (translations[key]) {
        el.innerHTML = translations[key];
      }
    });

    // Traduz os atributos com data-i18n-attr (ex: placeholders)
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      const attrDef = el.getAttribute('data-i18n-attr');
      if (!attrDef) return;
      const [attrName, key] = attrDef.split(':');
      if (translations[key]) {
        el.setAttribute(attrName, translations[key]);
      }
    });
  }, [translations]);

  // Efeito para aplicar o tema no elemento raiz (<html>) e guardar a preferência
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Efeito para escutar alterações de tema do sistema (apenas se o utilizador não tiver uma preferência manual guardada)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <>
      <Header theme={theme} toggleTheme={toggleTheme} lang={lang} setLang={setLang} />
      <main>
        <Hero />
        <About />
        <Stats />
        <Partners />
        <Services />
        <Events />
        <News />
        <Location />
        <AdminPanel />
      </main>
      <Footer />
    </>
  );
}

export default App;
