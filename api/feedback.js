/*
 * Vercel serverless-версия api/feedback.php: принимает отзыв и пересылает в Telegram.
 * Токен и chat_id берутся из переменных окружения Vercel: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID.
 */
const LIKED = {
  taste: "Вкус", range: "Ассортимент", packaging: "Упаковка",
  service: "Обслуживание", price: "Цены", atmosphere: "Атмосфера",
};
const hits = new Map(); // простой лимит на инстанс: 5 отзывов / 10 минут с IP
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const clean = (v, max) =>
  typeof v === "string" ? v.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim().slice(0, max) : "";

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  const send = (code, data) => res.status(code).send(JSON.stringify(data));

  if (req.method !== "POST") return send(405, { ok: false, error: "method_not_allowed" });
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
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

  const name = clean(inp.name, 100), contact = clean(inp.contact, 100);
  const disliked = clean(inp.disliked, 1500), improve = clean(inp.improve, 1500);
  const lang = ["ru", "en", "uz"].includes(inp.lang) ? inp.lang : "ru";
  let date = clean(inp.date, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) date = "";
  const liked = [...new Set((Array.isArray(inp.liked) ? inp.liked : []).filter((k) => LIKED[k]).map((k) => LIKED[k]))];

  const [mark, group] = rating >= 9 ? ["🟢", "промоутер"] : rating >= 7 ? ["🟡", "нейтрал"] : ["🔴", "критик"];
  const lines = ["<b>🍯 Новый отзыв — Uzbek Halva &amp; Dry Fruits</b>", "", `${mark} <b>Оценка: ${rating}/10</b> (${group})`];
  if (name) lines.push("👤 <b>Имя:</b> " + esc(name));
  if (contact) lines.push("📞 <b>Контакт:</b> " + esc(contact));
  if (date) lines.push("📅 <b>Дата визита:</b> " + date.split("-").reverse().join("."));
  if (liked.length) lines.push("👍 <b>Понравилось:</b> " + esc(liked.join(", ")));
  if (disliked) lines.push("", "👎 <b>Не понравилось:</b>", esc(disliked));
  if (improve) lines.push("", "💡 <b>Как стать лучше:</b>", esc(improve));
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
