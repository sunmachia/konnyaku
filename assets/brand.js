(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealElements = Array.from(document.querySelectorAll('.reveal, .survey-hero, .survey-progress, .question-card'));
  revealElements.forEach(function (element) {
    element.classList.add('reveal');
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach(function (element) {
      element.classList.add('is-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });

  revealElements.forEach(function (element) {
    observer.observe(element);
  });
})();
