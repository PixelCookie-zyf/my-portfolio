import { getGlobe } from './globe.js';
import { esc } from './util.js';

const chips = (tags) => tags.map((t) => `<span class="chip">${esc(t)}</span>`).join('');
// External links open in a new tab; site links (data-nav) are routed by the page.
// Neutral backgrounds flip in dark mode, so their text takes the page ink; jelly colours keep dark text.
const tone = (color) => `--c:${color}${/surface|cream/.test(color) ? ';--on-c:var(--ink)' : ''}`;
const jellyLink = (attrs) => (href, label, color = 'var(--jelly-cream)', cls = '') =>
  `<a class="jelly ${cls}" style="${tone(color)}" href="${esc(href)}" ${attrs}>${label}</a>`;
const ext = jellyLink('target="_blank" rel="noopener noreferrer"');
const nav = jellyLink('data-nav');
const socials = ({ socials }, colors, cls) =>
  socials.map((s, i) => ext(s.url, `${esc(s.name)} ↗`, `var(${colors[i % colors.length]})`, cls)).join('');
const TROPHY = `<svg class="icon" viewBox="0 0 20 20" aria-hidden="true" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round">
  <path d="M6 3h8v4.5a4 4 0 0 1-8 0z" fill="#f2c84b"/><path d="M6 5H3.5a2.5 2.5 0 0 0 2.8 3M14 5h2.5a2.5 2.5 0 0 1-2.8 3" fill="none"/>
  <path d="M10 11.5v3M6.5 17h7l-1-2.5h-5z" fill="#e0a25a"/></svg>`;
const PIN = `<svg class="icon" viewBox="0 0 20 20" aria-hidden="true" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round">
  <path d="M10 18.5s-5.5-5.3-5.5-9.5a5.5 5.5 0 0 1 11 0c0 4.2-5.5 9.5-5.5 9.5z" fill="#d9532f"/><circle cx="10" cy="9" r="2" fill="#fff"/></svg>`;

// --- panels --------------------------------------------------------------------------

function writingPanel(body, foot, { posts }) {
  const [latest] = posts;
  const pages = [
    { x: -215, r: -7, z: 1, cls: 'big-hand', href: '/blog', html: '<span>flip through<br>the whole<br>notebook →</span>' },
    latest && {
      x: 0, r: 1.5, z: 3, href: `/blog/${latest.slug}`,
      html: `<span class="date">${esc(latest.date.replaceAll('-', ' · '))}</span><h3 lang="zh-CN">${esc(latest.title)}</h3>
        <p lang="zh-CN">${esc(latest.description)}</p><div class="tags">${chips(latest.tags)}</div><span class="go">read →</span>`,
    },
    { x: 215, r: 7, z: 2, cls: 'big-hand blank', href: null, html: '<span>the next page<br>is still being<br>written ✎</span>' },
  ].filter(Boolean);
  body.innerHTML = `<div class="pages">${pages
    .map((p, i) => `<div class="page-slot pop" style="--i:${i};--x:${p.x};z-index:${p.z}">
      <${p.href ? `a href="${esc(p.href)}" data-fly` : 'div'} class="page ${p.cls ?? ''}" style="--r:${p.r}deg">${p.html}</${p.href ? 'a' : 'div'}>
    </div>`)
    .join('')}</div>`;
  foot.innerHTML = nav('/blog', 'all notes →', 'var(--jelly-blue)');
}

function projectsPanel(body, foot, { projects }) {
  const [top, ...rest] = projects;
  const colors = ['--jelly-blue', '--jelly-pink', '--jelly-yellow', '--jelly-orange', '--jelly-teal'];
  const link = (p, color) => (p.github ? ext(p.github, 'GitHub ↗', color, 'small') : p.demo ? ext(p.demo, 'visit ↗', color, 'small') : '');
  body.innerHTML = `
    <section class="featured pop">
      <div>
        ${top.highlight ? `<span class="chip badge">${TROPHY}${esc(top.highlight)}</span>` : ''}
        <h3>${esc(top.title)}</h3>
        <p>${esc(top.description)}</p>
        <div class="row">${chips(top.tags)}${link(top, 'var(--surface)')}</div>
      </div>
      ${top.stats ? `<div class="stats">${top.stats.map((s) => `<div class="stat"><div><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div></div>`).join('')}</div>` : ''}
    </section>
    <div class="proj-grid">${rest
      .map((p, i) => {
        const c = `var(${colors[i % colors.length]})`;
        return `<article class="proj pop" style="--i:${i + 1};--c:${c}">
          <h3>${esc(p.title)}</h3><p>${esc(p.description)}</p>
          <div class="row">${chips(p.tags.slice(0, 2))}${link(p, c)}</div>
        </article>`;
      })
      .join('')}</div>`;
  foot.innerHTML = nav('/projects', 'all projects →', 'var(--jelly-green)');
}

