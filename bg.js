/* The night sky behind the page: black, with white stars of very different brightness that shimmer
 * a little and turn together around the pole, like a timelapse of the sky taken at the North Pole,
 * looking straight up. It also types the name on index.html (see "the name, typed out").
 *
 * The sky   One fixed field of stars from a fixed seed, so it is the same on every visit and a
 *           window only shows more or less of it. It is drawn once, on a square canvas big enough
 *           to cover the window at any angle, and the browser turns that canvas as one layer. The
 *           pole is the middle of the window, with a bright pole star just off it.
 * Colour    Most stars are white. Some are slightly blue or slightly orange, as hot and cool stars
 *           are, on a bright star mostly in its glow, with its centre nearly white.
 * Turning   Counterclockwise, as the sky turns seen from the North Pole, one turn every TURN_S
 *           seconds. The angle comes from the clock, so the sky carries on across pages and reloads.
 * Shimmer   The brightest stars are small layers of their own, whose opacity wavers a little. The
 *           fainter ones dim only 5-12 % at most, as they cross the screen's pixels and the
 *           browser's filtering spreads their light.
 * Cost      Nothing is drawn after the first picture. A tick (HZ times a second) sets one
 *           transform and a few opacities, and the name's steps share those ticks. Everything stops
 *           in a hidden tab; under reduced motion there is one still sky. See DESIGN.md.
 *
 * Debug     window.__bg.stats(), .pause(), .resume(), .angle(radians), .typeAt(ms). URL parameters,
 *           read once at load: ?seed=N another sky  ?still no shimmer  ?nospin no turning
 *           ?white no colours
 *           ?turn=S seconds per turn  ?hz=N ticks a second  ?paused wait for resume().
 */
