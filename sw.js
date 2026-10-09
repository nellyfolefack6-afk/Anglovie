'use strict';
const CACHE = 'anglovie-silfa-3.3.1';
const FILES = ['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable.png','./icons/favicon.svg'];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('anglovie-silfa-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch', event => {
  const url=new URL(event.request.url);
  if (event.request.method!=='GET'||url.origin!==self.location.origin||url.pathname.includes('/.netlify/')) return;
  if(event.request.mode==='navigate') {
    event.respondWith(fetch(event.request).then(r=>{if(r.ok){const copy=r.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put('./index.html',copy)));}return r;}).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request)));
});
