#!/usr/bin/env node
// Generates the static site in public/ from src/:
//   src/index.html  bilingual source (data-en / data-es on translatable elements)
//   src/styles.css  inlined into every page
//   src/pages.js    copy for the category landing pages
// Output: /, /es/, the category pages (EN + ES) and sitemap.xml.
// Run: npm run generate

const fs = require('fs');
const path = require('path');

const SITE = 'https://www.venemexbakerycafe.com';
const GA_ID = 'G-QHVZN6G2NW';
const DD_URL = 'https://order.online/business/venemex-bakery-and-coffee-22060467';
const SAME_AS = [
  'https://www.instagram.com/venemexdaytona/',
  'https://www.facebook.com/profile.php?id=61570707299851',
  'https://www.google.com/maps?cid=5628664556336771667'
];
const GEO = { latitude: 29.2337079, longitude: -81.0180667 };
const LASTMOD = new Date().toISOString().slice(0, 10);

const ROOT = __dirname;
const OUT = path.join(ROOT, 'public');
const src = fs.readFileSync(path.join(ROOT, 'src/index.html'), 'utf8');
const css = minifyCss(fs.readFileSync(path.join(ROOT, 'src/styles.css'), 'utf8'));
const CATEGORIES = require('./src/pages.js');

const HOME = { en: '/', es: '/es/' };
// EN path -> ES path, for rewriting internal links on Spanish pages
const ES_PATHS = { '/': '/es/' };
for (const c of Object.values(CATEGORIES)) ES_PATHS[c.paths.en] = c.paths.es;

const HOME_META = {
  en: {
    title: 'Venezuelan Restaurant & Bakery in Daytona Beach | Venemex',
    description: 'Venezuelan & Mexican restaurant, bakery and café in Daytona Beach. Empanadas, arepas, tequeños, tacos and fresh coffee for breakfast and lunch.',
    ogLocale: 'en_US', ogAlt: 'es_US',
    twitterDescription: 'Venezuelan & Mexican restaurant, bakery and café in Daytona Beach.'
  },
  es: {
    title: 'Restaurante Venezolano y Panadería en Daytona Beach | Venemex',
    description: 'Restaurante venezolano y mexicano, panadería y café en Daytona Beach. Empanadas, arepas, tequeños, tacos y café para desayunar y almorzar.',
    ogLocale: 'es_US', ogAlt: 'en_US',
    twitterDescription: 'Restaurante venezolano y mexicano, panadería y café en Daytona Beach.'
  }
};

const T = {
  en: {
    restaurantDescription: 'Venezuelan and Mexican restaurant, bakery and café in Daytona Beach, Florida, serving breakfast and lunch: arepas, empanadas, tequeños, tacos, burritos, coffee and handcrafted desserts.',
    cuisine: ['Venezuelan', 'Mexican', 'Latin American', 'Bakery', 'Café'],
    menuName: 'Venemex Bakery & Café Menu',
    home: 'Home', menu: 'Menu',
    orderNow: 'Order Now', fullMenu: 'See the full menu',
    faqEyebrow: 'Good to Know', faqTitle: 'Frequently Asked <em>Questions</em>',
    moreEyebrow: 'Keep Exploring', moreTitle: 'More from <em>Venemex</em>',
    visit: 'Hours &amp; location'
  },
  es: {
    restaurantDescription: 'Restaurante venezolano y mexicano, panadería y café en Daytona Beach, Florida, con desayunos y almuerzos: arepas, empanadas, tequeños, tacos, burritos, café y postres artesanales.',
    cuisine: ['Venezolana', 'Mexicana', 'Latinoamericana', 'Panadería', 'Café'],
    menuName: 'Carta de Venemex Bakery & Café',
    home: 'Inicio', menu: 'Carta',
    orderNow: 'Ordenar', fullMenu: 'Ver la carta completa',
    faqEyebrow: 'Bueno Saberlo', faqTitle: 'Preguntas <em>Frecuentes</em>',
    moreEyebrow: 'Sigue Explorando', moreTitle: 'Más de <em>Venemex</em>',
    visit: 'Horario y ubicación'
  }
};

// ── HTML helpers ────────────────────────────────────────────────────────────

