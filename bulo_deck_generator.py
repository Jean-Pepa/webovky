#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""BULO — domovní pas. Pitch/partner deck generator (reportlab, vector)."""
import os
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, Color, white, black
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

W, H = 1280, 720
OUT = "/home/user/webovky/BULO-pitch-deck.pdf"

# ---------- fonts ----------
LIB = "/usr/share/fonts/truetype/liberation/"
DEJ = "/usr/share/fonts/truetype/dejavu/"
def reg(name, path, fallback):
    p = path if os.path.exists(path) else fallback
    pdfmetrics.registerFont(TTFont(name, p))
reg("F",  LIB+"LiberationSans-Regular.ttf", DEJ+"DejaVuSans.ttf")
reg("FB", LIB+"LiberationSans-Bold.ttf",    DEJ+"DejaVuSans-Bold.ttf")
reg("FI", LIB+"LiberationSans-Italic.ttf",  DEJ+"DejaVuSans-Oblique.ttf")
FB, F = "FB", "F"

# ---------- palette ----------
TERRA   = HexColor("#b5543a")
TERRA_D = HexColor("#9c4732")
TERRA_L = HexColor("#f6ddd4")
PAPER   = HexColor("#faf9f7")
PANEL   = HexColor("#f1ece6")
INK     = HexColor("#2a211e")
BRASS   = HexColor("#b58b4b")
S900=HexColor("#1c1917"); S700=HexColor("#44403c"); S600=HexColor("#57534e")
S500=HexColor("#78716c"); S400=HexColor("#a8a29e"); S300=HexColor("#d6d3d1")
S200=HexColor("#e7e5e4"); S100=HexColor("#f5f5f4"); S50=HexColor("#fafaf9")
BLUE=HexColor("#2563eb"); RED=HexColor("#dc2626"); VIOLET=HexColor("#7c3aed")
EMER=HexColor("#059669"); AMBER=HexColor("#b58b4b"); GRAY=HexColor("#6b7280")

def mix(col, t):  # toward white
    return Color(col.red+(1-col.red)*t, col.green+(1-col.green)*t, col.blue+(1-col.blue)*t)

c = canvas.Canvas(OUT, pagesize=(W, H))

# ---------- primitives (top-based y) ----------
def box(x, ytop, w, h, r=0, fill=None, stroke=None, sw=1):
    y = H - ytop - h
    if fill is not None: c.setFillColor(fill)
    if stroke is not None: c.setStrokeColor(stroke); c.setLineWidth(sw)
    if r > 0:
        c.roundRect(x, y, w, h, r, stroke=1 if stroke is not None else 0,
                    fill=1 if fill is not None else 0)
    else:
        c.rect(x, y, w, h, stroke=1 if stroke is not None else 0,
               fill=1 if fill is not None else 0)

def line(x1, y1t, x2, y2t, col=S300, w=1):
    c.setStrokeColor(col); c.setLineWidth(w)
    c.line(x1, H-y1t, x2, H-y2t)

def circle(cx, cyt, r, fill=None, stroke=None, sw=1):
    if fill is not None: c.setFillColor(fill)
    if stroke is not None: c.setStrokeColor(stroke); c.setLineWidth(sw)
    c.circle(cx, H-cyt, r, stroke=1 if stroke is not None else 0,
             fill=1 if fill is not None else 0)

def text(x, ytop, s, font=F, size=14, col=INK, align="l", track=0):
    c.setFont(font, size); c.setFillColor(col)
    yb = H - ytop - size
    if not track:
        if align == "l":   c.drawString(x, yb, s)
        elif align == "c": c.drawCentredString(x, yb, s)
        elif align == "r": c.drawRightString(x, yb, s)
        return
    total = tw(s, font, size) + track*(len(s)-1)
    sx = x if align=="l" else (x-total/2 if align=="c" else x-total)
    for ch in s:
        c.drawString(sx, yb, ch); sx += tw(ch, font, size)+track

def tw(s, font, size): return pdfmetrics.stringWidth(s, font, size)

def runs(x, ytop, segs, font=FB, size=44, track=0):
    """inline multi-color text: segs=[(text,color),...]"""
    cx = x
    c.setFont(font, size)
    yb = H - ytop - size
    for s, col in segs:
        c.setFillColor(col); c.drawString(cx, yb, s)
        cx += tw(s, font, size)
    return cx

def wrap(s, font, size, maxw):
    words = s.split(); lines=[]; cur=""
    for w_ in words:
        t=(cur+" "+w_).strip()
        if tw(t, font, size) <= maxw: cur=t
        else: lines.append(cur); cur=w_
    if cur: lines.append(cur)
    return lines

def paragraph(x, ytop, s, font=F, size=20, col=S600, maxw=560, lh=1.42):
    for i, ln in enumerate(wrap(s, font, size, maxw)):
        text(x, ytop+i*size*lh, ln, font, size, col)
    return ytop + len(wrap(s, font, size, maxw))*size*lh

def pill(x, ytop, label, bg=TERRA_L, fg=TERRA):
    pad=16; h=30; fs=12.5
    w = tw(label, FB, fs) + pad*2 + (len(label)-1)*1.2
    box(x, ytop, w, h, r=15, fill=bg)
    text(x+pad, ytop+9, label, FB, fs, fg, track=1.2)
    return w, h

def chip(x, ytop, label, h=42):
    fs=15; pad=18
    w = tw(label, F, fs) + pad*2
    box(x, ytop, w, h, r=h/2, fill=white, stroke=S200)
    text(x+pad, ytop+(h-fs)/2, label, F, fs, S700)
    return w

def badge(x, ytop, label, col, h=20):
    fs=11; pad=9
    w = tw(label, FB, fs) + pad*2
    box(x, ytop, w, h, r=h/2, fill=mix(col,0.86))
    text(x+pad, ytop+(h-fs)/2+0.5, label, FB, fs, col)
    return w

def pageno(n):
    text(W-46, H-44, str(n), F, 13, S400, align="r")

def footer():
    text(80, H-44, "BULO · domovní pas", F, 12, S400)

def slide(bg=PAPER):
    c.setFillColor(bg); c.rect(0,0,W,H, fill=1, stroke=0)

