document.addEventListener('DOMContentLoaded', () => {
    let db;
    const request = indexedDB.open("EventosDB", 2);

    const eventForm = document.getElementById('event-form');
    const adminEventsList = document.getElementById('admin-events-list');
    const btnCancelEdit = document.getElementById('btn-cancel-edit');
    const adminFormTitle = document.getElementById('admin-form-title');

    request.onerror = function (event) {
        console.error('Erro ao abrir a IndexedDB', event);
    };

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        
        if (!db.objectStoreNames.contains('eventos')) {
            const store = db.createObjectStore('eventos', { keyPath: 'id', autoIncrement: true });
            store.createIndex('titulo', 'titulo', { unique: false });
            store.createIndex('descricao', 'descricao', { unique: false });
            store.createIndex('data', 'data', { unique: false });
            store.createIndex('hora', 'hora', { unique: false });
            store.createIndex('local', 'local', { unique: false });
        }    
    };

    request.onsuccess = function() {
        db = request.result;
        
        if (eventForm) {
            eventForm.addEventListener('submit', salvarEvento);
        }
        if (btnCancelEdit) {
            btnCancelEdit.addEventListener('click', resetForm);
        }

        const transaction = db.transaction('eventos', 'readwrite');
        const store = transaction.objectStore('eventos');
        const countRequest = store.count();

        countRequest.onsuccess = function() {
            if (countRequest.result === 0) {
                const writeTransaction = db.transaction('eventos', 'readwrite');
                const writeStore = writeTransaction.objectStore('eventos');
                
                const initialData = [
                    { titulo: "Comemorações do 7º aniversário da ESS na UAc", descricao: "Celebração do aniversário com diversas atividades.", data: "2026-05-06", hora: "14:00 - 16:00", local: "Auditório Norte", imagem: "media/evento1.png" },
                    { titulo: "Open day 2026 | Enfermagem", descricao: "Dia aberto para apresentar o curso de Enfermagem.", data: "2026-05-30", hora: "09:00 - 12:00", local: "Campus de Angra do Heroísmo", imagem: "media/evento2.jpg" },
                    { titulo: "V Congresso Internacional Enfermagem", descricao: "Congresso internacional com a presença de especialistas.", data: "2026-10-28", hora: "10:00 - 13:00", local: "Auditório Norte", imagem: "media/evento3.jpg" }
                ];

                initialData.forEach(item => writeStore.put(item));
                
                writeTransaction.oncomplete = function() {
                    carregarEventos(db);
                };
            } else {
                carregarEventos(db);
            }
        };
    };

    /**
     * Fetches all events from IndexedDB and triggers re-rendering of both the user-facing carousel and the admin management list.
     * @param {IDBDatabase} db - The opened IndexedDB instance.
     */
    function carregarEventos(db) {
        const transaction = db.transaction('eventos', 'readonly');
        const store = transaction.objectStore('eventos');
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = function() {
            renderizarEventosNoCarrossel(getAllRequest.result);
            renderizarListaAdmin(getAllRequest.result);
        };
    }

    /**
     * Handles the event form submission to add a new event or update an existing one.
     * @param {Event} e - The form submission event.
     */
    function salvarEvento(e) {
        e.preventDefault();
        
        if (typeof limparErros === 'function') {
            limparErros();
        }
        
        const titulo = document.getElementById('event-titulo');
        const desc = document.getElementById('event-desc');
        const data = document.getElementById('event-data');
        const hora = document.getElementById('event-hora');
        const local = document.getElementById('event-local');
        const imagem = document.getElementById('event-imagem');
        const idInput = document.getElementById('event-id');
        const id = idInput.value;
        const latValue = document.getElementById('event-lat').value;
        const lngValue = document.getElementById('event-lng').value;
        const preview = document.getElementById('weather-preview');
        let climaInfo = null;

        
        const tempoInfo = preview.querySelector('.weather-preview-temperatura');
        if (tempoInfo) {
            climaInfo = {
                temp: tempoInfo.textContent,
                desc: preview.querySelector('.weather-preview-descricao').textContent,
                icon: preview.querySelector('.weather-preview-icon').src
            };
        }
        
        let isValid = true;

        if (!titulo.value.trim()) {
            mostrarErro(titulo, 'Título é obrigatório');
            isValid = false;
        }

        if (!desc.value.trim()) {
            mostrarErro(desc, 'Descrição é obrigatória');
            isValid = false;
        }

        if (!data.value) {
            mostrarErro(data, 'Data é obrigatória');
            isValid = false;
        }

        if (!hora.value.trim()) {
            mostrarErro(hora, 'Hora é obrigatória');
            isValid = false;
        }

        if (!local.value.trim()) {
            mostrarErro(local, 'Local é obrigatório');
            isValid = false;
        }

        if (!imagem.value.trim()) {
            mostrarErro(imagem, 'URL da Imagem é obrigatória');
            isValid = false;
        }

        if (!isValid) return;

        const evento = {
            titulo: titulo.value,
            descricao: desc.value,
            data: data.value,
            hora: hora.value,
            local: local.value,
            imagem: imagem.value,
            latitude: latValue ? parseFloat(latValue) : null,
            longitude: lngValue ? parseFloat(lngValue) : null,
            clima: climaInfo
        };

        // If editing, include the original ID.
        if (id) {
            evento.id = parseInt(id);
        }

        const transaction = db.transaction('eventos', 'readwrite');
        const store = transaction.objectStore('eventos');
        store.put(evento);

        transaction.oncomplete = function() {
            resetForm();
            carregarEventos(db);
            if (typeof mostrarToast === 'function') {
                mostrarToast('Evento guardado com sucesso!', 'success');
            }
        };
    }

    /**
     * Removes an event from IndexedDB by its ID after user confirmation.
     * @param {number} id - The ID of the event to be deleted.
     */
    function removerEvento(id) {
        if (!confirm('Tem a certeza que deseja eliminar este evento?')) return;

        const transaction = db.transaction('eventos', 'readwrite');
        const store = transaction.objectStore('eventos');
        store.delete(id);

        transaction.oncomplete = function() {
            carregarEventos(db);
            if (typeof mostrarToast === 'function') {
                mostrarToast('Evento eliminado com sucesso!', 'success');
            }
        };
    }

    /**
     * populates the admin form with event data to allow editing an existing event.
     * @param {Object} evento - The event object to be edited.
     */
    function editarEvento(evento) {
        if (typeof limparErros === 'function') {
            limparErros();
        }
        document.getElementById('event-id').value = evento.id;
        document.getElementById('event-titulo').value = evento.titulo;
        document.getElementById('event-desc').value = evento.descricao;
        document.getElementById('event-data').value = evento.data;
        document.getElementById('event-hora').value = evento.hora;
        document.getElementById('event-local').value = evento.local;
        document.getElementById('event-imagem').value = evento.imagem;

        if (adminFormTitle) {
            adminFormTitle.textContent = 'Editar Evento';
        }
        
        if (btnCancelEdit) btnCancelEdit.classList.remove('hidden');
        
        const adminSection = document.getElementById('admin-section');
        if (adminSection) adminSection.scrollIntoView();
    }

    /**
     * Resets the admin form fields and UI state to "Add Event" mode.
     */
    function resetForm() {
        if (typeof limparErros === 'function') {
            limparErros();
        }
        if (eventForm) eventForm.reset();
        document.getElementById('event-id').value = '';
        if (adminFormTitle) {
            adminFormTitle.textContent = 'Adicionar Evento';
        }
        if (btnCancelEdit) btnCancelEdit.classList.add('hidden');
    }

    /**
     * Renders the list of events in the admin panel with edit and delete buttons.
     * @param {Array} eventos - Array of event objects from IndexedDB.
     */
    function renderizarListaAdmin(eventos) {
        if (!adminEventsList) return;
        
        let html = '';
        eventos.forEach(evento => {
            html += `
            <div class="admin-event-item">
                <div class="admin-event-info">
                    <h4>${evento.titulo}</h4>
                    <p>${evento.data} | ${evento.local}</p>
                </div>
                <div class="admin-item-actions">
                    <button class="btn-sm btn-edit" onclick="window.editarEventoById(${evento.id})">Editar</button>
                    <button class="btn-sm btn-delete" onclick="window.removerEventoById(${evento.id})">Eliminar</button>
                </div>
            </div>`;
        });
        adminEventsList.innerHTML = html;

        // expose global helpers for onclick
        window.removerEventoById = (id) => removerEvento(id);
        window.editarEventoById = (id) => {
            const ev = eventos.find(e => e.id === id);
            if (ev) editarEvento(ev);
        };
    }

    /**
     * Renders the event cards inside the user-facing carousel.
     * @param {Array} eventos - Array of event objects from IndexedDB.
     */
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
                    <img src="${evento.imagem}" alt="Cartaz do evento: ${evento.titulo}">
                    <div class="date-badge">
                        <span class="day">${dia}</span>
                        <span class="month">${mes}</span>
                    </div>
                </div>
                <div class="card-content">
                    <h4>${evento.titulo}</h4>
                    <p class="meta">
                        ${evento.clima ? `
                            <img class = "weather-badge"src="${evento.clima.icon}" alt="Clima">
                            <span>${evento.clima.temp} - ${evento.clima.desc}</span>

                        ` : ''}
                    </p>
                    <p class="meta">🕒 <span>${evento.hora}</span></p>
                    <p class="meta">📍 <span>${evento.local}</span></p>
                </div>
            </article>`;
        });

        // Apply HTML to track
        track.innerHTML = html;

        // Re-apply translations
        if (typeof applyTranslations === 'function') {
            applyTranslations();
        }

        // Notify script.js that the DOM is ready for the carousel
        window.dispatchEvent(new Event('loadedEvents'));
    }
});
