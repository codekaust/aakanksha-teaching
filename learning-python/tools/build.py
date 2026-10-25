"""Build public daily pages from private lesson sources. Never write keys to the site.
Usage: python3 learning-python/tools/build.py /absolute/private/source/directory
The directory contains lessons.json and receives passwords.json, teacher-passwords.html,
and decrypted answer documents. Keep it outside the repository and back it up.
"""
import ast
import contextlib
import html
import io
import json
import os
from pathlib import Path
import pickle
import secrets
import string
import subprocess
import sys
import tempfile
import types

ROOT = Path(__file__).resolve().parents[2]
COURSE = ROOT / 'learning-python'
PRIVATE = Path(sys.argv[1]).resolve()
if PRIVATE == ROOT or ROOT in PRIVATE.parents:
    raise SystemExit('Private sources and passwords must be outside the repository.')
PRIVATE.mkdir(parents=True, exist_ok=True)
PRIVATE.chmod(0o700)
lessons = json.loads((PRIVATE / 'lessons.json').read_text())
key_path = PRIVATE / 'passwords.json'
passwords = json.loads(key_path.read_text()) if key_path.exists() else {}
e = lambda value: html.escape(str(value), quote=True)

def snapshot(frame):
    result = {}
    for name, value in frame.f_locals.items():
        if name.startswith('__') or callable(value) or isinstance(value, types.ModuleType):
            continue
        if isinstance(value, io.IOBase):
            result[name] = f'{Path(value.name).name} ({value.mode}, {"closed" if value.closed else "open"})'
        else:
            result[name] = repr(value)
    return result

def file_snapshot():
    result = {}
    for path in sorted(Path('.').iterdir()):
        if path.suffix == '.txt':
            result[path.name] = repr(path.read_text())
        elif path.suffix == '.dat':
            records = []
            with path.open('rb') as handle:
                while True:
                    try:
                        records.append(pickle.load(handle))
                    except EOFError:
                        break
            result[path.name] = repr(records)
    return result

def execute(lesson, run):
    filename = f'day-{lesson["day"]:02}.py'
    code = lesson['code']
    pending, scopes, rows = {}, {}, []
    checks = {node.lineno: ast.Expression(node.test) for node in ast.walk(ast.parse(code)) if isinstance(node, (ast.If, ast.While))}
    counter = 0
    previous_files = {}
    output = io.StringIO()
    inputs = iter(run['inputs'])
    consumed = []
    def finish(frame, suffix=''):
        nonlocal previous_files
        item = pending.pop(id(frame), None)
        if not item:
            return
        line, before, action, output_start = item
        after = snapshot(frame)
        changes = [f'{name}: {before.get(name, "—")} → {value}' for name, value in after.items() if before.get(name) != value]
        # Flush our own teaching files so the trace can show each written record.
        for value in frame.f_locals.values():
            if isinstance(value, io.IOBase) and not value.closed and value.writable():
                value.flush()
        if code.splitlines()[line - 1].lstrip().startswith("print("):
            printed = output.getvalue()[output_start:]
            if printed:
                changes.append(f"Prints: {printed!r}")
        files = file_snapshot()
        changes.extend(f'File {name}: {previous_files.get(name, "not created")} → {value}' for name, value in files.items() if previous_files.get(name) != value)
        previous_files = files
        rows.append((str(line), scopes[id(frame)], action + suffix, changes))
    def trace(frame, event, arg):
        nonlocal counter
        if frame.f_code.co_filename != filename:
            return None
        if event == 'call':
            counter += 1
            scopes[id(frame)] = 'Main program' if frame.f_code.co_name == '<module>' else f'{frame.f_code.co_name} · call {counter - 1}'
            if frame.f_code.co_name != '<module>':
                rows.append((str(frame.f_lineno), scopes[id(frame)], 'Enter this function. These are its starting parameter values.', [f'{k} = {v}' for k, v in snapshot(frame).items()]))
        elif event == 'line':
            finish(frame)
            line = frame.f_lineno
            action = lesson['guides'].get(str(line), code.splitlines()[line - 1].strip())
            if line in checks:
                value = eval(compile(checks[line], filename, 'eval'), frame.f_globals, frame.f_locals)
                action += f' Result: {value}.'
            pending[id(frame)] = (line, snapshot(frame), action, len(output.getvalue()))
        elif event == 'exception':
            finish(frame, f' Raises {arg[0].__name__}.')
        elif event == 'return':
            finish(frame)
            if frame.f_code.co_name != '<module>':
                rows.append((str(frame.f_lineno), scopes[id(frame)], f'Return {arg!r} to the waiting caller.', []))
        return trace
    def read_input(prompt=''):
        try:
            value = next(inputs)
        except StopIteration:
            raise AssertionError(f'{filename}: more input requested than supplied')
        consumed.append(value)
        frame = sys._getframe(1)
        rows.append((str(frame.f_lineno), scopes[id(frame)], f'Input supplied for “{prompt}”: {value!r}.', []))
        return value
    previous_dir = os.getcwd()
    with tempfile.TemporaryDirectory() as directory:
        os.chdir(directory)
        try:
            with contextlib.redirect_stdout(output):
                sys.settrace(trace)
                try:
                    exec(compile(code, filename, 'exec'), {'input': read_input, '__name__': '__main__'})
                finally:
                    sys.settrace(None)
            final_files = file_snapshot()
        finally:
            os.chdir(previous_dir)
    assert consumed == run['inputs'], (filename, 'Unused input')
    actual = output.getvalue()
    if run['expected'] is not None:
        assert actual == run['expected'], (filename, actual, run['expected'])
    if 'files' in run:
        assert final_files == run['files'], (filename, final_files)
    return rows, actual, final_files