def header(label, head_segs, sub=None, x=80, ytop=104, sub_w=560, headsize=46):
    pill(x, ytop, label)
    runs(x, ytop+48, head_segs, FB, headsize)
    yy = ytop+48+headsize+ (10 if sub else 0)
    if sub:
        yy = paragraph(x, ytop+48+headsize+22, sub, F, 20, S600, sub_w)
    return yy

# ---------- icon glyphs (simple vector, terracotta line on tile) ----------
def icon_tile(x, ytop, kind, size=54, tile=mix(TERRA,0.86), fg=TERRA):
    box(x, ytop, size, size, r=14, fill=tile)
    cx, cyt = x+size/2, ytop+size/2
    c.setStrokeColor(fg); c.setLineWidth(2.4); c.setFillColor(fg)
    s=size*0.30
    if kind=="doc":
        box(cx-s*0.7, cyt-s, s*1.4, s*2, r=3, stroke=fg);
        line(cx-s*0.4, cyt-s*0.4, cx+s*0.4, cyt-s*0.4, fg,2)
        line(cx-s*0.4, cyt+s*0.1, cx+s*0.4, cyt+s*0.1, fg,2)
        line(cx-s*0.4, cyt+s*0.6, cx+s*0.2, cyt+s*0.6, fg,2)
    elif kind=="clock":
        circle(cx, cyt, s, stroke=fg); line(cx,cyt,cx,cyt-s*0.6,fg,2.4); line(cx,cyt,cx+s*0.5,cyt,fg,2.4)
    elif kind=="camera":
        box(cx-s, cyt-s*0.6, s*2, s*1.5, r=4, stroke=fg); circle(cx,cyt+s*0.15,s*0.5,stroke=fg)
        box(cx-s*0.35, cyt-s*0.95, s*0.7, s*0.4, r=2, fill=fg)
    elif kind=="shield":
        p=c.beginPath();
        p.moveTo(cx, H-(cyt-s)); p.lineTo(cx+s*0.85, H-(cyt-s*0.4))
        p.lineTo(cx+s*0.85, H-(cyt+s*0.3)); p.curveTo(cx+s*0.85,H-(cyt+s*0.7), cx+s*0.4,H-(cyt+s), cx,H-(cyt+s*1.05))
        p.curveTo(cx-s*0.4,H-(cyt+s), cx-s*0.85,H-(cyt+s*0.7), cx-s*0.85,H-(cyt+s*0.3))
        p.lineTo(cx-s*0.85, H-(cyt-s*0.4)); p.close(); c.setLineWidth(2.4); c.drawPath(p, stroke=1, fill=0)
        line(cx-s*0.3,cyt+s*0.1, cx-s*0.02,cyt+s*0.4, fg,2.4); line(cx-s*0.02,cyt+s*0.4, cx+s*0.45,cyt-s*0.2, fg,2.4)
    elif kind=="bell":
        p=c.beginPath()
        p.moveTo(cx-s*0.7,H-(cyt+s*0.4)); p.curveTo(cx-s*0.7,H-(cyt-s*0.9), cx+s*0.7,H-(cyt-s*0.9), cx+s*0.7,H-(cyt+s*0.4))
        c.setLineWidth(2.4); c.drawPath(p,stroke=1,fill=0)
        line(cx-s*0.7,cyt+s*0.4,cx+s*0.7,cyt+s*0.4,fg,2.4); circle(cx,cyt+s*0.75,s*0.18,fill=fg)
        line(cx,cyt-s*0.9,cx,cyt-s*1.05,fg,2.4)
    elif kind=="box":  # equipment / inventory
        box(cx-s*0.85, cyt-s*0.5, s*1.7, s*1.3, r=3, stroke=fg)
        line(cx-s*0.85, cyt-s*0.05, cx+s*0.85, cyt-s*0.05, fg,2)
        line(cx, cyt-s*0.5, cx, cyt-s*0.05, fg,2)
    elif kind=="leaf":  # energy / eco
        p=c.beginPath(); p.moveTo(cx-s*0.6,H-(cyt+s*0.6));
        p.curveTo(cx-s*0.8,H-(cyt-s*0.7), cx+s*0.7,H-(cyt-s*0.8), cx+s*0.6,H-(cyt+s*0.6))
        p.curveTo(cx-s*0.1,H-(cyt+s*0.7), cx-s*0.2,H-(cyt+s*0.0), cx-s*0.6,H-(cyt+s*0.6)); p.close()
        c.setLineWidth(2.2); c.drawPath(p,stroke=1,fill=0)
        line(cx+s*0.25,cyt-s*0.45, cx-s*0.3,cyt+s*0.45, fg,1.8)
    elif kind=="share":
        circle(cx-s*0.6,cyt+s*0.5,s*0.32,fill=fg); circle(cx+s*0.6,cyt-s*0.5,s*0.32,fill=fg); circle(cx+s*0.6,cyt+s*0.5,s*0.32,fill=fg)
        line(cx-s*0.4,cyt+s*0.4,cx+s*0.4,cyt-s*0.35,fg,2); line(cx-s*0.4,cyt+s*0.55,cx+s*0.4,cyt+s*0.5,fg,2)
    elif kind=="house":
        p=c.beginPath(); p.moveTo(cx-s,H-(cyt+s*0.1)); p.lineTo(cx,H-(cyt-s*0.9)); p.lineTo(cx+s,H-(cyt+s*0.1))
        c.setLineWidth(2.4); c.drawPath(p,stroke=1,fill=0)
        box(cx-s*0.75, cyt+s*0.05, s*1.5, s*0.95, stroke=fg)

# ---------- photo placeholder (warm gradient block) ----------
def photo(x, ytop, w, h, r=10, c1=HexColor("#c9b7a6"), c2=HexColor("#9c8576"), house=True):
    c.saveState()
    p=c.beginPath(); p.roundRect(x, H-ytop-h, w, h, r); c.clipPath(p, stroke=0, fill=0)
    c.linearGradient(x, H-ytop-h, x+w, H-ytop, (c1, c2))
    if house:
        c.setStrokeColor(Color(1,1,1,0.5)); c.setLineWidth(1.4)
        hx, hyt, hs = x+w/2, ytop+h/2, min(w,h)*0.22
        pth=c.beginPath(); pth.moveTo(hx-hs,H-(hyt+hs*0.2)); pth.lineTo(hx,H-(hyt-hs)); pth.lineTo(hx+hs,H-(hyt+hs*0.2)); c.drawPath(pth,stroke=1,fill=0)
        c.rect(hx-hs*0.72, H-(hyt+hs*1.05), hs*1.44, hs*0.9, stroke=1, fill=0)
    c.restoreState()

