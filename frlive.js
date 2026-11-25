/* Trend Electro: «живі» картинки для конструктора рамки (#/frame), серія RITA.
   Малює блок і окремі механізми у SVG у кольорах, знятих із фото товарів. Завантажується лише на сторінці конструктора.
   Якщо цей файл не завантажиться, конструктор працює зі старим малюнком і списками. */
(function(){
"use strict";
/* справжні фактури, вирізані з фото товарів: колір → файл frtex-*.webp */
const SRC=(document.currentScript&&document.currentScript.src)||"",TXB=SRC.replace(/[^\/]*$/,""),TXF={"дуб":"oak","горіх":"walnut","вишня":"cherry","графіт":"graphite","золото":"gold","срібло":"silver","титан":"titan"};
/* колір: [основа, вид поверхні] */
const PAL={"білий":["#f1eee7","gloss"],"крем":["#ecdfc0","gloss"],"чорний":["#333134","gloss"],"графіт":["#736e61","metal"],"антрацит":["#45474a","metal"],"срібло":["#b2b3ae","metal"],"титан":["#a8a28b","metal"],"золото":["#bda764","metal"],"сірий":["#9a9ea3","gloss"],"дуб":["#b88f3b","wood"],"горіх":["#4e3d31","wood"],"вишня":["#82523f","wood"]};
/* одинарні роз’єми, які на фото цих кольорів стоять по центру без другого віконця */
const ONE={"титан":"tel","срібло":"tel","золото":"tel","дуб":"tel","горіх":"tel","вишня":"hdmi"};
const S=100,B=27,G=32;
let N=0;
const rgb=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16));
const mix=(h,a)=>"#"+rgb(h).map(v=>("0"+Math.round(v+((a<0?0:255)-v)*Math.abs(a)).toString(16)).slice(-2)).join("");
const lum=h=>{const v=rgb(h);return(.2126*v[0]+.7152*v[1]+.0722*v[2])/255};
const f1=v=>Math.round(v*10)/10;
function rnd(seed){let s=seed;return()=>(s=(s*16807)%2147483647)/2147483647}
const R=(x,y,w,h,r,a)=>`<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${r}" ${a}/>`;
const C=(x,y,r,a)=>`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" ${a}/>`;
const P=(d,a)=>`<path d="${d}" ${a}/>`;
/* що намалювати за назвою механізму */
function kind(name){const s=String(name).toLowerCase(),ind=/індикатор|світл\.?\s*інд|підсвіт/.test(s),two=/(^|[^\d])2\s*гн/.test(s);
 if(/заглушк/.test(s))return{k:"blank"};
 if(/діммер|димер/.test(s))return{k:"dim"};
 if(/жалюз/.test(s))return{k:"blinds"};
 if(/картков/.test(s))return{k:"card"};
 if(/вимикач|перемикач/.test(s)){const m=s.match(/(\d)\s*кл/),keys=Math.min(3,Math.max(1,m?+m[1]:1));
  return{k:"key",keys,ind,mark:/дзвінк/.test(s)?"bell":/кнопков/.test(s)?"lamp":/перехрес/.test(s)?"cross":/прохідн/.test(s)?"pass":""}}
 if(/аудіо/.test(s))return{k:"audio"};
 if(/tv\s*\/\s*sat/.test(s))return{k:"tvsat"};
 if(/sat|супутн/.test(s))return{k:"sat"};
 if(/hdmi/.test(s))return{k:"hdmi"};
 if(/(^|[^a-z])tv([^a-z]|$)|телевіз/.test(s))return{k:"tv",pin:/папа/.test(s)};
 if(/комп.*телеф/.test(s))return{k:"rj",j:["tel","lan"]};
 if(/комп.ютер|rj/.test(s))return{k:"rj",j:two?["lan","lan"]:["lan"]};
 if(/телефон/.test(s))return{k:"rj",j:two?["tel","tel"]:["tel"]};
 if(/usb/.test(s)){const c=/type-?\s*c/.test(s);return/з\/з|б\/з/.test(s)?{k:"sockusb",c,shut:/шторк/.test(s)}:{k:"usb",c}}
 if(/розетк/.test(s)){if(/бризкозах|кришк/.test(s))return{k:"lid"};return{k:"sock",earth:!/б\/з/.test(s),shut:/шторк/.test(s)}}
 return{k:"blank"}}
