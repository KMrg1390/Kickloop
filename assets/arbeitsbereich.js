/* Gemeinsames Skript für das Zwei-Tab-Modell und die grüne Zeile (2026-11-20)

   Tab 1 „Webseite“       = Shop und Mitarbeiter-Portal (index.html)
   Tab 2 „Arbeitsbereich“ = Übersicht (/arbeitsbereich/), Themenseiten (/lf2, /lf3), Übungsseiten (/uebungen)
                            und die Einzel-Übungen in index.html (#quiz-…, #pyramide, #organigramm, #popup)

   Was dieses Skript tut
   1. Tab-Namen vergeben, damit Links immer denselben zweiten Tab treffen und kein dritter entsteht.
   2. Die grüne Zeile oben einsetzen (Stil: assets/arbeitsbereich.css):
      - im Arbeitsbereich: Rückweg links, rechts Namensschild und „Zur Webseite“,
      - auf der Webseite: laufende Aufgabe links, rechts Namensschild und „Arbeitsbereich“.
   3. Namensschild: Name einmal eintragen, steht dann in allen Dateien. „Nicht du?“ löscht alles auf dem Gerät.
   4. Themenseiten: jeder Schritt bekommt einen Knopf mit Verb und ein Häkchen „Erledigt“; am Ende die Abgabe-Karte.
   5. Übersicht: Stand je Thema und „Weiter bei: …“.

   Gespeichert wird nur im Browser dieses Geräts (localStorage, Schlüssel beginnen mit „kickloop:“):
     kickloop:me            { name, sex }        – derselbe Eintrag wie in index.html
     kickloop:fortschritt   { "/lf2/x.html": { titel, gesamt, erledigt: { "<href>": true }, naechster } }
     kickloop:letztes-thema { href, titel }
     kickloop:aufgabe       { titel, thema, href, zeit }   – Schritt, der gerade auf der Webseite läuft

   Einbinden
     Seiten des Arbeitsbereichs:  <script src="/assets/arbeitsbereich.js" defer></script>
     index.html:                  <script src="/assets/arbeitsbereich.js" data-mode="manual"></script>
                                  Dort schaltet das Seitenskript selbst um: KLArbeitsbereich.aktiv(true|false, Titel) */