# ===================================================================
#  PHONE + BROWSER FRAMES
# ===================================================================
def phone(cx, top, sh_h=610, scale=1.0, screen=None):
    pw = 300*scale; ph = sh_h*scale
    x = cx - pw/2
    # soft shadow
    c.setFillColor(Color(0,0,0,0.07)); c.roundRect(x+6, H-top-ph-6, pw, ph, 42*scale, fill=1, stroke=0)
    box(x, top, pw, ph, r=42*scale, fill=INK)
    m=12*scale
    sx, syt, sw, shh = x+m, top+m, pw-2*m, ph-2*m
    c.saveState()
    p=c.beginPath(); p.roundRect(sx, H-(syt+shh), sw, shh, 30*scale); c.clipPath(p, stroke=0, fill=0)
    box(sx, syt, sw, shh, fill=PAPER)
    if screen: screen(sx, syt, sw, shh)
    c.restoreState()
    # dynamic island
    box(cx-42*scale, top+14*scale, 84*scale, 20*scale, r=10*scale, fill=INK)
    return sx, syt, sw, shh

def browser(x, top, w, h, url="bulo.cz/prehled", screen=None):
    c.setFillColor(Color(0,0,0,0.06)); c.roundRect(x+6, H-top-h-6, w, h, 14, fill=1, stroke=0)
    box(x, top, w, h, r=14, fill=white, stroke=S200)
    box(x, top, w, 40, r=14, fill=S100)
    box(x, top+26, w, 14, fill=S100)  # square off bottom of bar
    line(x, top+40, x+w, top+40, S200,1)
    for i,col in enumerate([HexColor("#f87171"),HexColor("#fbbf24"),HexColor("#34d399")]):
        circle(x+22+i*20, top+20, 6, fill=col)
    box(x+96, top+10, w-180, 20, r=10, fill=white, stroke=S200)
    text(x+108, top+15, url, F, 11, S500)
    c.saveState()
    p=c.beginPath(); p.roundRect(x, H-top-h, w, h-40, 0); c.clipPath(p, stroke=0, fill=0)
    if screen: screen(x, top+40, w, h-40)
    c.restoreState()

# ===================================================================
#  APP SCREEN MOCKUPS  (draw inside given rect, top-based)
# ===================================================================
def app_topbar(x, yt, w, title=None, bell=True):
    box(x, yt, w, 46, fill=white)
    line(x, yt+46, x+w, yt+46, S100,1)
    if title:
        text(x+16, yt+16, title, FB, 15, INK)
    else:
        text(x+16, yt+15, "BULO", FB, 17, TERRA, track=1)
    if bell:
        circle(x+w-26, yt+23, 13, fill=S100);
        icon_tile  # noop
        c.setStrokeColor(S500); c.setLineWidth(1.4)
        circle(x+w-26, yt+23, 5, stroke=S500)

def tabbar(x, yt, w, h, active=0):
    by = yt+h-52
    box(x, by, w, 52, fill=white); line(x, by, x+w, by, S100,1)
    labels=["Domů","Historie","Doklady","Účet"]; kinds=["house","clock","doc","box"]
    n=len(labels); step=w/n
    for i,(lb,kd) in enumerate(zip(labels,kinds)):
        col = TERRA if i==active else S400
        icon_mini(x+step*i+step/2, by+18, kd, col)
        text(x+step*i+step/2, by+32, lb, F, 9, col, align="c")

def icon_mini(cx, cyt, kind, col):
    c.setStrokeColor(col); c.setLineWidth(1.6); c.setFillColor(col); s=7
    if kind=="house":
        p=c.beginPath(); p.moveTo(cx-s,H-(cyt+s*0.2)); p.lineTo(cx,H-(cyt-s)); p.lineTo(cx+s,H-(cyt+s*0.2)); c.drawPath(p,stroke=1,fill=0)
        c.rect(cx-s*0.65,H-(cyt+s),s*1.3,s*0.8,stroke=1,fill=0)
    elif kind=="clock":
        circle(cx,cyt,s,stroke=col); line(cx,cyt,cx,cyt-s*0.5,col,1.4); line(cx,cyt,cx+s*0.4,cyt,col,1.4)
    elif kind=="doc":
        c.rect(cx-s*0.6,H-(cyt+s),s*1.2,s*2*0.95,stroke=1,fill=0)
    elif kind=="box":
        circle(cx,cyt-s*0.4,s*0.5,stroke=col);
        p=c.beginPath(); p.moveTo(cx-s*0.8,H-(cyt+s)); p.curveTo(cx-s*0.8,H-(cyt-s*0.1),cx+s*0.8,H-(cyt-s*0.1),cx+s*0.8,H-(cyt+s)); c.drawPath(p,stroke=1,fill=0)

def card(x, yt, w, h, r=14, fill=white, stroke=S200):
    box(x, yt, w, h, r=r, fill=fill, stroke=stroke)

