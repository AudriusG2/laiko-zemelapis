/* allmaps.js — maps georeferenced with Allmaps (https://allmaps.org) at the user's location.

   AllmapsMeta: pure functions that read a title, year, institution, source link and rights from
   an Allmaps map record plus its IIIF manifest (or the NLS record page). Written and tested by a
   research agent over 917 maps at 8 places; fixes from the independent re-test are applied.
   AllmapsFinder (below): asks api.allmaps.org which maps cover a point, describes them, checks
   that the allmaps.xyz tiles are not blank, and returns entries shaped like regional.js.
   The georeference data is CC0; each scan keeps its library's licence ('open' only when the
   rights are confirmed as public domain or an open or non-commercial CC licence). */
(function (root) {
  'use strict';
  const MIN_YEAR = 1400;
  const MAX_YEAR = new Date().getFullYear();

  // ---------- IIIF v2/v3 value helpers ----------
  function texts(v, langs) {
    langs = langs || ['lt', 'en', 'none', '@none'];
    if (v == null) return [];
    if (typeof v === 'string') return [v];
    if (typeof v === 'number') return [String(v)];
    if (Array.isArray(v)) {
      // v2 array of {"@language","@value"}: prefer requested langs, else all
      const tagged = v.filter(x => x && typeof x === 'object' && '@value' in x);
      if (tagged.length === v.length && tagged.length) {
        for (const l of langs) { const hit = tagged.filter(x => x['@language'] === l); if (hit.length) return hit.map(x => String(x['@value'])); }
        return tagged.map(x => String(x['@value']));
      }
      return v.flatMap(x => texts(x, langs));
    }
    if (typeof v === 'object') {
      if ('@value' in v) return [String(v['@value'])];
      // v3 language map
      for (const l of langs) if (v[l]) return texts(v[l], langs);
      return Object.keys(v).flatMap(k => texts(v[k], langs));
    }
    return [];
  }
  function clean(s) {
    return String(s)
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
      .replace(/[\u2010-\u2015\u2212]/g, '-')
      .replace(/\s+/g, ' ').trim();
  }
  const first = (v) => { const t = texts(v).map(clean).filter(Boolean); return t.length ? t[0] : null; };
  const idOf = (x) => (typeof x === 'string' ? x : x && (x.id || x['@id'])) || null;
  const arr = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);

  // manifest-level + matching-canvas-level metadata pairs, v2 and v3
  function findCanvas(man, canvasId) {
    const canvases = man.items || (man.sequences && man.sequences[0] && man.sequences[0].canvases) || [];
    if (!canvases.length) return null;
    if (canvasId) { const c = canvases.find(c => idOf(c) === canvasId); if (c) return c; }
    return canvases.length === 1 ? canvases[0] : null; // only trust canvas metadata if unambiguous
  }
  function metadataPairs(man, canvas) {
    const out = [];
    const add = (md, level) => arr(md).forEach(e => {
      if (!e || typeof e !== 'object') return;
      const label = clean(texts(e.label).join(' '));
      const values = texts(e.value).map(clean).filter(Boolean);
      if (label && values.length) out.push({ label, values, level });
    });
    if (canvas) add(canvas.metadata, 'canvas'); // canvas first: David Rumsey keeps metadata on the canvas
    add(man && man.metadata, 'manifest');
    return out;
  }

  // ---------- YEAR ----------
  const APPROX_RE = /\bc(?=1[4-9]\d\d)|(^|[\s\[(])(c\.|ca\.?|circa|approx\.?|omstreeks|ongeveer|ok\.|około|um|vers|environ|apie|n?ie przed|not before|not after|after|before|na|voor)(?=[\s\d\]])|\?|~|\bs\.d\./i;
  const Y = '(1[4-9]\\d\\d|20[0-2]\\d)'; // 1400-2029
  const inRange = (y) => y >= MIN_YEAR && y <= MAX_YEAR;
  const mk = (start, end, approx, how) => ({
    start, end, approx: !!approx || end !== start, how,
    year: end - start > 10 ? Math.round((start + end) / 2) : start // wide ranges -> midpoint
  });
  const ROMAN = { I: 1, V: 5, X: 10, L: 50, C: 100 };
  const roman = (r) => { let n = 0; for (let i = 0; i < r.length; i++) { const a = ROMAN[r[i]], b = ROMAN[r[i + 1]] || 0; n += a < b ? -a : a; } return n; };

  // prefer: 'first' for date fields, 'last' for titles/imprints (e.g. "Harvey, 1797-1893, The map ..., 1806")
  function parseYear(raw, prefer) {
    if (raw == null) return null;
    const s = clean(raw);
    if (!s) return null;
    const approx = APPROX_RE.test(s);
    let m;
    // i.e. correction: "1588 [i.e. 1589]"
    if ((m = s.match(new RegExp('i\\.\\s?e\\.?,?\\s*' + Y)))) return mk(+m[1], +m[1], approx, 'i.e.');
    // ISO date / datetime (navDate "1945-01-01T00:00:00Z", "1850-03-01"); "1850-55" / "1910-11" are ranges, not ISO months
    if ((m = s.match(/^(\d{4})-\d{2}-\d{2}([T ]|$)/)) && inRange(+m[1])) return mk(+m[1], +m[1], false, 'iso');
    // lists "1600 - 1699; 1660 - 1669; 1661" -> narrowest
    if (/;/.test(s)) {
      const parts = s.split(';').map(p => parseYear(p, prefer)).filter(Boolean);
      if (parts.length) return parts.sort((a, b) => (a.end - a.start) - (b.end - b.start) || (prefer === 'last' ? -1 : 1))[0];
    }
    const cands = [];
    let re;
    // ranges: 1850-1855, 1850-55, 1850/1855, 1850 to 1860, between 1850 and 1860
    re = new RegExp('(?<![\\d:.,/])(?<!\\d\\s{0,3}:\\s{0,3})' + Y + '\\s*(?:-|/|to|tot|bis|and|und|en|until|a|do)\\s*(\\d{4}|\\d{2})(?![\\d])', 'gi');
    while ((m = re.exec(s))) {
      const a = +m[1]; let b = +m[2]; if (m[2].length === 2) b = Math.floor(a / 100) * 100 + b;
      if (inRange(a) && b >= a && b <= MAX_YEAR) cands.push({ i: m.index, r: mk(a, b, approx, 'range') });
      else if (inRange(a)) cands.push({ i: m.index, r: mk(a, a, approx, 'year') }); // "1850-12" (year-month) -> 1850
    }
    // single years (not part of scale "1:1250", "316,800", ids)
    // (a colon before the number, even with spaces, means a scale such as "1 : 1500")
    re = new RegExp('(?<![\\d:.,/])(?<!\\d\\s{0,3}:\\s{0,3})' + Y + '(?![\\d]|\\s*[-/]\\s*\\d|s\\b)', 'g');
    while ((m = re.exec(s))) {
      if (cands.some(c => m.index >= c.i && m.index < c.i + 12)) continue;
      cands.push({ i: m.index, r: mk(+m[1], +m[1], approx, 'year') });
    }
    // decade "1760s"
    re = /(?<![\d:.,])(1[4-9]\d)0s\b/g;
    while ((m = re.exec(s))) cands.push({ i: m.index, r: mk(+m[1] * 10, +m[1] * 10 + 9, true, 'decade') });
    // decade "185-", "185?", "185x"
    re = /(?<![\d:.,])(1[4-9]\d)[-?xu_](?![\d])/gi;
    while ((m = re.exec(s))) cands.push({ i: m.index, r: mk(+m[1] * 10, +m[1] * 10 + 9, true, 'decade') });
    // century "18--", "18..", "18xx"
    re = /(?<![\d:.,])(1[4-9])(--|\.\.|xx|uu)/gi;
    while ((m = re.exec(s))) cands.push({ i: m.index, r: mk(+m[1] * 100, +m[1] * 100 + 99, true, 'century') });
    // "18th century", "18e eeuw", "18. Jh", "XVIII a.", "XVIIIe siècle", "XVIII w."
    re = /(?<!\d)(1[4-9]|20)\s*(?:th|st|nd|rd|e|de|\.)?\s*(?:century|cent\.|eeuw|jh\.?|jahrhundert|siècle|amž|a\.)/gi;
    while ((m = re.exec(s))) { const c = +m[1]; cands.push({ i: m.index, r: mk((c - 1) * 100, (c - 1) * 100 + 99, true, 'century') }); }
    re = /\b([XV]?X{0,2}V?I{0,3})\s*(?:e\s*)?(?:siècle|century|a\.|amž|w\.|wiek|eeuw|jh)/g;
    while ((m = re.exec(s))) { if (!m[1]) continue; const c = roman(m[1]); if (c >= 15 && c <= 21) cands.push({ i: m.index, r: mk((c - 1) * 100, (c - 1) * 100 + 99, true, 'century') }); }
    if (!cands.length) return null;
    cands.sort((a, b) => a.i - b.i);
    const pick = prefer === 'last' ? cands[cands.length - 1] : cands[0];
    return pick.r;
  }

  // metadata label vocab (lower-case, compared after clean)
  const DATE_LABEL = /^(date|dates|datum|datering|dating|year|jaar|jahr|année|data|rok|dato|år|metai|laikas|pub date|publication date|publication year|date of publication|date of map|date of creation|date of original|date created|created|creation date|date issued|issued|published\/created date|jaar van uitgave|year of publication|erscheinungsjahr|erscheinungsdatum|entstehungszeit|datierung|date zeit.*|md_when|time_period_of_creation|date_descriptive|year_of_edition|temporal|date \(original\)|date of production|production date|vervaardigingsjaar|periode)$/;
  const IMPRINT_LABEL = /^(published|publisher|publication|publication details|imprint|uitgave|publisert|impressum|published erschienen.*|map publisher|origin|place and date|publication info|publication information|original version note|original version)$/;
  const DENY_LABEL = /(access|record|generated|added|updated|modified|captured|digiti[sz]|digital|metadata|harvest|upload|scan|catalog|born|died|life|author|creator|auteur|drukker|engraver|printer|contributor|subject_time|subject|event|rights)/;

  const VALUE_DENY = /digiti[sz]|scanned|scan date|captured|date added|online since|record created/i;
  const LOW_LABEL = /^(date issued|issued)$/; // Leiden etc. use it for the digital edition
  function extractYear(ctx) {
    // ctx: { manifest, canvas, pairs, labels:[strings], nls }
    const T = []; // tiers, highest first
    const man = ctx.manifest || {};
    const pairs = ctx.pairs || [];
    const own = pairs.filter(p => p.level !== 'parent'), par = pairs.filter(p => p.level === 'parent');
    const isDate = (p) => { const L = p.label.toLowerCase(); return DATE_LABEL.test(L) && !DENY_LABEL.test(L); };
    const isImp = (p) => { const L = p.label.toLowerCase(); return IMPRINT_LABEL.test(L) && !DENY_LABEL.test(L); };
    const push = (src, text, prefer, maxYear) => T.push({ src, text, prefer, maxYear });
    for (const nd of [ctx.canvas && ctx.canvas.navDate, man.navDate]) if (nd) push('navDate', nd, 'first');
    own.filter(p => isDate(p) && !LOW_LABEL.test(p.label.toLowerCase())).forEach(p => p.values.forEach(v => push('md:' + p.label, v, 'first')));
    own.filter(isImp).forEach(p => p.values.forEach(v => push('md:' + p.label, v, 'last')));
    if (ctx.nls && ctx.nls.date) push('nls:date', ctx.nls.date, 'first');
    own.filter(p => isDate(p) && LOW_LABEL.test(p.label.toLowerCase())).forEach(p => p.values.forEach(v => push('md:' + p.label, v, 'first')));
    // parent (atlas) record: its date is often the digital edition -> ignore implausibly recent values
    par.filter(p => isDate(p) || isImp(p)).forEach(p => p.values.forEach(v => push('parent:' + p.label, v, isImp(p) ? 'last' : 'first', 1990)));
    for (const t of ctx.labels || []) push('label', t, 'last');
    const found = [];
    for (const t of T) {
      if (VALUE_DENY.test(t.text)) continue;
      const r = parseYear(t.text, t.prefer);
      if (!r || (t.maxYear && r.start >= t.maxYear)) continue;
      found.push(Object.assign(r, { src: t.src, text: clean(t.text).slice(0, 120) }));
    }
    if (!found.length) return null;
    // a recent year (>= 1990) usually means the digital edition; if any other source gives an older year, trust that
    if (found[0].start >= 1990) { const older = found.find(r => r.start < 1990); if (older) return older; }
    return found[0];
  }
  // year that the map DEPICTS when the title says so ("Town of Boston, 1775 (Facsimile)", "Course of cholera in Boston in 1849")
  function depictedYear(title, y) {
    if (!title || !y) return null;
    const t = parseYear(title, 'last');
    return t && t.how === 'year' && t.year < y.start - 10 ? t.year : null;
  }

  // Lithuanian display label for the app's `when` field
  function whenLt(y) {
    if (!y) return 'data nežinoma';
    if (y.how === 'century') { const c = Math.floor(y.start / 100) + 1; const R = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI']; return R[c] + ' a.'; }
    if (y.end !== y.start) return y.start + '–' + y.end + ' m.';
    return (y.approx ? 'apie ' : '') + y.start + ' m.';
  }

  // ---------- TITLE ----------
  const GENERIC_TITLE = /^\s*(\[?\s*(kaart|map|maps|carte|karte|mapa|image|afbeelding|scan|page|plate|sheet|blad|untitled|unknown|onbekend|zonder titel|s\.t\.|sans titre|carta)\s*\]?\s*[\d.]*|p\.?\s*\d+|pl\.?\s*\d+|image \d+|\d+|[\w\-]+\.(jpe?g|tiff?|jp2|png)|[0-9a-f]{16,}|iiif\/\S+|my manifest|MIN\d+\w*|\d{8}_\d+|\(seq\. ?\d+\)|created by .*|generated from .*)\s*$/i;
  const SHELFMARK = /(département|shelfmark|signatur|cote\b)|^[A-Z]{2,5}[\s_-]?[\dA-Z.\-]+$/;
  const TITLE_LABEL = /^(short title|title|titel|tittel|titre|titolo|tytuł|pavadinimas|title \(main\)|full title|alternativ tittel)$/;
  function cleanTitle(t, max) {
    max = max || 80;
    let s = clean(t);
    s = s.replace(/^(\[\d+[a-z]?\]\s*)+/i, '');       // leading plate numbers "[88][88] Regnum..."
    s = s.replace(/^\d{1,3}\s+-\s+/, '').replace(/\s+COLLBN\b.*$/, ''); // Leiden "01 - ... COLLBN Port 144 N 176"
    s = s.split(' / ')[0];                      // drop statement of responsibility
    s = s.replace(/\s*\[(cartographic material|map|kaart|carte|karte)\]\s*/gi, ' ');
    s = s.replace(/\s+(Harvard Map Collection digital maps|KAART:).*$/i, '');
    s = s.replace(/^[\[\s]+|[\]\s]+$/g, (x) => (/\[/.test(s) && /\]/.test(s) ? '' : x));
    s = s.replace(/[\s:;,./]+$/, '').trim();
    if (s.length > max) s = s.slice(0, max).replace(/\s+\S*$/, '') + '…';
    return s;
  }
  function extractTitle(ctx) {
    const cands = [];
    for (const p of ctx.pairs || []) if (/^short title$/i.test(p.label)) cands.push({ src: 'md:Short Title', t: p.values[0] });
    if (ctx.canvasLabel) cands.push({ src: 'canvas.label', t: ctx.canvasLabel });
    if (ctx.manifestLabel && !ctx.aggregate) cands.push({ src: 'manifest.label', t: ctx.manifestLabel });
    for (const p of ctx.pairs || []) if (p.level !== 'parent' && TITLE_LABEL.test(p.label.toLowerCase())) cands.push({ src: 'md:' + p.label, t: p.values[0] });
    if (ctx.summary) cands.push({ src: 'summary', t: ctx.summary });
    if (ctx.nls && ctx.nls.title) cands.push({ src: 'nls:title', t: ctx.nls.title + (ctx.nls.series && /^sheet\b/i.test(ctx.nls.title) ? ' (' + ctx.nls.series + ')' : '') });
    if (ctx.parentLabel) cands.push({ src: 'parent.label', t: ctx.parentLabel });
    for (const c of cands) {
      if (!c.t) continue;
      const raw = clean(c.t);
      if (!raw || GENERIC_TITLE.test(raw) || SHELFMARK.test(raw)) continue;
      let t = cleanTitle(raw);
      // atlas sheet names like "Kowno 9", "N.11 Buurt J": add the parent (atlas) title for context
      const pubTitle = ((ctx.pairs || []).find(p => /^pub title$/i.test(p.label)) || {}).values; // David Rumsey atlas title
      const context = ctx.parentLabel || (pubTitle && pubTitle[0]);
      if (t.length < 25 && context && c.src !== 'parent.label') t = t + ' · ' + cleanTitle(context, 50);
      if (t.length >= 3) return { title: t, src: c.src };
    }
    return null;
  }

  // ---------- INSTITUTION / LINK / RIGHTS ----------
  function extractInstitution(ctx) {
    const r = ctx.map && ctx.map.resource || {};
    const p = first(arr(r.provider)[0] && arr(r.provider)[0].label); if (p) return { name: p, src: 'allmaps.provider' };
    const man = ctx.manifest || {};
    const mp = first(arr(man.provider)[0] && arr(man.provider)[0].label); if (mp) return { name: mp, src: 'manifest.provider' };
    if (ctx.orgByDomain) { const o = ctx.orgByDomain(r.id); if (o) return { name: o, src: 'allmaps.organizations' }; }
    const at = texts(man.attribution).map(clean).filter(x => x && x.length < 70 && !/http|right|copyright|licen|use|domain|©/i.test(x))[0];
    if (at) return { name: at.replace(/^Provided by\s+/i, ''), src: 'manifest.attribution' };
    const rs = man.requiredStatement; if (rs && /provider|attribution/i.test(first(rs.label) || '')) { const v = first(rs.value); if (v && v.length < 90) return { name: v.replace(/^Provided by\s+/i, ''), src: 'requiredStatement' }; }
    return null;
  }
  function extractLink(ctx) {
    const man = ctx.manifest || {}; const rid = (ctx.map && ctx.map.resource && ctx.map.resource.id) || '';
    const hp = arr(man.homepage).map(idOf).filter(Boolean)[0]; if (hp) return { url: hp, src: 'homepage' };
    const rel = arr(man.related).map(idOf).filter(Boolean)[0]; if (rel) return { url: rel, src: 'related' };
    const rend = arr(man.rendering).find(x => /html/.test(x && x.format || '') && idOf(x)); if (rend) return { url: idOf(rend), src: 'rendering' };
    let c = rid.match(/https:\/\/(cdm\d+\.contentdm\.oclc\.org)\/(?:iiif\/2\/([^:/]+):(\d+)|digital\/iiif\/([^/]+)\/(\d+))/);
    if (c) return { url: 'https://' + c[1] + '/digital/collection/' + (c[2] || c[4]) + '/id/' + (c[3] || c[5]), src: 'derived' };
    for (const p of ctx.pairs || []) if (/^(permalink|identifier|catalogue|toegangsgegevens \(url\)|local|additional information|persistent identifier|persistent url|handle|uri)$/i.test(p.label)) { const u = p.values.find(v => /^https?:\/\//.test(v)); if (u) return { url: u, src: 'md:' + p.label }; }
    const sa = arr(man.seeAlso).map(idOf).find(u => u && /ark:|\/catalog\/|\/items?\//.test(u) && !/\.(json|xml)|oai|marc|mods/i.test(u)); if (sa) return { url: sa, src: 'seeAlso' };
    let m;
    if ((m = rid.match(/davidrumsey\.com\/luna\/servlet\/iiif\/(RUMSEY~[^/]+)/))) return { url: 'https://www.davidrumsey.com/luna/servlet/detail/' + m[1], src: 'derived' };
    if ((m = rid.match(/map-view\.nls\.uk\/iiif\/2\/\d+%2F(\d+)/))) return { url: 'https://maps.nls.uk/view/' + m[1], src: 'derived' };
    const mapId = ((ctx.map && ctx.map.id) || '').split('/').pop();
    return { url: 'https://viewer.allmaps.org/?url=' + encodeURIComponent('https://annotations.allmaps.org/maps/' + mapId), src: 'allmaps-viewer' };
  }
  const OPEN_RIGHTS = /\bCC-?BY\b(?![- ]?N)|publicdomain|\/zero\/|licenses\/by(-sa)?\/|rightsstatements\.org\/vocab\/(NoC|NKC)|no known (copyright|restrictions)|public domain|free of known restrictions|domaine public|allemenning|creativecommons\.org\/publicdomain/i;
  const NC_RIGHTS = /-nc|noncommercial|non-commercial|InC|all rights reserved|conditions-dutilisation/i;
  // The public site is non-commercial and credits every scan, so CC BY-NC(-SA) is fine; ND (no derivatives) is not, since the scan is warped.
  const CC_NC = /creativecommons\.org\/licenses\/by-nc(-sa)?\/|Attribution[- ]Non-?commercial|\bCC[- ]?BY[- ]NC\b/i;
  const NO_DERIV = /-nd\b|NoDeriv|No Derivative/i;
  function extractRights(ctx) {
    const man = ctx.manifest || {};
    // Rumsey manifests carry no licence; the collection states CC BY-NC-SA 3.0 for all its images.
    const rid = (ctx.map && ctx.map.resource && ctx.map.resource.id) || '';
    if (/davidrumsey\.com\//.test(rid)) return { license: 'open', text: 'David Rumsey Map Collection, CC BY-NC-SA 3.0' };
    const vals = [].concat(texts(man.rights), texts(man.license), texts(man.attribution), man.requiredStatement ? texts(man.requiredStatement.value) : []);
    for (const p of ctx.pairs || []) if (/right|terms of use|gebruik en reproductie|licen[cs]e|copyright|rechten|beperking/i.test(p.label)) vals.push(...p.values);
    if (ctx.nls && ctx.nls.reuse) {
      // NLS partner scans such as 'CC-BY (BL). British Library permission must be sought…' are not open
      if (/permission/i.test(ctx.nls.reuse)) return { license: 'local', text: clean(ctx.nls.reuse).slice(0, 160) };
      vals.push(ctx.nls.reuse);
    }
    const joined = vals.map(clean).join(' | ');
    if (!joined) return { license: 'local', text: null };
    if (CC_NC.test(joined) && !NO_DERIV.test(joined)) return { license: 'open', text: joined.slice(0, 160) };
    if (NC_RIGHTS.test(joined) && !OPEN_RIGHTS.test(joined)) return { license: 'local', text: joined.slice(0, 160) };
    if (OPEN_RIGHTS.test(joined)) return { license: 'open', text: joined.slice(0, 160) };
    return { license: 'local', text: joined.slice(0, 160) };
  }

  // NLS HTML fallback (maps.nls.uk/view/{id}, ACAO:*)
  function parseNlsHtml(html) {
    // two layouts: "<strong>Title: </strong>X<br /><strong>Date: </strong>1941." or "<strong>Sheet 101 - Trim</strong><br />Surveyed: ca. 1836 to 1837, Printed: 1863<br/>"
    const h1 = (html.match(/<h1 id="pageTitle"[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || '';
    let title = (h1.match(/Title:\s*<\/strong>([\s\S]*?)<br/i) || [])[1];
    let date = (h1.match(/Date:\s*<\/strong>([\s\S]*?)(&nbsp;|<a|<br|$)/i) || [])[1];
    if (!title) { const m = h1.match(/<strong>([\s\S]*?)<\/strong>\s*<br\s*\/?>([\s\S]*?)<br/i); if (m) { title = m[1]; date = date || m[2]; } }
    const series = ((html.match(/<title>View map:([^<]*)<\/title>/i) || [])[1] || '').split(' - ').pop();
    const desc = (html.match(/<meta name="Description" content="([^"]*)"/i) || [])[1];
    const pub = desc && (desc.match(/published in ([^,]+)/i) || [])[1];
    const reuse = (html.match(/Re-use:\s*((?:<[^>]+>|[^<\n]){0,160})/i) || [])[1]; // 'Re-use: <a href="/copyright.html">CC-BY</a> (NLS).'
    return { title: title && clean(title), series: series && clean(series), date: (date && clean(date)) || pub || null, reuse: reuse ? clean(reuse) : null };
  }

  // ---------- one-call entry point ----------
  // map: Allmaps map object (from api.allmaps.org/maps?intersects=...)
  // manifest: parsed IIIF manifest JSON or null; nlsHtml: string or null
  function describeMap(map, manifest, opts) {
    opts = opts || {};
    const r = map.resource || {};
    const cv = arr(r.partOf).find(x => x && x.type === 'Canvas');
    const mf = cv ? arr(cv.partOf).find(x => x && x.type === 'Manifest') : arr(r.partOf).find(x => x && x.type === 'Manifest');
    const canvas = manifest ? findCanvas(manifest, cv && cv.id) : null;
    const nCanvases = manifest ? (manifest.items || (manifest.sequences && manifest.sequences[0] && manifest.sequences[0].canvases) || []).length : 0;
    const manifestLabel = first(manifest && manifest.label) || first(mf && mf.label);
    const canvasLabel = first(canvas && canvas.label) || first(cv && cv.label);
    // third-party 'bag of maps' manifests (e.g. "Alle UvA kaarten zonder metadata", DLCS named queries): many canvases, (almost) no metadata
    const aggregate = nCanvases > 3 && arr(manifest && manifest.metadata).length <= 2;
    const pairs = manifest ? metadataPairs(aggregate ? {} : manifest, canvas) : [];
    // ContentDM compound objects: child page has almost no metadata -> append parent's (GetParent API)
    const parent = opts.parentManifest || null;
    if (parent) metadataPairs(parent, null).forEach(p => pairs.push(Object.assign(p, { level: 'parent' })));
    const nls = opts.nlsHtml ? parseNlsHtml(opts.nlsHtml) : null;
    const summary = first(manifest && (manifest.summary || manifest.description));
    const ctx = { map, manifest, canvas, pairs, canvasLabel, manifestLabel, aggregate, summary, nls, orgByDomain: opts.orgByDomain,
      parentLabel: first(parent && parent.label),
      labels: [canvasLabel, aggregate ? null : manifestLabel, summary, nls && nls.title].filter(Boolean) };
    const y = extractYear(ctx);
    const t = extractTitle(ctx);
    const inst = extractInstitution(ctx);
    return {
      id: map.id, title: t && t.title, titleSrc: t && t.src,
      year: y && y.year, depictedYear: depictedYear(t && t.title, y), yearStart: y && y.start, yearEnd: y && y.end, approx: y && y.approx, yearSrc: y && y.src, yearText: y && y.text, when: whenLt(y),
      institution: inst && inst.name, institutionSrc: inst && inst.src,
      link: extractLink(ctx), rights: extractRights(ctx)
    };
  }

  const api = { texts, clean, parseYear, whenLt, extractYear, extractTitle, cleanTitle, describeMap, parseNlsHtml, metadataPairs, findCanvas };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.AllmapsMeta = api;
})(this);

// ---------------------------------------------------------------------------
// AllmapsFinder: georeferenced maps covering a point, ready for the timeline.
(function (root) {
  'use strict';
  if (typeof window === 'undefined') return;
  const M = root.AllmapsMeta;
  const API = 'https://api.allmaps.org/maps';
  const TILES = 'https://allmaps.xyz/maps';
  const CACHE = 'tm.allmaps.v4';
  const MAX_AREA = 1e11;   // m²: island-of-Ireland size or smaller (world and continent maps are left out)
  const CANDIDATES = 30;   // the most detailed maps first (the API sorts by scale)
  const DAY = 864e5;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // api.allmaps.org sends "Vary: *", so the browser cannot cache it: keep results per place ourselves.
  function cacheGet(key) {
    try {
      const c = JSON.parse(localStorage.getItem(CACHE) || '{}');
      const e = c[key];
      return e && Date.now() - e.t < 7 * DAY ? e.v : null;
    } catch { return null; }
  }
  function cacheSet(key, v) {
    try {
      const c = JSON.parse(localStorage.getItem(CACHE) || '{}');
      c[key] = { t: Date.now(), v };
      const keys = Object.keys(c).sort((a, b) => c[a].t - c[b].t);
      while (keys.length > 25) delete c[keys.shift()];
      localStorage.setItem(CACHE, JSON.stringify(c));
    } catch { /* storage full or blocked: no cache */ }
  }

  async function get(url, { text = false, ms = 12000 } = {}) {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), ms);
    try {
      const r = await fetch(url.replace(/^http:\/\//, 'https://'), {
        signal: ctl.signal, headers: { Accept: 'application/ld+json, application/json;q=0.9, */*;q=0.1' },
      });
      if (!r.ok) return null;
      return text ? await r.text() : await r.json();
    } catch { return null; } finally { clearTimeout(t); }
  }

  // David Rumsey allows 5 requests a second: space them out.
  let rumseyNext = 0;
  async function paced(url) {
    if (/davidrumsey\.com/.test(url)) {
      const wait = Math.max(0, rumseyNext - Date.now());
      rumseyNext = Date.now() + wait + 300;
      if (wait) await sleep(wait);
    }
    return get(url);
  }

  const CDM = /https:\/\/(cdm\d+\.contentdm\.oclc\.org)\/(?:iiif\/2\/([^:/]+):(\d+)|digital\/iiif\/([^/]+)\/(\d+))/;
  function manifestUrlFor(map) {
    const r = map.resource || {};
    for (const c of r.partOf || []) {
      if (c.type === 'Manifest') return String(c.id).replace(/\{\?[^}]*\}$/, '');
      for (const m of c.partOf || []) if (m.type === 'Manifest') return String(m.id).replace(/\{\?[^}]*\}$/, '');
    }
    let m;
    if ((m = String(r.id).match(/davidrumsey\.com\/luna\/servlet\/iiif\/(RUMSEY~[^/]+)/))) return `https://www.davidrumsey.com/luna/servlet/iiif/m/${m[1]}/manifest`;
    if ((m = String(r.id).match(CDM))) return `https://${m[1]}/iiif/2/${m[2] || m[4]}:${m[3] || m[5]}/manifest.json`;
    if ((m = String(r.id).match(/stacks\.stanford\.edu\/image\/iiif\/([a-z0-9]+)/))) return `https://purl.stanford.edu/${m[1]}/iiif3/manifest`;
    return null;
  }

  async function describe(map) {
    const r = map.resource || {};
    const mu = manifestUrlFor(map);
    const manifest = mu ? await paced(mu) : null;
    let parentManifest = null, nlsHtml = null, m;
    if ((m = String(r.id).match(CDM))) {
      const alias = m[2] || m[4], ptr = m[3] || m[5];
      const p = await get(`https://${m[1]}/digital/bl/dmwebservices/index.php?q=GetParent/${alias}/${ptr}/json`);
      if (p && p.parent && p.parent !== '-1') parentManifest = await get(`https://${m[1]}/iiif/2/${alias}:${p.parent}/manifest.json`);
    }
    if ((m = String(r.id).match(/map-view\.nls\.uk\/iiif\/2\/\d+%2F(\d+)/))) nlsHtml = await get(`https://maps.nls.uk/view/${m[1]}`, { text: true });
    return M.describeMap(map, manifest, { parentManifest, nlsHtml });
  }

  // Zoom at which a map of this area fills the view, roughly.
  function zoomForArea(area, lat) {
    const side = Math.sqrt(Math.max(area || 1e8, 1e4));
    const mpp = side / 1400;
    const z = Math.log2((156543.03 * Math.cos((lat * Math.PI) / 180)) / mpp);
    return Math.max(5, Math.min(17, Math.round(z)));
  }

  // allmaps.xyz answers 200 with a transparent tile when it cannot read the source scan:
  // decode one tile at the place and look for any visible pixel.
  async function tileHasImage(id, lat, lng, z) {
    const n = 2 ** z;
    const x = Math.floor(((lng + 180) / 360) * n);
    const s = Math.sin((lat * Math.PI) / 180);
    const y = Math.floor((0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * n);
    try {
      const ctl = new AbortController();
      const t = setTimeout(() => ctl.abort(), 20000);
      const res = await fetch(`${TILES}/${id}/${z}/${x}/${y}.png`, { signal: ctl.signal });
      clearTimeout(t);
      if (!res.ok) return false;
      const bmp = await createImageBitmap(await res.blob());
      const c = document.createElement('canvas');
      c.width = c.height = 32;
      const g = c.getContext('2d');
      g.drawImage(bmp, 0, 0, 32, 32);
      const a = g.getImageData(0, 0, 32, 32).data;
      for (let i = 3; i < a.length; i += 4) if (a[i] > 16) return true;
      return false;
    } catch { return false; }
  }

  const escHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const safeUrl = (u) => (/^https?:\/\//.test(u || '') ? u : null);
  // Short licence label for the credit line, e.g. 'CC BY-NC-SA 3.0'.
  function licTag(t) {
    if (!t) return '';
    let m = t.match(/creativecommons\.org\/licenses\/([a-z-]+)\/(\d\.\d)/i);
    if (m) return `CC ${m[1].toUpperCase()} ${m[2]}`;
    m = t.match(/\bCC[- ]?(BY(?:[- ](?:NC|SA|ND))*)(?:[- ](\d\.\d))?/i);
    if (m) return `CC ${m[1].toUpperCase().replace(/ /g, '-')}${m[2] ? ' ' + m[2] : ''}`;
    if (/\/zero\/|\bCC0\b/i.test(t)) return 'CC0';
    if (/public ?domain|publicdomain|vocab\/NoC|no known copyright/i.test(t)) return 'viešoji nuosavybė';
    return '';
  }

  async function build(map, lat, lng) {
    const id = String(map.id).split('/').pop();
    if (!/^[0-9a-f]{16}$/.test(id)) return null;
    const d = await describe(map);
    if (!d || !d.year) return null; // a wrong year is worse than a missing map
    const tj = await get(`${TILES}/${id}/tiles.json`);
    if (!tj || !Array.isArray(tj.bounds)) return null;
    const area = map._allmaps && map._allmaps.area;
    // A one-inch OS sheet covers ~1.5e9 m²; one spread over a region is a bad georeference.
    if (/one-inch|six-inch|25-inch|1:63,?360|1:10,?560|1:2,?500\b/i.test(d.title || '') && area > 4e9) return null;
    const zoom = zoomForArea(area, lat);
    if (!(await tileHasImage(id, lat, lng, Math.min(tj.maxzoom || 17, zoom)))) return null;
    const [W, S, E, N] = tj.bounds;
    const year = d.depictedYear || d.year;
    const when = d.depictedYear ? `${d.depictedYear} (išl. ${d.yearStart})` : d.when.replace(/ m\.$/, '');
    const title = d.title || 'Senasis žemėlapis';
    const inst = d.institution || 'Allmaps';
    const link = safeUrl(d.link && d.link.url);
    const nls = /National Library of Scotland/i.test(inst) ? ' Reproduced with the permission of the <a href="https://maps.nls.uk/">National Library of Scotland</a>.' : '';
    const lic = d.rights && d.rights.license === 'open' ? licTag(d.rights.text) : '';
    const viewer = `https://viewer.allmaps.org/?url=${encodeURIComponent(`https://annotations.allmaps.org/maps/${id}`)}`;
    return {
      id: `allmaps-${id}`, allmapsId: id, source: 'allmaps', year, when, t: title, short: title.length > 40 ? title.slice(0, 39).replace(/[\s·,;:(]+\S*$/, '') + '…' : title,
      region: inst, kind: 'xyz', url: `${TILES}/${id}/{z}/{x}/{y}.png`,
      bounds: [[S, W], [N, E]], cover: [[S, W], [N, E]],
      minZoom: Math.max(2, zoom - 5), maxZoom: tj.maxzoom || 17, zoom,
      license: d.rights && d.rights.license === 'open' ? 'open' : 'local',
      link,
      attribution: `${escHtml(title)} (${escHtml(when)}), ${link ? `<a href="${escHtml(link)}">${escHtml(inst)}</a>` : escHtml(inst)}${lic ? ` (${escHtml(lic)})` : ''}.${nls} Georeferencija: <a href="${escHtml(viewer)}">Allmaps</a> (CC0)`,
    };
  }

  // Calls onMap(entry) for each usable map as soon as it is ready; resolves with all of them.
  async function find(lat, lng, onMap) {
    const key = `${lat.toFixed(3)},${lng.toFixed(3)}`;
    const cached = cacheGet(key);
    if (cached) { cached.forEach(onMap); return cached; }
    const list = await get(`${API}?intersects=${lat},${lng}&maxArea=${MAX_AREA}&limit=200`, { ms: 20000 });
    if (!Array.isArray(list)) return [];
    // The same scan can be georeferenced twice: key on image size and file name.
    const seen = new Set();
    const cands = [];
    for (const m of list) {
      const r = m.resource || {};
      const k = `${r.width}x${r.height}:${String(r.id).split(/[/:]/).pop()}`;
      if (seen.has(k)) continue;
      seen.add(k);
      cands.push(m);
      if (cands.length >= CANDIDATES) break;
    }
    const out = [];
    let next = 0;
    const worker = async () => {
      while (next < cands.length) {
        const m = cands[next++];
        try {
          const e = await build(m, lat, lng);
          if (e) { out.push(e); onMap(e); }
        } catch { /* one bad record must not stop the others */ }
      }
    };
    await Promise.all([worker(), worker(), worker()]);
    cacheSet(key, out);
    return out;
  }

  root.AllmapsFinder = { find, zoomForArea };
})(this);