/* спільні градієнти та фактура поверхні */
function defs(u,col){const p=PAL[col]||["#d9d9d9","gloss"],c=p[0],t=p[1],dark=lum(c)<.45;
 const st=a=>a.map(s=>`<stop offset="${s[0]}" stop-color="${s[1]}"${s[2]===undefined?"":` stop-opacity="${s[2]}"`}/>`).join("");
 const lg=(id,x2,y2,a)=>`<linearGradient id="${u}${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${st(a)}</linearGradient>`;
 const rg=(id,cx,cy,r,a)=>`<radialGradient id="${u}${id}" cx="${cx}" cy="${cy}" r="${r}">${st(a)}</radialGradient>`;
 const file=TXF[col],img=file?`${TXB}frtex-${file}.webp?v=1`:"";
 const pat=(id,dx,dy)=>`<pattern id="${u}${id}" patternUnits="userSpaceOnUse" x="${dx}" y="${dy}" width="180" height="180"><image href="${img}" width="180.5" height="180.5" preserveAspectRatio="none"/></pattern>`;
 const hi=dark?.18:.55;
 /* на однотонних і темних кольорах світло поверх фактури, щоб лишався об’єм */
 const k=t==="gloss"?1:t==="metal"?.8:.55;
 return{c,t,dark,col,ink:dark?mix(c,.55):mix(c,-.55),tx:!!file,u,
 d:`<defs>${file?pat("tx",0,0)+pat("tm",61,47):""}${lg("body",1,1,[[0,mix(c,dark?.1:.3)],[.5,c],[1,mix(c,-.12)]])}${lg("sheen",1,1,[[0,"#fff",(dark?.13:.3)*k],[.38,"#fff",.02],[.62,"#000",0],[1,"#000",.2*k+.04]])}${lg("shine",.35,1,[[0,"#fff",0],[.3,"#fff",0],[.44,"#fff",file?.06:dark?.09:.14],[.58,"#fff",0],[1,"#fff",0]])}${lg("keyr",0,1,[[0,"#000",.09],[.16,"#fff",0],[.52,"#fff",file?.07:dark?.12:.3],[.86,"#000",.05],[1,"#000",.2]])}${lg("edge",1,1,[[0,"#fff",hi+.3],[.45,"#fff",0],[.55,"#000",0],[1,"#000",.38]])}${lg("edgei",1,1,[[0,"#000",.46],[.45,"#000",0],[.55,"#fff",0],[1,"#fff",hi+.15]])}${rg("ring",.34,.28,.95,[[0,"#fff",dark?.2:.5],[.55,"#fff",0],[1,"#000",.22]])}${rg("cup",.64,.72,.86,[[0,"#fff",dark?.05:.1],[.5,"#000",.05],[.82,"#000",.2],[1,"#000",.42]])}${rg("metal",.35,.3,.8,[[0,"#ffffff"],[.35,"#cfd2d4"],[.75,"#85898d"],[1,"#505357"]])}${lg("brass",1,1,[[0,"#fff3c6"],[.35,"#d9b254"],[.7,"#a67d27"],[1,"#6b4e14"]])}</defs>`}}
/* матеріал фігури: основний колір, справжня фактура (якщо є) і світло */
const skin=(D,shape,m)=>shape(`fill="${D.c}"`)+(D.tx?shape(`fill="url(#${D.u}${m?"tm":"tx"})"`):"")+shape(`fill="url(#${D.u}sheen)"`);
/* фаска по краю прямокутника: чотири грані з різним освітленням (down — заглиблення) */
function bevel(D,x,y,w,h,b,down){const f=D.dark?[.17,.09,.2,.34]:D.tx?[.4,.22,.17,.3]:[.7,.4,.13,.24],o=down?[["#000",f[3]+.08],["#000",f[2]+.1],["#fff",f[1]],["#fff",f[0]]]:[["#fff",f[0]],["#fff",f[1]],["#000",f[2]],["#000",f[3]]];
 const q=[`M${x} ${y}h${w}l${-b} ${b}h${-(w-2*b)}z`,`M${x} ${y}l${b} ${b}v${h-2*b}l${-b} ${b}z`,`M${x+w} ${y}v${h}l${-b} ${-b}v${-(h-2*b)}z`,`M${x} ${y+h}l${b} ${-b}h${w-2*b}l${b} ${b}z`];
 return q.map((d,i)=>P(d,`fill="${o[i][0]}" opacity="${f1(o[i][1])}"`)).join("")}
