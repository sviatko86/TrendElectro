let RECOV=false;
let LAPPLY=0;
const $=i=>document.getElementById(i);
const curH=()=>location.hash||window.__R||"#/";
const BASE=window.__BASE||new URL(".",location.href).href,safeId=id=>String(id).replace(/[^A-Za-z0-9_-]/g,"_");let IMG=new Set,IMGS=new Set;
const esc=t=>String(t==null?"":t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const money=n=>{n=+n||0;return n.toLocaleString("uk-UA",{minimumFractionDigits:n%1?2:0,maximumFractionDigits:2})+" ₴"};
const LS=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}};
const SV=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const ico=(n,c)=>`<svg class="i${c?" "+c:""}"><use href="#i-${n}"/></svg>`;
/* кольорові ілюстровані іконки блоку переваг (малюнки в коді, без файлів) */
const PKA={
truck:'<g class="sp"><path d="M3 20h8M1 26h9M5 32h6" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".85"/></g><g class="tb"><rect x="10" y="13" width="21" height="18" rx="3" fill="#fff"/><rect x="10" y="22" width="21" height="3.2" fill="#ffb020"/><path d="M31 18h6.5l5.5 6v7.5H31z" fill="#ffd23f"/><path d="M34 20.2h3.2l3.2 3.6H34z" fill="#c9f1ff"/></g><g class="wh1"><circle cx="18" cy="34" r="4.6" fill="#2b3a4a" stroke="#fff" stroke-width="1.6"/><path d="M18 31.2v5.6M15.2 34h5.6" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/></g><g class="wh2"><circle cx="36" cy="34" r="4.6" fill="#2b3a4a" stroke="#fff" stroke-width="1.6"/><path d="M36 31.2v5.6M33.2 34h5.6" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/></g>',
wallet:'<defs><clipPath id="pkc"><rect x="7" y="15" width="34" height="23" rx="4.5"/></clipPath></defs><g class="cd"><rect x="7" y="15" width="34" height="23" rx="4.5" fill="#fff"/><g clip-path="url(#pkc)"><rect x="7" y="20" width="34" height="5" fill="#ff5d73"/><rect class="shn" x="-14" y="10" width="9" height="32" fill="#fff" opacity=".7" transform="skewX(-20)"/></g><rect x="11" y="29" width="8" height="5.4" rx="1.4" fill="#ffd23f"/><path d="M25 31.5h11" stroke="#d5dbe3" stroke-width="2" stroke-linecap="round"/></g><g class="coin"><circle cx="37.5" cy="14" r="7.4" fill="#ffd23f" stroke="#fff" stroke-width="1.6"/><text x="37.5" y="17.6" font-size="10.5" font-weight="800" text-anchor="middle" fill="#b86e00" font-family="Manrope,Inter,Arial,sans-serif">₴</text></g><path class="tw1" d="M9 9l1.2 2.8L13 13l-2.8 1.2L9 17l-1.2-2.8L5 13l2.8-1.2z" fill="#fff"/>',
shield:'<g class="shd"><path d="M24 5.5l15.5 5.6v11.6c0 9.3-6.4 16-15.5 19.8C14.9 38.7 8.5 32 8.5 22.7V11.1z" fill="#fff"/><path d="M24 10.5l10.6 3.9v8.2c0 6.5-4.4 11.3-10.6 14.1-6.2-2.8-10.6-7.6-10.6-14.1v-8.2z" fill="#22c55e"/><path class="ck" d="M18.6 23.2l4.2 4.2 7.6-8.6" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></g><path class="tw1" d="M8 8l1.1 2.5L11.6 11.6 9.1 12.7 8 15.2l-1.1-2.5L4.4 11.6l2.5-1.1z" fill="#ffe27a"/><path class="tw2" d="M41 12l.9 2 2 .9-2 .9-.9 2-.9-2-2-.9 2-.9z" fill="#ffe27a"/>',
chat:'<g class="bb"><rect x="6" y="8" width="29" height="22" rx="7.5" fill="#fff"/><path d="M13.5 29.5L12 38l9.5-8z" fill="#fff"/><circle class="d1" cx="14.5" cy="19" r="2.5" fill="#7c5cff"/><circle class="d2" cx="20.5" cy="19" r="2.5" fill="#a56bff"/><circle class="d3" cx="26.5" cy="19" r="2.5" fill="#d46bff"/></g><g class="sb"><rect x="26" y="26" width="17" height="12" rx="6" fill="#ffd2e6"/><path d="M38 37.5l2 5-6.5-5z" fill="#ffd2e6"/><path class="ht" d="M34.5 36.4c-3-2-4.7-3.4-4.7-5.2a2.4 2.4 0 0 1 4.7-.6 2.4 2.4 0 0 1 4.7.6c0 1.8-1.7 3.2-4.7 5.2z" fill="#ff4d8d"/></g>'
};
const pkArt=n=>PKA[n]?`<span class="pk" aria-hidden="true"><svg viewBox="0 0 48 48">${PKA[n]}</svg></span>`:ico(n);

const plural=(n,a,b,c)=>{const m=n%10,h=n%100;return n+" "+(m===1&&h!==11?a:m>=2&&m<=4&&(h<12||h>14)?b:c)};
const SEP=" › ",ORD=["Освітлення","Розетки та вимикачі","Кабельна продукція","Захист електромереж","Розподільні щити та бокси","Все для електромонтажу","Системи прокладки кабелю","Електротовари для дому","Вентилятори","Електрична тепла підлога"];
const PDEF={privacy:["Політика конфіденційності","Ця політика пояснює, які дані ми збираємо на сайті Trend Electro і навіщо.\nЯкі дані ми отримуємо: імʼя, номер телефону, адресу та коментар до замовлення; email і пароль (або вхід через сервіс авторизації), якщо ви створюєте кабінет; дату народження, якщо ви самі її вказали для персональної знижки; контакт (email або телефон), якщо ви підписалися на промокод чи вітання.\nНавіщо: щоб прийняти й виконати замовлення, звʼязатися з вами, надати знижку чи привітання, відповісти на звернення. Ми не продаємо ваші дані й не передаємо їх третім особам, крім випадків, потрібних для виконання замовлення (служба доставки) та технічної роботи сайту (хмарна база даних, сервіс повідомлень).\nДата народження використовується тільки для привітання та знижки в день народження. Ви можете змінити або видалити її у своєму кабінеті чи попросити нас це зробити.\nФайли cookie та реклама: сайт зберігає у вашому браузері кошик, вибране й налаштування. На рекламних сторінках (промо-лендінгах) можуть працювати інструменти аналітики та реклами (Meta Pixel, TikTok Pixel, Google Analytics), якщо ми їх підключили. Вони збирають знеособлену інформацію про перегляди та дії на сторінці. Ви можете вимкнути cookie у налаштуваннях браузера.\nЗберігання: дані зберігаються стільки, скільки потрібно для мети збору або вимагає закон. Ми захищаємо їх доступом за паролем і шифрованим зʼєднанням.\nВаші права: ви маєте право дізнатися, які ваші дані ми зберігаємо, виправити їх, відкликати згоду та вимагати видалення. Напишіть чи зателефонуйте нам за контактами зі сторінки «Контакти», і ми відповімо найближчим часом.\nУмови можуть оновлюватися; актуальна версія завжди на цій сторінці."],delivery:["Оплата і доставка","Відправляємо замовлення по всій Україні Новою поштою (у відділення, поштомат або кур’єром) та Укрпоштою.\nОплатити можна при отриманні або карткою — менеджер підтвердить замовлення телефоном і підкаже найзручніший варіант."],exchange:["Обмін та повернення","Обмін і повернення товару здійснюються відповідно до законодавства України про захист прав споживачів.\nЩоб оформити обмін або повернення, напишіть чи зателефонуйте нам — підкажемо, що робити, і допоможемо швидко вирішити питання."],coop:["Співпраця","Пропонуємо оптові ціни та зручні умови для електриків, монтажних організацій, дизайнерів і магазинів.\nНапишіть нам — підготуємо персональну пропозицію під ваш об’єкт."],about:["Про нас","Trend Electro — електротовари, LED-освітлення та електрофурнітура для дому, офісу й об’єктів.\nДопомагаємо підібрати рішення, швидко відправляємо по Україні та завжди на зв’язку."],contacts:["Контакти","Зв’яжіться з нами телефоном або в месенджері — відповімо й допоможемо з вибором."]};
const PERKS=[["truck","Швидка доставка","по Україні: Нова пошта та Укрпошта"],["wallet","Оплата зручним способом","при отриманні або карткою"],["shield","Гарантія від виробника","на всі товари"],["chat","Допомога з вибором","підкажемо, що підійде саме вам"]];
let P=[],PALL=[],M={},ROOT={kids:{},count:0,path:[]},PR={m:0,d:0,c:{}},CI={},CM={},SHOP={},PAGES={},sb=null,me=null,prof=null,promoPct=0,promoCode="",BN=[],bix=0,btm=null,tab="in",PROMOS=[];
let cart=LS("te_cart",{}),fav=LS("te_fav",{}),CMP=(a=>Array.isArray(a)?a.filter(x=>typeof x==="string").slice(0,4):[])(LS("te_cmp",[])),INSTEV=null,IOS=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1),STANDALONE=!!(window.matchMedia&&matchMedia("(display-mode: standalone)").matches||navigator.standalone),F={brand:"",min:"",max:"",sort:"def",q:"",lim:24,a:{},stock:false,fo:innerWidth>=860},SCR={},CUR={path:[],list:[],key:null},PTAB="info",QTY=1;

/* ---------- зображення ---------- */
/* легка копія фото (img/s/) для карток і списків — у 4 рази менша; якщо її немає, беремо звичайне фото */
const sm=(u,w)=>{if(w>480||!IMGS.size)return u;const m=u.indexOf(BASE+"img/")===0&&u.match(/\/img\/([^\/?]+)\.webp$/);return m&&IMGS.has(m[1])?BASE+"img/s/"+m[1]+".webp":u};
const thumb=(u,w,h)=>!u?"":u.indexOf(BASE)===0?sm(u,w):u.indexOf(".supabase.co/")>-1?u:"https://wsrv.nl/?url="+encodeURIComponent(u)+"&w="+w+"&h="+(h||Math.round(w*.75))+"&fit=contain&output=webp&q=75";
function bad(im){if(!im.dataset.f){im.dataset.f=1;im.src=im.dataset.o}else im.style.display="none"}
const img=(u,w,h,alt,hi)=>u?`<img ${hi?'fetchpriority="high"':'loading="lazy"'} decoding="async" src="${esc(thumb(u,w,h))}" data-o="${esc(u)}" alt="${esc(alt||"")}" onerror="bad(this)">`:"";

/* ---------- дерево категорій ---------- */
const href=path=>"#/c/"+path.map(encodeURIComponent).join("/");
const cmeta=path=>CM[path.join(SEP)]||{};
const hiddenPath=c=>{for(let i=1;i<=c.length;i++){const m=CM[c.slice(0,i).join(SEP)];if(m&&m.hidden)return true}return false};
function build(){
 P=PALL.filter(p=>!hiddenPath(p.c));M={};P.forEach(p=>M[p.id]=p);
 ROOT={name:"",path:[],kids:{},count:0};
 P.forEach(p=>{p.A=null;let n=ROOT;n.count++;p.c.forEach((nm,i)=>{let k=n.kids[nm];if(!k)k=n.kids[nm]={name:nm,path:p.c.slice(0,i+1),kids:{},count:0};k.count++;if(p.img&&(!k.img||(!(SHOP&&SHOP.cat_img_first)&&p.pr0>k.imp))){k.img=p.img;k.imp=p.pr0}n=k})});
}
function kids(n){
 const a=Object.keys(n.kids).map(k=>n.kids[k]),so=x=>{const s=cmeta(x.path).sort;return s==null?1e4:+s};
 a.sort((x,y)=>so(x)-so(y)||(n===ROOT?((ORD.indexOf(x.name)+1||99)-(ORD.indexOf(y.name)+1||99)):0)||y.count-x.count);
 return a;
}
function nodeAt(path){let n=ROOT;for(const k of path){n=n.kids[k];if(!n)return null}return n}
const nodeImg=n=>cmeta(n.path).image_url||CI[n.path.join(SEP)]||n.img||"";

