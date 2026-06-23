# -*- coding: utf-8 -*-
"""
Řadový rodinný dům — TROJDOMEK (3 spojené jednotky).
Jedna jednotka: 8,5 m (čelo) x 10,0 m (hloubka) = 85 m² zastavěné plochy, 2 NP.
Parkování venku (stání + strom před domem), bez vnitřní garáže — ekonomické řešení.

Návrh dle ČSN 73 4301, 73 4130, 73 4108; mezibytové stěny dle ČSN 73 0532 (akustika).
"""

SCALE = 60.0
WALL_EXT = 0.30
WALL_INT = 0.15
WALL_PARTY = 0.30      # mezibytová (akustická) stěna

C_WALL = "#3f3f46"
C_GLASS = "#7fb2d6"
C_FURN = "#c4c8cf"
C_TEXT = "#1f2937"
C_DIM = "#6b7280"
C_ROOM = "#ffffff"
C_BG = "#f7f7f5"
C_GREEN = "#cfe3c4"
C_ROAD = "#e7e7e4"

def P(v): return v * SCALE

def rect(x, y, w, h, fill="none", stroke="none", sw=0, rx=0, opacity=1.0, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return (f'<rect x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" rx="{rx:.2f}" '
            f'fill="{fill}" stroke="{stroke}" stroke-width="{sw:.2f}" opacity="{opacity:.2f}"{d}/>')

def line(x1, y1, x2, y2, stroke=C_WALL, sw=1.0, dash=None, cap="butt"):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return (f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="{stroke}" '
            f'stroke-width="{sw:.2f}" stroke-linecap="{cap}"{d}/>')

def circle(cx, cy, r, fill="none", stroke=C_FURN, sw=1.0):
    return f'<circle cx="{cx:.2f}" cy="{cy:.2f}" r="{r:.2f}" fill="{fill}" stroke="{stroke}" stroke-width="{sw:.2f}"/>'

def text(x, y, s, size=13, fill=C_TEXT, anchor="middle", weight="400", style="normal", spacing=0):
    ls = f' letter-spacing="{spacing}"' if spacing else ""
    return (f'<text x="{x:.2f}" y="{y:.2f}" font-family="Helvetica,Arial,sans-serif" font-size="{size}" '
            f'fill="{fill}" text-anchor="{anchor}" font-weight="{weight}" font-style="{style}"{ls}>{s}</text>')

def path(d, fill="none", stroke=C_WALL, sw=1.0, dash=None):
    da = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw:.2f}"{da}/>'


