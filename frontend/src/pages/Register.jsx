import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telemovel, setTelemovel] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { nome, email, telemovel, password });
      
      login({ nome, email, telemovel, role: 'regular' }, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao registar.');
    }
  };

  return (
    <section className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '450px', margin: '0 auto' }}>
        <div className="admin-form-container">
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Registo</h2>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome Completo</label>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Telemóvel (Opcional)</label>
              <input type="text" value={telemovel} onChange={(e) => setTelemovel(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Palavra-passe</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Registar</button>
          </form>
          <p style={{ marginTop: '15px', textAlign: 'center' }}>
            Já tem conta? <Link to="/login" className="link-blue">Faça login</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Register;
