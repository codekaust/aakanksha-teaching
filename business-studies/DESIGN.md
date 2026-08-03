# DESIGN.md — Class XII Business Studies presentation decks

The visual and interaction system for every chapter deck in this folder. Anything not described
here should not appear in a deck. If you need something new, add it to `assets/deck.css` and
document it here rather than writing inline styles in a chapter file.

**Design intent:** these are not documents to be read at a desk — they are projected in a classroom
and driven with an arrow key while a teacher talks. High contrast, large type, one idea per screen,
colour used to *mean* something, and nothing on screen the teacher did not choose to reveal.

**Subject intent:** roughly **60% of the CBSE 054 paper is application and analysis**, and the whole
of it is marked on **structure and keywords**, not on prose quality. So this design system carries
components the Economics decks do not need — a case-study box with a highlightable proving line, a
point-wise answer list, a mark-weight chip, and a `distinguish` table with a named basis column.
Those four exist because they are where marks are won and lost.

---

## 1. Files

```
business-studies/
├── index.html                                  course home — the two books
├── part-1.html                                 book one, chapters 1–8  (Units 1–8, 50 marks)
├── part-2.html                                 book two, chapters 9–12 (Units 9–12, 30 marks)
├── chapter-1-nature-of-management.html         one self-contained deck per chapter
├── chapter-2-principles-of-management.html
├── chapter-3-business-environment.html
├── chapter-4-planning.html
├── chapter-5-organising.html
├── chapter-6-staffing.html
├── chapter-7-directing.html
├── chapter-8-controlling.html
├── chapter-9-financial-management.html
├── chapter-10-financial-markets.html
├── chapter-11-marketing.html
├── chapter-12-consumer-protection.html
├── assets/
│   ├── deck.css                                the entire design system — single source of truth
│   └── deck.js                                 navigation, reveals, menu, info panels, GLOSSARY
├── start_class.sh                              python http.server on :8114  (pm2 name: bst-deck)
├── SYLLABUS.md                                 the CBSE 054 unit list, verified against the board
├── CLAUDE.md                                   content/teaching rules
└── DESIGN.md                                   this file
```

**Naming:** `chapter-<n>-<kebab-title>.html`, numbered by **CBSE unit**, not by NCERT chapter. These
differ in Part 2 — see §10. No build step, no bundler, no framework, no CDN. The decks must open
from a plain static file server with no network access; a classroom projector laptop may be offline.

Chapters share `deck.css` and `deck.js` by relative path. **Never fork the stylesheet per chapter.**

**The four courses in this repository are independent.** `assets/` here was seeded from
`../microeconomics/assets/` and has since diverged. Never edit another subject's stylesheet, and
never assume a fix made there has reached this one.

### Why three landing pages instead of one

The course is published as two physical NCERT books and examined as two parts with **separate mark
weights** (50 and 30). A single flat list of twelve chapters hides that. So `index.html` offers the
two books, and each book page carries its own chapter list, its own "how this book hangs together"
bridge box, and its own warnings. Part B's cards carry the green accent (`.chapters.p2`) so a
student can see which half of the paper a chapter belongs to at a glance.

---

## 2. Colour — Solarized Light, two tiers

Identical to the Economics decks, and deliberately so: a student taking both subjects should not
have to relearn what a colour means. The palette is Solarized Light with **deliberately darkened**
accents.

### Why the accents are not canonical

Stock Solarized accents are tuned for a *dark* background. On beige they fail contrast: canonical
yellow `#b58900` scores 2.98:1 on `#fdf6e3` and green `#859900` scores 2.97:1 — below even the 3:1
needed for graphics. Projectors wash contrast out further. So each hue exists at two darknesses.

### Base tones

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#fdf6e3` | page background (base3) |
| `--bg-2` | `#f7f0dd` | rarely used, between base3 and base2 |
| `--panel` | `#eee8d5` | cards, boxes, chips (base2) |
| `--panel-2` | `#e4dcc4` | table headers, formula blocks |
| `--line` | `#d9d0b6` | all borders and rules |
| `--ink-strong` | `#073642` | headings, `<b>`, SVG `.nlab` (base02) |
| `--ink` | `#52666d` | body text |
| `--ink-dim` | `#556a71` | secondary text, `.lead`, `.small` |
| `--ink-faint` | `#5b6966` | captions, figcaptions, connectors |

