document.addEventListener('DOMContentLoaded', () => {
    /*
    DOM ELEMENTS & CONSTANTS
    */
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
    
    const text = document.querySelector('.text p');
    text.innerHTML = text.innerText.split("").map(
        (char, i) =>
            `<span style ="transform:rotate(${i * 11}deg)">${char}</span>`
    ).join("")
    

    const themeToggleBtn = document.getElementById('theme-toggle')
    const htmlEl = document.documentElement
    const sunIcon = '☀️'
    const moonIcon = '🌙'

    const eventTrack = document.querySelector('.events-track')
    const eventCards = document.querySelectorAll('.event-card')
    const eventPrevBtn = document.getElementById('event-prev')
    const eventNextBtn = document.getElementById('event-next')

    /*
    STATE VARIABLES
    */
    let indiceAtual = 1
    let isTransitioning = false

    /* 
    FUNCTIONS
    */
    
    //Checks if each user input is correct, if not correct, makes the border of the incorrect input red
    function validadeForm(event) {
        event.preventDefault()
    //Here all border colors and the feedback messages are resetted 
        nomeF.style.border = ''
        telemovelF.style.border = ''
        emailF.style.border = ''
        mensagemFeedback.textContent = ''

        let error = false //Created an boolean to check if any error is detected
        //If value inserted by user is blank, changes border to red and makes error var true
        if (nomeF.value.trim() === '') {
            error = true
            nomeF.style.border = "2px solid red"
        }
        //If value inserted by user is not 9 in lenght, makes border red and error set to true
        if (telemovelF.value.trim().length !== 9) {
            error = true
            telemovelF.style.border = "2px solid red"
        }
        //If value inserted by user doesnt contain an @ makes border red and sets error to true
        if (!emailF.value.includes('@')) {
            error = true
            emailF.style.border = "2px solid red"
        }
        //If error is true, changes the feedback message that was blankk, and makes the color red to emphasize user error
        if (error === true) {
            mensagemFeedback.textContent = "Por favor, corrija os campos a vermelho."
            mensagemFeedback.style.color = "red"
        } else {//If error is not true, shows sucecs message and makes the text color green to show correct submission by the user
            mensagemFeedback.textContent = "Sucesso! A sua inscrição foi enviada."
            mensagemFeedback.style.color = "#29B89E" 
            //Resets the form only when there are no errors
            form.reset()
        }
    }

    // --- Carrosel ---
    function initCarousel() {
        // Clone Last Image (Prepended)
        const cloneLast = document.createElement("div")
        cloneLast.classList.add("carousel-slide")
        cloneLast.style.backgroundImage = `url('${imagens[imagens.length - 1]}')`
        cloneLast.id = 'last-clone'
        track.appendChild(cloneLast)

        // Real Images
        imagens.forEach((img) => {
            const slide = document.createElement("div")
            slide.classList.add("carousel-slide")
            slide.style.backgroundImage = `url('${img}')`
            track.appendChild(slide)
        })

        // Clone First Image (Appended)
        const cloneFirst = document.createElement("div")
        cloneFirst.classList.add("carousel-slide")
        cloneFirst.style.backgroundImage = `url('${imagens[0]}')`
        cloneFirst.id = 'first-clone'
        track.appendChild(cloneFirst)

        // Initial Position
        track.style.transform = `translateX(-${indiceAtual * 100}%)`
    }

    function mudarImagem(direcao) {
        if (isTransitioning) return
        track.style.transition = 'transform 0.5s ease-in-out'
        isTransitioning = true

        if (direcao === 'next') {
            indiceAtual++
        } else {
            indiceAtual--
        }
        track.style.transform = `translateX(-${indiceAtual * 100}%)`
    } 

    
 //Changes scroll to top button, as user scrolls down
    function scrollPos(){
       const alturaTotal = document.documentElement.scrollHeight - window.innerHeight
       const percentagemScroll = (window.scrollY / alturaTotal) * 100
         if (percentagemScroll > 10 ) { //Makes the button show up when user scrolls past header
            toTopbtn.style.display = "block"
            toTopbtn.style.color = 'white'

            if (percentagemScroll > 87){ //Changes the color of the button as soon as user goes near the footer that is a darker color
             toTopbtn.style.backgroundColor = 'white'
             toTopbtn.style.color = 'black'
            }
            else{
             toTopbtn.style.backgroundColor = "var(--accent-color)"
            }
          }
          else {
             toTopbtn.style.display = "none"
          }
    }

     //Makes user go to top of the page
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

    // --- Eventos Carousel ---
    function initEventCarousel() {
        if (!eventTrack || eventCards.length === 0) return

        const eventWrapper = document.querySelector('.events-mask')
        let eventIndex = 0

        function updateEventCarousel() {
            const cardWidth = eventCards[0].offsetWidth
            const style = window.getComputedStyle(eventTrack)
            const gap = parseFloat(style.gap) || 0
            const slideWidth = cardWidth + gap

            const trackWidth = eventTrack.scrollWidth
            const containerWidth = eventWrapper.offsetWidth
            const maxTranslate = Math.max(0, trackWidth - containerWidth)
            
            let translateX = eventIndex * slideWidth
            
            // Clamp translation to avoid dead space at the end
            if (translateX > maxTranslate) {
                translateX = maxTranslate
            }
            
            eventTrack.style.transform = `translateX(-${translateX}px)`
        }

        eventNextBtn.addEventListener('click', () => {
            const cardWidth = eventCards[0].offsetWidth
            const style = window.getComputedStyle(eventTrack)
            const gap = parseFloat(style.gap) || 0
            const slideWidth = cardWidth + gap
            
            const trackWidth = eventTrack.scrollWidth
            const containerWidth = eventWrapper.offsetWidth
            const maxTranslate = Math.max(0, trackWidth - containerWidth)

            if (eventIndex * slideWidth < maxTranslate) {
                eventIndex++
                updateEventCarousel()
            }
        })

        eventPrevBtn.addEventListener('click', () => {
            if (eventIndex > 0) eventIndex--
            updateEventCarousel()
        })

        window.addEventListener('resize', updateEventCarousel)
    }

    /* 
    INITIALIZATION & EVENT LISTENERS
    */
    
    // Initialize Logic
    initCarousel()
    initTheme()
    initEventCarousel()

    // Add Listeners
    form.addEventListener("submit", validadeForm)
    btnNext.addEventListener("click", () => mudarImagem('next'))
    btnPrev.addEventListener("click", () => mudarImagem('prev'))
    window.addEventListener("scroll", scrollPos)
    toTopbtn.addEventListener("click", voltarAoTopo)
    themeToggleBtn.addEventListener('click', toggleTheme)

    track.addEventListener('transitionend', () => {
        isTransitioning = false
        const slides = document.querySelectorAll('.carousel-slide')
        
        if (slides[indiceAtual].id === 'last-clone') {
            track.style.transition = 'none'
            indiceAtual = slides.length - 2
            track.style.transform = `translateX(-${indiceAtual * 100}%)`
        }
        if (slides[indiceAtual].id === 'first-clone') {
            track.style.transition = 'none'
            indiceAtual = 1
            track.style.transform = `translateX(-${indiceAtual * 100}%)`
        }
    })
    
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) { 
            setTheme(e.matches ? 'dark' : 'light')
        }
    })
})