(function () {
  'use strict';

  var query = new URLSearchParams(location.search);

  // =========================================================================================
  // Tunables. Distances are CSS px.
  // =========================================================================================
  var SEED = query.has('seed') ? +query.get('seed') : 7;
  var SHIMMER = !query.has('still');
  var TINTS = !query.has('white');
  var SPIN = !query.has('nospin');
  var TURN_S = query.has('turn') ? +query.get('turn') : 360;   // one turn: a degree a second
  var HZ = query.has('hz') ? +query.get('hz') : 15;   // the cheapest rate that holds up: DESIGN.md
  var TICK_MS = 1000 / HZ;

  var HALF = 2200;                 // the field reaches this far from the pole on each side
  var DENSITY = 700;               // stars per million CSS px
  // Brightness as magnitudes, as in the real sky: each step dimmer is about 2.4x as many stars,
  // so most are faint and a few are brilliant.
  var MAX_MAG = 6.2, MAG_SLOPE = 0.38;
  var ALPHA_SLOPE = 0.11;          // on-screen brightness 10^(-slope x m): m 0 is white, m 6 about 22%
  var HALO_MAG = 3.4;              // stars brighter than this glow
  var LAYER_MAG = 1.8;             // stars brighter than this shimmer, each on its own layer
  // The stars' colours, after real stars' (hot: blue-white; cool: orange), and how common each is.
  var TINT_RGB = [[255, 255, 255], [216, 228, 255], [192, 210, 255], [170, 192, 255], [255, 232, 208], [255, 214, 170], [255, 196, 140]];
  var TINT_SHARE = [.60, .10, .08, .04, .08, .06, .04];
  var SCALE_CAP = 2;               // canvas px per CSS px, at most (the turning softens any finer)
  var MAX_CANVAS = 4096;           // canvas px on a side, at most (phones refuse much larger)
  var URL_BAR = 120;               // on a touch screen: room for the URL bar to come and go

  var canvas = document.getElementById('bg');
  if (!canvas) return;
  var ctx = canvas.getContext('2d', { alpha: false });
  var dpr = 1, u = 1, vw = 0, layoutVh = 0, R = 0;     // u: canvas px per CSS px; R: the canvas's half side
  var clip = null, rot = null;

  function pow10(x) { return Math.pow(10, x); }

  // ---- the catalogue, built once, brightest first; (x, y) from the pole ---------------------
  function mulberry(a) {
    return function () {
      a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  var rand = mulberry(SEED);
  var N = Math.round(4 * HALF * HALF / 1e6 * DENSITY);
  var SX = new Float32Array(N), SY = new Float32Array(N), SM = new Float32Array(N);
  (function () {
    // Slow waves of density, so the stars gather and thin out like a real sky, not an even noise.
    var w = [], i;
    for (i = 0; i < 4; i++) {
      var ang = rand() * Math.PI * 2, len = 500 + rand() * 1500;
      w.push([Math.cos(ang) * 2 * Math.PI / len, Math.sin(ang) * 2 * Math.PI / len, rand() * Math.PI * 2]);
    }
    function mottle(x, y) {
      var s = 0;
      for (var j = 0; j < 4; j++) s += Math.sin(w[j][0] * x + w[j][1] * y + w[j][2]);
      return 0.62 + 0.38 * s / 2.4;
    }
    var top = pow10(MAG_SLOPE * MAX_MAG) - 1, mags = [];
    for (i = 0; i < N; ) {
      var x = (rand() * 2 - 1) * HALF, y = (rand() * 2 - 1) * HALF;
      if (rand() > mottle(x, y)) continue;
      SX[i] = x; SY[i] = y;
      mags.push([Math.log(1 + rand() * top) / Math.LN10 / MAG_SLOPE, i]);
      i++;
    }
    SX[0] = 7; SY[0] = -5; mags[0][0] = 0.6;       // the pole star, just off the pole
    mags.sort(function (a, b) { return a[0] - b[0]; });
    var xs = SX.slice(), ys = SY.slice();
    for (i = 0; i < N; i++) { SX[i] = xs[mags[i][1]]; SY[i] = ys[mags[i][1]]; SM[i] = mags[i][0]; }
  })();
  // Each star's colour, from a random stream of its own, so the colours can change without any
  // star moving or changing its brightness.
  var ST = new Uint8Array(N);
  (function () {
    var tr = mulberry(SEED ^ 0x5bd1e995), i, k, u0;
    for (i = 0; i < N; i++) {
      u0 = tr();
      for (k = 0; k < TINT_SHARE.length - 1 && u0 >= TINT_SHARE[k]; k++) u0 -= TINT_SHARE[k];
      ST[i] = TINTS ? k : 0;
      if (SX[i] === 7 && SY[i] === -5 && TINTS) ST[i] = 4;   // the pole star is a little yellow, as Polaris is
    }
  })();

  // ---- how a star is drawn ------------------------------------------------------------------
  function sprite(size, stops, rgb) {
    var c = document.createElement('canvas');
    c.width = c.height = size;
    var g = c.getContext('2d'), r = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    for (var i = 0; i < stops.length; i++) r.addColorStop(stops[i][0], 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + stops[i][1] + ')');
    g.fillStyle = r;
    g.fillRect(0, 0, size, size);
    return c;
  }
  // One glow, one core and one fill for each colour. A bright star's centre is nearly white, so
  // its colour shows mostly in its glow, as in a photograph.
  var GLOW = [], CORE = [], FILL = [];
  (function () {
    for (var t = 0; t < TINT_RGB.length; t++) {
      var c = TINT_RGB[t];
      GLOW.push(sprite(128, [[0, .9], [.06, .62], [.14, .38], [.28, .2], [.48, .085], [.72, .025], [1, 0]], c));
      CORE.push(sprite(32, [[0, 1], [.55, 1], [.8, .35], [1, 0]],
        [Math.round(c[0] + (255 - c[0]) * .55), Math.round(c[1] + (255 - c[1]) * .55), Math.round(c[2] + (255 - c[2]) * .55)]));
      FILL.push('rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')');
    }
  })();
  function alphaOf(m) { return pow10(-ALPHA_SLOPE * Math.max(0, m)); }
  function haloR(m) { return 5 + 4.5 * Math.pow(HALO_MAG - m, 1.5); }
  function haloA(m) { return Math.min(1, 0.3 + 0.13 * (HALO_MAG - m)); }
  function coreR(m) { return 0.35 + 1.3 * pow10(-0.2 * Math.max(0, m)); }
  function reach(m) { return Math.ceil(Math.max(m < HALO_MAG ? haloR(m) : 0, coreR(m) * 1.5) * u) + 1; }
  function draw(g, cx, cy, m, t) {
    var a = alphaOf(m), r, d;
    if (m < HALO_MAG) {
      r = haloR(m) * u;
      g.globalAlpha = haloA(m);
      g.drawImage(GLOW[t], cx - r, cy - r, 2 * r, 2 * r);
    }
    g.globalAlpha = a;
    d = coreR(m) * 2 * u;
    if (d <= 2.5) {                                // a pin-prick: whole canvas pixels
      d = Math.max(1, Math.round(d));
      g.fillStyle = FILL[t];
      g.fillRect(Math.round(cx - d / 2), Math.round(cy - d / 2), d, d);
    } else {
      d *= 1.5;                                    // the sprite's edge is soft
      g.drawImage(CORE[t], cx - d / 2, cy - d / 2, d, d);
    }
  }

  // ---- the angle ----------------------------------------------------------------------------
  var holdAngle = null;
  function angleNow() {
    if (holdAngle !== null) return holdAngle;
    return SPIN ? 2 * Math.PI * ((Date.now() / 1000) % TURN_S) / TURN_S : 0;
  }
  function turn() { rot.style.transform = 'rotate(' + (-angleNow()) + 'rad)'; }  // CSS turns clockwise

  // ---- painting the sky, once per size ------------------------------------------------------
  // The bright stars' layers: each star's element, how far it dips, its two waves, and the
  // opacity it last got (in hundredths).
  var EL = [], DIP = [], W1 = [], W2 = [], P1 = [], P2 = [], LAST = [], drawn = 0;

  function touch() { return !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches); }

  function paint() {
    dpr = window.devicePixelRatio || 1;
    vw = window.innerWidth;
    layoutVh = window.innerHeight;
    if (!clip) {
      clip = document.createElement('div');
      clip.id = 'sky-clip';
      rot = document.createElement('div');
      rot.id = 'sky-rot';
      canvas.parentNode.insertBefore(clip, canvas);
      clip.appendChild(rot);
      rot.appendChild(canvas);
    }
    var below = layoutVh / 2 + (touch() ? URL_BAR : 0);
    R = Math.ceil(Math.sqrt(vw * vw / 4 + below * below)) + 24;
    var side = 2 * R;
    u = Math.min(dpr, SCALE_CAP, MAX_CANVAS / side);
    canvas.width = canvas.height = Math.round(side * u);     // this clears it
    canvas.style.width = canvas.style.height = side + 'px';
    rot.style.width = rot.style.height = side + 'px';
    rot.style.left = vw / 2 - R + 'px';
    rot.style.top = layoutVh / 2 - R + 'px';
    ctx.globalCompositeOperation = 'lighter';               // where glows overlap, light adds up

    while (EL.length) rot.removeChild(EL.pop());
    DIP.length = W1.length = W2.length = P1.length = P2.length = LAST.length = 0;
    drawn = 0;
    var c = R * u, reachOut = (R + 30) * (R + 30);
    for (var i = 0; i < N; i++) {
      var x = SX[i], y = SY[i], m = SM[i];
      if (x * x + y * y > reachOut) continue;
      if (SHIMMER && m < LAYER_MAG) {
        var r = reach(m), t = document.createElement('canvas'), g;
        t.width = t.height = 2 * r + 2;
        t.className = 'tw';
        t.style.width = t.style.height = t.width / u + 'px';
        t.style.left = (c + x * u - r - 1) / u + 'px';
        t.style.top = (c + y * u - r - 1) / u + 'px';
        g = t.getContext('2d');
        g.globalCompositeOperation = 'lighter';
        draw(g, r + 1, r + 1, m, ST[i]);
        rot.appendChild(t);
        EL.push(t); DIP.push(0.08 + 0.05 * m); LAST.push(100);
        W1.push(1.5 + rand() * 2.5); W2.push(3.5 + rand() * 4); P1.push(rand() * 6.28); P2.push(rand() * 6.28);
      } else {
        draw(ctx, c + x * u, c + y * u, m, ST[i]);
      }
      drawn++;
    }
    turn();
  }

  // A third of the bright stars each tick: the top of a star's wave is its full brightness.
  var ticks = 0;
  function tick(now) {
    ticks++;
    if (SPIN) turn();
    var t = now / 1000, i, p, o;
    for (i = ticks % 3; i < EL.length; i += 3) {
      p = 0.6 * Math.sin(W1[i] * t + P1[i]) + 0.4 * Math.sin(W2[i] * t + P2[i]);
      o = Math.round((1 - DIP[i] * (1 - p)) * 100);
      if (o !== LAST[i]) { LAST[i] = o; EL[i].style.opacity = o / 100; }
    }
  }
  var LOOPS = SPIN || SHIMMER;

  // ---- the name, typed out ------------------------------------------------------------------
  // index.html's name is one span per character; style.css draws the state from one attribute:
  // data-typed="n" shows the first n characters with Minecraft's chat caret (the font's own "_")
  // after them, "n off" the same without it. This clock sets that attribute at each step of a
  // fixed schedule and does nothing between steps. It runs while the name is in view, and not in
  // a hidden tab, under reduced motion or ?paused. Without this script the markup's full name
  // shows. On arrival the line is empty and types the whole name. From then on, for good, it goes
  // through three passes: hold the name, delete back to a stop like a held backspace, wait, type
  // the rest again. The caret stays on while it types or deletes and blinks while the line waits.
  var TYPE_FIRST = 600;            // ms of empty line before the first keystroke on arrival
  var TYPE_GAPS = [120, 95, 110, 140, 90, 130, 160, 105, 85, 115];   // ms between keystrokes: uneven like a person, the same every pass
  var TYPE_HOLD = 5000;            // the full name stays this long
  var TYPE_REPEAT_DELAY = 400;     // a held backspace: one deletion, this pause ...
  var TYPE_REPEAT = 45;            // ... then one deletion every this many ms
  var TYPE_WAIT_AT_STOP = 1000;    // the pause where the deleting stopped, before it types again
  var CARET_BLINK = 300;           // on 0.3 s, off 0.3 s (Minecraft: 6 ticks on, 6 off, at 20 a second)
  var TYPE_WAIT = 2000;            // style.css shows the full name by itself after this (name-wait)
  var TYPE_STOPS = [4, 6, 0];      // how many characters each pass keeps: "Shan", "Shante", none
  var nameEl = document.querySelector('h1.name');
  var lettersEl = nameEl && nameEl.querySelector('.letters');
  var nameN = lettersEl ? lettersEl.children.length : 0, nameOn = nameN > 0;
  // The schedule, built once: event i shows TY_S[i] at TY_T[i] ms; events from TY_LOOP on repeat
  // every TY_P ms. TY_FULL is the last keystroke of the first typing (the full name, caret on).
  var TY_T = [], TY_S = [], TY_LOOP = 0, TY_P = 0, TY_FULL = 0;
  (function () {
    if (!nameOn) return;
    var t = 0, i, p, stop;
    function at(s) { TY_T.push(t); TY_S.push(s); }
    function idle(n, ms) {                        // the caret blinks; the step before turned it on
      for (var b = CARET_BLINK; b < ms; b += CARET_BLINK) { TY_T.push(t + b); TY_S.push((b / CARET_BLINK) & 1 ? n + ' off' : '' + n); }
      t += ms;
    }
    function typeFrom(from) { for (var c = from; c < nameN; c++) { at('' + c); t += TYPE_GAPS[(c - 1) % TYPE_GAPS.length]; } }
    at('0'); idle(0, TYPE_FIRST);
    typeFrom(1);
    TY_LOOP = TY_FULL = TY_T.length;              // the loop starts at the last keystroke
    for (p = 0; p < TYPE_STOPS.length; p++) {
      stop = TYPE_STOPS[p];
      at('' + nameN);
      idle(nameN, TYPE_HOLD);
      for (i = nameN - 1; i >= stop; i--) { at('' + i); if (i > stop) t += i === nameN - 1 ? TYPE_REPEAT_DELAY : TYPE_REPEAT; }
      idle(stop, TYPE_WAIT_AT_STOP);
      typeFrom(stop + 1);
    }
    TY_P = t - TY_T[TY_LOOP];
  })();
  var tyI = 0, tySteps = 0, typing = false, tyBegun = false, tyInView = true, tyFrozen = false;
  // Its doubles (ms on performance.now()): when this pass's event 0 is due, when the next step
  // is due, when the clock stopped, arrival (for stats), and the time to act on.
  var TYC = new Float64Array(5);

  // Show the event that is due (the last one, if a stall left several) and wait for the next.
  function typeStep() {
    var s;
    do {
      s = TY_S[tyI];
      if (++tyI === TY_T.length) { tyI = TY_LOOP; TYC[0] += TY_P; }
      TYC[1] = TYC[0] + TY_T[tyI];
    } while (TYC[1] <= TYC[4]);
    nameEl.setAttribute('data-typed', s);
    tySteps++;
  }
  // Set the clock to c ms after arrival and show that moment (stopped; typeSync starts it).
  function typeSeek(c) {
    var k = 0, i = 0;
    if (c >= TY_T[TY_LOOP]) { k = Math.floor((c - TY_T[TY_LOOP]) / TY_P); c -= k * TY_P; }
    while (i + 1 < TY_T.length && TY_T[i + 1] <= c) i++;
    TYC[4] = TYC[2] = performance.now();
    TYC[0] = TYC[4] - c;
    TYC[3] = TYC[0] - k * TY_P;
    tyI = i;
    typeStep();
  }
  // The first time: the empty line, unless style.css has shown the name by itself already (this
  // script came late): then it starts at the full name and carries on from there. A page that
  // loaded out of sight (a background tab, or a page Safari preloads) has shown nothing yet, so
  // it starts empty when it first comes on screen, however long it waited.
  var tyBootHidden = !!document.hidden;
  function typeBegin() {
    tyBegun = true;
    typeSeek(performance.now() < TYPE_WAIT || tyBootHidden ? 0 : TY_T[TY_FULL]);
  }
  // Start or stop the clock to match the loop and the name's place on screen.
  function typeSync() {
    var on = nameOn && running && tyInView && !tyFrozen;
    if (on === typing) return;
    if (on && !tyBegun) typeBegin();
    typing = on;
    var now = performance.now();
    if (on) { var d = now - TYC[2]; TYC[0] += d; TYC[1] += d; TYC[3] += d; }
    else TYC[2] = now;
    if (running) arm();
  }

  // ---- the clock: sleeps until the next tick or keystroke, whichever comes first --------------
  // A timer wakes a little early and asks for one animation frame, so a tick and a keystroke due
  // close together share one rendering update instead of costing two.
  var EARLY_MS = 4, SLACK_MS = 6, running = false, held = query.has('paused'), reduced = false;
  var rafId = 0, timerId = 0, dueAt = 0, rafCount = 0;
  function onFrame() {
    rafId = 0;
    if (!running) return;
    rafCount++;
    var now = performance.now(), stepAt = TYC[1], step = typing && now >= stepAt - SLACK_MS;
    if (step) { TYC[4] = now; typeStep(); }
    if (LOOPS && (now >= dueAt - SLACK_MS || (step && dueAt - stepAt <= TICK_MS / 2))) {
      tick(now);
      dueAt = dueAt + TICK_MS > now ? dueAt + TICK_MS : now + TICK_MS;
    }
    arm();
  }
  function wakeUp() { timerId = 0; if (running) rafId = requestAnimationFrame(onFrame); }
  function arm() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    if (timerId) { clearTimeout(timerId); timerId = 0; }
    var wake = LOOPS ? dueAt : Infinity;
    if (typing && TYC[1] < wake + (LOOPS ? TICK_MS / 2 : 0)) wake = TYC[1];
    if (wake === Infinity) return;                 // nothing to do, so nothing runs at all
    var wait = wake - EARLY_MS - performance.now();
    if (wait > 1) timerId = setTimeout(wakeUp, Math.ceil(wait) | 0);
    else rafId = requestAnimationFrame(onFrame);
  }
  function start() {
    if (running || reduced || held || document.hidden) return;
    running = true;
    dueAt = 0;
    typeSync();
    arm();
  }
  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    if (timerId) clearTimeout(timerId);
    rafId = 0; timerId = 0;
    typeSync();
  }

  window.__bg = {
    stats: function () {
      return {
        hz: HZ, stars: drawn, layers: EL.length, ticks: ticks, rafCalls: rafCount,
        canvas: canvas.width, radius: R, running: running, angle: angleNow(),
        typing: nameOn ? { on: typing, state: nameEl.getAttribute('data-typed'), steps: tySteps, inView: tyInView, period: TY_P } : null
      };
    },
    pause: function () { held = true; stop(); },
    resume: function () { held = false; start(); },
    // angle(a) holds the sky at a radians counterclockwise; angle() lets it follow the clock again.
    angle: function (a) {
      holdAngle = a === undefined || a === null ? null : +a;
      turn();
    },
    // typeAt(ms) shows the typed name as it is ms after arrival and holds it there; typeAt()
    // lets it run on from that moment. Returns the data-typed state shown.
    typeAt: function (ms) {
      if (!nameOn) return null;
      if (ms === undefined || ms === null) { tyFrozen = false; typeSync(); }
      else { tyFrozen = true; typeSync(); tyBegun = true; typeSeek(+ms); }
      return nameEl.getAttribute('data-typed');
    }
  };

  // ---- boot ---------------------------------------------------------------------------------
  paint();
  var motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  reduced = !!(motionQuery && motionQuery.matches);
  if (nameOn && window.IntersectionObserver) {   // the typed name stops while it is out of view
    new IntersectionObserver(function (es) {
      tyInView = es[es.length - 1].isIntersecting;
      typeSync();
    }).observe(nameEl);
  }
  if (motionQuery) {
    var onMotion = function () { reduced = motionQuery.matches; if (reduced) stop(); else start(); };
    if (motionQuery.addEventListener) motionQuery.addEventListener('change', onMotion);
    else if (motionQuery.addListener) motionQuery.addListener(onMotion);
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });
  var resizeTimer = 0;
  function onResize() {
    var d = window.devicePixelRatio || 1;
    if (d === dpr && window.innerWidth === vw) {
      // Only the height changed. A phone's URL bar comes and goes without moving the pole, as
      // long as the canvas still reaches the far corners.
      var h = window.innerHeight, farY = Math.max(h - layoutVh / 2, layoutVh / 2);
      if (h === layoutVh || (touch() && Math.sqrt(vw * vw / 4 + farY * farY) < R)) return;
    }
    paint();
  }
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(onResize, 180);
  });
  start();
})();
