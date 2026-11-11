(function () {
  var header = document.querySelector('.product-header');
  var links = Array.prototype.slice.call(document.querySelectorAll('.product-nav a[href^="#"]:not(.button)'));
  var sections = links
    .map(function (link) {
      return document.querySelector(link.getAttribute('href'));
    })
    .filter(Boolean);

  function markCurrent(id) {
    links.forEach(function (link) {
      var isCurrent = link.getAttribute('href') === '#' + id;
      if (isCurrent) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  if (header) {
    var updateHeader = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          markCurrent(entry.target.id);
        }
      });
    }, { rootMargin: '-38% 0px -54% 0px', threshold: 0 });
    sections.forEach(function (section) {
      observer.observe(section);
    });
  }
})();