### Accents

| Meaning | Graphic tier (strokes, node fills) | Text tier (labels, tags, headings) |
|---|---|---|
| yellow — the key point, the question, the answer's keyword | `--amber` `#a17a00` | `--amber-t` `#755900` |
| green — examples, cases, answers | `--teal` `#748500` | `--teal-t` `#586600` |
| blue — definitions, structures, info panels | `--blue` `#1f7ab8` | `--blue-t` `#175f90` |
| red — warnings, confusable pairs, common errors | `--rose` `#c62b28` | `--rose-t` `#b02522` |
| violet — insight, the challenge question, mnemonics | `--violet` `#6c71c4` | `--violet-t` `#5055a0` |
| cyan — links forward/back to other chapters, reverse drills | `--cyan` `#238b84` | `--cyan-t` `#196b65` |

**The rule:** anything a student reads as **words** uses the `-t` tier; anything they read as a
**shape** uses the plain tier. Inside SVG that means `<text>` fills take `-t` values while `stroke=`
and shape `fill=` take the plain ones.

### Semantic colour coding

Colour carries meaning and must stay consistent across all twelve chapters, so visual habits
transfer. There are two registers, and they do not contradict each other:

**In prose boxes** — this is the question→answer machinery, inherited unchanged from the Economics
decks:

- **amber** — the question, and the key point
- **green** — the example, the case, and the answer
- **blue** — the definition
- **violet** — the insight, and the ★ challenge
- **rose** — the warning and the confusable pair
- **cyan** — the bridge to another chapter, and the reverse drill

**Inside a diagram** — a diagram has no tags, so the hue *is* the label:

- **blue** — definitions and structures (an org chart's boxes, a market's tiers)
- **green** — the example or the case being illustrated
- **amber** — the key node: the one the diagram is actually about
- **rose** — the trap, the barrier, the leakage, the thing that goes wrong
- **violet** — the insight the construction is building towards
- **cyan** — a node that belongs to another chapter

The one place these could collide is the answer box: in prose it is green, but a diagram's *answer
node* is amber. That is correct — in prose, green means "this is settled"; in a diagram, amber means
"look here". Never carry a diagram hue into a box, or a box hue into a diagram.

### Contrast targets

- **Text:** ≥ 4.5:1 against whatever background it sits on (`--bg` *and* `--panel`)
- **Graphics** (node strokes, connectors, fills): ≥ 3:1 — WCAG 1.4.11

Re-audit whenever a colour is introduced. Both `--bg` and `--panel` must be checked; `--panel` is
the harder test.

---

## 3. Typography

### Family

