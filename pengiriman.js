document.addEventListener('DOMContentLoaded', () => {
    const btnProses = document.getElementById('btnProses');
    const inputResi = document.getElementById('resi');
    const logBox = document.getElementById('log');

    if (btnProses) {
        btnProses.addEventListener('click', kirimData);
    }

    if (inputResi) {
        inputResi.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                kirimData();
            }
        });
    }

    function kirimData() {
        const ekspedisi = document.getElementById('ekspedisi').value;
        const resi = inputResi.value.trim();

        if (!resi) {
            alert('Nomor resi tidak boleh kosong!');
            return;
        }

        logBox.innerHTML += `<br>[${new Date().toLocaleTimeString()}] Mengirim ${resi} (${ekspedisi})...`;
        logBox.scrollTop = logBox.scrollHeight;
        
        // Panggil Bot Bicara sesuai ekspedisi
        if (ekspedisi === 'J&T') {
            bicara("JNT sukses");
        } else if (ekspedisi === 'SPX') {
            bicara("SPX sukses");
        } else {
            bicara(`${ekspedisi} sukses`);
        }

        inputResi.value = '';
        inputResi.focus();
    }
});

// Pendaftaran Service Worker PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js');
  });
}
