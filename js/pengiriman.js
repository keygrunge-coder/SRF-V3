// =====================================
// SRF V3 - REVISED FULL VERSION - pengiriman.js
// =====================================
let html5QrCode = null;
let isProcessing = false;
let isSyncing = false;

let scanQueue = JSON.parse(localStorage.getItem("scanQueue") || "[]");
let scanHistory = JSON.parse(localStorage.getItem("scanHistory") || "[]");

const SCAN_DELAY = 1500; // Jeda 1.5 detik antar scan

// =====================================
// HELPER: APP URL & RENDER
// =====================================
function getAppUrl() {
    const url = localStorage.getItem("APP_URL");
    if (!url) {
        alert("Atur Apps Script di Pengaturan");
        location.href = "pengaturan.html";
        return null;
    }
    return url;
}

function renderHistory() {
    const body = document.getElementById("historyBody");
    if (!body) return;
    body.innerHTML = "";
    scanHistory.slice(0, 20).forEach(item => {
        body.innerHTML += `<tr><td>${item.resi}</td><td>${item.status}</td></tr>`;
    });
}

// =====================================
// START CAMERA
// =====================================
function startCamera() {
    if (!document.getElementById("reader") || html5QrCode) return;
    html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 220 },
        onScanSuccess,
        () => {}
    );
}

// =====================================
// PROSES SCAN
// =====================================
function onScanSuccess(decodedText) {
    if (isProcessing) return;
    
    const resi = decodedText.trim().toUpperCase();
    if (!resi) return;

    isProcessing = true;
    if (html5QrCode) html5QrCode.pause();

    addQueue(resi);

    setTimeout(() => {
        isProcessing = false;
        if (html5QrCode) html5QrCode.resume();
    }, SCAN_DELAY);
}

// =====================================
// MANAJEMEN ANTRIAN
// =====================================
function addQueue(resi) {
    if (scanQueue.includes(resi)) return;

    scanQueue.push(resi);
    scanHistory.unshift({ resi: resi, status: "ANTRIAN" });

    localStorage.setItem("scanQueue", JSON.stringify(scanQueue));
    localStorage.setItem("scanHistory", JSON.stringify(scanHistory));
    
    renderHistory();
    syncQueue();
}

function inputManual() {
    const input = document.getElementById("manualResi");
    if (!input || !input.value.trim()) return;
    addQueue(input.value.trim().toUpperCase());
    input.value = "";
}

// =====================================
// SYNC KE SERVER
// =====================================
async function syncQueue() {
    if (isSyncing || scanQueue.length === 0) return;

    isSyncing = true;
    const APP_URL = getAppUrl();
    if (!APP_URL) {
        isSyncing = false;
        return;
    }

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
            else if (json.status === "duplicate") item.status = "DOUBLE";
            else item.status = "INVALID";
        }

        scanQueue.shift();
        localStorage.setItem("scanQueue", JSON.stringify(scanQueue));
        localStorage.setItem("scanHistory", JSON.stringify(scanHistory));
        renderHistory();
    } catch (err) {
        console.error("Sync Error:", err);
    } finally {
        isSyncing = false;
        // Panggil kembali jika masih ada sisa antrean
        if (scanQueue.length > 0) syncQueue();
    }
}

window.onload = () => {
    renderHistory();
    startCamera();
};
