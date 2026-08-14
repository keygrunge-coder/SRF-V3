const CACHE_NAME = "srf-v3-v1";

const APP_FILES = [
    "./",
    "./index.html",
    "./pengiriman.html",
    "./scanretur.html",
    "./kalkulator.html",
    "./uploadjnt.html",
    "./uploadspx.html",
    "./seojudulspx.html",
    "./config.js",
    "./manifest.json"
];


/* =========================================================
   INSTALL
========================================================= */

self.addEventListener("install", event => {

    console.log("SRF V3 SW: INSTALL");

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                return cache.addAll(APP_FILES);

            })
            .then(() => {

                return self.skipWaiting();

            })

    );

});


/* =========================================================
   ACTIVATE
========================================================= */

self.addEventListener("activate", event => {

    console.log("SRF V3 SW: ACTIVATE");

    event.waitUntil(

        caches.keys()
            .then(keys => {

                return Promise.all(

                    keys
                        .filter(key => key !== CACHE_NAME)
                        .map(key => caches.delete(key))

                );

            })
            .then(() => {

                return self.clients.claim();

            })

    );

});


/* =========================================================
   FETCH
========================================================= */

self.addEventListener("fetch", event => {

    const request = event.request;

    /*
     * Hanya GET.
     *
     * POST ke Apps Script JANGAN dicegat
     * supaya scan / upload tetap langsung
     * menuju server.
     */

    if(request.method !== "GET"){

        return;

    }


    /*
     * Jangan cache request eksternal
     * seperti Google Apps Script.
     */

    const url = new URL(request.url);

    if(
        url.origin !== self.location.origin
    ){

        return;

    }


    /*
     * Network First
     *
     * Kalau internet ada:
     * ambil versi terbaru.
     *
     * Kalau gagal:
     * pakai cache.
     */

    event.respondWith(

        fetch(request)

            .then(response => {

                if(
                    response &&
                    response.status === 200
                ){

                    const copy =
                        response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {

                            cache.put(
                                request,
                                copy
                            );

                        });

                }

                return response;

            })

            .catch(() => {

                return caches.match(request);

            })

    );

});
