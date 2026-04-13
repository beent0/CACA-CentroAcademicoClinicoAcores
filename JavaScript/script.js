//  i18n - Internacionalização
let currentLang = 'pt';
let translations = {};

// Carrega o ficheiro JSON do idioma escolhido
async function loadLanguage(lang) {
    try {
        const response = await fetch(`lang/${lang}.json`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        translations = await response.json();
        currentLang = lang;
        localStorage.setItem('preferredLang', lang);
        applyTranslations();
        updateLanguageDropdownUI(lang);
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    } catch (error) {
        console.warn('Erro i18n (a usar fallback):', error);
    }
}

// Aplica as traduções
function applyTranslations() {
    if (!translations || Object.keys(translations).length === 0) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[key]) el.innerHTML = translations[key];
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
        const attrDef = el.getAttribute('data-i18n-attr');
        if (!attrDef) return;
        const [attrName, key] = attrDef.split(':');
        if (translations[key]) el.setAttribute(attrName, translations[key]);
    });
}

// Idioma inicial
function getInitialLanguage() {
    const saved = localStorage.getItem('preferredLang');
    if (saved && ['pt', 'en', 'es', 'fr', 'de'].includes(saved)) return saved;
    const browserLang = navigator.language.slice(0, 2);
    if (['en', 'es', 'fr', 'de'].includes(browserLang)) return browserLang;
    return 'pt';
}

// Atualiza a bandeira visível no dropdown
function updateLanguageDropdownUI(lang) {
    const container = document.querySelector('.lang-dropdown-container');
    if (!container) return;
    const selectedDiv = container.querySelector('.lang-dropdown-selected');
    const options = container.querySelectorAll('.lang-dropdown-options li');
    options.forEach(opt => {
        if (opt.getAttribute('data-lang') === lang) {
            const newFlag = opt.querySelector('.fi').cloneNode(true);
            const newCode = opt.innerText.trim().split(' ').pop();
            selectedDiv.innerHTML = '';
            selectedDiv.appendChild(newFlag);
            selectedDiv.appendChild(document.createTextNode(' '));
            const codeSpan = document.createElement('span');
            codeSpan.className = 'lang-code';
            codeSpan.textContent = newCode;
            selectedDiv.appendChild(codeSpan);
        }
    });
}

