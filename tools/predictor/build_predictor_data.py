"""Builds public/site/data/predictor.json for the CAT college predictor.

Inputs (all already in the repo):
  public/site/js/data.js        -> window.GM_CUT  (college, general cutoff, slug, city)
  public/site/data/colleges.json -> index of 3,844 MBA/PGDM colleges
  public/site/data/details/*.json -> per-college tables (category-wise and sectional CAT cutoffs)

Run from the repo root:  python3 tools/predictor/build_predictor_data.py
"""
import json, re, os, statistics

ROOT = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'site')
P = lambda *a: os.path.join(ROOT, *a)

src = open(P('js', 'data.js'), encoding='utf-8').read()
CUT = json.loads(re.search(r'window\.GM_CUT\s*=\s*(\[.*?\]);', src, re.S).group(1))
# IIMs missing from the curated list: upper end of the expected general-category call percentile
# (cracku.in "Which IIM can you get at 80-99 percentile", checked Oct 2026). IIM Guwahati is new: 90 is our estimate.
EXTRA = [['IIM Nagpur', 94, 'iim-nagpur', 'Nagpur'], ['IIM Visakhapatnam', 92, 'iim-visakhapatnam', 'Visakhapatnam'],
         ['IIM Amritsar', 92, 'iim-amritsar', 'Amritsar'], ['IIM Bodh Gaya', 92, 'iim-bodh-gaya', 'Bodh Gaya'],
         ['IIM Jammu', 92, 'iim-jammu', 'Jammu'], ['IIM Sambalpur', 92, 'iim-sambalpur', 'Sambalpur'],
         ['IIM Sirmaur', 92, 'iim-sirmaur', 'Sirmaur'], ['IIM Guwahati', 90, 'iim-guwahati', 'Guwahati']]
have = {c[2] for c in CUT}
CUT += [e for e in EXTRA if e[2] not in have]
CUT.sort(key=lambda c: -c[1])
COL = json.load(open(P('data', 'colleges.json'), encoding='utf-8'))
by_u = {o['u']: o for o in COL}
city_state = {}
for o in COL:
    if o.get('c') and o.get('s'):
        city_state.setdefault(o['c'], o['s'])

# Curated names that the dataset spells differently
ALIAS = {
    'DoMS IIT Kanpur': 'department-of-management-sciences-iit-kanpur',
    'VGSoM IIT Kharagpur': 'iit-kharagpur',
    'DoMS IIT Roorkee': 'iit-roorkee',
    'NIT Rourkela SoM': 'nit-rourkela',
    'DoMS NIT Trichy': 'dms-nit-trichy-tiruchirappalli',
    'DMS NIT Durgapur': 'department-of-management-studies-nit-durgapur',
    'IILM University': 'iilm-university-greater-noida',
    'NL Dalmia Mumbai': 'n-l-dalmia-institute-of-management-studies-and-research-mumbai',
    'SIES GST Navi Mumbai': 'siessbs-navi-mumbai',
    'SJMSoM IIT Bombay': 'sjmsom-powai',
    'ISME Bengaluru': 'isme',
}
# City for well-known schools that are not in the dataset
CITY = {
    'JBIMS Mumbai': 'Mumbai', 'IIM Bangalore': 'Bangalore', 'ISB PGP-YL': 'Hyderabad', 'IIM Kozhikode': 'Kozhikode',
    'SJMSoM IIT Bombay': 'Mumbai', 'TISS': 'Mumbai', 'DFBE Delhi University': 'Delhi', 'FORE School of Management': 'New Delhi',
    'SDA Bocconi Asia Center': 'Mumbai', 'Jio Institute': 'Navi Mumbai', 'Deakin University GIFT City': 'Gandhinagar',
    'Great Lakes': 'Chennai', "Queen's University Belfast GIFT City": 'Gandhinagar', 'SP Jain Global': 'Mumbai',
    'BIMTECH Greater Noida': 'Greater Noida', 'D. Y. Patil Vidyapeeth': 'Pune', 'MIT-WPU Pune': 'Pune', 'XISS Ranchi': 'Ranchi',
    'SDMIMD Mysore': 'Mysore', 'IMI Bhubaneswar/Kolkata': 'Bhubaneswar', 'HSSS School of Business Jaipur': 'Jaipur',
    'Asian Business School Noida': 'Noida', 'ISBN Pune': 'Pune', 'IIEBM Indus Business School': 'Pune', 'Doon Business School': 'Dehradun',
}
STATE_FIX = {'Bangalore': 'Karnataka', 'Hyderabad': 'Telangana', 'Gandhinagar': 'Gujarat', 'Greater Noida': 'Uttar Pradesh',
             'Navi Mumbai': 'Maharashtra', 'Mysore': 'Karnataka', 'Dehradun': 'Uttarakhand', 'Andheri': 'Maharashtra'}

