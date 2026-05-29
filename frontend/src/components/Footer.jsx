import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

// Componente Footer
function Footer() {
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [isOverFooter, setIsOverFooter] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [telemovel, setTelemovel] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [indicativo, setIndicativo] = useState('+351');
  const [assunto, setAssunto] = useState('');
  
  // Estados para controlar dropdowns ativos
  const [isIndicativoOpen, setIsIndicativoOpen] = useState(false);
  const [isAssuntoOpen, setIsAssuntoOpen] = useState(false);

  // Mensagens de feedback
  const [feedback, setFeedback] = useState({ text: '', type: '' });

  // Lista de indicativos suportados
  const indicativos = [
    { value: "+351", label: "Portugal" },
    { value: "+49", label: "Alemanha" },
    { value: "+61", label: "Austrália" },
    { value: "+55", label: "Brasil" },
    { value: "+1", label: "EUA" },
    { value: "+33", label: "França" },
    { value: "+39", label: "Itália" },
    { value: "+81", label: "Japão" },
    { value: "+44", label: "Reino Unido" },
    { value: "+41", label: "Suíça" }
  ];

  // Lista de assuntos suportados
  const assuntos = [
    { value: "ajuda", label: "Ajuda", key: "form_assunto_ajuda" },
    { value: "evento", label: "Nossos Eventos", key: "form_assunto_evento" },
    { value: "marcacao", label: "Marcação", key: "form_assunto_marcacao" },
    { value: "ensino", label: "Dúvida sobre Ensino", key: "form_assunto_ensino" }
  ];

  // Deteção de scroll para botão voltar ao topo
  useEffect(() => {
    const handleScroll = () => {
      const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
      if (alturaTotal <= 0) return;
      const percentagemScroll = (window.scrollY / alturaTotal) * 100;
      
      setShowScrollBtn(percentagemScroll > 10);

      const footer = document.getElementById('contactos');
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const limiteBotao = window.innerHeight - 70;
        setIsOverFooter(footerRect.top < limiteBotao);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const voltarAoTopo = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Alterna a exibição do Painel de Administração de Eventos
  const handleToggleAdmin = (e) => {
    e.preventDefault();
    if (user && user.role === 'admin') {
      navigate('/admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/login');
    }
  };

  // Validação e Submissão do Formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ text: '', type: '' });

    // Validações básicas
    if (!nome.trim()) {
      setFeedback({ text: 'Por favor, insira o seu nome.', type: 'error' });
      return;
    }
    
    const telRegex = /^[0-9]{9,15}$/;
    if (!telemovel.trim() || !telRegex.test(telemovel.replace(/\s/g, ''))) {
      setFeedback({ text: 'Por favor, introduza um número de telemóvel válido.', type: 'error' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setFeedback({ text: 'Por favor, introduza um endereço de e-mail válido.', type: 'error' });
      return;
    }

    if (!assunto) {
      setFeedback({ text: 'Por favor, selecione um assunto.', type: 'error' });
      return;
    }

    if (!mensagem.trim()) {
      setFeedback({ text: 'Por favor, escreva a sua mensagem.', type: 'error' });
      return;
    }

    try {
      // Envia para a API do Backend
      await axios.post('http://localhost:5000/api/subscribers', {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        telefone: `${indicativo} ${telemovel.trim()}`,
        mensagem: mensagem.trim(),
        assunto: assunto
      });

      setFeedback({ text: 'Subscrição e mensagem enviadas com sucesso!', type: 'success' });
      
      // Limpa os campos
      setNome('');
      setTelemovel('');
      setEmail('');
      setMensagem('');
      setAssunto('');

    } catch (err) {
      console.error(err);
      setFeedback({ 
        text: err.response?.data?.message || 'Erro ao enviar subscrição.', 
        type: 'error' 
      });
    }
  };

  const activeIndicativoLabel = indicativos.find(i => i.value === indicativo)?.label || 'Portugal';
  const activeAssuntoLabel = assuntos.find(a => a.value === assunto)?.label || 'Seleciona um assunto...';

  return (
    <>
      <footer id="contactos" className="footer">
        <div className="container footer-flex">
          <div className="footer-col">
            <h5 data-i18n="footer_contactos">Contactos</h5>
            <p><strong data-i18n="footer_email_label">E-mail:</strong> cac-a@uac.pt</p>
            <p><strong data-i18n="footer_telefone_label">Tel:</strong> (+351) 296 965 824</p>
            <p className="small" data-i18n="footer_horario">(dias úteis das 11:00 às 18:00)</p>
            <div className="socials">
              <a href="#">Facebook |</a>
              <a href="#">Instagram |</a>
              <a href="#">Youtube</a>
            </div>
          </div>

          <div className="footer-col">
            <h5 data-i18n="footer_morada">Morada</h5>
            <p data-i18n="footer_universidade">Universidade dos Açores</p>
            <p data-i18n="footer_polo">Polo São Miguel</p>
            <p data-i18n="footer_rua">R. Mãe de Deus</p>
            <p data-i18n="footer_cidade">9500-321 Ponta Delgada</p>
          </div>

          <div className="newsletter">
            <form onSubmit={handleSubmit} className="footer-form" id="form-newsletter" noValidate>
              <div className="footer-col newsletter-info">
                <h5 data-i18n="newsletter_titulo">Newsletter</h5>
                
                <input 
                  placeholder="Nome e Apelido" 
                  data-i18n-attr="placeholder:form_nome_placeholder" 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />

                <div className="telemovel-container">
                  <div className="dropdown-indicativo" style={{ position: 'relative' }}>
                    <div 
                      className="dropdown-selected" 
                      onClick={() => setIsIndicativoOpen(!isIndicativoOpen)}
                      style={{ cursor: 'pointer' }}
                    >
                      {activeIndicativoLabel} ({indicativo})
                    </div>
                    {isIndicativoOpen && (
                      <ul className="dropdown-options" style={{ display: 'block', position: 'absolute', top: '100%', left: 0, zIndex: 10, width: '100%' }}>
                        {indicativos.map((ind) => (
                          <li 
                            key={ind.value} 
                            onClick={() => {
                              setIndicativo(ind.value);
                              setIsIndicativoOpen(false);
                            }}
                            style={{ padding: '8px', cursor: 'pointer' }}
                          >
                            {ind.label} ({ind.value})
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  <input 
                    placeholder="Telemóvel" 
                    data-i18n-attr="placeholder:form_telemovel_placeholder" 
                    value={telemovel}
                    onChange={(e) => setTelemovel(e.target.value)}
                  />
                </div>

                <input 
                  placeholder="exemplo@email.com" 
                  data-i18n-attr="placeholder:form_email_placeholder" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="footer-col newsletter-msg">
                <h5 data-i18n="form_enviar_mensagem">Enviar Mensagem</h5>
                
                <div className="dropdown-assunto" style={{ position: 'relative' }}>
                  <div 
                    className="dropdown-selected" 
                    onClick={() => setIsAssuntoOpen(!isAssuntoOpen)}
                    style={{ cursor: 'pointer' }}
                  >
                    {activeAssuntoLabel}
                  </div>
                  {isAssuntoOpen && (
                    <ul className="dropdown-options" style={{ display: 'block', position: 'absolute', top: '100%', left: 0, zIndex: 10, width: '100%' }}>
                      {assuntos.map((as) => (
                        <li 
                          key={as.value} 
                          onClick={() => {
                            setAssunto(as.value);
                            setIsAssuntoOpen(false);
                          }}
                          style={{ padding: '8px', cursor: 'pointer' }}
                        >
                          {as.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <textarea 
                  rows={4} 
                  placeholder="A sua mensagem" 
                  data-i18n-attr="placeholder:form_mensagem_placeholder"
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                ></textarea>
              </div>

              <div className="newsletter-actions">
                {feedback.text && (
                  <div 
                    className={`pop-up ${feedback.type}`} 
                    style={{ display: 'block', padding: '8px', borderRadius: '4px', marginBottom: '8px', color: '#fff', backgroundColor: feedback.type === 'success' ? '#29B89E' : '#FF6B6B' }}
                  >
                    {feedback.text}
                  </div>
                )}
                <button type="submit" className="btn btn-submit" data-i18n="form_submeter">
                  Submeter
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="container footer-bottom">
          <p>
            &copy; 2026 Centro Académico Clínico dos Açores. |{' '}
            <a href="#admin" onClick={handleToggleAdmin}>
              Admin
            </a>
          </p>
        </div>
      </footer>

      <button 
        id="to-top"
        className={`btn btn-primary ${isOverFooter ? 'over-footer' : ''}`}
        style={{ display: showScrollBtn ? 'flex' : 'none', color: 'white' }}
        onClick={voltarAoTopo}
      >
        ↑
      </button>
    </>
  );
}

export default Footer;
