import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { eventService, subscriberService, adminService } from '../services/api';

function AdminPanel() {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('events');

  // Estados de dados
  const [events, setEvents] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [users, setUsers] = useState([]);

  // Estados do Formulário de Eventos
  const [eventId, setEventId] = useState('');
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

  // Carregamento de dados
  const fetchEvents = async () => {
    try {
      const res = await eventService.getAll();
      setEvents(res.data.data);
    } catch (err) {
      console.warn("Erro ao obter eventos:", err);
    }
  };

  const fetchSubscribers = async () => {
    try {
      const res = await subscriberService.getAll();
      setSubscribers(res.data.data);
    } catch (err) {
      console.warn("Erro ao obter subscritores:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await adminService.getUsers();
      setUsers(res.data.utilizadores);
    } catch (err) {
      console.warn("Erro ao obter utilizadores:", err);
    }
  };

  useEffect(() => {
    if (activeTab === 'events') fetchEvents();
    if (activeTab === 'subscribers') fetchSubscribers();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab]);

  // Toast Helper
  const showToast = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast({ text: '', type: '' }), 3000);
  };

  // --- LÓGICA DE EVENTOS ---
  useEffect(() => {
    let active = true;
    const obterPrevisaoClimatica = async () => {
      if (!local || !data || !hora) {
        setClimaInfo(null);
        return;
      }
      setWeatherLoading(true);
      if (!latitude || !longitude) {
        usarSimulacaoClimaticaLocal();
        return;
      }
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode&timezone=auto`;
      try {
        const response = await fetch(url);
        const dataJson = await response.json();
        if (!active) return;
        const horaTratada = (hora && hora.includes(':')) ? hora.split(':')[0] : (hora || '12');
        const horaFormatada = horaTratada.padStart(2, '0');
        const targetDateTimePrefix = `${data}T${horaFormatada}`;
        const matchIndex = dataJson.hourly.time.findIndex(t => t.startsWith(targetDateTimePrefix));
        if (matchIndex !== -1) {
          const tempVal = Math.round(dataJson.hourly.temperature_2m[matchIndex]);
          const codeVal = dataJson.hourly.weathercode[matchIndex];
          const wmoCodes = {
            0: { desc: "Céu limpo", icon: "01d" },
            1: { desc: "Principalmente limpo", icon: "02d" },
            2: { desc: "Parcialmente nublado", icon: "03d" },
            3: { desc: "Encoberto", icon: "04d" },
            45: { desc: "Nevoeiro", icon: "50d" },
            48: { desc: "Nevoeiro com depósito", icon: "50d" },
            61: { desc: "Chuva fraca", icon: "10d" },
            95: { desc: "Trovoada", icon: "11d" }
          };
          const matchedClima = wmoCodes[codeVal] || { desc: "Céu limpo", icon: "01d" };
          setClimaInfo({
            temp: `${tempVal}°C`,
            desc: matchedClima.desc,
            icon: `https://openweathermap.org/img/wn/${matchedClima.icon}.png`
          });
        }
      } catch (err) {
        if (active) usarSimulacaoClimaticaLocal();
      } finally {
        if (active) setWeatherLoading(false);
      }
    };

    const usarSimulacaoClimaticaLocal = () => {
      if (!active) return;
      const climasSimulados = [
        { temp: "18°C", desc: "Céu pouco nublado", icon: "https://openweathermap.org/img/wn/02d.png" },
        { temp: "16°C", desc: "Chuva fraca", icon: "https://openweathermap.org/img/wn/10d.png" },
        { temp: "21°C", desc: "Sol radiante", icon: "https://openweathermap.org/img/wn/01d.png" },
        { temp: "17°C", desc: "Nublado", icon: "https://openweathermap.org/img/wn/03d.png" }
      ];
      const index = Math.abs(local.length) % climasSimulados.length;
      setClimaInfo(climasSimulados[index]);
      setWeatherLoading(false);
    };

    const timeoutId = setTimeout(obterPrevisaoClimatica, 500);
    return () => { active = false; clearTimeout(timeoutId); };
  }, [data, hora, latitude, longitude, local]);

  const handleEventEdit = (evento) => {
    setErrors({});
    setEventId(evento._id);
    setTitulo(evento.titulo);
    setDescricao(evento.descricao);
    setData(evento.data);
    setHora(evento.hora);
    setLocal(evento.local);
    setLatitude(evento.latitude || '');
    setLongitude(evento.longitude || '');
    setImagem(evento.imagem);
    setClimaInfo(evento.clima);
    document.getElementById('admin-form-title')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEventDelete = async (id) => {
    if (!window.confirm('Eliminar este evento?')) return;
    try {
      await eventService.delete(id);
      showToast('Evento eliminado!');
      fetchEvents();
    } catch (err) {
      showToast('Erro ao eliminar.', 'error');
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!titulo.trim()) newErrors.titulo = 'Título obrigatório';
    if (!descricao.trim()) newErrors.descricao = 'Descrição obrigatória';
    if (!data) newErrors.data = 'Data obrigatória';
    if (!hora.trim()) newErrors.hora = 'Hora obrigatória';
    if (!local.trim()) newErrors.local = 'Local obrigatório';
    if (!imagem.trim()) newErrors.imagem = 'Imagem obrigatória';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const evento = { titulo, descricao, data, hora, local, imagem, latitude, longitude, clima: climaInfo };
    try {
      if (eventId) {
        await eventService.update(eventId, evento);
        showToast('Evento atualizado!');
      } else {
        await eventService.create(evento);
        showToast('Evento criado!');
      }
      resetEventForm();
      fetchEvents();
    } catch (err) {
      showToast('Erro ao guardar.', 'error');
    }
  };

  const resetEventForm = () => {
    setEventId(''); setTitulo(''); setDescricao(''); setData(''); setHora(''); setLocal(''); setLatitude(''); setLongitude(''); setImagem(''); setClimaInfo(null); setErrors({});
  };

  // --- LÓGICA DE UTILIZADORES ---
  const handleUserToggleRole = async (u) => {
    if (u._id === currentUser.id) return showToast('Não pode alterar o seu role.', 'error');
    const newRole = u.role === 'admin' ? 'regular' : 'admin';
    try {
      await adminService.updateRole(u._id, newRole);
      showToast('Role atualizado!');
      fetchUsers();
    } catch (err) {
      showToast('Erro ao atualizar role.', 'error');
    }
  };

  const handleUserDelete = async (id) => {
    if (id === currentUser.id) return showToast('Não pode eliminar a sua conta.', 'error');
    if (!window.confirm('Eliminar este utilizador permanentemente?')) return;
    try {
      await adminService.deleteUser(id);
      showToast('Utilizador eliminado!');
      fetchUsers();
    } catch (err) {
      showToast('Erro ao eliminar.', 'error');
    }
  };

  // --- LÓGICA DE SUBSCRITORES ---
  const handleSubscriberDelete = async (id) => {
    if (!window.confirm('Remover subscritor?')) return;
    try {
      await subscriberService.delete(id);
      showToast('Subscritor removido!');
      fetchSubscribers();
    } catch (err) {
      showToast('Erro ao remover.', 'error');
    }
  };

  const handleExportCSV = () => {
    if (subscribers.length === 0) return showToast('Sem subscritores.', 'error');
    let csv = "Nome,Email,Telefone,Mensagem\n";
    subscribers.forEach(s => csv += `"${s.nome}","${s.email}","${s.telefone || ""}","${(s.mensagem || "").replace(/\n/g, ' ')}"\n`);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "subscritores.csv";
    link.click();
    showToast('Exportado com sucesso!');
  };

  return (
    <section className="section">
      <div className="container">
        
        {toast.text && (
          <div style={{
            position: 'fixed', top: '20px', right: '20px', padding: '12px 24px', borderRadius: '6px',
            backgroundColor: toast.type === 'success' ? '#29B89E' : '#FF6B6B', color: '#fff', fontWeight: 'bold', zIndex: 9999
          }}>
            {toast.text}
          </div>
        )}

        <div className="section-header">
          <span className="subtitle">PAINEL DE CONTROLO</span>
          <h2>Administração</h2>
        </div>

        {/* Navegação por Tabs */}
        <div className="admin-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
          <button 
            className={`btn ${activeTab === 'events' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => setActiveTab('events')}
          >
            Eventos
          </button>
          <button 
            className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => setActiveTab('users')}
          >
            Utilizadores
          </button>
          <button 
            className={`btn ${activeTab === 'subscribers' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => setActiveTab('subscribers')}
          >
            Subscritores
          </button>
        </div>

        {/* TAB EVENTOS */}
        {activeTab === 'events' && (
          <div className="admin-grid">
            <div className="admin-form-container">
              <h3 id="admin-form-title">{eventId ? 'Editar Evento' : 'Novo Evento'}</h3>
              <form onSubmit={handleEventSubmit}>
                <div className="form-group">
                  <label>Título</label>
                  <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} style={{ border: errors.titulo ? '1px solid red' : '' }} />
                </div>
                <div className="form-group">
                  <label>Descrição</label>
                  <textarea rows={3} value={descricao} onChange={e => setDescricao(e.target.value)} style={{ border: errors.descricao ? '1px solid red' : '' }}></textarea>
                </div>
                <div className="admin-form-row">
                  <div className="form-group">
                    <label>Data</label>
                    <input type="date" value={data} onChange={e => setData(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Hora</label>
                    <input type="text" value={hora} onChange={e => setHora(e.target.value)} placeholder="14:00" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Local</label>
                  <input type="text" value={local} onChange={e => setLocal(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>URL Imagem</label>
                  <input type="text" value={imagem} onChange={e => setImagem(e.target.value)} />
                </div>
                <div className="admin-actions" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button type="submit" className="btn btn-primary">Guardar</button>
                  {eventId && <button type="button" className="btn btn-secondary" onClick={resetEventForm}>Cancelar</button>}
                </div>
              </form>
            </div>
            <div className="admin-list-container">
              <h3>Eventos Atuais ({events.length})</h3>
              <div className="admin-events-list">
                {events.map(e => (
                  <div key={e._id} className="admin-event-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
                    <div><strong>{e.titulo}</strong><br/><small>{e.data} | {e.local}</small></div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button className="btn-sm btn-edit" onClick={() => handleEventEdit(e)}>📝</button>
                      <button className="btn-sm btn-delete" onClick={() => handleEventDelete(e._id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB UTILIZADORES */}
        {activeTab === 'users' && (
          <div className="admin-list-container" style={{ width: '100%' }}>
            <h3 style={{ marginBottom: '20px' }}>Gestão de Utilizadores ({users.length})</h3>
            <div className="admin-events-list">
              {users.map(u => (
                <div key={u._id} className="admin-event-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #eee' }}>
                  <div className="admin-event-info">
                    <strong style={{ fontSize: '1.1rem' }}>{u.nome}</strong> 
                    {u._id === currentUser.id && <span style={{ marginLeft: '10px', fontSize: '0.7rem', color: '#29B89E', fontWeight: 'bold' }}>(EU)</span>}
                    <br/>
                    <small style={{ color: '#666' }}>{u.email}</small>
                    <div style={{ marginTop: '5px' }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold',
                        backgroundColor: u.role === 'admin' ? '#29B89E' : '#777',
                        color: '#fff'
                      }}>
                        {u.role.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="admin-item-actions" style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      className="btn-sm btn-edit" 
                      onClick={() => handleUserToggleRole(u)}
                      disabled={u._id === currentUser.id}
                      style={{ opacity: u._id === currentUser.id ? 0.5 : 1, cursor: u._id === currentUser.id ? 'not-allowed' : 'pointer' }}
                    >
                      Alternar Cargo
                    </button>
                    <button 
                      className="btn-sm btn-delete" 
                      onClick={() => handleUserDelete(u._id)}
                      disabled={u._id === currentUser.id}
                      style={{ opacity: u._id === currentUser.id ? 0.5 : 1, cursor: u._id === currentUser.id ? 'not-allowed' : 'pointer' }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB SUBSCRITORES */}
        {activeTab === 'subscribers' && (
          <div className="admin-list-container" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Lista de Subscritores ({subscribers.length})</h3>
              <button onClick={handleExportCSV} className="btn btn-secondary">Exportar CSV</button>
            </div>
            <div className="admin-events-list" style={{ marginTop: '20px' }}>
              {subscribers.map(s => (
                <div key={s._id} className="admin-event-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #eee' }}>
                  <div>
                    <strong>{s.nome}</strong> <small style={{ color: '#666' }}>({s.email})</small><br/>
                    <small>{s.mensagem}</small>
                  </div>
                  <button className="btn-sm btn-delete" onClick={() => handleSubscriberDelete(s._id)}>Remover</button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

export default AdminPanel;