```css
font-family: "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

A **system font stack** — no webfonts. Webfonts mean a network request, and these decks must work
offline. Sans-serif throughout for projector legibility.

Two deliberate exceptions:
- **Monospace** (`SF Mono, Cascadia Code, Consolas`) for `code`/`.mono` — used far less here than in
  Economics, mostly for a ratio like `2 : 1` or a formula like `Return on Investment`.
- **Georgia italic** for the single "i" glyph in the info button, so it reads as a classic
  information mark rather than a lowercase letter.

### Scale

The root size is **fluid**, so one stylesheet serves a laptop and a large projector:

```css
font-size: clamp(18px, 1.28vw, 23px);   /* ≈18.4px at 1440px wide */
```

| Element | Size | Notes |
|---|---|---|
| `h1` | `clamp(2.3rem, 3.9vw, 3.05rem)` | title slides only |
| `h2` | `clamp(1.65rem, 2.7vw, 2.12rem)` | the slide heading — one per slide |
| `h3` | `1.10rem`, `--amber-t` | sub-heading inside a slide |
| `.card h4` | `1rem`, `--amber-t` | card heading |
| `.lead` | `1.15em`, `--ink-dim` | opening line of a slide |
| `.small` | `.88em`, `--ink-dim` | asides, caveats, the "in the paper they still want…" note |
| `table` | `.95em` | |
| `.ready` | `1.35rem` | |
| `.box .tag` | `.7rem`, 800 weight, `.16em` tracking, uppercase | box label |
| `.mnemonic .hook` | `1.12em`, 700 | the memory hook itself |

**Headings are held to a 1.2× ratio, not scaled freely.** At larger multiples `h1` overflows the
title slides. If body text is rescaled, headings must be recomputed to match.

### Chrome is pinned to px

The top bar (52px tall), slide menu and nav buttons (46px circles) use **fixed px** font sizes —
11–15px. They live in fixed-size containers and must not inflate when the body scale changes.

### Weights and emphasis

- `750` — `h1`, `.defn .term`
- `700` — `h2`, `h3`, `h4`, `.ready`, `th`, `.points > li > .h`, `.mnemonic .hook`
- `800` — `.tag`, `.mgroup`, step numerals, `svg text.numlab`
- `650` — `b`, `strong` (`--ink-strong`)
- `<em>` is **restyled**: not italic, but amber and semi-bold — italics are hard to read projected.
  Use it for the first appearance of a technical term.

**A note specific to this subject.** Bolding is not decoration here — it is the mark scheme. Bold
the words the examiner is scanning for and nothing else. If half a paragraph is bold, none of it is.

---

## 4. Layout

```css
--maxw: 1240px;                    /* measure — line length cap */
.slide { padding: 30px 46px 60px } /* px, not rem, so padding doesn't inflate with text */
```

- `#stage` is a fixed, scrollable region below the 52px bar. Slides that exceed the viewport scroll
  rather than clip.
- `.slide.on` is a **vertically centred flex column**. Short slides sit centred; long ones flow from
  the top and scroll.
- Only one slide is in the DOM-visible state at a time (`display:none` otherwise).

### Grid helpers

| Class | Columns | Use |
|---|---|---|
| `.grid2` | `1fr 1fr` | two parallel ideas — internal vs external sources, formal vs informal |
| `.grid3` | `1fr 1fr 1fr` | three short cards — the three levels, the three financial decisions |
| `.split` | `1.05fr .95fr` | **diagram on the left, explanation on the right** |
| `.figrow` | `1.35fr .65fr` | **diagram plus its "how to read this" panel** |

All collapse to a single column below 900px (`.figrow` below 1000px).

`--radius: 14px` on every box, card, table container and panel. `.chip` uses `999px`.

---

## 5. Components

### 5.1 Content boxes

All share `.box` (14px radius, `--panel` background, **5px left border**, uppercase `.tag`). The
left border colour distinguishes them, plus a faint left-to-right gradient wash of the same hue at
10–14% alpha.

| Class | Border | Purpose |
|---|---|---|
| `.defn` | blue | **Definitions.** Exam-ready wording. `.term` for the term itself. |
| `.eg` | green | **Examples.** Concrete, numeric, named. |
| `.insight` | violet | The "why this matters" / the punchline. |
| `.warn` | red | Common errors, traps, "students routinely write…". |
| `.bridge` | cyan | Forward/back links to other chapters. |
| `.note` | grey | Neutral aside — including "the textbook still says X". |

`.card` is the plainer sibling — 1px border all round, no accent — for grid cells.

### 5.2 Question → Ready → Answer

The central classroom device, and **non-negotiable**. Every question appears in three arrow-press
steps so the teacher can pause and let the class attempt it:

```html
<div class="qcard">
  <span class="tag">Question 3 <span class="mk">4 marks</span></span>
  <p>…the question…</p>
</div>
<div class="reveal ready ephemeral">Are you ready for the answer? 🤔</div>
<div class="reveal answer">
  <span class="tag">Answer</span>
  <ol class="points">
    <li><span class="h">Heading in the exam's words</span>one or two lines of explanation.</li>
  </ol>
</div>
```

- `.qcard` — amber, always visible.
- `.ready` — amber dashed border, gently pulsing (1.9s). `.ephemeral` makes it **disappear** once
  the answer is revealed, so it never competes with the answer.