/* ---------- ціни: націнка/знижка за рівнями (найточніший рівень виграє) ---------- */
function rate(p){
 const k1=p.c[0],k2=p.c[1]?k1+SEP+p.c[1]:null,k3=p.c[2]?k2+SEP+p.c[2]:null;let m=null,d=null;
 [k3,k2,k1].forEach(k=>{const o=k&&PR.c[k];if(o){if(m==null&&o.m!=null)m=+o.m;if(d==null&&o.d!=null)d=+o.d}});
 return[m!=null?m:PR.m,d!=null?d:PR.d];
}
const price=p=>{const r=rate(p);return Math.round(p.pr0*(1+r[0]/100)*(1-r[1]/100)*100)/100};
function oldPrice(p){const r=rate(p);if(r[1]>0)return Math.round(p.pr0*(1+r[0]/100)*100)/100;if(p.old>p.pr0)return Math.round(p.old*(1+r[0]/100)*100)/100;return 0}
const bdN=()=>Math.min(14,Math.max(1,Math.round(+(SHOP&&SHOP.bday_days)||3)));const bdDays=()=>{const n=bdN();return n===1?"1 день":n<5?n+" дні":n+" днів"};
const kyivDay=()=>{const p=new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Kyiv",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date()).split("-").map(Number);return Date.UTC(p[0],p[1]-1,p[2])};
function bdayInfo(){if(!(SHOP&&SHOP.bday_on&&prof&&prof.birthday))return null;const pct=Math.min(90,+SHOP.bday_percent||0);if(pct<=0)return null;const b=String(prof.birthday).split("-").map(Number),t=kyivDay(),y=new Date(t).getUTCFullYear();
 for(const yy of[y-1,y]){let m=b[1],d=b[2];if(m===2&&d===29&&new Date(Date.UTC(yy,1,29)).getUTCMonth()!==1){d=28}const s=Date.UTC(yy,m-1,d);if(t>=s&&t<=s+(bdN()-1)*864e5){const st=new Date(s).toISOString().slice(0,10);return{pct,end:new Date(s+(bdN()-1)*864e5),start:st,claimed:String(prof.bday_claim||"").slice(0,10)===st}}}return null}
const bdPct=()=>{const b=bdayInfo();return b&&b.claimed?b.pct:0};
function priceInfo(p){const pc0=price(p),o=oldPrice(p),pd=Math.max(prof?Math.max(+prof.discount_percent||0,bdPct(),cardPct()):0,LAPPLY),pc=pd>0?Math.round(pc0*(100-pd))/100:pc0,base=o||(pd>0?pc0:0),disc=base?Math.round((1-pc/base)*100):0;return{pc,base,disc,sale:o>0,pers:pd>0}}
const saleBadges=i=>(i.disc>0||i.sale?`<span class="bd s">${i.sale?"Розпродаж":"Ваша знижка"}</span>`:"")+(i.disc>0?`<span class="bd s2">−${i.disc}%</span>`:"");
const priceHtml=i=>`<div class="price${i.disc>0?" sale":""}">${money(i.pc)}${i.base>i.pc?`<s>${money(i.base)}</s>`:""}</div>`;
const oldHtml=p=>{const o=oldPrice(p);return o?`<s>${money(o)}</s>`:""};

/* ---------- картка товару ---------- */
function packHtml(p,big){if(SHOP.pack_off&&!(p.po>1))return"";const pr=priceInfo(p).pc;let h="";if(p.po>1){h=`Продається лише пачками по <b>${p.po} шт</b> · ≈ ${money(pr/p.po)} за 1 шт`}else if(p.pq>0){h=`Продається цілою бухтою: <b>${p.pq} м</b> · ≈ ${money(pr/p.pq)} за 1 м`}else{const t=[];if(p.ip>1)t.push("В упаковці: <b>"+p.ip+" шт</b>");h=t.join(" · ")}return h?`<div class="pk${big?" big":""}">${h}</div>`:""}
function card(p){
 const out=!p.st,pi=priceInfo(p),u="#/p/"+encodeURIComponent(p.id);
 const b=(p.hit?'<span class="bd h">Хіт продажу</span>':"")+(p.nw?'<span class="bd n">Новинка</span>':"")+(p.ofr?'<span class="bd p">Спецпропозиція</span>':"")+saleBadges(pi);
 return `<article class="card"><a class="pic" href="${u}" aria-label="${esc(p.n)}">${img(p.img,400,400,p.n)}${b?`<div class="bds">${b}</div>`:""}</a><button class="fv${fav[p.id]?" on":""}" data-f="${esc(p.id)}" aria-label="Додати в обране">${ico("heart")}</button>${cmpOn()?`<button class="cmpb${CMP.includes(p.id)?" on":""}" data-cmp="${esc(p.id)}" aria-label="Порівняти" title="Порівняти">${ico("cmp")}</button>`:""}<div class="body"><a class="name" href="${u}">${esc(p.n)}</a><div class="m2"><span class="sku">Арт. ${esc(p.id)}</span>${out?'<span class="stock no">Немає</span>':'<span class="stock">В наявності</span>'}</div>${priceHtml(pi)}${packHtml(p)}<button class="add" data-a="${esc(p.id)}"${out?" disabled":""}>${out?"Немає в наявності":ico("cart")+"У кошик"}</button></div></article>`;
}

/* ---------- дані ---------- */
let NOSP=false;
let CATBG=0;
async function loadProducts(){
 let all=[];{let c=null;try{c=JSON.parse(localStorage.getItem("te_cat")||"null")}catch(e){}if(c&&c.rows&&c.rows.length&&Date.now()-c.t<864e5){all=c.rows;NOSP=c.n||0;CATBG=Date.now()-c.t>6e4?1:0}}
 if(!all.length)all=await fetchProducts();
 mapRows(all)
}
async function fetchProducts(){
 let all=[];const step=1000,FULL=",special,pack_qty,in_pack,in_box,stock,pack_only",cols="id,name,category,subcategory,subcategory2,brand,price,old_price,image_url,in_stock,is_hit,is_new";
 if(window.__CAT){try{const rs=await window.__CAT;window.__CAT=null;if(rs&&rs.length&&rs.every(Array.isArray)&&rs[rs.length-1].length<step)all=rs.flat()}catch(e){all=[]}window.__CAT=null}
 if(all.length){SV("te_pc",all.length);try{localStorage.setItem("te_cat",JSON.stringify({t:Date.now(),n:0,rows:all}))}catch(e){try{localStorage.removeItem("te_cat")}catch(x){}}return all}
 {const N=+LS("te_pc",0)||3000;
  if(N){try{const pg=Math.ceil(N/step)+1,rs=await Promise.all(Array.from({length:pg},(_,i)=>sb.from("products").select(cols+FULL).eq("active",true).order("id").range(i*step,i*step+step-1)));if(!rs.some(r=>r.error)){all=rs.flatMap(r=>r.data);let f=pg*step;while(rs.length&&rs[rs.length-1].data.length===step){const r=await sb.from("products").select(cols+FULL).eq("active",true).order("id").range(f,f+step-1);if(r.error){all=[];break}all.push(...r.data);rs.push(r);f+=step}}}catch(e){all=[]}}
  if(!all.length){let from=0;
 for(;;){
  const cols="id,name,category,subcategory,subcategory2,brand,price,old_price,image_url,in_stock,is_hit,is_new";let r=null;for(const ex of NOSP===2?[""]:NOSP===1?[",special",""]:[",special,pack_qty,in_pack,in_box,stock,pack_only",",special,pack_qty,in_pack,in_box,stock",",special,pack_qty,in_pack,in_box",",special",""]){r=await sb.from("products").select(cols+ex).eq("active",true).order("id").range(from,from+step-1);if(!r.error){NOSP=ex===""?2:ex===",special"?1:0;break}}
  if(r.error)throw r.error;all.push(...r.data);if(r.data.length<step)break;from+=step;
  }
  }
  SV("te_pc",all.length);try{localStorage.setItem("te_cat",JSON.stringify({t:Date.now(),n:NOSP||0,rows:all}))}catch(e){try{localStorage.removeItem("te_cat")}catch(x){}}
 }
 return all
}
/* пошуковий індекс рахується лише тоді, коли він потрібен (швидший старт сайту) */
const lz=(o,k,v)=>{Object.defineProperty(o,k,{value:v,writable:true,configurable:true});return v};
const PX={get nn(){return lz(this,"nn",nrm(this.n))},get in(){return lz(this,"in",nrm(this.id))},get h(){return lz(this,"h",nrm(this.n+" "+this.id+" "+this.b+" "+this.c.join(" ")))}};
function idxWarm(){let i=0;const run=d=>{const t=Date.now();while(i<P.length&&(d&&d.timeRemaining?d.timeRemaining()>2:Date.now()-t<8)){const p=P[i++];p.nn;p.in;p.h}if(i<P.length)(window.requestIdleCallback||(f=>setTimeout(f,60)))(run)};(window.requestIdleCallback||(f=>setTimeout(f,1500)))(run)}
function mapRows(all){
 PALL=all.map(r=>Object.assign(Object.create(PX),{id:r.id,n:r.name,c:[r.category,r.subcategory,r.subcategory2].filter(x=>x&&x!=="Усі"),b:r.brand||"",pr0:+r.price||0,old:r.old_price!=null?+r.old_price:0,img:r.image_url||"",hit:!!r.is_hit,nw:!!r.is_new,ofr:r.special||"",sk:r.stock==null?null:+r.stock,pq:+r.pack_qty||0,po:+r.pack_only||0,ip:+r.in_pack||0,ib:+r.in_box||0,st:r.in_stock!==false,d:null,sp:null}));
}

/* ---------- персональні картки клієнта ---------- */
let LOY={on:true,one:true,tiers:[{k:"silver",p:5,f:0},{k:"gold",p:10,f:5000},{k:"platinum",p:15,f:15000},{k:"vip",p:20,f:0}]};
const TN={silver:"Silver",gold:"Gold",platinum:"Platinum",vip:"VIP"};
const cardPct=()=>LOY.on===false||!prof?0:(+prof.card_pct||0);
const loyOne=s=>{if(LOY.one===false)return 0;let m=0;(LOY.tiers||[]).forEach(t=>{if(t.k!=="vip"&&+t.f>0&&+t.f<=s)m=Math.max(m,+t.p)});return m};
const tierRank=k=>(LOY.tiers||[]).findIndex(t=>t.k===k);
const cardNo=n=>{const m=String(n||"").match(/(\d+)/);return"TE-"+(m?m[1].padStart(4,"0"):"0000")};
function wCard(k,pct,no,name){return`<div class="wcard ${esc(k)}"><span class="wsh"></span><img class="wlogo" src="${esc(BASE)}logo2.webp" alt="Trend Electro"><div class="wname">${esc(name||"")}</div><div class="wpct">${esc(pct)}% ЗНИЖКА</div><div class="wtier">${esc(TN[k]||k)}${k==="vip"?"<small>діамантова</small>":""}</div><div class="wno"><small>КАРТКА №</small><b>${esc(no)}</b></div></div>`}
function loyBlock(){if(!prof||LOY.on===false)return"";const T=LOY.tiers,k=prof.card_tier||"silver",cur=T.find(t=>t.k===k)||T[0],sp=+prof.loyalty_spent||0,nx=T.find(t=>t.k!=="vip"&&+t.f>sp),TL=T.filter(t=>t.k!=="vip"||k==="vip");
 const prog=nx?`<div class="lyn">Ще <b>${money(Math.max(0,+nx.f-sp))}</b> покупок до картки <b>${esc(TN[nx.k])}</b> зі знижкою <b>${nx.p}%</b></div><div class="lybar"><i style="width:${Math.min(100,Math.max(3,Math.round((sp-+cur.f)/(+nx.f-+cur.f)*100)))}%"></i></div><div class="lyr"><span>${money(sp)}</span><span>${money(+nx.f)}</span></div>`:`<div class="lyn">🎉 У вас найвищий рівень картки. Дякуємо, що ви з нами!</div>`;
 const one=LOY.one===false?"":`<div class="sku">Разова знижка за велике замовлення: ${T.filter(t=>t.k!=="vip"&&+t.f>0).map(t=>"від "+money(+t.f)+" → "+t.p+"%").join(", ")}.</div>`;
 return`<div class="loy">${wCard(k,cur.p,cardNo(prof.card_number),prof.full_name)}<div class="lyb"><div class="lyh">Куплено на суму: <b>${money(sp)}</b></div>${prog}<div id="lypend" class="sku"></div><div class="lylad">${TL.map(t=>`<div class="${t.k===k?"on":""}${sp>=+t.f?" ok":""}"><b>${esc(TN[t.k])}</b><span>${t.p}%</span><small>${+t.f?"від "+money(+t.f):"одразу"}</small></div>`).join("")}</div><div class="sku">Знижка за карткою діє на всі товари сайту і застосовується автоматично. До суми рахуємо виконані замовлення.</div>${one}</div></div>`}
function loyPop(){if(!prof||!me||LOY.on===false||curH().indexOf("#/l/")===0)return;let seen=null;try{seen=localStorage.getItem("te_tier_"+me.id)}catch(e){}const k=prof.card_tier||"silver";if(seen===k)return;
 if(seen&&tierRank(k)<=tierRank(seen)){try{localStorage.setItem("te_tier_"+me.id,k)}catch(e){}return}
 const t=LOY.tiers.find(x=>x.k===k)||LOY.tiers[0],first=!seen;try{localStorage.setItem("te_tier_"+me.id,k)}catch(e){}
 const d=document.createElement("div");d.className="lpop";d.innerHTML=`<div class="lpbox"><button class="lpx" aria-label="Закрити">×</button><h3>${first?"Вітаємо в Trend Electro! 🎉":"Вітаємо з новою карткою! 🎉"}</h3>${wCard(k,t.p,cardNo(prof.card_number),prof.full_name)}<p>${first?`Даруємо вам персональну картку клієнта <b>${esc(TN[k])}</b> з постійною знижкою <b>${t.p}%</b> на всі товари. Вдалих покупок!`:`Ваша картка стала <b>${esc(TN[k])}</b>. Тепер постійна знижка <b>${t.p}%</b> на всі товари. Дякуємо, що ви з нами!`}</p><button class="go" data-lyopen="1">Дивитись мою картку</button></div>`;
 d.addEventListener("click",e=>{if(e.target===d||e.target.closest(".lpx"))d.remove();if(e.target.closest("[data-lyopen]")){d.remove();drawAcc();panel("acc",true)}});document.body.appendChild(d);if(typeof confetti==="function")try{confetti()}catch(e){}}
async function loadSettings(){
 const r=await sb.from("settings").select("key,value").in("key",["pricing","category_images","pages","shop","loyalty"]);
 (r.data||[]).forEach(x=>{
  if(x.key==="pricing"){const v=x.value||{};PR={m:+v.markup_percent||0,d:+v.discount_percent||0,c:v.by_category||{}}}
  if(x.key==="category_images")CI=x.value||{};
  if(x.key==="loyalty"&&x.value&&Array.isArray(x.value.tiers)&&x.value.tiers.length)LOY=Object.assign(LOY,x.value);
  else if(x.key==="loyalty"&&x.value)LOY=Object.assign(LOY,{on:x.value.on,one:x.value.one});
  if(x.key==="pages")PAGES=x.value||{};
  if(x.key==="shop")SHOP=x.value||{};
 });
}
async function loadCats(){try{const r=await sb.from("categories").select("path,sort,hidden,image_url,description");if(!r.error)(r.data||[]).forEach(x=>CM[x.path]=x)}catch(e){}}
async function loadBanners(){try{const r=await sb.from("banners").select("*").eq("active",true).order("sort");const n=new Date();BN=(r.data||[]).filter(b=>(!b.starts_at||new Date(b.starts_at)<=n)&&(!b.ends_at||new Date(b.ends_at)>=n));drawSlider()}catch(e){}}
async function loadPromos(){try{const r=await sb.from("promos").select("*").eq("active",true).order("created_at",{ascending:false});PROMOS=(r.data||[]).filter(x=>!x.ends_at||new Date(x.ends_at)>new Date());drawPromos()}catch(e){}}

/* ---------- контакти магазину ---------- */
function shop(){
 const T=window.TE||{},c=T.chat||{},S=SHOP||{};
 return{phone:S.phone||T.phone||"",phone2:S.phone2||"",email:S.email||T.email||"",hours:S.hours||T.hours||"",address:S.address||"",telegram:S.telegram||c.telegram||"",viber:S.viber||c.viber||"",whatsapp:S.whatsapp||c.whatsapp||"",instagram:S.instagram||"",facebook:S.facebook||"",tagline:S.tagline||"",perks:Array.isArray(S.perks)?S.perks:[]};
}
function ordMsg(){return SHOP.orders_msg||"Замовлення тимчасово не приймаємо — сайт працює як каталог. Дякуємо за розуміння!"}
function statsHtml(){
 const S=SHOP||{};if(!S.stats_on)return"";
 let it=(Array.isArray(S.stats)?S.stats:[]).filter(x=>x&&x.v&&x.l);
 if(!it.length){const mn=P.reduce((m,p)=>{const v=price(p);return v>0&&v<m?v:m},1e9);it=[{v:P.length>=100?Math.floor(P.length/100)*100+"+":String(P.length),l:"товарів у каталозі"},{v:String(kids(ROOT).length),l:"категорій"}];if(mn<1e9)it.push({v:"від "+Math.ceil(mn),l:"грн — мінімальна ціна"})}
 return `<section class="stats">${it.slice(0,4).map(x=>{const m=String(x.v).match(/^(\D*?)(\d[\d\s]*)(\D*)$/);const n=m?m[2].replace(/\s/g,""):"";return `<div><b${m?` data-cnt="${esc(n)}" data-pre="${esc(m[1])}" data-suf="${esc(m[3])}"`:""}>${esc(x.v)}</b><span>${esc(x.l)}</span></div>`}).join("")}</section>`}
function runCounters(){document.querySelectorAll(".stats b[data-cnt]").forEach(el=>{if(el.dataset.run)return;el.dataset.run=1;const to=+el.dataset.cnt,pre=el.dataset.pre,suf=el.dataset.suf;const go=()=>{const t0=performance.now(),d=1400;(function f(t){const k=Math.min(1,(t-t0)/d),e=1-Math.pow(1-k,3);el.textContent=pre+Math.round(to*e)+suf;if(k<1)requestAnimationFrame(f)})(t0)};if(!("IntersectionObserver"in window)||matchMedia("(prefers-reduced-motion:reduce)").matches)return;const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){io.disconnect();go()}});io.observe(el)})}
function regBar(){let b=$("regbar");const on=!me&&!SHOP.reg_off&&!!sb;if(!on){if(b)b.remove();return}if(!b){b=document.createElement("button");b.type="button";b.id="regbar";b.className="regbar";b.innerHTML='<span>🎁 Зареєструйся і гарантовано отримай постійну знижку на всі покупки</span><b>Зареєструватися →</b>';b.addEventListener("click",()=>{tab="up";drawAcc();panel("acc",true)});document.body.insertBefore(b,document.body.firstChild)}}
function applyOrders(){const off=!!SHOP.orders_off;document.body.classList.toggle("noord",off);let b=$("ordbar");if(off){if(!b){b=document.createElement("div");b.id="ordbar";b.className="ordbar";const h=document.querySelector("header");h.parentNode.insertBefore(b,h.nextSibling)}b.textContent=ordMsg()}else if(b)b.remove()}
const tel=p=>"tel:"+String(p).replace(/[^\d+]/g,"");
function messengers(){
 const s=shop(),l=[];
 if(s.telegram)l.push(["Telegram","https://t.me/"+String(s.telegram).replace(/^@/,"").replace(/^https?:\/\/t\.me\//,"")]);
 if(s.viber)l.push(["Viber","viber://chat?number="+encodeURIComponent("+"+String(s.viber).replace(/\D/g,""))]);
 if(s.whatsapp)l.push(["WhatsApp","https://wa.me/"+String(s.whatsapp).replace(/\D/g,"")+"?text="+encodeURIComponent("Доброго дня! Маю питання щодо товару.")]);
 if(s.instagram)l.push(["Instagram",/^https?:/.test(s.instagram)?s.instagram:"https://instagram.com/"+String(s.instagram).replace(/^@/,"")]);
 if(s.facebook)l.push(["Facebook",/^https?:/.test(s.facebook)?s.facebook:"https://facebook.com/"+s.facebook]);
 return l;
}

/* ---------- слайдер і акції ---------- */
let lastTouch=0;
function setBcls(i){bix=i;document.querySelectorAll("#slider .sl").forEach((e,k)=>e.classList.toggle("on",k===i));document.querySelectorAll("#slider .dots button").forEach((e,k)=>e.classList.toggle("on",k===i))}
function showB(i,smooth){const far=Math.abs(i-bix)>1;setBcls(i);const t=document.getElementById("strack");if(t)t.scrollTo({left:i*t.clientWidth,behavior:smooth===false||far?"auto":"smooth"})}
function drawSlider(){
 clearInterval(btm);const s=$("slider"),h=$("home");if(!s)return;
 if(!BN.length){s.hidden=true;if(h)h.hidden=false;return}
 if(h)h.hidden=true;s.hidden=false;
 s.innerHTML='<div class="strack" id="strack">'+BN.map((b,i)=>{const t=(b.title||b.subtitle)?`<div class="slt">${b.title?`<b>${esc(b.title)}</b>`:""}${esc(b.subtitle||"")}</div>`:"";const im=`<img src="${esc(b.image_url)}" alt="${esc(b.title||"")}"${i?' loading="lazy"':""}>`;return b.link?`<a class="sl" href="${esc(b.link)}" draggable="false">${im}${t}</a>`:`<div class="sl">${im}${t}</div>`}).join("")+'</div>'+(BN.length>1?`<button type="button" class="sarr l" data-sa="-1" aria-label="Попередній банер">‹</button><button type="button" class="sarr r" data-sa="1" aria-label="Наступний банер">›</button><div class="dots">${BN.map((_,i)=>`<button data-b="${i}" aria-label="Банер ${i+1}"></button>`).join("")}</div>`:"");
 s.querySelectorAll(".sl").forEach((e,i)=>e.style.setProperty("--bg",`url("${String(BN[i].image_url||"").replace(/["\\\n]/g,encodeURIComponent)}")`));{const fi=s.querySelector(".sl img"),ar=()=>{if(fi&&fi.naturalWidth)s.style.setProperty("--bar",(fi.naturalWidth/fi.naturalHeight).toFixed(3))};if(fi)fi.complete?ar():fi.addEventListener("load",ar,{once:true})}
 showB(0,false);const tr=$("strack");
 if(BN.length>1&&tr){let st=null;tr.addEventListener("scroll",()=>{clearTimeout(st);st=setTimeout(()=>{const k=Math.round(tr.scrollLeft/Math.max(1,tr.clientWidth));if(k!==bix)setBcls(k)},80)},{passive:true});["touchstart","pointerdown","wheel"].forEach(ev=>tr.addEventListener(ev,()=>{lastTouch=Date.now()},{passive:true}));
  btm=setInterval(()=>{if(Date.now()-lastTouch>9000&&document.visibilityState==="visible")showB((bix+1)%BN.length)},6000)}
}
function drawPromos(){const e=$("promos");if(e)e.innerHTML=PROMOS.map(x=>`<div class="promo"><div><b>${x.badge?esc(x.badge)+" · ":""}${esc(x.title)}${x.percent?" −"+x.percent+"%":""}</b><small>${esc(x.description||"")}</small></div></div>`).join("")}

/* ---------- маршрутизація ---------- */
function route(){
 if(!/^#\/l\//.test(curH())&&Object.keys(LCART).length){Object.keys(LCART).forEach(id=>{if(M[id])cart[id]=Math.min(999,(cart[id]||0)+LCART[id])});LCART={};save();drawCart()}
 closeAll();lStop();{const v=$("view");v.classList.remove("pg");void v.offsetWidth;v.classList.add("pg")}$("sbuy").hidden=true;const h=curH();
 document.body.classList.toggle("pv",h.indexOf("#/p/")===0);document.body.classList.toggle("hm",!h||h==="#"||h==="#/");
 if(h.indexOf("#/p/")===0)viewProduct(decodeURIComponent(h.slice(4)));
 else if(h==="#/cmp")viewCmp();
 else if(h.indexOf("#/est")===0)viewEst(h==="#/est/fav");
 else if(h==="#/check")viewCheck();
 else if(h==="#/frame")viewFrame();
 else if(h==="#/light")viewLight();
 else if(h.indexOf("#/c")===0)viewList(h.slice(4).split("/").filter(Boolean).map(decodeURIComponent));
 else if(h==="#/fav")viewFav();
 else if(h.indexOf("#/sel/")===0)viewSel(h.slice(6));
 else if(h.indexOf("#/guide")===0)viewGuide(decodeURIComponent(h.slice(8)).split("?")[0]);
 else if(h.indexOf("#/page/")===0)viewPage(h.slice(7));
 else if(h==="#/birthday")viewBday();
 else if(h==="#/help")viewHelp();
 else if(h.indexOf("#/l/")===0)viewLanding(decodeURIComponent(h.slice(4)));
 else viewHome();
 requestAnimationFrame(hbInit);setTimeout(bdPopup,500);cmpDraw();backDraw();
 document.querySelectorAll(".bnav button").forEach(b=>b.classList.toggle("on",(b.dataset.nav==="home"&&(h==="#/"||h===""))||(b.dataset.nav==="fav"&&h==="#/fav")||(b.dataset.nav==="cat"&&h.indexOf("#/c")===0&&h!=="#/cmp")));
 window.scrollTo(0,SCR[h]||0);
}
const SELS={hit:["Хіти продажу","Те, що найчастіше обирають наші клієнти",p=>p.hit],new:["Новинки","Свіжі надходження в асортименті",p=>p.nw],sale:["Розпродаж","Вигідні пропозиції — поки є в наявності",p=>oldPrice(p)>0],special:["Спеціальні пропозиції","Товари з особливими умовами",p=>!!p.ofr]};
function pick(){const seen={},l=[];P.forEach(p=>{const k=p.c.join(SEP);if(p.img&&p.st&&!seen[k]){seen[k]=1;l.push(p)}});return l.slice(0,15)}
const hsc=(id,list)=>`<div class="hsc"><button class="scb l" data-sc="${id}" data-d="-1" aria-label="Гортати ліворуч">${ico("l")}</button><div class="hrow" id="${id}">${list.map(card).join("")}</div><button class="scb r" data-sc="${id}" data-d="1" aria-label="Гортати праворуч">${ico("r")}</button></div>`;
const MON=["Січень","Лютий","Березень","Квітень","Травень","Червень","Липень","Серпень","Вересень","Жовтень","Листопад","Грудень"];
function bdSel(id){const y0=new Date().getFullYear()-16;let d='<option value="">День</option>',m='<option value="">Місяць</option>',y='<option value="">Рік</option>';
 for(let i=1;i<=31;i++)d+=`<option value="${i}">${i}</option>`;MON.forEach((n,i)=>m+=`<option value="${i+1}">${n}</option>`);for(let i=y0;i>=1930;i--)y+=`<option value="${i}">${i}</option>`;
 return`<div class="bdsel" id="${id}"><select data-bd="d" aria-label="День" required>${d}</select><select data-bd="m" aria-label="Місяць" required>${m}</select><select data-bd="y" aria-label="Рік" required>${y}</select></div>`}
function bdVal(id){const w=$(id);if(!w)return"";const g=k=>+w.querySelector(`[data-bd="${k}"]`).value;const d=g("d"),m=g("m"),y=g("y");if(!d||!m||!y)return"";const dt=new Date(Date.UTC(y,m-1,d));if(dt.getUTCMonth()!==m-1||dt.getUTCDate()!==d)return"";return y+"-"+String(m).padStart(2,"0")+"-"+String(d).padStart(2,"0")}
function bdFix(w){const g=k=>+w.querySelector(`[data-bd="${k}"]`).value,m=g("m"),y=g("y")||2000,ds=w.querySelector('[data-bd="d"]');const n=m?new Date(Date.UTC(y,m,0)).getUTCDate():31;[...ds.options].forEach(o=>{if(o.value)o.hidden=o.disabled=+o.value>n});if(+ds.value>n)ds.value=String(n)}
const bdOn=()=>!!(SHOP&&SHOP.bday_on&&(+SHOP.bday_percent||0)>0);
const hbL=(t)=>[...t].map((c,i)=>c===" "?'<span class="hbs"> </span>':`<i style="--i:${i}">${c}</i>`).join("");
const hbDeco=()=>'<span class="hbd" aria-hidden="true"><b style="left:4%;--d:0s">🎈</b><b style="left:18%;--d:1.2s">🎉</b><b style="left:46%;--d:.6s">🎈</b><b style="left:70%;--d:1.8s">🎁</b><b style="left:88%;--d:.3s">🎈</b><u style="left:12%;top:18%;--d:0s">✨</u><u style="left:60%;top:12%;--d:.8s">✨</u><u style="left:80%;top:62%;--d:1.4s">⭐</u><u style="left:34%;top:70%;--d:.4s">✨</u></span>';
const bdLines=(bi,nm)=>`<div class="hbn">${nm?esc(nm)+", вітаємо":"Вітаємо"} з днем народження!</div><div class="hbd2">Даруємо знижку <span class="hbpct">${bi.pct}%</span></div>`;
const bdGift=()=>`<button class="bdgift2" data-bdact type="button"><span class="gbx" aria-hidden="true"><i class="gl"></i><i class="gb"></i><i class="gr"></i></span><span>Отримати знижку</span></button>`;
const bdOk=bi=>`<div class="bdok">✓ Знижку −${bi.pct}% активовано. Діє до ${bi.end.toLocaleDateString("uk-UA",{timeZone:"UTC"})} включно.</div>`;
function bdHome(){
 if(!bdOn())return"";const bi=bdayInfo();if(!bi)return"";
 const nm=(prof&&prof.full_name||"").split(" ")[0],pic=`<div class="hbtop"><img src="${esc(SHOP.bday_img||BASE+"hb-banner.webp")}" alt="" loading="lazy" onerror="this.style.display='none'"><canvas class="hbfx"></canvas><h2 class="hbh" aria-label="Happy Birthday">${hbL("Happy Birthday!")}</h2></div>`;
 return`<section class="bdhero hbpic">${pic}<div class="hbbody hbcol">${bdLines(bi,nm)}${bi.claimed?bdOk(bi):bdGift()}</div></section>`}
async function bdAct(btn){
 if(!sb||!me)return;btn.disabled=true;document.querySelectorAll(".gbx").forEach(g=>g.classList.add("open"));confetti();
 await new Promise(r=>setTimeout(r,900));
 const r=await sb.rpc("claim_my_birthday");
 if(r.error||!r.data||!r.data.ok){btn.disabled=false;document.querySelectorAll(".gbx").forEach(g=>g.classList.remove("open"));toast(r.error&&/claim_my_birthday|function/i.test(r.error.message||"")?"Знижка ще налаштовується. Спробуйте трохи пізніше.":"Не вдалося отримати знижку. Спробуйте пізніше.");return}
 await loadProf();const pop=$("bdpop");if(pop){pop.remove();document.body.style.overflow=""}
 route();window.scrollTo(0,0);document.body.classList.add("bdnew");setTimeout(()=>document.body.classList.remove("bdnew"),5000);
 toast("Знижку −"+r.data.percent+"% активовано! Ціни оновлено ✓");confetti()}
const HBC=["#ffd23f","#ff5d8f","#2fd9d3","#9d8cff","#4cd964","#ffffff","#ff9f1c"];
function hbFx(cv){
 const ctx=cv.getContext("2d"),par=cv.parentElement,dpr=Math.min(2,devicePixelRatio||1);let W=0,H=0,P=[],F=[],B=[],last=0,tf=0,tb=0,run=false,raf=0,vis=true;
 const R=(a,b)=>a+Math.random()*(b-a);
 function size(){W=par.clientWidth;H=par.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
 size();new ResizeObserver(size).observe(par);
 for(let i=0;i<34;i++)P.push({x:R(0,W),y:R(-H,H),w:R(5,9),h:R(9,15),r:R(0,6.3),vr:R(-4,4),vy:R(30,70),sw:R(0,6.3),c:HBC[i%7]});
 function boom(x,y){const c=HBC[(Math.random()*7)|0],n=34;for(let i=0;i<n;i++){const a=6.283*i/n,v=R(70,150);F.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:1,c,s:R(1.6,3)})}}
 function step(t){
  if(!run)return;if(!cv.isConnected){run=false;return}
  const dt=Math.min(.05,(t-last)/1000||.016);last=t;ctx.clearRect(0,0,W,H);
  tf-=dt;if(tf<=0){tf=R(.9,1.8);F.push({rk:1,x:R(W*.15,W*.85),y:H,ty:R(H*.18,H*.5),vy:-R(260,340),c:"#fff"})}
  tb-=dt;if(tb<=0){tb=R(2.2,4);B.push({x:R(10,W-10),y:H+20,vy:-R(38,70),sw:R(0,6.3),e:["🎈","🎈","🎁","🎉"][(Math.random()*4)|0],s:R(20,30)})}
  P.forEach(p=>{p.y+=p.vy*dt;p.sw+=dt*2;p.x+=Math.sin(p.sw)*18*dt;p.r+=p.vr*dt;if(p.y>H+16){p.y=-16;p.x=R(0,W)}
   ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.scale(1,Math.cos(p.r*1.3));ctx.fillStyle=p.c;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore()});
  for(let i=F.length-1;i>=0;i--){const f=F[i];
   if(f.rk){f.y+=f.vy*dt;ctx.fillStyle="#fff";ctx.fillRect(f.x-1,f.y,2,10);if(f.y<=f.ty){boom(f.x,f.y);F.splice(i,1)}continue}
   f.vy+=90*dt;f.x+=f.vx*dt;f.y+=f.vy*dt;f.vx*=.985;f.l-=dt*.75;if(f.l<=0){F.splice(i,1);continue}
   ctx.globalAlpha=f.l;ctx.fillStyle=f.c;ctx.beginPath();ctx.arc(f.x,f.y,f.s,0,6.283);ctx.fill();ctx.globalAlpha=1}
  ctx.font="26px serif";ctx.textAlign="center";
  for(let i=B.length-1;i>=0;i--){const b=B[i];b.y+=b.vy*dt;b.sw+=dt*1.6;if(b.y<-40){B.splice(i,1);continue}ctx.font=b.s+"px serif";ctx.fillText(b.e,b.x+Math.sin(b.sw)*14,b.y)}
  raf=requestAnimationFrame(step)}
 return{start(){if(run||matchMedia("(prefers-reduced-motion:reduce)").matches)return;run=true;last=performance.now();raf=requestAnimationFrame(step)},stop(){run=false;cancelAnimationFrame(raf)}}}
const hbIO=window.IntersectionObserver?new IntersectionObserver(es=>es.forEach(e=>{const f=e.target.__fx;if(!f)return;e.isIntersecting&&!document.hidden?f.start():f.stop()}),{threshold:.1}):null;
function bdPopup(){
 if(document.getElementById("bdpop")||curH().indexOf("#/l/")===0)return;const bi=bdayInfo();if(!bi||bi.claimed)return;try{if(sessionStorage.bdp)return;sessionStorage.bdp=1}catch(e){}
 const nm=(prof&&prof.full_name||"").split(" ")[0],pc=`<div class="hbtop"><img src="${esc(SHOP.bday_img||BASE+"hb-banner.webp")}" alt="" onerror="this.style.display='none'"><canvas class="hbfx"></canvas><h2 class="hbh" aria-label="Happy Birthday">${hbL("Happy Birthday!")}</h2></div>`;
 const d=document.createElement("div");d.id="bdpop";d.className="bdpop";d.innerHTML=`<div class="bdpc" role="dialog" aria-modal="true"><button class="bdx" aria-label="Закрити">✕</button>${pc}<div class="bdpb">${bdLines(bi,nm)}${bdGift()}</div></div>`;
 d.addEventListener("click",e=>{if(e.target===d||e.target.closest(".bdx")){d.remove();document.body.style.overflow=""}});
 document.body.appendChild(d);document.body.style.overflow="hidden";hbInit();confetti()}
function hbInit(){document.querySelectorAll("canvas.hbfx").forEach(cv=>{if(cv.__fx)return;cv.__fx=hbFx(cv);hbIO?hbIO.observe(cv):cv.__fx.start()})}
document.addEventListener("visibilitychange",()=>{document.querySelectorAll("canvas.hbfx").forEach(cv=>{if(!cv.__fx)return;document.hidden?cv.__fx.stop():cv.__fx.start()})});
function confetti(){if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;const w=document.createElement("div");w.className="cfw";const c=["#0ABAB5","#ffd23f","#ff5d73","#7c5cff","#4cd964"];for(let i=0;i<46;i++){const e=document.createElement("i");e.style.cssText=`left:${Math.random()*100}%;background:${c[i%5]};animation-delay:${Math.random()*1.2}s;animation-duration:${2.4+Math.random()*1.8}s;transform:rotate(${Math.random()*360}deg)`;w.appendChild(e)}document.body.appendChild(w);setTimeout(()=>w.remove(),5200)}
function bdResult(r,pct){
 const el=$("bdres");if(!el)return;
 if(r.state==="off"){el.innerHTML='<div class="msg">Акція зараз не діє. Зазирніть пізніше.</div>';return}
 if(r.state==="later"){el.innerHTML=`<div class="bdcard"><h3>Дякуємо! 🎈</h3><p>Ми запам’ятали ваш день народження. Коли він настане, завітайте на цю сторінку — і ви отримаєте подарунок −${pct}% на ${bdDays()}. Ми вас обов’язково привітаємо!</p></div>`;return}
 const u=new Date(r.until+"T00:00:00Z").toLocaleDateString("uk-UA",{timeZone:"UTC"});
 el.innerHTML=`<div class="bdcard"><h3>🎉 З днем народження!</h3><p>Ваш особистий подарунок: знижка <b>−${r.percent}%</b> на все замовлення. Діє до ${u} включно, один раз.</p><div class="bdcode">${esc(r.code)}</div><div class="bdbtns"><button class="go" data-bduse="${esc(r.code)}">Використати в кошику</button><button class="sec" data-bdcp="${esc(r.code)}">Скопіювати код</button></div><p class="sku">Збережіть код: він діє лише для вас.</p></div>`;confetti()}
function viewBday(){
 const on=bdOn(),pct=on?Math.min(90,+SHOP.bday_percent||0):0;
 $("view").innerHTML=`<section class="bdpage"><div class="hbtop hbtop2"><img src="${esc(SHOP.bday_img||BASE+"hb-banner.webp")}" alt="" onerror="this.style.display='none'"><canvas class="hbfx"></canvas><h1 class="hbh" aria-label="Happy Birthday">${hbL("Happy Birthday!")}</h1></div><div class="hbn" style="margin-top:12px">Ваш день народження — наше свято</div><p class="lead">Ми щиро вітаємо кожного клієнта! У тиждень вашого дня народження (${bdDays()}, включно з самим днем) даруємо ${on?`<b>знижку −${pct}%</b>`:"особливу знижку"} на все, що є на сайті.</p>
 ${on?`<form id="bdForm" class="bdform"><input id="bdn" placeholder="Ваше ім’я" autocomplete="given-name"><input id="bdc" placeholder="Телефон або email" autocomplete="email" required><div class="bdl">Дата народження${bdSel("bdd")}</div><label class="ck"><input type="checkbox" id="bdk"> <span>Погоджуюсь на обробку моїх даних для привітання й подарунка</span></label><div class="msg" id="bdm"></div><button class="go" id="bdgo">Отримати подарунок</button></form><div id="bdres"></div>`:'<div class="empty">Акція зараз не діє. Зазирніть пізніше.</div>'}
 <ul class="bdlist"><li>🎁 Подарунок один раз на рік для кожного</li><li>⏳ Діє ${bdDays()} поспіль</li><li>🔒 Дані використовуємо лише для привітання</li></ul></section>`;
 window.scrollTo(0,0)}
function viewHome(){
 document.title="Trend Electro — електротовари та LED-освітлення";
 const tops=kids(ROOT),s=shop(),perks=(s.perks.filter(x=>x&&x.t).length?s.perks.filter(x=>x&&x.t).map((x,i)=>[PERKS[i%4][0],x.t,x.d||""]):PERKS);
 const TN={new:"Новинки",sale:"Розпродаж",special:"Спец. пропозиції"},tsets=["new","sale","special"].map(k=>({k,l:P.filter(SELS[k][2])})).filter(x=>x.l.length),hits=P.filter(SELS.hit[2]);
 const hitSec=hits.length?`<section class="sec tabsec"><div class="sech"><div><h2>Хіти продажу</h2></div>${hits.length>5?`<a href="#/sel/hit">Усі ${hits.length} →</a>`:""}</div>${hsc("hhit",hits.slice(0,15))}</section>`:"";
 const sets=(hitSec||tsets.length)?hitSec+(tsets.length?`<section class="sec tabsec"><div class="htabs" role="tablist">${tsets.map((x,i)=>`<button type="button" role="tab" class="htab${i?"":" on"}" data-ht="${x.k}">${TN[x.k]}</button>`).join("")}</div>${tsets.map((x,i)=>`<div class="hpane" data-pane="${x.k}"${i?" hidden":""}>${hsc("h"+x.k,x.l.slice(0,15))}${x.l.length>5?`<div class="allrow"><a href="#/sel/${x.k}">Усі ${x.l.length} →</a></div>`:""}</div>`).join("")}</section>`:""):"";
 const pop=sets?"":(P.length?`<section class="sec"><div class="sech"><div><h2>Популярне в каталозі</h2><p>По одному товару з кожного розділу — для натхнення</p></div><a href="#/c/">Весь каталог →</a></div>${hsc("hpop",pick())}</section>`:"");
 const msg=messengers();
 $("view").innerHTML=`<section class="slider" id="slider" hidden></section>
<section class="hero" id="home"><div><span class="eyebrow">Trend Electro · ${plural(P.length,"товар","товари","товарів")} у каталозі</span><h1>Світло й електрика <em>для дому та бізнесу</em></h1><p>${esc(s.tagline||"Світильники, LED-лампи, розетки, кабель, автоматика та все для монтажу. Допоможемо підібрати й швидко відправимо по Україні.")}</p><div class="cta"><a class="btn" href="#/c/">Перейти до каталогу ${ico("r")}</a><a class="btn ghost" href="#/page/coop">Оптовим клієнтам</a></div></div>
<div class="hcats">${tops.slice(0,4).map(k=>`<a href="${href(k.path)}"><b>${esc(k.name)}</b><small>${plural(k.count,"товар","товари","товарів")}</small></a>`).join("")}</div></section>
${bdHome()}${sets}${statsHtml()}<section class="perks">${perks.map(x=>`<div>${pkArt(x[0])}<span><b>${esc(x[1])}</b>${esc(x[2])}</span></div>`).join("")}</section>
<section class="promos" id="promos"></section>
<section class="sec"><div class="sech"><div><h2>Каталог</h2></div><a href="#/c/">Усі товари →</a></div><div class="ctiles">${tops.map(tile).join("")||'<div class="empty">Каталог порожній.</div>'}</div></section>
${pop}${rvHtml()}${toolsHtml()}
${promoForm()}<section class="sec" id="hguides" hidden><div class="sech"><div><h2>Поради та статті</h2><p>Як вибрати лампу, кабель, розетки й захист</p></div><a href="#/guide/">Усі статті →</a></div><div class="gcards"></div></section>
<section class="band"><div><h2>Електрикам, монтажникам і дизайнерам</h2><p>Оптові ціни, підбір під об’єкт і консультація з технічних питань. Напишіть — підготуємо пропозицію.</p></div><div class="cta" style="margin:0"><a class="btn" href="#/page/coop">Умови співпраці</a>${msg[0]?`<a class="btn ghost" href="${esc(msg[0][1])}" target="_blank" rel="noopener">${esc(msg[0][0])}</a>`:s.phone?`<a class="btn ghost" href="${esc(tel(s.phone))}">${esc(s.phone)}</a>`:""}</div></section>`;
 drawSlider();drawPromos();runCounters();
 arts().then(L=>{const e=$("hguides");if(e&&L.length){e.hidden=false;const g=e.querySelector(".gcards");if(hsOn()){g.classList.add("hs","pcg");g.innerHTML=L.map(gcard).join("");g.insertAdjacentHTML("afterend",hsBtn("усі статті"))}else g.innerHTML=L.slice(0,3).map(gcard).join("")}});
}
const tile=k=>{const kk=kids(k),sub=kk.slice(0,3).map(x=>esc(x.name)).join(" · "),subl=kk.length?`<span class="subl">${kk.slice(0,5).map(x=>`<i>${esc(x.name)}</i>`).join("")}${kk.length>5?`<i class="mr">+ ще ${kk.length-5}</i>`:""}</span>`:"";return `<a class="ctile" href="${href(k.path)}"><span class="th${cmeta(k.path).image_url?" ph":""}">${img(nodeImg(k),360,270,k.name)}</span><span class="cb"><b>${esc(k.name)}</b><small>${plural(k.count,"товар","товари","товарів")}</small>${sub?`<span class="subs">${sub}</span>`:""}${subl}</span></a>`};
/* ---------- розумний пошук ---------- */
const LAT={"а":"a","е":"e","о":"o","р":"p","с":"c","х":"x","у":"y","і":"i","ї":"i","є":"e","к":"k","м":"m","т":"t","в":"b","н":"h","ё":"e"};
const nrm=t=>String(t||"").toLowerCase().replace(/(\d)\s*(?:вт|w)(?![a-z\u0430-\u044f])/g,"$1w").replace(/(\d{4})\s*[kк](?![a-z\u0430-\u044f])/g,"$1k").replace(/[а-яіїєё]/g,c=>LAT[c]||c).replace(/[^a-z0-9\u0430-\u044f\u0491.]+/g," ").replace(/\.(?=\s|$)/g,"");
const SYNG=[["лампочка","лампа","лампи"],["светильник","свiтильник","світильник"],["выключатель","вимикач"],["розетка","розетки"],["удлинитель","подовжувач"],["провод","кабель","дріт"],["автомат","автоматичний"],["лед","led","світлодіодний"],["щиток","щит","бокс"],["датчик","сенсор"],["прожектор","прожектори"],["удлинитель","переноска"]];
const SYN={};SYNG.forEach(g=>{const n=g.map(nrm);n.forEach(w=>{SYN[w]=(SYN[w]||[]).concat(n)})});
const stem=w=>/\d/.test(w)||/^[a-z.]+$/.test(w)&&w.length<4?w:w.length>5?w.slice(0,-2):w.length>3?w.slice(0,-1):w;
function qtoks(q){return nrm(q).split(" ").filter(Boolean).map(w=>[...new Set((SYN[w]||[w]).map(stem))])}
function search(q,base){
 const T=qtoks(q);if(!T.length)return base.slice();const out=[];
 for(const p of base){
  let sc=0,ok=true;
  for(const alts of T){
   let best=0;
   for(const a of alts){if(p.h.indexOf(a)<0)continue;let v=1;if(p.nn.indexOf(" "+a)>-1||p.nn.indexOf(a)===0)v=2;if(p.in===a||p.in.indexOf(a)===0)v=4;if(v>best)best=v}
   if(!best){ok=false;break}sc+=best;
  }
  if(ok){p.sc=sc+(p.hit?.5:0)+(p.st?.3:0);out.push(p)}
 }
 return out.sort((a,b)=>b.sc-a.sc);
}
let ALLN=[];
function collectN(n){kids(n).forEach(k=>{ALLN.push({n:k,h:nrm(k.name)});collectN(k)})}
function attrs(p){
 if(p.A)return p.A;const l=p.nn,A={};let m=(" "+l).match(/[^a-z0-9](e27|e14|e40|e10|gu10|gu5\.3|gu4|g9|gx53|g4|g13|g5|g53|mr16|r7s)(?![a-z0-9])/);if(m)A.soc=m[1].toUpperCase();
 m=l.match(/(\d+(?:[.,]\d+)?)w(?![a-z])/);if(m){const w=parseFloat(m[1].replace(",","."));A.pw=w<=5?"до 5 Вт":w<=10?"6–10 Вт":w<=20?"11–20 Вт":w<=40?"21–40 Вт":w<=100?"41–100 Вт":"понад 100 Вт"}
 m=l.match(/(\d{4})k(?![a-z])/);if(m){const k=+m[1];if(k>=1800&&k<=7500)A.k=k<=3500?"Тепле (до 3500K)":k<=5000?"Нейтральне (3500–5000K)":"Холодне (від 5000K)"}
 m=l.match(/ip ?(\d{2})(?!\d)/);if(m)A.ip="IP"+m[1];
 if(p.c[0]==="Розетки та вимикачі"&&!SHOP.col_off){const c=pCol(p.n);if(c)A.col=c}
 return p.A=A;
}
const FG=[["soc","Цоколь"],["pw","Потужність"],["k","Колір світла"],["ip","Захист (IP)"],["col","Колір"]];
const PWO=["до 5 Вт","6–10 Вт","11–20 Вт","21–40 Вт","41–100 Вт","понад 100 Вт"],KO=["Тепле (до 3500K)","Нейтральне (3500–5000K)","Холодне (від 5000K)"];
function baseList(path){
 const mn=+F.min||0,mx=+F.max||0;
 let l=P.filter(p=>{for(let i=0;i<path.length;i++)if(p.c[i]!==path[i])return false;if(F.brand&&p.b!==F.brand)return false;if(mn||mx){const x=price(p);if(mn&&x<mn)return false;if(mx&&x>mx)return false}return true});
 if(F.q)l=search(F.q,l);return l;
}
function listP(path,base){
 const l=(base||baseList(path)).filter(p=>{if(F.stock&&!p.st)return false;const A=F.a||{};for(const k in A)if(A[k]&&A[k].length&&A[k].indexOf(attrs(p)[k])<0)return false;return true});
 if(F.sort==="asc")l.sort((a,b)=>price(a)-price(b));else if(F.sort==="desc")l.sort((a,b)=>price(b)-price(a));else if(F.sort==="name")l.sort((a,b)=>a.n.localeCompare(b.n,"uk"));
 if(!(SHOP&&SHOP.nophoto_last_off)){const w=l.filter(p=>p.img),nw=l.filter(p=>!p.img);if(nw.length&&w.length)return w.concat(nw)}
 return l;
}
function drawFacets(base){
 const e=$("fpan");if(!e)return;let sel=0;const A=F.a||{};
 const html=FG.map(g=>{
  const c={};let cov=0;base.forEach(p=>{const v=attrs(p)[g[0]];if(v){c[g[0]==="pw"||g[0]==="k"?v:v]=(c[v]||0)+1;cov++}});
  const keys=Object.keys(c);if(keys.length<2||cov<3)return"";
  const ord=g[0]==="pw"?PWO:g[0]==="k"?KO:null;
  keys.sort(ord?(a,b)=>ord.indexOf(a)-ord.indexOf(b):(a,b)=>c[b]-c[a]);
  return `<div class="fg"><b>${g[1]}</b><div class="fc">${keys.map(v=>{const on=(A[g[0]]||[]).indexOf(v)>-1;if(on)sel++;return `<button data-fa="${g[0]}" data-v="${esc(v)}" class="${on?"on":""}">${g[0]==="col"?`<i class="cdot" style="background:${COLHEX[v]||"#ccc"}"></i>`:""}${esc(v)} <small>${c[v]}</small></button>`}).join("")}</div></div>`}).join("");
 const hasSt=base.some(p=>!p.st);if(F.stock)sel++;
 e.innerHTML=html+(hasSt?`<div class="fc"><button data-fstock class="${F.stock?"on":""}">Тільки в наявності</button></div>`:"")+(sel?`<div><button class="more" style="margin:0;padding:8px 16px" data-fclr>Скинути фільтри (${sel})</button></div>`:"");
 if(!e.innerHTML)e.innerHTML='<div class="fnote">Для цього розділу додаткових фільтрів немає — скористайтеся брендом і ціною.</div>';
 const b=$("ftog");if(b){b.classList.toggle("on",sel>0);b.textContent="Фільтри"+(sel?" ("+sel+")":"")}
}
function drawSug(){
 const q=$("q").value.trim(),e=$("sug");
 if(q.length<2){e.hidden=true;return}
 const r=search(q,P),T=nrm(q).split(" ").filter(Boolean).map(stem);
 const cs=ALLN.filter(x=>T.every(t=>x.h.indexOf(t)>-1)).slice(0,3);
 if(!r.length&&!cs.length){e.innerHTML='<div class="fnote" style="padding:14px">Нічого не знайдено. Спробуйте інше слово або артикул.</div>';e.hidden=false;return}
 e.innerHTML=cs.map(x=>`<a href="${href(x.n.path)}"><span class="sn"><small>Категорія</small><br><b>${esc(x.n.path.join(" › "))}</b></span></a>`).join("")+r.slice(0,6).map(p=>`<a href="#/p/${encodeURIComponent(p.id)}"><span class="st">${img(p.img,100,100)}</span><span class="sn">${esc(p.n)}<br><small>Арт. ${esc(p.id)}</small></span><span class="sc">${money(price(p))}</span></a>`).join("")+(r.length>6?`<button class="all" data-sall>Усі результати (${r.length})</button>`:"");
 e.hidden=false;
}
function goSearch(){const q=$("q").value.trim();$("sug").hidden=true;if(!q)return;
 {const k=nrm(q).replace(/ /g,"");let hit=k.length>=4?P.find(p=>nrm(p.id).replace(/ /g,"")===k):null;if(!hit&&/\d/.test(q)&&!/\s/.test(q)&&k.length>=5){const r=search(q,P);if(r.length===1)hit=r[0]}if(hit){$("q").blur();location.hash="#/p/"+encodeURIComponent(hit.id);return}}
F.q=q;CUR.key="\u0002";if(curH().indexOf("#/c")===0&&curH().length<=4){route()}else location.hash="#/c/"}
function viewList(path){
 document.title=(path.length?path[path.length-1]+" — ":"")+"Trend Electro — електротовари та LED-освітлення";
 const node=path.length?nodeAt(path):ROOT;
 if(!node){$("view").innerHTML='<div class="empty">Категорію не знайдено. <a href="#/c/">Весь каталог</a></div>';return}
 const key=path.join("\u0001");if(CUR.key!==key){CUR.key=key;F={brand:"",min:"",max:"",sort:"def",q:F.q,lim:24,a:{},stock:false,fo:innerWidth>=860}}
 CUR.path=path;
 const crumbs=`<nav class="crumbs" aria-label="Навігація"><a href="#/">Головна</a>${path.map((n,i)=>`<span>›</span><a href="${href(path.slice(0,i+1))}">${esc(n)}</a>`).join("")}</nav>`;
 const chips=tilesHtml(kids(node));
 const cnt={};P.forEach(p=>{for(let i=0;i<path.length;i++)if(p.c[i]!==path[i])return;if(p.b)cnt[p.b]=(cnt[p.b]||0)+1});
 const brands=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a]),desc=path.length?cmeta(path).description:"";
 $("view").innerHTML=`${crumbs}<h1 class="ptitle">${esc(path.length?path[path.length-1]:(F.q?"Результати пошуку":"Усі товари"))}</h1>${desc?`<p class="cdesc">${esc(desc)}</p>`:""}${chips}<div class="bar"><select id="fbrand" aria-label="Бренд"><option value="">Усі бренди</option>${brands.map(b=>`<option value="${esc(b)}"${F.brand===b?" selected":""}>${esc(b)} (${cnt[b]})</option>`).join("")}</select><input id="fmin" type="number" inputmode="decimal" placeholder="Ціна від" value="${esc(F.min)}" aria-label="Ціна від"><input id="fmax" type="number" inputmode="decimal" placeholder="до" value="${esc(F.max)}" aria-label="Ціна до"><select id="fsort" aria-label="Сортування"><option value="def">Спочатку популярні</option><option value="asc">Спочатку дешевші</option><option value="desc">Спочатку дорожчі</option><option value="name">За назвою</option></select><button class="ft" id="ftog">Фільтри</button><span class="fnd" id="found"></span><div class="dsw" role="group" aria-label="Вигляд товарів">${DENS.map(d=>`<button type="button" data-dn="${d[0]}" title="${d[1]}" aria-label="${d[1]}">${DICO[d[0]]}</button>`).join("")}</div></div><div class="fpan" id="fpan"${F.fo?"":" hidden"}></div><div class="grid" id="grid" data-d="${dens()}"></div><button class="more" id="more" hidden></button>`;
 $("fsort").value=F.sort;setDens(dens());renderGrid();
}
function renderGrid(){
 const base=baseList(CUR.path);CUR.list=listP(CUR.path,base);const l=CUR.list;drawFacets(base);
 $("found").textContent="Знайдено: "+l.length;
 $("grid").innerHTML=l.length?l.slice(0,F.lim).map(card).join(""):`<div class="empty" style="grid-column:1/-1">Нічого не знайдено${F.q?` за запитом «${esc(F.q)}»`:""}. Спробуйте інше слово, артикул або приберіть фільтри.${F.q?`<p><a class="btn" href="${esc(ytU(F.q+" електрика"))}" target="_blank" rel="noopener">▶ YouTube</a> <a class="btn" href="${esc("https://www.tiktok.com/search?q="+encodeURIComponent(F.q+" електрика"))}" target="_blank" rel="noopener">♪ TikTok</a> <a class="btn" href="#/guide/">Поради</a></p>`:""}</div>`;
 moreBtn();
}
function moreBtn(){const rest=CUR.list.length-F.lim,b=$("more");if(!b)return;b.hidden=rest<=0;b.textContent="Показати ще "+Math.min(24,Math.max(rest,0))}
function viewFav(){
 const l=P.filter(p=>fav[p.id]);
 $("view").innerHTML=`<nav class="crumbs"><a href="#/">Головна</a><span>›</span>Обране</nav><h1 class="ptitle">Обрані товари</h1>${l.length&&estOn()?'<p><a class="btn" href="#/est/fav">Кошторис у PDF</a></p>':""}${l.length?`<div class="grid">${l.map(card).join("")}</div>`:'<div class="empty">Тут з’являться товари, які ви позначите сердечком ♡. Так зручно порівнювати й повертатися до них пізніше.<br><br><a class="btn" href="#/c/">До каталогу</a></div>'}`;
}
function viewSel(k){
 const s=SELS[k];if(!s)return viewHome();const l=P.filter(s[2]);
 $("view").innerHTML=`<nav class="crumbs"><a href="#/">Головна</a><span>›</span>${esc(s[0])}</nav><h1 class="ptitle">${esc(s[0])}</h1><p class="cdesc">${esc(s[1])}</p>${l.length?`<div class="grid">${l.map(card).join("")}</div>`:'<div class="empty">Поки що тут порожньо.</div>'}`;
}
let ART=null;
async function arts(){if(ART)return ART;try{const r=await fetch(BASE+"articles.json");ART=r.ok?await r.json():[]}catch(e){ART=[]}return ART}
/* ---------- вигляд каталогу: плитки категорій і щільність сітки ---------- */
const DENS=[["list","Список"],["l","Велика сітка"],["m","Середня сітка"],["s","Мала сітка"]];
const DICO={list:'<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><rect x="3" y="4" width="18" height="3" rx="1.5"/><rect x="3" y="10.5" width="18" height="3" rx="1.5"/><rect x="3" y="17" width="18" height="3" rx="1.5"/></svg>',l:'<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg>',m:'<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">'+[3,9.5,16].map(y=>[3,9.5,16].map(x=>`<rect x="${x}" y="${y}" width="5" height="5" rx="1.3"/>`).join("")).join("")+'</svg>',s:'<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">'+[2.5,7.5,12.5,17.5].map(y=>[2.5,7.5,12.5,17.5].map(x=>`<rect x="${x}" y="${y}" width="4" height="4" rx="1"/>`).join("")).join("")+'</svg>'};
function dens(){let d="";try{d=localStorage.getItem("te_dens")||""}catch(e){}if(!DENS.some(x=>x[0]===d))d=DENS.some(x=>x[0]===(SHOP||{}).grid_def)?SHOP.grid_def:"l";return d}
function setDens(d){try{localStorage.setItem("te_dens",d)}catch(e){}const g=$("grid");if(g)g.dataset.d=d;document.querySelectorAll(".dsw button").forEach(b=>b.classList.toggle("on",b.dataset.dn===d))}
function applyLayout(){const S=SHOP||{},r=document.documentElement.style,c=Math.min(6,Math.max(2,+S.cat_cols||4)),m=Math.min(3,Math.max(2,+S.cat_cols_m||2));r.setProperty("--tc",c);r.setProperty("--tcm",m);r.setProperty("--tcw",Math.min(7,c+1))}
const stile=k=>`<a class="stile" href="${href(k.path)}"><span class="th pic${cmeta(k.path).image_url?" ph":""}">${img(nodeImg(k),300,300,k.name)}</span><b>${esc(k.name)}</b><small>${k.count}</small></a>`;
function tilesHtml(list){if(!list.length)return"";const S=SHOP||{},c=innerWidth<700?Math.min(3,Math.max(2,+S.cat_cols_m||2)):Math.min(6,Math.max(2,+S.cat_cols||4)),rw=Math.min(8,Math.max(0,+S.cat_rows||0)),lim=rw?c*rw:0;
 return `<div class="stiles">${list.map((k,i)=>lim&&i>=lim?stile(k).replace('class="stile"','class="stile xt" hidden'):stile(k)).join("")}</div>${lim&&list.length>lim?`<button class="more xtb" data-xt="1">Показати всі ${list.length} ↓</button>`:""}`}
const ytU=q=>"https://www.youtube.com/results?search_query="+encodeURIComponent(q);
const ytBox=a=>`<div class="box vid"><h2>Відео за темою</h2>${(a.vid||[]).map(v=>`<button class="yt" data-yt="${esc(v)}" style="background-image:url(https://i.ytimg.com/vi/${esc(v)}/hqdefault.jpg)" aria-label="Дивитись відео">▶</button>`).join("")}<p>Краще один раз побачити? Короткі відео за темою «${esc(a.title)}»:</p><div class="cta"><a class="btn" href="${esc(ytU(a.yt||a.title))}" target="_blank" rel="noopener">▶ YouTube</a><a class="btn" href="${esc("https://www.tiktok.com/search?q="+encodeURIComponent(a.yt||a.title))}" target="_blank" rel="noopener">♪ TikTok</a><a class="btn" href="${esc("https://www.google.com/search?q="+encodeURIComponent("site:instagram.com/reel "+(a.yt||a.title)))}" target="_blank" rel="noopener">◎ Instagram Reels</a></div></div>`;
const hsOn=()=>!SHOP.hs_off;
const gcard=a=>hsOn()&&a.img?`<a class="gcard pc" href="#/guide/${a.slug}"><span class="gi">${img(BASE+a.img,400,300,a.title)}</span><b>${esc(a.title)}</b><span>${esc(a.description)}</span><em>Читати →</em></a>`:`<a class="gcard" href="#/guide/${a.slug}"><b>${esc(a.title)}</b><span>${esc(a.description)}</span><em>Читати →</em></a>`;
function hsTog(b){const e=b.previousElementSibling;if(!e)return;const on=e.classList.toggle("hs");b.textContent=on?b.dataset.o:b.dataset.c;if(on)e.scrollLeft=0;else e.scrollIntoView({behavior:"smooth",block:"start"})}
const hsBtn=w=>`<button class="more hstog" data-o="Розгорнути ${w} ↓" data-c="Згорнути ↑" onclick="hsTog(this)">Розгорнути ${w} ↓</button>`;
async function viewGuide(slug){
 const L=await arts(),a=slug?L.find(x=>x.slug===slug):null;
 if(a){document.title=a.title+" — Trend Electro";
  $("view").innerHTML=`<nav class="crumbs"><a href="#/">Головна</a><span>›</span><a href="#/guide/">Поради</a><span>›</span>${esc(a.title)}</nav><article class="art"><h1 class="ptitle">${esc(a.title)}</h1><p class="cdesc">${esc(a.description)}</p><div class="box txt">${a.body}</div>${ytBox(a)}${shareBox(a)}</article><section class="sec"><div class="sech"><h2>Читайте також</h2></div><div class="gcards${hsOn()?" hs pcg":""}">${L.filter(x=>x.slug!==slug).sort((x,y)=>(y.category===a.category)-(x.category===a.category)).slice(0,hsOn()?8:3).map(gcard).join("")}</div>${hsOn()?hsBtn("ще статті"):""}</section>`;return}
 document.title="Поради з вибору електротоварів — Trend Electro";
 $("view").innerHTML=`<nav class="crumbs"><a href="#/">Головна</a><span>›</span>Поради</nav><h1 class="ptitle">Поради з вибору електротоварів</h1><p class="cdesc">Короткі практичні статті: як вибрати лампу, кабель, розетки й захист.</p>${L.length?`<div class="gcards${hsOn()?" pcg":""}">${L.map(gcard).join("")}</div>`:'<div class="empty">Статті з’являться незабаром.</div>'}`;
}
function viewPage(key){
 const d=PDEF[key],c=PAGES[key]||{},title=c.title||(d?d[0]:"Сторінка"),text=c.text||(d?d[1]:"");
 if(!d&&!c.text){$("view").innerHTML='<div class="empty">Сторінку не знайдено.</div>';return}
 const s=shop();let extra="";
 if(key==="contacts"||key==="coop"){const L=[];if(s.phone)L.push(`Телефон: <a href="${esc(tel(s.phone))}"><b>${esc(s.phone)}</b></a>`);if(s.phone2)L.push(`Телефон: <a href="${esc(tel(s.phone2))}"><b>${esc(s.phone2)}</b></a>`);if(s.email)L.push(`Email: <a href="mailto:${esc(s.email)}"><b>${esc(s.email)}</b></a>`);if(s.hours)L.push("Графік: "+esc(s.hours));if(s.address)L.push("Адреса: "+esc(s.address));
  const m=messengers();extra=L.map(x=>`<p>${x}</p>`).join("")+(m.length?`<div class="cta" style="margin-top:12px">${m.map(x=>`<a class="btn" href="${esc(x[1])}" target="_blank" rel="noopener">${esc(x[0])}</a>`).join("")}</div>`:"")}
 $("view").innerHTML=`<nav class="crumbs"><a href="#/">Головна</a><span>›</span>${esc(title)}</nav><h1 class="ptitle">${esc(title)}</h1><div class="box txt" style="max-width:820px">${text.split(/\n+/).filter(Boolean).map(x=>`<p>${esc(x)}</p>`).join("")}${extra}</div>`;
}

/* ---------- сторінка товару ---------- */
function specRows(sp){return(sp||"").split(";").map(x=>{const k=x.indexOf(":");return k>0?[x.slice(0,k).trim(),x.slice(k+1).trim()]:null}).filter(Boolean)}

/* ---------- «Дивіться також»: до 9 сумісних товарів, додати в кошик галочкою ---------- */
const relOn=()=>!SHOP.rel_off;
function relFor(p){
 const N=x=>x.n.toLowerCase().replace(/[еЕ](?=\d)/g,"e").replace(/(\d)\s*[хx×]\s*(\d)/g,"$1x$2"),n=N(p),c=p.c,top=c[0]||"",sec=c[1]||"",leaf=c[c.length-1]||"";
 const C=new Map(),add=(arr,sc,why,k)=>{let i=0;for(const x of arr){if(i>=k)break;if(!x||x.id===p.id||!x.st||!(x.pr0>0))continue;const o=C.get(x.id);if(!o||o.s<sc)C.set(x.id,{x,s:sc-i*.01,w:why});i++}};
 const L=f=>P.filter(x=>x.id!==p.id&&x.st&&x.pr0>0&&f(x)),ch=a=>a.sort((x,y)=>(!y.img-!x.img)||x.pr0-y.pr0);
 const uq=(a,key)=>{const s={};return a.filter(x=>{const q=key(x);if(s[q])return false;s[q]=1;return true})};
 const W=x=>{const m=N(x).match(/(\d+(?:[.,]\d+)?)\s*w\b/);return m?+m[1].replace(",","."):0};
 const SK=x=>{const m=N(x).match(/\b(e27|e14|e40|gu10|gu5[.,]3|g9|g4|gx53|g13)\b/);return m?m[1].replace(",","."):""};
 const D=x=>{const m=N(x).match(/\bd\.?\s?(\d{2,3})\b/);return m?m[1]:""};
 const lf=x=>x.c[x.c.length-1]||"",in2=(x,s2)=>x.c[1]===s2,isL=x=>in2(x,"Світлодіодні лампи");
 const ZZ=x=>/з\/з|заземл/.test(N(x))?1:/б\/з/.test(N(x))?0:-1;
 /* A. світильник або патрон під лампу → лампи потрібного цоколя (не потужніші за max W) */
 const sk=SK(p);
 if(sk&&!isL(p)&&sec!=="Світлодіодна стрічка"&&(/патрон|під лампу|без лампи/.test(n)||top==="Освітлення"&&!/\bled\b|світлодіод/.test(n))){
  const mx=+((n.match(/max\s*(\d+)\s*w/)||[])[1]||0),lm=ch(L(x=>isL(x)&&SK(x)===sk&&(!mx||!W(x)||W(x)<=mx)&&!/датчик|акумулятор|fito|фіто/.test(N(x))));
  add(uq(lm.filter(x=>!/filament|філамент/.test(N(x))),W).sort((a,b)=>W(a)-W(b)),100,"Лампа "+sk.toUpperCase(),5);
  add(lm.filter(x=>/filament|філамент/.test(N(x))),95,"Лампа "+sk.toUpperCase(),1);
 }
 /* B. лампа → світильники й патрони під цей цоколь */
 if(isL(p)&&sk&&sk!=="g13"){add(uq(ch(L(x=>!isL(x)&&SK(x)===sk&&/під лампу|без лампи/.test(N(x)))),x=>x.c.join()),60,"Під цю лампу",3);add(ch(L(x=>/^патрон/.test(N(x))&&SK(x)===sk)),55,"Патрон "+sk.toUpperCase(),2)}
 /* C. лампи Т8 ↔ світильники під Т8 тієї ж довжини */
 const len=x=>{const t=N(x),m=t.match(/(600|1200|1500)\s*мм|(0[.,]6|1[.,]2|1[.,]5)\s*м\b/);return m?(m[1]||String(Math.round(parseFloat(m[2].replace(",","."))*1000))):""};
 if(leaf==="Світильники під лампи Т8")add(ch(L(x=>lf(x)==="Лінійні лампи Т8"&&(!len(p)||len(x)===len(p)))),100,"Лампа Т8",4);
 if(leaf==="Лінійні лампи Т8")add(ch(L(x=>lf(x)==="Світильники під лампи Т8"&&(!len(p)||!len(x)||len(x)===len(p)))),90,"Світильник під Т8",3);
 /* D. батарейки до виробів на батарейках */
 const bm=n.match(/\d\s*[*x×]\s*(aaa|ааа|aa|аа)\b/);
 if(bm){const t=/aaa|ааа/.test(bm[1]);add(ch(L(x=>/Батарейки/.test(x.c[1]||"")&&new RegExp(t?"lr03":"lr0?6\\b|lr6","i").test(x.n)&&/alkaline/i.test(x.n))),100,"Батарейки "+(t?"AAA":"AA"),2)}
 /* E. каучукові: комплект того ж бренду й кольору */
 if(leaf==="Каучукові"){
  const col=x=>(N(x).match(/чорн|червон|син|помаранч|біл|сір/)||[""])[0],ty=x=>/^вилка/.test(N(x))?0:/^розетка/.test(N(x))?1:2,gn=x=>+((N(x).match(/(\d)\s*гнізд/)||[0,0])[1]),c0=col(p);
  const a=L(x=>x.c.join()===c.join()&&(x.b===p.b||!x.b||!p.b)&&(col(x)===c0||!c0&&col(x)==="чорн"||!col(x)&&c0==="чорн"));
  add(uq(a.sort((x,y)=>ty(x)-ty(y)||gn(x)-gn(y)||x.pr0-y.pr0),x=>ty(x)+"|"+gn(x)+"|"+/г-под/.test(N(x))+"|"+/вимик/.test(N(x))),100,"До комплекту",7);
  add(ch(L(x=>/кгтп|пвс 3x/.test(N(x))&&x.c[0]==="Кабельна продукція")),40,"Кабель",2);
 }
 /* F. силові та до плит: вилка ↔ розетка з тими ж струмом, полюсами і IP */
 if(leaf==="Силові"||leaf==="До електричних плит"){
  const key=x=>{const t=N(x),am=(t.match(/(\d+)\s*[аa](?![а-яіїєa-z])/)||[])[1]||"",po=(t.match(/\/(\d)/)||[])[1]||(/трифаз|3x фаз|3р\+/.test(t)?"3":/2р\+/.test(t)?"2":""),ip=(t.match(/ip\s?(\d\d)/)||[])[1]||"";return am+"|"+po+"|"+(leaf==="Силові"?ip:"")},ty=x=>/^вилка/.test(N(x))?0:1;
  add(ch(L(x=>x.c.join()===c.join()&&key(x)===key(p)&&ty(x)!==ty(p))),100,ty(p)?"Вилка до розетки":"Розетка до вилки",4);
  add(ch(L(x=>x.c.join()===c.join()&&key(x)===key(p)&&ty(x)===ty(p))),70,"Інший варіант",2);
  if(leaf==="Силові")add(ch(L(x=>/кгтп/.test(N(x)))),45,"Гнучкий кабель",2);
 }
 /* G. побутові вилки ↔ колодки + шнур, з/з до з/з */
 const PB=x=>x.c[1]==="Вилки та розетки"&&lf(x)==="Побутові",KL=x=>lf(x)==="Колодки"&&x.c[0]==="Електротовари для дому";
 const cord=z=>ch(L(x=>x.c[0]==="Кабельна продукція"&&(z===1?/пвс 3x(0,75|1|1,5)\b/:/шввп 2x(0,75|1)\b|пвс 2x(0,75|1)\b/).test(N(x))));
 if(PB(p)&&/^вилка/.test(n)){const z=ZZ(p);add(ch(L(x=>KL(x)&&(z<0||ZZ(x)===z))),70,"Колодка",4);add(cord(z),60,"Шнур",2)}
 if(KL(p)){const z=ZZ(p);add(ch(L(x=>PB(x)&&/^вилка/.test(N(x))&&(z<0||ZZ(x)===z||z===0&&ZZ(x)===1))),80,"Вилка",3);add(cord(z),60,"Шнур",2)}
 /* H. рамки ↔ механізми однієї серії та кольору */
 if(top==="Розетки та вимикачі"){
  const ser=x=>((x.n.match(/\b(RITA|CANDELA|BRON|NORA|Lara|Julia|Juli|Aqua)\b/i)||[])[1]||"").toLowerCase(),cl=x=>((x.n.match(/Mutlusan,\s*([^,(]+)/i)||x.n.match(/"[^"]+"\s*,\s*([^,(]+)/)||[])[1]||"").trim().toLowerCase(),s0=ser(p),fr=/^рамка/.test(n),mech=x=>/^механізм|^розетка|^вимикач/.test(N(x))&&!/^рамка/.test(N(x));
  if(s0&&(fr||mech(p))){
   if(fr)add(uq(ch(L(x=>ser(x)===s0&&cl(x)===cl(p)&&mech(x))),x=>N(x).replace(/,.*/,"").replace(/механізм /,"")),100,"Механізм у рамку",8);
   else{add(uq(ch(L(x=>ser(x)===s0&&cl(x)===cl(p)&&/^рамка/.test(N(x)))),x=>N(x).replace(/,.*/,"")).sort((a,b)=>a.pr0-b.pr0),100,"Рамка",4);
    const sw=/вимикач/.test(n);add(uq(ch(L(x=>ser(x)===s0&&cl(x)===cl(p)&&mech(x)&&(sw?/розетк/:/вимикач/).test(N(x)))),x=>N(x).replace(/,.*/,"")),70,sw?"Розетка серії":"Вимикач серії",3)}
  }
 }
 /* I. кабель-канал ↔ аксесуари того ж розміру */
 if(leaf==="Кабель канал"||leaf==="Аксесуари до кабель-каналу"){
  const sz=x=>(N(x).match(/(\d{2,3})\s*x\s*(\d{2,3})/)||[]).slice(1,3).join("x"),z=sz(p);
  if(z){if(leaf==="Кабель канал")add(uq(ch(L(x=>sz(x)===z&&lf(x)==="Аксесуари до кабель-каналу")),x=>N(x).replace(/\d.*/,"")),100,"Аксесуар "+z.replace("x","×"),7);
   else{add(ch(L(x=>sz(x)===z&&lf(x)==="Кабель канал")),100,"Кабель-канал",2);add(uq(ch(L(x=>sz(x)===z&&lf(x)===leaf)),x=>N(x).replace(/\d.*/,"")),70,"Аксесуар "+z.replace("x","×"),5)}}
 }
 /* J. трекові системи */
 if(sec==="Трекові системи"){const rail=x=>lf(x)==="Шинопроводи та комплектуючі",ra=x=>/^шинопровід/.test(N(x));
  if(rail(p)){add(uq(ch(L(x=>in2(x,"Трекові системи")&&!rail(x))),x=>lf(x)+W(x)),100,"Трековий світильник",6);add(ch(L(x=>rail(x)&&!ra(x))),80,"З’єднувач",3)}
  else{add(ch(L(x=>rail(x)&&ra(x))),100,"Шинопровід",3);add(ch(L(x=>rail(x)&&!ra(x))),80,"З’єднувач",3);add(uq(ch(L(x=>x.c.join()===c.join())),W),40,"Інша потужність",2)}}
 /* K. LED-стрічка */
 if(sec==="Світлодіодна стрічка"){const V=x=>(N(x).match(/(?:dc\s*)?(12|24)\s*v/)||[])[1]||"",vv=V(p),st=x=>lf(x)==="LED стрічка 12/24V (SMD, COB)";
  if(st(p)){add(ch(L(x=>/^блок живлення/.test(N(x))&&lf(x)==="Блоки живлення та контролери"&&(!vv||V(x)===vv))),100,"Блок живлення "+(vv?vv+"V":""),3);
   if(/rgb/.test(n))add(ch(L(x=>/контролер/.test(N(x))&&(!vv||!V(x)||V(x)===vv))),98,"Контролер RGB",1);
   add(ch(L(x=>lf(x)==="Профіль алюмінієвий")),90,"Профіль",3);add(ch(L(x=>lf(x)==="З'єднувачі, заглушки, тримачі"&&!/neon/.test(N(x)))),80,"З’єднувач",2)}
  else if(lf(p)==="Неонова стрічка 230V")add(ch(L(x=>lf(x)==="З'єднувачі, заглушки, тримачі"&&/neon/.test(N(x)))),100,"Для неону",6);
  else if(/^блок живлення/.test(n)&&vv)add(ch(L(x=>st(x)&&V(x)===vv)),100,"Стрічка "+vv+"V",6);
  else if(lf(p)==="Профіль алюмінієвий")add(ch(L(x=>st(x))),90,"Стрічка",4);
  else if(lf(p)==="З'єднувачі, заглушки, тримачі")add(ch(L(x=>/neon/.test(n)?lf(x)==="Неонова стрічка 230V":st(x))),90,"Стрічка",4);
 }
 /* L. автомати ↔ щити й шини */
 const AV=x=>/Автоматичні вимикачі|Диференційні|ПЗВ/.test(lf(x)),SH=x=>x.c[0]==="Розподільні щити та бокси"&&/щити та бокси/.test(lf(x)),BUS=x=>/Шини та клемники/.test(lf(x));
 if(AV(p)){add(ch(L(x=>SH(x)&&/авт|модул|\d+и\b/.test(N(x)))),60,"Щит / бокс",3);add(ch(L(BUS)),70,"Шина",2)}
 if(SH(p)){add(uq(ch(L(x=>lf(x)==="Автоматичні вимикачі"&&/1р|1p/.test(N(x))&&/\b(10|16|25)\s*а(?![а-яі])/.test(N(x)))),x=>(N(x).match(/\b(10|16|25)\s*а(?![а-яі])/)||[])[1]),70,"Автомат",3);add(ch(L(BUS)),70,"Шина",2);add(ch(L(x=>/ПЗВ/.test(lf(x)))),55,"ПЗВ",1)}
 /* M. силовий кабель → монтаж */
 if(top==="Кабельна продукція"&&/ввг|пвс|шввп|пв-3|аввг|аппв|кгтп/.test(n)){add(ch(L(x=>/Клеми/.test(lf(x))&&/з.єднувальн/.test(N(x)))),70,"Клема",3);add(ch(L(x=>/Ізоляційна стрічка/.test(lf(x))&&/стрічк/.test(N(x)))),55,"Ізострічка",2);add(ch(L(x=>/Труби, гофра/.test(lf(x))&&/гофро/.test(N(x)))),50,"Гофротруба",2);add(ch(L(x=>lf(x)==="Коробки монтажні")),45,"Коробка",1)}
 /* N. гофра й труби → кріплення й фітинги того ж діаметра */
 if(/Труби, гофра/.test(leaf)&&D(p)){const d0=D(p);add(ch(L(x=>/Скоби|хомут/.test(lf(x))&&D(x)===d0)),90,"Кріплення d"+d0,3);add(ch(L(x=>x.c.join()===c.join()&&D(x)===d0&&!/^труба|^гофро/.test(N(x)))),90,"Фітинг d"+d0,4)}
 /* O. вентиляція: вентилятор ↔ повітровод того ж діаметра, панелі dRim */
 if(top==="Клімат"){const d0=D(p);
  if(/Витяжні/.test(leaf)){if(d0)add(ch(L(x=>lf(x)==="Повітроводи"&&D(x)===d0)),100,"Повітровод D"+d0,3);if(/drim/.test(n))add(ch(L(x=>lf(x)==="Панелі для вентиляторів")),100,"Панель dRim",4)}
  if(leaf==="Повітроводи"&&d0)add(ch(L(x=>/Витяжні/.test(lf(x))&&D(x)===d0)),100,"Вентилятор D"+d0,4);
  if(leaf==="Панелі для вентиляторів")add(ch(L(x=>/Витяжні/.test(lf(x))&&/drim/.test(N(x)))),100,"Вентилятор dRim",4);
 }
 /* P. прожектор ↔ датчик руху */
 if(sec==="Прожектори"&&!/датчик/.test(n))add(ch(L(x=>/Датчики руху та світла/.test(x.c[1]||"")&&!/механізм/.test(N(x)))),60,"Датчик",3);
 /* Q. монтаж: коробки ↔ клеми, наконечники ↔ термоусадка й обжимка, металорукав ↔ скоби */
 const KLM=x=>/Клеми/.test(lf(x))&&/з.єднувальн|клема/.test(N(x));
 if(leaf==="Коробки монтажні"){add(ch(L(KLM)),80,"Клема",3);add(ch(L(x=>/Труби, гофра/.test(lf(x))&&/гофро/.test(N(x)))),50,"Гофротруба",2)}
 if(/Клеми/.test(leaf))add(ch(L(x=>lf(x)==="Коробки монтажні"&&/розподіл|розвед|розгалуж|ip/.test(N(x)))),60,"Коробка",3);
 if(leaf==="Кабельні наконечники"){add(ch(L(x=>lf(x)==="Електромонтажний інструмент"&&/обжим|кліщ/.test(N(x)))),90,"Інструмент",1);add(ch(L(x=>lf(x)==="Термоусаджувальні трубки")),80,"Термоусадка",3)}
 if(leaf==="Термоусаджувальні трубки")add(ch(L(x=>lf(x)==="Кабельні наконечники")),60,"Наконечник",3);
 if(leaf==="Металорукав"&&D(p)){const d0=D(p);add(ch(L(x=>/Скоби/.test(lf(x))&&D(x)===d0)),90,"Кріплення d"+d0,3)}
 /* R. СІП, ТВ, мережа */
 if(lf(p)==="Провід СІП")add(ch(L(x=>lf(x)==="Арматура для СІП")),90,"Арматура СІП",5);
 if(leaf==="Арматура для СІП"){add(ch(L(x=>lf(x)==="Провід СІП")),80,"Провід СІП",2);add(uq(ch(L(x=>x.c.join()===c.join())),x=>N(x).replace(/\s.*/,"")),60,"Арматура СІП",3)}
 const TV=x=>/ТВ антени/.test(lf(x)),CX=x=>/коаксіал/.test(lf(x));
 if(CX(p)){add(ch(L(x=>TV(x)&&/роз.єм|штекер|папа/.test(N(x)))),90,"Роз’єм F",2);add(ch(L(x=>TV(x)&&/спліттер/.test(N(x)))),70,"Спліттер",2);add(ch(L(x=>TV(x)&&/антена/.test(N(x)))),60,"Антена",1)}
 if(TV(p)){add(ch(L(CX)),90,"Коаксіальний кабель",2);if(/антена/.test(n))add(ch(L(x=>TV(x)&&/роз.єм/.test(N(x)))),70,"Роз’єм F",2)}
 if(/Вита пара/.test(leaf))add(ch(L(x=>x.c[0]==="Розетки та вимикачі"&&/комп.ютерн|rj45|cat\s?5|cat\s?6|інтернет/.test(N(x)))),80,"Інтернет-розетка",3);
 /* S. DIN: шини й гребінки → автомати; датчик руху → прожектор */
 if(/Шини та клемники/.test(leaf))add(uq(ch(L(x=>lf(x)==="Автоматичні вимикачі"&&/1р|1p/.test(N(x)))),x=>(N(x).match(/(\d+)\s*а(?![а-яі])/)||[])[1]),60,"Автомат",3);
 if(sec==="Датчики руху та світла"&&!/механізм/.test(n))add(ch(L(x=>x.c[1]==="Прожектори"&&!/датчик/.test(N(x)))),50,"Прожектор",3);
 /* якщо сумісних мало — додаємо схожі з того ж розділу (замість окремого блоку «Схожі товари») */
 if(C.size<6){const k=6-C.size;add(ch(L(x=>x.c.join(SEP)===c.join(SEP))),5,"Схожий товар",k);if(C.size<6)add(ch(L(x=>c.length&&x.c[0]===c[0]&&x.c[1]===c[1])),4,"Схожий товар",6-C.size)}
 return [...C.values()].sort((a,b)=>b.s-a.s).slice(0,9);
}
let XS=[];
function relHtml(p){
 if(!relOn())return"";let g=[];try{g=relFor(p)}catch(e){}
 XS=g.map(x=>x.x.id);if(!g.length)return"";
 return `<section class="xsell"><div class="xh"><h2>Дивіться також</h2><span>Позначте галочкою — додамо в кошик разом</span></div><div class="xgrid" style="--xc:${g.length<=5?g.length:Math.ceil(g.length/2)}">${g.map(({x,w})=>{const u="#/p/"+encodeURIComponent(x.id);return `<div class="xc"><a class="xi" href="${u}">${img(x.img,240,240,x.n)}</a><span class="xw">${esc(w)}</span><a class="xn" href="${u}">${esc(x.n)}</a><b class="xp">${money(priceInfo(x).pc)}</b><label class="xk"><input type="checkbox" data-xs="${esc(x.id)}" onchange="xsUpd()"> Додати до кошика</label></div>`}).join("")}</div><button class="xadd" id="xadd" onclick="xsAdd()" disabled>Оберіть товари галочкою</button></section>`;
}
function xsSel(){return [...document.querySelectorAll(".xsell input[data-xs]:checked")].map(i=>i.dataset.xs).filter(id=>M[id])}
function xsUpd(){const b=$("xadd");if(!b)return;const s=xsSel(),sum=s.reduce((t,id)=>t+priceInfo(M[id]).pc,0);b.disabled=!s.length;b.textContent=s.length?`Додати до кошика: ${s.length} шт. · ${money(sum)}`:"Оберіть товари галочкою";document.querySelectorAll(".xsell .xc").forEach(c=>c.classList.toggle("on",!!c.querySelector("input:checked")))}
function xsAdd(){const s=xsSel();if(!s.length||SHOP.orders_off)return;s.forEach(id=>{cart[id]=(cart[id]||0)+1});save();drawCart();document.querySelectorAll(".xsell input[data-xs]").forEach(i=>i.checked=false);xsUpd();toast(s.length>1?"Додано в кошик: "+s.length+" товари":"Додано в кошик",1)}
async function viewProduct(id){
 const p=M[id];
 if(!p){$("view").innerHTML='<div class="empty">Товар не знайдено або він прихований. <a href="#/c/">До каталогу</a></div>';return}
 QTY=1;PTAB="info";document.title=p.n+" — Trend Electro";
 const pi=priceInfo(p),o=pi.base,pc=pi.pc,disc=pi.disc;
 $("view").innerHTML=`<nav class="crumbs"><a href="#/">Головна</a>${p.c.map((n,i)=>`<span>›</span><a href="${href(p.c.slice(0,i+1))}">${esc(n)}</a>`).join("")}</nav>
<div class="pgrid"><div class="pl"><div class="pm"><div class="pimg" id="pmain">${img(p.img,900,900,p.n,1)}</div><div class="thumbs" id="pthumbs"></div></div><div class="box pkbox"><h3>Основні характеристики</h3><div id="pkey"><div class="sku">Завантаження…</div></div></div></div><div class="pinfo"><h1>${esc(p.n)}</h1>
<div class="meta"><span>Артикул: <b>${esc(p.id)}</b></span>${p.b?`<span>Бренд: <a href="#/c/" data-brand="${esc(p.b)}">${esc(p.b)}</a></span>`:""}</div>
<div class="avail${p.st?"":" no"}">${p.st?ico("check")+stkTxt(p):"Немає в наявності"}</div>
<div class="bigprice${disc>0?" sale":""}">${money(pc)}${pi.base>pc?`<s>${money(pi.base)}</s>`:""}${disc>0?`<span class="bds2">${saleBadges(pi)}</span>`:""}</div>${packHtml(p,1)}${p.ofr?`<div class="spbox"><span class="bd p">Спеціальна пропозиція</span><div>${esc(p.ofr)}</div></div>`:""}
<div class="buyrow"><div class="qtybox"><button data-q="-1" aria-label="Менше">−</button><input id="pq" type="number" min="1" max="${stkMax(p)}" value="1" inputmode="numeric" aria-label="Кількість"><button data-q="1" aria-label="Більше">+</button></div><button class="buybtn" id="buy" data-id="${esc(p.id)}"${p.st?"":" disabled"}>${p.st?ico("cart")+"Купити":"Немає в наявності"}</button><button class="favbtn${fav[p.id]?" on":""}" data-f="${esc(p.id)}" aria-label="Обране">${ico("heart")}</button></div><p class="ordoff">${esc(ordMsg())}</p>
<div class="ptrust"><a href="#/page/delivery">${ico("truck")}<span><b>Доставка по Україні</b>Нова пошта, Укрпошта</span></a><a href="#/page/delivery">${ico("wallet")}<span><b>Оплата при отриманні</b>або карткою</span></a><a href="#/page/exchange">${ico("swap")}<span><b>Обмін та повернення</b>за законом, без зайвих питань</span></a></div></div></div>
${relHtml(p)}<div class="tabsb"><button data-pt="info" class="on">Опис</button><button data-pt="spec">Усі характеристики</button></div><div class="box" id="pdet"><div class="sku">Завантаження…</div></div>
${rvHtml(p.id)}<section class="sec" id="btog" hidden></section>`;
 rvPush(p.id);loadBT(p.id);
 const sbx=$("sbuy");sbx.innerHTML=`<div><b>${money(pc)}</b><small>${p.st?"В наявності":""}</small></div><button class="buybtn" data-sb="${esc(p.id)}"${p.st?"":" disabled"}>${p.st?ico("cart")+"Купити":"Немає в наявності"}</button>`;sbx.hidden=false;
 if(p.d===null&&sb){try{let r=await sb.from("products").select("description,specs,images").eq("id",id).maybeSingle();if(r.error)r=await sb.from("products").select("description,specs").eq("id",id).maybeSingle();p.d=(r.data&&r.data.description)||"";p.sp=(r.data&&r.data.specs)||"";p.ims=(r.data&&Array.isArray(r.data.images)?r.data.images:[]).filter(Boolean)}catch(e){p.d="";p.sp=""}}
 if(curH().indexOf("#/p/")===0&&decodeURIComponent(curH().slice(4))===id)fillDetails(p);
}
function fillDetails(p){
 const rows=specRows(p.sp),k=$("pkey");if(!k)return;
 const th=$("pthumbs"),all=[p.img].concat(p.ims||[]).filter(Boolean);if(th&&all.length>1)th.innerHTML=all.map((u,i)=>`<button data-ph="${esc(u)}" class="${i?"":"on"}" aria-label="Фото ${i+1}">${img(u,120,120)}</button>`).join("");
 k.innerHTML=rows.length?rows.slice(0,7).map(r=>`<div class="kv"><span>${esc(r[0])}</span><span>${esc(r[1])}</span></div>`).join(""):'<div class="sku">Характеристики уточнюйте в менеджера — відповімо швидко.</div>';
 drawDet(p);
}
function drawDet(p){
 const d=$("pdet");if(!d)return;
 if(PTAB==="spec"){const rows=specRows(p.sp);d.innerHTML=rows.length?`<table class="sp">${rows.map(r=>`<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join("")}</table>`:'<div class="sku">Характеристики не вказані.</div>'}
 else d.innerHTML=p.d?`<div class="txt">${esc(p.d).split(/\n+/).map(x=>`<p>${x}</p>`).join("")}</div>`:'<div class="sku">Опис скоро з’явиться. Якщо маєте питання щодо товару — напишіть нам.</div>';
}

/* ---------- каталог-меню (дерево з розкриттям) ---------- */
function menuHtml(n,lvl){
 return kids(n).map(k=>{const has=Object.keys(k.kids).length>0&&lvl<2;
  return `<div class="cm-row"><a href="${href(k.path)}">${esc(k.name)} <small>${k.count}</small></a>${has?'<button data-tg aria-label="Розкрити">+</button>':""}</div>${has?`<div class="cm-sub">${menuHtml(k,lvl+1)}</div>`:""}`}).join("");
}
function openCatMenu(){$("cmb").innerHTML=`<div class="cm-row"><a href="#/c/">Усі товари <small>${P.length}</small></a></div>`+menuHtml(ROOT,0);panel("catm",true)}

/* ---------- панелі ---------- */
const PANELS=["drawer","acc","catm"];
function lock(){document.documentElement.style.overflow=PANELS.some(w=>$(w).classList.contains("on"))?"hidden":""}
function panel(w,v){$(w).classList.toggle("on",v);$("shade").classList.toggle("on",PANELS.some(x=>$(x).classList.contains("on")));lock()}
function closeAll(){$("sug").hidden=true;PANELS.forEach(w=>$(w).classList.remove("on"));$("shade").classList.remove("on");lock()}
let ttm=null;function toast(t,btn){$("toastT").textContent=t;$("toastB").hidden=!btn;$("toast").classList.add("on");clearTimeout(ttm);ttm=setTimeout(()=>$("toast").classList.remove("on"),2800)}

/* ---------- кошик ---------- */
const save=()=>SV("te_cart",cart);
function totals(ids){let s=0;ids.forEach(i=>s+=price(M[i])*cart[i]);const d=Math.max(prof?(+prof.discount_percent||0):0,bdPct(),cardPct(),promoPct,loyOne(s));return{s,d,t:Math.round(s*(100-d))/100}}
function drawCart(){stkClamp();
 const ids=Object.keys(cart).filter(i=>M[i]);let n=0;
 $("lines").innerHTML=ids.length?ids.map(i=>{const p=M[i],q=cart[i];n+=q;const u="#/p/"+encodeURIComponent(i);return `<div class="row"><a class="rth" href="${u}" aria-label="${esc(p.n)}">${img(p.img,120,120)}</a><a href="${u}">${esc(p.n)}</a><b>${money(price(p)*q)}</b><div class="qty"><button data-m="${esc(i)}" aria-label="Менше">−</button>${q}<button data-p="${esc(i)}" aria-label="Більше">+</button></div><span class="sku">${money(price(p))} / шт.</span></div>`}).join(""):'<div class="empty">Кошик поки порожній.<br>Додайте товари з каталогу — і оформлення займе хвилину.<br><br><a class="btn" href="#/c/">До каталогу</a></div>';
 const t=totals(ids);$("sum").textContent=money(t.t);$("cnt").textContent=n||"";$("bcnt").textContent=n||"";$("form").hidden=!ids.length;
 $("dinfo").textContent=t.d>0?"Знижка "+t.d+"%: −"+money(Math.round((t.s-t.t)*100)/100):"";
 const f=Object.keys(fav).length;$("fcnt").textContent=f||"";$("bfcnt").textContent=f||"";
}
const stkOn=p=>!!SHOP.stock_on&&p&&p.sk!=null;
function stkTxt(p){if(!stkOn(p))return"Є в наявності";return p.sk<=5?"Залишилось "+p.sk+" шт":"Є в наявності: "+p.sk+" шт"}
function stkMax(p){return stkOn(p)?Math.max(1,p.sk):999}
function stkClamp(){let ch=0;Object.keys(cart).forEach(i=>{const p=M[i];if(stkOn(p)&&cart[i]>p.sk){ch=1;if(p.sk>0)cart[i]=p.sk;else delete cart[i]}});if(ch){save();toast("Кількість змінено: більше, ніж є в наявності, замовити не можна",1)}}
function payOpts(){const s=$("fy");if(!s)return;const o=["Оплата при отриманні","Оплата карткою"];if(SHOP.pay_cod_off)o.shift();if(SHOP.pay_card_off)o.pop();if(SHOP.bank_on)o.push("Оплата на рахунок ФОП (IBAN)");const cur=s.value;s.innerHTML=o.map(x=>`<option>${x}</option>`).join("");if(o.indexOf(cur)>-1)s.value=cur}
function openCart(){if(SHOP.orders_off)return;payOpts();{const lp=LS("te_lpromo",null);if(lp&&!promoCode&&Date.now()-lp.t<2592e5&&(!lp.e||lp.e>Date.now()))applyPromo(lp.c)}$("drawer").classList.remove("ordered");$("done").hidden=true;$("omsg").textContent="";drawCart();if(prof){if(!$("fn").value)$("fn").value=prof.full_name||"";if(!$("fp").value)$("fp").value=prof.phone||""}const cu=LS("te_cust",null);if(cu){if(!$("fn").value)$("fn").value=cu.n||"";if(!$("fp").value)$("fp").value=cu.p||"";if(!$("fc").value)$("fc").value=cu.c||""}panel("drawer",true)}
async function applyPromo(code){
 const c=(code||"").trim().toUpperCase(),pm=$("pmsg");promoPct=0;promoCode="";pm.textContent="";$("fpr").value=c;
 if(c&&sb){const r=await sb.rpc("check_promo",{p_code:c});
  if(r.data){promoPct=+r.data;promoCode=c;pm.className="msg ok";pm.textContent="Промокод діє: −"+promoPct+"%"}
  else{pm.className="msg";pm.textContent="Промокод недійсний або прострочений."}}
 drawCart();
}
async function placeOrder(btn){if(SHOP.orders_off)return;
 const om=$("omsg"),err=(id,t)=>{document.querySelectorAll("#form .bad").forEach(x=>x.classList.remove("bad"));om.className="msg";om.textContent=t;const i=$(id);if(i){i.classList.add("bad");i.focus()}};
 document.querySelectorAll("#form .bad").forEach(x=>x.classList.remove("bad"));
 const nm=$("fn").value.trim(),ad=$("fc").value.trim(),dg=$("fp").value.replace(/\D/g,"");
 let ph=dg;if(/^0\d{9}$/.test(dg))ph="380"+dg.slice(1);else if(/^80\d{9}$/.test(dg))ph="3"+dg;
 if(nm.length<2||nm.indexOf(" ")<0&&nm.length<3)return err("fn","Вкажіть, будь ласка, ім’я та прізвище.");
 if(!/^380\d{9}$/.test(ph))return err("fp","Вкажіть номер телефону у форматі 067 123 45 67.");
 if(ad.length<3)return err("fc",$("fd").value.indexOf("кур")>-1?"Вкажіть адресу: місто, вулицю, будинок, квартиру.":"Вкажіть місто та номер відділення.");
 ph="+"+ph.replace(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/,"$1 $2 $3 $4 $5");$("fp").value=ph;
 const ids=Object.keys(cart).filter(i=>M[i]);if(!ids.length)return;
 if(!sb)return err("","Замовлення тимчасово недоступні. Зателефонуйте нам, будь ласка.");
 om.textContent="";btn.disabled=true;btn.textContent="Оформлюємо…";
 const r=await sb.rpc("create_order",{p_name:nm,p_phone:ph,p_delivery:$("fd").value,p_address:ad,p_payment:$("fy").value,p_comment:$("fcm").value.trim()||null,p_promo:promoCode||null,p_items:ids.map(i=>({id:i,qty:cart[i]}))});
 btn.disabled=false;btn.textContent="Оформити замовлення";
 if(r.error){const em=r.error.message||"";return err("",/schema cache|Could not find|function/i.test(em)?"Не вдалося оформити замовлення. Спробуйте ще раз або зателефонуйте нам.":em)}
 const o=r.data,t="Замовлення №"+o.id+"\n"+o.items.map(x=>x.id+" · "+x.name+" × "+x.qty+" = "+money(Math.round(x.price*x.qty*100)/100)).join("\n")+"\nРазом: "+money(+o.total)+(+o.discount?" (знижка "+o.discount+"%)":"")+"\nДоставка: "+$("fd").value+", "+ad+"\nОплата: "+$("fy").value;
 SV("te_cust",{n:nm,p:ph,d:$("fd").value,c:ad});srcSend(o.id,ph);cart={};save();promoPct=0;promoCode="";$("fpr").value="";$("pmsg").textContent="";drawCart();$("form").hidden=true;$("lines").innerHTML="";
 const d=$("done");d.hidden=false;$("drawer").classList.add("ordered");
 d.innerHTML=`<div class="ok">${ico("check")}</div><b style="font-size:20px">Дякуємо! Замовлення №${esc(o.id)} прийнято.</b><div class="sku" style="font-size:14px">Менеджер зателефонує найближчим часом, щоб підтвердити деталі й доставку.</div><pre>${esc(t)}</pre>${/IBAN/.test($("fy").value)&&SHOP.bank_text?`<div class="pk big" style="white-space:pre-line"><b>Реквізити для оплати:</b>\n${esc(SHOP.bank_text)}\nПризначення: замовлення №${esc(o.id)}</div>`:""}${accOffer(nm,ph,"go")}<button class="go" id="dclose">Продовжити покупки</button>`;
}

/* ---------- кабінет ---------- */
let PFP=null,PFU=null;
async function loadProf(){
 const u=me?me.id:null;if(PFP&&PFU===u)return PFP;PFU=u;PFP=(async()=>{
 let pr=null;if(me){try{const r=await sb.from("profiles").select("*").eq("id",me.id).maybeSingle();pr=r.data}catch(e){}}prof=pr;
 $("accL").textContent=me?"Кабінет":"Увійти";regBar();drawCart();if($("acc").classList.contains("on"))drawAcc();setTimeout(bdPopup,300);setTimeout(loyPop,900);
 })();const my=PFP;try{await my}finally{if(PFP===my)PFP=null}
}
const lbl=s=>({new:"Нове",confirmed:"Підтверджено",shipped:"Відправлено",done:"Виконано",cancelled:"Скасовано"}[s]||s);
function drawAcc(msg){
 const b=$("abody");
 if(!sb){b.innerHTML='<div class="empty">Кабінет тимчасово недоступний.</div>';return}
 if(RECOV){b.innerHTML=`<div class="df" style="border:0;padding:12px 0"><h3 style="margin:0">Новий пароль</h3><p class="sku" style="font-size:14px">Придумайте новий пароль для входу (мінімум 6 символів).</p><input id="np1" type="password" placeholder="Новий пароль" autocomplete="new-password"><input id="np2" type="password" placeholder="Повторіть пароль" autocomplete="new-password"><div class="msg" id="rm">${esc(msg||"")}</div><button class="go" id="npgo">Зберегти пароль</button></div>`;return}
 if(!me&&tab==="forgot"){b.innerHTML=`<div class="df" style="border:0;padding:12px 0"><h3 style="margin:0">Відновлення пароля</h3><p class="sku" style="font-size:14px">Введіть email, з яким реєструвались. Ми надішлемо лист із посиланням, щоб придумати новий пароль.</p><input id="fe" type="email" placeholder="Email" autocomplete="email"><div class="msg" id="rm">${esc(msg||"")}</div><button class="go" id="fgo">Надіслати лист</button><button type="button" class="btn" data-t="in">← Назад до входу</button></div>`;return}
 if(!me){
  b.innerHTML=`<p class="sku" style="font-size:14px;margin:12px 0">Зареєструйтеся й отримайте персональну картку клієнта Silver з постійною знижкою 5%. Чим більше купуєте, тим вища знижка: до 20%.</p><div class="tabs"><button data-t="in" class="${tab==="in"?"on":""}">Вхід</button><button data-t="up" class="${tab==="up"?"on":""}">Реєстрація</button></div><div class="df" style="border:0;padding:12px 0">${tab==="up"?'<input id="rn" placeholder="Ім’я та прізвище" autocomplete="name"><input id="rp" placeholder="Телефон" inputmode="tel" autocomplete="tel"><div class="bdl">Дата народження (обов’язково)'+bdSel("rb")+'</div><div class="sku">У тиждень дня народження — особлива знижка. Дату можна вказати лише один раз.</div>':""}<input id="re" type="email" placeholder="Email" autocomplete="email"><input id="rw" type="password" placeholder="Пароль (мінімум 6 символів)" autocomplete="${tab==="up"?"new-password":"current-password"}"><div class="msg" id="rm">${esc(msg||"")}</div><button class="go" id="rgo">${tab==="up"?"Зареєструватися":"Увійти"}</button>${tab==="up"?"":'<button type="button" class="btn" data-t="forgot">Забули пароль?</button>'}</div>`;return}
 b.innerHTML=`<div class="acol"><div class="aR">${loyBlock()||`<div class="bigcard" style="margin-top:12px"><small>Дисконтна картка</small><b>${esc(prof?prof.card_number||"—":"…")}</b><small>Ваша знижка: ${prof?(+prof.discount_percent||0):0}%</small></div>`}<div id="objs"></div><h3 style="margin:6px 0">Мої промокоди</h3><div id="pcodes"><div class="sku">Завантаження…</div></div><div class="df" style="border:0;padding:12px 0"><input id="rn" placeholder="Ім’я та прізвище" value="${esc(prof&&prof.full_name||"")}"><input id="rp" placeholder="Телефон" inputmode="tel" value="${esc(prof&&prof.phone||"")}">${bdayBlock()}<div class="msg" id="rm"></div><button class="go" id="rsave">Зберегти дані</button></div><div class="sku">${esc(me.email||"")}</div></div><div class="aL"><h3 style="margin:14px 0 6px">Мої замовлення</h3><div id="osum" class="osum"></div><div id="oall"></div><div id="ords"><div class="empty">Завантаження…</div></div></div></div><button class="more" id="rout">Вийти</button>`;
 objLoad();
 sb.from("promo_codes").select("code,percent,title,expires_at,uses_left").or("client_id.eq."+me.id+",show_all.eq.true").order("created_at",{ascending:false}).then(r=>{
  const l=r.data||[],e=$("pcodes");if(!e)return;
  e.innerHTML=l.length?l.map(c=>`<div class="pcode"><div><b>${esc(c.code)}</b> −${c.percent}%<small>${esc(c.title||"Персональна знижка")}${c.expires_at?" · до "+new Date(c.expires_at).toLocaleDateString("uk-UA"):""}</small></div><button data-use="${esc(c.code)}">Використати</button></div>`).join(""):'<div class="sku">Активних промокодів поки немає.</div>'});
 const oq=c=>sb.from("orders").select(c).order("created_at",{ascending:false}).limit(500);oq("id,created_at,total,status,ttn,payment_status,items").then(r=>r.error?oq("id,created_at,total,status,ttn,payment_status"):r).then(r=>{
  const l=r.data||[],e=$("ords");if(!e)return;
  {const os=$("osum");if(os&&prof){const dn=Math.round(l.filter(x=>x.status==="done").reduce((q,x)=>q+(+x.total||0),0)*100)/100,adj=Math.round((+prof.loyalty_adj||0)*100)/100,tt=Math.round((dn+adj)*100)/100;os.innerHTML=`<div><span>Покупки на сайті</span><b>${money(dn)}</b></div><div><span>Покупки іншим способом</span><b>${money(adj)}</b></div><div class="t"><span>Разом куплено</span><b>${money(tt)}</b></div>`;const lh=document.querySelector(".lyh b");if(lh)lh.textContent=money(tt)}}
  {const pe=$("lypend"),pn=l.filter(x=>x.status!=="done"&&x.status!=="cancelled").reduce((s,x)=>s+(+x.total||0),0);if(pe)pe.textContent=pn>0?"Замовлення в обробці: "+money(pn)+". Їх буде враховано після виконання.":""}{const ag={};l.filter(x=>x.status==="done").forEach(o=>(Array.isArray(o.items)?o.items:[]).forEach(i=>{const a=ag[i.id]=ag[i.id]||{n:i.name,q:0,s:0};a.q+=+i.qty||0;a.s+=(+i.price||0)*(+i.qty||0)}));const al=Object.keys(ag).sort((x,y)=>ag[y].s-ag[x].s),ae=$("oall");if(ae)ae.innerHTML=al.length?`<details class="oall"><summary>Усі куплені товари (${al.length})</summary>${al.map(k=>`<a class="oit" href="#/p/${encodeURIComponent(k)}"><span>${esc(ag[k].n||k)}</span><b>${ag[k].q} шт. · ${money(ag[k].s)}</b></a>`).join("")}</details>`:""}
  const oit=o=>Array.isArray(o.items)&&o.items.length?`<details class="oitems"><summary>Що замовлено (${o.items.length})</summary>${o.items.map(i=>`<a class="oit" href="#/p/${encodeURIComponent(i.id)}"><span>${esc(i.name||i.id)}</span><b>${+i.qty||0} × ${money(+i.price||0)}</b></a>`).join("")}</details>`:"";
  e.innerHTML=l.length?l.map(o=>`<div class="ord"><span>№${o.id} · ${new Date(o.created_at).toLocaleDateString("uk-UA")}</span><span><b>${money(+o.total)}</b> · ${lbl(o.status)}${o.payment_status==="paid"?" · оплачено":""}</span>${o.ttn?`<span class="ottn">Накладна Нової пошти: <a href="https://novaposhta.ua/tracking/?cargo_number=${encodeURIComponent(o.ttn)}" target="_blank" rel="noopener">${esc(o.ttn)}</a> — відстежити посилку</span>`:""}${oit(o)}</div>`).join(""):'<div class="empty">Замовлень ще немає.</div>'});
}
function bdayBlock(){
 if(!prof)return"";const bi=bdayInfo();
 const gift=bi?`<div class="bdgift">🎂 ${bi.claimed?`З днем народження! Знижка −${bi.pct}% активна до ${bi.end.toLocaleDateString("uk-UA",{timeZone:"UTC"})} включно.`:`З днем народження! Для вас знижка ${bi.pct}%.`}</div>${bi.claimed?"":bdGift()}`:"";
 if(prof.birthday){return gift+`<div class="sku">Дата народження: ${esc(new Date(prof.birthday+"T00:00:00Z").toLocaleDateString("uk-UA",{timeZone:"UTC"}))}</div>`}
 return gift+`<div class="bdl">Дата народження${bdSel("rb")}</div><button type="button" class="go" id="rbsave">Зберегти дату народження</button><div class="sku">${SHOP&&SHOP.bday_on?`У тиждень дня народження — знижка ${+SHOP.bday_percent||0}%. `:""}Дату можна вказати лише один раз.</div>`}
async function accClick(t){
 const m=(x,ok)=>{const el=$("rm");if(el){el.className="msg"+(ok?" ok":"");el.textContent=x}};
 if(t.dataset.t){tab=t.dataset.t;drawAcc();return}
 if(t.dataset.use){panel("acc",false);openCart();await applyPromo(t.dataset.use);return}
 if(t.id==="fgo"){const em=$("fe").value.trim();if(!/^\S+@\S+\.\S+$/.test(em)){m("Введіть правильний email.");return}
  t.disabled=true;const r=await sb.auth.resetPasswordForEmail(em,{redirectTo:location.origin+"/"});t.disabled=false;
  if(r.error){m(/rate|seconds|many/i.test(r.error.message)?"Забагато спроб. Спробуйте за хвилину.":"Не вдалося надіслати лист. Спробуйте пізніше або зателефонуйте нам.");return}
  m("Готово! Якщо цей email зареєстровано, ми надіслали лист із посиланням. Перевірте також «Спам».",true);return}
 if(t.id==="npgo"){const p1=$("np1").value,p2=$("np2").value;if(p1.length<6){m("Пароль має містити мінімум 6 символів.");return}if(p1!==p2){m("Паролі не збігаються.");return}
  t.disabled=true;const r=await sb.auth.updateUser({password:p1});t.disabled=false;
  if(r.error){m(/same|different/i.test(r.error.message)?"Новий пароль має відрізнятися від старого.":"Не вдалося змінити пароль. Відкрийте лист із посиланням ще раз.");return}
  RECOV=false;tab="in";drawAcc();toast("Пароль змінено ✓");return}
 if(t.id==="rgo"){
  const em=$("re").value.trim(),pw=$("rw").value;
  if(!em||pw.length<6){m("Введіть email і пароль (мінімум 6 символів).");return}
  t.disabled=true;
  if(tab==="up"){
   if(!bdVal("rb")){t.disabled=false;m("Оберіть дату народження: день, місяць і рік.");return}
   const r=await sb.auth.signUp({email:em,password:pw,options:{data:{full_name:$("rn").value.trim(),phone:$("rp").value.trim(),birthday:bdVal("rb")}}});t.disabled=false;
   if(r.error){m(r.error.message.indexOf("already")>-1?"Цей email уже зареєстровано. Увійдіть.":"Не вдалося зареєструватися: "+r.error.message);return}
   if(!r.data.session)m("Перевірте пошту й підтвердіть email, потім увійдіть.",true);
  }else{
   const r=await sb.auth.signInWithPassword({email:em,password:pw});t.disabled=false;
   if(r.error){m(r.error.message==="Invalid login credentials"?"Неправильний email або пароль.":"Помилка: "+r.error.message);return}
  }
 }
 if(t.id==="rbsave"){const v=bdVal("rb");if(!v){m("Оберіть день, місяць і рік народження.");return}t.disabled=true;const r=await sb.rpc("set_birthday",{p_date:v});t.disabled=false;if(r.error){const e=r.error.message||"";m(/set_birthday|schema cache|function|birthday/i.test(e)&&!/Невірна|Увійдіть/.test(e)?"Не вдалося зберегти дату. Спробуйте пізніше або напишіть нам.":"Не вдалося зберегти дату: "+e);return}if(r.data===false){await loadProf();m(prof&&prof.birthday?"Дата вже збережена раніше.":"Не вдалося знайти ваш профіль. Вийдіть і увійдіть знову.");return}m("Дату збережено ✓",true);setTimeout(loadProf,0);return}
 if(t.id==="rsave"){const u=await sb.from("profiles").update({full_name:$("rn").value.trim(),phone:$("rp").value.trim()}).eq("id",me.id);if(u.error){m("Не вдалося зберегти.");return}m("Збережено ✓",true);setTimeout(loadProf,0)}
 if(t.id==="rout"){await sb.auth.signOut();me=null;prof=null;promoPct=0;promoCode="";$("accL").textContent="Увійти";drawCart();drawAcc()}
}

/* ---------- чат і підвал ---------- */
function initChat(){
 const l=messengers();
 if(!l.length){$("chat").hidden=true;return}
 $("chatp").innerHTML=l.map(x=>`<a href="${esc(x[1])}" target="_blank" rel="noopener">${esc(x[0])}</a>`).join("");$("chat").hidden=false;
}
function drawFooter(){
 const s=shop(),m=messengers(),tops=kids(ROOT).slice(0,8),c=[];
 if(s.phone)c.push(`<a href="${esc(tel(s.phone))}"><b style="margin:0;font-size:17px">${esc(s.phone)}</b></a>`);
 if(s.phone2)c.push(`<a href="${esc(tel(s.phone2))}">${esc(s.phone2)}</a>`);
 if(s.email)c.push(`<a href="mailto:${esc(s.email)}">${esc(s.email)}</a>`);
 if(s.hours)c.push(`<span style="display:block;padding:3px 0">${esc(s.hours)}</span>`);
 if(s.address)c.push(`<span style="display:block;padding:3px 0">${esc(s.address)}</span>`);
 $("foot").innerHTML=`<div><img src="logo2.webp" alt="Trend Electro — Professional Electrical Solutions" width="180" height="91" loading="lazy">${esc(s.tagline||"Електротовари, LED-освітлення та електрофурнітура для дому, офісу й об’єктів.")}${m.length?`<div class="fmsg">${m.map(x=>`<a href="${esc(x[1])}" target="_blank" rel="noopener">${esc(x[0])}</a>`).join("")}</div>`:""}</div>
<div><b>Каталог</b>${tops.map(k=>`<a href="${href(k.path)}">${esc(k.name)}</a>`).join("")}</div>
<div><b>Покупцям</b><a href="#/page/delivery">Оплата і доставка</a><a href="#/page/exchange">Обмін та повернення</a><a href="#/page/coop">Співпраця та опт</a><a href="#/guide/">Поради та статті</a>${simOn()?'<a href="#/light">Підбір кольору світла</a>':""}${chkOn()?'<a href="#/check">Чек-лист для ремонту</a>':""}${frameOn()?'<a href="#/frame">Конструктор рамки</a>':""}<a href="#" data-install="1">Встановити додаток</a>${SHOP.help_on?'<a href="#/help">Помічник підбору</a>':""}<a href="#/page/privacy">Політика конфіденційності</a><a href="#/page/about">Про нас</a><a href="#/page/contacts">Контакти</a></div>
<div><b>${c.length?"Зв’язатися з нами":"Допомога"}</b>${c.join("")||`<a href="#/page/contacts">Контакти та підтримка</a>`}</div>`;
 $("fbot").textContent="© "+new Date().getFullYear()+" Trend Electro. Ціни на сайті вказані в гривнях.";
 {const n=$("dnav");if(n)n.innerHTML=`<a href="#/c/">Усі товари</a><a href="#/page/delivery">Оплата і доставка</a><a href="#/page/exchange">Обмін та повернення</a><a href="#/page/coop">Співпраця та опт</a><a href="#/guide/">Поради та статті</a><a href="#/page/about">Про нас</a><a href="#/page/contacts">Контакти</a><span class="dsp"></span>${s.hours?`<span class="dh">${esc(s.hours)}</span>`:""}${s.phone?`<a class="dph" href="${esc(tel(s.phone))}">${esc(s.phone)}</a>`:""}`}
}

/* ---------- події ---------- */
let tmr=null;const later=f=>{clearTimeout(tmr);tmr=setTimeout(f,200)};
function setFav(id){if(fav[id])delete fav[id];else fav[id]=1;SV("te_fav",fav);document.querySelectorAll(`[data-f="${CSS.escape(id)}"]`).forEach(b=>b.classList.toggle("on",!!fav[id]));drawCart();if(curH()==="#/fav")viewFav();else toast(fav[id]?"Додано в обране":"Прибрано з обраного")}
document.addEventListener("click",e=>{
 const db=e.target.closest(".dsw button");if(db){setDens(db.dataset.dn);return}
 const xb=e.target.closest("[data-xt]");if(xb){document.querySelectorAll(".stile.xt").forEach(x=>x.hidden=false);xb.remove();return}
 const yb=e.target.closest("[data-yt]");if(yb){const i=yb.dataset.yt;yb.outerHTML=`<iframe class="ytf" src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(i)}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="Відео"></iframe>`;return}
 const a=e.target.closest("a[href^='#/']");
 if(a){const h=a.getAttribute("href");if(h.indexOf("#/c/")===0&&!a.dataset.brand){F.q="";$("q").value="";SCR[h]=0}
  if(a.dataset.brand){e.preventDefault();F={brand:a.dataset.brand,min:"",max:"",sort:"def",q:"",lim:24,a:{},stock:false,fo:innerWidth>=860};CUR.key="";if(curH()==="#/c/")route();else location.hash="#/c/";return}
  if(h.indexOf("#/p/")===0)SCR[curH()]=window.scrollY;
  if(h===(curH()))route();
  return;}
 if(!e.target.closest("#chat"))$("chatp").hidden=true;if(!e.target.closest(".search"))$("sug").hidden=true;
 const t=e.target.closest("button");if(!t)return;const d=t.dataset;
 if(d.a){cart[d.a]=(cart[d.a]||0)+1;save();drawCart();toast("Додано в кошик",1);return}
 if(d.f){setFav(d.f);return}
 if(d.p){cart[d.p]++;save();drawCart();return}
 if(d.m){cart[d.m]--;if(cart[d.m]<1)delete cart[d.m];save();drawCart();return}
 if(d.q){const i=$("pq");i.value=Math.max(1,Math.min(999,(+i.value||1)+(+d.q)));return}
 if(d.sall!==undefined){goSearch();return}
 if(d.fa){const A=F.a=F.a||{},L=A[d.fa]=A[d.fa]||[],k=L.indexOf(d.v);if(k>-1)L.splice(k,1);else L.push(d.v);F.lim=24;renderGrid();return}
 if(d.fstock!==undefined){F.stock=!F.stock;F.lim=24;renderGrid();return}
 if(d.fclr!==undefined){F.a={};F.stock=false;F.lim=24;renderGrid();return}
 if(d.sb){const id=d.sb;cart[id]=(cart[id]||0)+1;save();drawCart();toast("Додано в кошик",1);return}
 if(t.id==="ftog"){F.fo=!F.fo;$("fpan").hidden=!F.fo;return}
 if(d.ph){const m=$("pmain");if(m)m.innerHTML=img(d.ph,900,900);document.querySelectorAll("#pthumbs button").forEach(b=>b.classList.toggle("on",b===t));return}
 if(d.sc){const r=$(d.sc);if(r)r.scrollBy({left:(+d.d)*r.clientWidth*.9,behavior:"smooth"});return}
 if(d.nav){const v=d.nav;if(v==="home")location.hash="#/";if(v==="cat")openCatMenu();if(v==="fav")location.hash="#/fav";if(v==="cart")openCart();if(v==="acc"){drawAcc();panel("acc",true)}return}
 if(t.id==="buy"){const n=Math.max(1,Math.min(stkMax(M[t.dataset.id]),+$("pq").value||1)),id=t.dataset.id;cart[id]=(cart[id]||0)+n;save();drawCart();toast(n>1?"Додано в кошик: "+n+" шт.":"Додано в кошик",1);return}
 if(d.pt){PTAB=d.pt;document.querySelectorAll(".tabsb button").forEach(b=>b.classList.toggle("on",b===t));const id=decodeURIComponent(curH().slice(4));if(M[id])drawDet(M[id]);return}
 if(d.b!==undefined){lastTouch=Date.now();showB(+d.b);return}
 if(d.sa){lastTouch=Date.now();showB((bix+ +d.sa+BN.length)%BN.length);return}
 if(d.ht){document.querySelectorAll(".htab").forEach(b=>b.classList.toggle("on",b.dataset.ht===d.ht));document.querySelectorAll(".hpane").forEach(x=>x.hidden=x.dataset.pane!==d.ht);return}
 if(d.tg!==undefined){const s=t.parentNode.nextElementSibling;if(s){s.classList.toggle("open");t.textContent=s.classList.contains("open")?"−":"+"}return}
 if(t.id==="more"){const from=F.lim;F.lim+=24;$("grid").insertAdjacentHTML("beforeend",CUR.list.slice(from,F.lim).map(card).join(""));moreBtn();return}
 if(t.id==="toastB"){$("toast").classList.remove("on");openCart();return}
 if(t.id==="chatb"){$("chatp").hidden=!$("chatp").hidden;return}
 if(t.id==="dclose"){panel("drawer",false);return}
 if(t.id==="catBtn"){openCatMenu();return}
 if(t.id==="favBtn"){location.hash="#/fav";return}
 if(t.id==="accBtn"){drawAcc();panel("acc",true);return}
 if(t.id==="cartBtn"){openCart();return}
 if(t.id==="close"){panel("drawer",false);return}
 if(t.id==="aclose"){panel("acc",false);return}
 if(t.id==="cclose"){panel("catm",false);return}
 if(t.id==="order"){placeOrder(t);return}
 if(t.closest("#abody")){accClick(t);return}
});
document.addEventListener("input",e=>{
 const i=e.target;
 if(i.id==="q"){const inList=curH().indexOf("#/c")===0&&$("grid");if(inList){F.q=i.value.trim();F.lim=24;later(renderGrid)}later(drawSug)}
 if(i.id==="fmin"||i.id==="fmax"){F.min=$("fmin").value;F.max=$("fmax").value;F.lim=24;later(renderGrid)}
});
document.addEventListener("change",e=>{
 const i=e.target;
 if(i.id==="fbrand"){F.brand=i.value;F.lim=24;renderGrid()}
 if(i.id==="fsort"){F.sort=i.value;F.lim=24;renderGrid()}
 if(i.id==="fpr")applyPromo(i.value);
 if(i.id==="fd")$("fc").placeholder=i.value.indexOf("кур")>-1?"Місто, вулиця, будинок, квартира":"Місто і номер відділення / поштомату";
});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeAll();if(e.key==="Enter"&&e.target.id==="q"){e.preventDefault();goSearch()}});
document.addEventListener("focusin",e=>{if(e.target.id==="q")drawSug()});
$("shade").onclick=closeAll;
window.addEventListener("hashchange",()=>{route()});

/* ---------- запуск ---------- */
async function boot(){
 $("view").innerHTML='<div class="grid sk-grid" aria-label="Завантаження">'+'<div class="card sk"><div class="pic"></div><i></i><i></i><i></i></div>'.repeat(8)+'</div>';drawCart();
 if(!window.supabase){for(const u of["https://unpkg.com/@supabase/supabase-js@2.45.4/dist/umd/supabase.js","https://cdnjs.cloudflare.com/ajax/libs/supabase-js/2.45.4/umd/supabase.min.js","https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js"]){
  await new Promise(res=>{const e=document.createElement("script");e.src=u;e.onload=e.onerror=()=>res();document.head.appendChild(e);setTimeout(res,6000)});
  if(window.supabase)break}}
 if(!(window.supabase&&window.TE&&TE.url&&TE.key)){$("view").innerHTML='<div class="empty">Каталог тимчасово недоступний.<br><br><button class="btn" onclick="location.reload()">Спробувати ще раз</button></div>';return}
 sb=supabase.createClient(TE.url,TE.key);
 sb.auth.onAuthStateChange((_e,s)=>{me=s?s.user:null;if(_e==="PASSWORD_RECOVERY"){RECOV=true;setTimeout(()=>{drawAcc();panel("acc",true)},400)}setTimeout(loadProf,0)});
 loadBanners();loadPromos();
 const pf=(async()=>{try{const g=await sb.auth.getSession();me=g.data.session?g.data.session.user:null;await loadProf()}catch(e){}})();
 try{await Promise.all([loadProducts(),loadSettings(),loadCats(),fetch(BASE+"img/map.json").then(r=>r.ok?r.json():[]).then(a=>{IMG=new Set(a)}).catch(()=>{}),fetch(BASE+"img/smap.json").then(r=>r.ok?r.json():[]).then(a=>{IMGS=new Set(a)}).catch(()=>{})]);imgMap()}catch(e){$("view").innerHTML='<div class="empty">Не вдалося завантажити каталог. Перевірте інтернет і оновіть сторінку.</div>';return}
 applyOrders();regBar();document.body.classList.toggle("fxon",!SHOP.anim_off);applyLayout();build();ALLN=[];collectN(ROOT);initChat();drawFooter();
 await pf;
 route();idxWarm();
 if(CATBG)setTimeout(catRefresh,1500);
}
function imgMap(){PALL.forEach(p=>{const k=safeId(p.id);if(IMG.has(k)&&!/^https?:\/\/(www\.)?trendelectro\.com\.ua\//i.test(p.img||""))p.img=BASE+"img/"+k+".webp"})}
/* каталог з памʼяті телефону показується одразу, а свіжі дані тихо підтягуються у фоні */
async function catRefresh(){try{const old=localStorage.getItem("te_cat")||"";const rows=await fetchProducts();if(!rows.length)return;const now=localStorage.getItem("te_cat")||"";
 const strip=x=>x.replace(/^\{"t":\d+,/,"");if(strip(old)===strip(now))return;
 mapRows(rows);imgMap();build();ALLN=[];collectN(ROOT);
 const h=curH(),ae=document.activeElement;if(ae&&/INPUT|TEXTAREA|SELECT/.test(ae.tagName))return;drawCart();
 if(/^#\/(c\/|$|search|q)/.test(h)||h===""||h==="#"){const y=scrollY;route();scrollTo(0,y)}}catch(e){}}
document.addEventListener("DOMContentLoaded",boot);

/* ---------- анімації (легкі) ---------- */
(function(){
 const RV=".card,.gcard,.sec,.perk,.box.txt,.art,.cats a,.cat",io="IntersectionObserver"in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{rootMargin:"0px 0px -6% 0px",threshold:.05}):null;
 function scan(root){if(!io)return;let i=0;const H=innerHeight*1.5,L=[];root.querySelectorAll(RV).forEach(el=>{if(el.dataset.rv||el.closest("#drawer,#acc"))return;L.push([el,el.getBoundingClientRect().top>H])});L.forEach(([el,far])=>{el.dataset.rv=1;if(far){el.classList.add("in");return}el.style.setProperty("--d",Math.min(i++,8)*45+"ms");el.classList.add("rv");io.observe(el)})}
 document.addEventListener("DOMContentLoaded",()=>{const v=document.getElementById("view");if(!v)return;let t=null;new MutationObserver(()=>{clearTimeout(t);t=setTimeout(()=>scan(v),30)}).observe(v,{childList:true,subtree:true});
  const c=document.getElementById("cnt");if(c){let last=0;new MutationObserver(()=>{const n=parseInt(c.textContent)||0;if(n>last){const b=document.getElementById("cartBtn");b.classList.remove("bump");void b.offsetWidth;b.classList.add("bump")}last=n}).observe(c,{childList:true,characterData:true,subtree:true})}});
 /* «летить у кошик» + пульс серця */
 document.addEventListener("click",e=>{
  const f=e.target.closest(".fv,.favbtn");if(f){f.classList.remove("pop");void f.offsetWidth;f.classList.add("pop")}
  const b=e.target.closest(".add,#buy,.buybtn[data-sb]");if(!b||b.disabled||!b.animate)return;
  const t=document.getElementById("cartBtn"),mob=t&&!t.offsetParent?document.querySelector('[data-nav="cart"]'):t;if(!mob||!mob.offsetParent)return;
  const a=b.getBoundingClientRect(),z=mob.getBoundingClientRect(),d=document.createElement("div");d.className="fly";
  d.style.left=a.left+a.width/2-9+"px";d.style.top=a.top+a.height/2-9+"px";document.body.appendChild(d);
  const x=z.left+z.width/2-(a.left+a.width/2),y=z.top+z.height/2-(a.top+a.height/2);
  d.animate([{transform:"translate(0,0) scale(1)",opacity:1},{transform:`translate(${x*.5}px,${y*.5-60}px) scale(.8)`,opacity:1,offset:.5},{transform:`translate(${x}px,${y}px) scale(.2)`,opacity:.4}],{duration:650,easing:"cubic-bezier(.4,0,.2,1)"}).onfinish=()=>d.remove();
 },true);
})();

/* ================= Додатково: тема, голос, PWA, калькулятор, промокод, нещодавні, поділитися ================= */
(function(){
 const D=document;
 /* --- тема --- */
 function curTheme(){return D.documentElement.dataset.theme||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light")}
 function setTheme(t){D.documentElement.dataset.theme=t;try{localStorage.setItem("te_theme",t)}catch(e){}const m=D.querySelector('meta[name="theme-color"]');if(m)m.content=t==="dark"?"#0a0c0e":"#15191c"}
 /* --- голосовий пошук --- */
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;let rec=null;
 function mic(){const b=$("micBtn");if(!SR||!b)return;if(rec){try{rec.stop()}catch(e){}return}
  rec=new SR();rec.lang="uk-UA";rec.interimResults=false;rec.maxAlternatives=1;b.classList.add("rec");
  rec.onresult=e=>{const t=(e.results[0]&&e.results[0][0]&&e.results[0][0].transcript||"").replace(/[.!?]+$/,"").trim();if(t){$("q").value=t;goSearch()}};
  rec.onerror=()=>{};rec.onend=()=>{rec=null;b.classList.remove("rec")};try{rec.start()}catch(e){rec=null;b.classList.remove("rec")}}
 /* --- нещодавно переглянуті --- */
 window.rvPush=id=>{let l=LS("te_rv",[]);l=[id].concat(l.filter(x=>x!==id)).slice(0,14);SV("te_rv",l)};
 window.rvHtml=ex=>{const l=LS("te_rv",[]).filter(i=>i!==ex&&M[i]).map(i=>M[i]).slice(0,12);return l.length?`<section class="sec"><div class="sech"><div><h2>Нещодавно переглянуті</h2></div></div>${hsc("hrv"+(ex?"p":"h"),l)}</section>`:""};
 /* --- З цим купують (за історією замовлень) --- */
 window.loadBT=async id=>{if(!sb)return;try{const r=await sb.rpc("bought_together",{p_id:id});const ids=(r.data||[]).filter(x=>M[x]&&x!==id).slice(0,10);const e=$("btog");if(!e||!ids.length||curH().indexOf("#/p/")!==0)return;e.innerHTML=`<div class="sech"><div><h2>З цим товаром купують</h2></div></div>${hsc("hbt",ids.map(x=>M[x]))}`;e.hidden=false}catch(e){}};
 /* --- поділитися статтею --- */
 window.shareBox=a=>{const u=BASE+"poradu/"+a.slug+"/",t=a.title,q=encodeURIComponent;return `<div class="box share"><b>Поділитися статтею:</b><div class="cta"><a class="btn" href="https://t.me/share/url?url=${q(u)}&text=${q(t)}" target="_blank" rel="noopener">Telegram</a><a class="btn" href="viber://forward?text=${q(t+" "+u)}">Viber</a><a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${q(u)}" target="_blank" rel="noopener">Facebook</a><button class="btn" type="button" data-copy="${esc(u)}">Копіювати посилання</button>${navigator.share?`<button class="btn" type="button" data-nshare="${esc(u)}" data-t="${esc(t)}">Ще…</button>`:""}</div></div>`};
 /* --- промокод за підписку --- */
 window.promoForm=()=>{const S=SHOP||{};if(!S.promo_on||!S.promo_code)return"";const done=LS("te_sub",null);
  return `<section class="band subs" id="subs"><div><h2>${esc(S.promo_title||"Знижка на перше замовлення")}</h2><p>${esc(S.promo_text||"Залиште email або телефон і отримайте промокод. Ми не розсилаємо спам.")}</p></div>${done?`<div class="subok"><span>Ваш промокод:</span> <b>${esc(S.promo_code)}</b> <button class="btn" type="button" data-usepromo="${esc(S.promo_code)}">Застосувати</button></div>`:`<form id="subForm" novalidate><input id="subC" type="text" inputmode="email" placeholder="Email або телефон" autocomplete="email" aria-label="Email або телефон"><label class="cons"><input type="checkbox" id="subOk"> <span>Погоджуюсь на обробку персональних даних та отримання повідомлень. Відписатись можна будь-коли.</span></label><button class="btn" type="submit" id="subBtn">Отримати промокод</button><div class="msg" id="subM"></div></form>`}</section>`};
 async function subSend(){const c=$("subC").value.trim(),m=$("subM"),S=SHOP||{};m.className="msg";
  const em=/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(c),ph=c.replace(/\D/g,"").length>=10&&/^[+\d\s()-]+$/.test(c);
  if(!em&&!ph){m.textContent="Вкажіть правильний email або телефон.";return}
  if(!$("subOk").checked){m.textContent="Потрібна згода на обробку даних.";return}
  const b=$("subBtn");b.disabled=true;const r=sb?await sb.from("leads").insert({contact:c.slice(0,200),source:"promo"}):{error:{message:"no"}};b.disabled=false;
  if(r.error){m.textContent="Не вдалося зберегти. Спробуйте пізніше або напишіть нам.";return}
  SV("te_sub",{c:1});const e=$("subs");if(e)e.outerHTML=promoForm();toast("Промокод "+S.promo_code+" збережено")}
 /* --- підгонка тексту плиток: максимум 2 рядки, без переносів --- */
 function fit(root){(root||D).querySelectorAll(".ctile b,.stile b,.hcats b").forEach(el=>{el.style.fontSize="";const cs=getComputedStyle(el);let fs=parseFloat(cs.fontSize);const lh=parseFloat(cs.lineHeight)||fs*1.25,ratio=lh/fs;let g=0;
   while(g++<30&&fs>9&&(el.scrollHeight>fs*ratio*2+2||el.scrollWidth>el.clientWidth+1)){fs-=.5;el.style.fontSize=fs+"px";el.style.lineHeight=ratio}})}
 let ft=null;const later=()=>{clearTimeout(ft);ft=setTimeout(()=>fit(),60)};
 D.addEventListener("DOMContentLoaded",()=>{
  const v=$("view");if(v)new MutationObserver(later).observe(v,{childList:true,subtree:true});addEventListener("resize",later);
  if(SR&&$("micBtn")&&!SHOP.mic_off)$("micBtn").hidden=false;
  if(D.fonts&&D.fonts.ready)D.fonts.ready.then(later)});
 /* --- події --- */
 let dip=null;addEventListener("beforeinstallprompt",e=>{e.preventDefault();dip=e;INSTEV=e;instSoon()});
 D.addEventListener("click",e=>{const t=e.target;let x;
  if(t.closest("#thBtn")){setTheme(curTheme()==="dark"?"light":"dark");return}
  if(t.closest("#micBtn")){mic();return}
  if(x=t.closest("[data-install]")){e.preventDefault();if(dip){dip.prompt();dip=null}else if(IOS&&!STANDALONE)instIos();else toast("На iPhone: «Поділитися» → «На початковий екран». На Android: меню ⋮ → «Встановити додаток».");return}
  if(x=t.closest("[data-copy]")){const u=x.dataset.copy;(navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).then(()=>toast("Посилання скопійовано"),()=>toast(u));return}
  if(x=t.closest("[data-nshare]")){navigator.share({title:x.dataset.t,url:x.dataset.nshare}).catch(()=>{});return}
  if(x=t.closest("[data-bdact]")){bdAct(x);return}
  if(x=t.closest("[data-bduse]")){openCart();applyPromo(x.dataset.bduse);return}
  if(x=t.closest("[data-bdcp]")){const u=x.dataset.bdcp;(navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).then(()=>toast("Код скопійовано"),()=>toast(u));return}
  if(x=t.closest("[data-usepromo]")){openCart();applyPromo(x.dataset.usepromo);return}
 });
 D.addEventListener("change",e=>{const w=e.target.closest&&e.target.closest(".bdsel");if(w)bdFix(w)});
 D.addEventListener("submit",e=>{if(e.target.id==="subForm"){e.preventDefault();subSend()}
  if(e.target.id==="bdForm"){e.preventDefault();bdSend()}});
 async function bdSend(){const m=$("bdm"),b=$("bdgo");m.className="msg";if(!bdVal("bdd")){m.textContent="Оберіть день, місяць і рік народження.";return}if(!$("bdk").checked){m.textContent="Потрібна згода на обробку даних.";return}if(!sb){m.textContent="Тимчасово недоступно.";return}
  b.disabled=true;const r=await sb.rpc("claim_birthday_gift",{p_name:$("bdn").value.trim(),p_contact:$("bdc").value.trim(),p_birthday:bdVal("bdd"),p_consent:true});b.disabled=false;
  if(r.error){m.textContent=/email|телефон/i.test(r.error.message)?"Перевірте телефон або email.":/дат/i.test(r.error.message)?"Перевірте дату народження.":"Не вдалося. Спробуйте пізніше.";return}
  m.textContent="";bdResult(r.data,Math.min(90,+SHOP.bday_percent||0))}
 addEventListener("load",()=>{if("serviceWorker"in navigator&&location.protocol==="https:")navigator.serviceWorker.register(BASE+"sw.js").catch(()=>{})});
})();
/* ---------- лендінги ---------- */
let LND={},LWIN={},LTM=null,LFXR=0,LIO=null,LIO2=null,LCART={},LCUR="";
const lStop=()=>{clearInterval(LTM);LTM=null;cancelAnimationFrame(LFXR);LFXR=0;if(LIO){LIO.disconnect();LIO=null}if(LIO2){LIO2.disconnect();LIO2=null}document.body.classList.remove("lndon")};
const lLines=t=>String(t||"").split("\n").map(s=>s.trim()).filter(Boolean).map(s=>s.split("|").map(x=>x.trim()));
const lPara=t=>String(t||"").split(/\n+/).map(s=>s.trim()).filter(Boolean).map(s=>"<p>"+esc(s)+"</p>").join("");
const lWin=L=>{const t=L.theme||{};return(+t.win>0&&+t.disc>0)?(LWIN[L.slug]||{code:null,end:0,pct:0}):null};
const lDisc=L=>{const t=L.theme||{},w=lWin(L);if(w)return w.code&&w.end>Date.now()?Math.min(90,Math.max(0,w.pct)):0;const e=Date.parse(t.ends||"");if(e&&e<Date.now())return 0;return Math.min(90,Math.max(0,+t.disc||0))};
const lVisitor=()=>{let v=LS("te_vid",null);if(!v||String(v).length<8){v=(crypto.randomUUID?crypto.randomUUID():String(Math.random()).slice(2)+Date.now().toString(36)).replace(/-/g,"");SV("te_vid",v)}return v};
const lWhen=t=>{const d=new Date(t),n=new Date(),hm=d.toLocaleTimeString("uk-UA",{hour:"2-digit",minute:"2-digit"}),k=Math.round((new Date(d.getFullYear(),d.getMonth(),d.getDate())-new Date(n.getFullYear(),n.getMonth(),n.getDate()))/864e5);return(k===0?"сьогодні":k===1?"завтра":d.toLocaleDateString("uk-UA",{day:"2-digit",month:"2-digit"}))+" о "+hm};
const lEnd=L=>{const w=lWin(L);if(w)return w.code&&w.end>Date.now()?w.end:0;const t=L.theme||{},e=Date.parse(t.ends||"");return e&&e>Date.now()?e:0};
const lGone=L=>{const t=L.theme||{};if(!(+t.disc>0))return false;const w=lWin(L);if(w)return !!LWIN[L.slug]&&lDisc(L)===0;const e=Date.parse(t.ends||"");return !!e&&e<Date.now()};
const lSub=(h,L)=>{const d=lDisc(L),e=lEnd(L);return h.split("{знижка}").join(d?"−"+d+"%":"").split("{до}").join(e?lWhen(e):"")};
let LHAD={},LNOD={},LRR={},LLIVE=null;
const lLive=async()=>{if(LLIVE)return LLIVE;try{const r=await sb.rpc("landing_live");LLIVE=Array.isArray(r.data)?r.data:[]}catch(e){LLIVE=[]}return LLIVE};
const lEndBox=(slug,live,gone)=>`<section class="lsec lendbox"><h2>${gone?"Ця акція завершилась":"Знижка на цій сторінці завершилась"}</h2><p>${gone?"Дякуємо, що завітали. Ціни на сайті — звичайні, каталог працює як завжди.":"Ціни нижче — як у каталозі сайту."}</p>${live.filter(x=>x.slug!==slug).length?`<div class="lel"><b>Діють зараз:</b>${live.filter(x=>x.slug!==slug).map(x=>`<a class="lbtn lsm" href="#/l/${encodeURIComponent(x.slug)}">${esc(x.title)}</a>`).join("")}</div>`:""}<form class="lnf" data-lnf="${esc(slug)}" novalidate><label>Повідомимо про наступну акцію:</label><input type="text" inputmode="email" placeholder="Email або телефон" aria-label="Email або телефон"><label class="cons"><input type="checkbox"> <span>Погоджуюсь на обробку персональних даних та отримання повідомлень. Відписатись можна будь-коли.</span></label><button class="lbtn lsm" type="submit">Повідомити мене</button><div class="lmsg"></div></form><a class="lbtn lsm lcat" href="${esc(BASE)}">Перейти до каталогу →</a></section>`;
const lCode=L=>{const w=lWin(L);return w&&w.code?w.code:"LND-"+String(L.slug).toUpperCase()};
const lCur=()=>LND[LCUR]||{theme:{},blocks:[]};
function lProds(b){const out=[],seen={};String(b.ids||"").split(/[\s,;]+/).filter(Boolean).forEach(i=>{const p=M[i];if(p&&!seen[i]){seen[i]=1;out.push(p)}});
 if(b.cat){const c=String(b.cat);P.forEach(p=>{if(!seen[p.id]&&p.c.join(SEP).indexOf(c)===0){seen[p.id]=1;out.push(p)}})}
 return out.filter(p=>p.st).concat(out.filter(p=>!p.st)).slice(0,+b.n||12)}
function lAll(L){const s={},o=[];(L.blocks||[]).forEach(b=>{if(!b.off&&(b.t==="products"||b.t==="compare"))lProds(b).forEach(p=>{if(!s[p.id]&&p.st){s[p.id]=1;o.push(p)}})});return o}
function lPr(p,L){LAPPLY=0;const b=price(p);LAPPLY=lDisc(L);const l=priceInfo(p).pc;LAPPLY=0;const s=Math.max(b,l),sv=Math.round((s-l)*100)/100;return{s,l,save:sv,pct:s>0?Math.round(sv/s*100):0}}
const lSite=id=>BASE+"#/p/"+encodeURIComponent(id);
function lCtl(p){const q=LCART[p.id]||0;return q?`<div class="lqty"><button data-lq="${esc(p.id)}" data-d="-1" aria-label="Менше">−</button><b>${q}</b><button data-lq="${esc(p.id)}" data-d="1" aria-label="Більше">+</button></div>`:`<button class="lbtn lsm" data-lq="${esc(p.id)}" data-d="1">Додати</button>`}
/* велика вітрина одного товару: фото, ціна, кількість і кнопка замовлення прямо тут */
async function pLoad(p){if(!p||p.d!==null||!sb)return;try{let r=await sb.from("products").select("description,specs,images").eq("id",p.id).maybeSingle();if(r.error)r=await sb.from("products").select("description,specs").eq("id",p.id).maybeSingle();p.d=(r.data&&r.data.description)||"";p.sp=(r.data&&r.data.specs)||"";p.ims=(r.data&&Array.isArray(r.data.images)?r.data.images:[]).filter(Boolean)}catch(e){p.d="";p.sp=""}}
const lPerks=[["truck","Доставка по Україні","Нова пошта, відправка після підтвердження замовлення"],["wallet","Оплата при отриманні","або карткою на сайті, як вам зручніше"],["swap","Обмін та повернення","за законом України"],["shield","Підтвердимо замовлення","менеджер зателефонує й уточнить усі деталі"]];
const lTiles=e=>`<div class="ltim lxt" data-until="${e}"><div><b>0</b><span>днів</span></div><div><b>0</b><span>годин</span></div><div><b>0</b><span>хвилин</span></div><div><b>0</b><span>секунд</span></div></div>`;
function lSimple(L){
 const th=L.theme||{},b=(L.blocks||[]).find(x=>x.t==="products")||{},all=lProds(b),d=lDisc(L),e=lEnd(L);
 if(!all.length)return'<section class="lsec"><div class="ltxt"><p>Скоро тут з’являться товари акції.</p></div></section>';
 const one=all.length===1,p=all[0],pr=lPr(p,L),rows=one?specRows(p.sp):[],ttl=b.title&&(!one||b.title!==p.n)?b.title:"";
 const sale=pr.save>0,price=one?`<div class="lxpr">${sale?`<div class="lxw"><small>Було</small><s class="lxo">${money(pr.s)}</s></div>`:""}<div class="lxw"><small>${sale?"Тепер":"Ціна"}</small><b class="lxn">${money(pr.l)}</b></div>${sale?`<span class="lxp">−${pr.pct}%</span>`:""}</div>${sale?`<div class="lxsv">Ви економите ${money(pr.save)}</div>`:""}`:"";
 const cta=`<div class="lxcta"><button class="lbtn lxbtn" data-lgo="${one?"order":"prods"}">${one?(sale?"Замовити зі знижкою":"Замовити"):"Обрати товар"}</button>${one?`<a class="lxlnk" href="${esc(lSite(p.id))}" target="_blank" rel="noopener">${sale?"Перевірити ціну на сайті ↗":"Дивитись на сайті ↗"}</a>`:""}</div>`;
 const ims=one?[p.img].concat(p.ims||[]).filter(Boolean):[];
 const right=one?`<div class="lxim"><div class="lxpic" id="pmain">${img(p.img,900,900,p.n)}</div>${sale?`<span class="lxbadge">−${pr.pct}%</span>`:""}${ims.length>1?`<div class="thumbs" id="pthumbs">${ims.slice(0,6).map((u,i)=>`<button data-ph="${esc(u)}" class="${i?"":"on"}" aria-label="Фото ${i+1}">${img(u,120,120)}</button>`).join("")}</div>`:""}</div>`:"";
 const hero=`<section class="lsec lxh${one?"":" lxh1"}${th.bg?" lxbg":""}"${th.bg?` style="background-image:linear-gradient(rgba(5,15,20,.45),rgba(5,15,20,.45)),url('${esc(th.bg)}')"`:""}><div class="lxl">${ttl?`<span class="lxk">${esc(ttl)}</span>`:""}${one&&p.b?`<span class="lxk lxk2">${esc(p.b)}</span>`:""}<h1>${esc(one?p.n:(b.title||L.title||"Акція"))}</h1>${b.sub?`<p class="lxsub">${esc(b.sub)}</p>`:""}
  ${one&&rows.length?`<ul class="lxb">${rows.slice(0,4).map(r=>`<li><span>${esc(r[0])}</span> <b>${esc(r[1])}</b></li>`).join("")}</ul>`:""}
  ${price}${e?`<div class="lxtl">До кінця акції:</div>${lTiles(e)}`:""}${cta}${one?`<div class="lxst">${p.st?"✓ В наявності":"Немає в наявності"} · Арт. ${esc(p.id)}</div>`:""}</div>${right}</section>`;
 const grid=one?"":`<section class="lsec" id="lprods"><h2>Товари акції</h2><div class="grid lg">${all.map(x=>lCard(x,L)).join("")}</div></section>`;
 const perks=`<section class="lsec lxpk">${lPerks.map(x=>`<div>${ico(x[0])}<b>${x[1]}</b><span>${x[2]}</span></div>`).join("")}</section>`;
 const spec=rows.length>4?`<section class="lsec"><h2>Характеристики</h2><div class="lxg">${rows.slice(0,14).map(r=>`<div><span>${esc(r[0])}</span><b>${esc(r[1])}</b></div>`).join("")}</div></section>`:"";
 const dd=one&&p.d?String(p.d).trim():"",desc=dd?`<section class="lsec"><h2>Про товар</h2><div class="ltxt">${dd.slice(0,700).split(/\n+/).map(x=>`<p>${esc(x)}</p>`).join("")}${dd.length>700?`<details><summary>Читати повністю</summary>${dd.slice(700).split(/\n+/).map(x=>`<p>${esc(x)}</p>`).join("")}</details>`:""}</div></section>`:"";
 const steps=`<section class="lsec"><h2>Як замовити</h2><ol class="lstp lxs"><li><b>Оберіть кількість</b><p>Натисніть «Замовити» і виберіть, скільки потрібно</p></li><li><b>Залиште контакти</b><p>Ім’я та телефон, більше нічого не потрібно</p></li><li><b>Отримайте замовлення</b><p>Менеджер зателефонує, підтвердить і відправить Новою поштою</p></li></ol></section>`;
 const faq=LB.faq({items:"Як сплатити? | Оплата при отриманні в Новій пошті або на рахунок. Менеджер підкаже зручний варіант під час дзвінка.\nЯк швидко відправите? | Після підтвердження замовлення менеджером. Терміни доставки залежать від Нової пошти.\nЧи можна повернути? | Так, обмін і повернення діють за законом України. Деталі — на сторінці «Обмін та повернення»."},L);
 return hero+grid+perks+spec+desc+steps+LB.order({title:"Оформити замовлення"},L)+faq}
function lShow(p,L,b){const pr=lPr(p,L),d=lDisc(L),t=b.title&&b.title!==p.n?b.title:"";
 return`<section class="lsec lshow" id="lprods"><div class="lshc" data-id="${esc(p.id)}"><div class="lci lshi">${d?`<span class="lsave">−${d}%</span>`:""}${p.hit?'<span class="lbd">Хіт</span>':p.nw?'<span class="lbd n">Новинка</span>':""}${img(p.img,800,800,p.n)}</div><div class="lshb">${t?`<div class="lshk">${esc(t)}</div>`:""}<h1 class="lh1">${esc(p.n)}</h1>${b.sub?`<p class="lsub">${esc(b.sub)}</p>`:""}<div class="sku">Арт. ${esc(p.id)} · ${p.st?'<span class="stock">В наявності</span>':'<span class="stock no">Немає в наявності</span>'}</div>
 ${d&&pr.save>0?`<div class="lpr lprb"><span class="lold">На сайті: <s>${money(pr.s)}</s></span><b>${money(pr.l)}</b><em>Ви економите ${money(pr.save)}</em></div>`:`<div class="lpr lprb"><b>${money(pr.l)}</b></div>`}
 <a class="lchk" href="${esc(lSite(p.id))}" target="_blank" rel="noopener">${d?"Перевірити ціну на сайті ↗":"Дивитись на сайті ↗"}</a>
 ${p.st&&!SHOP.orders_off?`<div class="lshq"><span>Кількість:</span><div class="lctl">${lCtl(p)}</div></div><button class="lbtn lshbtn" data-lgo="order">Замовити${d?" зі знижкою":""}</button>`:""}</div></div></section>`}
function lCard(p,L){const pr=lPr(p,L),d=pr.pct;
 return`<article class="lcard" data-id="${esc(p.id)}"><div class="lci">${d?`<span class="lsave">−${d}%</span>`:""}${p.hit?'<span class="lbd">Хіт</span>':p.nw?'<span class="lbd n">Новинка</span>':""}${img(p.img,400,400,p.n)}</div><div class="lcb"><h3>${esc(p.n)}</h3><div class="sku">Арт. ${esc(p.id)}</div>${pr.save>0?`<div class="lpr"><div class="lprow"><div class="lxw"><small>Було</small><s class="lxo">${money(pr.s)}</s></div><div class="lxw"><small>Тепер</small><b>${money(pr.l)}</b></div></div><em>Економія ${money(pr.save)}</em></div><a class="lchk" href="${esc(lSite(p.id))}" target="_blank" rel="noopener">Перевірити ціну на сайті ↗</a>`:`<div class="lpr"><b>${money(pr.l)}</b></div><a class="lchk" href="${esc(lSite(p.id))}" target="_blank" rel="noopener">Дивитись на сайті ↗</a>`}<div class="lctl">${p.st&&!SHOP.orders_off?lCtl(p):`<span class="stock no">${p.st?"Замовлення призупинені":"Немає в наявності"}</span>`}</div></div></article>`}
function lVid(u){u=String(u||"");let m=u.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);if(m)return`<button class="yt" data-yt="${esc(m[1])}" aria-label="Відтворити відео" style="background-image:url('https://i.ytimg.com/vi/${esc(m[1])}/hqdefault.jpg')">▶</button>`;
 m=u.match(/tiktok\.com\/.*video\/(\d+)/);if(m)return`<iframe class="ltt" loading="lazy" src="https://www.tiktok.com/embed/v2/${m[1]}" allowfullscreen title="Відео TikTok"></iframe>`;return""}
const lH=(b,d)=>b.title||d?`<h2>${esc(b.title||d)}</h2>`:"";
const LB={
 hero:(b,L)=>`<section class="lhero${b.img?" wimg":""}">${b.img?`<div class="lhbg" style="background-image:url('${esc(b.img)}')"></div>`:""}<canvas class="lfx"></canvas>${L.theme&&L.theme.lights?'<div class="llights">'+Array.from({length:18},(_,i)=>`<i style="--d:${(i%6)*.25}s"></i>`).join("")+"</div>":""}<div class="lhin">${b.badge?`<span class="lbadge">${esc(b.badge)}</span>`:(lDisc(L)?`<span class="lbadge">−${lDisc(L)}% тільки на цій сторінці</span>`:"")}<h1>${esc(b.title||L.title)}</h1>${b.sub?`<p>${esc(b.sub)}</p>`:""}${b.btn?`<button class="lbtn" data-lgo="order">${esc(b.btn)}</button>`:""}</div></section>`,
 products:(b,L)=>{const l=lProds(b),sm=L&&L.theme&&L.theme.simple;if(!l.length)return"";if(sm&&l.length===1)return lShow(l[0],L,b);
  return`<section class="lsec" id="lprods">${sm?`<h1 class="lh1">${esc(b.title||"Акція")}</h1>${b.sub?`<p class="lsub">${esc(b.sub)}</p>`:""}`:lH(b,"Товари")}<div class="grid lg">${l.map(p=>lCard(p,L)).join("")}</div></section>`},
 compare:(b,L)=>{const d=lDisc(L),l=lProds(b).filter(p=>p.st).slice(0,8);if(!d||!l.length)return"";const rows=l.map(p=>({p,r:lPr(p,L)})).filter(x=>x.r.save>0);if(!rows.length)return"";const sum=rows.reduce((s,x)=>s+x.r.save,0);
  return`<section class="lsec">${lH(b,"Порівняйте ціни")}<div class="lcmp"><div class="lch"><span>Товар</span><span>На сайті</span><span class="g">За цим посиланням</span></div>${rows.map(x=>`<div class="lcr"><span>${esc(x.p.n)}</span><span><s>${money(x.r.s)}</s></span><span class="g"><b>${money(x.r.l)}</b></span></div>`).join("")}</div><p class="lsub">Ціни на сайті зараз звичайні. Вигода −${d}% діє тільки для замовлень із цієї сторінки. Якщо взяти все: економія до ${money(Math.round(sum*100)/100)}.</p></section>`},
 benefits:b=>{const l=lLines(b.items);return l.length?`<section class="lsec">${lH(b)}<div class="lben">${l.map(x=>`<div><span>${esc(x.length>2?x[0]:"✔")}</span><b>${esc(x.length>2?x[1]:x[0])}</b>${(x.length>2?x[2]:x[1])?`<p>${esc(x.length>2?x[2]:x[1])}</p>`:""}</div>`).join("")}</div></section>`:""},

 bundle:(b,L)=>{const l=lProds(b).filter(p=>p.st).slice(0,5);if(l.length<2||SHOP.orders_off)return"";const rs=l.map(p=>lPr(p,L)),s=rs.reduce((x,r)=>x+r.s,0),t=rs.reduce((x,r)=>x+r.l,0),sv=Math.round((s-t)*100)/100;
  return`<section class="lsec lbun">${lH(b,"Набір: усе потрібне разом")}<div class="lbi">${l.map((p,i)=>`${i?'<span class="lpl">+</span>':""}<div class="lbp">${img(p.img,200,200,p.n)}<span>${esc(p.n)}</span></div>`).join("")}</div><div class="lbs">${sv>0?`<span class="lold">На сайті разом: <s>${money(s)}</s></span>`:""}<b>${money(t)}</b>${sv>0?`<em>Економія ${money(sv)}</em>`:""}</div><button class="lbtn" data-lbun="${esc(l.map(p=>p.id).join(","))}">${esc(b.btn||"Додати весь набір")}</button></section>`},

 calc:(b,L)=>lCalcHtml(b.kind||"garland",b),
 timer:(b,L)=>{const w=L&&lWin(L),t=w?(w.code&&w.end>Date.now()?w.end:0):Date.parse(b.until||((L&&L.theme)||{}).ends||"");if(!t||t<Date.now())return"";return`<section class="lsec ltim" data-until="${t}">${lH(b,"До кінця акції")}<div class="ltd"><div><b>0</b><span>днів</span></div><div><b>0</b><span>годин</span></div><div><b>0</b><span>хвилин</span></div><div><b>0</b><span>секунд</span></div></div></section>`},
 video:b=>{const v=lVid(b.url);return v?`<section class="lsec">${lH(b)}<div class="lvid">${v}</div></section>`:""},
 text:b=>b.text||b.title?`<section class="lsec">${lH(b)}<div class="ltxt">${lPara(b.text)}</div></section>`:"",
 gallery:b=>{const l=String(b.imgs||"").split(/\s+/).filter(x=>/^https?:\/\//.test(x));return l.length?`<section class="lsec">${lH(b)}<div class="lgal">${l.map(u=>img(u,600,600,b.title||"")).join("")}</div></section>`:""},
 steps:b=>{const l=lLines(b.items);return l.length?`<section class="lsec">${lH(b,"Як замовити")}<ol class="lstp">${l.map(x=>`<li><b>${esc(x[0])}</b>${x[1]?`<p>${esc(x[1])}</p>`:""}</li>`).join("")}</ol></section>`:""},
 faq:b=>{const l=lLines(b.items);return l.length?`<section class="lsec">${lH(b,"Питання та відповіді")}<div class="lfaq">${l.map(x=>`<details><summary>${esc(x[0])}</summary><p>${esc(x[1]||"")}</p></details>`).join("")}</div></section>`:""},
 delivery:b=>`<section class="lsec">${lH(b,"Доставка та оплата")}<div class="ltxt">${lPara(b.text||"Відправляємо Новою поштою по всій Україні.\nОплата при отриманні або на рахунок.\nПеред відправкою менеджер телефонує й підтверджує замовлення.")}</div></section>`,
 order:(b,L)=>{
  if(SHOP.orders_off)return`<section class="lsec lord" id="lorder">${lH(b,"Замовити")}<div class="ltxt"><p>${esc(ordMsg())}</p></div>${LB.contacts({},L,1)}</section>`;
  const own=b.ids||b.cat?lProds(b).filter(p=>p.st):[];
  return`<section class="lsec lord" id="lorder">${lH(b,"Ваше замовлення")}${b.sub?`<p class="lsub">${esc(b.sub)}</p>`:""}${own.length?`<div class="grid lg">${own.map(p=>lCard(p,L)).join("")}</div>`:""}<div class="lform"><div class="lsum"></div><label>Ім’я<input class="lfn" autocomplete="name" placeholder="Ваше ім’я"></label><label>Телефон<input class="lfph" type="tel" autocomplete="tel" inputmode="tel" placeholder="067 123 45 67"></label><button class="lbtn" data-lord="1">${esc(b.btn||"Оформити замовлення")}</button><div class="lmsg"></div><p class="lnote">${lDisc(L)?"Ціни вже зі знижкою −"+lDisc(L)+"% від цін на сайті. ":""}Менеджер зателефонує, підтвердить замовлення й уточнить доставку.</p></div></section>`},
 contacts:(b,L,inner)=>{const s=shop(),a=[];if(s.phone)a.push(`<a class="lc" href="${esc(tel(s.phone))}" data-lclk="1">📞 Зателефонувати</a>`);if(s.viber)a.push(`<a class="lc" href="viber://chat?number=${encodeURIComponent("+"+String(s.viber).replace(/\D/g,""))}" data-lclk="1">Viber</a>`);if(s.telegram)a.push(`<a class="lc" href="https://t.me/${esc(String(s.telegram).replace(/^@/,"").replace(/^https?:\/\/t\.me\//,""))}" target="_blank" rel="noopener" data-lclk="1">Telegram</a>`);if(s.whatsapp)a.push(`<a class="lc" href="https://wa.me/${String(s.whatsapp).replace(/\D/g,"")}" target="_blank" rel="noopener" data-lclk="1">WhatsApp</a>`);if(!a.length)return"";const h=`<div class="lcs">${a.join("")}</div>`;return inner?h:`<section class="lsec">${lH(b,"Є питання? Напишіть нам")}${h}</section>`},
 cta:b=>`<section class="lsec lcta">${lH(b)}${b.sub?`<p>${esc(b.sub)}</p>`:""}<button class="lbtn" data-lgo="order">${esc(b.btn||"Замовити зараз")}</button></section>`
};
function lTick(){document.querySelectorAll(".lcd").forEach(s=>{const d=Math.max(0,+s.dataset.until-Date.now());if(!d)return;const sp=s.closest(".lstrip");if(sp)sp.classList.toggle("lurg",d<36e5);s.textContent=Math.floor(d/36e5)+":"+String(Math.floor(d/6e4)%60).padStart(2,"0")+":"+String(Math.floor(d/1e3)%60).padStart(2,"0")});
 const L0=lCur();if(L0&&lGone(L0)&&LHAD[LCUR]&&!document.querySelector(".lendbox,.lend")&&!LRR[LCUR]){LRR[LCUR]=1;viewLanding(LCUR);return}
 document.querySelectorAll(".ltim").forEach(s=>{let d=Math.max(0,+s.dataset.until-Date.now());if(!d){s.remove();return}const v=[Math.floor(d/864e5),Math.floor(d/36e5)%24,Math.floor(d/6e4)%60,Math.floor(d/1e3)%60];s.querySelectorAll("b").forEach((x,i)=>x.textContent=v[i])})}
function lFx(kind){const c=document.querySelector(".lfx");if(!c||!kind||kind==="none"||matchMedia("(prefers-reduced-motion:reduce)").matches)return;
 const x=c.getContext("2d"),r=devicePixelRatio||1;let W,H,F=[];const sz=()=>{W=c.offsetWidth;H=c.offsetHeight;c.width=W*r;c.height=H*r;x.setTransform(r,0,0,r,0,0)};sz();
 const cols=kind==="sparks"?["#ffd54a","#ff6b6b","#0ABAB5","#fff"]:["#fff"];
 for(let i=0;i<(kind==="snow"?70:45);i++)F.push({x:Math.random()*W,y:Math.random()*H,r:kind==="snow"?1+Math.random()*2.6:1+Math.random()*1.8,s:.3+Math.random()*.9,w:Math.random()*6.28,c:cols[i%cols.length]});
 const st=()=>{if(!c.isConnected)return;if(c.offsetWidth!==W)sz();x.clearRect(0,0,W,H);F.forEach(f=>{f.w+=.02;if(kind==="snow"){f.y+=f.s;f.x+=Math.sin(f.w)*.4;if(f.y>H+4){f.y=-4;f.x=Math.random()*W}x.globalAlpha=.85}else{x.globalAlpha=.35+.65*Math.abs(Math.sin(f.w*2))}x.fillStyle=f.c;x.beginPath();x.arc(f.x,f.y,f.r,0,6.28);x.fill()});LFXR=requestAnimationFrame(st)};st()}

let LPX={};
function lPix(L){const x=(L.theme||{}).px||{};if(!x.on)return;const ck=LS("te_ck",null);if(ck===1){lPixRun(L);return}if(ck===0)return;if($("ckb"))return;const b=document.createElement("div");b.id="ckb";b.className="ckb";b.innerHTML='<span>Ми використовуємо файли cookie та рекламні пікселі, щоб вимірювати ефективність реклами. Ви можете відмовитись.</span><button data-ckok="1">Згоден</button><button data-ckno="1" class="sec">Відмовитись</button>';document.body.appendChild(b)}
function lPixRun(L){const x=(L.theme||{}).px||{};if(!x.on)return;const k=LCUR;if(LPX[k])return;LPX[k]=1;
 const fb=String(x.fb||"").trim(),tt=String(x.tt||"").trim(),ga=String(x.ga||"").trim();
 if(/^\d{8,20}$/.test(fb)&&!window.fbq){!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");fbq("init",fb);fbq("track","PageView")}
 if(/^[A-Za-z0-9]{10,30}$/.test(tt)&&!window.ttq){!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.load=function(e){var n="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._t=ttq._t||{};ttq._t[e]=+new Date;var o=d.createElement("script");o.type="text/javascript";o.async=!0;o.src=n+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load(tt);ttq.page()}(window,document,"ttq")}
 if(/^(G|AW)-[A-Za-z0-9-]{4,20}$/.test(ga)&&!window.gtag){window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};const s=document.createElement("script");s.async=1;s.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(ga);document.head.appendChild(s);gtag("js",new Date);gtag("config",ga)}}
function lEv(k,val){try{const L=lCur();if(!((L.theme||{}).px||{}).on)return;
 if(window.fbq)fbq("track",k==="add"?"AddToCart":"Lead",val?{value:val,currency:"UAH"}:{});
 if(window.ttq)ttq.track(k==="add"?"AddToCart":"PlaceAnOrder",val?{value:val,currency:"UAH"}:{});
 if(window.gtag)gtag("event",k==="add"?"add_to_cart":"generate_lead",val?{value:val,currency:"UAH"}:{})}catch(e){}}

/* ---------- калькулятори (лендінги та сторінка «Помічник підбору») ---------- */
const CN={garland:"Гірлянда: скільки потрібно",light:"Освітлення: лампи, світильники, трек, стрічка",strip:"LED-стрічка і блок живлення",furn:"Розетки, вимикачі, прохідні й перехресні",cable:"Кабель і автомат за потужністю",panel:"Щиток: автомати, захист від ураження струмом, реле, таймери"};
const cSel=(n,l,o,d)=>`<label>${l}<select data-cin="${n}">${o.map(x=>`<option value="${x[0]}"${String(x[0])===String(d)?" selected":""}>${x[1]}</option>`).join("")}</select></label>`;
const cNum=(n,l,d,mn,st)=>`<label>${l}<input data-cin="${n}" type="number" min="${mn}" step="${st||1}" value="${d}" inputmode="decimal"></label>`;
const cRooms=[[150,"Спальня"],[150,"Вітальня"],[200,"Кухня"],[200,"Дитяча"],[100,"Коридор, хол"],[200,"Ванна, санвузол"],[300,"Кабінет, робоче місце"],[100,"Гараж, комора"]];
const PSU=[12,15,18,24,30,36,40,50,60,75,100,120,150,200,240,300,350,400,500,600,800,1000];
const BRK=[6,10,16,20,25,32,40,50,63,80,100];
const CALC={
 garland:{f:()=>cSel("mode","Що прикрашаєте",[["tree","Ялинку"],["line","Вікно, дім, огорожу (за контуром)"]],"tree")+`<span class="c-tree">${cNum("h","Висота ялинки, м",2,.3,.1)}</span><span class="c-tree">${cSel("d","Густота гілок",[[6,"Рідка"],[9,"Звичайна"],[12,"Пишна"]],9)}</span><span class="c-line" hidden>${cNum("len","Довжина контуру, м",10,1,.5)}</span>`,
  run:(g,gs,s)=>{const m=gs("mode");s.querySelectorAll(".c-tree").forEach(e=>e.hidden=m!=="tree");s.querySelectorAll(".c-line").forEach(e=>e.hidden=m==="tree");const L=Math.ceil((m==="tree"?g("h")*g("d"):g("len"))*1.1),per=+s.dataset.per||0;let q=0,h=`Потрібно приблизно <b>${L} м</b> гірлянди (із запасом 10%).`;if(per>0&&s.dataset.pid){q=Math.ceil(L/per);h+=` Це <b>${q} шт.</b> по ${nf(per)} м.`}return{h,q}}},
 light:{f:()=>cSel("room","Кімната",cRooms,150)+cNum("area","Площа, м²",18,1,.5)+cSel("src","Чим світите",[["lamp","Лампи"],["fix","Світильники, панелі"],["track","Трекові світильники"],["strip","LED-стрічка"]],"lamp")+`<span class="c-nostrip">${cNum("w","Потужність однієї лампи / світильника, Вт",9,1)}</span><span class="c-strip" hidden>${cSel("wm","Потужність стрічки, Вт на метр",[[4.8,"4,8 Вт/м (слабка, підсвітка)"],[9.6,"9,6 Вт/м (звичайна)"],[14.4,"14,4 Вт/м (яскрава)"],[19.2,"19,2 Вт/м (дуже яскрава)"]],9.6)}${cSel("v","Напруга стрічки",[[12,"12 В"],[24,"24 В"]],12)}</span>`,
  run:(g,gs,s)=>{const src=gs("src"),st=src==="strip";s.querySelectorAll(".c-strip").forEach(e=>e.hidden=!st);s.querySelectorAll(".c-nostrip").forEach(e=>e.hidden=st);
   const lux=g("room"),A=g("area"),lm=Math.round(lux*A),eff={lamp:80,fix:90,track:80,strip:80}[src],W=Math.ceil(lm/eff);
   let h=`Потрібен світловий потік <b>${lm} лм</b> (люменів; ${lux} лм на 1 м²). Загальна потужність приблизно <b>${W} Вт</b>.`;
   if(!st){const w=g("w")||9,n=Math.max(1,Math.ceil(W/w));h+=` Це <b>${n} шт.</b> по ${w} Вт.`}
   else{const wm=g("wm"),v=g("v"),len=Math.ceil(W/wm*2)/2,tot=len*wm,ps=PSU.find(x=>x>=tot*1.2)||Math.ceil(tot*1.2/100)*100;h+=` Стрічки потрібно <b>${nf(len)} м</b>. Блок живлення <b>${v} В, від ${ps} Вт</b> (з запасом 20%).`}
   h+=`<small>Для вітальні й кухні краще 2–3 рівні світла: загальне плюс локальне. Тепле світло 2700–3000 K для відпочинку, нейтральне 4000 K для кухні й роботи.</small>`;return{h}}},
 strip:{f:()=>cNum("len","Довжина стрічки, м",5,.5,.5)+cSel("wm","Потужність стрічки, Вт на метр",[[4.8,"4,8 Вт/м"],[7.2,"7,2 Вт/м"],[9.6,"9,6 Вт/м"],[14.4,"14,4 Вт/м"],[19.2,"19,2 Вт/м"]],9.6)+cSel("v","Напруга стрічки",[[12,"12 В"],[24,"24 В"]],12),
  run:g=>{const len=g("len"),wm=g("wm"),v=g("v"),tot=len*wm,need=tot*1.2,ps=PSU.find(x=>x>=need)||Math.ceil(need/100)*100,mx=v===12?5:10,seg=Math.ceil(len/mx);
   return{h:`Навантаження стрічки <b>${nf(tot)} Вт</b>. Блок живлення <b>${v} В, не менше ${ps} Вт</b> (потужність стрічки +20%). Струм блока живлення приблизно ${nf(ps/v)} А.${seg>1?`<small>Одну лінію стрічки ${v} В не робіть довшою за ${mx} м: далі яскравість падає. Для ${nf(len)} м поділіть стрічку на відрізки (${seg} шт.) і підключіть кожен від свого виходу блока (для одного відрізка можна подати живлення з двох кінців).</small>`:""}<small>Щоб регулювати яскравість або колір (RGB), потрібен діммер або контролер на струм не менше ${nf(tot/v*1.2)} А.</small>`}}},
 furn:{f:()=>cSel("room","Кімната",[["bed","Спальня"],["liv","Вітальня"],["kit","Кухня"],["kid","Дитяча"],["hall","Коридор"],["bath","Ванна, санвузол"],["off","Кабінет"]],"liv")+cNum("area","Площа, м²",18,1,.5)+cSel("n","Скільки місць, з яких треба вмикати одне світло",[[1,"1 (біля входу)"],[2,"2 (на вході й біля ліжка, на двох кінцях коридору)"],[3,"3"],[4,"4"]],1)+cSel("gr","Скільки груп світла (клавіш) у кімнаті",[[1,"1 (все світло разом)"],[2,"2"],[3,"3"]],1),
  run:(g,gs)=>{const r=gs("room"),A=g("area"),n=g("n"),G=g("gr");
   const so={bed:Math.max(4,Math.ceil(A/4)),liv:Math.max(5,Math.ceil(A/3)),kit:5+Math.ceil(A/4),kid:Math.max(4,Math.ceil(A/3)),hall:2,bath:2,off:Math.max(6,Math.ceil(A/2))}[r];
   let h=`<b>Розеток: ${so} шт.</b>`;if(r==="kit")h+=` + окремі розетки під техніку: духовка/плита, холодильник, посудомийка, витяжка (ще 4), кожна на свій автомат.`;if(r==="bath")h+=` Тільки з кришкою IP44, через диф. автомат 30 мА, не ближче 60 см від води.`;
   h+="<br>";
   if(n===1)h+=`<b>Вимикач: 1 шт., ${G}-клавішний.</b>`;
   else{const cr=n-2;h+=`<b>Прохідних перемикачів: 2 шт.</b> (по краях)${cr>0?`, <b>перехресних: ${cr} шт.</b> (посередині)`:""}${G>1?`. Беріть ${G}-клавішні: кожна клавіша керує своєю групою світла за такою самою схемою`:""}.`;h+=lSch(n)+`<small>Між перемикачами прокладають кабель 3×1,5 мм². Роботи з електрикою виконує електрик, на час роботи вимкніть автомат.</small>`}
   return{h}}},
 cable:{f:()=>cNum("w","Потужність навантаження, Вт",3000,100,100)+cSel("ph","Мережа",[[1,"Однофазна 220 В"],[3,"Трифазна 380 В"]],1),
  run:(g,gs)=>{const W=g("w"),I=gs("ph")==="3"?W/(1.732*380*.95):W/220,S=[[16,1.5],[25,2.5],[32,4],[40,6],[50,10],[63,16]],need=I*1.25,B=BRK.find(x=>x>=need),c=S.find(x=>x[0]>=need);
   return{h:c&&B?`Струм приблизно <b>${nf(I)} А</b>. Кабель мідний від <b>${nf(c[1])} мм²</b>, автомат на <b>${B} А</b>.`:`Струм приблизно <b>${nf(I)} А</b>. Для такої потужності потрібен індивідуальний розрахунок, зверніться до електрика.`}}},
 panel:null
};
const PL=[["light","Освітлення",2,10,1.5,0],["sock","Розетки в кімнатах",3,16,2.5,1],["bath","Розетки у ванній",1,16,2.5,1],["boil","Бойлер",0,16,2.5,1],["wash","Пральна машина",0,16,2.5,1],["dish","Посудомийна машина",0,16,2.5,1],["ac","Кондиціонер",0,16,2.5,0],["floor","Тепла підлога",0,16,2.5,1],["oven","Електроплита / духова шафа",0,32,6,0]];
CALC.panel={f:()=>cSel("ph","Мережа",[[1,"Однофазна 220 В"],[3,"Трифазна 380 В"]],1)+cNum("kw","Дозволена потужність за договором, кВт",10,1,.5)+'<div class="c-pl"><b>Які лінії потрібні (скільки штук):</b>'+PL.map(x=>cNum("p_"+x[0],x[1],x[2],0)).join("")+'</div><div class="c-pl"><b>Додатково:</b>'+[["dusk","Вуличне освітлення за сутінками"],["timer","Робота за графіком (бойлер, насос, освітлення)"],["stab","Стабілізатор для техніки"],["imp","Керування світлом з багатьох місць без перехресних"]].map(x=>`<label class="c-ck"><input type="checkbox" data-cin="x_${x[0]}"> ${x[1]}</label>`).join("")+`<span class="c-stab" hidden>${cNum("sw","Потужність техніки, Вт",1000,100,100)}${cSel("mot","Тип техніки",[[1.3,"Звичайна (телевізор, комп’ютер, котел)"],[3,"З двигуном (холодильник, насос, кондиціонер)"]],1.3)}</span></div>`,
 run:(g,gs,s)=>{const ck=n=>{const e=s.querySelector(`[data-cin="${n}"]`);return e&&e.checked};s.querySelector(".c-stab").hidden=!ck("x_stab");
  const ph=gs("ph")==="3",kw=g("kw"),I=ph?kw*1000/(1.732*380*.95):kw*1000/220,intro=BRK.find(x=>x>=I)||100;let rows="",mod=0,lines=0;
  PL.forEach(x=>{const n=g("p_"+x[0]);if(!n)return;lines+=n;const dev=x[5]?`Диф. автомат ${x[3]} А, 30 мА`:`Автомат ${x[3]} А`;mod+=n*(x[5]?2:1);rows+=`<tr><td>${x[1]} × ${n}</td><td>${dev}</td><td>${nf(x[4])} мм²</td></tr>`});
  mod+=ph?4:2;const rk=ph?"Реле контролю напруги трифазне":`Реле контролю напруги ${intro} А`;mod+=2+2;
  let ex=`<li><b>Вхідний автомат ${intro} А</b> (${ph?"трифазний, 3-полюсний":"двополюсний"}) на ${nf(kw)} кВт</li><li><b>${rk}</b>: відключає всю квартиру при стрибках напруги</li><li><b>Обмежувач перенапруги (УЗІП) клас II</b>: захист від імпульсів під час грози</li>`;
  if(ck("x_dusk"))ex+=`<li><b>Сутінковий вимикач (фотореле)</b>${"; якщо лампи сумарно понад 2 кВт, через контактор (потужний вимикач) на 25 А"}</li>`,mod+=2;
  if(ck("x_timer"))ex+=`<li><b>Таймер добовий на 16 А</b> (ставиться в щиток)</li>`,mod+=1;
  if(ck("x_imp"))ex+=`<li><b>Імпульсне реле 16 А</b> + кнопки в кожному місці керування</li>`,mod+=1;
  if(ck("x_stab")){const va=Math.ceil(g("sw")*gs("mot")/100)*100;ex+=`<li><b>Стабілізатор від ${va} ВА</b> (потужність техніки ×${nf(+gs("mot"))})</li>`}
  mod=Math.ceil(mod*1.2);const sz=[4,6,8,12,18,24,36,48,72].find(x=>x>=mod)||72;
  return{h:`<table class="lpt"><tr><th>Лінія</th><th>Захист</th><th>Кабель</th></tr>${rows||'<tr><td colspan=3>Оберіть кількість ліній</td></tr>'}</table><small>Диф. автомат (диференційний) = автомат + захист людей від ураження струмом в одному корпусі.</small><ul class="lpu">${ex}</ul>Щиток приблизно на <b>${sz} ${sz%10>=2&&sz%10<=4&&(sz%100<10||sz%100>=20)?"модулі":"модулів"}</b> (місць для автоматів), із запасом 20%.<small>Це типова схема захисту. Номінали автоматів і перерізи кабелів остаточно підтвердить електрик за проєктом.</small>`}}};
const nf=x=>String(Math.round(x*10)/10).replace(".",",");
function lSch(n){const names=["Коробка","Перемикач 1"].concat(Array.from({length:n-2},(_,i)=>"Перехресний "+(i+1))).concat(["Перемикач "+n,"Лампа"]),w=86,W=names.length*w+10;
 let s=`<svg class="lsch" viewBox="0 0 ${W} 120" role="img" aria-label="Схема підключення">`;
 names.forEach((t,i)=>{const x=10+i*w,c=i===0?"#eee":i===names.length-1?"#fff3cd":t.startsWith("Перехресний")?"#e3f2fd":"#e0f7f6";s+=`<rect x="${x}" y="30" width="68" height="40" rx="6" fill="${c}" stroke="#555"/><text x="${x+34}" y="55" text-anchor="middle" font-size="11" fill="#111">${t}</text>`;
  if(i&&i<names.length-1){const px=x-18;s+=i===1?`<line x1="${px}" y1="50" x2="${x}" y2="50" stroke="#d32f2f" stroke-width="2"/><text x="${px+9}" y="44" text-anchor="middle" font-size="9" fill="#d32f2f">L</text>`:`<line x1="${px}" y1="42" x2="${x}" y2="42" stroke="#1976d2" stroke-width="2"/><line x1="${px}" y1="58" x2="${x}" y2="58" stroke="#388e3c" stroke-width="2"/>`}
  if(i===names.length-1)s+=`<line x1="${x-18}" y1="50" x2="${x}" y2="50" stroke="#d32f2f" stroke-width="2"/><text x="${x-9}" y="44" text-anchor="middle" font-size="9" fill="#d32f2f">L</text>`});
 s+=`<line x1="${10+34}" y1="70" x2="${10+34}" y2="100" stroke="#555" stroke-dasharray="4"/><line x1="${10+34}" y1="100" x2="${10+(names.length-1)*w+34}" y2="100" stroke="#555" stroke-dasharray="4"/><line x1="${10+(names.length-1)*w+34}" y1="100" x2="${10+(names.length-1)*w+34}" y2="70" stroke="#555" stroke-dasharray="4"/><text x="${W/2}" y="114" text-anchor="middle" font-size="10" fill="#555">Нуль N напряму з коробки на лампу</text></svg>`;
 return`<div class="lschw">${s}<div class="lleg"><span style="color:#d32f2f">━ фаза L</span> <span style="color:#1976d2">━</span> <span style="color:#388e3c">━ дві перемички між перемикачами</span></div></div>`}
function lCalcHtml(k,b){const c=CALC[k];if(!c)return"";const per=+b.per||0,pid=M[String(b.pid||"").trim()]?String(b.pid).trim():"";
 return`<section class="lsec lcalc" data-ck="${esc(k)}" data-per="${per}" data-pid="${esc(pid)}">${lH(b,CN[k])}<div class="lcf">${c.f()}</div><div class="lcres"></div><p class="lnote">Розрахунок орієнтовний.</p></section>`}
function lCalc(sec){const c=CALC[sec.dataset.ck];if(!c)return;const g=n=>{const e=sec.querySelector(`[data-cin="${n}"]`);return e?+e.value||0:0},gs=n=>{const e=sec.querySelector(`[data-cin="${n}"]`);return e?e.value:""};
 const r=c.run(g,gs,sec),pid=sec.dataset.pid,out=sec.querySelector(".lcres");let h=r.h;
 if(r.q&&pid&&!SHOP.orders_off&&document.body.classList.contains("lndon"))h+=`<button class="lbtn lsm" data-lcadd="${esc(pid)}|${r.q}">Додати ${r.q} шт. у кошик</button>`;
 else if(document.body.classList.contains("lndon")&&$("lprods"))h+=`<button class="lbtn lsm" data-lgo="prods">Підібрати товари</button>`;
 else if(!document.body.classList.contains("lndon"))h+=`<button class="lbtn lsm" data-lfind="${esc(({garland:"гірлянда",light:"світильник",strip:"led стрічка",furn:"розетка",cable:"кабель",panel:"автомат"})[sec.dataset.ck]||"")}">Знайти в каталозі</button>`;
 out.innerHTML=h}
function lCalcAll(){document.querySelectorAll(".lcalc").forEach(lCalc)}
function viewHelp(){const on=SHOP.help_on,ks=(Array.isArray(SHOP.help_k)&&SHOP.help_k.length?SHOP.help_k:Object.keys(CN)).filter(k=>CALC[k]);document.title="Помічник підбору — Trend Electro";
 $("view").innerHTML=on?`<div class="lnd lst-festive lhelp"><section class="lsec"><h1 style="margin:0">Помічник підбору</h1><p class="lsub" style="margin:0">Введіть дані й отримайте чіткий підбір: скільки, якої потужності й що брати. Розрахунки орієнтовні.</p></section>${ks.map(k=>lCalcHtml(k,{})).join("")}</div>`:'<div class="empty">Сторінку не знайдено. <a href="#/">На головну</a></div>';lCalcAll()}
function lTot(){const L=lCur();let s=0,l=0,n=0;Object.keys(LCART).forEach(id=>{const p=M[id];if(!p)return;const q=LCART[id],pr=lPr(p,L);s+=pr.s*q;l+=pr.l*q;n+=q});return{s,l,n,save:Math.round((s-l)*100)/100}}
function lRefresh(){const L=lCur(),t=lTot(),d=lDisc(L);
 document.querySelectorAll(".lcard,.lshc").forEach(c=>{const p=M[c.dataset.id],k=c.querySelector(".lctl");if(p&&k&&p.st&&!SHOP.orders_off)k.innerHTML=lCtl(p)});
 document.querySelectorAll(".lsum").forEach(e=>{const ids=Object.keys(LCART).filter(i=>M[i]);e.innerHTML=ids.length?ids.map(id=>{const p=M[id],pr=lPr(p,L);return`<div class="lsl"><span>${esc(p.n)}</span><span class="lqty"><button data-lq="${esc(id)}" data-d="-1">−</button><b>${LCART[id]}</b><button data-lq="${esc(id)}" data-d="1">+</button></span><b>${money(pr.l*LCART[id])}</b></div>`}).join("")+`<div class="lsl lt"><span>Разом</span><b>${money(t.l)}</b></div>${t.save>0?`<div class="lsvd">Ви економите ${money(t.save)} (на сайті було б ${money(t.s)})</div>`:""}`:'<div class="lemp">Оберіть товари вище кнопкою «Додати».<br><button class="lbtn lsm" data-lgo="prods">Перейти до товарів</button></div>'});
 const bar=$("lbar");if(bar)bar.innerHTML=t.n?`<div><b>${money(t.l)}</b>${t.save>0?`<span> · економія ${money(t.save)}</span>`:""}</div><button class="lbtn" data-lgo="order">Оформити (${t.n})</button>`:`<div><b>${d?"−"+d+"% за цим посиланням":"Замовлення онлайн"}</b></div><button class="lbtn" data-lgo="${lAll(L).length?"prods":"order"}">${lAll(L).length?"Обрати товар":"Замовити"}</button>`}
async function viewLanding(slug){
 const v=$("view");document.body.classList.add("lndon");
 let L=LND[slug];if(!L){v.innerHTML='<div class="empty">Завантаження…</div>';if(sb){const r=await sb.from("landings").select("*").eq("slug",slug).maybeSingle();L=r.data;if(L)LND[slug]=L}if(curH()!=="#/l/"+slug)return}
 if(!L){if(SHOP.lnd_end_off||!sb){v.innerHTML='<div class="empty">Цю сторінку не знайдено або акція завершилась. <a href="#/">На головну</a></div>';return}
  document.title="Акція завершилась — Trend Electro";const lv=await lLive();if(curH()!=="#/l/"+slug)return;
  v.innerHTML=`<div class="lnd lst-light" style="--lc:#0ABAB5"><div class="ltop"><a href="${esc(BASE)}" aria-label="Trend Electro"><img src="${esc(BASE)}logo1.webp" alt="Trend Electro" width="71" height="40"></a></div>${lEndBox(slug,lv,true)}</div>`;
  sb.rpc("landing_miss",{p_slug:slug}).then(()=>{},()=>{});return}
 if(LCUR!==slug){LCART={};LCUR=slug}
 if(+(L.theme||{}).win>0&&+(L.theme||{}).disc>0&&L.active&&sb&&!LWIN[slug]){try{const r=await sb.rpc("landing_window",{p_slug:slug,p_vid:lVisitor()});const d=r.data;LWIN[slug]=d?{code:d.code||null,end:Date.now()+(+d.left||0)*1e3,pct:+d.pct||0}:{code:null,end:0,pct:0}}catch(e){LWIN[slug]={code:null,end:0,pct:0}}if(curH()!=="#/l/"+slug)return}
 {const _d=lDisc(L);if(_d>0)LHAD[slug]=1;if(_d>0)SV("te_lpromo",{c:lCode(L),t:Date.now(),e:(lWin(L)||{}).end||0})}
 const th=L.theme||{},d=lDisc(L),s=shop();document.title=(L.title||"Акція")+" — Trend Electro";
 const endLive=lGone(L)&&!SHOP.lnd_end_off&&sb?await lLive():[];if(curH()!=="#/l/"+slug)return;
 if(th.simple){const sb0=(L.blocks||[]).find(x=>x.t==="products");const ps=sb0?lProds(sb0):[];if(ps.length===1){await pLoad(ps[0]);if(curH()!=="#/l/"+slug)return}}
 const all=lAll(L);if(!Object.keys(LCART).length&&all.length===1&&!SHOP.orders_off)LCART[all[0].id]=1;
 v.innerHTML=lSub(`<div class="lnd lrv lst-${esc(th.dark?"dark":(th.style||"festive"))} lt-${esc(th.tpl||"teal")}" style="--lc:${esc(/^#[0-9a-f]{6}$/i.test(th.c||"")?th.c:"#0ABAB5")}"><div class="ltop"><a href="${esc(BASE)}" aria-label="Trend Electro"><img src="${esc(BASE)}logo1.webp" alt="Trend Electro" width="71" height="40"></a><a class="lsite" href="${esc(BASE)}" target="_blank" rel="noopener">Весь сайт ↗</a>${s.phone?`<a class="ltel" href="${esc(tel(s.phone))}" data-lclk="1">📞 ${esc(s.phone)}</a>`:""}</div>${L.active?"":'<div class="ldraft">Чернетка: лендінг вимкнений, його бачите тільки ви як адміністратор.</div>'}${d?`<div class="lstrip">🔥 −${d}% — тільки за цим посиланням${lWin(L)?` · діє до ${esc(lWhen(lWin(L).end))} · залишилось <b class="lcd" data-until="${lWin(L).end}">…</b><span class="lurgt"> · менше години!</span>`:(lEnd(L)?` · діє до ${esc(lWhen(lEnd(L)))}`:". На сайті зараз звичайні ціни.")}</div>`:(lGone(L)?'<div class="lstrip lend">Знижка на цій сторінці завершилась — ціни як на сайті.</div>':"")}${lGone(L)&&!SHOP.lnd_end_off?lEndBox(slug,endLive,false):""}${th.simple?lSimple(L):(L.blocks||[]).filter(b=>!b.off&&LB[b.t]).map(b=>{try{return LB[b.t](b,L)}catch(e){return""}}).join("")}<div class="lback"><a href="${esc(BASE)}">Перейти до всього каталогу →</a></div></div>${SHOP.orders_off?"":`<div class="lbar" id="lbar" style="--lc:${esc(/^#[0-9a-f]{6}$/i.test(th.c||"")?th.c:"#0ABAB5")}"></div>`}`,L);
 lRefresh();lCalcAll();lFx(th.fx);lPix(L);if(document.querySelector(".ltim,.lcd")||lWin(L)){lTick();clearInterval(LTM);LTM=setInterval(lTick,1000)}
 if("IntersectionObserver"in window&&!matchMedia("(prefers-reduced-motion:reduce)").matches){LIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("lin2")}}),{threshold:.08});document.querySelectorAll(".lnd .lsec").forEach(x=>LIO.observe(x))}else document.querySelector(".lnd").classList.remove("lrv");
 const o=$("lorder");if(o&&$("lbar")&&"IntersectionObserver"in window){const io=new IntersectionObserver(es=>{const b=$("lbar");if(b)b.classList.toggle("hid",es[0].isIntersecting)},{threshold:.15});io.observe(o);LIO2=io}
 if(L.active&&sb){const k="lv_"+slug;let seen=0;try{seen=sessionStorage.getItem(k)}catch(e){}if(!seen){try{sessionStorage.setItem(k,1)}catch(e){}sb.rpc("landing_hit",{p_slug:slug,p_kind:"view"}).then(()=>{},()=>{})}}
}
const lHit=k=>{const h=curH();if(h.indexOf("#/l/")===0&&sb)sb.rpc("landing_hit",{p_slug:decodeURIComponent(h.slice(4)),p_kind:k}).then(()=>{},()=>{})};
async function lOrder(btn){const f=btn.closest(".lform"),m=f.querySelector(".lmsg"),q=s=>f.querySelector(s),slug=LCUR,L=lCur();
 const bad=(el,t)=>{f.querySelectorAll(".bad").forEach(x=>x.classList.remove("bad"));m.className="lmsg bad";m.textContent=t;if(el){el.classList.add("bad");el.focus()}};
 const items=Object.keys(LCART).filter(i=>M[i]&&M[i].st).map(i=>({id:i,qty:Math.min(999,LCART[i])}));
 if(!items.length)return bad(null,"Спочатку додайте товар кнопкою «Додати».");
 const nm=q(".lfn").value.trim(),dg=q(".lfph").value.replace(/\D/g,"");
 let ph=dg;if(/^0\d{9}$/.test(dg))ph="380"+dg.slice(1);else if(/^80\d{9}$/.test(dg))ph="3"+dg;
 if(nm.length<2)return bad(q(".lfn"),"Вкажіть, будь ласка, ім’я.");
 if(!/^380\d{9}$/.test(ph))return bad(q(".lfph"),"Вкажіть номер телефону у форматі 067 123 45 67.");
 if(SHOP.orders_off||!sb)return bad(null,ordMsg());
 const nod=()=>{LNOD[slug]=1;m.className="lmsg bad";m.textContent="Час знижки закінчився. Сума без знижки — "+money(lTot().l)+". Натисніть ще раз, щоб оформити за звичайною ціною.";btn.textContent="Оформити без знижки"};
 if(LHAD[slug]&&!lDisc(L)&&!LNOD[slug]&&!SHOP.lnd_end_off)return nod();
 ph="+"+ph.replace(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/,"$1 $2 $3 $4 $5");
 btn.disabled=true;btn.textContent="Оформлюємо…";m.textContent="";
 const args={p_name:nm,p_phone:ph,p_delivery:"Уточнити телефоном",p_address:"",p_payment:"Уточнити телефоном",p_comment:"Лендінг: "+(L.title||slug)+" (/"+slug+")",p_promo:lDisc(L)?lCode(L):((L.theme&&L.theme.promo)||null),p_items:items};
 let r=await sb.rpc("create_order",args);if(r.error&&args.p_promo&&/Промокод/i.test(r.error.message||"")){if(LHAD[slug]&&!LNOD[slug]&&!SHOP.lnd_end_off){btn.disabled=false;LWIN[slug]=Object.assign(LWIN[slug]||{},{code:null,end:0});lRefresh();return nod()}args.p_promo=null;r=await sb.rpc("create_order",args)}
 btn.disabled=false;btn.textContent="Оформити замовлення";
 if(r.error){const em=r.error.message||"";return bad(null,/schema cache|Could not find|function/i.test(em)?"Не вдалося оформити замовлення. Спробуйте ще раз або зателефонуйте нам.":em)}
 lHit("order");const o=r.data;lEv("order",+o.total);srcSend(o.id,ph);LCART={};const bar=$("lbar");if(bar)bar.remove();
 f.innerHTML=`<div class="ldone"><b>Дякуємо! Замовлення №${esc(o.id)} прийнято.</b><p>${(o.items||[]).map(x=>esc(x.name)+" × "+x.qty).join("<br>")}</p><p>Разом: ${money(+o.total)}${+o.discount?" (знижка "+esc(o.discount)+"%)":""}</p><p>Менеджер зателефонує найближчим часом.</p>${accOffer(nm,ph,"lbtn lsm")}</div>`;document.querySelectorAll(".lcard .lctl").forEach(k=>k.innerHTML="")}
document.addEventListener("submit",async e=>{const f=e.target.closest&&e.target.closest("[data-lnf]");if(!f)return;e.preventDefault();
 const i=f.querySelector("input[type=text]"),ck=f.querySelector("input[type=checkbox]"),m=f.querySelector(".lmsg"),b=f.querySelector("button"),c=i.value.trim();
 const em=/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(c),ph=c.replace(/\D/g,"").length>=10&&/^[+\d\s()-]+$/.test(c);m.className="lmsg bad";
 if(!em&&!ph){m.textContent="Вкажіть правильний email або телефон.";return}
 if(!ck.checked){m.textContent="Потрібна згода на обробку даних.";return}
 b.disabled=true;const r=sb?await sb.from("leads").insert({contact:c.slice(0,200),source:"landing_end:"+f.dataset.lnf}):{error:1};
 if(r.error){b.disabled=false;m.textContent="Не вдалося зберегти. Спробуйте пізніше.";return}
 f.innerHTML='<div class="ldone"><b>Дякуємо! Повідомимо про наступну акцію.</b></div>'});
document.addEventListener("click",e=>{
 const g=e.target.closest("[data-lgo]");if(g){const t=$(g.dataset.lgo==="prods"?"lprods":"lorder")||$("lorder");if(t){t.scrollIntoView({behavior:"smooth",block:"start"});lHit("click")}return}
 const cko=e.target.closest("[data-ckok],[data-ckno]");if(cko){SV("te_ck",cko.hasAttribute("data-ckok")?1:0);const bx=$("ckb");if(bx)bx.remove();if(cko.hasAttribute("data-ckok")){LPX={};lPixRun(lCur())}return}
 const lq=e.target.closest("[data-lq]");if(lq){const id=lq.dataset.lq,n=(LCART[id]||0)+(+lq.dataset.d);if(n<=0)delete LCART[id];else LCART[id]=Math.min(99,n);if(+lq.dataset.d>0){lHit("click");lEv("add",M[id]?lPr(M[id],lCur()).l:0)}lRefresh();return}
 const fd=e.target.closest("[data-lfind]");if(fd){$("q").value=fd.dataset.lfind;goSearch();return}
 const ca=e.target.closest("[data-lcadd]");if(ca){const[id,n]=ca.dataset.lcadd.split("|");if(M[id]){LCART[id]=Math.min(99,(LCART[id]||0)+(+n||1));lHit("click");lEv("add",0);lRefresh();const t=$("lorder");if(t)t.scrollIntoView({behavior:"smooth",block:"start"})}return}
 const bn=e.target.closest("[data-lbun]");if(bn){bn.dataset.lbun.split(",").forEach(id=>{if(M[id])LCART[id]=Math.min(99,(LCART[id]||0)+1)});lHit("click");lEv("add",0);lRefresh();const t=$("lorder");if(t)t.scrollIntoView({behavior:"smooth",block:"start"});return}
 const o=e.target.closest("[data-lord]");if(o){lOrder(o);return}
 if(e.target.closest("[data-lclk]"))lHit("click");
});

document.addEventListener("input",e=>{const s=e.target.closest&&e.target.closest(".lcalc");if(s&&e.target.dataset.cin)lCalc(s)});
document.addEventListener("change",e=>{const s=e.target.closest&&e.target.closest(".lcalc");if(s&&e.target.dataset.cin)lCalc(s)});

/* ---------- клієнти: джерело замовлення і кабінет після замовлення ---------- */
function srcInit(){try{let s=JSON.parse(localStorage.getItem("te_src")||"null");const now=Date.now();
 if(!s||now-s.t>30*864e5){const q=new URLSearchParams(location.search);let ch=q.get("utm_source");if(ch){const c=q.get("utm_campaign");ch+=c?"/"+c:""}else if(q.get("fbclid"))ch="facebook";else if(q.get("ttclid"))ch="tiktok";else if(q.get("gclid"))ch="google";else if(q.get("ref"))ch=q.get("ref");else{try{const h=new URL(document.referrer).hostname.replace(/^www\./,"");if(h&&h!==location.hostname)ch=h}catch(e){}}
  s={c:String(ch||"direct").slice(0,60),t:now};localStorage.setItem("te_src",JSON.stringify(s))}window.__srcc=s.c}catch(e){window.__srcc="direct"}}
srcInit();
function srcStr(){const h=curH(),lp=h.indexOf("#/l/")===0?decodeURIComponent(h.slice(4)):"";return(window.__srcc||"direct")+(lp?" → лендінг "+lp:"")}
function srcSend(id,phone){if(SHOP.src_off||!sb||!id)return;sb.rpc("set_order_source",{p_id:id,p_phone:phone,p_src:srcStr()}).then(()=>{},()=>{})}
function accOffer(nm,ph,cls){if(me||SHOP.acc_offer_off)return"";return`<div class="accoffer"><button class="${cls}" data-mkacc="1" data-n="${esc(nm)}" data-p="${esc(ph)}">Створити кабінет</button><div class="sku">Історія замовлень, персональні знижки й вітання в день народження. Ім’я й телефон уже заповнено.</div></div>`}
document.addEventListener("click",e=>{const b=e.target.closest("[data-mkacc]");if(!b)return;tab="up";drawAcc();panel("acc",true);setTimeout(()=>{const n=$("rn"),p=$("rp");if(n)n.value=b.dataset.n||"";if(p)p.value=(b.dataset.p||"").replace(/\s/g,"")},60)});

/* показати / сховати пароль */
(function(){const E='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>',X='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.9 17.9A10.9 10.9 0 0 1 12 19C5 19 1 12 1 12a19 19 0 0 1 5.1-5.9M9.9 4.2A10.7 10.7 0 0 1 12 4c7 0 11 8 11 8a19 19 0 0 1-3.2 4.2M14.1 14.1a3 3 0 1 1-4.2-4.2"/><path d="M1 1l22 22"/></svg>';
 function wrap(i){if(i.dataset.eye)return;i.dataset.eye=1;const w=document.createElement("div");w.className="pwf";i.parentNode.insertBefore(w,i);w.appendChild(i);const b=document.createElement("button");b.type="button";b.className="pwe";b.setAttribute("aria-label","Показати пароль");b.innerHTML=E;b.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();const show=i.type==="password";i.type=show?"text":"password";b.innerHTML=show?X:E;b.setAttribute("aria-label",show?"Сховати пароль":"Показати пароль");i.focus()});w.appendChild(b)}
 const scan=()=>document.querySelectorAll('input[type="password"]').forEach(wrap);
 new MutationObserver(scan).observe(document.documentElement,{childList:true,subtree:true});scan()})();

