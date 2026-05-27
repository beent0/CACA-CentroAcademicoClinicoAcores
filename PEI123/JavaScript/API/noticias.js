//Noticias

async function conseguirNoticias() {
    const apiKey = CONFIG.GNEWS_API_KEY;
    const query = `Health`;
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=pt&country=pt&max=6&token=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Erro ao buscar notícias: " + response.statusText);
        }

        const data = await response.json();
        if (data.articles) {
            renderNews(data.articles);
        }
    } catch (error) {
        console.error("Erro ao buscar notícias:", error);
        document.getElementById("apinoticias-container").innerHTML = "<p>Não foi possível carregar as notícias no momento.</p>";
    }
}

function renderNews(articles) {
    const container = document.getElementById("apinoticias-container");
    container.innerHTML = ""; // Limpa o texto de "A carregar"

    articles.forEach(article => {
        //Criar o HTML
        const card = `
            <article class="news-card">
                <img src="${article.image}" alt="${article.title}">
                <h4>${article.title}</h4>
                <p style="font-size: 0.9rem; color: #666;">${article.source.name}</p>
                <a href="${article.url}" target="_blank" class="link-blue">Saiba mais</a>
            </article>
        `;
        container.innerHTML += card;
    });
}

// Procurar Noticias
conseguirNoticias();