(function () {
  "use strict";
  var AB = "kickloop-arbeitsbereich", WEB = "kickloop-webseite";
  var HOME = "/arbeitsbereich/";
  var ICON_AB = "/assets/icon-arbeitsbereich.svg", ICON_WEB = "/assets/icon-webseite.svg";
  var manual = !!(document.currentScript && document.currentScript.getAttribute("data-mode") === "manual");
  /* Seiten, die bewusst in einem eigenen Tab laufen (z. B. der Excel-Kurs): data-tab="eigen".
     Sie nehmen dem Arbeitsbereich-Tab den Namen nicht weg. Der Rückweg wechselt in den Arbeitsbereich-Tab (data-zurueck, data-zurueck-titel). */
  var eigenerTab = !!(document.currentScript && document.currentScript.getAttribute("data-tab") === "eigen");
  var zurueckHref = (document.currentScript && document.currentScript.getAttribute("data-zurueck")) || HOME;
  var zurueckTitel = (document.currentScript && document.currentScript.getAttribute("data-zurueck-titel")) || "Arbeitsbereich";
  var path = location.pathname;
  var THEMA_RE = /^\/lf[0-9]+\/[^\/]+\.html$/;
  var isHome = /^\/arbeitsbereich\/?(index\.html)?$/.test(path);
  var isThema = THEMA_RE.test(path);
  var titelBasis = null, modus = null;

  /* ---------- kleine Helfer ---------- */
  function merke(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function lies(k) { try { return JSON.parse(sessionStorage.getItem(k)); } catch (e) { return null; } }
  function liesLS(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function schreibLS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function ich() { var m = liesLS("kickloop:me"); return m && typeof m === "object" ? m : { name: "", sex: "" }; }
  function kuerzel(name) { return String(name || "").split(/\s+/).filter(Boolean).map(function (w) { return w[0]; }).join("").slice(0, 2).toUpperCase(); }
  function dateiName(name) {
    return String(name || "").trim().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/Ä/g, "Ae").replace(/Ö/g, "Oe").replace(/Ü/g, "Ue").replace(/ß/g, "ss")
      .normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ı/g, "i").replace(/\s+/g, "_").replace(/[^A-Za-z0-9_-]/g, "");
  }

  function icon(href) {
    var l = document.querySelector('link[rel~="icon"]');
    if (!l) { l = document.createElement("link"); l.rel = "icon"; l.type = "image/svg+xml"; document.head.appendChild(l); }
    if (l.getAttribute("href") !== href) l.setAttribute("href", href);
  }

  /* ---------- Namensschild ---------- */
  function schildHTML() {
    var n = ich().name;
    return n ? '<i aria-hidden="true">' + esc(kuerzel(n)) + '</i><span>' + esc(n) + '</span>' : '<span class="kl-ohne">Name<em> eintragen</em></span>';
  }
  function schildNeu() {
    var b = document.querySelector(".kl-ich");
    if (b) { b.innerHTML = schildHTML(); b.classList.toggle("leer", !ich().name); }
    document.documentElement.classList.toggle("kl-hat-name", !!ich().name);
    dateienBenennen();
    abgabeNeu();
  }
  function nameDialog() {
    var alt = document.querySelector(".kl-dlg");
    if (alt) alt.remove();
    var d = document.createElement("dialog");
    d.className = "kl-dlg";
    d.innerHTML =
      '<form method="dialog" class="kl-form">' +
        '<b class="kl-dt">Dein Name</b>' +
        '<label for="kl-name">Vorname und Nachname</label>' +
        '<input id="kl-name" autocomplete="off" placeholder="z. B. Selin Aydın" value="' + esc(ich().name) + '">' +
        '<p>Dein Name steht in deinen Dateien. Er wird nur auf diesem Gerät gespeichert.</p>' +
        '<div class="kl-zeile"><button type="submit" class="kl-ok" value="ok">Speichern</button><button type="button" class="kl-ab">Abbrechen</button></div>' +
        '<div class="kl-weg"><b>Nicht du?</b><span>Dann lösche zuerst alles, was auf diesem Gerät gespeichert ist.</span>' +
        '<button type="button" class="kl-loesch">Alles auf diesem Gerät löschen</button></div>' +
      '</form>';
    document.body.appendChild(d);
    var inp = d.querySelector("#kl-name"), loesch = d.querySelector(".kl-loesch"), scharf = false;
    d.querySelector(".kl-ab").addEventListener("click", function () { d.close(); });
    d.querySelector(".kl-form").addEventListener("submit", function () {
      var m = ich(); m.name = inp.value.trim(); if (typeof m.sex !== "string") m.sex = "";
      schreibLS("kickloop:me", m);
      schildNeu();
      try { window.dispatchEvent(new Event("kickloop:me")); } catch (e) {}
    });
    loesch.addEventListener("click", function () {
      if (!scharf) { scharf = true; loesch.textContent = "Wirklich alles löschen? Noch einmal klicken."; loesch.classList.add("scharf"); return; }
      try {
        Object.keys(localStorage).filter(function (k) { return /^(kickloop|marketing-training)/i.test(k); }).forEach(function (k) { localStorage.removeItem(k); });
        Object.keys(sessionStorage).filter(function (k) { return /^kl:/.test(k); }).forEach(function (k) { sessionStorage.removeItem(k); });
      } catch (e) {}
      location.reload();
    });
    d.addEventListener("close", function () { d.remove(); });
    if (d.showModal) d.showModal(); else d.setAttribute("open", "");
    inp.focus(); inp.select();
  }

  /* ---------- grüne Zeile ---------- */
  function aufgabe() {
    var a = liesLS("kickloop:aufgabe");
    return a && a.titel && a.zeit && Date.now() - a.zeit < 3 * 60 * 60 * 1000 ? a : null;   /* nach drei Stunden gilt die Aufgabe nicht mehr als „läuft“ */
  }
  function leiste(art) {
    var bar = document.createElement("nav");
    bar.className = "kl-bar" + (art === "web" ? " kl-tuer" : "");
    bar.setAttribute("aria-label", art === "web" ? "Unterricht" : "Arbeitsbereich");
    var links;
    if (art === "web") {
      var a = aufgabe();
      links = a
        ? '<a class="kl-auf" href="' + esc(THEMA_RE.test(a.href || "") ? a.href : HOME) + '" target="' + AB + '" title="Zurück zum Arbeitsbereich"><em>Aufgabe:</em> ' + esc(a.titel) + '</a>'
        : '<span class="kl-auf leer">Modellunternehmen für den Unterricht</span>';
      bar.innerHTML = links + '<span class="kl-sp"></span><button type="button" class="kl-ich" title="Dein Name"></button>' +
        '<a class="kl-web" href="' + HOME + '" target="' + AB + '" title="Öffnet den Arbeitsbereich in einem zweiten Tab">Arbeitsbereich ↗</a>';
    } else {
      /* Rückweg zum Thema nur, wenn man wirklich von dieser Themenseite kommt. Bei direktem Aufruf (QR-Code, Lesezeichen) führt der Rückweg zur Übersicht. */
      var thema = lies("kl:thema"), ref = "";
      try { var u = new URL(document.referrer); if (u.origin === location.origin) ref = u.pathname; } catch (e) {}
      var refIstThema = THEMA_RE.test(ref);
      if (!(thema && thema.href && thema.href === ref)) thema = refIstThema ? { href: ref, titel: "" } : null;
      if (eigenerTab) links = '<a class="kl-back" href="' + esc(zurueckHref) + '" target="' + AB + '" title="Wechselt in den Tab Arbeitsbereich">← ' + esc(zurueckTitel) + ' ↗</a>';
      else if (isHome) links = '<span class="kl-here">Arbeitsbereich</span>';
      else if (isThema || !thema) links = '<a class="kl-back" href="' + HOME + '">← Arbeitsbereich</a>';
      else links = '<a class="kl-back" href="' + esc(thema.href) + '" title="Zurück zum Thema">← ' + esc(thema.titel || "Zurück zum Thema") + '</a>';
      bar.innerHTML = links + '<span class="kl-sp"></span><button type="button" class="kl-ich" title="Dein Name"></button>' +
        '<a class="kl-web" href="/" target="' + WEB + '" title="Wechselt in den Tab mit der Webseite von Kickloop">Zur Webseite ↗</a>';
    }
    bar.querySelector(".kl-ich").addEventListener("click", nameDialog);
    return bar;
  }
  function setze(art) {
    var alt = document.querySelector(".kl-bar");
    if (alt) alt.remove();
    if (!document.body) return;
    document.body.insertBefore(leiste(art), document.body.firstChild);
    schildNeu();
  }

  function an(titel) {
    modus = "ab";
    if (!eigenerTab) { try { window.name = AB; } catch (e) {} }
    document.documentElement.classList.add("kl-ab");
    document.documentElement.classList.remove("kl-web");
    icon(ICON_AB);
    setze("ab");
    if (titelBasis === null) titelBasis = document.title;
    var t = titel || titelBasis;
    document.title = /Arbeitsbereich/.test(t) ? t : t + " · Arbeitsbereich";
  }
  function aus() {
    modus = "web";
    try { window.name = WEB; } catch (e) {}
    document.documentElement.classList.remove("kl-ab");
    document.documentElement.classList.add("kl-web");
    icon(ICON_WEB);
    setze("web");
    if (titelBasis !== null) document.title = titelBasis;
  }

  /* Wechselt der Browser nicht von selbst in den anderen Tab, bleibt diese Seite sichtbar: dann kurz sagen, wo es weitergeht. */
  function hinweis(text) {
    setTimeout(function () {
      if (document.visibilityState !== "visible" || !document.hasFocus()) return;
      var alt = document.querySelector(".kl-hint");
      if (alt) alt.remove();
      var h = document.createElement("div");
      h.className = "kl-hint";
      h.setAttribute("role", "status");
      h.textContent = text;
      document.body.appendChild(h);
      setTimeout(function () { h.remove(); }, 7000);
    }, 700);
  }

  document.addEventListener("click", function (ev) {
    if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
    var a = ev.target && ev.target.closest ? ev.target.closest('a[target="' + WEB + '"], a[target="' + AB + '"]') : null;
    if (!a) return;
    var ziel = a.getAttribute("target");
    /* Schritt, der auf der Webseite spielt: merken, damit die Webseite „Aufgabe: …“ zeigen kann */
    if (ziel === WEB && a.getAttribute("data-schritt")) {
      schreibLS("kickloop:aufgabe", { titel: a.getAttribute("data-schritt"), thema: (document.querySelector("h1") || {}).textContent || "", href: path, zeit: Date.now() });
    }
    if (ziel === window.name) return;            /* schon im richtigen Tab: Link ganz normal folgen */
    /* „Nur wechseln“: Die Knöpfe der grünen Zeile holen den anderen Tab nach vorn, ohne ihn neu zu laden. So bleibt man dort, wo man war.
       Schritte mit einem festen Ziel (z. B. /#einkauf) laden dieses Ziel im Webseiten-Tab. */
    var nurWechseln = ziel === AB || a.classList.contains("kl-web");
    var w = null;
    try {
      if (nurWechseln) {
        w = window.open("", ziel);
        var leer = true;
        try { leer = !w.location || w.location.href === "about:blank"; } catch (e) { leer = false; }
        if (w && leer) w.location.href = a.href;
      } else {
        w = window.open(a.href, ziel);
      }
    } catch (e) { w = null; }
    if (!w) return;                               /* Pop-up blockiert: der Link öffnet wie gewohnt über target */
    ev.preventDefault();
    try { w.focus(); } catch (e) {}
    hinweis(ziel === AB
      ? "Der Arbeitsbereich ist im anderen Tab geöffnet. Wechsle oben in den Tab „Arbeitsbereich“."
      : "Die Webseite ist im anderen Tab geöffnet. Wechsle oben in den Tab „Kickloop Online-Shop“.");
  });

  /* Name oder Aufgabe wurde in einem anderen Tab oder vom Seitenskript geändert */
  window.addEventListener("storage", function (e) {
    if (e.key === "kickloop:me") schildNeu();
    if (e.key === "kickloop:aufgabe" && modus === "web") setze("web");
    if (e.key === "kickloop:fortschritt" && isHome) uebersicht();
  });
  window.addEventListener("kickloop:me", function () { var b = document.querySelector(".kl-ich"); if (b) { b.innerHTML = schildHTML(); b.classList.toggle("leer", !ich().name); } document.documentElement.classList.toggle("kl-hat-name", !!ich().name); });

  /* ---------- Themenseite: Schritt-Karten, Häkchen, Abgabe ---------- */
  function fortschritt() { var f = liesLS("kickloop:fortschritt"); return f && typeof f === "object" ? f : {}; }
  function titelVon(karte) { var b = karte.querySelector("b"); return b ? b.textContent.replace(/^⬇\s*/, "").replace(/\s*↗$/, "").trim() : ""; }

  function karteUmbauen(a, mitHaken) {
    var href = a.getAttribute("href"), ziel = a.getAttribute("target"), laden = a.hasAttribute("download");
    var k = document.createElement("div");
    k.className = a.className;
    while (a.firstChild) k.appendChild(a.firstChild);
    var zeile = document.createElement("div");
    zeile.className = "akt";
    var knopf = document.createElement("a");
    knopf.className = "sbtn" + (laden ? " laden" : "");
    knopf.setAttribute("href", href);
    if (ziel) { knopf.setAttribute("target", ziel); knopf.setAttribute("data-schritt", titelVon(k)); }
    if (a.getAttribute("rel")) knopf.setAttribute("rel", a.getAttribute("rel"));
    if (laden) { knopf.setAttribute("download", a.getAttribute("download") || ""); knopf.setAttribute("data-datei", href.split("/").pop()); }
    knopf.textContent = laden ? "Herunterladen" : ziel === WEB ? "Zur Webseite ↗" : "Starten";
    knopf.setAttribute("aria-label", knopf.textContent.replace(" ↗", "") + ": " + titelVon(k));
    zeile.appendChild(knopf);
    if (mitHaken) {
      var l = document.createElement("label");
      l.className = "erl";
      l.innerHTML = '<input type="checkbox"> Erledigt';
      l.querySelector("input").setAttribute("data-schritt-id", href);
      zeile.appendChild(l);
    }
    k.appendChild(zeile);
    a.parentNode.replaceChild(k, a);
    return k;
  }

  function standSchreiben() {
    var lis = document.querySelectorAll("ol.steps > li"), f = fortschritt(), m = { titel: (document.querySelector("h1") || {}).textContent || "", gesamt: 0, erledigt: {}, naechster: "" };
    Array.prototype.forEach.call(lis, function (li) {
      var box = li.querySelector('input[data-schritt-id]');
      if (!box) return;
      m.gesamt++;
      li.classList.toggle("fertig", box.checked);
      if (box.checked) m.erledigt[box.getAttribute("data-schritt-id")] = true;
      else if (!m.naechster) m.naechster = titelVon(li);
    });
    f[path] = m;
    schreibLS("kickloop:fortschritt", f);
    var zahl = Object.keys(m.erledigt).length, s = document.getElementById("kl-stand");
    if (s) {
      s.innerHTML = m.gesamt && zahl === m.gesamt
        ? "<b>Alle " + m.gesamt + " Schritte erledigt.</b> Stark!"
        : "<b>" + zahl + " von " + m.gesamt + " Schritten erledigt.</b> Hake ab, was du geschafft hast.";
      s.classList.toggle("alle", !!m.gesamt && zahl === m.gesamt);
    }
  }

  function dateienBenennen() {
    var n = dateiName(ich().name);
    Array.prototype.forEach.call(document.querySelectorAll("a[data-datei]"), function (a) {
      var d = a.getAttribute("data-datei"), i = d.lastIndexOf(".");
      a.setAttribute("download", n && i > 0 ? d.slice(0, i) + "_" + n + d.slice(i) : d);
    });
  }

  function abgabeNeu() {
    var box = document.querySelector(".finish.abgabe .ab1");
    if (!box) return;
    var n = dateiName(ich().name);
    box.innerHTML = n
      ? "Speichere deine Dateien. Dein Name steht schon im Dateinamen: <span class=\"mono\">…_" + esc(n) + "</span>"
      : "Trage oben rechts deinen Namen ein. Dann steht er in jedem Dateinamen. Speichere deine Dateien.";
  }

  function themenseite() {
    var lis = document.querySelectorAll("ol.steps > li");
    if (!lis.length) return;
    var f = fortschritt(), mein = (f[path] && f[path].erledigt) || {};
    Array.prototype.forEach.call(lis, function (li) {
      var a = null, kinder = li.children;
      for (var i = 0; i < kinder.length; i++) if (kinder[i].tagName === "A" && kinder[i].classList.contains("ucard")) { a = kinder[i]; break; }
      if (a) {
        var k = karteUmbauen(a, true), box = k.querySelector("input[data-schritt-id]");
        box.checked = !!mein[box.getAttribute("data-schritt-id")];
        box.addEventListener("change", standSchreiben);
      }
      Array.prototype.forEach.call(li.querySelectorAll(".sx a.ucard"), function (x) { karteUmbauen(x, false); });
    });
    var ol = document.querySelector("ol.steps"), s = document.createElement("p");
    s.id = "kl-stand"; s.className = "stand";
    ol.parentNode.insertBefore(s, ol);
    /* Abgabe-Karte: nur auf Seiten, auf denen eine Datei entsteht (Arbeitsblatt oder Übung auf der Webseite mit Word-Datei) */
    var fin = document.querySelector(".finish");
    if (fin) {
      var mitDatei = !!document.querySelector('.steps a[download], .steps a[target="' + WEB + '"]');
      if (!mitDatei) fin.remove();
      else {
        fin.classList.add("abgabe");
        fin.innerHTML = '<div><b>Abgeben</b><ol><li class="ab1"></li><li>Lege sie in IServ unter „Dateien“ ab.</li><li>Schicke sie als IServ-Mail an deine Lehrkraft.</li></ol></div>';
      }
    }
    standSchreiben();
    dateienBenennen();
    abgabeNeu();
  }

  /* ---------- Übersicht: Stand je Thema und „Weiter bei“ ---------- */
  function uebersicht() {
    var f = fortschritt();
    Array.prototype.forEach.call(document.querySelectorAll(".steps a.ucard[href]"), function (a) {
      var m = f[a.getAttribute("href")], alt = a.querySelector(".tstand");
      if (alt) alt.remove();
      var li = a.closest("li"), haupt = li && a.parentNode === li;
      if (!m || !m.gesamt) { if (haupt) li.classList.remove("fertig"); return; }
      var zahl = Object.keys(m.erledigt || {}).length;
      if (!zahl) { if (haupt) li.classList.remove("fertig"); return; }
      var s = document.createElement("span");
      s.className = "tstand" + (zahl === m.gesamt ? " alle" : "");
      s.innerHTML = zahl === m.gesamt ? "✓ fertig" : zahl + " von " + m.gesamt + " Schritten erledigt<i><u style=\"width:" + Math.round(100 * zahl / m.gesamt) + "%\"></u></i>";
      a.appendChild(s);
      if (haupt) li.classList.toggle("fertig", zahl === m.gesamt);
    });
    var knopf = document.getElementById("kl-weiter"), letztes = liesLS("kickloop:letztes-thema");
    if (knopf && letztes && THEMA_RE.test(letztes.href || "") && letztes.titel) {
      knopf.setAttribute("href", letztes.href);
      knopf.textContent = "Weiter bei: " + letztes.titel + " →";
      var m2 = f[letztes.href], z = document.getElementById("kl-naechster");
      if (!z) { z = document.createElement("p"); z.id = "kl-naechster"; z.className = "naechster"; knopf.parentNode.parentNode.insertBefore(z, knopf.parentNode.nextSibling); }
      z.textContent = m2 && m2.naechster ? "Nächster Schritt: " + m2.naechster : "";
      z.hidden = !z.textContent;
    }
  }

  window.KLArbeitsbereich = { aktiv: function (on, titel) { if (on) an(titel); else aus(); }, name: nameDialog, AB: AB, WEB: WEB };

  if (manual) return;
  function start() {
    if (isThema) {
      var h = document.querySelector("h1");
      var thema = { href: path, titel: h ? h.textContent.trim() : "" };
      merke("kl:thema", thema);
      schreibLS("kickloop:letztes-thema", thema);
    }
    an();
    if (isThema) themenseite();
    if (isHome) uebersicht();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
