import { useState, useEffect } from 'react';

export const useI18n = () => {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('preferredLang');
    if (saved && ['pt', 'en', 'es', 'fr', 'de'].includes(saved)) return saved;
    return 'pt';
  });

  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/lang/${lang}.json`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setTranslations(data);
        localStorage.setItem('preferredLang', lang);
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
      } catch (error) {
        console.warn('Erro ao carregar i18n:', error);
      }
    };
    loadTranslations();
  }, [lang]);

  useEffect(() => {
    if (!translations || Object.keys(translations).length === 0) return;
    
    // Aplica traduções via data-attributes
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (translations[key]) el.innerHTML = translations[key];
    });
    
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      const attrDef = el.getAttribute('data-i18n-attr');
      if (!attrDef) return;
      const [attrName, key] = attrDef.split(':');
      if (translations[key]) el.setAttribute(attrName, translations[key]);
    });
  }, [translations]);

  return { lang, setLang, translations };
};
