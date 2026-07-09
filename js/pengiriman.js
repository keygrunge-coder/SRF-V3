// =====================================
// SRF V3
// pengiriman.js
// =====================================

let html5QrCode = null;
let isProcessing = false;

let scanHistory =
JSON.parse(localStorage.getItem("scanHistory") || "[]");

// =====================================
// APP URL
// =====================================

function getAppUrl(){

    const url = localStorage.getItem("APP_URL");

    if(!url){

        alert("Atur Apps Script di Pengaturan");

        location.href="pengaturan.html";

        return null;

    }

    return url;

}

// =====================================
// AUTO START
// =====================================

window.onload=function(){

    renderHistory();

    startCamera();

};

// =====================================
// START CAMERA
// =====================================

function startCamera(){

    if(html5QrCode) return;

    html5QrCode=new Html5Qrcode("reader");

    html5QrCode.start(

        {facingMode:"environment"},

        {

            fps:15,

            qrbox:220

        },

        function(decodedText){

            if(isProcessing) return;

            isProcessing=true;

            html5QrCode.pause();

            saveResi(decodedText.trim());

        }

    );

}

// =====================================
// SIMPAN
// =====================================

async function saveResi(resi){

    const APP_URL=getAppUrl();

    if(!APP_URL) return;

    try{

        const response=await fetch(APP_URL,{

            method:"POST",

            headers:{

                "Content-Type":"text/plain"

            },

            body:JSON.stringify({

                source:"pengiriman",

                resi:resi

            })

        });

        const json=await response.json();

        if(json.status==="success"){

            scanHistory.unshift({

                resi:resi,

                status:"SUKSES"

            });

            showNotif("Berhasil","success");

        }

        else if(json.status==="duplicate"){

            scanHistory.unshift({

                resi:resi,

                status:"DOUBLE RESI"

            });

            showNotif("DOUBLE RESI","warning");

        }

        else{

            scanHistory.unshift({

                resi:resi,

                status:"INVALID"

            });

            showNotif("INVALID","error");

        }

        localStorage.setItem(

            "scanHistory",

            JSON.stringify(scanHistory.slice(0,100))

        );

        renderHistory();

    }

    catch(err){

        showNotif("Server Tidak Terhubung","error");

    }

    setTimeout(()=>{

        isProcessing=false;

        if(html5QrCode){

            html5QrCode.resume();

        }

    },500);

}

// =====================================
// HISTORY
// =====================================

function renderHistory(){

    const body=document.getElementById("historyBody");

    if(!body) return;

    body.innerHTML="";

    scanHistory.slice(0,20).forEach(item=>{

        body.innerHTML+=`

        <tr>

            <td>${item.resi}</td>

            <td>${item.status}</td>

        </tr>

        `;

    });

}

// =====================================
// INPUT MANUAL
// =====================================

function inputManual(){

    const input=document.getElementById("manualResi");

    if(!input.value.trim()) return;

    saveResi(input.value.trim().toUpperCase());

    input.value="";

}
