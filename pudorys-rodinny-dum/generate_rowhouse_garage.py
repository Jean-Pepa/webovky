# -*- coding: utf-8 -*-
"""
Řadový dům — TROJDOMEK, varianta S GARÁŽÍ V PŘÍZEMÍ.
Jedna jednotka 8,5 m (čelo) x 10,0 m (hloubka) = 85 m², 2 NP.
Garáž pro 1 auto vpravo vpředu, schodiště za garáží, obytná část vlevo + vzadu.
Návrh dle ČSN 73 4301, 73 4130, 73 4108, 73 6058, 73 0532.
"""
SCALE=60.0; WALL_EXT=0.30; WALL_INT=0.15; WALL_PARTY=0.30; WALL_LB=0.30
C_WALL="#3f3f46"; C_GLASS="#7fb2d6"; C_FURN="#c4c8cf"; C_TEXT="#1f2937"
C_DIM="#6b7280"; C_ROOM="#ffffff"; C_BG="#f7f7f5"; C_GREEN="#cfe3c4"; C_ROAD="#e7e7e4"
def P(v): return v*SCALE
def rect(x,y,w,h,fill="none",stroke="none",sw=0,rx=0,opacity=1.0,dash=None):
    d=f' stroke-dasharray="{dash}"' if dash else ""
    return (f'<rect x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" rx="{rx:.2f}" '
            f'fill="{fill}" stroke="{stroke}" stroke-width="{sw:.2f}" opacity="{opacity:.2f}"{d}/>')
def line(x1,y1,x2,y2,stroke=C_WALL,sw=1.0,dash=None,cap="butt"):
    d=f' stroke-dasharray="{dash}"' if dash else ""
    return (f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="{stroke}" '
            f'stroke-width="{sw:.2f}" stroke-linecap="{cap}"{d}/>')
def circle(cx,cy,r,fill="none",stroke=C_FURN,sw=1.0):
    return f'<circle cx="{cx:.2f}" cy="{cy:.2f}" r="{r:.2f}" fill="{fill}" stroke="{stroke}" stroke-width="{sw:.2f}"/>'
def text(x,y,s,size=13,fill=C_TEXT,anchor="middle",weight="400",style="normal",spacing=0):
    ls=f' letter-spacing="{spacing}"' if spacing else ""
    return (f'<text x="{x:.2f}" y="{y:.2f}" font-family="Helvetica,Arial,sans-serif" font-size="{size}" '
            f'fill="{fill}" text-anchor="{anchor}" font-weight="{weight}" font-style="{style}"{ls}>{s}</text>')
def path(d,fill="none",stroke=C_WALL,sw=1.0,dash=None):
    da=f' stroke-dasharray="{dash}"' if dash else ""
    return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw:.2f}"{da}/>'