/* ===== Порівняння товарів, банер встановлення, офлайн, анімації ===== */
const cmpOn=()=>!SHOP.cmp_off;
function cmpDraw(){document.querySelectorAll("[data-cmp]").forEach(b=>b.classList.toggle("on",CMP.includes(b.dataset.cmp)));let bar=$("cmpbar");const n=CMP.length;
 if(!cmpOn()||!n||curH()==="#/cmp"){if(bar)bar.remove();return}
 if(!bar){bar=document.createElement("div");bar.id="cmpbar";bar.className="cmpbar";document.body.appendChild(bar)}
 bar.innerHTML=`<span>Порівняння: <b>${n}</b> з 4</span><a class="go" href="#/cmp">Порівняти</a><button type="button" data-cmpclr aria-label="Очистити порівняння">✕</button>`}
function cmpToggle(id){const i=CMP.indexOf(id);if(i>-1)CMP.splice(i,1);else{if(CMP.length>=4){toast("Можна порівнювати до 4 товарів. Приберіть один.");return}CMP.push(id)}SV("te_cmp",CMP);cmpDraw();if(curH()==="#/cmp")viewCmp()}
async function viewCmp(){document.title="Порівняння товарів — Trend Electro";const v=$("view"),cr='<nav class="crumbs"><a href="#/">Головна</a><span>›</span>Порівняння</nav><h1 class="ptitle">Порівняння товарів</h1>';
 const l=cmpOn()?CMP.map(id=>M[id]).filter(Boolean):[];
 if(!cmpOn()){v.innerHTML='<div class="empty">Сторінку не знайдено. <a href="#/">На головну</a></div>';return}
 if(!l.length){v.innerHTML=cr+'<div class="empty">Додайте товари для порівняння кнопкою <b>⇄</b> на картці товару (до 4 штук). Так легко побачити різницю в потужності, кольорі світла, захисті та ціні.<br><br><a class="btn" href="#/c/">До каталогу</a></div>';return}
 v.innerHTML=cr+'<div class="sku">Завантажуємо характеристики…</div>';
 await Promise.all(l.map(pLoad));if(curH()!=="#/cmp")return;
 const rows=l.map(p=>specRows(p.sp)),keys=[];rows.forEach(r=>r.forEach(x=>{if(keys.indexOf(x[0])<0)keys.push(x[0])}));
 const val=(i,k)=>{const f=rows[i].find(x=>x[0]===k);return f?f[1]:""};
 const prices=l.map(p=>priceInfo(p).pc||0),min=Math.min.apply(null,prices.filter(x=>x>0).concat([Infinity]));
 const th=l.map((p,i)=>`<th><button type="button" class="cmpx" data-cmprm="${esc(p.id)}" aria-label="Прибрати">✕</button><a href="#/p/${encodeURIComponent(p.id)}" class="cmpi">${img(p.img,200,200,p.n)}</a><a class="name" href="#/p/${encodeURIComponent(p.id)}">${esc(p.n)}</a><div class="sku">Арт. ${esc(p.id)}</div>${priceHtml(priceInfo(p))}${prices[i]===min&&l.length>1?'<div class="cmpbest">Найвигідніша ціна</div>':""}${p.st?`<button class="add" data-cmpadd="${esc(p.id)}">${ico("cart")}У кошик</button>`:'<span class="stock no">Немає в наявності</span>'}</th>`).join("");
 const body=keys.map(k=>{const vs=l.map((p,i)=>val(i,k)),df=new Set(vs.map(x=>x.toLowerCase())).size>1;return`<tr${df?' class="cdf"':""}><td>${esc(k)}</td>${vs.map(x=>`<td>${x?esc(x):"—"}</td>`).join("")}</tr>`}).join("");
 v.innerHTML=cr+`<div class="cmpw"><table class="cmpt"><thead><tr><th></th>${th}</tr></thead><tbody>${body||`<tr><td colspan="${l.length+1}">Характеристики для цих товарів ще не заповнені.</td></tr>`}</tbody></table></div>${keys.length&&l.length>1?'<p class="sku">Рядки, де товари відрізняються, підсвічені.</p>':""}${l.length<2?'<p class="sku">Додайте ще хоча б один товар, щоб побачити різницю.</p>':""}<p><a class="btn" href="#/c/">Додати ще товари</a> <button type="button" class="btn" data-cmpclr>Очистити</button></p>`}
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-cmp]")){e.preventDefault();e.stopPropagation();const id=x.dataset.cmp;cmpToggle(id);if(x.classList.contains("on"))toast("Додано до порівняння",0);return}
 if(x=e.target.closest("[data-cmprm]")){cmpToggle(x.dataset.cmprm);return}
 if(e.target.closest("[data-cmpclr]")){CMP=[];SV("te_cmp",CMP);cmpDraw();if(curH()==="#/cmp")viewCmp();return}
 if(x=e.target.closest("[data-cmpadd]")){const id=x.dataset.cmpadd;if(M[id]){cart[id]=(cart[id]||0)+1;save();drawCart();toast("Додано в кошик",1)}return}
},true);
/* банер «Встановити додаток» */
const instHidden=()=>{try{const t=+localStorage.getItem("te_inst")||0;return Date.now()-t<2592e6}catch(e){return false}};
const instMute=()=>{try{localStorage.setItem("te_inst",String(Date.now()))}catch(e){}const b=$("instb");if(b)b.remove()};
function instShow(txt,btn,fn){if(SHOP.inst_off||STANDALONE||instHidden()||$("instb")||/^#\/l\//.test(curH()))return;const b=document.createElement("div");b.id="instb";b.className="instb";b.innerHTML=`<img src="${BASE}icon-192.png" alt="" width="40" height="40"><span>${txt}</span>${btn?`<button type="button" class="go" id="instgo">${btn}</button>`:""}<button type="button" class="instx" id="instno" aria-label="Закрити">✕</button>`;document.body.appendChild(b);$("instno").onclick=instMute;if(btn)$("instgo").onclick=()=>{instMute();fn()}}
function instSoon(){setTimeout(()=>{if(INSTEV)instShow("Встановіть Trend Electro на телефон: відкривається в один дотик","Встановити",()=>{const ev=INSTEV;INSTEV=null;if(ev)ev.prompt()})},8000)}
function instIos(){toast("Натисніть «Поділитися» внизу екрана → «На початковий екран».")}
addEventListener("appinstalled",instMute);
if(/android/i.test(navigator.userAgent)&&!STANDALONE)setTimeout(()=>{if(INSTEV)return;const inapp=/FBAN|FBAV|Instagram|Telegram|Viber|; wv\)|Line\//i.test(navigator.userAgent);instShow(inapp?"Щоб додати Trend Electro на екран, відкрийте сайт у Chrome (меню ⋮ → «Відкрити в браузері»)":"Додайте Trend Electro на екран: меню браузера ⋮ → «Додати на головний екран» або «Встановити застосунок»","",null)},20000);
if(IOS&&!STANDALONE)setTimeout(()=>instShow("Додайте Trend Electro на екран iPhone: «Поділитися» → «На початковий екран»","",null),20000);
/* офлайн */
function netBar(){let b=$("netb");if(navigator.onLine){if(b)b.remove();return}if(!b){b=document.createElement("div");b.id="netb";b.className="netb";b.textContent="Немає інтернету. Показуємо збережене на телефоні. Замовити можна, коли зв’язок повернеться.";document.body.appendChild(b)}}
addEventListener("online",netBar);addEventListener("offline",netBar);netBar();
/* кнопка «Назад» для встановленого додатка (PWA) */
function backDraw(){const b=$("backBtn");if(!b)return;const h=curH();b.hidden=!STANDALONE;b.style.visibility=(h==="#/"||h==="")?"hidden":"visible"}
document.addEventListener("click",e=>{if(e.target.closest("#backBtn")){e.preventDefault();if(history.length>1)history.back();else location.hash="#/"}});
/* ===== Кошторис у PDF, чек-лист ремонту, симулятор кольору світла ===== */
const estOn=()=>!SHOP.est_off,chkOn=()=>!SHOP.check_off,simOn=()=>!SHOP.sim_off;
const NF='<div class="empty">Сторінку не знайдено. <a href="#/">На головну</a></div>';
function toolsHtml(){const t=[];
 if(simOn())t.push(['#/light','Підбір кольору світла','Тепле чи холодне? Подивіться, як змінюється кімната','sim-kitchen.webp']);
 if(frameOn())t.push(['#/frame','Конструктор рамки','Зберіть блок розеток і вимикачів і подивіться, як він виглядатиме','img/46-90-34.webp']);
 if(chkOn())t.push(['#/check','Чек-лист для ремонту','Нічого не забути: від блока живлення до рамок','img/60-29-35.webp']);
 if(cmpOn())t.push(['#/cmp','Порівняння товарів','Відмічайте ⇄ на картках і порівнюйте характеристики','img/11-11-41.webp']);
 if(SHOP.help_on)t.push(['#/help','Помічник підбору','Калькулятори: скільки світильників, кабелю, стрічки','img/13-75-28.webp']);
 return t.length?`<section class="sec"><div class="sech"><div><h2>Корисні інструменти</h2><p>Допомагають обрати правильно й не помилитись</p></div></div>${hsOn()?`<div class="tools hs pct">${t.map(x=>`<a href="${x[0]}"><span class="gi">${img(BASE+x[3],400,300,x[1])}</span><b>${x[1]}</b><span>${x[2]}</span></a>`).join("")}</div>${t.length>2?hsBtn("усі інструменти"):""}`:`<div class="tools">${t.map(x=>`<a href="${x[0]}"><b>${x[1]}</b><span>${x[2]}</span></a>`).join("")}</div>`}</section>`:""}
/* --- кошторис --- */
let EST=null,ESTPRE=null;
const dmy=d=>String(d.getDate()).padStart(2,"0")+"."+String(d.getMonth()+1).padStart(2,"0")+"."+d.getFullYear();
function viewEst(fromFav){document.title="Кошторис — Trend Electro";if(!estOn()){$("view").innerHTML=NF;return}
 if(ESTPRE){const o=ESTPRE;ESTPRE=null;EST={fav:false,obj:o.name,oid:o.id,q:{}};Object.keys(o.items||{}).forEach(id=>{if(M[id])EST.q[id]=Math.max(1,Math.min(9999,Math.floor(+o.items[id])||1))});drawEst();return}
 const src=fromFav?Object.keys(fav).reduce((o,id)=>(o[id]=1,o),{}):cart;EST={fav:fromFav,obj:"",q:{}};Object.keys(src).forEach(id=>{if(M[id])EST.q[id]=Math.max(1,+src[id]||1)});drawEst()}
function estTotals(){let t=0;Object.keys(EST.q).forEach(id=>{t+=Math.round(priceInfo(M[id]).pc*EST.q[id]*100)/100});return Math.round(t*100)/100}
function drawEst(){const v=$("view"),ids=Object.keys(EST.q),s=shop(),back=EST.fav?"#/fav":"#/c/";
 if(!ids.length){v.innerHTML=`<nav class="crumbs noprint"><a href="#/">Головна</a><span>›</span>Кошторис</nav><h1 class="ptitle">Кошторис</h1><div class="empty">Додайте товари в кошик${EST.fav?"":" (або в обране)"} і поверніться сюди. Кошторис збереться сам.<br><br><a class="btn" href="#/c/">До каталогу</a></div>`;return}
 const rows=ids.map((id,i)=>{const p=M[id],pc=priceInfo(p).pc,q=EST.q[id];return`<tr><td>${i+1}</td><td>${esc(p.n)}</td><td>${esc(id)}</td><td class="r"><input class="estq" type="number" min="1" max="9999" value="${q}" data-eq="${esc(id)}" aria-label="Кількість"></td><td class="r">${money(pc)}</td><td class="r" data-es="${esc(id)}">${money(Math.round(pc*q*100)/100)}</td><td class="noprint"><button type="button" class="estx" data-erm="${esc(id)}" aria-label="Прибрати">✕</button></td></tr>`}).join("");
 const ct=[s.phone,s.phone2,s.email,s.address,s.hours,s.telegram?"Telegram: "+s.telegram:""].filter(Boolean);
 v.innerHTML=`<nav class="crumbs noprint"><a href="#/">Головна</a><span>›</span>Кошторис</nav><div class="estp"><div class="esth"><img src="${esc(BASE)}logo1.webp" alt="Trend Electro" width="107" height="60"><div><h1>Кошторис</h1><div>від ${dmy(new Date())}</div></div></div>
<label class="estf">Об’єкт або клієнт: <input id="eobj" type="text" maxlength="120" placeholder="наприклад: Квартира, вул. Лесі Українки, 5" value="${esc(EST.obj)}"></label>
<div class="cmpw"><table class="estt"><thead><tr><th>№</th><th>Назва</th><th>Арт.</th><th class="r">К-сть</th><th class="r">Ціна, ₴</th><th class="r">Сума, ₴</th><th class="noprint"></th></tr></thead><tbody>${rows}</tbody><tfoot><tr><td colspan="5" class="r"><b>Разом</b></td><td class="r"><b id="etot">${money(estTotals())}</b></td><td class="noprint"></td></tr></tfoot></table></div>
<div class="estc"><b>Trend Electro</b> · trendelectro.com.ua${ct.length?"<br>"+ct.map(esc).join(" · "):""}</div>
<p class="estn">Ціни та наявність актуальні на дату складання, уточнюйте перед замовленням. Документ має інформаційний характер і не є рахунком чи публічною офертою.</p></div>
<p class="noprint"><button type="button" class="go estgo" id="eprint">Зберегти PDF / Друк</button> ${objOn()&&!EST.fav?`<button type="button" class="btn" data-objs>${EST.oid?"Оновити об’єкт":"Зберегти як об’єкт"}</button> `:""}<a class="btn" href="${back}">Назад</a></p><p class="sku noprint">На телефоні: натисніть кнопку, потім «Поділитися» → «Зберегти у файли». На комп’ютері: у вікні друку оберіть «Зберегти як PDF».</p>`}
document.addEventListener("input",e=>{const t=e.target;if(t.id==="eobj"&&EST){EST.obj=t.value;return}
 if(t.dataset&&t.dataset.eq&&EST){const id=t.dataset.eq,q=Math.max(1,Math.min(9999,Math.floor(+t.value)||1));EST.q[id]=q;const c=document.querySelector(`[data-es="${CSS.escape(id)}"]`);if(c)c.textContent=money(Math.round(priceInfo(M[id]).pc*q*100)/100);const T=$("etot");if(T)T.textContent=money(estTotals())}});
document.addEventListener("click",e=>{let x;if(x=e.target.closest("[data-erm]")){if(EST){delete EST.q[x.dataset.erm];drawEst()}return}
 if(e.target.closest("#eprint")){const o=document.title;document.title="Кошторис Trend Electro "+dmy(new Date());window.print();setTimeout(()=>{document.title=o},1500)}});
{const o=drawCart;drawCart=function(){o.apply(this,arguments);const a=$("estl");if(a)a.hidden=!(estOn()&&Object.keys(cart).length)}}
/* --- чек-лист --- */
const CHKS=[
 {id:"led",t:"LED-стрічка",items:[["LED-стрічка","Порахуйте довжину з запасом. Стрічки продаються бухтами.","стрічка",p=>/стрічк/i.test(p.n)],["Блок живлення","Потужність беріть із запасом 20–30% від сумарної потужності стрічки.","блок живлення",p=>/блок живлення/i.test(p.n)],["Профіль або екран","Відводить тепло, захищає стрічку й робить світіння рівним.","профіль",p=>/профіль/i.test(p.n)],["Конектори","З’єднують відрізки стрічки без паяння.","конектор",p=>/конектор/i.test(p.n)],["Контролер або димер","Для регулювання яскравості й кольору.","контролер",p=>/контролер|ди?м{1,2}ер/i.test(p.n)],["Клеми","Щоб надійно підключити блок живлення до мережі.","клема",p=>/клем/i.test(p.n)]]},
 {id:"room",t:"Освітлення кімнати",items:[["Світильники","Підберіть кількість під площу кімнати (є калькулятор у «Помічнику підбору»).","світильник",p=>/світильник/i.test(p.n)],["Лампи","Перевірте цоколь (E27, E14, GU10) і колір світла: 3000K тепле, 4000K нейтральне.","лампа",p=>/лампа/i.test(p.n)],["Патрони","Якщо світильник без патрона або потрібен підвіс.","патрон",p=>/патрон/i.test(p.n)],["Вимикач","Один або прохідний, якщо світло вмикають із двох місць.","вимикач",p=>/вимикач/i.test(p.n)],["Датчик руху","Зручно для коридорів, комор і санвузлів.","датчик",p=>/датчик/i.test(p.n)],["Кабель","Для проводки до світильників.","кабель",p=>/кабел/i.test(p.n)],["Клеми","Надійне з’єднання проводів у коробці.","клема",p=>/клем/i.test(p.n)]]},
 {id:"sock",t:"Розетки та вимикачі",items:[["Розетки","Скільки точок потрібно в кожній кімнаті.","розетка",p=>/розетк/i.test(p.n)],["Вимикачі","Одно-, дво- або прохідні.","вимикач",p=>/вимикач/i.test(p.n)],["Рамки","Рамка має підходити до серії механізмів.","рамка",p=>/рамк/i.test(p.n)],["Монтажні коробки","Для встановлення механізмів у стіну.","коробка",p=>/коробк/i.test(p.n)],["Діммер","Плавне регулювання яскравості.","діммер",p=>/ди?м{1,2}ер/i.test(p.n)],["Кабель","Для живлення нових точок.","кабель",p=>/кабел/i.test(p.n)],["Клеми","З’єднання проводів у коробках.","клема",p=>/клем/i.test(p.n)]]},
 {id:"board",t:"Електрощит",items:[["Бокс або щит","Оберіть за кількістю модулів, із запасом на майбутнє.","бокс",p=>/бокс|щит/i.test(p.n+" "+p.c.join(" "))],["Автоматичні вимикачі","Номінал підбирають під переріз кабелю й навантаження.","автоматичний",p=>/автоматичн/i.test(p.n+" "+p.c.join(" "))],["Реле та захист","Захист від перепадів напруги.","реле",p=>/реле|захист/i.test(p.n+" "+p.c.join(" "))],["Шини й клемні колодки","Для розподілу фаз і нуля в щиті.","шина",p=>/шин|клемн/i.test(p.n+" "+p.c.join(" "))],["Кабель","Для вводу й відводів.","кабель",p=>/кабел/i.test(p.n)],["Кабель-канал","Щоб красиво сховати проводку.","кабель-канал",p=>/кабель-канал/i.test(p.n)]]},
 {id:"cab",t:"Кабель і монтаж",items:[["Кабель","Продається бухтами. Перевірте переріз під навантаження.","кабель",p=>/кабел/i.test(p.n)],["Кабель-канал","Для відкритої проводки.","кабель-канал",p=>/кабель-канал/i.test(p.n)],["Гофра","Захищає кабель у стіні.","гофра",p=>/гофр/i.test(p.n)],["Металорукав","Для захисту кабелю від пошкоджень.","металорукав",p=>/металорукав/i.test(p.n)],["Хомути та кріплення","Щоб надійно закріпити кабель.","хомут",p=>/хомут|кріплен/i.test(p.n+" "+p.c.join(" "))],["Клеми","З’єднання проводів.","клема",p=>/клем/i.test(p.n)],["Ізоляція","Ізострічка для захисту з’єднань.","ізострічка",p=>/ізоляц|ізострічк/i.test(p.n+" "+p.c.join(" "))]]}];
let CKS=CHKS[0].id;
function chkHref(f){const top={},sub={};P.forEach(p=>{if(!f(p)||!p.c.length)return;top[p.c[0]]=(top[p.c[0]]||0)+1;if(p.c[1]){const k=p.c[0]+"\u0001"+p.c[1];sub[k]=(sub[k]||0)+1}});
 const t=Object.keys(top).sort((a,b)=>top[b]-top[a])[0];if(!t)return"#/c/";let path=[t];
 const sk=Object.keys(sub).filter(k=>k.split("\u0001")[0]===t).sort((a,b)=>sub[b]-sub[a])[0];if(sk&&sub[sk]>=top[t]*.6)path=sk.split("\u0001");return href(path)}
const ckGet=()=>{const o=LS("te_chk",{});return o&&typeof o==="object"?o:{}};
function viewCheck(){document.title="Чек-лист для ремонту — Trend Electro";if(!chkOn()){$("view").innerHTML=NF;return}
 const set=CHKS.find(x=>x.id===CKS)||CHKS[0],st=ckGet()[set.id]||[];
 const items=set.items.map(it=>({it,n:P.filter(it[3]).length})).filter(x=>x.n>0);
 const done=items.filter(x=>st.indexOf(x.it[0])>-1).length;
 $("view").innerHTML=`<nav class="crumbs"><a href="#/">Головна</a><span>›</span>Чек-лист</nav><h1 class="ptitle">Чек-лист для ремонту</h1><p class="lead">Оберіть тип робіт і відмічайте, що вже враховано. Невідмічене підсвічене: перевірте, чи воно вам не потрібне.</p>
<div class="chkt">${CHKS.map(x=>`<button type="button" class="${x.id===set.id?"on":""}" data-chks="${x.id}">${x.t}</button>`).join("")}</div>
<div class="chkp">Відмічено ${done} з ${items.length}</div>
<div class="chkl">${items.map(({it,n})=>{const on=st.indexOf(it[0])>-1;return`<div class="chki${on?" on":""}"><label><input type="checkbox" data-chkc="${esc(it[0])}"${on?" checked":""}><span><b>${esc(it[0])}</b><small>${esc(it[1])}</small></span></label><a class="chkb" href="${chkHref(it[3])}">Знайти (${n}) →</a></div>`}).join("")||'<div class="empty">Для цього розділу в каталозі ще немає товарів.</div>'}</div>
<p class="sku">Кількість у дужках: скільки відповідних товарів зараз є в каталозі.</p>`}
document.addEventListener("click",e=>{let x;if(x=e.target.closest("[data-chks]")){CKS=x.dataset.chks;viewCheck();return}
 if(x=e.target.closest("[data-chkf]")){$("q").value=x.dataset.chkf;goSearch();return}});
document.addEventListener("change",e=>{const t=e.target;if(t.dataset&&t.dataset.chkc!==undefined){const o=ckGet(),a=o[CKS]||[],i=a.indexOf(t.dataset.chkc);if(t.checked&&i<0)a.push(t.dataset.chkc);if(!t.checked&&i>-1)a.splice(i,1);o[CKS]=a;SV("te_chk",o);viewCheck()}});
/* --- симулятор кольору світла --- */
const SIMR=[["kitchen","Кухня",3000,4000,"Для кухні зазвичай обирають 3000–4000K: тепле-нейтральне світло, у якому їжа виглядає натурально."],["bedroom","Спальня",2700,3000,"Для спальні радять 2700–3000K: тепле світло розслабляє й налаштовує на сон."],["office","Офіс",4000,5000,"Для офісу й роботи вдома підходить 4000–5000K: нейтральне денне світло допомагає зосередитись."]];
const SIMP=[[2700,"Тепле"],[3000,"Тепле біле"],[4000,"Нейтральне"],[5000,"Денне"],[6500,"Холодне"]];
let SIMRM="kitchen",SIMK=4000,SIMI=null,SIMB=null;
function kRGB(k){k/=100;const r=k<=66?255:329.698727446*Math.pow(k-60,-.1332047592),g=k<=66?99.4708025861*Math.log(k)-161.1195681661:288.1221695283*Math.pow(k-60,-.0755148492),b=k>=66?255:k<=19?0:138.5177312231*Math.log(k-10)-305.0447927307;return[r,g,b].map(x=>Math.max(1,Math.min(255,x)))}
function simName(k){return k<3200?"Тепле світло: затишок і відпочинок":k<4500?"Нейтральне біле: універсальне, для більшості кімнат":k<5600?"Денне світло: для роботи й зосередження":"Холодне світло: для гаражів і складів, у житлі втомлює"}
const S2L=new Float32Array(256).map((_,i)=>{const c=i/255;return c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4)}),L2S=new Uint8ClampedArray(4096).map((_,i)=>{const c=i/4095;return Math.round(255*(c<=.0031308?c*12.92:1.055*Math.pow(c,1/2.4)-.055))});
const lin1=v=>{const c=v/255;return c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4)};
function simGains(K){const a=kRGB(5000).map(lin1),b=kRGB(K).map(lin1);let g=[0,1,2].map(i=>Math.pow(b[i]/a[i],.62));const l=.2126*g[0]+.7152*g[1]+.0722*g[2],n=Math.pow(l,.8);return g.map(x=>x/n*4095)}
function simPaint(base,cv,K){const g=simGains(K),ctx=cv.getContext("2d"),o=base.data,d=ctx.createImageData(cv.width,cv.height),n=d.data,L=o.length,g0=g[0],g1=g[1],g2=g[2];for(let i=0;i<L;i+=4){n[i]=L2S[Math.min(4095,S2L[o[i]]*g0|0)];n[i+1]=L2S[Math.min(4095,S2L[o[i+1]]*g1|0)];n[i+2]=L2S[Math.min(4095,S2L[o[i+2]]*g2|0)];n[i+3]=255}ctx.putImageData(d,0,0)}
function simDraw(){const c=$("simc");if(!c||!SIMB)return;simPaint(SIMB,c,SIMK)}
function simThumbs(im){document.querySelectorAll("[data-simt]").forEach(cv=>{const t=document.createElement("canvas");t.width=cv.width=320;t.height=cv.height=Math.round(320*im.naturalHeight/im.naturalWidth);const x=t.getContext("2d");x.drawImage(im,0,0,t.width,t.height);simPaint(x.getImageData(0,0,t.width,t.height),cv,+cv.dataset.simt)})}
let simRaf=0;const simSoon=()=>{cancelAnimationFrame(simRaf);simRaf=requestAnimationFrame(simDraw)};
function simLabels(){const room=SIMR.find(x=>x[0]===SIMRM),k=SIMK;$("simk").textContent=k+"K";$("simn").textContent=simName(k);
 const ok=k>=room[2]&&k<=room[3];$("simt").innerHTML=`${esc(room[4])}<br><b class="${ok?"simok":""}">${ok?"✓ Це рекомендований діапазон для цієї кімнати.":"Рекомендовано для цієї кімнати: "+room[2]+"–"+room[3]+"K."}</b>`;
 const term=k<3500?"3000K":k<5200?"4100K":"6500K",n=P.filter(p=>p.n.indexOf(term)>-1).length;$("simf").innerHTML=n?`<button type="button" class="go" data-simf="${term}">Знайти лампи ${term} (${n}) →</button>`:"";
 document.querySelectorAll("[data-simk]").forEach(b=>b.classList.toggle("on",+b.dataset.simk===k))}
function simLoad(){const im=new Image();SIMB=null;im.onload=()=>{if(!$("simc"))return;const c=$("simc");c.width=im.naturalWidth;c.height=im.naturalHeight;const x=c.getContext("2d");x.drawImage(im,0,0);SIMB=x.getImageData(0,0,c.width,c.height);simDraw();simThumbs(im)};im.onerror=()=>{const f=$("simf");if(f)f.textContent="Не вдалося завантажити зображення."};im.src=BASE+"sim-"+SIMRM+".webp"}
function viewLight(){document.title="Підбір кольору світла — Trend Electro";if(!simOn()){$("view").innerHTML=NF;return}
 $("view").innerHTML=`<div class="tpg"><nav class="crumbs"><a href="#/">Головна</a><span>›</span>Підбір кольору світла</nav><h1 class="ptitle">Підбір кольору світла</h1><p class="lead">3000K, 4000K чи 6500K? Пересувайте повзунок і дивіться, як змінюється кімната.</p>
<div class="chkt">${SIMR.map(r=>`<button type="button" class="${r[0]===SIMRM?"on":""}" data-simr="${r[0]}">${r[1]}</button>`).join("")}</div>
<div class="simgrid"><div class="simw"><canvas id="simc" width="1264" height="848" aria-label="Кімната з вибраним кольором світла"></canvas></div>
<div class="simc"><div class="simh"><b id="simk"></b><span id="simn"></span></div><input type="range" id="simr" min="2700" max="6500" step="100" value="${SIMK}" aria-label="Колірна температура, Кельвіни"><div class="simp">${SIMP.map(x=>`<button type="button" data-simk="${x[0]}">${x[0]}K<small>${x[1]}</small></button>`).join("")}</div><p class="simt" id="simt"></p><div class="simcmp"><div class="simcmph">Порівняйте поруч</div><div class="simcmpg">${[3000,4000,6500].map(k=>`<button type="button" data-simk="${k}"><canvas data-simt="${k}" width="320" height="214"></canvas><b>${k}K</b></button>`).join("")}</div></div><div id="simf"></div><p class="sku">Орієнтовна візуалізація: кольори залежать від екрана вашого пристрою. Колірна температура вказана в характеристиках кожної лампи.</p></div></div></div>`;simLabels();simLoad()}
document.addEventListener("input",e=>{if(e.target.id==="simr"){SIMK=+e.target.value;simLabels();simSoon()}});
document.addEventListener("click",e=>{let x;if(x=e.target.closest("[data-simr]")){SIMRM=x.dataset.simr;const r=SIMR.find(q=>q[0]===SIMRM);SIMK=Math.round((r[2]+r[3])/200)*100;viewLight();return}
 if(x=e.target.closest("[data-simk]")){SIMK=+x.dataset.simk;const s=$("simr");if(s)s.value=SIMK;simLabels();simSoon();return}
 if(x=e.target.closest("[data-simf]")){$("q").value=x.dataset.simf;goSearch()}});

/* потягнути вниз, щоб оновити (iPhone у встановленому додатку) */
if(IOS&&STANDALONE){let y0=0,x0=0,dy=0,on=false,bar=null;
 const mk=()=>{if(!bar){bar=document.createElement("div");bar.className="ptr";bar.innerHTML="<span></span>";document.body.appendChild(bar)}return bar};
 const hide=()=>{if(bar){bar.classList.remove("on","go");bar.style.opacity=0}};
 addEventListener("touchstart",e=>{on=false;dy=0;if(window.scrollY>0||e.touches.length!==1||e.target.closest("aside,[role=dialog],input,textarea,select,.hrow,.chkt,.cmpw,.drawer,.panel"))return;y0=e.touches[0].clientY;x0=e.touches[0].clientX;on=true},{passive:true});
 addEventListener("touchmove",e=>{if(!on)return;const t=e.touches[0];dy=t.clientY-y0;if(window.scrollY>0||dy<=0||Math.abs(t.clientX-x0)>dy){hide();return}const b=mk(),p=Math.min(1,dy/90);b.style.opacity=p;b.style.transform=`translate(-50%,${Math.min(dy,110)*.5}px)`;b.classList.toggle("go",dy>90);b.firstChild.textContent=dy>90?"Відпустіть, щоб оновити":"Потягніть вниз, щоб оновити"},{passive:true});
 addEventListener("touchend",()=>{if(on&&dy>90&&window.scrollY<=0){const b=mk();b.classList.add("on");b.firstChild.textContent="Оновлюємо…";setTimeout(()=>location.reload(),150)}else hide();on=false;dy=0},{passive:true})}

/* ===== Колір фурнітури, конструктор рамки, Мої об'єкти ===== */
const frameOn=()=>!SHOP.frame_off,objOn=()=>!SHOP.obj_off;
const COLEX=/(?:світл\.?\s*)?(?:біл|син|зелен|червон|жовт|оранж|помаранч|неон)\w*\.?\s*(?:індикатор|підсвіт|ламп|світлод)\w*|з\s+індикатор\w*(?:\s*\(\w\))?|з\s+підсвіт\w*/g;
const COLL=[["Графіт",/графіт/],["Антрацит",/антрацит/],["Срібло",/срібл|сріб\b|алюмін|титан/],["Золото",/золот/],["Кремовий",/крем/],["Чорний",/чорн/],["Білий",/біл/],["Сірий",/(?:^|[^а-яіїє])сір/],["Дуб",/(?:^|[^а-яіїє])дуб/],["Горіх",/горіх|орех/],["Вишня",/вишн/],["Бронза",/бронз/]];
const COLHEX={"Білий":"#f5f5f2","Чорний":"#1e1e20","Графіт":"#4b4e53","Антрацит":"#393c40","Срібло":"#c5c8cb","Золото":"#c9a44f","Кремовий":"#efe2bf","Сірий":"#9a9ea3","Дуб":"#b98c55","Горіх":"#7b5334","Вишня":"#8c3d30","Бронза":"#8a6a3f"};
function pCol(n){const s=String(n).toLowerCase().replace(COLEX," ");let b=null;for(const[k,rx]of COLL){const m=rx.exec(s);if(m&&(b===null||m.index<b[0]))b=[m.index,k]}return b?b[1]:""}
/* --- конструктор рамки (серія RITA) --- */
const RCOL={"білий":"#f5f5f2","крем":"#efe2bf","чорний":"#1e1e20","графіт":"#4b4e53","антрацит":"#393c40","срібло":"#c5c8cb","титан":"#9ba0a5","золото":"#c9a44f","дуб":"#b98c55","горіх":"#7b5334","вишня":"#8c3d30","сірий":"#9a9ea3"};
const rcolOf=n=>{const m=String(n).match(/Mutlusan,\s*"?([^",(]+?)"?\s*(?:,|\()/i);return m?m[1].trim().toLowerCase():""};
const capF=s=>s.charAt(0).toUpperCase()+s.slice(1);
const FNUM=[[/одно/i,1],[/дво/i,2],[/три/i,3],[/чотири/i,4],[/п.ят/i,5],[/шести/i,6]];
let FR=null,CST={col:"",n:2,ori:"h",slots:[]};
function frIdx(){const R=P.filter(p=>p.c[0]==="Розетки та вимикачі"&&/RITA/.test(p.n)&&p.st!==false),F=[],Mx=[];
 R.forEach(p=>{const col=rcolOf(p.n);if(!col)return;const sub=p.c.join(" ");
  if(/Рамки/.test(sub)&&/^Рамка/i.test(p.n)){const m=p.n.match(/(одно|дво|три|чотири|п.ят\S*|шести)місн/i);if(!m)return;const n=(FNUM.find(x=>x[0].test(m[1]))||[0,0])[1];if(!n)return;F.push({p,col,n,ori:/горизонтальн/i.test(p.n)?"h":/вертикальн/i.test(p.n)?"v":"a"})}
  else if(/Механізм|Діммер/i.test(sub+" "+p.n)&&!/горизонтальн|подвійн|2гн/i.test(p.n)&&/^(Механізм|Діммер)/i.test(p.n)){const t=capF(p.n.split(/\s+RITA/)[0].replace(/,\s*$/,"").replace(/^Механізм\s+/i,"").replace(/\s+/g," ").trim());Mx.push({p,col,type:t})}});
 return FR={F,M:Mx}}
const frRank=t=>/^розетки з\/з, 16А$/i.test(t)?0:/^розетк/i.test(t)?1:/^вимикач/i.test(t)?2:3;
function frTypes(col){const s=[...new Set(FR.M.filter(m=>m.col===col).map(m=>m.type))];return s.sort((a,b)=>frRank(a)-frRank(b)||a.localeCompare(b,"uk"))}
function frCols(){const fc=new Set(FR.F.map(f=>f.col));return[...new Set(FR.M.map(m=>m.col))].filter(c=>fc.has(c)).sort((a,b)=>Object.keys(RCOL).indexOf(a)-Object.keys(RCOL).indexOf(b))}
function frLum(h){const v=[1,3,5].map(i=>parseInt(h.substr(i,2),16)/255);return .2126*v[0]+.7152*v[1]+.0722*v[2]}
function frSym(t,fg){const s=t.toLowerCase(),st=`stroke="${fg}" stroke-width="2"`;
 if(/вимикач|перемикач/.test(s)){const k=+((s.match(/(\d)\s*кл/)||[0,1])[1])||1,w=34/k;let r="";for(let i=0;i<k;i++)r+=`<rect x="${13+i*w+1.5}" y="12" width="${w-3}" height="36" rx="3" fill="none" ${st}/>`;return r+(/прохідн/.test(s)?`<path d="M24 54h12" ${st}/>`:"")}
 if(/діммер|димер/.test(s))return`<circle cx="30" cy="30" r="15" fill="none" ${st}/><path d="M30 30V18" stroke="${fg}" stroke-width="3" stroke-linecap="round"/>`;
 const tx=/hdmi/.test(s)?"HDMI":/sat/.test(s)?"SAT":/\btv\b|телевіз/.test(s)?"TV":/usb/.test(s)?"USB":/комп.ютер|rj/.test(s)?"RJ45":/телефон/.test(s)?"TEL":"";
 if(tx)return`<text x="30" y="35" text-anchor="middle" font-size="${tx.length>3?11:15}" font-weight="700" fill="${fg}" font-family="Manrope,sans-serif">${tx}</text>`;
 let r=`<circle cx="30" cy="30" r="17" fill="none" ${st}/><circle cx="23" cy="30" r="2.6" fill="${fg}"/><circle cx="37" cy="30" r="2.6" fill="${fg}"/>`;if(/з\/з|заземл/.test(s))r+=`<path d="M30 10v5M30 45v5" stroke="${fg}" stroke-width="3"/>`;return r}
function frSvg(n,ori,fh,cells){const v=ori==="v"&&n>1,W=v?84:n*60+24,H=v?n*60+24:84,fg=h=>frLum(h)<.5?"#ececec":"#333";
 return`<svg viewBox="0 0 ${W+16} ${H+16}" class="frsvg" role="img" aria-label="Блок із ${n} місць"><defs><filter id="frsh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity=".25"/></filter></defs><g transform="translate(8 8)"><rect width="${W}" height="${H}" rx="9" fill="${fh}" stroke="rgba(0,0,0,.25)" filter="url(#frsh)"/>${cells.map((c,i)=>{const x=v?12:12+i*60,y=v?12+i*60:12,mh=c.hex;return`<g transform="translate(${x} ${y})"><rect width="60" height="60" rx="5" fill="${mh}" stroke="rgba(0,0,0,.28)"/>${frSym(c.type,fg(mh))}</g>`}).join("")}</g></svg>`}
function frFix(){const cs=frCols();if(!cs.length)return false;if(cs.indexOf(CST.col)<0)CST.col=cs.indexOf("білий")>-1?"білий":cs[0];
 const ns=[...new Set(FR.F.filter(f=>f.col===CST.col).map(f=>f.n))].sort((a,b)=>a-b);if(!ns.length)return false;if(ns.indexOf(CST.n)<0)CST.n=ns.filter(x=>x<=CST.n).pop()||ns[0];
 const os=[...new Set(FR.F.filter(f=>f.col===CST.col&&f.n===CST.n).map(f=>f.ori))];const opts=os.indexOf("a")>-1?["a"]:os;if(opts.indexOf(CST.ori)<0)CST.ori=opts[0]||"h";
 const ty=frTypes(CST.col);CST.slots=Array.from({length:CST.n},(_,i)=>ty.indexOf(CST.slots[i])>-1?CST.slots[i]:ty[0]);return{cs,ns,opts,ty}}
function viewFrame(){document.title="Конструктор рамки — Trend Electro";if(!frameOn()){$("view").innerHTML=NF;return}
 frIdx();const k=frFix();const cr='<nav class="crumbs"><a href="#/">Головна</a><span>›</span>Конструктор рамки</nav><h1 class="ptitle">Конструктор рамки</h1>';
 if(!k){$("view").innerHTML=cr+'<div class="empty">Для конструктора поки немає потрібних товарів у каталозі. <a href="#/c/">До каталогу</a></div>';return}
 $("view").innerHTML='<div class="tpg">'+cr+'<p class="lead">Серія RITA (Mutlusan): оберіть колір, кількість місць і що поставити в кожне гніздо. Нижче побачите список товарів і суму.</p><div id="frm"></div><p class="sku">Малюнок схематичний: він показує розташування й колір, а не точний вигляд механізмів.</p></div>';frDraw()}
function frDraw(){const e=$("frm");if(!e)return;const k=frFix();if(!k)return;
 const fp=FR.F.find(f=>f.col===CST.col&&f.n===CST.n&&(f.ori===CST.ori||f.ori==="a")),fh=RCOL[CST.col]||"#d9d9d9";
 const cells=CST.slots.map(t=>{const m=FR.M.find(x=>x.col===CST.col&&x.type===t);return{type:t,hex:RCOL[CST.col]||"#d9d9d9",m}});
 const lines=[];if(fp)lines.push({p:fp.p,q:1,l:"Рамка"});const g={};cells.forEach(c=>{if(c.m)g[c.m.p.id]=(g[c.m.p.id]||0)+1});Object.keys(g).forEach(id=>lines.push({p:M[id]||FR.M.find(x=>x.p.id===id).p,q:g[id],l:""}));
 const tot=Math.round(lines.reduce((s,x)=>s+priceInfo(x.p).pc*x.q,0)*100)/100;
 e.innerHTML=`<div class="frgrid"><div class="frctl"><b>Колір</b><div class="frcols">${k.cs.map(c=>`<button type="button" class="fcol${c===CST.col?" on":""}" data-fcol="${esc(c)}"><i style="background:${RCOL[c]||"#ccc"}"></i>${esc(capF(c))}</button>`).join("")}</div>
<b>Кількість місць</b><div class="frcols">${k.ns.map(n=>`<button type="button" class="fcol${n===CST.n?" on":""}" data-fn="${n}">${n}</button>`).join("")}</div>
${CST.n>1&&k.opts.length>1?`<b>Положення</b><div class="frcols">${k.opts.map(o=>`<button type="button" class="fcol${o===CST.ori?" on":""}" data-fori="${o}">${o==="h"?"Горизонтально":"Вертикально"}</button>`).join("")}</div>`:""}</div>
<div class="frprev">${frSvg(CST.n,CST.ori,fh,cells)}</div>
<div class="frslots">${CST.slots.map((t,i)=>`<label>Місце ${i+1}<select data-fslot="${i}">${k.ty.map(x=>`<option value="${esc(x)}"${x===t?" selected":""}>${esc(x)}</option>`).join("")}</select></label>`).join("")}</div>
<div class="frsum"><h3>Що потрібно купити</h3>${fp?"":'<div class="msg">Для такого кольору й положення рамки немає в наявності. Змініть вибір.</div>'}<table class="estt"><tbody>${lines.map(x=>`<tr><td>${x.l?"<b>"+x.l+"</b>: ":""}<a href="#/p/${encodeURIComponent(x.p.id)}">${esc(x.p.n)}</a></td><td class="r">${x.q} × ${money(priceInfo(x.p).pc)}</td></tr>`).join("")}</tbody><tfoot><tr><td class="r"><b>Разом</b></td><td class="r"><b>${money(tot)}</b></td></tr></tfoot></table>
<p>${SHOP.orders_off?"":'<button type="button" class="go" data-fadd>Додати все в кошик</button> '}${estOn()?'<button type="button" class="btn" data-fest>Кошторис у PDF</button>':""}</p></div></div>`;
 e._lines=lines}
function frAdd(est){const e=$("frm");if(!e||!e._lines)return;e._lines.forEach(x=>{cart[x.p.id]=Math.min(999,(cart[x.p.id]||0)+x.q)});save();drawCart();if(est)location.hash="#/est";else toast("Додано в кошик",1)}
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-fcol]")){CST.col=x.dataset.fcol;frDraw();return}
 if(x=e.target.closest("[data-fn]")){CST.n=+x.dataset.fn;frDraw();return}
 if(x=e.target.closest("[data-fori]")){CST.ori=x.dataset.fori;frDraw();return}
 if(e.target.closest("[data-fadd]")){frAdd(false);return}
 if(e.target.closest("[data-fest]")){frAdd(true);return}
 if(e.target.closest("[data-objs]")){objSave();return}
 if(x=e.target.closest("[data-objo]")){objOpen(+x.dataset.objo);return}
 if(x=e.target.closest("[data-objc]")){objCart(+x.dataset.objc);return}
 if(x=e.target.closest("[data-objd]")){objDel(+x.dataset.objd);return}});
document.addEventListener("change",e=>{const t=e.target;if(t.dataset&&t.dataset.fslot!==undefined){CST.slots[+t.dataset.fslot]=t.value;frDraw()}});
/* --- Мої об'єкти --- */
let OBJS=[];
async function objLoad(){const e=$("objs");if(!e||!objOn()||!me||!sb)return;const r=await sb.from("user_objects").select("id,name,items,updated_at").order("updated_at",{ascending:false});if(r.error){e.innerHTML="";return}
 OBJS=r.data||[];const sum=o=>Math.round(Object.keys(o.items||{}).reduce((s,id)=>s+(M[id]?priceInfo(M[id]).pc*(+o.items[id]||0):0),0)*100)/100;
 e.innerHTML=`<h3 style="margin:6px 0">Мої об’єкти</h3>${OBJS.length?OBJS.map(o=>`<div class="pcode objr"><div><b>${esc(o.name)}</b><small>${Object.keys(o.items||{}).length} позицій · ${money(sum(o))}</small></div><div class="objb"><button data-objo="${o.id}">Кошторис</button>${SHOP.orders_off?"":`<button data-objc="${o.id}">У кошик</button>`}<button data-objd="${o.id}" aria-label="Видалити">✕</button></div></div>`).join(""):'<div class="sku">Тут з’являться збережені об’єкти. Збережіть кошторис кнопкою «Зберегти як об’єкт», і потім зможете швидко дозамовити матеріали.</div>'}`}
async function objSave(){if(!me){toast("Увійдіть у кабінет, щоб зберігати об’єкти");panel("acc",true);drawAcc();return}
 const name=(EST.obj||"").trim().slice(0,120);if(!name){toast("Вкажіть назву у полі «Об’єкт або клієнт»");const i=$("eobj");if(i)i.focus();return}
 const items={};Object.keys(EST.q).forEach(id=>{items[id]=EST.q[id]});let r;
 if(EST.oid)r=await sb.from("user_objects").update({name,items,updated_at:new Date().toISOString()}).eq("id",EST.oid).select("id").maybeSingle();else r=await sb.from("user_objects").insert({name,items}).select("id").maybeSingle();
 if(r.error){toast(/does not exist|schema cache|relation/i.test(r.error.message||"")?"Ця функція ще не ввімкнена на сервері":"Не вдалося зберегти, спробуйте ще раз");return}
 if(r.data)EST.oid=r.data.id;toast("Збережено в «Мої об’єкти»");drawEst()}
function objFind(id){return OBJS.find(o=>o.id===id)}
function objOpen(id){const o=objFind(id);if(!o)return;ESTPRE=o;closeAll();if(curH()==="#/est")viewEst(false);else location.hash="#/est"}
function objCart(id){const o=objFind(id);if(!o)return;let n=0;Object.keys(o.items||{}).forEach(k=>{if(M[k]){cart[k]=Math.min(999,(cart[k]||0)+Math.max(1,Math.floor(+o.items[k])||1));n++}});save();drawCart();toast(n?"Додано в кошик: "+n+" позицій":"Товарів із цього об’єкта вже немає в каталозі",n?1:0)}
async function objDel(id){if(!confirm("Видалити цей об’єкт?"))return;const r=await sb.from("user_objects").delete().eq("id",id);if(r.error){toast("Не вдалося видалити");return}objLoad()}
