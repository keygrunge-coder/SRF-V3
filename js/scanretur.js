let html5QrCode = null;

let scanHistory = JSON.parse(localStorage.getItem("returHistory") || "[]");

window.onload = function() {
    renderHistory();
    startCamera();
};

function robotBicara(teks) {
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        const tts = new SpeechSynthesisUtterance(teks);
        tts.lang = 'id-ID';
        speechSynthesis.speak(tts);
    }
}

function setLampu(warna, pesan) {
    document.getElementById("bca-indicator").style.backgroundColor =
        warna === "ijo" ? "#00cc44" :
        warna === "kuning" ? "#ffcc00" : "#ff3333";

    document.getElementById("status-message").innerText = pesan;
}

function startCamera() {
    if (html5QrCode) return;

    html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 220 },
        (decodedText) => {
            html5QrCode.pause(true);
            prosesScan(decodedText.trim());
        }
    ).then(() => {
        setLampu("ijo", "Siap Scan Returan!");
        robotBicara("Sistem Retur Siap");
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

function submitManual() {
    const input = document.getElementById("manualResi");
    const val = input.value.trim();
    if (!val) return;
    prosesScan(val.toUpperCase());
    input.value = "";
    toggleManualModal(false);
}

document.getElementById("manualResi").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        submitManual();
    }
});

async function prosesScan(resi) {
    setLampu("kuning", "Memproses...");

    try {
        const r = await fetch(CONFIG.APP_URL, {
            method: "POST",
            body: JSON.stringify({
                resi: resi,
                source: "scanRetur"
            })
        });

        const json = await r.json();

        let badge = "badge-tidak";
        let status = "ERROR";

        if (json.status === "success") {
            badge = "badge-kembali";
            status = "KEMBALI";
            setLampu("ijo", "Barang Sudah Kembali");
            robotBicara("Barang Sudah Kembali");
        } else if (json.status === "duplicate") {
            badge = "badge-sudah";
            status = "SUDAH";
            setLampu("merah", "Sudah Pernah Scan");
            robotBicara("Sudah Pernah Diproses");
        } else {
            badge = "badge-tidak";
            status = "TIDAK DITEMUKAN";
            setLampu("merah", "Resi Tidak Ditemukan");
            robotBicara("Resi tidak ditemukan");
        }

        scanHistory.unshift({ resi, status, badge });
        localStorage.setItem("returHistory", JSON.stringify(scanHistory.slice(0, 15)));
        renderHistory();

    } catch(err) {
        setLampu("merah", "Error Koneksi");
    }

    setTimeout(() => {
        if (html5QrCode) {
            html5QrCode.resume();
        }
    }, 1500);
}

function renderHistory() {
    document.getElementById("historyBody").innerHTML = scanHistory.map(item => `
        <tr>
            <td>${item.resi}</td>
            <td>
                <span class="badge ${item.badge}">
                    ${item.status}
                </span>
            </td>
        </tr>
    `).join("");
}