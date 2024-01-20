import { io } from 'https://cdn.socket.io/4.7.4/socket.io.esm.min.js'
const socket = io()

const userInput = document.querySelector('.userInput');
const userName = document.querySelector('.userName');
const bntSpeak = document.querySelector('.bntSpeak');
const synth = window.speechSynthesis;
const language = 'pt-BR'

if (sessionStorage.getItem('userName')) { userName.value = sessionStorage.getItem('userName'); userName.disabled = true; userInput.focus() }

const speak = (userInputMsg = [userInput.value], emit = true) => {
    if (emit) socket.emit('bntFalarPress', userInputMsg, userName.value)
    let voices = synth.getVoices();
    let msg = new SpeechSynthesisUtterance()
    msg.rate = 1;
    msg.pitch = 1;
    msg.text = userInputMsg
    if (String(userInputMsg).length < 1) msg.text = 'Por favor, digite a mensagem!'
    msg.lang = language
    if (voices.length > 1) {
        msg.voice = voices[1]
        synth.speak(msg)
    } else {
        msg.voice = voices[0]
        synth.speak(msg)
    }
}

const genDialog = (userInputMsgSocket, socketId, userOwn) => {
    let main = document.querySelector('main')

    let dialogDiv = document.createElement('div')
    dialogDiv.classList.add('dialogDiv')
    dialogDiv.classList.add(`${socketId}`)

    let dialogTitle = document.createElement('p')
    dialogTitle.classList.add('dialogTitle')
    dialogTitle.textContent = `[USER-${socketId}] DISSE`
    if (userOwn) { dialogTitle.style.color = 'red' }

    let dialogDescription = document.createElement('p')
    dialogDescription.classList.add('dialogDescription')
    dialogDescription.textContent = userInputMsgSocket
    if (userInputMsgSocket === '' || String(userInputMsgSocket).length < 1) { dialogDescription.style.color = 'gray'; dialogDescription.textContent = 'Sem Conteúdo' }

    dialogDiv.appendChild(dialogTitle).appendChild(dialogDescription)

    main.appendChild(dialogDiv)

    setTimeout(() => {
        if (dialogDiv.classList.contains(`${socketId}`)) dialogDiv.style.display = 'none'
    }, 8000)


    userInput.value = ''
}

socket.on('bntFalarPress', (userInputMsgSocket, socketId) => {
    genDialog(userInputMsgSocket, socketId)
})

const setToSessionStorageAndFocusInput = (input) => {
    if (userName.value !== '' && String(userName.value).trim().length > 0) { sessionStorage.setItem('userName', userName.value); input.focus(); }
}

bntSpeak.addEventListener('click', () => {
    if (userName.value !== '' && String(userName.value).trim().length > 0) {
        speak();
        genDialog(userInput.value, 'Você', true)
        etToSessionStorageAndFocusInput(userInput)
    } else {
        speak('Preencha seu nome primeiro', false)
    }
});

userInput.addEventListener('keypress', (e) => {
    if (userName.value !== '' && String(userName.value).trim().length > 0) {
        if (e.key === 'Enter') {
            userInput.focus();
            setToSessionStorageAndFocusInput(userInput)
            speak();
            genDialog(userInput.value, 'Você', true)
        }
    } else {
        speak('Preencha seu nome primeiro', false)
    }
});

userName.addEventListener('keypress', (e) => { if (e.key === 'Enter') { setToSessionStorageAndFocusInput(userInput) } })
document.addEventListener('keypress', (e) => { if (e.key === '\x1C' || (e.code === 'IntlBackslash' && e.ctrlKey === true)) { synth.cancel() } })