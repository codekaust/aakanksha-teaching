#!/usr/bin/env node
/* ============================================================================
   check.js — validator for the Class XII Business Studies decks
   Usage:  node tools/check.js              (check everything)
           node tools/check.js chapter-5-organising.html   (check one file)

   Zero dependencies on purpose. This repository has no build step and no
   node_modules, and it must stay that way — see the root CLAUDE.md. So this
   is deliberately a lint, not a parser: it catches the specific mistakes that
   are easy to make in these decks and invisible until a class is running.

   The checks, and why each one exists:

   absolute-path   The site is published as a GitHub Pages *project* site at
                   /aakanksha-teaching/, not at /. A leading-slash href or src
                   works perfectly on localhost and silently 404s in
                   production. This is the single most expensive mistake
                   available in this repo, so it is checked first.
   unknown-term    deck.js REMOVES a <button class="info" data-term="..."> whose
                   key is not in GLOSSARY, rather than rendering a dead button.
                   That is the right runtime behaviour and a terrible failure
                   mode for an author: a typo just makes the badge vanish.
   panel-pairing   A hand-written .info[aria-controls] with no matching
                   .infopanel id is a button that does nothing when clicked.
   marker-ids      Duplicate SVG <marker> ids across one page break arrowheads
                   in whichever diagram is second. A chapter with eight process
                   diagrams has eight markers, so this WILL happen.
   svg-a11y        A diagram is the whole content of its slide; without
                   role="img" and an aria-label it is invisible to a screen
                   reader and unlabelled in the accessibility tree.
   mark-weight     Every question must carry its mark weight, because sizing
                   the answer is half the skill being taught.
   reveal-order    A .ready with no .reveal after it strands the class on
                   "Are you ready for the answer?" with no answer.
   tag-balance     A dropped </div> silently swallows the rest of the deck,
                   because .slide { display:none } hides the evidence.
   ============================================================================ */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const only = process.argv[2];

let errors = 0, warnings = 0;
const problems = [];

function fail(file, msg, detail) {
  errors++;
  problems.push({ level: 'ERROR', file, msg, detail });
}
function warn(file, msg, detail) {
  warnings++;
  problems.push({ level: 'warn ', file, msg, detail });
}

/* ---------- load the glossary keys out of deck.js ------------------------ */
/* We do not eval deck.js: it is an IIFE that touches `document`. The GLOSSARY
   keys are declared one per line as  'key': {  — so read them literally.     */
