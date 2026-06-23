# -*- coding: utf-8 -*-
"""
Generátor 2D půdorysu rodinného domu 10,0 x 8,5 m, dvoupodlažní, s garáží.
Návrh respektuje doporučené architektonické rozměry a normy:
  - ČSN 73 4301  Obytné budovy (minimální plochy a šířky místností)
  - ČSN 73 6058  Garáže (jednotlivá garáž, stání pro osobní automobil)
  - ČSN 73 4130  Schodiště a šikmé rampy
  - ČSN 73 4108  Hygienická zařízení a šatny

Výstup: SVG (vektor) + PNG náhled.
Souřadnice jsou v metrech, počátek vlevo nahoře, osa Y směřuje dolů.
"""

import math

# ----------------------------------------------------------------------------
#  Globální nastavení kresby
# ----------------------------------------------------------------------------
SCALE = 72.0           # px na metr
WALL_EXT = 0.30        # tloušťka obvodové zdi (m)
WALL_INT = 0.15        # tloušťka příčky (m)
WALL_LB = 0.30         # tloušťka nosné vnitřní zdi (m)

C_WALL = "#3f3f46"     # barva zdí
C_GLASS = "#7fb2d6"    # sklo oken
C_FURN = "#c4c8cf"     # nábytek (světle šedá)
C_TEXT = "#1f2937"     # texty
C_DIM = "#6b7280"      # kóty
C_ROOM = "#ffffff"     # podlaha místností
C_BG = "#f7f7f5"       # pozadí

svg = []

def P(v):
    """metry -> px"""
    return v * SCALE