# ----- Screen: Dashboard (mobile) -----
def scr_dashboard(x, yt, w, h):
    app_topbar(x, yt, w)
    pad=16; cw=w-2*pad; cy=yt+58
    text(x+pad, cy, "Moje nemovitosti", FB, 16, INK); cy+=30
    # hero property card
    card(x+pad, cy, cw, 150)
    photo(x+pad, cy, cw, 84, r=14)
    text(x+pad+12, cy+96, "Byt 3+kk · Rezidence Letná", FB, 13, INK)
    text(x+pad+12, cy+114, "Praha 7 · předáno 2025", F, 11, S500)
    badge(x+pad+12, cy+130, "Třída B", EMER)
    badge(x+pad+72, cy+130, "Záruka aktivní", BLUE)
    cy+=166
    # mini stat row
    stats=[("12","Záznamů"),("28","Dokladů"),("3","Revize")]
    sw=(cw-2*8)/3
    for i,(n,l) in enumerate(stats):
        sx=x+pad+i*(sw+8); card(sx, cy, sw, 56, r=12)
        text(sx+sw/2, cy+10, n, FB, 18, TERRA, align="c")
        text(sx+sw/2, cy+34, l, F, 10, S500, align="c")
    cy+=72
    text(x+pad, cy, "Nadchází", FB, 13, INK); cy+=24
    rows=[("Revize plynu","do 14 dní",VIOLET,"Revize"),("Konec záruky – okna","38 dní",TERRA,"Záruka")]
    for t,d,col,bg in rows:
        card(x+pad, cy, cw, 46, r=12)
        circle(x+pad+20, cy+23, 5, fill=col)
        text(x+pad+36, cy+11, t, FB, 12, INK)
        text(x+pad+36, cy+27, d, F, 10, S500)
        text(x+pad+cw-12, cy+16, "›", FB, 16, S400, align="r")
        cy+=54
    tabbar(x, yt, w, h, active=0)

# ----- Screen: Timeline (mobile) -----
def scr_timeline(x, yt, w, h):
    app_topbar(x, yt, w, title="Historie domu")
    pad=16; cw=w-2*pad; cy=yt+62
    items=[("Rekonstrukce koupelny","12. 3. 2026","185 000 Kč",EMER,"Rekonstrukce"),
           ("Revize kotle","2. 2. 2026","1 200 Kč",VIOLET,"Revize"),
           ("Netěsnící okno","18. 1. 2026","reklamace",RED,"Závada"),
           ("Kapající kohoutek","4. 12. 2025","850 Kč",BLUE,"Oprava"),
           ("Převzetí bytu","15. 9. 2025","—",BRASS,"Převzetí")]
    line(x+pad+10, cy+8, x+pad+10, cy+ len(items)*78 -30, S200, 2)
    for t,d,cost,col,bg in items:
        circle(x+pad+10, cy+14, 6, fill=col, stroke=white, sw=2)
        card(x+pad+30, cy, cw-30, 64, r=12)
        badge(x+pad+42, cy+12, bg, col)
        text(x+pad+42, cy+34, t, FB, 12.5, INK)
        text(x+pad+42, cy+50, d, F, 10, S500)
        text(x+pad+cw-12, cy+49, cost, FB, 11, S700, align="r")
        cy+=78
    tabbar(x, yt, w, h, active=1)

# ----- Screen: Warranty alert (mobile) -----
def scr_warranty(x, yt, w, h):
    app_topbar(x, yt, w, title="Záruky a reklamace")
    pad=16; cw=w-2*pad; cy=yt+62
    # highlight card
    card(x+pad, cy, cw, 116, r=16, fill=mix(TERRA,0.9), stroke=mix(TERRA,0.6))
    icon_tile(x+pad+14, cy+16, "shield", 40, tile=white, fg=TERRA)
    text(x+pad+64, cy+16, "Záruka na okna končí", FB, 13.5, TERRA_D)
    runs(x+pad+64, cy+34, [("za ",F),("38 dní",FB)] if False else [("za 38 dní",TERRA_D)], FB, 17)
    box(x+pad+14, cy+74, cw-28, 30, r=8, fill=TERRA)
    text(x+pad+cw/2, cy+82, "Nahlásit vady developerovi", FB, 12, white, align="c")
    cy+=132
    text(x+pad, cy, "Přehled záruk", FB, 13, INK); cy+=24
    ws=[("Okna a dveře","38 dní",0.92,TERRA),("Fasáda a zateplení","2 roky",0.4,EMER),
        ("Rozvody vody","1,5 roku",0.55,BLUE),("Konstrukce","8 let",0.1,S400)]
    for t,left,frac,col in ws:
        card(x+pad, cy, cw, 52, r=12)
        text(x+pad+14, cy+10, t, FB, 12, INK)
        text(x+pad+cw-14, cy+10, left, F, 11, S500, align="r")
        box(x+pad+14, cy+32, cw-28, 7, r=4, fill=S100)
        box(x+pad+14, cy+32, (cw-28)*frac, 7, r=4, fill=col)
        cy+=60
    tabbar(x, yt, w, h, active=0)

# ----- Screen: Documents (mobile) -----
def scr_docs(x, yt, w, h):
    app_topbar(x, yt, w, title="Trezor dokumentů")
    pad=16; cw=w-2*pad; cy=yt+60
    cats=[("Energetický štítek (PENB)","2 soubory",VIOLET),
          ("Smlouvy","5 souborů",BLUE),
          ("Projekt a plány","9 souborů",BRASS),
          ("Revize a certifikáty","6 souborů",EMER),
          ("Faktury a doklady","28 souborů",TERRA),
          ("Záruční listy","11 souborů",GRAY)]
    for t,n,col in cats:
        card(x+pad, cy, cw, 56, r=12)
        box(x+pad+12, cy+12, 32, 32, r=9, fill=mix(col,0.86))
        icon_mini(x+pad+28, cy+28, "doc", col)
        text(x+pad+56, cy+13, t, FB, 12.5, INK)
        text(x+pad+56, cy+31, n, F, 10.5, S500)
        text(x+pad+cw-14, cy+20, "›", FB, 16, S400, align="r")
        cy+=64
    tabbar(x, yt, w, h, active=2)

