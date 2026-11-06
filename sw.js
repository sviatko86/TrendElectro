/* Trend Electro: мінімальний service worker. Мережа в пріоритеті, кеш — запасний варіант без інтернету. */
const V="te-shell-1",S=self.registration.scope,CORE=["","index.html","app.js","app.css","config.js","articles.json","logo1.webp","logo2.webp","manifest.webmanifest"].map(x=>S+x);
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>Promise.allSettled(CORE.map(u=>c.add(u)))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
 const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);if(u.origin!==location.origin)return;
 const key=u.origin+u.pathname,core=CORE.includes(key)||CORE.includes(key+"index.html");
 e.respondWith(fetch(r).then(res=>{if(res.ok&&core){const c=res.clone();caches.open(V).then(ch=>ch.put(key,c))}return res}).catch(()=>caches.match(key).then(x=>x||(r.mode==="navigate"?caches.match(S+"index.html"):null)).then(x=>x||Response.error())))
});
