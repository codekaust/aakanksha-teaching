# Learning Python — paper first

Fourteen daily programs transcribed from the supplied class notebook photographs. These
replace the earlier beginner lessons. Each day has only two tasks:

1. Explain the program's purpose and trace its assigned input on paper, recording every
   executed step, condition, variable change and output. Submit the notebook to the teacher.
2. After the teacher releases that day's password, compare and correct the trace, cover
   the code, and write the program independently. Running it afterwards is optional.

The course home links to all 14 days; the teacher assigns one each day. There is no calendar
lock, login, progress tracking or browser Python runner. Programs stay visible so students
can trace them. Answer keys are encrypted, including the line explanations and full traces.

## Files

- `day-01.html` … `day-14.html`: printable student pages, with fixed trace inputs.
- `programs/day-01.py` … `day-14.py`: downloadable notebook programs.
- `programs/sources.json`: maps each day to the photo numbers in the supplied ZIP's order.
- `answers/day-01.json` … `day-14.json`: encrypted answer documents, not plaintext.
- `assets/day.css`: shared monochrome styles and separate exercise/answer print layouts.
- `assets/unlock.js`: browser-only decryption; no password or answer persistence.
- `tools/build.py` and `tools/encrypt.mjs`: maintainer-only page and encrypted-key generation.

The supplied photos include worked answers and student records, so the original photos are
not published. Every student page notes changes from the handwriting. Shorter exercise
inputs make complete paper traces manageable. The notebook's algorithms are preserved;
obvious syntax/identifier inconsistencies are corrected. The selection program uses >= 90
as required by its heading, menu Exit works, and file readers catch EOFError explicitly.

## Teacher materials and updates

The private source directory is **outside this repository**. It contains `lessons.json`,
`passwords.json`, `teacher-passwords.html` and one readable answer document per program.
Back up that directory privately. Give students only the relevant day's password after
checking their notebook. Never commit or upload private materials to GitHub Pages.

To rebuild after editing the private lessons, with Python 3 and Node 18+ installed:

```sh
python3 learning-python/tools/build.py /absolute/path/to/private/source-directory
```

The builder preserves existing passwords. It runs all assigned traces in temporary
folders and checks output and binary-file contents before producing the pages. Do not
use it with untrusted lesson sources: it executes the programs. The private directory
must be outside the repository. The site itself has no dependencies or build step.

Answer keys use AES-256-GCM with random 12-byte IVs and 16-byte salts; password keys use
PBKDF2-SHA-256 with 600,000 iterations. Passwords are six randomly generated lowercase letters, unique to each
program. No plaintext answer, password, password hash or master password is published.
Unlocking needs HTTPS (GitHub Pages) or localhost. Once released, a password and the
unlocked answer can be shared; this is teacher-controlled release, not student accounts.
Reloading or choosing “Lock again” clears the displayed answer. Browser printing can save
an unlocked answer, intentionally, for offline review.

Preview by serving the repository root and opening `/learning-python/`. Publishing remains
a push to `main`, which GitHub Pages serves from the repository root.
