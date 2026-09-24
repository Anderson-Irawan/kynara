/* ==========================================================================
   KYNARA site behaviour
   1. Language switch (EN / ID)
   2. Rolling hero word
   3. Mobile menu + search panel
   4. Collection carousel arrow (Home)
   5. Contact + subscribe forms
   6. Hero parallax (Home)
   7. Interactive hero glow (Home)
   8. Shrinking header
   9. Smooth scrolling (Lenis)
  10. Hero video (Home)
   Still no reveal / fade-in-on-scroll effects: see style rule 1 in CLAUDE.md
   for the motion that is allowed.
   ========================================================================== */
(function () {
  'use strict';

  var CONFIG = window.KYNARA_CONFIG || {};
  var DICT = window.KYNARA_I18N || { en: {}, id: {} };
  var LANGS = ['en', 'id'];
  var STORAGE_KEY = 'kynara-lang';

  /* ---------- 1. Language ---------- */
  function readStoredLang() {
    try { return window.localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function storeLang(lang) {
    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* storage blocked: ignore */ }
  }
  function initialLang() {
    var fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (LANGS.indexOf(fromUrl) > -1) return fromUrl;
    var stored = readStoredLang();
    if (LANGS.indexOf(stored) > -1) return stored;
    return 'en';
  }

  var currentLang = initialLang();
  // Whichever source won, remember it, so the choice is the same on every page.
  // Without this, arriving via a ?lang= link applied that language to one page only
  // and the next page reverted to whatever was in storage.
  storeLang(currentLang);

  function t(key) {
    var table = DICT[currentLang] || {};
    if (Object.prototype.hasOwnProperty.call(table, key)) return table[key];
    return (DICT.en || {})[key];
  }

  function setMeta(attr, name, value) {
    var el = document.head.querySelector('meta[' + attr + '="' + name + '"]');
    if (el) el.setAttribute('content', value);
  }

  function applyLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'));
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-html'));
      if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-placeholder'));
      if (v != null) el.setAttribute('placeholder', v);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-aria'));
      if (v != null) el.setAttribute('aria-label', v);
    });
    // Title, description and the social tags follow the chosen language
    var titleKey = document.body.getAttribute('data-title-key');
    if (titleKey && t(titleKey)) {
      document.title = t(titleKey);
      setMeta('property', 'og:title', t(titleKey));
    }
    var descKey = document.body.getAttribute('data-desc-key');
    if (descKey && t(descKey)) {
      setMeta('name', 'description', t(descKey));
      setMeta('property', 'og:description', t(descKey));
    }
    setMeta('property', 'og:locale', lang === 'id' ? 'id_ID' : 'en_GB');
    setMeta('property', 'og:locale:alternate', lang === 'id' ? 'en_GB' : 'id_ID');

    document.querySelectorAll('[data-set-lang]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-set-lang') === lang ? 'true' : 'false');
    });
    var langLabel = document.querySelector('.lang-switch__current');
    if (langLabel) langLabel.textContent = lang.toUpperCase();

    // Keep ?lang= on internal links so the choice survives even when storage is blocked.
    // Match on the PATH, not the whole href: the old selector was a[href$=".html"],
    // which stopped matching as soon as "?lang=id" had been appended. Switching back
    // to EN then left the stale param on every link, so the next click reverted to ID.
    document.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (/^(https?:|mailto:|tel:|#)/.test(href)) return;
      var hash = '';
      var h = href.indexOf('#');
      if (h > -1) { hash = href.slice(h); href = href.slice(0, h); }
      var path = href.split('?')[0];
      if (!/\.html$/.test(path)) return;
      a.setAttribute('href', path + (lang === 'en' ? '' : '?lang=' + lang) + hash);
    });

    buildRollers();
    renderSearch();
  }

  /* Globe dropdown: the language is an explicit choice, not a blind toggle */
  var langWrap = document.querySelector('.lang-switch');
  var langToggle = document.querySelector('.lang-switch__toggle');
  var langMenu = document.querySelector('.lang-switch__menu');

  function closeLangMenu() {
    if (!langMenu) return;
    langMenu.classList.remove('is-open');
    langToggle.setAttribute('aria-expanded', 'false');
  }
  if (langToggle && langMenu) {
    langToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = langMenu.classList.toggle('is-open');
      langToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (langWrap && !langWrap.contains(e.target)) closeLangMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && langMenu.classList.contains('is-open')) {
        closeLangMenu();
        langToggle.focus();
      }
    });
  }

  document.querySelectorAll('[data-set-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var lang = btn.getAttribute('data-set-lang');
      storeLang(lang);
      var url = new URL(window.location.href);
      if (lang === 'en') url.searchParams.delete('lang'); else url.searchParams.set('lang', lang);
      window.history.replaceState(null, '', url);
      applyLang(lang);
      closeLangMenu();
    });
  });

  /* ---------- 2. Rolling hero word ---------- */
  var rollerTimers = [];

  function buildRollers() {
    rollerTimers.forEach(clearInterval);
    rollerTimers = [];
    var cfg = CONFIG.heroRoller;
    if (!cfg) return;
    var roll = cfg;   // the headline is a brand line, so there is no per-language variant

    document.querySelectorAll('[data-roller]').forEach(function (title) {
      var words = (roll.words || []).slice();
      if (!words.length) return;
      title.setAttribute('aria-label', t('hero.static'));
      title.style.setProperty('--roll-ms', (cfg.duration || 490) + 'ms');

      // Build: prefix + roller + suffix. All visual; the aria-label carries the readable sentence.
      title.innerHTML = '';
      var visual = document.createElement('span');
      visual.setAttribute('aria-hidden', 'true');
      if (roll.prefix) visual.insertAdjacentHTML('beforeend', roll.prefix + ' ');
      var roller = document.createElement('span');
      roller.className = 'roller';
      words.forEach(function (w) {
        var s = document.createElement('span');
        s.className = 'roller__word';
        s.textContent = w;
        roller.appendChild(s);
      });
      visual.appendChild(roller);
      if (roll.suffix) visual.insertAdjacentHTML('beforeend', ' ' + roll.suffix);
      title.appendChild(visual);

      var items = Array.prototype.slice.call(roller.children);
      var n = items.length;
      var index = 0;

      function place(animate) {
        items.forEach(function (el, i) {
          var o = ((i - index) % n + n) % n;       // 0..n-1
          if (o > n / 2) o -= n;                   // centre around 0 (negative = above)
          var prev = el.getAttribute('data-pos');
          // Items that wrap from the top to the bottom jump without moving across the headline
          var wraps = prev !== null && Math.abs(Number(prev) - o) > 1;
          el.classList.toggle('no-transition', !animate || wraps);
          el.style.setProperty('--o', o);
          el.setAttribute('data-pos', String(o));
        });
        roller.style.width = items[index].offsetWidth + 'px';
        if (!animate) {
          void roller.offsetWidth; // flush so the next change animates
        }
      }

      roller.classList.add('no-transition');
      place(false);
      requestAnimationFrame(function () { roller.classList.remove('no-transition'); });
      if (n < 2) return;

      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      rollerTimers.push(setInterval(function () {
        index = (index + 1) % n;
        place(!reduce);
      }, cfg.interval || 2600));
    });
  }
  // Re-measure word widths once the web fonts have loaded
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { buildRollers(); });
  }

  /* ---------- 3. Mobile menu + search ---------- */
  var menuBtn = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.main-nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var SEARCH_INDEX = [
    { href: 'products.html#floor', title: 'FLOOR', key: 'product.floor.use' },
    { href: 'products.html#bark', title: 'BARK', key: 'product.bark.use' },
    { href: 'products.html#heartwood', title: 'HEARTWOOD', key: 'product.heartwood.use' },
    { href: 'products.html#edge', title: 'EDGE', key: 'product.edge.use' },
    { href: 'products.html', key: 'nav.products' },
    { href: 'brand.html', key: 'nav.brand' },
    { href: 'brand.html#craftsmanship', key: 'footer.craft' },
    { href: 'brand.html#sustainability', key: 'footer.sustain' },
    { href: 'brand.html#applications', key: 'footer.apps' },
    { href: 'contact.html', key: 'nav.contact' }
  ];
  var searchBtn = document.querySelector('.search-toggle');
  var searchPanel = document.querySelector('.search-panel');
  var searchInput = searchPanel && searchPanel.querySelector('input');
  var searchResults = searchPanel && searchPanel.querySelector('.search-results');

  function renderSearch() {
    if (!searchResults) return;
    var q = (searchInput.value || '').trim().toLowerCase();
    searchResults.innerHTML = '';
    if (!q) return;
    var langSuffix = currentLang === 'en' ? '' : '?lang=' + currentLang;
    var hits = SEARCH_INDEX.filter(function (item) {
      var hay = ((item.title || '') + ' ' + (t(item.key) || '')).toLowerCase();
      return hay.indexOf(q) > -1;
    });
    if (!hits.length) {
      var p = document.createElement('p');
      p.textContent = t('search.none');
      searchResults.appendChild(p);
      return;
    }
    hits.forEach(function (item) {
      var a = document.createElement('a');
      var parts = item.href.split('#');
      a.href = parts[0] + langSuffix + (parts[1] ? '#' + parts[1] : '');
      a.textContent = item.title || t(item.key);
      if (item.title) {
        var s = document.createElement('span');
        s.textContent = t(item.key);
        a.appendChild(s);
      }
      searchResults.appendChild(a);
    });
  }
  var siteHeader = document.querySelector('.site-header');

  var searchClosingTimer = null;

  function setSearch(open) {
    searchPanel.classList.toggle('is-open', open);
    searchBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (!siteHeader) return;
    // The overlay header (Home, The Brand) takes the cream treatment while the
    // panel is open, so the bar and the panel read as one surface.
    siteHeader.classList.toggle('is-search-open', open);
    // While closing, the bar's colour must wait for the panel to leave. The CSS only
    // applies that delay under .is-search-closing, so scrolling back to the top
    // (which also removes the cream) is not held up by it. 800ms comfortably covers
    // --ui-close-wait + --ui-color-ms.
    clearTimeout(searchClosingTimer);
    siteHeader.classList.toggle('is-search-closing', !open);
    if (!open) {
      searchClosingTimer = setTimeout(function () {
        siteHeader.classList.remove('is-search-closing');
      }, 800);
    }
  }

  if (searchBtn && searchPanel) {
    searchBtn.addEventListener('click', function () {
      var open = !searchPanel.classList.contains('is-open');
      setSearch(open);
      if (open) searchInput.focus();
    });
    searchInput.addEventListener('input', renderSearch);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && searchPanel.classList.contains('is-open')) {
        setSearch(false);
        searchBtn.focus();
      }
    });
  }

  /* ---------- 4. Collection carousel ---------- */
  document.querySelectorAll('[data-carousel]').forEach(function (wrap) {
    var track = wrap.querySelector('.collection__track');
    var next = wrap.querySelector('[data-carousel-next]');
    if (!track || !next) return;
    next.addEventListener('click', function () {
      var item = track.querySelector('.collection__item');
      var step = item ? item.getBoundingClientRect().width + 34 : 400;
      var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + step, behavior: 'smooth' });
    });
  });

  /* ---------- 5. Forms ---------- */
  var contactForm = document.querySelector('.enquiry-form');
  if (contactForm) {
    var status = contactForm.querySelector('.form-status');
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      status.classList.remove('is-error');
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        status.textContent = t('contact.error');
        status.classList.add('is-error');
        return;
      }
      var cfg = CONFIG.contact || {};
      var data = new FormData(contactForm);
      if (cfg.endpoint) {
        status.textContent = t('contact.sending');
        fetch(cfg.endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
          .then(function (r) {
            if (!r.ok) throw new Error(r.status);
            contactForm.reset();
            status.textContent = t('contact.sent');
          })
          .catch(function () {
            status.textContent = t('contact.fail');
            status.classList.add('is-error');
          });
        return;
      }
      // No endpoint yet: open the visitor's email app with the enquiry filled in
      var subject = 'Website enquiry' + (data.get('company') ? ' | ' + data.get('company') : '');
      var body = 'Name: ' + data.get('name') + '\n' +
        'Company: ' + (data.get('company') || '-') + '\n' +
        'Email: ' + data.get('email') + '\n\n' + data.get('message');
      window.location.href = 'mailto:' + (cfg.email || 'enquiries@kynara.co.id') +
        '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      status.textContent = t('contact.mailto');
    });
  }

  document.querySelectorAll('.subscribe').forEach(function (form) {
    var input = form.querySelector('input[type="email"]');
    var status = form.querySelector('.subscribe__status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!input.checkValidity() || !input.value) {
        status.textContent = t('footer.invalid');
        return;
      }
      var endpoint = (CONFIG.subscribe || {}).endpoint;
      if (endpoint) {
        var data = new FormData(form);
        fetch(endpoint, { method: 'POST', body: data, mode: 'no-cors' }).catch(function () {});
      }
      form.reset();
      status.textContent = t('footer.subscribed');
    });
  });

  /* ---------- 6. Hero parallax + green wash (Home) ---------- */
  // The photo drifts down at 30% of scroll speed. The CSS makes .hero__media 130%
  // tall and shifts it up by the overflow, so 0.3 * heroHeight of travel exactly
  // uses the slack and no edge is ever exposed.
  // In the same frame, the solid-green .hero__wash deepens with scroll progress, so
  // the photo dissolves into the green section below instead of cutting to it. The
  // curve is eased (p^1.4) so the photo holds at first and gives way as it leaves;
  // it tops out at 0.92 so a trace of the photo survives until it is off-screen.
  var parallaxHero = document.querySelector('[data-parallax]');
  var parallaxMedia = parallaxHero && parallaxHero.querySelector('.hero__media');
  var heroWash = parallaxHero && parallaxHero.querySelector('.hero__wash');
  if (parallaxMedia && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var queued = false;
    var placeParallax = function () {
      var h = parallaxHero.offsetHeight;
      var y = Math.min(window.pageYOffset, h);
      parallaxMedia.style.transform = 'translate3d(0,' + (y * 0.3).toFixed(1) + 'px,0)';
      if (heroWash) heroWash.style.opacity = (Math.pow(y / h, 1.4) * 0.92).toFixed(3);
      queued = false;
    };
    window.addEventListener('scroll', function () {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(placeParallax);
    }, { passive: true });
    window.addEventListener('resize', placeParallax);
    placeParallax();
  }

  /* ---------- 7. Interactive hero glow (Home) ---------- */
  // A soft rust light trails the pointer across the hero. It eases toward the cursor
  // rather than snapping to it, so it reads as light moving, not a cursor follower.
  // The rAF loop only runs while the glow is catching up and stops once it arrives,
  // so nothing ticks while the pointer is still. Touch and reduced motion are left
  // with the static off-centre glow from the CSS.
  var glowHero = document.querySelector('[data-hero-glow]');
  var glow = glowHero && glowHero.querySelector('.hero__glow');
  if (glow && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var gx = null, gy = null, gtx = 0, gty = 0, glowRunning = false;
    var stepGlow = function () {
      gx += (gtx - gx) * 0.08;
      gy += (gty - gy) * 0.08;
      glow.style.transform = 'translate3d(' + gx.toFixed(1) + 'px,' + gy.toFixed(1) + 'px,0)';
      if (Math.abs(gtx - gx) > 0.5 || Math.abs(gty - gy) > 0.5) {
        window.requestAnimationFrame(stepGlow);
      } else {
        glowRunning = false;
      }
    };
    document.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      var r = glowHero.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;   // only while over the hero
      gtx = e.clientX - r.left;
      gty = e.clientY - r.top;
      if (gx === null) {          // first move: start from where the CSS put it
        gx = window.innerWidth * 0.7;
        gy = window.innerHeight * 0.45;
      }
      if (!glowRunning) {
        glowRunning = true;
        window.requestAnimationFrame(stepGlow);
      }
    }, { passive: true });
  }

  /* ---------- 8. Shrinking header ---------- */
  // Past a small threshold the header gets .is-scrolled: it shortens, takes the
  // cream surface on the hero pages, and the logo retracts to the logomark.
  // The header is position:fixed with its full height reserved in the CSS, so the
  // class change never moves the page and cannot bounce the threshold.
  // Once the footer is well on screen the header slides away (.is-hidden) and comes
  // back as you scroll up out of the footer. Guards:
  // - only after scrolling: on a short page (Contact) the footer can be visible at
  //   the very top, and the header must not vanish there;
  // - never while the search panel is open;
  // - the CSS brings it back on :focus-within, so keyboard users never lose it.
  var siteFooter = document.querySelector('.site-footer');
  if (siteHeader) {
    var headerQueued = false;
    var placeHeader = function () {
      var scrolled = window.pageYOffset > 40;
      siteHeader.classList.toggle('is-scrolled', scrolled);
      var atFooter = !!siteFooter && siteFooter.getBoundingClientRect().top < window.innerHeight * 0.7;
      siteHeader.classList.toggle('is-hidden',
        scrolled && atFooter && !siteHeader.classList.contains('is-search-open'));
      headerQueued = false;
    };
    window.addEventListener('scroll', function () {
      if (headerQueued) return;
      headerQueued = true;
      window.requestAnimationFrame(placeHeader);
    }, { passive: true });
    window.addEventListener('resize', placeHeader);
    // A page opened mid-scroll (a #anchor link, a reload) starts shrunk, without
    // playing the shrink animation on load.
    siteHeader.classList.add('is-instant');
    placeHeader();
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () { siteHeader.classList.remove('is-instant'); });
    });
  }

  /* ---------- 9. Smooth scrolling (Lenis, js/vendor/lenis.min.js) ---------- */
  // Wheel and trackpad scrolling eases instead of stepping. Lenis animates the real
  // window scroll, so the parallax, the glow and the shrinking header - which all
  // listen to native scroll events - keep working unchanged.
  // - Touch keeps native scrolling (syncTouch is off by default), and Lenis turns
  //   itself off under prefers-reduced-motion (respectReducedMotion, on by default).
  // - anchors: same-page #links glide too. Lenis reads the CSS scroll-padding-top and
  //   the target's scroll-margin, so targets still land below the fixed header.
  // - allowNestedScroll: the Home carousel track still scrolls sideways natively.
  // If the script fails to load, the site simply scrolls natively.
  if (window.Lenis) {
    window.kynaraLenis = new window.Lenis({
      autoRaf: true,
      lerp: 0.1,
      anchors: true,
      allowNestedScroll: true
    });
  }

  /* ---------- 10. Hero video (Home) ---------- */
  // The <video> has no autoplay attribute and preload="none": it only downloads and
  // plays once this confirms motion is welcome. Reduced-motion and data-saver visitors
  // keep the still poster (the loop's first frame) and never fetch the file.
  // It also pauses whenever the hero is off screen, so it isn't decoding a video
  // nobody can see while they read the rest of the page.
  var heroVideo = document.querySelector('[data-hero-video]');
  if (heroVideo) {
    var saveData = !!(navigator.connection && navigator.connection.saveData);
    var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!calm && !saveData) {
      var playHero = function () {
        var p = heroVideo.play();
        if (p && p.catch) p.catch(function () { /* autoplay refused: the poster stays */ });
      };
      var heroBox = heroVideo.closest('.hero') || heroVideo;
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { if (e.isIntersecting) playHero(); else heroVideo.pause(); });
        }).observe(heroBox);
      } else {
        playHero();
      }
    }
  }

  /* ---------- Go ---------- */
  applyLang(currentLang);
})();