class Floor:
    def __init__(self, ox, oy):
        self.ox = ox; self.oy = oy; self.s = []
    def x(self, v): return self.ox + P(v)
    def y(self, v): return self.oy + P(v)

    def shell(self, W, H):
        self.W, self.H = W, H
        self.s.append(rect(self.x(0), self.y(0), P(W), P(H), fill=C_WALL))
        self.s.append(rect(self.x(WALL_EXT), self.y(WALL_EXT), P(W-2*WALL_EXT), P(H-2*WALL_EXT), fill=C_ROOM))

    def party_marks(self):
        # naznačení mezibytové (dvojité akustické) stěny – čárkovaná osa
        for xx in (WALL_PARTY/2, self.W - WALL_PARTY/2):
            self.s.append(line(self.x(xx), self.y(0.1), self.x(xx), self.y(self.H-0.1),
                               stroke="#6f6f78", sw=0.8, dash="5,4"))

    def wall(self, x1, y1, x2, y2, t=WALL_INT):
        if abs(y1-y2) < 1e-6:
            self.s.append(rect(self.x(min(x1,x2)), self.y(y1-t/2), P(abs(x2-x1)), P(t), fill=C_WALL))
        else:
            self.s.append(rect(self.x(x1-t/2), self.y(min(y1,y2)), P(t), P(abs(y2-y1)), fill=C_WALL))

    def room(self, x1, y1, x2, y2, name, area=None, fontsize=13):
        if area is None: area = abs((x2-x1)*(y2-y1))
        cx=(x1+x2)/2; cy=(y1+y2)/2
        lines=name.split("\n"); n=len(lines); lh=16
        y0=self.y(cy)-(n*lh)/2+11
        for i,ln in enumerate(lines):
            self.s.append(text(self.x(cx), y0+i*lh, ln, size=fontsize, weight="600", fill=C_TEXT))
        self.s.append(text(self.x(cx), y0+n*lh+1, f"{area:.1f}".replace(".",",")+" m²",
                           size=fontsize-1, fill="#4b5563"))

    def label(self, cx, cy, name, area, fontsize=13):
        self.room(cx, cy, cx, cy, name, area=area, fontsize=fontsize)

    def door(self, orient, cx, cy, w, t=WALL_INT, hinge="start", opens="in"):
        pad=0.03
        if orient=='v':
            self.s.append(rect(self.x(cx-t/2-pad), self.y(cy-w/2), P(t+2*pad), P(w), fill=C_ROOM))
            hy=cy-w/2 if hinge=="start" else cy+w/2
            along=-1 if hinge=="end" else 1
            sx=-1 if opens=="left" else 1
            hp=(cx,hy); a=(cx,hy+along*w); b=(cx+sx*w,hy)
        else:
            self.s.append(rect(self.x(cx-w/2), self.y(cy-t/2-pad), P(w), P(t+2*pad), fill=C_ROOM))
            hx=cx-w/2 if hinge=="start" else cx+w/2
            along=-1 if hinge=="end" else 1
            sy=-1 if opens=="up" else 1
            hp=(hx,cy); a=(hx+along*w,cy); b=(hx,cy+sy*w)
        self.s.append(line(self.x(hp[0]),self.y(hp[1]),self.x(b[0]),self.y(b[1]),stroke="#9aa0a8",sw=1.4))
        r=P(w)
        cross=(a[0]-hp[0])*(b[1]-hp[1])-(a[1]-hp[1])*(b[0]-hp[0])
        sweep=1 if cross>0 else 0
        self.s.append(path(f"M {self.x(a[0]):.2f} {self.y(a[1]):.2f} A {r:.2f} {r:.2f} 0 0 {sweep} "
                           f"{self.x(b[0]):.2f} {self.y(b[1]):.2f}", stroke="#9aa0a8", sw=1.0))

    def window(self, side, c, w):
        t=WALL_EXT
        if side=='top': x0=0; self._win_h(c,w,0)
        elif side=='bottom': self._win_h(c,w,self.H-t)
        elif side=='left': self._win_v(c,w,0)
        elif side=='right': self._win_v(c,w,self.W-t)
    def _win_h(self,c,w,y0):
        t=WALL_EXT
        self.s.append(rect(self.x(c-w/2),self.y(y0),P(w),P(t),fill=C_ROOM))
        self.s.append(line(self.x(c-w/2),self.y(y0+t/2),self.x(c+w/2),self.y(y0+t/2),stroke=C_GLASS,sw=2.2))
        self.s.append(line(self.x(c-w/2),self.y(y0),self.x(c+w/2),self.y(y0),stroke=C_WALL,sw=1.0))
        self.s.append(line(self.x(c-w/2),self.y(y0+t),self.x(c+w/2),self.y(y0+t),stroke=C_WALL,sw=1.0))
    def _win_v(self,c,w,x0):
        t=WALL_EXT
        self.s.append(rect(self.x(x0),self.y(c-w/2),P(t),P(w),fill=C_ROOM))
        self.s.append(line(self.x(x0+t/2),self.y(c-w/2),self.x(x0+t/2),self.y(c+w/2),stroke=C_GLASS,sw=2.2))
        self.s.append(line(self.x(x0),self.y(c-w/2),self.x(x0),self.y(c+w/2),stroke=C_WALL,sw=1.0))
        self.s.append(line(self.x(x0+t),self.y(c-w/2),self.x(x0+t),self.y(c+w/2),stroke=C_WALL,sw=1.0))

    def slider(self, side, c, w):
        # velké prosklení / posuvné dveře na zahradu (na horní/dolní stěně)
        t=WALL_EXT
        y0 = 0 if side=='top' else self.H-t
        self.s.append(rect(self.x(c-w/2),self.y(y0),P(w),P(t),fill=C_ROOM))
        self.s.append(line(self.x(c-w/2),self.y(y0+t*0.35),self.x(c+w/2),self.y(y0+t*0.35),stroke=C_GLASS,sw=2.2))
        self.s.append(line(self.x(c-w/2),self.y(y0+t*0.65),self.x(c+w/2),self.y(y0+t*0.65),stroke=C_GLASS,sw=2.2))
        self.s.append(line(self.x(c-w/2),self.y(y0),self.x(c+w/2),self.y(y0),stroke=C_WALL,sw=1.0))
        self.s.append(line(self.x(c-w/2),self.y(y0+t),self.x(c+w/2),self.y(y0+t),stroke=C_WALL,sw=1.0))

    def stairs_U(self, x1, y1, x2, y2, direction="up"):
        w=x2-x1; mid=(x1+x2)/2; n=9; land=0.95; rail=0.07
        sz=(y2-(y1+land)); sh=sz/n
        for i in range(n+1):
            yy=y2-i*sh
            self.s.append(line(self.x(mid+rail),self.y(yy),self.x(x2-0.05),self.y(yy),stroke="#8a909a",sw=0.9))
        for i in range(n+1):
            yy=(y1+land)+i*sh
            self.s.append(line(self.x(x1+0.05),self.y(yy),self.x(mid-rail),self.y(yy),stroke="#8a909a",sw=0.9))
        self.s.append(rect(self.x(mid-rail),self.y(y1+land),P(2*rail),P(sz),fill="none",stroke="#8a909a",sw=0.9))
        if direction=="up":
            ax=mid+w*0.25
            self.s.append(line(self.x(ax),self.y(y2-0.3),self.x(ax),self.y(y1+land+0.15),stroke="#5b6370",sw=1.3))
            self.s.append(path(f"M {self.x(ax-0.1):.2f} {self.y(y1+land+0.32):.2f} L {self.x(ax):.2f} {self.y(y1+land+0.1):.2f} "
                               f"L {self.x(ax+0.1):.2f} {self.y(y1+land+0.32):.2f}",stroke="#5b6370",sw=1.3))
            self.s.append(circle(self.x(ax),self.y(y2-0.3),2.2,fill="#5b6370",stroke="#5b6370"))
        else:
            ax=mid-w*0.25
            self.s.append(line(self.x(ax),self.y(y1+land+0.15),self.x(ax),self.y(y2-0.3),stroke="#5b6370",sw=1.3))
            self.s.append(path(f"M {self.x(ax-0.1):.2f} {self.y(y2-0.5):.2f} L {self.x(ax):.2f} {self.y(y2-0.28):.2f} "
                               f"L {self.x(ax+0.1):.2f} {self.y(y2-0.5):.2f}",stroke="#5b6370",sw=1.3))

    # ---- nábytek ----
    def fr(self,x1,y1,x2,y2,rx=0.0):
        self.s.append(rect(self.x(x1),self.y(y1),P(x2-x1),P(y2-y1),fill="none",stroke=C_FURN,sw=1.1,rx=P(rx)))
    def bed(self,x1,y1,x2,y2,head="top"):
        self.fr(x1,y1,x2,y2,rx=0.05)
        if head=="top": self.s.append(rect(self.x(x1+0.08),self.y(y1+0.08),P((x2-x1)-0.16),P(0.35),fill="none",stroke=C_FURN,sw=0.9,rx=P(0.05)))
        else: self.s.append(rect(self.x(x1+0.08),self.y(y2-0.43),P((x2-x1)-0.16),P(0.35),fill="none",stroke=C_FURN,sw=0.9,rx=P(0.05)))
    def sofa(self,x1,y1,x2,y2):
        self.fr(x1,y1,x2,y2,rx=0.1)
        self.s.append(rect(self.x(x1+0.1),self.y(y1+0.1),P((x2-x1)-0.2),P((y2-y1)-0.25),fill="none",stroke=C_FURN,sw=0.8,rx=P(0.08)))
    def kitchen_v(self,x1,y1,x2,y2):
        # svislá kuchyňská linka podél boční stěny
        self.fr(x1,y1,x2,y2)
        cx=(x1+x2)/2
        self.s.append(circle(self.x(cx),self.y(y1+0.45),P(0.16),stroke=C_FURN,sw=0.9))
        by=y1+1.15
        for dx,dy in [(-0.12,-0.12),(0.12,-0.12),(-0.12,0.12),(0.12,0.12)]:
            self.s.append(circle(self.x(cx+dx),self.y(by+dy),P(0.09),stroke=C_FURN,sw=0.8))
    def dining(self,cx,cy,w=1.3,h=0.9):
        self.fr(cx-w/2,cy-h/2,cx+w/2,cy+h/2,rx=0.05)
        for sx in (-1,1): self.s.append(rect(self.x(cx+sx*(w/2+0.05)),self.y(cy-0.22),P(0.04),P(0.44),fill=C_FURN,stroke="none"))
        for sy in (-1,1): self.s.append(rect(self.x(cx-0.28),self.y(cy+sy*(h/2+0.05)),P(0.56),P(0.04),fill=C_FURN,stroke="none"))
    def wardrobe(self,x1,y1,x2,y2):
        self.fr(x1,y1,x2,y2)
        if (x2-x1)>(y2-y1):
            nx=max(2,int((x2-x1)/0.5))
            for i in range(1,nx):
                xx=x1+(x2-x1)*i/nx; self.s.append(line(self.x(xx),self.y(y1),self.x(xx),self.y(y2),stroke=C_FURN,sw=0.6))
        else:
            ny=max(2,int((y2-y1)/0.5))
            for i in range(1,ny):
                yy=y1+(y2-y1)*i/ny; self.s.append(line(self.x(x1),self.y(yy),self.x(x2),self.y(yy),stroke=C_FURN,sw=0.6))
    def bath(self,x1,y1,x2,y2):
        # vana podél horní stěny + umyvadlo + WC + sprcha
        self.fr(x1+0.05,y1+0.05,x1+1.70,y1+0.70,rx=0.08)
        self.s.append(circle(self.x(x1+1.52),self.y(y1+0.37),P(0.05),stroke=C_FURN,sw=0.8))
        self.s.append(rect(self.x(x2-0.55),self.y(y1+0.10),P(0.45),P(0.5),fill="none",stroke=C_FURN,sw=0.9,rx=P(0.06)))
        self.s.append(rect(self.x(x2-0.50),self.y(y2-0.62),P(0.40),P(0.5),fill="none",stroke=C_FURN,sw=0.9,rx=P(0.12)))
        self.fr(x1+0.05,y2-0.95,x1+0.95,y2-0.05)  # sprchový kout
        self.s.append(circle(self.x(x1+0.50),self.y(y2-0.50),P(0.05),stroke=C_FURN,sw=0.8))
    def wc(self,cx,cy):
        self.s.append(rect(self.x(cx-0.18),self.y(cy-0.25),P(0.36),P(0.5),fill="none",stroke=C_FURN,sw=0.9,rx=P(0.12)))
    def desk(self,x1,y1,x2,y2):
        self.fr(x1,y1,x2,y2);
        self.s.append(circle(self.x((x1+x2)/2),self.y(y2+0.3),P(0.16),stroke=C_FURN,sw=0.9))
    def appliances(self,cx,cy):
        # kotel + pračka v technické
        self.fr(cx-0.55,cy-0.28,cx-0.05,cy+0.28); self.s.append(circle(self.x(cx-0.3),self.y(cy),P(0.13),stroke=C_FURN,sw=0.9))
        self.fr(cx+0.05,cy-0.28,cx+0.55,cy+0.28); self.s.append(circle(self.x(cx+0.3),self.y(cy),P(0.13),stroke=C_FURN,sw=0.9))

    def dim_h(self,x1,x2,y,label):
        ay=self.y(y); self.s.append(line(self.x(x1),ay,self.x(x2),ay,stroke=C_DIM,sw=0.8))
        for xx in (x1,x2): self.s.append(line(self.x(xx),ay-4,self.x(xx),ay+4,stroke=C_DIM,sw=0.8))
        self.s.append(text((self.x(x1)+self.x(x2))/2,ay-4,label,size=12,fill=C_DIM))
    def dim_v(self,y1,y2,x,label):
        ax=self.x(x); self.s.append(line(ax,self.y(y1),ax,self.y(y2),stroke=C_DIM,sw=0.8))
        for yy in (y1,y2): self.s.append(line(ax-4,self.y(yy),ax+4,self.y(yy),stroke=C_DIM,sw=0.8))
        my=(self.y(y1)+self.y(y2))/2
        self.s.append(f'<text x="{ax-6:.2f}" y="{my:.2f}" font-family="Helvetica,Arial,sans-serif" font-size="12" '
                      f'fill="{C_DIM}" text-anchor="middle" transform="rotate(-90 {ax-6:.2f} {my:.2f})">{label}</text>')
    def title(self,s):
        self.s.append(text(self.x(self.W/2),self.y(self.H)+50,s,size=17,weight="700",fill=C_TEXT,spacing=1))
    def note(self, cx, cy, s, size=10):
        self.s.append(text(self.x(cx), self.y(cy), s, size=size, fill="#8a8f98", style="italic"))
    def render(self): return "\n".join(self.s)


