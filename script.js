const userInput = document.querySelector('.userInput');
const bntSpeak = document.querySelector('.bntSpeak');
const synth = window.speechSynthesis;
const language = 'pt-BR'

const speak = () => {
    let userInputMsg = userInput.value
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

bntSpeak.addEventListener('click', () => { speak() });
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { speak() } });