function glossaryKeys() {
  const src = fs.readFileSync(path.join(ROOT, 'assets', 'deck.js'), 'utf8');
  const start = src.indexOf('var GLOSSARY');
  if (start < 0) { fail('assets/deck.js', 'no GLOSSARY table found'); return new Set(); }
  const end = src.indexOf('\n  };', start);
  const body = src.slice(start, end < 0 ? src.length : end);
  const keys = new Set();
  const re = /^\s*'([a-z0-9-]+)'\s*:\s*\{/gm;
  let m;
  while ((m = re.exec(body))) keys.add(m[1]);
  return keys;
}

/* ---------- strip comments so they cannot trip the linters --------------- */
function stripComments(html) {
  return html.replace(/<!--[\s\S]*?-->/g, '');
}

/* ---------- per-file checks --------------------------------------------- */
function checkFile(file, keys) {
  const abs = path.join(ROOT, file);
  const raw = fs.readFileSync(abs, 'utf8');
  const html = stripComments(raw);

  /* --- absolute paths --------------------------------------------------- */
  const absPath = /\b(?:href|src)\s*=\s*"\/(?!\/)/g;
  let m;
  while ((m = absPath.exec(html))) {
    fail(file, 'absolute path — breaks on GitHub Pages', context(html, m.index));
  }

  /* --- data-term keys must exist ---------------------------------------- */
  const termRe = /data-term\s*=\s*"([^"]*)"/g;
  const used = new Set();
  while ((m = termRe.exec(html))) {
    used.add(m[1]);
    if (!keys.has(m[1])) {
      fail(file, `unknown data-term "${m[1]}" — deck.js will delete this button`, context(html, m.index));
    }
  }

  /* --- hand-written info panels must be paired -------------------------- */
  const controls = new Set();
  const ctlRe = /<button[^>]*class="[^"]*\binfo\b[^"]*"[^>]*aria-controls\s*=\s*"([^"]+)"/g;
  while ((m = ctlRe.exec(html))) controls.add(m[1]);
  const panelIds = new Set();
  const panelRe = /<div[^>]*class="[^"]*\binfopanel\b[^"]*"[^>]*id\s*=\s*"([^"]+)"/g;
  while ((m = panelRe.exec(html))) {
    if (panelIds.has(m[1])) fail(file, `duplicate .infopanel id "${m[1]}"`);
    panelIds.add(m[1]);
  }
  for (const c of controls) {
    if (!panelIds.has(c)) fail(file, `info button targets "${c}" but no .infopanel has that id`);
  }
  for (const p of panelIds) {
    if (!controls.has(p)) warn(file, `.infopanel "${p}" is never opened by any button`);
  }

  /* --- SVG marker ids unique across the page ---------------------------- */
  const markers = new Map();
  const mkRe = /<marker[^>]*\bid\s*=\s*"([^"]+)"/g;
  while ((m = mkRe.exec(html))) {
    if (markers.has(m[1])) {
      fail(file, `duplicate <marker id="${m[1]}"> — the second diagram's arrowheads will break`);
    }
    markers.set(m[1], true);
  }
  /* every url(#id) reference must resolve to an id defined in the file */
  const allIds = new Set();
  const idRe = /\bid\s*=\s*"([^"]+)"/g;
  while ((m = idRe.exec(html))) allIds.add(m[1]);
  const urlRe = /url\(#([^)]+)\)/g;
  while ((m = urlRe.exec(html))) {
    if (!allIds.has(m[1])) fail(file, `url(#${m[1]}) references an id that does not exist`);
  }

  /* --- svg accessibility ------------------------------------------------ */
  const svgRe = /<svg\b[^>]*>/g;
  while ((m = svgRe.exec(html))) {
    const tag = m[0];
    if (!/\brole\s*=\s*"img"/.test(tag)) fail(file, 'svg without role="img"', tag.slice(0, 110));
    if (!/\baria-label\s*=/.test(tag)) fail(file, 'svg without aria-label', tag.slice(0, 110));
    if (!/\bviewBox\s*=/.test(tag)) warn(file, 'svg without viewBox — will not scale', tag.slice(0, 110));
  }

  /* --- deck shell present ----------------------------------------------- */
  if (/class="slide"/.test(html)) {
    for (const id of ['bar', 'progress', 'menu', 'stage', 'prev', 'next', 'counter', 'sect', 'menuBtn', 'fsBtn']) {
      if (!new RegExp(`id="${id}"`).test(html)) fail(file, `deck shell missing #${id} — deck.js will throw`);
    }
    if (!/assets\/deck\.css/.test(html)) fail(file, 'does not link assets/deck.css');
    if (!/assets\/deck\.js/.test(html)) fail(file, 'does not link assets/deck.js');
  }

  /* --- questions carry their mark weight -------------------------------- */
  const qTagRe = /<div[^>]*class="[^"]*\b(qcard|challenge)\b[^"]*"[^>]*>\s*<span class="tag">([\s\S]{0,220}?)<\/span>/g;
  while ((m = qTagRe.exec(html))) {
    if (!/class="mk"/.test(m[2])) {
      warn(file, `.${m[1]} tag has no mark weight — add <span class="mk">N marks</span>`, m[2].replace(/\s+/g, ' ').trim().slice(0, 80));
    }
  }

  /* --- a .ready must be followed by something to reveal ------------------ */
  const slides = html.split(/<section\b/).slice(1);
  slides.forEach((s, i) => {
    const revealTags = s.match(/class="[^"]*\breveal\b[^"]*"/g) || [];
    const readyAt = revealTags.findIndex(t => /\bready\b/.test(t));
    if (readyAt >= 0 && readyAt === revealTags.length - 1) {
      fail(file, `slide ${i + 1}: a .ready reveal is the last reveal on the slide — the class never gets the answer`);
    }
    revealTags.forEach(t => {
      if (/\bephemeral\b/.test(t) && !/\bready\b/.test(t)) {
        warn(file, `slide ${i + 1}: .ephemeral on something that is not the .ready prompt`);
      }
    });
  });

  /* --- tag balance ------------------------------------------------------ */
  for (const tag of ['div', 'section', 'table', 'figure', 'svg', 'aside', 'ol', 'ul']) {
    const open = (html.match(new RegExp(`<${tag}\\b`, 'g')) || []).length;
    const close = (html.match(new RegExp(`</${tag}>`, 'g')) || []).length;
    if (open !== close) fail(file, `unbalanced <${tag}>: ${open} open, ${close} close`);
  }

  /* --- local links resolve ---------------------------------------------- */
  const linkRe = /\bhref\s*=\s*"(?!https?:|mailto:|#)([^"?#]+)/g;
  while ((m = linkRe.exec(html))) {
    const target = path.resolve(path.dirname(abs), m[1]);
    if (!fs.existsSync(target)) fail(file, `dead link → ${m[1]}`);
  }

  return { terms: used, slides: slides.length };
}

