/* College Finder: all MBA & PGDM colleges, filters, and a full detail panel per college. */
(function () {
  var cards = document.getElementById('cards');
  if (!cards || !cards.hasAttribute('data-finder')) return;
  var GM = window.GM, el = GM.el;
  var BASE = (document.querySelector('meta[name="gm-data"]') || {}).content || 'data/';
  var EXAMS = ['CAT','XAT','NMAT','SNAP','MAT','CMAT','ATMA','GMAT','MAH-CET','TANCET','KMAT','Karnataka PGCET','AP ICET','TS ICET','OJEE'];
  var $ = function (id) { return document.getElementById(id); };
  var q = $('f-q'), st = $('f-state'), ex = $('f-exam'), fee = $('f-fee'), sort = $('f-sort');
  var countEl = $('f-count'), more = $('f-more'), empty = $('f-empty'), progBtns = document.querySelectorAll('[data-prog]'), partnerBtn = $('f-partner');
  var data = null, list = [], limit = 24, prog = '', partner = false, chunkCache = {};

  EXAMS.forEach(function (x) { var o = el('option', null, x); o.value = x; ex.appendChild(o); });
  var params = new URLSearchParams(location.search);

  function fmtFee(f) {
    if (!f) return 'On request';
    var one = function (v) { return v < 1 ? Math.round(v * 100) + 'K' : (Math.round(v * 10) / 10) + 'L'; };
    return '₹' + one(f[0]) + (f[1] !== f[0] ? '–' + one(f[1]) : '');
  }
  function ini(n) { var w = n.replace(/[^A-Za-z ]/g, ' ').split(' ').filter(Boolean); return ((w[0] || 'C')[0] + ((w[1] || '')[0] || '')).toUpperCase(); }

  function apply() {
    if (!data) return;
    var text = q.value.trim().toLowerCase(), s = st.value, e = ex.value, maxFee = fee.value ? parseFloat(fee.value) : null;
    list = data.filter(function (o) {
      if (s && o.s !== s) return false;
      if (e && o.e.indexOf(e) < 0) return false;
      if (prog && o.p.indexOf(prog) < 0) return false;
      if (partner && !o.pt) return false;
      if (maxFee !== null && !(o.f && o.f[0] <= maxFee)) return false;
      if (text && (o.n + ' ' + o.c + ' ' + o.s).toLowerCase().indexOf(text) < 0) return false;
      return true;
    });
    if (sort.value === 'pkg') list.sort(function (a, b) { return (b.a || 0) - (a.a || 0); });
    else if (sort.value === 'fee') list.sort(function (a, b) { return (a.f ? a.f[0] : 999) - (b.f ? b.f[0] : 999); });
    else if (sort.value === 'name') list.sort(function (a, b) { return a.n.localeCompare(b.n); });
    else list.sort(function (a, b) { return a.i - b.i; });
    limit = 24; render();
  }

  function render() {
    cards.textContent = '';
    countEl.textContent = list.length.toLocaleString('en-IN') + (list.length === 1 ? ' college found' : ' colleges found');
    empty.hidden = list.length > 0;
    list.slice(0, limit).forEach(function (o, i) {
      var card = el('article', 'card'), inn = el('div', 'card-in'), top = el('div', 'top'), t = el('div', 'tt');
      top.appendChild(el('span', 'mono', ini(o.n)));
      t.appendChild(el('h3', null, o.n)); t.appendChild(el('span', 'where', [o.c, o.s].filter(Boolean).join(', ')));
      top.appendChild(t); inn.appendChild(top);
      var badges = el('div', 'badges');
      badges.appendChild(el('span', 'tag info', o.p.replace('/', ' / ')));
      if (o.pt) badges.appendChild(el('span', 'tag reach', 'Guru Mantra partner'));
      if (o.r) badges.appendChild(el('span', 'tag good', '★ ' + o.r));
      inn.appendChild(badges);
      var dl = el('dl');
      [['Fees', fmtFee(o.f)], ['Avg pkg', o.a ? '₹' + o.a + 'L' : '—'], ['Highest', o.h ? '₹' + o.h + 'L' : '—']].forEach(function (p) { var d = el('div'); d.appendChild(el('dt', null, p[0])); d.appendChild(el('dd', null, p[1])); dl.appendChild(d); });
      inn.appendChild(dl);
      var f = el('div', 'foot');
      f.appendChild(el('span', 'ex', o.e.length ? o.e.slice(0, 4).join(' · ') + (o.e.length > 4 ? ' +' + (o.e.length - 4) : '') : 'Direct / institute admission'));
      var go = el('button', 'go'); go.type = 'button'; go.setAttribute('aria-label', 'View full details for ' + o.n); go.innerHTML = GM.ARROW;
      go.addEventListener('click', function () { openDrawer(o, go); });
      f.appendChild(go); inn.appendChild(f); card.appendChild(inn);
      card.style.animationDelay = (i % 6) * 0.04 + 's';
      cards.appendChild(card);
    });
    var left = list.length - Math.min(limit, list.length);
    more.hidden = left <= 0;
    more.textContent = 'Show more (' + left.toLocaleString('en-IN') + ' left)';
  }

  /* ---------- Detail panel ---------- */
  var drawer = $('drawer'), body = $('d-body'), lastFocus = null;

  function table(t) {
    var wrap = el('div', 'stack'); wrap.style.gap = '8px';
    if (t.t) wrap.appendChild(el('b', 'tbl-title', t.t));
    var box = el('div', 'table-box'), tb = el('table', 'mini');
    var width = Math.max(t.h.length, t.r.reduce(function (m, r) { return Math.max(m, r.length); }, 0));
    if (t.h.length && t.h.some(Boolean)) {
      var thead = el('thead'), tr = el('tr');
      for (var i = 0; i < width; i++) { var th = el('th', null, t.h[i] || ''); th.scope = 'col'; tr.appendChild(th); }
      thead.appendChild(tr); tb.appendChild(thead);
    }
    var tbody = el('tbody');
    t.r.forEach(function (r) {
      var tr = el('tr');
      for (var i = 0; i < width; i++) tr.appendChild(el('td', null, r[i] || ''));
      tbody.appendChild(tr);
    });
    tb.appendChild(tbody); box.appendChild(tb); wrap.appendChild(box);
    return wrap;
  }
  function section(title, tables, open) {
    if (!tables || !tables.length) return null;
    var d = el('details', 'sec'); if (open) d.open = true;
    var s = el('summary'); s.appendChild(el('span', null, title)); s.appendChild(el('span', 'pm', '+')); s.lastChild.setAttribute('aria-hidden', 'true');
    d.appendChild(s);
    var inner = el('div', 'sec-in'); tables.forEach(function (t) { inner.appendChild(table(t)); });
    d.appendChild(inner);
    return d;
  }
  function fillDetails(o, d) {
    body.textContent = '';
    if (!d) { body.appendChild(el('p', 'small', 'Detailed information is not available for this college yet. Ask us on WhatsApp and we will share it.')); return; }
    if (d.about) body.appendChild(el('p', 'about-line', d.about));
    var contact = el('div', 'contact-mini');
    var line = function (k, v) { var s = el('span'); s.appendChild(el('b', null, k + ': ')); s.appendChild(document.createTextNode(v)); contact.appendChild(s); };
    if (d.address) line('Address', d.address + (o.c ? ', ' + o.c : '') + (o.s ? ', ' + o.s : ''));
    if (d.phone) line('Phone', d.phone);
    if (d.email) line('Email', d.email);
    if (contact.childNodes.length) body.appendChild(contact);
    [['Fees & specialisations', d.fees, true], ['Placements', d.placement], ['Cutoffs', d.cutoff], ['Rankings', d.ranking], ['Admission process & dates', d.admission], ['Key facts', d.facts], ['Scholarships', d.scholarship]]
      .forEach(function (s) { var n = section(s[0], s[1], s[2]); if (n) body.appendChild(n); });
  }
  function loadDetails(o) {
    var k = Math.floor(o.i / 100);
    if (chunkCache[k]) return Promise.resolve(chunkCache[k][o.i % 100]);
    return fetch(BASE + 'details/' + k + '.json').then(function (r) { return r.json(); }).then(function (arr) { chunkCache[k] = arr; return arr[o.i % 100]; });
  }
  function openDrawer(o, from) {
    lastFocus = from || null;
    $('d-name').textContent = o.n;
    $('d-where').textContent = [o.c, o.s].filter(Boolean).join(', ');
    var facts = $('d-facts'); facts.textContent = '';
    [['Programme', o.p.replace('/', ' / ')], ['Total fees', fmtFee(o.f)], ['Average package', o.a ? '₹' + o.a + ' LPA' : 'Ask us'], ['Highest package', o.h ? '₹' + o.h + ' LPA' : 'Ask us'], ['Type', o.o || '—'], ['Established', o.es || '—'], ['Student rating', o.r ? o.r + ' / 5' + (o.rv ? ' (' + o.rv + ' reviews)' : '') : '—'], ['Scholarships', o.sc ? 'Available' : 'Ask us']]
      .forEach(function (p) { var d = el('div'); d.appendChild(el('dt', null, p[0])); d.appendChild(el('dd', null, p[1])); facts.appendChild(d); });
    $('d-exams').textContent = o.e.length ? o.e.join(' · ') : 'Direct / institute admission';
    var ap = $('d-approvals'); ap.textContent = o.ap || ''; ap.parentElement.hidden = !o.ap;
    var site = $('d-site'); site.hidden = !o.w; if (o.w) { site.href = o.w; site.textContent = 'Official website: ' + o.w.replace(/^https?:\/\//, '').replace(/\/$/, ''); }
    $('d-partner').hidden = !o.pt;
    $('d-page').href = '/mba-colleges/' + o.u;
    $('d-wa').href = GM.wa('Hi Guru Mantra, I want to check my chances at ' + o.n + (o.c ? ', ' + o.c : '') + '.');
    body.textContent = ''; body.appendChild(el('p', 'small', 'Loading full details…'));
    loadDetails(o).then(function (d) { if ($('d-name').textContent === o.n) fillDetails(o, d); }).catch(function () { body.textContent = ''; body.appendChild(el('p', 'small', 'Could not load details. Please try again.')); });
    drawer.hidden = false; document.body.style.overflow = 'hidden';
    try { history.replaceState(null, '', '#college-' + o.i); } catch (x) {}
    $('d-close').focus();
  }
  function closeDrawer() {
    drawer.hidden = true; document.body.style.overflow = '';
    try { history.replaceState(null, '', location.pathname + location.search); } catch (x) {}
    if (lastFocus) lastFocus.focus();
  }
  $('d-close').addEventListener('click', closeDrawer);
  drawer.addEventListener('click', function (e) { if (e.target === drawer) closeDrawer(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !drawer.hidden) closeDrawer(); });
  $('d-share').addEventListener('click', function () {
    var b = this, url = location.href;
    var done = function () { var o = b.textContent; b.textContent = 'Link copied'; setTimeout(function () { b.textContent = o; }, 1600); };
    if (navigator.share) { navigator.share({ title: $('d-name').textContent, url: url }).catch(function () {}); return; }
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () {});
  });

  /* ---------- Wire filters ---------- */
  [q, st, ex, fee, sort].forEach(function (c) { c.addEventListener(c === q ? 'input' : 'change', apply); });
  progBtns.forEach(function (b) { b.addEventListener('click', function () { prog = b.getAttribute('data-prog'); progBtns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); apply(); }); });
  partnerBtn.addEventListener('click', function () { partner = !partner; partnerBtn.setAttribute('aria-pressed', partner ? 'true' : 'false'); apply(); });
  $('f-reset').addEventListener('click', function () { q.value = ''; st.value = ''; ex.value = ''; fee.value = ''; sort.value = 'rec'; prog = ''; partner = false; partnerBtn.setAttribute('aria-pressed', 'false'); progBtns.forEach(function (x, i) { x.setAttribute('aria-pressed', i === 0 ? 'true' : 'false'); }); apply(); });
  more.addEventListener('click', function () { limit += 24; render(); });

  countEl.textContent = 'Loading 3,844 colleges…';
  fetch(BASE + 'colleges.json').then(function (r) { return r.json(); }).then(function (d) {
    data = d;
    var states = {}; d.forEach(function (o) { if (o.s) states[o.s] = 1; });
    Object.keys(states).sort().forEach(function (s) { var o = el('option', null, s); o.value = s; st.appendChild(o); });
    if (params.get('q')) q.value = params.get('q');
    if (params.get('state')) st.value = params.get('state');
    if (params.get('exam')) ex.value = params.get('exam');
    if (params.get('partner') === '1') { partner = true; partnerBtn.setAttribute('aria-pressed', 'true'); }
    apply();
    var fromHash = function () { var m = /^#college-(\d+)$/.exec(location.hash); if (m && data[+m[1]]) openDrawer(data[+m[1]], null); };
    fromHash();
    window.addEventListener('hashchange', fromHash);
  }).catch(function () { countEl.textContent = 'Could not load the college list. Please refresh the page.'; });
})();
