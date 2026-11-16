/* =========================================================
   Shared header and footer, language switch, mobile menu.
   ========================================================= */

/* ⚠️ Контакты — заменить на реальные перед запуском */
const SITE = {
  phone: "+998 00 000 00 00",
  phoneHref: "tel:+998000000000",
  telegram: "https://t.me/",
  instagram: "https://instagram.com/"
};

const PAGES = [
  { id: "home", href: "index.html", key: "nav.home" },
  { id: "about", href: "about.html", key: "nav.about" },
  { id: "products", href: "products.html", key: "nav.products" },
  { id: "feedback", href: "feedback.html", key: "nav.feedback" }
];

const BRAND = `<a class="brand" href="index.html">
    <strong>UZBEK HALVA &amp; DRY FRUITS</strong>
    <small data-i18n="brand.tag"></small>
  </a>`;

/* Suzani rosette — embroidered medallion motif */
const ROSETTE = `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1"><circle cx="50" cy="50" r="46"/><circle cx="50" cy="50" r="41" stroke-dasharray="1 3"/><ellipse cx="50" cy="22" rx="6" ry="13" transform="rotate(0 50 50)"/><circle cx="50" cy="9" r="1.6" fill="currentColor" stroke="none" transform="rotate(15 50 50)"/><ellipse cx="50" cy="22" rx="6" ry="13" transform="rotate(30 50 50)"/><circle cx="50" cy="9" r="1.6" fill="currentColor" stroke="none" transform="rotate(45 50 50)"/><ellipse cx="50" cy="22" rx="6" ry="13" transform="rotate(60 50 50)"/><circle cx="50" cy="9" r="1.6" fill="currentColor" stroke="none" transform="rotate(75 50 50)"/><ellipse cx="50" cy="22" rx="6" ry="13" transform="rotate(90 50 50)"/><circle cx="50" cy="9" r="1.6" fill="currentColor" stroke="none" transform="rotate(105 50 50)"/><ellipse cx="50" cy="22" rx="6" ry="13" transform="rotate(120 50 50)"/><circle cx="50" cy="9" r="1.6" fill="currentColor" stroke="none" transform="rotate(135 50 50)"/><ellipse cx="50" cy="22" rx="6" ry="13" transform="rotate(150 50 50)"/><circle cx="50" cy="9" r="1.6" fill="currentColor" stroke="none" transform="rotate(165 50 50)"/><ellipse cx="50" cy="22" rx="6" ry="13" transform="rotate(180 50 50)"/><circle cx="50" cy="9" r="1.6" fill="currentColor" stroke="none" transform="rotate(195 50 50)"/><ellipse cx="50" cy="22" rx="6" ry="13" transform="rotate(210 50 50)"/><circle cx="50" cy="9" r="1.6" fill="currentColor" stroke="none" transform="rotate(225 50 50)"/><ellipse cx="50" cy="22" rx="6" ry="13" transform="rotate(240 50 50)"/><circle cx="50" cy="9" r="1.6" fill="currentColor" stroke="none" transform="rotate(255 50 50)"/><ellipse cx="50" cy="22" rx="6" ry="13" transform="rotate(270 50 50)"/><circle cx="50" cy="9" r="1.6" fill="currentColor" stroke="none" transform="rotate(285 50 50)"/><ellipse cx="50" cy="22" rx="6" ry="13" transform="rotate(300 50 50)"/><circle cx="50" cy="9" r="1.6" fill="currentColor" stroke="none" transform="rotate(315 50 50)"/><ellipse cx="50" cy="22" rx="6" ry="13" transform="rotate(330 50 50)"/><circle cx="50" cy="9" r="1.6" fill="currentColor" stroke="none" transform="rotate(345 50 50)"/><polygon points="50.00,30.00 55.86,35.86 64.14,35.86 64.14,44.14 70.00,50.00 64.14,55.86 64.14,64.14 55.86,64.14 50.00,70.00 44.14,64.14 35.86,64.14 35.86,55.86 30.00,50.00 35.86,44.14 35.86,35.86 44.14,35.86"/><polygon points="58.31,53.44 53.44,58.31 46.56,58.31 41.69,53.44 41.69,46.56 46.56,41.69 53.44,41.69 58.31,46.56"/><circle cx="50" cy="50" r="3" fill="currentColor" stroke="none"/></svg>`;

