// =====================================
// SRF V3 - FULL VERSION - pengiriman.js
// =====================================
let html5QrCode = null;
let isProcessing = false;
let isSyncing = false;

let scanQueue = [];
let scanHistory = [];

// =====================================
// APP URL
// =====================================

function getAppUrl(){

    const url = localStorage.getItem("APP_URL");

    if(!url){

        alert("Atur Apps Script di Pengaturan");

        location.href = "pengaturan.html";

        return null;

    }

    return url;

}
// =====================================
// AUTO START
// =====================================

window.onload = function(){

    renderHistory();

    startCamera();

};
// =====================================
// HISTORY
// =====================================

function renderHistory(){

    const body = document.getElementById("historyBody");

    if(!body) return;

    body.innerHTML = "";

    scanHistory
    .slice(0,20)
    .forEach(item=>{

        body.innerHTML += `

        <tr>

            <td>${item.resi}</td>

            <td>${item.status}</td>

        </tr>

        `;

    });

}

// =====================================
// START CAMERA
// =====================================

function startCamera(){

    if(!document.getElementById("reader")) return;

    if(html5QrCode) return;

    html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(

        {
            facingMode:"environment"
        },

        {
            fps:15,
            qrbox:220
        },

        onScanSuccess,

        function(error){
            // abaikan error scan
        }

    );

}

// =====================================
// HASIL SCAN
// =====================================

function onScanSuccess(decodedText){

    if(isProcessing) return;

    isProcessing = true;

    const resi = decodedText.trim().toUpperCase();

    addQueue(resi);

}

// =====================================
// MASUK ANTRIAN
// =====================================

function addQueue(resi){

    // Cegah scan yang sama saat masih antre
    if(scanQueue.includes(resi)){

        isProcessing = false;

        if(html5QrCode){
            html5QrCode.resume();
        }

        return;

    }

    scanQueue.push(resi);

    scanHistory.unshift({

        resi: resi,

        status: "ANTRIAN"

    });

    renderHistory();

    // Simpan ke Local Storage
    localStorage.setItem(
        "scanQueue",
        JSON.stringify(scanQueue)
    );

    localStorage.setItem(
        "scanHistory",
        JSON.stringify(scanHistory)
    );

    // Scanner langsung siap lagi
    isProcessing = false;

    if(html5QrCode){
        html5QrCode.resume();
    }

    // Langsung coba kirim ke server
    syncQueue();

}

// =====================================
// INPUT MANUAL
// =====================================

function inputManual(){

    const input =
    document.getElementById("manualResi");

    if(!input) return;

    const resi =
    input.value.trim().toUpperCase();

    if(resi==="") return;

    addQueue(resi);

    input.value="";

}

// =====================================
// SYNC QUEUE
// =====================================

async function syncQueue(){

    if(isSyncing) return;

    if(scanQueue.length===0) return;

    isSyncing = true;

    const APP_URL = getAppUrl();

    if(!APP_URL){

        isSyncing = false;

        return;

    }

    const resi = scanQueue[0];

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

        const item = scanHistory.find(x=>

            x.resi===resi &&
            x.status==="ANTRIAN"

        );

        if(item){

            if(json.status==="success"){

                item.status="SUKSES";

            }

            else if(json.status==="duplicate"){

                item.status="DOUBLE RESI";

            }

            else{

                item.status="INVALID";

            }

        }

        scanQueue.shift();

        localStorage.setItem(

            "scanQueue",

            JSON.stringify(scanQueue)

        );

        localStorage.setItem(

            "scanHistory",

            JSON.stringify(scanHistory)

        );

        renderHistory();

    }

    catch(err){

        console.log(err);

    }

    isSyncing = false;

}

