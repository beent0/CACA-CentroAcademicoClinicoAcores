document.addEventListener('DOMContentLoaded', () => {
    /* =========================================
       1. DOM ELEMENTS & CONSTANTS
       ========================================= */
    const form = document.getElementById("form-newsletter")
    const nomeF = document.getElementById("nome")
    const telemovelF = document.getElementById("telemovel")
    const emailF = document.getElementById("email")
    const mensagemFeedback = document.getElementById("mensagem-feedback")
    
    const toTopbtn = document.getElementById("to-top")
    
    const track = document.getElementById("carousel-track")
    const btnNext = document.getElementById("forward")
    const btnPrev = document.getElementById("prev")
    const imagens = ["media/hero.png", "media/evento1.png", "media/sobre_nos.png"]
    
    const themeToggleBtn = document.getElementById('theme-toggle')
    const htmlEl = document.documentElement
    const sunIcon = '☀️'
    const moonIcon = '🌙'

    /* =========================================
       2. STATE VARIABLES
       ========================================= */
    let indiceAtual = 0

    /* =========================================
       3. FUNCTIONS
       ========================================= */
    
    // --- Newsletter Form ---
    function validadeForm(event) {
        event.preventDefault()

        nomeF.style.border = ''
        telemovelF.style.border = ''
        emailF.style.border = ''
        mensagemFeedback.textContent = ''

        let error = false

        if (nomeF.value.trim() === '') {
            error = true
            nomeF.style.border = "2px solid red"
        }
        
        if (telemovelF.value.trim().length !== 9) {
            error = true
            telemovelF.style.border = "2px solid red"
        }
        
        if (!emailF.value.includes('@')) {
            error = true
            emailF.style.border = "2px solid red"
        }

        if (error) {
            mensagemFeedback.textContent = "Por favor, corrija os campos a vermelho."
            mensagemFeedback.style.color = "red"
        } else {
            mensagemFeedback.textContent = "Sucesso! A sua inscrição foi enviada."
            mensagemFeedback.style.color = "#29B89E" 
            form.reset()
        }
    }

    // --- Carousel ---
    function initCarousel() {
        imagens.forEach((img) => {
            const slide = document.createElement("div")
            slide.classList.add("carousel-slide")
            slide.style.backgroundImage = `url('${img}')`
            track.appendChild(slide)
        })
    }

    function mudarImagem(direcao) {
        if (direcao === 'next') {
            indiceAtual = (indiceAtual + 1) % imagens.length
        } else {
            indiceAtual = (indiceAtual - 1 + imagens.length) % imagens.length
        }
        track.style.transform = `translateX(-${indiceAtual * 100}%)`
    }

    // --- Scroll Features ---
    function scrollPos() {
        const alturaTotal = document.documentElement.scrollHeight - window.innerHeight
        const percentagemScroll = (window.scrollY / alturaTotal) * 100
        
        if (percentagemScroll > 10) {
            toTopbtn.style.display = "block"
            toTopbtn.style.color = 'white'

            if (percentagemScroll > 85) {
                toTopbtn.style.backgroundColor = 'white'
                toTopbtn.style.color = 'black'
                toTopbtn.style.transition = '0.3s ease'
            } else {
                toTopbtn.style.backgroundColor = "var(--accent-color)"
                toTopbtn.style.transition = '0.3s ease'
            }
        } else {
            toTopbtn.style.display = "none"
        }
    }

    function voltarAoTopo() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    // --- Theme ---
    function setTheme(theme) {
        htmlEl.setAttribute('data-theme', theme)
        themeToggleBtn.textContent = theme === 'dark' ? sunIcon : moonIcon
        localStorage.setItem('theme', theme)
    }

    function toggleTheme() {
        const newTheme = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
        setTheme(newTheme)
    }

    function initTheme() {
        const savedTheme = localStorage.getItem('theme')
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light')
        setTheme(currentTheme)
    }

    /* =========================================
       4. INITIALIZATION & EVENT LISTENERS
       ========================================= */
    
    // Initialize Logic
    initCarousel()
    initTheme()

    // Add Listeners
    form.addEventListener("submit", validadeForm)
    btnNext.addEventListener("click", () => mudarImagem('next'))
    btnPrev.addEventListener("click", () => mudarImagem('prev'))
    window.addEventListener("scroll", scrollPos)
    toTopbtn.addEventListener("click", voltarAoTopo)
    themeToggleBtn.addEventListener('click', toggleTheme)
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) { 
            setTheme(e.matches ? 'dark' : 'light')
        }
    })
})
