#!/usr/bin/env python3
import os, re, unicodedata
from fpdf import FPDF
from fpdf.fonts import FontFace

SRC = "/home/user/webovky/architektura-videa"
FONT = "/usr/share/fonts/truetype/dejavu"
OUT = os.path.join(SRC, "Architektura-videa-podklady.pdf")
NAVY = (11, 61, 99)
DARK = (26, 26, 26)

ORDER = [
    "00-SHRNUTI-A-SYSTEM.md", "01-ANALYZA-KONKURENCE.md", "02-VIRAL-MECHANIKA.md",
    "03-FORMATY-A-SABLONY.md", "04-AUTOMATIZACE-PIPELINE.md", "04b-AI-PREZENTER.md",
    "05-ZDROJE-OBSAHU-A-PRAVA.md", "06-CONTENT-PLAN-NAMETY.md", "07-SKRIPT-SABLONY.md",
    "08-SOP-CHECKLIST-A-PROMPTY.md",
]

def strip_emoji(s):
    out = []
    for ch in s:
        if ch in ("️", "‍"):
            continue
        if ord(ch) > 0xFFFF:
            continue
        if unicodedata.category(ch) == "So" and ch not in ("☐", "☑"):
            continue
        out.append(ch)
    return "".join(out)

def inl(t, bold_ok=True):
    t = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'\1', t)          # links -> text
    t = t.replace('`', '')                                     # inline code ticks
    t = re.sub(r'(?<!\*)\*(?!\*)([^*\n]+?)\*(?!\*)', r'\1', t)  # *italic* -> text
    if not bold_ok:
        t = t.replace('**', '')
    return t.strip()

class PDF(FPDF):
    def footer(self):
        self.set_y(-12)
        self.set_font("DejaVuSans", "", 7)
        self.set_text_color(120, 120, 120)
        self.cell(0, 8, f"Architektura videa – podklady  ·  str. {self.page_no()}", align="C")

pdf = PDF(format="A4")
pdf.set_margins(15, 14, 14)
pdf.set_auto_page_break(True, margin=16)
pdf.add_font("DejaVuSans", "", os.path.join(FONT, "DejaVuSans.ttf"))
pdf.add_font("DejaVuSans", "B", os.path.join(FONT, "DejaVuSans-Bold.ttf"))
pdf.add_font("DejaVuSans", "I", os.path.join(FONT, "DejaVuSans.ttf"))
pdf.add_font("DejaVuSans", "BI", os.path.join(FONT, "DejaVuSans-Bold.ttf"))
pdf.add_font("DejaVuSansMono", "", os.path.join(FONT, "DejaVuSansMono.ttf"))

H = {1: 17, 2: 13.5, 3: 11.5, 4: 10.5, 5: 10, 6: 10}

def heading(level, text):
    pdf.ln(2 if level > 1 else 1)
    pdf.set_font("DejaVuSans", "B", H.get(level, 10))
    pdf.set_text_color(*NAVY)
    pdf.multi_cell(0, H.get(level, 10) * 0.52, inl(text, bold_ok=False), markdown=False)
    if level <= 2:
        y = pdf.get_y() + 0.5
        pdf.set_draw_color(*( (11,61,99) if level==1 else (205,217,227) ))
        pdf.set_line_width(0.6 if level == 1 else 0.3)
        pdf.line(pdf.l_margin, y, pdf.w - pdf.r_margin, y)
        pdf.ln(2.5)
    else:
        pdf.ln(1)
    pdf.set_text_color(*DARK)

def para(text, indent=0):
    pdf.set_font("DejaVuSans", "", 9.6)
    pdf.set_text_color(*DARK)
    if indent:
        pdf.set_x(pdf.l_margin + indent)
    pdf.multi_cell(pdf.epw - indent, 5.0, inl(text), markdown=True,
                   new_x="LMARGIN", new_y="NEXT")

