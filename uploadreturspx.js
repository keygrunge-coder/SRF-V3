document.addEventListener('DOMContentLoaded', () => {
    const btnProsesSpx = document.getElementById('btnProsesSpx');
    const dataSpx = document.getElementById('dataSpx');
    const logSpx = document.getElementById('logSpx');

    if (btnProsesSpx) {
        btnProsesSpx.addEventListener('click', () => {
            const teks = dataSpx.value.trim();
            if (!teks) {
                alert('Kotak teks masih kosong, silakan tempel data resi terlebih dahulu!');
                return;
            }

            logSpx.innerHTML += `<br>[${new Date().toLocaleTimeString()}] Memproses data retur SPX...`;
            logSpx.scrollTop = logSpx.scrollHeight;

            setTimeout(() => {
                logSpx.innerHTML += `<br>[${new Date().toLocaleTimeString()}] Data Retur SPX Berhasil Disimpan!`;
                logSpx.scrollTop = logSpx.scrollHeight;
                
                // Bot bicara otomatis
                if (typeof bicara === 'function') {
                    bicara("Upload SPX sukses");
                }

                dataSpx.value = '';
            }, 800);
        });
    }
});
