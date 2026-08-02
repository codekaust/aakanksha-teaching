# DESIGN.md — Class XII Macroeconomics presentation decks

The visual and interaction system for every chapter deck. Anything not described here should
not appear in a deck. If you need something new, add it to `assets/deck.css` and document it
here rather than writing inline styles in a chapter file.

**Design intent:** these are not documents to be read at a desk — they are projected in a
classroom and driven with an arrow key while a teacher talks. Every decision below follows
from that: high contrast, large type, one idea per screen, colour used to *mean* something,
and nothing on screen that the teacher did not choose to reveal.

This system is shared with the Class XII Economics (micro) decks. **Keep it in sync** — a
student meets both courses, and a component that looks or behaves differently between them
costs attention that should be going to the subject.

---

## 1. Files

```
macro-economics/
├── index.html                          course home, chapter cards
├── chapter-1-introduction.html         one self-contained deck per chapter
├── chapter-2-national-income-accounting.html
├── chapter-3-money-and-banking.html
├── chapter-4-income-and-employment.html
├── chapter-5-government-budget.html
├── chapter-6-open-economy.html
├── assets/
│   ├── deck.css                        the entire design system — single source of truth
│   └── deck.js                         navigation, reveals, menu, info panels
├── start_class.sh                      python http.server on :8112
├── CLAUDE.md                           content/teaching rules
└── DESIGN.md                           this file
```

**Naming:** `chapter-<n>-<kebab-title>.html`. No build step, no bundler, no framework, no CDN.
The decks must open from a plain static file server with no network access — a classroom
projector laptop may be offline.

**Port 8112**, so micro (8111), macro (8112) and computer science (8113) can all be served at
once during a teaching day.

Chapters share `deck.css` and `deck.js` by relative path. **Never fork the stylesheet per
chapter.** A change to spacing or colour must land everywhere at once.

---

## 2. Colour — Solarized Light, two tiers

The palette is Solarized Light. Backgrounds and ink are taken from the canonical base tones;
the accents are **deliberately darkened** from canonical Solarized.

### Why the accents are not canonical

Stock Solarized accents are tuned to sit on a *dark* background. On beige they fail contrast:
canonical yellow `#b58900` scores 2.98:1 on `#fdf6e3` and green `#859900` scores 2.97:1 —
below even the 3:1 needed for graphics, and nowhere near the 4.5:1 needed for text. Projectors
wash contrast out further. So each hue exists at two darknesses.

### Base tones

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#fdf6e3` | page background (base3) |
| `--bg-2` | `#f7f0dd` | rarely used, between base3 and base2 |
| `--panel` | `#eee8d5` | cards, boxes, chips (base2) |
| `--panel-2` | `#e4dcc4` | table headers, formula blocks |
| `--line` | `#d9d0b6` | all borders and rules |
| `--ink-strong` | `#073642` | headings, `<b>`, SVG `.lab` (base02) |
| `--ink` | `#52666d` | body text |
| `--ink-dim` | `#556a71` | secondary text, `.lead`, `.small` |
| `--ink-faint` | `#5b6966` | captions, figcaptions |

### Accents

| Meaning | Graphic tier (curves, strokes, shape fills) | Text tier (labels, tags, headings) |
|---|---|---|
| yellow — highlight, equilibrium, key point, questions | `--amber` `#a17a00` | `--amber-t` `#755900` |
| green — examples, answers, "correct" | `--teal` `#748500` | `--teal-t` `#586600` |
| blue — definitions, AD, info panels | `--blue` `#1f7ab8` | `--blue-t` `#175f90` |
| red — warnings, common errors, inflationary/deflationary gaps | `--rose` `#c62b28` | `--rose-t` `#b02522` |
| violet — insight, shifted or "new" curves | `--violet` `#6c71c4` | `--violet-t` `#5055a0` |
| cyan — links forward/back to other chapters | `--cyan` `#238b84` | `--cyan-t` `#196b65` |

**The rule:** anything a student reads as **words** uses the `-t` tier; anything they read as a
**shape** uses the plain tier. Inside SVG that means `<text>` fills take `-t` values while
`stroke=` and shape `fill=` take the plain ones.

### Semantic colour coding

