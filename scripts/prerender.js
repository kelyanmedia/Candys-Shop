/*
 * Пререндер: вшивает в HTML то, что иначе рисует JavaScript, чтобы поисковики
 * видели русский текст, шапку, подвал и мета-теги сразу.
 *   Запуск:  node scripts/prerender.js
 * Запускать после изменений текстов (i18n.js), шапки/подвала (layout.js) или страниц.
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const BASE = "https://www.uzbekfruitsairport.uz";
const SITE_NAME = "Uzbek Halva & Dry Fruits";

/* ---- Прогоняем i18n.js / layout.js в песочнице, чтобы получить t(), renderHeader(), renderFooter() ---- */
const ctx = vm.createContext({
  URLSearchParams, console,
  location: { search: "" },
  navigator: { language: "ru" },
  localStorage: { getItem: () => null, setItem() {} },
  window: {},
  document: { addEventListener() {}, querySelector: () => null },
});
for (const f of ["i18n.js", "extra-i18n.js", "layout.js"]) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, "assets/js", f), "utf8"), ctx, { filename: f });
}
const T = key => vm.runInContext(`t(${JSON.stringify(key)}, "ru")`, ctx);
const header = page => vm.runInContext(`renderHeader(${JSON.stringify(page)})`, ctx);
const footer = () => vm.runInContext("renderFooter()", ctx);

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ---- Страницы ---- */
const PAGES = [
  { file: "index.html", page: "home", path: "/", titleKey: "meta.home", image: "store-front-2.jpg",
    desc: "Узбекская халва, сухофрукты, орехи и восточные сладости в зоне Duty Free аэропорта Ташкента. Свежие вкусы Узбекистана в дорогу и в подарок." },
  { file: "about.html", page: "about", path: "/about", titleKey: "meta.about", image: "store-front.jpg",
    desc: "История магазина Uzbek Halva & Dry Fruits, наши принципы и как нас найти: зона вылета Duty Free международного аэропорта Ташкента." },
  { file: "products.html", page: "products", path: "/products", titleKey: "meta.products", image: "store-side.jpg",
    desc: "Ассортимент: узбекская халва, сухофрукты, орехи, восточные сладости и подарочные наборы в Duty Free аэропорта Ташкента." },
  { file: "feedback.html", page: "feedback", path: "/feedback", titleKey: "meta.feedback", image: "store-corner.jpg",
    desc: "Оставьте отзыв о магазине Uzbek Halva & Dry Fruits — оцените визит от 0 до 10 и расскажите, как нам стать лучше." },
  { file: "thanks.html", page: "thanks", path: "/thanks", titleKey: "meta.thanks", image: "store-front-2.jpg", noindex: true,
    desc: "Спасибо за ваш отзыв о магазине Uzbek Halva & Dry Fruits." },
  { file: "404.html", page: "404", path: "/404", titleKey: "meta.404", image: "store-front-2.jpg", noindex: true,
    desc: "Страница не найдена. Вернитесь на главную Uzbek Halva & Dry Fruits." },
];

const CATS = [["halva", "box-samarkand.jpg"], ["dried", "cat-dried.jpg"], ["nuts", "cat-nuts.jpg"], ["sweets", "sweets-box.jpg"], ["gifts", "box-green.jpg"]];

function jsonLd(p) {
  const url = BASE + (p.path === "/" ? "/" : p.path);
  const store = {
    "@type": "Store", "@id": BASE + "/#store", name: SITE_NAME, url: BASE + "/",
    description: T("home.hero.text"),
    image: BASE + "/assets/img/store-front-2.jpg",
    address: { "@type": "PostalAddress", streetAddress: "Duty Free, зона вылета, Международный аэропорт Ташкента", addressLocality: "Ташкент", addressCountry: "UZ" },
    areaServed: "UZ", inLanguage: ["ru", "en", "uz"],
    makesOffer: CATS.map(([k]) => ({ "@type": "Offer", itemOffered: { "@type": "Product", name: T("cat." + k), description: T("cat." + k + ".d") } })),
  };
  const graph = [];
  if (p.page === "home") {
    graph.push(store, { "@type": "WebSite", "@id": BASE + "/#website", url: BASE + "/", name: SITE_NAME, inLanguage: "ru" });
  } else if (p.page === "products") {
    graph.push({
      "@type": "CollectionPage", url, name: T("products.head.title"), isPartOf: { "@id": BASE + "/#website" },
      mainEntity: { "@type": "ItemList", itemListElement: CATS.map(([k, img], i) => ({
        "@type": "ListItem", position: i + 1, name: T("cat." + k), description: T("cat." + k + ".d"), image: BASE + "/assets/img/" + img })) },
    });
  } else if (p.page === "about") {
    graph.push({ "@type": "AboutPage", url, name: T("about.head.title"), about: { "@id": BASE + "/#store" } });
  } else if (p.page === "feedback") {
    graph.push({ "@type": "ContactPage", url, name: T("fb.head.title") });
  }
  if (p.page !== "home" && !p.noindex) {
    graph.push({ "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: T("nav.home"), item: BASE + "/" },
      { "@type": "ListItem", position: 2, name: T(p.titleKey.replace("meta.", "nav.")), item: url } ] });
  }
  return graph.length ? `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>` : "";
}