# ----------------------------------------------------------------------------
#  Pomocné kreslicí funkce (pracují v px, transformaci řeší volající přes ox,oy)
# ----------------------------------------------------------------------------
def rect(x, y, w, h, fill="none", stroke="none", sw=0, rx=0, opacity=1.0, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return (f'<rect x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" '
            f'rx="{rx:.2f}" fill="{fill}" stroke="{stroke}" stroke-width="{sw:.2f}" '
            f'opacity="{opacity:.2f}"{d}/>')

def line(x1, y1, x2, y2, stroke=C_WALL, sw=1.0, dash=None, cap="butt"):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return (f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" '
            f'stroke="{stroke}" stroke-width="{sw:.2f}" stroke-linecap="{cap}"{d}/>')

def circle(cx, cy, r, fill="none", stroke=C_FURN, sw=1.0):
    return (f'<circle cx="{cx:.2f}" cy="{cy:.2f}" r="{r:.2f}" fill="{fill}" '
            f'stroke="{stroke}" stroke-width="{sw:.2f}"/>')

def text(x, y, s, size=13, fill=C_TEXT, anchor="middle", weight="400", style="normal", spacing=0):
    ls = f' letter-spacing="{spacing}"' if spacing else ""
    return (f'<text x="{x:.2f}" y="{y:.2f}" font-family="Helvetica,Arial,sans-serif" '
            f'font-size="{size}" fill="{fill}" text-anchor="{anchor}" '
            f'font-weight="{weight}" font-style="{style}"{ls}>{s}</text>')

def path(d, fill="none", stroke=C_WALL, sw=1.0, dash=None):
    da = f' stroke-dasharray="{dash}"' if dash else ""
    return (f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw:.2f}"{da}/>')


class Floor:
    """Jedno podlaží, kreslí se s posunem (ox, oy) v px."""
    def __init__(self, ox, oy):
        self.ox = ox
        self.oy = oy
        self.s = []

    # převod metry -> absolutní px
    def x(self, v): return self.ox + P(v)
    def y(self, v): return self.oy + P(v)

    # --- obvodové zdivo ---
    def shell(self, W, H):
        # vnější obrys = zeď, vnitřní = podlaha
        self.s.append(rect(self.x(0), self.y(0), P(W), P(H), fill=C_WALL))
        self.s.append(rect(self.x(WALL_EXT), self.y(WALL_EXT),
                           P(W - 2*WALL_EXT), P(H - 2*WALL_EXT), fill=C_ROOM))

    # --- vnitřní zeď (úsečka v ose s tloušťkou) ---
    def wall(self, x1, y1, x2, y2, t=WALL_INT):
        if abs(y1 - y2) < 1e-6:          # vodorovná
            self.s.append(rect(self.x(min(x1, x2)), self.y(y1 - t/2),
                               P(abs(x2 - x1)), P(t), fill=C_WALL))
        else:                            # svislá
            self.s.append(rect(self.x(x1 - t/2), self.y(min(y1, y2)),
                               P(t), P(abs(y2 - y1)), fill=C_WALL))

    # --- místnost: bílá výplň + popis ---
    def room(self, x1, y1, x2, y2, name, area=None, fontsize=13, dy_extra=0.0):
        if area is None:
            area = abs((x2 - x1) * (y2 - y1))
        cx = (x1 + x2) / 2
        cy = (y1 + y2) / 2
        lines = name.split("\n")
        n = len(lines)
        line_h = 17
        y0 = self.y(cy) - (n*line_h)/2 + 12 + P(dy_extra)
        for i, ln in enumerate(lines):
            self.s.append(text(self.x(cx), y0 + i*line_h, ln, size=fontsize,
                               weight="600", fill=C_TEXT))
        self.s.append(text(self.x(cx), y0 + n*line_h + 2,
                           f"{area:.1f}".replace(".", ",") + " m²",
                           size=fontsize-1, fill="#4b5563", weight="400"))

    def label(self, cx, cy, name, area, fontsize=13):
        self.room(cx, cy, cx, cy, name, area=area, fontsize=fontsize)

    # --- dveře: vyčistí otvor + nakreslí křídlo a otáčení ---
    def door(self, orient, cx, cy, w, t=WALL_INT, hinge="start", opens="in"):
        # vyčistit otvor (bílá)
        pad = 0.03
        if orient == 'v':
            self.s.append(rect(self.x(cx - t/2 - pad), self.y(cy - w/2),
                               P(t + 2*pad), P(w), fill=C_ROOM))
            hy = cy - w/2 if hinge == "start" else cy + w/2
            along = -1 if hinge == "end" else 1     # ve směru +y od pantu
            sx = -1 if opens == "left" else 1
            hinge_pt = (cx, hy)
            a = (cx, hy + along*w)
            b = (cx + sx*w, hy)
        else:  # 'h'
            self.s.append(rect(self.x(cx - w/2), self.y(cy - t/2 - pad),
                               P(w), P(t + 2*pad), fill=C_ROOM))
            hx = cx - w/2 if hinge == "start" else cx + w/2
            along = -1 if hinge == "end" else 1     # ve směru +x od pantu
            sy = -1 if opens == "up" else 1
            hinge_pt = (hx, cy)
            a = (hx + along*w, cy)
            b = (hx, cy + sy*w)
        # křídlo (otevřené)
        self.s.append(line(self.x(hinge_pt[0]), self.y(hinge_pt[1]),
                           self.x(b[0]), self.y(b[1]), stroke="#9aa0a8", sw=1.4))
        # oblouk otáčení
        r = P(w)
        # sweep flag tak, aby oblouk šel "kratší" cestou přes vnější roh
        cross = (a[0]-hinge_pt[0])*(b[1]-hinge_pt[1]) - (a[1]-hinge_pt[1])*(b[0]-hinge_pt[0])
        sweep = 1 if cross > 0 else 0
        self.s.append(path(
            f"M {self.x(a[0]):.2f} {self.y(a[1]):.2f} "
            f"A {r:.2f} {r:.2f} 0 0 {sweep} {self.x(b[0]):.2f} {self.y(b[1]):.2f}",
            stroke="#9aa0a8", sw=1.0))

    # --- okno na obvodové zdi ---
    def window(self, side, c, w):
        t = WALL_EXT
        if side == 'top':
            y0 = 0
            self.s.append(rect(self.x(c - w/2), self.y(y0), P(w), P(t), fill=C_ROOM))
            self.s.append(line(self.x(c - w/2), self.y(t/2), self.x(c + w/2), self.y(t/2),
                               stroke=C_GLASS, sw=2.2))
            self.s.append(line(self.x(c - w/2), self.y(0), self.x(c + w/2), self.y(0), stroke=C_WALL, sw=1.0))
            self.s.append(line(self.x(c - w/2), self.y(t), self.x(c + w/2), self.y(t), stroke=C_WALL, sw=1.0))
        elif side == 'bottom':
            y0 = self.H - t
            self.s.append(rect(self.x(c - w/2), self.y(y0), P(w), P(t), fill=C_ROOM))
            self.s.append(line(self.x(c - w/2), self.y(y0 + t/2), self.x(c + w/2), self.y(y0 + t/2),
                               stroke=C_GLASS, sw=2.2))
            self.s.append(line(self.x(c - w/2), self.y(y0), self.x(c + w/2), self.y(y0), stroke=C_WALL, sw=1.0))
            self.s.append(line(self.x(c - w/2), self.y(y0 + t), self.x(c + w/2), self.y(y0 + t), stroke=C_WALL, sw=1.0))
        elif side == 'left':
            x0 = 0
            self.s.append(rect(self.x(x0), self.y(c - w/2), P(t), P(w), fill=C_ROOM))
            self.s.append(line(self.x(t/2), self.y(c - w/2), self.x(t/2), self.y(c + w/2),
                               stroke=C_GLASS, sw=2.2))
            self.s.append(line(self.x(0), self.y(c - w/2), self.x(0), self.y(c + w/2), stroke=C_WALL, sw=1.0))
            self.s.append(line(self.x(t), self.y(c - w/2), self.x(t), self.y(c + w/2), stroke=C_WALL, sw=1.0))
        elif side == 'right':
            x0 = self.W - t
            self.s.append(rect(self.x(x0), self.y(c - w/2), P(t), P(w), fill=C_ROOM))
            self.s.append(line(self.x(x0 + t/2), self.y(c - w/2), self.x(x0 + t/2), self.y(c + w/2),
                               stroke=C_GLASS, sw=2.2))
            self.s.append(line(self.x(x0), self.y(c - w/2), self.x(x0), self.y(c + w/2), stroke=C_WALL, sw=1.0))
            self.s.append(line(self.x(x0 + t), self.y(c - w/2), self.x(x0 + t), self.y(c + w/2), stroke=C_WALL, sw=1.0))

    # --- garážová sekční vrata na čelní (spodní) zdi ---
    def garage_door(self, c, w):
        t = WALL_EXT
        y0 = self.H - t
        self.s.append(rect(self.x(c - w/2), self.y(y0), P(w), P(t), fill=C_ROOM))
        # rám
        self.s.append(line(self.x(c - w/2), self.y(y0 + t*0.5), self.x(c + w/2), self.y(y0 + t*0.5),
                           stroke=C_WALL, sw=1.6))
        # naznačení panelů (čárkovaně dovnitř)
        self.s.append(rect(self.x(c - w/2), self.y(y0 - 0.18), P(w), P(0.18),
                           fill="none", stroke="#9aa0a8", sw=0.8, dash="4,3"))

    # --- schodiště U (dvouramenné) ---
    def stairs_U(self, x1, y1, x2, y2, direction="up"):
        # x1..x2 šířka, y1..y2 hloubka; nástup zdola (y2), výstup nahoru
        w = x2 - x1
        mid = (x1 + x2) / 2
        n = 9                      # stupňů na rameno
        # mezipodesta vzadu
        land = 0.95
        # pravé rameno (nahoru) x: mid..x2, y: y2..(y1+land)
        steps_zone = (y2 - (y1 + land))
        sh = steps_zone / n
        rail = 0.07
        # pravé rameno
        for i in range(n + 1):
            yy = y2 - i*sh
            self.s.append(line(self.x(mid + rail), self.y(yy), self.x(x2 - 0.05), self.y(yy),
                               stroke="#8a909a", sw=0.9))
        # levé rameno
        for i in range(n + 1):
            yy = (y1 + land) + i*sh
            self.s.append(line(self.x(x1 + 0.05), self.y(yy), self.x(mid - rail), self.y(yy),
                               stroke="#8a909a", sw=0.9))
        # zábradlí / zrcadlo uprostřed
        self.s.append(rect(self.x(mid - rail), self.y(y1 + land), P(2*rail), P(steps_zone),
                           fill="none", stroke="#8a909a", sw=0.9))
        # šipka směru
        if direction == "up":
            ax = mid + w*0.25
            self.s.append(line(self.x(ax), self.y(y2 - 0.3), self.x(ax), self.y(y1 + land + 0.15),
                               stroke="#5b6370", sw=1.3))
            self.s.append(path(f"M {self.x(ax-0.1):.2f} {self.y(y1+land+0.32):.2f} "
                               f"L {self.x(ax):.2f} {self.y(y1+land+0.1):.2f} "
                               f"L {self.x(ax+0.1):.2f} {self.y(y1+land+0.32):.2f}",
                               stroke="#5b6370", sw=1.3))
            self.s.append(circle(self.x(ax), self.y(y2 - 0.3), 2.2, fill="#5b6370", stroke="#5b6370"))
        else:
            ax = mid - w*0.25
            self.s.append(line(self.x(ax), self.y(y1 + land + 0.15), self.x(ax), self.y(y2 - 0.3),
                               stroke="#5b6370", sw=1.3))
            self.s.append(path(f"M {self.x(ax-0.1):.2f} {self.y(y2-0.5):.2f} "
                               f"L {self.x(ax):.2f} {self.y(y2-0.28):.2f} "
                               f"L {self.x(ax+0.1):.2f} {self.y(y2-0.5):.2f}",
                               stroke="#5b6370", sw=1.3))

    # ---------------- nábytek ----------------
    def furn_rect(self, x1, y1, x2, y2, rx=0.0):
        self.s.append(rect(self.x(x1), self.y(y1), P(x2-x1), P(y2-y1),
                           fill="none", stroke=C_FURN, sw=1.1, rx=P(rx)))

    def car(self, x1, y1, x2, y2):
        # zaoblené tělo
        self.s.append(rect(self.x(x1), self.y(y1), P(x2-x1), P(y2-y1),
                           fill="#eef1f4", stroke=C_FURN, sw=1.3, rx=P(0.35)))
        # kabina
        self.s.append(rect(self.x(x1+0.18), self.y(y1+(y2-y1)*0.30), P((x2-x1)-0.36), P((y2-y1)*0.40),
                           fill="none", stroke=C_FURN, sw=1.0, rx=P(0.2)))
        cx = (x1+x2)/2
        self.s.append(text(self.x(cx), self.y((y1+y2)/2)+4, "AUTO", size=10, fill="#aeb4bc", weight="600"))
        # kola
        for wy in (y1+0.55, y2-0.55):
            self.s.append(rect(self.x(x1-0.06), self.y(wy-0.2), P(0.12), P(0.4), fill=C_FURN, stroke="none"))
            self.s.append(rect(self.x(x2-0.06), self.y(wy-0.2), P(0.12), P(0.4), fill=C_FURN, stroke="none"))

    def bed(self, x1, y1, x2, y2, headside="top"):
        self.furn_rect(x1, y1, x2, y2, rx=0.05)
        # polštář(e)
        if headside == "top":
            self.s.append(rect(self.x(x1+0.08), self.y(y1+0.08), P((x2-x1)-0.16), P(0.35),
                               fill="none", stroke=C_FURN, sw=0.9, rx=P(0.05)))
        else:
            self.s.append(rect(self.x(x1+0.08), self.y(y2-0.43), P((x2-x1)-0.16), P(0.35),
                               fill="none", stroke=C_FURN, sw=0.9, rx=P(0.05)))

    def sofa(self, x1, y1, x2, y2):
        self.furn_rect(x1, y1, x2, y2, rx=0.1)
        self.s.append(rect(self.x(x1+0.1), self.y(y1+0.1), P((x2-x1)-0.2), P((y2-y1)-0.25),
                           fill="none", stroke=C_FURN, sw=0.8, rx=P(0.08)))

    def kitchen(self, x1, y1, x2, y2):
        # linka podél horní zdi
        self.furn_rect(x1, y1, x2, y2)
        # dřez
        self.s.append(circle(self.x(x1+0.45), self.y((y1+y2)/2), P(0.18), stroke=C_FURN, sw=0.9))
        # varná deska 4 ploténky
        bx = x1+1.15
        for ddx, ddy in [(-0.14,-0.12),(0.14,-0.12),(-0.14,0.12),(0.14,0.12)]:
            self.s.append(circle(self.x(bx+ddx), self.y((y1+y2)/2+ddy), P(0.10), stroke=C_FURN, sw=0.8))

    def bath_fixtures(self, x1, y1, x2, y2):
        # vana podél zadní (horní) stěny
        self.furn_rect(x1+0.55, y1+0.05, x1+2.25, y1+0.72, rx=0.1)
        self.s.append(circle(self.x(x1+2.05), self.y(y1+0.38), P(0.05), stroke=C_FURN, sw=0.8))
        # umyvadlo na pravé stěně
        self.s.append(rect(self.x(x2-0.52), self.y(y1+0.85), P(0.42), P(0.55), fill="none",
                           stroke=C_FURN, sw=0.9, rx=P(0.06)))
        # WC na pravé stěně dole
        self.s.append(rect(self.x(x2-0.52), self.y(y2-0.62), P(0.40), P(0.5), fill="none",
                           stroke=C_FURN, sw=0.9, rx=P(0.12)))

    def wc_fixture(self, cx, cy):
        self.s.append(rect(self.x(cx-0.18), self.y(cy-0.25), P(0.36), P(0.5), fill="none",
                           stroke=C_FURN, sw=0.9, rx=P(0.12)))

    def wardrobe(self, x1, y1, x2, y2):
        self.furn_rect(x1, y1, x2, y2)
        if (x2-x1) > (y2-y1):
            nx = max(2, int((x2-x1)/0.5))
            for i in range(1, nx):
                xx = x1 + (x2-x1)*i/nx
                self.s.append(line(self.x(xx), self.y(y1), self.x(xx), self.y(y2), stroke=C_FURN, sw=0.6))
        else:
            ny = max(2, int((y2-y1)/0.5))
            for i in range(1, ny):
                yy = y1 + (y2-y1)*i/ny
                self.s.append(line(self.x(x1), self.y(yy), self.x(x2), self.y(yy), stroke=C_FURN, sw=0.6))

    def dining(self, cx, cy, w=1.2, h=0.8):
        self.furn_rect(cx-w/2, cy-h/2, cx+w/2, cy+h/2, rx=0.05)
        for sx in (-1, 1):
            self.s.append(rect(self.x(cx+sx*(w/2+0.05)), self.y(cy-0.2), P(0.04), P(0.4), fill=C_FURN, stroke="none"))
        for sy in (-1, 1):
            self.s.append(rect(self.x(cx-0.25), self.y(cy+sy*(h/2+0.05)), P(0.5), P(0.04), fill=C_FURN, stroke="none"))

    def boiler(self, cx, cy):
        self.furn_rect(cx-0.25, cy-0.25, cx+0.25, cy+0.25)
        self.s.append(circle(self.x(cx), self.y(cy), P(0.12), stroke=C_FURN, sw=0.9))

    # --- kóta ---
    def dim_h(self, x1, x2, y, label):
        ay = self.y(y)
        self.s.append(line(self.x(x1), ay, self.x(x2), ay, stroke=C_DIM, sw=0.8))
        for xx in (x1, x2):
            self.s.append(line(self.x(xx), ay-4, self.x(xx), ay+4, stroke=C_DIM, sw=0.8))
        self.s.append(text((self.x(x1)+self.x(x2))/2, ay-4, label, size=12, fill=C_DIM))

    def dim_v(self, y1, y2, x, label):
        ax = self.x(x)
        self.s.append(line(ax, self.y(y1), ax, self.y(y2), stroke=C_DIM, sw=0.8))
        for yy in (y1, y2):
            self.s.append(line(ax-4, self.y(yy), ax+4, self.y(yy), stroke=C_DIM, sw=0.8))
        self.s.append(f'<text x="{ax-6:.2f}" y="{(self.y(y1)+self.y(y2))/2:.2f}" '
                      f'font-family="Helvetica,Arial,sans-serif" font-size="12" fill="{C_DIM}" '
                      f'text-anchor="middle" transform="rotate(-90 {ax-6:.2f} {(self.y(y1)+self.y(y2))/2:.2f})">{label}</text>')

    def title(self, s, W, H):
        self.s.append(text(self.x(W/2), self.y(H) + 54, s, size=18, weight="700", fill=C_TEXT, spacing=2))

    def render(self):
        return "\n".join(self.s)


# ============================================================================
#  ROZMĚRY DOMU
# ============================================================================
W = 10.0
H = 8.5

# ============================================================================
#  PŘÍZEMÍ
# ============================================================================
g = Floor(110, 140)
g.W, g.H = W, H
g.shell(W, H)

# --- vnitřní zdi ---
g.wall(6.05, 0.30, 6.05, 8.20, t=WALL_LB)      # nosná: dům / garáž
g.wall(6.20, 2.475, 9.70, 2.475, t=WALL_INT)   # garáž / technická
g.wall(0.30, 4.225, 5.90, 4.225, t=WALL_INT)   # obývací / vstupní zóna
g.wall(3.475, 4.30, 3.475, 8.20, t=WALL_INT)   # chodba / schodiště
g.wall(2.05, 4.30, 2.05, 5.575, t=WALL_INT)    # WC levá
g.wall(2.05, 5.50, 3.475, 5.50, t=WALL_INT)    # WC spodní
g.wall(1.55, 4.30, 1.55, 5.925, t=WALL_INT)    # spíž pravá
g.wall(0.30, 5.85, 1.625, 5.85, t=WALL_INT)    # spíž spodní

# --- okna ---
g.window('top', 1.55, 1.40)
g.window('top', 4.30, 1.40)
g.window('left', 2.20, 1.60)
g.window('left', 7.10, 1.00)
g.window('right', 5.40, 1.00)
g.window('right', 1.25, 0.80)

# --- dveře ---
g.door('h', 1.75, 8.50-WALL_EXT/2, 0.90, t=WALL_EXT, hinge="start", opens="up")   # vstupní
g.garage_door(7.95, 2.50)
g.door('h', 2.85, 4.225, 0.90, t=WALL_INT, hinge="end", opens="down")    # zádveří/obývák
g.door('v', 3.475, 7.30, 0.90, t=WALL_INT, hinge="start", opens="left")  # zádveří/schody
g.door('h', 2.72, 5.50, 0.70, t=WALL_INT, hinge="end", opens="down")     # WC
g.door('h', 0.95, 4.225, 0.70, t=WALL_INT, hinge="start", opens="down")  # spíž
g.door('v', 6.05, 1.05, 0.80, t=WALL_LB, hinge="start", opens="right")   # obývák/technická
g.door('h', 8.80, 2.475, 0.70, t=WALL_INT, hinge="start", opens="up")    # technická/garáž
g.door('v', 6.05, 6.90, 0.80, t=WALL_LB, hinge="end", opens="left")      # garáž/zádveří

# --- nábytek ---
g.kitchen(0.40, 0.40, 2.55, 0.95)
g.dining(3.5, 1.5, 1.4, 0.9)
g.sofa(0.45, 3.05, 2.45, 3.95)
g.furn_rect(5.55, 2.55, 5.83, 3.95)        # TV stěna u nosné zdi
g.furn_rect(4.55, 2.95, 5.25, 3.80, rx=0.1)  # křeslo
g.car(7.15, 3.15, 8.75, 7.55)
g.boiler(8.9, 1.0)
g.wc_fixture(3.10, 4.70)
g.wardrobe(0.35, 6.20, 0.75, 8.10)        # botník v zádveří

# --- místnosti (popisy) ---
g.room(0.30, 0.30, 5.90, 4.15, "Obývací pokoj\n+ kuchyně + jídelna", area=21.6, fontsize=14)
g.label(2.45, 7.15, "Zádveří + chodba", 8.9)
g.label(2.76, 4.86, "WC", 1.4, fontsize=11)
g.label(0.90, 5.05, "Spíž", 1.7, fontsize=11)
g.label(4.72, 6.30, "Schodiště", 9.2)
g.label(7.95, 5.60, "Garáž", 19.8, fontsize=14)
g.label(7.95, 1.35, "Technická\nmístnost", 7.4, fontsize=11)

g.stairs_U(3.55, 4.30, 5.90, 8.20, direction="up")

# --- kóty ---
g.dim_h(0.0, 10.0, -0.55, "10,00 m")
g.dim_v(0.0, 8.5, -0.55, "8,50 m")
g.dim_h(6.20, 9.70, 8.95, "3,50")
g.title("PŘÍZEMÍ  (1. NP)", W, H)


# ============================================================================
#  PATRO
# ============================================================================
u = Floor(110 + int(P(W)) + 170, 140)
u.W, u.H = W, H
u.shell(W, H)

# --- vnitřní zdi ---
u.wall(6.05, 0.30, 6.05, 8.20, t=WALL_LB)        # nosná dům / nad garáží
u.wall(3.475, 0.30, 3.475, 8.20, t=WALL_INT)     # levé pokoje / střed
u.wall(0.30, 3.625, 3.475, 3.625, t=WALL_INT)    # Pokoj1 / Pokoj2
u.wall(6.05, 2.775, 9.70, 2.775, t=WALL_INT)     # Koupelna / Ložnice
u.wall(3.475, 1.70, 6.05, 1.70, t=WALL_INT)      # šatna spodní (k chodbě)

# --- okna ---
u.window('top', 1.85, 1.40)
u.window('top', 7.95, 1.20)
u.window('left', 1.90, 1.20)
u.window('left', 6.00, 1.60)
u.window('right', 1.40, 0.90)
u.window('right', 5.50, 1.60)
u.window('bottom', 1.55, 1.30)
u.window('bottom', 8.20, 1.40)
u.window('bottom', 4.72, 0.90)

# --- dveře ---
u.door('v', 3.475, 2.90, 0.80, t=WALL_INT, hinge="start", opens="left")   # Pokoj1
u.door('v', 3.475, 4.05, 0.70, t=WALL_INT, hinge="end", opens="left")     # Pokoj2
u.door('h', 4.70, 1.70, 0.70, t=WALL_INT, hinge="start", opens="down")    # Šatna
u.door('v', 6.05, 2.20, 0.70, t=WALL_LB, hinge="start", opens="right")    # Koupelna
u.door('v', 6.05, 3.70, 0.80, t=WALL_LB, hinge="end", opens="right")      # Ložnice

# --- nábytek ---
u.bed(0.55, 0.55, 1.55, 2.55, headside="top")                   # Pokoj1 lůžko
u.wardrobe(2.55, 0.45, 3.30, 2.20)
u.bed(0.55, 6.10, 1.55, 8.10, headside="bottom")               # Pokoj2 lůžko
u.wardrobe(2.55, 4.70, 3.30, 6.20)
u.bed(7.55, 3.20, 9.55, 5.40, headside="top")                  # Ložnice manželská
u.wardrobe(6.30, 6.40, 9.55, 7.0)
u.bath_fixtures(6.25, 0.35, 9.65, 2.65)                        # koupelna
u.wardrobe(3.60, 0.45, 5.85, 0.95)                            # šatna police

# --- místnosti ---
u.room(0.30, 0.30, 3.40, 3.55, "Pokoj", area=10.0)
u.room(0.30, 3.70, 3.40, 8.20, "Pokoj", area=14.0)
u.room(3.55, 0.30, 5.90, 1.625, "Šatna", area=3.3, fontsize=11)
u.label(4.72, 3.0, "Chodba", 6.0)
u.label(4.72, 6.30, "Schodiště", 8.8)
u.room(6.20, 0.30, 9.70, 2.70, "Koupelna\n+ WC", area=8.4, fontsize=12)
u.room(6.20, 2.85, 9.70, 8.20, "Ložnice", area=18.7, fontsize=14)

u.stairs_U(3.55, 4.45, 5.90, 8.20, direction="down")
# zábradlí podél schodišťového otvoru
u.s.append(line(u.x(3.60), u.y(4.45), u.x(5.85), u.y(4.45), stroke="#8a909a", sw=1.4))

# --- kóty ---
u.dim_h(0.0, 10.0, -0.55, "10,00 m")
u.dim_v(0.0, 8.5, -0.55, "8,50 m")
u.title("PATRO  (2. NP)", W, H)


# ============================================================================
#  SESTAVENÍ SVG
# ============================================================================
CW = 110 + 2*int(P(W)) + 170 + 90
CH = 140 + int(P(H)) + 240

header = []
header.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{CW}" height="{CH}" '
              f'viewBox="0 0 {CW} {CH}">')
