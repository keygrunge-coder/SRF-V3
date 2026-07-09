// =====================================
// SRF V3 - FULL VERSION - pengiriman.js
// =====================================
let html5QrCode = null;
let isProcessing = false;
let isSyncing = false;
let scanHistory = JSON.parse(localStorage.getItem("scanHistory") || "[]");
let scanQueue = JSON.parse(localStorage.getItem("scanQueue") || "[]");

// 1. UTILS & ROBOT
function beep(duration) {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const osc = context.createOscillator();
    osc.connect(context.destination);
    osc.start();
    osc.stop(context.currentTime + (duration / 1000));
}

function robotBicara(text) {
    window.speechSynthesis.cancel(); // Stop suara lama biar gak numpuk
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'id-ID';
    window.speechSynthesis.speak(msg);
}

function setLampu(warna, pesan) {
    const lampu = document.getElementById("lampuIndikator");
    if(lampu) {
        lampu.style.backgroundColor = warna;
        lampu.innerText = pesan;
    }
}

function getAppUrl() {
    const url = localStorage.getItem("APP_URL");
    if (!url) { alert("Atur Apps Script!"); location.href = "pengaturan.html"; return null; }
    return url;
}

// 2. SCANNER & QUEUE
window.onload = function() {
    renderHistory();
    startCamera();
    setInterval(syncQueue, 3000); 
};

function startCamera() {
    if (html5QrCode) return;
    html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start({ facingMode: "environment" }, { fps: 15, qrbox: 220 },
        (decodedText) => {
            if (isProcessing) return;
            addQueue(decodedText.trim());
        }
    );
}

function addQueue(resi) {
    isProcessing = true;
    html5QrCode.pause();
    
    scanQueue.push(resi);
    localStorage.setItem("scanQueue", JSON.stringify(scanQueue));
    scanHistory.unshift({ resi: resi, status: "ANTRIAN" });
    localStorage.setItem("scanHistory", JSON.stringify(scanHistory.slice(0, 500)));
    renderHistory();
    
    // Jeda 2 detik sebelum bisa scan lagi
    setTimeout(() => {
        isProcessing = false;
        if (html5QrCode) html5QrCode.resume();
    }, 2000);
}

// 3. SYNC & ROBOT LOGIC
async function syncQueue() {
    if (isSyncing || scanQueue.length === 0) return;
    isSyncing = true;
    
    const APP_URL = getAppUrl();
    if (!APP_URL) { isSyncing = false; return; }

    while (scanQueue.length > 0) {
        const resi = scanQueue[0];
        try {
            const response = await fetch(APP_URL, {
                method: "POST",
                headers: { "Content-Type": "text/plain" },
                body: JSON.stringify({ source: "pengiriman", resi: resi })
            });
            const json = await response.json();
            const item = scanHistory.find(x => x.resi === resi && x.status === "ANTRIAN");

            if (json.status === "success") {
                beep(1000);
                robotBicara("Berhasil");
                setLampu("green", "BERHASIL");
                if (item) item.status = "SUKSES";
            } else if (json.status === "duplicate") {
                beep(350);
                robotBicara("Sudah pernah scan");
                setLampu("red", "DOUBLE RESI");
                if (item) item.status = "DOUBLE RESI";
            } else {
                beep(200);
                robotBicara("Resi tidak ditemukan");
                setLampu("yellow", "TIDAK DITEMUKAN");
                if (item) item.status = "INVALID";
            }
            
            scanQueue.shift();
            localStorage.setItem("scanQueue", JSON.stringify(scanQueue));
            localStorage.setItem("scanHistory", JSON.stringify(scanHistory.slice(0, 500)));
            renderHistory();
        } catch (err) { break; }
    }
    isSyncing = false;
}

function renderHistory() {
    const body = document.getElementById("historyBody");
    if (!body) return;
    body.innerHTML = scanHistory.slice(0, 20).map(item => 
        `<tr><td>${item.resi}</td><td>${item.status}</td></tr>`
    ).join('');
}