# ----- Screen: Energy recommendation (mobile) -----
def scr_energy(x, yt, w, h):
    app_topbar(x, yt, w, title="Energetika")
    pad=16; cw=w-2*pad; cy=yt+60
    # class gauge
    card(x+pad, cy, cw, 92, r=16)
    text(x+pad+14, cy+14, "Energetická třída", F, 11, S500)
    classes=["A","B","C","D","E","F","G"]; cols=[EMER,EMER,HexColor("#84a000"),AMBER,HexColor("#d08400"),RED,RED]
    bw=(cw-28-6*4)/7
    for i,(cl,co) in enumerate(zip(classes,cols)):
        bx=x+pad+14+i*(bw+4); hl = cl=="D"
        box(bx, cy+38, bw, 40 if hl else 30, r=6, fill=co if hl else mix(co,0.55))
        text(bx+bw/2, cy+ (50 if hl else 46), cl, FB, 13 if hl else 11, white, align="c")
    cy+=108
    card(x+pad, cy, cw, 150, r=16, fill=mix(EMER,0.92), stroke=mix(EMER,0.6))
    icon_tile(x+pad+14, cy+14, "leaf", 40, tile=white, fg=EMER)
    text(x+pad+64, cy+16, "Doporučení", FB, 12, EMER)
    text(x+pad+64, cy+33, "Zateplení fasády", FB, 16, INK)
    text(x+pad+14, cy+66, "Úspora ~30 % na vytápění · návratnost ~7 let", F, 11.5, S700)
    box(x+pad+14, cy+88, (cw-28), 1, fill=mix(EMER,0.6))
    text(x+pad+14, cy+98, "Dotace NZÚ", F, 11, S600)
    text(x+pad+cw-14, cy+94, "až 250 000 Kč", FB, 14, EMER, align="r")
    box(x+pad+14, cy+118, cw-28, 28, r=8, fill=EMER)
    text(x+pad+cw/2, cy+125, "Najít energetického specialistu", FB, 11.5, white, align="c")
    cy+=166
    tabbar(x, yt, w, h, active=0)

# ----- Screen: Dashboard compact (small companion phone) -----
def scr_dash_mini(x, yt, w, h):
    app_topbar(x, yt, w)
    pad=14; cw=w-2*pad; cy=yt+56
    text(x+pad, cy, "Moje nemovitosti", FB, 15, INK); cy+=26
    card(x+pad, cy, cw, 116)
    photo(x+pad, cy, cw, 62, r=14)
    text(x+pad+12, cy+74, "Byt 3+kk · Rezidence Letná", FB, 11.5, INK)
    text(x+pad+12, cy+92, "Praha 7 · předáno 2025", F, 10, S500)
    cy+=130
    text(x+pad, cy, "Nadchází", FB, 12.5, INK); cy+=22
    card(x+pad, cy, cw, 46, r=12)
    circle(x+pad+18, cy+23, 5, fill=TERRA)
    text(x+pad+34, cy+11, "Konec záruky – okna", FB, 11.5, INK)
    text(x+pad+34, cy+27, "za 38 dní", F, 10, S500)
    tabbar(x, yt, w, h, active=0)

# ----- Screen: Browser dashboard (PC) -----
def scr_pc(x, yt, w, h):
    box(x, yt, w, h, fill=PAPER)
    # sidebar
    sbw=190; box(x, yt, sbw, h, fill=white); line(x+sbw, yt, x+sbw, yt+h, S100,1)
    text(x+22, yt+24, "BULO", FB, 18, TERRA, track=1)
    nav=[("Přehled",True),("Nemovitosti",False),("Historie",False),("Dokumenty",False),("Záruky",False),("Energetika",False),("Účet",False)]
    ny=yt+64
    for lb,act in nav:
        if act: box(x+12, ny-6, sbw-24, 32, r=8, fill=mix(TERRA,0.88))
        text(x+26, ny, lb, FB if act else F, 13, TERRA if act else S600); ny+=40
    # main
    mx=x+sbw+28; mw=w-sbw-56
    text(mx, yt+24, "Přehled", FB, 22, INK)
    text(mx, yt+54, "Rezidence Letná · 48 jednotek", F, 13, S500)
    # stat cards
    stats=[("48","Jednotek",TERRA),("612","Dokumentů",BLUE),("9","Revizí tento měsíc",VIOLET),("14","Reklamací",RED)]
    sw=(mw-3*16)/4
    for i,(n,l,co) in enumerate(stats):
        sx=mx+i*(sw+16); card(sx, yt+82, sw, 76, r=14)
        text(sx+16, yt+98, n, FB, 26, co)
        text(sx+16, yt+134, l, F, 11.5, S500)
    # property grid
    text(mx, yt+182, "Jednotky", FB, 15, INK)
    gw=(mw-2*16)/3
    names=["Byt 3+kk · A2","Byt 2+kk · A3","Byt 4+kk · B1"]
    for i,nm in enumerate(names):
        gx=mx+i*(gw+16); card(gx, yt+206, gw, 132, r=14)
        photo(gx, yt+206, gw, 72, r=14)
        text(gx+12, yt+288, nm, FB, 12.5, INK)
        text(gx+12, yt+306, "předáno 2025", F, 10.5, S500)
        badge(gx+12, yt+322, "Aktivní", EMER)
    # timeline panel right? keep simple

# ===================================================================
#  SLIDES
# ===================================================================
def product_slide(label, head, sub, screen, n, panel=True, energy=False):
    slide()
    if panel:
        c.setFillColor(PANEL); c.rect(W*0.58, 0, W*0.42, H, fill=1, stroke=0)
    pill(80, 110, label)
    runs(80, 158, head, FB, 44)
    paragraph(80, 250, sub, F, 19, S600, 380)
    phone(W*0.79, 60, sh_h=600, scale=0.96, screen=screen)
    footer(); pageno(n)

# ---- 1 COVER ----
slide(INK)
# gradient backdrop
c.linearGradient(0,0,W,H,(HexColor("#7c3626"), HexColor("#b5543a"), HexColor("#c9785f")))
c.rect(0,0,W,H,fill=1,stroke=0)
# faint blueprint lines
c.setStrokeColor(Color(1,1,1,0.10)); c.setLineWidth(1)
for gx in range(0, W, 48): c.line(gx,0,gx,H)
for gy in range(0, H, 48): c.line(0,gy,W,gy)
# big house line-art
c.setStrokeColor(Color(1,1,1,0.18)); c.setLineWidth(2)
hx,hy=980,300
p=c.beginPath(); p.moveTo(hx-170,hy+60); p.lineTo(hx,hy+200); p.lineTo(hx+170,hy+60); c.drawPath(p,stroke=1,fill=0)
c.rect(hx-130,hy-120,260,180,stroke=1,fill=0)
c.rect(hx-70,hy-120,60,90,stroke=1,fill=0); c.rect(hx+20,hy-90,50,50,stroke=1,fill=0)
# bottom scrim
for i in range(60):
    a=0.012*i; c.setFillColor(Color(0,0,0,a)); c.rect(0, i*3, W, 3, fill=1, stroke=0)
