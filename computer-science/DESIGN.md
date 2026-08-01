# DESIGN.md — Class XII Computer Science presentation decks

The visual and interaction system for every chapter deck. Anything not described here should
not appear in a deck. If you need something new, add it to `assets/deck.css` and document it
here rather than writing inline styles in a chapter file.

**Design intent:** these are not documents to be read at a desk — they are projected in a
classroom and driven with an arrow key while a teacher talks. Every decision below follows
from that: high contrast, large type, one idea per screen, colour used to *mean* something,
and nothing on screen that the teacher did not choose to reveal.

The base system is shared with the Class XII Economics and Macroeconomics decks. **Keep the
shared part in sync** — a student meets more than one of these courses, and a component that
looks or behaves differently between them costs attention that should be going to the subject.
Everything below the `Computer Science additions` banner in `assets/deck.css` is specific to
this course and documented in **§6**.

---

## 1. Files

```
computer-science/
├── index.html                          course home, chapter cards
├── chapter-1-python-revision.html      one self-contained deck per chapter
├── chapter-2-functions.html
├── chapter-3-exception-handling.html
├── chapter-4-file-handling.html
├── chapter-5-stacks.html
├── chapter-6-networks.html
├── chapter-7-protocols.html
├── chapter-8-database-concepts.html
├── chapter-9-sql.html
├── chapter-10-python-mysql.html
├── assets/
│   ├── deck.css                        the entire design system — single source of truth
│   └── deck.js                         navigation, reveals, menu, info panels
├── tools/
│   ├── validate_deck.py                structure, ids, escaping, marker ids
│   ├── verify_outputs.py               runs every .code block, diffs against .out/.err
│   ├── fixtures/                       sample data files the Ch 4–5 programs read
│   └── sample-database.sql             the STUDENT / STREAM tables used in Ch 8–10
├── start_class.sh                      python http.server on :8113 (run under pm2 as cs-deck)
├── CLAUDE.md                           content/teaching rules
└── DESIGN.md                           this file
```

**Served by pm2** as `cs-deck`, alongside `economics-deck`. `pm2 restart cs-deck` after a
change is never needed — the decks are static files — but `pm2 logs cs-deck` shows the
request log, and `pm2 start ./start_class.sh --name cs-deck --interpreter bash` re-registers
it if the process list is ever rebuilt.

**Naming:** `chapter-<n>-<kebab-title>.html`. No build step, no bundler, no framework, no CDN.
The decks must open from a plain static file server with no network access — a classroom
projector laptop may be offline. **This rules out Prism, highlight.js and every other syntax
highlighter**; colouring is hand-written spans (§6).

**Port 8113**, so micro (8111), macro (8112) and computer science (8113) can all be served at
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

This matters more here than in the other two courses: **syntax highlighting is small text on
`--panel-2`**, the hardest background in the system. Every token colour is `-t` tier.

### Base tones

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#fdf6e3` | page background (base3) |
| `--bg-2` | `#f7f0dd` | rarely used, between base3 and base2 |
| `--panel` | `#eee8d5` | cards, boxes, chips (base2) |
| `--panel-2` | `#e4dcc4` | table headers, formula blocks, **code blocks** |
| `--line` | `#d9d0b6` | all borders and rules |
| `--ink-strong` | `#073642` | headings, `<b>`, code text, SVG `.lab` (base02) |
| `--ink` | `#52666d` | body text |
| `--ink-dim` | `#556a71` | secondary text, `.lead`, `.small` |
| `--ink-faint` | `#5b6966` | captions, figcaptions |
| `--code-dim` | `#4e5c59` | **CS only** — comments and line numbers inside a code block |

`--code-dim` exists because `--ink-faint` scores only **4.19:1** on `--panel-2` — fine for a
figcaption on `--panel`, a failure for a comment inside a code block. Comments are the one
thing students copy verbatim; they must be readable. `--code-dim` scores 5.11:1 there.

### Accents

| Meaning | Graphic tier (strokes, shape fills) | Text tier (labels, tags, code tokens) |
|---|---|---|
| yellow — highlight, the current line, key point, questions | `--amber` `#a17a00` | `--amber-t` `#755900` |
| green — examples, answers, program output | `--teal` `#748500` | `--teal-t` `#586600` |
| blue — definitions, code blocks, info panels | `--blue` `#1f7ab8` | `--blue-t` `#175f90` |
| red — warnings, common errors, tracebacks | `--rose` `#c62b28` | `--rose-t` `#b02522` |
| violet — insight, keywords | `--violet` `#6c71c4` | `--violet-t` `#5055a0` |
| cyan — links forward/back to other chapters | `--cyan` `#238b84` | `--cyan-t` `#196b65` |