/* плоска деталь: матеріал і тонка світла кромка */
function slab(D,x,y,w,h,r,fill){const u=D.u;
 return skin(D,a=>R(x,y,w,h,r,a),1)+(fill==="keyr"?R(x,y,w,h,r,`fill="url(#${u}keyr)"`):"")+R(x+.7,y+.7,w-1.4,h-1.4,r,`fill="none" stroke="url(#${u}edge)" stroke-width="1.4"`)}
/* кругла деталь із того самого матеріалу */
const disc=(D,x,y,r)=>skin(D,a=>C(x,y,r,a),1);
function screw(D,x,y,r){return C(x,y+.8,r+1.2,`fill="#000" opacity=".22"`)+C(x,y,r,`fill="url(#${D.u}metal)"`)+P(`M${f1(x-r*.55)} ${y}h${f1(r*1.1)}M${x} ${f1(y-r*.55)}v${f1(r*1.1)}`,`stroke="#3c3f42" stroke-width="${f1(r*.28)}" stroke-linecap="round" fill="none"`)}
function hole(x,y,r,shut){return C(x,y,r+1.1,`fill="#000" opacity=".28"`)+C(x,y,r,`fill="${shut?"#8f9092":"#0d0d0e"}"`)+(shut?R(x-r*.7,y-1,r*1.4,2,1,`fill="#35363a"`):C(x+r*.2,y+r*.25,r*.45,`fill="#35363a" opacity=".7"`))}
function usbA(x,y,w,h){return R(x-w/2-1.6,y-h/2-1.6,w+3.2,h+3.2,2.2,`fill="#000" opacity=".25"`)+R(x-w/2,y-h/2,w,h,1.4,`fill="#c9ccce"`)+R(x-w/2+1.4,y-h/2+1.4,w-2.8,h-2.8,.8,`fill="#111214"`)+R(x-w/2+3,y-.2,w-6,h*.26,.4,`fill="#e9ecef"`)}
function usbC(x,y,w,h){return R(x-w/2-1.4,y-h/2-1.4,w+2.8,h+2.8,(h+2.8)/2,`fill="#000" opacity=".28"`)+R(x-w/2,y-h/2,w,h,h/2,`fill="#0c0d0f" stroke="#9ea2a6" stroke-width="1"`)+R(x-w/2+4,y-1,w-8,2,1,`fill="#5c6064"`)}
function jack(x,y,type){const w=type==="tel"?19:23,h=type==="tel"?23:26,t=y-h/2,l=x-w/2;
 return R(l-3,t-3,w+6,h+6,2,`fill="#f3f1ea" stroke="#000" stroke-opacity=".28" stroke-width=".8"`)+P(`M${l+2} ${t+3}h${w-4}v${h-12}h-4v4h-3v3h-${w-18}v-3h-3v-4h-4z`,`fill="#17181a"`)+Array.from({length:type==="tel"?4:6},(_,i)=>R(l+4+i*(w-9.4)/(type==="tel"?3:5),t+4,1.2,7,.3,`fill="#d3ae52"`)).join("")}
function hdmi(x,y){return R(x-10,y-17,20,34,2,`fill="#eeece6" stroke="#000" stroke-opacity=".3"`)+P(`M${x-6} ${y-13}h9l3.5 4.5v17l-3.5 4.5h-9z`,`fill="#101113"`)+R(x-2.5,y-8,2.4,16,.6,`fill="#d3ae52"`)}
function dashed(D,x,y,w,h){return R(x-w/2,y-h/2,w,h,1.5,`fill="${mix(D.c,D.dark?.06:-.05)}" stroke="${D.ink}" stroke-width="1.6" stroke-dasharray="5 3.4" opacity=".85"`)}
function coax(D,x,y,r,type){let o=C(x,y+1.6,r+2.2,`fill="#000" opacity=".25"`)+C(x,y,r+1.5,`fill="url(#${D.u}ring)"`);
 if(type==="silver")o+=C(x,y,r,`fill="url(#${D.u}metal)"`)+C(x,y,r*.62,`fill="#5d6165"`)+C(x,y,r*.5,`fill="url(#${D.u}metal)"`)+C(x,y,r*.16,`fill="#2b2d30"`);
 else if(type==="sat")o+=C(x,y,r,`fill="#1a1b1d"`)+C(x,y,r*.74,`fill="none" stroke="#55595e" stroke-width="1.6"`)+C(x,y,r*.45,`fill="url(#${D.u}metal)"`)+C(x,y,r*.22,`fill="#0b0b0c"`);
 else o+=C(x,y,r,`fill="#151618"`)+C(x,y,r*.68,`fill="#050505" stroke="#46494d" stroke-width="1.2"`)+C(x,y,r*.2,`fill="url(#${D.u}brass)"`);
 return o}
