/* =========================================================================
   Wahlkampf im Wandel — App
   Baut die Präsentation aus window.WAHLKAMPF_DATA auf und steuert
   Scroll-Interaktionen (Reveal, HUD, Fortschritt, Timeline).
   ========================================================================= */
(function () {
  "use strict";

  var DATA = window.WAHLKAMPF_DATA;
  if (!DATA) { console.error("WAHLKAMPF_DATA fehlt."); return; }

  /* --- Flair-Zuordnung je Epoche (rein visuell) ------------------------ */
  var FLAIR = {
    I:   ["flair--grain"],
    II:  ["flair--flags", "flair--grain"],
    III: ["flair--grain", "flair--vignette"],
    IV:  ["flair--deco"],
    V:   ["flair--scanlines", "flair--vignette"],
    VI:  ["flair--scanlines", "flair--crt"],
    VII: ["flair--gloss"],
    VIII:["flair--neon"]
  };

  /* --- kleine Helfer --------------------------------------------------- */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s).replace(/[&<>]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c];
    });
  }
  // Hebt in »...« gesetzte Schlüsselbegriffe farblich hervor.
  function highlight(text) {
    return esc(text).replace(/»([^«]+)«/g, '»<span class="accent">$1</span>«');
  }
  function flairLayer(epoche) {
    var f = el("div", "flair " + (FLAIR[epoche] || []).join(" "));
    return f;
  }

  var app = document.getElementById("app");

  /* --- HERO ------------------------------------------------------------ */
  (function buildHero() {
    var hero = el("section", "hero");
    hero.setAttribute("data-epoche", "I");

    var words = el("div", "hero__words");
    var sample = ["stand, don't run", "Fireside Chat", "It's the economy", "Yes We Can",
      "Morning in America", "post-truth", "Tippecanoe", "Fake News", "Daisy", "War Room"];
    sample.forEach(function (w, i) {
      var s = el("span", null, w);
      s.style.top = (6 + i * 9) + "%";
      s.style.left = ((i % 2 === 0) ? 4 : 46) + "vw";
      s.style.animationDelay = (i * -2.4) + "s";
      words.appendChild(s);
    });
    hero.appendChild(words);

    var inner = el("div", "hero__inner");
    inner.appendChild(el("div", "hero__kicker", esc(DATA.meta.untertitel)));
    inner.appendChild(el("h1", "hero__title", esc(DATA.meta.titel)));
    inner.appendChild(el("p", "hero__sub", "Wie Kandidaten lernten, um Stimmen zu werben"));
    inner.appendChild(el("p", "hero__lead",
      "Von »stand, don't run« bis zum KI-Deepfake: 235 Jahre, in denen sich der " +
      "US-Wahlkampf mit jedem neuen Medium neu erfand — und mit ihm die Öffentlichkeit selbst."));
    inner.appendChild(el("div", "hero__scroll", "Scrollen ↓"));
    hero.appendChild(inner);
    app.appendChild(hero);
  })();

  /* --- EPOCHEN + STATIONEN --------------------------------------------- */
  var navItems = []; // für Timeline
  var lastEpoche = null;

  DATA.stationen.forEach(function (st) {
    // Epochen-Trenner, sobald eine neue Epoche beginnt
    if (st.epoche !== lastEpoche) {
      lastEpoche = st.epoche;
      var ep = DATA.epochen[st.epoche];
      var div = el("section", "epoch-divider reveal");
      div.setAttribute("data-epoche", st.epoche);
      div.appendChild(flairLayer(st.epoche));
      var dinner = el("div");
      dinner.style.position = "relative";
      dinner.style.zIndex = "3";
      dinner.appendChild(el("div", "epoch-divider__num", roman(st.epoche)));
      dinner.appendChild(el("div", "epoch-divider__zeit", esc(ep.zeitraum)));
      dinner.appendChild(el("h2", "epoch-divider__name", esc(ep.name)));
      dinner.appendChild(el("p", "epoch-divider__flair", "„" + esc(ep.flair) + "“"));
      div.appendChild(dinner);
      app.appendChild(div);
    }

    // Station
    var sec = el("section", "station");
    sec.id = "station-" + st.id;
    sec.setAttribute("data-epoche", st.epoche);
    sec.setAttribute("data-jahr", st.jahr);
    sec.setAttribute("data-epoche-name", DATA.epochen[st.epoche].name);
    sec.setAttribute("data-zeitraum", DATA.epochen[st.epoche].zeitraum);

    sec.appendChild(flairLayer(st.epoche));
    sec.appendChild(el("div", "station__ghost", pad(st.id)));

    var inner = el("div", "station__inner reveal");
    inner.appendChild(el("div", "station__year", esc(st.jahr)));
    inner.appendChild(el("div", "station__eyebrow",
      "Epoche " + st.epoche + " · " + esc(DATA.epochen[st.epoche].name)));
    inner.appendChild(el("h3", "station__title", highlight(st.titel)));
    inner.appendChild(el("hr", "station__rule"));
    inner.appendChild(el("p", "station__text", highlight(st.text)));
    sec.appendChild(inner);

    app.appendChild(sec);
    navItems.push({ id: sec.id, jahr: st.jahr, titel: st.titel, epoche: st.epoche });
  });

  /* --- FAZIT ----------------------------------------------------------- */
  (function buildFazit() {
    var f = DATA.fazit;
    var sec = el("section", "fazit");
    sec.id = "fazit";
    sec.setAttribute("data-epoche", "VIII");
    sec.setAttribute("data-jahr", "Fazit");
    sec.setAttribute("data-epoche-name", "Fazit");
    sec.setAttribute("data-zeitraum", "");
    var inner = el("div", "fazit__inner reveal");
    inner.appendChild(el("div", "fazit__kicker", "Fazit"));
    inner.appendChild(el("h2", "fazit__title", esc(f.titel)));
    var ul = el("ul", "fazit__list");
    f.punkte.forEach(function (p) {
      // Pfeile hervorheben
      var html = esc(p).replace(/→/g, '<span class="accent">→</span>');
      html = html.replace(/»([^«]+)«/g, '»<span class="accent">$1</span>«');
      ul.appendChild(el("li", "fazit__item", html));
    });
    inner.appendChild(ul);
    inner.appendChild(el("p", "fazit__frage", esc(f.frage)));
    sec.appendChild(inner);
    app.appendChild(sec);
    navItems.push({ id: sec.id, jahr: "?", titel: f.titel, epoche: "VIII" });
  })();

  /* --- FOOTER ---------------------------------------------------------- */
  (function buildFooter() {
    var foot = el("footer", "footer");
    foot.appendChild(el("p", "footer__note", esc(DATA.meta.hinweis)));
    foot.appendChild(el("p", "footer__meta",
      esc(DATA.meta.titel) + " · " + esc(DATA.meta.untertitel) +
      " — interaktive Präsentation, Gesellschaft & Kultur im Wandel."));
    app.appendChild(foot);
  })();

  /* --- Fixe UI-Elemente: Progress, HUD, Timeline ----------------------- */
  var progress = el("div", "progress");
  document.body.appendChild(progress);

  var hud = el("div", "hud");
  hud.setAttribute("aria-hidden", "true");
  var hudEpoche = el("div", "hud__epoche");
  var hudName = el("div", "hud__name");
  var hudZeit = el("div", "hud__zeit");
  hud.appendChild(hudEpoche); hud.appendChild(hudName); hud.appendChild(hudZeit);
  document.body.appendChild(hud);

  var timeline = el("nav", "timeline");
  timeline.setAttribute("aria-label", "Zeitleiste");
  navItems.forEach(function (item) {
    var dot = el("button", "timeline__dot");
    dot.type = "button";
    dot.setAttribute("data-label", item.jahr + " · " + item.titel.replace(/»|«/g, ""));
    dot.setAttribute("data-target", item.id);
    dot.setAttribute("aria-label", item.jahr + " – " + item.titel);
    dot.addEventListener("click", function () {
      var t = document.getElementById(item.id);
      if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    timeline.appendChild(dot);
  });
  document.body.appendChild(timeline);
  var dots = Array.prototype.slice.call(timeline.children);

  /* --- Scroll-Fortschritt --------------------------------------------- */
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    progress.style.width = pct + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* --- Reveal-Beobachter ---------------------------------------------- */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("is-in"); revealObserver.unobserve(e.target); }
    });
  }, { threshold: 0.18 });
  document.querySelectorAll(".reveal").forEach(function (n) { revealObserver.observe(n); });

  /* --- Aktive Sektion: HUD, Progress-Farbe, Timeline ------------------- */
  var sections = document.querySelectorAll("section[data-epoche]");
  var activeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var sec = e.target;
      var accent = getComputedStyle(sec).getPropertyValue("--accent").trim();
      if (accent) progress.style.color = accent;

      var name = sec.getAttribute("data-epoche-name");
      var zeit = sec.getAttribute("data-zeitraum") || "";
      var jahr = sec.getAttribute("data-jahr") || "";
      if (name) {
        hudEpoche.textContent = jahr && jahr !== "Fazit" ? "Epoche " + sec.getAttribute("data-epoche") : "";
        hudName.textContent = name;
        hudZeit.textContent = zeit;
      }
      // Timeline-Dot: passende Farbe + aktiv markieren
      dots.forEach(function (d) {
        var on = d.getAttribute("data-target") === sec.id;
        d.setAttribute("aria-current", on ? "true" : "false");
        if (on && accent) d.style.setProperty("--dot", accent);
      });
    });
  }, { threshold: 0.5, rootMargin: "-10% 0px -40% 0px" });
  sections.forEach(function (s) { activeObserver.observe(s); });

  /* --- Tastatur: Pfeile springen zwischen Sektionen -------------------- */
  var allSecs = Array.prototype.slice.call(document.querySelectorAll("section"));
  document.addEventListener("keydown", function (ev) {
    if (ev.key !== "ArrowDown" && ev.key !== "ArrowUp") return;
    if (ev.target && /^(INPUT|TEXTAREA|SELECT)$/.test(ev.target.tagName)) return;
    ev.preventDefault();
    var y = window.scrollY + 5;
    var idx = 0;
    for (var i = 0; i < allSecs.length; i++) {
      if (allSecs[i].offsetTop <= y) idx = i;
    }
    var next = ev.key === "ArrowDown" ? Math.min(idx + 1, allSecs.length - 1) : Math.max(idx - 1, 0);
    allSecs[next].scrollIntoView({ behavior: "smooth", block: "start" });
  });

  /* --- Hilfsfunktionen ------------------------------------------------- */
  function roman(x) { return x; } // Epochen-Schlüssel sind bereits römisch
  function pad(n) { return (n < 10 ? "0" : "") + n; }

})();