# ==========================================================================
W, H = 8.5, 10.0     # čelo x hloubka jedné jednotky
# Orientace: dole (y=H) = ulice/parkování, nahoře (y=0) = zahrada
# ==========================================================================

# ----------------------------- PŘÍZEMÍ ------------------------------------
g = Floor(95, 135)
g.shell(W, H)
g.party_marks()

# zdi
g.wall(0.30, 3.975, 8.20, 3.975)              # obývací | střed
g.wall(5.425, 3.975, 5.425, 9.70)             # pravý sloupec (schody/zádveří) | chodba+přední
g.wall(0.30, 6.825, 8.20, 6.825)              # střed/zádveří | přední místnosti
g.wall(1.55, 3.975, 1.55, 6.825)              # spíž+WC | chodba
g.wall(0.30, 5.40, 1.55, 5.40)                # spíž | WC
g.wall(2.775, 6.90, 2.775, 9.70)              # pracovna | technická

# okna / prosklení
g.slider('top', 4.55, 2.6)                    # obývák -> zahrada
g.window('top', 7.05, 1.5)                    # obývák
g.window('bottom', 1.4, 1.2)                  # pracovna
g.window('bottom', 4.0, 0.8)                  # technická

# dveře
g.door('h', 6.85, 10.0-WALL_EXT/2, 0.95, t=WALL_EXT, hinge="start", opens="up")   # vstup
g.door('v', 5.425, 8.30, 0.90, hinge="start", opens="left")     # zádveří -> chodba
g.door('v', 5.425, 5.30, 0.90, hinge="end",   opens="left")     # chodba -> schodiště
g.door('h', 3.40, 3.975, 1.10, hinge="start", opens="down")     # chodba -> obývák
g.door('h', 1.30, 6.825, 0.90, hinge="start", opens="up")       # chodba -> pracovna
g.door('h', 3.90, 6.825, 0.80, hinge="end",   opens="up")       # chodba -> technická
g.door('h', 0.95, 3.975, 0.70, hinge="start", opens="up")       # kuchyně -> spíž
g.door('v', 1.55, 6.10, 0.70, hinge="start", opens="left")      # chodba -> WC

