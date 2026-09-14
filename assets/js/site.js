/**
 * Accounta — site behaviour.
 * The mobile menu, and the one live moment in the hero: a Takada receipt
 * being saved and synced.
 */
(function () {
  "use strict";

  /* ------------------------------------------------------- mobile menu */
  var toggle = document.querySelector('.navtoggle');
  var nav = document.getElementById('nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close' : 'Menu';
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName !== 'A') return;
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = 'Menu';
    });
  }

  /* ----------------------------------------------- the receipt syncing */
  var takada = document.getElementById('takada');
  if (!takada) return;

  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  var gps = document.getElementById('gps');

  function play() {
    if (takada.classList.contains('is-live')) return;
    takada.classList.add('is-live');

    if (calm.matches) {           /* no motion: just show the settled state */
      if (gps) gps.textContent = 'Location locked';
      takada.classList.add('done');
      return;
    }
    window.setTimeout(function () {
      if (gps) { gps.textContent = 'Location locked'; gps.className = 'chip sky'; }
    }, 1100);
    window.setTimeout(function () { takada.classList.add('done'); }, 2400);
  }

  if (!('IntersectionObserver' in window)) { play(); return; }

  var watcher = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      play();
      watcher.disconnect();
    });
  }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });

  watcher.observe(takada);

  window.setTimeout(function () {
    if (takada.classList.contains('is-live')) return;
    var box = takada.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) play();
  }, 1200);
})();