- `.answer` — green.
- `.reveal` elements are hidden until stepped to; **order in the DOM is reveal order**.

### 5.3 Mark weight — `.tag .mk`

**Every question in a deck carries its mark weight in the tag.** Students must learn to size an
answer, and the tag is how they calibrate.

```html
<span class="tag">Question 3 <span class="mk">4 marks</span></span>
```

The chip inherits the tag's hue via `currentColor`, so it reads as part of the label rather than as
a fifth accent. **Points ≈ marks** — 3 marks → 3 points, 4 → 4, 5–6 → 5–6. Say so on the slide the
first time each mark weight appears in a chapter.

### 5.4 Point-wise answers — `.points`

**A Business Studies answer is never a paragraph.** A bolded heading earns half the mark on its own;
an unheaded paragraph earns less than either. So every answer that is worth more than one mark is an
`ol.points`, and the heading is a `<span class="h">` which the stylesheet follows with an em dash:

```html
<ol class="points">
  <li><span class="h">Unity of Command</span>an employee should receive orders from
      <b>one superior only</b>, so that responsibility is never divided.</li>
</ol>
```

`<b>` as the first child works identically if the heading needs no dash. The numerals are green
inside an `.answer`, amber inside a `.qcard` or `.challenge`, blue inside a `.defn` — they take the
hue of the box they sit in, so a numbered list never fights its container.

### 5.5 The keyword — `.kw`

Where the examiner is looking for one specific term — *esprit de corps*, *functional foremanship*,
*trading on equity*, *cash discount*, *deficiency* — that word is wrapped:

```html
…which is exactly what Fayol meant by <span class="kw">esprit de corps</span>.
```

Amber pill, bold. **Use it sparingly**: one or two per answer. It means "if this word is missing,
the mark is missing", and it stops meaning that if it decorates every third word.

### 5.6 Case study — `.case`, `mark.ev`, `.evidence`

**Every concept gets a mini case on the slide where it is introduced.** A named firm, a named
person, a concrete decision, three or four lines, small enough to project.

```html
<div class="case">
  <span class="tag">Case 4 · Sunrise Apparels, Tirupur</span>
  <p><span class="who">Meera Raghavan</span>, who runs a 60-worker garment unit, found her
  cutting-room staff taking instructions from both the production supervisor and the quality
  manager. <mark class="ev">Last Tuesday the two gave opposite instructions on the same batch and
  400 shirts were cut to the wrong size.</mark></p>
</div>
```

`.case` is green like every other example, but it is ruled on **both** sides so it reads as a quoted
situation rather than as the teacher talking. `.who` marks the named person or firm.

`mark.ev` highlights **the line that proves it** inside the case text. `.evidence` re-quotes that
same line inside the answer, under an automatic "The line that proves it" label — so the class sees
the two are the same sentence. **Step 5 of the drill is where marks are actually lost**, and this
pair of components exists solely to make that step impossible to skip.

**The case and its answer never share a reveal.** Case → question → "Are you ready?" →
identification → quoted evidence.

### 5.7 The reverse drill — `.reverse`

Give the concept, ask the class to **write** a case that illustrates it. A student who can construct
the situation can always recognise it; the reverse is not true. Cyan, `⇄` prefix.

```html
<div class="reverse">
  <span class="tag">Now the other way round</span>
  <p>Write a four-line case set in a Kochi seafood exporter that could <b>only</b> be answered
  <i>Espirit de Corps</i> — not <i>Equity</i>, not <i>Initiative</i>.</p>
</div>
```

Use the ordinary three-step reveal for the model answer, and make the model answer point out
**which words in it force the reading** — that is the transferable skill.

### 5.8 "Distinguish between" — `.distinguish`

**A "distinguish between" answer is a table, not two paragraphs**, and the basis column must be
**named**. A student who writes two paragraphs with no basis column loses most of the marks even
when the content is right.