function seoHead(p) {
  const url = BASE + (p.path === "/" ? "/" : p.path);
  const title = T(p.titleKey);
  const img = BASE + "/assets/img/" + p.image;
  const lines = [
    `<title data-i18n="${p.titleKey}">${esc(title)}</title>`,
    `<meta name="description" content="${esc(p.desc)}">`,
    p.noindex ? `<meta name="robots" content="noindex, follow">` : `<meta name="robots" content="index, follow, max-image-preview:large">`,
    ...(p.page === "404" ? [] : [`<link rel="canonical" href="${url}">`]),
    `<meta name="theme-color" content="#1a1424">`,
    `<link rel="icon" href="/assets/img/pattern.svg" type="image/svg+xml">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(p.desc)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${img}">`,
    `<meta property="og:image:width" content="1280">`,
    `<meta property="og:image:height" content="960">`,
    `<meta property="og:locale" content="ru_RU">`,
    `<meta property="og:locale:alternate" content="en_US">`,
    `<meta property="og:locale:alternate" content="uz_UZ">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(p.desc)}">`,
    `<meta name="twitter:image" content="${img}">`,
    jsonLd(p),
  ].filter(Boolean);
  return lines.map(l => "  " + l).join("\n");
}

/* Подставляет русский текст во все data-i18n / -placeholder / -aria */
function fillI18n(html) {
  html = html.replace(/<([a-z0-9]+)([^>]*?)\sdata-i18n="([^"]+)"([^>]*)>([^<]*)<\/\1>/gi,
    (m, tag, a, key, b, inner) => `<${tag}${a} data-i18n="${key}"${b}>${esc(T(key))}</${tag}>`);
  html = html.replace(/<([a-z0-9]+)((?:[^>"]|"[^"]*")*?)\sdata-i18n-placeholder="([^"]+)"((?:[^>"]|"[^"]*")*)>/gi,
    (m, tag, a, key, b) => `<${tag}${a.replace(/\splaceholder="[^"]*"/, "")} data-i18n-placeholder="${key}" placeholder="${esc(T(key))}"${b.replace(/\splaceholder="[^"]*"/, "")}>`);
  html = html.replace(/<([a-z0-9]+)((?:[^>"]|"[^"]*")*?)\sdata-i18n-aria="([^"]+)"((?:[^>"]|"[^"]*")*)>/gi,
    (m, tag, a, key, b) => `<${tag}${a.replace(/\saria-label="[^"]*"/, "")} data-i18n-aria="${key}" aria-label="${esc(T(key))}"${b.replace(/\saria-label="[^"]*"/, "")}>`);
  return html;
}

function strip(html, name) {
  return html.replace(new RegExp(`\\s*<!-- prerender:${name} -->[\\s\\S]*?<!-- /prerender:${name} -->`), "");
}

for (const p of PAGES) {
  const file = path.join(ROOT, p.file);
  let html = fs.readFileSync(file, "utf8");

  html = html.replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/, `<!-- seo:start -->\n${seoHead(p)}\n  <!-- seo:end -->`);

  html = strip(strip(html, "header"), "footer");
  html = html.replace(/(<body[^>]*>)/, `$1\n<!-- prerender:header -->${header(p.page)}<!-- /prerender:header -->`);
  html = html.replace(/<\/main>/, `</main>\n<!-- prerender:footer -->${footer()}<!-- /prerender:footer -->`);

  html = fillI18n(html);
  // Версия в адресе CSS/JS: после правок браузер не показывает закэшированную старую версию
  html = html.replace(/(src|href)="(\/assets\/(?:css|js)\/[\w.-]+\.(?:css|js))(?:\?v=[a-f0-9]+)?"/g, (m, attr, url) => {
    const v = crypto.createHash("md5").update(fs.readFileSync(path.join(ROOT, url))).digest("hex").slice(0, 8);
    return `${attr}="${url}?v=${v}"`;
  });
  fs.writeFileSync(file, html);
  console.log("prerendered", p.file);
}

/* ---- sitemap.xml / robots.txt ---- */
const today = new Date().toISOString().slice(0, 10);
const urls = PAGES.filter(p => !p.noindex);
fs.writeFileSync(path.join(ROOT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(p => `  <url>\n    <loc>${BASE}${p.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.page === "home" ? "weekly" : "monthly"}</changefreq>\n    <priority>${p.page === "home" ? "1.0" : "0.7"}</priority>\n  </url>`).join("\n") +
  `\n</urlset>\n`);
fs.writeFileSync(path.join(ROOT, "robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /thanks\n\nSitemap: ${BASE}/sitemap.xml\n`);
console.log("sitemap.xml, robots.txt");
