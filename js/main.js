/* Portfolio behaviour: theme, nav, work filters, accordions, reveal.
   No dependencies. Every feature degrades to plain readable HTML. */

(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- 1. theme ----------
     The <head> script already set data-theme before paint. This only
     handles the toggle and remembering the choice. */

  var themeBtn = document.getElementById('theme-btn');

  function labelTheme() {
    if (!themeBtn) return;
    var dark = root.getAttribute('data-theme') === 'dark';
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  }

  labelTheme();

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      labelTheme();
    });
  }

  // Follow the OS only while the visitor has made no explicit choice.
  var scheme = window.matchMedia('(prefers-color-scheme: dark)');
  var onScheme = function (e) {
    var stored = null;
    try { stored = localStorage.getItem('theme'); } catch (err) {}
    if (stored === 'light' || stored === 'dark') return;
    root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    labelTheme();
  };
  if (scheme.addEventListener) scheme.addEventListener('change', onScheme);
  else if (scheme.addListener) scheme.addListener(onScheme);

  /* ---------- 2. header and mobile nav ---------- */

  var head = document.getElementById('head');
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');

  if (head) {
    var onScroll = function () {
      head.classList.toggle('scrolled', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function closeNav() {
    if (!nav || !burger) return;
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        closeNav();
        burger.focus();
      }
    });

    // Leaving the mobile breakpoint with the panel open would strand it.
    var wide = window.matchMedia('(min-width: 761px)');
    var onWide = function (e) { if (e.matches) closeNav(); };
    if (wide.addEventListener) wide.addEventListener('change', onWide);
    else if (wide.addListener) wide.addListener(onWide);
  }

  /* ---------- 3. work accordions ---------- */

  var heads = Array.prototype.slice.call(document.querySelectorAll('.w-head'));

  function collapse(btn) {
    btn.setAttribute('aria-expanded', 'false');
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (panel) panel.hidden = true;
  }

  heads.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    });
  });

  /* ---------- 4. work filters ---------- */

  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var rows = Array.prototype.slice.call(document.querySelectorAll('.work-row'));
  var emptyNote = document.getElementById('empty-note');

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var want = chip.getAttribute('data-filter');
      var shown = 0;

      chips.forEach(function (c) {
        c.setAttribute('aria-pressed', String(c === chip));
      });

      rows.forEach(function (row) {
        var match = want === 'all' || row.getAttribute('data-cat') === want;
        row.hidden = !match;
        if (match) shown++;
        // Collapsing on the way out keeps the list from jumping around.
        var btn = row.querySelector('.w-head');
        if (btn && !match) collapse(btn);
      });

      if (emptyNote) emptyNote.hidden = shown > 0;
    });
  });

  /* ---------- 5. reveal on scroll ---------- */

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduced && 'IntersectionObserver' in window) {
    root.setAttribute('data-reveal', 'on');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  }
})();