# nábytek
g.kitchen_v(0.40, 0.45, 1.55, 3.30)
g.dining(3.2, 1.6)
g.sofa(5.0, 2.55, 7.9, 3.55)
g.wardrobe(7.7, 7.10, 8.10, 9.60)             # botník v zádveří
g.appliances(3.85, 8.6)
g.wc(0.92, 6.05)
g.desk(0.45, 8.9, 1.65, 9.3)

# místnosti
g.room(0.30, 0.30, 8.20, 3.90, "Obývací pokoj + kuchyně + jídelna", area=28.0, fontsize=13)
g.label(3.55, 5.30, "Chodba", 9.0)
g.label(0.92, 4.70, "Spíž", 1.7, fontsize=10)
g.label(0.92, 6.05, "WC", 1.7, fontsize=10)
g.label(6.80, 5.35, "Schodiště", 7.0)
g.label(1.50, 8.30, "Pracovna", 6.6, fontsize=12)
g.label(4.10, 8.30, "Technická\nmístnost", 6.7, fontsize=11)
g.label(6.85, 8.30, "Zádveří", 7.6, fontsize=12)

g.stairs_U(5.55, 4.10, 8.15, 6.75, direction="up")

g.dim_h(0.0, 8.5, -0.50, "8,50 m")
g.dim_v(0.0, 10.0, -0.50, "10,00 m")
g.note(4.25, 0.0-0.0, "")
g.title("PŘÍZEMÍ  (1. NP)")


