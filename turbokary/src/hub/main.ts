// Rozcestník (volba hry) na webu TurboKár: TurboKáry na /kary, Mečovačka na /mece/.
// Obrázky karet a pozadí dodává Codex (public/img/hub/), do té doby kreslí CSS náhradu.
import "@fontsource/lilita-one/latin-400.css";
import "@fontsource/lilita-one/latin-ext-400.css";
import "@fontsource/baloo-2/latin-600.css";
import "@fontsource/baloo-2/latin-ext-600.css";
import "@fontsource/baloo-2/latin-800.css";
import "@fontsource/baloo-2/latin-ext-800.css";
import "../styles/hub.css";
import { img } from "../shared/assets";

interface GameCard {
  id: "kary" | "mece";
  href: string;
  title: string;
  logo: string | null;
  /** logo, které nemusí existovat (zkusí se načíst, jinak zůstane textové) */
  logoTry?: string;
  emoji: string;
  text: string;
  players: string;
  color: string;
}

const dev = import.meta.env.DEV;
const GAMES: GameCard[] = [
  {
    id: "kary",
    href: dev ? "/kary.html" : "/kary",
    title: "TurboKáry",
    logo: img("logo"),
    emoji: "🏎️",
    text: "Závody motokár se zvířátky. Telefon je volant — nakláněj ho a jeď.",
    players: "1–4 hráči + boti",
    color: "#ff7a1a",
  },
  {
    id: "mece",
    href: "/mece/",
    title: "Mečovačka",
    logo: null,
    logoTry: "/mece/img/logo.png",
    emoji: "⚔️",
    text: "Souboje s pěnovými meči na molu. Telefon je meč — co uděláš rukou, udělá meč.",
    players: "1–2 hráči",
    color: "#4fd1ff",
  },
];

const bg = img("hub/bg");
if (bg) document.body.style.setProperty("--hub-bg", `url("${bg}")`);

const root = document.getElementById("hub")!;
root.innerHTML = `
  <header class="hub-head">
    <h1>Vyber hru</h1>
    <p>Hra běží tady na PC, <b>ovladačem je tvůj telefon</b> — připojíš ho QR kódem ve hře.</p>
  </header>
  <nav class="hub-games">${GAMES.map((g, i) => {
    const pic = img(`hub/${g.id}`);
    const logo = g.logo
      ? `<img class="g-logo" src="${g.logo}" alt="${g.title}">`
      : `<span class="g-title" data-try="${g.logoTry ?? ""}">${g.title}</span>`;
    return `<a class="game game-${g.id}" href="${g.href}" style="--c:${g.color}" data-i="${i}">
      <span class="g-pic">${pic ? `<img src="${pic}" alt="">` : `<span class="g-emoji">${g.emoji}</span>`}</span>
      <span class="g-body">${logo}<span class="g-text">${g.text}</span><span class="g-meta">${g.players} · klávesa <kbd>${i + 1}</kbd></span></span>
    </a>`;
  }).join("")}</nav>
  <footer class="hub-foot">Nejlíp v Chromu nebo Edgi na velké obrazovce. Pohyb telefonu funguje jen přes https.</footer>`;

// logo Mečovačky (od Codexu) — když existuje, nahradí textový nadpis
root.querySelectorAll<HTMLElement>("[data-try]").forEach((el) => {
  const src = el.dataset.try;
  if (!src) return;
  const im = new Image();
  im.onload = () => {
    im.className = "g-logo";
    im.alt = el.textContent ?? "";
    el.replaceWith(im);
  };
  im.src = src;
});

// ovládání klávesnicí / dálkovým ovladačem: 1, 2, šipky, Enter
const cards = [...root.querySelectorAll<HTMLAnchorElement>(".game")];
let sel = 0;
const focus = (i: number) => {
  sel = (i + cards.length) % cards.length;
  cards[sel].focus();
};
addEventListener("keydown", (e) => {
  if (e.key === "1" || e.key === "2") location.href = cards[Number(e.key) - 1].href;
  else if (e.key === "ArrowRight" || e.key === "ArrowDown") focus(sel + 1);
  else if (e.key === "ArrowLeft" || e.key === "ArrowUp") focus(sel - 1);
});
cards.forEach((c, i) => c.addEventListener("focus", () => (sel = i)));