# label
box(80, 316, 250, 30, r=15, fill=Color(1,1,1,0.16));
text(96, 325, "DOMOVNÍ PAS · 2026", FB, 12.5, white, track=1.5)
runs(80, 364, [("Pas, který přežije ", white)], FB, 60)
runs(80, 430, [("celou stavbu.", HexColor("#ffd9c9"))], FB, 60)
paragraph(80, 546, "Všechna data o domě na jednom místě — od předání developerem po celý život nemovitosti. Carfax pro dům či byt.", F, 19, Color(1,1,1,0.92), 760)
text(80, 648, "BULO · partner briefing pro developery", F, 14, Color(1,1,1,0.85))
pageno(1)
c.showPage()

# ---- 2 PROBLEM ----
slide()
pill(80, 104, "PROBLÉM")
runs(80, 152, [("Kde je revize? ", INK), ("A záruka?", TERRA)], FB, 50)
paragraph(80, 250, "Data o nemovitosti dnes skončí v krabici od bot, v e-mailech a v hlavě majitele. Při předání, reklamaci nebo prodeji nastává chaos — a dokumentace z výstavby se k majiteli často vůbec nedostane.", F, 20, S600, 940)
chips=[("Dokumenty v šuplíku a e-mailech",), ("Záruky propadnou nevyužité",), ("Předání = hromada PDF",), ("Při prodeji nic nedohledáte",)]
cx=80
for (lab,) in chips:
    cw=chip(cx, 392, lab); cx+=cw+14
# stat strip
for i,(n,l) in enumerate([("30 %","dat o budově se ztratí při předání"),("1,84 bil. $","ztráta odvětví špatnou správou dat (2020)"),("80 %","projektů přejede rozpočet")]):
    bx=80+i*393; box(bx, 470, 366, 110, r=16, fill=white, stroke=S200)
    text(bx+22, 492, n, FB, 30, TERRA)
    paragraph(bx+22, 536, l, F, 13.5, S600, 320, 1.25)
footer(); pageno(2)
c.showPage()

# ---- 3 IDEA (product, dashboard) ----
product_slide("ŘEŠENÍ",
    [("Jeden pas. ", INK), ("Celý ", TERRA), ("život domu.", TERRA)],
    "Veškerá historie, dokumenty a fotky nemovitosti na jednom místě. Developer pas založí a předá — majitel ho vede dál.",
    scr_dashboard, 3)
# mini step chips on left
for i,(lab) in enumerate(["Předání","Údržba","Prodej"]):
    chip(80+i*120, 360, lab)
c.showPage()

# ---- 4 WHO / TWO SIDES ----
slide()
pill(80, 104, "PRO KOHO")
runs(80, 152, [("Hodnota pro ", INK), ("obě strany.", TERRA)], FB, 48)
# two columns
colw=540; gap=40; cyt=240
# developer
box(80, cyt, colw, 360, r=20, fill=white, stroke=S200)
icon_tile(110, cyt+30, "house", 52)
text(176, cyt+34, "DEVELOPER", FB, 13, TERRA, track=1.2)
text(176, cyt+54, "platí · zakládá · předává", F, 13, S500)
devs=["Prémiové chytré předání jako diferenciace prodeje","Méně dotazů a reklamací po kolaudaci na jednom místě","Marketingový nástroj a white-label pod vlastním brandem","Doklad o kvalitě a kompletní dokumentaci stavby"]
yy=cyt+108
for d in devs:
    circle(112, yy+8, 3.5, fill=TERRA); paragraph(126, yy, d, F, 15.5, S700, colw-80, 1.3); yy+=54
# owner
ox=80+colw+gap
box(ox, cyt, colw, 360, r=20, fill=INK)
icon_tile(ox+30, cyt+30, "shield", 52, tile=Color(1,1,1,0.12), fg=HexColor("#ffd9c9"))
text(ox+96, cyt+34, "MAJITEL", FB, 13, HexColor("#ffd9c9"), track=1.2)
text(ox+96, cyt+54, "vede · využívá · platí dál", F, 13, Color(1,1,1,0.6))
ows=["Vše o domě po ruce — i za 10 let","Hlídání záruk = reálně ušetřené peníze","Připomínky revizí, nic nepropásne","Doporučení na úspory a dotace (zateplení)","Vyšší a snazší prodej díky historii"]
yy=cyt+108
for d in ows:
    circle(ox+32, yy+8, 3.5, fill=HexColor("#ffd9c9")); paragraph(ox+46, yy, d, F, 15, Color(1,1,1,0.9), colw-80, 1.3); yy+=48
footer(); pageno(4)
c.showPage()

# ---- 5 WHAT IT DOES (feature grid) ----
slide()
pill(80, 104, "CO TO UMÍ")
runs(80, 152, [("Osm věcí, ", INK), ("pořádně.", TERRA)], FB, 48)
feats=[("doc","Trezor dokumentů","PENB, smlouvy, projekt, revize"),
       ("clock","Časová osa","Opravy, závady, revize, rekonstrukce"),
       ("camera","Fotodokumentace","Skutečné provedení a stav"),
       ("shield","Záruky a reklamace","Hlídání lhůt, výzvy k nápravě"),
       ("bell","Revize a připomínky","Kotel, komín, plyn, elektro"),
       ("box","Vybavení a manuály","Spotřebiče, záruční listy"),
       ("leaf","Energetika a dotace","Třída, doporučení, úspory"),
       ("share","Sdílení a převod","QR a předání novému majiteli")]
gx0=80; gy0=240; cw=278; ch=150; gapx=20; gapy=20
for i,(kd,t,d) in enumerate(feats):
    col=i%4; row=i//4
    x=gx0+col*(cw+gapx); y=gy0+row*(ch+gapy)
    box(x, y, cw, ch, r=16, fill=white, stroke=S200)
    icon_tile(x+20, y+20, kd, 50)
    text(x+20, y+86, t, FB, 16, INK)
    paragraph(x+20, y+110, d, F, 12.5, S500, cw-40, 1.25)
