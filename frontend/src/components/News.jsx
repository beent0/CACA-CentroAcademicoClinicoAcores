import React, { useState, useEffect } from 'react';

// Componente News
function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      // Verifica a Cache Primeiro
      const CACHE_KEY = 'news_cache_v3';
      const CACHE_TIME = 6 * 60 * 60 * 1000; // 6 Horas
      
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { articles, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_TIME) {
          setArticles(articles);
          setLoading(false);
          return;
        }
      }

      await new Promise(resolve => setTimeout(resolve, 100));
      const config = window.CONFIG || {};
      const apiKey = config.CURRENTS_API_KEY;

      if (!apiKey || apiKey === 'API_KEY_HERE') {
        useMockData();
        return;
      }

      // Tenta Açores Primeiro
      let query = 'açores saúde';
      let url = `https://api.currentsapi.services/v1/search?keywords=${encodeURIComponent(query)}&language=pt&apiKey=${apiKey}`;

      try {
        let response = await fetch(url);
        let data = await response.json();

        // Se não houver Açores, tenta Portugal
        if (!data.news || data.news.length === 0) {
          console.log('DEBUG NEWS: Sem notícias dos Açores, a tentar Portugal...');
          query = 'saúde portugal';
          url = `https://api.currentsapi.services/v1/search?keywords=${encodeURIComponent(query)}&language=pt&country=PT&apiKey=${apiKey}`;
          response = await fetch(url);
          data = await response.json();
        }

        // Se ainda assim não houver, tenta Saúde geral
        if (!data.news || data.news.length === 0) {
          console.log('DEBUG NEWS: Sem notícias de PT, a tentar Saúde geral...');
          url = `https://api.currentsapi.services/v1/search?category=health&language=pt&apiKey=${apiKey}`;
          response = await fetch(url);
          data = await response.json();
        }

        if (data.status === 'ok' && data.news && data.news.length > 0) {
          const formattedArticles = data.news.slice(0, 6).map(item => ({
            title: item.title,
            image: item.image !== 'None' ? item.image : 'media/sobre_nos.png',
            source: { name: item.author || 'Notícias' },
            url: item.url
          }));

          localStorage.setItem(CACHE_KEY, JSON.stringify({
            articles: formattedArticles,
            timestamp: Date.now()
          }));
          
          setArticles(formattedArticles);
          setLoading(false);
        } else {
          useMockData();
        }
      } catch (err) {
        console.error('DEBUG NEWS: Erro na Currents API:', err.message);
        useMockData();
      }
    };

    const useMockData = () => {
      const mockArticles = [
        {
          title: 'Avanços na Medicina Preventiva nos Açores',
          image: 'media/noticia1.jpg',
          source: { name: 'Saúde Açores' },
          url: '#'
        },
        {
          title: 'Parceria Universitária Reforça Investigação Regional',
          image: 'media/noticia2.jpg',
          source: { name: 'UAc News' },
          url: '#'
        },
        {
          title: 'Novo Equipamento Clínico Melhora Diagnósticos',
          image: 'media/noticia3.jpg',
          source: { name: 'Portal Clínico' },
          url: '#'
        }
      ];
      setArticles(mockArticles);
      setLoading(false);
    };

    fetchNews();
  }, []);

  return (
    <section id="noticias" className="section">
      <div className="container">
        <div className="section-header">
          <div>
            <span className="subtitle" data-i18n="noticias_subtitle">NOTÍCIAS</span>
            <h2 data-i18n="noticias_title">Novidades e Artigos</h2>
          </div>
        </div>
        
        {/* Container das notícias */}
        <div id="apinoticias-container" className="cards-flex">
          {loading ? (
            <p style={{ textAlign: 'center', width: '100%', color: '#666', fontStyle: 'italic' }}>
              A carregar notícias...
            </p>
          ) : (
            articles.map((article, idx) => (
              <article key={idx} className="news-card">
                <img src={article.image || 'media/sobre_nos.png'} alt={article.title} />
                <h4>{article.title}</h4>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>{article.source.name}</p>
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="link-blue">
                  Saiba mais
                </a>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default News;
