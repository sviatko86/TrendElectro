/* Trend Electro: service worker. Сторінка й основні файли — з мережі (якщо мережа повільна понад 3 с — з памʼяті); фото товарів — одразу з памʼяті телефону, оновлюються у фоні. */
const V="te-shell-29",IMG="te-img-2",MAXIMG=1200,S=self.registration.scope,CORE=["","index.html","app.js","app.css","config.js","articles.json","logo1.webp","logo2.webp","manifest.webmanifest"].map(x=>S+x);
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>Promise.allSettled(CORE.map(u=>c.add(u)))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==IMG).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
let trimming=0;
function trim(c){if(trimming)return;trimming=1;c.keys().then(ks=>ks.length>MAXIMG?Promise.all(ks.slice(0,ks.length-MAXIMG+100).map(k=>c.delete(k))):0).catch(()=>{}).then(()=>{trimming=0})}
function old(res){const d=Date.parse(res.headers.get("date")||"");return !d||Date.now()-d>2592e5}
self.addEventListener("fetch",e=>{
 const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);if(u.origin!==location.origin)return;
 /* фото товарів і статей: спершу з памʼяті, раз на 3 дні тихо оновлюємо */
 if(/\/img\/(?:s\/)?[^/]+\.(webp|jpg|jpeg|png)$/i.test(u.pathname)){
  e.respondWith(caches.open(IMG).then(c=>c.match(r.url).then(x=>{
   const net=()=>fetch(r).then(res=>{if(res.ok){c.put(r.url,res.clone()).then(()=>trim(c)).catch(()=>{})}return res});
   if(x){if(old(x))e.waitUntil(net().catch(()=>{}));return x}
   return net()})));return}
 const m=u.pathname.match(/\/(app\.js|app\.css)$/);
 if(m&&u.search){e.respondWith(caches.open(V).then(c=>c.match(r.url).then(x=>x||fetch(r).then(res=>{if(res.ok){c.put(r.url,res.clone());c.keys().then(ks=>ks.forEach(k=>{if(k.url!==r.url&&k.url.indexOf(m[1]+"?")>-1)c.delete(k)}))}return res}))));return}
 const key=u.origin+u.pathname,core=CORE.includes(key)||CORE.includes(key+"index.html");
 if(!core&&r.mode!=="navigate")return;
 const cached=()=>caches.match(key).then(x=>x||(r.mode==="navigate"?caches.match(S+"index.html"):null));
 const net=fetch(r).then(res=>{if(res.ok&&core){const c=res.clone();caches.open(V).then(ch=>ch.put(key,c))}return res});
 /* повільна мережа: чекаємо не довше 3 с, далі показуємо збережену версію */
 e.respondWith(Promise.race([net.catch(()=>null),new Promise(z=>setTimeout(()=>z(null),core?3000:6e5))]).then(res=>res||cached().then(x=>x||net)).catch(()=>Response.error()))
});
