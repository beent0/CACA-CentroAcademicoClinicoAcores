import React, { useState, useEffect } from 'react';

// Componente News - Secção de notícias assíncronas (Fase 5: API GNews)
function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      // Tenta obter a chave do objeto global CONFIG
      const config = window.CONFIG || {};
      const apiKey = config.GNEWS_API_KEY;

      // Se a chave não estiver configurada ou for o placeholder, usa dados mockados realistas
      if (!apiKey || apiKey === 'API_KEY_HERE') {
        console.log('API GNews não configurada. A carregar notícias de demonstração local.');
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
        // Pequeno atraso para simular carregamento de rede real
        setTimeout(() => {
          setArticles(mockArticles);
          setLoading(false);
        }, 600);
        return;
      }

      const query = 'Health';
      const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=pt&country=pt&max=6&token=${apiKey}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.articles) {
          setArticles(data.articles);
        } else {
          throw new Error('Nenhum artigo retornado');
        }
      } catch (err) {
        console.warn('Erro ao obter notícias da GNews, usando fallback local:', err);
        setError(err.message);
        // Fallback local se a API falhar (ex: limite de pedidos atingido)
        setArticles([
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
        ]);
      } finally {
        setLoading(false);
      }
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
