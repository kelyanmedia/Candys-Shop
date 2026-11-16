/* =========================================================
   Дополнительные тексты: реакции на оценки 0–10, телефон,
   страница «Спасибо». Подключается после i18n.js.
   ========================================================= */

/* Эмодзи для каждой оценки (одинаковые для всех языков) */
const REACTION_EMOJI = ["😡", "😠", "😞", "😕", "😟", "😐", "🙂", "😊", "😄", "🤩", "🥳"];

(function () {
  const add = (lang, obj) => Object.assign(I18N[lang], obj);

  /* ---------------- RU ---------------- */
  const ru = {
    "fb.react.0.t": "Очень жаль",
    "fb.react.0.d": "Мы сильно подвели вас. Расскажите, что случилось, — разберёмся лично.",
    "fb.react.1.t": "Это неприятно",
    "fb.react.1.d": "Такого впечатления мы не хотели. Напишите, что пошло не так.",
    "fb.react.2.t": "Мы расстроены",
    "fb.react.2.d": "Похоже, многое было не так. Помогите понять, что исправить.",
    "fb.react.3.t": "Могло быть лучше",
    "fb.react.3.d": "Спасибо за честность. Что вас разочаровало больше всего?",
    "fb.react.4.t": "Есть над чем работать",
    "fb.react.4.d": "Мы хотим стать лучше. Что бы вы изменили в первую очередь?",
    "fb.react.5.t": "Средне",
    "fb.react.5.d": "Не удивили — а должны были. Подскажите, чего не хватило.",
    "fb.react.6.t": "Неплохо",
    "fb.react.6.d": "Хорошо, но можно лучше. Поделитесь идеями ниже.",
    "fb.react.7.t": "Хорошо",
    "fb.react.7.d": "Рады, что в целом понравилось. Чего не хватило до десятки?",
    "fb.react.8.t": "Здорово!",
    "fb.react.8.d": "Совсем чуть-чуть до идеала. Подскажите, что добавить?",
    "fb.react.9.t": "Отлично!",
    "fb.react.9.d": "Нам очень приятно! Расскажите, что понравилось больше всего.",
    "fb.react.10.t": "Восторг!",
    "fb.react.10.d": "Вы сделали наш день. Спасибо, что вы с нами!",
    "fb.react.empty": "Выберите оценку — мы покажем, как её читаем",

    "fb.contact.phone": "Телефон",
    "fb.contact.email": "E-mail",
    "fb.contact.ph.phone": "99 123 45 67",
    "fb.contact.ph.email": "name@example.com",
    "fb.country": "Страна",
    "fb.country.search": "Поиск страны или кода",
    "fb.country.none": "Ничего не найдено",
    "fb.err.contact.phone": "Проверьте номер телефона",
    "fb.err.contact.email": "Проверьте адрес e-mail",
    "fb.sending": "Отправляем…",
    "fb.c.hint": "Можно выбрать несколько",

    "meta.thanks": "Спасибо за отзыв — Uzbek Halva & Dry Fruits",
    "thanks.title": "Спасибо!",
    "thanks.title.name": "Спасибо, {name}!",
    "thanks.sub": "Ваш отзыв отправлен",
    "thanks.score": "Ваша оценка",
    "thanks.msg.low": "Нам важно, что вы написали. Мы разберёмся и постараемся всё исправить.",
    "thanks.msg.mid": "Спасибо за честный отзыв. Он поможет нам стать лучше.",
    "thanks.msg.high": "Нам очень приятно! Ждём вас снова — за свежей халвой и сухофруктами.",
    "thanks.steps.h": "Что будет дальше",
    "thanks.s1.t": "Отзыв получен",
    "thanks.s1.d": "Он уже у нашей команды.",
    "thanks.s2.t": "Мы прочитаем",
    "thanks.s2.d": "Читаем каждый отзыв лично.",
    "thanks.s3.t": "Ответим, если нужно",
    "thanks.s3.d": "Если вы оставили контакт — свяжемся с вами.",
    "thanks.home": "На главную",
    "thanks.products": "Посмотреть ассортимент",
    "thanks.again": "Оставить ещё один отзыв",
    "thanks.follow": "Мы в соцсетях"
  };

  /* ---------------- EN ---------------- */
  const en = {
    "fb.react.0.t": "We're so sorry",
    "fb.react.0.d": "We let you down badly. Tell us what happened — we'll look into it personally.",
    "fb.react.1.t": "That's upsetting",
    "fb.react.1.d": "That's not the experience we wanted. Please tell us what went wrong.",
    "fb.react.2.t": "We're disappointed",
    "fb.react.2.d": "Sounds like a lot went wrong. Help us understand what to fix.",
    "fb.react.3.t": "Could be better",
    "fb.react.3.d": "Thanks for being honest. What disappointed you the most?",
    "fb.react.4.t": "Work to do",
    "fb.react.4.d": "We want to do better. What would you change first?",
    "fb.react.5.t": "So-so",
    "fb.react.5.d": "We didn't wow you — and we should have. What was missing?",
    "fb.react.6.t": "Not bad",
    "fb.react.6.d": "Good, but it can be better. Share your ideas below.",
    "fb.react.7.t": "Good",
    "fb.react.7.d": "Glad you mostly liked it. What kept it from a ten?",
    "fb.react.8.t": "Great!",
    "fb.react.8.d": "Almost perfect. What should we add?",
    "fb.react.9.t": "Excellent!",
    "fb.react.9.d": "That means a lot! Tell us what you liked the most.",
    "fb.react.10.t": "Delighted!",
    "fb.react.10.d": "You made our day. Thank you for being with us!",
    "fb.react.empty": "Pick a score — we'll show how we read it",

    "fb.contact.phone": "Phone",
    "fb.contact.email": "E-mail",
    "fb.contact.ph.phone": "99 123 45 67",
    "fb.contact.ph.email": "name@example.com",
    "fb.country": "Country",
    "fb.country.search": "Search country or code",
    "fb.country.none": "Nothing found",
    "fb.err.contact.phone": "Please check the phone number",
    "fb.err.contact.email": "Please check the e-mail address",
    "fb.sending": "Sending…",
    "fb.c.hint": "You can pick several",

    "meta.thanks": "Thank you for your feedback — Uzbek Halva & Dry Fruits",
    "thanks.title": "Thank you!",
    "thanks.title.name": "Thank you, {name}!",
    "thanks.sub": "Your feedback has been sent",
    "thanks.score": "Your score",
    "thanks.msg.low": "What you wrote matters to us. We'll look into it and do our best to put it right.",
    "thanks.msg.mid": "Thanks for the honest review. It helps us get better.",
    "thanks.msg.high": "That means a lot! We look forward to seeing you again for fresh halva and dried fruits.",
    "thanks.steps.h": "What happens next",
    "thanks.s1.t": "Feedback received",
    "thanks.s1.d": "It's already with our team.",
    "thanks.s2.t": "We read it",
    "thanks.s2.d": "We read every review personally.",
    "thanks.s3.t": "We reply if needed",
    "thanks.s3.d": "If you left your contact, we'll get in touch.",
    "thanks.home": "Back to home",
    "thanks.products": "See the range",
    "thanks.again": "Leave another review",
    "thanks.follow": "Find us on social media"
  };

  /* ---------------- UZ (lotin) ---------------- */
  const uz = {
    "fb.react.0.t": "Juda afsusdamiz",
    "fb.react.0.d": "Sizni qattiq xafa qildik. Nima bo‘lganini ayting — shaxsan ko‘rib chiqamiz.",
    "fb.react.1.t": "Bu yoqimsiz",
    "fb.react.1.d": "Biz bunday taassurot qoldirmoqchi emas edik. Nima noto‘g‘ri bo‘lganini yozing.",
    "fb.react.2.t": "Xafamiz",
    "fb.react.2.d": "Ko‘p narsa noto‘g‘ri ketgan ko‘rinadi. Nimani tuzatish kerakligini ayting.",
    "fb.react.3.t": "Yaxshiroq bo‘lishi mumkin edi",
    "fb.react.3.d": "Halolligingiz uchun rahmat. Sizni nima ko‘proq xafa qildi?",
    "fb.react.4.t": "Ustida ishlashimiz kerak",
    "fb.react.4.d": "Yaxshiroq bo‘lishni istaymiz. Avvalo nimani o‘zgartirgan bo‘lardingiz?",
    "fb.react.5.t": "O‘rtacha",
    "fb.react.5.d": "Sizni hayratga solmadik — solishimiz kerak edi. Nima yetishmadi?",
    "fb.react.6.t": "Fikrim yomon emas",
    "fb.react.6.d": "Yaxshi, lekin yanada yaxshi bo‘lishi mumkin. G‘oyalaringizni yozing.",
    "fb.react.7.t": "Yaxshi",
    "fb.react.7.d": "Umuman yoqqanidan xursandmiz. O‘n balldan nima kam bo‘ldi?",
    "fb.react.8.t": "Ajoyib!",
    "fb.react.8.d": "Mukammallikka juda oz qoldi. Nima qo‘shishimiz kerak?",
    "fb.react.9.t": "Zo‘r!",
    "fb.react.9.d": "Bu biz uchun juda yoqimli! Eng ko‘p nima yoqqanini ayting.",
    "fb.react.10.t": "Zavqlanib ketdik!",
    "fb.react.10.d": "Kunimizni quvnoq qildingiz. Biz bilan bo‘lganingiz uchun rahmat!",
    "fb.react.empty": "Bahoni tanlang — biz uni qanday o‘qishimizni ko‘rsatamiz",

    "fb.contact.phone": "Telefon",
    "fb.contact.email": "E-mail",
    "fb.contact.ph.phone": "99 123 45 67",
    "fb.contact.ph.email": "name@example.com",
    "fb.country": "Davlat",
    "fb.country.search": "Davlat yoki kodni qidiring",
    "fb.country.none": "Hech narsa topilmadi",
    "fb.err.contact.phone": "Telefon raqamini tekshiring",
    "fb.err.contact.email": "E-mail manzilini tekshiring",
    "fb.sending": "Yuborilmoqda…",
    "fb.c.hint": "Bir nechtasini tanlash mumkin",

    "meta.thanks": "Fikringiz uchun rahmat — Uzbek Halva & Dry Fruits",
    "thanks.title": "Rahmat!",
    "thanks.title.name": "Rahmat, {name}!",
    "thanks.sub": "Fikringiz yuborildi",
    "thanks.score": "Sizning bahoyingiz",
    "thanks.msg.low": "Yozganlaringiz biz uchun muhim. Ko‘rib chiqamiz va hammasini tuzatishga harakat qilamiz.",
    "thanks.msg.mid": "Halol fikr uchun rahmat. U bizga yaxshiroq bo‘lishga yordam beradi.",
    "thanks.msg.high": "Juda yoqimli! Yangi holva va quritilgan mevalar uchun yana kutamiz.",
    "thanks.steps.h": "Keyin nima bo‘ladi",
    "thanks.s1.t": "Fikr qabul qilindi",
    "thanks.s1.d": "U allaqachon jamoamizda.",
    "thanks.s2.t": "Biz o‘qiymiz",
    "thanks.s2.d": "Har bir fikrni shaxsan o‘qiymiz.",
    "thanks.s3.t": "Kerak bo‘lsa, javob beramiz",
    "thanks.s3.d": "Aloqa ma’lumotini qoldirgan bo‘lsangiz, siz bilan bog‘lanamiz.",
    "thanks.home": "Bosh sahifaga",
    "thanks.products": "Assortimentni ko‘rish",
    "thanks.again": "Yana fikr qoldirish",
    "thanks.follow": "Ijtimoiy tarmoqlarda"
  };

  add("ru", ru); add("en", en); add("uz", uz);

  /* Реакция на конкретную оценку */
  window.reactionFor = n => ({
    emoji: REACTION_EMOJI[n],
    title: t(`fb.react.${n}.t`),
    text: t(`fb.react.${n}.d`)
  });
})();

