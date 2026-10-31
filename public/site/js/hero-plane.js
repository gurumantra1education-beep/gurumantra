/* Homepage hero: a notebook-paper plane flies through a giant "MBA",
   in front of M, behind B, over A, and lands on the predictor card.
   Layers (z-index): back word 1 · plane behind 2 · front "B" 3 · plane in front 4 · content 5 · plane landed 6 */
(function () {
  var hero = document.querySelector('.hero');
  var plane = document.querySelector('.gm-plane');
  if (!hero || !plane) return;
  var word = hero.querySelector('.gm-word.back'), bEl = word && word.children[1];
  var trail = hero.querySelector('.gm-trail'), tPath = trail && trail.querySelector('.ink'), tMask = trail && trail.querySelector('.reveal');
  var card = document.getElementById('predictor');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  var segs = [], total = 0, perch = null, raf = 0, t0 = 0, DUR = 4200;

  function rel(el) {
    var r = el.getBoundingClientRect(), h = hero.getBoundingClientRect();
    return { x: r.left - h.left, y: r.top - h.top, w: r.width, h: r.height };
  }

  // Catmull-Rom through points -> cubic Bezier segments, each with the layer it flies on
  function build() {
    var W = hero.clientWidth, H = hero.clientHeight, b = rel(bEl), narrow = W < 960;
    var c = card ? rel(card) : { x: W - 360, y: H * 0.2, w: 320, h: 400 };
    var land = narrow
      ? { x: c.x + c.w * 0.5, y: c.y - 14 }
      : { x: c.x + c.w - 96, y: c.y - 24 };
    if (narrow && land.y > H * 0.7) land = { x: W - 58, y: b.y - 4 };
    var by = b.y + b.h * 0.5, pts;
    if (narrow) {
      pts = [
        { x: -90, y: by + b.h * 0.35, z: 4 },
        { x: b.x - b.w * 0.45, y: by, z: 4 },
        { x: b.x - 20, y: by - b.h * 0.15, z: 2 },
        { x: b.x + b.w + 24, y: by + b.h * 0.1, z: 4 },
        { x: b.x + b.w * 0.5, y: by + b.h * 0.5, z: 4 },
        { x: land.x - 60, y: land.y - 60, z: 6 },
        { x: land.x, y: land.y, z: 6 }
      ];
    } else {
      pts = [
        { x: -120, y: by + b.h * 0.3, z: 4 },
        { x: b.x - b.w * 0.6, y: by - b.h * 0.05, z: 4 },     // over M, in front
        { x: b.x - 24, y: by - b.h * 0.18, z: 2 },             // slips behind B
        { x: b.x + b.w + 26, y: by + b.h * 0.02, z: 4 },       // out the other side
        { x: b.x + b.w * 0.6, y: by + b.h * 0.42, z: 4 },      // loops back in front of B
        { x: c.x - 26, y: c.y + c.h * 0.5, z: 6 },            // climbs past the card
        { x: c.x + c.w * 0.45, y: c.y - 95, z: 6 },
        { x: land.x, y: land.y, z: 6 }
      ];
    }
    var d = '', path = document.createElementNS(NS, 'path');
    segs = []; total = 0;
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      var c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
      var c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
      var sd = 'M' + p1.x + ' ' + p1.y + ' C' + c1.x + ' ' + c1.y + ' ' + c2.x + ' ' + c2.y + ' ' + p2.x + ' ' + p2.y;
      path.setAttribute('d', sd);
      var len = path.getTotalLength ? measure(sd) : Math.hypot(p2.x - p1.x, p2.y - p1.y);
      segs.push({ d: sd, len: len, start: total, z: p1.z });
      total += len;
      d += (i ? ' C' + c1.x + ' ' + c1.y + ' ' + c2.x + ' ' + c2.y + ' ' + p2.x + ' ' + p2.y : sd);
    }
    perch = land;
    if (trail) {
      trail.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      tPath.setAttribute('d', d); tMask.setAttribute('d', d);
      tMask.style.strokeDasharray = total + ' ' + total;
    }
  }
  var probe = document.createElementNS(NS, 'svg'), probePath = document.createElementNS(NS, 'path');
  probe.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden');
  probe.appendChild(probePath); document.body.appendChild(probe);
  function measure(d) { probePath.setAttribute('d', d); return probePath.getTotalLength(); }
  function pointAt(dist) {
    for (var i = 0; i < segs.length; i++) {
      var s = segs[i];
      if (dist <= s.start + s.len || i === segs.length - 1) {
        probePath.setAttribute('d', s.d);
        var l = Math.max(0, Math.min(s.len, dist - s.start));
        var p = probePath.getPointAtLength(l), q = probePath.getPointAtLength(Math.min(s.len, l + 2)), o = probePath.getPointAtLength(Math.max(0, l - 2));
        return { x: p.x, y: p.y, a: Math.atan2(q.y - o.y, q.x - o.x), z: s.z };
      }
    }
  }

  var lastA = 0;
  function place(p, depth, bank) {
    plane.style.zIndex = p.z;
    var deg = p.a * 180 / Math.PI;
    plane.style.transform = 'translate(' + p.x + 'px,' + p.y + 'px) translate(-50%,-50%) perspective(500px) rotate(' + deg + 'deg) rotateX(' + bank + 'deg) scale(' + depth + ')';
  }
  // ease: quick start, glide, gentle touchdown
  function ease(k) { return k < 0.5 ? 2 * k * k * (1.5 - k) + k * 0.25 : 1 - Math.pow(1 - k, 2.6) * 0.98; }

  function frame(now) {
    var k = Math.min(1, (now - t0) / DUR), e = Math.min(1, ease(k)), dist = e * total;
    var p = pointAt(dist);
    var turn = p.a - lastA; if (turn > Math.PI) turn -= 2 * Math.PI; if (turn < -Math.PI) turn += 2 * Math.PI;
    lastA = p.a;
    var bank = Math.max(-55, Math.min(55, turn * 900));
    var depth = p.z === 2 ? 0.78 : p.z === 6 ? 1 : 1.12;
    if (k > 0.9) { p.a = p.a * (1 - (k - 0.9) * 10) + (-0.18) * ((k - 0.9) * 10); bank *= (1 - k) * 10; }
    place(p, depth, bank);
    if (tMask) tMask.style.strokeDashoffset = total - dist;
    if (k < 1) raf = requestAnimationFrame(frame);
    else done();
  }
  function done() {
    place({ x: perch.x, y: perch.y, a: -0.18, z: 6 }, 1, 0);
    plane.classList.add('landed');
    hero.classList.add('plane-landed');
  }
  function fly() {
    cancelAnimationFrame(raf);
    build();
    plane.classList.remove('landed'); hero.classList.remove('plane-landed');
    if (reduce) { if (tMask) tMask.style.strokeDashoffset = 0; done(); return; }
    lastA = 0; t0 = performance.now();
    raf = requestAnimationFrame(frame);
  }

  plane.addEventListener('click', fly);
  plane.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fly(); } });
  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { if (plane.classList.contains('landed')) { build(); if (tMask) tMask.style.strokeDashoffset = 0; done(); } }, 150);
  });
  var start = function () { setTimeout(fly, reduce ? 0 : 450); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else window.addEventListener('load', start);
})();