/* накладка під роз’єми, як у RITA */
function plate(D,x,y){return R(x+13,y+24,74,52,3,`fill="#000" opacity=".13"`)+slab(D,x+13,y+22.8,74,52,3,"key")}
function mark(D,m,x,y){const a=`fill="none" stroke="${D.ink}" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"`;
 if(m==="pass")return P(`M${x} ${y-9}l-5.5 8h11zM${x} ${y+9}l-5.5 -8h11z`,a);
 if(m==="cross")return P(`M${x-10} ${y}l8.5 -5.5v11zM${x+10} ${y}l-8.5 -5.5v11z`,a);
 if(m==="bell")return P(`M${x-7} ${y+4}h14c-2-2-2.5-4-2.5-7.5a4.5 4.5 0 0 0-9 0c0 3.5-.5 5.5-2.5 7.5zM${x-2} ${y+7}a2 2 0 0 0 4 0`,a);
 if(m==="lamp")return C(x,y,4.2,a)+P(`M${x-2} ${y+4.6}v3.4h4v-3.4M${x} ${y-8}v-3M${x-6.5} ${y-5}l-2.5 -2M${x+6.5} ${y-5}l2.5 -2M${x-8} ${y+1}h-3M${x+8} ${y+1}h3`,a);
 return""}
