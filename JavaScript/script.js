// i18n - Internacionalização 
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
        // Dispara evento para outros módulos (gráficos)
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    } catch (error) {
        console.warn('Erro i18n (a usar fallback):', error);
    }
}

// Aplica as traduções a todos os elementos com data-i18n e data-i18n-attr
function applyTranslations() {
    if (!translations || Object.keys(translations).length === 0) return;
    // 1. Elementos com data-i18n (texto interno)
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[key]) {
            el.innerHTML = translations[key];
        }
    });
    // 2. Atributos como placeholder, title, alt
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
        const attrDef = el.getAttribute('data-i18n-attr');
        if (!attrDef) return;
        const [attrName, key] = attrDef.split(':');
        if (translations[key]) {
            el.setAttribute(attrName, translations[key]);
        }
    });
}

// Detecta o idioma inicial
function getInitialLanguage() {
    const saved = localStorage.getItem('preferredLang');
    if (saved && ['pt', 'en', 'es', 'fr', 'de'].includes(saved)) return saved;
    const browserLang = navigator.language.slice(0, 2);
    if (['en', 'es', 'fr', 'de'].includes(browserLang)) return browserLang;
    return 'pt';
}

// Inicializa os botões de idioma (bandeiras)
function initLanguageSelector() {
    const buttons = document.querySelectorAll('.lang-btn');
    if (!buttons.length) return;
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            if (lang) loadLanguage(lang);
        });
    });
}
//