header.append(rect(0, 0, CW, CH, fill=C_BG))
# horní titulek
header.append(text(CW/2, 52, "RODINNÝ DŮM 10,0 × 8,5 m — DVOUPODLAŽNÍ S GARÁŽÍ",
                   size=24, weight="800", fill=C_TEXT, spacing=1))
header.append(text(CW/2, 78, "Dispoziční studie / půdorysy  ·  měřítko 1:100  ·  návrh dle ČSN 73 4301, 73 6058, 73 4130, 73 4108",
                   size=13, fill="#6b7280"))

# legenda + poznámky dole
ly = 140 + int(P(H)) + 95
legend = []
legend.append(rect(110, ly, CW-200, 110, fill="#ffffff", stroke="#e4e4e7", sw=1, rx=8))
lx = 130
legend.append(text(lx, ly+26, "LEGENDA", size=13, weight="700", fill=C_TEXT, anchor="start"))
# vzorky
def sample(x, y, kind):
    out = []
    if kind == 'wall':
        out.append(rect(x, y-7, 34, 10, fill=C_WALL))
    elif kind == 'window':
        out.append(rect(x, y-7, 34, 10, fill=C_ROOM, stroke=C_WALL, sw=0.8))
        out.append(line(x, y-2, x+34, y-2, stroke=C_GLASS, sw=2.2))
    elif kind == 'door':
        out.append(path(f"M {x} {y+3} A 22 22 0 0 0 {x+22} {y-19}", stroke="#9aa0a8", sw=1))
        out.append(line(x, y+3, x, y-19, stroke="#9aa0a8", sw=1.4))
    elif kind == 'furn':
        out.append(rect(x, y-9, 30, 14, fill="none", stroke=C_FURN, sw=1.1, rx=3))
    return out

