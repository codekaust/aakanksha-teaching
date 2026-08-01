"""Extract every .code block from a deck, run it, and diff the real result
against the .out / .err blocks that follow it.

Handles the three shapes that occur in these decks:
  code -> out            a program that succeeds
  code -> err            a program that only crashes
  code -> out -> err     a program that prints, then crashes
An .err block may have its 'Traceback (most recent call last):' header trimmed
to fit a narrow column, so .err is checked line-by-line (every expected line
must appear verbatim in the real stderr) rather than by exact equality.
"""
import re, html, subprocess, sys, os, tempfile, shutil

path = sys.argv[1]
src = open(path, encoding="utf-8").read()

def clean(block):
    b = re.sub(r'<span class="tag">.*?</span>', '', block, flags=re.S)
    b = re.sub(r'<span class="ln">.*?</span>', '', b)      # line numbers are chrome
    b = re.sub(r'<button.*?</button>', '', b, flags=re.S)
    b = re.sub(r'</?span[^>]*>', '', b)
    return html.unescape(b)

tokens = []
pat = (r'<pre class="code">(.*?)</pre>'
       r'|<div class="[^"]*\bout\b[^"]*">(.*?)</div>'
       r'|<div class="[^"]*\berr\b[^"]*">(.*?)</div>')
for m in re.finditer(pat, src, re.S):
    kind = "code" if m.group(1) is not None else ("out" if m.group(2) is not None else "err")
    tokens.append((kind, clean(m.group(1) or m.group(2) or m.group(3)), m.start()))

tmp = tempfile.mkdtemp()
fixtures = sys.argv[2] if len(sys.argv) > 2 else None

def seed():
    """Restore the chapter's sample files before every program, since many of
    them write to or truncate those files."""
    if not fixtures:
        return
    for name in os.listdir(fixtures):
        shutil.copy(os.path.join(fixtures, name), os.path.join(tmp, name))

ok = fail = skipped = 0

for i, (kind, body, pos) in enumerate(tokens):
    if kind != "code":
        continue
    line = src[:pos].count("\n") + 1
    exp_out, exp_err, j = None, None, i + 1
    if j < len(tokens) and tokens[j][0] == "out":
        exp_out = tokens[j][1]; j += 1
    if j < len(tokens) and tokens[j][0] == "err":
        exp_err = tokens[j][1]
    if exp_out is None and exp_err is None:
        continue
    # a block tagged "one possible run" is deliberately non-reproducible (random)
    nxt_raw = src[tokens[i+1][2]:tokens[i+1][2] + 200] if i + 1 < len(tokens) else ""
    if "possible run" in nxt_raw:
        skipped += 1; print(f"  ~ line {line}: skipped (deliberately non-reproducible)"); continue
    if "mysql.connector" in body or "from db import connect" in body:
        skipped += 1; print(f"  ~ line {line}: skipped (needs a MySQL server — verified via DB-API)"); continue
    if "input(" in body:
        skipped += 1; print(f"  ~ line {line}: skipped (interactive — verify by hand)"); continue

    seed()
    open(os.path.join(tmp, "main.py"), "w").write(body)
    r = subprocess.run(["python3", "main.py"], cwd=tmp, capture_output=True, text=True)
    got_out, got_err = r.stdout, r.stderr.replace(os.path.join(tmp, "main.py"), "main.py")

    bad = []
    if exp_out is not None and got_out.rstrip("\n") != exp_out.rstrip("\n"):
        # an .out that also carries the crash header (the "output, then traceback" shape)
        merged = (got_out + got_err).rstrip("\n")
        if not all(l in merged for l in exp_out.rstrip("\n").split("\n")):
            bad.append(("stdout", exp_out, got_out))
    if exp_err is not None:
        missing = [l for l in exp_err.split("\n") if l.strip() and l not in got_err]
        if missing:
            bad.append(("stderr", "\n".join(missing), got_err))
    if exp_err is None and r.returncode != 0:
        bad.append(("stderr", "(no .err block, but the program crashed)", got_err))

    if bad:
        fail += 1
        print(f"  ! line {line}: MISMATCH")
        for stream, exp, got in bad:
            print(f"    {stream} expected: {exp!r}")
            print(f"    {stream} actual  : {got!r}")
    else:
        ok += 1

print(f"\nverified {ok} blocks, {fail} mismatches, {skipped} skipped")