document.addEventListener('DOMContentLoaded', () => {
    // --- Inicialização do i18n ---
    const initialLang = getInitialLanguage();
    loadLanguage(initialLang);
    initLanguageSelector();

    // --- DOM ELEMENTS & CONSTANTS ---
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
    const htmlEl = document.documentElement;
    const sunIcon = themeToggleBtn.getAttribute('icon-sun');
    const moonIcon = themeToggleBtn.getAttribute('icon-moon');

    const eventTrack = document.querySelector('.events-track');
    const eventCards = document.querySelectorAll('.event-card');
    const eventPrevBtn = document.getElementById('event-prev');
    const eventNextBtn = document.getElementById('event-next');

    // --- STATE VARIABLES ---
    let indiceAtual = 1;
    let isTransitioning = false;

    // --- FUNCTIONS ---

    function toggleMenu() {
        menuLinks.classList.toggle('active');
    }

    // Validação do formulário com suporte i18n
    function validadeForm(event) {
        event.preventDefault();
        nomeF.style.border = '';
        telemovelF.style.border = '';
        emailF.style.border = '';
        mensagemEscrita.style.border = '';
        mensagemFeedback.textContent = '';

        let error = false;
        const regexpNome = /^[a-zA-ZÀ-ÿ\s]{2,}$/;
        const regexpEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const indicativo = document.getElementById("indicativo").value;
        const numeroInserido = telemovelF.value.trim().replace(/\s/g, '');
        const país = {
            "+351": /^9[1236]\d{7}$/,
            "+49": /^1[5-7]\d{8,9}$/,
            "+61": /^4\d{8}$/,
            "+55": /^[1-9]{2}9\d{8}$/,
            "+1": /^[2-9]\d{9}$/,
            "+33": /^[67]\d{8}$/,
            "+39": /^3\d{8,9}$/,
            "+81": /^[789]0\d{8}$/,
            "+44": /^7\d{9}$/,
            "+41": /^7[5-9]\d{7}$/
        };
        const regexpTelemovel = país[indicativo];

        if (mensagemEscrita.value === "") {
            error = true;
            mensagemEscrita.style.border = "2px solid red";
        }
        if (!regexpNome.test(nomeF.value.trim())) {
            error = true;
            nomeF.style.border = "2px solid red";
        }
        if (regexpTelemovel && regexpTelemovel.test(numeroInserido) === false) {
            error = true;
            telemovelF.style.border = "2px solid red";
        }
        if (!regexpEmail.test(emailF.value.trim())) {
            error = true;
            emailF.style.border = "2px solid red";
        }

        if (error) {
            mensagemFeedback.textContent = translations.form_error || "Por favor, corrija os campos a vermelho.";
            mensagemFeedback.style.color = "red";
        } else {
            mensagemFeedback.textContent = translations.form_success || "Sucesso! A sua inscrição foi enviada.";
            mensagemFeedback.style.color = "#29B89E";
            form.reset();
        }
    }

    // --- Dropdown do indicativo (telefone) ---
    dropdownSelectedIndicativo.addEventListener('click', function(event) {
        dropdownOptionsIndicativo.classList.toggle('open');
        event.stopPropagation();
    });
    const todasOpcoes = dropdownOptionsIndicativo.querySelectorAll('li');
    todasOpcoes.forEach(opcao => {
        opcao.addEventListener('click', function() {
            dropdownSelectedIndicativo.textContent = this.getAttribute('short-data');
            inputIndicativoHidden.value = this.getAttribute('data-value');
            dropdownOptionsIndicativo.classList.remove('open');
        });
    });
    document.addEventListener('click', function(event) {
        if (!dropdownContainerIndicativo.contains(event.target)) {
            dropdownOptionsIndicativo.classList.remove('open');
        }
    });

    // --- Dropdown do assunto (com mensagens traduzidas) ---
    dropdownAssuntoSelected.addEventListener('click', function(event) {
        dropdownAssuntoOptions.classList.toggle('open');
        event.stopPropagation();
    });

    // Função auxiliar para obter a mensagem traduzida ou fallback
    function getMensagemTraduzida(assunto) {
        const msgKey = `msg_${assunto}`;
        if (translations && translations[msgKey]) {
            return translations[msgKey];
        }
        // Fallback em português (usando "Olá" em vez de "Boas")
        switch (assunto) {
            case 'ajuda': return 'Olá, gostava de pedir ajuda com...';
            case 'evento': return 'Olá, tenho interesse em saber mais informações sobre o evento...';
            case 'marcacao': return 'Olá, quero marcar uma consulta no dia...';
            case 'ensino': return 'Olá, gostaria de saber mais sobre o vosso programa de ensino';
            default: return '';
        }
    }

    const opcoesAssunto = dropdownAssuntoOptions.querySelectorAll('li');
    opcoesAssunto.forEach(opcao => {
        opcao.addEventListener('click', function() {
            const assunto = this.getAttribute('data-value');
            dropdownAssuntoSelected.textContent = this.textContent;
            inputAssuntoHidden.value = assunto;
            mensagemEscrita.value = getMensagemTraduzida(assunto);
            dropdownAssuntoOptions.classList.remove('open');
        });
    });
    document.addEventListener('click', function(event) {
        if (!dropdownAssuntoContainer.contains(event.target)) {
            dropdownAssuntoOptions.classList.remove('open');
        }
    });

    // --- Carrossel principal ---
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
        indiceAtual = direcao === 'next' ? indiceAtual + 1 : indiceAtual - 1;
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
            if (percentagemScroll > 90) {
                toTopbtn.style.backgroundColor = 'white';
                toTopbtn.style.color = 'black';
            } else {
                toTopbtn.style.backgroundColor = "var(--accent-color)";
            }
        } else {
            toTopbtn.style.display = "none";
        }
    }

    function voltarAoTopo() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // --- Theme ---
    function setTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
        themeToggleBtn.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
        localStorage.setItem('theme', theme);
    }

    function toggleTheme() {
        const newTheme = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    }

    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        setTheme(currentTheme);
    }

    // --- Eventos Carousel ---
    function initEventCarousel() {
        if (!eventTrack || eventCards.length === 0) return;
        const eventWrapper = document.querySelector('.events-mask');
        let eventIndex = 0;

        function updateEventCarousel() {
            const cardWidth = eventCards[0].offsetWidth;
            const style = window.getComputedStyle(eventTrack);
            const gap = parseFloat(style.gap) || 0;
            const slideWidth = cardWidth + gap;
            const trackWidth = eventTrack.scrollWidth;
            const containerWidth = eventWrapper.offsetWidth;
            const maxTranslate = Math.max(0, trackWidth - containerWidth);
            let translateX = eventIndex * slideWidth;
            if (translateX > maxTranslate) translateX = maxTranslate;
            eventTrack.style.transform = `translateX(-${translateX}px)`;
        }

        eventNextBtn.addEventListener('click', () => {
            const cardWidth = eventCards[0].offsetWidth;
            const style = window.getComputedStyle(eventTrack);
            const gap = parseFloat(style.gap) || 0;
            const slideWidth = cardWidth + gap;
            const trackWidth = eventTrack.scrollWidth;
            const containerWidth = document.querySelector('.events-mask').offsetWidth;
            const maxTranslate = Math.max(0, trackWidth - containerWidth);
            if (eventIndex * slideWidth < maxTranslate) {
                eventIndex++;
                updateEventCarousel();
            }
        });

        eventPrevBtn.addEventListener('click', () => {
            if (eventIndex > 0) eventIndex--;
            updateEventCarousel();
        });

        window.addEventListener('resize', updateEventCarousel);
    }

    // --- INITIALIZATIONS ---
    initCarousel();
    initTheme();
    initEventCarousel();

    // --- EVENT LISTENERS ---
    track.addEventListener('transitionend', handleCarouselTransition);
    btnNext.addEventListener("click", () => mudarImagem('next'));
    btnPrev.addEventListener("click", () => mudarImagem('prev'));
    window.addEventListener("scroll", scrollPos);
    toTopbtn.addEventListener("click", voltarAoTopo);
    themeToggleBtn.addEventListener('click', toggleTheme);
    headerBtn.addEventListener('click', toggleMenu);
    navItems.forEach(link => {
        link.addEventListener('click', () => menuLinks.classList.remove('active'));
    });
    form.addEventListener("submit", validadeForm);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
});