row = [("wall","nosné / dělící zdivo"), ("window","okno"), ("door","dveře"), ("furn","zařízení / nábytek")]
cx = lx + 120
for kind, lab in row:
    legend += sample(cx, ly+24, kind)
    legend.append(text(cx+44, ly+28, lab, size=12, fill=C_TEXT, anchor="start"))
    cx += 250

notes = [
    "Plochy přízemí (užitné): obývací pokoj s kuchyní 21,6 · zádveří+chodba 8,9 · spíž 1,7 · WC 1,4 · schodiště 9,2 · technická m. 7,4 · garáž 19,8 m²",
    "Plochy patra (užitné): ložnice 18,7 · pokoj 14,0 · pokoj 10,0 · koupelna s WC 8,4 · šatna 3,3 · chodba 6,0 · schodiště 8,8 m²",
    "Konstrukce: obvodové zdivo 300 mm, vnitřní nosná zeď 300 mm, příčky 150 mm · konstrukční výška podlaží 3,0 m · garáž pro 1 osobní automobil (stání 3,5 × 5,65 m).",
    "Schodiště dvouramenné, šířka ramene 0,95 m, 17 stupňů 176 × 270 mm (2h+b = 622 mm) dle ČSN 73 4130 · světlá výška obytných místností min. 2,6 m.",
]
ny = ly+52
for nt in notes:
    legend.append(text(lx, ny, nt, size=11, fill="#52525b", anchor="start"))
    ny += 16

footer = ['</svg>']

full = "\n".join(header) + "\n" + g.render() + "\n" + u.render() + "\n" + "\n".join(legend) + "\n" + "\n".join(footer)

with open("pudorys-rodinny-dum/pudorys.svg", "w", encoding="utf-8") as f:
    f.write(full)

print("SVG zapsáno:", "pudorys-rodinny-dum/pudorys.svg", "rozměr", CW, "x", CH)

# render PNG
try:
    import cairosvg
    cairosvg.svg2png(url="pudorys-rodinny-dum/pudorys.svg",
                     write_to="pudorys-rodinny-dum/pudorys.png", scale=2.2)
    print("PNG vyrenderováno.")
except Exception as e:
    print("PNG render selhal:", e)
