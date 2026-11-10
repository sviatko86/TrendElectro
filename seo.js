// Генерує: сторінки товарів і категорій (p/, c/), sitemap.xml, robots.txt, фото у img/ (стиснені).
// Запускається GitHub Action щодня і вручну. Нічого не змінює в базі даних.
import fs from "fs";
const SITE = (process.env.SITE || "https://trendelectro.com.ua").replace(/\/$/, "");
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
let cats = []; try { cats = await get("categories?select=path,hidden,description,seo_title"); } catch (e) { try { cats = await get("categories?select=path,hidden,description"); } catch (e2) { } }
const CM = {}; cats.forEach(c => CM[c.path] = c);
const hid = c => { for (let i = 1; i <= c.length; i++) { const m = CM[c.slice(0, i).join(SEP)]; if (m && m.hidden) return true } return false };
const PR = settings.pricing || {}, shop = settings.shop || {};
function rate(c) {
  const k1 = c[0], k2 = c[1] ? k1 + SEP + c[1] : null, k3 = c[2] ? k2 + SEP + c[2] : null; let m = null, d = null;
  [k3, k2, k1].forEach(k => { const o = k && PR.by_category && PR.by_category[k]; if (o) { if (m == null && o.m != null) m = +o.m; if (d == null && o.d != null) d = +o.d } });
  return [m != null ? m : +PR.markup_percent || 0, d != null ? d : +PR.discount_percent || 0];
}
const price = p => { const r = rate(p.c); return Math.round(p.price * (1 + r[0] / 100) * (1 - r[1] / 100) * 100) / 100 };

const PSEL = "id,name,category,subcategory,subcategory2,brand,price,image_url,in_stock,description,specs";
let raw; try { raw = await all("products", PSEL + ",seo_title,seo_description", "&active=eq.true"); } catch (e) { raw = await all("products", PSEL, "&active=eq.true"); }
const P = raw.map(r => ({ id: r.id, name: r.name, c: [r.category, r.subcategory, r.subcategory2].filter(x => x && x !== "Усі"), brand: r.brand || "", price: +r.price || 0, img: r.image_url || "", st: r.in_stock !== false, d: r.description || "", sp: r.specs || "", seo_t: r.seo_title || "", seo_d: r.seo_description || "" })).filter(p => !hid(p.c));
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
/* легкі мініатюри (до 480 px) для карток і списків: у 4 рази менші за повне фото; сайт бере їх лише якщо вони є у img/smap.json */
{
  let smap = [];
  if (sharp) {
    fs.mkdirSync("img/s", { recursive: true });
    const need = have.filter(id => !fs.existsSync(`img/s/${id}.webp`));
    console.log("мініатюр до створення:", need.length);
    for (let i = 0; i < need.length; i += 8) await Promise.all(need.slice(i, i + 8).map(id => sharp(`img/${id}.webp`).resize(480, 480, { fit: "inside", withoutEnlargement: true }).webp({ quality: 74 }).toFile(`img/s/${id}.webp`).catch(() => { })));
  }
  if (fs.existsSync("img/s")) smap = fs.readdirSync("img/s").filter(f => f.endsWith(".webp")).map(f => f.slice(0, -5)).filter(id => HAVE.has(id));
  fs.writeFileSync("img/smap.json", JSON.stringify(smap));
  console.log("мініатюр усього:", smap.length);
}
const imgUrl = p => HAVE.has(safe(p.id)) ? `${SITE}/img/${safe(p.id)}.webp` : p.img;