// Inicializa o dropdown de idiomas (eventos)
function initLanguageSelector() {
    const container = document.querySelector('.lang-dropdown-container');
    if (!container) return;
    const selected = container.querySelector('.lang-dropdown-selected');
    const optionsList = container.querySelector('.lang-dropdown-options');
    if (!selected || !optionsList) return;

    // Garante que a lista começa escondida
    optionsList.style.display = 'none';

    // Abrir/fechar ao clicar no botão
    selected.addEventListener('click', (e) => {
        e.stopPropagation();
        optionsList.style.display = optionsList.style.display === 'block' ? 'none' : 'block';
    });

    // Fechar ao clicar fora
    document.addEventListener('click', () => {
        optionsList.style.display = 'none';
    });

    // Opções do dropdown
    const items = optionsList.querySelectorAll('li');
    items.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const lang = item.getAttribute('data-lang');
            if (lang) loadLanguage(lang);
            optionsList.style.display = 'none';
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Inicialização do i18n
    const initialLang = getInitialLanguage();
    loadLanguage(initialLang);
    initLanguageSelector();

    // DOM ELEMENTS (todas as variáveis originais)
    const form = document.getElementById("form-newsletter");
    const nomeF = document.getElementById("nome");
    const telemovelF = document.getElementById("telemovel");
    const emailF = document.getElementById("email");
    const mensagemFeedback = document.getElementById("mensagem-feedback");
    const dropdownContainerIndicativo = document.getElementById('dropdown-indicativo');
    const dropdownSelectedIndicativo = dropdownContainerIndicativo.querySelector('.dropdown-selected');
    const dropdownOptionsIndicativo = dropdownContainerIndicativo.querySelector('.dropdown-options');
    const inputIndicativoHidden = document.getElementById('indicativo');
    const mensagemEscrita = document.getElementById("mensagem");
    const dropdownAssuntoContainer = document.getElementById('dropdown-assunto');
    const dropdownAssuntoSelected = document.getElementById('assunto-selected');
    const dropdownAssuntoOptions = document.getElementById('assunto-options');
    const inputAssuntoHidden = document.getElementById('assunto');
    const toTopbtn = document.getElementById("to-top");
    const track = document.getElementById("carousel-track");
    const btnNext = document.getElementById("forward");
    const btnPrev = document.getElementById("prev");
    const imagens = ["media/hero.png", "media/evento1.png", "media/sobre_nos.png"];
    const headerBtn = document.getElementById('header-menu');
    const menuLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('#nav-links a');
    const textElement = document.querySelector('.text p');
    const textContent = textElement.innerText;
    const angle = 360 / textContent.length;
    textElement.innerHTML = textContent.split("").map(
        (char, i) => `<span style="transform: translate(-50%, -50%) rotate(${i * angle}deg) translateY(-52px)">${char}</span>`
    ).join("");
    const themeToggleBtn = document.getElementById('theme-toggle');



    // Toggle Admin Mode
    const toggleAdminBtn = document.getElementById('toggle-admin');
    const adminSection = document.getElementById('admin-section');

    if (toggleAdminBtn && adminSection) {
        toggleAdminBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const wasShown = adminSection.classList.contains('show');
            adminSection.classList.toggle('show');
            if (!wasShown) {
                adminSection.scrollIntoView();
                const firstInput = adminSection.querySelector('input:not([type="hidden"])');
                if (firstInput) firstInput.focus();
            }
        });
    }

    const htmlEl = document.documentElement;
    const sunIcon = themeToggleBtn.getAttribute('icon-sun');
    const moonIcon = themeToggleBtn.getAttribute('icon-moon');

    let indiceAtual = 1;
    let isTransitioning = false;

    function toggleMenu() { menuLinks.classList.toggle('active'); }

        //  FUNÇÕES AUXILIARES PARA VALIDAÇÃO
    function mostrarErro(campo, mensagem, isContainer = false) {
        let erroDiv;
        if (isContainer) {
            let existing = campo.parentNode.querySelector('.erro-custom');
            if (!existing) {
                erroDiv = document.createElement('div');
                erroDiv.className = 'erro-custom';
                erroDiv.style.color = 'red';
                erroDiv.style.fontSize = '12px';
                erroDiv.style.marginTop = '5px';
                campo.parentNode.insertBefore(erroDiv, campo.nextSibling);
            } else {
                erroDiv = existing;
            }
        } else {
            let next = campo.nextElementSibling;
            if (next && next.classList && next.classList.contains('mensagem-erro')) {
                erroDiv = next;
            } else {
                erroDiv = document.createElement('div');
                erroDiv.className = 'mensagem-erro';
                erroDiv.style.color = 'red';
                erroDiv.style.fontSize = '12px';
                erroDiv.style.marginTop = '5px';
                campo.parentNode.insertBefore(erroDiv, campo.nextSibling);
            }
        }
        erroDiv.textContent = mensagem;
        erroDiv.style.visibility = 'visible';
        campo.style.border = '2px solid red';
    }

    function limparErros() {
        document.querySelectorAll('.mensagem-erro, .erro-custom').forEach(el => {
            el.textContent = '';
            el.style.visibility = 'hidden';
        });
        // Usar as variáveis do escopo
        if (nomeF) nomeF.style.border = '';
        if (emailF) emailF.style.border = '';
        if (telemovelF) telemovelF.style.border = '';
        if (mensagemEscrita) mensagemEscrita.style.border = '';
        const assuntoContainer = document.getElementById('dropdown-assunto');
        if (assuntoContainer) assuntoContainer.style.border = '';
        const indicativoContainer = document.getElementById('dropdown-indicativo');
        if (indicativoContainer) indicativoContainer.style.border = '';
    }

    function mostrarToast(mensagem, tipo) {
        document.querySelectorAll('.toast-custom').forEach(toast => toast.remove());
        const toast = document.createElement('div');
        toast.className = `toast-custom ${tipo}`;
        toast.innerHTML = `<span>${mensagem}</span>`;
        toast.style.position = 'fixed';
        toast.style.top = '80px';
        toast.style.right = '20px';
        toast.style.padding = '12px 20px';
        toast.style.borderRadius = '8px';
        toast.style.fontFamily = 'var(--font-main, sans-serif)';
        toast.style.zIndex = '2000';
        toast.style.animation = 'slideInToast 0.3s ease, fadeOutToast 0.5s ease 2.5s forwards';
        toast.style.backgroundColor = tipo === 'success' ? '#0f9d58' : '#dc3545';
        toast.style.color = 'white';
        document.body.appendChild(toast);
    }

    // Validação do formulário com traduções
     function validadeForm(event) {
        event.preventDefault();
        limparErros();

        const nome = nomeF.value.trim();
        const email = emailF.value.trim();
        const telemovelRaw = telemovelF.value.trim().replace(/\s/g, '');
        const indicativo = document.getElementById("indicativo").value;
        const assunto = inputAssuntoHidden.value;
        const mensagem = mensagemEscrita.value.trim();

        const regexpNome = /^[a-zA-ZÀ-ÿ\s]{2,}$/;
        const regexpEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const pais = {
            "+351": /^9[1236]\d{7}$/, "+49": /^1[5-7]\d{8,9}$/, "+61": /^4\d{8}$/,
            "+55": /^[1-9]{2}9\d{8}$/, "+1": /^[2-9]\d{9}$/, "+33": /^[67]\d{8}$/,
            "+39": /^3\d{8,9}$/, "+81": /^[789]0\d{8}$/, "+44": /^7\d{9}$/, "+41": /^7[5-9]\d{7}$/
        };
        const regexpTelemovel = pais[indicativo];

        let formValido = true;

        if (nome === '') {
            mostrarErro(nomeF, translations.form_nome_vazio || "Nome é obrigatório");
            formValido = false;
        } else if (!regexpNome.test(nome)) {
            mostrarErro(nomeF, translations.form_nome_invalido || "Nome deve ter pelo menos 2 letras");
            formValido = false;
        }

        if (email === '') {
            mostrarErro(emailF, translations.form_email_vazio || "Email é obrigatório");
            formValido = false;
        } else if (!regexpEmail.test(email)) {
            mostrarErro(emailF, translations.form_email_invalido || "Email inválido (ex: nome@dominio.com)");
            formValido = false;
        }

        if (telemovelRaw === '') {
            mostrarErro(telemovelF, translations.form_telemovel_vazio || "Telemóvel é obrigatório");
            formValido = false;
        } else if (regexpTelemovel && !regexpTelemovel.test(telemovelRaw)) {
            mostrarErro(telemovelF, translations.form_telemovel_invalido || "Número inválido para o país selecionado");
            formValido = false;
        }

        if (!assunto || assunto === '') {
            const assuntoContainer = document.getElementById('dropdown-assunto');
            mostrarErro(assuntoContainer, translations.form_assunto_vazio || "Selecione um assunto", true);
            formValido = false;
        }

        if (mensagem === '') {
            mostrarErro(mensagemEscrita, translations.form_mensagem_vazio || "Mensagem é obrigatória");
            formValido = false;
        }

        if (formValido) {
            mostrarToast(translations.form_success || "Sucesso! A sua mensagem foi enviada.", 'success');
            form.reset();
            dropdownSelectedIndicativo.textContent = "+351";
            inputIndicativoHidden.value = "+351";
            dropdownAssuntoSelected.textContent = translations.form_assunto_default || "Seleciona um assunto...";
            inputAssuntoHidden.value = "";
            mensagemEscrita.value = "";
            limparErros();
        } else {
            mostrarToast(translations.form_error || "Por favor, corrija os campos assinalados.", 'error');
        }

        // Formulário de contacto
const contactoForm = document.getElementById('form-contacto');
const contactoNome = document.getElementById('contacto_nome');
const contactoEmail = document.getElementById('contacto_email');
const contactoAssunto = document.getElementById('contacto_assunto');
const contactoMensagem = document.getElementById('contacto_mensagem');

function validarContacto(event) {
    event.preventDefault();
    // Limpar erros anteriores
    document.querySelectorAll('.mensagem-erro-contacto').forEach(el => el.style.visibility = 'hidden');
    [contactoNome, contactoEmail, contactoAssunto, contactoMensagem].forEach(campo => campo.style.border = '');

    let valido = true;
    const nome = contactoNome.value.trim();
    const email = contactoEmail.value.trim();
    const assunto = contactoAssunto.value.trim();
    const mensagem = contactoMensagem.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nomeRegex = /^[a-zA-ZÀ-ÿ\s]{2,}$/;

    if (nome === '') {
        mostrarErroContacto('nome', translations.contacto_nome_vazio || 'Nome é obrigatório');
        contactoNome.style.border = '2px solid red';
        valido = false;
    } else if (!nomeRegex.test(nome)) {
        mostrarErroContacto('nome', translations.contacto_nome_invalido || 'Nome deve ter pelo menos 2 letras');
        contactoNome.style.border = '2px solid red';
        valido = false;
    }

    if (email === '') {
        mostrarErroContacto('email', translations.contacto_email_vazio || 'Email é obrigatório');
        contactoEmail.style.border = '2px solid red';
        valido = false;
    } else if (!emailRegex.test(email)) {
        mostrarErroContacto('email', translations.contacto_email_invalido || 'Email inválido');
        contactoEmail.style.border = '2px solid red';
        valido = false;
    }

    if (assunto === '') {
        mostrarErroContacto('assunto', translations.contacto_assunto_vazio || 'Assunto é obrigatório');
        contactoAssunto.style.border = '2px solid red';
        valido = false;
    }

    if (mensagem === '') {
        mostrarErroContacto('mensagem', translations.contacto_mensagem_vazio || 'Mensagem é obrigatória');
        contactoMensagem.style.border = '2px solid red';
        valido = false;
    }

    if (valido) {
        mostrarToast(translations.contacto_sucesso || 'Mensagem enviada com sucesso!', 'success');
        contactoForm.reset();
    } else {
        mostrarToast(translations.contacto_erro || 'Por favor, corrija os campos assinalados.', 'error');
    }
}

function mostrarErroContacto(campo, mensagem) {
    const erroDiv = document.querySelector(`.mensagem-erro-contacto[data-field="${campo}"]`);
    if (erroDiv) {
        erroDiv.textContent = mensagem;
        erroDiv.style.visibility = 'visible';
    }
}

if (contactoForm) {
    contactoForm.addEventListener('submit', validarContacto);
}
    }

    // Dropdown indicativo
    dropdownSelectedIndicativo.addEventListener('click', function(e) {
        dropdownOptionsIndicativo.classList.toggle('open');
        e.stopPropagation();
    });
    document.querySelectorAll('#dropdown-indicativo .dropdown-options li').forEach(opcao => {
        opcao.addEventListener('click', function() {
            dropdownSelectedIndicativo.textContent = this.getAttribute('short-data');
            inputIndicativoHidden.value = this.getAttribute('data-value');
            dropdownOptionsIndicativo.classList.remove('open');
        });
    });
    document.addEventListener('click', function(e) {
        if (!dropdownContainerIndicativo.contains(e.target)) dropdownOptionsIndicativo.classList.remove('open');
    });

    // Dropdown assunto com mensagens traduzidas
    dropdownAssuntoSelected.addEventListener('click', function(e) {
        dropdownAssuntoOptions.classList.toggle('open');
        e.stopPropagation();
    });
    document.querySelectorAll('#assunto-options li').forEach(opcao => {
        opcao.addEventListener('click', function() {
            const assunto = this.getAttribute('data-value');
            dropdownAssuntoSelected.textContent = this.textContent;
            inputAssuntoHidden.value = assunto;
            const msgKey = `msg_${assunto}`;
            const mensagemTraduzida = translations[msgKey] || (
                assunto === 'ajuda' ? 'Boa tarde, gostava de pedir ajuda com...' :
                assunto === 'evento' ? 'Olá, tenho interesse em saber mais informações sobre o evento...' :
                assunto === 'marcacao' ? 'Olá, quero marcar uma consulta no dia...' :
                assunto === 'ensino' ? 'Olá, gostaria de saber mais sobre o vosso programa de ensino' : ''
            );
            mensagemEscrita.value = mensagemTraduzida;
            dropdownAssuntoOptions.classList.remove('open');
        });
    });
    document.addEventListener('click', function(e) {
        if (!dropdownAssuntoContainer.contains(e.target)) dropdownAssuntoOptions.classList.remove('open');
    });

    // Carrossel principal
    function initCarousel() {
        const cloneLast = document.createElement("div");
        cloneLast.classList.add("carousel-slide");
        cloneLast.style.backgroundImage = `url('${imagens[imagens.length - 1]}')`;
        cloneLast.id = 'last-clone';
        track.appendChild(cloneLast);
        imagens.forEach((img) => {
            const slide = document.createElement("div");
            slide.classList.add("carousel-slide");
            slide.style.backgroundImage = `url('${img}')`;
            track.appendChild(slide);
        });
        const cloneFirst = document.createElement("div");
        cloneFirst.classList.add("carousel-slide");
        cloneFirst.style.backgroundImage = `url('${imagens[0]}')`;
        cloneFirst.id = 'first-clone';
        track.appendChild(cloneFirst);
        track.style.transform = `translateX(-${indiceAtual * 100}%)`;
    }
    function mudarImagem(direcao) {
        if (isTransitioning) return;
        track.style.transition = 'transform 0.5s ease-in-out';
        isTransitioning = true;
        indiceAtual += (direcao === 'next') ? 1 : -1;
        track.style.transform = `translateX(-${indiceAtual * 100}%)`;
    }
    function handleCarouselTransition() {
        isTransitioning = false;
        const slides = document.querySelectorAll('.carousel-slide');
        if (slides[indiceAtual]?.id === 'last-clone') {
            track.style.transition = 'none';
            indiceAtual = slides.length - 2;
            track.style.transform = `translateX(-${indiceAtual * 100}%)`;
        }
        if (slides[indiceAtual]?.id === 'first-clone') {
            track.style.transition = 'none';
            indiceAtual = 1;
            track.style.transform = `translateX(-${indiceAtual * 100}%)`;
        }
    }
    function scrollPos() {
        const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
        const percentagemScroll = (window.scrollY / alturaTotal) * 100;
        if (percentagemScroll > 10) {
            toTopbtn.style.display = "block";
            toTopbtn.style.color = 'white';
            toTopbtn.style.backgroundColor = percentagemScroll > 90 ? 'white' : "var(--accent-color)";
            if (percentagemScroll > 90) toTopbtn.style.color = 'black';
        } else toTopbtn.style.display = "none";
    }
    function voltarAoTopo() { window.scrollTo({ top: 0, behavior: "smooth" }); }
    function setTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
        themeToggleBtn.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
        localStorage.setItem('theme', theme);
    }
    function toggleTheme() { setTheme(htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); }
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
    }


    function initEventCarousel() {
        const eventTrack = document.querySelector('.events-track');
        const eventCards = document.querySelectorAll('.event-card');
        const eventPrevBtn = document.getElementById('event-prev');
        const eventNextBtn = document.getElementById('event-next');

        if (!eventTrack || eventCards.length === 0) return;

        const eventWrapper = document.querySelector('.events-mask');
        let eventIndex = 0;

        function updateEventCarousel() {
            const cardWidth = eventCards[0].offsetWidth;
            const gap = parseFloat(window.getComputedStyle(eventTrack).gap) || 0;
            const slideWidth = cardWidth + gap;
            const maxTranslate = Math.max(0, eventTrack.scrollWidth - eventWrapper.offsetWidth);
            let translateX = eventIndex * slideWidth;
            if (translateX > maxTranslate) translateX = maxTranslate;
            eventTrack.style.transform = `translateX(-${translateX}px)`;
        }

        eventNextBtn.onclick = () => {
            const cardWidth = eventCards[0].offsetWidth;
            const gap = parseFloat(window.getComputedStyle(eventTrack).gap) || 0;
            const slideWidth = cardWidth + gap;
            const maxTranslate = Math.max(0, eventTrack.scrollWidth - eventWrapper.offsetWidth);
            if (eventIndex * slideWidth < maxTranslate) { eventIndex++; updateEventCarousel(); }
        };

        eventPrevBtn.onclick = () => { 
            if (eventIndex > 0) { eventIndex--; updateEventCarousel(); } 
        };

        window.addEventListener('resize', updateEventCarousel);
        updateEventCarousel();
    }

    initCarousel();
    initTheme();

    window.addEventListener('loadedEvents', initEventCarousel);

    track.addEventListener('transitionend', handleCarouselTransition);
    btnNext.addEventListener("click", () => mudarImagem('next'));
    btnPrev.addEventListener("click", () => mudarImagem('prev'));
    window.addEventListener("scroll", scrollPos);
    toTopbtn.addEventListener("click", voltarAoTopo);
    themeToggleBtn.addEventListener('click', toggleTheme);
    headerBtn.addEventListener('click', toggleMenu);
    navItems.forEach(link => link.addEventListener('click', () => menuLinks.classList.remove('active')));
    form.addEventListener("submit", validadeForm);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) setTheme(e.matches ? 'dark' : 'light');
    });

    
});




