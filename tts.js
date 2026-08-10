// Fungsi Bot Bicara (TTS)
function bicara(teks) {
    if ('speechSynthesis' in window) {
        // Hentikan suara yang sedang antre biar langsung ngomong
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(teks);
        utterance.lang = 'id-ID'; // Bahasa Indonesia
        utterance.rate = 1.0;     // Kecepatan normal
        utterance.pitch = 1.0;    // Nada suara normal
        
        window.speechSynthesis.speak(utterance);
    } else {
        console.log("Browser tidak mendukung Text-to-Speech");
    }
}