```html
<table class="distinguish">
  <caption>Three or four bases is the right length for a 3–4 mark question.</caption>
  <thead><tr><th class="basis">Basis</th><th>Delegation</th><th>Decentralisation</th></tr></thead>
  <tbody>
    <tr><th class="basis">Meaning</th><td>…</td><td>…</td></tr>
    <tr><th class="basis">Scope</th><td>…</td><td>…</td></tr>
    <tr><th class="basis">Purpose</th><td>…</td><td>…</td></tr>
  </tbody>
</table>
```

- The **basis cells are `<th>`, not `<td>`** — they are row headers, which is both correct HTML and
  what gives them the amber left rule.
- Name every basis: *Meaning, Nature, Scope, Purpose, Authority, Freedom of action, Cost,
  Suitability, Status*. Never "Point 1".
- **Three or four bases.** More is not better; it is unfinishable in the time the mark allows.
- Cells are left-aligned prose, and the two comparison columns are tinted blue and rose so the eye
  can track a column across four rows without re-reading the header. A third column (for
  authority / responsibility / accountability) is tinted green.
- Below 700px the table reflows to stacked blocks so it stays readable on a tablet.

### 5.9 Mnemonic — `.mnemonic`

Fayol's fourteen principles, the elements of the promotion mix, the steps in selection, the six
consumer rights — group them and give a hook. **But never let the mnemonic replace the
explanation**, which is why this is a thin strip rather than a box: it cannot hold enough text to
become the teaching.

```html
<div class="mnemonic">
  <span class="tag">Hook</span>
  <span class="hook"><b>S</b>afety · <b>I</b>nformed · <b>C</b>hoose · <b>H</b>eard ·
  <b>R</b>edressal · <b>E</b>ducation</span>
</div>
```

Always followed immediately by the real teaching of each item with its own example.

### 5.10 Challenge question

Every **section** of every chapter closes with one harder question, marked `.challenge` (violet, tag
prefixed with ★). Same three-step reveal.

**What makes a good challenge question in this subject.** Not "a harder recall" — a **mixed case
where two concepts collide**, and an answer that says which it is and why. A case that could be read
as either delegation or decentralisation teaches more than two clean cases. The second-best kind
quotes a student's plausible wrong reasoning and asks why it fails.

### 5.11 Info button — hand-written panel

An **ⓘ** next to a phrase, opening a panel that explains why it is worded that way.

```html
<h4>Management is a goal-oriented process
  <button class="info" aria-controls="goal-oriented-why" aria-expanded="false"
          title="Why is 'goal-oriented' listed before 'pervasive'?">i</button></h4>
…
<div class="infopanel" id="goal-oriented-why">
  <span class="tag">Why is "goal-oriented" listed before "pervasive"?</span>
  <p>…the explanation…</p>
  <div class="q">…contrasting cases, quoted style…</div>
</div>
```

- The **panel goes at the end of the slide**, never inside a grid cell — a long explanation would
  stretch one cell and wreck the grid. Link it with `aria-controls`.
- Use a stable, descriptive `id` (`goal-oriented-why`, `delegation-vs-decentralisation`).
- **Click-only.** Never bound to the arrow keys, so it cannot interfere with the reveal stepping.
- Panels auto-collapse when you leave the slide.
- Write the panel **honestly** — if the objection was partly right, say so and explain the
  distinction, rather than defending the original wording.

### 5.12 Glossary recall button — generated panel

The same ⓘ, but for a term the student **has already been taught and may have forgotten**. Business
Studies carries a heavier terminology load than any other subject in this repository, and the terms
arrive in near-identical pairs — a student meeting *accountability* six chapters after it was
defined does not remember how it differs from *responsibility*.

```html
<h2>Decentralisation<button class="info" data-term="delegation"></button> in practice</h2>
```

- The term table is `GLOSSARY` at the top of `assets/deck.js`. **Write each definition once, there,
  and never repeat it in a chapter file.**
- Each entry has `term` (the heading), `def` (the exam-ready definition, HTML allowed) and an
  optional `q` (rendered as the quiet `.q` block — usually the term it is routinely confused with).
