(function () {
  var CFG = window.GM_CONFIG || {};
  var CUT = window.GM_CUT || [], ROUTES = window.GM_ROUTES || [], FEAT = window.GM_FEAT || {};
  function $(id) { return document.getElementById(id); }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && matchMedia('(pointer: fine)').matches;
  var ARROW = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>';
  var LOCK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>';
  window.GM = { el: el, ARROW: ARROW, wa: wa };

  function wa(text) { return 'https://wa.me/' + (CFG.whatsapp || '') + (text ? '?text=' + encodeURIComponent(text) : ''); }

  /* Contact details from config */
  document.querySelectorAll('[data-wa]').forEach(function (a) { a.href = wa(a.getAttribute('data-wa')); });
  document.querySelectorAll('[data-tel]').forEach(function (a) { a.href = 'tel:' + CFG.phoneTel; });
  document.querySelectorAll('[data-mail]').forEach(function (a) { a.href = 'mailto:' + CFG.email; });
  document.querySelectorAll('[data-phone-text]').forEach(function (s) { s.textContent = CFG.phoneDisplay; });
  document.querySelectorAll('[data-email-text]').forEach(function (s) { s.textContent = CFG.email; });

  /* Mobile menu */
  var burger = $('burger'), menu = $('menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); } });
  }

  /* Copy buttons */
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-copy') === 'phone' ? CFG.phoneDisplay : CFG.email;
      var done = function () { var o = b.textContent; b.textContent = 'Copied'; setTimeout(function () { b.textContent = o; }, 1500); };
      if (navigator.clipboard) navigator.clipboard.writeText(v).then(done, function () {});
    });
  });

  /* Predictor */
  var range = $('pct');
  if (range) {
    var out = $('pct-out'), count = $('count'), vt = $('v-title'), vb = $('v-body'), numIn = $('pct-num');
    var mini = $('matches'), full = $('full-results');
    var min = +range.min, max = +range.max, shown = 0, raf, lastKey = '';
    var tween = function (to) {
      cancelAnimationFrame(raf);
      if (reduce) { shown = to; count.textContent = to; return; }
      var from = shown, t0 = performance.now();
      (function step(t) { var k = Math.min(1, (t - t0) / 350); shown = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))); count.textContent = shown; if (k < 1) raf = requestAnimationFrame(step); })(t0);
    };
    var tagFor = function (d) { return d >= 2 ? ['Safe', 'safe'] : d >= 0 ? ['Good chance', 'good'] : ['Reach', 'reach']; };
    var matchEl = function (name, sub, tag, cls) {
      var m = el('div', 'match'), l = el('span');
      l.appendChild(el('b', null, name)); l.appendChild(el('span', 's', sub));
      m.appendChild(l); m.appendChild(el('span', 'tag ' + cls, tag)); return m;
    };
    var update = function (fromNum) {
      var n = parseFloat(range.value);
      range.style.setProperty('--fill', ((n - min) / (max - min) * 100) + '%');
      out.firstChild.nodeValue = (n % 1 ? n.toFixed(1) : String(n));
      if (numIn && !fromNum) numIn.value = n;
      var list = CUT.filter(function (c) { return n - c[1] >= -2; }).sort(function (a, b) { return b[1] - a[1]; });
      if (list.length >= 3) {
        tween(list.length);
        vt.textContent = 'B-schools within reach';
        vb.textContent = n < 70 ? ' + many more via MAT, CMAT and state exams.' : ' Based on previous-year CAT cutoffs.';
      } else {
        tween(list.length);
        vt.textContent = list.length ? 'Within reach on CAT' : 'Different route, still a win';
        vb.textContent = ' Partner colleges also admit through MAT, CMAT and their own process.';
      }
      if (mini) {
        var items = list.length >= 3
          ? list.slice(0, 3).map(function (c) { var t = tagFor(n - c[1]); return [c[0], 'Cutoff ~' + c[1] + ' %ile', t[0], t[1]]; })
          : ROUTES.slice(0, 3).map(function (r) { return [r[0], r[1], 'Open', 'safe']; });
        var key = items.map(function (i) { return i[0] + i[2]; }).join('|');
        if (key !== lastKey) {
          lastKey = key; mini.textContent = '';
          items.forEach(function (it) { mini.appendChild(matchEl(it[0], it[1], it[2], it[3])); });
          var lk = el('div', 'locked'); lk.innerHTML = LOCK;
          lk.appendChild(document.createTextNode(list.length > 3 ? (list.length - 3) + ' more on your free shortlist' : 'Full list on your free shortlist'));
          mini.appendChild(lk);
        }
      }
      if (full) {
        full.textContent = '';
        var groups = [['Safe', 'safe', 'Your percentile is 2+ above the cutoff'], ['Good chance', 'good', 'You are at or just above the cutoff'], ['Reach', 'reach', 'Within 2 percentile of the cutoff']];
        groups.forEach(function (g) {
          var rows = list.filter(function (c) { return tagFor(n - c[1])[1] === g[1]; });
          var sec = el('section', 'stack');
          var h = el('div', 'row-head'); h.appendChild(el('h3', 'h3', g[0] + ' (' + rows.length + ')')); h.appendChild(el('span', 'small', g[2]));
          sec.appendChild(h);
          var box = el('div', 'grid-2');
          if (!rows.length) box.appendChild(el('p', 'small', 'None in this band for ' + n + ' %ile.'));
          rows.forEach(function (c) { box.appendChild(matchEl(c[0], 'Indicative cutoff ' + c[1] + ' %ile', g[0], g[1])); });
          sec.appendChild(box); full.appendChild(sec);
        });
        var sec2 = el('section', 'stack');
        var h2 = el('div', 'row-head'); h2.appendChild(el('h3', 'h3', 'Also open to you: MAT, CMAT & own-test routes')); h2.appendChild(el('span', 'small', 'Partner colleges that do not rely on CAT alone'));
        sec2.appendChild(h2);
        var box2 = el('div', 'grid-2');
        ROUTES.forEach(function (r) { box2.appendChild(matchEl(r[0], r[1], 'Open', 'info')); });
        sec2.appendChild(box2); full.appendChild(sec2);
      }
    };
    range.addEventListener('input', function () { update(false); });
    if (numIn) numIn.addEventListener('input', function () {
      var v = parseFloat(numIn.value);
      if (!isNaN(v)) { range.value = Math.min(max, Math.max(min, v)); update(true); }
    });
    update(false);
  }

  /* Partner city tabs (home) */
  var seg = $('seg'), cards = $('cards');
  if (seg && cards && !cards.hasAttribute('data-finder')) {
    var ini = function (n) { var w = n.replace(/[^A-Za-z ]/g, ' ').split(' ').filter(Boolean); return ((w[0] || 'C')[0] + ((w[1] || '')[0] || '')).toUpperCase(); };
    var city = function (name) {
      Array.prototype.forEach.call(seg.children, function (b) { b.setAttribute('aria-selected', b.textContent === name ? 'true' : 'false'); });
      cards.textContent = '';
      (FEAT[name] || []).forEach(function (c) {
        var card = el('article', 'card'), inn = el('div', 'card-in'), top = el('div', 'top'), t = el('div', 'tt');
        top.appendChild(el('span', 'mono', ini(c[0])));
        var h3 = el('h3');
        if (c[7]) { var hl = el('a', null, c[0]); hl.href = '/mba-colleges/' + c[7]; hl.style.textDecoration = 'none'; h3.appendChild(hl); } else h3.textContent = c[0];
        t.appendChild(h3); t.appendChild(el('span', 'where', c[1] + ' · ' + c[2]));
        top.appendChild(t); inn.appendChild(top);
        var dl = el('dl');
        [['Fees', c[4]], ['Avg pkg', c[5]], ['Highest', c[6]]].forEach(function (p) { var d = el('div'); d.appendChild(el('dt', null, p[0])); d.appendChild(el('dd', null, p[1])); dl.appendChild(d); });
        inn.appendChild(dl);
        var f = el('div', 'foot'); f.appendChild(el('span', 'ex', c[3]));
        var go = el('a', 'go');
        if (c[7]) { go.href = '/mba-colleges/' + c[7]; go.setAttribute('aria-label', 'View full details for ' + c[0]); }
        else { go.href = wa('Hi Guru Mantra, I want to check my chances at ' + c[0] + '.'); go.setAttribute('aria-label', 'Check my chances at ' + c[0] + ' on WhatsApp'); }
        go.innerHTML = ARROW;
        f.appendChild(go); inn.appendChild(f); card.appendChild(inn); cards.appendChild(card);
      });
    };
    Object.keys(FEAT).forEach(function (n) { var b = el('button', null, n); b.type = 'button'; b.setAttribute('role', 'tab'); b.addEventListener('click', function () { city(n); }); seg.appendChild(b); });
    city(Object.keys(FEAT)[0]);
  }

  /* MBA / PGDM switch */
  var swBtns = document.querySelectorAll('[data-sw]');
  if (swBtns.length) {
    var sw = function (k) {
      swBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-sw') === k ? 'true' : 'false'); });
      document.querySelectorAll('[data-sw-panel]').forEach(function (p) { p.hidden = p.getAttribute('data-sw-panel') !== k; });
    };
    swBtns.forEach(function (b) { b.addEventListener('click', function () { sw(b.getAttribute('data-sw')); }); });
    sw(swBtns[0].getAttribute('data-sw'));
  }

  /* Ticker loop */
  document.querySelectorAll('[data-ticker]').forEach(function (track) {
    track.innerHTML += track.innerHTML;
    Array.prototype.slice.call(track.children, track.children.length / 2).forEach(function (s) { s.setAttribute('aria-hidden', 'true'); });
  });

  /* Count-up (final numbers are already in the HTML) */
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; io.unobserve(e.target);
        var node = e.target, to = +node.getAttribute('data-to'), t0 = performance.now();
        (function step(t) { var k = Math.min(1, (t - t0) / 1200); node.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString('en-IN'); if (k < 1) requestAnimationFrame(step); })(t0);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('.countup').forEach(function (n) { io.observe(n); });
  }

  /* Lead forms */
  document.querySelectorAll('form[data-lead]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var get = function (n) { var f = form.querySelector('[name="' + n + '"]'); return f ? f.value.trim() : ''; };
      var data = { name: get('name'), phone: get('phone'), email: get('email'), exam: get('exam'), percentile: get('percentile'), interest: get('interest'), city: get('city'), message: get('message'), page: document.title, time: new Date().toISOString() };
      var emailOk = !data.email || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email);
      var ok = data.name.length > 1 && data.phone.replace(/\D/g, '').length >= 10 && emailOk;
      var err = form.querySelector('.err'); if (err) err.hidden = ok;
      if (!ok) return;
      if (CFG.formEndpoint) {
        var sameSite = CFG.formEndpoint.charAt(0) === '/';
        try { fetch(CFG.formEndpoint, { method: 'POST', mode: sameSite ? 'same-origin' : 'no-cors', keepalive: true, headers: { 'Content-Type': sameSite ? 'application/json' : 'text/plain;charset=utf-8' }, body: JSON.stringify(data) }).catch(function () {}); } catch (x) {}
      }
      var msg = 'Hi Guru Mantra, I want free MBA/PGDM counselling.\nName: ' + data.name + '\nPhone: ' + data.phone + (data.email ? '\nEmail: ' + data.email : '') +
        (data.exam ? '\nExam: ' + data.exam : '') + (data.percentile ? '\nPercentile: ' + data.percentile : '') +
        (data.interest ? '\nInterested in: ' + data.interest : '') + (data.city ? '\nCity: ' + data.city : '') +
        (data.message ? '\nMessage: ' + data.message : '');
      var done = $(form.getAttribute('data-done'));
      if (done) { var link = done.querySelector('[data-wa-done]'); if (link) link.href = wa(msg); form.hidden = true; done.hidden = false; }
    });
  });
})();
