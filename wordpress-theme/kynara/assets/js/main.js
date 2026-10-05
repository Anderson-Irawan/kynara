/* ==========================================================================
   KYNARA site behaviour
   1. Language switch (EN / ID)
   2. Rolling hero word
   3. Mobile menu + search overlay
   4. Collection carousel arrow (Home)
   5. Contact + subscribe forms
   6. Hero parallax (Home)
   7. Interactive hero glow (Home)
   8. Shrinking header
   9. Smooth scrolling (Lenis)
  10. Hero video (Home)
  11. Counting stats (The Brand)
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

  // The page's own English, read from the HTML the first time each element is translated
  // (before anything overwrites it). English is shown from HERE, so the HTML is the one place
  // to edit English text; the 'en' dictionary only covers text JS creates (form messages,
  // search) and elements whose HTML is empty. Indonesian comes from the 'id' dictionary,
  // falling back to the page's English for any key it lacks.
  var ORIGINAL = typeof WeakMap === 'function' ? new WeakMap() : null;
  var ORIGINAL_TITLE = document.title;
  var descMeta = document.head.querySelector('meta[name="description"]');
  var ORIGINAL_DESC = descMeta ? descMeta.getAttribute('content') : null;

  function localized(el, key, kind, read) {
    var own = null;
    if (ORIGINAL) {
      var o = ORIGINAL.get(el);
      if (!o) { o = {}; ORIGINAL.set(el, o); }
      if (!(kind in o)) o[kind] = read();
      own = o[kind];
    }
    var hasOwn = own != null && own !== '';
    if (currentLang === 'en' && hasOwn) return own;
    var table = DICT[currentLang] || {};
    if (Object.prototype.hasOwnProperty.call(table, key)) return table[key];
    return hasOwn ? own : t(key);
  }

  // Clean addresses on the live site: .htaccess serves kynara.id/products from products.html,
  // so links there drop ".html" (and index.html becomes "./"). The HTML keeps the .html links,
  // because Live Server and pages opened from disk need them - so locally nothing changes.
  var CLEAN_URLS = /^https?:$/.test(location.protocol) &&
    !/^(localhost|127\.\d+\.\d+\.\d+|\[::1\]|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+)$/.test(location.hostname);
  function cleanPath(path) {
    if (!CLEAN_URLS) return path;
    if (/(^|\/)index\.html$/.test(path)) return path.replace(/index\.html$/, '') || './';
    return path.replace(/\.html$/, '');
  }

  function setMeta(attr, name, value) {
    var el = document.head.querySelector('meta[' + attr + '="' + name + '"]');
    if (el) el.setAttribute('content', value);
  }

  function applyLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = localized(el, el.getAttribute('data-i18n'), 'text', function () { return el.textContent.replace(/\s+/g, ' ').trim(); });
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = localized(el, el.getAttribute('data-i18n-html'), 'html', function () { return el.innerHTML.trim(); });
      if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var v = localized(el, el.getAttribute('data-i18n-placeholder'), 'placeholder', function () { return el.getAttribute('placeholder'); });
      if (v != null) el.setAttribute('placeholder', v);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var v = localized(el, el.getAttribute('data-i18n-aria'), 'aria', function () { return el.getAttribute('aria-label'); });
      if (v != null) el.setAttribute('aria-label', v);
    });
    // Title, description and the social tags follow the chosen language (English: the page's own)
    var titleKey = document.body.getAttribute('data-title-key');
    var title = lang === 'en' ? ORIGINAL_TITLE : (titleKey && t(titleKey));
    if (title) {
      document.title = title;
      setMeta('property', 'og:title', title);
    }
    var descKey = document.body.getAttribute('data-desc-key');
    var desc = lang === 'en' ? ORIGINAL_DESC : (descKey && t(descKey));
    if (desc) {
      setMeta('name', 'description', desc);
      setMeta('property', 'og:description', desc);
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
      a.setAttribute('href', cleanPath(path) + (lang === 'en' ? '' : '?lang=' + lang) + hash);
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

  // Built by WordPress from the live products and pages (functions.php ->
  // kynara_search_index()), so a product added in the admin is searchable at once.
  // Each entry is { href, title?, text? } or { href, key } for a translated label.
  var SEARCH_INDEX = window.KYNARA_SEARCH || [];
  var searchBtn = document.querySelector('.search-toggle');
  var searchPanel = document.querySelector('.search-overlay');
  var searchInput = searchPanel && searchPanel.querySelector('input');
  var searchResults = searchPanel && searchPanel.querySelector('.search-results');
  var searchCount = searchPanel && searchPanel.querySelector('.search-count');
  var siteHeader = document.querySelector('.site-header');
  var SEARCH_ARROW = '<svg class="search-hit__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="square" aria-hidden="true"><path d="M6 18 18 6M8 6h10v10"/></svg>';

  // An entry is a product when it has a title (its name); its detail is the use line.
  function searchLabel(item) { return item.title || t(item.key) || ''; }
  function searchDetail(item) { return item.title ? (item.text || (item.key ? t(item.key) : '') || '') : ''; }
  function searchHref(item) {
    var parts = item.href.split('#');
    return cleanPath(parts[0]) + (currentLang === 'en' ? '' : '?lang=' + currentLang) + (parts[1] ? '#' + parts[1] : '');
  }
  // The matched part of a label is wrapped in <mark> (underlined, not highlighted)
  function appendMarked(el, text, q) {
    var i = q ? text.toLowerCase().indexOf(q) : -1;
    if (i < 0) { el.appendChild(document.createTextNode(text)); return; }
    el.appendChild(document.createTextNode(text.slice(0, i)));
    var m = document.createElement('mark');
    m.textContent = text.slice(i, i + q.length);
    el.appendChild(m);
    el.appendChild(document.createTextNode(text.slice(i + q.length)));
  }

  function renderSearch() {
    if (!searchResults) return;
    var q = (searchInput.value || '').trim().toLowerCase();
    searchResults.innerHTML = '';
    searchCount.textContent = '';
    if (!q) {
      // Nothing typed yet: every product and page as a quick link, so the panel is never empty
      [['search.products', true], ['search.pages', false]].forEach(function (g) {
        var items = SEARCH_INDEX.filter(function (item) { return !!item.title === g[1]; });
        if (!items.length) return;
        var group = document.createElement('div');
        group.className = 'search-quick' + (g[1] ? ' search-quick--products' : '');
        var label = document.createElement('p');
        label.className = 'search-quick__label';
        label.textContent = t(g[0]);
        var list = document.createElement('div');
        list.className = 'search-quick__list';
        items.forEach(function (item) {
          var a = document.createElement('a');
          a.className = 'search-quick__link';
          a.href = searchHref(item);
          a.textContent = searchLabel(item);
          list.appendChild(a);
        });
        group.appendChild(label);
        group.appendChild(list);
        searchResults.appendChild(group);
      });
      return;
    }
    // Names that start with the query first, then names that contain it, then use lines
    var hits = SEARCH_INDEX.map(function (item, order) {
      var label = searchLabel(item), detail = searchDetail(item);
      var l = label.toLowerCase().indexOf(q), d = detail.toLowerCase().indexOf(q);
      return { item: item, label: label, detail: detail, order: order, score: l === 0 ? 0 : l > 0 ? 1 : d > -1 ? 2 : -1 };
    }).filter(function (h) { return h.score > -1; }).sort(function (a, b) { return a.score - b.score || a.order - b.order; });
    if (!hits.length) {
      var p = document.createElement('p');
      p.className = 'search-empty';
      p.textContent = t('search.none') + '. ';
      var contact = SEARCH_INDEX.filter(function (item) { return item.key === 'nav.contact'; })[0];
      if (contact) {
        var ask = document.createElement('a');
        ask.href = searchHref(contact);
        ask.textContent = t('search.ask');
        p.appendChild(ask);
      }
      searchResults.appendChild(p);
      return;
    }
    searchCount.textContent = t(hits.length === 1 ? 'search.count.one' : 'search.count.many').replace('{n}', hits.length);
    hits.forEach(function (h) {
      var a = document.createElement('a');
      a.className = 'search-hit' + (h.item.title ? ' search-hit--product' : '');
      a.href = searchHref(h.item);
      var name = document.createElement('span');
      name.className = 'search-hit__name';
      appendMarked(name, h.label, q);
      a.appendChild(name);
      if (h.detail) {
        var detail = document.createElement('span');
        detail.className = 'search-hit__detail';
        appendMarked(detail, h.detail, q);
        a.appendChild(detail);
      }
      a.insertAdjacentHTML('beforeend', SEARCH_ARROW);
      searchResults.appendChild(a);
    });
  }

  var searchReturnFocus = null;
  function isSearchOpen() { return !!searchPanel && searchPanel.classList.contains('is-open'); }
  function setSearch(open) {
    if (open === isSearchOpen()) return;
    searchPanel.classList.toggle('is-open', open);
    searchBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    // The page behind stays put while the overlay is open
    document.documentElement.classList.toggle('is-search-locked', open);
    if (window.kynaraLenis) { if (open) window.kynaraLenis.stop(); else window.kynaraLenis.start(); }
    if (open) {
      searchReturnFocus = document.activeElement;
      renderSearch();
      setTimeout(function () { searchInput.focus(); searchInput.select(); }, 30);
    } else if (searchReturnFocus && searchReturnFocus.focus) {
      searchReturnFocus.focus();
    }
  }

  if (searchBtn && searchPanel) {
    searchBtn.addEventListener('click', function () { setSearch(!isSearchOpen()); });
    searchInput.addEventListener('input', renderSearch);
    searchPanel.querySelectorAll('[data-search-close]').forEach(function (b) {
      b.addEventListener('click', function () { setSearch(false); });
    });
    // A click on the blurred page around the content closes it; following a result closes it too
    searchPanel.addEventListener('click', function (e) {
      if (e.target === searchPanel || e.target.classList.contains('search-overlay__inner')) setSearch(false);
      else if (e.target.closest && e.target.closest('.search-results a')) setSearch(false);
    });
    document.addEventListener('keydown', function (e) {
      if (!isSearchOpen()) {
        var tag = (e.target && e.target.tagName) || '';
        var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(tag) || (e.target && e.target.isContentEditable);
        if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) { e.preventDefault(); setSearch(true); }
        else if (e.key === '/' && !typing) { e.preventDefault(); setSearch(true); }
        return;
      }
      if (e.key === 'Escape') { e.preventDefault(); setSearch(false); return; }
      var links = Array.prototype.slice.call(searchResults.querySelectorAll('a'));
      var at = links.indexOf(document.activeElement);
      if (e.key === 'ArrowDown' && links.length) {
        e.preventDefault();
        (links[at + 1] || links[0]).focus();
      } else if (e.key === 'ArrowUp' && at > -1) {
        e.preventDefault();
        if (at === 0) searchInput.focus(); else links[at - 1].focus();
      } else if (e.key === 'Enter' && document.activeElement === searchInput && searchInput.value.trim() && links.length) {
        e.preventDefault();
        links[0].click();   // Enter opens the top result
      } else if (e.key === 'Tab') {
        // Keep focus inside the dialog
        var f = Array.prototype.slice.call(searchPanel.querySelectorAll('button, input, a[href]'));
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
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

  // After a successful send: the whole screen turns green with a large, centred thank-you,
  // which lingers ~4s and fades away (a click or Esc dismisses it sooner). The form's own
  // status line still says "Thank you" for screen readers and once the green has gone.
  function showThanks() {
    var done = document.createElement('div');
    done.className = 'form-done';
    done.setAttribute('role', 'status');
    done.innerHTML = '<p class="form-done__title"></p><p class="form-done__body"></p>';
    done.querySelector('.form-done__title').textContent = t('contact.doneTitle');
    done.querySelector('.form-done__body').textContent = t('contact.doneBody');
    document.body.appendChild(done);
    void done.offsetWidth;   // so the fade-in runs
    done.classList.add('is-in');
    var timer;
    function close() {
      clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
      done.classList.remove('is-in');
      setTimeout(function () { if (done.parentNode) done.parentNode.removeChild(done); }, 600);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    done.addEventListener('click', close);
    document.addEventListener('keydown', onKey);
    timer = setTimeout(close, 4200);
  }

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
      // EmailJS: the same request their SDK's sendForm() makes, without loading the SDK.
      // Every field goes to the template by its name: {{name}}, {{company}}, {{email}}, {{product}}, {{message}}.
      var ejs = cfg.emailjs || {};
      if (ejs.serviceId && ejs.templateId && ejs.publicKey) {
        data.append('service_id', ejs.serviceId);
        data.append('template_id', ejs.templateId);
        data.append('user_id', ejs.publicKey);
        status.textContent = t('contact.sending');
        fetch('https://api.emailjs.com/api/v1.0/email/send-form', { method: 'POST', body: data })
          .then(function (r) {
            if (!r.ok) throw new Error(r.status);
            contactForm.reset();
            status.textContent = t('contact.sent');
            showThanks();
          })
          .catch(function () {
            status.textContent = t('contact.fail');
            status.classList.add('is-error');
          });
        return;
      }
      if (cfg.endpoint) {
        status.textContent = t('contact.sending');
        fetch(cfg.endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
          .then(function (r) {
            if (!r.ok) throw new Error(r.status);
            contactForm.reset();
            status.textContent = t('contact.sent');
            showThanks();
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
        'Email: ' + data.get('email') + '\n' +
        'Product of interest: ' + (data.get('product') || '-') + '\n\n' + data.get('message');
      window.location.href = 'mailto:' + (cfg.email || 'enquiries@kynara.id') +
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
  // It stays on screen all the way down, footer included (it used to slide away at
  // the footer; Anderson asked for it to stay).
  if (siteHeader) {
    var headerQueued = false;
    var placeHeader = function () {
      var scrolled = window.pageYOffset > 40;
      siteHeader.classList.toggle('is-scrolled', scrolled);
      headerQueued = false;
    };
    window.addEventListener('scroll', function () {
      if (headerQueued) return;
      headerQueued = true;
      window.requestAnimationFrame(placeHeader);
    }, { passive: true });
    window.addEventListener('resize', placeHeader);
    // Carry the header's state across pages, the way vestre.com does. As a page is
    // left, remember whether the bar was shrunk. If the next page opens at the top,
    // it starts shrunk too - instantly, before anything is painted - and then grows
    // back out with the normal grow animation, instead of simply appearing full
    // size. The note expires after a few seconds, so leaving the site and coming
    // back later in the same tab doesn't replay it. Skipped under reduced motion,
    // where the transitions are off and it would only flash.
    var CARRY_KEY = 'kynara-header-carry';
    var calmHeader = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.addEventListener('pagehide', function () {
      try {
        if (siteHeader.classList.contains('is-scrolled')) {
          window.sessionStorage.setItem(CARRY_KEY, String(Date.now()));
        } else {
          window.sessionStorage.removeItem(CARRY_KEY);
        }
      } catch (e) { /* storage blocked: the header just appears full size */ }
    });
    var carried = false;
    try {
      var carriedAt = Number(window.sessionStorage.getItem(CARRY_KEY));
      window.sessionStorage.removeItem(CARRY_KEY);
      carried = !calmHeader && carriedAt > 0 && Date.now() - carriedAt < 5000 && window.pageYOffset <= 40;
    } catch (e) { /* ignore */ }

    // First paint without animation. A page opened mid-scroll (a #anchor link, a
    // reload) simply starts shrunk; a carried-over page starts shrunk on purpose.
    siteHeader.classList.add('is-instant');
    if (carried) {
      siteHeader.classList.add('is-scrolled');
    } else {
      placeHeader();
    }
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        siteHeader.classList.remove('is-instant');
        // One more frame, so the grow is a real transition rather than part of
        // the first paint. placeHeader() sees the page at the top and grows it.
        if (carried) window.requestAnimationFrame(placeHeader);
      });
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

  /* ---------- 11. Counting stats (The Brand) ---------- */
  // Each .stat__value carries data-count-from / -to (plus optional -prefix / -suffix).
  // The HTML already holds the FINAL value, so search engines, JS-off and
  // reduced-motion visitors simply see the real numbers. Otherwise the values are
  // reset to their start and count once, when the stats come into view: up from 0,
  // except deforestation, which counts DOWN from 250 so the zero lands as the point.
  // They start a beat apart and ease out, rather than ticking at a constant rate.
  var statGroups = document.querySelectorAll('.stats');
  if (statGroups.length && 'IntersectionObserver' in window &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var countText = function (el, v) {
      return (el.getAttribute('data-count-prefix') || '') + Math.round(v) + (el.getAttribute('data-count-suffix') || '');
    };
    var countUp = function (el, delay) {
      var from = parseFloat(el.getAttribute('data-count-from') || '0');
      var to = parseFloat(el.getAttribute('data-count-to'));
      var duration = 1800;
      var start = null;
      var step = function (now) {
        if (start === null) start = now + delay;
        var t = Math.min(Math.max((now - start) / duration, 0), 1);
        var eased = 1 - Math.pow(1 - t, 4);              // ease-out quart
        el.textContent = countText(el, from + (to - from) * eased);
        if (t < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    };
    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        statsObserver.unobserve(entry.target);            // once only
        entry.target.querySelectorAll('[data-count-to]').forEach(function (el, i) {
          countUp(el, i * 150);
        });
      });
    }, { threshold: 0.5 });
    statGroups.forEach(function (group) {
      group.querySelectorAll('[data-count-to]').forEach(function (el) {
        el.textContent = countText(el, parseFloat(el.getAttribute('data-count-from') || '0'));
      });
      statsObserver.observe(group);
    });
  }

  /* ---------- 12. Contact button label ---------- */
  // The button opens by animating the label's width from 0 to the text's own
  // width. CSS can't animate to "auto", so the width is measured here into
  // --fab-label-w, and re-measured whenever the text's size changes (language
  // switch, web font arriving). Without JS the CSS falls back to auto: it still
  // opens to the right size, just without the animation.
  var fabText = document.querySelector('.chat-fab__text');
  if (fabText) {
    var fabButton = fabText.closest('.chat-fab');
    var measureFab = function () {
      fabButton.style.setProperty('--fab-label-w', fabText.offsetWidth + 'px');
    };
    measureFab();
    if ('ResizeObserver' in window) new ResizeObserver(measureFab).observe(fabText);
  }

  /* ---------- 13. Image parallax (The Brand) ---------- */
  // Every .img-box--parallax photo drifts inside its frame as the frame crosses the
  // screen. Progress p runs from 1 (frame entering at the bottom) to -1 (leaving at
  // the top) and the photo moves -p * 10% of the frame's height - exactly the slack
  // the CSS leaves - so it scrolls a little slower than the page. All frames are
  // measured first and written after, so a frame never forces an extra layout;
  // off-screen frames are skipped.
  var pxBoxes = Array.prototype.slice.call(document.querySelectorAll('.img-box--parallax'));
  if (pxBoxes.length && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    var pxQueued = false;
    var placeImages = function () {
      var vh = window.innerHeight;
      var rects = pxBoxes.map(function (box) { return box.getBoundingClientRect(); });
      pxBoxes.forEach(function (box, i) {
        var r = rects[i];
        if (r.bottom < 0 || r.top > vh) return;
        var p = (r.top + r.height / 2 - vh / 2) / ((vh + r.height) / 2);
        p = Math.max(-1, Math.min(1, p));
        box.firstElementChild.style.transform =
          'translate3d(0,' + (-p * r.height * 0.1).toFixed(1) + 'px,0)';
      });
      pxQueued = false;
    };
    var queueImages = function () {
      if (pxQueued) return;
      pxQueued = true;
      window.requestAnimationFrame(placeImages);
    };
    window.addEventListener('scroll', queueImages, { passive: true });
    window.addEventListener('resize', queueImages);
    window.addEventListener('load', queueImages);   // images and fonts can move the frames
    placeImages();
  }

  /* ---------- 14. Story cards: landing + tilt (Home) ---------- */
  // Landing: the cards are hidden (.is-armed) and "laid down" (.is-in) once the story
  // is a quarter on screen - once only. Tilt: each card leans up to 2.5deg toward the
  // pointer, eased 7% per frame, and settles flat when it leaves. The card is measured
  // once as the pointer enters (and again after a scroll): a tilted card's outline
  // changes as it tilts, so measuring on every move fed the tilt back into itself and
  // jittered. Both are skipped under reduced motion; touch gets no tilt.
  var storyEl = document.querySelector('.story');
  if (storyEl && 'IntersectionObserver' in window &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    storyEl.classList.add('is-armed');
    var storyObserver = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      storyEl.classList.add('is-in');
      storyObserver.disconnect();
    }, { threshold: 0.25 });
    storyObserver.observe(storyEl);

    var TILT = 2.5;
    storyEl.querySelectorAll('.story__card').forEach(function (card) {
      var tx = 0, ty = 0, cx = 0, cy = 0, tilting = false, box = null;
      var stepTilt = function () {
        cx += (tx - cx) * 0.07;
        cy += (ty - cy) * 0.07;
        card.style.setProperty('--rx', cy.toFixed(2) + 'deg');
        card.style.setProperty('--ry', cx.toFixed(2) + 'deg');
        if (Math.abs(tx - cx) > 0.005 || Math.abs(ty - cy) > 0.005) window.requestAnimationFrame(stepTilt);
        else tilting = false;
      };
      var startTilt = function () {
        if (tilting) return;
        tilting = true;
        window.requestAnimationFrame(stepTilt);
      };
      card.addEventListener('pointerenter', function () { box = card.getBoundingClientRect(); });
      window.addEventListener('scroll', function () { box = null; }, { passive: true });
      card.addEventListener('pointermove', function (e) {
        if (e.pointerType === 'touch') return;
        var r = box || (box = card.getBoundingClientRect());
        tx = ((e.clientX - r.left) / r.width - 0.5) * 2 * TILT;      // left/right -> rotateY
        ty = -((e.clientY - r.top) / r.height - 0.5) * 2 * TILT;     // up/down -> rotateX
        startTilt();
      });
      card.addEventListener('pointerleave', function () { tx = 0; ty = 0; startTilt(); });
    });
  }

  /* ---------- 15. Product options: Colour and Finishing (Products page) ---------- */
  // Each .pick__list is a radio group of rows (after vestre.com's material lists): clicking a
  // row selects it; arrow keys move through the group like native radios, and only the
  // chosen row is in the tab order.
  document.querySelectorAll('.pick__list[role="radiogroup"]').forEach(function (list) {   // the plain lists shown now aren't
    var rows = Array.prototype.slice.call(list.querySelectorAll('.pick__row'));
    function choose(row, focus) {
      rows.forEach(function (r) {
        var on = r === row;
        r.classList.toggle('is-selected', on);
        r.setAttribute('aria-checked', on ? 'true' : 'false');
        r.tabIndex = on ? 0 : -1;
      });
      if (focus) row.focus();
    }
    rows.forEach(function (row, i) {
      row.tabIndex = row.classList.contains('is-selected') ? 0 : -1;
      row.addEventListener('click', function () { choose(row); });
      row.addEventListener('keydown', function (e) {
        var d = (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1 : (e.key === 'ArrowUp' || e.key === 'ArrowLeft') ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        choose(rows[(i + d + rows.length) % rows.length], true);
      });
    });
  });

  /* ---------- Go ---------- */
  applyLang(currentLang);
})();
