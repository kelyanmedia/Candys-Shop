/* =========================================================
   Feedback (NPS) form
   Отзывы отправляются на api/feedback.php (на Vercel этот адрес
   перенаправляется на api/feedback.js) и приходят в Telegram.
   ========================================================= */

const FEEDBACK_ENDPOINT = "api/feedback.php";

/* ---------- Страны: [ISO, код, маска (# = цифра), точная длина | 0] ---------- */
const COUNTRIES = [
  ["UZ", "998", "## ### ## ##", 9], ["RU", "7", "### ###-##-##", 10], ["KZ", "7", "### ###-##-##", 10],
  ["KG", "996", "### ### ###", 9], ["TJ", "992", "## ### ####", 9], ["TM", "993", "## ######", 8],
  ["AZ", "994", "## ### ## ##", 9], ["AM", "374", "## ######", 8], ["GE", "995", "### ## ## ##", 9],
  ["BY", "375", "## ###-##-##", 9], ["UA", "380", "## ### ## ##", 9], ["MD", "373", "## ######", 8],
  ["TR", "90", "### ### ## ##", 10], ["US", "1", "(###) ###-####", 10], ["CA", "1", "(###) ###-####", 10],
  ["GB", "44", "#### ######", 0], ["DE", "49", "#### ########", 0], ["FR", "33", "# ## ## ## ##", 9],
  ["IT", "39", "### ### ####", 0], ["ES", "34", "### ## ## ##", 9], ["PL", "48", "### ### ###", 9],
  ["NL", "31", "# ########", 9], ["BE", "32", "### ## ## ##", 0], ["CH", "41", "## ### ## ##", 9],
  ["AT", "43", "### ######", 0], ["CZ", "420", "### ### ###", 9], ["SK", "421", "### ### ###", 9],
  ["HU", "36", "## ### ####", 0], ["RO", "40", "### ### ###", 9], ["BG", "359", "### ### ###", 0],
  ["GR", "30", "### ### ####", 10], ["PT", "351", "### ### ###", 9], ["IE", "353", "## ### ####", 0],
  ["SE", "46", "## ### ## ##", 0], ["NO", "47", "### ## ###", 8], ["DK", "45", "## ## ## ##", 8],
  ["FI", "358", "## ### ####", 0], ["LT", "370", "### #####", 8], ["LV", "371", "## ### ###", 8],
  ["EE", "372", "#### ####", 0], ["RS", "381", "## ### ####", 0], ["HR", "385", "## ### ####", 0],
  ["CY", "357", "## ######", 8], ["AE", "971", "## ### ####", 9], ["SA", "966", "## ### ####", 9],
  ["QA", "974", "#### ####", 8], ["KW", "965", "#### ####", 8], ["IL", "972", "## ### ####", 9],
  ["JO", "962", "# #### ####", 9], ["LB", "961", "## ### ###", 0], ["IR", "98", "### ### ####", 10],
  ["IQ", "964", "### ### ####", 10], ["AF", "93", "## ### ####", 9], ["PK", "92", "### #######", 10],
  ["IN", "91", "##### #####", 10], ["BD", "880", "#### ######", 10], ["LK", "94", "## ### ####", 9],
  ["NP", "977", "## ### ####", 10], ["CN", "86", "### #### ####", 11], ["HK", "852", "#### ####", 8],
  ["TW", "886", "### ### ###", 9], ["JP", "81", "## #### ####", 10], ["KR", "82", "## #### ####", 0],
  ["MN", "976", "#### ####", 8], ["TH", "66", "## ### ####", 9], ["VN", "84", "### ### ###", 9],
  ["MY", "60", "## ### ####", 0], ["SG", "65", "#### ####", 8], ["ID", "62", "### ### ####", 0],
  ["PH", "63", "### ### ####", 10], ["AU", "61", "### ### ###", 9], ["NZ", "64", "## ### ####", 0],
  ["EG", "20", "### ### ####", 10], ["MA", "212", "## ### ####", 9], ["DZ", "213", "### ## ## ##", 9],
  ["TN", "216", "## ### ###", 8], ["ZA", "27", "## ### ####", 9], ["NG", "234", "### ### ####", 10],
  ["BR", "55", "## #####-####", 11], ["MX", "52", "### ### ####", 10], ["AR", "54", "## ####-####", 10]
].map(([iso, dial, mask, len]) => ({ iso, dial, mask, len }));