def table(headers, rows):
    return '<div class="table-wrap"><table><thead><tr>' + ''.join(f'<th scope="col">{e(h)}</th>' for h in headers) + '</tr></thead><tbody>' + ''.join('<tr>'+''.join(f'<td>{cell}</td>' for cell in row)+'</tr>' for row in rows) + '</tbody></table></div>'

def page(title, body, script=False):
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)} · Learning Python</title><link rel="stylesheet" href="assets/day.css">
{('<script src="assets/unlock.js" defer></script>' if script else '')}</head>
<body><a class="skip" href="#main">Skip to content</a><div class="page"><nav aria-label="Course"><a href="../index.html">All subjects</a><span>/</span><a href="index.html">Learning Python</a></nav><main id="main">{body}</main><footer>One program. Trace it on paper. Then write it yourself.</footer></div></body></html>'''

cards = []
manifest = []
for lesson in lessons:
    day = lesson['day']; slug = f'day-{day:02}'
    key = passwords.setdefault(slug, '-'.join(''.join(secrets.choice(string.ascii_lowercase+string.digits) for _ in range(4)) for _ in range(4)))
    # Save credentials before producing encrypted output so an interrupted build cannot lose them.
    key_path.write_text(json.dumps(passwords, indent=2)+'\n'); key_path.chmod(0o600)
    code = lesson['code']; lines = code.splitlines()
    assert all(str(i) in lesson['guides'] for i,line in enumerate(lines,1) if line.strip()), slug
    (COURSE/'programs'/f'{slug}.py').write_text(code)
    guide = table(['Line', 'What it does'], [(f'<a href="#line-{i}">{i}</a>',e(lesson['guides'][str(i)])) for i,line in enumerate(lines,1) if line.strip()])
    answer = f'<h2 id="answer-title" tabindex="-1">Day {day:02} · Answer key</h2><p>{e(lesson["purpose"])}</p><h3>Read each line</h3>{guide}'
    exercises = ''
    for number, run in enumerate(lesson['runs'],1):
        values = '\n'.join(run['inputs'])
        exercises += f'<article class="exercise"><h3>{number}. {e(run["label"])}</h3><p>{e(run["task"])}</p>'
        exercises += f'<p class="label">Inputs, one per prompt, in this order</p><pre>{e(values)}</pre>' if values else '<p class="muted">No keyboard input. Use the values already in the program.</p>'
        exercises += '</article>'
        rows, output, files = execute(lesson,run)
        trace = table(['Step','Line / scope','What happens','Changes / output'], [(str(i),f'{line}<br><span class="muted">{e(scope)}</span>',e(action),'<br>'.join(f'<code>{e(c)}</code>' for c in changes) if changes else 'No value changes.') for i,(line,scope,action,changes) in enumerate(rows,1)])
        answer += f'<section class="run"><h3>Trace {number} · {e(run["label"])}</h3><p>Follow the rows from top to bottom. Each row records a completed step. A function call enters a new scope; its caller finishes after the function returns. <code>—</code> means the variable did not exist yet. Only changed values are listed; all others stay the same.</p>{trace}<h4>Exact printed output</h4><p class="muted">Input prompts are shown in the trace above. This box contains the print statements’ output.</p><pre>{e(output)}</pre>'
        if files:
            answer += '<h4>Final file contents</h4>'+''.join(f'<p class="label">{e(name)}</p><pre>{e(value)}</pre>' for name,value in files.items())
        answer += '</section>'
    answer += '<h3>Before you write the program</h3><p>Correct your paper trace. Explain each correction in one sentence. Then cover the program and write it yourself. Compare only after you finish.</p>'
    encrypted = subprocess.run(['node',str(COURSE/'tools'/'encrypt.mjs')], input=json.dumps({'password':key,'html':answer}), capture_output=True,text=True,check=True).stdout
    (COURSE/'answers'/f'{slug}.json').write_text(encrypted)
    private_document = page(f'Day {day:02} answer key',answer).replace('href="assets/day.css"',f'href="{COURSE}/assets/day.css"')
    (PRIVATE/f'{slug}-answer.html').write_text(private_document)
    code_html = '<pre class="program"><code>'+''.join(f'<span class="code-line" id="line-{i}"><span class="line-number" aria-hidden="true">{i:02}</span>{e(line)}\n</span>' for i,line in enumerate(lines,1))+'</code></pre>'
    previous = f'<a href="day-{day-1:02}.html">← Day {day-1:02}</a>' if day > 1 else '<a href="index.html">← All programs</a>'
    next_link = f'<a href="day-{day+1:02}.html">Day {day+1:02} →</a>' if day < len(lessons) else '<a href="index.html">All programs →</a>'
    body = f'''<header><p class="eyebrow">DAY {day:02} / {len(lessons)} · PAPER FIRST</p><h1>{e(lesson['title'])}</h1><p class="lead">{e(lesson['purpose'])}</p></header>
