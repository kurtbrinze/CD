// Service worker — Envíos al CD
const VERSION = '20261009-0913';
const APP_CACHE = 'envios-cd-app-' + VERSION;
const LIB_CACHE = 'envios-cd-libs-v1'; // Pyodide, openpyxl, PDF.js, jsQR (no cambian con cada versión)
const APP_FILES = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png'];
const LIB_HOSTS = ['cdn.jsdelivr.net', 'cdnjs.cloudflare.com', 'pypi.org', 'files.pythonhosted.org'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(APP_CACHE).then(c => c.addAll(APP_FILES)));
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('envios-cd-app-') && k !== APP_CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Librerías externas: primero caché, si no está se descarga y se guarda
  if (LIB_HOSTS.includes(url.hostname)) {
    e.respondWith((async () => {
      const cache = await caches.open(LIB_CACHE);
      // El índice de PyPI cambia; se intenta la red y se usa la copia si no hay conexión
      if (url.hostname === 'pypi.org') {
        try { const r = await fetch(req); if (r.ok) cache.put(req, r.clone()); return r; }
        catch (err) { const hit = await cache.match(req); if (hit) return hit; throw err; }
      }
      const hit = await cache.match(req);
      if (hit) return hit;
      const r = await fetch(req);
      if (r.ok || r.type === 'opaque') cache.put(req, r.clone());
      return r;
    })());
    return;
  }

  // Archivos de la app: primero la red (para recibir mejoras), si no hay conexión la caché
  if (url.origin === self.location.origin) {
    e.respondWith((async () => {
      const cache = await caches.open(APP_CACHE);
      try {
        const r = await fetch(req);
        if (r.ok) cache.put(req, r.clone());
        return r;
      } catch (err) {
        return (await cache.match(req, { ignoreSearch: true })) || (req.mode === 'navigate' ? cache.match('./index.html') : Response.error());
      }
    })());
  }
});
