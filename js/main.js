/* ============================================================
   Регистрация
   ------------------------------------------------------------
   Кнопка регистрации ведёт на GetCourse.
   Вставьте сюда ссылку на вашу форму/страницу GetCourse —
   и кнопка в герое, и форма заявки начнут вести на неё.
   Если оставить пустым, форма покажет сообщение-заглушку.
   ============================================================ */
const REGISTRATION_URL = ""; // напр. "https://school.getcourse.ru/channelinggroup"

(function () {
  "use strict";

  // Кнопка «Зарегистрироваться» в герое:
  // если задан GetCourse-URL — ведёт туда, иначе плавно скроллит к форме.
  document.querySelectorAll('a[href="#registration"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (REGISTRATION_URL) {
        e.preventDefault();
        window.open(REGISTRATION_URL, "_blank", "noopener");
      }
      // иначе — обычный якорь к блоку регистрации
    });
  });

  // Форма заявки
  var form = document.getElementById("reg-form");
  var hint = document.getElementById("reg-form-hint");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    hint.classList.remove("is-error");

    var data = new FormData(form);
    var name = (data.get("name") || "").toString().trim();
    var email = (data.get("email") || "").toString().trim();
    var phone = (data.get("phone") || "").toString().trim();

    if (!name || !email || !phone) {
      hint.textContent = "Пожалуйста, заполните все поля.";
      hint.classList.add("is-error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      hint.textContent = "Проверьте, пожалуйста, адрес почты.";
      hint.classList.add("is-error");
      return;
    }

    if (REGISTRATION_URL) {
      // Передаём данные в GetCourse через query-параметры
      var target = REGISTRATION_URL;
      try {
        var url = new URL(REGISTRATION_URL);
        url.searchParams.set("name", name);
        url.searchParams.set("email", email);
        url.searchParams.set("phone", phone);
        target = url.toString();
      } catch (e) {
        /* если ссылка задана без протокола — открываем как есть */
      }
      hint.textContent = "Переходим к регистрации…";
      window.open(target, "_blank", "noopener");
    } else {
      hint.textContent = "Спасибо! Заявка отправлена — мы свяжемся с вами.";
      form.reset();
    }
  });

})();

/* ============================================================
   Оживление: плавающая шапка + появление блоков при прокрутке
   ============================================================ */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.add("js");

  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Плавающая шапка: показываем после первого экрана ---- */
  var topbar = document.getElementById("topbar");
  var hero = document.getElementById("top");
  if (topbar && hero && "IntersectionObserver" in window) {
    var hObs = new IntersectionObserver(function (entries) {
      // когда герой ушёл из вида — показываем шапку
      topbar.classList.toggle("is-shown", !entries[0].isIntersecting);
    }, { rootMargin: "-80px 0px 0px 0px" });
    hObs.observe(hero);
  }

  /* ---- Появление блоков при прокрутке ---- */
  var targets = document.querySelectorAll(
    ".section .eyebrow, .section .h2, .section .lead, .section .card, " +
    ".callout, .steps-list li, .reviews__grid img, .reg__card, .about__portrait"
  );

  if (reduce || !("IntersectionObserver" in window)) {
    return; // без анимации — контент и так виден (класс .reveal не добавляем)
  }

  targets.forEach(function (el) {
    el.classList.add("reveal");
    // лёгкий стаггер среди соседей одного типа
    var sibs = el.parentElement ? el.parentElement.children : [];
    var idx = Array.prototype.indexOf.call(sibs, el);
    var delay = ((idx % 4) + 1);
    if (el.classList.contains("card") || el.tagName === "IMG" || el.tagName === "LI") {
      el.setAttribute("data-delay", String(delay));
    }
  });

  var rObs = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        obs.unobserve(e.target);
      }
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });

  targets.forEach(function (el) { rObs.observe(el); });
})();