/* ---------- сторінки ---------- */
const TPL = fs.readFileSync("index.html", "utf8");
const abs = h => h.replace(/(href|src)="(app\.css|app\.js|config\.js|logo\d\.webp|manifest\.webmanifest|apple-touch-icon\.png)([^"]*)"/g, `$1="${SITE}/$2$3"`);
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
  const desc = (p.seo_d || p.d || `${p.name}. Купити в Trend Electro: ціна ${money(pr)}, доставка по Україні.`).replace(/\s+/g, " ").slice(0, 300);
  const ld = { "@context": "https://schema.org", "@type": "Product", name: p.name, sku: p.id, description: desc, ...(im ? { image: [im] } : {}), ...(p.brand ? { brand: { "@type": "Brand", name: p.brand } } : {}), offers: { "@type": "Offer", url, priceCurrency: "UAH", price: pr.toFixed(2), availability: p.st ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", itemCondition: "https://schema.org/NewCondition" } };
  const crumbs = p.c.map((n, i) => `<a href="${SITE}/c/${p.c.slice(0, i + 1).map(x => slug(x)).join("/")}/">${esc(n)}</a>`).join(" › ");
  const body = `<nav class="crumbs">${crumbs}</nav><h1>${esc(p.name)}</h1>${im ? `<p><img src="${esc(im)}" alt="${esc(p.name)}" width="400" style="max-width:100%;height:auto"></p>` : ""}<p><b>${money(pr)}</b> · ${p.st ? "В наявності" : "Немає в наявності"} · Артикул: ${esc(p.id)}${p.brand ? " · Бренд: " + esc(p.brand) : ""}</p>${p.d ? `<p>${esc(p.d)}</p>` : ""}${specRows(p.sp).length ? `<table>${specRows(p.sp).map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join("")}</table>` : ""}`;
  fs.mkdirSync(rel, { recursive: true });
  fs.writeFileSync(rel + "index.html", page({ title: p.seo_t || `${p.name} — купити в Trend Electro`, desc, url, hash: "#/p/" + encodeURIComponent(p.id), body, ld, image: im }));
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
  fs.writeFileSync(rel + "index.html", page({ title: meta.seo_title || `${ctitle(name)} — купити в Trend Electro`, desc, url, hash: "#/c/" + n.path.map(encodeURIComponent).join("/"), body: `<h1>${esc(name)}</h1><p>${esc(desc)}</p><ul>${list}</ul>`, ld }));
  urls.push([url, n.path.length === 1 ? 0.9 : 0.8]);
}
/* старі адреси категорій → нові (GitHub Pages не вміє 301: canonical + миттєвий перехід) */
try {
  const RD = JSON.parse(fs.readFileSync("c-redirects.json", "utf8"));
  const cp = a => "c/" + a.map(x => slug(x)).join("/") + "/";
  for (const [o, t] of RD) {
    const rel = cp(o); if (fs.existsSync(rel + "index.html")) continue;
    const to = `${SITE}/${cp(t)}`;
    fs.mkdirSync(rel, { recursive: true });
    fs.writeFileSync(rel + "index.html", `<!doctype html><html lang="uk"><head><meta charset="utf-8"><title>${esc(t[t.length - 1])} — Trend Electro</title><link rel="canonical" href="${to}"><meta http-equiv="refresh" content="0;url=${to}"><script>location.replace(${JSON.stringify(to)})</script></head><body><a href="${to}">${esc(t[t.length - 1])}</a></body></html>`);
  }
} catch (e) { console.log("redirects:", e.message) }
/* ---------- поради (articles.json) ---------- */
let ART = []; try { ART = JSON.parse(fs.readFileSync("articles.json", "utf8")) } catch (e) { }
fs.rmSync("poradu", { recursive: true, force: true });
if (ART.length) {
  const gl = ART.map(a => `<li><a href="${SITE}/poradu/${a.slug}/">${esc(a.title)}</a> — ${esc(a.description)}</li>`).join("");
  fs.mkdirSync("poradu", { recursive: true });
  fs.writeFileSync("poradu/index.html", page({ title: "Поради з вибору електротоварів — Trend Electro", desc: "Практичні статті: як вибрати лампу, кабель, розетки, автомати й світильники.", url: `${SITE}/poradu/`, hash: "#/guide/", body: `<h1>Поради з вибору електротоварів</h1><ul>${gl}</ul>`, ld: { "@context": "https://schema.org", "@type": "CollectionPage", name: "Поради", url: `${SITE}/poradu/` } }));
  urls.push([`${SITE}/poradu/`, 0.6]);
  for (const a of ART) {
    const rel = `poradu/${a.slug}/`, url = `${SITE}/${rel}`;
    fs.mkdirSync(rel, { recursive: true });
    fs.writeFileSync(rel + "index.html", page({ title: `${a.title} — Trend Electro`, desc: a.description, url, hash: "#/guide/" + a.slug, body: `<h1>${esc(a.title)}</h1>${a.body}`, ld: { "@context": "https://schema.org", "@type": "Article", headline: a.title, description: a.description, mainEntityOfPage: url, author: { "@type": "Organization", name: "Trend Electro" }, publisher: { "@type": "Organization", name: "Trend Electro" }, ...(a.img ? { image: `${SITE}/${a.img}` } : {}) }, image: a.img ? `${SITE}/${a.img}` : undefined }));
    urls.push([url, 0.6]);
  }
}
/* ---------- фіди: Google Merchant Center і Prom/Rozetka/Epicentr (YML) ---------- */
fs.mkdirSync("feed", { recursive: true });
const cdata = t => "<![CDATA[" + String(t).replace(/]]>/g, "]]]]><![CDATA[>") + "]]>";
const dsc = p => (p.d || p.name).replace(/\s+/g, " ").slice(0, 4900);
let g = `<?xml version="1.0" encoding="UTF-8"?>\n<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0"><channel><title>Trend Electro</title><link>${SITE}/</link><description>Електротовари та LED-освітлення</description>\n`;
let gn = 0;
for (const p of P) {
  const im = imgUrl(p); if (!/^https?:/.test(im) || !p.c.length) continue; gn++;
  g += `<item><g:id>${esc(safe(p.id))}</g:id><title>${esc(p.name.slice(0, 150))}</title><description>${esc(dsc(p))}</description><link>${SITE}/${purl.get(p.id)}</link><g:image_link>${esc(im)}</g:image_link><g:availability>${p.st ? "in_stock" : "out_of_stock"}</g:availability><g:price>${price(p).toFixed(2)} UAH</g:price>${p.brand ? `<g:brand>${esc(p.brand)}</g:brand>` : ""}<g:mpn>${esc(p.id)}</g:mpn><g:condition>new</g:condition><g:product_type>${esc(p.c.join(" > "))}</g:product_type></item>\n`;
}
fs.writeFileSync("feed/google.xml", g + "</channel></rss>\n");
const cid = new Map(); let cn = 0; const cxml = [];
for (const [k, n] of nodes) { cid.set(k, ++cn); }
for (const [k, n] of nodes) { const par = n.path.length > 1 ? cid.get(n.path.slice(0, -1).join(SEP)) : null; cxml.push(`<category id="${cid.get(k)}"${par ? ` parentId="${par}"` : ""}>${esc(n.path[n.path.length - 1])}</category>`) }
let y = `<?xml version="1.0" encoding="UTF-8"?>\n<yml_catalog date="${new Date().toISOString().slice(0, 16).replace("T", " ")}"><shop><name>Trend Electro</name><company>Trend Electro</company><url>${SITE}/</url><currencies><currency id="UAH" rate="1"/></currencies><categories>${cxml.join("")}</categories><offers>\n`;
for (const p of P) {
  if (!p.c.length) continue; const im = imgUrl(p);
  y += `<offer id="${esc(safe(p.id))}" available="${p.st ? "true" : "false"}"><url>${SITE}/${purl.get(p.id)}</url><price>${price(p).toFixed(2)}</price><currencyId>UAH</currencyId><categoryId>${cid.get(p.c.join(SEP))}</categoryId>${/^https?:/.test(im) ? `<picture>${esc(im)}</picture>` : ""}${p.brand ? `<vendor>${esc(p.brand)}</vendor>` : ""}<vendorCode>${esc(p.id)}</vendorCode><name>${esc(p.name)}</name><description>${cdata(dsc(p))}</description>${specRows(p.sp).slice(0, 30).map(r => `<param name="${esc(r[0])}">${esc(r[1])}</param>`).join("")}</offer>\n`;
}
fs.writeFileSync("feed/prom.yml", y + "</offers></shop></yml_catalog>\n");
console.log("фід Google: товарів", gn);
urls.unshift([SITE + "/", 1]);

