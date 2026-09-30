/* ==========================================================================
   KYNARA layer breakdown ("exploded view")
   Markup: <section class="layers" data-layers> ... see layers-demo.html
   - Draws the board as flat SVG slabs (one <g> per layer), built from the
     LAYERS list below: thickness, colours and, for the core, its profile.
   - Scroll-scrubbed, in reverse (Anderson's call): the board arrives
     exploded and, while the section is pinned, closes up into one board as
     you scroll down, then holds closed. Scrolling back up opens it again. Each layer is labelled, with a leader
     line to its cut end. With scrubbing off (config or reduced motion), the
     board simply sits exploded.
   - It no longer singles out one layer at a time (Anderson removed the
     step-through, the click-to-select, the dimming and the description panel).
     The .body strings below are kept, unused, in case the descriptions return.
   - Strings are merged into window.KYNARA_I18N here, so this file must load
     AFTER js/i18n.js and BEFORE js/main.js (which applies the language).
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Strings (EN + ID). The .body descriptions are DRAFT copy and currently unused ---------- */
  var STRINGS = {
    en: {
      'layers.title': 'Our Product',
      'layers.coating.name': '(PU) Clear Coating',
      'layers.coating.sub': '',
      'layers.coating.body': 'A clear polyurethane finish that seals the surface, so it resists water and stains and stays easy to clean.',
      'layers.pigment.name': 'Nanowood',
      'layers.pigment.sub': 'Pigment',
      'layers.pigment.body': 'A fine pigment layer that gives each colour variant its tone, evenly across the whole board.',
      'layers.teak.name': 'Teak Wood',
      'layers.teak.sub': 'Composite',
      'layers.teak.body': 'A teak-grain composite face with the warmth and texture of timber, made without felling a single tree.',
      'layers.mineral.name': 'Mineral',
      'layers.mineral.sub': 'Composite',
      'layers.mineral.body': 'The dense structural core that gives the board its strength, stability and resistance to moisture.'
    },
    id: {
      'layers.title': 'Produk Kami',
      'layers.coating.name': 'Lapisan Bening (PU)',
      'layers.coating.sub': '',
      'layers.coating.body': 'Lapisan akhir poliuretan bening yang menyegel permukaan, sehingga tahan air dan noda serta mudah dibersihkan.',
      'layers.pigment.name': 'Nanowood',
      'layers.pigment.sub': 'Pigmen',
      'layers.pigment.body': 'Lapisan pigmen halus yang memberi warna pada setiap varian, merata di seluruh papan.',
      'layers.teak.name': 'Kayu Jati',
      'layers.teak.sub': 'Komposit',
      'layers.teak.body': 'Permukaan komposit bertekstur serat jati dengan kehangatan kayu asli, dibuat tanpa menebang satu pohon pun.',
      'layers.mineral.name': 'Mineral',
      'layers.mineral.sub': 'Komposit',
      'layers.mineral.body': 'Inti struktural yang padat, memberi papan kekuatan, kestabilan, dan ketahanan terhadap kelembapan.'
    }
  };
  window.KYNARA_I18N = window.KYNARA_I18N || { en: {}, id: {} };
  ['en', 'id'].forEach(function (lang) {
    window.KYNARA_I18N[lang] = window.KYNARA_I18N[lang] || {};
    Object.keys(STRINGS[lang]).forEach(function (k) {
      if (!(k in window.KYNARA_I18N[lang])) window.KYNARA_I18N[lang][k] = STRINGS[lang][k];
    });
  });

  /* ---------- Settings ---------- */
  var CFG = (window.KYNARA_CONFIG && window.KYNARA_CONFIG.layers) || {};
  var SCRUB = CFG.scrub !== false;           // set layers: { scrub: false } in config.js to turn scrubbing off
  var GAP = CFG.gap || 118;                  // extra space between layers when fully exploded (drawing units)
  var EXPLODE_END = 0.8;                     // share of the pinned scroll spent closing the board up; it holds closed for the rest

  /* ---------- The board: top layer first ----------
     Units are drawing units (the SVG viewBox scales them to the page).
     t = thickness. Faces: top / front / end (the cut end the labels point at). */
  // The whole board fits in the frame, unfaded (Anderson, 29 Sep: "Medium" from a draft of 700/900/1100).
  // It used to be 1500, running off the right edge and fading like the render. Override with
  // layers: { length: ... } in KYNARA_CONFIG.
  var BOARD = { length: CFG.length || 900, depth: 240 };
  var MIN_VIEW = 720;                         // drawing units always in view across the width (keeps it readable on phones)
  var LAYERS = [
    { id: 'coating', t: 4,  top: 'rgba(255,255,255,.62)', front: 'rgba(255,255,255,.9)', end: 'rgba(255,255,255,.95)', stroke: 'rgba(0,0,0,.16)' },
    { id: 'pigment', t: 4,  top: '#ebe4d6', front: '#d8cebc', end: '#cfc4b0' },
    { id: 'teak',    t: 16, top: '#b47b4a', front: '#915f38', end: '#7d502e', grain: ['#9d6739', '#c38d5c', '#a8703f'] },
    { id: 'mineral', t: 66, top: '#2a2a2a', front: '#141414', end: '#1f1f1f', inner: '#0b0b0b', profile: 'core' }
  ];

  /* Projection: seen from the front-left and above, so the cut ends face the labels.
     screen x/y per unit of board length (x), depth (y) and height (z). */
  var AX = { x: [0.90, -0.27], y: [-0.52, -0.26], z: [0, -1] };
  var CAM = [-1, -1.8, 0.75]; // direction towards the viewer, used for hiding back faces and draw order

  function project(p) {
    return [p[0] * AX.x[0] + p[1] * AX.y[0], p[0] * AX.x[1] + p[1] * AX.y[1] - p[2]];
  }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function pathFrom(points) {
    return 'M' + points.map(function (p) { var s = project(p); return s[0].toFixed(1) + ' ' + s[1].toFixed(1); }).join('L') + 'Z';
  }

  /* Cross-section of a layer in the depth/height plane, as [y, z] points going
     counter-clockwise (y towards the back, z up). Points flagged true start an
     edge inside the tongue groove, which is drawn in the layer's darker "inner" colour. */
  function profileOf(layer) {
    var D = BOARD.depth, T = layer.t;
    if (layer.profile !== 'core') return { pts: [[0, 0], [D, 0], [D, T], [0, T]], groove: [] };
    var r = 18, g1 = T * 0.62, g2 = T * 0.38, gd = 22;   // nose radius, groove top/bottom, groove depth
    var pts = [[D, 0], [D, T]], groove = [];
    for (var i = 0; i <= 6; i++) {                        // top edge into the rounded front-top corner
      var a = (90 + 90 * i / 6) * Math.PI / 180;
      pts.push([r + r * Math.cos(a), T - r + r * Math.sin(a)]);
    }
    groove.push(pts.length, pts.length + 1, pts.length + 2); // the three edges inside the groove
    pts.push([0, g1], [gd, g1], [gd, g2], [0, g2]);
    for (var j = 0; j <= 6; j++) {                        // front-bottom corner down to the bottom edge
      var b = (180 + 90 * j / 6) * Math.PI / 180;
      pts.push([r + r * Math.cos(b), r + r * Math.sin(b)]);
    }
    return { pts: pts, groove: groove };
  }

  var SVGNS = 'http://www.w3.org/2000/svg';
  function el(name, attrs) {
    var n = document.createElementNS(SVGNS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  /* Builds one layer's <g>. Faces are sorted back-to-front (painter's order). */
  function buildLayer(layer, idx, defs) {
    var L = BOARD.length;
    var shape = profileOf(layer), prof = shape.pts;
    var cy = 0, cz = 0;   // centre of the cross-section, used for draw order of the cut end
    prof.forEach(function (p) { cy += p[0]; cz += p[1]; });
    cy /= prof.length; cz /= prof.length;

    var faces = [];
    for (var i = 0; i < prof.length; i++) {
      var a = prof[i], b = prof[(i + 1) % prof.length];
      var dy = b[0] - a[0], dz = b[1] - a[1];
      if (Math.abs(dy) + Math.abs(dz) < 0.01) continue;
      var n = [0, dz, -dy];                                        // outward normal of a counter-clockwise edge
      if (dot(n, CAM) <= 0) continue;                              // faces away from the viewer
      var quad = [[0, a[0], a[1]], [L, a[0], a[1]], [L, b[0], b[1]], [0, b[0], b[1]]];
      var isTop = Math.abs(a[1] - layer.t) < 0.01 && Math.abs(b[1] - layer.t) < 0.01;
      var inGroove = shape.groove.indexOf(i) > -1;
      var fill = isTop ? layer.top : (inGroove ? layer.inner : layer.front);
      var c = [L / 2, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      faces.push({ d: pathFrom(quad), fill: fill, depth: dot(c, CAM), top: isTop });
    }
    // The cut end (x = 0) always faces the viewer
    faces.push({
      d: pathFrom(prof.map(function (p) { return [0, p[0], p[1]]; })),
      fill: layer.end, depth: dot([0, cy, cz], CAM) + 1e4
    });
    faces.sort(function (p, q) { return p.depth - q.depth; });

    var g = el('g', { 'class': 'layers__slab', 'data-layer': layer.id });
    faces.forEach(function (f) {
      var attrs = { d: f.d, fill: f.fill };
      if (layer.stroke) { attrs.stroke = layer.stroke; attrs['stroke-width'] = '1'; attrs['vector-effect'] = 'non-scaling-stroke'; attrs['stroke-linejoin'] = 'round'; }
      g.appendChild(el('path', attrs));
      if (f.top && layer.grain) g.appendChild(grain(layer, f, idx, defs));
    });
    return g;
  }

  /* Teak grain: wavy lines along the board, clipped to the top face */
  function grain(layer, face, idx, defs) {
    var id = 'kynara-grain-' + idx;
    var clip = el('clipPath', { id: id });
    clip.appendChild(el('path', { d: face.d }));
    defs.appendChild(clip);
    var g = el('g', { 'clip-path': 'url(#' + id + ')', fill: 'none', 'stroke-linecap': 'round' });
    var seed = 7;
    function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    for (var i = 0; i < 34; i++) {
      var y0 = rnd() * BOARD.depth, amp = 2 + rnd() * 5, freq = 0.004 + rnd() * 0.01, ph = rnd() * 6;
      var pts = [];
      for (var x = -20; x <= BOARD.length + 20; x += 22) pts.push([x, y0 + Math.sin(x * freq + ph) * amp, layer.t]);
      g.appendChild(el('path', {
        d: 'M' + pts.map(function (p) { var s = project(p); return s[0].toFixed(1) + ' ' + s[1].toFixed(1); }).join('L'),
        stroke: layer.grain[i % layer.grain.length],
        'stroke-width': (0.6 + rnd() * 1.4).toFixed(2),
        opacity: (0.35 + rnd() * 0.45).toFixed(2)
      }));
    }
    return g;
  }

  /* ---------- Component ---------- */
  function init(section) {
    var frame = section.querySelector('.layers__frame');
    var stage = section.querySelector('.layers__stage');
    var art = section.querySelector('.layers__art');
    var leaders = section.querySelector('.layers__leaders');
    var labels = Array.prototype.slice.call(section.querySelectorAll('.layers__label'));

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var scrub = SCRUB && !reduce;
    section.classList.toggle('layers--scrub', scrub);

    /* Draw */
    var svg = el('svg', { 'class': 'layers__svg', role: 'img' });
    var defs = el('defs', {});
    svg.appendChild(defs);
    var n = LAYERS.length;
    var base = [], z = 0;
    for (var i = n - 1; i >= 0; i--) { base[i] = z; z += LAYERS[i].t; }   // stack from the bottom up
    var groups = LAYERS.map(function (layer, i) { return buildLayer(layer, i, defs); });
    for (var j = n - 1; j >= 0; j--) svg.appendChild(groups[j]);             // bottom first, so upper layers draw over

    // Vertical extent of the fully exploded board, centred on the assembled one.
    // The width is set in fitView() to match the frame, so the board fills it edge to edge.
    var spread = GAP * (n - 1);
    var corners = [];
    [0, BOARD.length].forEach(function (x) {
      [0, BOARD.depth].forEach(function (y) {
        [-spread / 2, z + spread / 2].forEach(function (zz) { corners.push(project([x, y, zz])); });
      });
    });
    var VB = { x: Math.min.apply(null, corners.map(function (c) { return c[0]; })) - 12, y: 0, h: 0, w: 0 };
    // the whole board's width: nothing fades any more, so no part of it may be cut off
    VB.w = Math.max.apply(null, corners.map(function (c) { return c[0]; })) + 12 - VB.x;
    // only the part of the board that can be on screen counts towards the height
    var visible = corners.filter(function (c) { return c[0] <= VB.x + MIN_VIEW * 1.4; });
    VB.y = Math.min.apply(null, visible.map(function (c) { return c[1]; })) - 12;
    VB.h = Math.max.apply(null, visible.map(function (c) { return c[1]; })) + 12 - VB.y;
    svg.setAttribute('preserveAspectRatio', 'xMinYMid meet');
    function fitView() {
      var r = art.getBoundingClientRect();
      if (!r.width || !r.height) return;
      var aspect = r.width / r.height;
      var w = Math.max(VB.h * aspect, MIN_VIEW, VB.w), h = w / aspect;
      svg.setAttribute('viewBox', [VB.x, VB.y - (h - VB.h) / 2, w, h].map(function (v) { return v.toFixed(1); }).join(' '));
    }
    art.appendChild(svg);

    /* State: how far apart the board is, 0 (assembled) to 1 (fully exploded).
       It starts exploded either way; scrubbing then closes it. */
    var explode = 1;

    function offsetOf(i) {                      // height of layer i's underside, in drawing units
      return base[i] + explode * GAP * (n - 1 - i) - explode * spread / 2;
    }
    function anchorOf(i) {                      // middle of the layer's cut end
      return project([0, BOARD.depth * 0.55, LAYERS[i].t / 2 + offsetOf(i)]);
    }

    function layout() {
      fitView();
      groups.forEach(function (g, i) { g.setAttribute('transform', 'translate(0 ' + (-offsetOf(i)).toFixed(2) + ')'); });

      var stageBox = stage.getBoundingClientRect();
      var ctm = svg.getScreenCTM();
      var wide = window.matchMedia('(min-width: 901px)').matches;
      leaders.innerHTML = '';
      if (!ctm || !wide) { labels.forEach(function (lb) { lb.style.top = ''; }); return; }
      leaders.setAttribute('viewBox', '0 0 ' + stageBox.width + ' ' + stageBox.height);

      // Where each label wants to sit (level with its layer), then pushed apart so none overlap
      var pts = labels.map(function (lb, i) {
        var a = anchorOf(i);
        return { x: a[0] * ctm.a + ctm.e - stageBox.left, y: a[1] * ctm.d + ctm.f - stageBox.top, h: lb.offsetHeight };
      });
      var ys = [], minGap = 14;
      pts.forEach(function (p, i) {
        var y = p.y - p.h / 2;
        if (i > 0) y = Math.max(y, ys[i - 1] + pts[i - 1].h + minGap);
        ys.push(y);
      });
      labels.forEach(function (lb, i) {
        lb.style.top = ys[i].toFixed(1) + 'px';
        var line = lb.querySelector('.layers__label-text');
        var lr = line.getBoundingClientRect();
        var x1 = lr.right - stageBox.left + 26, y1 = ys[i] + line.offsetHeight / 2;
        // The dot sits on the middle of the layer's cut end (the anchor). It used to sit 16px
        // left of it, straight across, which fell below the slanted edge and missed the thin
        // coating and pigment layers. If it has to move right to clear the label, it slides
        // along the slanted edge so it stays on the layer.
        var slope = AX.y[1] / AX.y[0];            // screen rise per px leftwards along the cut end
        var x2 = pts[i].x, y2 = pts[i].y;
        if (x2 < x1 + 20) { y2 += (x1 + 20 - x2) * slope; x2 = x1 + 20; }   // pushed right = back down the slant
        leaders.appendChild(el('line', { x1: x1, y1: y1, x2: x2, y2: y2, 'class': 'layers__leader' }));
        leaders.appendChild(el('circle', { cx: x2, cy: y2, r: 3.5, 'class': 'layers__leader' }));
      });
    }

    /* Scroll scrubbing: the board closes up over the first EXPLODE_END of the pinned
       scroll, then holds assembled for the rest */
    function progress() {
      var r = section.getBoundingClientRect();
      var run = section.offsetHeight - frame.offsetHeight;
      return run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 1;
    }
    function ease(v) { return v < 0.5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2) / 2; }
    var ticking = false;
    function update() {
      ticking = false;
      if (scrub) explode = 1 - ease(Math.min(1, progress() / EXPLODE_END));
      layout();
    }
    function request() { if (!ticking) { ticking = true; window.requestAnimationFrame(update); } }

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(request);
    // Language switch: the label widths change, so re-place the leader lines once main.js has swapped them
    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('[data-set-lang]')) setTimeout(request, 0);
    });

    update();
  }

  function start() { document.querySelectorAll('[data-layers]').forEach(init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