footer(); pageno(5)
c.showPage()

# ---- 6 PRODUCT: Historie ----
product_slide("PRODUKT · HISTORIE",
    [("Každá oprava. ", INK), ("Navždy.", TERRA)],
    "Časová osa nahradí krabici od bot. Oprava, závada, revize i rekonstrukce — s datem, náklady a fotkami.",
    scr_timeline, 6)
c.showPage()

# ---- 7 PRODUCT: Warranty (renewal hook) ----
product_slide("PRODUKT · ZÁRUKY",
    [("Než vyprší ", INK), ("záruka.", TERRA)],
    "Appka hlídá záruční lhůty novostavby a včas vyzve k reklamaci. Tohle je důvod, proč majitel platí i druhý rok.",
    scr_warranty, 7)
c.showPage()

# ---- 8 PRODUCT: Documents ----
product_slide("PRODUKT · DOKLADY",
    [("Trezor, který ", INK), ("se neztratí.", TERRA)],
    "Všechny dokumenty roztříděné podle kategorií — PENB, smlouvy, projekt, revize, faktury, záruční listy.",
    scr_docs, 8)
c.showPage()

# ---- 9 PRODUCT: Energy ----
product_slide("PRODUKT · ENERGETIKA",
    [("Kdy se vyplatí ", INK), ("zateplit.", TERRA)],
    "Energetická třída a konkrétní doporučení s odhadem úspory, návratnosti a dostupných dotací. Silné hlavně pro starší fond.",
    scr_energy, 9)
c.showPage()

# ---- 10 PC + MOBILE ----
slide()
c.setFillColor(PANEL); c.rect(0, 0, W, H, fill=1, stroke=0)
c.setFillColor(PAPER); c.rect(0, 0, W, 250, fill=1, stroke=0)
pill(80, 96, "MOBIL I POČÍTAČ")
runs(80, 142, [("Na stavbě i ", INK), ("u stolu.", TERRA)], FB, 40)
browser(80, 218, 752, 404, url="bulo.cz/prehled", screen=scr_pc)
phone(998, 232, sh_h=470, scale=0.82, screen=scr_dash_mini)
text(80, 648, "Responzivní web pro správce a developery · nativní pocit v mobilu pro majitele", F, 14, S600)
pageno(10)
c.showPage()

# ---- 11 BUSINESS MODEL ----
slide()
pill(80, 104, "BYZNYS MODEL")
runs(80, 152, [("Developer ", INK), ("rozjede, ", TERRA), ("majitel ", INK), ("udrží.", TERRA)], FB, 42)
# two price cards + flow
box(80, 250, 360, 200, r=20, fill=white, stroke=S200)
text(110, 282, "ROK 1 · DEVELOPER", FB, 13, TERRA, track=1)
runs(110, 312, [("1 000 Kč",INK),(" / rok",S500)], FB, 38)
text(110, 366, "za jednotku · platí developer", F, 13.5, S600)
text(110, 392, "Zakládá pas, naplní daty, předá", F, 13.5, S600)
text(110, 418, "klientovi jako prémiový bonus", F, 13.5, S600)
# arrow
text(470, 330, "→", FB, 40, S400)
box(540, 250, 360, 200, r=20, fill=INK)
text(570, 282, "ROK 2+ · MAJITEL", FB, 13, HexColor("#ffd9c9"), track=1)
runs(570, 312, [("300 Kč",white),(" / rok",Color(1,1,1,0.6))], FB, 38)
text(570, 366, "obnova přístupu · platí majitel", F, 13.5, Color(1,1,1,0.85))
text(570, 392, "Háček: záruky, revize, dotace —", F, 13.5, Color(1,1,1,0.85))
text(570, 418, "důvody platit dál", F, 13.5, Color(1,1,1,0.85))
# growth loop card
box(940, 250, 260, 200, r=20, fill=mix(EMER,0.9), stroke=mix(EMER,0.5))
icon_tile(966, 276, "share", 44, tile=white, fg=EMER)
text(966, 330, "Růstová smyčka", FB, 15, INK)
paragraph(966, 356, "Při prodeji se pas převede na nového majitele — a platí dál. Jedna jednotka generuje příjem napořád.", F, 12.5, S700, 210, 1.3)
# bottom note
box(80, 480, 1120, 96, r=16, fill=white, stroke=S200)
text(104, 502, "Proč to funguje", FB, 14, INK)
paragraph(104, 526, "Developer fakticky zaplatí akvizici i onboarding (náklad na získání zákazníka ~0) a dodá naplněná data. Hodnota firmy roste s obnovující se základnou majitelů, ne s jednorázovým poplatkem.", F, 14, S600, 1060, 1.3)
footer(); pageno(11)
c.showPage()

# ---- 12 MARKET ----
slide()
pill(80, 104, "TRH A PŘÍLEŽITOST")
runs(80, 152, [("Díra: ", INK), ("předání dat.", TERRA)], FB, 46)
paragraph(80, 232, "Data z výstavby se skoro nikdy nedostanou do provozu k majiteli — doložená handover gap. BULO ji řeší na rezidenční úrovni, kde to nikdo pořádně nedělá.", F, 19, S600, 1080)
cards=[("Vstup","Novostavby od developerů","ČR dokončí řádově desítky tisíc bytů ročně; jeden projekt = 100–300 jednotek najednou.",TERRA,"house"),
       ("Rozšíření","Starší fond + sekundární trh","Energetika, dotace a compliance (EPBD) — recurring potřeba milionů budov.",BLUE,"leaf"),
       ("Později","SVJ, správci, EU","Stejná data, větší a recurring zákazník; lokalizace jako konkurenční příkop.",VIOLET,"share")]
for i,(tag,t,d,co,kd) in enumerate(cards):
    bx=80+i*393; box(bx, 330, 366, 250, r=18, fill=white, stroke=S200)
    icon_tile(bx+24, 360, kd, 50, tile=mix(co,0.86), fg=co)
    text(bx+24, 426, tag.upper(), FB, 12, co, track=1.2)
    paragraph(bx+24, 446, t, FB, 18, INK, 320, 1.15)
    paragraph(bx+24, 502, d, F, 13.5, S600, 320, 1.3)