Colour carries meaning and must stay consistent across all six chapters, so visual habits
transfer. A student who learns "blue = aggregate demand" in Chapter 4 must not meet a blue
supply-of-foreign-exchange curve in Chapter 6.

- **blue** — aggregate demand, demand for foreign exchange; definitions
- **green/teal** — aggregate supply, the 45° line, supply of foreign exchange; examples, answers
- **amber** — the equilibrium point, the full-employment level of income, questions
- **violet** — shifted / new / alternative curves (AD after a rise in investment), insights
- **red/rose** — warnings, common mistakes, inflationary and deflationary gaps
- **cyan** — cross-chapter bridges only

The circular flow diagram is the one place where colour means *direction of flow* instead:
**real flows (goods, factor services) in teal, money flows (payments, incomes) in amber**,
labelled in text as well so the coding is never load-bearing on its own.

### Contrast targets

- **Text:** ≥ 4.5:1 against whatever background it sits on (`--bg` *and* `--panel`)
- **Graphics** (curve strokes, axes, shape fills): ≥ 3:1 — WCAG 1.4.11

Re-audit whenever a colour is introduced. Both `--bg` and `--panel` must be checked; `--panel`
is the harder test.

---

## 3. Typography

### Family

```css
font-family: "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

A **system font stack** — no webfonts. Webfonts mean a network request, and these decks must
work offline. Sans-serif throughout for projector legibility.

Two deliberate exceptions:
- **Monospace** (`SF Mono, Cascadia Code, Consolas`) for `code`/`.mono` — equations and
  functional forms like `C = C̄ + cY`, `k = 1/(1 − MPC)`, aggregate abbreviations in a formula.
- **Georgia italic** for the single "i" glyph in the info button, so it reads as a
  classic information mark rather than a lowercase letter.

### Scale

The root size is **fluid**, so one stylesheet serves a laptop and a large projector:

```css
font-size: clamp(18px, 1.28vw, 23px);   /* ≈18.4px at 1440px wide */
```

Everything else is expressed in `rem`/`em` and scales with it.

| Element | Size | Notes |
|---|---|---|
| `h1` | `clamp(2.3rem, 3.9vw, 3.05rem)` | title slides only |
| `h2` | `clamp(1.65rem, 2.7vw, 2.12rem)` | the slide heading — one per slide |
| `h3` | `1.10rem`, `--amber-t` | sub-heading inside a slide |
| `.card h4` | `1rem`, `--amber-t` | card heading |
| body | root | |
| `.lead` | `1.15em`, `--ink-dim` | opening line of a slide |
| `.small` | `.88em`, `--ink-dim` | asides, caveats |
| `table` | `.95em` | |
| `.formula` | `1.3rem` | |
| `.ready` | `1.35rem` | |
| `.box .tag` | `.7rem`, 800 weight, `.16em` tracking, uppercase | box label |

**Headings are held to a 1.2× ratio, not scaled freely.** At larger multiples the `h1`
overflows the title slides. If body text is rescaled, headings must be recomputed to match —
do not simply bump the root and leave the heading clamps alone.

### Chrome is pinned to px

The top bar (52px tall), slide menu and nav buttons (46px circles) use **fixed px** font
sizes — 11–15px. They live in fixed-size containers and must not inflate when the body scale
changes. Chrome should recede; content should dominate.

### Weights and emphasis

- `750` — `h1`, `.defn .term`
- `700` — `h2`, `h3`, `h4`, `.ready`, `th`
- `800` — `.tag`, `.mgroup`, step numerals (small uppercase needs extra weight)
- `650` — `b`, `strong` (`--ink-strong`)
- `<em>` is **restyled**: not italic, but amber and semi-bold — italics are hard to read
  projected. Use it for the first appearance of a technical term.
- Negative letter-spacing on headings (`-.02em`/`-.015em`); positive, wide tracking on small
  uppercase tags (`.16em`).

---

## 4. Layout

```css
--maxw: 1240px;                    /* measure — line length cap */
.slide { padding: 30px 46px 60px } /* px, not rem, so padding doesn't inflate with text */
```

- `#stage` is a fixed, scrollable region below the 52px bar. Slides that exceed the viewport
  scroll rather than clip.
- `.slide.on` is a **vertically centred flex column**. Short slides sit centred; long ones
  flow from the top and scroll.
