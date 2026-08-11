window.onload = function() { startCamera(); muatDataDashboardAwal(); };

let html5QrCode = null;
let isProcessing = false;
let localData = JSON.parse(localStorage.getItem('harian_offline_cache')) || [];
document.getElementById('local-slot').innerText = localData.length;

let scanHistory = JSON.parse(localStorage.getItem("scanHistory") || "[]");
renderHistory();

function beep(freq, duration){ 
    try { 
        const ctx = new (window.AudioContext || window.webkitAudioContext)(); 
        const osc = ctx.createOscillator(); 
        osc.frequency.value = freq; 
        osc.connect(ctx.destination); 
        osc.start(); 
        osc.stop(ctx.currentTime + duration); 
    } catch(e){} 
}
function beepSuccess(){ beep(500, 0.08); }
function beepDuplicate(){ beep(350, 0.4); } 
function beepError(){ beep(150, 0.4); }

function robotBicara(teks) { 
    if ('speechSynthesis' in window) { 
        window.speechSynthesis.cancel(); 
        let tts = new SpeechSynthesisUtterance(teks); 
        tts.lang = 'id-ID'; 
        tts.rate = 1.2; 
        window.speechSynthesis.speak(tts); 
    } 
}

function setLampuBca(warna, pesan) { 
    const indikator = document.getElementById('bca-indicator'); 
    document.getElementById('status-message').innerText = pesan; 
    if(warna === 'ijo') indikator.style.backgroundColor = '#00cc44'; 
    if(warna === 'kuning') indikator.style.backgroundColor = '#ffcc00'; 
    if(warna === 'merah') indikator.style.backgroundColor = '#ff3333'; 
}

function showNotif(text, type){ 
    const n = document.getElementById("notif"); 
    n.style.display = "block"; 
    n.className = type === "warning" ? "warning" : (type === "error" ? "error" : "success"); 
    n.innerHTML = text; 
    setTimeout(()=>{ n.style.display="none"; }, 2500); 
}

function muatDataDashboardAwal() {
    fetch(`${CONFIG.APP_URL}?action=getDashboard`)
    .then(res => res.json())
    .then(data => { 
        if(data.status === 'success') { 
            document.getElementById('load-hari-ini').innerText = data.hariIni; 
            document.getElementById('load-kemarin').innerText = data.kemarin; 
            document.getElementById('load-minggu').innerText = data.mingguIni; 
        } 
    }).catch(e => {});
}

function startCamera() {
    if(html5QrCode) return;
    html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start(
        { facingMode: "environment" }, 
        { fps: 20, qrbox: 200, formatsToSupport: [Html5QrcodeSupportedFormats.CODE_128, Html5QrcodeSupportedFormats.CODE_39] }, 
        (decodedText) => { 
            if(!isProcessing) { 
                isProcessing = true; 
                html5QrCode.pause(true); 
                saveResi(decodedText.trim()); 
            } 
        }
    ).then(() => { 
        setLampuBca('ijo', 'Sistem Siap Scan!'); 
        robotBicara("Sistem Siap"); 
    }).catch(err => { 
        setLampuBca('merah', 'Kamera Gagal'); 
    });
}

function toggleDrawer() {
    const drawer = document.getElementById("bottomDrawer");
    const arrow = document.getElementById("drawerArrow");
    drawer.classList.toggle("open");
    arrow.innerText = drawer.classList.contains("open") ? "▲" : "▼";
}

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

    if (!localData.includes(resi)) { 
        localData.push(resi); 
        localStorage.setItem('harian_offline_cache', JSON.stringify(localData)); 
        document.getElementById('local-slot').innerText = localData.length; 
    }
    setLampuBca('kuning', 'Mengirim Data...');

    try{
        const r = await fetch(CONFIG.APP_URL, { 
            method: "POST", 
            mode: "cors", 
            headers: { "Content-Type": "text/plain;charset=utf-8" }, 
            body: JSON.stringify({ resi: resi, source: "harian" }) 
        });
        const json = await r.json();

        if(json.status === "success"){
            beepSuccess(); 
            setLampuBca('ijo', `Sukses! ${json.ekspedisi}`); 
            robotBicara(`${ekspedisi}, Sukses.`); 
            showNotif("✓ BERHASIL", "success");
            scanHistory.unshift({ resi, status: "SUKSES", display: json.ekspedisi });
        } else if(json.status === "duplicate"){
            beepDuplicate(); 
            setLampuBca('merah', 'Resi Dobel!');
            robotBicara(`${ekspedisi}, dobel kasep tos di scan!`); 
            showNotif("⚠ RESI DOBEL", "warning");
            scanHistory.unshift({ resi, status: "DUPLIKAT", display: "DOBEL" });
        } else {
            beepError(); 
            setLampuBca('merah', 'Resi Aneh!'); 
            robotBicara("Resi Aneh"); 
            showNotif("⚠ RESI INVALID", "error");
            scanHistory.unshift({ resi, status: "INVALID", display: "ANEH" });
        }
        localStorage.setItem("scanHistory", JSON.stringify(scanHistory.slice(0, 100)));
        renderHistory();
    } catch(err){ 
        beepError(); 
        setLampuBca('kuning', 'Sinyal Hilang!'); 
        robotBicara(`${ekspedisi}, Antre.`); 
    } finally { 
        setTimeout(() => { 
            isProcessing = false; 
            if(html5QrCode) html5QrCode.resume(); 
        }, 100); 
    }
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