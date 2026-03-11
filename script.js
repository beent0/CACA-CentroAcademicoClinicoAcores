const form = document.getElementById("form-newsletter")
const nomeF = document.getElementById("nome")
const telemovelF = document.getElementById("telemovel")
const emailF = document.getElementById("email")
const toTopbtn = document.getElementById("to-top")
const mensagemFeedback = document.getElementById("mensagem-feedback")
const imagens = ["media/hero.png", "media/evento1.png", "media/sobre_nos.png"]

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

    if (error === true) {
        mensagemFeedback.textContent = "Por favor, corrija os campos a vermelho."
        mensagemFeedback.style.color = "red"
    } else {
        mensagemFeedback.textContent = "Sucesso! A sua inscrição foi enviada."
        mensagemFeedback.style.color = "#29B89E" 
        
        form.reset()
    }
}


function scrollPos(){
   const alturaTotal = document.documentElement.scrollHeight - window.innerHeight
   const percentagemScroll = (window.scrollY / alturaTotal) * 100
     if (percentagemScroll > 10 ) {
        toTopbtn.style.display = "block"
        toTopbtn.style.color = 'white'

        if (percentagemScroll > 85){
         toTopbtn.style.backgroundColor = 'white'
         toTopbtn.style.color = 'black'
         toTopbtn.style.transition= '0.3s ease'
        }
        else{
         toTopbtn.style.backgroundColor = "#0B2545"
         toTopbtn.style.transition= '0.3s ease'
        }
      }
      else {
         toTopbtn.style.display = "none"
      }
}

function voltarAoTopo() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
}



let indiceAtual = 0

function mudarImagem(direcao) {
    if (direcao === 'next') {
        indiceAtual = (indiceAtual + 1) % imagens.length
    } else {
        indiceAtual = (indiceAtual - 1 + imagens.length) % imagens.length
    }
    hero.style.backgroundImage = `url('${imagens[indiceAtual]}')`
}
document.getElementById("forward").addEventListener("click", () => mudarImagem('next'))
document.getElementById("prev").addEventListener("click", () => mudarImagem('prev'))
toTopbtn.addEventListener("click", voltarAoTopo)
window.addEventListener("scroll", scrollPos)
form.addEventListener("submit", validadeForm)