# ----------------------------- PATRO --------------------------------------
u = Floor(95 + int(P(W)) + 130, 135)
u.shell(W, H)
u.party_marks()

# zdi
u.wall(0.30, 3.975, 8.20, 3.975)              # zadní pokoje | střed
u.wall(3.175, 0.30, 3.175, 3.975)             # koupelna | ložnice
u.wall(5.425, 3.975, 5.425, 6.75)             # chodba | zrcadlo schodiště
u.wall(0.30, 6.825, 8.20, 6.825)              # střed | přední pokoje
u.wall(3.475, 6.90, 3.475, 9.70)              # pokoj 2 | pokoj 3
u.wall(1.70, 3.975, 1.70, 5.55)               # šatna | chodba
u.wall(0.30, 5.55, 1.70, 5.55)                # šatna spodní

# okna
u.window('top', 1.55, 0.9)                    # koupelna
u.window('top', 5.50, 1.8)                    # ložnice
u.window('bottom', 1.50, 1.2)                 # pokoj 2
u.window('bottom', 5.50, 1.6)                 # pokoj 3

# dveře
u.door('h', 1.55, 3.975, 0.80, hinge="start", opens="up")    # chodba -> koupelna
u.door('h', 4.40, 3.975, 0.90, hinge="end",   opens="up")    # chodba -> ložnice
u.door('v', 1.70, 4.70, 0.70, hinge="start", opens="left")   # chodba -> šatna
u.door('h', 1.50, 6.825, 0.90, hinge="start", opens="down")  # chodba -> pokoj 2
u.door('h', 5.00, 6.825, 0.90, hinge="end",   opens="down")  # chodba -> pokoj 3