function renderHeader(page) {
  const links = PAGES.map(p =>
    `<li><a href="${p.href}"${p.id === page ? ' aria-current="page"' : ""}><span data-i18n="${p.key}"></span></a></li>`).join("");
  return `
  <header class="site-header">
    <div class="container header-inner">
      ${BRAND}
      <nav class="nav" id="site-nav">
        <div class="nav-portal">
          <svg class="portal-frame" viewBox="0 0 100 140" preserveAspectRatio="none" aria-hidden="true">
            <path class="outer" d="M2 140V54C2 32 24 14 50 2C76 14 98 32 98 54V140" vector-effect="non-scaling-stroke"/>
            <path class="inner" d="M7 140V56C7 36 27 20 50 9C73 20 93 36 93 56V140" vector-effect="non-scaling-stroke"/>
            <path class="base" d="M0 139.5H100" vector-effect="non-scaling-stroke"/>
          </svg>
          <span class="rosette" aria-hidden="true">${ROSETTE}</span>
          <ul>${links}</ul>
        </div>
        <div class="nav-extra">
          <p class="loc" data-i18n="common.location"></p>
          <a class="phone" href="${SITE.phoneHref}">${SITE.phone}</a>
          <p class="socials"><a href="${SITE.telegram}" target="_blank" rel="noopener">Telegram</a><i aria-hidden="true"></i><a href="${SITE.instagram}" target="_blank" rel="noopener">Instagram</a></p>
        </div>
        <div class="atlas" aria-hidden="true"></div>
      </nav>
      <div class="lang-switch" role="group" aria-label="Language">
        <button type="button" data-lang="ru">RU</button>
        <button type="button" data-lang="en">EN</button>
        <button type="button" data-lang="uz">UZ</button>
      </div>
      <button class="burger" type="button" aria-controls="site-nav" aria-expanded="false" data-i18n-aria="nav.menu"><span></span><span></span></button>
    </div>
  </header>`;
}

function renderFooter() {
  const links = PAGES.map(p => `<li><a href="${p.href}" data-i18n="${p.key}"></a></li>`).join("");
  return `
  <footer class="site-footer">
    <div class="atlas" aria-hidden="true"></div>
    <div class="container footer-cta">
      <div>
        <span class="footer-rosette" aria-hidden="true">${ROSETTE}</span>
        <h2><span data-i18n="footer.cta.a"></span> <span data-i18n="footer.cta.b"></span></h2>
        <p data-i18n="footer.cta.text"></p>
      </div>
      <div class="footer-contact">
        <a class="phone" href="${SITE.phoneHref}">${SITE.phone}</a>
        <div class="pills">
          <a class="pill" href="${SITE.telegram}" target="_blank" rel="noopener">Telegram</a>
          <a class="pill" href="${SITE.instagram}" target="_blank" rel="noopener">Instagram</a>
        </div>
      </div>
    </div>
    <div class="container footer-top">
      <div>
        ${BRAND}
        <p data-i18n="footer.about"></p>
        <p class="footer-proverb"><strong lang="uz">«Mehmon otangdan ulug‘»</strong><span data-i18n="footer.proverb"></span></p>
      </div>
      <div>
        <h4 data-i18n="footer.pages"></h4>
        <ul>${links}</ul>
      </div>
      <div>
        <h4 data-i18n="footer.contacts"></h4>
        <ul>
          <li data-i18n="footer.address"></li>
          <li data-i18n="footer.hours"></li>
        </ul>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>© ${new Date().getFullYear()} Uzbek Halva &amp; Dry Fruits. <span data-i18n="footer.rights"></span></span>
      <button class="to-top" type="button"><span data-i18n="footer.top"></span><span class="arr" aria-hidden="true">↑</span></button>
    </div>
    <div class="footer-word" aria-hidden="true">Uzbek Halva</div>
  </footer>`;
}

/* Links marked data-site="phone|telegram|instagram" get real URLs from SITE */
function fillSiteLinks() {
  document.querySelectorAll("[data-site]").forEach(el => {
    const k = el.dataset.site;
    el.href = k === "phone" ? SITE.phoneHref : SITE[k];
    if (el.hasAttribute("data-site-text")) el.textContent = SITE[k];
  });
}

function initLayout() {
  document.body.insertAdjacentHTML("afterbegin", renderHeader(document.body.dataset.page));
  document.body.insertAdjacentHTML("beforeend", renderFooter());
  fillSiteLinks();

  document.querySelectorAll(".lang-switch button").forEach(btn =>
    btn.addEventListener("click", () => setLang(btn.dataset.lang)));

  const burger = document.querySelector(".burger");
  const setMenu = open => {
    document.body.classList.toggle("nav-open", open);
    burger.setAttribute("aria-expanded", String(open));
  };
  burger.addEventListener("click", () => setMenu(!document.body.classList.contains("nav-open")));
  document.querySelectorAll(".nav a").forEach(a => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
  matchMedia("(min-width: 861px)").addEventListener("change", e => { if (e.matches) setMenu(false); });

  document.querySelector(".to-top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  applyI18n();
}

document.addEventListener("DOMContentLoaded", initLayout);