/* один механізм у квадраті S×S з лівим верхнім кутом (x, y) */
function mod(D,name,x,y){const q=kind(name),u=D.u,cx=x+S/2,cy=y+S/2;let o=slab(D,x,y,S,S,3.5)+bevel(D,x+1,y+1,S-2,S-2,2.6);
 const rocker=(kx,ky,kw,kh)=>R(kx-.8,ky-.8,kw+1.6,kh+1.6,3,`fill="#000" opacity=".3"`)+R(kx+.6,ky+2,kw,kh,2.5,`fill="#000" opacity=".18"`)+slab(D,kx,ky,kw,kh,2.5,"keyr")+bevel(D,kx+.8,ky+.8,kw-1.6,kh-1.6,2.2);
 if(q.k==="key"){const w=(S-8-(q.keys-1)*1.8)/q.keys;for(let i=0;i<q.keys;i++)o+=rocker(x+4+i*(w+1.8),y+4,w,S-8);
  if(q.ind)o+=R(cx-12,y+S-23,24,6.5,3.2,`fill="#000" opacity=".3"`)+R(cx-10.5,y+S-22,21,4.4,2.2,`fill="#38c6ff"`)+R(cx-8,y+S-21.4,16,1.6,.8,`fill="#e5f8ff"`);
  if(q.mark){const my=y+S-(q.ind?38:24);if(q.mark==="pass"&&q.keys>1)for(let i=0;i<q.keys;i++)o+=mark(D,q.mark,x+4+i*(w+1.8)+w/2,my);else o+=mark(D,q.mark,cx,my)}}
 else if(q.k==="blinds"){const w=(S-9.8)/2;o+=rocker(x+4,y+4,w,S-8)+rocker(x+5.8+w,y+4,w,S-8);
  const a=`fill="none" stroke="${D.ink}" stroke-width="1.9" stroke-linejoin="round"`;o+=P(`M${x+4+w/2} ${cy-9}l-8 13h16z`,a)+P(`M${x+5.8+w*1.5} ${cy+4}l-8 -13h16z`,a)}
 else if(q.k==="dim"){o+=C(cx,cy+6,31,`fill="#000" opacity=".1"`)+C(cx+1.5,cy+4,27,`fill="#000" opacity=".24"`)+disc(D,cx,cy,28)+C(cx,cy,28,`fill="url(#${u}ring)" stroke="#000" stroke-opacity=".22"`)+C(cx+1,cy+2.4,21.6,`fill="#000" opacity=".26"`)+disc(D,cx,cy,21)+C(cx,cy,21,`fill="url(#${u}ring)"`)+C(cx,cy,21,`fill="none" stroke="url(#${u}edge)" stroke-width="1.4"`);
  [[-38,3.6],[-18,3.2],[2,2.7],[20,2.2],[36,1.8]].forEach(d=>{const a=(d[0]-100)*Math.PI/180;o+=C(cx+Math.cos(a)*37,cy+Math.sin(a)*37,d[1],`fill="${D.dark?D.ink:"#1c1c1e"}"`)});
  o+=P(`M${cx-4} ${cy-17}l-3 -8`,`stroke="${D.ink}" stroke-width="2.2" stroke-linecap="round"`)}
 else if(q.k==="sock"||q.k==="sockusb"){const us=q.k==="sockusb",oy=us?cy+9:cy,ro=us?36:43,ri=ro-7;
  o+=C(cx+2,oy+3.8,ro+.8,`fill="#000" opacity=".13"`)+C(cx+1,oy+2,ro+.5,`fill="#000" opacity=".2"`)+disc(D,cx,oy,ro)+C(cx,oy,ro,`fill="url(#${u}ring)"`)+C(cx,oy,ro-.7,`fill="none" stroke="url(#${u}edge)" stroke-width="1.4"`)
  +disc(D,cx,oy,ri)+C(cx,oy,ri,`fill="url(#${u}cup)"`)+C(cx,oy,ri,`fill="none" stroke="url(#${u}edgei)" stroke-width="2.6"`)+C(cx,oy,ri-3.6,`fill="none" stroke="url(#${u}edgei)" stroke-width=".8" opacity=".5"`);
  const dx=ri*.52,hr=ri*.145;o+=hole(cx-dx,oy,hr,q.shut)+hole(cx+dx,oy,hr,q.shut)+screw(D,cx,oy,ri*.14);
  if(q.earth!==false){const ey=oy-ri+1;o+=P(`M${cx-6} ${ey}h12l-2 ${f1(ri*.34)}q-4 4-8 0z`,`fill="url(#${u}brass)" stroke="#5c4514" stroke-width=".7"`)+R(cx-4.5,oy+ri-8,9,6.5,1.6,`fill="url(#${u}brass)" stroke="#5c4514" stroke-width=".7"`)}
  if(us){const uy=y+11;o+=usbA(cx-22,uy,22,9)+(q.c?usbC(cx+22,uy,20,8):usbA(cx+22,uy,22,9))}}
 else if(q.k==="usb"){if(q.c)o+=usbC(cx,cy-20,27,10)+usbA(cx,cy+5,34,13)+screw(D,cx,cy+27,5);else o+=usbA(cx,cy-13,34,13)+usbA(cx,cy+15,34,13)}
 else if(q.k==="lid"){o+=R(x+9,y+11,82,82,6,`fill="#000" opacity=".22"`)+slab(D,x+9,y+8,82,82,6,"keyr")+R(x+30,y+86,40,5,2,`fill="${mix(D.c,-.22)}"`)
  +C(cx+25,cy+24,7,`fill="none" stroke="${D.ink}" stroke-width="1.5"`)+C(cx+22.6,cy+24,1.3,`fill="${D.ink}"`)+C(cx+27.4,cy+24,1.3,`fill="${D.ink}"`)+P(`M${cx+25} ${cy+32}q0 6 -7 6`,`fill="none" stroke="${D.ink}" stroke-width="1.5"`)}
 else if(q.k==="card"){o+=R(x+23,y+5,54,50,3,`fill="#000" opacity=".16"`)+slab(D,x+22,y+3,54,50,3,"key")+C(cx-1,y+13,3.4,`fill="${mix(D.c,-.28)}"`)
  +R(x+9,y+37,82,54,4,`fill="#000" opacity=".22"`)+slab(D,x+9,y+34,82,54,4,"keyr")+R(x+20,y+36,58,3.4,1.5,`fill="#000" opacity=".4"`)+R(x+36,y+82,28,4,2,`fill="${mix(D.c,-.2)}"`)}
 else if(q.k==="rj"&&q.j.length===1&&ONE[D.col]===q.j[0])o+=jack(cx,cy,q.j[0]);
 else if(q.k==="hdmi"&&ONE[D.col]==="hdmi")o+=hdmi(cx,cy);
 else if(q.k==="rj"){o+=plate(D,x,y);const two=q.j.length>1;if(two)o+=jack(cx-21,cy,q.j[0])+jack(cx+21,cy,q.j[1]);else o+=dashed(D,cx-20,cy,22,24)+jack(cx+21,cy,q.j[0]);o+=screw(D,cx,cy,4.6)}
 else if(q.k==="hdmi"){o+=plate(D,x,y)+dashed(D,cx-20,cy,22,24)+screw(D,cx,cy,4.6)+hdmi(cx+21,cy)}
 else if(q.k==="tv")o+=coax(D,cx,cy,15,q.pin?"silver":"tv");
 else if(q.k==="sat")o+=coax(D,cx,cy,15,"sat");
 else if(q.k==="tvsat")o+=coax(D,cx-19,cy,13,"silver")+coax(D,cx+19,cy,13,"sat");
 else if(q.k==="audio")o+=coax(D,cx,cy,10,"sat");
 return o}
