const WORKER_URL = "https://slc-telegram.printtexttj.workers.dev";
const FORM_SECRET = "slc_secret_2026_!";

const dict = {
  ru: {
    tagline: "Юридическая уверенность вашего бизнеса",
    welcome: "Добро пожаловать в SLC",
    heroTitle: "Предприниматель должен заниматься делом, а не разбираться с законом.",
    heroText: "Мы берём на себя юридическую сторону вашего бизнеса, чтобы вы могли работать спокойно и без рисков.",
    b1: "⚙ Простые решения сложных юридических вопросов",
    b2: "🤝 Максимум надёжности и прозрачности",
    b3: "📈 Сопровождение, консультации, защита",
    cta1: "Получить консультацию",
    cta2: "Наши услуги",
    forWhomTitle: "Мы работаем для",
    servicesBtn: "Услуги",
    contactBtn: "Оставить заявку"
  },
  tj: {
    tagline: "Итминони ҳуқуқии тиҷорати шумо",
    welcome: "Хуш омадед ба SLC",
    heroTitle: "Соҳибкор бояд ба кор машғул шавад, на ба қонун сарф шавад.",
    heroText: "Мо ҷониби ҳуқуқии тиҷорати шуморо ба уҳда мегирем, то шумо ором ва бе хатар фаъолият кунед.",
    b1: "⚙ Ҳалли соддаи масъалаҳои мураккаби ҳуқуқӣ",
    b2: "🤝 Эътимоднокӣ ва шаффофияти баланд",
    b3: "📈 Ҳамроҳӣ, машварат, ҳимоя",
    cta1: "Машварат гирифтан",
    cta2: "Хизматҳои мо",
    forWhomTitle: "Мо хизмат мерасонем барои",
    servicesBtn: "Хизматҳо",
    contactBtn: "Дархост гузоштан"
  }
};

let lang = localStorage.getItem("slc_lang") || "ru";

function applyLang(nextLang) {
  lang = nextLang;
  localStorage.setItem("slc_lang", lang);
  document.documentElement.lang = lang === "ru" ? "ru" : "tg";

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[lang] && dict[lang][key]) {
      el.textContent = dict[lang][key];
    }
  });

  const ru = document.getElementById("langLabel");
  const tj = document.getElementById("langLabel2");

  if (ru) ru.style.opacity = lang === "ru" ? "1" : "0.55";
  if (tj) tj.style.opacity = lang === "tj" ? "1" : "0.55";
}

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const langBtn = document.getElementById("langBtn");
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      applyLang(lang === "ru" ? "tj" : "ru");
    });
  }

  applyLang(lang);

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("show");
      });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("show"));
  }

  const topBar = document.querySelector(".top");
  window.addEventListener("scroll", () => {
    if (!topBar) return;
    topBar.style.boxShadow = window.scrollY > 16
      ? "0 10px 30px rgba(28,45,74,.08)"
      : "none";
  });

  const form = document.getElementById("leadForm");
  const hint = document.getElementById("formHint");

  if (!form) {
    console.error("leadForm not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fd = new FormData(form);

    const payload = {
      firstName: String(fd.get("firstName") || "").trim(),
      lastName: String(fd.get("lastName") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      topic: String(fd.get("topic") || "").trim(),
      message: String(fd.get("message") || "").trim(),
      lang: localStorage.getItem("slc_lang") || "ru"
    };

    if (!payload.firstName || !payload.lastName || !payload.phone || !payload.topic || !payload.message) {
      if (hint) {
        hint.textContent = payload.lang === "ru"
          ? "Заполните все обязательные поля"
          : "Ҳама майдонҳои ҳатмиро пур кунед";
      } else {
        alert(payload.lang === "ru"
          ? "Заполните все обязательные поля"
          : "Ҳама майдонҳои ҳатмиро пур кунед");
      }
      return;
    }

    try {
      if (hint) {
        hint.textContent = payload.lang === "ru"
          ? "Отправляем..."
          : "Фиристода истодаем...";
      }

      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth": FORM_SECRET
        },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();

      if (!response.ok) {
        console.error("Worker error:", response.status, responseText);
        throw new Error(responseText || "Request failed");
      }

      console.log("Worker success:", responseText);
      form.reset();

      if (hint) {
        hint.textContent = payload.lang === "ru"
          ? "Готово ✅ Заявка отправлена"
          : "Тайёр ✅ Дархост фиристода шуд";
      } else {
        alert(payload.lang === "ru"
          ? "Готово ✅ Заявка отправлена"
          : "Тайёр ✅ Дархост фиристода шуд");
      }
    } catch (error) {
      console.error("Form submit error:", error);

      if (hint) {
        hint.textContent = payload.lang === "ru"
          ? "Ошибка ❌ Заявка не отправилась"
          : "Хато ❌ Дархост фиристода нашуд";
      } else {
        alert(payload.lang === "ru"
          ? "Ошибка ❌ Заявка не отправилась"
          : "Хато ❌ Дархост фиристода нашуд");
      }
    }
  });
});