**The rule:** anything a student reads as **words** uses the `-t` tier; anything they read as a
**shape** uses the plain tier. Inside SVG that means `<text>` fills take `-t` values while
`stroke=` and shape `fill=` take the plain ones. Code is words — always `-t`.

### Semantic colour coding

Colour carries meaning and must stay consistent across all chapters, so visual habits transfer.

- **blue** — definitions; the code block itself; function and builtin names
- **green/teal** — examples, answers, **program output**, string literals
- **amber** — the line currently under discussion, the highlighted cell, questions
- **violet** — insights; **keywords** (`def`, `for`, `return`, `try`)
- **red/rose** — warnings, common mistakes, **tracebacks**, numeric literals
- **cyan** — cross-chapter bridges only

The one rule a student must internalise: **blue frame = what you wrote, green frame = what the
computer printed, red frame = what went wrong.** Never break it.

### Contrast targets

- **Text:** ≥ 4.5:1 against whatever background it sits on (`--bg`, `--panel` *and*
  `--panel-2`, which is where code lives)
- **Graphics** (strokes, shape fills): ≥ 3:1 — WCAG 1.4.11

Re-audit whenever a colour is introduced. `--panel-2` is the hardest test in this course.
Measured, on `--panel-2`: violet-t 4.87, blue-t 4.98, teal-t 4.62, rose-t 4.89, amber-t 4.81,
code-dim 5.11, ink-strong 9.49 — all pass, but **teal-t at 4.62 has almost no headroom**.

That single number drives a design rule: **nothing may darken a code block's background.**
An amber wash behind the current line, the obvious way to highlight it, drops every token
below 4.5:1 — even at 6% alpha. So `.hl` makes the line **lighter** (`--bg`) instead, which
lifts every token to 5.87:1 or better. Same for anything added later: highlight by lightening,
by a left bar, or by weight — never by tinting the background.

One more consequence: `--amber` as a *graphic* scores 2.89:1 on `--panel-2`, just under the
3:1 bar. The `.hl` left bar is legal only because it sits against the lightened line
(3.67:1). Do not put amber strokes or fills directly on `--panel-2` elsewhere.

---

## 3. Typography

### Family

```css
font-family: "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

A **system font stack** — no webfonts. Webfonts mean a network request, and these decks must
work offline. Sans-serif throughout for projector legibility.

Deliberate exceptions:
- **Monospace** (`SF Mono, Cascadia Code, Consolas`) for `code`/`.mono` inline, and for every
  block in §6 — code, output, tracebacks, trace tables, SQL and `kbd`.
- **Georgia italic** for the single "i" glyph in the info button, so it reads as a
  classic information mark rather than a lowercase letter.

Inline `<code>` is for naming a thing in a sentence (`the <code>readlines()</code> method`).
A block of code — anything a student would type — always goes in a `.code` block, never in a
sentence.

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
| `.code`, `.out`, `.err` | `.82rem`, line-height 1.62 | see §6 |
| `.ready` | `1.35rem` | |
| `.box .tag` | `.7rem`, 800 weight, `.16em` tracking, uppercase | box label |

**Code is set at `.82rem`, deliberately smaller than body text.** Monospace at the same nominal
size reads much larger, and code lines must not wrap. **Keep source lines under ~55
characters** — if a line does not fit, the fix is to shorten the code (shorter names, an
intermediate variable), never to shrink the font on that one slide.

**Headings are held to a 1.2× ratio, not scaled freely.** If body text is rescaled, headings
must be recomputed to match.

### Chrome is pinned to px

The top bar (52px tall), slide menu and nav buttons (46px circles) use **fixed px** font
sizes — 11–15px. Chrome should recede; content should dominate.

### Weights and emphasis

- `750` — `h1`, `.defn .term`
- `700` — `h2`, `h3`, `h4`, `.ready`, `th`, `.err .etype`
- `800` — `.tag`, `.mgroup`, step numerals
- `650` — `b`, `strong` (`--ink-strong`), code keywords and builtins
- `<em>` is **restyled**: not italic, but amber and semi-bold — italics are hard to read
  projected. Use it for the first appearance of a technical term.
- **Comments are not italic** either, only dimmed — italic monospace projects badly.

---

## 4. Layout

```css
--maxw: 1240px;                    /* measure — line length cap */
.slide { padding: 30px 46px 60px } /* px, not rem, so padding doesn't inflate with text */
```

- `#stage` is a fixed, scrollable region below the 52px bar. Slides that exceed the viewport
  scroll rather than clip.