# nábytek
u.bath(0.35, 0.35, 3.05, 3.85)
u.bed(5.20, 0.55, 7.20, 2.75, head="top")     # ložnice (manželská)
u.wardrobe(3.35, 0.45, 3.95, 3.6)
u.wardrobe(0.40, 4.05, 1.55, 4.55)            # police v šatně
u.bed(0.55, 8.10, 1.55, 9.55, head="bottom")  # pokoj 2
u.wardrobe(2.30, 7.05, 3.30, 7.55)
u.bed(7.05, 7.45, 8.05, 9.55, head="top")     # pokoj 3
u.wardrobe(3.65, 7.65, 4.15, 9.40)

# místnosti
u.room(0.30, 0.30, 3.10, 3.90, "Koupelna\n+ WC", area=9.5, fontsize=12)
u.room(3.25, 0.30, 8.20, 3.90, "Ložnice", area=17.8, fontsize=14)
u.label(3.40, 5.30, "Chodba", 9.0)
u.label(0.95, 4.75, "Šatna", 2.0, fontsize=10)
u.label(6.85, 5.35, "Schodiště", 7.0)
u.room(0.30, 6.90, 3.40, 9.70, "Pokoj", area=8.7, fontsize=13)
u.room(3.55, 6.90, 8.20, 9.70, "Pokoj", area=13.0, fontsize=13)

u.stairs_U(5.55, 4.10, 8.15, 6.75, direction="down")
u.s.append(line(u.x(5.50), u.y(4.05), u.x(8.15), u.y(4.05), stroke="#8a909a", sw=1.4))  # zábradlí

u.dim_h(0.0, 8.5, -0.50, "8,50 m")
u.dim_v(0.0, 10.0, -0.50, "10,00 m")
u.title("PATRO  (2. NP)")


# =========================== SITUACE – TROJDOMEK ===========================
class Plot:
    def __init__(self, ox, oy, sc):
        self.ox=ox; self.oy=oy; self.sc=sc; self.s=[]
    def x(self,v): return self.ox+v*self.sc
    def y(self,v): return self.oy+v*self.sc
    def add(self,e): self.s.append(e)

sit = Plot(0, 0, 24)
SS = 24
# Rozvržení (m): nahoře zahrady, pak domy (10 m), pak stání (5 m), dole cesta (3.5 m)
# 3 jednotky x 8,5 m = 25,5 m šířka
unit_w = 8.5
gx0 = 60      # px posun
gy0 = 0
garden_d = 4.0
house_d = 10.0
park_d = 5.0
road_d = 3.0
total_w_m = 3*unit_w
def sx(m): return gx0 + m*SS
def sy(m): return gy0 + m*SS

# zahrady (nahoře)
sit.add(rect(sx(0), sy(0), total_w_m*SS, garden_d*SS, fill=C_GREEN, opacity=0.5))
# cesta (dole)
road_y = garden_d+house_d+park_d
sit.add(rect(sx(-1.5), sy(road_y), (total_w_m+3)*SS, road_d*SS, fill=C_ROAD))
sit.add(text(sx(total_w_m/2), sy(road_y+road_d/2)+4, "PŘÍJEZDOVÁ KOMUNIKACE", size=11, fill="#9aa0a8", weight="600", spacing=1))

