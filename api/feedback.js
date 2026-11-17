/*
 * Vercel serverless-версия api/feedback.php: принимает отзыв и пересылает в Telegram.
 * Токен и chat_id можно переопределить переменными окружения Vercel: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID.
 */
const LIKED = {
  taste: "Вкус", range: "Ассортимент", packaging: "Упаковка",
  service: "Обслуживание", price: "Цены", atmosphere: "Атмосфера",
};
const EMOJI = ["😡", "😠", "😞", "😕", "😟", "😐", "🙂", "😊", "😄", "🤩", "🥳"];
const hits = new Map(); // простой лимит на инстанс: 5 отзывов / 10 минут с IP
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const clean = (v, max) =>
  typeof v === "string" ? v.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim().slice(0, max) : "";

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  const send = (code, data) => res.status(code).send(JSON.stringify(data));

  if (req.method !== "POST") return send(405, { ok: false, error: "method_not_allowed" });
  // Переменные окружения Vercel (если заданы) важнее значений по умолчанию
  const token = process.env.TELEGRAM_BOT_TOKEN || "8622268593:AAF8WEuJgIsObPmibCIqnWuxJfsSr9hHm_M";
  const chatId = process.env.TELEGRAM_CHAT_ID || "-5533858706";
  if (!token || !chatId) return send(500, { ok: false, error: "not_configured" });

  let inp = req.body;
  if (typeof inp === "string") { try { inp = JSON.parse(inp); } catch { inp = null; } }
  if (!inp || typeof inp !== "object") return send(400, { ok: false, error: "bad_json" });

  if (inp.website) return send(200, { ok: true }); // honeypot

  const rating = typeof inp.rating === "string" && /^\d+$/.test(inp.rating) ? Number(inp.rating) : inp.rating;
  if (!Number.isInteger(rating)) return send(422, { ok: false, error: "rating_required" });
  if (rating < 0 || rating > 10) return send(422, { ok: false, error: "rating_range" });

  const ip = String(req.headers["x-forwarded-for"] || "unknown").split(",")[0].trim();
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => t > now - 600000);
  if (recent.length >= 5) return send(429, { ok: false, error: "too_many_requests" });

  const name = clean(inp.name, 100);
  const phone = clean(inp.phone || inp.contact, 40).replace(/[^\d+\s()\-]/g, "");
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean(inp.email, 100)) ? clean(inp.email, 100) : "";
  const tgRaw = clean(inp.telegram, 40).replace(/^@+/, "");
  const telegram = /^[A-Za-z][A-Za-z0-9_]{4,31}$/.test(tgRaw) ? tgRaw : "";
  const method = ["whatsapp", "telegram", "phone", "email"].includes(inp.method) ? inp.method : "";
  const disliked = clean(inp.disliked, 1500), improve = clean(inp.improve, 1500);
  const lang = ["ru", "en", "uz"].includes(inp.lang) ? inp.lang : "ru";
  let date = clean(inp.date, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) date = "";
  const liked = [...new Set((Array.isArray(inp.liked) ? inp.liked : []).filter((k) => LIKED[k]).map((k) => LIKED[k]))];

  const [mark, group] = rating >= 9 ? ["🟢", "промоутер"] : rating >= 7 ? ["🟡", "нейтрал"] : ["🔴", "критик"];
  const lines = ["<b>🍯 Новый отзыв — Uzbek Halva &amp; Dry Fruits</b>", "", `${mark} <b>Оценка: ${rating}/10</b> ${EMOJI[rating]} (${group})`];
  if (name) lines.push("👤 <b>Имя:</b> " + esc(name));
  // Номер + выбранный мессенджер, со ссылкой для ответа в один клик
  const digits = phone.replace(/\D/g, "");
  if (method === "whatsapp" && digits) lines.push(`💬 <b>Пишите в WhatsApp:</b> <a href="https://wa.me/${digits}">${esc(phone)}</a>`);
  else if (method === "telegram" && digits) lines.push(`✈️ <b>Пишите в Telegram:</b> <a href="https://t.me/+${digits}">${esc(phone)}</a>`);
  else if (phone) lines.push(`📞 <b>Телефон:</b> ${esc(phone)}`);
  if (date) lines.push("📅 <b>Дата визита:</b> " + date.split("-").reverse().join("."));
  // Подписи зависят от оценки: так же, как тексты в форме
  const low = rating <= 4;
  if (liked.length) lines.push(low ? "👎 <b>Что не понравилось:</b> " + esc(liked.join(", ")) : "👍 <b>Понравилось:</b> " + esc(liked.join(", ")));
  if (disliked) lines.push("", low ? "😕 <b>Что пошло не так:</b>" : "🔧 <b>Что можно улучшить:</b>", esc(disliked));
  if (improve) lines.push("", low ? "🤝 <b>Что сделать, чтобы вернулись:</b>" : "💡 <b>Идея / пожелание:</b>", esc(improve));
  lines.push("", "🌐 Язык сайта: " + lang.toUpperCase());

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: lines.join("\n"), parse_mode: "HTML", disable_web_page_preview: true }),
    });
    const tg = await r.json().catch(() => null);
    if (!r.ok || !tg || !tg.ok) {
      console.error("[feedback] Telegram error", r.status, JSON.stringify(tg));
      return send(502, { ok: false, error: "telegram_failed" });
    }
  } catch (e) {
    console.error("[feedback] fetch failed", e);
    return send(502, { ok: false, error: "telegram_failed" });
  }
  recent.push(now);
  hits.set(ip, recent);
  return send(200, { ok: true });
};
