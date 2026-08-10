let teksTerakhir = ""; // Menyimpan teks suara terakhir buat tombol play ulang

document.addEventListener('DOMContentLoaded', () => {
    const btnProsesRetur = document.getElementById('btnProsesRetur');
    const btnUlangSuara = document.getElementById('btnUlangSuara');
    const inputResiRetur = document.getElementById('resiRetur');
    const logBoxRetur = document.getElementById('logRetur');

    if (btnProsesRetur) {
        btnProsesRetur.addEventListener('click', prosesRetur);
    }

    if (inputResiRetur) {
        inputResiRetur.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                prosesRetur();
            }
        });
    }

    // Fitur Play Ulang Suara Terakhir
    if (btnUlangSuara) {
        btnUlangSuara.addEventListener('click', () => {
            if (teksTerakhir && typeof bicara === 'function') {
                bicara(teksTerakhir);
            } else {
                alert('Belum ada suara untuk diulang.');
            }
        });
    }

    function prosesRetur() {
        const alasan = document.getElementById('alasan').value;
        const resi = inputResiRetur.value.trim();

        if (!resi) {
            alert('Nomor resi retur tidak boleh kosong!');
            return;
        }

        // Simulasi Pengecekan Database (Nanti dihubungkan ke Apps Script)
        // Misal kita buat simulasi: kalau resi berawalan "ERR", dianggap tidak ketemu
        let dataDitemukan = true; 
        if (resi.toUpperCase().startsWith('ERR')) {
            dataDitemukan = false;
        }

        if (dataDitemukan) {
            // Contoh data hasil dari database/upload
            const namaBarang = "Sepatu Sneakers Pria";
            const skuBarang = "SNK-BLK-42";
            const qtyBarang = "1";

            logBoxRetur.innerHTML += `<br>[${new Date().toLocaleTimeString()}] Resi: ${resi}<br>👉 Barang: ${namaBarang} | SKU: ${skuBarang} | QTY: ${qtyBarang} (${alasan})`;
            logBoxRetur.scrollTop = logBoxRetur.scrollHeight;

            // Format kalimat bot bicara
            teksTerakhir = `Barang sudah kembali, ${namaBarang}, SKU ${skuBarang}, QTY ${qtyBarang}`;
            
            if (typeof bicara === 'function') {
                bicara(teksTerakhir);
            }
        } else {
            logBoxRetur.innerHTML += `<br>[${new Date().toLocaleTimeString()}] Resi: ${resi} -> ❌ Tidak Ditemukan!`;
            logBoxRetur.scrollTop = logBoxRetur.scrollHeight;

            teksTerakhir = "Resi tidak ditemukan";
            
            if (typeof bicara === 'function') {
                bicara(teksTerakhir);
            }
        }
        
        inputResiRetur.value = '';
        inputResiRetur.focus();
    }
});

// Pendaftaran Service Worker PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js');
  });
}
