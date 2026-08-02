/* ============================================================
   Class XII Macroeconomics — Presentation Deck engine
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
     to it:  <b>MPC<button class="info" data-term="mpc"></button></b>
     The panel is generated from this table and appended to the end
     of the slide, so a chapter file never repeats a definition.
     Keys are lower-case slugs; add new terms here, not in the HTML.
     ============================================================ */
  var GLOSSARY = {
    /* ---- Chapter 1 · Introduction ---- */
    'macroeconomics': {
      term: 'Macroeconomics',
      def: 'The branch of economics that studies the economy <b>as a whole</b> — national income, the general price level, total employment, the overall level of output — rather than an individual consumer, firm or market.'
    },
    'fallacy-of-composition': {
      term: 'Fallacy of composition',
      def: 'The error of assuming that what is true for <b>one</b> part must be true for the <b>whole</b>. One family saving more grows richer; if <i>every</i> family saves more, spending falls, income falls, and total saving need not rise at all.',
      q: 'This is precisely why macroeconomics cannot simply be micro added up.'
    },
    'capitalist-economy': {
      term: 'Capitalist economy',
      def: 'An economy in which the means of production are <b>privately owned</b>, production is carried out for <b>sale in the market</b>, and there is <b>hiring of labour for wages</b>. Profit is the motive that drives production.'
    },
    'four-sectors': {
      term: 'The four sectors',
      def: 'The macro economy is modelled as four groups: <b>households</b> (own factors, consume), <b>firms</b> (produce, hire factors), the <b>government</b> (taxes, spends), and the <b>rest of the world</b> (exports and imports).'
    },
    'circular-flow': {
      term: 'Circular flow of income',
      def: 'The continuous movement of goods, services and money between households and firms. Households supply factor services and receive factor incomes; they spend those incomes on the firms\' output, which returns the money to firms.'
    },
    'real-money-flows': {
      term: 'Real flows and money flows',
      def: '<b>Real flows</b> are movements of goods, services and factor services. <b>Money flows</b> are the payments made for them — factor incomes and consumption expenditure. The two run in <b>opposite directions</b> around the circle.'
    },
    'leakages-injections': {
      term: 'Leakages and injections',
      def: '<b>Leakages</b> are income withdrawn from the circular flow — <b>saving, taxes and imports</b>. <b>Injections</b> are spending added into it — <b>investment, government spending and exports</b>. The flow is in equilibrium when leakages = injections.'
    },
    'stock-flow': {
      term: 'Stock and flow',
      def: 'A <b>stock</b> is measured at a <b>point of time</b> (capital, wealth, money supply). A <b>flow</b> is measured <b>over a period of time</b> (income, investment, output).'
    },
    'depreciation': {
      term: 'Depreciation (consumption of fixed capital)',
      def: 'The <b>fall in the value of fixed capital</b> during a year through normal wear and tear and expected obsolescence. It is <b>not</b> a loss from an accident or a sudden price fall.'
    },
    'investment': {
      term: 'Investment (capital formation)',
      def: 'The <b>addition to the stock of capital</b> during a year. <b>Gross investment</b> is total spending on capital goods; <b>net investment = gross investment − depreciation</b>, and it is net investment that actually raises the capital stock.'
    },

    /* ---- Chapter 2 · National Income Accounting ---- */
    'final-intermediate': {
      term: 'Final and intermediate goods',
      def: '<b>Final goods</b> are bought for final use — final consumption or investment — and are not resold or used up in production this year. <b>Intermediate goods</b> are bought by one firm from another to be <b>used up or resold</b> within the year.',
      q: 'The same good can be either. Milk bought by a household is final; the same milk bought by a sweet shop is intermediate. It is the <i>use</i>, not the good, that decides.'
    },
    'double-counting': {
      term: 'Double counting',
      def: 'Counting the value of a good <b>more than once</b> in national income — once as an intermediate good and again inside the value of the final good. The two remedies are the <b>final-goods approach</b> and the <b>value-added approach</b>.'
    },
    'consumption-capital-goods': {
      term: 'Consumption goods and capital goods',
      def: '<b>Consumption goods</b> directly satisfy human wants (food, clothes, a television). <b>Capital goods</b> are durable goods used to <b>produce other goods</b> (machines, factory buildings). Both are final goods.'
    },
    'inventory': {
      term: 'Inventory investment',
      def: 'The <b>change in stock</b> of finished goods, semi-finished goods and raw materials held by a firm during the year: closing stock − opening stock. It counts as investment, and it may be <b>planned</b> or <b>unplanned</b>.'
    },
    'nfia': {
      term: 'NFIA — Net Factor Income from Abroad',
      def: 'Factor income earned by a country\'s <b>residents</b> from abroad <b>minus</b> factor income earned by non-residents within its <b>domestic territory</b>.',
      q: '<b>National = Domestic + NFIA.</b> This single line converts every domestic aggregate into its national counterpart.'
    },
    'domestic-national': {
      term: 'Domestic vs national',
      def: '<b>Domestic</b> aggregates count production inside the country\'s <b>geographical/economic territory</b>, whoever produces it. <b>National</b> aggregates count production by the country\'s <b>normal residents</b>, wherever they are. The bridge between them is NFIA.'
    },
    'mp-fc': {
      term: 'Market price vs factor cost',
      def: '<b>Market price</b> includes indirect taxes and excludes subsidies. <b>Factor cost</b> is what actually reaches the factors of production.',
      q: '<b>FC = MP − Net Indirect Taxes</b>, where NIT = indirect taxes − subsidies.'
    },
    'gdp': {
      term: 'GDP — Gross Domestic Product',
      def: 'The <b>market value of all final goods and services produced within the domestic territory</b> of a country during a year, before deducting depreciation.'
    },
    'gnp': {
      term: 'GNP — Gross National Product',
      def: 'GDP <b>plus</b> net factor income from abroad — the value of final output produced by a country\'s <b>normal residents</b>, at home and abroad.'
    },
    'nnp-fc': {
      term: 'NNP at factor cost — National Income',
      def: 'GNP<sub>MP</sub> <b>minus depreciation minus net indirect taxes</b>. This is what "national income" means in the exam, and it equals the sum of all factor incomes earned by normal residents.'
    },
    'value-added': {
      term: 'Value added',
      def: 'The <b>value of output minus the value of intermediate consumption</b> — the contribution a firm actually makes to national output. Adding it up across all firms avoids double counting.'
    },
    'expenditure-method': {
      term: 'Expenditure method',
      def: 'Measuring national income as total spending on final output: <b>GDP<sub>MP</sub> = C + I + G + (X − M)</b>.'
    },
    'income-method': {
      term: 'Income method',
      def: 'Measuring national income as the sum of <b>factor incomes</b> — compensation of employees, rent, interest, profit and mixed income — generated within the domestic territory. It yields NDP at factor cost.'
    },
    'personal-income': {
      term: 'Personal income and personal disposable income',
      def: '<b>Personal income</b> is income actually received by households, from all sources. <b>Personal disposable income (PDI)</b> is personal income <b>minus direct taxes and miscellaneous non-tax payments</b> — what households can actually spend or save.'
    },
    'real-nominal-gdp': {
      term: 'Real and nominal GDP',
      def: '<b>Nominal GDP</b> values output at <b>current-year</b> prices; <b>real GDP</b> values the same output at <b>base-year</b> prices. Only real GDP measures a genuine change in output, because prices are held constant.'
    },
    'gdp-deflator': {
      term: 'GDP deflator',
      def: 'A price index covering all goods produced in the economy: <b>(nominal GDP ÷ real GDP) × 100</b>. It measures the change in the general price level between the base year and the current year.'
    },
    'externalities': {
      term: 'Externalities',
      def: 'Benefits or harms a person or firm imposes on others <b>without paying or being paid</b> for them — factory smoke, a beautiful garden. They are not captured in GDP, which is one reason GDP is a poor measure of welfare.'
    },

    /* ---- Chapter 3 · Money and Banking ---- */
    'barter': {
      term: 'Barter system',
      def: 'Direct exchange of goods for goods, with no money. It needs a <b>double coincidence of wants</b>, and also lacks a common measure of value, a store of value and a standard of deferred payment.'
    },
    'money': {
      term: 'Money',
      def: 'Anything <b>generally accepted</b> as a medium of exchange and in settlement of debt. Its four functions: <b>medium of exchange, measure of value, store of value, standard of deferred payment</b>.'
    },
    'fiat-legal-tender': {
      term: 'Fiat money and legal tender',
      def: '<b>Fiat money</b> is money because the <b>government orders</b> it to be — it has no intrinsic value. <b>Legal tender</b> is money that <b>cannot legally be refused</b> in settlement of a debt.'
    },
    'money-supply': {
      term: 'Money supply (M1 to M4)',
      def: 'The total stock of money held by the <b>public</b> at a point of time. <b>M1 = currency with the public + demand deposits + other deposits with the RBI</b>; M2 adds post-office savings deposits; M3 adds time deposits with banks; M4 adds total post-office deposits.',
      q: 'M1 is the most liquid and is called <b>narrow money</b>; M3 is <b>broad money</b> and is the aggregate monetary policy watches.'
    },
    'high-powered-money': {
      term: 'High-powered money (M0)',
      def: 'Money created by the <b>RBI</b> — currency held by the public plus cash reserves held by banks. It is the base on which banks build deposits through credit creation.'
    },
    'credit-creation': {
      term: 'Credit creation',
      def: 'The process by which commercial banks turn an initial deposit into a much larger total of deposits, by <b>lending out everything except the required reserve</b> and having those loans return to the banking system as fresh deposits.'
    },
    'money-multiplier': {
      term: 'Money (deposit) multiplier',
      def: 'The number of times total deposits expand from an initial deposit: <b>1 ÷ LRR</b>. With a legal reserve ratio of 20%, an initial deposit of ₹1,000 creates ₹5,000 of deposits.'
    },
    'lrr': {
      term: 'LRR — Legal Reserve Ratio',
      def: 'The fraction of deposits a bank must, by law, keep as reserves rather than lend. It is the sum of the <b>CRR</b> (kept with the RBI) and the <b>SLR</b> (kept with the bank itself in liquid assets).'
    },
    'crr-slr': {
      term: 'CRR and SLR',
      def: '<b>CRR (Cash Reserve Ratio)</b> — the fraction of deposits a bank must keep as cash with the <b>RBI</b>. <b>SLR (Statutory Liquidity Ratio)</b> — the fraction it must keep with <b>itself</b> in liquid assets such as cash, gold and government securities. Raising either <b>reduces</b> credit creation.'
    },
    'repo-reverse-repo': {
      term: 'Repo rate and reverse repo rate',
      def: '<b>Repo rate</b> — the rate at which the RBI <b>lends</b> to commercial banks against securities. <b>Reverse repo rate</b> — the rate at which the RBI <b>borrows</b> from them. Raising the repo rate makes borrowing dearer and <b>contracts</b> credit.'
    },
    'omo': {
      term: 'Open Market Operations (OMO)',
      def: 'The RBI\'s <b>purchase or sale of government securities</b> in the open market. <b>Selling</b> securities absorbs cash from banks and contracts credit; <b>buying</b> them injects cash and expands credit.'
    },
    'qualitative-instruments': {
      term: 'Qualitative instruments',
      def: 'Tools that control the <b>direction</b> of credit rather than its total quantity — <b>margin requirements</b>, <b>moral suasion</b>, <b>selective credit controls</b> and rationing of credit.'
    },
    'lender-of-last-resort': {
      term: 'Lender of last resort',
      def: 'The RBI\'s function of <b>lending to commercial banks in a crisis</b>, when they cannot obtain funds elsewhere. It prevents a temporary shortage of cash from turning into a bank failure and a panic.'
    },

    /* ---- Chapter 4 · Income and Employment ---- */
    'ex-ante-ex-post': {
      term: 'Ex ante and ex post',
      def: '<b>Ex ante</b> = <b>planned</b> or intended (what people <i>intend</i> to consume, save, invest). <b>Ex post</b> = <b>actual</b> or realised. Equilibrium is defined in terms of <b>ex ante</b> magnitudes; ex post saving and investment are always equal.'
    },
    'aggregate-demand': {
      term: 'Aggregate Demand (AD)',
      def: 'The <b>total planned expenditure</b> on final goods and services in an economy in a year: <b>AD = C + I + G + (X − M)</b>. In the simple two-sector model, AD = C + I.'
    },
    'aggregate-supply': {
      term: 'Aggregate Supply (AS)',
      def: 'The <b>total value of final goods and services all producers plan to supply</b> in a year — which equals the total income generated, so AS = Y. On the 45° line, every point has AS equal to income.'
    },
    'consumption-function': {
      term: 'Consumption function',
      def: 'The relation between consumption and income: <b>C = C̄ + b·Y</b>, where <b>C̄</b> is autonomous consumption (consumption at zero income) and <b>b</b> is the MPC.'
    },
    'saving-function': {
      term: 'Saving function',
      def: 'The relation between saving and income: <b>S = −C̄ + (1 − b)Y</b>. It follows directly from the consumption function, since Y = C + S.'
    },
    'apc-mpc': {
      term: 'APC and MPC',
      def: '<b>APC = C / Y</b> — the <b>proportion</b> of income consumed. <b>MPC = ΔC / ΔY</b> — the fraction of <b>additional</b> income consumed, and the slope of the consumption function.',
      q: 'APC can exceed 1 (when consumption exceeds income); MPC lies between 0 and 1. Also <b>APC + APS = 1</b> and <b>MPC + MPS = 1</b>.'
    },
    'aps-mps': {
      term: 'APS and MPS',
      def: '<b>APS = S / Y</b> — the proportion of income saved. <b>MPS = ΔS / ΔY</b> — the fraction of <b>additional</b> income saved, and the slope of the saving function. MPS = 1 − MPC.'
    },
    'multiplier': {
      term: 'Investment multiplier (k)',
      def: 'The number of times national income rises for a given rise in investment: <b>k = ΔY / ΔI = 1 / (1 − MPC) = 1 / MPS</b>.',
      q: 'The larger the MPC, the larger the multiplier, because each round of spending passes on more of the income it receives.'
    },
    'full-employment': {
      term: 'Full employment',
      def: 'The situation in which <b>everyone willing and able to work at the existing wage rate gets work</b>. Frictional and voluntary unemployment may still exist; <b>involuntary</b> unemployment does not.'
    },
    'excess-deficient-demand': {
      term: 'Excess demand and deficient demand',
      def: '<b>Excess demand</b> — aggregate demand is <b>greater</b> than aggregate supply at the full-employment level of income. <b>Deficient demand</b> — aggregate demand is <b>less</b> than it. Output cannot rise beyond full employment, so the gaps show up as inflation or unemployment.'
    },
    'inflationary-deflationary-gap': {
      term: 'Inflationary and deflationary gap',
      def: 'The <b>inflationary gap</b> is the <b>amount by which AD exceeds</b> the AD needed for full employment; it raises prices, not output. The <b>deflationary gap</b> is the amount by which AD <b>falls short</b> of it; it causes unemployment and idle capacity.'
    },

    /* ---- Chapter 5 · Government Budget ---- */
    'budget': {
      term: 'Government budget',
      def: 'A statement of the government\'s <b>estimated receipts and estimated expenditure</b> for a financial year. Its objectives include reallocation of resources, redistribution of income, economic stability, and managing public enterprises.'
    },
    'public-goods': {
      term: 'Public goods',
      def: 'Goods that are <b>non-rival</b> (one person\'s use does not reduce another\'s) and <b>non-excludable</b> (no one can be kept out) — national defence, street lighting. Because of the <b>free-rider problem</b> the market will not supply them, so the government must.'
    },
    'revenue-capital-receipts': {
      term: 'Revenue receipts and capital receipts',
      def: '<b>Revenue receipts</b> neither create a liability nor reduce an asset (taxes, fines, interest received). <b>Capital receipts</b> either <b>create a liability</b> (borrowing) or <b>reduce an asset</b> (disinvestment, recovery of loans). Those two tests decide every classification question.'
    },
    'direct-indirect-tax': {
      term: 'Direct and indirect tax',
      def: 'A <b>direct tax</b> is one whose <b>burden cannot be shifted</b> — the person who pays it also bears it (income tax, corporation tax). An <b>indirect tax</b> can be <b>shifted</b> to someone else (GST, customs duty).'
    },
    'revenue-capital-expenditure': {
      term: 'Revenue and capital expenditure',
      def: '<b>Revenue expenditure</b> neither creates an asset nor reduces a liability (salaries, subsidies, interest paid). <b>Capital expenditure</b> either <b>creates an asset</b> (building a road) or <b>reduces a liability</b> (repaying a loan).'
    },
    'revenue-deficit': {
      term: 'Revenue deficit',
      def: '<b>Revenue expenditure − revenue receipts.</b> It means the government\'s day-to-day spending exceeds its regular income, so it is borrowing to meet consumption expenses.'
    },
    'fiscal-deficit': {
      term: 'Fiscal deficit',
      def: '<b>Total expenditure − total receipts other than borrowing.</b> It measures the government\'s <b>total borrowing requirement</b> for the year.'
    },
    'primary-deficit': {
      term: 'Primary deficit',
      def: '<b>Fiscal deficit − interest payments.</b> It shows how much of current borrowing is due to <b>this year\'s</b> new spending rather than the burden of past debt.'
    },

    /* ---- Chapter 6 · Open Economy ---- */
    'bop': {
      term: 'Balance of Payments (BOP)',
      def: 'A systematic record of <b>all economic transactions between the residents of a country and the rest of the world</b> in a year. It has two accounts: the <b>current account</b> and the <b>capital account</b>.'
    },
    'current-account': {
      term: 'Current account',
      def: 'The part of the BOP recording transactions in <b>goods, services, income and current transfers</b>. It does not change the country\'s assets or liabilities.'
    },
    'capital-account': {
      term: 'Capital account',
      def: 'The part of the BOP recording transactions that <b>change a country\'s foreign assets and liabilities</b> — foreign investment, loans, borrowing and banking capital.'
    },
    'autonomous-accommodating': {
      term: 'Autonomous and accommodating transactions',
      def: '<b>Autonomous</b> ("above the line") transactions are undertaken for their <b>own sake</b> — profit or need — independently of the BOP position. <b>Accommodating</b> ("below the line") transactions are undertaken by the monetary authority precisely to <b>cover the gap</b> the autonomous ones leave.',
      q: 'A BOP deficit or surplus is defined over the <b>autonomous</b> transactions only.'
    },
    'trade-balance': {
      term: 'Balance of trade',
      def: 'The <b>value of exports of goods minus the value of imports of goods</b> — visible items only. The balance on current account is wider, since it also includes services, income and transfers.'
    },
    'exchange-rate': {
      term: 'Foreign exchange rate',
      def: 'The <b>price of one currency in terms of another</b> — the number of units of domestic currency needed to buy one unit of foreign currency. It is determined by the demand for and supply of foreign exchange.'
    },
    'exchange-rate-systems': {
      term: 'Fixed, flexible and managed floating',
      def: '<b>Fixed</b> — the rate is pegged by the government/central bank. <b>Flexible (floating)</b> — the rate is set entirely by demand and supply in the foreign-exchange market. <b>Managed floating</b> — the rate floats, but the central bank intervenes to smooth excessive movement. Most countries, including India, use the last.'
    },
    'depreciation-devaluation': {
      term: 'Depreciation vs devaluation',
      def: 'Both mean the domestic currency loses value against foreign currency. <b>Depreciation</b> happens through <b>market forces</b> under a flexible rate; <b>devaluation</b> is a <b>deliberate government decision</b> under a fixed rate. (Their opposites: appreciation and revaluation.)'
    },
    'real-exchange-rate': {
      term: 'Nominal and real exchange rate',
      def: 'The <b>nominal</b> rate is the plain price of one currency in another. The <b>real</b> exchange rate adjusts it for prices in the two countries — <b>e × P*/P</b> — and so measures the true <b>competitiveness</b> of home goods against foreign goods.'
    },
    'ppp': {
      term: 'Purchasing Power Parity (PPP)',
      def: 'The theory that in the long run the exchange rate adjusts until a given sum of money buys the <b>same basket of goods</b> in both countries — i.e. until the real exchange rate equals one.'
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
