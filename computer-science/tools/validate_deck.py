import sys, re
from html.parser import HTMLParser
from collections import Counter

path = sys.argv[1]
src = open(path, encoding="utf-8").read()
VOID = {"area","base","br","col","embed","hr","img","input","link","meta","param",
        "source","track","wbr","path","rect","circle","text","marker","use","line","polyline","polygon"}

class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.stack=[]; self.errors=[]; self.ids=[]; self.info=[]; self.panels=[]
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if a.get("id"): self.ids.append(a["id"])
        cls=a.get("class","")
        if "info" in cls.split(): self.info.append(a.get("aria-controls"))
        if "infopanel" in cls.split(): self.panels.append(a.get("id"))
        if tag not in VOID: self.stack.append((tag, self.getpos()))
    def handle_startendtag(self, tag, attrs):
        a=dict(attrs)
        if a.get("id"): self.ids.append(a["id"])
    def handle_endtag(self, tag):
        if tag in VOID: return
        if not self.stack:
            self.errors.append(f"line {self.getpos()[0]}: stray </{tag}>"); return
        t,pos=self.stack.pop()
        if t!=tag:
            self.errors.append(f"line {self.getpos()[0]}: </{tag}> closes <{t}> opened at line {pos[0]}")

p=P(); p.feed(src)
for t,pos in p.stack: p.errors.append(f"unclosed <{t}> opened at line {pos[0]}")

print("STRUCTURE:", "ok" if not p.errors else "")
for e in p.errors[:20]: print("  !", e)

dup=[i for i,c in Counter(p.ids).items() if c>1]
print("DUPLICATE IDS:", dup or "none")

missing=[i for i in p.info if i not in p.panels]
orphan=[i for i in p.panels if i not in p.info]
print("INFO BUTTONS:", len(p.info), "PANELS:", len(p.panels))
print("  buttons with no panel:", missing or "none")
print("  panels with no button:", orphan or "none")

# raw < inside pre/code-ish blocks
for m in re.finditer(r'<(pre class="code"|div class="[^"]*\b(out|err)\b[^"]*")(.*?)</(pre|div)>', src, re.S):
    body=m.group(3)
    inner=re.sub(r'</?span[^>]*>','',body)
    if re.search(r'<(?!span)', inner):
        line=src[:m.start()].count("\n")+1
        print(f"  ! raw '<' inside block at line {line}: {inner[:80]!r}")

secs=len(re.findall(r'<section class="slide', src))
print("SLIDES:", secs)
print("MARKER IDS:", re.findall(r'<marker id="([^"]+)"', src))
print("SECTIONS:", sorted(set(re.findall(r'data-section="([^"]+)"', src))))