def bullet(text, indent=0, marker="•"):
    indent = min(indent, 24)
    pdf.set_font("DejaVuSans", "", 9.6)
    pdf.set_text_color(*DARK)
    x0 = pdf.l_margin + indent
    y0 = pdf.get_y()
    pdf.set_xy(x0, y0)
    pdf.cell(6, 5.0, marker)                       # marker via cell -> never raises
    pdf.set_xy(x0 + 6, y0)
    pdf.multi_cell(pdf.epw - indent - 6, 5.0, inl(text), markdown=True,
                   new_x="LMARGIN", new_y="NEXT")

def quote(text):
    pdf.set_font("DejaVuSans", "", 9.2)
    pdf.set_text_color(70, 90, 105)
    y0 = pdf.get_y()
    pdf.set_x(pdf.l_margin + 4)
    pdf.multi_cell(pdf.epw - 4, 5.0, inl(text), markdown=True, new_x="LMARGIN", new_y="NEXT")
    pdf.set_draw_color(155, 183, 204); pdf.set_line_width(1.2)
    pdf.line(pdf.l_margin + 1, y0, pdf.l_margin + 1, pdf.get_y())
    pdf.set_text_color(*DARK)

def codeblock(lines):
    pdf.set_font("DejaVuSansMono", "", 8)
    pdf.set_fill_color(244, 246, 248)
    pdf.set_text_color(40, 40, 40)
    for ln in lines:
        pdf.multi_cell(pdf.epw, 4.4, ln if ln else " ", fill=True,
                       new_x="LMARGIN", new_y="NEXT")
    pdf.set_text_color(*DARK)

HEAD_STYLE = FontFace(emphasis="BOLD", color=(255, 255, 255), fill_color=NAVY)

def soft(t):
    # insert break opportunities into long unbreakable tokens (URLs etc.)
    return re.sub(r'(\S{20})(?=\S)', r'\1​', t)

def table_as_text(rows):
    pdf.ln(1)
    for ri, r in enumerate(rows):
        cells = [inl(c, bold_ok=False) for c in r]
        para(("**" + "  |  ".join(cells) + "**") if ri == 0 else "  |  ".join(cells))
    pdf.ln(1)

def render_table(rows):
    if not rows:
        return
    ncol = max(len(r) for r in rows)
    rows = [r + [""] * (ncol - len(r)) for r in rows]
    fs = 7.4 if ncol <= 5 else (6.6 if ncol <= 7 else 6.0)
    pdf.ln(1)
    pdf.set_font("DejaVuSans", "", fs)
    pdf.set_draw_color(150, 165, 180)
    try:
        with pdf.table(width=pdf.epw, text_align="LEFT", markdown=True,
                       first_row_as_headings=True, headings_style=HEAD_STYLE,
                       line_height=fs * 0.52, borders_layout="ALL",
                       wrapmode="CHAR", padding=(0.8, 1.0)) as table:
            for ri, r in enumerate(rows):
                row = table.row()
                for c in r:
                    row.cell(soft(inl(c, bold_ok=(ri > 0))) or " ")
    except Exception as e:
        print(f"   (tabulka jako text, {ncol} sl.: {type(e).__name__})")
        table_as_text(rows)
    pdf.ln(1.5)

def is_table_sep(line):
    return bool(re.match(r'^\s*\|?\s*:?-{2,}', line)) and set(line.strip()) <= set("|:- ")

def split_row(line):
    s = line.strip()
    if s.startswith("|"): s = s[1:]
    if s.endswith("|"): s = s[:-1]
    return [c.strip() for c in s.split("|")]

