/* Страница «Спасибо»: личная реакция на оценку, которую человек только что поставил */
document.addEventListener("DOMContentLoaded", () => {
  const title = document.getElementById("thanks-title");
  if (!title) return;
  let last = null;
  try { last = JSON.parse(sessionStorage.getItem("uhdf-last") || "null"); } catch (_) {}

  const scoreBox = document.getElementById("thanks-score");
  const msg = document.getElementById("thanks-msg");

  function render() {
    const name = last && last.name ? last.name.split(" ")[0] : "";
    title.textContent = name ? t("thanks.title.name").replace("{name}", name) : t("thanks.title");
    if (last && Number.isInteger(last.rating) && last.rating >= 0 && last.rating <= 10) {
      const r = reactionFor(last.rating);
      scoreBox.hidden = false;
      scoreBox.style.setProperty("--h", Math.round(last.rating * 12));
      document.getElementById("thanks-emoji").textContent = r.emoji;
      document.getElementById("thanks-score-n").textContent = last.rating + "/10";
      document.getElementById("thanks-react").textContent = r.title;
      const k = last.rating <= 6 ? "low" : last.rating <= 8 ? "mid" : "high";
      msg.dataset.i18n = "thanks.msg." + k;
      msg.textContent = t("thanks.msg." + k);
    }
  }
  render();
  document.addEventListener("langchange", render);
  if (last && last.rating >= 9) document.body.classList.add("party");
});
