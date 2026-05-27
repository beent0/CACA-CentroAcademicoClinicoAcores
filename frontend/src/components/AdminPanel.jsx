import React, { useState, useEffect } from 'react';
import { getAllEvents, saveEvent, deleteEvent, getAllSubscribers } from '../utils/db';

function AdminPanel() {
  // Lista de eventos e subscritores
  const [events, setEvents] = useState([]);
  const [subscribers, setSubscribers] = useState([]);

  // Estados do Formulário de Eventos
  const [id, setId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [local, setLocal] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [imagem, setImagem] = useState('');

  // Clima obtido para o evento
  const [climaInfo, setClimaInfo] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Estados de UI e Toasts
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ text: '', type: '' });

  // Carrega todos os eventos do IndexedDB
  const fetchEvents = async () => {
    try {
      const dataList = await getAllEvents();
      setEvents(dataList);
    } catch (err) {
      console.warn("Erro ao obter eventos no admin:", err);
    }
  };

  // Carrega todos os subscritores do IndexedDB
  const fetchSubscribers = async () => {
    try {
      const subList = await getAllSubscribers();
      setSubscribers(subList);
    } catch (err) {
      console.warn("Erro ao obter subscritores no admin:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchSubscribers();

    // Listeners de atualizações globais
    const handleEventsUpdate = () => {
      fetchEvents();
    };

    const handleSubscribersUpdate = () => {
      fetchSubscribers();
    };

    window.addEventListener('eventsUpdated', handleEventsUpdate);
    window.addEventListener('subscribersUpdated', handleSubscribersUpdate);

    return () => {
      window.removeEventListener('eventsUpdated', handleEventsUpdate);
      window.removeEventListener('subscribersUpdated', handleSubscribersUpdate);
    };
  }, []);

  // Efeito de meteorologia: Dispara sempre que data, hora, lat, lng ou local mudam!
  useEffect(() => {
    const obterPrevisaoClimatica = async () => {
      // Se não tiver local, limpa o clima
      if (!local) {
        setClimaInfo(null);
        return;
      }

      setWeatherLoading(true);

      // Se faltarem coordenadas, usa a simulação local
      if (!latitude || !longitude) {
        usarSimulacaoClimaticaLocal();
        return;
      }

      // Consulta à API Open-Meteo
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode&timezone=auto`;
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro na API Open-Meteo");
        
        const dataJson = await response.json();
        
        // Formata a data e hora para pesquisa no Open-Meteo
        const horaTratada = (hora && hora.includes(':')) ? hora.split(':')[0] : (hora || '12');
        const horaFormatada = horaTratada.padStart(2, '0');
        const targetDateTimePrefix = `${data}T${horaFormatada}`;

        const hourlyTimes = dataJson.hourly.time;
        const matchIndex = hourlyTimes.findIndex(t => t.startsWith(targetDateTimePrefix));

        if (matchIndex !== -1) {
          const tempVal = Math.round(dataJson.hourly.temperature_2m[matchIndex]);
          const codeVal = dataJson.hourly.weathercode[matchIndex];

          // Códigos WMO de meteorologia
          const wmoCodes = {
            0: { desc: "Céu limpo", icon: "01d" },
            1: { desc: "Principalmente limpo", icon: "02d" },
            2: { desc: "Parcialmente nublado", icon: "03d" },
            3: { desc: "Encoberto", icon: "04d" },
            45: { desc: "Nevoeiro", icon: "50d" },
            48: { desc: "Nevoeiro com depósito", icon: "50d" },
            51: { desc: "Chuvisco ligeiro", icon: "09d" },
            53: { desc: "Chuvisco moderado", icon: "09d" },
            55: { desc: "Chuvisco denso", icon: "09d" },
            61: { desc: "Chuva fraca", icon: "10d" },
            63: { desc: "Chuva moderada", icon: "10d" },
            65: { desc: "Chuva forte", icon: "10d" },
            80: { desc: "Aguaceiros fracos", icon: "09d" },
            81: { desc: "Aguaceiros moderados", icon: "09d" },
            82: { desc: "Aguaceiros violentos", icon: "09d" },
            95: { desc: "Trovoada ligeira", icon: "11d" }
          };

          const matchedClima = wmoCodes[codeVal] || { desc: "Céu limpo", icon: "01d" };

          setClimaInfo({
            temp: `${tempVal}°C`,
            desc: matchedClima.desc,
            icon: `https://openweathermap.org/img/wn/${matchedClima.icon}.png`
          });
        } else {
          // Fallback para datas futuras
          setClimaInfo({
            temp: "17°C",
            desc: "Clima ameno (Previsão disponível nos próximos 7 dias)",
            icon: "https://openweathermap.org/img/wn/02d.png"
          });
        }
      } catch (err) {
        console.warn("Erro ao obter dados do Open-Meteo, ativando fallback local:", err);
        usarSimulacaoClimaticaLocal();
      } finally {
        setWeatherLoading(false);
      }
    };

    // Simulação climática local
    const usarSimulacaoClimaticaLocal = () => {
      const climasSimulados = [
        { temp: "18°C", desc: "Céu pouco nublado", icon: "https://openweathermap.org/img/wn/02d.png" },
        { temp: "16°C", desc: "Chuva fraca", icon: "https://openweathermap.org/img/wn/10d.png" },
        { temp: "21°C", desc: "Sol radiante", icon: "https://openweathermap.org/img/wn/01d.png" },
        { temp: "17°C", desc: "Nublado", icon: "https://openweathermap.org/img/wn/03d.png" }
      ];
      const index = local.length % climasSimulados.length;
      setClimaInfo(climasSimulados[index]);
      setWeatherLoading(false);
    };

    obterPrevisaoClimatica();
  }, [data, hora, latitude, longitude, local]);

  // Inicializa Google Places Autocomplete se disponível
  useEffect(() => {
    const config = window.CONFIG || {};
    if (!config.GOOGLE_MAPS_API_KEY || config.GOOGLE_MAPS_API_KEY === 'API_KEY_HERE') return;

    const timer = setTimeout(() => {
      const inputEl = document.getElementById('event-local');
      if (inputEl && window.google && window.google.maps && window.google.maps.places) {
        try {
          const autocomplete = new window.google.maps.places.Autocomplete(inputEl, {
            types: ['establishment', 'geocode'],
            componentRestrictions: { country: 'pt' }
          });

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
              setLocal(inputEl.value);
              setLatitude(place.geometry.location.lat());
              setLongitude(place.geometry.location.lng());
            }
          });
        } catch (err) {
          console.warn("Erro ao ligar Autocomplete de locais:", err);
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const showToast = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast({ text: '', type: '' });
    }, 3000);
  };

  const handleEdit = (evento) => {
    setErrors({});
    setId(evento.id);
    setTitulo(evento.titulo);
    setDescricao(evento.descricao);
    setData(evento.data);
    setHora(evento.hora);
    setLocal(evento.local);
    setLatitude(evento.latitude || '');
    setLongitude(evento.longitude || '');
    setImagem(evento.imagem);
    setClimaInfo(evento.clima);

    // Faz scroll suave até ao formulário
    const formTitle = document.getElementById('admin-form-title');
    if (formTitle) formTitle.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Tem a certeza que deseja eliminar este evento?')) return;

    try {
      await deleteEvent(eventId);
      showToast('Evento eliminado com sucesso!', 'success');
      // Notifica o carrossel e recarrega
      window.dispatchEvent(new Event('eventsUpdated'));
    } catch (err) {
      console.error(err);
      showToast('Erro ao eliminar evento.', 'error');
    }
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const resetForm = () => {
    setErrors({});
    setId('');
    setTitulo('');
    setDescricao('');
    setData('');
    setHora('');
    setLocal('');
    setLatitude('');
    setLongitude('');
    setImagem('');
    setClimaInfo(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!titulo.trim()) newErrors.titulo = 'Título é obrigatório';
    if (!descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';
    if (!data) newErrors.data = 'Data é obrigatória';
    if (!hora.trim()) newErrors.hora = 'Hora é obrigatória';
    if (!local.trim()) newErrors.local = 'Local é obrigatório';
    if (!imagem.trim()) newErrors.imagem = 'URL da Imagem é obrigatória';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }

    const evento = {
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      data,
      hora: hora.trim(),
      local: local.trim(),
      imagem: imagem.trim(),
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      clima: climaInfo
    };

    if (id) {
      evento.id = parseInt(id);
    }

    try {
      await saveEvent(evento);
      showToast(id ? 'Evento atualizado com sucesso!' : 'Evento criado com sucesso!', 'success');
      resetForm();
      // Notifica o carrossel para atualizar
      window.dispatchEvent(new Event('eventsUpdated'));
    } catch (err) {
      console.error(err);
      showToast('Erro ao guardar o evento.', 'error');
    }
  };

  const handleExportCSV = () => {
    if (subscribers.length === 0) {
      showToast('Não existem subscritores para exportar.', 'error');
      return;
    }

    let csv = "Nome,Email,Telefone,Assunto,Mensagem\n";
    subscribers.forEach(sub => {
      const escapedNome = sub.nome.replace(/"/g, '""');
      const escapedMsg = (sub.mensagem || "").replace(/"/g, '""');
      csv += `"${escapedNome}","${sub.email}","${sub.telefone || ""}","${sub.assunto || ""}","${escapedMsg}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", "subscritores_newsletter.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Subscritores exportados com sucesso!', 'success');
  };

  return (
    <section id="admin-section" className="section admin-only">
      <div className="container">
        
        {/* Toast Notificação */}
        {toast.text && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 24px',
            borderRadius: '6px',
            backgroundColor: toast.type === 'success' ? '#29B89E' : '#FF6B6B',
            color: '#fff',
            fontWeight: 'bold',
            zIndex: 9999,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            {toast.text}
          </div>
        )}

        <div className="section-header">
          <span className="subtitle" data-i18n="admin_subtitle">ADMINISTRAÇÃO</span>
          <h2 id="admin-title-h2" data-i18n="admin_title">Gestão de Eventos</h2>
        </div>
        
        <div className="admin-grid">
          {/* Formulário de criação/edição */}
          <div className="admin-form-container">
            <h3 id="admin-form-title" data-i18n={id ? undefined : "admin_form_title"}>
              {id ? 'Editar Evento' : 'Adicionar Evento'}
            </h3>
            <form onSubmit={handleSubmit} noValidate>
              
              <div className="form-group">
                <label htmlFor="event-titulo" data-i18n="admin_titulo_label">Título</label>
                <input 
                  type="text" 
                  id="event-titulo" 
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  style={{ border: errors.titulo ? '1px solid red' : undefined }}
                  required 
                />
                {errors.titulo && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.titulo}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="event-desc" data-i18n="admin_desc_label">Descrição</label>
                <textarea 
                  id="event-desc" 
                  rows={3} 
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  style={{ border: errors.descricao ? '1px solid red' : undefined }}
                  required
                ></textarea>
                {errors.descricao && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.descricao}</span>}
              </div>
              
              <div className="admin-form-row">
                <div className="form-group">
                  <label htmlFor="event-data" data-i18n="admin_data_label">Data</label>
                  <input 
                    type="date" 
                    id="event-data" 
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    style={{ border: errors.data ? '1px solid red' : undefined }}
                    required 
                  />
                  {errors.data && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.data}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="event-hora" data-i18n="admin_hora_label">Hora</label>
                  <input 
                    type="text" 
                    id="event-hora" 
                    placeholder="Ex: 14:00"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    style={{ border: errors.hora ? '1px solid red' : undefined }}
                    required 
                  />
                  {errors.hora && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.hora}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="event-local" data-i18n="admin_local_label">Local</label>
                <input 
                  id="event-local" 
                  value={local}
                  onChange={(e) => setLocal(e.target.value)}
                  style={{ border: errors.local ? '1px solid red' : undefined }}
                  required 
                />
                {errors.local && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.local}</span>}
                
                {/* Fallback de coordenadas manuais para quem não tem API Maps */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                  <input 
                    type="number" 
                    step="any"
                    placeholder="Latitude (Opcional)" 
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    style={{ fontSize: '0.8rem', padding: '4px' }}
                  />
                  <input 
                    type="number" 
                    step="any"
                    placeholder="Longitude (Opcional)" 
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    style={{ fontSize: '0.8rem', padding: '4px' }}
                  />
                </div>
              </div>
              
              {/* Previsão do tempo automática no local */}
              <div className="weather-preview" id="weather-preview" style={{ display: climaInfo || weatherLoading ? 'block' : 'none' }}>
                {weatherLoading ? (
                  <p style={{ fontStyle: 'italic', fontSize: '0.85rem', color: '#666' }}>A obter previsão do tempo...</p>
                ) : climaInfo ? (
                  <div className="weather-preview-container">
                    <div className="weather-info-row" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="weather-preview-temperatura" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{climaInfo.temp}</span>
                      <img className="weather-preview-icon" src={climaInfo.icon} alt="Tempo" style={{ width: '32px', height: '32px' }} />
                      <span className="weather-preview-descricao" style={{ textTransform: 'capitalize', fontSize: '0.9rem' }}>{climaInfo.desc}</span>
                    </div>
                    <p className="weather-preview-dados" style={{ fontSize: '0.75rem', color: '#666', margin: '4px 0 0 0' }}>Previsão associada ao local e data selecionados</p>
                  </div>
                ) : null}
              </div>
              
              <div className="form-group" style={{ marginTop: '10px' }}>
                <label htmlFor="event-imagem" data-i18n="admin_imagem_label">URL da Imagem</label>
                <input 
                  type="text" 
                  id="event-imagem" 
                  placeholder="media/evento1.jpg" 
                  value={imagem}
                  onChange={(e) => setImagem(e.target.value)}
                  style={{ border: errors.imagem ? '1px solid red' : undefined }}
                  required 
                />
                {errors.imagem && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.imagem}</span>}
              </div>
              
              <div className="admin-actions" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button type="submit" className="btn btn-primary" id="btn-save-event" data-i18n="admin_save_btn">
                  Guardar Evento
                </button>
                {id && (
                  <button type="button" className="btn btn-secondary" onClick={handleCancelEdit} data-i18n="admin_cancel_btn">
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Lista de eventos atuais no painel de administração */}
          <div className="admin-list-container">
            <h3 data-i18n="admin_current_events">Eventos Atuais</h3>
            <div id="admin-events-list" className="admin-events-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {events.length === 0 ? (
                <p style={{ color: '#666', fontStyle: 'italic' }}>Nenhum evento registado na IndexedDB local.</p>
              ) : (
                events.map((evento) => (
                  <div key={evento.id} className="admin-event-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid #eee' }}>
                    <div className="admin-event-info">
                      <h4 style={{ margin: 0, fontSize: '1rem' }}>{evento.titulo}</h4>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#666' }}>{evento.data} | {evento.local}</p>
                    </div>
                    <div className="admin-item-actions" style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-sm btn-edit" onClick={() => handleEdit(evento)}>Editar</button>
                      <button className="btn-sm btn-delete" onClick={() => handleDelete(evento.id)}>Eliminar</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Lista de subscritores da newsletter */}
        <div className="admin-subscribers-container" style={{ marginTop: '30px' }}>
          <h3 data-i18n="admin_newsletter_title">Subscritores da Newsletter</h3>
          <div id="admin-subscribers-list" className="admin-events-list" style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '15px' }}>
            {subscribers.length === 0 ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>Nenhum subscritor registado.</p>
            ) : (
              subscribers.map((sub) => (
                <div key={sub.email} className="admin-event-item" style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                  <div className="admin-event-info" style={{ fontSize: '0.9rem' }}>
                    <strong style={{ fontSize: '0.95rem' }}>{sub.nome}</strong> ({sub.email})<br />
                    <span>📞 {sub.telefone || "sem telefone"}</span> | <span>✉️ Assunto: {sub.assunto}</span><br />
                    <span style={{ fontStyle: 'italic', color: '#555' }}>💬 "{sub.mensagem}"</span>
                  </div>
                </div>
              ))
            )}
          </div>
          <button onClick={handleExportCSV} className="btn btn-secondary" data-i18n="admin_export_btn">
            Exportar (CSV)
          </button>
        </div>
      </div>
    </section>
  );
}

export default AdminPanel;