names = ["DŮM 10", "DŮM 11", "DŮM 12"]
for i in range(3):
    bx = i*unit_w
    hy0 = garden_d
    # dům
    fill = "#eef0ee" if i!=1 else "#e4ecf5"
    sit.add(rect(sx(bx), sy(hy0), unit_w*SS, house_d*SS, fill=fill, stroke=C_WALL, sw=2.0))
    # naznačení vnitřní dispozice (schematicky): horní obytná zóna + linka
    sit.add(line(sx(bx), sy(hy0+4.0), sx(bx+unit_w), sy(hy0+4.0), stroke="#b9bcc2", sw=0.8))
    sit.add(line(sx(bx), sy(hy0+6.9), sx(bx+unit_w), sy(hy0+6.9), stroke="#b9bcc2", sw=0.8))
    sit.add(line(sx(bx+5.42), sy(hy0+4.0), sx(bx+5.42), sy(hy0+10.0), stroke="#b9bcc2", sw=0.8))
    # popis
    sit.add(text(sx(bx+unit_w/2), sy(hy0+2.0), names[i], size=15, weight="800",
                 fill="#2b3340" if i!=1 else "#1f4e79"))
    sit.add(text(sx(bx+unit_w/2), sy(hy0+2.0)+18, "85,00 m²", size=11, fill="#5b6370"))
    if i==1:
        sit.add(text(sx(bx+unit_w/2), sy(hy0+9.4), "(řešená jednotka)", size=10, fill="#1f4e79", style="italic"))
    # stání + auto před domem
    pcx = bx+unit_w/2
    sit.add(rect(sx(pcx-1.35), sy(garden_d+house_d+0.3), 2.7*SS, 4.5*SS, fill="#fbfbfa",
                 stroke="#9aa0a8", sw=1.0, dash="5,4"))
    # auto
    cx0=pcx-0.85; cy0=garden_d+house_d+0.7
    sit.add(rect(sx(cx0), sy(cy0), 1.7*SS, 3.8*SS, fill="#dde6ee", stroke="#8a909a", sw=1.2, rx=0.30*SS))
    sit.add(rect(sx(cx0+0.2), sy(cy0+1.1), 1.3*SS, 1.6*SS, fill="none", stroke="#8a909a", sw=0.9, rx=0.15*SS))
    # strom vedle stání
    tx = bx+0.8 if i==0 else bx+unit_w-0.8
    ty = garden_d+house_d+1.4
    sit.add(circle(sx(tx), sy(ty), 0.75*SS, fill="#cfe3c4", stroke="#9bbf8a", sw=1.0))
    sit.add(circle(sx(tx), sy(ty), 0.45*SS, fill="none", stroke="#9bbf8a", sw=0.8))
# party walls between units (zvýraznění)
for i in (1,2):
    bx=i*unit_w
    sit.add(line(sx(bx), sy(garden_d), sx(bx), sy(garden_d+house_d), stroke=C_WALL, sw=3.0))
# kóta celková šířka
sit.add(line(sx(0), sy(garden_d-0.6), sx(total_w_m), sy(garden_d-0.6), stroke=C_DIM, sw=0.8))
for xx in (0,total_w_m): sit.add(line(sx(xx), sy(garden_d-0.6)-4, sx(xx), sy(garden_d-0.6)+4, stroke=C_DIM, sw=0.8))
sit.add(text(sx(total_w_m/2), sy(garden_d-0.6)-4, "25,50 m  (3 × 8,50 m)", size=12, fill=C_DIM))
sit.add(text(sx(total_w_m/2), sy(0)-12, "SITUACE — TROJDOMEK  (3 jednotky, parkovací stání + zeleň)",
             size=15, weight="700", fill=C_TEXT, spacing=1))
sit.add(text(sx(total_w_m+0.3), sy(garden_d+2.0), "ZAHRADA", size=10, fill="#7a8a6a", anchor="start"))


# =============================== SVG =======================================
plans_h = 135 + int(P(H)) + 80
sit_w_px = (total_w_m)*SS + 200
sit_h_px = (garden_d+house_d+park_d+road_d)*SS + 60
CW = 95 + 2*int(P(W)) + 130 + 70
sit_ox = (CW - (total_w_m*SS))//2 - 30
sit_oy = plans_h + 40
CH = sit_oy + sit_h_px + 150

