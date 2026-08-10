document.addEventListener('DOMContentLoaded', () => {
    const inputApiUrl = document.getElementById('apiUrl');
    const inputKunci = document.getElementById('kunciAkses');
    const btnSimpan = document.getElementById('btnSimpanConfig');
    const logConfig = document.getElementById('logConfig');

    // Ambil data yang tersimpan di localStorage atau dari config.js
    const savedUrl = localStorage.getItem('SRF_API_URL') || CONFIG.API_URL || '';
    const savedKey = localStorage.getItem('SRF_KEY') || CONFIG.DEFAULT_KEY || 'SRF';

    inputApiUrl.value = savedUrl;
    inputKunci.value = savedKey;

    logConfig.innerHTML = `[${new Date().toLocaleTimeString()}] Pengaturan siap dimuat.<br>Kunci aktif: ${savedKey}`;

    if (btnSimpan) {
        btnSimpan.addEventListener('click', () => {
            const newUrl = inputApiUrl.value.trim();
            const newKey = inputKunci.value.trim();

            if (!newKey) {
                alert('Kunci akses tidak boleh kosong!');
                return;
            }

            // Simpan ke localStorage HP
            localStorage.setItem('SRF_API_URL', newUrl);
            localStorage.setItem('SRF_KEY', newKey);

            logConfig.innerHTML += `<br>[${new Date().toLocaleTimeString()}] ✅ Pengaturan berhasil disimpan!`;
            logConfig.scrollTop = logConfig.scrollHeight;

            alert('Pengaturan berhasil disimpan ke perangkat!');
        });
    }
});

// Pendaftaran Service Worker PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js');
  });
}