footer(); pageno(12)
c.showPage()

# ---- 13 TECH / BUILT TO SCALE ----
slide()
pill(80, 104, "POSTAVENO NA ŠKÁLOVÁNÍ")
runs(80, 152, [("Moderní, ", INK), ("štíhlý stack.", TERRA)], FB, 46)
paragraph(80, 232, "Funkční prototyp už běží. Postaveno na rychlém, levně provozovatelném a škálovatelném základu.", F, 19, S600, 1000)
tech=[("Frontend","Next.js 16 · React 19 · TypeScript · Tailwind v4","doc"),
      ("Data a cache","Supabase (Postgres) · Upstash Redis","box"),
      ("AI vrstva","Anthropic SDK — extrakce dat z dokladů, doporučení","leaf"),
      ("Nasazení","Vercel · náhledové deploye na každý push","share")]
for i,(t,d,kd) in enumerate(tech):
    col=i%2; row=i//2
    bx=80+col*560; by=320+row*130
    box(bx, by, 540, 110, r=16, fill=white, stroke=S200)
    icon_tile(bx+22, by+24, kd, 54)
    text(bx+92, by+28, t, FB, 17, INK)
    paragraph(bx+92, by+54, d, F, 14, S600, 420, 1.3)
footer(); pageno(13)
c.showPage()

# ---- 14 MVP ----
slide()
c.setFillColor(PANEL); c.rect(W*0.62,0,W*0.38,H,fill=1,stroke=0)
pill(80, 104, "CO POLETÍ PRVNÍ")
runs(80, 152, [("MVP — ", INK), ("celá smyčka.", TERRA)], FB, 44)
paragraph(80, 224, "První verze pokryje celý okruh: developer založí a předá → majitel vede a obnoví.", F, 18, S600, 600)
v1=["Založení nemovitosti + import dat developerem","Trezor dokumentů (PENB, smlouvy, projekt, revize)","Časová osa: opravy, závady, revize, rekonstrukce","Záruky a připomínky s upozorněním","Sdílení a převod (QR) na nového majitele","Report / export do PDF"]
yy=334
text(80, 304, "V první verzi", FB, 14, TERRA);
for d in v1:
    circle(90, yy+8, 9, fill=mix(EMER,0.85));
    c.setStrokeColor(EMER); c.setLineWidth(2)
    line(86, yy+8, 89, yy+11, EMER,2); line(89, yy+11, 95, yy+4, EMER,2)
    paragraph(112, yy, d, F, 15.5, S700, 560, 1.3); yy+=46
# later panel
text(W*0.66, 150, "POZDĚJI", FB, 13, TERRA, track=1.2)
later=["AI extrakce dat z faktur a PDF","Energetická doporučení + dotace","Modul pro SVJ a správce portfolia","White-label pro developery"]
ly=190
for d in later:
    circle(W*0.66+6, ly+8, 3.5, fill=S400); paragraph(W*0.66+22, ly, d, F, 14.5, S600, 360, 1.25); ly+=52
footer(); pageno(14)
c.showPage()

# ---- 15 VISION / ROADMAP ----
slide(INK)
c.linearGradient(0,0,W,H,(HexColor("#2a211e"), HexColor("#5c2f22")))
c.rect(0,0,W,H,fill=1,stroke=0)
box(80, 100, 130, 30, r=15, fill=Color(1,1,1,0.14)); text(96, 109, "VIZE", FB, 12.5, white, track=1.5)
runs(80, 148, [("Od pasu domu ", white), ("k OS budovy.", HexColor("#ffd9c9"))], FB, 46)
stages=[("TEĎ","Domovní pas pro novostavby","Developer zakládá a předává; majitel vede historii, doklady a záruky.",TERRA),
        ("6–12 MĚS.","Majitel a energetika","Obnovy, AI extrakce dokladů, doporučení a dotace na úspory.",BRASS),
        ("12+ MĚS.","SVJ, správci a EU","Recurring B2B, compliance (EPBD), lokalizace na další trhy.",HexColor("#ffd9c9"))]
for i,(t,h,d,co) in enumerate(stages):
    bx=80+i*380; box(bx, 280, 350, 280, r=18, fill=Color(1,1,1,0.06), stroke=Color(1,1,1,0.14))
    box(bx+24, 308, 8, 8, r=4, fill=co); text(bx+44, 302, t, FB, 15, co, track=1)
    paragraph(bx+24, 346, h, FB, 20, white, 300, 1.15)
    paragraph(bx+24, 410, d, F, 14.5, Color(1,1,1,0.78), 300, 1.35)
pageno(15)
c.showPage()

# ---- 16 CLOSING ----
slide(INK)
_top=HexColor("#c2664c"); _bot=HexColor("#8f3f2c"); nb=140
for i in range(nb):
    t=i/(nb-1)
    col=Color(_top.red+(_bot.red-_top.red)*t, _top.green+(_bot.green-_top.green)*t, _top.blue+(_bot.blue-_top.blue)*t)
    c.setFillColor(col); c.rect(0, H-(i+1)*(H/nb), W, H/nb+1, fill=1, stroke=0)
# faint blueprint grid
c.setStrokeColor(Color(1,1,1,0.07)); c.setLineWidth(1)
for gx in range(0, W, 48): c.line(gx,0,gx,H)
for gy in range(0, H, 48): c.line(0,gy,W,gy)
runs(80, 250, [("Postavme pas, který", white)], FB, 56)
runs(80, 320, [("přežije celou stavbu.", HexColor("#ffe2d6"))], FB, 56)
paragraph(80, 420, "Domovní pas pro každou nemovitost — hodnota pro developera při předání i pro majitele po celý život domu.", F, 20, Color(1,1,1,0.92), 820)
box(80, 520, 2, 70, fill=Color(1,1,1,0.5))
text(104, 524, "BULO · domovní pas", FB, 18, white)
text(104, 552, "kristianvys@gmail.com", F, 15, Color(1,1,1,0.85))
text(104, 576, "partner briefing · 2026", F, 13, Color(1,1,1,0.7))
pageno(16)
c.showPage()

c.save()
print("WROTE", OUT)