- `deck.js` fills in `aria-controls`, `aria-expanded`, `title`, `aria-label` and the "i" glyph, and
  appends the panel to the **end of the slide** automatically. An unknown `data-term` **removes**
  the button rather than showing a dead one — so a typo fails silently, and the validator in §11
  is what catches it.
- **Do not add one on the slide that introduces the term. Do add one wherever it is *reused*** —
  including inside case studies and challenge answers.
- Distinct from the hand-written `.infopanel` above, which answers "why is this slide worded this
  way?". Both may appear on the same slide.

**Size and placement.** The button is sized in **rem, never em**, so it is the same small disc in an
`h2`, a `th` and a `.small` caption — and it still scales with the projector, because rem is tied to
the fluid root size. It is raised half its own em above the baseline so it rides at the **top right
of the word, like a ™ mark**, instead of shouldering the line apart. Never use
`vertical-align: super`: that lifts by the *parent's* font size and reintroduces the inconsistency.

**Do not stack more than about three on one heading.** A row of identical discs reads as decoration.
When a slide needs more, attach each badge to the term itself in the body — the column headers of
the `distinguish` table, the `.tag` of each box — which is where the student is looking anyway.

### 5.13 Other components

- **`.steps`** — ordered list with amber numbered circles, for sequential arguments. Use it for the
  prose version of a process whose diagram is elsewhere on the slide; do not use it *instead* of the
  diagram (§6).
- **`.chips` / `.chip`** — recap pills. `.chip.k` marks the key terms.
- **`.formula`** — centred, `--panel-2`, bordered. Used in Chapter 9 for the trading-on-equity and
  working-capital arithmetic. `.frac` renders a true stacked fraction.
- **Tables** — `--panel-2` headers in `--amber-t`; `.lbl` left-aligns a column; `.hi` (amber) and
  `.hi2` (green) highlight cells; `<caption>` sits below.

---

## 6. Structure diagrams

**Business Studies has no curves, but a great deal of it is *shape*** — a process is a sequence, an
organisation is a tree, a market has tiers. A slide that bullet-lists a process that has an order
has thrown away the thing the student needed to see. This is the subject's equivalent of "diagrams
are non-negotiable" in Economics.

### What must be drawn, never bulleted

- **Processes**, as a numbered arrow sequence: the planning process, the organising process, the
  selection process, the controlling process, the communication process, the trading procedure on a
  stock exchange, the channels of distribution.
- **Structures**: functional and divisional organisation charts, with **real named departments and
  real named product divisions** — never "Division A". Maslow's hierarchy as a labelled pyramid with
  an example incentive at each level. The four grapevine networks (single strand, gossip,
  probability, cluster) as four actual node-and-link drawings — they are genuinely visual and almost
  never taught that way.
- **Systems**: the dimensions of the business environment around the firm; the money market /
  capital market split; primary vs secondary market and how a share moves between them; the
  three-tier consumer redressal machinery with its pecuniary limits on the tiers.

**Build diagrams up in reveal steps where the construction carries the argument** — the
communication process gains its meaning when *noise* and *feedback* are added last.

### The SVG vocabulary

Inline SVG only, hand-plotted geometry. `viewBox` + `max-width:100%` so diagrams scale with the
slide. Diagram text is in **SVG user units**, so it scales with the diagram, not the root font.

| Class | Style |
|---|---|
| `.node` | neutral box — `--panel` fill, `--line` stroke |
| `.n-blue` `.n-teal` `.n-amber` `.n-rose` `.n-violet` `.n-cyan` | node in a semantic hue (§2) |
| `.n-key` | adds a 3px stroke — the node the diagram is *about*. Not a new hue. |
| `.link` | connector, `--ink-faint`, 2px. `.link.dash` = informal / implied / feedback. `.link.thick` = the main path. |
| `.l-amber` `.l-rose` `.l-cyan` `.l-blue` `.l-teal` `.l-violet` | connector in a semantic hue |
| `.numdot` + `text.numlab` | the amber step disc with the numeral knocked out, matching `.steps` |
| `text.nlab` | bold node label, `--ink-strong`, centred |
| `text.nsub` | the small second line inside a node — the example, the department name |
| `text.tier` | small uppercase amber band label down the side of a tier diagram |
| `.axis` `.grid` `.curve` `.c-*` `.dash` `.pt` | carried over from Economics; rarely needed here |