class Floor:
    def __init__(self,ox,oy): self.ox=ox; self.oy=oy; self.s=[]
    def x(self,v): return self.ox+P(v)
    def y(self,v): return self.oy+P(v)
    def shell(self,W,H):
        self.W,self.H=W,H
        self.s.append(rect(self.x(0),self.y(0),P(W),P(H),fill=C_WALL))
        self.s.append(rect(self.x(WALL_EXT),self.y(WALL_EXT),P(W-2*WALL_EXT),P(H-2*WALL_EXT),fill=C_ROOM))
    def party_marks(self):
        for xx in (WALL_PARTY/2,self.W-WALL_PARTY/2):
            self.s.append(line(self.x(xx),self.y(0.1),self.x(xx),self.y(self.H-0.1),stroke="#6f6f78",sw=0.8,dash="5,4"))
    def wall(self,x1,y1,x2,y2,t=WALL_INT):
        if abs(y1-y2)<1e-6: self.s.append(rect(self.x(min(x1,x2)),self.y(y1-t/2),P(abs(x2-x1)),P(t),fill=C_WALL))
        else: self.s.append(rect(self.x(x1-t/2),self.y(min(y1,y2)),P(t),P(abs(y2-y1)),fill=C_WALL))
    def room(self,x1,y1,x2,y2,name,area=None,fontsize=13):
        if area is None: area=abs((x2-x1)*(y2-y1))
        cx=(x1+x2)/2; cy=(y1+y2)/2; lines=name.split("\n"); n=len(lines); lh=16
        y0=self.y(cy)-(n*lh)/2+11
        for i,ln in enumerate(lines): self.s.append(text(self.x(cx),y0+i*lh,ln,size=fontsize,weight="600",fill=C_TEXT))
        self.s.append(text(self.x(cx),y0+n*lh+1,f"{area:.1f}".replace(".",",")+" m²",size=fontsize-1,fill="#4b5563"))
    def label(self,cx,cy,name,area,fontsize=13): self.room(cx,cy,cx,cy,name,area=area,fontsize=fontsize)
    def door(self,orient,cx,cy,w,t=WALL_INT,hinge="start",opens="in"):
        pad=0.03
        if orient=='v':
            self.s.append(rect(self.x(cx-t/2-pad),self.y(cy-w/2),P(t+2*pad),P(w),fill=C_ROOM))
            hy=cy-w/2 if hinge=="start" else cy+w/2; along=-1 if hinge=="end" else 1; sx=-1 if opens=="left" else 1
            hp=(cx,hy); a=(cx,hy+along*w); b=(cx+sx*w,hy)
        else:
            self.s.append(rect(self.x(cx-w/2),self.y(cy-t/2-pad),P(w),P(t+2*pad),fill=C_ROOM))
            hx=cx-w/2 if hinge=="start" else cx+w/2; along=-1 if hinge=="end" else 1; sy=-1 if opens=="up" else 1
            hp=(hx,cy); a=(hx+along*w,cy); b=(hx,cy+sy*w)
        self.s.append(line(self.x(hp[0]),self.y(hp[1]),self.x(b[0]),self.y(b[1]),stroke="#9aa0a8",sw=1.4))
        r=P(w); cross=(a[0]-hp[0])*(b[1]-hp[1])-(a[1]-hp[1])*(b[0]-hp[0]); sweep=1 if cross>0 else 0
        self.s.append(path(f"M {self.x(a[0]):.2f} {self.y(a[1]):.2f} A {r:.2f} {r:.2f} 0 0 {sweep} {self.x(b[0]):.2f} {self.y(b[1]):.2f}",stroke="#9aa0a8",sw=1.0))
    def _wh(self,c,w,y0):
        t=WALL_EXT; self.s.append(rect(self.x(c-w/2),self.y(y0),P(w),P(t),fill=C_ROOM))
        self.s.append(line(self.x(c-w/2),self.y(y0+t/2),self.x(c+w/2),self.y(y0+t/2),stroke=C_GLASS,sw=2.2))
        self.s.append(line(self.x(c-w/2),self.y(y0),self.x(c+w/2),self.y(y0),stroke=C_WALL,sw=1.0))
        self.s.append(line(self.x(c-w/2),self.y(y0+t),self.x(c+w/2),self.y(y0+t),stroke=C_WALL,sw=1.0))
    def _wv(self,c,w,x0):
        t=WALL_EXT; self.s.append(rect(self.x(x0),self.y(c-w/2),P(t),P(w),fill=C_ROOM))
        self.s.append(line(self.x(x0+t/2),self.y(c-w/2),self.x(x0+t/2),self.y(c+w/2),stroke=C_GLASS,sw=2.2))
        self.s.append(line(self.x(x0),self.y(c-w/2),self.x(x0),self.y(c+w/2),stroke=C_WALL,sw=1.0))
        self.s.append(line(self.x(x0+t),self.y(c-w/2),self.x(x0+t),self.y(c+w/2),stroke=C_WALL,sw=1.0))
    def window(self,side,c,w):
        t=WALL_EXT
        if side=='top': self._wh(c,w,0)
        elif side=='bottom': self._wh(c,w,self.H-t)
        elif side=='left': self._wv(c,w,0)
        elif side=='right': self._wv(c,w,self.W-t)
    def slider(self,side,c,w):
        t=WALL_EXT; y0=0 if side=='top' else self.H-t
        self.s.append(rect(self.x(c-w/2),self.y(y0),P(w),P(t),fill=C_ROOM))
        self.s.append(line(self.x(c-w/2),self.y(y0+t*0.35),self.x(c+w/2),self.y(y0+t*0.35),stroke=C_GLASS,sw=2.2))
        self.s.append(line(self.x(c-w/2),self.y(y0+t*0.65),self.x(c+w/2),self.y(y0+t*0.65),stroke=C_GLASS,sw=2.2))
        self.s.append(line(self.x(c-w/2),self.y(y0),self.x(c+w/2),self.y(y0),stroke=C_WALL,sw=1.0))
        self.s.append(line(self.x(c-w/2),self.y(y0+t),self.x(c+w/2),self.y(y0+t),stroke=C_WALL,sw=1.0))
    def garage_door(self,c,w):
        t=WALL_EXT; y0=self.H-t
        self.s.append(rect(self.x(c-w/2),self.y(y0),P(w),P(t),fill=C_ROOM))
        self.s.append(line(self.x(c-w/2),self.y(y0+t*0.5),self.x(c+w/2),self.y(y0+t*0.5),stroke=C_WALL,sw=1.6))
        self.s.append(rect(self.x(c-w/2),self.y(y0-0.18),P(w),P(0.18),fill="none",stroke="#9aa0a8",sw=0.8,dash="4,3"))
    def stairs_U(self,x1,y1,x2,y2,direction="up"):
        w=x2-x1; mid=(x1+x2)/2; n=9; land=0.95; rail=0.07; sz=(y2-(y1+land)); sh=sz/n
        for i in range(n+1):
            yy=y2-i*sh; self.s.append(line(self.x(mid+rail),self.y(yy),self.x(x2-0.05),self.y(yy),stroke="#8a909a",sw=0.9))
        for i in range(n+1):
            yy=(y1+land)+i*sh; self.s.append(line(self.x(x1+0.05),self.y(yy),self.x(mid-rail),self.y(yy),stroke="#8a909a",sw=0.9))
        self.s.append(rect(self.x(mid-rail),self.y(y1+land),P(2*rail),P(sz),fill="none",stroke="#8a909a",sw=0.9))
        if direction=="up":
            ax=mid+w*0.25
            self.s.append(line(self.x(ax),self.y(y2-0.3),self.x(ax),self.y(y1+land+0.15),stroke="#5b6370",sw=1.3))
            self.s.append(path(f"M {self.x(ax-0.1):.2f} {self.y(y1+land+0.32):.2f} L {self.x(ax):.2f} {self.y(y1+land+0.1):.2f} L {self.x(ax+0.1):.2f} {self.y(y1+land+0.32):.2f}",stroke="#5b6370",sw=1.3))
            self.s.append(circle(self.x(ax),self.y(y2-0.3),2.2,fill="#5b6370",stroke="#5b6370"))
        else:
            ax=mid-w*0.25
            self.s.append(line(self.x(ax),self.y(y1+land+0.15),self.x(ax),self.y(y2-0.3),stroke="#5b6370",sw=1.3))
            self.s.append(path(f"M {self.x(ax-0.1):.2f} {self.y(y2-0.5):.2f} L {self.x(ax):.2f} {self.y(y2-0.28):.2f} L {self.x(ax+0.1):.2f} {self.y(y2-0.5):.2f}",stroke="#5b6370",sw=1.3))
    # nábytek
    def fr(self,x1,y1,x2,y2,rx=0.0): self.s.append(rect(self.x(x1),self.y(y1),P(x2-x1),P(y2-y1),fill="none",stroke=C_FURN,sw=1.1,rx=P(rx)))
    def bed(self,x1,y1,x2,y2,head="top"):
        self.fr(x1,y1,x2,y2,rx=0.05)
        if head=="top": self.s.append(rect(self.x(x1+0.08),self.y(y1+0.08),P((x2-x1)-0.16),P(0.35),fill="none",stroke=C_FURN,sw=0.9,rx=P(0.05)))
        else: self.s.append(rect(self.x(x1+0.08),self.y(y2-0.43),P((x2-x1)-0.16),P(0.35),fill="none",stroke=C_FURN,sw=0.9,rx=P(0.05)))
    def sofa(self,x1,y1,x2,y2):
        self.fr(x1,y1,x2,y2,rx=0.1); self.s.append(rect(self.x(x1+0.1),self.y(y1+0.1),P((x2-x1)-0.2),P((y2-y1)-0.25),fill="none",stroke=C_FURN,sw=0.8,rx=P(0.08)))
    def kitchen_v(self,x1,y1,x2,y2):
        self.fr(x1,y1,x2,y2); cx=(x1+x2)/2
        self.s.append(circle(self.x(cx),self.y(y1+0.45),P(0.16),stroke=C_FURN,sw=0.9))
        by=y1+1.15
        for dx,dy in [(-0.12,-0.12),(0.12,-0.12),(-0.12,0.12),(0.12,0.12)]: self.s.append(circle(self.x(cx+dx),self.y(by+dy),P(0.09),stroke=C_FURN,sw=0.8))
    def dining(self,cx,cy,w=1.3,h=0.9):
        self.fr(cx-w/2,cy-h/2,cx+w/2,cy+h/2,rx=0.05)
        for sx in (-1,1): self.s.append(rect(self.x(cx+sx*(w/2+0.05)),self.y(cy-0.22),P(0.04),P(0.44),fill=C_FURN,stroke="none"))
        for sy in (-1,1): self.s.append(rect(self.x(cx-0.28),self.y(cy+sy*(h/2+0.05)),P(0.56),P(0.04),fill=C_FURN,stroke="none"))
    def wardrobe(self,x1,y1,x2,y2):
        self.fr(x1,y1,x2,y2)
        if (x2-x1)>(y2-y1):
            nx=max(2,int((x2-x1)/0.5))
            for i in range(1,nx): xx=x1+(x2-x1)*i/nx; self.s.append(line(self.x(xx),self.y(y1),self.x(xx),self.y(y2),stroke=C_FURN,sw=0.6))
        else:
            ny=max(2,int((y2-y1)/0.5))
            for i in range(1,ny): yy=y1+(y2-y1)*i/ny; self.s.append(line(self.x(x1),self.y(yy),self.x(x2),self.y(yy),stroke=C_FURN,sw=0.6))
    def bath(self,x1,y1,x2,y2):
        self.fr(x1+0.05,y1+0.05,x1+1.70,y1+0.68,rx=0.08); self.s.append(circle(self.x(x1+1.52),self.y(y1+0.36),P(0.05),stroke=C_FURN,sw=0.8))
        self.s.append(rect(self.x(x2-0.55),self.y(y1+0.10),P(0.45),P(0.5),fill="none",stroke=C_FURN,sw=0.9,rx=P(0.06)))
        self.s.append(rect(self.x(x2-0.50),self.y(y2-0.62),P(0.40),P(0.5),fill="none",stroke=C_FURN,sw=0.9,rx=P(0.12)))
        self.fr(x1+0.05,y2-0.95,x1+0.95,y2-0.05); self.s.append(circle(self.x(x1+0.50),self.y(y2-0.50),P(0.05),stroke=C_FURN,sw=0.8))
    def wc(self,cx,cy): self.s.append(rect(self.x(cx-0.18),self.y(cy-0.25),P(0.36),P(0.5),fill="none",stroke=C_FURN,sw=0.9,rx=P(0.12)))
    def appliances(self,cx,cy):
        self.fr(cx-0.55,cy-0.28,cx-0.05,cy+0.28); self.s.append(circle(self.x(cx-0.3),self.y(cy),P(0.13),stroke=C_FURN,sw=0.9))
        self.fr(cx+0.05,cy-0.28,cx+0.55,cy+0.28); self.s.append(circle(self.x(cx+0.3),self.y(cy),P(0.13),stroke=C_FURN,sw=0.9))
    def car(self,x1,y1,x2,y2):
        self.s.append(rect(self.x(x1),self.y(y1),P(x2-x1),P(y2-y1),fill="#eef1f4",stroke=C_FURN,sw=1.3,rx=P(0.35)))
        self.s.append(rect(self.x(x1+0.18),self.y(y1+(y2-y1)*0.30),P((x2-x1)-0.36),P((y2-y1)*0.40),fill="none",stroke=C_FURN,sw=1.0,rx=P(0.2)))
        self.s.append(text(self.x((x1+x2)/2),self.y((y1+y2)/2)+4,"AUTO",size=9,fill="#aeb4bc",weight="600"))
        for wy in (y1+0.6,y2-0.6):
            self.s.append(rect(self.x(x1-0.06),self.y(wy-0.2),P(0.12),P(0.4),fill=C_FURN,stroke="none"))
            self.s.append(rect(self.x(x2-0.06),self.y(wy-0.2),P(0.12),P(0.4),fill=C_FURN,stroke="none"))
    def dim_h(self,x1,x2,y,label):
        ay=self.y(y); self.s.append(line(self.x(x1),ay,self.x(x2),ay,stroke=C_DIM,sw=0.8))
        for xx in (x1,x2): self.s.append(line(self.x(xx),ay-4,self.x(xx),ay+4,stroke=C_DIM,sw=0.8))
        self.s.append(text((self.x(x1)+self.x(x2))/2,ay-4,label,size=12,fill=C_DIM))
    def dim_v(self,y1,y2,x,label):
        ax=self.x(x); self.s.append(line(ax,self.y(y1),ax,self.y(y2),stroke=C_DIM,sw=0.8))
        for yy in (y1,y2): self.s.append(line(ax-4,self.y(yy),ax+4,self.y(yy),stroke=C_DIM,sw=0.8))
        my=(self.y(y1)+self.y(y2))/2
        self.s.append(f'<text x="{ax-6:.2f}" y="{my:.2f}" font-family="Helvetica,Arial,sans-serif" font-size="12" fill="{C_DIM}" text-anchor="middle" transform="rotate(-90 {ax-6:.2f} {my:.2f})">{label}</text>')
    def title(self,s): self.s.append(text(self.x(self.W/2),self.y(self.H)+50,s,size=17,weight="700",fill=C_TEXT,spacing=1))
    def render(self): return "\n".join(self.s)