- Only one slide is in the DOM-visible state at a time (`display:none` otherwise).

### Grid helpers

| Class | Columns | Use |
|---|---|---|
| `.grid2` | `1fr 1fr` | two parallel ideas — e.g. revenue vs capital receipts |
| `.grid3` | `1fr 1fr 1fr` | three short cards — e.g. the three methods |
| `.split` | `1.05fr .95fr` | **diagram on the left, explanation on the right** |

All collapse to a single column below 900px.

`--radius: 14px` on every box, card, table container and panel. `.chip` uses `999px`.

---

## 5. Components

### Content boxes

All share `.box` (14px radius, `--panel` background, **5px left border**, uppercase `.tag`).
The left border colour is what distinguishes them, plus a faint left-to-right gradient wash of
the same hue at 10–14% alpha.

| Class | Border | Purpose |
|---|---|---|
| `.defn` | blue | **Definitions.** Exam-ready wording. `.term` for the term itself. |
| `.eg` | green | **Examples.** Concrete, numeric, worked. |
| `.insight` | violet | The "why this matters" / the punchline. |
| `.warn` | red | Common errors, traps, "students routinely write…". |
| `.bridge` | cyan | Forward/back links to other chapters. |
| `.note` | grey | Neutral aside. |

`.card` is the plainer sibling — 1px border all round, no accent — for grid cells.

### Question → Ready → Answer

The central classroom device, and **non-negotiable**. Every question appears in three
arrow-press steps so the teacher can pause and let the class attempt it:

```html
<div class="qcard">
  <span class="tag">Question 3</span>
  <p>…the question…</p>
</div>
<div class="reveal ready ephemeral">Are you ready for the answer? 🤔</div>
<div class="reveal answer">
  <span class="tag">Answer</span>
  <p>…the answer…</p>
</div>
```

- `.qcard` — amber, always visible.
- `.ready` — amber dashed border, gently pulsing (1.9s). `.ephemeral` makes it **disappear**
  once the answer is revealed, so it never competes with the answer.
- `.answer` — green.
- `.reveal` elements are hidden until stepped to; order in the DOM is reveal order.
- `.challenge` — violet, ★-marked. One per section, deeper than the routine checks.

**Numericals use the same machinery, one line at a time.** Put the sum in a `.qcard`, then
make each line of the solution its own `.reveal` inside a `.steps` list, so the class computes
each step before it appears. Never reveal a finished calculation in one press.

### Info button

An **ⓘ** next to a phrase, opening a panel that explains why it is worded that way.

```html
<h4>Value of output − Intermediate consumption
  <button class="info" aria-controls="gva-not-sales" aria-expanded="false"
          title="Why is it value of output and not sales?">i</button></h4>
…
<div class="infopanel" id="gva-not-sales">
  <span class="tag">Why is it value of output and not sales?</span>
  <p>…</p>
  <div class="q">…contrasting cases, quoted style…</div>
</div>
```

- The **panel goes at the end of the slide**, never inside a grid cell — a long explanation
  would stretch one cell and wreck the grid. Link it with `aria-controls`.
- Use a stable, descriptive `id` (`gva-not-sales`, `mpc-vs-aps`).
- **Click-only.** Never bound to the arrow keys, so it cannot interfere with the
  question → ready → answer stepping.
- Panels auto-collapse when you leave the slide.
- `.infopanel .q` is a quiet left-ruled block for contrasting cases.

### Glossary recall button

The same ⓘ, but used for a **term the student has already been taught and may have
forgotten** — NFIA four slides after it was defined, MPC in the middle of the multiplier.
The panel is **generated**, so the definition is written once and never drifts:

```html
<h2>The multiplier process, round by round<button class="info" data-term="multiplier"></button><button class="info" data-term="apc-mpc"></button></h2>
```

- The term table is `GLOSSARY` at the top of `assets/deck.js`. **Add new terms there, never in
  a chapter file** — that is the whole point.
- Each entry has `term` (the heading), `def` (the exam-ready definition, HTML allowed) and an
  optional `q` (rendered as the quiet `.q` block — the caveat or the thing students confuse it
  with, e.g. "APC can exceed 1; MPC cannot").