- `.slide.on` is a **vertically centred flex column**.
- Only one slide is in the DOM-visible state at a time (`display:none` otherwise).

### Grid helpers

| Class | Columns | Use |
|---|---|---|
| `.grid2` | `1fr 1fr` | two parallel ideas — text vs binary, local vs global |
| `.grid3` | `1fr 1fr 1fr` | three short cards |
| `.split` | `1.05fr .95fr` | diagram on the left, explanation on the right |
| `.cosplit` | `1fr 1fr` | **code on the left, its output or trace on the right**, tops aligned |

All collapse to a single column below 900px. `.cosplit` is the default layout for this course —
prefer it to `.split` whenever the right-hand side is output rather than prose.

`.narrow` holds a box to a 44rem measure, centres it and sets its own text left. It exists for
one case: a `.bridge` on a closing `.title-slide`, where the slide centres everything by
default. Do not use it to nudge spacing elsewhere.

`--radius: 14px` on every box, card, code block and panel. `.chip` uses `999px`.

---

## 5. Shared components

### Content boxes

All share `.box` (14px radius, `--panel` background, **5px left border**, uppercase `.tag`).

| Class | Border | Purpose |
|---|---|---|
| `.defn` | blue | **Definitions.** Exam-ready wording. `.term` for the term itself. |
| `.eg` | green | **Examples.** Concrete, worked. |
| `.insight` | violet | The "why this matters" / the punchline. |
| `.warn` | red | Common errors, traps, "students routinely write…". |
| `.bridge` | cyan | Forward/back links to other chapters. |
| `.note` | grey | Neutral aside — including "good Python but not board Python". |

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

- `.qcard` — amber, always visible. `.ready` — amber dashed, pulsing; `.ephemeral` removes it
  once the answer appears. `.answer` — green. `.challenge` — violet, ★, one per section.
- `.reveal` elements are hidden until stepped to; DOM order is reveal order.
- **Never put a layout class on a `.reveal`.** `.reveal.shown` sets `display:block`, which
  overrides the `display:grid` of `.cosplit`, `.grid2`, `.grid3` and `.split` and collapses
  the columns. Wrap instead: `<div class="reveal"><div class="cosplit">…</div></div>`.
  Box classes (`.eg`, `.warn`, `.note`, `.qcard`, `figure`, `table`) are block-level anyway
  and combine with `.reveal` safely.

**"Predict the output" is the standard form of the question in this course**: `.qcard` holds
the code, and the `.out` block is wrapped in `.reveal` so it appears only after the class has
committed to an answer. See §6.

### Info button

An **ⓘ** next to a phrase, opening a panel that explains why it is worded that way.

```html
<h4>Open the file in <code>"rb"</code> mode
  <button class="info" aria-controls="why-binary-mode" aria-expanded="false"
          title="Why binary and not text mode for pickle?">i</button></h4>
…
<div class="infopanel" id="why-binary-mode">
  <span class="tag">Why binary and not text mode for pickle?</span>
  <p>…</p>
  <div class="q">…contrasting cases, quoted style…</div>
</div>
```

- The **panel goes at the end of the slide**, never inside a grid cell or a `.code` block.
- Use a stable, descriptive `id` (`why-binary-mode`, `mutable-default-arg`).
- **Click-only.** Never bound to the arrow keys.
- Panels auto-collapse when you leave the slide.

### Other shared components

- **`.formula`** — centred, `--panel-2`, bordered; `.frac` for stacked fractions. Rare here.
- **`.steps`** — ordered list with amber numbered circles, for algorithms in words.
- **`.chips` / `.chip`** — recap pills. `.chip.k` marks the key terms.
- **Tables** — `--panel-2` headers in `--amber-t`; `.lbl` left-aligns; `.hi` (amber) and
  `.hi2` (green) highlight cells; `<caption>` below.

---

## 6. Code, output and traces — the components specific to this course

These live below the `Computer Science additions` banner in `assets/deck.css`.

### `.code` — a program

```html
<pre class="code"><span class="tag">stack.py</span><span class="k">def</span> <span class="b">push</span>(st, item):
    st.append(item)          <span class="c"># list end == stack top</span>
<span class="hl"><span class="k">def</span> <span class="b">pop</span>(st):</span>
    <span class="k">if</span> st == []:
        <span class="k">return</span> <span class="s">"Underflow"</span>
    <span class="k">return</span> st.pop()</pre>
```

**The first code character follows `</span>` of the `.tag` immediately — no newline.**
`.tag` is `display:block`, so it already ends its own line; a newline after it is a
*preserved* line feed inside `white-space: pre` and renders as a blank line under the label.
The same rule applies to the `.tag` inside `.out` and `.err`. Symmetrically, a block must not
end with a newline before `</pre>` / `</div>` unless the program really printed a blank line
there — as `print(s[6:2])` does.