W,H=8.5,10.0   # čelo x hloubka; dole=ulice, nahoře=zahrada

# ----------------------------- PŘÍZEMÍ ------------------------------------
g=Floor(95,135); g.shell(W,H); g.party_marks()
# zdi
g.wall(4.60,0.30,4.60,9.70,t=WALL_LB)       # nosná: dům | garáž (+ schodišťový blok)
g.wall(4.60,4.30,8.20,4.30,t=WALL_INT)      # garáž | schodišťový blok (vzadu)
g.wall(0.30,6.825,4.45,6.825,t=WALL_INT)    # obývací část | přední místnosti
g.wall(2.40,6.825,2.40,9.70,t=WALL_INT)     # zádveří | technická
g.wall(1.55,5.40,1.55,6.825,t=WALL_INT)     # WC pravá
g.wall(0.30,5.40,1.55,5.40,t=WALL_INT)      # WC horní
# okna / vrata
g.slider('top',2.10,2.4)                    # obývák -> zahrada
g.window('top',6.30,1.4)                    # schodišťový blok / podesta
g.window('bottom',1.40,1.2)                 # zádveří
g.window('bottom',3.40,0.9)                 # technická
g.garage_door(6.45,2.5)
# dveře
g.door('h',1.40,10.0-WALL_EXT/2,0.95,t=WALL_EXT,hinge="start",opens="up")   # vstup
g.door('h',1.30,6.825,0.90,hinge="start",opens="up")     # obývák <- zádveří
g.door('h',3.40,6.825,0.80,hinge="end",opens="up")       # obývák <- technická
g.door('v',1.55,6.10,0.60,hinge="start",opens="left")    # obývák -> WC
g.door('v',4.60,3.80,0.90,hinge="end",opens="left")      # obývák -> schodišťový blok (podesta)
g.door('h',6.10,4.30,0.90,hinge="start",opens="up")      # garáž -> schodišťový blok
# nábytek
g.kitchen_v(0.40,0.45,1.55,3.20)
g.dining(2.7,1.7)
g.sofa(0.50,4.6,2.6,5.7)
g.car(5.45,4.9,7.25,9.3)
g.appliances(3.4,8.6)
g.wc(0.92,6.05)
g.wardrobe(0.35,7.05,0.75,8.6)              # botník
# místnosti
g.room(0.30,0.30,4.45,6.70,"Obývací pokoj\n+ kuchyně + jídelna",area=24.2,fontsize=13)
g.label(0.92,6.05,"WC",1.7,fontsize=10)
g.label(1.35,8.30,"Zádveří",5.9,fontsize=12)
g.label(3.45,8.30,"Technická\nmístnost",5.7,fontsize=11)
g.label(6.45,6.55,"Garáž",18.4,fontsize=13)
g.label(6.30,3.80,"Chodba",fontsize=10,area=3.2)
g.label(6.80,1.70,"Schodiště",7.0,fontsize=11)
g.stairs_U(5.45,0.60,8.15,3.30,direction="up")
g.dim_h(0.0,8.5,-0.50,"8,50 m"); g.dim_v(0.0,10.0,-0.50,"10,00 m"); g.title("PŘÍZEMÍ  (1. NP)")

