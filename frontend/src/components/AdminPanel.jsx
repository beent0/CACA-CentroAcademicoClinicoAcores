import React from 'react';

// Componente AdminPanel - Painel de administração de eventos (CRUD e subscritores de newsletter)
function AdminPanel() {
  return (
    <section id="admin-section" className="section admin-only">
      <div className="container">
        <div className="section-header">
          <span className="subtitle" data-i18n="admin_subtitle">ADMINISTRAÇÃO</span>
          <h2 id="admin-title-h2" data-i18n="admin_title">Gestão de Eventos</h2>
        </div>
        
        <div className="admin-grid">
          {/* Formulário de criação/edição */}
          <div className="admin-form-container">
            <h3 id="admin-form-title" data-i18n="admin_form_title">Adicionar Evento</h3>
            <form id="event-form" noValidate>
              <input type="hidden" id="event-id" />
              
              <div className="form-group">
                <label htmlFor="event-titulo" data-i18n="admin_titulo_label">Título</label>
                <input type="text" id="event-titulo" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="event-desc" data-i18n="admin_desc_label">Descrição</label>
                <textarea id="event-desc" rows={3} required></textarea>
              </div>
              
              <div className="admin-form-row">
                <div className="form-group">
                  <label htmlFor="event-data" data-i18n="admin_data_label">Data</label>
                  <input type="date" id="event-data" required />
                </div>
                <div className="form-group">
                  <label htmlFor="event-hora" data-i18n="admin_hora_label">Hora</label>
                  <input type="time" id="event-hora" required />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="event-local" data-i18n="admin_local_label">Local</label>
                <input id="event-local" required />
                <input type="hidden" id="event-lat" />
                <input type="hidden" id="event-lng" />
              </div>
              
              {/* Previsão do tempo automática no local */}
              <div className="weather-preview" id="weather-preview"></div>
              
              <div className="form-group">
                <label htmlFor="event-imagem" data-i18n="admin_imagem_label">URL da Imagem</label>
                <input type="text" id="event-imagem" placeholder="media/evento1.png" required />
              </div>
              
              <div className="admin-actions">
                <button type="submit" className="btn btn-primary" id="btn-save-event" data-i18n="admin_save_btn">
                  Guardar Evento
                </button>
                <button type="button" className="btn btn-secondary hidden" id="btn-cancel-edit" data-i18n="admin_cancel_btn">
                  Cancelar
                </button>
              </div>
            </form>
          </div>

          {/* Lista de eventos atuais no painel de administração */}
          <div className="admin-list-container">
            <h3 data-i18n="admin_current_events">Eventos Atuais</h3>
            <div id="admin-events-list" className="admin-events-list">
              {/* Lista vazia temporariamente na Fase 2 */}
              <p style={{ color: '#666', fontStyle: 'italic' }}>Nenhum evento registado na IndexedDB local.</p>
            </div>
          </div>
        </div>

        {/* Lista de subscritores da newsletter */}
        <div className="admin-subscribers-container">
          <h3 data-i18n="admin_newsletter_title">Subscritores da Newsletter</h3>
          <div id="admin-subscribers-list" className="admin-events-list">
            <p style={{ color: '#666', fontStyle: 'italic' }}>Nenhum subscritor registado.</p>
          </div>
          <button id="export-subscribers" className="btn btn-secondary" data-i18n="admin_export_btn">
            Exportar (CSV)
          </button>
        </div>
      </div>
    </section>
  );
}

export default AdminPanel;
