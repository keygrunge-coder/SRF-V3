const json = await response.json();

if(json.status==="success"){

    beep(1000);

    robotBicara("Retur berhasil");

    setLampu(
        "ijo",
        "Retur Berhasil"
    );

    showNotif(
        "✓ RETUR BERHASIL",
        "success"
    );

    scanHistory.unshift({

        resi:resi,

        status:"KEMBALI"

    });

}

else if(json.status==="duplicate"){

    beep(350);

    robotBicara("Sudah kembali");

    setLampu(
        "merah",
        "Sudah Pernah Scan"
    );

    showNotif(
        "⚠ SUDAH KEMBALI",
        "warning"
    );

    scanHistory.unshift({

        resi:resi,

        status:"SUDAH KEMBALI"

    });

}

else if(json.status==="notfound"){

    beep(200);

    robotBicara("Resi tidak ditemukan");

    setLampu(
        "kuning",
        "Resi Tidak Ditemukan"
    );

    showNotif(
        "RESI TIDAK DITEMUKAN",
        "error"
    );

    scanHistory.unshift({

        resi:resi,

        status:"NOT FOUND"

    });

}