<section class="routine"><h2>Two things to do today</h2><ol><li><strong>Run it in your head, on paper.</strong> In your notebook, write what the program does. Trace the assigned run below, one executed line at a time. Write every variable change, condition result and output. Repeat the steps for every loop iteration or function call. Show your teacher.</li><li><strong>Write the program yourself.</strong> After your teacher gives you the password, check and correct your trace. Then cover the code and write it from memory. You may run it after you finish.</li></ol></section>
<section><div class="section-heading"><h2>The program</h2><a href="programs/{slug}.py" download>Download .py</a></div>{code_html}<details class="source-note"><summary>About the notebook transcription</summary><p>{e(lesson['notes'])}</p><p>Source: supplied notebook photos {e(', '.join(str(p) for p in lesson['photos']))}, numbered in ZIP order. Spelling, whitespace and identifier capitalisation are normalised for readable Python. Worked-output photos are not published with the exercise.</p></details></section>
<section><h2>Your paper run</h2><p><strong>Keep track of:</strong> {e(lesson['focus'])}.</p>{exercises}<h3>Use this layout in your notebook</h3><p>Make as many rows as the program needs. Include the final condition that stops a loop. For functions, name the current call; each recursive call has its own variables.</p>{table(['Step / line','What happens?','Variables: before → after','Output / file change'],[('1','…','…','…'),('2','…','…','…'),('…','…','…','…')])}</section>
<section class="unlock" aria-labelledby="unlock-title"><h2 id="unlock-title">Check with your teacher’s password</h2><p>Submit your paper run first. Your teacher will give you this program’s password when it is time to compare.</p><form data-answer="answers/{slug}.json"><label for="password">Password for Day {day:02}</label><div class="password-row"><input id="password" name="password" type="password" autocomplete="off" autocapitalize="none" spellcheck="false" required aria-describedby="unlock-status"><button type="submit">Unlock answer key</button></div></form><p id="unlock-status" role="status" aria-live="polite"></p><noscript><p>Enable JavaScript to unlock the answer key. You can still read and print the exercise.</p></noscript></section>
<section id="answer" hidden aria-label="Unlocked answer key"><div class="answer-actions"><button type="button" id="print-answer">Print answer key</button><button type="button" id="lock-answer">Lock again</button></div><div id="answer-content"></div></section>
<div class="page-actions"><button type="button" id="print-exercise">Print paper exercise</button></div><nav class="day-nav" aria-label="Days">{previous}{next_link}</nav>'''
    (COURSE/f'{slug}.html').write_text(page(f'Day {day:02} · {lesson["title"]}',body,True))
    cards.append(f'<a class="day-card" href="{slug}.html"><span class="eyebrow">DAY {day:02}</span><h2>{e(lesson["title"])}</h2><p>{e(lesson["purpose"])}</p><span class="card-footer">Paper run + locked answer key <span aria-hidden="true">↗</span></span></a>')
    manifest.append({k:lesson[k] for k in ['day','title','photos']})
    print(f'Built {slug}: {lesson["title"]} ({len(lesson["runs"])} verified runs)')
(COURSE/'index.html').write_text(page('One program a day',f'''<header><p class="eyebrow">LEARNING PYTHON · THE NOTEBOOK PROGRAMS</p><h1>One program.<br>One paper run.</h1><p class="lead">Understand what happens at every step.<br>Then write the program yourself.</p></header><section class="routine"><h2>A simple daily routine</h2><ol><li><strong>Trace on paper.</strong> Read your assigned program. In your notebook, write its purpose, every step, every variable change and the output. Submit it to your teacher.</li><li><strong>Check, then write.</strong> Use the password your teacher gives you to check the answer key. Correct your trace, cover the code, then write the program yourself.</li></ol><p class="muted">Do only the day your teacher assigns. Each answer key has a different password.</p></section><div class="course-heading"><h2>The 14 class programs</h2><p>One per day · in notebook experiment order</p></div><div class="day-grid">{''.join(cards)}</div>'''))
(COURSE/'programs'/'sources.json').write_text(json.dumps(manifest,indent=2)+'\n')
password_rows = ''.join(f'<tr><td>{l["day"]:02}</td><td>{e(l["title"])}</td><td><code>{passwords[f"day-{l['day']:02}"]}</code></td><td><a href="https://codekaust.github.io/aakanksha-teaching/learning-python/day-{l['day']:02}.html">Open lesson</a></td></tr>' for l in lessons)
(PRIVATE/'teacher-passwords.html').write_text(f'''<!doctype html><html lang="en"><meta charset="utf-8"><title>Python · Teacher passwords</title><style>body{{font:17px system-ui;max-width:1100px;margin:40px auto;padding:20px}}table{{border-collapse:collapse;width:100%}}th,td{{text-align:left;padding:12px;border-bottom:1px solid #ccc}}code{{white-space:nowrap}}@media print{{body{{font-size:12px}}}}</style><h1>Python · Teacher passwords</h1><p>Private teacher copy. Give only the assigned program’s password after reviewing the student’s paper trace. Do not upload this file to the website or GitHub.</p><table><thead><tr><th>Day</th><th>Program</th><th>Password</th><th>Lesson</th></tr></thead><tbody>{password_rows}</tbody></table><p>Keep a backup of this private folder: it contains the authoring sources, passwords and readable answer documents. Passwords are case-sensitive; all letters are lowercase.</p></html>''')
print('Private teacher password sheet saved outside the repository.')
