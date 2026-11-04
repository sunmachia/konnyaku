(function () {
  'use strict';

  /* Mobile menu toggle --------------------------------------------------- */
  var menuButton = document.querySelector('[data-menu-toggle]');
  var navigation = document.querySelector('[data-site-nav]');

  if (menuButton && navigation) {
    menuButton.addEventListener('click', function () {
      var isOpen = navigation.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.textContent = isOpen ? '×' : 'メニュー';
    });

    navigation.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navigation.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.textContent = 'メニュー';
      });
    });
  }

  /* Header shadow on scroll --------------------------------------------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var updateHeader = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  /* Reveal on scroll ----------------------------------------------------- */
  var revealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    : null;

  document.querySelectorAll('.reveal').forEach(function (el) {
    if (revealObserver) revealObserver.observe(el);
    else el.classList.add('is-visible');
  });

  /* Survey form — demo submit (replace with GAS endpoint) --------------- */
  var surveyForm = document.querySelector('[data-survey-form]');
  var successPanel = document.querySelector('[data-success-panel]');

  if (surveyForm && successPanel) {
    surveyForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var btn = surveyForm.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = '送信中…';
      }
      window.setTimeout(function () {
        surveyForm.hidden = true;
        successPanel.classList.add('is-visible');
        successPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 600);
    });
  }
})();