def render_doc(md):
    lines = md.split("\n")
    i = 0
    while i < len(lines):
        line = lines[i]
        s = line.strip()
        # fenced code
        if s.startswith("```"):
            j = i + 1; buf = []
            while j < len(lines) and not lines[j].strip().startswith("```"):
                buf.append(lines[j]); j += 1
            codeblock(buf); i = j + 1; continue
        # table
        if "|" in line and i + 1 < len(lines) and is_table_sep(lines[i + 1]):
            tb = [split_row(line)]; j = i + 2
            while j < len(lines) and "|" in lines[j] and lines[j].strip():
                tb.append(split_row(lines[j])); j += 1
            render_table(tb); i = j; continue
        # blank
        if not s:
            i += 1; continue
        # hr
        if re.match(r'^(\*\s*){3,}$', s) or re.match(r'^(-\s*){3,}$', s) or s in ("---", "***", "___"):
            pdf.ln(1); pdf.set_draw_color(205, 217, 227); pdf.set_line_width(0.3)
            pdf.line(pdf.l_margin, pdf.get_y(), pdf.w - pdf.r_margin, pdf.get_y()); pdf.ln(2.5)
            i += 1; continue
        # heading
        m = re.match(r'^(#{1,6})\s+(.*)$', s)
        if m:
            heading(len(m.group(1)), m.group(2)); i += 1; continue
        # blockquote
        if s.startswith(">"):
            buf = []
            while i < len(lines) and lines[i].strip().startswith(">"):
                buf.append(lines[i].strip()[1:].strip()); i += 1
            quote(" ".join(buf)); continue
        # list item (with indent + checkbox + ordered)
        mi = re.match(r'^(\s*)([-*+]|\d+\.)\s+(.*)$', line)
        if mi:
            indent = (len(mi.group(1)) // 2) * 4
            content = mi.group(3)
            marker = "•"
            cb = re.match(r'^\[([ xX])\]\s+(.*)$', content)
            if cb:
                marker = "☑" if cb.group(1).lower() == "x" else "☐"
                content = cb.group(2)
            elif re.match(r'^\d+\.$', mi.group(2)):
                marker = mi.group(2)
            bullet(content, indent=indent, marker=marker); i += 1; continue
        # paragraph (gather until blank)
        buf = [line]; i += 1
        while i < len(lines) and lines[i].strip() and not re.match(
                r'^\s*(#{1,6}\s|[-*+]\s|\d+\.\s|>|```|\|)', lines[i]) and "|" not in lines[i]:
            buf.append(lines[i]); i += 1
        para(" ".join(x.strip() for x in buf))

# ---------- cover ----------
pdf.add_page()
pdf.set_y(72); pdf.set_text_color(*NAVY); pdf.set_font("DejaVuSans", "B", 30)
pdf.multi_cell(0, 14, "Architektura videa", align="C")
pdf.ln(2); pdf.set_font("DejaVuSans", "", 13); pdf.set_text_color(68, 96, 111)
pdf.multi_cell(0, 8, "Kompletní podklady pro virální YouTube + Instagram kanál\n"
                     "postavený na AI prezenterovi („AI člověk\")", align="C")
pdf.ln(12); pdf.set_font("DejaVuSans", "", 10); pdf.set_text_color(112, 128, 144)
pdf.multi_cell(0, 6, "Architektura a stavby v ČR i ve světě  ·  červen 2026\n"
                     "Vygenerováno hloubkovým multi-agent researchem (34 agentů)", align="C")

# ---------- TOC ----------
pdf.add_page()
heading(1, "Obsah balíčku")
for idx, fn in enumerate(ORDER):
    with open(os.path.join(SRC, fn), encoding="utf-8") as f:
        t = ""
        for ln in f:
            if ln.lstrip().startswith("# "):
                t = strip_emoji(ln.lstrip()[2:].strip()); break
    bullet(f"**{t or fn}**  ({fn})")
pdf.ln(2)
quote("Poznámka: Kanál „YAP\" se nepodařilo dohledat (20+ vyhledávání) – pro cílený rozbor "
      "je potřeba funkční odkaz. Některá čísla jsou označena (neověřeno), protože prostředí "
      "blokovalo přímé načítání stránek; před rozhodnutím ověř u zdroje.")

# ---------- documents ----------
for fn in ORDER:
    with open(os.path.join(SRC, fn), encoding="utf-8") as f:
        raw = strip_emoji(f.read())
    pdf.add_page()
    try:
        render_doc(raw)
    except Exception as e:
        print(f"!! chyba v {fn}: {type(e).__name__}: {e}")

pdf.output(OUT)
print("PDF hotovo:", OUT, os.path.getsize(OUT), "B,", pdf.page_no(), "stran")