// Timeline stickers, drawn in the island's style: ink outline, flat palette fills, one white glint.
const svg = (inner) =>
  `<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="var(--outline)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
const ICONS = {
  // mortarboard with a swinging tassel
  graduate: svg(`<path d="M9 15.5v5.2c0 1.9 3.1 3.3 7 3.3s7-1.4 7-3.3v-5.2" fill="#3253b3"/>
    <path d="M2.5 12.5 16 6.8l13.5 5.7L16 18.2z" fill="#2b3a67"/>
    <path d="M7 11.5l5-2" stroke="#fff" stroke-width="1.6"/>
    <path d="M16 12.5l8 3.2v6.2" stroke-width="1.8"/><circle cx="24" cy="23.4" r="1.9" fill="#f2c84b"/>`),
  // set square with ruler ticks, for the maths degree
  maths: svg(`<path d="M5.5 26.5v-21l21 21z" fill="#f2c84b"/><path d="M10.2 21.8v-6.2l6.2 6.2z" fill="#fbf9f4"/>
    <path d="M5.5 9.5h2.6M5.5 13h1.8M5.5 16.5h2.6M5.5 20h1.8" stroke-width="1.6"/>`),
  // game pad, for the games studio
  game: svg(`<path d="M9.5 10.5h13a6 6 0 0 1 5.8 7.4l-1.1 4.6a2.9 2.9 0 0 1-5 1.2l-2.5-2.7h-7.4l-2.5 2.7a2.9 2.9 0 0 1-5-1.2l-1.1-4.6a6 6 0 0 1 5.8-7.4z" fill="#7a6aa8"/>
    <path d="M10 14v5M7.5 16.5h5"/><circle cx="21.3" cy="15.2" r="1.5" fill="#f2c84b"/><circle cx="24.2" cy="18" r="1.5" fill="#d9532f"/>
    <path d="M8.5 13a3.5 3.5 0 0 1 2-1.3" stroke="#fff" stroke-width="1.5"/>`),
  // magnifying glass, for search
  search: svg(`<path d="M19.6 19.6l6.6 6.6" stroke-width="6"/><path d="M19.6 19.6l6.6 6.6" stroke="#c08a5a" stroke-width="2.4"/>
    <circle cx="13.5" cy="13.5" r="8.2" fill="#9cc3e6"/><path d="M9.3 12.4a4.6 4.6 0 0 1 3.3-3.4" stroke="#fff" stroke-width="1.8"/>`),
  // briefcase
  work: svg(`<path d="M12 10.5V8.6A1.6 1.6 0 0 1 13.6 7h4.8A1.6 1.6 0 0 1 20 8.6v1.9"/>
    <rect x="4.5" y="10.5" width="23" height="15" rx="3" fill="#c08a5a"/><path d="M4.5 17h23"/>
    <rect x="13.5" y="15" width="5" height="4" rx="1" fill="#f2c84b"/><path d="M7.5 13.5h3" stroke="#fff" stroke-width="1.6"/>`),
  // bubbling flask, for research in progress
  research: svg(`<path d="M10.4 19.5h11.2l3.6 5a2 2 0 0 1-1.6 3.1H8.4a2 2 0 0 1-1.6-3.1z" fill="#ef9aa6" stroke="none"/>
    <path d="M12.5 4.5h7M14 4.5v7.8l-7.2 12.2a2 2 0 0 0 1.6 3.1h15.2a2 2 0 0 0 1.6-3.1L18 12.3V4.5"/>
    <circle cx="14.6" cy="23.2" r="1.3" fill="#fff" stroke-width="1.4"/><circle cx="18.2" cy="21.4" r="0.9" fill="#fff" stroke-width="1.2"/>
    <circle cx="22.6" cy="7.4" r="1.4" fill="#fff" stroke-width="1.4"/><circle cx="25.2" cy="3.8" r="0.9" fill="#fff" stroke-width="1.2"/>`),
};

function aboutPanel(body, _foot, { personal, skills, timeline }) {
  const icon = (e) => {
    const text = `${e.role} ${e.description}`;
    if (e.period.includes('Present')) return ['research', '--jelly-pink'];
    if (/\bgames?\b/i.test(text)) return ['game', '--jelly-yellow'];
    if (/\bsearch\b/i.test(text)) return ['search', '--jelly-orange'];
    if (e.type === 'work') return ['work', '--jelly-orange'];
    if (/math/i.test(text)) return ['maths', '--jelly-green'];
    return ['graduate', '--jelly-blue'];
  };
  body.innerHTML = `<div class="about">
    <div class="profile pop">
      <div class="avatar" style="background-image:url('${esc(personal.avatar)}')"></div>
      <h3>${esc(personal.name)}</h3>
      <div class="where"><span class="chip" style="--c:var(--jelly-yellow)">${PIN}${esc(personal.location)}</span></div>
      <p>${esc(personal.bio)}</p>
      <div class="socials">${socials(personal, ['--jelly-yellow', '--jelly-blue', '--jelly-pink', '--jelly-green'], 'small')}</div>
      <div class="skills">${skills.map((g) => `<div><b>${esc(g.label)}</b>${chips(g.skills)}</div>`).join('')}</div>
    </div>
    <div class="timeline">${[...timeline]
      .reverse()
      .map((e, i) => {
        const [name, col] = icon(e);
        return `<div class="event pop" style="--i:${i + 1}">
          <span class="dot" style="--c:var(${col})">${ICONS[name]}</span>
          <div class="event-card"><span class="when">${esc(e.period)}</span><b>${esc(e.institution)}</b>
            <div>${esc(e.role)}</div><p>${esc(e.description)}</p></div>
        </div>`;
      })
      .join('')}</div>
  </div>`;
}

function travelPanel(body, _foot, { cities }) {
  const home = cities.find((c) => c.current) ?? cities[0];
  const china = cities.filter((c) => c.country === 'China' && c !== home);
  const abroad = cities.filter((c) => c.country !== 'China' && c !== home);
  const countries = new Set(cities.map((c) => c.country)).size;
  const btn = (c) => `<button type="button" class="jelly small" data-city="${esc(c.name)}">${esc(c.name)}</button>`;
  body.innerHTML = `<div class="travel">
    <div class="globe-wrap pop"><div class="loading">drawing the globe…</div></div>
    <div class="places pop" style="--i:1">
      <div class="counts">
        <div class="stat"><div><b>${cities.length}</b><span>cities</span></div></div>
        <div class="stat" style="background:var(--jelly-yellow)"><div><b>${countries}</b><span>countries</span></div></div>
      </div>
      <h4>home</h4><div class="list">${btn(home)}</div>
      ${china.length ? `<h4>around China</h4><div class="list">${china.map(btn).join('')}</div>` : ''}
      ${abroad.length ? `<h4>further away</h4><div class="list">${abroad.map(btn).join('')}</div>` : ''}
    </div>
  </div>`;

  const buttons = [...body.querySelectorAll('[data-city]')];
  const mark = (name) => buttons.forEach((b) => b.classList.toggle('selected', b.dataset.city === name));
  const globe = getGlobe(cities);
  buttons.forEach((b) => b.addEventListener('click', () => globe.select(b.dataset.city)));
  // mount after the pop-in so the canvas measures its final size
  const t = setTimeout(() => globe.mount(body.querySelector('.globe-wrap'), { onSelect: mark }), 120);
  return () => {
    clearTimeout(t);
    globe.unmount();
  };
}

function contactPanel(body, _foot, { personal }) {
  body.innerHTML = `<div class="envelope pop"><div class="letter">
    <p class="hand">write me a letter</p>
    <h3>Say hello.</h3>
    <p>About research, a project, or something you read here — I reply to every note.</p>
    <a class="mail" href="mailto:${esc(personal.email)}">${esc(personal.email)}</a>
    <div class="socials">
      <button type="button" class="jelly" style="--c:var(--jelly-yellow)" data-copy>copy email</button>
      ${socials(personal, ['--jelly-blue', '--jelly-pink', '--jelly-green', '--jelly-orange'])}
    </div>
  </div></div>`;
  const copy = body.querySelector('[data-copy]');
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(personal.email);
      copy.textContent = 'copied! ✓';
    } catch {
      copy.textContent = 'couldn’t copy';
    }
    setTimeout(() => (copy.textContent = 'copy email'), 2200);
  });
}

const PANELS = {
  writing: { accent: 'var(--jelly-blue)', hand: 'pages from my notebook', title: 'Writing', width: 900, build: writingPanel },
  projects: { accent: 'var(--jelly-green)', hand: 'things I’ve built', title: 'Projects', width: 960, build: projectsPanel },
  about: { accent: 'var(--jelly-pink)', hand: 'nice to meet you', title: 'About me', width: 940, build: aboutPanel },
  travel: { accent: 'var(--jelly-teal)', hand: 'where I’ve been', title: 'Travel', width: 1000, build: travelPanel },
  contact: { accent: 'var(--jelly-yellow)', hand: 'the lighthouse is listening', title: 'Say hi', width: 580, build: contactPanel },
};

// --- modal ---------------------------------------------------------------------------

export function createModal({ data, navigate, onClose }) {
  const overlay = document.createElement('div');
  overlay.className = 'isl isl-overlay';
  // set inline: the site's CSS pipeline strips backdrop-filter from island.css
  overlay.style.backdropFilter = overlay.style.webkitBackdropFilter = 'blur(9px) saturate(1.15)';
  document.body.appendChild(overlay);
  let current = null, cleanup = null, closeTimer = 0, lastFocus = null;

  function open(key, origin) {
    const P = PANELS[key];
    if (!P) return;
    clearTimeout(closeTimer);
    cleanup?.();
    lastFocus = document.activeElement;
    overlay.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="${esc(P.title)}"
        style="--w:${P.width}px;--accent:${P.accent};--dx:${origin.x - innerWidth / 2}px;--dy:${origin.y - innerHeight / 2}px">
      <header class="modal-head">
        <div><p class="hand">${esc(P.hand)}</p><h2>${esc(P.title)}</h2></div>
        <button type="button" class="jelly round close" aria-label="Close">×</button>
      </header>
      <div class="modal-body"></div>
      <div class="modal-foot"></div>
    </div>`;
    const modal = overlay.firstElementChild;
    cleanup = P.build(modal.querySelector('.modal-body'), modal.querySelector('.modal-foot'), data) ?? null;
    modal.querySelector('.close').addEventListener('click', close);
    overlay.classList.remove('closing');
    overlay.classList.add('open');
    current = key;
    modal.querySelector('.close').focus({ preventScroll: true });
  }

  function close() {
    if (!current) return;
    current = null;
    overlay.classList.add('closing');
    cleanup?.();
    cleanup = null;
    closeTimer = setTimeout(() => {
      overlay.classList.remove('open', 'closing');
      overlay.innerHTML = '';
    }, 320);
    lastFocus?.focus?.({ preventScroll: true });
    onClose?.();
  }

  overlay.addEventListener('pointerdown', (e) => e.target === overlay && close());
  overlay.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-nav], a[data-fly]');
    if (!a) return;
    e.preventDefault();
    const href = a.getAttribute('href');
    if (a.hasAttribute('data-fly')) {
      // the page flies off the desk, then we follow it
      a.classList.add('flying');
      setTimeout(() => {
        close();
        navigate(href);
      }, 380);
    } else {
      close();
      navigate(href);
    }
  });
  const onKey = (e) => e.key === 'Escape' && close();
  window.addEventListener('keydown', onKey);

  return {
    open,
    close,
    get isOpen() {
      return !!current;
    },
    dispose() {
      clearTimeout(closeTimer);
      cleanup?.();
      window.removeEventListener('keydown', onKey);
      overlay.remove();
    },
  };
}
