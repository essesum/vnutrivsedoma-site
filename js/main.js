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
      var url = new URL(REGISTRATION_URL);
      url.searchParams.set("name", name);
      url.searchParams.set("email", email);
      url.searchParams.set("phone", phone);
      hint.textContent = "Переходим к регистрации…";
      window.open(url.toString(), "_blank", "noopener");
    } else {
      hint.textContent = "Спасибо! Заявка отправлена — мы свяжемся с вами.";
      form.reset();
    }
  });

  // Год в подвале (если понадобится) и аккуратные внешние ссылки уже в разметке.
})();
