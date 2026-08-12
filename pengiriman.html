<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>SEKARFOOTWEAR - PUSAT KOMANDO V5</title>
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#003399">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <script src="https://unpkg.com/html5-qrcode"></script>

    <style>
        :root { 
            --primary: #003399; 
            --bg-body: #0f172a; 
            --keluar-bg: #dcfce7; 
            --keluar-text: #166534; 
        }

        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        
        html, body { 
            width: 100%; 
            height: 100vh; 
            overflow: hidden; 
            background: var(--bg-body); 
            color: #f8fafc; 
            display: flex; 
            flex-direction: column; 
        }

        /* Header Ringkas */
        .app-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            background: #1e293b;
            border-bottom: 1px solid #334155;
            font-size: 14px;
            height: 45px;
            z-index: 20;
        }
        .app-header h3 { font-size: 13px; color: #f8fafc; font-weight: 700; }
        .header-links { display: flex; gap: 6px; }
        .btn-nav { 
            background: #cc0000; 
            color: white; 
            border: none; 
            padding: 4px 8px; 
            font-weight: bold; 
            border-radius: 4px; 
            cursor: pointer; 
            text-decoration: none; 
            font-size: 11px; 
        }
        .btn-nav-blue { background: #2563eb; }

        /* Dashboard Statistik Kecil di Atas Kamera */
        .dash-container { 
            display: grid; 
            grid-template-columns: repeat(3, 1fr); 
            gap: 6px; 
            padding: 6px 10px;
            background: #1e293b;
            border-bottom: 1px solid #334155;
            z-index: 20;
        }
        .dash-card { 
            background: #0f172a; 
            padding: 4px 2px; 
            border-radius: 6px; 
            text-align: center; 
            border: 1px solid #334155; 
        }
        .dash-card h4 { margin: 0; font-size: 9px; color: #94a3b8; text-transform: uppercase; font-weight: 700; }
        .dash-card p { margin: 2px 0 0 0; font-size: 14px; font-weight: 800; color: #38bdf8; }

        /* Area Utama Kamera (Mendominasi Layar) */
        .scanner-wrapper {
            flex: 1;
            position: relative;
            background: #000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            overflow: hidden;
        }
        #reader {
            width: 100% !important;
            height: 100% !important;
            border: none !important;
        }
        #reader video {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
        }

        /* Lampu Indikator Melayang di Kamera */
        .camera-overlay-top {
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 10;
            pointer-events: none;
        }
        .status-pill-floating {
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(4px);
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
            border: 1px solid rgba(255,255,255,0.1);
        }
        #bca-indicator { 
            width: 10px; 
            height: 10px; 
            border-radius: 50%; 
            background-color: #ff3333; 
            box-shadow: 0 0 8px currentColor; 
            transition: background-color 0.3s ease; 
        }
        #status-message { font-size: 12px; font-weight: bold; color: #f8fafc; }

        /* Tombol Aksi Melayang (Input Manual & Unduh Offline) */
        .floating-actions {
            position: absolute;
            bottom: 10px;
            right: 10px;
            left: 10px;
            z-index: 10;
            display: flex;
            justify-content: space-between;
            align-items: center;
            pointer-events: none;
        }
        .float-btn {
            background: rgba(30, 41, 59, 0.9);
            backdrop-filter: blur(4px);
            color: white;
            border: 1px solid rgba(255,255,255,0.2);
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            pointer-events: auto;
        }
        .float-slot {
            background: rgba(15, 23, 42, 0.9);
            backdrop-filter: blur(4px);
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 11px;
            color: #94a3b8;
            border: 1px solid rgba(255,255,255,0.1);
            pointer-events: auto;
        }
        .float-slot span { color: #38bdf8; font-weight: bold; }

        /* Bagian Bawah: Riwayat Model Accordion / Dropdown */
        .bottom-drawer {
            background: #1e293b;
            border-top: 1px solid #334155;
            transition: max-height 0.3s ease-in-out;
            max-height: 45px; /* Default tertutup, hanya terlihat bar judulnya */
            overflow: hidden;
            z-index: 30;
        }
        .bottom-drawer.open {
            max-height: 220px; /* Terbuka maksimal muat beberapa baris */
        }
        .drawer-toggle {
            padding: 10px 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            font-size: 12px;
            font-weight: 700;
            background: #1e293b;
            color: #f8fafc;
        }
        .drawer-content {
            padding: 0 10px 10px 10px;
            max-height: 160px;
            overflow-y: auto;
        }
        .compact-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
        }
        .compact-table th, .compact-table td {
            padding: 6px 8px;
            text-align: left;
            border-bottom: 1px solid #334155;
            color: #f8fafc;
        }
        .compact-table th { background: #1e293b; color: #94a3b8; position: sticky; top: 0; }

        /* Badge Status */
        .badge { padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; display: inline-block; }
        .badge-keluar { background: #065f46; color: #34d399; }
        .badge-duplikat { background: #78350f; color: #fbbf24; border: 1px solid #f59e0b; }
        .badge-invalid { background: #7f1d1d; color: #f87171; border: 1px solid #ef4444; }

        /* Modal Input Manual (Pop-up Tersembunyi) */
        #manualModal {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.7);
            backdrop-filter: blur(3px);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 100;
        }
        .modal-box {
            background: #1e293b;
            padding: 20px;
            border-radius: 12px;
            width: 85%;
            max-width: 320px;
            border: 1px solid #334155;
        }
        .modal-box h3 { font-size: 14px; margin-bottom: 8px; color: #f8fafc; text-transform: uppercase; }
        .modal-box input {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            background: #0f172a;
            border: 1px solid #475569;
            color: white;
            border-radius: 6px;
            font-size: 14px;
            outline: none;
        }
        .modal-buttons { display: flex; gap: 8px; justify-content: flex-end; }
        .btn-modal { padding: 8px 14px; border-radius: 6px; border: none; cursor: pointer; font-size: 12px; font-weight: 600; }
        .btn-primary { background: #2563eb; color: white; }
        .btn-secondary { background: #475569; color: white; }

        /* Notifikasi Toast Kecil */
        #notif { 
            position: fixed; 
            top: 55px; 
            left: 50%; 
            transform: translateX(-50%); 
            width: calc(100% - 30px); 
            max-width: 470px; 
            z-index: 9999; 
            padding: 10px; 
            border-radius: 8px; 
            font-weight: 700; 
            text-align: center; 
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.3); 
            display: none; 
            font-size: 12px;
        }
        .success { background: #059669; color: white; }
        .warning { background: #d97706; color: white; }
        .error { background: #dc2626; color: white; }

        /* Sembunyikan elemen lama yang tidak terpakai dalam layout baru */
        #startBtn { display: none; }
    </style>
</head>
<body>

    <div class="app-header">
        <h3>📦 PAKET KELUAR V5</h3>
        <div class="header-links">
            <a href="scanretur.html" class="btn-nav">🔄 Scan Retur</a>
            
        </div>
    </div>

    <div class="dash-container">
        <div class="dash-card"><h4>Hari Ini</h4><p id="load-hari-ini">0</p></div>
        <div class="dash-card"><h4>Hari Lalu</h4><p id="load-kemarin">0</p></div>
        <div class="dash-card"><h4>Minggu Ini</h4><p id="load-minggu">0</p></div>
    </div>

    <div id="notif"></div>

    <div class="scanner-wrapper">
        <div class="camera-overlay-top">
            <div class="status-pill-floating">
                <div id="bca-indicator"></div>
                <span id="status-message">Menyalakan Kamera...</span>
            </div>
        </div>

        <div id="reader"></div>

        <div class="floating-actions">
            <button class="float-slot" onclick="downloadOfflineData()">📥 HP: <span id="local-slot">0</span></button>
            <button class="float-btn" onclick="toggleManualModal(true)">⌨ Input Manual</button>
        </div>
    </div>

    <div class="bottom-drawer" id="bottomDrawer">
        <div class="drawer-toggle" onclick="toggleDrawer()">
            <span>📋 Riwayat Terakhir</span>
            <span id="drawerArrow">▼</span>
        </div>
        <div class="drawer-content">
            <table class="compact-table">
                <thead>
                    <tr>
                        <th>Resi</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody id="historyBody"></tbody>
            </table>
        </div>
    </div>

    <div id="manualModal">
        <div class="modal-box">
            <h3>Input Manual Resi</h3>
            <input type="text" id="manualResi" placeholder="Masukkan nomor resi...">
            <div class="modal-buttons">
                <button class="btn-modal btn-secondary" onclick="toggleManualModal(false)">Batal</button>
                <button class="btn-modal btn-primary" id="manualBtn">Simpan</button>
            </div>
        </div>
    </div>

    <!-- Tombol start tersembunyi agar script asli tidak error -->
    <button id="startBtn" style="display:none;"></button>
<!-- Memanggil file config.js sebelum script utama -->
<script src="config.js"></script>
<script>


window.onload = function() { startCamera(); muatDataDashboardAwal(); };

let html5QrCode = null;
let isProcessing = false;
let localData = JSON.parse(localStorage.getItem('harian_offline_cache')) || [];
document.getElementById('local-slot').innerText = localData.length;

let scanHistory = JSON.parse(localStorage.getItem("scanHistory") || "[]");
renderHistory();

function beep(freq, duration){ try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const osc = ctx.createOscillator(); osc.frequency.value = freq; osc.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + duration); } catch(e){} }
function beepSuccess(){ beep(500, 0.08); }
function beepDuplicate(){ beep(350, 0.4); } 
function beepError(){ beep(150, 0.4); }

function robotBicara(teks) { if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); let tts = new SpeechSynthesisUtterance(teks); tts.lang = 'id-ID'; tts.rate = 1.2; window.speechSynthesis.speak(tts); } }
function setLampuBca(warna, pesan) { const indikator = document.getElementById('bca-indicator'); document.getElementById('status-message').innerText = pesan; if(warna === 'ijo') indikator.style.backgroundColor = '#00cc44'; if(warna === 'kuning') indikator.style.backgroundColor = '#ffcc00'; if(warna === 'merah') indikator.style.backgroundColor = '#ff3333'; }
function showNotif(text, type){ const n = document.getElementById("notif"); n.style.display = "block"; n.className = type === "warning" ? "warning" : (type === "error" ? "error" : "success"); n.innerHTML = text; setTimeout(()=>{ n.style.display="none"; }, 2500); }

function muatDataDashboardAwal() {
    fetch(`${APP_URL}?action=getDashboard`)
    .then(res => res.json())
    .then(data => { if(data.status === 'success') { document.getElementById('load-hari-ini').innerText = data.hariIni; document.getElementById('load-kemarin').innerText = data.kemarin; document.getElementById('load-minggu').innerText = data.mingguIni; } }).catch(e => {});
}

function startCamera() {
    if(html5QrCode) return;
    html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start({ facingMode: "environment" }, { fps: 20, qrbox: 200, formatsToSupport: [Html5QrcodeSupportedFormats.CODE_128, Html5QrcodeSupportedFormats.CODE_39] }, (decodedText) => { if(!isProcessing) { isProcessing = true; html5QrCode.pause(true); saveResi(decodedText.trim()); } }).then(() => { setLampuBca('ijo', 'Sistem Siap Scan!'); robotBicara("Sistem Siap"); }).catch(err => { setLampuBca('merah', 'Kamera Gagal'); });
}

// Fungsi Buka/Tutup Drawer Riwayat
function toggleDrawer() {
    const drawer = document.getElementById("bottomDrawer");
    const arrow = document.getElementById("drawerArrow");
    drawer.classList.toggle("open");
    arrow.innerText = drawer.classList.contains("open") ? "▲" : "▼";
}

// Fungsi Modal Input Manual
function toggleManualModal(show) {
    const modal = document.getElementById("manualModal");
    modal.style.display = show ? "flex" : "none";
    if (show) {
        setTimeout(() => document.getElementById("manualResi").focus(), 100);
    }
}

document.getElementById("manualBtn").onclick = function() {
    const input = document.getElementById("manualResi");
    const val = input.value.trim();
    if(!val) return;
    saveResi(val);
    input.value = "";
    toggleManualModal(false);
};

document.getElementById("manualResi").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        document.getElementById("manualBtn").click();
    }
});

async function saveResi(resi){
    let resiUpper = resi.toUpperCase();
    let ekspedisi = resiUpper.startsWith("SPX") ? "S P X" : "J and T";

    if (!localData.includes(resi)) { localData.push(resi); localStorage.setItem('harian_offline_cache', JSON.stringify(localData)); document.getElementById('local-slot').innerText = localData.length; }
    setLampuBca('kuning', 'Mengirim Data...');

    try{
        const r = await fetch(APP_URL, { method: "POST", mode: "cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ resi: resi, source: "harian" }) });
        const json = await r.json();

        if(json.status === "success"){
            beepSuccess(); setLampuBca('ijo', `Sukses! ${json.ekspedisi}`); robotBicara(`${ekspedisi}, Sukses.`); showNotif("✓ BERHASIL", "success");
            scanHistory.unshift({ resi, status: "SUKSES", display: json.ekspedisi });
        } else if(json.status === "duplicate"){
            beepDuplicate(); setLampuBca('merah', 'Resi Dobel!');
            robotBicara(`${ekspedisi}, dobel kasep tos di scan!`); 
            showNotif("⚠ RESI DOBEL", "warning");
            scanHistory.unshift({ resi, status: "DUPLIKAT", display: "DOBEL" });
        } else {
            beepError(); setLampuBca('merah', 'Resi Aneh!'); robotBicara("Resi Aneh"); showNotif("⚠ RESI INVALID", "error");
            scanHistory.unshift({ resi, status: "INVALID", display: "ANEH" });
        }
        localStorage.setItem("scanHistory", JSON.stringify(scanHistory.slice(0, 100)));
        renderHistory();
    } catch(err){ beepError(); setLampuBca('kuning', 'Sinyal Hilang!'); robotBicara(`${ekspedisi}, Antre.`); } 
    finally { setTimeout(() => { isProcessing = false; if(html5QrCode) html5QrCode.resume(); }, 100); }
}

function renderHistory(){ 
    const body = document.getElementById("historyBody"); 
    body.innerHTML = ""; 
    scanHistory.slice(0, 15).forEach(item => { 
        let badge = item.status === "DUPLIKAT" ? "badge-duplikat" : (item.status === "INVALID" ? "badge-invalid" : "badge-keluar"); 
        body.innerHTML += `<tr><td style="font-weight:600;">${item.resi}</td><td><span class="badge ${badge}">${item.display}</span></td></tr>`; 
    }); 
}

function downloadOfflineData() { 
    let blob = new Blob([localData.join("\n")], { type: "text/plain" }); 
    let a = document.createElement("a"); 
    a.href = URL.createObjectURL(blob); 
    a.download = "data_scan.txt"; 
    a.click(); 
}
</script>
</body>
</html>