//  VALIDAÇÃO de FORMULÁRIO e TOASTS
function mostrarErro(campo, mensagem, isContainer = false) {
    let erroDiv;
    if (isContainer) {
        let existing = campo.parentNode.querySelector('.erro-custom');
        if (!existing) {
            erroDiv = document.createElement('div');
            erroDiv.className = 'erro-custom';
            erroDiv.style.color = 'red';
            erroDiv.style.fontSize = '12px';
            erroDiv.style.marginTop = '5px';
            campo.parentNode.insertBefore(erroDiv, campo.nextSibling);
        } else {
            erroDiv = existing;
        }
    } else {
        let next = campo.nextElementSibling;
        if (next && next.classList && next.classList.contains('mensagem-erro')) {
            erroDiv = next;
        } else {
            erroDiv = document.createElement('div');
            erroDiv.className = 'mensagem-erro';
            erroDiv.style.color = 'red';
            erroDiv.style.fontSize = '12px';
            erroDiv.style.marginTop = '5px';
            campo.parentNode.insertBefore(erroDiv, campo.nextSibling);
        }
    }
    erroDiv.textContent = mensagem;
    erroDiv.style.visibility = 'visible';
    campo.style.border = '2px solid red';
}

function limparErros() {
    document.querySelectorAll('.mensagem-erro, .erro-custom').forEach(el => {
        el.textContent = '';
        el.style.visibility = 'hidden';
    });
    document.querySelectorAll('input, textarea, .dropdown-assunto, .dropdown-indicativo').forEach(el => {
        el.style.border = '';
    });
}

function mostrarToast(mensagem, tipo) {
    document.querySelectorAll('.toast-custom').forEach(toast => toast.remove());
    const toast = document.createElement('div');
    toast.className = `toast-custom ${tipo}`;
    toast.innerHTML = `<span>${mensagem}</span>`;
    toast.style.position = 'fixed';
    toast.style.top = '80px';
    toast.style.right = '20px';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '8px';
    toast.style.fontFamily = 'var(--font-main, sans-serif)';
    toast.style.zIndex = '2000';
    toast.style.animation = 'slideInToast 0.3s ease, fadeOutToast 0.5s ease 2.5s forwards';
    toast.style.backgroundColor = tipo === 'success' ? '#0f9d58' : '#dc3545';
    toast.style.color = 'white';
    document.body.appendChild(toast);
}
