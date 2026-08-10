document.addEventListener('DOMContentLoaded', () => {
    const btnProsesJnt = document.getElementById('btnProsesJnt');
    const dataJnt = document.getElementById('dataJnt');
    const logJnt = document.getElementById('logJnt');

    if (btnProsesJnt) {
        btnProsesJnt.addEventListener('click', () => {
            const teks = dataJnt.value.trim();
            if (!teks) {
                alert('Kotak teks masih kosong, silakan tempel data resi terlebih dahulu!');
                return;
            }

            logJnt.innerHTML += `<br>[${new Date().toLocaleTimeString()}] Memproses data retur J&T...`;
            logJnt.scrollTop = logJnt.scrollHeight;

            setTimeout(() => {
                logJnt.innerHTML += `<br>[${new Date().toLocaleTimeString()}] Data Retur J&T Berhasil Disimpan!`;
                logJnt.scrollTop = logJnt.scrollHeight;
                
                // Bot bicara otomatis
                if (typeof bicara === 'function') {
                    bicara("Upload JNT sukses");
                }

                dataJnt.value = '';
            }, 800);
        });
    }
});