# ----------------------------- PATRO --------------------------------------
u=Floor(95+int(P(W))+130,135); u.shell(W,H); u.party_marks()
# zdi
u.wall(4.60,0.30,4.60,9.70,t=WALL_LB)        # nosná: dům | nad garáží + schodiště
u.wall(0.30,4.45,4.60,4.45,t=WALL_INT)       # zadní pokoje | chodba
u.wall(2.40,0.30,2.40,4.45,t=WALL_INT)       # koupelna | pokoj 3
u.wall(0.30,6.10,4.60,6.10,t=WALL_INT)       # chodba | pokoj 2
u.wall(4.60,4.30,8.20,4.30,t=WALL_INT)       # podesta schodiště | ložnice
# okna
u.window('top',1.35,1.0)                     # koupelna
u.window('top',3.40,1.2)                     # pokoj 3
u.window('top',6.40,1.4)                     # prosvětlení schodiště
u.window('bottom',2.40,1.6)                  # pokoj 2
u.window('bottom',6.40,2.0)                  # ložnice
# dveře
u.door('h',1.30,4.45,0.80,hinge="start",opens="up")     # chodba -> koupelna
u.door('h',3.30,4.45,0.80,hinge="end",opens="up")       # chodba -> pokoj 3
u.door('h',2.40,6.10,0.90,hinge="start",opens="down")   # chodba -> pokoj 2
u.door('v',4.60,5.30,0.90,hinge="start",opens="right")  # chodba -> ložnice
u.door('v',4.60,3.80,0.90,hinge="end",opens="left")     # chodba -> podesta/schodiště
# nábytek
u.bath(0.35,0.40,2.30,4.10)
u.bed(2.55,0.55,3.55,2.55,head="top")                   # pokoj 3
u.bed(0.55,8.05,1.55,9.55,head="bottom")                # pokoj 2
u.wardrobe(3.55,6.30,4.40,9.40)
u.bed(6.05,7.45,8.05,9.55,head="top")                   # ložnice (manželská)
u.wardrobe(4.75,6.35,6.00,6.95)
# místnosti
u.room(0.30,0.30,2.40,4.45,"Koupelna\n+ WC",area=8.7,fontsize=11)
u.room(2.40,0.30,4.45,4.45,"Pokoj",area=8.5,fontsize=12)
u.label(2.45,5.30,"Chodba",7.5)
u.label(6.80,1.70,"Schodiště",7.0,fontsize=11)
u.room(0.30,6.10,4.45,9.70,"Pokoj",area=14.9,fontsize=13)
u.room(4.60,4.30,8.20,9.70,"Ložnice",area=19.4,fontsize=14)
u.stairs_U(5.45,0.60,8.15,3.30,direction="down")
u.s.append(line(u.x(5.45),u.y(3.30),u.x(8.15),u.y(3.30),stroke="#8a909a",sw=1.4))  # zábradlí podesty
u.dim_h(0.0,8.5,-0.50,"8,50 m"); u.dim_v(0.0,10.0,-0.50,"10,00 m"); u.title("PATRO  (2. NP)")

