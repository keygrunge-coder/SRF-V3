// ================================
// SRF V3
// script.js
// ================================

// ================================
// CONFIG
// ================================

// ================================
// APP SCRIPT URL
// ================================

function getAppUrl(){

    const url =
    localStorage.getItem("APP_URL");

    if(!url){

        showNotif(
            "Atur Apps Script terlebih dahulu",
            "warning"
        );

        setTimeout(()=>{

            location.href="pengaturan.html";

        },1000);

        return null;

    }

    return url;

}
let html5QrCode = null;
let isProcessing = false;

let scanHistory =
JSON.parse(localStorage.getItem("scanHistory") || "[]");

// ================================
// AUTO START
// ================================

window.onload = function () {

    renderHistory();

    if(document.getElementById("reader")){
        startCamera();
    }

};

// ================================
// SUARA
// ================================

function robotBicara(teks){

    if(!("speechSynthesis" in window)) return;

    speechSynthesis.cancel();

    const suara =
    new SpeechSynthesisUtterance(teks);

    suara.lang="id-ID";
    suara.rate=1.15;
    suara.pitch=1;

    speechSynthesis.speak(suara);

}

// ================================
// BEEP
// ================================

function beep(freq=900,durasi=120){

    try{

        const ctx =
        new(window.AudioContext||window.webkitAudioContext)();

        const osc = ctx.createOscillator();

        osc.type="sine";

        osc.frequency.value=freq;

        osc.connect(ctx.destination);

        osc.start();

        osc.stop(ctx.currentTime + durasi/1000);

    }catch(e){}

}

// ================================
// LAMPU
// ================================

function setLampu(warna,pesan){

    const lamp =
    document.getElementById("bca-indicator");

    const status =
    document.getElementById("status-message");

    if(!lamp || !status) return;

    if(warna==="ijo")
        lamp.style.background="#00cc44";

    if(warna==="kuning")
        lamp.style.background="#ffcc00";

    if(warna==="merah")
        lamp.style.background="#ff3333";

    status.innerText=pesan;

}

// ================================
// NOTIFIKASI
// ================================

function showNotif(text,type){

    const notif =
    document.getElementById("notif");

    if(!notif) return;

    notif.className=type;

    notif.innerHTML=text;

    notif.style.display="block";

    setTimeout(()=>{

        notif.style.display="none";

    },2000);

}

// ================================
// START CAMERA
// ================================

function startCamera(){

    if(html5QrCode) return;

    html5QrCode =
    new Html5Qrcode("reader");

    html5QrCode.start(

        {
            facingMode:"environment"
        },

        {
            fps:15,
            qrbox:220
        },

        function(decodedText){

            if(isProcessing) return;

            isProcessing=true;

            html5QrCode.pause();

            saveResi(
                decodedText.trim()
            );

        }

    ).then(()=>{

        setLampu(
            "ijo",
            "Scanner Siap"
        );

        robotBicara(
            "Scanner siap"
        );

    });

}

// ================================
// TOMBOL CAMERA
// ================================

const startBtn =
document.getElementById("startBtn");

if(startBtn){

    startBtn.onclick=startCamera;

}

