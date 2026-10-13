# Learning Python — day-by-day course

A set of web pages, **one per day**, that teach the basics of Python to an absolute beginner.
A student reads each day's page on their own, types and runs every example, and by the end of
the day writes and tests a working program of their own.

Plain static HTML, like the rest of this repo: no build step and no dependencies.

```
learning-python/
├── index.html        course home, one card per day
├── day-01.html       Day 1, one self-contained page per day (day-02.html, …)
└── assets/day.css    all styling for this course
```

## The rule: always hands-on

**Every day must be hands-on.** In this course, hands-on means that we **slowly help the
student build a program they interact with**, and they learn Python by building it. It does
not mean reading about Python and then doing some exercises.

In practice:

- **Each concept appears in code the student types and runs.** No concept is just described.
  Every one comes with a "Try this" block and its expected output.
- **The student predicts before running.** Ask "what will this print?" first, then let them run it.
- **Each day ends with one program the student interacts with.** It takes input, does
  something with it and responds, and it uses *every* concept from that day.
- **The program grows in small steps.** Build up from pieces they have already run, so no
  step is a leap.
- **The student writes it and tests it.** They run it with several inputs, including edge
  cases, and check the results by hand.

## Teaching rules

1. **Never give the solution code for the day's main program.** Teach the concepts, show
   small examples, give the requirements, and let the student work out how to combine them.
2. **Hints, not answers.** When the student is stuck, ask a question that leads them there.
   For example: *"If you scored 45 out of 50, how would you calculate your percentage on paper?
   How can Python do the same calculation?"* Hints go in a ladder, each one opened separately
   (`<details class="hint">`).
3. **Definition → example → question.** Each concept gets a clear definition, then code to
   run, then a question with the answer hidden behind a reveal (`<details class="reveal">`).
4. **Understanding over speed.** The student shouldn't move to the next day until they
   understand every concept.

## Shape of a day page

| Part | Contents |
| --- | --- |
| Header | Day number, date, duration, difficulty, the program being built, the goal for the day |
| Part 1 · Concepts | 3–5 concepts, each with a definition, a "Try this" block, its output, and a question to reveal |
| Part 2 · Main program | Requirements, a sample run, rules, a hint ladder, a test table, a bonus challenge |

## Planned direction (30 days)

The course is aimed mainly at the Python part of CBSE Class XII Computer Science (083), and
covers the fundamentals that come before it. Pages are written **one day at a time**, so
this plan is a guide, not a commitment:

| Days | Focus |
| --- | --- |
| 1–3 | Syntax, variables, types, operators, input, strings |
| 4–6 | Conditions, comparisons, Boolean logic, nested conditions |
| 7–9 | `for` loops, `while` loops, nested loops |
| 10–13 | Lists, tuples, sets, dictionaries |
| 14–17 | Functions, parameters, return values, scope, modules |
| 18–20 | String manipulation, algorithms, debugging |
| 21–24 | Exception handling, text, CSV and binary files |
| 25–26 | Stacks using lists, revision |
| 27–29 | CBSE-style programming questions and a practical project |
| 30 | Final assessment and an independent coding challenge |

SQL, Python–MySQL connectivity and computer networks aren't part of this course. They're
taught in `../computer-science/`.

## Style

- All styling lives in `assets/day.css`. Don't put inline styles in a day page, and don't
  hard-code a colour that isn't a token there.
- This course is **black on white**: no colour, only shades of grey. (The other courses use
  Solarized; this one doesn't.)
- These are **reading pages, not slide decks**: one long scrolling page per day, with no
  JavaScript. Reveals and hints use native `<details>`, which also print expanded.
- Keep every path relative (the site is served from `/aakanksha-teaching/`).
- Before publishing, run every code example and check the output shown on the page matches.

## Preview

Published with the rest of the site on GitHub Pages. To preview locally, serve the repo root
(`python3 -m http.server 8000`) and open `/learning-python/`.
