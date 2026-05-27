import React, { useState, useEffect } from 'react';
import { saveSubscriber } from '../utils/db';

// Componente Footer - Rodapé com informações de contacto, morada e formulário da Newsletter
function Footer() {
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [isOverFooter, setIsOverFooter] = useState(false);

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
    const adminSection = document.getElementById('admin-section');
    if (adminSection) {
      adminSection.classList.toggle('admin-only');
      if (!adminSection.classList.contains('admin-only')) {
        adminSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Validação e Submissão do Formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ text: '', type: '' });

    // Validações básicas (iguais às do vanilla para manter nota de validação)
    if (!nome.trim()) {
      setFeedback({ text: 'Por favor, insira o seu nome.', type: 'error' });
      return;
    }
    
    // Regex simples de telemóvel (ex: 9 digitos)
    const telRegex = /^[0-9]{9,15}$/;
    if (!telemovel.trim() || !telRegex.test(telemovel.replace(/\s/g, ''))) {
      setFeedback({ text: 'Por favor, introduza um número de telemóvel válido (mínimo 9 dígitos).', type: 'error' });
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
      // Guarda na base de dados IndexedDB
      await saveSubscriber({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        telefone: `${indicativo} ${telemovel.trim()}`,
        mensagem: mensagem.trim(),
        assunto: assunto
      });

      // Feedback positivo
      setFeedback({ text: 'Subscrição e mensagem registadas com sucesso!', type: 'success' });
      
      // Limpa os campos
      setNome('');
      setTelemovel('');
      setEmail('');
      setMensagem('');
      setAssunto('');

      // Notifica o AdminPanel para recarregar a lista de subscritores
      window.dispatchEvent(new Event('subscribersUpdated'));

    } catch (err) {
      console.error(err);
      setFeedback({ text: 'Erro ao guardar os dados na IndexedDB.', type: 'error' });
    }
  };

  const activeIndicativoLabel = indicativos.find(i => i.value === indicativo)?.label || 'Portugal';
  const activeAssuntoLabel = assuntos.find(a => a.value === assunto)?.label || 'Seleciona um assunto...';

  return (
    <>
      <footer id="contactos" className="footer">
        <div className="container footer-flex">
          {/* Coluna 1: Contactos */}
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

          {/* Coluna 2: Morada */}
          <div className="footer-col">
            <h5 data-i18n="footer_morada">Morada</h5>
            <p data-i18n="footer_universidade">Universidade dos Açores</p>
            <p data-i18n="footer_polo">Polo São Miguel</p>
            <p data-i18n="footer_rua">R. Mãe de Deus</p>
            <p data-i18n="footer_cidade">9500-321 Ponta Delgada</p>
          </div>

          {/* Coluna 3: Formulário da Newsletter e Mensagens */}
          <div className="newsletter">
            <form onSubmit={handleSubmit} className="footer-form" id="form-newsletter" noValidate>
              <div className="footer-col newsletter-info">
                <h5 data-i18n="newsletter_titulo">Newsletter</h5>
                
                <label htmlFor="nome" className="sr-only">Nome</label>
                <input 
                  id="nome" 
                  name="nome" 
                  placeholder="Nome e Apelido" 
                  data-i18n-attr="placeholder:form_nome_placeholder" 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  noValidate 
                />

                <label htmlFor="telemovel" className="sr-only">Telemóvel</label>
                <div className="telemovel-container">
                  {/* Dropdown indicativo nacional */}
                  <div className="dropdown-indicativo" id="dropdown-indicativo" style={{ position: 'relative' }}>
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
                    id="telemovel" 
                    name="telemovel" 
                    placeholder="Telemóvel" 
                    data-i18n-attr="placeholder:form_telemovel_placeholder" 
                    value={telemovel}
                    onChange={(e) => setTelemovel(e.target.value)}
                    noValidate 
                  />
                </div>

                <label htmlFor="email" className="sr-only">Email</label>
                <input 
                  id="email" 
                  name="email" 
                  placeholder="exemplo@email.com" 
                  data-i18n-attr="placeholder:form_email_placeholder" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  noValidate 
                />
              </div>

              <div className="footer-col newsletter-msg">
                <h5 data-i18n="form_enviar_mensagem">Enviar Mensagem</h5>
                <span className="sr-only">Assunto</span>
                
                {/* Dropdown de assunto */}
                <div className="dropdown-assunto" id="dropdown-assunto" style={{ position: 'relative' }}>
                  <div 
                    className="dropdown-selected" 
                    id="assunto-selected" 
                    data-i18n={!assunto ? "form_assunto_default" : undefined}
                    onClick={() => setIsAssuntoOpen(!isAssuntoOpen)}
                    style={{ cursor: 'pointer' }}
                  >
                    {activeAssuntoLabel}
                  </div>
                  {isAssuntoOpen && (
                    <ul className="dropdown-options" id="assunto-options" style={{ display: 'block', position: 'absolute', top: '100%', left: 0, zIndex: 10, width: '100%' }}>
                      {assuntos.map((as) => (
                        <li 
                          key={as.value} 
                          data-value={as.value} 
                          data-i18n={as.key}
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

                <label htmlFor="mensagem" className="sr-only">Mensagem</label>
                <textarea 
                  id="mensagem" 
                  name="mensagem" 
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
                    id="mensagem-feedback" 
                    className={`pop-up ${feedback.type}`} 
                    style={{ display: 'block', padding: '8px', borderRadius: '4px', marginBottom: '8px', color: '#fff', backgroundColor: feedback.type === 'success' ? '#29B89E' : '#FF6B6B' }}
                    aria-live="polite"
                  >
                    {feedback.text}
                  </div>
                )}
                <div>
                  <button type="submit" className="btn btn-submit" data-i18n="form_submeter">
                    Submeter
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="container footer-bottom">
          <p>
            &copy; 2026 Centro Académico Clínico dos Açores. Todos os direitos reservados. |{' '}
            <a href="#admin" id="toggle-admin" onClick={handleToggleAdmin} aria-label="Alternar para painel de administração de eventos">
              Admin
            </a>
          </p>
        </div>
      </footer>

      {/* Botão de Voltar ao Topo reativo */}
      <button 
        id="to-top" 
        className={`btn btn-primary ${isOverFooter ? 'over-footer' : ''}`}
        title="Voltar ao Topo" 
        data-i18n="to_top_title"
        style={{ display: showScrollBtn ? 'block' : 'none', color: 'white' }}
        onClick={voltarAoTopo}
      >
        Voltar ao Topo
      </button>
    </>
  );
}

export default Footer;
