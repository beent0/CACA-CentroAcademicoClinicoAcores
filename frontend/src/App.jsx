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
      <Header theme={theme} toggleTheme={toggleTheme} />
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
