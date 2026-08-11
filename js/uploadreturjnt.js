// Tambahan agar bisa tekan Ctrl + Enter untuk langsung upload
document.getElementById("rawData").addEventListener("keydown", function(event) {
    if (event.key === "Enter" && event.ctrlKey) {
        event.preventDefault();
        uploadRetur();
    }
});

async function uploadRetur(){

    const text = document.getElementById("rawData").value.trim();

    if(!text){
        alert("Paste data dulu");
        return;
    }

    document.getElementById("hasilBerhasil").innerText = "...";
    document.getElementById("hasilDuplikat").innerText = "...";
    document.getElementById("listBerhasil").value = "Sedang memproses...";
    document.getElementById("listDuplikat").value = "Sedang memproses...";

    try{

        const r = await fetch(CONFIG.APP_URL,{
            method:"POST",
            body:JSON.stringify({
                source:"uploadRetur",
                text:text
            })
        });

        const json = await r.json();

        document.getElementById("hasilBerhasil").innerText = json.berhasil || 0;
        document.getElementById("hasilDuplikat").innerText = json.duplikat || 0;
        
        document.getElementById("listBerhasil").value = (json.listBerhasil || []).join("\n");
        document.getElementById("listDuplikat").value = (json.listDuplikat || []).join("\n");

    }catch(err){

        document.getElementById("listBerhasil").value = err.toString();
        document.getElementById("listDuplikat").value = err.toString();

    }
}