- `deck.js` fills in `aria-controls`, `aria-expanded`, `title`, `aria-label` and the "i" glyph,
  and appends the panel to the **end of the slide** automatically. An unknown `data-term`
  removes the button rather than showing a dead one.
- **Rule of thumb:** put one on every slide where a term is *used* but not *defined on that
  slide*, in the heading or the first line that uses it. Do not put one on the slide that
  defines the term.
- This is distinct from the hand-written `.infopanel` above, which answers "why is this slide
  worded this way?". Both may appear on the same slide.

**Size and placement.** The button is sized in **rem, never em**, so it is the same small disc
in an `h2`, a `th` and a `.small` caption — it still scales with the projector because rem is
tied to the fluid root size. It is raised half its own em above the baseline so it rides at the
**top right of the word, like a ™ mark**, instead of shouldering the line apart. Never use
`vertical-align: super`: that lifts by the *parent's* font size and reintroduces the very
inconsistency this fixes.

**Do not stack more than about three on one heading.** A row of identical discs reads as
decoration and tells the student nothing about which is which. When a slide needs more, attach
each badge to the term itself in the body — the column headers of the table, the `.tag` of each
box — which is where the student is looking anyway.

### Other components

- **`.formula`** — centred, `--panel-2`, bordered. `.frac` renders a true stacked fraction
  via a flex column with a border-bottom on the numerator. Used constantly here:
  the multiplier, the deflator, APC/MPC.
- **`.steps`** — ordered list with amber numbered circles. The workhorse of this course:
  every national-income calculation and every multiplier round is a `.steps` list.
- **`.chips` / `.chip`** — recap pills. `.chip.k` marks the key terms.
- **Tables** — `--panel-2` headers in `--amber-t`; `.lbl` left-aligns a column;
  `.hi` (amber) and `.hi2` (green) highlight cells; `<caption>` sits below.
  Item-treatment tables (include / exclude and why) and consumption–saving schedules both
  use this; put the running total in a `.hi` cell.

---

## 6. Diagrams

**A slide that names a curve but does not draw it has failed.** Full rules in `CLAUDE.md`;
the visual conventions are:

- **Inline SVG only.** Hand-plotted, no chart library, no image files.
- **`viewBox` + `max-width:100%`** so diagrams scale with the slide.
- Diagram text is in **SVG user units**, so it scales with the diagram, *not* the root font.
  `svg text` is 15px, `svg text.lab` 16px bold. If body text is rescaled these need a matching
  nudge — but change them cautiously, since labels sit at hand-placed coordinates and a large
  jump causes collisions.

| Class | Style |
|---|---|
| `.axis` | `#75837f`, 2px |
| `.grid` | `#e4dcc4`, 1px — decorative, deliberately faint |
| `.curve` | 3px, round caps, no fill |
| `.c-amber` … `.c-cyan` | curve stroke colours (graphic tier) |
| `.dash` | `6 5` dash — projection lines from a point to the axes |
| `svg text.lab` | `--ink-strong`, bold — named labels |
| `svg text.sm` | 13px — secondary annotation inside a diagram |
| `.pt` | amber dot with a **`--bg` halo stroke** so it stays visible where curves cross |

**Arrowheads.** A `<marker>` cannot inherit the stroke of the path that references it, so each
coloured arrow declares its own marker and the marker's `<path>` takes a fill class:
`.mk-amber` `.mk-teal` `.mk-blue` `.mk-rose` `.mk-violet` `.mk-cyan` `.mk-ink`. Never hard-code a
hex into a marker. Marker ids must be **unique across the whole page** — prefix them per diagram
(`cf-t1`, `fs-a`, `fx-ax`).

**Boxes and filled regions inside a diagram** — sector boxes in the circular flow, nodes of the
budget tree, bars in a chart:

| Class | Use |
|---|---|
| `svg .dbox` / `.dbox2` | neutral labelled box (`--panel` / `--panel-2` fill, grey stroke) |
| `.fill-amber` `.fill-teal` `.fill-blue` `.fill-rose` `.fill-violet` | tinted box or bar carrying the semantic colour |
| `.band-rose` / `.band-teal` | unstroked translucent band, e.g. shading a gap region |

**Building a diagram in reveal steps:** put `class="reveal"` on an SVG `<g>`. `display:none` /
`display:block` work on SVG group elements, so the same arrow-key machinery that steps through
prose also steps through a diagram's construction. Every macro deck uses this — the circular flow
is built arrow by arrow, the AD–AS cross curve by curve.