details_cache = {}
def details(i):
    k = i // 100
    if k not in details_cache:
        details_cache[k] = json.load(open(P('data', 'details', f'{k}.json'), encoding='utf-8'))
    return details_cache[k][i % 100]

def num(x):
    m = re.findall(r'\d+(?:\.\d+)?', str(x or ''))
    if not m:
        return None
    v = max(float(t) for t in m)
    return v if 0 < v <= 100 else None

CATS = {'general': 'GEN', 'gen': 'GEN', 'ews': 'EWS', 'obc': 'OBC', 'nc-obc': 'OBC', 'ncobc': 'OBC', 'obc-ncl': 'OBC', 'sc': 'SC', 'st': 'ST',
        'pwd': 'PWD', 'pwd/da': 'PWD', 'da': 'PWD', 'pwbd': 'PWD', 'dap': 'PWD'}
def cat_key(s):
    s = re.sub(r'\s*\(.*?\)', '', str(s)).strip().lower().replace(' ', '')
    return CATS.get(s) or CATS.get(s.split('/')[0])

def parse(d):
    """Return (category_trend, sectional_min, female_overall) from a college's cutoff tables."""
    cats, sec, trend = {}, {}, []
    for t in d.get('cutoff', []):
        title, head, rows = t['t'], t['h'], t['r']
        if 'CAT' not in title and not any('CAT' in ' '.join(r) for r in rows):
            continue
        hl = [h.lower() for h in head]
        if head and hl[0].startswith('category') and any(re.fullmatch(r'\d{4}', h) for h in head):
            years = [h for h in head[1:] if re.fullmatch(r'\d{4}', h)]
            for r in rows:
                k = cat_key(r[0])
                if not k:
                    continue
                vals = [num(v) for v in r[1:1 + len(years)]]
                if vals and vals[0]:
                    cats.setdefault(k, vals[0])
                if k == 'GEN' and not trend:
                    trend = [[int(y), v] for y, v in zip(years, vals) if v]
        elif head and hl[0].startswith('category') and any('varc' in h for h in hl):
            iv = next(i for i, h in enumerate(hl) if 'varc' in h)
            idl = next((i for i, h in enumerate(hl) if 'dilr' in h or 'lrdi' in h), None)
            iq = next((i for i, h in enumerate(hl) if h in ('qa', 'quant') or 'qa' == h[:2]), None)
            io = next((i for i, h in enumerate(hl) if 'overall' in h), None)
            for r in rows:
                k = cat_key(r[0])
                if not k or k in sec or idl is None or iq is None:
                    continue
                s = [num(r[iv]) if iv < len(r) else None, num(r[idl]) if idl < len(r) else None, num(r[iq]) if iq < len(r) else None]
                o = num(r[io]) if io is not None and io < len(r) else None
                if all(x is not None for x in s):
                    sec[k] = s + [o]
    return cats, sec, trend

GOV_RE = re.compile(r'\b(IIM|IIT|NIT|IIFT|FMS|JBIMS|DFS|TISS|DFBE|Delhi University|Govt|Government)\b|Department of', re.I)

# Pass 1: collect official category ratios from IIM-style minimum tables (to estimate where a college publishes nothing)
ratios = {k: [] for k in ['EWS', 'OBC', 'SC', 'ST', 'PWD']}
rows_out = []
for name, gen, slug, city in CUT:
    slug = slug or ALIAS.get(name, '')
    o = by_u.get(slug)
    cats, sec, trend = parse(details(o['i'])) if o else ({}, {}, [])
    if 'GEN' in sec and sec['GEN'][3]:
        g = sec['GEN'][3]
        for k in ratios:
            if k in sec and sec[k][3]:
                ratios[k].append(sec[k][3] / g)
    rows_out.append((name, gen, slug, city, o, cats, sec, trend))

RATIO = {k: round(statistics.median(v), 3) if v else None for k, v in ratios.items()}
RATIO = {'EWS': RATIO['EWS'] or 0.9, 'OBC': RATIO['OBC'] or 0.85, 'SC': RATIO['SC'] or 0.7, 'ST': RATIO['ST'] or 0.6, 'PWD': RATIO['PWD'] or 0.6}
print('category ratios (median of IIM minimums):', RATIO, {k: len(v) for k, v in ratios.items()})

