// Перевірка сайту перед публікацією. Запуск: node tools/check.js
// Ловить: синтаксичні помилки, однакові назви функцій (одна перекриває іншу), виклики неіснуючих функцій у навігації,
// зламані посилання на скрипти. Якщо є помилка — код виходу 1 (публікацію не можна).
const fs=require("fs"),vm=require("vm");
let bad=0;const err=m=>{bad++;console.log("✗ "+m)},ok=m=>console.log("✓ "+m);
const rd=f=>fs.readFileSync(f,"utf8");
// 1. синтаксис
for(const f of ["app.js","sw.js","config.js"]){if(!fs.existsSync(f))continue;try{new vm.Script(rd(f),{filename:f});ok("синтаксис "+f)}catch(e){err("синтаксична помилка в "+f+": "+e.message)}}
try{const h=rd("admin.html"),bl=h.match(/<script(?![^>]*src)[^>]*>[\s\S]*?<\/script>/g)||[];bl.forEach((b,i)=>new vm.Script(b.replace(/<\/?script[^>]*>/g,""),{filename:"admin.html#"+i}));ok("синтаксис admin.html ("+bl.length+" скриптів)")}catch(e){err("синтаксична помилка в admin.html: "+e.message)}
// 2. дублікати імен верхнього рівня в app.js
const app=rd("app.js"),names={};
for(const m of app.matchAll(/^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/gm))(names[m[1]]=names[m[1]]||[]).push("function");
for(const m of app.matchAll(/^(?:const|let|var)\s+([A-Za-z_$][\w$]*)/gm))(names[m[1]]=names[m[1]]||[]).push("змінна");
const dup=Object.entries(names).filter(([k,v])=>v.length>1);
dup.length?dup.forEach(([k,v])=>err("ім'я «"+k+"» оголошене "+v.length+" рази — одне перекриває інше")):ok("дублікатів імен немає ("+Object.keys(names).length+" імен)");
// 3. виклики view*() у навігації існують
const rt=app.slice(app.indexOf('h.indexOf("#/p/")===0)viewProduct'),app.indexOf('requestAnimationFrame(hbInit)')+40);
const called=[...new Set([...rt.matchAll(/\b(view[A-Z]\w*)\(/g)].map(m=>m[1]))];
called.forEach(n=>{if(!names[n])err("навігація викликає «"+n+"», але такої функції немає")});
ok("навігація: "+called.length+" сторінок");
// 4. ключові маршрути мають бути на місці
for(const [k,fn] of [['"#/c")===0','viewList'],['"#/p/")===0','viewProduct'],['"#/fav"','viewFav'],['"#/cmp"','viewCmp']]){const i=rt.indexOf(k);if(i<0){err("зник маршрут "+k);continue}const seg=rt.slice(i,i+120);if(seg.indexOf(fn+"(")<0)err("маршрут "+k+" більше не веде на "+fn);else if((names[fn]||[]).length!==1)err(fn+" має бути одна")}
ok("ключові маршрути (каталог, товар, обране, порівняння)");
// 5. index.html: скрипти існують
const ix=rd("index.html");for(const m of ix.matchAll(/(?:src|href)="([^"?#:]+\.(?:js|css))(?:\?[^"]*)?"/g)){if(!fs.existsSync(m[1]))err("index.html посилається на неіснуючий файл "+m[1])}
ok("посилання index.html на файли");
console.log(bad?"\nПЕРЕВІРКА НЕ ПРОЙДЕНА: "+bad+" помилок. Публікувати НЕ МОЖНА.":"\nУсе гаразд.");process.exit(bad?1:0);
