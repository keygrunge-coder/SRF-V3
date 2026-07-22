// =====================================
// SRF V3 - SCAN PENGIRIMAN (IMPROVED)
// =====================================
let html5QrCode = null;
let isProcessing = false;
let isSyncing = false;

let scanQueue = JSON.parse(localStorage.getItem("scanQueue") || "[]");
let scanHistory = JSON.parse(localStorage.getItem("scanHistory") || "[]");

const SCAN_DELAY = 1500;
let APP_URL = null;

// =====================================
// HELPER: SUARA & BEEP
// =====================================
function robotBicara(teks) {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const suara = new SpeechSynthesisUtterance(teks);
    suara.lang = "id-ID";
    suara.rate = 1.15;
    speechSynthesis.speak(suara);
}

function beep(freq = 900, durasi = 120) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;
        osc.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + durasi / 1000);
    } catch (e) {}
}

// =====================================
// LAMPU STATUS & NOTIF
// =====================================
function setLampu(warna, pesan) {
    const lamp = document.getElementById("bca-indicator");
    const status = document.getElementById("status-message");
    
    if (!lamp || !status) return;
    
    if (warna === "hijau") lamp.style.background = "#10b981";
    if (warna === "kuning") lamp.style.background = "#f59e0b";
    if (warna === "merah") lamp.style.background = "#ef4444";
    
    status.innerText = pesan;
}

function showNotif(text, type) {
    const notif = document.getElementById("notif");
    if (!notif) return;
    
    notif.className = type;
    notif.innerHTML = text;
    notif.style.display = "block";
    
    setTimeout(() => {
        notif.style.display = "none";
    }, 2500);
}

// =====================================
// HELPER: LOAD CONFIG
// =====================================
async function loadConfig() {
    try {
        const response = await fetch("config.json");
        const config = await response.json();
        APP_URL = config.APP_URL;
        return APP_URL;
    } catch (err) {
        console.error("Config Load Error:", err);
        showNotif("❌ Konfigurasi tidak ditemukan", "error");
        return null;
    }
}

// =====================================
// HELPER: COUNTER
// =====================================
function countByDate(days = 0) {
    const target = new Date();
    target.setDate(target.getDate() - days);
    const dateStr = target.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });
    
    return scanHistory.filter(item => {
        if (!item.tanggal) return false;
        return item.tanggal === dateStr && item.status === "SUKSES";
    }).length;
}

function updateCounter() {
    const hariIni = document.getElementById("load-hari-ini");
    const kemarin = document.getElementById("load-kemarin");
    const minggu = document.getElementById("load-minggu");
    
    if (hariIni) hariIni.innerText = countByDate(0);
    if (kemarin) kemarin.innerText = countByDate(1);
    if (minggu) minggu.innerText = 
        scanHistory.filter(x => x.status === "SUKSES").slice(0, 7).length;
}

// =====================================
// RENDER HISTORY
// =====================================
function renderHistory() {
    const body = document.getElementById("historyBody");
    if (!body) return;
    
    body.innerHTML = "";
    scanHistory.slice(0, 20).forEach(item => {
        let badge = "badge-keluar";
        
        if (item.status === "DOUBLE") badge = "badge-duplikat";
        if (item.status === "INVALID") badge = "badge-invalid";
        
        body.innerHTML += `
            <tr>
                <td>${item.resi}</td>
                <td>
                    <span class="badge ${badge}">${item.status}</span>
                </td>
            </tr>
        `;
    });
    
    updateCounter();
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
    ).then(() => {
        setLampu("hijau", "Scanner Siap");
        robotBicara("Scanner siap");
    }).catch(err => {
        console.error("Camera Error:", err);
        setLampu("merah", "Kamera Gagal Diakses");
        showNotif("❌ KAMERA TIDAK BISA DIAKSES", "error");
    });
}

// =====================================
// PROSES SCAN QR
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
    const now = new Date();
    const tanggal = now.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });
    
    scanHistory.unshift({ 
        resi: resi, 
        status: "ANTRIAN",
        tanggal: tanggal,
        waktu: now.toLocaleTimeString("id-ID")
    });
    
    localStorage.setItem("scanQueue", JSON.stringify(scanQueue));
    localStorage.setItem("scanHistory", JSON.stringify(scanHistory));
    
    renderHistory();
    syncQueue();
}

function inputManual() {
    const input = document.getElementById("manualResi");
    if (!input || !input.value.trim()) {
        input.focus();
        return;
    }
    addQueue(input.value.trim().toUpperCase());
    input.value = "";
}

// =====================================
// SYNC KE SERVER
// =====================================
async function syncQueue() {
    if (isSyncing || scanQueue.length === 0) return;
    
    if (!APP_URL) {
        await loadConfig();
        if (!APP_URL) return;
    }
    
    isSyncing = true;
    const resi = scanQueue[0];
    setLampu("kuning", `Kirim ${resi}...`);
    
    try {
        const response = await fetch(APP_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify({ source: "pengiriman", resi: resi })
        });
        
        const json = await response.json();
        const item = scanHistory.find(x => x.resi === resi && x.status === "ANTRIAN");
        
        if (item) {
            if (json.status === "success") {
                item.status = "SUKSES";
                beep(1000);
                robotBicara("Berhasil");
                setLampu("hijau", `✓ ${resi} Berhasil`);
                showNotif("✓ BERHASIL DISIMPAN", "success");
            } else if (json.status === "duplicate") {
                item.status = "DOUBLE";
                beep(350);
                robotBicara("Resi dobel");
                setLampu("merah", "Resi Sudah Ada");
                showNotif("⚠ DOUBLE RESI", "warning");
            } else {
                item.status = "INVALID";
                beep(180);
                robotBicara("Resi tidak valid");
                setLampu("merah", "Resi Invalid");
                showNotif("✗ RESI INVALID", "error");
            }
        }
        
        scanQueue.shift();
        localStorage.setItem("scanQueue", JSON.stringify(scanQueue));
        localStorage.setItem("scanHistory", JSON.stringify(scanHistory.slice(0, 100)));
        renderHistory();
        
    } catch (err) {
        console.error("Sync Error:", err);
        beep(200);
        robotBicara("Koneksi gagal");
        setLampu("merah", "Server Tidak Terhubung");
        showNotif("❌ KONEKSI GAGAL", "error");
    } finally {
        isSyncing = false;
        
        // Tunggu sebelum sync berikutnya
        setTimeout(() => {
            if (scanQueue.length > 0) syncQueue();
        }, 800);
    }
}

// =====================================
// EVENT LISTENERS
// =====================================
window.onload = async () => {
    await loadConfig();
    renderHistory();
    startCamera();
    
    const manualBtn = document.getElementById("manualBtn");
    const manualInput = document.getElementById("manualResi");
    
    if (manualBtn) {
        manualBtn.addEventListener("click", inputManual);
    }
    
    if (manualInput) {
        manualInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                inputManual();
            }
        });
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("startBtn");
    if (startBtn) {
        startBtn.addEventListener("click", startCamera);
    }
});