out_cut = []
seen_slugs = set()
for name, gen, slug, city, o, cats, sec, trend in rows_out:
    if slug and slug in seen_slugs:
        continue  # the curated (first) entry wins over a dataset duplicate
    if slug:
        seen_slugs.add(slug)
    city = city or (o or {}).get('c') or CITY.get(name, '')
    state = (o or {}).get('s') or STATE_FIX.get(city) or city_state.get(city, '')
    own = (o or {}).get('o')
    gov = own == 'Government' or (own != 'Private' and bool(GOV_RE.search(name)))
    row = {'n': name, 'g': gen}
    if slug and o: row['u'] = slug
    if city: row['c'] = city
    if state: row['s'] = state
    if o:
        if o.get('o'): row['o'] = o['o'][0]
        if o.get('f'): row['f'] = o['f'][1]
        if o.get('a'): row['a'] = o['a']
        if o.get('nirf'): row['r'] = o['nirf']
        if o.get('pt'): row['pt'] = 1
        if o.get('p'): row['p'] = o['p']
    elif gov:
        row['o'] = 'G'
    # Category cutoffs: published > IIM-style minimum ratio > estimate (public schools relax, private usually don't)
    k = {}
    # A public school whose 'category-wise' table shows one number for every category is not real data
    if gov and cats and len({v for c, v in cats.items() if c != 'PWD'}) <= 1:
        cats = {}
    src = 'p' if cats else ''
    for c in ['EWS', 'OBC', 'SC', 'ST', 'PWD']:
        if c in cats and cats.get('GEN'):
            v = gen * cats[c] / cats['GEN']
        elif 'GEN' in sec and c in sec and sec['GEN'][3] and sec[c][3]:
            # minimum-eligibility ratios understate how far effective cutoffs relax, so blend with the typical ratio
            v = gen * (sec[c][3] / sec['GEN'][3] + RATIO[c]) / 2; src = src or 'm'
        elif gov:
            v = gen * RATIO[c]; src = src or 'e'
        else:
            v = gen
        k[c] = round(min(v, gen), 1)
    if any(k[c] < gen - 0.05 for c in k):
        row['k'] = [k['EWS'], k['OBC'], k['SC'], k['ST'], k['PWD']]
        row['ks'] = src or 'e'
    if 'GEN' in sec:
        row['sec'] = {c: v[:3] for c, v in sec.items()}
    if len(trend) >= 2 and abs(sorted(trend)[-1][1] - gen) <= 1.5:
        row['tr'] = sorted(trend)[-4:]
    out_cut.append(row)

cut_slugs = {r.get('u') for r in out_cut}
OPEN_EX = {'CAT', 'MAT', 'CMAT', 'XAT', 'ATMA', 'NMAT', 'SNAP', 'GMAT'}
open_rows = []
for o in COL:
    if o['u'] in cut_slugs:
        continue
    ex = [e for e in o['e'] if e in OPEN_EX]
    if not any(e in ('CAT', 'MAT', 'CMAT') for e in ex):
        continue
    r = [o['n'], o['u'], o.get('c', ''), o.get('s', ''), (o.get('o') or ' ')[0].strip(), (o.get('f') or [0, 0])[1], o.get('a') or 0, '/'.join(ex), 1 if o.get('pt') else 0]
    open_rows.append(r)
# partners first, then colleges with more data, then by package
open_rows.sort(key=lambda r: (-r[8], -(bool(r[5]) + bool(r[6])), -r[6], r[0]))

# CAT 2024/25-style overall score (out of 198) for general category; rough mid-range points added below 70 %ile
CONV = [[99.99, 132.8], [99.95, 118.4], [99.9, 112.5], [99.5, 94.4], [99, 85.9], [98, 77], [97, 72.5], [95, 65.5], [90, 53.8],
        [85, 46.3], [80, 40.9], [75, 36.1], [70, 31.4], [60, 24], [50, 18], [40, 13], [30, 9], [20, 5], [10, 2]]
SEC_CONV = {'v': [[99, 42.8], [95, 32.5], [90, 26.2], [85, 22.1], [80, 19.2], [75, 17], [70, 14.3], [60, 10.5], [50, 8], [40, 6], [30, 4], [20, 2]],
            'd': [[99, 29.7], [95, 21.5], [90, 17.3], [85, 13.9], [80, 11.6], [75, 10.5], [70, 8.3], [60, 6], [50, 4.5], [40, 3], [30, 2], [20, 1]],
            'q': [[99, 27.1], [95, 19], [90, 14.7], [85, 12.6], [80, 10.4], [75, 9.4], [70, 7.4], [60, 5.5], [50, 4], [40, 3], [30, 2], [20, 1]]}

data = {'cut': out_cut, 'open': open_rows, 'conv': CONV, 'sconv': SEC_CONV, 'ratio': RATIO}
json.dump(data, open(P('data', 'predictor.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print('cutoff colleges', len(out_cut), 'linked', sum(1 for r in out_cut if 'u' in r), 'with category', sum(1 for r in out_cut if 'k' in r),
      'published', sum(1 for r in out_cut if r.get('ks') == 'p'), 'sectional', sum(1 for r in out_cut if 'sec' in r), 'trend', sum(1 for r in out_cut if 'tr' in r))
print('open colleges', len(open_rows), 'KB', os.path.getsize(P('data', 'predictor.json')) // 1024)
