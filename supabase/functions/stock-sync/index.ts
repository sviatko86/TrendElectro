// Синхронізація залишків з файлом постачальника (YML/XML/CSV). Нічого не змінює, поки не натиснуто «Оновити» або не ввімкнено автооновлення.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const H={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, content-type, x-sync-secret","Content-Type":"application/json"};
const J=(o:unknown,s=200)=>new Response(JSON.stringify(o),{status:s,headers:H});
const norm=(s:string)=>String(s||"").trim().toLowerCase().replace(/\s+/g,"");
const dec=(s:string)=>s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,"$1").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').trim();
type Row={k:string;q:number|null;av:boolean|null};
function num(v:string){const m=String(v||"").replace(",",".").match(/-?\d+(\.\d+)?/);return m?Math.max(0,Math.floor(+m[0])):null}
function parseXml(t:string):Row[]{
  const out:Row[]=[];const re=/<(offer|item|product)\b([^>]*)>([\s\S]*?)<\/\1>/gi;let m;
  const tag=(b:string,names:string[])=>{for(const n of names){const r=new RegExp("<"+n+"\\b[^>]*>([\\s\\S]*?)</"+n+">","i").exec(b);if(r)return dec(r[1])}return""};
  while((m=re.exec(t))){const at=m[2],b=m[3];
    const k=tag(b,["vendorCode","article","sku","артикул","code","vendor_code"])||(/\bid="([^"]+)"/.exec(at)||[])[1]||"";
    const qs=tag(b,["quantity_in_stock","quantity","stock_quantity","stock","amount","count","залишок","кількість"]);
    const av=/available="(true|false)"/i.exec(at);
    if(k)out.push({k:norm(k),q:qs!==""?num(qs):null,av:av?av[1].toLowerCase()==="true":null});}
  return out}
function parseCsv(t:string):Row[]{
  const lines=t.split(/\r?\n/).filter(x=>x.trim());if(lines.length<2)return[];
  const d=[";","\t",","].sort((a,b)=>lines[0].split(b).length-lines[0].split(a).length)[0];
  const sp=(l:string)=>l.split(d).map(x=>x.replace(/^"|"$/g,"").trim());
  const h=sp(lines[0]).map(x=>x.toLowerCase());
  const ki=h.findIndex(x=>/артикул|article|sku|код|code/.test(x)),qi=h.findIndex(x=>/залишок|кільк|quantity|stock|qty|наявн/.test(x));
  if(ki<0||qi<0)return[];
  return lines.slice(1).map(l=>{const c=sp(l);return{k:norm(c[ki]),q:num(c[qi]),av:null}}).filter(r=>r.k)}
Deno.serve(async req=>{
  if(req.method==="OPTIONS")return new Response("ok",{headers:H});
  const url=Deno.env.get("SUPABASE_URL")!,svc=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const db=createClient(url,svc);
  const sec=(await db.from("app_secrets").select("value").eq("name","push_secret").maybeSingle()).data?.value;
  let ok=!!sec&&req.headers.get("x-sync-secret")===sec;
  if(!ok){const a=req.headers.get("authorization")||"";if(a.startsWith("Bearer ")){const u=createClient(url,Deno.env.get("SUPABASE_ANON_KEY")!,{global:{headers:{Authorization:a}}});const r=await u.rpc("is_admin");ok=r.data===true}}
  if(!ok)return J({error:"Немає доступу"},401);
  let body:any={};try{body=await req.json()}catch{}
  const act=body.action||"run";
  const getSet=async()=>(await db.from("settings").select("value").eq("key","stock_sync").maybeSingle()).data?.value||{};
  const putSet=async(v:any)=>{await db.from("settings").upsert({key:"stock_sync",value:v,updated_at:new Date().toISOString()})};
  if(act==="save_url"){try{const x=new URL(String(body.url||"").trim());if(!/^https?:$/.test(x.protocol))throw 0}catch{return J({error:"Це не схоже на посилання (має починатися з https://)"},400)}await db.from("app_secrets").upsert({name:"stock_feed_url",value:String(body.url||"").trim()});return J({ok:true})}
  if(act==="has_url"){const u=(await db.from("app_secrets").select("value").eq("name","stock_feed_url").maybeSingle()).data?.value;let host="";try{host=u?new URL(u).host:""}catch{host="невірне посилання"}return J({has:!!u,host})}
  const set=await getSet();
  if(act==="auto"){if(set.on!==true)return J({skipped:"вимкнено"})}
  const feed=(await db.from("app_secrets").select("value").eq("name","stock_feed_url").maybeSingle()).data?.value;
  if(!feed)return J({error:"Не вказано посилання на файл"},400);
  const apply=act==="run"||act==="auto";
  const res:any={at:new Date().toISOString(),apply};
  try{
    const r=await fetch(feed,{headers:{"User-Agent":"TrendElectro-stock/1"}});
    if(!r.ok)throw new Error("Файл не відкрився: HTTP "+r.status);
    const t=await r.text();
    const rows=/<(offer|item|product)\b/i.test(t)?parseXml(t):parseCsv(t);
    res.feed=rows.length;
    if(rows.length<10)throw new Error("У файлі знайдено лише "+rows.length+" рядків — схоже, формат не розпізнано. Нічого не змінено.");
    const prods:any[]=[];for(let o=0;;o+=1000){const q=await db.from("products").select("id,stock,in_stock").range(o,o+999);if(q.error)throw q.error;prods.push(...q.data);if(q.data.length<1000)break}
    const map=new Map(prods.map(p=>[norm(p.id),p]));
    const upd:any[]=[];let matched=0;
    for(const x of rows){const p=map.get(x.k);if(!p)continue;matched++;
      const qty=x.q!=null?x.q:(x.av===false?0:null);
      const inS=qty!=null?qty>0:(x.av!==false);
      if(qty!==p.stock||inS!==p.in_stock)upd.push({id:p.id,stock:qty,in_stock:inS})}
    res.matched=matched;res.changes=upd.length;res.total=prods.length;
    res.sample=upd.slice(0,8);
    if(matched<10||matched<rows.length*0.05)throw new Error("Збіглося лише "+matched+" артикулів із "+rows.length+" — перевірте, чи це правильний файл. Нічого не змінено.");
    if(apply){let done=0;for(let i=0;i<upd.length;i+=50){const ch=upd.slice(i,i+50);await Promise.all(ch.map(u=>db.from("products").update({stock:u.stock,in_stock:u.in_stock}).eq("id",u.id)));done+=ch.length}res.updated=done}
    res.ok=true;
  }catch(e){res.ok=false;res.error=String((e as Error).message||e)}
  if(apply){set.last=res;await putSet(set)}
  return J(res)});
