/* ============================================================
   Class XII Macroeconomics — Presentation Deck engine
   Right arrow  : reveal next item, else next slide
   Left arrow   : step back
   m            : slide menu       f : fullscreen
   Home / End   : first / last slide
   ============================================================ */
(function () {
  var slides = [], idx = 0, step = 0;

  function reveals(s) { return Array.prototype.slice.call(s.querySelectorAll('.reveal')); }

  function paint() {
    slides.forEach(function (s, i) { s.classList.toggle('on', i === idx); });

    var cur = slides[idx], r = reveals(cur);
    r.forEach(function (el, i) { el.classList.toggle('shown', i < step); });

    // An .ephemeral item (e.g. "Are you ready for the answer?") disappears
    // once anything after it has been revealed.
    r.forEach(function (el, i) {
      if (el.classList.contains('ephemeral') && step > i + 1) el.classList.remove('shown');
    });

    // collapse any info panels belonging to other slides
    Array.prototype.forEach.call(document.querySelectorAll('.infopanel.open'), function (p) {
      if (!cur.contains(p)) p.classList.remove('open');
    });
    Array.prototype.forEach.call(document.querySelectorAll('.info[aria-expanded="true"]'), function (b) {
      if (!cur.contains(b)) b.setAttribute('aria-expanded', 'false');
    });

    document.getElementById('counter').textContent = (idx + 1) + ' / ' + slides.length;
    document.getElementById('progress').style.width =
      (((idx + (r.length ? step / (r.length + 1) : 0)) / slides.length) * 100) + '%';
    document.getElementById('sect').textContent = cur.dataset.section || '';

    document.getElementById('prev').disabled = (idx === 0 && step === 0);
    document.getElementById('next').disabled = (idx === slides.length - 1 && step >= r.length);

    document.getElementById('stage').scrollTop = 0;
    history.replaceState(null, '', '#' + (idx + 1));
  }

  function next() {
    if (step < reveals(slides[idx]).length) { step++; }
    else if (idx < slides.length - 1) { idx++; step = 0; }
    else { return; }
    paint();
  }

  function prev() {
    if (step > 0) { step--; }
    else if (idx > 0) { idx--; step = reveals(slides[idx]).length; }
    else { return; }
    paint();
  }

  function go(i, showAll) {
    idx = Math.max(0, Math.min(slides.length - 1, i));
    step = showAll ? reveals(slides[idx]).length : 0;
    paint();
  }

  /* ---------- slide menu ---------- */
  function buildMenu() {
    var box = document.querySelector('#menu .mlist'), last = null, html = '';
    slides.forEach(function (s, i) {
      var sec = s.dataset.section || '';
      if (sec !== last) { html += '<div class="mgroup">' + sec + '</div>'; last = sec; }
      var h = s.querySelector('h1, h2');
      var t = h ? h.textContent.replace(/^\s*[\d.]+\s*/, '').trim() : 'Slide ' + (i + 1);
      html += '<a href="#" data-i="' + i + '"><span class="n">' + (i + 1) + '</span><span>' + t + '</span></a>';
    });
    box.innerHTML = html;
    box.addEventListener('click', function (e) {
      var a = e.target.closest('a'); if (!a) return;
      e.preventDefault();
      document.getElementById('menu').classList.remove('on');
      go(+a.dataset.i, false);
    });
  }

  function toggleMenu() { document.getElementById('menu').classList.toggle('on'); }

  /* ---------- info buttons ---------- */
  // An "i" button reveals a panel explaining why a point is worded the way it is.
  // Independent of the arrow-key reveal system: click-only, teacher-triggered.
  function wireInfo() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('.info');
      if (!btn) return;
      e.preventDefault();
      var id = btn.getAttribute('aria-controls');
      var panel = id ? document.getElementById(id) : null;
      if (!panel) {
        var host = btn.closest('h1,h2,h3,h4,p,li,div');
        panel = host && host.parentElement && host.parentElement.querySelector('.infopanel');
      }
      if (!panel) return;
      btn.setAttribute('aria-expanded', panel.classList.toggle('open') ? 'true' : 'false');
    });
  }

  /* ---------- boot ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
    if (!slides.length) return;

    // inherit section label from the previous slide when omitted
    var carry = '';
    slides.forEach(function (s) {
      if (s.dataset.section) carry = s.dataset.section; else s.dataset.section = carry;
    });

    buildMenu();
    wireInfo();

    document.getElementById('next').addEventListener('click', next);
    document.getElementById('prev').addEventListener('click', prev);
    document.getElementById('menuBtn').addEventListener('click', toggleMenu);
    document.getElementById('fsBtn').addEventListener('click', function () {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen();
    });

    document.addEventListener('keydown', function (e) {
      // let a focused info button handle its own Space/Enter instead of advancing
      if ((e.key === ' ' || e.key === 'Enter') &&
          e.target && e.target.closest && e.target.closest('.info')) return;
      if (e.key === 'Escape') { document.getElementById('menu').classList.remove('on'); return; }
      if (e.key === 'm' || e.key === 'M') { toggleMenu(); return; }
      if (e.key === 'f' || e.key === 'F') { document.getElementById('fsBtn').click(); return; }
      if (document.getElementById('menu').classList.contains('on')) return;

      switch (e.key) {
        case 'ArrowRight': case ' ': case 'PageDown': e.preventDefault(); next(); break;
        case 'ArrowLeft':  case 'PageUp':             e.preventDefault(); prev(); break;
        case 'Home': e.preventDefault(); go(0, false); break;
        case 'End':  e.preventDefault(); go(slides.length - 1, true); break;
      }
    });

    // touch swipe
    var x0 = null;
    document.getElementById('stage').addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    document.getElementById('stage').addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 55) { dx < 0 ? next() : prev(); }
      x0 = null;
    }, { passive: true });

    var start = parseInt((location.hash || '').replace('#', ''), 10);
    go(isNaN(start) ? 0 : start - 1, false);
  });
})();
