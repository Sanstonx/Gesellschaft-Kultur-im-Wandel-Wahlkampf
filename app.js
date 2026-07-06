/* =========================================================================
   Wahlkampf im Wandel — App (Zeitstrahl-Version)
   Ein durchgehender Strahl im Vordergrund; in der Mitte jeder Folie ein
   Knoten. Infos hängen asymmetrisch per Verbindungslinie daran.
   Bewegung: fließend (gelerptes Horizontal-Scrollen), kein hartes Snappen.
   ========================================================================= */
(function () {
  "use strict";
  var DATA = window.WAHLKAMPF_DATA;
  if (!DATA) { console.error("WAHLKAMPF_DATA fehlt."); return; }

  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Ära-Symbole ----------------------------------------------------- */
  function svg(inner) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  }
  var ICON = {
    I: svg('<path d="M20 4c-6 1-11 5-13 11l-1 4 4-1c6-2 10-7 11-13z"/><path d="M6 19c3-4 7-7 11-9"/><path d="M13.5 7.5l3 3"/>'),
    II: svg('<path d="M6 3v18"/><path d="M6 4h12l-2.5 3.5L18 11H6"/>'),
    III: svg('<rect x="3" y="7" width="18" height="12" rx="2"/><circle cx="12" cy="13" r="3.4"/><path d="M8 7l1.6-2h4.8L16 7"/><circle cx="17.5" cy="10" r=".6" fill="currentColor" stroke="none"/>'),
    IV: svg('<rect x="9" y="3" width="6" height="10" rx="3"/><path d="M6 11a6 6 0 0 0 12 0"/><path d="M12 17v3"/><path d="M9 20h6"/>'),
    V: svg('<rect x="3" y="8" width="18" height="11" rx="1.6"/><path d="M8 8l4-4M16 8l-4-4"/><path d="M17 12v3"/>'),
    VI: svg('<path d="M4 10v4l3 .6L15 19V5L7 9.4 4 10z"/><path d="M18 9.5a4 4 0 0 1 0 5"/><path d="M7 14.6V19"/>'),
    VII: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18"/><circle cx="6" cy="7" r=".7" fill="currentColor" stroke="none"/><circle cx="8.4" cy="7" r=".7" fill="currentColor" stroke="none"/><path d="M11 15l2.5-2.5M13.5 12.5H11v2.5"/>'),
    VIII: svg('<rect x="6.5" y="3" width="11" height="18" rx="2.2"/><path d="M12 8.4c-1-1.4-3.3-1-3.3 1 0 1.7 3.3 3.6 3.3 3.6s3.3-1.9 3.3-3.6c0-2-2.3-2.4-3.3-1z"/>')
  };

  /* --- Helfer ---------------------------------------------------------- */
  function el(t, c, h) { var n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; }
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function highlight(x) { return esc(x).replace(/»([^«]+)«/g, '»<span class="accent">$1</span>«'); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  var FLAIR = { I:["flair--grain"], II:["flair--flags","flair--grain"], III:["flair--grain","flair--vignette"],
    IV:["flair--deco"], V:["flair--scanlines","flair--vignette"], VI:["flair--scanlines","flair--crt"], VII:["flair--gloss"], VIII:["flair--neon"] };

  /* --- Asymmetrie-Muster (deterministisch, unregelmäßig wirkend) -------- */
  var SIDE = [-1,1,1,-1,1,-1,-1,1,-1,1,1,-1,1,-1,1,1,-1,-1,1,-1,1];      // -1 = oben, 1 = unten
  var DX   = [-16,12,18,-10,15,-18,8,-14,16,-12,10,17,-15,6,-18,13,-7,15,-16,9,-12]; // vw
  function stationCfg(i) {
    var side = SIDE[i % SIDE.length];
    var dx = DX[i % DX.length];
    var gap = side < 0 ? (2 + (i % 3)) : (1 + (i % 3)); // knappe, variierende Abstände zum Strahl
    return { side: side, dx: dx, gap: gap };
  }

  /* --- Strahl-Bausteine ------------------------------------------------ */
  function addBeam(panel) { panel.appendChild(el("div", "beam-seg")); }
  function addNode(panel) { var n = el("div", "node"); panel.appendChild(n); panel._node = n; return n; }

  // Verbindungslinie Knoten → Block + Positionierung des Blocks
  function attach(panel, block, cfg) {
    var up = cfg.side < 0, gap = cfg.gap, dx = cfg.dx;
    var edgeY = up ? (50 - gap) : (50 + gap);           // vh, innere Kante des Blocks

    var vert = el("div", "conn");
    vert.style.left = "calc(50vw - 1px)"; vert.style.width = "2px";
    vert.style.height = gap + "vh";
    if (up) vert.style.bottom = "50vh"; else vert.style.top = "50vh";
    panel.appendChild(vert);

    if (Math.abs(dx) > 0.5) {
      var horiz = el("div", "conn");
      horiz.style.height = "2px"; horiz.style.top = "calc(" + edgeY + "vh - 1px)";
      if (dx >= 0) { horiz.style.left = "50vw"; horiz.style.width = dx + "vw"; }
      else { horiz.style.left = (50 + dx) + "vw"; horiz.style.width = (-dx) + "vw"; }
      panel.appendChild(horiz);
    }
    var dot = el("div", "conn-dot");
    dot.style.left = (50 + dx) + "vw"; dot.style.top = edgeY + "vh";
    panel.appendChild(dot);

    block.style.left = (50 + dx) + "vw";
    block.style.transform = "translateX(-50%)";
    if (up) block.style.bottom = (50 + gap) + "vh"; else block.style.top = (50 + gap) + "vh";
    if (dx < -1) block.classList.add("al-r");
  }

  var app = document.getElementById("app");
  var total = DATA.stationen.length;
  var navItems = [];

  /* --- HERO ------------------------------------------------------------ */
  (function () {
    var hero = el("section", "panel hero"); hero.setAttribute("data-epoche", "I"); hero.setAttribute("data-hud-skip", "1");
    addBeam(hero);
    var words = el("div", "hero__words");
    ["stand, don't run","Fireside Chat","It's the economy","Yes We Can","Morning in America","post-truth","Tippecanoe","Fake News","Daisy","War Room"]
      .forEach(function (w, i) { var s = el("span", null, w); s.style.top = (6 + i * 9) + "%"; s.style.left = ((i % 2 === 0) ? 6 : 52) + "%"; s.style.animationDelay = (i * -2.4) + "s"; words.appendChild(s); });
    hero.appendChild(words);
    var inner = el("div", "hero__inner");
    inner.appendChild(el("div", "hero__kicker", esc(DATA.meta.untertitel)));
    inner.appendChild(el("h1", "hero__title", esc(DATA.meta.titel)));
    inner.appendChild(el("p", "hero__sub", "Wie Kandidaten lernten, um Stimmen zu werben"));
    inner.appendChild(el("p", "hero__lead", "Folge dem Strahl von links nach rechts: von »stand, don't run« bis zum KI-Deepfake — 235 Jahre, in denen sich der US-Wahlkampf mit jedem neuen Medium neu erfand."));
    inner.appendChild(el("div", "hero__scroll", "<span>Der Zeit folgen</span>"));
    hero.appendChild(inner);
    app.appendChild(hero);
  })();

  /* --- EPOCHEN + STATIONEN --------------------------------------------- */
  var lastEpoche = null, divCount = 0;
  DATA.stationen.forEach(function (st, idx) {
    var ep = DATA.epochen[st.epoche];

    if (st.epoche !== lastEpoche) {
      lastEpoche = st.epoche;
      var div = el("section", "panel epoch-divider reveal");
      div.id = "epoche-" + st.epoche;
      div.setAttribute("data-epoche", st.epoche);
      div.setAttribute("data-hud-name", ep.name); div.setAttribute("data-hud-epoche", st.epoche);
      div.setAttribute("data-hud-zeit", ep.zeitraum); div.setAttribute("data-hud-jahr", ep.zeitraum.split("–")[0]);
      div.appendChild(el("div", "flair " + FLAIR[st.epoche].join(" ")));
      div.appendChild(el("div", "motif"));
      addBeam(div); addNode(div);
      var dinner = el("div", "epoch-divider__inner");
      dinner.appendChild(el("div", "epoch-divider__emblem", ICON[st.epoche] || ""));
      dinner.appendChild(el("div", "epoch-divider__zeit", esc(ep.zeitraum)));
      dinner.appendChild(el("div", "epoch-divider__num", "Epoche " + st.epoche));
      dinner.appendChild(el("h2", "epoch-divider__name", esc(ep.name)));
      dinner.appendChild(el("p", "epoch-divider__flair", "„" + esc(ep.flair) + "“"));
      div.appendChild(dinner);
      attach(div, dinner, { side: (divCount % 2 === 0 ? -1 : 1), dx: 0, gap: 3 });
      divCount++;
      app.appendChild(div);
      navItems.push({ id: div.id, jahr: ep.zeitraum.split("–")[0], titel: ep.name });
    }

    var sec = el("section", "panel station");
    sec.id = "station-" + st.id;
    sec.setAttribute("data-epoche", st.epoche);
    sec.setAttribute("data-hud-name", ep.name); sec.setAttribute("data-hud-epoche", st.epoche);
    sec.setAttribute("data-hud-zeit", ep.zeitraum); sec.setAttribute("data-hud-jahr", st.jahr);
    var cfg = stationCfg(idx);

    sec.appendChild(el("div", "flair " + FLAIR[st.epoche].join(" ")));
    sec.appendChild(el("div", "motif"));
    // Emblem in das "leere" Viertel gegenüber dem Infoblock
    var emblem = el("div", "station__emblem", ICON[st.epoche] || "");
    if (cfg.side < 0) emblem.style.bottom = "-4vh"; else emblem.style.top = "-4vh";
    if (cfg.dx < 0) emblem.style.right = "-3vw"; else emblem.style.left = "-3vw";
    sec.appendChild(emblem);
    addBeam(sec); addNode(sec);

    var inner = el("div", "station__inner reveal");
    inner.appendChild(el("div", "station__no", "Station " + pad(st.id) + " / " + total));
    inner.appendChild(el("div", "station__year", esc(st.jahr)));
    var eye = el("div", "station__eyebrow");
    eye.appendChild(el("span", "ico", ICON[st.epoche] || ""));
    eye.appendChild(el("span", null, "Epoche " + st.epoche + " · " + esc(ep.name)));
    inner.appendChild(eye);
    inner.appendChild(el("h3", "station__title", highlight(st.titel)));
    inner.appendChild(el("hr", "station__rule"));
    inner.appendChild(el("p", "station__text", highlight(st.text)));
    sec.appendChild(inner);
    attach(sec, inner, cfg);

    app.appendChild(sec);
    navItems.push({ id: sec.id, jahr: st.jahr, titel: st.titel });
  });

  /* --- FAZIT ----------------------------------------------------------- */
  (function () {
    var f = DATA.fazit;
    var sec = el("section", "panel fazit"); sec.id = "fazit"; sec.setAttribute("data-epoche", "VIII");
    sec.setAttribute("data-hud-name", "Fazit"); sec.setAttribute("data-hud-jahr", "Fazit");
    sec.appendChild(el("div", "flair flair--neon")); sec.appendChild(el("div", "motif")); addBeam(sec);
    var inner = el("div", "fazit__inner reveal");
    inner.appendChild(el("div", "fazit__kicker", "Fazit"));
    inner.appendChild(el("h2", "fazit__title", esc(f.titel)));
    var ul = el("ul", "fazit__list");
    f.punkte.forEach(function (p) { var h = esc(p).replace(/→/g, '<span class="accent">→</span>').replace(/»([^«]+)«/g, '»<span class="accent">$1</span>«'); ul.appendChild(el("li", "fazit__item", h)); });
    inner.appendChild(ul);
    inner.appendChild(el("p", "fazit__frage", esc(f.frage)));
    sec.appendChild(inner); app.appendChild(sec);
    navItems.push({ id: sec.id, jahr: "?", titel: f.titel });
  })();

  /* --- FOOTER ---------------------------------------------------------- */
  (function () {
    var sec = el("section", "panel footer-panel"); sec.id = "footer"; sec.setAttribute("data-epoche", "I");
    sec.setAttribute("data-hud-jahr", ""); sec.setAttribute("data-hud-name", "");
    addBeam(sec);
    var inner = el("div", "footer-panel__inner");
    inner.appendChild(el("div", "footer-panel__mark", "★"));
    inner.appendChild(el("p", "footer-panel__note", esc(DATA.meta.hinweis)));
    inner.appendChild(el("p", "footer-panel__meta", esc(DATA.meta.titel) + " · " + esc(DATA.meta.untertitel) + " — Gesellschaft & Kultur im Wandel."));
    var back = el("button", "footer-panel__back", "↞ Zurück zum Anfang"); back.type = "button";
    back.addEventListener("click", function () { glideTo(0); });
    inner.appendChild(back); sec.appendChild(inner); app.appendChild(sec);
  })();

  /* --- Fixe UI --------------------------------------------------------- */
  var progress = el("div", "progress"); document.body.appendChild(progress);
  var hud = el("div", "hud"); hud.setAttribute("aria-hidden", "true");
  var hudRow = el("div", "hud__row"), hudJahr = el("span", "hud__jahr"), hudEpoche = el("span", "hud__epoche");
  hudRow.appendChild(hudJahr); hudRow.appendChild(hudEpoche);
  var hudName = el("div", "hud__name"), hudZeit = el("div", "hud__zeit");
  hud.appendChild(hudRow); hud.appendChild(hudName); hud.appendChild(hudZeit); document.body.appendChild(hud);

  var timeline = el("nav", "timeline"); timeline.setAttribute("aria-label", "Zeitleiste");
  navItems.forEach(function (item) {
    var dot = el("button", "timeline__dot"); dot.type = "button";
    dot.setAttribute("data-label", item.jahr + " · " + item.titel.replace(/»|«/g, ""));
    dot.setAttribute("data-target", item.id); dot.setAttribute("aria-label", item.jahr + " – " + item.titel);
    dot.addEventListener("click", function () { var t = document.getElementById(item.id); if (t) glideTo(t.offsetLeft); });
    timeline.appendChild(dot);
  });
  document.body.appendChild(timeline);
  var dots = Array.prototype.slice.call(timeline.children);

  /* --- Fließendes Scrollen (Lerp) -------------------------------------- */
  var panelArr = Array.prototype.slice.call(document.querySelectorAll(".panel"));
  var emblems = Array.prototype.slice.call(document.querySelectorAll(".station__emblem"));
  function maxX() { return app.scrollWidth - app.clientWidth; }
  function clamp(x) { return Math.max(0, Math.min(maxX(), x)); }

  var target = app.scrollLeft, current = target, animating = false;
  function frame() {
    current += (target - current) * 0.16;
    if (Math.abs(target - current) < 0.4) { current = target; app.scrollLeft = current; animating = false; return; }
    app.scrollLeft = current; requestAnimationFrame(frame);
  }
  function kick() { if (!animating) { animating = true; requestAnimationFrame(frame); } }
  function glideTo(x) { target = clamp(x); if (REDUCED) { app.scrollLeft = target; } else kick(); }

  // deltaMode normalisieren (Zeilen/Seiten → Pixel), damit alle Eingabegeräte gleich fließen
  function pxDelta(e) {
    if (e.deltaMode === 1) return e.deltaY * 16;               // Zeilen
    if (e.deltaMode === 2) return e.deltaY * app.clientWidth;  // Seiten
    return e.deltaY;                                           // Pixel
  }
  app.addEventListener("wheel", function (e) {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;  // horizontales Trackpad frei lassen
    e.preventDefault();
    var dy = pxDelta(e);
    if (REDUCED) { app.scrollLeft = clamp(app.scrollLeft + dy); return; }
    target = clamp((animating ? target : app.scrollLeft) + dy);
    kick();
  }, { passive: false });

  /* --- Sichtbares aktualisieren (Fortschritt + Parallax) --------------- */
  // Auto-Fit: Text so groß wie möglich, aber nur dort verkleinern, wo ein
  // Block sonst über die Folie hinausliefe (--fs-Multiplikator).
  var fitBlocks = Array.prototype.slice.call(document.querySelectorAll(".station__inner, .epoch-divider__inner"));
  function fitOne(inner) {
    inner.style.setProperty("--fs", 1);
    var vh = window.innerHeight, fs = 1, guard = 0;
    while (guard++ < 10) {
      var r = inner.getBoundingClientRect();
      if (r.bottom <= vh - 46 && r.top >= 8) break;   // Abstand zur Timeline unten wahren
      fs -= 0.05; if (fs < 0.62) { fs = 0.62; inner.style.setProperty("--fs", fs); break; }
      inner.style.setProperty("--fs", fs);
    }
  }
  function fitAll() { for (var i = 0; i < fitBlocks.length; i++) fitOne(fitBlocks[i]); }
  fitAll();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll); // Webfont-Metriken

  // Panel-Mitten einmalig messen (keine Layout-Reads pro Scroll-Frame → kein Jank)
  var centers = [];
  function measure() { centers = emblems.map(function (e) { var p = e.parentNode; return p.offsetLeft + p.offsetWidth / 2; }); }
  measure();

  var ticking = false;
  function updateVisual() {
    var mx = maxX();
    progress.style.width = (mx > 0 ? app.scrollLeft / mx * 100 : 0) + "%";
    var vc = app.scrollLeft + app.clientWidth / 2, w = app.clientWidth;
    for (var i = 0; i < emblems.length; i++) {
      var d = centers[i] - vc;
      if (Math.abs(d) < w * 1.5) emblems[i].style.transform = "translateX(" + (d * -0.05) + "px)";
    }
  }
  app.addEventListener("scroll", function () {
    if (!animating) { target = current = app.scrollLeft; }
    if (!ticking) { ticking = true; requestAnimationFrame(function () { updateVisual(); ticking = false; }); }
  }, { passive: true });
  window.addEventListener("resize", function () { fitAll(); measure(); updateVisual(); });
  updateVisual();

  /* --- Reveal + aktive Folie (HUD, Knoten, Timeline) ------------------- */
  var revealObs = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); revealObs.unobserve(e.target); } });
  }, { root: app, threshold: 0.2 });
  document.querySelectorAll(".reveal").forEach(function (n) { revealObs.observe(n); });

  var lastNode = null;
  var activeObs = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var sec = e.target, accent = getComputedStyle(sec).getPropertyValue("--accent").trim();
      if (accent) progress.style.color = accent;
      if (sec.hasAttribute("data-hud-skip")) hud.style.opacity = "0";
      else {
        hud.style.opacity = "1";
        var jahr = sec.getAttribute("data-hud-jahr") || "", epn = sec.getAttribute("data-hud-epoche");
        hudJahr.textContent = jahr; hudEpoche.textContent = epn ? "Epoche " + epn : "";
        hudName.textContent = sec.getAttribute("data-hud-name") || ""; hudZeit.textContent = sec.getAttribute("data-hud-zeit") || "";
      }
      if (lastNode) lastNode.classList.remove("is-active");
      if (sec._node) { sec._node.classList.add("is-active"); lastNode = sec._node; }
      dots.forEach(function (d) {
        var on = d.getAttribute("data-target") === sec.id;
        d.setAttribute("aria-current", on ? "true" : "false");
        if (on && accent) { d.style.setProperty("--dot", accent); d.scrollIntoView({ block: "nearest", inline: "nearest" }); }
      });
    });
  }, { root: app, threshold: 0.55 });
  panelArr.forEach(function (p) { activeObs.observe(p); });

  /* --- Tastatur -------------------------------------------------------- */
  function currentIndex() { var x = app.scrollLeft + app.clientWidth * 0.5, idx = 0; for (var i = 0; i < panelArr.length; i++) if (panelArr[i].offsetLeft <= x) idx = i; return idx; }
  document.addEventListener("keydown", function (ev) {
    if (ev.target && /^(INPUT|TEXTAREA|SELECT)$/.test(ev.target.tagName)) return;
    var fwd = ev.key === "ArrowRight" || ev.key === "ArrowDown" || ev.key === "PageDown";
    var back = ev.key === "ArrowLeft" || ev.key === "ArrowUp" || ev.key === "PageUp";
    var home = ev.key === "Home", end = ev.key === "End";
    if (!fwd && !back && !home && !end) return;
    ev.preventDefault();
    var idx = currentIndex();
    if (home) idx = 0; else if (end) idx = panelArr.length - 1; else idx = Math.max(0, Math.min(panelArr.length - 1, idx + (fwd ? 1 : -1)));
    glideTo(panelArr[idx].offsetLeft);
  });
})();