Requirements: give every `<svg>` a `role="img"` and a **descriptive** `aria-label` — for a diagram
the aria-label is the only thing a screen reader gets, so describe the structure, not the title.
Keep `<marker>` ids **unique across the whole page** — duplicate ids break arrowheads, and a deck
with eight process diagrams will have eight arrowhead markers. Prefix them with the diagram:
`arrow-planning`, `arrow-selection`.

**Arrowhead colour is the one place a literal hex is allowed.** A `<marker>`'s contents sit in
`<defs>` and cannot inherit the class of the line that references them, so the marker `<path>` takes
`fill="…"` directly. It must be an **exact token value** — `#5b6966` (`--ink-faint`), `#a17a00`
(`--amber`), `#1f7ab8` (`--blue`), `#748500` (`--teal`), `#238b84` (`--cyan`), `#c62b28` (`--rose`)
— and it must match the `.l-*` class on the line it terminates.

**Never set `text-anchor`, `fill` or `stroke` as a presentation attribute on an element that already
carries a `.nlab`, `.nsub` or `.l-*` class.** CSS beats presentation attributes, so the attribute is
silently ignored and the diagram renders wrong with no error anywhere. Move the text instead: node
labels are centred, so give a side label its own centre `x` rather than anchoring it.

### "How to read this" — `.figrow` + `.readfig`

A projected diagram is silent. A student who has never read one does not know where to look first,
and the teacher cannot repeat the instructions for every row of the class. So **every process
diagram carries a short reading guide** — never a restatement of the theory, always the mechanical
instructions for extracting information from the picture.

```html
<div class="figrow">           <!-- add .compact if a table or cards follow on the slide -->
  <figure>
    <svg viewBox="…" role="img" aria-label="…">…</svg>
    <figcaption>…the one-line takeaway…</figcaption>
  </figure>
  <aside class="readfig">
    <span class="tag">How to read this</span>
    <ol>
      <li>Where the sequence starts, and which way it runs.</li>
      <li>What the dashed arrow means.</li>
      <li>What the feedback loop is doing, and where it returns to.</li>
    </ol>
  </aside>
</div>
```

Rules:

- **Three or four items, one clause each.** Read at a glance from the back of a room.
- **Instructions, not theory.** "The dashed arrow runs backwards — that is the feedback" belongs
  here; "controlling is a continuous function" belongs in a `.box defn`.
- **Name every symbol that appears in the drawing**, because the diagram may be twenty slides after
  the notation was introduced. Attach a `data-term` ⓘ to the tag where a glossary entry covers it.
- **Panel on the right, diagram on the left.** 1.35 / 0.65 grid, collapsing to one column below
  1000px so the diagram is never squeezed.
- **Wide multi-panel diagrams (900+ viewBox units) do not take a side panel** — they would be
  crushed. Put the reading guide in the `<figcaption>`, opened with **`How to read it —`**.
- `.figrow > figure svg` is capped at `66vh` (`44vh` under `.compact`) so a tall diagram never
  pushes the slide into a scrollbar.

---

## 7. Interaction

Implemented in `assets/deck.js`. Identical to the Economics decks.

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

- **`data-section`** on a slide sets the breadcrumb in the top bar and groups it in the menu. Omit
  it and the slide inherits the previous slide's section.
- The URL hash tracks the slide number (`#29`) — deep-linkable, and survives a refresh.
- The progress bar advances fractionally *within* a slide as reveals are stepped through.
- Space/Enter on a focused info button toggles the panel instead of advancing.

### Motion

Deliberately minimal — motion is distracting when projected. Only: a 0.28s fade-and-rise on slide
change, a 0.3s fade on reveal, the slow `.ready` pulse, and 0.15s hover transitions.

---

## 8. Accessibility

Not optional — it is also what makes a deck readable from the back row.

