// =====================================
// SRF V3 - pengiriman.js
// =====================================
let html5QrCode = null;
let isProcessing = false;
let isSyncing = false;
let scanHistory = JSON.parse(localStorage.getItem("scanHistory") || "[]");
let scanQueue = JSON.parse(localStorage.getItem("scanQueue") || "[]");

// Konfigurasi URL
function getAppUrl() {
    const url = localStorage.getItem("APP_URL");
    if (!url) {
        alert("Atur Apps Script di Pengaturan");
        location.href = "pengaturan.html";
        return null;
    }
    return url;
}

// Auto Start
window.onload = function() {
    renderHistory();
    startCamera();
    setInterval(syncQueue, 5000); // Jalan otomatis tiap 5 detik
};

// Scanner
function startCamera() {
    if (html5QrCode) return;
    html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 15, qrbox: 220 },
        function(decodedText) {
            if (isProcessing) return;
            isProcessing = true;
            html5QrCode.pause();
            addQueue(decodedText.trim());
        }
    );
}

// Input Manual
function inputManual() {
    const input = document.getElementById("manualResi");
    if (!input.value.trim()) return;
    addQueue(input.value.trim().toUpperCase());
    input.value = "";
}

// Masuk Antrian (Queue)
function addQueue(resi) {
    scanQueue.push(resi);
    localStorage.setItem("scanQueue", JSON.stringify(scanQueue));
    scanHistory.unshift({ resi: resi, status: "ANTRIAN" });
    localStorage.setItem("scanHistory", JSON.stringify(scanHistory.slice(0, 100)));
    renderHistory();
    
    isProcessing = false;
    if (html5QrCode) html5QrCode.resume();
}

// Sync ke Google Sheet
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
            if (item) {
                if (json.status === "success") item.status = "SUKSES";
                else if (json.status === "duplicate") item.status = "DOUBLE RESI";
                else item.status = "INVALID";
            }
            
            scanQueue.shift();
            localStorage.setItem("scanQueue", JSON.stringify(scanQueue));
            localStorage.setItem("scanHistory", JSON.stringify(scanHistory.slice(0, 100)));
            renderHistory();
        } catch (err) { break; }
    }
    isSyncing = false;
}

// Update Tampilan
function renderHistory() {
    const body = document.getElementById("historyBody");
    if (!body) return;
    body.innerHTML = "";
    scanHistory.slice(0, 20).forEach(item => {
        body.innerHTML += `<tr><td>${item.resi}</td><td>${item.status}</td></tr>`;
    });
}
