/* Průvodce rybařením — Gorgova, delta Dunaje. Vše se renderuje z window.GUIDE_DATA. */
(function () {
  "use strict";
  const D = window.GUIDE_DATA;
  const $ = (sel) => document.querySelector(sel);

  /* ---------- pomocníci ---------- */
  function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null) continue;
        if (k === "class") el.className = v;
        else if (k === "html") el.innerHTML = v; // jen pro vlastní statické šablony, ne pro data
        else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v);
      }
    }
    for (const c of children.flat(Infinity)) {
      if (c == null) continue;
      el.append(c.nodeType ? c : document.createTextNode(String(c)));
    }
    return el;
  }
  const frag = (...children) => {
    const f = document.createDocumentFragment();
    children.flat(Infinity).forEach((c) => c && f.append(c));
    return f;
  };

  const SPECIES = D.speciesLabels || {};
  const speciesName = (id) => SPECIES[id] || id;

  const TYPE_INFO = {
    zakladna: { label: "Základna", color: "#0b0b0b", letter: "🏠" },
    jezero: { label: "Jezero", color: "#2a78d6", letter: "J" },
    kanal: { label: "Kanál", color: "#1baf7a", letter: "K" },
    rameno: { label: "Rameno Dunaje", color: "#eda100", letter: "R" },
    laguna: { label: "Laguna (Razim–Sinoe)", color: "#008300", letter: "L" },
    chranena: { label: "Přísně chráněná zóna (zákaz)", color: "#d03b3b", letter: "⛔" },
    orientace: { label: "Orientační bod", color: "#898781", letter: "•" }
  };
  // typy, které nejsou loviště (nezobrazují se jako karty, na mapě jsou vždy)
  const NON_SPOT = new Set(["zakladna", "chranena", "orientace"]);

  function verBadge(v) {
    return v >= 2
      ? h("span", { class: "badge v2", title: "Potvrzeno více nezávislými zdroji" }, "✓ ověřeno vícekrát")
      : h("span", { class: "badge v1", title: "Nalezeno jen v jednom zdroji — ber s rezervou" }, "~ jeden zdroj");
  }

  function haversineKm(a, b) {
    const R = 6371, rad = Math.PI / 180;
    const dLat = (b.lat - a.lat) * rad, dLon = (b.lon - a.lon) * rad;
    const s = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.asin(Math.sqrt(s));
  }

  /* ---------- téma ---------- */
  const themeBtn = $("#themeToggle");
  function applyTheme(t) {
    document.documentElement.dataset.theme = t;
    themeBtn.textContent = t === "dark" ? "☀️" : "🌙";
    try { localStorage.setItem("gorgova-theme", t); } catch (e) {}
  }
  const savedTheme = (() => { try { return localStorage.getItem("gorgova-theme"); } catch (e) { return null; } })();
  applyTheme(savedTheme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  themeBtn.addEventListener("click", () =>
    applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));

  /* ---------- hero ---------- */
  $("#heroLead").textContent = D.meta.heroLead;
  $("#heroStats").append(frag(D.meta.heroStats.map((s) =>
    h("div", { class: "stat-tile" },
      h("div", { class: "label" }, s.label),
      h("div", { class: "value" }, s.value),
      s.sub ? h("div", { class: "sub" }, s.sub) : null))));
  $("#heroNote").textContent = D.meta.heroNote;
  $("#mapLead").textContent = D.meta.mapLead;
  $("#fishLead").textContent = D.meta.fishLead;
  $("#seasonLead").textContent = D.meta.seasonLead;
  $("#rulesLead").textContent = D.meta.rulesLead;
  $("#footerNote").textContent = D.meta.footerNote;

  /* ---------- mapa ---------- */
  const map = L.map("map", { scrollWheelZoom: true });
  const home = D.meta.center;
  map.setView([home.lat, home.lon], 10);

  const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  const sat = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 18,
      attribution: "Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics"
    });
  L.control.layers({ "Mapa": osm, "Satelit": sat }, null, { position: "topright" }).addTo(map);
  L.control.scale({ imperial: false }).addTo(map);

  function pinIcon(spot) {
    const t = TYPE_INFO[spot.type] || TYPE_INFO.jezero;
    const small = spot.type === "orientace";
    const cls = "spot-pin" + (spot.type === "zakladna" ? " home" : "") +
      (spot.type === "chranena" ? " zone" : "") + (small ? " small" : "");
    const sz = small ? 20 : 30;
    return L.divIcon({
      className: "",
      html: `<div class="${cls}" style="background:${t.color}">${t.letter}</div>`,
      iconSize: [sz, sz],
      iconAnchor: [sz / 2, sz / 2],
      popupAnchor: [0, -sz / 2 + 1]
    });
  }

  const markers = new Map();
  const allBounds = [];
  D.spots.forEach((spot) => {
    const m = L.marker([spot.lat, spot.lon], { icon: pinIcon(spot), title: spot.name });
    const t = TYPE_INFO[spot.type] || TYPE_INFO.jezero;
    const isSpot = !NON_SPOT.has(spot.type);
    const distStr = (spot.distanceKm != null)
      ? ` · ${spot.distanceKm} km od penzionu` : "";
    const pop = h("div", null,
      h("h4", null, spot.name),
      h("div", { class: "pop-meta" }, `${t.label}${distStr}`),
      spot.species && spot.species.length ? h("div", { class: "pop-species" },
        h("strong", null, "Ryby: "), spot.species.map(speciesName).join(", ")) : null,
      h("div", null, spot.mapNote || spot.description || ""),
      isSpot ? h("div", { style: "margin-top:6px" },
        h("a", { href: `#spot-${spot.id}` }, "Podrobnosti ↓")) : null);
    m.bindPopup(pop);
    m.addTo(map);
    markers.set(spot.id, m);
    allBounds.push([spot.lat, spot.lon]);
  });
  if (allBounds.length > 1) map.fitBounds(allBounds, { padding: [36, 36] });

  // legenda typů
  $("#mapLegend").append(frag(
    Object.entries(TYPE_INFO).map(([k, t]) =>
      h("span", { class: "key" }, h("span", { class: "dot", style: `background:${t.color}` }), `${t.letter !== "🏠" ? t.letter + " — " : ""}${t.label}`))));

  // filtr podle druhu
  const allSpecies = [...new Set(D.spots.flatMap((s) => s.species))]
    .sort((a, b) => speciesName(a).localeCompare(speciesName(b), "cs"));
  const filterRow = $("#mapFilters");
  let activeFilter = null;
  function applyFilter() {
    D.spots.forEach((spot) => {
      const m = markers.get(spot.id);
      const show = NON_SPOT.has(spot.type) || !activeFilter || (spot.species || []).includes(activeFilter);
      if (show) m.addTo(map); else map.removeLayer(m);
    });
    document.querySelectorAll("#spotCards .card").forEach((card) => {
      const sp = (card.dataset.species || "").split(",");
      card.style.display = !activeFilter || sp.includes(activeFilter) ? "" : "none";
    });
    filterRow.querySelectorAll(".chip").forEach((c) =>
      c.classList.toggle("active", (c.dataset.species || null) === activeFilter));
  }
  filterRow.append(h("button", { class: "chip active", type: "button", onclick: () => { activeFilter = null; applyFilter(); } }, "Vše"));
  allSpecies.forEach((id) => {
    filterRow.append(h("button", {
      class: "chip", type: "button", "data-species": id,
      onclick: () => { activeFilter = activeFilter === id ? null : id; applyFilter(); }
    }, speciesName(id)));
  });

  /* ---------- karty lovišť ---------- */
  const spotCards = $("#spotCards");
  D.spots.filter((s) => !NON_SPOT.has(s.type)).forEach((spot) => {
    const t = TYPE_INFO[spot.type] || TYPE_INFO.jezero;
    const kv = [];
    const add = (dt, dd) => { if (dd) { kv.push(h("dt", null, dt), h("dd", null, dd)); } };
    add("Technika:", spot.techniques);
    add("Nástrahy:", spot.baits);
    add("Sezóna:", spot.season);
    add("Přístup:", spot.access);
    spotCards.append(h("article", { class: "card", id: `spot-${spot.id}`, "data-species": spot.species.join(",") },
      h("div", { class: "card-head" },
        h("h3", null, spot.name),
        h("span", { class: "badge type" }, t.label),
        verBadge(spot.verification)),
      h("div", { class: "meta" },
        `${spot.distanceKm != null ? spot.distanceKm : Math.round(haversineKm(home, spot))} km od penzionu · ` +
        `${spot.lat.toFixed(4)} N, ${spot.lon.toFixed(4)} E` +
        (spot.areaKm2 ? ` · ${String(spot.areaKm2).replace(".", ",")} km²` : "")),
      h("div", { class: "tagrow" }, spot.species.map((id) =>
        h("span", { class: "tag" + ((spot.primary || []).includes(id) ? " primary" : "") }, speciesName(id)))),
      h("p", null, spot.description),
      kv.length ? h("dl", { class: "kv" }, kv) : null,
      spot.sources && spot.sources.length ? h("div", { class: "sources" }, "Zdroje: ",
        spot.sources.flatMap((s, i) => [i ? ", " : null, h("a", { href: s.url, target: "_blank", rel: "noopener" }, s.label)])) : null));
  });

  /* ---------- karty ryb ---------- */
  const fishCards = $("#fishCards");
  D.fish.forEach((f) => {
    const kv = [];
    const add = (dt, dd) => { if (dd) kv.push(h("dt", null, dt), h("dd", null, dd)); };
    add("Denní doba:", f.timeOfDay);
    add("Sezóna:", f.season);
    add("Kde u Gorgové:", f.spots);
    if (f.legal) kv.push(h("dt", null, "Předpisy:"), h("dd", null, h("strong", null, f.legal)));
    fishCards.append(h("article", { class: "card" },
      h("div", { class: "card-head" },
        h("span", { class: "emoji", "aria-hidden": "true" }, f.emoji),
        h("h3", null, f.name),
        verBadge(f.verification)),
      h("div", { class: "meta" }, `${f.latin} · rumunsky „${f.ro}"`),
      h("p", null, f.intro),
      f.baits && f.baits.length ? h("div", { class: "tagrow" },
        f.baits.map((b) => h("span", { class: "tag" }, b))) : null,
      f.techniques && f.techniques.length ? h("p", null,
        h("strong", null, "Technika: "), f.techniques.join(" · ")) : null,
      kv.length ? h("dl", { class: "kv" }, kv) : null,
      f.tip ? h("p", { style: "font-style:italic" }, "💡 " + f.tip) : null));
  });

  /* ---------- grafy ---------- */
  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const NS = "http://www.w3.org/2000/svg";
  function svgEl(tag, attrs) {
    const el = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs || {})) el.setAttribute(k, v);
    return el;
  }

  const months = D.climate.months;
  $("#tempChartSub").textContent = D.climate.sub;
  $("#precipChartSub").textContent = D.climate.precipSub || "Průměrný měsíční úhrn (mm).";

  /* Teplotní graf: pás vzduch min–max (slot 1) + linka vody (slot 2), crosshair tooltip */
  function renderTempChart() {
    const host = $("#tempChart");
    host.textContent = "";
    const W = 760, H = 320, m = { t: 18, r: 52, b: 30, l: 40 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const c1 = css("--s1"), c2 = css("--s2");
    const inkMuted = css("--muted"), gridC = css("--grid"), base = css("--baseline"), surface = css("--surface");

    const vals = months.flatMap((d) => [d.tmax, d.tmin, d.water]);
    const yMin = Math.floor(Math.min(...vals) / 5) * 5;
    const yMax = Math.ceil(Math.max(...vals) / 5) * 5;
    const x = (i) => m.l + (i + 0.5) * (iw / months.length);
    const y = (v) => m.t + ih - ((v - yMin) / (yMax - yMin)) * ih;

    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Graf teplot po měsících" });

    for (let v = yMin; v <= yMax; v += 5) {
      svg.append(svgEl("line", { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v), stroke: v === 0 ? base : gridC, "stroke-width": 1 }));
      const lbl = svgEl("text", { x: m.l - 8, y: y(v) + 4, "text-anchor": "end", fill: inkMuted, "font-size": 11, style: "font-variant-numeric:tabular-nums" });
      lbl.textContent = `${v}°`;
      svg.append(lbl);
    }
    months.forEach((d, i) => {
      const lbl = svgEl("text", { x: x(i), y: H - 8, "text-anchor": "middle", fill: inkMuted, "font-size": 11 });
      lbl.textContent = d.m;
      svg.append(lbl);
    });

    const line = (key) => months.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d[key])}`).join("");
    const band = months.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.tmax)}`).join("") +
      months.slice().reverse().map((d, i) => `L${x(months.length - 1 - i)},${y(d.tmin)}`).join("") + "Z";

    svg.append(svgEl("path", { d: band, fill: c1, opacity: 0.1 }));
    svg.append(svgEl("path", { d: line("tmax"), fill: "none", stroke: c1, "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round" }));
    svg.append(svgEl("path", { d: line("tmin"), fill: "none", stroke: c1, "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round", "stroke-opacity": 0.55 }));
    svg.append(svgEl("path", { d: line("water"), fill: "none", stroke: c2, "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round" }));

    // přímé popisky na konci řad — s rozestupem proti překryvu
    const ends = [
      { txt: "max", y: y(months[11].tmax) },
      { txt: "voda", y: y(months[11].water) },
      { txt: "min", y: y(months[11].tmin) }
    ].sort((a, b) => a.y - b.y);
    for (let i = 1; i < ends.length; i++) {
      if (ends[i].y - ends[i - 1].y < 13) ends[i].y = ends[i - 1].y + 13;
    }
    ends.forEach((e) => {
      const t = svgEl("text", { x: W - m.r + 6, y: e.y + 4, fill: css("--ink-2"), "font-size": 11 });
      t.textContent = e.txt;
      svg.append(t);
    });

    // crosshair
    const cross = svgEl("line", { y1: m.t, y2: m.t + ih, stroke: base, "stroke-width": 1, opacity: 0 });
    svg.append(cross);
    const dots = ["tmax", "tmin", "water"].map((key, idx) => {
      const dot = svgEl("circle", { r: 4.5, fill: idx === 2 ? c2 : c1, stroke: surface, "stroke-width": 2, opacity: 0 });
      svg.append(dot);
      return { key, dot };
    });

    const tip = h("div", { class: "chart-tip" });
    host.append(svg, tip);

    function showAt(i, clientX) {
      const d = months[i];
      cross.setAttribute("x1", x(i)); cross.setAttribute("x2", x(i));
      cross.setAttribute("opacity", 1);
      dots.forEach(({ key, dot }) => {
        dot.setAttribute("cx", x(i)); dot.setAttribute("cy", y(d[key])); dot.setAttribute("opacity", 1);
      });
      tip.textContent = "";
      tip.append(
        h("div", { class: "tip-title" }, D.climate.monthNames ? D.climate.monthNames[i] : d.m),
        row("Vzduch max", `${d.tmax} °C`, c1, 1),
        row("Vzduch min", `${d.tmin} °C`, c1, 0.55),
        row("Voda", `${d.water} °C`, c2, 1));
      tip.style.opacity = 1;
      const r = host.getBoundingClientRect();
      const px = (x(i) / W) * r.width;
      tip.style.left = Math.min(Math.max(px + 14, 0), r.width - tip.offsetWidth - 4) + "px";
      tip.style.top = "12px";
    }
    function row(lbl, val, color, op) {
      return h("div", { class: "tip-row" },
        h("span", { class: "key", style: `border-color:${color};opacity:${op}` }),
        h("span", { class: "lbl" }, lbl), h("span", { class: "val" }, val));
    }
    function hide() {
      cross.setAttribute("opacity", 0);
      dots.forEach(({ dot }) => dot.setAttribute("opacity", 0));
      tip.style.opacity = 0;
    }
    svg.addEventListener("pointermove", (ev) => {
      const r = svg.getBoundingClientRect();
      const px = ((ev.clientX - r.left) / r.width) * W;
      const i = Math.max(0, Math.min(months.length - 1, Math.round((px - m.l) / (iw / months.length) - 0.5)));
      showAt(i, ev.clientX);
    });
    svg.addEventListener("pointerleave", hide);

    // legenda
    host.append(h("div", { class: "legend-row" },
      h("span", { class: "key" }, h("span", { class: "swatch-line", style: `border-color:${c1}` }), "Vzduch max"),
      h("span", { class: "key" }, h("span", { class: "swatch-line", style: `border-color:${c1};opacity:.55` }), "Vzduch min"),
      h("span", { class: "key" }, h("span", { class: "swatch-line", style: `border-color:${c2}` }), "Voda")));
  }

  /* tabulková verze */
  function renderTempTable() {
    const host = $("#tempTable");
    host.textContent = "";
    const head = h("tr", null, h("th", null, "Měsíc"), h("th", null, "Vzduch max (°C)"), h("th", null, "Vzduch min (°C)"), h("th", null, "Voda (°C)"), h("th", null, "Srážky (mm)"));
    const rows = months.map((d) => h("tr", null,
      h("td", null, d.m), h("td", null, d.tmax), h("td", null, d.tmin), h("td", null, d.water), h("td", null, d.precip)));
    host.append(h("table", null, h("thead", null, head), h("tbody", null, rows)));
  }

  /* srážky — sloupce */
  function renderPrecipChart() {
    const host = $("#precipChart");
    host.textContent = "";
    const W = 380, H = 240, m = { t: 14, r: 10, b: 28, l: 34 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const c1 = css("--s1"), inkMuted = css("--muted"), gridC = css("--grid");
    const maxV = Math.ceil(Math.max(...months.map((d) => d.precip)) / 10) * 10;
    const x = (i) => m.l + (i + 0.5) * (iw / months.length);
    const y = (v) => m.t + ih - (v / maxV) * ih;
    const bw = Math.min(24, (iw / months.length) - 4);

    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Graf srážek po měsících" });
    for (let v = 0; v <= maxV; v += 10) {
      svg.append(svgEl("line", { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v), stroke: gridC, "stroke-width": 1 }));
      const lbl = svgEl("text", { x: m.l - 6, y: y(v) + 4, "text-anchor": "end", fill: inkMuted, "font-size": 10, style: "font-variant-numeric:tabular-nums" });
      lbl.textContent = v;
      svg.append(lbl);
    }
    const tip = h("div", { class: "chart-tip" });
    months.forEach((d, i) => {
      const bh = Math.max(0, y(0) - y(d.precip));
      const r = Math.min(4, bh);
      const bx = x(i) - bw / 2, by = y(d.precip);
      const path = `M${bx},${by + r} Q${bx},${by} ${bx + r},${by} L${bx + bw - r},${by} Q${bx + bw},${by} ${bx + bw},${by + r} L${bx + bw},${y(0)} L${bx},${y(0)} Z`;
      const bar = svgEl("path", { d: path, fill: c1 });
      bar.addEventListener("pointermove", () => {
        tip.textContent = "";
        tip.append(h("div", { class: "tip-title" }, D.climate.monthNames ? D.climate.monthNames[i] : d.m),
          h("div", { class: "tip-row" }, h("span", { class: "lbl" }, "Srážky"), h("span", { class: "val" }, `${d.precip} mm`)));
        tip.style.opacity = 1;
        const hostR = host.getBoundingClientRect();
        tip.style.left = Math.min((x(i) / W) * hostR.width + 10, hostR.width - 110) + "px";
        tip.style.top = "6px";
        bar.setAttribute("opacity", 0.8);
      });
      bar.addEventListener("pointerleave", () => { tip.style.opacity = 0; bar.setAttribute("opacity", 1); });
      svg.append(bar);
      const lbl = svgEl("text", { x: x(i), y: H - 8, "text-anchor": "middle", fill: inkMuted, "font-size": 10 });
      lbl.textContent = d.m;
      svg.append(lbl);
    });
    host.append(svg, tip);
  }

  /* matice sezónnosti — sekvenční modrá */
  function renderSeasonMatrix() {
    const host = $("#seasonMatrix");
    host.textContent = "";
    const dark = document.documentElement.dataset.theme === "dark";
    const ramp = dark
      ? ["", "#184f95", "#3987e5", "#9ec5f4"]
      : ["", "#86b6ef", "#3987e5", "#184f95"];
    const table = h("table", { class: "matrix" });
    table.append(h("thead", null, h("tr", null,
      h("th", null, ""), D.seasonMatrix.months.map((mm) => h("th", { scope: "col" }, mm)))));
    const tb = h("tbody");
    D.seasonMatrix.rows.forEach((row) => {
      const tr = h("tr", null, h("td", { class: "fish-name" }, row.fish));
      row.values.forEach((v, i) => {
        const cell = h("div", { class: "cell-in", title: `${row.fish} · ${D.climate.monthNames ? D.climate.monthNames[i] : D.seasonMatrix.months[i]}: ${D.seasonMatrix.legend[v]}` });
        if (v > 0) cell.style.background = ramp[v];
        tr.append(h("td", { class: "cell" }, cell));
      });
      tb.append(tr);
    });
    table.append(tb);
    host.append(table,
      h("div", { class: "matrix-legend" },
        D.seasonMatrix.legend.map((lbl, v) => h("span", { class: "key" },
          h("span", { class: "sw", style: v ? `background:${ramp[v]}` : "background:var(--surface-2)" }), lbl))));
  }

  function renderCharts() {
    renderTempChart();
    renderTempTable();
    renderPrecipChart();
    renderSeasonMatrix();
  }
  renderCharts();
  new MutationObserver(() => renderCharts())
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  /* ---------- info bloky sezóny ---------- */
  $("#seasonInfo").append(frag(D.seasonInfo.map((c) =>
    h("div", { class: "info-card" },
      h("h3", null, c.icon ? c.icon + " " : "", c.title),
      c.paras ? c.paras.map((p) => h("p", null, p)) : null,
      c.list ? h("ul", null, c.list.map((li) => h("li", null, li))) : null))));

  /* ---------- pravidla ---------- */
  $("#rulesBlocks").append(frag(D.rules.map((r) => {
    const block = h("div", { class: "rule-block" + (r.important ? " important" : "") },
      h("h3", null, r.icon ? r.icon + " " : "", r.title),
      r.intro ? h("p", { style: "color:var(--ink-2);margin:6px 0 0" }, r.intro) : null,
      r.items ? h("ul", null, r.items.map((li) => h("li", null, li))) : null);
    if (r.table) {
      const table = h("table", { class: "limits" },
        h("thead", null, h("tr", null, r.table.head.map((th) => h("th", null, th)))),
        h("tbody", null, r.table.rows.map((row) => h("tr", null, row.map((cell, i) => h("td", { class: i > 0 ? "num" : "" }, cell))))));
      block.append(table);
    }
    if (r.src) block.append(h("div", { class: "src" }, "Zdroj: ", r.src));
    return block;
  })));

  /* ---------- checklisty ---------- */
  const saved = (() => { try { return JSON.parse(localStorage.getItem("gorgova-check") || "{}"); } catch (e) { return {}; } })();
  function saveChecks() { try { localStorage.setItem("gorgova-check", JSON.stringify(saved)); } catch (e) {} }
  $("#checklists").append(frag(D.checklists.map((cl) => {
    const prog = h("span", { class: "progress" });
    const items = cl.items.map((it, i) => {
      const key = `${cl.id}:${i}`;
      const input = h("input", { type: "checkbox" });
      input.checked = !!saved[key];
      input.addEventListener("change", () => { saved[key] = input.checked; saveChecks(); updateProg(); });
      return h("li", null, h("label", null, input,
        h("span", null, it.text, it.note ? h("small", { class: "note" }, it.note) : null)));
    });
    const box = h("div", { class: "checklist" },
      h("h3", null, cl.icon ? cl.icon + " " : "", cl.title, prog),
      h("ul", null, items));
    function updateProg() {
      const done = cl.items.filter((_, i) => saved[`${cl.id}:${i}`]).length;
      prog.textContent = `${done}/${cl.items.length}`;
    }
    updateProg();
    return box;
  })));

  /* ---------- penzion ---------- */
  $("#pensionBlocks").append(frag(D.pension.map((b) => {
    const card = h("div", { class: "info-card" },
      h("h3", null, b.icon ? b.icon + " " : "", b.title),
      b.paras ? b.paras.map((p) => h("p", null, p)) : null);
    if (b.kv) card.append(h("dl", { class: "kv" }, b.kv.flatMap(([dt, dd]) => [h("dt", null, dt), h("dd", null, dd)])));
    if (b.steps) card.append(h("ol", { class: "steps" }, b.steps.map((s) =>
      h("li", null, s.strong ? h("strong", null, s.strong + " ") : null, s.text))));
    if (b.list) card.append(h("ul", null, b.list.map((li) => h("li", null, li))));
    return card;
  })));

  /* ---------- zdroje ---------- */
  $("#footerSources").append(frag(D.sources.map((g) =>
    h("div", null, h("h3", null, g.title),
      h("ul", null, g.links.map((l) => h("li", null,
        h("a", { href: l.url, target: "_blank", rel: "noopener" }, l.label),
        l.note ? ` — ${l.note}` : "")))))));
})();
