// Створює новий сайт-магазин із цього проєкту: копіює файли і підставляє ваш бренд.
// Запуск:  node template/new-site.mjs template/brand.json ../my-new-shop
// Нічого не змінює в поточному проєкті: все пишеться в нову папку.
import fs from "fs";
import path from "path";

const [cfgPath, outDir] = process.argv.slice(2);
if (!cfgPath || !outDir) { console.error("Використання: node template/new-site.mjs <brand.json> <папка-нового-сайту>"); process.exit(1); }
const B = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
for (const k of ["name", "domain", "color", "supabase_url", "supabase_key"]) if (!B[k] || /ВСТАВТЕ/i.test(B[k])) { console.error("У brand.json не заповнено поле: " + k); process.exit(1); }
if (!/^#[0-9a-f]{6}$/i.test(B.color)) { console.error("color має бути у форматі #RRGGBB"); process.exit(1); }
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const out = path.resolve(outDir);
if (out === root || out.startsWith(root + path.sep)) { console.error("Нова папка має бути поза цим проєктом."); process.exit(1); }
if (fs.existsSync(out) && fs.readdirSync(out).length) { console.error("Папка вже існує і не порожня: " + out); process.exit(1); }

const OLD = { name: "Trend Electro", domain: "trendelectro.com.ua", color: "#0ABAB5", sbHost: "indkdtiofjahcshdxlcg.supabase.co" };
const cur = fs.readFileSync(path.join(root, "config.js"), "utf8");
const OLDKEY = (cur.match(/key:\s*["']([^"']+)["']/) || [])[1];
const sbHost = new URL(B.supabase_url).host;

/* що копіюємо: усе з кореня, крім згенерованого, чужого і службового */
const SKIP = new Set([".git", "template", "node_modules", "img", "p", "c", "poradu", "promo", "feed", "sitemap.xml", "robots.txt", "rebuild.txt", "CNAME", "config.js", "README.md", "articles.json", "c-redirects.json"]);
const SKIP_RE = [/^google[0-9a-f]+\.html$/i, /\.sql$/i];
const TEXT = /\.(html|js|mjs|css|json|webmanifest|yml|yaml|txt|xml)$/i;
const files = [];
(function walk(d, rel = "") {
  for (const n of fs.readdirSync(d)) {
    const r = rel ? rel + "/" + n : n;
    if (!rel && (SKIP.has(n) || SKIP_RE.some(re => re.test(n)))) continue;
    const full = path.join(d, n);
    if (fs.statSync(full).isDirectory()) walk(full, r); else files.push(r);
  }
})(root);

const custom = Object.entries(B.replacements || {}).sort((a, b) => b[0].length - a[0].length);
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function brand(text) {
  for (const [a, b] of custom) text = text.split(a).join(b);
  text = text.split(OLD.sbHost).join(sbHost);
  if (OLDKEY) text = text.split(OLDKEY).join(B.supabase_key);
  text = text.split("https://sviatko86.github.io/TrendElectro/").join("https://" + B.domain + "/");
  text = text.split(OLD.domain.replace(/\./g, "\\.")).join(B.domain.replace(/\./g, "\\."));
  text = text.split(OLD.domain).join(B.domain);
  text = text.split("TrendElectroBot").join((B.name.replace(/[^A-Za-z0-9]/g, "") || "Shop") + "Bot");
  text = text.replace(/TREND\s*Electro/g, B.name).split(OLD.name).join(B.name);
  text = text.replace(new RegExp(esc(OLD.color), "gi"), B.color);
  if (B.title_suffix) text = text.split("електротовари та LED-освітлення").join(B.title_suffix);
  return text;
}

fs.mkdirSync(out, { recursive: true });
let changed = 0;
for (const f of files) {
  const src = path.join(root, f), dst = path.join(out, f);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  if (TEXT.test(f)) { const a = fs.readFileSync(src, "utf8"), b = brand(a); if (a !== b) changed++; fs.writeFileSync(dst, b); }
  else fs.copyFileSync(src, dst);
}
/* ваші логотипи й іконки (необовʼязково): "assets": {"logo1.webp": "шлях/до/файлу", ...} */
for (const [name, p] of Object.entries(B.assets || {})) {
  if (!fs.existsSync(p)) { console.warn("! Не знайдено файл для " + name + ": " + p); continue; }
  fs.copyFileSync(p, path.join(out, name));
}
fs.writeFileSync(path.join(out, "config.js"), `// Налаштування підключення до Supabase. Змінюється лише тут.\nwindow.TE = {\n  url: ${JSON.stringify(B.supabase_url)},\n  key: ${JSON.stringify(B.supabase_key)}\n};\n`);
fs.writeFileSync(path.join(out, "CNAME"), B.domain + "\n");
fs.writeFileSync(path.join(out, "articles.json"), "[]");
fs.writeFileSync(path.join(out, "c-redirects.json"), "[]");
fs.writeFileSync(path.join(out, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: https://${B.domain}/sitemap.xml\n`);

const shop = { site_url: "https://" + B.domain, card_prefix: (B.card_prefix || "CARD").toUpperCase() };
fs.writeFileSync(path.join(out, "seed.sql"),
  `-- Запустіть у Supabase (SQL Editor) після install.sql: адреса сайту й префікс карток клієнтів.\n` +
  `insert into public.settings (key, value) values ('shop', '${JSON.stringify(shop)}'::jsonb)\n` +
  `on conflict (key) do update set value = public.settings.value || excluded.value;\n`);

/* перевірка: чи не лишилось старого бренду */
const left = [];
for (const f of files) {
  if (!TEXT.test(f)) continue;
  const t = fs.readFileSync(path.join(out, f), "utf8");
  for (const w of [OLD.name, OLD.domain, OLD.sbHost, "trendelectro", "sviatko86", "TrendElectro"]) if (t.includes(w)) left.push(f + " → " + w);
}
const niche = {};
for (const f of ["index.html", "app.js", "seo.js", "admin.html"]) {
  const t = fs.readFileSync(path.join(out, f), "utf8");
  niche[f] = (t.match(/електро|Електро|LED-освітл/g) || []).length;
}
console.log("Готово: " + out);
console.log("Файлів скопійовано: " + files.length + ", з підставленим брендом: " + changed);
if (left.length) console.log("УВАГА, лишився старий бренд:\n  " + [...new Set(left)].join("\n  "));
console.log("Тексти про електротовари, які варто переглянути (кількість згадок): " + JSON.stringify(niche));
console.log("Далі: див. template/README.md, кроки після створення папки.");
