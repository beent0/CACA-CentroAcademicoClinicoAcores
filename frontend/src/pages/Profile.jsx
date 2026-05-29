import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/api';

function Profile() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telemovel, setTelemovel] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();
  const { token, logout, login } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await authService.getProfile();
        const user = res.data.user;
        setNome(user.nome);
        setEmail(user.email);
        setTelemovel(user.telemovel || '');
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        }
      }
    };

    fetchProfile();
  }, [token, navigate, logout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    try {
      const updateData = { nome, telemovel };
      if (password) updateData.password = password;

      const res = await authService.updateProfile(updateData);

      login(res.data.user, token); // Atualiza o estado global com os novos dados
      setMessage({ text: 'Perfil atualizado com sucesso!', type: 'success' });
      setPassword('');
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Erro ao atualizar perfil.', type: 'error' });
    }
  };

  return (
    <section className="section" style={{ minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="section-header">
          <span className="subtitle">UTILIZADOR</span>
          <h2>O Meu Perfil</h2>
        </div>

        <div className="admin-form-container">
          {message.text && (
            <div className={`pop-up ${message.type}`} style={{ 
              display: 'block', 
              marginBottom: '20px', 
              padding: '10px', 
              borderRadius: '4px',
              backgroundColor: message.type === 'success' ? '#29B89E' : '#FF6B6B',
              color: 'white'
            }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome Completo</label>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Email (Não pode ser alterado)</label>
              <input type="email" value={email} disabled style={{ backgroundColor: '#f5f5f5' }} />
            </div>

            <div className="form-group">
              <label>Telemóvel</label>
              <input type="text" value={telemovel} onChange={(e) => setTelemovel(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Nova Palavra-passe (Deixe vazio para manter a atual)</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>Atualizar Perfil</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Profile;
