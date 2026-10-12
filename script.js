(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var revealObserver = null;

  /* La clase se añade solo cuando este script se ha ejecutado correctamente. */
  root.classList.add('has-js');

  function animationsAllowed() {
    return (!reduceMotion || !reduceMotion.matches) && 'IntersectionObserver' in window;
  }

  function observeReveal(scope) {
    if (!animationsAllowed()) return;
    var container = scope || document;
    var elements = container.querySelectorAll('[data-reveal]:not(.reveal-ready):not(.is-revealed)');
    if (!elements.length) return;

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    }

    Array.prototype.forEach.call(elements, function (element) {
      element.classList.add('reveal-ready');
      revealObserver.observe(element);
    });
  }

  function revealImmediately() {
    Array.prototype.forEach.call(document.querySelectorAll('.reveal-ready'), function (element) {
      element.classList.add('is-revealed');
      element.classList.remove('reveal-ready');
    });
    if (revealObserver) revealObserver.disconnect();
    revealObserver = null;
  }

  function syncMotionPreference(event) {
    if (event.matches) {
      revealImmediately();
    } else {
      observeReveal(document);
    }
  }

  observeReveal(document);
  if (reduceMotion) {
    if (typeof reduceMotion.addEventListener === 'function') {
      reduceMotion.addEventListener('change', syncMotionPreference);
    } else if (typeof reduceMotion.addListener === 'function') {
      reduceMotion.addListener(syncMotionPreference);
    }
  }

  /* Mejora progresiva: el enlace sigue siendo un enlace normal. */
  document.addEventListener('click', function (event) {
    if (reduceMotion && reduceMotion.matches) return;
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var anchor = event.target.closest ? event.target.closest('a[href]') : null;
    if (!anchor || anchor.target || anchor.hasAttribute('download')) return;
    var href = anchor.getAttribute('href');
    if (!href || href.charAt(0) === '#') return;
    try {
      var destination = new URL(href, window.location.href);
      if (destination.origin === window.location.origin && destination.pathname !== window.location.pathname) {
        document.body.classList.add('page-leaving');
      }
    } catch (error) {
      /* Un href no válido conserva el comportamiento normal del navegador. */
    }
  });

  var button = document.getElementById('menu-toggle');
  var menu = document.getElementById('menu-principal');
  if (button && menu) {
    function toggleMenu() {
      var isOpen = menu.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(isOpen));
    }

    function closeMenu(restoreFocus) {
      if (!menu.classList.contains('is-open')) return;
      menu.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
      if (restoreFocus) button.focus();
    }

    button.addEventListener('click', toggleMenu);
    menu.addEventListener('click', function (event) {
      if (event.target.tagName === 'A') closeMenu(false);
    });
    document.addEventListener('click', function (event) {
      if (menu.classList.contains('is-open') && !menu.contains(event.target) && event.target !== button) closeMenu(true);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menu.classList.contains('is-open') && (menu.contains(document.activeElement) || document.activeElement === button)) {
        event.preventDefault();
        closeMenu(true);
      }
    });

    var breakpoint = getComputedStyle(root).getPropertyValue('--bp-menu').trim();
    if (breakpoint && window.matchMedia) {
      var mediaQuery = window.matchMedia('(min-width: ' + breakpoint + ')');
      var onBreakpointChange = function (event) {
        if (event.matches) closeMenu(false);
      };
      if (typeof mediaQuery.addEventListener === 'function') mediaQuery.addEventListener('change', onBreakpointChange);
      else if (typeof mediaQuery.addListener === 'function') mediaQuery.addListener(onBreakpointChange);
      if (mediaQuery.matches) closeMenu(false);
    }
  }

  window.FitCasaMotion = { observe: observeReveal };
}());