Requirements: label **both axes** with variable *and* unit; plot from the worked example's
**actual numbers**; use dashed projection lines so students see how to read a coordinate;
give every `<svg>` an `aria-label`; keep `<marker>` ids **unique across the whole page**
(duplicate ids break arrowheads — and the circular flow diagram is nothing but arrowheads).

### The recurring macro diagrams

Each of these has a fixed treatment; do not re-invent it per chapter.

- **Circular flow** — boxes for the sectors, arrowed flows between them. Real flows teal,
  money flows amber, each arrow labelled in words. Built up sector by sector as reveals.
- **AD–AS with the 45° line** — income/output on the x-axis (₹ crore), AD and AS on the y-axis
  (₹ crore, same scale, so the 45° line is genuinely at 45°). AS *is* the 45° line, in teal.
  AD in blue, intercept at autonomous expenditure, equilibrium point in amber with dashed
  projections to both axes.
- **Consumption and saving functions** — drawn as a stacked pair sharing an x-axis so the
  break-even point lines up vertically with S = 0. Mark C̄ and −C̄ explicitly.
- **The gaps** — inflationary and deflationary gaps are drawn as a *vertical* rose segment at
  the full-employment income level, between AD and the 45° line. Never as a horizontal gap.
- **Foreign exchange market** — rate (₹ per $) on the y-axis, quantity of foreign exchange on
  the x-axis; demand blue, supply teal, equilibrium amber.

---

## 7. Interaction

Implemented in `assets/deck.js`.

| Input | Action |
|---|---|
| `→` / `Space` / `PageDown` | next reveal, else next slide |
| `←` / `PageUp` | step back (re-entering a slide shows all its reveals) |
| `Home` / `End` | first / last slide |
| `m` | slide menu — auto-built from `data-section` groups and headings |
| `f` | fullscreen |
| `Esc` | close menu |
| swipe | left/right on tablets |
| click ⓘ | toggle info panel |

- **`data-section`** on a slide sets the breadcrumb in the top bar and groups it in the menu.
  Omit it and the slide inherits the previous slide's section.
- The URL hash tracks the slide number (`#29`) — deep-linkable, and survives a refresh.
- The progress bar advances fractionally *within* a slide as reveals are stepped through.
- Space/Enter on a focused info button toggles the panel instead of advancing.

### Motion

Deliberately minimal — motion is distracting when projected. Only: a 0.28s fade-and-rise on
slide change, a 0.3s fade on reveal, the slow `.ready` pulse, and 0.15s hover transitions.
No slide transitions, no parallax, nothing decorative.

---

## 8. Accessibility

Not optional — it is also what makes a deck readable from the back row.

- Contrast targets in §2, verified numerically rather than by eye.
- Every `<svg>` carries `role="img"` and a descriptive `aria-label`.
- Info buttons are real `<button>`s with `aria-controls` and a maintained `aria-expanded`.
- `:focus-visible` gives an amber outline with 2px offset.
- Colour is never the *only* carrier of meaning — every accent-coloured box also has a
  worded `.tag`, and diagram elements are labelled in text.
- Semantic HTML: `<section>` per slide, real `<table>`/`<th>`, `<figure>`/`<figcaption>`.

---

## 9. Adding a chapter

1. Copy the shell of an existing chapter: `#bar`, `#progress`, `#menu`, `#stage`,
   the two `.nav` buttons, and the `deck.css` / `deck.js` links.
2. Set the `<title>` and `#bar .brand` (`CH 3 · MONEY AND BANKING`).
3. Write slides as `<section class="slide">`, marking section starts with `data-section`.
4. Open with a **title slide**, then a **route map**; close with a **recap**, the
   **NCERT exercises**, and a **title slide pointing to the next chapter**.
5. Use the existing components. Do not invent new ones without adding them to `deck.css` and
   this file — and if a component would be useful in micro too, add it there as well.
6. Add the chapter card to `index.html` and remove its `.soon` class.
7. Validate before shipping: HTML well-formed, info buttons paired to panels, SVG marker ids
   unique, every numerical re-checked by hand, contrast re-audited if any new colour was used.
