/* Guru Mantra CAT college predictor (full page).
   Data: /site/data/predictor.json, built by tools/predictor/build_predictor_data.py */
(function () {
  var form = document.getElementById('cp-form');
  if (!form) return;
  function $(id) { return document.getElementById(id); }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  var fmt = function (x) { return Number(x || 0).toLocaleString('en-IN'); };
  var CFG = window.GM_CONFIG || {};
  var CATS = ['EWS', 'OBC', 'SC', 'ST', 'PWD'];
  var CAT_LABEL = { GEN: 'General', EWS: 'EWS', OBC: 'NC-OBC', SC: 'SC', ST: 'ST', PWD: 'PwD' };
  var BAND = { safe: ['Safe', 'safe'], good: ['Good chance', 'good'], reach: ['Reach', 'reach'], dream: ['Dream', 'info'] };
  var PAGE = 30;
  var D = null, mode = 'pct', band = 'all', shown = PAGE, openShown = 12, last = { rows: [], open: [] };

  var range = $('cp-pct'), out = $('cp-pct-out'), num = $('cp-pct-num'), score = $('cp-score');
  var inputs = ['cp-varc', 'cp-dilr', 'cp-qa', 'cp-cat', 'cp-gender', 'cp-10', 'cp-12', 'cp-ug', 'cp-stream', 'cp-wx', 'cp-state', 'cp-fee', 'cp-own', 'cp-prog', 'cp-sort'];

  /* ---------- score → percentile (piecewise linear on recent CAT trends) ---------- */
  function interp(table, x, fromScore) {
    // table rows: [percentile, score], descending
    var a = fromScore ? 1 : 0, b = fromScore ? 0 : 1;
    if (x >= table[0][a]) return table[0][b];
    for (var i = 1; i < table.length; i++) {
      if (x >= table[i][a]) {
        var hi = table[i - 1], lo = table[i], k = (x - lo[a]) / (hi[a] - lo[a]);
        return lo[b] + k * (hi[b] - lo[b]);
      }
    }
    var l = table[table.length - 1];
    return Math.max(0, l[b] * (x / l[a]));
  }

  function readNum(id) { var v = parseFloat($(id).value); return isNaN(v) ? null : v; }

  function percentile() {
    if (mode === 'score') {
      var s = readNum('cp-score');
      if (s == null) return null;
      var p = Math.round(interp(D.conv, s, true) * 100) / 100;
      $('cp-score-note').textContent = 'Estimated percentile: ~' + p + ' %ile (General category trend; your scorecard is final).';
      return Math.min(99.99, Math.max(0, p));
    }
    return parseFloat(num.value || range.value);
  }

  /* ---------- profile adjustment, only for composite-score schools (cutoff 85+) ---------- */
  function profile() {
    var adj = 0, why = [];
    var marks = ['cp-10', 'cp-12', 'cp-ug'].map(readNum).filter(function (v) { return v != null; });
    if (marks.length) {
      var avg = marks.reduce(function (a, b) { return a + b; }, 0) / marks.length;
      if (avg >= 90) { adj += 1; why.push('strong academics'); }
      else if (avg >= 80) { adj += 0.5; why.push('good academics'); }
      else if (avg < 50) { adj -= 1.5; why.push('low academics'); }
      else if (avg < 60) { adj -= 1; why.push('below-60 academics'); }
    }
    var wx = +$('cp-wx').value;
    if (wx >= 12 && wx <= 36) { adj += 0.5; why.push('work experience'); }
    if ($('cp-gender').value !== 'm') { adj += 0.5; why.push('gender diversity'); }
    var st = $('cp-stream').value;
    if (st && st !== 'eng') { adj += 0.5; why.push('academic diversity'); }
    adj = Math.max(-2, Math.min(2, adj));
    return { adj: adj, why: why };
  }

  function cutoffFor(r, cat) {
    if (cat === 'GEN' || !r.k) return r.g;
    return r.k[CATS.indexOf(cat)];
  }

  function sectionalFail(r, cat) {
    if (!r.sec) return null;
    var need = r.sec[cat] || r.sec.GEN;
    if (!need) return null;
    var mine = [readNum('cp-varc'), readNum('cp-dilr'), readNum('cp-qa')], names = ['VARC', 'DILR', 'QA'], low = [];
    mine.forEach(function (v, i) { if (v != null && need[i] && v < need[i]) low.push(names[i] + ' ' + need[i]); });
    return low.length ? low : null;
  }

  function bandFor(d) { return d >= 2 ? 'safe' : d >= 0 ? 'good' : d >= -3 ? 'reach' : d >= -6 ? 'dream' : null; }

  function filtersPass(state, own, fee, prog, q, r) {
    if (state && r.s !== state) return false;
    if (own && r.o !== own) return false;
    if (fee && (!r.f || r.f > fee)) return false;
    if (prog && r.p && r.p.indexOf(prog) < 0) return false;
    if (q && (r.n + ' ' + (r.c || '') + ' ' + (r.s || '')).toLowerCase().indexOf(q) < 0) return false;
    return true;
  }

  /* ---------- render ---------- */
  function money(x) { return x ? '₹' + (x >= 10 ? Math.round(x) : x.toFixed(1).replace(/\.0$/, '')) + ' L' : '–'; }

  function row(r) {
    var a = el(r.u ? 'a' : 'div', 'cp-row');
    if (r.u) a.href = '/mba-colleges/' + r.u;
    var main = el('div', 'cp-main');
    var t = el('b', null, r.n);
    main.appendChild(t);
    var meta = [r.c, r.s && r.s !== r.c ? r.s : '', r.o === 'G' ? 'Government' : r.o === 'P' ? 'Private' : '', r.r ? 'NIRF #' + r.r : ''].filter(Boolean).join(' · ');
    main.appendChild(el('span', 'small', meta));
    if (r.pt) { var p = el('span', 'cp-pt', 'Guru Mantra partner'); main.appendChild(p); }
    a.appendChild(main);

    var cut = el('div', 'cp-cell');
    cut.appendChild(el('span', 'cp-k', r._cat === 'GEN' ? 'Cutoff' : 'Cutoff (' + CAT_LABEL[r._cat] + ')'));
    cut.appendChild(el('b', null, (Math.round(r._cut * 10) / 10) + ' %ile'));
    if (r._est) cut.appendChild(el('span', 'small', 'estimated'));
    else if (r.tr) {
      var flat = r.tr.every(function (x) { return x[1] === r.tr[0][1]; });
      cut.appendChild(el('span', 'small', flat ? 'Same since ' + r.tr[0][0] : r.tr.map(function (x) { return "'" + String(x[0]).slice(2) + ' ' + x[1]; }).join(' · ')));
    }
    a.appendChild(cut);

    var fee = el('div', 'cp-cell');
    fee.appendChild(el('span', 'cp-k', 'Fees'));
    fee.appendChild(el('b', null, money(r.f)));
    a.appendChild(fee);
    var pk = el('div', 'cp-cell');
    pk.appendChild(el('span', 'cp-k', 'Avg package'));
    pk.appendChild(el('b', null, r.a ? money(r.a) + 'PA' : '–'));
    a.appendChild(pk);

    var ch = el('div', 'cp-chance');
    var b = BAND[r._band];
    ch.appendChild(el('span', 'tag ' + b[1], b[0]));
    var gap = r._diff;
    ch.appendChild(el('span', 'small', (gap >= 0 ? '+' : '') + gap.toFixed(1) + ' vs cutoff'));
    if (r._sec) ch.appendChild(el('span', 'cp-warn', 'Below sectional: ' + r._sec.join(', ')));
    a.appendChild(ch);
    return a;
  }

  function openRow(r) {
    var a = el('a', 'cp-row cp-row-open');
    a.href = '/mba-colleges/' + r[1];
    var main = el('div', 'cp-main');
    main.appendChild(el('b', null, r[0]));
    main.appendChild(el('span', 'small', [r[2], r[3] && r[3] !== r[2] ? r[3] : '', r[4] === 'G' ? 'Government' : r[4] === 'P' ? 'Private' : ''].filter(Boolean).join(' · ')));
    if (r[8]) main.appendChild(el('span', 'cp-pt', 'Guru Mantra partner'));
    a.appendChild(main);
    var ex = el('div', 'cp-cell'); ex.appendChild(el('span', 'cp-k', 'Accepts')); ex.appendChild(el('b', null, r[7].replace(/\//g, ', '))); a.appendChild(ex);
    var fee = el('div', 'cp-cell'); fee.appendChild(el('span', 'cp-k', 'Fees')); fee.appendChild(el('b', null, money(r[5]))); a.appendChild(fee);
    var pk = el('div', 'cp-cell'); pk.appendChild(el('span', 'cp-k', 'Avg package')); pk.appendChild(el('b', null, r[6] ? money(r[6]) + 'PA' : '–')); a.appendChild(pk);
    var ch = el('div', 'cp-chance'); ch.appendChild(el('span', 'tag safe', 'Open')); a.appendChild(ch);
    return a;
  }

  function update() {
    if (!D) return;
    var p = percentile();
    var cat = $('cp-cat').value;
    var prof = profile();
    var state = $('cp-state').value, own = $('cp-own').value, fee = +$('cp-fee').value || 0, prog = $('cp-prog').value;
    var q = $('cp-q').value.trim().toLowerCase(), sort = $('cp-sort').value;

    var rows = [], counts = { safe: 0, good: 0, reach: 0, dream: 0 };
    if (p != null) {
      D.cut.forEach(function (r) {
        var c = cutoffFor(r, cat);
        var eff = p + (r.g >= 85 ? prof.adj : 0);
        var d = Math.round((eff - c) * 100) / 100;
        var b = bandFor(d);
        if (!b) return;
        if (!filtersPass(state, own, fee, prog, q, r)) return;
        var sec = sectionalFail(r, cat);
        if (sec && (b === 'safe' || b === 'good')) b = 'reach';
        var x = Object.assign({}, r);
        x._cut = c; x._diff = d; x._band = b; x._sec = sec; x._cat = r.k ? cat : 'GEN';
        x._est = cat !== 'GEN' && r.k && r.ks !== 'p';
        counts[b]++;
        rows.push(x);
      });
    }
    var sorters = {
      cut: function (a, b) { return b._cut - a._cut; },
      chance: function (a, b) { return b._diff - a._diff; },
      fee: function (a, b) { return (a.f || 999) - (b.f || 999); },
      pkg: function (a, b) { return (b.a || 0) - (a.a || 0); }
    };
    rows.sort(sorters[sort] || sorters.cut);
    var within = counts.safe + counts.good + counts.reach;
    $('cp-total').textContent = fmt(within);
    $('cp-total-t').textContent = p == null ? 'Enter your CAT score' : within === 1 ? 'college within reach' : 'colleges within reach';
    $('cp-total-s').textContent = p == null ? '' : ' at ' + p + ' %ile · ' + CAT_LABEL[cat] + (counts.dream ? ' · ' + fmt(counts.dream) + ' dream picks' : '') + ' · plus ' + fmt(openCount()) + ' open colleges below';
    $('cp-c-all').textContent = fmt(within);
    ['safe', 'good', 'reach', 'dream'].forEach(function (k) { $('cp-c-' + k).textContent = fmt(counts[k]); });

    var note = $('cp-profile-note');
    if (prof.adj) { note.hidden = false; note.textContent = 'Profile adjustment for top B-schools (cutoff 85+): ' + (prof.adj > 0 ? '+' : '') + prof.adj + ' (' + prof.why.join(', ') + ').'; }
    else note.hidden = true;

    last.rows = rows;
    last.p = p; last.cat = cat;
    drawList();
    drawOpen();
    syncUrl(p);
  }

  function openFiltered() {
    var state = $('cp-state').value, own = $('cp-own').value, fee = +$('cp-fee').value || 0;
    var q = $('cp-q').value.trim().toLowerCase();
    return D.open.filter(function (r) {
      return filtersPass(state, own, fee, '', q, { n: r[0], c: r[2], s: r[3], o: r[4], f: r[5], p: '' });
    });
  }
  function openCount() { return openFiltered().length; }

  function drawList() {
    var list = $('cp-list');
    list.textContent = '';
    var rows = band === 'all' ? last.rows.filter(function (r) { return r._band !== 'dream'; }) : last.rows.filter(function (r) { return r._band === band; });
    if (!rows.length) {
      var e = el('div', 'empty');
      e.appendChild(el('b', null, last.p == null ? 'Enter your percentile or score to begin.' : band === 'all' && last.rows.length ? 'Nothing within reach yet for these filters. See the Dream tab.' : 'No colleges with a published cutoff match these filters.'));
      e.appendChild(el('p', 'small', 'Try clearing a filter, or see the colleges open to you below.'));
      list.appendChild(e);
    }
    rows.slice(0, shown).forEach(function (r) { list.appendChild(row(r)); });
    var more = $('cp-more');
    more.hidden = rows.length <= shown;
    more.textContent = 'Show more (' + fmt(rows.length - shown) + ' left)';
  }

  function drawOpen() {
    var rows = openFiltered();
    $('cp-open-c').textContent = '(' + fmt(rows.length) + ')';
    var list = $('cp-open-list');
    list.textContent = '';
    rows.slice(0, openShown).forEach(function (r) { list.appendChild(openRow(r)); });
    var more = $('cp-open-more');
    more.hidden = rows.length <= openShown;
    more.textContent = 'Show more (' + fmt(rows.length - openShown) + ' left)';
    last.open = rows;
  }

  /* ---------- share / download / prefill ---------- */
  function syncUrl(p) {
    var u = new URLSearchParams();
    if (p != null && mode === 'pct') u.set('p', p);
    if (mode === 'score' && score.value) u.set('score', score.value);
    var cat = $('cp-cat').value; if (cat !== 'GEN') u.set('cat', cat);
    ['state', 'fee', 'own', 'prog'].forEach(function (k) { var v = $('cp-' + k).value; if (v) u.set(k, v); });
    var s = u.toString();
    try { history.replaceState(null, '', location.pathname + (s ? '?' + s : '') + location.hash); } catch (x) {}
    var top = last.rows.filter(function (r) { return r._band !== 'dream'; }).slice(0, 8).map(function (r, i) { return (i + 1) + '. ' + r.n + ' (' + BAND[r._band][0] + ')'; });
    var msg = 'Hi Guru Mantra, my CAT percentile is ' + (p == null ? '?' : p) + ' (' + CAT_LABEL[cat] + '). The predictor shows:\n' + top.join('\n') + '\nPlease help me with my MBA/PGDM shortlist.';
    $('cp-wa').href = 'https://wa.me/' + (CFG.whatsapp || '') + '?text=' + encodeURIComponent(msg);
    var ls = document.getElementById('l-score'); if (ls && p != null) ls.value = p;
  }

  $('cp-csv').addEventListener('click', function () {
    var esc = function (v) { v = v == null ? '' : String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    var lines = [['College', 'City', 'State', 'Cutoff for you (%ile)', 'Your chance', 'Gap', 'Fees (₹ L)', 'Avg package (₹ LPA)', 'Link']];
    last.rows.forEach(function (r) { lines.push([r.n, r.c, r.s, Math.round(r._cut * 10) / 10, BAND[r._band][0], r._diff.toFixed(1), r.f || '', r.a || '', r.u ? 'https://www.gurumantra.info/mba-colleges/' + r.u : '']); });
    last.open.forEach(function (r) { lines.push([r[0], r[2], r[3], '', 'Open (' + r[7] + ')', '', r[5] || '', r[6] || '', 'https://www.gurumantra.info/mba-colleges/' + r[1]]); });
    var csv = '﻿' + lines.map(function (l) { return l.map(esc).join(','); }).join('\r\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = 'guru-mantra-cat-' + (last.p == null ? 'list' : last.p) + '-colleges.csv';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  });

  /* ---------- inputs ---------- */
  function setPct(v, fromNum) {
    v = Math.min(100, Math.max(0, v));
    range.value = v;
    range.style.setProperty('--fill', ((Math.max(+range.min, v) - range.min) / (range.max - range.min) * 100) + '%');
    out.firstChild.nodeValue = (v % 1 ? (Math.round(v * 100) / 100) : String(v));
    if (!fromNum) num.value = v;
  }
  range.addEventListener('input', function () { setPct(+range.value); reset(); update(); });
  num.addEventListener('input', function () { var v = parseFloat(num.value); if (!isNaN(v)) { setPct(v, true); reset(); update(); } });
  score.addEventListener('input', function () { reset(); update(); });
  inputs.forEach(function (id) { $(id).addEventListener(id.match(/cat|gender|stream|wx|state|fee|own|prog|sort/) ? 'change' : 'input', function () { reset(); update(); }); });
  $('cp-q').addEventListener('input', function () { reset(); update(); });
  form.addEventListener('submit', function (e) { e.preventDefault(); update(); $('cp-results').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  function reset() { shown = PAGE; openShown = 12; }

  Array.prototype.forEach.call(document.querySelectorAll('[data-mode]'), function (b) {
    b.addEventListener('click', function () {
      mode = b.getAttribute('data-mode');
      document.querySelectorAll('[data-mode]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      document.querySelectorAll('[data-mode-panel]').forEach(function (p) { p.hidden = p.getAttribute('data-mode-panel') !== mode; });
      if (mode === 'score') score.focus();
      update();
    });
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-band]'), function (b) {
    b.addEventListener('click', function () {
      band = b.getAttribute('data-band'); shown = PAGE;
      document.querySelectorAll('[data-band]').forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
      drawList();
    });
  });
  $('cp-more').addEventListener('click', function () { shown += PAGE * 2; drawList(); });
  $('cp-open-more').addEventListener('click', function () { openShown += 36; drawOpen(); });

  /* ---------- prefill from URL (homepage slider passes ?p=) ---------- */
  var qs = new URLSearchParams(location.search);
  if (qs.get('p') && !isNaN(parseFloat(qs.get('p')))) setPct(parseFloat(qs.get('p')));
  else setPct(+range.value);

  var dataUrl = (document.querySelector('meta[name="gm-data"]') || {}).content || '/site/data/';
  fetch(dataUrl + 'predictor.json').then(function (r) { return r.json(); }).then(function (d) {
    D = d;
    $('cp-n-cut').textContent = fmt(d.cut.length);
    $('cp-n-open').textContent = fmt(d.open.length);
    var states = {};
    d.cut.forEach(function (r) { if (r.s) states[r.s] = 1; });
    d.open.forEach(function (r) { if (r[3]) states[r[3]] = 1; });
    var sel = $('cp-state');
    Object.keys(states).sort().forEach(function (s) { var o = el('option', null, s); o.value = s; sel.appendChild(o); });
    ['cat', 'state', 'fee', 'own', 'prog'].forEach(function (k) {
      var v = qs.get(k), s = $('cp-' + k);
      if (v && Array.prototype.some.call(s.options, function (o) { return o.value === v; })) s.value = v;
    });
    if (qs.get('score')) { score.value = qs.get('score'); document.querySelector('[data-mode="score"]').click(); }
    update();
  }).catch(function () {
    $('cp-list').textContent = 'Could not load college data. Please refresh the page.';
  });
})();