- Contrast targets in §2, verified numerically rather than by eye.
- Every `<svg>` carries `role="img"` and a descriptive `aria-label`.
- Info buttons are real `<button>`s with `aria-controls` and a maintained `aria-expanded`.
- `:focus-visible` gives an amber outline with 2px offset.
- Colour is never the *only* carrier of meaning — every accent-coloured box also has a worded
  `.tag`, the `distinguish` table's tinted columns are also headed, and diagram elements are
  labelled in text.
- Semantic HTML: `<section>` per slide, real `<table>`/`<th>`, `<figure>`/`<figcaption>`. The
  `distinguish` table's basis cells are `<th scope="row">`.

---

## 9. The shape of a chapter

Every deck runs in this order. Deviating from it breaks the continuity that makes Part A a single
argument.

1. **Title slide** — chapter number, title, and the CBSE unit and mark band.
2. **Where we were** — a `.bridge` box re-anchoring in the previous chapter. Chapter 1 anchors in
   the student's own experience instead; Chapter 9 anchors in the end of Part A.
3. **Route map** — the sections of this chapter, as `.chips`.
4. **The sections themselves.** Each section runs: definition (`.defn`, exam-ready) → diagram if the
   idea has a shape (§6) → mini case (`.case`) → one or two questions with mark weights → the ★
   challenge that closes the section.
5. **The confusable pair slides** — a `.warn` written in the student's own wrong words
   ("students routinely write that decentralisation *is* delegation on a larger scale…"), a
   `.distinguish` table, and a case that can only be resolved one way.
6. **Recap** — `.chips`, key terms marked `.chip.k`.
7. **Exam practice** — a graded run of questions at 1, 3, 4 and 6 marks, plus at least two full case
   studies, all with the three-step reveal.
8. **Closing title slide** pointing at the next chapter, and naming what it will need from this one.

---

## 10. Numbering: CBSE units vs NCERT chapters

**The decks are numbered by CBSE unit.** In Part A the two agree. In Part B they do not:

| CBSE unit (used here) | NCERT *Business Studies Part 2*, 2026-27 reprint |
|---|---|
| 9 · Financial Management | Chapter 9 · Financial Management |
| **10 · Financial Markets** | **not in the book** — rationalised out |
| 11 · Marketing | Chapter 10 · Marketing |
| 12 · Consumer Protection | Chapter 11 · Consumer Protection |

Chapter 10 is examinable and has no textbook chapter behind it. It is built from the CBSE
curriculum document and from current market practice, and both `index.html` and `part-2.html` carry
a `.warn` saying so. See `SYLLABUS.md`.

---

## 11. Adding a chapter

1. Copy the shell of an existing chapter: `#bar`, `#progress`, `#menu`, `#stage`, the two `.nav`
   buttons, and the `deck.css` / `deck.js` links.
2. Set the `<title>` and `#bar .brand` (`CH 5 · ORGANISING`).
3. Write slides as `<section class="slide">`, marking section starts with `data-section`.
4. Follow the chapter shape in §9.
5. Use the existing components. Do not invent new ones without adding them to `deck.css` **and this
   file**.
6. Add glossary terms to the `GLOSSARY` table in `assets/deck.js` — **never in a chapter file**.
7. Add the chapter card to `part-1.html` or `part-2.html`.
8. Validate before shipping — `node tools/check.js` covers most of it:
   - HTML well-formed; every `.reveal` inside a slide; `<section class="slide">` never nested.
   - Every hand-written `.info[aria-controls]` has a matching `.infopanel` id, and every
     `.infopanel` is reachable from a button.
   - **Every `data-term` exists in `GLOSSARY`** — an unknown one silently deletes its button.
   - SVG `<marker>` ids unique across the page; every `<svg>` has `role` and `aria-label`.
   - **No absolute paths.** The site is served from `/aakanksha-teaching/`, not `/`; a leading-slash
     `href` or `src` works locally and 404s in production.
   - Every `.qcard` and `.challenge` tag carries a `.mk` mark weight.
   - Contrast re-audited if any new colour was used.