// Inside a tag: anything but '>' outside quotes (attribute values may contain <em>…</em>).
const ATTRS = `(?:[^>"']|"[^"]*"|'[^']*')*`;
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

// Index just past the element that opens at `start` (handles nesting of the same tag).
function elementEnd(html, start) {
  const tag = /^<([a-zA-Z0-9]+)/.exec(html.slice(start))[1].toLowerCase();
  const openEnd = start + new RegExp(`^<${tag}${ATTRS}>`, 'i').exec(html.slice(start))[0].length;
  if (VOID.has(tag)) return openEnd;
  const re = new RegExp(`<(/?)${tag}(?=[\\s>/])${ATTRS}>`, 'gi');
  re.lastIndex = openEnd;
  let depth = 1, m;
  while ((m = re.exec(html))) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) return re.lastIndex;
  }
  throw new Error(`Unclosed <${tag}> at ${start}`);
}

// Attribute values hold HTML (e.g. <em>); undo the escaping needed to put it in an attribute.
const attrToHtml = (v) => v.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const escAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const escHtml = (s) => s.replace(/&(?!(?:[a-z]+|#\d+);)/gi, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const stripTags = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const text = (s) => decode(stripTags(s));

// Put the chosen language inside every element carrying data-en/data-es and drop both attributes.
function translate(html, lang) {
  const re = new RegExp(`<([a-zA-Z0-9]+)\\b(?=${ATTRS}\\sdata-en=")${ATTRS}>`, 'g');
  let out = '', pos = 0, m;
  while ((m = re.exec(html))) {
    const open = m[0];
    const value = (open.match(new RegExp(`\\sdata-${lang}="([^"]*)"`)) || [])[1];
    if (value === undefined) throw new Error(`Missing data-${lang}: ${open.slice(0, 120)}`);
    const end = elementEnd(html, m.index);
    if (lang === 'en') {
      const inner = html.slice(m.index + open.length, end - m[1].length - 3);
      const norm = (s) => s.replace(/\s+/g, ' ').trim();
      if (norm(inner) !== norm(attrToHtml(value))) console.warn('data-en differs from content:', norm(inner).slice(0, 90), '|', norm(attrToHtml(value)).slice(0, 90));
    }
    const cleanOpen = open.replace(/\sdata-(?:en|es)="[^"]*"/g, '');
    const closeTag = `</${m[1]}>`;
    out += html.slice(pos, m.index) + cleanOpen + attrToHtml(value) + closeTag;
    pos = end;
    re.lastIndex = end;
  }
  return out + html.slice(pos);
}

// Remove every element flagged data-discontinued (kept in the source so it can come back).
function dropDiscontinued(html) {
  let i;
  while ((i = html.search(/<[a-zA-Z0-9]+\b[^>]*\sdata-discontinued[\s>]/)) !== -1) {
    const lineStart = html.lastIndexOf('\n', i) + 1;
    const start = /^\s*$/.test(html.slice(lineStart, i)) ? lineStart : i;
    let end = elementEnd(html, i);
    if (html[end] === '\n') end++;
    html = html.slice(0, start) + html.slice(end);
  }
  return html;
}

// Root-relative asset URLs so pages in sub-folders resolve them.
const absAssets = (html) => html.replace(/(["'(,]\s*)assets\//g, '$1/assets/');

// Internal page links -> Spanish equivalents.
function localizeLinks(html, lang) {
  if (lang === 'en') return html;
  return html.replace(/href="(\/[^"#]*)(#[^"]*)?"/g, (m, p, hash = '') =>
    ES_PATHS[p] ? `href="${ES_PATHS[p]}${hash}"` : m);
}

// In-page anchors (#menu) -> links to the home page, for pages other than the home.
const anchorsToHome = (html, lang) => html.replace(/href="#([^"]*)"/g, (m, id) =>
  id === 'order' ? `href="${DD_URL}"` : `href="${HOME[lang]}#${id}"`);

function langLinks(html, lang, urls) {
  return html.replace(/<a class="lang-btn" data-lang-link="(en|es)" href="[^"]*"/g, (m, l) =>
    `<a class="lang-btn${l === lang ? ' active' : ''}" href="${urls[l]}"${l === lang ? ' aria-current="page"' : ''}`);
}

function minifyCss(c) {
  return c.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ')
    .replace(/\s*([{};:,>])\s*/g, '$1').replace(/;}/g, '}').trim();
}

// ── Menu data (from the translated home body) ───────────────────────────────

function sections(body) {
  const out = {};
  const re = /<div class="menu-section[^"]*" id="([^"]+)">/g;
  let m;
  while ((m = re.exec(body))) {
    const end = elementEnd(body, m.index);
    const html = body.slice(m.index, end);
    const cards = [];
    const cre = /<div class="menu-card(?: [^"]*)?"[^>]*>/g;
    let c;
    while ((c = cre.exec(html))) {
      const cEnd = elementEnd(html, c.index);
      const cardHtml = html.slice(c.index, cEnd);
      const get = (cls) => ((cardHtml.match(new RegExp(`class="${cls}"[^>]*>([\\s\\S]*?)</div>`)) || [])[1] || '').trim();
      const img = (cardHtml.match(/<img src="([^"]+)"/) || [])[1];
      cards.push({ html: cardHtml, name: text(get('menu-card-name')), description: text(get('menu-card-desc')), price: text((cardHtml.match(/menu-card-price">([^<]*)/) || [])[1] || ''), image: img });
      cre.lastIndex = cEnd;
    }
    out[m[1]] = {
      id: m[1],
      title: text((html.match(/menu-section-title">([\s\S]*?)<\/div>/) || [])[1] || ''),
      tagline: text((html.match(/menu-section-tagline">([\s\S]*?)<\/div>/) || [])[1] || ''),
      cards
    };
  }
  return out;
}

function menuItem(card) {
  const item = { '@type': 'MenuItem', name: card.name, description: card.description };
  if (card.image) item.image = SITE + card.image;
  if (/^\$\d+(\.\d+)?$/.test(card.price)) item.offers = { '@type': 'Offer', price: card.price.slice(1), priceCurrency: 'USD' };
  return item;
}

function faqs(body) {
  const list = [];
  const re = /<div class="faq-item">\s*<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g;
  let m;
  while ((m = re.exec(body))) list.push([text(m[1]), text(m[2])]);
  return list;
}

const faqSchema = (list) => ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: list.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
});

function restaurantSchema(lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${SITE}/#restaurant`,
    name: 'Venemex Bakery & Café',
    description: T[lang].restaurantDescription,
    url: SITE + HOME[lang],
    image: ['venemex-combo-for-2-v2.jpg', 'triple-chocolate-cake-v2.jpg', 'arepa-pabellon-v2.jpg', 'pan-dulce-v2.jpg', 'cheesecake-de-arandanos-v2.jpg'].map((f) => `${SITE}/assets/${f}`),
    logo: `${SITE}/assets/logovenemex2.png`,
    telephone: '+1-386-265-0055',
    priceRange: '$$',
    address: { '@type': 'PostalAddress', streetAddress: '201 Seabreeze Blvd', addressLocality: 'Daytona Beach', addressRegion: 'FL', postalCode: '32118', addressCountry: 'US' },
    geo: { '@type': 'GeoCoordinates', ...GEO },
    areaServed: { '@type': 'City', name: 'Daytona Beach' },
    servesCuisine: T[lang].cuisine,
    acceptsReservations: false,
    hasMenu: `${SITE}${HOME[lang]}#menu`,
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '10:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '10:00', closes: '17:00' }
    ],
    sameAs: SAME_AS
  };
}

// ── <head> ──────────────────────────────────────────────────────────────────

function head({ lang, urls, title, description, ogImage, ogType = 'restaurant', schemas, preloadHero }) {
  const self = SITE + urls[lang];
  const meta = HOME_META[lang];
  const img = SITE + ogImage;
  const ld = schemas.map((s) => `<script type="application/ld+json">${JSON.stringify(s).replace(/</g, '\\u003c')}</script>`).join('\n');
  const hero = preloadHero ? `\n<link rel="preload" as="image" href="/assets/hero-venemex-1280-v2.webp" imagesrcset="/assets/hero-venemex-640-v2.webp 640w, /assets/hero-venemex-960-v2.webp 960w, /assets/hero-venemex-1280-v2.webp 1280w, /assets/hero-venemex-1920-v2.webp 1920w" imagesizes="(max-aspect-ratio: 3/2) 66vh, 100vw" fetchpriority="high">` : '';
  return `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escHtml(title)}</title>
<meta name="description" content="${escAttr(description)}">
<link rel="canonical" href="${self}">
<link rel="alternate" hreflang="en" href="${SITE + urls.en}">
<link rel="alternate" hreflang="es" href="${SITE + urls.es}">
<link rel="alternate" hreflang="x-default" href="${SITE + urls.en}">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="alternate icon" href="/favicon.ico">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<meta name="theme-color" content="#2C1A0E">
<link rel="preload" href="/assets/fonts/libre-baskerville-var-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/lato-400-latin.woff2" as="font" type="font/woff2" crossorigin>${hero}
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="Venemex Bakery &amp; Café">
<meta property="og:locale" content="${meta.ogLocale}">
<meta property="og:locale:alternate" content="${meta.ogAlt}">
<meta property="og:title" content="${escAttr(title)}">
<meta property="og:description" content="${escAttr(description)}">
<meta property="og:image" content="${img}">
<meta property="og:url" content="${self}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escAttr(title)}">
<meta name="twitter:description" content="${escAttr(description)}">
<meta name="twitter:image" content="${img}">
<style>${css}</style>
${ld}
<script>
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${GA_ID}');
/* Load Google Analytics on first interaction or 3.5 s after load, whichever comes first */
(function(){var done=false;function load(){if(done)return;done=true;var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${GA_ID}';document.head.appendChild(s);}
['pointerdown','keydown','touchstart','scroll'].forEach(function(e){addEventListener(e,load,{once:true,passive:true});});
addEventListener('load',function(){setTimeout(load,3500);});})();
</script>`;
}

// ── Pages ───────────────────────────────────────────────────────────────────

function write(urlPath, html) {
  const file = path.join(OUT, urlPath, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

function page(lang, headHtml, bodyHtml) {
  return `<!DOCTYPE html>\n<html lang="${lang}">\n<head>\n${headHtml}\n</head>\n${bodyHtml}\n</html>\n`;
}

const bodyOf = (html) => html.slice(html.indexOf('<body>'), html.lastIndexOf('</body>') + 7);
const between = (html, startMark, endMark) => { const a = html.indexOf(startMark); return html.slice(a, html.indexOf(endMark, a)); };


for (const lang of ['en', 'es']) {
  const urls = HOME;
  let body = bodyOf(src);
  body = dropDiscontinued(body);
  body = translate(body, lang);
  body = absAssets(body);
  body = localizeLinks(body, lang);
  body = langLinks(body, lang, urls);

  const secs = sections(body);
  const menuSchema = {
    '@context': 'https://schema.org', '@type': 'Menu', '@id': `${SITE}${urls[lang]}#menu`,
    name: T[lang].menuName, inLanguage: lang,
    hasMenuSection: Object.values(secs).map((s) => ({ '@type': 'MenuSection', name: s.title, description: s.tagline, hasMenuItem: s.cards.map(menuItem) }))
  };
  const meta = HOME_META[lang];
  const headHtml = head({
    lang, urls, title: meta.title, description: meta.description, ogImage: '/assets/venemex-combo-for-2-v2.jpg',
    schemas: [restaurantSchema(lang), menuSchema, faqSchema(faqs(body))], preloadHero: true
  });
  write(urls[lang], page(lang, headHtml, body));

  // Shared chrome for the category pages, taken from this language's home page.
  const chrome = anchorsToHome(body, lang);
  const top = between(chrome, '<body>', '<main>');
  const bottom = between(chrome, '<!-- ═══ DOORDASH FLOAT', '</body>') + '</body>';

  for (const [key, cat] of Object.entries(CATEGORIES)) {
    const c = cat[lang];
    const curls = cat.paths;
    const cards = cat.cards.flatMap(([id, filter]) => secs[id].cards.filter((k) => !filter || filter.test(k.name)));
    const others = Object.entries(CATEGORIES).filter(([k]) => k !== key)
      .map(([, o]) => `<a href="${o.paths[lang]}">${o[lang].crumb}</a>`).join('\n        ');
    const breadcrumb = [[T[lang].home, SITE + urls[lang]], [T[lang].menu, `${SITE}${urls[lang]}#menu`], [c.crumb, SITE + curls[lang]]];

    const main = `
<main>
<section class="page-hero">
  <div class="container">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <ol>
        <li><a href="${urls[lang]}">${T[lang].home}</a></li>
        <li><a href="${urls[lang]}#menu">${T[lang].menu}</a></li>
        <li aria-current="page">${c.crumb}</li>
      </ol>
    </nav>
    <span class="eyebrow">${c.eyebrow}</span>
    <h1 class="page-title">${c.h1}</h1>
    <p class="page-lead">${c.lead}</p>
  </div>
</section>

<div class="section-wrap alt">
  <div class="container page-intro">
    ${c.intro.map((p) => `<p class="about-lead">${p}</p>`).join('\n    ')}
    <div class="page-actions">
      <a href="${DD_URL}" target="_blank" rel="noopener" class="btn-hero-primary" id="featOrderBtn">${T[lang].orderNow}</a>
      <a href="${urls[lang]}#menu" class="btn-hero-outline">${T[lang].fullMenu}</a>
    </div>
  </div>
</div>

<div class="section-wrap">
  <div class="container">
    <div class="section-header rv">
      <h2 class="section-title">${c.menuTitle}</h2>
      <div class="deco-line"><span>✦</span></div>
    </div>
    <div class="menu-grid">
      ${cards.map((k) => k.html).join('\n      ')}
    </div>
  </div>
</div>

<div class="section-wrap alt">
  <div class="container" style="max-width:720px">
    <div class="section-header rv">
      <span class="eyebrow">${T[lang].faqEyebrow}</span>
      <h2 class="section-title">${T[lang].faqTitle}</h2>
      <div class="deco-line"><span>✦</span></div>
    </div>
    <div class="faq-list">
      ${c.faq.map(([q, a]) => `<div class="faq-item">\n        <h3>${q}</h3>\n        <p>${a}</p>\n      </div>`).join('\n      ')}
    </div>
  </div>
</div>

<div class="section-wrap">
  <div class="container">
    <div class="section-header">
      <span class="eyebrow">${T[lang].moreEyebrow}</span>
      <h2 class="section-title">${T[lang].moreTitle}</h2>
    </div>
    <div class="related-links">
        ${others}
        <a href="${urls[lang]}#menu">${T[lang].fullMenu}</a>
        <a href="${urls[lang]}#visit">${T[lang].visit}</a>
    </div>
  </div>
</div>
</main>

`;
    const catBody = langLinks(localizeLinks(anchorsToHome(top + main + bottom, lang), lang), lang, curls);
    const catSchemas = [
      {
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: breadcrumb.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item }))
      },
      {
        '@context': 'https://schema.org', '@type': 'Menu', '@id': `${SITE}${curls[lang]}#menu`,
        name: `${c.crumb} — Venemex Bakery & Café`, inLanguage: lang, url: SITE + curls[lang],
        hasMenuSection: [{ '@type': 'MenuSection', name: c.crumb, description: c.lead, hasMenuItem: cards.map(menuItem) }]
      },
      faqSchema(c.faq.map(([q, a]) => [text(q), text(a)]))
    ];
    const catHead = head({ lang, urls: curls, title: c.title, description: c.description, ogImage: cat.ogImage, ogType: 'website', schemas: catSchemas });
    write(curls[lang], page(lang, catHead, catBody));
  }
}

// ── Sitemap ─────────────────────────────────────────────────────────────────

const pairs = [HOME, ...Object.values(CATEGORIES).map((c) => c.paths)];
const entries = pairs.flatMap((urls) => ['en', 'es'].map((l) => `  <url>
    <loc>${SITE + urls[l]}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE + urls.en}"/>
    <xhtml:link rel="alternate" hreflang="es" href="${SITE + urls.es}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE + urls.en}"/>
  </url>`));
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`);

console.log(`Built ${pairs.length * 2} pages + sitemap.xml (lastmod ${LASTMOD})`);