- `<pre class="code">`, blue left border, `--panel-2`, horizontally scrollable, never wrapped.
- `.tag` names the file or the point being made (`stack.py`, `WRONG`, `FIXED`).
- **Syntax colours are hand-written spans** — there is no highlighter and there must not be:

  | Class | Token | Colour |
  |---|---|---|
  | `.k` | keyword — `def`, `for`, `if`, `return`, `try`, `import` | `--violet-t`, 650 |
  | `.b` | builtin or function name — `print`, `open`, `len`, the name being defined | `--blue-t`, 650 |
  | `.s` | string literal, quotes included | `--teal-t` |
  | `.n` | numeric literal | `--rose-t` |
  | `.c` | comment, `#` included | `--code-dim` |
  | `.o` | operator, when it needs emphasis | `--ink-strong` |

  Colour **fewer** tokens rather than more. A rainbow line is unreadable projected; the point
  of colour here is to make `def`/`return` and string boundaries pop, not to imitate an IDE.
- `.hl` on a line **lightens it to `--bg`** and gives it an amber left bar — the line currently
  being discussed. It lightens rather than tints for the contrast reason in §2. Wrap `.hl`
  around whole lines only, **including the line's leading indentation**, and put it on its own
  source line exactly where the code line sits. At most two per block.

  `.hl` is `display:inline-block; min-width:100%` — deliberately *not* `display:block`. A
  block-level box inside the `<pre>`'s inline flow splits the block into anonymous boxes, and
  the preserved newline ending the one before it renders as a blank line, so every highlight
  would punch a gap into the listing unless the author glued the markup up with no newlines
  around it. `inline-block` keeps it in the inline flow, so the source reads as the program
  reads.
- `.ln` renders a right-aligned line number. Use line numbers only when the slide refers to
  lines by number (error messages, trace tables); otherwise omit them — they are noise.
- Because `<pre>` preserves whitespace, **the markup's own indentation is the code's
  indentation**. Never re-indent a `.code` block to match the surrounding HTML — in Python
  that changes the program.

### `.out` — what the computer printed

```html
<div class="reveal out"><span class="tag">Output</span>5
['a', 'b']
None</div>
```

Green left border. Contains the **real** output, exactly — repr quoting inside containers,
`None` for a function with no `return`, blank lines where they occur. `.cur` renders an
underlined cursor after an `input()` prompt so a waiting program reads as waiting.

**Wrap it in `.reveal`** so the class predicts before it appears. This is the default.

### `.err` — a traceback

```html
<div class="reveal err"><span class="tag">Traceback</span>Traceback (most recent call last):
  File "main.py", line 3, in &lt;module&gt;
    n = int(s)
<span class="etype">ValueError</span>: invalid literal for int() with base 10: 'abc'</div>
```

Red left border. The exception type is `.etype`. Use the **real** message text — students are
asked to name the exception in the paper, and a paraphrased message teaches the wrong name.
Remember to escape `<` in `<module>`.

### `table.trace` — a dry run

One row per iteration, one column per variable, plus a column for the output so far.

```html
<table class="trace">
  <tr><th>Pass</th><th>i</th><th>total</th><th>printed</th></tr>
  <tr><td>1</td><td>0</td><td class="chg">0</td><td>—</td></tr>
  <tr class="now"><td>2</td><td class="chg">1</td><td class="chg">1</td><td>—</td></tr>
</table>
```

- `tr.now` — amber — the pass being executed right now.
- `td.chg` — green — a value that *changed* on this pass. Marking only the changes is what
  makes the trace teach; a table of unmarked numbers does not.
- Reveal the table **row by row** (each `<tr>` in a `.reveal` wrapper) for loops the class
  should be predicting.

### `kbd`

`<kbd>Ctrl</kbd>` renders a keycap. For interpreter and shell interaction only.

### SQL

SQL uses the same three components: the table *before* as a normal `<table>`, the query in a
`.code` block (keywords in `.k`, uppercase), and the result set as a `<table>` inside a
`.reveal`. Mark the primary key in the header cell. Use **one 5–8 row sample database across
the whole unit** so students read the query rather than re-reading the data.

---

## 7. Diagrams

- **Inline SVG only.** Hand-drawn geometry, no chart library, no image files.
- **`viewBox` + `max-width:100%`** so diagrams scale with the slide.
- Diagram text is in **SVG user units**: `svg text` 15px, `svg text.lab` 16px bold.

