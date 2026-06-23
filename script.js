/* ==========================================================================
   HEIMAT SNACK — Main Script
   Cinematic German Imbiss landing page.
   Organized by scene/feature. IIFE to avoid globals.
   ========================================================================== */

(function () {
  'use strict';

  /* ========================================================================
     0. REDUCED MOTION & FEATURE DETECTION
     ======================================================================== */

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reducedMotion = prefersReducedMotion.matches;
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  const isMobile = window.innerWidth < 768;

  prefersReducedMotion.addEventListener('change', function (e) {
    reducedMotion = e.matches;
    if (reducedMotion) {
      // Kill Lenis
      if (lenis) {
        lenis.destroy();
        lenis = null;
      }
      // Kill smoke canvas
      cancelSmokeLoop = true;
      // Kill custom cursor
      const cursorEl = document.getElementById('custom-cursor');
      if (cursorEl) cursorEl.style.display = 'none';
      // Kill all ScrollTriggers
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.getAll().forEach(function (st) { st.kill(); });
      }
    }
  });

  /* ========================================================================
     UTILITY: Debounce
     ======================================================================== */

  function debounce(fn, wait) {
    var timer;
    return function () {
      var context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(context, args); }, wait);
    };
  }

  /* ========================================================================
     1. LENIS SMOOTH SCROLL
     ======================================================================== */

  var lenis = null;

  function initLenis() {
    if (reducedMotion) return;
    if (typeof Lenis === 'undefined') return;

    lenis = new Lenis({
      lerp: 0.075,
      smoothWheel: true
    });

    // Sync Lenis with GSAP ticker
    if (typeof gsap !== 'undefined') {
      gsap.ticker.add(function (time) {
        if (lenis) lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ========================================================================
     2. PAGE LOADER
     ======================================================================== */

  function initLoader() {
    var loader = document.getElementById('loader');
    if (!loader) return;

    if (reducedMotion) {
      // Just remove it immediately
      loader.remove();
      return;
    }

    var apronPath = loader.querySelector('.loader__apron-path');
    var ties = loader.querySelectorAll('.loader__tie');

    // After 2s delay, animate out
    var tl = gsap.timeline({ delay: 2 });

    // Apron draw is handled by CSS keyframes, so we just fade/scale out the loader
    tl.to(loader, {
      opacity: 0,
      scale: 0.95,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: function () {
        loader.remove();
      }
    });
  }

  /* ========================================================================
     3. CUSTOM CURSOR
     ======================================================================== */

  function initCursor() {
    if (reducedMotion || isTouchDevice) return;

    var cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    var dot = cursor.querySelector('.cursor__dot');
    var fork = cursor.querySelector('.cursor__fork');

    // GSAP quickTo for smooth following
    var xTo = gsap.quickTo(cursor, 'x', { duration: 0.3, ease: 'power3' });
    var yTo = gsap.quickTo(cursor, 'y', { duration: 0.3, ease: 'power3' });

    document.addEventListener('mousemove', function (e) {
      xTo(e.clientX);
      yTo(e.clientY);
    });

    // Food hover: morph to fork
    var foodHovers = document.querySelectorAll('.food-hover');
    foodHovers.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursor.classList.add('cursor--fork');
        if (dot) dot.style.display = 'none';
        if (fork) fork.style.display = 'block';
        gsap.to(cursor, { scale: 1.5, duration: 0.3 });
      });
      el.addEventListener('mouseleave', function () {
        cursor.classList.remove('cursor--fork');
        if (dot) dot.style.display = 'block';
        if (fork) fork.style.display = 'none';
        gsap.to(cursor, { scale: 1, duration: 0.3 });
      });
    });

    // Links/buttons: cursor grows slightly
    var interactives = document.querySelectorAll('a, button, [role="button"]');
    interactives.forEach(function (el) {
      // Skip food-hover elements (handled above)
      if (el.classList.contains('food-hover')) return;
      el.addEventListener('mouseenter', function () {
        cursor.classList.add('cursor--hover');
        gsap.to(cursor, { scale: 1.3, duration: 0.3 });
      });
      el.addEventListener('mouseleave', function () {
        cursor.classList.remove('cursor--hover');
        gsap.to(cursor, { scale: 1, duration: 0.3 });
      });
    });
  }

  /* ========================================================================
     4. SCENE 1: HERO ANIMATIONS
     ======================================================================== */

  var cancelSmokeLoop = false;

  function initHero() {
    if (reducedMotion) return;
    if (typeof gsap === 'undefined') return;

    var headline = document.querySelector('.scene--hero__headline');
    var subtitle = document.querySelector('.scene--hero__subtitle');
    var cta = document.querySelector('.scene--hero__cta');
    var heroImage = document.querySelector('.scene--hero__image');
    var scrollIndicator = document.querySelector('.scene--hero__scroll-indicator');

    // --- SplitText on headline ---
    if (headline && typeof SplitText !== 'undefined') {
      var split = new SplitText(headline, { type: 'chars' });
      gsap.from(split.chars, {
        y: 40,
        opacity: 0,
        stagger: 0.03,
        duration: 0.8,
        ease: 'power3.out',
        delay: 2.5, // after loader
        onComplete: function () {
          // Subtitle fade in after headline
          if (subtitle) {
            gsap.from(subtitle, { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out' });
          }
        }
      });
    } else if (headline) {
      // Manual char split fallback (SplitText is a premium GSAP plugin)
      var text = headline.textContent.trim();
      headline.textContent = '';
      var chars = [];
      for (var i = 0; i < text.length; i++) {
        var span = document.createElement('span');
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
        headline.appendChild(span);
        chars.push(span);
      }
      gsap.to(chars, {
        opacity: 1,
        y: 0,
        stagger: 0.03,
        duration: 0.8,
        ease: 'power3.out',
        delay: 2.5,
        onStart: function () {
          gsap.set(chars, { y: 40 });
        },
        onComplete: function () {
          if (subtitle) {
            gsap.from(subtitle, { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out' });
          }
        }
      });
    }

    // CTA slide up
    if (cta) {
      gsap.from(cta, { opacity: 0, y: 30, duration: 0.8, ease: 'power2.out', delay: 3.5 });
    }

    // Parallax on hero image
    if (heroImage && typeof ScrollTrigger !== 'undefined') {
      gsap.to(heroImage, {
        y: 100,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // Scroll indicator: continuous rotation (CSS handles it, but add GSAP bobbing)
    // Already handled by CSS keyframes, so nothing extra needed here.

    // --- Smoke Canvas ---
    initSmokeCanvas();
  }

  /* ========================================================================
     4b. SMOKE CANVAS PARTICLE SYSTEM
     ======================================================================== */

  function initSmokeCanvas() {
    if (reducedMotion) return;

    var canvas = document.getElementById('smoke-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Size canvas to parent
    function resizeCanvas() {
      var parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    }
    resizeCanvas();
    window.addEventListener('resize', debounce(resizeCanvas, 250));

    // Particle system
    var particles = [];
    var PARTICLE_COUNT = 40;
    var lastMouseMove = Date.now();
    var isIdle = false;

    // Track mouse for idle detection
    document.addEventListener('mousemove', function () {
      lastMouseMove = Date.now();
      isIdle = false;
    });

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 50,
        size: Math.random() * 4 + 2,
        speedY: -(Math.random() * 0.5 + 0.2),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.3 + 0.1,
        life: 0,
        maxLife: Math.random() * 200 + 150,
        color: Math.random() > 0.5 ? '180,180,180' : '200,200,200'
      };
    }

    // Initialize particles
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      var p = createParticle();
      p.y = Math.random() * canvas.height; // spread them out initially
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    function animateSmoke() {
      if (cancelSmokeLoop) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Idle detection: after 5s no mouse, increase effect
      var now = Date.now();
      if (now - lastMouseMove > 5000) {
        isIdle = true;
      }

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.life++;

        // Movement
        var idleMultiplier = isIdle ? 1.4 : 1;
        p.y += p.speedY * idleMultiplier;
        p.x += p.speedX + Math.sin(p.life * 0.02) * 0.2;

        // Fade based on life
        var lifeRatio = p.life / p.maxLife;
        var alpha = p.opacity * (1 - lifeRatio);
        if (isIdle) alpha *= 1.3;
        alpha = Math.min(alpha, 0.5);

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 + lifeRatio * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.color + ',' + alpha + ')';
        ctx.fill();

        // Reset if dead
        if (p.life >= p.maxLife || p.y < -20) {
          particles[i] = createParticle();
        }
      }

      requestAnimationFrame(animateSmoke);
    }

    requestAnimationFrame(animateSmoke);
  }

  /* ========================================================================
     5. SCENE 2: SPEISEKARTE (Chalkboard Menu)
     ======================================================================== */

  function initSpeisekarte() {
    if (reducedMotion) return;
    if (typeof gsap === 'undefined') return;

    var menuItems = document.querySelectorAll('.menu-item');
    if (!menuItems.length) return;

    // Typewriter effect for menu item names
    menuItems.forEach(function (item, index) {
      var nameEl = item.querySelector('.menu-item__name');
      if (!nameEl) return;

      var originalText = nameEl.textContent;
      nameEl.textContent = '';

      // Add a blinking cursor span
      var cursorSpan = document.createElement('span');
      cursorSpan.className = 'typewriter-cursor';
      cursorSpan.textContent = '';

      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
          trigger: item,
          start: 'top 85%',
          once: true,
          onEnter: function () {
            // Delay per line
            var delay = index * 0.3;

            gsap.delayedCall(delay, function () {
              nameEl.appendChild(cursorSpan);
              typeWrite(nameEl, originalText, cursorSpan, item);
            });
          }
        });
      } else {
        // Fallback: just show the text
        nameEl.textContent = originalText;
      }
    });

    // Polaroid hover (GSAP-enhanced, CSS already handles basic show/hide)
    menuItems.forEach(function (item) {
      var polaroid = item.querySelector('.menu-item__polaroid');
      if (!polaroid) return;

      item.addEventListener('mouseenter', function () {
        gsap.to(polaroid, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'back.out(1.4)',
          overwrite: true
        });
      });

      item.addEventListener('mouseleave', function () {
        gsap.to(polaroid, {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
          ease: 'power2.in',
          overwrite: true
        });
      });
    });
  }

  /** Typewriter helper: writes text letter by letter */
  function typeWrite(container, text, cursorSpan, parentItem) {
    var i = 0;
    var textNode = document.createTextNode('');
    container.insertBefore(textNode, cursorSpan);

    function next() {
      if (i < text.length) {
        textNode.textContent += text[i];

        // Chalk dust particle effect
        spawnChalkDust(parentItem);

        i++;
        gsap.delayedCall(0.04 + Math.random() * 0.03, next);
      } else {
        // Remove cursor after done
        gsap.delayedCall(1, function () {
          if (cursorSpan.parentNode) cursorSpan.remove();
        });
      }
    }
    next();
  }

  /** Spawn a small chalk dust particle near the menu item */
  function spawnChalkDust(parentItem) {
    if (!parentItem) return;
    var dust = document.createElement('span');
    dust.style.cssText =
      'position:absolute;width:3px;height:3px;border-radius:50%;' +
      'background:rgba(245,240,232,0.5);pointer-events:none;z-index:20;';

    var nameEl = parentItem.querySelector('.menu-item__name');
    if (!nameEl) return;

    var rect = nameEl.getBoundingClientRect();
    var parentRect = parentItem.getBoundingClientRect();

    dust.style.left = (rect.right - parentRect.left + Math.random() * 6 - 3) + 'px';
    dust.style.top = (rect.top - parentRect.top + Math.random() * 12) + 'px';

    parentItem.appendChild(dust);

    gsap.to(dust, {
      y: -(Math.random() * 15 + 5),
      x: Math.random() * 10 - 5,
      opacity: 0,
      duration: 0.6,
      ease: 'power1.out',
      onComplete: function () {
        dust.remove();
      }
    });
  }

  /* ========================================================================
     6. SCENE 3: HORIZONTAL GALLERY
     ======================================================================== */

  function initGallery() {
    if (reducedMotion) return;
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    var pinWrap = document.querySelector('.scene--galerie__pin-wrap');
    var track = document.getElementById('gallery-track');
    if (!pinWrap || !track) return;

    // On mobile, skip pinning entirely
    if (isMobile) return;

    // Wait a tick for layout to settle
    gsap.delayedCall(0.1, function () {
      var trackWidth = track.scrollWidth;
      var viewportWidth = window.innerWidth;
      var scrollDistance = trackWidth - viewportWidth;

      if (scrollDistance <= 0) return;

      // Pin and scroll horizontally
      gsap.to(track, {
        x: function () { return -scrollDistance; },
        ease: 'none',
        scrollTrigger: {
          trigger: '.scene--galerie',
          start: 'top top',
          end: function () { return '+=' + scrollDistance; },
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            // Sync sprocket holes
            var sprockets = document.querySelectorAll('.sprocket-holes');
            sprockets.forEach(function (s) {
              s.style.transform = 'translateX(' + (-self.progress * 80) + 'px)';
            });
          }
        }
      });

      // Different parallax speeds for panels
      var panels = track.querySelectorAll('.gallery-panel');
      panels.forEach(function (panel, i) {
        var speed = (i % 3 === 0) ? 0.8 : (i % 3 === 1) ? 1.2 : 1;
        var img = panel.querySelector('img');
        if (img) {
          gsap.to(img, {
            x: (speed - 1) * 100,
            ease: 'none',
            scrollTrigger: {
              trigger: '.scene--galerie',
              start: 'top top',
              end: function () { return '+=' + scrollDistance; },
              scrub: true
            }
          });
        }
      });
    });

    // Handwritten notes: infinite subtle wobble
    var notes = document.querySelectorAll('.gallery-note span');
    notes.forEach(function (note) {
      gsap.to(note, {
        rotation: 2,
        duration: 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      });
    });
  }

  /* ========================================================================
     7. SCENE 4: ABOUT US
     ======================================================================== */

  function initAbout() {
    if (reducedMotion) return;
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    var portrait = document.querySelector('.scene--ueber__portrait');
    var paragraphs = document.querySelectorAll('.scene--ueber__letter p');
    var signaturePath = document.querySelector('.signature-path');
    var polaroid = document.querySelector('.scene--ueber__polaroid');

    // Image: fade in + slight scale
    if (portrait) {
      gsap.from(portrait, {
        scale: 1.05,
        opacity: 0,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: portrait,
          start: 'top 80%',
          once: true
        }
      });
    }

    // Letter text: fade in paragraph by paragraph
    if (paragraphs.length) {
      paragraphs.forEach(function (p, i) {
        gsap.from(p, {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: p,
            start: 'top 85%',
            once: true
          },
          delay: i * 0.15
        });
      });
    }

    // SVG Signature: self-drawing effect
    if (signaturePath) {
      var pathLength = signaturePath.getTotalLength ? signaturePath.getTotalLength() : 500;
      gsap.set(signaturePath, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength
      });

      ScrollTrigger.create({
        trigger: signaturePath,
        start: 'top 85%',
        once: true,
        onEnter: function () {
          gsap.to(signaturePath, {
            strokeDashoffset: 0,
            duration: 2,
            ease: 'power2.inOut'
          });
        }
      });
    }

    // Polaroid: slide in from bottom-right with rotation
    if (polaroid) {
      gsap.from(polaroid, {
        y: 80,
        x: 40,
        rotation: 8,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: polaroid,
          start: 'top 90%',
          once: true
        }
      });
    }
  }

  /* ========================================================================
     8. SCENE 5: HOURS & LOCATION
     ======================================================================== */

  function initHours() {
    // Detect current day and add .is-today
    var today = new Date().getDay(); // 0=Sunday, 1=Monday...
    var rows = document.querySelectorAll('.hours-row');

    rows.forEach(function (row) {
      var dayAttr = parseInt(row.getAttribute('data-day'), 10);
      if (dayAttr === today) {
        row.classList.add('is-today');
      }
    });

    if (reducedMotion) return;
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Stamp animation: each row stamps in on scroll
    rows.forEach(function (row, i) {
      gsap.from(row, {
        scale: 1.4,
        rotation: function () { return (Math.random() - 0.5) * 8; },
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: row,
          start: 'top 85%',
          once: true
        },
        delay: i * 0.1,
        onComplete: function () {
          // Remove will-change after animation
          row.style.willChange = 'auto';
        }
      });
    });

    // Phone number: fade in with slight scale
    var phone = document.querySelector('.scene--zeiten__phone');
    if (phone) {
      gsap.from(phone, {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: phone,
          start: 'top 85%',
          once: true
        }
      });
    }
  }

  /* ========================================================================
     9. SCENE 6: FOOTER
     ======================================================================== */

  function initFooter() {
    if (reducedMotion) return;
    if (typeof gsap === 'undefined') return;

    var goodbye = document.querySelector('.scene--footer__goodbye');
    var wurstSvg = document.querySelector('.footer-wurst-svg');

    // "Bis gleich." text: char reveal
    if (goodbye) {
      if (typeof SplitText !== 'undefined') {
        var split = new SplitText(goodbye, { type: 'chars' });
        gsap.from(split.chars, {
          opacity: 0,
          y: 30,
          stagger: 0.04,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: goodbye,
            start: 'top 85%',
            once: true
          }
        });
      } else {
        // Manual char split fallback
        var text = goodbye.textContent.trim();
        goodbye.textContent = '';
        var chars = [];
        for (var i = 0; i < text.length; i++) {
          var span = document.createElement('span');
          span.style.display = 'inline-block';
          span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
          goodbye.appendChild(span);
          chars.push(span);
        }

        if (typeof ScrollTrigger !== 'undefined') {
          gsap.from(chars, {
            opacity: 0,
            y: 30,
            stagger: 0.04,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: goodbye,
              start: 'top 85%',
              once: true
            }
          });
        }
      }
    }

    // Bratwurst SVG: 360 rotation on hover
    if (wurstSvg) {
      var wurstWrap = document.querySelector('.scene--footer__wurst');
      if (wurstWrap) {
        wurstWrap.addEventListener('mouseenter', function () {
          gsap.to(wurstSvg, { rotation: '+=360', duration: 0.8, ease: 'power2.inOut' });
        });
      }
    }
  }

  /* ========================================================================
     10. NAVIGATION
     ======================================================================== */

  function initNav() {
    var header = document.querySelector('.site-header');
    var navLinks = document.querySelectorAll('.site-header__nav a');
    var heroSection = document.getElementById('hero');

    // Smooth scroll to sections on nav link click (use Lenis if available)
    navLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          var target = document.querySelector(href);
          if (target) {
            if (lenis) {
              lenis.scrollTo(target, { offset: 0 });
            } else {
              target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
            }
          }
        }
      });
    });

    // Logo click: scroll to top
    var logo = document.querySelector('.site-header__logo');
    if (logo) {
      logo.addEventListener('click', function (e) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(0);
        } else {
          window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
        }
      });
    }

    // CTA link
    var ctaLink = document.querySelector('.scene--hero__cta');
    if (ctaLink) {
      ctaLink.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          var target = document.querySelector(href);
          if (target) {
            if (lenis) {
              lenis.scrollTo(target, { offset: 0 });
            } else {
              target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
            }
          }
        }
      });
    }

    // Header background: add .is-scrolled after scrolling past hero
    if (header && typeof ScrollTrigger !== 'undefined' && !reducedMotion) {
      ScrollTrigger.create({
        trigger: heroSection || 'body',
        start: 'bottom top',
        onEnter: function () { header.classList.add('is-scrolled'); },
        onLeaveBack: function () { header.classList.remove('is-scrolled'); }
      });
    } else if (header) {
      // Fallback: use scroll listener
      window.addEventListener('scroll', debounce(function () {
        var scrollY = window.scrollY || window.pageYOffset;
        var threshold = heroSection ? heroSection.offsetHeight : window.innerHeight;
        if (scrollY > threshold) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }
      }, 50), { passive: true });
    }

    // Active section highlighting in nav based on scroll position
    if (typeof ScrollTrigger !== 'undefined' && !reducedMotion) {
      var sections = document.querySelectorAll('section[id]');
      sections.forEach(function (section) {
        ScrollTrigger.create({
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          onEnter: function () { setActiveNav(section.id); },
          onEnterBack: function () { setActiveNav(section.id); }
        });
      });
    }

    function setActiveNav(id) {
      navLinks.forEach(function (link) {
        var href = link.getAttribute('href');
        if (href === '#' + id) {
          link.classList.add('is-active');
        } else {
          link.classList.remove('is-active');
        }
      });
    }
  }

  /* ========================================================================
     11. SOUND TOGGLE
     ======================================================================== */

  function initSoundToggle() {
    var btn = document.getElementById('sound-toggle');
    if (!btn) return;

    var iconOff = btn.querySelector('.sound-toggle__icon--off');
    var iconOn = btn.querySelector('.sound-toggle__icon--on');
    var label = btn.querySelector('.sound-toggle__label');
    var isOn = localStorage.getItem('eg-sound') === 'on';

    // Audio context for subtle crackling
    var audioCtx = null;
    var noiseNode = null;
    var gainNode = null;

    function createCrackle() {
      if (!window.AudioContext && !window.webkitAudioContext) return;
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        gainNode = audioCtx.createGain();
        gainNode.gain.value = 0.03; // Very quiet

        // Create brown noise for grill ambience
        var bufferSize = 2 * audioCtx.sampleRate;
        var noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        var output = noiseBuffer.getChannelData(0);
        var lastOut = 0;
        for (var i = 0; i < bufferSize; i++) {
          var white = Math.random() * 2 - 1;
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5; // Increase amplitude for brown noise
        }

        noiseNode = audioCtx.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;

        // Filter for crackling character
        var filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;

        noiseNode.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        noiseNode.start();
      } catch (e) {
        // Audio not supported, fail silently
      }
    }

    function destroyCrackle() {
      try {
        if (noiseNode) { noiseNode.stop(); noiseNode = null; }
        if (audioCtx) { audioCtx.close(); audioCtx = null; }
      } catch (e) { /* ignore */ }
    }

    function updateUI() {
      if (isOn) {
        btn.setAttribute('aria-pressed', 'true');
        if (iconOff) iconOff.style.display = 'none';
        if (iconOn) iconOn.style.display = 'block';
        if (label) label.textContent = 'Geräusche an';
      } else {
        btn.setAttribute('aria-pressed', 'false');
        if (iconOff) iconOff.style.display = 'block';
        if (iconOn) iconOn.style.display = 'none';
        if (label) label.textContent = 'Geräusche aus';
      }
    }

    // Initialize state
    updateUI();
    if (isOn) createCrackle();

    btn.addEventListener('click', function () {
      isOn = !isOn;
      localStorage.setItem('eg-sound', isOn ? 'on' : 'off');
      updateUI();

      if (isOn) {
        createCrackle();
      } else {
        destroyCrackle();
      }
    });
  }

  /* ========================================================================
     13. INTERSECTION OBSERVER FALLBACK
     ======================================================================== */

  function initIntersectionObserverFallback() {
    // For browsers without ScrollTrigger, use IntersectionObserver for .is-visible
    if (typeof ScrollTrigger !== 'undefined' && !reducedMotion) return;

    if (!('IntersectionObserver' in window)) return;

    var elements = document.querySelectorAll(
      '.fade-in, .slide-up, .slide-left, .slide-right, ' +
      '.scene--ueber__portrait, .scene--ueber__polaroid, ' +
      '.scene--zeiten__phone, .hours-row, .scene--footer__goodbye'
    );

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ========================================================================
     14. PERFORMANCE: RESIZE HANDLER
     ======================================================================== */

  function initResizeHandler() {
    window.addEventListener('resize', debounce(function () {
      // Refresh ScrollTrigger on resize
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, 300));
  }

  /* ========================================================================
     INIT — DOMContentLoaded
     ======================================================================== */

  function init() {
    // Register GSAP plugins
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    initLenis();
    initLoader();
    initCursor();
    initHero();
    initSpeisekarte();
    initGallery();
    initAbout();
    initHours();
    initFooter();
    initNav();
    initSoundToggle();
    initIntersectionObserverFallback();
    initResizeHandler();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