# přesun situace
sit.ox = sit_ox; sit.oy = sit_oy
# přegenerovat situaci s offsetem: jednoduché – obalíme do <g translate>
sit_group = f'<g transform="translate({sit_ox},{sit_oy})">' + "\n".join(sit.s) + "</g>"

head=[]
head.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{CW}" height="{CH}" viewBox="0 0 {CW} {CH}">')
head.append(rect(0,0,CW,CH,fill=C_BG))
head.append(text(CW/2, 46, "ŘADOVÝ DŮM — TROJDOMEK  ·  jednotka 8,5 × 10,0 m (85 m²)  ·  2 NP", size=22, weight="800", fill=C_TEXT, spacing=1))
head.append(text(CW/2, 70, "Ekonomické řešení: sdílené mezibytové stěny, kompaktní tvar, stohované instalace, venkovní stání  ·  měřítko 1:100  ·  ČSN 73 4301, 73 4130, 73 4108, 73 0532", size=12, fill="#6b7280"))

ly = sit_oy + sit_h_px + 6
legend=[]
legend.append(rect(70, ly, CW-160, 122, fill="#ffffff", stroke="#e4e4e7", sw=1, rx=8))
lx=92
legend.append(text(lx, ly+24, "LEGENDA", size=13, weight="700", fill=C_TEXT, anchor="start"))
def sample(x,y,kind):
    o=[]
    if kind=='wall': o.append(rect(x,y-7,34,10,fill=C_WALL))
    elif kind=='party':
        o.append(rect(x,y-7,34,10,fill=C_WALL)); o.append(line(x+17,y-7,x+17,y+3,stroke="#cfd2d6",sw=1.2,dash="3,3"))
    elif kind=='window':
        o.append(rect(x,y-7,34,10,fill=C_ROOM,stroke=C_WALL,sw=0.8)); o.append(line(x,y-2,x+34,y-2,stroke=C_GLASS,sw=2.2))
    elif kind=='door':
        o.append(path(f"M {x} {y+3} A 22 22 0 0 0 {x+22} {y-19}",stroke="#9aa0a8",sw=1)); o.append(line(x,y+3,x,y-19,stroke="#9aa0a8",sw=1.4))
    elif kind=='furn': o.append(rect(x,y-9,30,14,fill="none",stroke=C_FURN,sw=1.1,rx=3))
    return o
row=[("wall","nosné / dělící zdivo"),("party","mezibytová akustická stěna"),("window","okno / prosklení"),("door","dveře"),("furn","zařízení")]
cx=lx+120
for kind,lab in row:
    legend+=sample(cx,ly+22,kind); legend.append(text(cx+44,ly+26,lab,size=11,fill=C_TEXT,anchor="start")); cx+=270
notes=[
 "Přízemí (1. NP): obývací pokoj s kuchyní a jídelnou 28,0 · chodba 9,0 · zádveří 7,6 · technická m. 6,7 · pracovna 6,6 · schodiště 7,0 · spíž 1,7 · WC 1,7 m²",
 "Patro (2. NP): ložnice 17,8 · pokoj 13,0 · pokoj 8,7 · koupelna s WC 9,5 · chodba 9,0 · schodiště 7,0 · šatna 2,0 m²",
 "Konstrukce: obvodové zdivo 300 mm, mezibytové akustické stěny 300 mm (R'w ≥ 53 dB dle ČSN 73 0532), příčky 150 mm · konstrukční výška podlaží 3,0 m.",
 "Parkování: 1 venkovní stání 2,7 × 5,0 m před každým domem (dle ČSN 73 6056/73 6110) · okna pouze do ulice a na zahradu (mezibytové stěny bez otvorů).",
]
ny=ly+50
for nt in notes:
    legend.append(text(lx,ny,nt,size=10.5,fill="#52525b",anchor="start")); ny+=15

out = "\n".join(head)+"\n"+g.render()+"\n"+u.render()+"\n"+sit_group+"\n"+"\n".join(legend)+"\n</svg>"
with open("pudorys-rodinny-dum/trojdomek.svg","w",encoding="utf-8") as f: f.write(out)
print("SVG:", CW, "x", CH)
import cairosvg
cairosvg.svg2png(url="pudorys-rodinny-dum/trojdomek.svg", write_to="pudorys-rodinny-dum/trojdomek.png", scale=2.0)
print("PNG hotovo")