const esq=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
/* окрема картинка механізму (плитка вибору) */
function tile(name,col){const D=defs("frl"+(++N)+"-",col);
 return`<svg viewBox="-6 -5 ${S+12} ${S+13}" class="frltsv" aria-hidden="true" focusable="false">${D.d}${R(2,5,S,S,6,`fill="#000" opacity=".1"`)+R(.5,2.6,S,S,4.5,`fill="#000" opacity=".18"`)}${mod(D,name,0,0)}${R(0,0,S,S,3.5,`fill="url(#${D.u}shine)"`)}</svg>`}
/* зібраний блок: рамка + механізми; sel — вибране місце */
function block(n,ori,col,names,sel){const D=defs("frl"+(++N)+"-",col),u=D.u,v=ori==="v"&&n>1,len=n*S+(n-1)*G+2*B,W=v?S+2*B:len,H=v?len:S+2*B;
 const pos=names.map((_,i)=>[v?B:B+i*(S+G),v?B+i*(S+G):B]);
 let o=`<filter id="${u}sh" x="-30%" y="-35%" width="170%" height="200%"><feDropShadow dx="1.5" dy="3" stdDeviation="1.8" flood-color="#000" flood-opacity=".34"/><feDropShadow dx="5" dy="11" stdDeviation="8" flood-color="#2a2016" flood-opacity=".32"/></filter>`
  +`<g filter="url(#${u}sh)">${R(0,0,W,H,8,`fill="${D.c}"`)}</g>`+skin(D,a=>R(0,0,W,H,8,a))+`<clipPath id="${u}cl">${R(0,0,W,H,8,"")}</clipPath><g clip-path="url(#${u}cl)">${bevel(D,0,0,W,H,7)}</g>`
  +R(.6,.6,W-1.2,H-1.2,7.5,`fill="none" stroke="url(#${u}edge)" stroke-width="1"`)+R(7,7,W-14,H-14,3,`fill="none" stroke="url(#${u}edge)" stroke-width=".7" opacity=".4"`);
 pos.forEach((p,i)=>{const x=p[0],y=p[1];
  o+=`<g class="frlm" data-fpos="${i}"><title>${esq("Місце "+(i+1)+": "+names[i])}</title>`+skin(D,a=>R(x-6,y-6,S+12,S+12,4,a))+bevel(D,x-6,y-6,S+12,S+12,4.5,true)+R(x-1.6,y-1.6,S+3.2,S+3.2,4.5,`fill="#000" opacity="${D.dark?.55:.3}"`)+R(x+1,y+2.2,S,S,3.5,`fill="#000" opacity=".2"`)+mod(D,names[i],x,y)
  +(i===sel&&n>1?R(x-9,y-9,S+18,S+18,9,`fill="none" stroke="#0ABAB5" stroke-width="4.5"`):"")+`</g>`});
 o+=R(0,0,W,H,8,`fill="url(#${u}shine)" pointer-events="none"`);
 const vw=W+48,vh=H+56;
 return`<svg viewBox="-20 -16 ${vw} ${vh}" class="frlsvg" style="max-width:${Math.round(Math.min(vw*1.75,v?330:900))}px" role="img" aria-label="Блок із ${n} місць">${D.d}${o}</svg>`}
window.TeFrame={kind,tile,block,dot:col=>(PAL[col]||["#cccccc"])[0]};
})();
