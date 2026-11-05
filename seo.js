// Генерує: сторінки товарів і категорій (p/, c/), sitemap.xml, robots.txt, фото у img/ (стиснені).
// Запускається GitHub Action щодня і вручну. Нічого не змінює в базі даних.
import fs from "fs";
const SITE = (process.env.SITE || "https://sviatko86.github.io/TrendElectro").replace(/\/$/, "");
const MAXIMG = +(process.env.MAXIMG || 500);
const cfg = fs.readFileSync("config.js", "utf8");
const API = cfg.match(/url:\s*["']([^"']+)["']/)[1], KEY = cfg.match(/key:\s*["']([^"']+)["']/)[1];
const H = { apikey: KEY, Authorization: "Bearer " + KEY };
const SEP = " › ";
const esc = t => String(t ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const TR = { а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ie", ж: "zh", з: "z", и: "y", і: "i", ї: "i", й: "i", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ь: "", ю: "iu", я: "ia", ё: "e", э: "e", ы: "y", ъ: "" };
const slug = (t, n = 70) => String(t).toLowerCase().replace(/[а-яіїєґёэыъ]/g, c => TR[c] ?? "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, n).replace(/-+$/, "") || "x";
const safe = id => String(id).replace(/[^A-Za-z0-9_-]/g, "_");

async function get(path) {
  const r = await fetch(API + "/rest/v1/" + path, { headers: H });
  if (!r.ok) throw new Error(path + " → " + r.status);
  return r.json();
}
async function all(table, sel, extra = "") {
  const out = []; for (let o = 0; ; o += 1000) {
    const d = await get(`${table}?select=${sel}${extra}&order=id&limit=1000&offset=${o}`); out.push(...d); if (d.length < 1000) break;
  } return out;
}
const settings = {};
(await get("settings?select=key,value&key=in.(pricing,shop)")).forEach(x => settings[x.key] = x.value || {});
let cats = []; try { cats = await get("categories?select=path,hidden,description"); } catch (e) { }
const CM = {}; cats.forEach(c => CM[c.path] = c);
const hid = c => { for (let i = 1; i <= c.length; i++) { const m = CM[c.slice(0, i).join(SEP)]; if (m && m.hidden) return true } return false };
const PR = settings.pricing || {}, shop = settings.shop || {};
function rate(c) {
  const k1 = c[0], k2 = c[1] ? k1 + SEP + c[1] : null, k3 = c[2] ? k2 + SEP + c[2] : null; let m = null, d = null;
  [k3, k2, k1].forEach(k => { const o = k && PR.by_category && PR.by_category[k]; if (o) { if (m == null && o.m != null) m = +o.m; if (d == null && o.d != null) d = +o.d } });
  return [m != null ? m : +PR.markup_percent || 0, d != null ? d : +PR.discount_percent || 0];
}
const price = p => { const r = rate(p.c); return Math.round(p.price * (1 + r[0] / 100) * (1 - r[1] / 100) * 100) / 100 };

const raw = await all("products", "id,name,category,subcategory,subcategory2,brand,price,image_url,in_stock,description,specs", "&active=eq.true");
const P = raw.map(r => ({ id: r.id, name: r.name, c: [r.category, r.subcategory, r.subcategory2].filter(x => x && x !== "Усі"), brand: r.brand || "", price: +r.price || 0, img: r.image_url || "", st: r.in_stock !== false, d: r.description || "", sp: r.specs || "" })).filter(p => !hid(p.c));
console.log("products:", P.length);

/* ---------- фото ---------- */
fs.mkdirSync("img", { recursive: true });
let sharp = null; try { sharp = (await import("sharp")).default } catch (e) { console.log("sharp не встановлено — фото пропущено") }
let got = 0, fail = 0; const failedIds = [];
if (sharp) {
  const todo = P.filter(p => /^https?:/.test(p.img) && p.img.indexOf(SITE) !== 0 && p.img.indexOf(".supabase.co/") < 0 && !fs.existsSync(`img/${safe(p.id)}.webp`));
  console.log("фото до завантаження:", todo.length, "(за запуск не більше " + MAXIMG + ")");
  const q = todo.slice(0, MAXIMG);
  async function save(url, id) {
    const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 20000);
    try {
      const r = await fetch(url, { signal: ctl.signal, headers: { "User-Agent": "Mozilla/5.0 TrendElectroBot" } });
      if (!r.ok) return false;
      const buf = Buffer.from(await r.arrayBuffer());
      await sharp(buf).rotate().resize(800, 800, { fit: "inside", withoutEnlargement: true }).webp({ quality: 78 }).toFile(`img/${safe(id)}.webp`); return true;
    } catch (e) { return false } finally { clearTimeout(t) }
  }
  async function one(p) { if (await save(p.img, p.id)) got++; else { fail++; failedIds.push(p.id) } }
  let i = 0; await Promise.all(Array.from({ length: 8 }, async () => { while (i < q.length) await one(q[i++]) }));
}

/* ---------- пошук відсутніх фото на svit-bud.com за артикулом ---------- */
if (sharp && process.env.FIND !== "0") {
  const MF = +(process.env.MAXFIND || 120), DAY = 864e5;
  let miss = {}; try { miss = JSON.parse(fs.readFileSync("img/find-misses.json", "utf8")) } catch (e) { }
  const bad = new Set(failedIds);
  const need = P.filter(p => !fs.existsSync(`img/${safe(p.id)}.webp`) && (!p.img || bad.has(p.id)) && !(miss[p.id] && Date.now() - miss[p.id] < 30 * DAY)).slice(0, MF);
  console.log("шукаю фото на svit-bud.com для:", need.length);
  const UA = { "User-Agent": "Mozilla/5.0 TrendElectroBot" }, sleep = ms => new Promise(r => setTimeout(r, ms));
  const C = { search_fail: 0, no_links: 0, page_fail: 0, id_miss: 0, no_img: 0, save_fail: 0 }; let shown = 0;
  const html = async u => { try { const r = await fetch(u, { headers: UA, signal: AbortSignal.timeout(20000) }); if (!r.ok && shown++ < 3) console.log("  HTTP", r.status, u.slice(0, 90)); return r.ok ? await r.text() : "" } catch (e) { if (shown++ < 3) console.log("  fetch error", String(e.message || e).slice(0, 80), u.slice(0, 90)); return "" } };
  let found = 0;
  for (const p of need) {
    let ok = false, hard = true;
    try {
      const sr = await html("https://svit-bud.com/search/?search=" + encodeURIComponent(p.id)); await sleep(500);
      if (!sr) { C.search_fail++; hard = false; continue }
      const links = [...new Set([...sr.matchAll(/href="(https:\/\/svit-bud\.com\/[a-z0-9\-\/_]+-\d+)"/g)].map(m => m[1]))].slice(0, 3);
      if (!links.length) C.no_links++;
      const idRe = new RegExp("(^|[^A-Za-z0-9])" + p.id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "([^A-Za-z0-9]|$)");
      for (const l of links) {
        const pg = await html(l); await sleep(500); if (!pg) { C.page_fail++; continue }
        const text = pg.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g, " ");
        if (!idRe.test(text)) { C.id_miss++; continue }
        let im = (pg.match(/<meta property="og:image" content="([^"]+)"/) || [])[1];
        if (!im || /oct_loader|lazy/.test(im)) im = (pg.match(/(https:\/\/svit-bud\.com\/image\/(?:cache\/)?catalog\/(?!1lazy)[^"' )]+\.(?:jpe?g|png|webp))/i) || [])[1];
        if (!im) { C.no_img++; continue }
        if (await save(im, p.id)) { ok = true; found++; break } else C.save_fail++
      }
    } catch (e) { }
    if (!ok && hard) miss[p.id] = Date.now();
  }
  fs.writeFileSync("img/find-misses.json", JSON.stringify(miss));
  console.log("знайдено на svit-bud.com:", found, "з", need.length, JSON.stringify(C));
}
const have = fs.readdirSync("img").filter(f => f.endsWith(".webp")).map(f => f.slice(0, -5));
fs.writeFileSync("img/map.json", JSON.stringify(have));
const HAVE = new Set(have); console.log("фото: нових", got, "помилок", fail, "усього у img/", have.length);
const imgUrl = p => HAVE.has(safe(p.id)) ? `${SITE}/img/${safe(p.id)}.webp` : p.img;

/* ---------- сторінки ---------- */
const TPL = fs.readFileSync("index.html", "utf8");
const abs = h => h.replace(/(href|src)="(app\.css|app\.js|config\.js|logo\d\.webp)([^"]*)"/g, `$1="${SITE}/$2$3"`);
function page({ title, desc, url, hash, body, ld, image }) {
  let h = abs(TPL).replace(/<link rel="canonical"[^>]*>\n?/, "");
  h = h.replace(/<title>.*?<\/title>/, `<title>${esc(title)}</title>`);
  h = h.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(desc)}">`);
  h = h.replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(title)}">`);
  h = h.replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(desc)}">\n<meta property="og:url" content="${url}">${image ? `\n<meta property="og:image" content="${esc(image)}">` : ""}\n<meta name="twitter:card" content="summary_large_image">`);
  h = h.replace("</head>", `<link rel="canonical" href="${url}">\n<script>window.__R=${JSON.stringify(hash)};window.__BASE=${JSON.stringify(SITE + "/")}</script>\n<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>\n</head>`);
  return h.replace('<main class="wrap" id="view"></main>', `<main class="wrap" id="view">${body}</main>`);
}
const specRows = sp => sp.split(";").map(x => { const k = x.indexOf(":"); return k > 0 ? [x.slice(0, k).trim(), x.slice(k + 1).trim()] : null }).filter(Boolean);
fs.rmSync("p", { recursive: true, force: true }); fs.rmSync("c", { recursive: true, force: true });
const urls = []; const today = new Date().toISOString().slice(0, 10);
const purl = new Map();
P.forEach(p => { purl.set(p.id, `p/${slug(p.name, 60)}-${slug(p.id, 24)}/`) });
const money = n => n.toLocaleString("uk-UA") + " ₴";
const ctitle = n => n;
for (const p of P) {
  const rel = purl.get(p.id), url = `${SITE}/${rel}`, pr = price(p), im = imgUrl(p);
  const desc = (p.d || `${p.name}. Купити в Trend Electro: ціна ${money(pr)}, доставка по Україні.`).replace(/\s+/g, " ").slice(0, 300);
  const ld = { "@context": "https://schema.org", "@type": "Product", name: p.name, sku: p.id, description: desc, ...(im ? { image: [im] } : {}), ...(p.brand ? { brand: { "@type": "Brand", name: p.brand } } : {}), offers: { "@type": "Offer", url, priceCurrency: "UAH", price: pr.toFixed(2), availability: p.st ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", itemCondition: "https://schema.org/NewCondition" } };
  const crumbs = p.c.map((n, i) => `<a href="${SITE}/c/${p.c.slice(0, i + 1).map(x => slug(x)).join("/")}/">${esc(n)}</a>`).join(" › ");
  const body = `<nav class="crumbs">${crumbs}</nav><h1>${esc(p.name)}</h1>${im ? `<p><img src="${esc(im)}" alt="${esc(p.name)}" width="400" style="max-width:100%;height:auto"></p>` : ""}<p><b>${money(pr)}</b> · ${p.st ? "В наявності" : "Немає в наявності"} · Артикул: ${esc(p.id)}${p.brand ? " · Бренд: " + esc(p.brand) : ""}</p>${p.d ? `<p>${esc(p.d)}</p>` : ""}${specRows(p.sp).length ? `<table>${specRows(p.sp).map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join("")}</table>` : ""}`;
  fs.mkdirSync(rel, { recursive: true });
  fs.writeFileSync(rel + "index.html", page({ title: `${p.name} — купити в Trend Electro`, desc, url, hash: "#/p/" + encodeURIComponent(p.id), body, ld, image: im }));
  urls.push([url, 0.7]);
}
/* категорії */
const nodes = new Map();
P.forEach(p => { for (let i = 1; i <= p.c.length; i++) { const k = p.c.slice(0, i).join(SEP); if (!nodes.has(k)) nodes.set(k, { path: p.c.slice(0, i), items: [] }); nodes.get(k).items.push(p) } });
for (const [k, n] of nodes) {
  const rel = "c/" + n.path.map(x => slug(x)).join("/") + "/", url = `${SITE}/${rel}`, name = n.path[n.path.length - 1];
  const meta = CM[k] || {}, desc = meta.description || `${name} — ${n.items.length} товарів у каталозі Trend Electro. Ціни, наявність, доставка по Україні.`;
  const ld = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: n.path.map((x, i) => ({ "@type": "ListItem", position: i + 1, name: x, item: `${SITE}/c/${n.path.slice(0, i + 1).map(y => slug(y)).join("/")}/` })) };
  const list = n.items.slice(0, 150).map(p => `<li><a href="${SITE}/${purl.get(p.id)}">${esc(p.name)}</a> — ${money(price(p))}</li>`).join("");
  fs.mkdirSync(rel, { recursive: true });
  fs.writeFileSync(rel + "index.html", page({ title: `${ctitle(name)} — купити в Trend Electro`, desc, url, hash: "#/c/" + n.path.map(encodeURIComponent).join("/"), body: `<h1>${esc(name)}</h1><p>${esc(desc)}</p><ul>${list}</ul>`, ld }));
  urls.push([url, n.path.length === 1 ? 0.9 : 0.8]);
}
urls.unshift([SITE + "/", 1]);
fs.writeFileSync("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `<url><loc>${esc(u[0])}</loc><lastmod>${today}</lastmod><priority>${u[1]}</priority></url>`).join("\n")}\n</urlset>\n`);
fs.writeFileSync("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
console.log("сторінок:", urls.length);
