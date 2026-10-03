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
      a.addEventListener('click', function () { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); });
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
    ['.result-card', 'tilt'], ['.price-card', 'zoom'], ['.case-card', 'zoom'], ['.form', ''], ['.emergency', 'from-left'],
    ['.office-card', 'from-right'], ['.compare-card.others', 'from-left'], ['.compare-card.us', 'from-right']
  ].forEach(function (r) {
    each(r[0], function (el) { el.classList.add('reveal'); if (r[1]) el.classList.add(r[1]); });
  });
  stagger('.benefit'); stagger('.service-card'); stagger('.post-card', 3); stagger('.step'); stagger('.result-card', 3); stagger('.price-card');
  stagger('.trust-row li', 6); stagger('.keyfacts .keyfact', 6); stagger('.acc-item', 8);
  each('.icon-list', function (ul) {
    if (ul.closest('.hero') || ul.closest('.site-footer')) return;
    ul.classList.add('stagger');
    Array.prototype.forEach.call(ul.children, function (li, i) { li.style.setProperty('--i', i); });
  });
  onView(all('.reveal, .kicker, .steps-grid, .footer-brand, .icon-list.stagger, .accordion, .faq .container'), addIn);

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
    each('.hero, .cta-banner', function (sec) {
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

  /* Seite geladen: Hero-Einstieg starten */
  function loaded() { requestAnimationFrame(function () { root.classList.add('is-loaded'); }); }
  if (document.readyState === 'complete') loaded(); else window.addEventListener('load', loaded);
  setTimeout(loaded, 1200);

  /* Scroll-gekoppelte Effekte in einem Frame gebündelt */
  var header = $('header'), hero = document.querySelector('.hero'), heroContent = document.querySelector('.hero-content');
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
    if (header) header.classList.toggle('is-scrolled', y > 40);
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

  /* ---------- Schnellcheck ---------- */
  var checkForm = $('checkForm');
  var lastCheck = { r: 0, s: 0, h: 0, recs: [] };
  var kontakt = $('kontakt');
  function level(n) { return n === 0 ? ['offen', 0] : n <= 2 ? ['niedrig', 1] : n <= 5 ? ['mittel', 2] : ['hoch', 3]; }
  if (checkForm) {
    var inputs = Array.prototype.slice.call(checkForm.querySelectorAll('input[type="checkbox"]'));
    var recList = $('recList'), hint = $('resultHint');
    var bars = { r: 'bar-r', s: 'bar-s', h: 'bar-h' }, lvls = { r: 'lvl-r', s: 'lvl-s', h: 'lvl-h' };
    function updateCheck() {
      var sc = { r: 0, s: 0, h: 0 }, recs = [];
      inputs.forEach(function (i) {
        if (!i.checked) return;
        var r = +i.getAttribute('data-r') || 0, s = +i.getAttribute('data-s') || 0, h = +i.getAttribute('data-h') || 0;
        sc.r += r; sc.s += s; sc.h += h;
        recs.push({ t: i.getAttribute('data-tip'), w: r + s + h });
      });
      ['r', 's', 'h'].forEach(function (k) {
        var lv = level(sc[k]);
        $(bars[k]).style.width = (Math.min(sc[k] / 8, 1) * 100) + '%';
        var le = $(lvls[k]); le.textContent = lv[0]; le.className = 'lvl lvl--' + lv[1];
      });
      recs.sort(function (a, b) { return b.w - a.w; });
      recList.innerHTML = recs.length ? recs.slice(0, 6).map(function (r) { return '<li>' + esc(r.t) + '</li>'; }).join('') : '<li class="empty">Ihre Empfehlungen erscheinen hier.</li>';
      hint.textContent = (sc.r + sc.s + sc.h) > 0
        ? 'Je länger der Balken, desto dringender die Säule. Das ist eine Ersteinschätzung – der Vor-Ort-Check entscheidet.'
        : 'Noch nichts angekreuzt. Jede Auswahl verändert die Balken sofort.';
      lastCheck = { r: sc.r, s: sc.s, h: sc.h, recs: recs };
    }
    inputs.forEach(function (i) { i.addEventListener('change', updateCheck); });
    updateCheck();
    var toInq = $('toInquiry');
    if (toInq) toInq.addEventListener('click', function () {
      var msg = $('f-msg');
      if (msg) {
        var parts = [];
        [['r', 'Starkregen', 'f-regen'], ['s', 'Sturm', 'f-sturm'], ['h', 'Hagel', 'f-hagel']].forEach(function (p) {
          if (lastCheck[p[0]] > 0) parts.push(p[1] + ': ' + level(lastCheck[p[0]])[0] + ' (' + lastCheck[p[0]] + ' Punkte)');
          var chip = $(p[2]); if (chip && lastCheck[p[0]] >= 3) chip.checked = true;
        });
        if (parts.length) {
          var txt = 'Schnellcheck: ' + parts.join(', ') + '.\nZuerst prüfen: ' + lastCheck.recs.slice(0, 6).map(function (r) { return r.t; }).join('; ') + '.';
          msg.value = (msg.value ? msg.value + '\n\n' : '') + txt;
        }
      }
      if (kontakt) kontakt.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
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
