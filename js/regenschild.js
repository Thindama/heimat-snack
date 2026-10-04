/* Regenschild – Interaktionen und Animationen */
(function () {
  'use strict';

  /* WhatsApp-Nummer international ohne "+" und Leerzeichen, z. B. '4917612345678'.
     Solange leer, bleibt der Button "Per WhatsApp senden" inaktiv. */
  var KONTAKT = { whatsapp: '' };

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------- Mobile Navigation + Untermenüs ---------- */
  var toggle = $('nav-toggle');
  var nav = $('main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      var hd = $('header'); if (hd) hd.classList.toggle('menu-open', open);
    });
    nav.querySelectorAll('.menu > .menu-item > a').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var item = link.parentElement;
        var isMobile = window.matchMedia('(max-width: 1024px)').matches;
        if ((isMobile || link.getAttribute('href') === '#') && (item.classList.contains('has-sub') || item.classList.contains('has-mega'))) {
          e.preventDefault();
          var wasOpen = item.classList.contains('open');
          nav.querySelectorAll('.menu-item.open').forEach(function (o) { o.classList.remove('open'); });
          if (!wasOpen) item.classList.add('open');
        }
      });
    });
    nav.querySelectorAll('.sub a, .mega a, .menu-item:not(.has-sub):not(.has-mega) > a, .main-nav > .btn').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); var hd = $('header'); if (hd) hd.classList.remove('menu-open'); });
    });
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) nav.querySelectorAll('.menu-item.open').forEach(function (o) { o.classList.remove('open'); });
    });
    var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    nav.querySelectorAll('.menu > .menu-item > a').forEach(function (a) {
      if ((a.getAttribute('href') || '').toLowerCase() === file) a.classList.add('is-active');
    });
  }

  /* ---------- Faktenband: Endlosschleife ---------- */
  var track = document.querySelector('#client-marquee .marquee-track');
  if (track) track.innerHTML += track.innerHTML;

  /* ---------- Bewegung: Scroll-Effekte und Animationen ---------- */
  var root = document.documentElement;
  var hasIO = 'IntersectionObserver' in window;
  var motion = !reduce && hasIO;
  if (motion) root.classList.add('motion');

  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }
  function onView(els, fn, opts) {
    if (!els.length) return;
    if (!motion) { els.forEach(fn); return; }
    var o = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { fn(en.target); o.unobserve(en.target); } });
    }, opts || { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { o.observe(el); });
  }
  function all(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  /* Icons zeichnen per requestAnimationFrame (Strichlänge über pathLength=1) */
  function drawIcons(scope) {
    var paths = scope.querySelectorAll('.draw [pathLength]');
    if (!paths.length) return;
    var delay = 250 + (parseInt(getComputedStyle(scope).getPropertyValue('--i'), 10) || 0) * 90, dur = 1400, t0 = null;
    function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function tick(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(Math.max((ts - t0 - delay) / dur, 0), 1), off = (1 - ease(p)).toFixed(4);
      Array.prototype.forEach.call(paths, function (el) { el.style.strokeDashoffset = off; });
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  function addIn(el) {
    el.classList.add('in');
    if (motion) drawIcons(el);
    if (el.classList.contains('reveal')) setTimeout(function () { el.classList.add('done'); }, 1600);
  }

  /* Staffelung: Index innerhalb der Geschwister setzen */
  function stagger(sel, mod) {
    each(sel, function (el) {
      var sibs = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.matches(sel); });
      el.style.setProperty('--i', sibs.indexOf(el) % (mod || 4));
    });
  }

  /* Überschriften Wort für Wort aufbauen */
  function splitWords(el) {
    var wi = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var parts = child.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
          parts.forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var outer = document.createElement('span'), inner = document.createElement('span');
            outer.className = 'sw'; inner.textContent = part; inner.style.setProperty('--wi', wi++);
            outer.appendChild(inner); frag.appendChild(outer);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) { walk(child); }
      });
    })(el);
  }
  var heads = all('main h2, .hero-title');
  if (motion) heads.forEach(splitWords);
  onView(heads, function (h) { h.classList.add('split-in'); }, { threshold: 0.3 });

  /* Reveal-Varianten */
  [
    ['.benefit', ''], ['.service-card', ''], ['.post-card', ''], ['.step', ''], ['.keyfact', ''],
    ['.result-card', 'tilt'], ['.price-card', 'zoom'], ['.case-card', 'zoom'], ['.form', ''], ['.emergency', 'from-left'], ['.moment', 'zoom'], ['.pnum', ''], ['.quote', ''],
    ['.office-card', 'from-right'], ['.compare-card.others', 'from-left'], ['.compare-card.us', 'from-right']
  ].forEach(function (r) {
    each(r[0], function (el) { el.classList.add('reveal'); if (r[1]) el.classList.add(r[1]); });
  });
  stagger('.benefit'); stagger('.service-card'); stagger('.post-card', 3); stagger('.step'); stagger('.result-card', 3); stagger('.price-card');
  stagger('.trust-row li', 6); stagger('.moment', 3); stagger('.pnum'); stagger('.quote', 3); stagger('.keyfacts .keyfact', 6); stagger('.acc-item', 8);
  each('.icon-list', function (ul) {
    if (ul.closest('.hero') || ul.closest('.site-footer')) return;
    ul.classList.add('stagger');
    Array.prototype.forEach.call(ul.children, function (li, i) { li.style.setProperty('--i', i); });
  });
  onView(all('.reveal, .kicker, .steps-grid, .footer-brand, .icon-list.stagger, .accordion, .faq .container, .manifesto'), addIn);

  /* Bilder mit Wisch-Effekt */
  each('.pillar-shot, .post-img, .phase-img, .team-img, .office-img', function (el) { el.classList.add('wipe'); });
  stagger('.pillar-shot', 3);
  /* Beobachtet wird das Elternelement: Chrome wertet den Clip-Pfad des
     versteckten Bildes sonst als unsichtbar und löst nie aus. */
  var wipeHosts = [];
  each('.wipe', function (el) { if (wipeHosts.indexOf(el.parentElement) < 0) wipeHosts.push(el.parentElement); });
  onView(wipeHosts, function (host) {
    Array.prototype.forEach.call(host.children, function (c) { if (c.classList.contains('wipe')) c.classList.add('in'); });
  }, { threshold: 0.15 });

  /* Icons zeichnen: pathLength=1 erlaubt eine einheitliche Strich-Animation */
  each('.icon-box svg, .service-card svg.s', function (svg) {
    svg.classList.add('draw');
    Array.prototype.forEach.call(svg.querySelectorAll('path, rect, circle, line, polyline, ellipse'), function (p) { p.setAttribute('pathLength', '1'); });
  });

  /* Lichtschein auf Karten */
  each('.price-card, .service-card, .result-card, .compare-card.us', function (card) {
    var g = document.createElement('span'); g.className = 'glow'; g.setAttribute('aria-hidden', 'true');
    card.appendChild(g); card.classList.add('has-glow');
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* Wetter im Hero und im Abschlussband: Regen, Sturm oder Hagel */
  function weatherTile(kind, size) {
    var n = kind === 'hail' ? 16 : 34, out = '';
    for (var k = 0; k < n; k++) {
      var x = (Math.random() * size).toFixed(1), y = (Math.random() * size).toFixed(1);
      if (kind === 'hail') {
        var r = (1.4 + Math.random() * 2.2).toFixed(1);
        out += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="rgba(235,245,255,' + (0.45 + Math.random() * 0.45).toFixed(2) + ')"/>';
      } else {
        var len = (kind === 'storm' ? 26 : 16) + Math.random() * 30;
        out += '<line x1="' + x + '" y1="' + y + '" x2="' + x + '" y2="' + (+y + len).toFixed(1) + '" stroke="rgba(205,228,247,' + (0.25 + Math.random() * 0.5).toFixed(2) + ')" stroke-width="' + (0.8 + Math.random() * 0.9).toFixed(2) + '" stroke-linecap="round"/>';
      }
    }
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' + out + '</svg>';
    return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
  }
  var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var kind = page.indexOf('hagel') === 0 ? 'hail' : page.indexOf('sturm') === 0 ? 'storm' : 'rain';
  var wxLayers = [];
  if (motion) {
    each('.hero, .cta-banner, .wiz', function (sec) {
      var wx = document.createElement('div'); wx.className = 'wx wx--' + kind; wx.setAttribute('aria-hidden', 'true');
      [260, 180].forEach(function (sz) { var i = document.createElement('i'); i.style.setProperty('--img', weatherTile(kind, sz)); wx.appendChild(i); });
      sec.insertBefore(wx, sec.firstChild);
      if (kind !== 'hail') { var fl = document.createElement('div'); fl.className = 'wx-flash'; fl.setAttribute('aria-hidden', 'true'); wx.after(fl); }
      wxLayers.push(wx);
    });
    var wio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle('is-paused', !en.isIntersecting); });
    });
    wxLayers.forEach(function (w) { wio.observe(w); });
  }

  /* Hero-Karte: Balken und Stufen beim Laden */
  var heroCard = $('heroCard');
  if (heroCard) {
    setTimeout(function () {
      each('#heroCard .gauge-fill', function (f) { f.style.width = f.getAttribute('data-w') + '%'; });
      each('#heroCard .lvl', function (l) { l.textContent = l.getAttribute('data-hl'); });
    }, reduce ? 0 : 1300);
  }
  var heroVisual = document.querySelector('.hero-visual');
  if (heroVisual && motion && window.matchMedia('(min-width: 1025px)').matches) {
    var heroSec = heroVisual.closest('.hero');
    heroSec.addEventListener('pointermove', function (e) {
      var r = heroSec.getBoundingClientRect(), dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5;
      heroVisual.style.transform = 'perspective(1200px) rotateY(' + (dx * 6).toFixed(2) + 'deg) rotateX(' + (-dy * 6).toFixed(2) + 'deg)';
    });
    heroSec.addEventListener('pointerleave', function () { heroVisual.style.transform = ''; });
  }

  /* Stapelkarten auf dem Handy: untere Karte schiebt sich über die obere */
  var stacks = all('.stack');
  var isStackView = function () { return window.matchMedia('(max-width: 1024px)').matches; };
  function updateStacks() {
    if (!stacks.length) return;
    var on = isStackView();
    stacks.forEach(function (st) {
      var kids = Array.prototype.filter.call(st.children, function (c) { return c.nodeType === 1; });
      kids.forEach(function (card, i) {
        card.style.setProperty('--i', i);
        if (on && i < kids.length - 1) { var hgt = card.offsetHeight; card.style.marginBottom = (-(Math.max(0, hgt - 260))) + 'px'; } else card.style.marginBottom = '';
        if (!on || i === kids.length - 1) { if (card.classList.contains('in') || !card.classList.contains('reveal')) card.style.transform = ''; return; }
        var r = card.getBoundingClientRect(), n = kids[i + 1].getBoundingClientRect();
        if (n.top < r.bottom) {
          var p = Math.max(0, Math.min(1, (n.top - r.top) / r.height));
          if (card.classList.contains('in') || !card.classList.contains('reveal')) card.style.transform = 'scale(' + (0.9 + 0.1 * p).toFixed(3) + ')';
        } else if (card.classList.contains('in') || !card.classList.contains('reveal')) card.style.transform = '';
      });
    });
  }

  /* Wischleisten: Punkte unter der Leiste */
  each('.snap', function (snap) {
    var hint = snap.nextElementSibling && snap.nextElementSibling.classList.contains('snap-hint') ? snap.nextElementSibling : null;
    if (!hint) { hint = document.createElement('div'); hint.className = 'snap-hint'; hint.setAttribute('aria-hidden', 'true'); snap.after(hint); }
    var kids = Array.prototype.filter.call(snap.children, function (c) { return c.nodeType === 1; });
    hint.innerHTML = kids.map(function () { return '<i></i>'; }).join('');
    var dots = hint.querySelectorAll('i');
    function upd() {
      var mid = snap.scrollLeft + snap.clientWidth / 2, best = 0, bd = 1e9;
      kids.forEach(function (k, i) { var d = Math.abs(k.offsetLeft + k.offsetWidth / 2 - mid); if (d < bd) { bd = d; best = i; } });
      dots.forEach(function (d, i) { d.classList.toggle('is-on', i === best); });
    }
    snap.addEventListener('scroll', function () { requestAnimationFrame(upd); }, { passive: true });
    upd();
  });

  /* Seite geladen: Hero-Einstieg starten */
  function loaded() { requestAnimationFrame(function () { root.classList.add('is-loaded'); }); }
  if (document.readyState === 'complete') loaded(); else window.addEventListener('load', loaded);
  setTimeout(loaded, 1200);

  /* Scroll-gekoppelte Effekte in einem Frame gebündelt */
  var header = $('header'), hero = document.querySelector('.hero'), heroContent = document.querySelector('.hero-content');
  var darkTop = document.querySelector('main > .hero:first-child, main > section.hero');
  var floating = document.querySelector('.floating-buttons');
  var bar = null;
  if (motion) { bar = document.createElement('div'); bar.className = 'scroll-progress'; bar.setAttribute('aria-hidden', 'true'); document.body.appendChild(bar); }
  var parallax = all('.office-card, .team-img, .phase-img');
  var darks = all('.dark-radial');
  var banners = all('.cta-banner');
  var ticking = false;
  function frame() {
    ticking = false;
    var y = window.scrollY, vh = window.innerHeight, docH = document.documentElement.scrollHeight - vh;
    if (header) {
      header.classList.toggle('is-scrolled', y > 40);
      header.classList.toggle('on-dark', !!darkTop && y < darkTop.offsetHeight - 90);
    }
    updateStacks();
    if (floating) floating.classList.toggle('show', !motion || y > (hero ? hero.offsetHeight * 0.6 : 200));
    if (!motion) return;
    bar.style.transform = 'scaleX(' + (docH > 0 ? Math.min(y / docH, 1) : 0) + ')';
    if (hero && y < hero.offsetHeight + 100) {
      hero.style.setProperty('--bg-shift', (y * 0.35).toFixed(1) + 'px');
      if (heroContent) {
        heroContent.style.setProperty('--hero-y', (y * 0.25).toFixed(1) + 'px');
        heroContent.style.setProperty('--hero-o', Math.max(0, 1 - y / (hero.offsetHeight * 0.85)).toFixed(3));
      }
    }
    parallax.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      var d = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.translate = '0 ' + (d * -40).toFixed(1) + 'px';
    });
    darks.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var p = (vh - r.top) / (vh + r.height);
      el.style.setProperty('--gy', (15 + p * 70).toFixed(1) + '%');
    });
    banners.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      el.style.setProperty('--bg-shift', ((r.top + r.height / 2 - vh / 2) * -0.25).toFixed(1) + 'px');
    });
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  window.addEventListener('resize', frame);
  frame();

  /* ---------- Zähler ---------- */
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    if (reduce) { el.textContent = target; return; }
    var start = null, duration = 1400;
    el.textContent = '0';
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) { animateCounter(entry.target); cio.unobserve(entry.target); } });
    }, { threshold: 0.2 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- FAQ Accordion ---------- */
  document.querySelectorAll('.acc-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.closest('.acc-item').querySelector('.acc-panel');
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.acc-btn[aria-expanded="true"]').forEach(function (other) {
        if (other !== btn) { other.setAttribute('aria-expanded', 'false'); other.closest('.acc-item').querySelector('.acc-panel').style.maxHeight = null; }
      });
      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      panel.style.maxHeight = expanded ? null : panel.scrollHeight + 'px';
    });
  });

  /* ---------- KI-Check als Schrittfolge ---------- */
  var wiz = $('wiz');
  var lastCheck = { r: 0, s: 0, h: 0, recs: [], place: '', weather: null, obj: '' };
  var kontakt = $('kontakt');
  function level(n) { return n === 0 ? ['offen', 0] : n <= 2 ? ['niedrig', 1] : n <= 5 ? ['mittel', 2] : ['hoch', 3]; }
  var SYSNAME = { dichtschott: 'Dichtschotts', rueckstau: 'Rückstausicherung', kellerluken: 'Druckwasserdichte Luken', dammbalken: 'Dammbalken', flutwand: 'Mobile Flutwände', klappschott: 'Klappschott', sturmklammern: 'Sturmklammern', windwaechter: 'Windwächter', hagelschutz: 'Hagelfeste Bauteile', sonderbauten: 'Sonderbauten nach Maß', hochwassertueren: 'Hochwassertüren', zubehoer: 'Wassermelder und Alarm' };
  function fmtDate(iso) { if (!iso) return ''; var p = iso.split('-'); return p[2] + '.' + p[1] + '.' + p[0]; }

  if (wiz) {
    var steps = all('#wiz .wiz-step');
    var order = steps.map(function (st) { return st.getAttribute('data-step'); });
    var qSteps = ['addr', 'obj', 'keller', 'dach', 'technik', 'past', 'scan'];
    var idx = 0;
    var wnav = $('wizNav'), wnext = $('wizNext'), whint = $('wizHint'), wback = $('wizBack'), wprog = $('wizProg'), wlabel = $('wizStep');
    var addrIn = $('w-addr'), addrList = $('w-addrList'), addrFound = $('w-addrFound');
    var geo = null, weather = null, debounce = null;

    function show(i, backwards) {
      steps.forEach(function (st, k) { st.classList.toggle('is-active', k === i); st.classList.toggle('is-back', k === i && !!backwards); });
      idx = i;
      var name = order[i], qi = qSteps.indexOf(name);
      wprog.style.width = name === 'start' ? '0%' : name === 'result' ? '100%' : ((qi + 1) / 7 * 100) + '%';
      wlabel.textContent = name === 'start' ? 'Start' : name === 'result' ? 'Ergebnis' : 'Schritt ' + (qi + 1) + ' von 7';
      wback.hidden = name === 'start' || name === 'scan' || name === 'result';
      wnav.hidden = name === 'start' || name === 'scan' || name === 'result';
      validate();
      if (name !== 'start') { var r = wiz.getBoundingClientRect(); if (r.top < 0 || r.top > window.innerHeight * 0.5) wiz.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }
      if (name === 'addr') setTimeout(function () { addrIn.focus(); }, 450);
      if (name === 'scan') runScan();
    }
    function validate() {
      var name = order[idx], ok = true;
      if (name === 'obj') ok = !!wiz.querySelector('input[name="w-obj"]:checked');
      else if (['keller', 'dach', 'technik', 'past'].indexOf(name) >= 0) ok = !!steps[idx].querySelector('input:checked');
      wnext.disabled = !ok;
      whint.textContent = ok ? '' : (name === 'obj' ? 'Bitte eine Option wählen.' : 'Bitte mindestens eine Option wählen – oder „Nichts davon“.');
      if (name === 'addr') {
        wnext.textContent = geo ? 'Weiter' : (addrIn.value.trim() ? 'Adresse prüfen und weiter' : 'Weiter');
        whint.textContent = geo ? '' : 'Ohne Adresse rechnen wir ohne Wetterdaten.';
      } else { wnext.textContent = name === 'past' ? 'Analyse starten' : 'Weiter'; }
    }
    function go(d) { var i = idx + d; if (i < 0 || i >= steps.length) return; show(i, d < 0); }

    wiz.addEventListener('change', function (e) {
      var inp = e.target;
      if (inp.type === 'checkbox') {
        var box = inp.closest('.choices');
        if (inp.getAttribute('data-none') && inp.checked) { Array.prototype.forEach.call(box.querySelectorAll('input:not([data-none])'), function (o) { o.checked = false; }); }
        else if (!inp.getAttribute('data-none') && inp.checked) { var n = box.querySelector('input[data-none]'); if (n) n.checked = false; }
      }
      validate();
      if (inp.type === 'radio' && order[idx] === 'obj') setTimeout(function () { if (order[idx] === 'obj') go(1); }, 380);
    });
    $('wizStart').addEventListener('click', function () { go(1); });
    wback.addEventListener('click', function () { go(-1); });
    wnext.addEventListener('click', function () {
      if (order[idx] === 'addr' && !geo && addrIn.value.trim()) { geocode(addrIn.value.trim(), true); return; }
      go(1);
    });
    $('wizRestart').addEventListener('click', function () {
      Array.prototype.forEach.call(wiz.querySelectorAll('input'), function (i) { if (i.type === 'text') i.value = ''; else i.checked = false; });
      geo = null; weather = null; addrFound.hidden = true; addrList.hidden = true;
      show(0, true);
    });
    wiz.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target === addrIn) { e.preventDefault(); geocode(addrIn.value.trim(), false); }
      else if (e.key === 'Enter' && !wnav.hidden && !wnext.disabled && e.target.tagName !== 'BUTTON') { e.preventDefault(); wnext.click(); }
    });

    /* Adresse: Photon (OpenStreetMap-Daten), Ersatz Nominatim */
    function mapPhoton(j) {
      return (j.features || []).map(function (f) {
        var p = f.properties, street = (p.street || p.name || '') + (p.housenumber ? ' ' + p.housenumber : '');
        var city = p.city || p.town || p.village || p.county || '';
        return { name: [street, [p.postcode, city].filter(Boolean).join(' ')].filter(Boolean).join(', '), city: city, lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0] };
      });
    }
    function photon(q, limit) {
      return fetch('https://photon.komoot.io/api/?q=' + encodeURIComponent(q) + '&limit=' + limit + '&lang=de&bbox=5.5,45.5,17.5,55.5').then(function (r) { return r.json(); }).then(mapPhoton);
    }
    function nominatim(q, limit) {
      return fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&accept-language=de&limit=' + limit + '&q=' + encodeURIComponent(q)).then(function (r) { return r.json(); })
        .then(function (j) { return j.map(function (r) { return { name: r.display_name.split(',').slice(0, 3).join(','), city: '', lat: +r.lat, lon: +r.lon }; }); });
    }
    function lookup(q, limit) { return photon(q, limit).then(function (res) { return res.length ? res : nominatim(q, limit); }).catch(function () { return nominatim(q, limit); }); }
    function pick(r) {
      geo = r; addrIn.value = r.name; addrList.hidden = true; addrFound.hidden = false;
      $('w-addrName').textContent = r.name;
      $('w-addrMeta').textContent = 'Wetterdaten und Höhenlage werden für diesen Punkt geladen (' + r.lat.toFixed(4) + ', ' + r.lon.toFixed(4) + ').';
      validate();
    }
    function suggest(q) {
      lookup(q, 5).then(function (res) {
        addrList.innerHTML = '';
        res.forEach(function (r) { var li = document.createElement('li'); li.textContent = r.name; li.addEventListener('click', function () { pick(r); }); addrList.appendChild(li); });
        addrList.hidden = !res.length;
      }).catch(function () { addrList.hidden = true; });
    }
    function geocode(q, advance) {
      if (!q) { go(1); return; }
      wnext.disabled = true; whint.textContent = 'Adresse wird gesucht …';
      lookup(q, 1).then(function (res) {
        if (res.length) { pick(res[0]); if (advance) go(1); }
        else { whint.textContent = 'Adresse nicht gefunden. Bitte Ort ergänzen oder ohne Adresse weiter.'; wnext.disabled = false; }
      }).catch(function () { whint.textContent = 'Adresssuche gerade nicht erreichbar. Sie können ohne Adresse weitermachen.'; wnext.disabled = false; });
    }
    addrIn.addEventListener('input', function () {
      geo = null; addrFound.hidden = true; validate(); clearTimeout(debounce);
      var q = addrIn.value.trim();
      if (q.length < 4) { addrList.hidden = true; return; }
      debounce = setTimeout(function () { suggest(q); }, 350);
    });
    $('w-addrBtn').addEventListener('click', function () { geocode(addrIn.value.trim(), false); });
    $('w-addrSkip').addEventListener('click', function () { geo = null; addrFound.hidden = true; go(1); });
    document.addEventListener('click', function (e) { if (!addrList.contains(e.target) && e.target !== addrIn) addrList.hidden = true; });

    /* Wetterarchiv und Höhenmodell (Open-Meteo) */
    function fetchWeather(g) {
      var end = new Date(); end.setDate(end.getDate() - 7);
      var start = new Date(end); start.setFullYear(start.getFullYear() - 10);
      function fmt(d) { return d.toISOString().slice(0, 10); }
      var wx = fetch('https://archive-api.open-meteo.com/v1/archive?latitude=' + g.lat + '&longitude=' + g.lon + '&start_date=' + fmt(start) + '&end_date=' + fmt(end) + '&daily=precipitation_sum,wind_gusts_10m_max&timezone=Europe%2FBerlin').then(function (r) { return r.json(); });
      var d = 0.0025, lats = [], lons = [];
      [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]].forEach(function (o) { lats.push((g.lat + o[0] * d).toFixed(5)); lons.push((g.lon + o[1] * d * 1.5).toFixed(5)); });
      var el = fetch('https://api.open-meteo.com/v1/elevation?latitude=' + lats.join(',') + '&longitude=' + lons.join(',')).then(function (r) { return r.json(); }).catch(function () { return null; });
      return Promise.all([wx, el]).then(function (res) { return analyze(res[0], res[1]); });
    }
    function analyze(wx, el) {
      var t = wx.daily.time, pr = wx.daily.precipitation_sum, gu = wx.daily.wind_gusts_10m_max;
      var out = { rainDays30: 0, rainDays50: 0, stormDays75: 0, stormDays100: 0, thunder: 0, topRain: [], topGust: [], years: 10 };
      var rain = [], gust = [];
      for (var i = 0; i < t.length; i++) {
        if (pr[i] != null) {
          if (pr[i] >= 30) out.rainDays30++;
          if (pr[i] >= 50) out.rainDays50++;
          var m = +t[i].slice(5, 7); if (m >= 5 && m <= 9 && pr[i] >= 25) out.thunder++;
          rain.push([pr[i], t[i]]);
        }
        if (gu[i] != null) { if (gu[i] >= 75) out.stormDays75++; if (gu[i] >= 100) out.stormDays100++; gust.push([gu[i], t[i]]); }
      }
      rain.sort(function (a, b) { return b[0] - a[0]; }); gust.sort(function (a, b) { return b[0] - a[0]; });
      out.topRain = rain.slice(0, 3); out.topGust = gust.slice(0, 3);
      out.maxRain = rain.length ? rain[0][0] : 0; out.maxRainDate = rain.length ? rain[0][1] : '';
      out.maxGust = gust.length ? gust[0][0] : 0; out.maxGustDate = gust.length ? gust[0][1] : '';
      out.years = Math.max(1, Math.round((new Date(t[t.length - 1]) - new Date(t[0])) / 31557600000));
      if (el && el.elevation && el.elevation.length > 4) {
        var e = el.elevation, here = e[0], around = e.slice(1).filter(function (v) { return v != null; });
        var avg = around.reduce(function (a, b) { return a + b; }, 0) / around.length;
        out.elev = here; out.elevDiff = here - avg; out.relief = Math.max.apply(null, around) - Math.min.apply(null, around);
        out.terrain = out.elevDiff <= -3 ? 'Senke' : out.elevDiff >= 3 ? 'erhöht' : (out.relief >= 15 ? 'Hanglage' : 'eben');
      }
      return out;
    }

    function runScan() {
      var lines = all('#scanLines li');
      lines.forEach(function (l) { l.classList.remove('is-on', 'is-done'); });
      var i = 0;
      var timer = setInterval(function () {
        if (i > 0) lines[i - 1].classList.add('is-done');
        if (i < lines.length) { lines[i].classList.add('is-on'); i++; } else clearInterval(timer);
      }, 750);
      var p = geo ? fetchWeather(geo).catch(function () { return null; }) : Promise.resolve(null);
      Promise.all([p, new Promise(function (r) { setTimeout(r, reduce ? 800 : 4300); })]).then(function (res) {
        weather = res[0]; clearInterval(timer);
        lines.forEach(function (l) { l.classList.add('is-on', 'is-done'); });
        setTimeout(function () { renderResult(); show(order.indexOf('result')); }, 450);
      });
    }

    function renderResult() {
      var sc = { r: 0, s: 0, h: 0 }, recs = [], sysIds = [];
      Array.prototype.forEach.call(wiz.querySelectorAll('.choices input[type="checkbox"]:checked:not([data-none])'), function (i) {
        var r = +i.getAttribute('data-r') || 0, s = +i.getAttribute('data-s') || 0, h = +i.getAttribute('data-h') || 0;
        sc.r += r; sc.s += s; sc.h += h;
        if (i.getAttribute('data-tip')) recs.push({ t: i.getAttribute('data-tip'), w: r + s + h });
        if (i.getAttribute('data-sys')) sysIds = sysIds.concat(i.getAttribute('data-sys').split(','));
      });
      var objEl = wiz.querySelector('input[name="w-obj"]:checked'), obj = objEl ? objEl.value : '';
      if (obj === 'Mehrfamilienhaus' || obj === 'Gewerbe' || obj === 'Öffentliches Gebäude') recs.push({ t: 'Schutzkonzept mit Einsatzplan: Wer löst im Ernstfall was aus?', w: 4 });
      if (obj === 'Denkmalgeschütztes Gebäude') { recs.push({ t: 'Unauffällige Systeme, vorab mit der Denkmalbehörde abgestimmt', w: 5 }); sysIds.push('sonderbauten'); }
      if (obj === 'Immobilienkauf') recs.push({ t: 'Unwetter-Check vor dem Kauf als Grundlage für die Preisverhandlung', w: 5 });
      var facts = [], w = weather, placeTxt = geo ? geo.name : 'ohne Standort';
      if (w) {
        if (w.rainDays30 >= 12) sc.r += 2; else if (w.rainDays30 >= 6) sc.r += 1;
        if (w.rainDays50 >= 2) sc.r += 1;
        if (w.terrain === 'Senke') { sc.r += 2; recs.unshift({ t: 'Ihr Grundstück liegt tiefer als die Umgebung: Zulauf von Oberflächenwasser und Schutzlinie prüfen', w: 9 }); sysIds.push('dammbalken', 'flutwand'); }
        if (w.terrain === 'Hanglage') { sc.r += 1; recs.push({ t: 'Hanglage: Hangwasser, Entwässerung und Rückstau prüfen', w: 6 }); }
        if (w.stormDays75 >= 25) sc.s += 2; else if (w.stormDays75 >= 10) sc.s += 1;
        if (w.stormDays100 >= 2) sc.s += 1;
        if (w.thunder >= 15) sc.h += 2; else if (w.thunder >= 7) sc.h += 1;
        facts.push({ v: Math.round(w.maxRain) + ' mm', l: 'stärkster Regentag, ' + fmtDate(w.maxRainDate), c: w.maxRain >= 50 ? 'is-hot' : w.maxRain >= 30 ? 'is-warn' : '' });
        facts.push({ v: w.rainDays30, l: 'Tage mit über 30 mm Regen in ' + w.years + ' Jahren', c: w.rainDays30 >= 12 ? 'is-hot' : w.rainDays30 >= 6 ? 'is-warn' : '' });
        facts.push({ v: Math.round(w.maxGust) + ' km/h', l: 'stärkste Sturmböe, ' + fmtDate(w.maxGustDate), c: w.maxGust >= 100 ? 'is-hot' : w.maxGust >= 75 ? 'is-warn' : '' });
        facts.push({ v: w.stormDays75, l: 'Tage mit Sturmböen über 75 km/h', c: w.stormDays75 >= 25 ? 'is-hot' : w.stormDays75 >= 10 ? 'is-warn' : '' });
        facts.push({ v: w.thunder, l: 'Sommertage mit über 25 mm Regen (Gewitter- und Hagelhinweis)', c: w.thunder >= 15 ? 'is-hot' : w.thunder >= 7 ? 'is-warn' : '' });
        if (w.terrain) {
          var tv = w.terrain === 'Senke' ? Math.abs(w.elevDiff).toFixed(1).replace('.', ',') + ' m tiefer' : w.terrain === 'erhöht' ? w.elevDiff.toFixed(1).replace('.', ',') + ' m höher' : w.terrain;
          facts.push({ v: tv, l: 'als die Umgebung · ' + Math.round(w.elev) + ' m ü. M.', c: w.terrain === 'Senke' ? 'is-hot' : w.terrain === 'Hanglage' ? 'is-warn' : '' });
        }
      }
      ['r', 's', 'h'].forEach(function (k) {
        var lv = level(sc[k]), bar = $('bar-' + k), le = $('lvl-' + k);
        bar.style.width = '0'; le.textContent = lv[0]; le.className = 'lvl lvl--' + lv[1];
        setTimeout(function () { bar.style.width = (Math.min(sc[k] / 9, 1) * 100) + '%'; }, 120);
      });
      $('resPlace').textContent = placeTxt;
      $('resultHint').textContent = w ? 'Je länger der Balken, desto dringender die Säule. Wetterdaten für ' + (geo.city || 'Ihren Standort') + ', ' + w.years + ' Jahre.' : (geo ? 'Wetterdaten konnten nicht geladen werden. Das Ergebnis beruht auf Ihren Angaben.' : 'Ohne Adresse beruht das Ergebnis nur auf Ihren Angaben.');
      $('wfacts').innerHTML = facts.map(function (f) { return '<div class="wfact ' + f.c + '"><b>' + f.v + '</b><span>' + esc(f.l) + '</span></div>'; }).join('');
      var ev = $('events');
      if (w && (w.topRain.length || w.topGust.length)) {
        ev.innerHTML = '<h4>Vergangene Ereignisse an diesem Standort</h4><ul>' +
          w.topRain.map(function (e) { return '<li><b>' + fmtDate(e[1]) + '</b><span>' + Math.round(e[0]) + ' mm Regen an einem Tag</span></li>'; }).join('') +
          w.topGust.map(function (e) { return '<li><b>' + fmtDate(e[1]) + '</b><span>Sturmböen bis ' + Math.round(e[0]) + ' km/h</span></li>'; }).join('') + '</ul>';
      } else ev.innerHTML = '';
      recs.sort(function (a, b) { return b.w - a.w; });
      var seen = {}; recs = recs.filter(function (r) { if (seen[r.t]) return false; seen[r.t] = true; return true; });
      $('recList').innerHTML = recs.length ? recs.slice(0, 6).map(function (r) { return '<li>' + esc(r.t) + '</li>'; }).join('') : '<li>Keine besonderen Schwachstellen angegeben. Ein Erstcheck mit Fotos lohnt sich trotzdem.</li>';
      var uniq = []; sysIds.forEach(function (id) { if (SYSNAME[id] && uniq.indexOf(id) < 0) uniq.push(id); });
      $('resSys').innerHTML = uniq.length ? 'Passende Systeme: ' + uniq.slice(0, 5).map(function (id) { return '<a href="systeme.html#' + id + '">' + SYSNAME[id] + '</a>'; }).join(' · ') : '';
      lastCheck = { r: sc.r, s: sc.s, h: sc.h, recs: recs, place: placeTxt, weather: w, obj: obj };
    }

    var toInq = $('toInquiry');
    if (toInq) toInq.addEventListener('click', function () {
      var msg = $('f-msg');
      if (msg) {
        var parts = [];
        [['r', 'Starkregen', 'f-regen'], ['s', 'Sturm', 'f-sturm'], ['h', 'Hagel', 'f-hagel']].forEach(function (p) {
          if (lastCheck[p[0]] > 0) parts.push(p[1] + ': ' + level(lastCheck[p[0]])[0] + ' (' + lastCheck[p[0]] + ' Punkte)');
          var chip = $(p[2]); if (chip && lastCheck[p[0]] >= 3) chip.checked = true;
        });
        var txt = 'KI-Check' + (lastCheck.obj ? ' (' + lastCheck.obj + ')' : '') + ': ' + (parts.length ? parts.join(', ') : 'keine Angaben') + '.';
        if (lastCheck.place && lastCheck.place !== 'ohne Standort') txt += '\nStandort: ' + lastCheck.place;
        var w = lastCheck.weather;
        if (w) txt += '\nWetter (' + w.years + ' Jahre): max. ' + Math.round(w.maxRain) + ' mm/Tag, ' + w.rainDays30 + ' Tage über 30 mm, max. Böe ' + Math.round(w.maxGust) + ' km/h' + (w.terrain ? ', Lage: ' + w.terrain : '') + '.';
        if (lastCheck.recs.length) txt += '\nZuerst prüfen: ' + lastCheck.recs.slice(0, 6).map(function (r) { return r.t; }).join('; ') + '.';
        msg.value = (msg.value ? msg.value + '\n\n' : '') + txt;
        var ort = $('f-ort'); if (ort && !ort.value && lastCheck.place && lastCheck.place !== 'ohne Standort') ort.value = lastCheck.place;
      }
      if (kontakt) kontakt.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
    show(0);
  }

  /* ---------- Anfrage vorbereiten ---------- */
  var inquiry = $('inquiry');
  if (inquiry) {
    var files = $('f-fotos'), thumbs = $('thumbs'), drop = $('dropzone'), fileCount = 0;
    function showFiles(list) {
      thumbs.innerHTML = '';
      fileCount = list.length;
      Array.prototype.slice.call(list, 0, 8).forEach(function (f) {
        if (!f.type || f.type.indexOf('image/') !== 0) return;
        var reader = new FileReader();
        reader.onload = function (e) { var img = new Image(); img.src = e.target.result; img.alt = ''; thumbs.appendChild(img); };
        reader.readAsDataURL(f);
      });
      if (list.length > 8) { var s = document.createElement('span'); s.textContent = '+' + (list.length - 8) + ' weitere'; thumbs.appendChild(s); }
    }
    files.addEventListener('change', function () { showFiles(files.files); });
    ['dragenter', 'dragover'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('over'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('over'); }); });
    drop.addEventListener('drop', function (e) {
      if (e.dataTransfer && e.dataTransfer.files.length) { try { files.files = e.dataTransfer.files; } catch (_) {} showFiles(e.dataTransfer.files); }
    });
    inquiry.addEventListener('submit', function (e) {
      e.preventDefault();
      function v(id) { var el = $(id); return el ? el.value.trim() : ''; }
      var anliegen = Array.prototype.slice.call(inquiry.querySelectorAll('input[name="anliegen"]:checked')).map(function (c) { return c.value; });
      var lines = ['Hallo Regenschild,', 'ich möchte mein Haus kostenlos prüfen lassen.', '',
        'Name: ' + (v('f-name') || '–'),
        'Objekt: ' + v('f-typ') + (v('f-ort') ? ' in ' + v('f-ort') : ''),
        'Anliegen: ' + (anliegen.length ? anliegen.join(', ') : 'allgemeiner Unwetter-Check'),
        'Fotos: ' + (fileCount ? fileCount + ' Foto(s) hänge ich an.' : 'schicke ich nach.')];
      if (v('f-msg')) lines.push('', v('f-msg'));
      lines.push('', 'Bitte um eine erste Einschätzung. Vielen Dank!');
      var out = $('f-out');
      out.value = lines.join('\n');
      $('compose').classList.add('show');
      var wa = $('waBtn'), note = $('waNote');
      if (KONTAKT.whatsapp) {
        wa.href = 'https://wa.me/' + KONTAKT.whatsapp + '?text=' + encodeURIComponent(out.value);
        wa.classList.remove('is-disabled'); wa.removeAttribute('aria-disabled'); note.hidden = true;
      } else {
        wa.classList.add('is-disabled'); wa.setAttribute('aria-disabled', 'true'); wa.removeAttribute('href'); note.hidden = false;
      }
      out.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    });
    $('copyBtn').addEventListener('click', function () {
      var out = $('f-out'), toast = $('toast');
      function done(msg) { toast.textContent = msg; toast.classList.add('show'); setTimeout(function () { toast.classList.remove('show'); }, 2500); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(out.value).then(function () { done('Kopiert'); }, function () { out.focus(); out.select(); done('Text markiert – jetzt kopieren'); });
      } else { out.focus(); out.select(); done('Text markiert – jetzt kopieren'); }
    });
  }

  /* ---------- Unternavigation auf Säulen-Seiten ---------- */
  var subnav = document.querySelector('.subnav');
  if (subnav && 'IntersectionObserver' in window) {
    var links = Array.prototype.slice.call(subnav.querySelectorAll('a'));
    var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) links.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id); }); });
    }, { rootMargin: '-35% 0px -55% 0px' });
    secs.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Nach oben ---------- */
  var toTop = $('to-top');
  if (toTop) {
    window.addEventListener('scroll', function () { toTop.classList.toggle('show', window.scrollY > 400); }, { passive: true });
    toTop.addEventListener('click', function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
  }
})();