const flagOf = iso => [...iso].map(c => String.fromCodePoint(127397 + c.charCodeAt(0))).join("");
const GENERIC_MASK = "### ### ### ###";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("feedback-form");
  if (!form) return;

  const ratingBox = document.getElementById("rating");
  const ratingError = document.getElementById("rating-error");
  const sendError = document.getElementById("send-error");
  const submitBtn = form.querySelector('button[type="submit"]');
  const today = () => new Date().toISOString().slice(0, 10);

  /* ======================= Оценка 0–10 и реакция ======================= */
  ratingBox.innerHTML = Array.from({ length: 11 }, (_, n) => `
    <input type="radio" name="rating" id="r-${n}" value="${n}">
    <label for="r-${n}" style="--h:${Math.round(n * 12)}">${n}</label>`).join("");

  const reaction = document.getElementById("reaction");
  const rEmoji = document.getElementById("reaction-emoji");
  const rTitle = document.getElementById("reaction-title");
  const rText = document.getElementById("reaction-text");

  function updateReaction(animate) {
    const checked = form.querySelector('input[name="rating"]:checked');
    if (!checked) {
      reaction.removeAttribute("data-on");
      rEmoji.textContent = "🍯";
      rTitle.textContent = "";
      rText.textContent = t("fb.react.empty");
      return;
    }
    const n = +checked.value, r = reactionFor(n);
    reaction.dataset.on = "1";
    reaction.style.setProperty("--h", Math.round(n * 12));
    rEmoji.textContent = r.emoji;
    rTitle.textContent = r.title;
    rText.textContent = r.text;
    if (animate) {
      rEmoji.classList.remove("pop"); void rEmoji.offsetWidth; rEmoji.classList.add("pop");
    }
  }
  /* ---- Блок «Подробности» подстраивается под оценку ---- */
  const ratingGroup = n => n <= 4 ? "low" : n <= 8 ? "mid" : "high";  // ниже 5 — «что не понравилось»
  const SECTION3 = [
    ["q-chips", "data-i18n", "fb.liked"], ["l-disliked", "data-i18n", "fb.disliked"], ["l-improve", "data-i18n", "fb.improve"],
    ["fb-disliked", "data-i18n-placeholder", "fb.disliked.ph"], ["fb-improve", "data-i18n-placeholder", "fb.improve.ph"]
  ];
  function updateSection3() {
    const checked = form.querySelector('input[name="rating"]:checked');
    const g = checked ? ratingGroup(+checked.value) : null;
    const keys = g
      ? ["fb.d." + g + ".chips", "fb.d." + g + ".dis", "fb.d." + g + ".imp", "fb.d." + g + ".dis.ph", "fb.d." + g + ".imp.ph"]
      : SECTION3.map(x => x[2]);
    SECTION3.forEach(([id, attr], i) => document.getElementById(id).setAttribute(attr, keys[i]));
    applyI18n();
    form.dataset.group = g || "";
  }
  ratingBox.addEventListener("change", () => { ratingError.classList.remove("show"); updateReaction(true); updateSection3(); });

  /* ======================= Контакт: телефон / e-mail ======================= */
  const phoneBox = document.getElementById("phone-box");
  const phoneInput = document.getElementById("fb-phone");
  const emailInput = document.getElementById("fb-email");
  const phoneError = document.getElementById("phone-error");
  const emailError = document.getElementById("email-error");
  const ccBtn = document.getElementById("cc-btn");
  const ccPanel = document.getElementById("cc-panel");
  const ccSearch = document.getElementById("cc-search");
  const ccList = document.getElementById("cc-list");
  let country = COUNTRIES[0];

  const maskOf = c => c.mask || GENERIC_MASK;
  const maxDigits = c => c.len || Math.min(14, 15 - c.dial.length);

  function formatNational(digits, c) {
    const mask = maskOf(c);
    let out = "", i = 0;
    for (const ch of mask) {
      if (i >= digits.length) break;
      if (ch === "#") out += digits[i++]; else out += ch;
    }
    if (i < digits.length) out += (out ? " " : "") + digits.slice(i);
    return out.replace(/[\s\-(]+$/, "");
  }

  function setCountry(c, keepFocus) {
    country = c;
    document.getElementById("cc-flag").textContent = flagOf(c.iso);
    document.getElementById("cc-code").textContent = "+" + c.dial;
    const digits = phoneInput.value.replace(/\D/g, "").slice(0, maxDigits(c));
    phoneInput.value = formatNational(digits, c);
    { let k = 0; const sample = "9012345678901234"; phoneInput.placeholder = maskOf(c).replace(/#/g, () => sample[k++ % sample.length]); }
    phoneError.classList.remove("show");
    if (keepFocus) phoneInput.focus();
  }

  /* Определяем страну по номеру, вставленному целиком (+998 99 …) */
  function detectCountry(raw) {
    const digits = raw.replace(/\D/g, "");
    const byLen = [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length);
    return byLen.find(c => digits.startsWith(c.dial)) || null;
  }

  phoneInput.addEventListener("input", () => {
    let raw = phoneInput.value;
    let digits = raw.replace(/\D/g, "");
    const pastedFull = raw.trim().startsWith("+") ||
      (digits.startsWith(country.dial) && digits.length > maxDigits(country));
    if (pastedFull) {
      const c = raw.trim().startsWith("+") ? detectCountry(raw) : country;
      if (c) { if (c !== country && c.dial !== country.dial) setCountry(c); digits = digits.slice(c.dial.length); }
    }
    digits = digits.slice(0, maxDigits(country));
    const caretDigits = raw.slice(0, phoneInput.selectionStart ?? raw.length).replace(/\D/g, "").length;
    phoneInput.value = formatNational(digits, country);
    // вернуть курсор после того же количества цифр
    if (document.activeElement === phoneInput && !pastedFull) {
      let pos = 0, seen = 0;
      while (pos < phoneInput.value.length && seen < caretDigits) { if (/\d/.test(phoneInput.value[pos])) seen++; pos++; }
      phoneInput.setSelectionRange(pos, pos);
    }
    phoneError.classList.remove("show");
  });

  /* Выбор страны */
  function renderCountries(q = "") {
    const s = q.trim().toLowerCase().replace(/^\+/, "");
    const dn = typeof Intl.DisplayNames === "function" ? new Intl.DisplayNames([getLang()], { type: "region" }) : null;
    const list = COUNTRIES.map(c => ({ ...c, name: (dn && dn.of(c.iso)) || c.iso }))
      .filter(c => !s || c.name.toLowerCase().includes(s) || c.iso.toLowerCase() === s || c.dial.startsWith(s));
    ccList.innerHTML = list.length
      ? list.map(c => `<li role="option" tabindex="-1" data-iso="${c.iso}" aria-selected="${c.iso === country.iso}">
          <span class="cc-flag">${flagOf(c.iso)}</span><span class="cc-name">${c.name}</span><span class="cc-dial">+${c.dial}</span></li>`).join("")
      : `<li class="cc-none">${t("fb.country.none")}</li>`;
  }
  function openPanel(open) {
    ccPanel.hidden = !open;
    ccBtn.setAttribute("aria-expanded", String(open));
    if (open) { ccSearch.value = ""; renderCountries(); ccSearch.focus({ preventScroll: true });
      ccList.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "center" }); }
  }
  ccBtn.addEventListener("click", () => openPanel(ccPanel.hidden));
  ccSearch.addEventListener("input", () => renderCountries(ccSearch.value));
  ccList.addEventListener("click", e => {
    const li = e.target.closest("li[data-iso]");
    if (!li) return;
    setCountry(COUNTRIES.find(c => c.iso === li.dataset.iso), true);
    openPanel(false);
  });
  document.addEventListener("click", e => { if (!ccPanel.hidden && !phoneBox.contains(e.target)) openPanel(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !ccPanel.hidden) { openPanel(false); ccBtn.focus(); } });

  emailInput.addEventListener("input", () => emailError.classList.remove("show"));

  function readPhone() {
    const digits = phoneInput.value.replace(/\D/g, "");
    if (!digits) return { value: "" };
    const ok = country.len ? digits.length === country.len : digits.length >= 6;
    return ok ? { value: `+${country.dial} ${phoneInput.value.trim()}` } : { error: "fb.err.contact.phone" };
  }
  function readEmail() {
    const v = emailInput.value.trim();
    if (!v) return { value: "" };
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? { value: v } : { error: "fb.err.contact.email" };
  }

  /* ======================= Дата ======================= */
  const date = document.getElementById("fb-date");
  date.max = today();
  date.value = today();

  /* ======================= Язык ======================= */
  document.addEventListener("langchange", () => {
    updateReaction(false);
    setCountry(country);
    if (!ccPanel.hidden) renderCountries(ccSearch.value);
  });
  setCountry(country);
  updateReaction(false);

  /* ======================= Отправка ======================= */
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const fd = new FormData(form);
    sendError.classList.remove("show");

    const phone = readPhone(), email = readEmail();
    phoneError.classList.toggle("show", !!phone.error);
    emailError.classList.toggle("show", !!email.error);
    if (phone.error) phoneError.textContent = t(phone.error);
    if (email.error) emailError.textContent = t(email.error);
    if (phone.error || email.error) {
      (phone.error ? phoneInput : emailInput).focus();
      return;
    }
    if (!fd.get("rating")) {
      ratingError.classList.add("show");
      ratingBox.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const payload = {
      name: (fd.get("name") || "").trim(),
      phone: phone.value,
      email: email.value,
      mode: ratingGroup(Number(fd.get("rating"))) === "low" ? "disliked" : "liked",
      date: fd.get("date"),
      rating: Number(fd.get("rating")),
      liked: fd.getAll("liked"),
      disliked: (fd.get("disliked") || "").trim(),
      improve: (fd.get("improve") || "").trim(),
      lang: getLang(),
      website: fd.get("website") || "", // honeypot
      submittedAt: new Date().toISOString()
    };

    submitBtn.disabled = true;
    submitBtn.classList.add("loading");
    submitBtn.querySelector("span").textContent = t("fb.sending");
    try {
      const res = await fetch(FEEDBACK_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "HTTP " + res.status);
      try { sessionStorage.setItem("uhdf-last", JSON.stringify({ rating: payload.rating, name: payload.name })); } catch (_) {}
      location.href = "/thanks";
    } catch (err) {
      console.error("[feedback]", err);
      sendError.textContent = t(err.message === "too_many_requests" ? "fb.err.limit" : "fb.err.send");
      sendError.classList.add("show");
      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");
      submitBtn.querySelector("span").textContent = t("fb.submit");
      sendError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
});