# =========================== SITUACE – TROJDOMEK ===========================
SS=24
sit=[]; gx0=60
unit_w=8.5; garden_d=4.0; house_d=10.0; drive_d=5.0; road_d=3.0; total_w_m=3*unit_w
def sx(m): return gx0+m*SS
def sy(m): return m*SS
sit.append(rect(sx(0),sy(0),total_w_m*SS,garden_d*SS,fill=C_GREEN,opacity=0.5))
road_y=garden_d+house_d+drive_d
sit.append(rect(sx(-1.5),sy(road_y),(total_w_m+3)*SS,road_d*SS,fill=C_ROAD))
sit.append(text(sx(total_w_m/2),sy(road_y+road_d/2)+4,"PŘÍJEZDOVÁ KOMUNIKACE",size=11,fill="#9aa0a8",weight="600",spacing=1))
names=["DŮM 10","DŮM 11","DŮM 12"]
for i in range(3):
    bx=i*unit_w; hy0=garden_d
    fill="#eef0ee" if i!=1 else "#e4ecf5"
    sit.append(rect(sx(bx),sy(hy0),unit_w*SS,house_d*SS,fill=fill,stroke=C_WALL,sw=2.0))
    # garáž vpravo vpředu (schematicky)
    sit.append(rect(sx(bx+4.6),sy(hy0+4.3),3.4*SS,5.4*SS,fill="#f3f1ea",stroke="#b9bcc2",sw=1.0))
    sit.append(text(sx(bx+6.3),sy(hy0+7.0),"G",size=12,fill="#9aa0a8",weight="700"))
    sit.append(line(sx(bx),sy(hy0+6.9),sx(bx+4.45),sy(hy0+6.9),stroke="#b9bcc2",sw=0.8))
    sit.append(text(sx(bx+unit_w/2),sy(hy0+2.0),names[i],size=15,weight="800",fill="#2b3340" if i!=1 else "#1f4e79"))
    sit.append(text(sx(bx+unit_w/2),sy(hy0+2.0)+18,"85,00 m²",size=11,fill="#5b6370"))
    if i==1: sit.append(text(sx(bx+2.3),sy(hy0+9.4),"(řešená jednotka)",size=10,fill="#1f4e79",style="italic"))
    # sjezd před garáží + auto + strom
    sit.append(rect(sx(bx+4.6),sy(garden_d+house_d),3.4*SS,drive_d*SS,fill="#fbfbfa",stroke="#9aa0a8",sw=1.0,dash="5,4"))
    cx0=bx+5.35; cy0=garden_d+house_d+0.5
    sit.append(rect(sx(cx0),sy(cy0),1.8*SS,3.9*SS,fill="#dde6ee",stroke="#8a909a",sw=1.2,rx=0.30*SS))
    sit.append(rect(sx(cx0+0.2),sy(cy0+1.2),1.4*SS,1.6*SS,fill="none",stroke="#8a909a",sw=0.9,rx=0.15*SS))
    tx=bx+1.6; ty=garden_d+house_d+1.6
    sit.append(circle(sx(tx),sy(ty),0.8*SS,fill="#cfe3c4",stroke="#9bbf8a",sw=1.0))
    sit.append(circle(sx(tx),sy(ty),0.48*SS,fill="none",stroke="#9bbf8a",sw=0.8))
