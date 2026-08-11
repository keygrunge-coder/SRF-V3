// Modul khusus pengatur suara bot
function robotBicara(teks) {
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        const tts = new SpeechSynthesisUtterance(teks);
        tts.lang = 'id-ID';
        speechSynthesis.speak(tts);
    }
}