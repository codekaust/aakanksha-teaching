/* ============================================================
   Class XII Economics — Presentation Deck engine
   Right arrow  : reveal next item, else next slide
   Left arrow   : step back
   m            : slide menu       f : fullscreen
   Home / End   : first / last slide
   ============================================================ */
(function () {
  var slides = [], idx = 0, step = 0;

  /* ============================================================
     GLOSSARY — recall panels for jargon
     Any term a student may have forgotten gets an "i" button next
     to it:  <b>MRS<button class="info" data-term="mrs"></button></b>
     The panel is generated from this table and appended to the end
     of the slide, so a chapter file never repeats a definition.
     Keys are lower-case slugs; add new terms here, not in the HTML.
     ============================================================ */
  var GLOSSARY = {
    'utility': {
      term: 'Utility',
      def: 'The want-satisfying power of a good — the satisfaction a consumer gets from consuming it. It is subjective: the same good gives different utility to different people, and to the same person at different times.'
    },
    'total-utility': {
      term: 'Total Utility (TU)',
      def: 'The total satisfaction from consuming <b>all</b> the units of a good together. TU is the sum of the marginal utilities of every unit consumed.',
      q: 'TU rises as long as MU is positive, is maximum when MU = 0, and falls once MU turns negative.'
    },
    'marginal-utility': {
      term: 'Marginal Utility (MU)',
      def: 'The <b>change</b> in total utility from consuming one more unit of a good. MU<sub>n</sub> = TU<sub>n</sub> − TU<sub>n−1</sub>.',
      q: 'Careful: MU is an <i>addition</i>, not a level. A falling MU still means TU is rising — just more slowly.'
    },
    'dmu': {
      term: 'Law of Diminishing Marginal Utility',
      def: 'As a consumer consumes more and more units of a good, the marginal utility from each successive unit <b>falls</b>. The first glass of water is priceless; the fifth is barely wanted.'
    },
    'cardinal-utility': {
      term: 'Cardinal utility',
      def: 'The approach that assumes utility can be <b>measured in numbers</b> (utils) — 20 utils, 35 utils — so differences can be compared. Marshall\'s approach; the basis of the MU analysis.'
    },
    'ordinal-utility': {
      term: 'Ordinal utility',
      def: 'The approach that assumes utility can only be <b>ranked</b>, not measured — the consumer can say bundle A is preferred to B, but not by how much. The basis of indifference-curve analysis.'
    },
    'monotonic': {
      term: 'Monotonic preferences',
      def: 'A consumer\'s preferences are monotonic if, between two bundles, she prefers the one that has <b>more of at least one good and no less of the other</b>. Informally: more is better.'
    },
    'ic': {
      term: 'Indifference curve (IC)',
      def: 'The locus of all bundles of two goods that give the consumer <b>exactly the same level of satisfaction</b>. Since every point on it is equally good, she is indifferent between them.',
      q: 'ICs slope downward, are convex to the origin, never intersect, and a higher IC means a higher level of satisfaction.'
    },
    'ic-map': {
      term: 'Indifference map',
      def: 'A set of indifference curves drawn together on one diagram. Each curve stands for a different level of satisfaction — the further from the origin, the higher the satisfaction.'
    },
    'mrs': {
      term: 'MRS — Marginal Rate of Substitution',
      def: 'The rate at which a consumer is <b>willing</b> to give up one good to get one more unit of the other, <b>keeping satisfaction unchanged</b>. MRS = Δx₂ / Δx₁ — the amount of good 2 sacrificed per extra unit of good 1.',
      q: 'It is the <b>slope of the indifference curve</b> (taken as a positive number), so it measures her <i>personal</i> valuation — not the market\'s. The market rate is the price ratio p₁/p₂.'
    },
    'dmrs': {
      term: 'Diminishing MRS',
      def: 'As a consumer gets more and more of good 1, she is willing to give up <b>less and less</b> of good 2 for each further unit of good 1. This is exactly why the indifference curve is <b>convex</b> to the origin.'
    },
    'budget-set': {
      term: 'Budget set',
      def: 'The collection of <b>all</b> bundles a consumer can afford at given prices with a given income — every bundle satisfying p₁x₁ + p₂x₂ ≤ M.'
    },
    'budget-line': {
      term: 'Budget line',
      def: 'The <b>boundary</b> of the budget set — all bundles that cost <b>exactly</b> the whole income: p₁x₁ + p₂x₂ = M. Its slope is −p₁/p₂.',
      q: 'A change in income shifts the line parallel; a change in one price rotates it about the other intercept.'
    },
    'price-ratio': {
      term: 'Price ratio (p₁/p₂)',
      def: 'The rate at which the <b>market</b> allows the consumer to exchange good 2 for good 1 — the opportunity cost of one unit of good 1 in terms of good 2. It is the slope of the budget line.'
    },
    'equilibrium': {
      term: "Consumer's equilibrium",
      def: 'The point at which the consumer, given her income and the prices, reaches the <b>highest possible satisfaction</b> and has no reason to change her bundle. It occurs where the budget line is tangent to an indifference curve: MRS = p₁/p₂, with the IC convex there.'
    },
    'demand': {
      term: 'Demand',
      def: 'The quantity of a good a consumer is <b>willing and able</b> to buy at a given price, in a given period, other things remaining equal. Desire without purchasing power is not demand.'
    },
    'demand-curve': {
      term: 'Demand curve',
      def: 'A graph of the quantity demanded of a good against its own price, holding income, tastes and other prices constant. It normally slopes <b>downward</b>.'
    },
    'law-of-demand': {
      term: 'Law of Demand',
      def: 'Other things being equal, a <b>fall</b> in the price of a good raises the quantity demanded of it, and a <b>rise</b> in price lowers it — an inverse price–quantity relationship.'
    },
    'normal-good': {
      term: 'Normal good',
      def: 'A good whose demand <b>rises</b> when the consumer\'s income rises (and falls when income falls). Most goods are normal.'
    },
    'inferior-good': {
      term: 'Inferior good',
      def: 'A good whose demand <b>falls</b> when the consumer\'s income rises, because she switches to a better substitute — e.g. coarse cereal replaced by rice.'
    },
    'substitutes': {
      term: 'Substitute goods',
      def: 'Goods used <b>in place of</b> one another (tea and coffee). A rise in the price of one <b>raises</b> the demand for the other.'
    },
    'complements': {
      term: 'Complementary goods',
      def: 'Goods used <b>together</b> (car and petrol, pen and ink). A rise in the price of one <b>lowers</b> the demand for the other.'
    },
    'giffen': {
      term: 'Giffen good',
      def: 'A special inferior good for which a <b>fall</b> in price <b>lowers</b> quantity demanded — the income effect is so strong it outweighs the substitution effect. The one genuine exception to the law of demand.'
    },
    'market-demand': {
      term: 'Market demand',
      def: 'The total quantity demanded by <b>all</b> consumers in the market at each price — obtained by adding the individual demand curves <b>horizontally</b> (adding quantities, not prices).'
    },
    'ped': {
      term: 'Price elasticity of demand (e_d)',
      def: 'A measure of how <b>responsive</b> quantity demanded is to a change in the good\'s own price: e<sub>d</sub> = (percentage change in quantity demanded) ÷ (percentage change in price). It is negative; we usually quote its absolute value.',
      q: '|e| &gt; 1 elastic · |e| = 1 unitary · |e| &lt; 1 inelastic · e = 0 perfectly inelastic · e = ∞ perfectly elastic.'
    },
    'movement-vs-shift': {
      term: 'Movement along vs shift of the demand curve',
      def: 'A change in the good\'s <b>own price</b> causes a <b>movement along</b> the same curve (expansion / contraction of demand). A change in <b>any other</b> factor — income, tastes, other prices — <b>shifts</b> the whole curve (increase / decrease in demand).'
    }
  };

  // Build the panel markup for a glossary term.
  function glossPanel(key, id) {
    var g = GLOSSARY[key];
    var el = document.createElement('div');
    el.className = 'infopanel';
    el.id = id;
    el.innerHTML = '<span class="tag">Recall — ' + g.term + '</span><p>' + g.def + '</p>' +
                   (g.q ? '<div class="q">' + g.q + '</div>' : '');
    return el;
  }

  // Wire every <button class="info" data-term="…"> to a generated panel
  // placed at the end of its own slide (never inside a grid cell).
  function buildGlossary() {
    var n = 0;
    Array.prototype.forEach.call(document.querySelectorAll('.info[data-term]'), function (btn) {
      var key = btn.getAttribute('data-term');
      var g = GLOSSARY[key];
      if (!g) { btn.remove(); return; }          // unknown term — fail quietly, never show a dead button
      var id = 'gloss-' + key + '-' + (++n);
      btn.setAttribute('aria-controls', id);
      btn.setAttribute('aria-expanded', 'false');
      if (!btn.getAttribute('title')) btn.setAttribute('title', 'What is ' + g.term + '?');
      btn.setAttribute('aria-label', 'Definition of ' + g.term);
      if (!btn.textContent.trim()) btn.textContent = 'i';
      var slide = btn.closest('.slide');
      (slide || btn.parentElement).appendChild(glossPanel(key, id));
    });
  }

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

    buildGlossary();
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