for i in (1,2):
    bx=i*unit_w; sit.append(line(sx(bx),sy(garden_d),sx(bx),sy(garden_d+house_d),stroke=C_WALL,sw=3.0))
sit.append(line(sx(0),sy(garden_d-0.6),sx(total_w_m),sy(garden_d-0.6),stroke=C_DIM,sw=0.8))
for xx in (0,total_w_m): sit.append(line(sx(xx),sy(garden_d-0.6)-4,sx(xx),sy(garden_d-0.6)+4,stroke=C_DIM,sw=0.8))
sit.append(text(sx(total_w_m/2),sy(garden_d-0.6)-4,"25,50 m  (3 × 8,50 m)",size=12,fill=C_DIM))
sit.append(text(sx(total_w_m/2),sy(0)-12,"SITUACE — TROJDOMEK  (3 jednotky, garáž + sjezd, zeleň)",size=15,weight="700",fill=C_TEXT,spacing=1))
sit.append(text(sx(total_w_m+0.3),sy(garden_d+2.0),"ZAHRADA",size=10,fill="#7a8a6a",anchor="start"))

# =============================== SVG =======================================
plans_h=135+int(P(H))+80
CW=95+2*int(P(W))+130+70
sit_h_px=(garden_d+house_d+drive_d+road_d)*SS+60
sit_ox=(CW-(total_w_m*SS))//2-30; sit_oy=plans_h+40
CH=sit_oy+sit_h_px+150
sit_group=f'<g transform="translate({sit_ox},{sit_oy})">'+"\n".join(sit)+"</g>"
head=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{CW}" height="{CH}" viewBox="0 0 {CW} {CH}">',
      rect(0,0,CW,CH,fill=C_BG),
      text(CW/2,46,"ŘADOVÝ DŮM — TROJDOMEK S GARÁŽÍ  ·  jednotka 8,5 × 10,0 m (85 m²)  ·  2 NP",size=21,weight="800",fill=C_TEXT,spacing=1),
      text(CW/2,70,"Garáž pro 1 auto v přízemí · sdílené mezibytové stěny · měřítko 1:100 · ČSN 73 4301, 73 4130, 73 4108, 73 6058, 73 0532",size=12,fill="#6b7280")]
