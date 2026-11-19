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
I18N.ru["products.credits"] = "Фото «Сухофрукты» и «Орехи»: Wikimedia Commons — Kuwanishbek, piviso.com (CC0).";
I18N.en["products.credits"] = "Photos for dried fruits and nuts: Wikimedia Commons — Kuwanishbek, piviso.com (CC0).";
I18N.uz["products.credits"] = "Quruq mevalar va yong‘oqlar suratlari: Wikimedia Commons — Kuwanishbek, piviso.com (CC0).";

/* ---------- Блок «Подробности»: тексты зависят от оценки (low 0–6, mid 7–8, high 9–10) ---------- */
Object.assign(I18N.ru, {
  "fb.d.low.chips": "Что не понравилось?",
  "fb.d.low.dis": "Что именно пошло не так?",
  "fb.d.low.dis.ph": "Расскажите подробнее — мы разберёмся и всё исправим…",
  "fb.d.low.imp": "Что нам сделать, чтобы вы вернулись?",
  "fb.d.low.imp.ph": "Любое предложение поможет нам стать лучше",
  "fb.d.mid.chips": "Что вам понравилось?",
  "fb.d.mid.dis": "Что можно сделать лучше?",
  "fb.d.mid.dis.ph": "Что не дотянуло до идеала?",
  "fb.d.mid.imp": "Ваша идея для нас",
  "fb.d.mid.imp.ph": "Чего вам не хватило? Какой вкус или набор добавить?",
  "fb.d.high.chips": "Что вам особенно понравилось?",
  "fb.d.high.dis": "Что могло бы быть ещё лучше?",
  "fb.d.high.dis.ph": "Даже мелочи помогают нам расти — если есть, напишите",
  "fb.d.high.imp": "Что вам хотелось бы увидеть у нас ещё?",
  "fb.d.high.imp.ph": "Новый вкус, набор, формат — всё, о чём мечтаете"
});
Object.assign(I18N.en, {
  "fb.d.low.chips": "What didn't you like?",
  "fb.d.low.dis": "What exactly went wrong?",
  "fb.d.low.dis.ph": "Tell us more — we'll look into it and put it right…",
  "fb.d.low.imp": "What can we do to win you back?",
  "fb.d.low.imp.ph": "Any suggestion helps us get better",
  "fb.d.mid.chips": "What did you like?",
  "fb.d.mid.dis": "What could be better?",
  "fb.d.mid.dis.ph": "What fell short of perfect?",
  "fb.d.mid.imp": "Your idea for us",
  "fb.d.mid.imp.ph": "What was missing? Which flavour or gift set should we add?",
  "fb.d.high.chips": "What did you like the most?",
  "fb.d.high.dis": "What could be even better?",
  "fb.d.high.dis.ph": "Even small things help us grow — write if there are any",
  "fb.d.high.imp": "What else would you like to see from us?",
  "fb.d.high.imp.ph": "A new flavour, set or format — anything you dream of"
});
Object.assign(I18N.uz, {
  "fb.d.low.chips": "Nima yoqmadi?",
  "fb.d.low.dis": "Aynan nima noto‘g‘ri bo‘ldi?",
  "fb.d.low.dis.ph": "Batafsilroq yozing — ko‘rib chiqamiz va hammasini tuzatamiz…",
  "fb.d.low.imp": "Qaytib kelishingiz uchun nima qilaylik?",
  "fb.d.low.imp.ph": "Har qanday taklif bizga yaxshiroq bo‘lishga yordam beradi",
  "fb.d.mid.chips": "Sizga nima yoqdi?",
  "fb.d.mid.dis": "Nimani yaxshilash mumkin?",
  "fb.d.mid.dis.ph": "Nima mukammallikka yetmadi?",
  "fb.d.mid.imp": "Biz uchun g‘oyangiz",
  "fb.d.mid.imp.ph": "Nima yetishmadi? Qaysi ta’m yoki sovg‘a to‘plamini qo‘shaylik?",
  "fb.d.high.chips": "Sizga ayniqsa nima yoqdi?",
  "fb.d.high.dis": "Nima yanada yaxshi bo‘lishi mumkin edi?",
  "fb.d.high.dis.ph": "Mayda narsalar ham o‘sishimizga yordam beradi — bo‘lsa, yozing",
  "fb.d.high.imp": "Yana nimani ko‘rishni xohlardingiz?",
  "fb.d.high.imp.ph": "Yangi ta’m, to‘plam, format — orzu qilgan hamma narsa"
});

