/* =========================================================================
   Wahlkampf im Wandel — App (horizontale Zeitreise)
   Baut die Präsentation aus window.WAHLKAMPF_DATA auf. Man bewegt sich
   von LINKS (Vergangenheit) nach RECHTS (Gegenwart): Mausrad/Trackpad,
   Wischen, Pfeiltasten oder die Timeline unten.
   ========================================================================= */
(function () {
  "use strict";

  var DATA = window.WAHLKAMPF_DATA;
  if (!DATA) { console.error("WAHLKAMPF_DATA fehlt."); return; }

  /* --- Ära-Symbole: schlichte Line-Icons, erben Farbe via currentColor --- */
  function svg(inner) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      inner + '</svg>';
  }
  var ICON = {
    // I — Federkiel (man "unterschreibt", wirbt nicht)
    I: svg('<path d="M20 4c-6 1-11 5-13 11l-1 4 4-1c6-2 10-7 11-13z"/><path d="M6 19c3-4 7-7 11-9"/><path d="M13.5 7.5l3 3"/>'),
    // II — Fahne am Mast (Branding, Massenbewegung)
    II: svg('<path d="M6 3v18"/><path d="M6 4h12l-2.5 3.5L18 11H6"/>'),
    // III — Plattenkamera (Fotografie)
    III: svg('<rect x="3" y="7" width="18" height="12" rx="2"/><circle cx="12" cy="13" r="3.4"/><path d="M8 7l1.6-2h4.8L16 7"/><circle cx="17.5" cy="10" r=".6" fill="currentColor" stroke="none"/>'),
    // IV — Mikrofon (Radio)
    IV: svg('<rect x="9" y="3" width="6" height="10" rx="3"/><path d="M6 11a6 6 0 0 0 12 0"/><path d="M12 17v3"/><path d="M9 20h6"/>'),
    // V — Fernseher mit Antenne
    V: svg('<rect x="3" y="8" width="18" height="11" rx="1.6"/><path d="M8 8l4-4M16 8l-4-4"/><path d="M17 12v3"/>'),
    // VI — Megafon (Spin, Berater, Botschaftsdisziplin)
    VI: svg('<path d="M4 10v4l3 .6L15 19V5L7 9.4 4 10z"/><path d="M18 9.5a4 4 0 0 1 0 5"/><path d="M7 14.6V19"/>'),
    // VII — Browserfenster (Internet 1.0)
    VII: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18"/><circle cx="6" cy="7" r=".7" fill="currentColor" stroke="none"/><circle cx="8.4" cy="7" r=".7" fill="currentColor" stroke="none"/><path d="M11 15l2.5-2.5M13.5 12.5H11v2.5"/>'),
    // VIII — Smartphone mit Herz (Social Media)
    VIII: svg('<rect x="6.5" y="3" width="11" height="18" rx="2.2"/><path d="M12 8.4c-1-1.4-3.3-1-3.3 1 0 1.7 3.3 3.6 3.3 3.6s3.3-1.9 3.3-3.6c0-2-2.3-2.4-3.3-1z"/>')
  };

  /* --- Helfer --------------------------------------------------------- */
  function el(tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function highlight(text) { return esc(text).replace(/»([^«]+)«/g, '»<span class="accent">$1</span>«'); }
  function flairLayer(classes) { return el("div", "flair " + (classes || []).join(" ")); }

  var FLAIR = {
    I:["flair--grain"], II:["flair--flags","flair--grain"], III:["flair--grain","flair--vignette"],
    IV:["flair--deco"], V:["flair--scanlines","flair--vignette"], VI:["flair--scanlines","flair--crt"],
    VII:["flair--gloss"], VIII:["flair--neon"]
  };

  var app = document.getElementById("app");
  var total = DATA.stationen.length;

  /* --- HERO ------------------------------------------------------------ */
  (function buildHero() {
    var hero = el("section", "panel hero");
    hero.setAttribute("data-epoche", "I");
    hero.setAttribute("data-hud-skip", "1");

    var words = el("div", "hero__words");
    ["stand, don't run","Fireside Chat","It's the economy","Yes We Can","Morning in America",
     "post-truth","Tippecanoe","Fake News","Daisy","War Room"].forEach(function (w, i) {
      var s = el("span", null, w);
      s.style.top = (6 + i * 9) + "%";
      s.style.left = ((i % 2 === 0) ? 6 : 52) + "%";
      s.style.animationDelay = (i * -2.4) + "s";
      words.appendChild(s);
    });
    hero.appendChild(words);

    var inner = el("div", "hero__inner");
    inner.appendChild(el("div", "hero__kicker", esc(DATA.meta.untertitel)));
    inner.appendChild(el("h1", "hero__title", esc(DATA.meta.titel)));
    inner.appendChild(el("p", "hero__sub", "Wie Kandidaten lernten, um Stimmen zu werben"));
    inner.appendChild(el("p", "hero__lead",
      "Eine Zeitreise von links nach rechts: von »stand, don't run« bis zum KI-Deepfake — " +
      "235 Jahre, in denen sich der US-Wahlkampf mit jedem neuen Medium neu erfand."));
    inner.appendChild(el("div", "hero__scroll", "<span>Zur Gegenwart wischen</span>"));
    hero.appendChild(inner);
    app.appendChild(hero);
  })();

  /* --- EPOCHEN + STATIONEN --------------------------------------------- */
  var navItems = [];
  var lastEpoche = null;

  DATA.stationen.forEach(function (st, idx) {
    var ep = DATA.epochen[st.epoche];

    // Epochen-Trenner beim Wechsel
    if (st.epoche !== lastEpoche) {
      lastEpoche = st.epoche;
      var div = el("section", "panel epoch-divider reveal");
      div.setAttribute("data-epoche", st.epoche);
      div.setAttribute("data-hud-name", ep.name);
      div.setAttribute("data-hud-epoche", st.epoche);
      div.setAttribute("data-hud-zeit", ep.zeitraum);
      div.setAttribute("data-hud-jahr", ep.zeitraum.split("–")[0]);
      div.appendChild(flairLayer(FLAIR[st.epoche]));
      div.appendChild(el("div", "motif"));
      var dinner = el("div", "epoch-divider__inner");
      dinner.appendChild(el("div", "epoch-divider__emblem", ICON[st.epoche] || ""));
      dinner.appendChild(el("div", "epoch-divider__zeit", esc(ep.zeitraum)));
      dinner.appendChild(el("div", "epoch-divider__num", "Epoche " + st.epoche));
      dinner.appendChild(el("h2", "epoch-divider__name", esc(ep.name)));
      dinner.appendChild(el("p", "epoch-divider__flair", "„" + esc(ep.flair) + "“"));
      div.appendChild(dinner);
      app.appendChild(div);
      navItems.push({ id: div.id = "epoche-" + st.epoche, jahr: ep.zeitraum.split("–")[0], titel: ep.name, divider: true });
    }

    // Station
    var sec = el("section", "panel station");
    sec.id = "station-" + st.id;
    sec.setAttribute("data-epoche", st.epoche);
    sec.setAttribute("data-hud-name", ep.name);
    sec.setAttribute("data-hud-epoche", st.epoche);
    sec.setAttribute("data-hud-zeit", ep.zeitraum);
    sec.setAttribute("data-hud-jahr", st.jahr);

    sec.appendChild(flairLayer(FLAIR[st.epoche]));
    sec.appendChild(el("div", "motif"));
    sec.appendChild(el("div", "station__emblem", ICON[st.epoche] || ""));

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

    app.appendChild(sec);
    navItems.push({ id: sec.id, jahr: st.jahr, titel: st.titel });
  });

  /* --- FAZIT ----------------------------------------------------------- */
  (function buildFazit() {
    var f = DATA.fazit;
    var sec = el("section", "panel fazit");
    sec.id = "fazit";
    sec.setAttribute("data-epoche", "VIII");
    sec.setAttribute("data-hud-name", "Fazit");
    sec.setAttribute("data-hud-jahr", "Fazit");
    sec.appendChild(flairLayer(["flair--neon"]));
    sec.appendChild(el("div", "motif"));
    var inner = el("div", "fazit__inner reveal");
    inner.appendChild(el("div", "fazit__kicker", "Fazit"));
    inner.appendChild(el("h2", "fazit__title", esc(f.titel)));
    var ul = el("ul", "fazit__list");
    f.punkte.forEach(function (p) {
      var html = esc(p).replace(/→/g, '<span class="accent">→</span>').replace(/»([^«]+)«/g, '»<span class="accent">$1</span>«');
      ul.appendChild(el("li", "fazit__item", html));
    });
    inner.appendChild(ul);
    inner.appendChild(el("p", "fazit__frage", esc(f.frage)));
    sec.appendChild(inner);
    app.appendChild(sec);
    navItems.push({ id: sec.id, jahr: "?", titel: f.titel });
  })();

  /* --- FOOTER ---------------------------------------------------------- */
  (function buildFooter() {
    var sec = el("section", "panel footer-panel");
    sec.id = "footer";
    sec.setAttribute("data-epoche", "I");
    sec.setAttribute("data-hud-jahr", "");
    sec.setAttribute("data-hud-name", "");
    var inner = el("div", "footer-panel__inner");
    inner.appendChild(el("div", "footer-panel__mark", "★"));
    inner.appendChild(el("p", "footer-panel__note", esc(DATA.meta.hinweis)));
    inner.appendChild(el("p", "footer-panel__meta",
      esc(DATA.meta.titel) + " · " + esc(DATA.meta.untertitel) + " — Gesellschaft & Kultur im Wandel."));
    var back = el("button", "footer-panel__back", "↞ Zurück zum Anfang");
    back.type = "button";
    back.addEventListener("click", function () { app.scrollTo({ left: 0, behavior: "smooth" }); });
    inner.appendChild(back);
    sec.appendChild(inner);
    app.appendChild(sec);
  })();

  /* --- Fixe UI: Progress, HUD, Timeline -------------------------------- */
  var progress = el("div", "progress");
  document.body.appendChild(progress);

  var hud = el("div", "hud"); hud.setAttribute("aria-hidden", "true");
  var hudRow = el("div", "hud__row");
  var hudJahr = el("span", "hud__jahr");
  var hudEpoche = el("span", "hud__epoche");
  hudRow.appendChild(hudJahr); hudRow.appendChild(hudEpoche);
  var hudName = el("div", "hud__name");
  var hudZeit = el("div", "hud__zeit");
  hud.appendChild(hudRow); hud.appendChild(hudName); hud.appendChild(hudZeit);
  document.body.appendChild(hud);

  var timeline = el("nav", "timeline"); timeline.setAttribute("aria-label", "Zeitleiste");
  navItems.forEach(function (item) {
    var dot = el("button", "timeline__dot"); dot.type = "button";
    dot.setAttribute("data-label", item.jahr + " · " + item.titel.replace(/»|«/g, ""));
    dot.setAttribute("data-target", item.id);
    dot.setAttribute("aria-label", item.jahr + " – " + item.titel);
    dot.addEventListener("click", function () { scrollToId(item.id); });
    timeline.appendChild(dot);
  });
  document.body.appendChild(timeline);
  var dots = Array.prototype.slice.call(timeline.children);

  /* --- Horizontales Scrollen: Mausrad/Trackpad → seitwärts ------------- */
  app.addEventListener("wheel", function (e) {
    // vertikales Wheel in horizontale Bewegung übersetzen
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      app.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }, { passive: false });

  /* --- Fortschritt (horizontal) --------------------------------------- */
  function onScroll() {
    var max = app.scrollWidth - app.clientWidth;
    progress.style.width = (max > 0 ? (app.scrollLeft / max) * 100 : 0) + "%";
  }
  app.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* --- Reveal- und Aktiv-Beobachter (root = Spur) ---------------------- */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); revealObserver.unobserve(e.target); } });
  }, { root: app, threshold: 0.2 });
  document.querySelectorAll(".reveal").forEach(function (n) { revealObserver.observe(n); });

  var panels = document.querySelectorAll(".panel");
  var activeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var sec = e.target;
      var accent = getComputedStyle(sec).getPropertyValue("--accent").trim();
      if (accent) progress.style.color = accent;

      if (sec.hasAttribute("data-hud-skip")) { hud.style.opacity = "0"; }
      else {
        hud.style.opacity = "1";
        var jahr = sec.getAttribute("data-hud-jahr") || "";
        var epn = sec.getAttribute("data-hud-epoche");
        hudJahr.textContent = jahr;
        hudEpoche.textContent = epn ? "Epoche " + epn : "";
        hudName.textContent = sec.getAttribute("data-hud-name") || "";
        hudZeit.textContent = sec.getAttribute("data-hud-zeit") || "";
      }
      dots.forEach(function (d) {
        var on = d.getAttribute("data-target") === sec.id;
        d.setAttribute("aria-current", on ? "true" : "false");
        if (on && accent) { d.style.setProperty("--dot", accent); d.scrollIntoView({ block: "nearest", inline: "nearest" }); }
      });
    });
  }, { root: app, threshold: 0.55 });
  panels.forEach(function (p) { activeObserver.observe(p); });

  /* --- Navigation: Pfeiltasten links/rechts (und hoch/runter) ---------- */
  var panelArr = Array.prototype.slice.call(panels);
  function currentIndex() {
    var x = app.scrollLeft + app.clientWidth * 0.5;
    var idx = 0;
    for (var i = 0; i < panelArr.length; i++) { if (panelArr[i].offsetLeft <= x) idx = i; }
    return idx;
  }
  function scrollToId(id) { var t = document.getElementById(id); if (t) app.scrollTo({ left: t.offsetLeft, behavior: "smooth" }); }
  document.addEventListener("keydown", function (ev) {
    if (ev.target && /^(INPUT|TEXTAREA|SELECT)$/.test(ev.target.tagName)) return;
    var fwd = ev.key === "ArrowRight" || ev.key === "ArrowDown" || ev.key === "PageDown";
    var back = ev.key === "ArrowLeft" || ev.key === "ArrowUp" || ev.key === "PageUp";
    var home = ev.key === "Home", end = ev.key === "End";
    if (!fwd && !back && !home && !end) return;
    ev.preventDefault();
    var idx = currentIndex();
    if (home) idx = 0;
    else if (end) idx = panelArr.length - 1;
    else idx = Math.max(0, Math.min(panelArr.length - 1, idx + (fwd ? 1 : -1)));
    app.scrollTo({ left: panelArr[idx].offsetLeft, behavior: "smooth" });
  });

  function pad(n) { return (n < 10 ? "0" : "") + n; }
})();
