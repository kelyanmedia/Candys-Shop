/* =========================================================
   Feedback (NPS) form
   Отзывы отправляются на api/feedback.php, который пересылает
   их в Telegram (настройки бота — в api/config.php).
   ========================================================= */

const FEEDBACK_ENDPOINT = "api/feedback.php";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("feedback-form");
  if (!form) return;

  const ratingBox = document.getElementById("rating");
  const face = document.getElementById("rating-face");
  const error = document.getElementById("rating-error");
  const modal = document.getElementById("success-modal");
  const sendError = document.getElementById("send-error");

  ratingBox.innerHTML = Array.from({ length: 11 }, (_, n) => `
    <input type="radio" name="rating" id="r-${n}" value="${n}">
    <label for="r-${n}">${n}</label>`).join("");

  const faceKey = n => n <= 6 ? "fb.face.low" : n <= 8 ? "fb.face.mid" : "fb.face.high";
  function updateFace() {
    const checked = form.querySelector('input[name="rating"]:checked');
    face.textContent = checked ? t(faceKey(+checked.value)) : "";
  }
  ratingBox.addEventListener("change", () => { error.classList.remove("show"); updateFace(); });
  document.addEventListener("langchange", updateFace);

  // Default date = today
  const date = document.getElementById("fb-date");
  date.value = new Date().toISOString().slice(0, 10);

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const fd = new FormData(form);
    if (!fd.get("rating")) {
      error.classList.add("show");
      ratingBox.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const payload = {
      name: (fd.get("name") || "").trim(),
      contact: (fd.get("contact") || "").trim(),
      date: fd.get("date"),
      rating: Number(fd.get("rating")),
      liked: fd.getAll("liked"),
      disliked: (fd.get("disliked") || "").trim(),
      improve: (fd.get("improve") || "").trim(),
      lang: getLang(),
      submittedAt: new Date().toISOString()
    };

    payload.website = fd.get("website") || ""; // honeypot

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    sendError.classList.remove("show");
    try {
      const res = await fetch(FEEDBACK_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "HTTP " + res.status);
      form.reset();
      date.value = new Date().toISOString().slice(0, 10);
      updateFace();
      openModal();
    } catch (err) {
      console.error("[feedback]", err);
      sendError.dataset.i18n = err.message === "too_many_requests" ? "fb.err.limit" : "fb.err.send";
      sendError.textContent = t(sendError.dataset.i18n);
      sendError.classList.add("show");
    } finally {
      btn.disabled = false;
    }
  });

  function openModal() {
    modal.classList.add("open");
    document.getElementById("modal-close").focus();
  }
  function closeModal() { modal.classList.remove("open"); }
  document.getElementById("modal-close").addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
});
