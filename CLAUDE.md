# Class XII Teaching Decks — repository guide

Three independent courses of classroom presentation decks. Plain static HTML — **no build
step, no bundler, no dependencies**. What is in the repo is exactly what is served.

```
microeconomics/    Introductory Microeconomics · 5 chapters  · local port 8111
macro-economics/   Introductory Macroeconomics · 6 chapters  · local port 8112
computer-science/  Computer Science, CBSE 083  · 10 chapters · local port 8113
business-studies/  Business Studies, CBSE 054  · 12 chapters · local port 8114
index.html         Landing page linking to the four courses
assets/home.css    Styles the landing page ONLY
```

`business-studies/` is published as **two books** — `part-1.html` (Units 1–8, Principles and
Functions of Management) and `part-2.html` (Units 9–12, Business Finance and Marketing) — with
`index.html` offering the two. It also carries a `SYLLABUS.md` recording the CBSE unit list as
verified against the board's own curriculum document, and a dependency-free validator at
`business-studies/tools/check.js` (`node tools/check.js`).

## Where the real instructions live

**Each subject folder owns its own `CLAUDE.md` and `DESIGN.md`. Read the ones for the folder
you are working in before writing or restyling a deck.** They define the teaching approach
(definitions → examples → questions), the question → "ready?" → answer machinery, the info
button, the diagram rules, and the palette. This root file deliberately does not repeat them.

The four courses are independent: each has its own `assets/deck.css` and `assets/deck.js`,
and **they are not identical**. Never "unify" them or edit one expecting the change to reach
the others — fix the file in the subject you are working on.

## Hard constraints

- **Keep every path relative.** The site is published as a GitHub Pages *project* site, so it
  is served from `/aakanksha-teaching/`, not from `/`. A leading-slash `href` or `src` works
  locally and silently 404s in production. There are currently zero absolute paths; keep it
  that way.
- **All styling belongs in that subject's `assets/deck.css`.** Never inline styles into a
  chapter file, never fork the stylesheet per chapter.
- **Never hard-code a colour that is not a token** in the subject's `deck.css`. Two tiers
  exist because canonical Solarized accents fail contrast on beige: words use the `-t` tier,
  shapes use the plain tier.
- **Do not delete `.nojekyll`.** Without it GitHub Pages runs Jekyll and drops files and
  folders whose names begin with an underscore.

## Publishing

GitHub Pages serves the `main` branch from the repository root — pushing to `main` publishes.
There is nothing to build and no deploy workflow to run.

<https://codekaust.github.io/aakanksha-teaching/>

## Local preview

`./start_class.sh` inside a subject folder serves that one folder on its own port (above).
Those scripts may already be running under pm2 as `economics-deck`, `macro-deck` and
`cs-deck` — **check `pm2 list` before starting or stopping anything**, since a second server
on the same port will fail to bind.

To preview the site the way GitHub Pages actually serves it — landing page included — serve
the repository root instead:

```bash
python3 -m http.server 8000
```

## The old `economics/` path is gone

The Microeconomics folder was renamed `economics/` → `microeconomics/`. Redirect stubs kept
the old path alive for a while; they have since been removed, so
`/aakanksha-teaching/economics/…` now 404s. Do not recreate that folder — the decks live under
`microeconomics/`.
