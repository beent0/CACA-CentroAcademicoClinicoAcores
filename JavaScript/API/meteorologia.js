/**
 * meteorologia.js
 * Lógica para obter a previsão do tempo mais próxima da data e hora do evento.
 */

async function atualizarPrevisaoEvento() {
    const apiKey = CONFIG.WEATHER_API_KEY;

    const latitudeEvento = document.getElementById('event-lat');
    const longitudeEvento = document.getElementById('event-lng');
    const dataEvento = document.getElementById('event-data');
    const horaEvento = document.getElementById('event-hora');
    const previewContainer = document.getElementById('weather-preview');

    // Se algum elemento essencial não existir no DOM, paramos a execução
    if (!latitudeEvento || !longitudeEvento || !dataEvento || !horaEvento || !previewContainer) return;

    const lat = latitudeEvento.value;
    const lng = longitudeEvento.value;
    const dataValue = dataEvento.value;
    const horaValue = horaEvento.value;

    // Só avançamos se tivermos coordenadas e data/hora válidas
    if (!lat || !lng || !dataValue || !horaValue) return;



    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric&lang=pt`;

    try {
        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error("Erro na API");
        
        const dados = await resposta.json();
        
        const hora = parseInt(horaValue);
        const forecast = dados.list.find(item => {
            const mesmoDia = item.dt_txt.startsWith(dataValue);
            const horaApi = parseInt(item.dt_txt.split(" ")[1].split(":")[0]);
            // Verifica se é o mesmo dia e se a diferença de horas é de 2h ou menos
            return mesmoDia && Math.abs(horaApi - hora) <= 2;
        });

        if (forecast) {
            renderizarPrevisao(forecast);
        } else {
            previewContainer.innerHTML = `<p>
                Previsão detalhada apenas disponível para os próximos 5 dias.
            </p>`;
        }

    } catch (error) {
        console.error("Erro ao obter meteorologia:", error);
    }
}

function renderizarPrevisao(dados) {
    const previewContainer = document.getElementById('weather-preview');
    const temperatura = Math.round(dados.main.temp);
    const descricao = dados.weather[0].description;
    const icon = dados.weather[0].icon;

    previewContainer.innerHTML = `
        <div class="weather-preview-container">        
            
            <div class="weather-info-row">
                <span class="weather-preview-temperatura">${temperatura}°C</span>
                <img class="weather-preview-icon" src="https://openweathermap.org/img/wn/${icon}.png" alt="Tempo"> 
                <span class="weather-preview-descricao">${descricao}</span> 
            </div>

            <p class="weather-preview-dados">Previsão para: ${dados.dt_txt.split(' ')[1].substring(0,5)}</p>
        </div>
    `;
}

// Inicialização segura dos listeners
document.addEventListener('DOMContentLoaded', () => {
    const inputs = ['event-data', 'event-hora', 'event-local'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            // "input" deteta qualquer mudança imediata
            el.addEventListener('input', atualizarPrevisaoEvento);
        }
    });
});