| Class | Style |
|---|---|
| `.axis` | `#75837f`, 2px |
| `.grid` | `#e4dcc4`, 1px — decorative, deliberately faint |
| `.curve` | 3px, round caps, no fill — links, edges, arrows |
| `.c-amber` … `.c-cyan` | stroke colours (graphic tier) |
| `.dash` | `6 5` dash |
| `svg text.lab` | `--ink-strong`, bold — named labels |
| `.pt` | amber dot with a `--bg` halo stroke |

The three recurring diagram families:

- **Network topologies and devices (Unit 2)** — real geometry: a bus is one spine with drops,
  a star has a central switch, a mesh has every pair joined. Label every node and every
  device. Number the arrows in a client–server or DNS sequence and reveal them one at a time.
- **Memory / reference diagrams (Unit 1)** — names in `--panel` boxes on the left, objects in
  bordered boxes on the right, arrows between. Aliasing is two arrows into one object;
  rebinding is an arrow that moves. Build in reveals.
- **Stack diagrams (Unit 1)** — a vertical column of cells, `top` marked with an amber arrow,
  push and pop animated across successive reveals rather than shown as a finished picture.

Requirements: label everything; give every `<svg>` a `role="img"` and a descriptive
`aria-label`; keep `<marker>` ids **unique across the whole page** — network diagrams are
mostly arrowheads and duplicate ids silently break them.

---

## 8. Interaction

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
- The URL hash tracks the slide number (`#29`) — deep-linkable, and survives a refresh.
- The progress bar advances fractionally *within* a slide as reveals are stepped through.
- Space/Enter on a focused info button toggles the panel instead of advancing.

### Motion

Deliberately minimal — motion is distracting when projected. Only: a 0.28s fade-and-rise on
slide change, a 0.3s fade on reveal, the slow `.ready` pulse, and 0.15s hover transitions.

---

## 9. Accessibility

- Contrast targets in §2, verified numerically rather than by eye — including every syntax
  token against `--panel-2`.
- Every `<svg>` carries `role="img"` and a descriptive `aria-label`.
- Info buttons are real `<button>`s with `aria-controls` and a maintained `aria-expanded`.
- `:focus-visible` gives an amber outline with 2px offset.
- Colour is never the *only* carrier of meaning — every code, output and error block also has
  a worded `.tag`, so "green frame = output" is reinforced by the word OUTPUT.
- Code blocks are horizontally scrollable, so a long line degrades rather than clipping.
- Semantic HTML: `<section>` per slide, `<pre>` for code, real `<table>`/`<th>`.

---

## 10. Adding a chapter

1. Copy the shell of an existing chapter: `#bar`, `#progress`, `#menu`, `#stage`,
   the two `.nav` buttons, and the `deck.css` / `deck.js` links.
2. Set the `<title>` and `#bar .brand` (`CH 4 · FILE HANDLING`).
3. Write slides as `<section class="slide">`, marking section starts with `data-section`.
4. Open with a **title slide**, then a **route map**; close with a **recap**, a set of
   **exam-style questions** (including at least one predict-the-output and one write-the-
   program), and a **title slide pointing to the next chapter**.
5. Use the existing components. Do not invent new ones without adding them to `deck.css` and
   this file — and if a component belongs in the shared part, add it to the Economics and
   Macroeconomics stylesheets too.
6. Add the chapter card to `index.html` and remove its `.soon` class.
7. Validate before shipping: HTML well-formed; `<` escaped inside `.code`/`.err`; indentation
   inside `<pre>` is the real Python indentation; **every `.out` block checked against actual
   execution**; info buttons paired to panels; SVG marker ids unique; contrast re-audited if
   any new colour was used.

   Do the output check **mechanically**, not by eye — the two scripts in `tools/` exist for
   exactly this:

   ```
   python3 tools/validate_deck.py  chapter-N-name.html
   python3 tools/verify_outputs.py chapter-N-name.html tools/fixtures
   ```

   `verify_outputs.py` strips the syntax `<span>`s and `.ln` line numbers out of each `.code`
   block, runs it, and diffs the real stdout and stderr against the `.out` / `.err` blocks
   that follow. Trailing spaces from `end=" "`, the two-space tail of a `.replace()` result
   and a dropped `, in <module>` in a traceback are invisible on screen, are exactly what a
   hand check misses, and are exactly what the paper marks. It has caught a real error in
   every chapter it has been run on.

   Its skip rules are also its contract: it refuses to check a block only when the block uses
   `input()`, is tagged "one possible run" (the `random` module), or needs a MySQL server.
   **Anything else that it cannot run is a fragment, and a fragment violates the
   complete-program rule in CLAUDE.md** — fix the deck, not the script.
