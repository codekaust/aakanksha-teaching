# Class XII Teaching Decks

Classroom presentation decks (plain HTML, no build step) for Class XII Economics, Business
Studies and Computer Science.

| Subject | Folder | Chapters |
| --- | --- | --- |
| Introductory Microeconomics | [`microeconomics/`](microeconomics/) | 5 |
| Introductory Macroeconomics | [`macro-economics/`](macro-economics/) | 6 |
| Computer Science (CBSE 083) | [`computer-science/`](computer-science/) | 10 |
| Business Studies (CBSE 054) | [`business-studies/`](business-studies/) | 12, in two books |

Business Studies is published as two books — [Part 1 · Principles and Functions of
Management](business-studies/part-1.html) (Units 1–8) and [Part 2 · Business Finance and
Marketing](business-studies/part-2.html) (Units 9–12) — with
[`business-studies/index.html`](business-studies/index.html) offering both.

## Published site

The site is served by GitHub Pages from the `main` branch, repository root:

<https://codekaust.github.io/aakanksha-teaching/>

Every path in the decks is relative, so the site works both at the domain root and under a
project subpath. Nothing needs rebuilding — pushing to `main` publishes.

## Running a deck locally

Each subject folder has a `start_class.sh` that serves that folder over plain HTTP:

```bash
cd microeconomics && ./start_class.sh   # port 8111
cd macro-economics && ./start_class.sh  # port 8112
cd computer-science && ./start_class.sh # port 8113
cd business-studies && ./start_class.sh # port 8114
```

To preview the whole site exactly as GitHub Pages serves it, serve the repository root
instead:

```bash
python3 -m http.server 8000
```

## In class

`→` / `Space` next · `←` back · `m` slide menu · `f` fullscreen · `Home` / `End` first / last.
Questions reveal in three steps (question → "ready?" → answer). The `ⓘ` buttons are
click-only so they never interfere with arrow-key stepping.

## Authoring

Per-subject `CLAUDE.md` and `DESIGN.md` files define the teaching approach and the visual
system. All styling belongs in that subject's `assets/deck.css` — never inline styles into a
chapter file. `assets/home.css` at the root styles only the landing page.
