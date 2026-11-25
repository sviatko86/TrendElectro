/* Симулятор світла «зі світильників»: у кожній кімнаті 4 джерела, які можна вмикати окремо.
   Підключається лише на сторінці #/light (якщо в адмінці увімкнено). Якщо файл не завантажився,
   сайт показує попередній простий симулятор. Назовні віддає тільки window.TeLight. */
(function(){
"use strict";
const cl=v=>v<0?0:v>1?1:v,sm=(a,b,v)=>{const t=cl((v-a)/(b-a));return t*t*(3-2*t)},ex=Math.exp;
const G=(dx,dy,sx,sy)=>ex(-(dx*dx/(sx*sx)+dy*dy/(sy*sy)));
/* мʼяка маска багатокутника */
function mask(p,f){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;p.forEach(([x,y])=>{x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)});
 return(x,y)=>{if(x<x0-f||x>x1+f||y<y0-f||y>y1+f)return 0;let ins=false,d=1e9;for(let i=0,j=p.length-1;i<p.length;j=i++){const ax=p[i][0],ay=p[i][1],bx=p[j][0],by=p[j][1];
  if((ay>y)!==(by>y)&&x<(bx-ax)*(y-ay)/(by-ay)+ax)ins=!ins;
  const dx=bx-ax,dy=by-ay,t=cl(((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy||1)),qx=x-ax-t*dx,qy=y-ay-t*dy;d=Math.min(d,qx*qx+qy*qy)}
  d=Math.sqrt(d);return cl(.5+(ins?d:-d)/(2*f))}}
const box=(x0,y0,x1,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
const any=list=>(x,y)=>{let t=0;for(const m of list){const v=m(x,y);if(v>t)t=v}return t};
/* конус світла вниз від (cx,cy) */
const cone=(x,y,cx,cy,w0,spread,fall,pw)=>{const dy=y-cy;if(dy<-4)return 0;const hw=w0+Math.max(dy,0)*spread,u=(x-cx)/hw;return ex(-1.5*Math.pow(u*u,pw||1))*sm(-4,26,dy)/(1+dy*dy/fall)};

/* ---------- малювання світильників ---------- */
function glow(g,col,x,y,rx,ry,a){g.save();g.globalCompositeOperation="lighter";g.translate(x,y);g.scale(1,ry/rx);const q=g.createRadialGradient(0,0,0,0,0,rx);q.addColorStop(0,col(a));q.addColorStop(1,col(0));g.fillStyle=q;g.beginPath();g.arc(0,0,rx,0,7);g.fill();g.restore()}
function lit(g,col,on,off){g.fillStyle=on?"#fff":off;g.fill();if(on){g.fillStyle=col(.38);g.fill()}}
function ell(g,x,y,rx,ry){g.beginPath();g.ellipse(x,y,rx,ry,0,0,7)}
function shape(g,p){g.beginPath();p.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath()}
function strip(g,col,pts,w){g.save();g.lineCap="round";g.lineJoin="round";[[w*5,.2],[w*2.4,.5],[w,1]].forEach(([lw,a],i)=>{g.strokeStyle=i===2?"#fff":col(a);g.lineWidth=lw;g.beginPath();pts.forEach(([x,y],j)=>j?g.lineTo(x,y):g.moveTo(x,y));g.stroke()});g.restore()}
function cord(g,x,y0,y1,w){g.strokeStyle="#1b1d20";g.lineWidth=w||2;g.beginPath();g.moveTo(x,y0);g.lineTo(x,y1);g.stroke()}

/* ---------- КУХНЯ (координати 1064×712) ---------- */
function kitchen(){
 const WIN=any([mask([[75,72],[205,152],[205,449],[178,453],[160,458],[146,464],[119,470],[119,620],[75,646]],1.5),mask([[142,492],[152,492],[156,520],[158,590],[151,601],[142,606]],1.5)]),CEIL=mask([[115,0],[962,0],[822,120],[254,120],[208,86]],4),TABLE=mask([[119,466],[150,451],[376,452],[346,468]],2);
 const SP=[[348,24,690],[872,24,668],[408,98,622],[500,108,615],[702,108,615],[794,98,622]],MX=602,MY=58,PX=247,PY=268;
 return{w:1064,h:712,win:WIN,lamps:[
 {n:"Головний світильник",l(x,y){const c=y<130?CEIL(x,y):0,dy=y-MY;
   let s=.42*G(x-MX,y-MY-4,210,52)*c;
   if(dy>0)s+=(1-c*.8)*(.40*G(x-MX,0,360+dy*.35,1)*sm(0,90,dy)+.28*G(x-MX,y-610,330,150));
   return s+.09},
  d(g,col,on){cord(g,MX-62,2,MY-6,1.5);cord(g,MX+62,2,MY-6,1.5);g.lineWidth=11;g.strokeStyle="#2b2e33";ell(g,MX,MY,104,19);g.stroke();
   g.lineWidth=5.5;g.strokeStyle=on?"#fff":"#6b7076";ell(g,MX,MY+2,104,19);g.stroke();if(on){g.strokeStyle=col(.38);g.stroke();g.lineWidth=14;g.strokeStyle=col(.16);g.stroke()}}},
 {n:"Точкові",l(x,y){const c=y<135?CEIL(x,y):0;let s=0;for(const[sx,sy,fy]of SP){const dx=x-sx,dy=y-sy;
    s+=.15*G(dx,dy,52,15)*c;
    if(dy>0){const hw=20+dy*.34;s+=.48*ex(-1.7*dx*dx/(hw*hw))*sm(0,70,dy-dx*dx/150)/(1+dy*dy/140000)*(1-c)}
    if(y>535)s+=.27*G(dx,y-fy,135,44)*sm(535,575,y)}return s},
  d(g,col,on){for(const[x,y]of SP){g.fillStyle="#8d9094";ell(g,x,y,15,4.6);g.fill();ell(g,x,y,11,3);lit(g,col,on,"#3b3e42");if(on)glow(g,col,x,y,32,10,.5)}}},
 {n:"Над столом",l(x,y){let p=.14*G(x-PX,y-PY+10,95,70)+.85*cone(x,y,PX,PY,44,.78,62000,2);
    if(y>445&&y<475&&x>110&&x<385)p*=1+.75*TABLE(x,y);
    const un=sm(112,135,x)*(1-sm(355,385,x))*sm(478,492,y)*(1-sm(600,665,y));return p*(1-.5*un*(y>500&&x>150&&x<330?1:.7))},
  d(g,col,on){cord(g,PX,52,PY-43,2.5);g.fillStyle="#15171a";ell(g,PX,52,14,4);g.fill();
   const q=g.createLinearGradient(PX-52,0,PX+52,0);q.addColorStop(0,"#101215");q.addColorStop(.4,"#3a3f45");q.addColorStop(1,"#14161a");
   g.fillStyle=q;g.beginPath();g.moveTo(PX-52,PY);g.bezierCurveTo(PX-50,PY-34,PX-24,PY-45,PX,PY-45);g.bezierCurveTo(PX+24,PY-45,PX+50,PY-34,PX+52,PY);g.closePath();g.fill();
   ell(g,PX,PY,50,7);lit(g,col,on,"#2a2d31");if(on)glow(g,col,PX,PY+4,85,30,.45)}},
 {n:"Підсвітка кухні",l(x,y){if(x<=455||x>=990)return 0;
    const top=x<846?311:309-(x-846)*.135,cb=x<882?408:408+(x-882)*.25,edge=sm(458,476,x)*(1-sm(970,980,x)),d=y-top;
    if(d>=-2&&y<=cb+10)return(1.05*ex(-d/62)+.28)*sm(-2,3,d)*edge*(1+.35*sm(cb-8,cb-2,y));
    return y>cb+10?.22*ex(-(y-cb-10)/70)*edge:0},
  d(g,col,on){if(on)strip(g,col,[[471,312],[845,312],[971,295]],2)}}]}}

/* ---------- СПАЛЬНЯ (координати 1264×848) ---------- */
function bedroom(){
 const CEIL=mask([[115,0],[1172,0],[1062,94],[932,186],[340,180]],4),
  WIN=mask([[1077,192],[1163,150],[1163,517],[1077,497]],3),
  BED=mask([[356,668],[366,630],[398,580],[440,540],[500,512],[522,508],[522,447],[636,444],[642,447],[750,447],[755,510],[788,517],[830,555],[885,605],[912,668],[914,728],[893,712],[877,694],[862,689],[640,687],[405,689],[394,694],[362,729]],2),
  LEGS=[mask(box(395,689,410,738),1.5),mask(box(862,689,877,738),1.5)],
  SH=[mask([[420,444],[445,444],[450,475],[415,475]],1.5),mask([[814,444],[840,444],[845,475],[809,475]],1.5)],
  MX=640,MY=70,LX=[432,827],SX=[462,795],SY=352,FLOOR=mask([[0,800],[338,590],[932,590],[1264,800],[1264,848],[0,848]],3);
 return{w:1264,h:848,win:WIN,lamps:[
 {n:"Головний світильник",l(x,y){const c=y<192?CEIL(x,y):0,dy=y-MY;
    let s=.55*G(x-MX,y-MY,300,85)*c+.07;
    if(dy>0)s+=(1-c*.7)*(.34*G(x-MX,0,470+dy*.3,1)*sm(0,150,dy)+.26*G(x-MX,y-640,430,190));
    return s},
  d(g,col,on){g.fillStyle="rgba(0,0,0,.28)";ell(g,MX,MY+5,98,20);g.fill();g.fillStyle="#b9bcc0";ell(g,MX,MY,96,18);g.fill();
   g.fillStyle="#d9dbde";ell(g,MX,MY+6,86,17);g.fill();ell(g,MX,MY+8,78,15);lit(g,col,on,"#a8abaf");if(on)glow(g,col,MX,MY+10,170,52,.38)}},
 {n:"Бра",l(x,y){let s=0;const bed=BED(x,y);for(const sx of SX){const dx=x-sx;
     const up=SY-28-y,dn=y-SY-28;
     if(up>0){const hw=10+up*.46;s+=1.0*ex(-1.8*Math.pow(dx*dx/(hw*hw),1.5))*sm(0,16,up)/(1+up*up/20000)}
     if(dn>0){const hw=10+dn*.46;s+=.95*ex(-1.8*Math.pow(dx*dx/(hw*hw),1.5))*sm(0,16,dn)/(1+dn*dn/22000)*(1-.45*bed*sm(520,600,y))}
     s+=.16*G(dx,y-SY,70,60)}return s},
  d(g,col,on){for(const x of SX){const q=g.createLinearGradient(x-12,0,x+12,0);q.addColorStop(0,"#17191c");q.addColorStop(.45,"#4a4f55");q.addColorStop(1,"#17191c");
     g.fillStyle="rgba(0,0,0,.22)";g.fillRect(x-9,SY-22,24,52);g.fillStyle=q;g.fillRect(x-11,SY-27,22,54);
     for(const y of[SY-27,SY+27]){ell(g,x,y,11,3);lit(g,col,on,"#23262a");if(on)glow(g,col,x,y,24,11,.55)}}}},
 {n:"Настільні лампи",l(x,y){let s=0;const bed=BED(x,y);for(let i=0;i<2;i++){const cx=LX[i],dx=x-cx;
     s+=(.34*G(dx,y-462,105,85)+.62*cone(x,y,cx,478,22,.85,5200,1)+.55*cone(x,2*442-y,cx,442,18,.62,9000,1))*(1-.7*bed);
     s+=.75*G(dx,y-503,62,10)*(1-bed);
     if(x>cx-40&&x<cx+40&&y>438&&y<480)s+=1.5*SH[i](x,y)}return s},
  d(g,col,on){if(on)for(const x of LX)glow(g,col,x,459,34,28,.28)}},
 {n:"LED під ліжком",l(x,y){if(y<560)return 0;const bed=BED(x,y),leg=Math.max(LEGS[0](x,y),LEGS[1](x,y));
    const dx=Math.max(0,Math.abs(x-636)-225),d=Math.max(0,y-688);
    const under=(1.55*ex(-d/46)+.22*ex(-d/130))*ex(-dx*dx/7000)*sm(668,694,y),
     side=.55*G(Math.max(0,Math.abs(x-636)-262),y-684,80,48)*FLOOR(x,y);
    return Math.max(under,side)*(1-bed)*(1-.85*leg)},
  d(g,col,on){if(on)strip(g,col,[[412,687],[640,685.5],[860,687]],1.8)}}]}}

/* ---------- ОФІС (координати 1264×848) ---------- */
function office(){
 const CEIL=mask([[0,0],[1264,0],[1264,198],[1126,246],[1126,308],[1012,310],[333,311],[0,178]],3),
  WINP=mask([[0,192],[333,313],[333,528],[212,550],[0,590]],2),
  /* предмети перед вікном: стелаж, книги, монітор, крісло, столи */
  FRONT=any([[31,381,36,600],[80,381,87,556],[103,386,109,556],[141,385,147,556],[174,398,180,546],[210,390,216,532],
   [55,401,79,440],[84,407,103,441],[117,406,141,440],[147,406,160,440],[160,431,176,439],[177,408,209,438],
   [93,461,121,493],[119,452,141,492],[147,456,161,489],[68,508,81,553],[87,508,109,552]].map(b=>mask(box(...b),1)).concat(
   [[[30,382],[80,386],[222,396],[220,401],[80,395],[30,389]],[[33,443],[80,441],[80,448],[33,450]],[[84,440],[216,439],[216,445],[84,446]],
    [[70,497],[142,491],[212,482],[212,488],[142,498],[70,504]],[[70,550],[142,541],[142,546],[70,556]],
    [[0,472],[66,473],[70,556],[0,556]],[[159,557],[163,537],[172,527],[195,524],[220,528],[229,541],[231,557]],
    [[0,556],[293,555],[293,640],[0,640]],[[309,491],[350,486],[350,499],[317,501],[317,563],[309,563]]].map(p=>mask(p,1)))),
  DESK=[[[797,544],[1150,546],[1219,576],[839,577]],[[0,557],[286,556],[163,602],[0,607]],[[310,490],[348,484],[483,485],[466,498],[311,498]],[[743,485],[880,485],[919,492],[756,497]]].map(p=>mask(p,2));
 const WIN=(x,y)=>{if(x>340||y<180||y>600)return 0;const w=WINP(x,y);return w?w*(1-FRONT(x,y)):0};
 /* панелі 60×60: перспектива стелі */
 const proj=(X,z)=>[640+700*X/z,420-1100/z],PAN=[];
 [3.5,5.1,7.4].forEach(z=>[-2.45,0,2.45].forEach(X=>{PAN.push({q:[proj(X-.33,z+.62),proj(X+.33,z+.62),proj(X+.33,z),proj(X-.33,z)],c:proj(X,z+.28),fx:640+700*X/z,fy:420+945/(z+.3),s:700/z})}));
 const BARS=[[890,1130,388,130],[42,232,396,130],[352,452,420,262],[778,882,420,262]];
 const DL=[[1172,566,1128,505,1.05],[272,562,252,512,.95],[462,490,442,462,.55],[766,490,787,462,.55]];
 return{w:1264,h:848,win:WIN,lamps:[
 {n:"Панелі 60×60",l(x,y){const c=y<315?CEIL(x,y):0;let s=.2;
    for(const p of PAN){if(c>0)s+=.13*c*G(x-p.c[0],y-p.c[1],p.s*.62,p.s*.2);if(y>470)s+=.12*G(x-p.fx,y-p.fy,p.s*1.15,p.s*.34)*sm(470,530,y)}
    if(y>285)s+=(1-c)*(.2*sm(285,360,y)+.12*G(x-660,y-420,520,150));return s},
  d(g,col,on){for(const p of PAN){const q=p.q;shape(g,q);g.lineWidth=Math.max(2,p.s*.022);g.strokeStyle="#9a9ea3";g.stroke();lit(g,col,on,"#b4b7ba");if(on)glow(g,col,p.c[0],p.c[1],p.s*.75,p.s*.24,.3)}}},
 {n:"Підвіси над столами",l(x,y){let s=0;for(let i=0;i<4;i++){const[a,b,by]=BARS[i],cx=(a+b)/2,half=(b-a)/2,dy=y-by;
     if(dy>-4){const dx=Math.max(0,Math.abs(x-cx)-half*.75),hw=16+dy*(i<2?.62:.55);s+=.62*ex(-1.6*dx*dx/(hw*hw))*sm(-4,30,dy)/(1+dy*dy/(i<2?26000:11000))}
     s+=.1*G(x-cx,y-by,half*1.1,32)}
    if(y>480&&y<610){let t=0;for(const m of DESK)t=Math.max(t,m(x,y));s*=1+.9*t}return s},
  d(g,col,on){BARS.forEach(([a,b,y,top])=>{const h=b-a>150?9:5;cord(g,a+(b-a)*.16,top,y,1.3);cord(g,b-(b-a)*.16,top,y,1.3);g.fillStyle="#1d2024";g.fillRect(a,y-h,b-a,h);
     g.beginPath();g.rect(a+2,y,b-a-4,h*.55);lit(g,col,on,"#6f747a");if(on)glow(g,col,(a+b)/2,y+4,(b-a)*.6,h*3,.34)})}},
 {n:"Настільні лампи",l(x,y){if(y<400||y>720)return 0;let s=0;DL.forEach(([bx,by,hx,hy,k],i)=>{const m=DESK[i](x,y);
     s+=1.35*G(x-hx,y-(by+2),78*k,17*k)*(.2+.8*m)+.38*cone(x,y,hx,hy+6,10*k,1.05,2600*k,1)+.14*G(x-hx,y-hy,55*k,45*k)});return s},
  d(g,col,on){for(const[bx,by,hx,hy,k]of DL){g.lineCap="round";g.lineJoin="round";[["rgba(214,218,224,.55)",5.4],["#2b2f34",3.4]].forEach(([st,lw])=>{g.strokeStyle=st;g.lineWidth=lw*k;g.beginPath();g.moveTo(bx,by);g.lineTo(bx+(bx-hx)*.28,(by+hy)/2-8*k);g.lineTo(hx,hy-6*k);g.stroke()});
     g.fillStyle="#202327";ell(g,bx,by,15*k,4*k);g.fill();g.beginPath();g.moveTo(hx-19*k,hy+4*k);g.quadraticCurveTo(hx,hy-24*k,hx+19*k,hy+4*k);g.closePath();g.fill();g.strokeStyle="rgba(214,218,224,.55)";g.lineWidth=1.2*k;g.stroke();
     ell(g,hx,hy+4*k,17*k,4*k);lit(g,col,on,"#3a3e43");if(on)glow(g,col,hx,hy+6*k,30*k,15*k,.5)}}},
 {n:"LED на стіні",l(x,y){const c=y<312?CEIL(x,y):0;let s=0;
    if(x>315&&x<1032){const e=sm(322,346,x)*(1-sm(1004,1024,x)),d=y-311;
     if(d>=-2&&y<=519)s=(1.2*ex(-Math.max(0,d)/56)+.2)*sm(-2,3,d)*e*(1-.55*sm(505,519,y));
     else if(y>519)s=.2*ex(-(y-519)/80)*e;
     if(d<0)s+=.22*ex(d/26)*e*c}
    return s},
  d(g,col,on){if(on)strip(g,col,[[336,311.5],[1010,311]],1.8)}}]}}

/* ---------- рушій ---------- */
const DEF={kitchen,bedroom,office},CACHE={},WAIT={},ON={kitchen:[1,1,1,1],bedroom:[1,1,1,1],office:[1,1,1,1]};
function kelvin(k){const t=k/100,r=t<=66?255:329.7*Math.pow(t-60,-.1332),g=t<=66?99.47*Math.log(t)-161.12:288.12*Math.pow(t-60,-.0755),b=t>=66?255:t<=19?0:138.52*Math.log(t-10)-305.04;return[r,g,b].map(v=>Math.min(255,Math.max(0,v)))}
const TONE=new Uint8ClampedArray(2048);for(let i=0;i<2048;i++){let v=i/1023.5;if(v>.82)v=.82+.18*(1-ex(-(v-.82)/.24));TONE[i]=v*255}
/* карти освітлення рахуються один раз для кожного розміру */
function build(R,w){const D=R.def,h=Math.round(w*D.h/D.w),N=w*h,k=D.w/w,c=document.createElement("canvas");c.width=w;c.height=h;
 const g=c.getContext("2d");g.drawImage(R.img,0,0,w,h);const base=g.getImageData(0,0,w,h).data,L=D.lamps.map(()=>new Float32Array(N)),W=new Float32Array(N);
 for(let y=0;y<h;y++){const Y=(y+.5)*k;for(let x=0;x<w;x++){const i=y*w+x,X=(x+.5)*k;W[i]=D.win(X,Y);for(let j=0;j<L.length;j++)L[j][i]=D.lamps[j].l(X,Y)}}
 return{w,h,base,L,W,sum:new Float32Array(N),key:""}}
function render(R,M,cv,K,on){const D=R.def,key=on.join("");
 if(M.key!==key){const cnt=on.reduce((a,b)=>a+b,0),expo=cnt>1?1/(1+.2*(cnt-1)):1,bounce=.05*cnt,S=M.sum;
  for(let i=0;i<S.length;i++){let l=bounce;for(let j=0;j<on.length;j++)if(on[j])l+=M.L[j][i];S[i]=l*expo*(1-.82*M.W[i])}M.key=key}
 if(cv.width!==M.w||cv.height!==M.h){cv.width=M.w;cv.height=M.h}
 const g=cv.getContext("2d"),out=g.createImageData(M.w,M.h),d=out.data,s=M.base,S=M.sum,W=M.W,a=kelvin(K),n=kelvin(5300),c=a.map((v,i)=>v/n[i]),lum=.21*c[0]+.72*c[1]+.07*c[2];
 for(let j=0;j<3;j++)c[j]/=Math.pow(lum,.65);
 const A=[.17,.19,.235],U=[.105,.14,.225];
 for(let i=0,q=0;i<S.length;i++,q+=4){const w=W[i],l=S[i];
  for(let j=0;j<3;j++){let p=s[q+j];if(w)p*=1-w*(1-p*p/65025); /* контраст у вікні, щоб було видно жалюзі й дерева */
   const v=(p*(A[j]+(U[j]-A[j])*w+l*c[j])*4.012)|0;d[q+j]=TONE[v>2047?2047:v]}d[q+3]=255}
 g.putImageData(out,0,0);
 const col=al=>`rgba(${a.map(Math.round)},${al})`;
 g.save();g.scale(M.w/D.w,M.h/D.h);D.lamps.forEach((lp,j)=>{g.save();lp.d(g,col,!!on[j]);g.restore()});g.restore()}

window.TeLight={
 /* завантажує фото кімнати й готує освітлення; ok() після готовності, bad() при помилці.
    wanted() каже, чи кімната ще потрібна: важкий розрахунок не запускається, якщо відвідувач уже пішов далі. */
 open(room,base,ok,bad,wanted){if(!DEF[room]){bad();return}if(CACHE[room]){ok();return}const job={ok,bad,wanted:wanted||(()=>true)};
  if(WAIT[room]){WAIT[room].push(job);return}const q=WAIT[room]=[job],im=new Image(),live=()=>q.filter(j=>j.wanted());
  const fail=()=>{delete WAIT[room];live().forEach(j=>j.bad())};
  im.onload=()=>setTimeout(()=>{if(!live().length){delete WAIT[room];return}
   try{const R={def:DEF[room](),img:im};R.big=build(R,Math.min(1000,im.naturalWidth));R.small=build(R,320);CACHE[room]=R}catch(e){fail();return}
   delete WAIT[room];live().forEach(j=>j.ok())},30);
  im.onerror=fail;im.src=base+"sim-"+room+".webp"},
 ready:room=>!!CACHE[room],
 paint(room,cv,K){const R=CACHE[room];if(R)render(R,R.big,cv,K,ON[room])},
 thumb(room,cv,K){const R=CACHE[room];if(R)render(R,R.small,cv,K,ON[room])},
 lamps(room){const D=CACHE[room]?CACHE[room].def:DEF[room]&&DEF[room]();return D?D.lamps.map((l,i)=>({n:l.n,on:!!ON[room][i]})):[]},
 toggle(room,i){if(ON[room]&&i>=0&&i<ON[room].length)ON[room][i]=ON[room][i]?0:1;return!!(ON[room]&&ON[room][i])}
};
})();
