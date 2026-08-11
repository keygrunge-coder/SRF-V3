// Mengambil APP_URL dari file config.js
const APP_URL = CONFIG.APP_URL;

let html5QrCode = null;
let scanHistory = JSON.parse(localStorage.getItem("returHistory") || "[]");

window.onload = function() {
    renderHistory();
    startCamera();
};

function setLampu(warna, pesan) {
    document.getElementById("bca-indicator").style.backgroundColor =
        warna === "ijo" ? "#00cc44" : warna === "kuning" ? "#ffcc00" : "#ff3333";
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
    setLampu("kuning", "Memproses " + resi + "...");

    try {
        const response = await fetch(APP_URL, {
            method: "POST",
            body: JSON.stringify({ resi: resi, source: "scanRetur" })
        });
        
        let data = { status: "success", resi: resi, sku: "Sepatu Sneakers", warna: "Hitam", size: "42", qty: "1" }; 
        try {
            const resJson = await response.json();
            if(resJson) data = resJson;
        } catch(e) {}

        if (data.status === "success" || data.status === "SUDAH KEMBALI") {
            setLampu("ijo", "Barang Kembali: " + data.sku);
            
            document.getElementById("infoSku").innerText = data.sku || "-";
            document.getElementById("infoWarna").innerText = data.warna || "-";
            document.getElementById("infoSize").innerText = data.size || "-";
            document.getElementById("infoQty").innerText = data.qty || "1";
            document.getElementById("lastItemCard").classList.add("active");

            robotBicara(`Barang kembali. SKU ${data.sku || ''}, Warna ${data.warna || ''}, Ukuran ${data.size || ''}`);

            scanHistory.unshift({
                resi: resi,
                desc: `${data.sku || resi} (${data.warna || ''} / Sz ${data.size || ''})`,
                status: "KEMBALI",
                badge: "badge-kembali"
            });
        } else {
            setLampu("merah", "Resi Tidak Ditemukan");
            robotBicara("Resi tidak ditemukan");
            scanHistory.unshift({
                resi: resi,
                desc: "Tidak terdaftar di database",
                status: "GAGAL",
                badge: "badge-notfound"
            });
        }

        localStorage.setItem("returHistory", JSON.stringify(scanHistory.slice(0, 15)));
        renderHistory();

    } catch (err) {
        setLampu("merah", "Error Koneksi");
        robotBicara("Terjadi kesalahan koneksi");
    }

    setTimeout(() => {
        if (html5QrCode) {
            html5QrCode.resume();
        }
    }, 2000);
}

function renderHistory() {
    document.getElementById("historyBody").innerHTML = scanHistory.map(item => `
        <tr>
            <td><strong>${item.resi}</strong><br><span style="color:#94a3b8; font-size:10px;">${item.desc || ''}</span></td>
            <td><span class="badge ${item.badge}">${item.status}</span></td>
        </tr>
    `).join("");
}