// ================================
// SIMPAN RESI
// ================================
async function saveResi(resi){

    const APP_URL = getAppUrl();

    if(!APP_URL) return;

    setLampu("kuning","Mengirim...");

    try{

        const response = await fetch(APP_URL,{
            method:"POST",
            headers:{
                "Content-Type":"text/plain"
            },
            body:JSON.stringify({
                source:"pengiriman",
                resi:resi
            })
        });

        const json = await response.json();

        if(json.status==="success"){

            beep(1000);

            if(navigator.vibrate){
                navigator.vibrate(150);
            }

            robotBicara("Berhasil");

            setLampu(
                "ijo",
                "Berhasil Disimpan"
            );

            showNotif(
                "✓ BERHASIL",
                "success"
            );

            scanHistory.unshift({

                resi:resi,

                status:"SUKSES"

            });

        }

        else if(json.status==="duplicate"){

            beep(350);

            robotBicara(
                "Resi dobel"
            );

            setLampu(
                "merah",
                "Resi Sudah Ada"
            );

            showNotif(
                "⚠ DUPLIKAT",
                "warning"
            );

            scanHistory.unshift({

                resi:resi,

                status:"DUPLIKAT"

            });

        }

        else{

            beep(180);

            robotBicara(
                "Resi tidak valid"
            );

            setLampu(
                "merah",
                "Resi Invalid"
            );

            showNotif(
                "✗ INVALID",
                "error"
            );

            scanHistory.unshift({

                resi:resi,

                status:"INVALID"

            });

        }

        localStorage.setItem(
            "scanHistory",
            JSON.stringify(
                scanHistory.slice(0,100)
            )
        );

        renderHistory();

    }catch(err){

        beep(200);

        robotBicara(
            "Koneksi gagal"
        );

        setLampu(
            "merah",
            "Server Tidak Terhubung"
        );

        showNotif(
            "Koneksi Gagal",
            "error"
        );

    }

    setTimeout(()=>{

        isProcessing=false;

        if(html5QrCode){

            html5QrCode.resume();

        }

    },1500);

}
// ================================
// INPUT MANUAL
// ================================

const manualBtn =
document.getElementById("manualBtn");

if(manualBtn){

    manualBtn.addEventListener("click",()=>{

        const input =
        document.getElementById("manualResi");

        if(!input) return;

        const resi =
        input.value.trim().toUpperCase();

        if(resi===""){

            input.focus();

            return;

        }

        saveResi(resi);

        input.value="";

    });

}

// ================================
// ENTER = SIMPAN
// ================================

const manualInput =
document.getElementById("manualResi");

if(manualInput){

    manualInput.addEventListener("keypress",(e)=>{

        if(e.key==="Enter"){

            e.preventDefault();

            manualBtn.click();

        }

    });

}

// ================================
// HISTORY
// ================================

function renderHistory(){

    const body =
    document.getElementById("historyBody");

    if(!body) return;

    body.innerHTML="";

    scanHistory
    .slice(0,15)
    .forEach(item=>{

        let badge="badge-keluar";

        if(item.status==="DUPLIKAT")
            badge="badge-duplikat";

        if(item.status==="INVALID")
            badge="badge-invalid";

        body.innerHTML+=`

        <tr>

            <td>${item.resi}</td>

            <td>

                <span class="badge ${badge}">

                    ${item.status}

                </span>

            </td>

        </tr>

        `;

    });

}

// ================================
// CLEAR HISTORY
// ================================

function clearHistory(){

    scanHistory=[];

    localStorage.removeItem("scanHistory");

    renderHistory();

}

// ================================
// FORMAT TANGGAL
// ================================

function formatTanggal(date=new Date()){

    return date.toLocaleString("id-ID",{

        day:"2-digit",
        month:"2-digit",
        year:"numeric",

        hour:"2-digit",
        minute:"2-digit"

    });

}

// ================================
// SPX UPLOAD (DIPERBAIKI)
// ================================

async function uploadReturSPX() {
    const fileInput = document.getElementById("excelFile");
    const file = fileInput.files[0];

    if (!file) {
        showNotif("Pilih file Excel terlebih dahulu", "warning");
        return;
    }

    const reader = new FileReader();

    // Definisikan apa yang terjadi setelah file dibaca
    reader.onload = async function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        try {
            const APP_URL = getAppUrl();
            if (!APP_URL) return;

            setLampu("kuning", "Mengupload...");

            const response = await fetch(APP_URL, {
                method: "POST",
                headers: { "Content-Type": "text/plain" },
                body: JSON.stringify({
                    source: "uploadreturspx",
                    rows: rows
                })
            });

            const json = await response.json();

            document.getElementById("totalUpload").innerText = json.total || 0;
            
            setLampu("ijo", "Upload Selesai");
            robotBicara("Upload selesai");
            showNotif("Upload Berhasil", "success");

        } catch (err) {
            setLampu("merah", "Koneksi Gagal");
            showNotif("Koneksi Gagal", "error");
        }
    };

    // Eksekusi pembacaan file
    reader.readAsArrayBuffer(file);
}