/* ---------- Страница 404 ---------- */
Object.assign(I18N.ru, {
  "meta.404": "Страница не найдена — Uzbek Halva & Dry Fruits",
  "e404.label": "Ошибка 404",
  "e404.title": "Эту страницу уже съели",
  "e404.text": "Мы заглянули на все полки, но такой страницы нет: ссылка устарела или в адресе опечатка. Зато халва на месте.",
  "e404.home": "На главную",
  "e404.products": "Смотреть ассортимент",
  "e404.quote": "Мехмон отангдан улуғ — гость почётнее отца"
});
Object.assign(I18N.en, {
  "meta.404": "Page not found — Uzbek Halva & Dry Fruits",
  "e404.label": "Error 404",
  "e404.title": "Someone already ate this page",
  "e404.text": "We checked every shelf, but there's no such page: the link is outdated or the address has a typo. The halva, though, is right where it should be.",
  "e404.home": "Back to home",
  "e404.products": "See the range",
  "e404.quote": "Mehmon otangdan ulug‘ — a guest is more honoured than your father"
});
Object.assign(I18N.uz, {
  "meta.404": "Sahifa topilmadi — Uzbek Halva & Dry Fruits",
  "e404.label": "404-xato",
  "e404.title": "Bu sahifani allaqachon yeb qo‘yishgan",
  "e404.text": "Barcha javonlarni ko‘rib chiqdik, ammo bunday sahifa yo‘q: havola eskirgan yoki manzilda xato bor. Holva esa joyida.",
  "e404.home": "Bosh sahifaga",
  "e404.products": "Assortimentni ko‘rish",
  "e404.quote": "Mehmon otangdan ulug‘"
});

/* ---------- Авторство фото ---------- */
I18N.ru["products.credits"] = "Фото категорий: Wikimedia Commons — Drejwen (CC BY 4.0), Ekaterina Kvelidze (CC BY-SA 4.0), Kuwanishbek, piviso.com, MirfayzbekAbdullayev (CC0).";
I18N.en["products.credits"] = "Category photos: Wikimedia Commons — Drejwen (CC BY 4.0), Ekaterina Kvelidze (CC BY-SA 4.0), Kuwanishbek, piviso.com, MirfayzbekAbdullayev (CC0).";
I18N.uz["products.credits"] = "Kategoriya suratlari: Wikimedia Commons — Drejwen (CC BY 4.0), Ekaterina Kvelidze (CC BY-SA 4.0), Kuwanishbek, piviso.com, MirfayzbekAbdullayev (CC0).";
