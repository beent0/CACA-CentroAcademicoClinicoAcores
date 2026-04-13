document.addEventListener('DOMContentLoaded', () => {
    let db;
    const request = indexedDB.open("EventosDB", 1);

    request.onerror = function (event) {
        console.error('Erro ao abrir a IndexedDB', event);
    };

request.onupgradeneeded = function(event) {
        db = event.target.result;
        
        if (!db.objectStoreNames.contains('eventos')) {
            const store = db.createObjectStore('eventos', { keyPath: 'id'});
            store.createIndex('titulo', 'titulo', { unique: false });
            store.createIndex('descricao', 'descricao', { unique: false });
            store.createIndex('data', 'data', { unique: false });
            store.createIndex('hora', 'hora', { unique: false });
            store.createIndex('local', 'local', { unique: false });
        }
    };

    request.onsuccess = function() {
        db = request.result;
        const transaction = db.transaction('eventos', 'readwrite');
        const store = transaction.objectStore('eventos');
        const countRequest = store.count();

        countRequest.onsuccess = function() {
            if (countRequest.result === 0) {
                // Seed initial data if DB is empty
                store.put({ id: 1, titulo: "Comemorações do 7º aniversário da ESS na UAc", descricao: "Celebração do aniversário com diversas atividades.", data: "2026-05-06", hora: "14:00 - 16:00", local: "Auditório Norte", imagem: "media/evento1.png" });
                store.put({ id: 2, titulo: "Open day 2026 | Enfermagem", descricao: "Dia aberto para apresentar o curso de Enfermagem.", data: "2026-05-30", hora: "09:00 - 12:00", local: "Campus de Angra do Heroísmo", imagem: "media/evento2.jpg" });
                store.put({ id: 3, titulo: "V Congresso Internacional Enfermagem", descricao: "Congresso internacional com a presença de especialistas.", data: "2026-10-28", hora: "10:00 - 13:00", local: "Auditório Norte", imagem: "media/evento3.jpg" });
                
                transaction.oncomplete = function() {
                    carregarEventos(db);
                };
            } else {
                carregarEventos(db);
            }
        };
    };

    function carregarEventos(db) {
        const transaction = db.transaction('eventos', 'readonly');
        const store = transaction.objectStore('eventos');
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = function() {
            renderizarEventosNoCarrossel(getAllRequest.result);
        };
    }

    function renderizarEventosNoCarrossel(eventos) {
        const track = document.getElementById('dynamic-events-track');
        if (!track) return;
        
        let html = '';
        const meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

        eventos.forEach(evento => {
            const dataParts = evento.data.split('-');
            const dia = parseInt(dataParts[2], 10);
            const mes = meses[parseInt(dataParts[1], 10) - 1];

            html += `
            <article class="card event-card">
                <div class="card-image">
                    <img src="${evento.imagem}" alt="Evento">
                    <div class="date-badge">
                        <span class="day">${dia}</span>
                        <span class="month">${mes}</span>
                    </div>
                </div>
                <div class="card-content">
                    <h4 data-i18n="evento${evento.id}_titulo">${evento.titulo}</h4>
                    <p class="meta">🕒 <span data-i18n="evento${evento.id}_hora">${evento.hora}</span></p>
                    <p class="meta">📍 <span data-i18n="evento${evento.id}_local">${evento.local}</span></p>
                </div>
            </article>`;
        });

        // Duplicate HTML for infinite scroll effect
        track.innerHTML = html + html;

        // Re-apply translations
        if (typeof applyTranslations === 'function') {
            applyTranslations();
        }

        // Notify script.js that the DOM is ready for the carousel
        window.dispatchEvent(new Event('loadedEvents'));
    }
});