function context(html, i) {
  return html.slice(Math.max(0, i - 40), i + 60).replace(/\s+/g, ' ').trim();
}

/* ---------- run ---------------------------------------------------------- */
const keys = glossaryKeys();
const files = only
  ? [only]
  : fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).sort((a, b) => {
      const na = (a.match(/chapter-(\d+)/) || [])[1];
      const nb = (b.match(/chapter-(\d+)/) || [])[1];
      if (na && nb) return +na - +nb;
      if (na) return 1;
      if (nb) return -1;
      return a.localeCompare(b);
    });

const usedTerms = new Set();
let totalSlides = 0;
const perFile = [];

for (const f of files) {
  if (!fs.existsSync(path.join(ROOT, f))) { fail(f, 'file does not exist'); continue; }
  const r = checkFile(f, keys);
  r.terms.forEach(t => usedTerms.add(t));
  totalSlides += r.slides;
  perFile.push({ file: f, slides: r.slides });
}

/* Not an error, and usually not even a defect. A term whose whole life is
   inside one chapter — `preliminary-screening`, `treasury-bill` — is defined
   on its own slide and correctly carries no badge anywhere, because the rule
   is "badge it where it is REUSED, not where it is introduced". So a healthy
   deck always has some. Reported only so that a sudden jump in the count is
   visible, which would mean badges have been dropped. */
if (!only) {
  const unused = [...keys].filter(k => !usedTerms.has(k));
  if (unused.length) {
    warn('assets/deck.js',
      `${unused.length} of ${keys.size} glossary terms are never recalled — expected for terms used only in the chapter that defines them; investigate only if this number jumps`,
      unused.slice(0, 12).join(', ') + (unused.length > 12 ? ' …' : ''));
  }
}

/* ---------- report ------------------------------------------------------- */
console.log('');
for (const p of problems) {
  console.log(`  ${p.level}  ${p.file}\n         ${p.msg}${p.detail ? '\n         · ' + p.detail : ''}`);
}
console.log('');
if (!only) {
  console.log('  Slides per file');
  for (const r of perFile) if (r.slides) console.log(`    ${String(r.slides).padStart(4)}  ${r.file}`);
  console.log(`    ${String(totalSlides).padStart(4)}  TOTAL`);
  console.log(`\n  Glossary: ${keys.size} terms defined, ${usedTerms.size} recalled`);
}
console.log(`\n  ${errors} error${errors === 1 ? '' : 's'}, ${warnings} warning${warnings === 1 ? '' : 's'}\n`);
process.exit(errors ? 1 : 0);
