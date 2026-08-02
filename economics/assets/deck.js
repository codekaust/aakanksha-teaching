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
    /* ---- Chapter 1 ---- */
    'scarcity': {
      term: 'Scarcity',
      def: 'The situation in which <b>wants are unlimited</b> but the <b>resources to satisfy them are limited</b> and have alternative uses. Scarcity is the root of every economic problem.',
      q: 'Scarcity is not the same as shortage. Scarcity is permanent and universal; a shortage is temporary and specific.'
    },
    'goods-services': {
      term: 'Goods and services',
      def: '<b>Goods</b> are tangible items that satisfy a want (rice, a pen). <b>Services</b> are intangible activities that satisfy a want (a teacher\'s lesson, a bus ride). Both are produced using resources.'
    },
    'resources': {
      term: 'Resources (factors of production)',
      def: 'The inputs used to produce goods and services — <b>land, labour, capital and entrepreneurship</b>. They are <b>limited in supply</b> and have <b>alternative uses</b>, which is exactly what makes choice necessary.'
    },
    'opportunity-cost': {
      term: 'Opportunity cost',
      def: 'The value of the <b>next best alternative forgone</b> when a choice is made. Because resources are scarce, every choice sacrifices something — and that sacrifice is the true cost.',
      q: 'It is the <i>next best</i> alternative, not the sum of all alternatives given up.'
    },
    'moc': {
      term: 'Marginal opportunity cost (MRT)',
      def: 'The number of units of one good that must be <b>sacrificed</b> to produce <b>one more unit</b> of the other. It is the slope of the PPF, also called the <b>Marginal Rate of Transformation</b>.',
      q: 'It <b>rises</b> as we move along the PPF, because resources are not equally efficient in both uses — which is why the PPF is concave.'
    },
    'ppf': {
      term: 'Production Possibility Frontier (PPF)',
      def: 'A curve showing the <b>various combinations of two goods</b> that an economy can produce when all its resources are <b>fully and efficiently employed</b> with the given technology.',
      q: 'On the curve = efficient · inside = unemployed or inefficiently used resources · outside = unattainable with current resources and technology.'
    },
    'central-problems': {
      term: 'The three central problems',
      def: 'Every economy must answer: <b>(1) What to produce and in what quantities? (2) How to produce — labour-intensive or capital-intensive? (3) For whom to produce — how is output distributed?</b> All three arise from scarcity.'
    },
    'planned-economy': {
      term: 'Centrally planned economy',
      def: 'An economy in which the <b>government (a central authority) decides</b> what, how and for whom to produce. Resources are largely state-owned and allocation follows a plan, not prices.'
    },
    'market-economy': {
      term: 'Market economy',
      def: 'An economy in which the three central problems are settled by the <b>free interaction of buyers and sellers</b> — by <b>prices</b>, not by any authority. A "market" here means the whole exchange mechanism, not a physical place.'
    },
    'mixed-economy': {
      term: 'Mixed economy',
      def: 'An economy in which <b>both the market and the government</b> answer the central problems — the market allocates most goods, while the state supplies public goods and corrects market failure. Every real economy, including India, is mixed.'
    },
    'positive-normative': {
      term: 'Positive vs normative economics',
      def: '<b>Positive</b> statements describe <b>what is</b> and can be tested against facts ("a price rise reduced sales by 8%"). <b>Normative</b> statements say <b>what ought to be</b> and rest on value judgements ("the government should subsidise food").',
      q: 'The test is not whether the statement is <i>true</i> — a false but testable claim is still positive.'
    },
    'micro-macro': {
      term: 'Microeconomics vs macroeconomics',
      def: '<b>Microeconomics</b> studies <b>individual</b> units — a consumer, a firm, a single market — and how price is determined there. <b>Macroeconomics</b> studies the economy <b>as a whole</b> — national income, the general price level, unemployment.'
    },
    /* ---- Chapter 2 ---- */
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
    },

    /* ---- Chapter 3 ---- */
    'production-function': {
      term: 'Production function',
      def: 'The relation between the <b>inputs</b> a firm uses and the <b>maximum output</b> it can produce from them, given the technology: q = f(L, K).'
    },
    'isoquant': {
      term: 'Isoquant',
      def: 'A curve showing all the <b>combinations of two inputs</b> that produce the <b>same level of output</b>. The production-side twin of an indifference curve — same shape, same logic, different meaning.'
    },
    'short-run': {
      term: 'Short run',
      def: 'The period in which <b>at least one input is fixed</b> (usually capital) and output can be changed only by varying the other inputs. Fixed costs exist only in the short run.'
    },
    'long-run': {
      term: 'Long run',
      def: 'The period in which <b>all inputs are variable</b> — the firm can change its plant size. There are no fixed costs in the long run.'
    },
    'tp': {
      term: 'Total Product (TP)',
      def: 'The <b>total quantity of output</b> produced with a given amount of the variable input, the other inputs held fixed.'
    },
    'mp': {
      term: 'Marginal Product (MP)',
      def: 'The <b>change in total product</b> from employing one more unit of the variable input: MP<sub>n</sub> = TP<sub>n</sub> − TP<sub>n−1</sub>.'
    },
    'ap': {
      term: 'Average Product (AP)',
      def: 'Output <b>per unit of the variable input</b>: AP = TP / L.',
      q: 'MP cuts AP at AP\'s maximum, from above. While MP &gt; AP, AP rises; while MP &lt; AP, AP falls.'
    },
    'lvp': {
      term: 'Law of Variable Proportions',
      def: 'As more and more units of a <b>variable input</b> are used with a <b>fixed input</b>, the marginal product of the variable input <b>first rises, then falls, and may finally become negative</b> — the three stages of production.'
    },
    'returns-to-scale': {
      term: 'Returns to scale',
      def: 'What happens to output when <b>all</b> inputs are increased in the <b>same proportion</b>. Output rises more than proportionately (<b>increasing</b>), in the same proportion (<b>constant</b>), or less than proportionately (<b>diminishing</b>).',
      q: 'A long-run idea. The Law of Variable Proportions is the short-run one, where a fixed input holds the firm back.'
    },
    'tfc': {
      term: 'Total Fixed Cost (TFC)',
      def: 'The cost of the <b>fixed inputs</b>. It does not change with output — it is paid even when output is zero. Exists only in the short run.'
    },
    'tvc': {
      term: 'Total Variable Cost (TVC)',
      def: 'The cost of the <b>variable inputs</b>. It is zero at zero output and rises as output rises.'
    },
    'tc': {
      term: 'Total Cost (TC)',
      def: 'The total expenditure on all inputs: <b>TC = TFC + TVC</b>.'
    },
    'afc': {
      term: 'Average Fixed Cost (AFC)',
      def: 'Fixed cost <b>per unit of output</b>: AFC = TFC / q. Since TFC is constant, AFC falls continuously as output rises — a rectangular hyperbola that never touches either axis.'
    },
    'avc': {
      term: 'Average Variable Cost (AVC)',
      def: 'Variable cost <b>per unit of output</b>: AVC = TVC / q. U-shaped, because AP first rises then falls.'
    },
    'ac': {
      term: 'Average Cost (AC / ATC)',
      def: 'Total cost <b>per unit of output</b>: AC = TC / q = AFC + AVC. U-shaped, and always lies above AVC by the amount AFC.'
    },
    'mc': {
      term: 'Marginal Cost (MC)',
      def: 'The <b>addition to total cost</b> from producing one more unit: MC = ΔTC / Δq = ΔTVC / Δq (fixed cost adds nothing at the margin).',
      q: 'MC cuts both AVC and AC at their <b>minimum points</b>, from below. This is the single most examined fact in the chapter.'
    },
    'lrac': {
      term: 'LRAC — Long-Run Average Cost',
      def: 'The lowest average cost of producing each level of output when <b>the firm can vary every input</b>, including plant size. It is the <b>envelope</b> of all the short-run AC curves.'
    },

    /* ---- Chapter 4 ---- */
    'perfect-competition': {
      term: 'Perfect competition',
      def: 'A market with (1) a <b>large number</b> of buyers and sellers, (2) a <b>homogeneous</b> product, (3) <b>free entry and exit</b>, and (4) <b>perfect information</b>. Together these make every firm a <b>price taker</b>.'
    },
    'price-taker': {
      term: 'Price taker',
      def: 'A firm so small relative to the market that it <b>cannot influence price</b> — it must accept the market price and can sell any quantity at it. Its demand curve is therefore <b>horizontal</b>.'
    },
    'tr': {
      term: 'Total Revenue (TR)',
      def: 'The total receipts from selling output: <b>TR = p × q</b>. Under perfect competition p is fixed, so TR is a straight line through the origin.'
    },
    'ar': {
      term: 'Average Revenue (AR)',
      def: 'Revenue <b>per unit sold</b>: AR = TR / q = p. Under perfect competition <b>AR = MR = price</b>, so all three are the same horizontal line.'
    },
    'mr': {
      term: 'Marginal Revenue (MR)',
      def: 'The <b>addition to total revenue</b> from selling one more unit: MR = ΔTR / Δq. Under perfect competition MR = price, because the price does not fall when the firm sells more.'
    },
    'profit-max': {
      term: "The firm's profit-maximising conditions",
      def: 'A competitive firm produces where <b>(1) p = MC</b>, <b>(2) MC is non-decreasing</b> at that output, and <b>(3)</b> in the short run <b>p ≥ min AVC</b> (in the long run <b>p ≥ min AC</b>) — otherwise it shuts down.'
    },
    'shut-down': {
      term: 'Shut-down point',
      def: 'The minimum point of the <b>AVC</b> curve. Below that price, revenue does not even cover variable cost, so the firm loses less by producing <b>nothing</b> and bearing only its fixed cost.'
    },
    'break-even': {
      term: 'Break-even point',
      def: 'The minimum point of the <b>AC</b> curve, where p = min AC and the firm earns exactly <b>normal profit</b> — total revenue equals total cost, so economic profit is zero.'
    },
    'supply-curve': {
      term: 'Supply curve',
      def: 'The relation between the price of a good and the quantity firms are <b>willing to sell</b>, other things equal. It slopes <b>upward</b>. A firm\'s short-run supply curve is the <b>rising part of its MC curve above min AVC</b>.'
    },
    'market-supply': {
      term: 'Market supply',
      def: 'The total quantity all firms together are willing to sell at each price — the <b>horizontal summation</b> of the individual firms\' supply curves.'
    },
    'pes': {
      term: 'Price elasticity of supply (e_S)',
      def: 'A measure of how responsive quantity supplied is to a change in price: e<sub>S</sub> = (percentage change in quantity supplied) ÷ (percentage change in price). It is <b>positive</b>, since supply slopes upward.'
    },
    'unit-tax': {
      term: 'Unit tax',
      def: 'A tax of a <b>fixed amount per unit produced</b>. It raises marginal cost by that amount, so it <b>shifts the supply curve upward</b> by the tax. Contrast a lump-sum tax, which is a fixed cost and leaves MC — and therefore short-run supply — unchanged.'
    },

    /* ---- Chapter 5 ---- */
    'market-equilibrium': {
      term: 'Market equilibrium',
      def: 'The price at which <b>quantity demanded equals quantity supplied</b>. At that price there is no tendency to change: the market clears.'
    },
    'excess-demand': {
      term: 'Excess demand (shortage)',
      def: 'The amount by which quantity demanded <b>exceeds</b> quantity supplied at a price <b>below</b> equilibrium. Unsatisfied buyers bid the price up, until the shortage disappears.'
    },
    'excess-supply': {
      term: 'Excess supply (surplus)',
      def: 'The amount by which quantity supplied <b>exceeds</b> quantity demanded at a price <b>above</b> equilibrium. Sellers with unsold stock cut the price, until the surplus disappears.'
    },
    'free-entry': {
      term: 'Free entry and exit',
      def: 'The long-run condition that firms may enter an industry when profits are positive and leave when they are negative. It forces the price down to <b>min AC</b>, so in the long run every firm earns only <b>normal profit</b>.'
    },
    'price-ceiling': {
      term: 'Price ceiling',
      def: 'A <b>maximum</b> price fixed by the government, set <b>below</b> the equilibrium price to protect buyers. It causes <b>excess demand</b>, and so rationing, queues and black markets.'
    },
    'price-floor': {
      term: 'Price floor',
      def: 'A <b>minimum</b> price fixed by the government, set <b>above</b> the equilibrium price to protect sellers (e.g. a minimum support price, a minimum wage). It causes <b>excess supply</b> — unsold surplus, or unemployment in the labour market.'
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