/* ---------- Подарочные наборы (главная, ассортимент, о компании, спасибо) ---------- */
Object.assign(I18N.ru, {
  "home.sets.title": "Коробки, которые приятно дарить",
  "home.sets.link": "Все наборы",
  "home.sets.text": "Халва и восточные сладости в нарядных коробках и пакетах с узорами — для близких, коллег и гостей.",
  "products.sets.title": "Наборы и упаковка",
  "products.sets.text": "Разные цвета и рисунки коробок: выберите ту, что подойдёт к случаю.",
  "about.pack.title": "Нарядная упаковка",
  "about.pack.p1": "Халву и сладости можно взять в подарочной коробке с узорами и в пакете в тон — подарок выглядит праздничным сразу.",
  "about.pack.p2": "Расцветок несколько: от строгих синих и зелёных до тёплых оранжевых и красных. Подскажем, какая подойдёт для вашего случая."
});
Object.assign(I18N.en, {
  "home.sets.title": "Boxes made for gifting",
  "home.sets.link": "All sets",
  "home.sets.text": "Halva and oriental sweets in festive patterned boxes and matching bags — for family, colleagues and guests.",
  "products.sets.title": "Sets and packaging",
  "products.sets.text": "Boxes come in different colours and designs: pick the one that suits the occasion.",
  "about.pack.title": "Festive packaging",
  "about.pack.p1": "You can take halva and sweets in a patterned gift box with a matching bag, so the present looks festive right away.",
  "about.pack.p2": "There are several colours, from calm blues and greens to warm oranges and reds. We'll help you choose the right one."
});
Object.assign(I18N.uz, {
  "home.sets.title": "Sovg‘a qilish yoqimli bo‘lgan qutilar",
  "home.sets.link": "Barcha to‘plamlar",
  "home.sets.text": "Naqshli bayramona qutilar va mos paketlardagi holva va sharq shirinliklari — yaqinlar, hamkasblar va mehmonlar uchun.",
  "products.sets.title": "To‘plamlar va qadoq",
  "products.sets.text": "Qutilar turli rang va naqshlarda: munosabatga mosini tanlang.",
  "about.pack.title": "Bayramona qadoq",
  "about.pack.p1": "Holva va shirinliklarni naqshli sovg‘a qutisida va mos paketda olish mumkin — sovg‘a darhol bayramona ko‘rinadi.",
  "about.pack.p2": "Ranglar bir nechta: sokin ko‘k va yashildan iliq to‘q sariq va qizilgacha. Qaysi biri mosligini aytib beramiz."
});

/* ---------- Номер и мессенджер ---------- */
Object.assign(I18N.ru, {
  "fb.phone.label": "Ваш номер телефона",
  "fb.method": "Где вам удобнее общаться?",
  "fb.phone.hint": "Напишем на этот номер в выбранном мессенджере",
  "fb.err.contact.phone": "Проверьте номер телефона"
});
Object.assign(I18N.en, {
  "fb.phone.label": "Your phone number",
  "fb.method": "Where would you prefer to chat?",
  "fb.phone.hint": "We'll message this number in the messenger you choose",
  "fb.err.contact.phone": "Please check the phone number"
});
Object.assign(I18N.uz, {
  "fb.phone.label": "Telefon raqamingiz",
  "fb.method": "Qayerda yozishish qulay?",
  "fb.phone.hint": "Tanlangan messenjerda shu raqamga yozamiz",
  "fb.err.contact.phone": "Telefon raqamini tekshiring"
});
