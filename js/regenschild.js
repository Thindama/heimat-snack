/* Regenschild – Interaktionen, Animationen, Schnellcheck, Anfrage */
(function () {
  'use strict';

  /* Kontaktdaten: WhatsApp-Nummer im internationalen Format ohne "+" und Leerzeichen,
     z. B. '4917612345678'. Solange leer, bleibt der WhatsApp-Button inaktiv. */
  var KONTAKT = { whatsapp: '' };

  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function $(id) { return document.getElementById(id); }

  /* ---------- Header, Fortschritt, Parallax, Floating-CTA ---------- */
  var header = document.querySelector('.site-header');
  var progress = $('progress');
  var floatCta = $('floatCta');
  var heroImg = $('heroImg');
  var kontakt = $('kontakt');
  var steps = $('steps');
  var stepsLine = $('stepsLine');

  function stepsProgress() {
    if (!steps || !stepsLine) return;
    var r = steps.getBoundingClientRect();
    var p = Math.min(Math.max((window.innerHeight * 0.8 - r.top) / r.height, 0), 1);
    stepsLine.style.width = (p * 84) + '%';
  }
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('scrolled', y > 10);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
    if (floatCta) {
      var near = kontakt ? kontakt.getBoundingClientRect().top < window.innerHeight * 0.7 : false;
      floatCta.classList.toggle('show', y > 500 && !near);
    }
    if (heroImg && !reduce) heroImg.style.transform = 'translateY(' + Math.min(y * 0.22, 260) + 'px)';
    stepsProgress();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', stepsProgress);
  onScroll();

  /* ---------- Navigation ---------- */
  var burger = $('burger');
  var nav = $('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); });
    });
    var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    nav.querySelectorAll('a:not(.btn)').forEach(function (a) {
      if ((a.getAttribute('href') || '').toLowerCase() === file) a.classList.add('is-active');
    });
  }

  /* ---------- Regen / Hagel auf Canvas ---------- */
  function initRain(canvas) {
    if (!canvas || reduce) return;
    var mode = canvas.getAttribute('data-mode') || 'rain';
    var ctx = canvas.getContext('2d');
    var W = 0, H = 0, drops = [], running = false, raf = 0, visible = false, t = 0;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    function make(init) {
      if (mode === 'hail') {
        return { x: Math.random() * W, y: init ? Math.random() * H : -10, r: 1.2 + Math.random() * 2.4, sp: 7 + Math.random() * 7, op: 0.35 + Math.random() * 0.5 };
      }
      return { x: Math.random() * W * 1.25 - W * 0.1, y: init ? Math.random() * H : -24, len: 10 + Math.random() * 20, sp: 9 + Math.random() * 10, op: 0.08 + Math.random() * 0.3, w: 0.7 + Math.random() };
    }
    function resize() {
      var r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = Math.floor(W * dpr); canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.floor(W * H / (mode === 'hail' ? 14000 : 8500));
      drops = [];
      for (var i = 0; i < n; i++) drops.push(make(true));
    }
    function frame() {
      if (!running) return;
      t++;
      var wind = 0.35 + Math.sin(t / 170) * 0.45;
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = 'round';
      for (var i = 0; i < drops.length; i++) {
        var d = drops[i];
        if (mode === 'hail') {
          ctx.fillStyle = 'rgba(235,248,255,' + d.op + ')';
          ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
          d.y += d.sp; d.x += Math.sin((t + i) / 9) * 0.6;
          if (d.y > H + 10) drops[i] = make(false);
        } else {
          ctx.strokeStyle = 'rgba(190,232,255,' + d.op + ')';
          ctx.lineWidth = d.w;
          ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - wind * d.len * 0.55, d.y + d.len); ctx.stroke();
          d.y += d.sp; d.x -= wind * d.sp * 0.55;
          if (d.y > H + 24 || d.x < -40) drops[i] = make(false);
        }
      }
      raf = requestAnimationFrame(frame);
    }
    function start() { if (running || !visible || document.hidden) return; running = true; frame(); }
    function stop() { running = false; cancelAnimationFrame(raf); }
    resize();
    window.addEventListener('resize', resize);
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; visible ? start() : stop(); }).observe(canvas);
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  }
  initRain($('rain'));

  /* ---------- Wetterleuchten ---------- */
  function initFlash(el) {
    if (!el || reduce) return;
    function strike() {
      if (!document.hidden) {
        el.classList.add('on');
        setTimeout(function () { el.classList.remove('on'); }, 90);
        setTimeout(function () { el.classList.add('on'); }, 170);
        setTimeout(function () { el.classList.remove('on'); }, 290);
      }
      setTimeout(strike, 8000 + Math.random() * 10000);
    }
    setTimeout(strike, 2500 + Math.random() * 2500);
  }
  initFlash($('flash'));

  /* ---------- Faktenband + Zähler ---------- */
  var ticker = $('ticker');
  if (ticker) ticker.innerHTML += ticker.innerHTML;
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    if (reduce) { el.textContent = target; return; }
    el.textContent = '0';
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * e);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.2 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- Scroll-Reveal ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (reduce) {
    revealEls.forEach(function (e) { e.classList.add('in'); });
  } else {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); rio.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (e) { rio.observe(e); });
  }

  /* ---------- 3D-Neigung der Säulenkarten ---------- */
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.transform = 'perspective(900px) rotateX(' + ((0.5 - py) * 6).toFixed(2) + 'deg) rotateY(' + ((px - 0.5) * 8).toFixed(2) + 'deg) translateY(-6px)';
        card.style.setProperty('--mx', (px * 100) + '%');
        card.style.setProperty('--my', (py * 100) + '%');
      });
      card.addEventListener('pointerleave', function () { card.style.transform = ''; });
    });
  }

  /* ---------- Schnellcheck ---------- */
  var checkForm = $('checkForm');
  var lastCheck = { r: 0, s: 0, h: 0, recs: [] };
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

  /* ---------- Tabs ---------- */
  document.querySelectorAll('[role="tablist"]').forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        tabs.forEach(function (o) {
          var on = o === t;
          o.setAttribute('aria-selected', on ? 'true' : 'false');
          var p = $(o.getAttribute('aria-controls'));
          if (p) p.hidden = !on;
        });
      });
    });
  });

  /* ---------- FAQ ---------- */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      var panel = btn.closest('.faq-item').querySelector('.faq-a');
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      panel.style.maxHeight = open ? '0px' : panel.scrollHeight + 'px';
    });
  });

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
      if (e.dataTransfer && e.dataTransfer.files.length) {
        try { files.files = e.dataTransfer.files; } catch (_) { /* ältere Browser */ }
        showFiles(e.dataTransfer.files);
      }
    });
    inquiry.addEventListener('submit', function (e) {
      e.preventDefault();
      function v(id) { var el = $(id); return el ? el.value.trim() : ''; }
      var anliegen = Array.prototype.slice.call(inquiry.querySelectorAll('input[name="anliegen"]:checked')).map(function (c) { return c.value; });
      var lines = [
        'Hallo Regenschild,',
        'ich möchte mein Haus kostenlos prüfen lassen.',
        '',
        'Name: ' + (v('f-name') || '–'),
        'Objekt: ' + v('f-typ') + (v('f-ort') ? ' in ' + v('f-ort') : ''),
        'Anliegen: ' + (anliegen.length ? anliegen.join(', ') : 'allgemeiner Unwetter-Check'),
        'Fotos: ' + (fileCount ? fileCount + ' Foto(s) hänge ich an.' : 'schicke ich nach.')
      ];
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
  if (subnav) {
    var links = Array.prototype.slice.call(subnav.querySelectorAll('a'));
    var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) links.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    secs.forEach(function (s) { spy.observe(s); });
  }
})();