ly=sit_oy+sit_h_px+6
legend=[rect(70,ly,CW-160,122,fill="#ffffff",stroke="#e4e4e7",sw=1,rx=8),
        text(92,ly+24,"LEGENDA",size=13,weight="700",fill=C_TEXT,anchor="start")]
def sample(x,y,kind):
    o=[]
    if kind=='wall': o.append(rect(x,y-7,34,10,fill=C_WALL))
    elif kind=='party': o.append(rect(x,y-7,34,10,fill=C_WALL)); o.append(line(x+17,y-7,x+17,y+3,stroke="#cfd2d6",sw=1.2,dash="3,3"))
    elif kind=='window': o.append(rect(x,y-7,34,10,fill=C_ROOM,stroke=C_WALL,sw=0.8)); o.append(line(x,y-2,x+34,y-2,stroke=C_GLASS,sw=2.2))
    elif kind=='door': o.append(path(f"M {x} {y+3} A 22 22 0 0 0 {x+22} {y-19}",stroke="#9aa0a8",sw=1)); o.append(line(x,y+3,x,y-19,stroke="#9aa0a8",sw=1.4))
    elif kind=='furn': o.append(rect(x,y-9,30,14,fill="none",stroke=C_FURN,sw=1.1,rx=3))
    return o
row=[("wall","nosné / dělící zdivo"),("party","mezibytová akustická stěna"),("window","okno / prosklení"),("door","dveře"),("furn","zařízení")]
cx=212
for kind,lab in row:
    legend+=sample(cx,ly+22,kind); legend.append(text(cx+44,ly+26,lab,size=11,fill=C_TEXT,anchor="start")); cx+=270
