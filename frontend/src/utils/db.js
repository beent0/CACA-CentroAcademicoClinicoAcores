// Gestão de Base de Dados IndexedDB local (EventosDB e NewsletterDB)

const DB_NAME = "EventosDB";
const DB_VERSION = 2;
const STORE_NAME = "eventos";

/**
 * Inicializa a ligação ao IndexedDB e semeia dados se estiver vazio.
 */
export function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error("Erro ao abrir a IndexedDB:", event);
      reject(event);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      
      // Sementeira automática de dados se a ObjectStore estiver vazia
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const countRequest = store.count();

      countRequest.onsuccess = () => {
        if (countRequest.result === 0) {
          const initialData = [
            { 
              titulo: "Comemorações do 7º aniversário da ESS na UAc", 
              descricao: "Celebração do aniversário com diversas atividades ligadas à Escola Superior de Saúde.", 
              data: "2026-05-06", 
              hora: "14:00", 
              local: "Auditório Norte, UAc", 
              imagem: "media/evento1.jpg" 
            },
            { 
              titulo: "Open day 2026 | Enfermagem", 
              descricao: "Dia aberto para apresentar o curso de Enfermagem e demonstrar técnicas clínicas básicas.", 
              data: "2026-05-30", 
              hora: "09:00", 
              local: "Campus de Angra do Heroísmo", 
              imagem: "media/evento2.jpg" 
            },
            { 
              titulo: "V Congresso Internacional Enfermagem", 
              descricao: "Congresso internacional de alta relevância académica com presença de conceituados especialistas de saúde.", 
              data: "2026-10-28", 
              hora: "10:00", 
              local: "Auditório Norte, UAc", 
              imagem: "media/evento3.jpg" 
            }
          ];
          initialData.forEach(item => store.put(item));
          transaction.oncomplete = () => {
            resolve(db);
          };
        } else {
          resolve(db);
        }
      };
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
        store.createIndex("titulo", "titulo", { unique: false });
        store.createIndex("descricao", "descricao", { unique: false });
        store.createIndex("data", "data", { unique: false });
        store.createIndex("hora", "hora", { unique: false });
        store.createIndex("local", "local", { unique: false });
      }
    };
  });
}

/**
 * Obtém todos os eventos do IndexedDB.
 */
export function getAllEvents() {
  return initDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (err) => {
        reject(err);
      };
    });
  });
}

/**
 * Salva (adiciona ou atualiza) um evento no IndexedDB.
 */
export function saveEvent(evento) {
  return initDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(evento);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (err) => {
        reject(err);
      };
    });
  });
}

/**
 * Elimina um evento do IndexedDB por ID.
 */
export function deleteEvent(id) {
  return initDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (err) => {
        reject(err);
      };
    });
  });
}

/**
 * Inicializa a base de dados de subscritores de newsletter.
 */
export function initNewsletterDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("NewsletterDB", 1);

    request.onerror = (event) => {
      console.error("Erro ao abrir NewsletterDB:", event);
      reject(event);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("subscribers")) {
        const store = db.createObjectStore("subscribers", { keyPath: "email" });
        store.createIndex("nome", "nome", { unique: false });
        store.createIndex("telefone", "telefone", { unique: false });
      }
    };
  });
}

/**
 * Obtém todos os subscritores da newsletter.
 */
export function getAllSubscribers() {
  return initNewsletterDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("subscribers", "readonly");
      const store = transaction.objectStore("subscribers");
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (err) => {
        reject(err);
      };
    });
  });
}

/**
 * Guarda um subscritor de newsletter.
 */
export function saveSubscriber(sub) {
  return initNewsletterDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("subscribers", "readwrite");
      const store = transaction.objectStore("subscribers");
      const request = store.put(sub);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (err) => {
        reject(err);
      };
    });
  });
}
