document.addEventListener('DOMContentLoaded', () => {
    /*
    EventListener inicial para configurar a IndexedDB e armazenar os eventos iniciais (estáticos do PEI2) do carrossel.
    */
    let db;

    // Abrir (ou criar) a base de dados
    const request = indexedDB.open("EventosDB", 1);

    request.onerror = function (event) {
        console.error('Erro ao abrir a IndexedDB');
        console.error(event);
    };

    request.onupgradeneeded = function() {
        db = request.result;
        
        const store = db.createObjectStore('eventos', { keyPath: 'id'});
        store.createIndex('titulo', 'titulo', { unique: false });
        store.createIndex('descricao', 'descricao', { unique: false });
        store.createIndex('data', 'data', { unique: false });
        store.createIndex('hora', 'hora', { unique: false });
        store.createIndex('local', 'local', { unique: false });
    };

    request.onsuccess = function() {
        const db = request.result;
        const transaction = db.transaction('eventos', 'readwrite');

        const store = transaction.objectStore('eventos');
        const tituloIndex = store.index('titulo');
        const dataIndex = store.index('data');

        store.put(
            {
                id: 1,
                titulo: "Comemorações do 7º aniversário da ESS na UAc",
                descricao: "Celebração do aniversário com diversas atividades.",
                data: "2026-05-06",
                hora: "14:00 - 16:00",
                local: "Auditório Norte",
                imagem: "media/evento1.png"
            },
            {
                id: 2,
                titulo: "Open day 2026 | Enfermagem",
                descricao: "Dia aberto para apresentar o curso de Enfermagem.",
                data: "2026-05-30",
                hora: "09:00 - 12:00",
                local: "Campus de Angra do Heroísmo",
                imagem: "media/evento2.jpg"
            },
            {
                id: 3,
                titulo: "V Congresso Internacional Enfermagem",
                descricao: "Congresso internacional com a presença de especialistas.",
                data: "2026-10-28",
                hora: "10:00 - 13:00",
                local: "Auditório Norte",
                imagem: "media/evento3.jpg"
            }
        );
        console.log('IndexedDB pronta para uso.');
    };

    const idQuery = store.get(1);
    const tituloQuery = tituloIndex.get("Comemorações do 7º aniversário da ESS na UAc");
    const dataQuery = dataIndex.get("2026-05-30");

    idQuery.onsuccess = function() {
        console.log('Evento com ID 1:', idQuery.result);
    }
    tituloQuery.onsuccess = function() {
        console.log('Evento com título "Comemorações do 7º aniversário da ESS na UAc":', tituloQuery.result);
    }
    dataQuery.onsuccess = function() {
        console.log('Evento com data "2026-05-30":', dataQuery.result);
    }

    

    transaction.oncomplete = function() {
        db.close();
    };



    request.onerror = function() {
        console.error('Erro ao aceder à IndexedDB:', request.error);
    };
});
