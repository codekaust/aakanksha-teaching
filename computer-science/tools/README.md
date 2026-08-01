# tools — deck validation

Two scripts, run before shipping any chapter. Both are described in `DESIGN.md` §10.

    python3 tools/validate_deck.py chapter-N-name.html
    python3 tools/verify_outputs.py chapter-N-name.html [fixtures-dir]

**validate_deck.py** — HTML well-formedness, duplicate `id`s, info buttons paired to
panels, unescaped `<` inside code/output blocks, SVG marker ids, slide and section counts.

**verify_outputs.py** — extracts every `.code` block, strips the syntax `<span>`s and the
`.ln` line numbers, runs it, and diffs the real stdout/stderr against the `.out` / `.err`
blocks that follow it. Pass `tools/fixtures` **only for Chapters 4 and 5**, whose programs read data files; the
fixtures are re-copied before every program, since many of them overwrite those files.

Do *not* pass fixtures to the other chapters. Chapter 3 §3.2 deliberately opens a file that
does not exist in order to raise `FileNotFoundError` — seeding `marks.txt` makes that demo
succeed and the check then correctly reports a mismatch.

Blocks are skipped when they are deliberately unrunnable here: programs using `input()`,
blocks whose `.out` tag says "one possible run" (the `random` module), and the Chapter 10
programs that need a MySQL server.

`sample-database.sql` builds the STUDENT / STREAM tables used across Chapters 8–10. Load it
into sqlite3 or MySQL to re-check any query in those decks.