// Промо-сторінки лендінгів: /promo/<slug>/ (превʼю для Viber/Telegram/Facebook, не для пошуку)
fs.rmSync("promo", { recursive: true, force: true });
try {
  const LN = await get("landings?select=slug,title,theme,blocks&active=eq.true");
  for (const l of LN) {
    if (!/^[a-z0-9][a-z0-9-]{1,60}$/.test(l.slug)) continue;
    const hero = (l.blocks || []).find(b => b.t === "hero" && !b.off) || {};
    const d = Math.min(90, Math.max(0, +(l.theme || {}).disc || 0));
    const desc = (d ? `−${d}% тільки за цим посиланням. ` : "") + (hero.sub || l.title);
    const image = /^https?:/.test(hero.img || "") ? hero.img : `${SITE}/logo1.webp`;
    const url = `${SITE}/promo/${l.slug}/`;
    fs.mkdirSync(`promo/${l.slug}`, { recursive: true });
    fs.writeFileSync(`promo/${l.slug}/index.html`, page({ title: `${l.title} — Trend Electro`, desc, url, hash: "#/l/" + l.slug, body: `<h1>${esc(l.title)}</h1><p>${esc(desc)}</p>`, ld: { "@context": "https://schema.org", "@type": "WebPage", name: l.title, url }, image }).replace("</head>", '<meta name="robots" content="noindex,follow">\n</head>'));
  }
  console.log("promo pages:", LN.length);
} catch (e) { console.log("landings skipped:", e.message); }

fs.writeFileSync("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `<url><loc>${esc(u[0])}</loc><lastmod>${today}</lastmod><priority>${u[1]}</priority></url>`).join("\n")}\n</urlset>\n`);
fs.writeFileSync("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
console.log("сторінок:", urls.length);
