(function(){
  'use strict';
  // Elements
  var btn = document.getElementById('menu-toggle');
  var menu = document.getElementById('menu-principal');
  if (!btn || !menu) { return; }

  // Helper: toggle menu state
  function toggleMenu(){
    var isOpen = menu.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(isOpen));
  }

  // Helper: close menu and return focus to button
  function closeMenu(){
    if (menu.classList.contains('is-open')){
      menu.classList.remove('is-open');
      btn.setAttribute('aria-expanded','false');
      btn.focus();
    }
  }

  // Click on button
  btn.addEventListener('click', function(){
    toggleMenu();
  });

  // Click on any link inside the menu -> close (navigation still occurs)
  menu.addEventListener('click', function(e){
    var target = e.target;
    if (target.tagName === 'A'){
      closeMenu();
    }
  });

  // Click outside menu and button -> close
  document.addEventListener('click', function(e){
    if (menu.classList.contains('is-open') &&
        !menu.contains(e.target) &&
        e.target !== btn){
      closeMenu();
    }
  });

  // Escape key handling when focus is in menu or on button
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && menu.classList.contains('is-open')){
      var active = document.activeElement;
      if (menu.contains(active) || active === btn){
        e.preventDefault(); // prevent default scrolling
        closeMenu();
      }
    }
  });

  // Responsive: read breakpoint from CSS variable
  var bp = getComputedStyle(document.documentElement).getPropertyValue('--bp-menu').trim();
  var mq = null;
  if (bp){
    mq = window.matchMedia('(min-width: '+bp+')');
  }
  // When breakpoint changes to desktop, ensure menu is closed
  function onMediaChange(e){
    if (e.matches){ // now desktop
      if (menu.classList.contains('is-open')){
        closeMenu();
      }
    }
  }
  if (mq){
    mq.addEventListener('change', onMediaChange);
    // Initial check in case page loads already in desktop mode
    if (mq.matches){
      closeMenu();
    }
  }
})();