notes=[
 "Přízemí (1. NP): obývací pokoj s kuchyní a jídelnou 24,2 · garáž 18,4 · schodiště 7,0 · zádveří 5,9 · technická m. 5,7 · chodba 3,2 · WC 1,7 m²",
 "Patro (2. NP): ložnice 19,4 · pokoj 14,9 · pokoj 8,5 · koupelna s WC 8,7 · schodiště 7,0 · chodba 7,5 m²",
 "Konstrukce: obvodové i mezibytové (akustické) stěny 300 mm (R'w ≥ 53 dB, ČSN 73 0532), příčky 150 mm · konstrukční výška 3,0 m · garáž 3,4 × 5,4 m, vrata 2,5 m (ČSN 73 6058).",
 "Pozn.: čelo 8,5 m s vnitřní garáží je úsporově hraniční (garáž ubírá ~40 % šířky) — pro komfortnější dispozici je vhodnější čelo ~10 m nebo venkovní stání.",
]
ny=ly+50
for nt in notes: legend.append(text(92,ny,nt,size=10.5,fill="#52525b",anchor="start")); ny+=15
out="\n".join(head)+"\n"+g.render()+"\n"+u.render()+"\n"+sit_group+"\n"+"\n".join(legend)+"\n</svg>"
open("pudorys-rodinny-dum/trojdomek-garaz.svg","w",encoding="utf-8").write(out)
print("SVG",CW,"x",CH)
import cairosvg
cairosvg.svg2png(url="pudorys-rodinny-dum/trojdomek-garaz.svg",write_to="pudorys-rodinny-dum/trojdomek-garaz.png",scale=2.0)
print("PNG ok")
