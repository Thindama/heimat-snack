/* Regenschild – Interaktionen (Vorlage: hhomepage-Nachbau) */
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

  /* ---------- Scroll-Reveal ---------- */
  var revealTargets = document.querySelectorAll('.benefit, .service-card, .result-card, .price-card, .step, .post-card, .case-card, .compare-card, .office-card, .form, .keyfact, .emergency, .phase-img');
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); } });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in'); });
  }

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
