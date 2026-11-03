// Service worker di Gare Trota Web.
// Per pubblicare una nuova versione: aumenta il numero qui sotto (v1 -> v2 ...).
// Ogni modifica a index.html deve aumentare VERSIONE, altrimenti i tablet tengono la versione vecchia.
// La nuova versione non si attiva da sola: nella pagina compare "Nuova versione: Aggiorna".
const VERSIONE = "garetrota-v13";
// librerie di Firebase (www.gstatic.com): cache separata, non si cancella a ogni versione
const CACHE_FIREBASE = "firebase-sdk-10.14.1";

const SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./firebase-config.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", e => {
  // cache: "reload" scavalca la cache HTTP (GitHub Pages: max-age=600), altrimenti
  // la nuova versione potrebbe salvare i file vecchi.
  e.waitUntil(caches.open(VERSIONE)
    .then(c => c.addAll(SHELL.map(u => new Request(u, { cache: "reload" })))));
});

// la pagina lo chiede quando premi "Aggiorna"
self.addEventListener("message", e => { if (e.data === "aggiorna") self.skipWaiting(); });

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSIONE && k !== CACHE_FIREBASE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // SDK di Firebase: prima la cache (l'indirizzo contiene la versione, il file non cambia)
  if (url.origin === "https://www.gstatic.com" && url.pathname.startsWith("/firebasejs/")) {
    e.respondWith(caches.open(CACHE_FIREBASE).then(c => c.match(req).then(r => r || fetch(req).then(res => {
      if (res.ok) c.put(req, res.clone());
      return res;
    }))));
    return;
  }
  if (url.origin !== location.origin) return;
  // configurazione di Firebase: prima la rete, senza rete la copia in cache
  if (url.pathname.endsWith("/firebase-config.js")) {
    e.respondWith(fetch(req, { cache: "no-cache" }).then(res => {
      if (res.ok) { const copia = res.clone(); caches.open(VERSIONE).then(c => c.put("./firebase-config.js", copia)); }
      return res;
    }).catch(() => caches.match("./firebase-config.js")));
    return;
  }
  // App shell: prima la cache (aggiornata a ogni nuova VERSIONE).
  e.respondWith(
    caches.match(req, { ignoreSearch: req.mode === "navigate" })
      .then(r => r || (req.mode === "navigate" ? caches.match("./index.html") : null))
      .then(r => r || fetch(req))
  );
});
