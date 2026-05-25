import React from 'react';

// Componente Footer - Rodapé com informações de contacto, morada e formulário da Newsletter
function Footer() {
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
            <form action="#" method="post" className="footer-form" id="form-newsletter" noValidate>
              <div className="footer-col newsletter-info">
                <h5 data-i18n="newsletter_titulo">Newsletter</h5>
                
                <label htmlFor="nome" className="sr-only">Nome</label>
                <input 
                  id="nome" 
                  name="nome" 
                  placeholder="Nome e Apelido" 
                  data-i18n-attr="placeholder:form_nome_placeholder" 
                  noValidate 
                />

                <label htmlFor="telemovel" className="sr-only">Telemóvel</label>
                <div className="telemovel-container">
                  {/* Dropdown indicativo nacional (Fase 2: Estático por agora) */}
                  <div className="dropdown-indicativo" id="dropdown-indicativo">
                    <div className="dropdown-selected">Portugal</div>
                    <ul className="dropdown-options" style={{ display: 'none' }}>
                      <li data-value="+351" short-data="+351">Portugal</li>
                      <li data-value="+49" short-data="+49">Alemanha</li>
                      <li data-value="+61" short-data="+61">Austrália</li>
                      <li data-value="+55" short-data="+55">Brasil</li>
                      <li data-value="+1" short-data="+1">EUA</li>
                      <li data-value="+33" short-data="+33">França</li>
                      <li data-value="+39" short-data="+39">Itália</li>
                      <li data-value="+81" short-data="+81">Japão</li>
                      <li data-value="+44" short-data="+44">Reino Unido</li>
                      <li data-value="+41" short-data="+41">Suíça</li>
                    </ul>
                    <input type="hidden" id="indicativo" name="indicativo" defaultValue="+351" />
                  </div>
                  
                  <input 
                    id="telemovel" 
                    name="telemovel" 
                    placeholder="Telemóvel" 
                    data-i18n-attr="placeholder:form_telemovel_placeholder" 
                    noValidate 
                  />
                </div>

                <label htmlFor="email" className="sr-only">Email</label>
                <input 
                  id="email" 
                  name="email" 
                  placeholder="exemplo@email.com" 
                  data-i18n-attr="placeholder:form_email_placeholder" 
                  noValidate 
                />
              </div>

              <div className="footer-col newsletter-msg">
                <h5 data-i18n="form_enviar_mensagem">Enviar Mensagem</h5>
                <span className="sr-only">Assunto</span>
                
                {/* Dropdown de assunto (Fase 2: Estático por agora) */}
                <div className="dropdown-assunto" id="dropdown-assunto">
                  <div 
                    className="dropdown-selected" 
                    id="assunto-selected" 
                    data-i18n="form_assunto_default"
                  >
                    Seleciona um assunto...
                  </div>
                  <ul className="dropdown-options" id="assunto-options" style={{ display: 'none' }}>
                    <li data-value="ajuda" data-i18n="form_assunto_ajuda">Ajuda</li>
                    <li data-value="evento" data-i18n="form_assunto_evento">Nossos Eventos</li>
                    <li data-value="marcacao" data-i18n="form_assunto_marcacao">Marcação</li>
                    <li data-value="ensino" data-i18n="form_assunto_ensino">Dúvida sobre Ensino</li>
                  </ul>
                  <input type="hidden" id="assunto" name="assunto" defaultValue="" />
                </div>

                <label htmlFor="mensagem" className="sr-only">Mensagem</label>
                <textarea 
                  id="mensagem" 
                  name="mensagem" 
                  rows={4} 
                  placeholder="A sua mensagem" 
                  data-i18n-attr="placeholder:form_mensagem_placeholder"
                ></textarea>
              </div>

              <div className="newsletter-actions">
                <div id="mensagem-feedback" className="pop-up" aria-live="polite"></div>
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
            <a href="javascript:void(0)" id="toggle-admin" aria-label="Alternar para painel de administração de eventos">
              Admin
            </a>
          </p>
        </div>
      </footer>

      {/* Botão de Voltar ao Topo */}
      <button 
        id="to-top" 
        className="btn btn-primary" 
        title="Voltar ao Topo" 
        data-i18n="to_top_title"
        style={{ display: 'none' }}
      >
        Voltar ao Topo
      </button>
    </>
  );
}

export default Footer;
