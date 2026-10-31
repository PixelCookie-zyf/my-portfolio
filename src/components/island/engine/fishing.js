import * as THREE from 'three';
import { C, add, box, cyl, ball, mat } from './models.js';
import { waveAt } from './world.js';
import { esc, clamp, pointerNdc } from './util.js';

// A little fishing game played from the jetty: hold to cast, wait for the float to dip, strike,
// then reel in while keeping the line tension out of the red. Catches fill a journal.

const rand = (a, b) => a + Math.random() * (b - a);
const hex = (c) => parseInt(c.slice(1), 16);
// a full-power cast lands CAST_MIN + CAST_RANGE out from the jetty; aim swings ±AIM_MAX radians
const CAST_MIN = 3.5, CAST_RANGE = 9.5, AIM_MAX = 0.55;
const castReach = (power) => CAST_MIN + power * CAST_RANGE;

const RARITY = [
  { label: 'common', stars: 1, color: 'var(--jelly-cream)', weight: 60 },
  { label: 'uncommon', stars: 2, color: 'var(--jelly-green)', weight: 26 },
  { label: 'rare', stars: 3, color: 'var(--jelly-blue)', weight: 11 },
  { label: 'legendary', stars: 4, color: 'var(--jelly-yellow)', weight: 3 },
];

// fight: how hard it pulls (0..1); window: seconds to strike once it bites
const SPECIES = [
  { id: 'sardine', name: 'Paper Sardine', rarity: 0, size: [12, 22], fight: 0.25, window: 1.0, shape: 'slim', pattern: 'lines',
    body: '#e6edf7', fin: '#93b6ff', accent: '#3253b3', note: 'Folded from an old page of notes. Smells faintly of ink.' },
  { id: 'bass', name: 'Bug Bass', rarity: 0, size: [25, 48], fight: 0.45, window: 0.9, shape: 'oval', pattern: 'spots',
    body: '#8fdc9f', fin: '#2e6a4f', accent: '#2e6a4f', note: 'Lives in every codebase. Bites hardest on Friday evenings.' },
  { id: 'perch', name: 'Pixel Perch', rarity: 0, size: [15, 30], fight: 0.35, window: 0.95, shape: 'oval', pattern: 'checker',
    body: '#ffb370', fin: '#d9532f', accent: '#d9532f', note: 'Rendered at a very low resolution, and proud of it.' },
  { id: 'tuna', name: 'Token Tuna', rarity: 1, size: [40, 90], fight: 0.65, window: 0.8, shape: 'torpedo', pattern: 'belly',
    body: '#6f86b8', fin: '#2b3a67', accent: '#dde5f3', note: 'Always being counted, and there are never quite enough.' },
  { id: 'clown', name: 'Coco Clownfish', rarity: 1, size: [8, 14], fight: 0.4, window: 0.85, shape: 'round', pattern: 'bands',
    body: '#ff9a4d', fin: '#e8873e', accent: '#ffffff', note: 'Hangs around the beach bar. Tips well.' },
  { id: 'flounder', name: 'Overfit Flounder', rarity: 1, size: [20, 45], fight: 0.5, window: 0.75, shape: 'flat', pattern: 'spots',
    body: '#e2bd8a', fin: '#c08a5a', accent: '#8a5d3b', note: 'Only ever bites the exact bait it was trained on.' },
  { id: 'grouper', name: 'Gradient Grouper', rarity: 2, size: [50, 110], fight: 0.8, window: 0.7, shape: 'chunky', pattern: 'gradient',
    body: '#b59cf0', fin: '#7a6aa8', accent: '#ff9fae', note: 'Descends slowly, then all at once.' },
  { id: 'angel', name: 'Agent Angelfish', rarity: 2, size: [15, 30], fight: 0.7, window: 0.65, shape: 'tall', pattern: 'stripes',
    body: '#7fd6d0', fin: '#4f8f7e', accent: '#ffd36b', note: 'Plans its own escape route, one step at a time.' },
  { id: 'lantern', name: 'Night Lanternfish', rarity: 2, night: true, size: [10, 25], fight: 0.55, window: 0.75, shape: 'oval', pattern: 'glow',
    body: '#3a4a7a', fin: '#26324a', accent: '#ffd36b', note: 'Only comes up after dark, and brings its own light.' },
  { id: 'koi', name: 'Golden Cookie Koi', rarity: 3, size: [40, 80], fight: 0.95, window: 0.55, shape: 'oval', pattern: 'chips',
    body: '#f2c84b', fin: '#e0a25a', accent: '#5a3a2a', note: 'The island mascot. Crunchy, and extremely lucky.' },
  { id: 'boot', name: 'Old Boot', rarity: 0, junk: true, weight: 9, size: [26, 30], fight: 0.15, window: 1.1,
    body: '#8a5d3b', fin: '#5a3a2a', note: 'Fits neither foot. Somebody will want it back.' },
  { id: 'bottle', name: 'Message in a Bottle', rarity: 1, junk: true, weight: 7, size: [20, 25], fight: 0.2, window: 1.0,
    body: '#9cc3e6', fin: '#c08a5a', note: 'There’s a page from my notebook rolled up inside.' },
];

// --- illustrations ---------------------------------------------------------------------------

let uid = 0;
const SHAPES = { slim: [36, 12], oval: [32, 18], torpedo: [38, 15], round: [24, 19], flat: [33, 13], chunky: [34, 21], tall: [22, 23] };
const INK = 'var(--outline, #1d1b18)';

function patternSVG(s, cx, cy, rx, ry) {
  const a = s.accent;
  switch (s.pattern) {
    case 'lines':
      return [-0.35, 0, 0.35].map((k) => `<path d="M${cx - rx} ${cy + k * ry} H${cx + rx}" stroke="${a}" stroke-width="2" opacity="0.45"/>`).join('');
    case 'spots':
      return [[-0.4, -0.3, 4], [-0.05, 0.25, 3.2], [0.25, -0.35, 3], [-0.6, 0.3, 2.6], [0.1, -0.05, 2.2]]
        .map(([x, y, r]) => `<circle cx="${cx + x * rx}" cy="${cy + y * ry}" r="${r}" fill="${a}" opacity="0.6"/>`).join('');
    case 'checker': {
      let out = '';
      for (let x = cx - rx; x < cx + rx; x += 7) for (let y = cy - ry; y < cy + ry; y += 7) {
        if ((Math.round((x - cx) / 7) + Math.round((y - cy) / 7)) % 2) out += `<rect x="${x}" y="${y}" width="7" height="7" fill="${a}" opacity="0.4"/>`;
      }
      return out;
    }
    case 'belly':
      return `<ellipse cx="${cx}" cy="${cy + ry * 0.75}" rx="${rx}" ry="${ry * 0.7}" fill="${a}"/>
        <path d="M${cx - rx * 0.6} ${cy - ry * 0.15} H${cx + rx * 0.55}" stroke="${s.fin}" stroke-width="2" stroke-dasharray="3 4"/>`;
    case 'bands':
      return [-0.45, 0.05, 0.5].map((k) => `<rect x="${cx + k * rx - 3.5}" y="${cy - ry - 2}" width="7" height="${ry * 2 + 4}" fill="${a}" stroke="${INK}" stroke-width="2"/>`).join('');
    case 'stripes':
      return [-0.5, -0.1, 0.3].map((k) => `<rect x="${cx + k * rx - 2.5}" y="${cy - ry - 2}" width="5" height="${ry * 2 + 4}" fill="${a}" opacity="0.85"/>`).join('');
    case 'chips':
      return [[-0.45, -0.25], [-0.1, 0.3], [0.2, -0.4], [-0.6, 0.35], [0.3, 0.15]]
        .map(([x, y]) => `<path d="M${cx + x * rx - 2.5} ${cy + y * ry} l2.5 -3 l3 1.5 l-0.5 3.5 z" fill="${a}"/>`).join('');
    case 'glow':
      return [[-0.5, 0.35], [-0.2, 0.45], [0.1, 0.42], [0.35, 0.3]]
        .map(([x, y]) => `<circle cx="${cx + x * rx}" cy="${cy + y * ry}" r="2" fill="${a}"/>`).join('');
    default:
      return '';
  }
}

function junkSVG(s) {
  if (s.id === 'boot') {
    return `<svg viewBox="0 0 120 72" aria-hidden="true" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">
      <path d="M40 10h24v30c0 3 2 5 6 6l18 6c6 2 8 6 8 10v2H34V18c0-4 2-8 6-8z" fill="${s.body}"/>
      <path d="M34 60h62v4H34z" fill="${s.fin}"/><path d="M40 18h24M46 26l8 0M46 33l8 0" fill="none"/>
      <path d="M70 47l4-6M78 50l4-6" fill="none"/><path d="M44 13h8" stroke="#fff" stroke-width="2"/>
      <path d="M92 20q4-6 8 0q-4 4-8 0z" fill="#8fdc9f" stroke-width="2"/></svg>`;
  }
  return `<svg viewBox="0 0 120 72" aria-hidden="true" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">
    <g transform="rotate(-12 60 36)">
      <path d="M22 26h50c4 0 8-6 14-6h6v32h-6c-6 0-10-6-14-6H22a8 8 0 0 1-8-8v-4a8 8 0 0 1 8-8z" fill="${s.body}" fill-opacity="0.85"/>
      <rect x="92" y="23" width="9" height="26" rx="2" fill="${s.fin}"/>
      <rect x="26" y="30" width="40" height="12" rx="3" fill="#fbf3df"/><path d="M32 34h26M32 38h18" stroke-width="1.6"/>
      <path d="M22 30h10" stroke="#fff" stroke-width="2"/></g></svg>`;
}

function fishSVG(s) {
  if (s.junk) return junkSVG(s);
  const id = `fsh${uid++}`;
  const [rx, ry] = SHAPES[s.shape] ?? SHAPES.oval;
  const cx = 64, cy = 37, tall = s.shape === 'tall' ? 12 : 0;
  const fill = s.pattern === 'gradient' ? `url(#${id}g)` : s.body;
  return `<svg viewBox="0 0 120 72" aria-hidden="true" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">
    <defs><clipPath id="${id}c"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/></clipPath>
      <linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${s.body}"/><stop offset="1" stop-color="${s.accent}"/></linearGradient></defs>
    <path d="M${cx - rx + 6} ${cy} L${cx - rx - 17} ${cy - ry * 0.85 - 4} Q${cx - rx - 9} ${cy} ${cx - rx - 17} ${cy + ry * 0.85 + 4} Z" fill="${s.fin}"/>
    <path d="M${cx - rx * 0.5} ${cy - ry + 3} Q${cx - rx * 0.25} ${cy - ry - 13 - tall} ${cx + rx * 0.3} ${cy - ry + 2} Z" fill="${s.fin}"/>
    <path d="M${cx - rx * 0.25} ${cy + ry - 3} Q${cx - rx * 0.1} ${cy + ry + 9 + tall} ${cx + rx * 0.2} ${cy + ry - 2} Z" fill="${s.fin}"/>
    ${s.pattern === 'glow' ? `<path d="M${cx + rx * 0.6} ${cy - ry + 3} Q${cx + rx * 0.9} ${cy - ry - 16} ${cx + rx + 9} ${cy - ry - 8}" fill="none"/>
      <circle cx="${cx + rx + 10}" cy="${cy - ry - 7}" r="7" fill="${s.accent}" opacity="0.35" stroke="none"/><circle cx="${cx + rx + 10}" cy="${cy - ry - 7}" r="3.6" fill="${s.accent}"/>` : ''}
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"/>
    <g clip-path="url(#${id}c)" stroke="none">${patternSVG(s, cx, cy, rx, ry)}</g>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none"/>
    <path d="M${cx + rx * 0.28} ${cy - ry * 0.55} Q${cx + rx * 0.12} ${cy} ${cx + rx * 0.28} ${cy + ry * 0.55}" fill="none" stroke-width="2"/>
    <path d="M${cx + rx * 0.05} ${cy + ry * 0.15} q-9 2 -13 10 q9 0 13 -5 z" fill="${s.fin}" stroke-width="2"/>
    <path d="M${cx - rx * 0.55} ${cy - ry * 0.55} Q${cx - rx * 0.1} ${cy - ry * 0.95} ${cx + rx * 0.2} ${cy - ry * 0.8}" fill="none" stroke="#fff" stroke-width="2.2" opacity="0.8"/>
    <circle cx="${cx + rx * 0.58}" cy="${cy - ry * 0.22}" r="5.5" fill="#fff"/>
    <circle cx="${cx + rx * 0.62}" cy="${cy - ry * 0.2}" r="2.7" fill="${INK}" stroke="none"/>
    <circle cx="${cx + rx * 0.66}" cy="${cy - ry * 0.3}" r="1" fill="#fff" stroke="none"/>
    <path d="M${cx + rx - 3} ${cy + ry * 0.25} q3 2 5 0" fill="none" stroke-width="2"/>
  </svg>`;
}

// A chunky low-poly version of the catch, for the leap out of the water.
function catchModel(s) {
  const g = new THREE.Group();
  const body = hex(s.body), fin = hex(s.fin);
  if (s.id === 'boot') {
    box(g, 0.5, 1.0, 0.55, body, -0.25, -0.5, 0);
    box(g, 1.25, 0.42, 0.55, body, 0.12, -0.5, 0);
    box(g, 1.3, 0.12, 0.6, fin, 0.12, -0.6, 0);
  } else if (s.id === 'bottle') {
    add(g, new THREE.CylinderGeometry(0.3, 0.3, 1.1, 8), mat(body), 0, 0, 0, { rz: Math.PI / 2 });
    add(g, new THREE.CylinderGeometry(0.13, 0.25, 0.35, 8), mat(body), 0.7, 0, 0, { rz: -Math.PI / 2 });
    add(g, new THREE.CylinderGeometry(0.12, 0.12, 0.2, 6), fin, 0.95, 0, 0, { rz: Math.PI / 2 });
    box(g, 0.6, 0.3, 0.3, C.cream, -0.05, -0.15, 0);
  } else {
    const [rx, ry] = SHAPES[s.shape] ?? SHAPES.oval;
    ball(g, 1, 1, body, 0, 0, 0, { s: [rx / 30, ry / 30, 0.38] });
    add(g, new THREE.ConeGeometry(ry / 40 + 0.15, 0.6, 4), fin, -rx / 30 - 0.18, 0, 0, { rz: Math.PI / 2, s: [1, 1, 0.3] });
    add(g, new THREE.ConeGeometry(0.25, 0.4, 4), fin, -0.1, ry / 30 + 0.05, 0, { s: [1.4, 1, 0.25] });
    for (const z of [-1, 1]) {
      ball(g, 0.11, 0, C.white, rx / 30 - 0.3, 0.08, z * 0.3);
      ball(g, 0.06, 0, C.ink, rx / 30 - 0.26, 0.08, z * 0.36);
    }
  }
  return g;
}

// --- sound: a few tiny synthesised effects ----------------------------------------------------

function createSfx() {
  const KEY = 'pixelcookie:fishing-sound';
  let ac = null, noiseBuf = null, on = true;
  try {
    on = localStorage.getItem(KEY) !== 'off';
  } catch {
    /* storage blocked: keep the default */
  }
  const ctx = () => {
    ac ??= new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === 'suspended') ac.resume();
    return ac;
  };
  const tone = (f0, f1, dur, type = 'sine', vol = 0.08, delay = 0) => {
    const a = ctx(), t = a.currentTime + delay, o = a.createOscillator(), g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(a.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  };
  const noise = (dur, freq, vol = 0.08) => {
    const a = ctx(), t = a.currentTime;
    if (!noiseBuf) {
      noiseBuf = a.createBuffer(1, a.sampleRate * 0.5, a.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    src.buffer = noiseBuf;
    f.type = 'bandpass';
    f.frequency.value = freq;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(a.destination);
    src.start(t);
    src.stop(t + dur);
  };
  const fx = {
    cast: () => noise(0.3, 2400, 0.06),
    plop: () => (tone(520, 130, 0.16, 'sine', 0.12), noise(0.12, 1100, 0.05)),
    nibble: () => tone(700, 500, 0.05, 'sine', 0.05),
    bite: () => (tone(880, 880, 0.06, 'square', 0.035), tone(1175, 1175, 0.08, 'square', 0.035, 0.08)),
    tick: () => tone(1900, 1500, 0.02, 'triangle', 0.02),
    splash: () => noise(0.28, 800, 0.09),
    catch: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, f, 0.16, 'triangle', 0.07, i * 0.08)),
    snap: () => (tone(320, 70, 0.3, 'sawtooth', 0.05), noise(0.1, 3000, 0.06)),
    miss: () => tone(330, 200, 0.28, 'sine', 0.06),
  };
  return {
    play(k) {
      if (!on) return;
      try {
        fx[k]();
      } catch {
        /* audio unavailable */
      }
    },
    get on() {
      return on;
    },
    toggle() {
      on = !on;
      try {
        localStorage.setItem(KEY, on ? 'on' : 'off');
      } catch {
        /* storage blocked */
      }
      return on;
    },
  };
}

// --- journal storage ----------------------------------------------------------------------------

const LOG_KEY = 'pixelcookie:fishing-log';
const loadLog = () => {
  try {
    return JSON.parse(localStorage.getItem(LOG_KEY)) ?? {};
  } catch {
    return {};
  }
};
const saveLog = (log) => {
  try {
    localStorage.setItem(LOG_KEY, JSON.stringify(log));
  } catch {
    /* private mode: the journal just won't persist */
  }
};

// ------------------------------------------------------------------------------------------------

export function createFishing({ scene, camera, canvas, stage, labels, spot, data, placeAt, navigate, onEnter, onExit }) {
  const O = spot.origin, D = spot.dir;
  const side = new THREE.Vector3(-D.z, 0, D.x);
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const press = coarse ? 'tap' : 'click';
  const sfx = createSfx();
  const log = loadLog();
  let night = false;

  const root = new THREE.Group();
  scene.add(root);

  // --- rod: a handle and three jointed sections, so it can bend under load ----------------------
  const rod = new THREE.Group();
  rod.position.copy(O);
  rod.rotation.y = Math.atan2(D.x, D.z);
  root.add(rod);
  cyl(rod, 0.12, 0.12, 0.5, 6, C.metal, 0, -0.05, 0);
  const tilt = new THREE.Group();
  rod.add(tilt);
  cyl(tilt, 0.075, 0.085, 0.95, 6, C.woodLight, 0, 0, 0);
  add(tilt, new THREE.CylinderGeometry(0.14, 0.14, 0.12, 8), C.metal, 0.13, 0.6, 0, { rz: Math.PI / 2 });
  add(tilt, new THREE.CylinderGeometry(0.03, 0.03, 0.2, 4), C.yellow, 0.24, 0.6, 0.06, { rx: Math.PI / 2 });
  const joints = [];
  let parent = tilt, y = 0.95;
  for (const [len, r0, r1, col] of [[1.35, 0.05, 0.038, C.navy], [1.2, 0.038, 0.026, C.navy], [1.05, 0.026, 0.016, C.red]]) {
    const j = new THREE.Group();
    j.position.y = y;
    parent.add(j);
    cyl(j, r1, r0, len, 5, col, 0, 0, 0);
    joints.push(j);
    parent = j;
    y = len;
  }
  const tip = new THREE.Object3D();
  tip.position.y = y;
  parent.add(tip);
  let rodTilt = 0.4, rodTiltTo = 0.4, bend = 0;

  // --- float, line, aim ring ---------------------------------------------------------------------
  const bobber = new THREE.Group();
  add(bobber, new THREE.SphereGeometry(0.2, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2), C.red);
  add(bobber, new THREE.SphereGeometry(0.2, 8, 4, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), C.white);
  cyl(bobber, 0.03, 0.03, 0.22, 4, C.white, 0, 0.17, 0);
  root.add(bobber);

  const LN = 24, linePos = new Float32Array(LN * 3);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
  const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0x1d1b18, transparent: true, opacity: 0.8 }));
  line.frustumCulled = false;
  line.layers.set(1);
  root.add(line);

  const aimRing = new THREE.Mesh(
    new THREE.RingGeometry(0.5, 0.68, 28).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: 0xffd36b, transparent: true, opacity: 0.9, depthWrite: false })
  );
  aimRing.layers.set(1);
  aimRing.visible = false;
  root.add(aimRing);

  // --- bucket by the rod; a tail pokes out once something's been caught ----------------------------
  const bucket = new THREE.Group();
  bucket.position.copy(O).addScaledVector(side, -0.6).addScaledVector(D, -0.95);
  cyl(bucket, 0.3, 0.24, 0.48, 8, C.roofBlue, 0, 0, 0);
  add(bucket, new THREE.TorusGeometry(0.3, 0.035, 4, 12), C.metal, 0, 0.48, 0, { rx: Math.PI / 2 });
  add(bucket, new THREE.CylinderGeometry(0.27, 0.27, 0.02, 8), mat(0x86bedb), 0, 0.4, 0);
  add(bucket, new THREE.TorusGeometry(0.3, 0.02, 4, 10, Math.PI), C.metal, 0, 0.5, 0, { rz: 0.2 });
  const tail = add(bucket, new THREE.ConeGeometry(0.16, 0.34, 4), C.yellow, 0.06, 0.62, 0, { rz: Math.PI, s: [1, 1, 0.3] });
  tail.visible = false;
  root.add(bucket);

  // --- ripples and droplets ------------------------------------------------------------------------
  const ringGeo = new THREE.RingGeometry(0.82, 1, 28).rotateX(-Math.PI / 2);
  const ripples = Array.from({ length: 10 }, () => {
    const m = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false }));
    m.layers.set(1);
    m.visible = false;
    root.add(m);
    return { m, k: 1, life: 1, size: 1 };
  });
  let rippleAt = 0;
  const ripple = (p, size = 1.4, life = 0.9) => {
    const r = ripples[rippleAt++ % ripples.length];
    r.m.position.set(p.x, 0, p.z);
    Object.assign(r, { k: 0, life, size });
    r.m.visible = true;
  };
  const dropGeo = new THREE.IcosahedronGeometry(0.07, 0);
  const dropMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const drops = Array.from({ length: 14 }, () => {
    const m = new THREE.Mesh(dropGeo, dropMat);
    m.layers.set(1);
    m.visible = false;
    root.add(m);
    return { m, v: new THREE.Vector3() };
  });
  const splash = (p, n = 6, power = 1) => {
    for (let i = 0; i < n; i++) {
      const d = drops.find((x) => !x.m.visible);
      if (!d) return;
      const a = Math.random() * Math.PI * 2;
      d.m.position.set(p.x, p.y + 0.1, p.z);
      d.v.set(Math.cos(a) * rand(0.6, 1.6) * power, rand(2.4, 4.4) * power, Math.sin(a) * rand(0.6, 1.6) * power);
      d.m.visible = true;
    }
  };

  // --- fish shadows that cruise around off the jetty --------------------------------------------------
  const body = new THREE.Shape();
  body.absellipse(0, 0, 0.46, 1, 0, Math.PI * 2, false, 0);
  const fin = new THREE.Shape([new THREE.Vector2(0, 0.75), new THREE.Vector2(-0.42, 1.5), new THREE.Vector2(0.42, 1.5)]);
  const shadowGeo = new THREE.ShapeGeometry([body, fin]).rotateX(-Math.PI / 2);
  // drawn a little above the water and pulled forward in depth, so wave crests don't slice through them
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x17324d, transparent: true, opacity: 0.26, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -40,
  });
  const local = (a, l) => O.clone().addScaledVector(D, a).addScaledVector(side, l);
  const shadows = Array.from({ length: 5 }, (_, i) => {
    const m = new THREE.Mesh(shadowGeo, shadowMat.clone());
    m.layers.set(1);
    m.scale.setScalar(rand(0.7, 1.25));
    root.add(m);
    return { m, pos: local(rand(4, 12), rand(-4, 4)), heading: rand(0, Math.PI * 2), speed: rand(0.6, 1.1), turn: 0, seed: i * 7.3, mode: 'roam', until: 0 };
  });
  const zoneCentre = local(8, 0);
  // turn a shadow's heading part of the way (k) toward p, the short way round
  const turnToward = (f, p, k) => {
    const want = Math.atan2(p.x - f.pos.x, p.z - f.pos.z);
    f.heading += Math.atan2(Math.sin(want - f.heading), Math.cos(want - f.heading)) * k;
  };
  const inZone = (p) => {
    const v = p.clone().sub(O), a = v.dot(D), l = v.dot(side);
    return a > 3 && a < 14 && Math.abs(l) < 0.55 * a + 1;
  };

  // --- HUD ---------------------------------------------------------------------------------------
  const hud = document.createElement('div');
  hud.className = 'isl-fish';
  hud.innerHTML = `
    <div class="fish-bar">
      <button type="button" class="jelly small" data-act="leave">← back to the island</button>
      <button type="button" class="jelly small" data-act="journal" style="--c:var(--jelly-yellow)">journal <b data-count></b></button>
      <button type="button" class="jelly small" data-act="sound" aria-pressed="${sfx.on}">sound</button>
    </div>
    <div class="fish-panel">
      <p class="fish-say" data-say></p>
      <div class="fish-meter" data-power><i></i></div>
      <div class="fish-reel">
        <div class="fish-meter tension" data-tension><i></i><span>line tension</span></div>
        <div class="fish-track"><span class="fish-home"></span><span class="fish-dot" data-dot></span></div>
      </div>
    </div>
    <div class="fish-pop" data-pop></div>`;
  stage.appendChild(hud);
  const $ = (sel) => hud.querySelector(sel);
  const sayEl = $('[data-say]'), powerEl = $('[data-power]'), tensionEl = $('[data-tension]'), dotEl = $('[data-dot]'), pop = $('[data-pop]');
  const alert = document.createElement('div');
  alert.className = 'bubble fish-alert';
  labels.appendChild(alert);
  const calm = () => {
    alert.classList.remove('show');
    hud.classList.remove('warn');
  };

  // the little sign that invites people in, hovering over the jetty
  const tag = document.createElement('a');
  tag.className = 'fish-tag';
  tag.href = '/#fishing';
  labels.appendChild(tag);
  const tagAt = O.clone().addScaledVector(D, -4.5).setY(3.4);

  const total = SPECIES.length;
  const caughtCount = () => SPECIES.filter((s) => log[s.id]).length;
  const refreshCounts = () => {
    const n = caughtCount();
    $('[data-count]').textContent = `${n}/${total}`;
    tag.innerHTML = `gone fishing${n ? ` <small>${n}/${total}</small>` : ''}`;
  };
  refreshCounts();

  let sayTimer = 0;
  const say = (html, { shake = false, hold = 0 } = {}) => {
    sayEl.innerHTML = html;
    sayEl.classList.remove('shake');
    if (shake) {
      void sayEl.offsetWidth; // restart the animation
      sayEl.classList.add('shake');
    }
    sayTimer = hold ? now + hold : 0;
  };
  const readyText = () => `hold to cast, let go to throw<small>${coarse ? 'drag' : 'move'} to aim · farther out, rarer fish${night ? ' · something glows out there at night' : ''}</small>`;

  // --- state ---------------------------------------------------------------------------------------
  let state = 'off', since = 0, now = 0;
  let active = false, holding = false;
  let aim = 0, power = 0, castDist = 0, catchS = null;
  let flight = null, biteAt = 0, biteUntil = 0, nibbles = [], biter = null;
  let reel = null, leap = null, retrieveFrom = null;
  const tipW = new THREE.Vector3(), bobW = new THREE.Vector3();
  const set = (s) => {
    state = s;
    since = now;
    hud.dataset.state = s;
  };
  const dirAt = (a) => D.clone().multiplyScalar(Math.cos(a)).addScaledVector(side, Math.sin(a));
  const surface = (p, t) => waveAt(p.x, p.z, t);

  function choose(dist) {
    const far = clamp((dist - CAST_MIN) / CAST_RANGE, 0, 1);
    const pool = SPECIES.filter((s) => (s.id !== 'bottle' || data.posts.length) && (!s.night || night));
    const weights = pool.map((s) => {
      if (s.junk) return s.weight * (1 - far * 0.5);
      const w = RARITY[s.rarity].weight * (s.rarity >= 2 ? 1 + far * 1.6 : 1) * (s.rarity === 3 ? 1 + far * 2 : 1);
      return s.night ? w * 1.8 : w;
    });
    let r = Math.random() * weights.reduce((a, b) => a + b, 0);
    return pool.find((_, i) => (r -= weights[i]) < 0) ?? pool[0];
  }

  // --- input ----------------------------------------------------------------------------------------
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), water = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hit = new THREE.Vector3();
  const aimFrom = (e) => {
    ray.setFromCamera(pointerNdc(e, canvas, ndc), camera);
    if (!ray.ray.intersectPlane(water, hit)) return;
    const v = hit.sub(O);
    aim = clamp(Math.atan2(v.dot(side), v.dot(D)), -AIM_MAX, AIM_MAX);
  };

  function down() {
    if (!active || holding) return;
    holding = true;
    if (state === 'ready') set('charging');
    else if (state === 'waiting') spooked();
    else if (state === 'bite') hooked();
  }
  function up() {
    if (!holding) return;
    holding = false;
    if (state === 'charging') cast();
  }
  const onPointerDown = (e) => {
    if (!active || pop.childElementCount) return;
    if (e.pointerType !== 'mouse' || e.button === 0) {
      aimFrom(e);
      down();
    }
  };
  const onPointerMove = (e) => active && (state === 'ready' || state === 'charging') && aimFrom(e);
  const onKey = (e) => {
    if (!active) return;
    if (e.key === 'Escape') {
      e.stopImmediatePropagation();
      if (pop.childElementCount) closePop();
      else exit();
      return;
    }
    if (e.code !== 'Space' && e.key !== 'Enter') return;
    e.preventDefault();
    // a HUD button keeps focus after a click; Space should still cast rather than press it again
    if (e.target instanceof HTMLElement && e.target.closest('.fish-bar')) e.target.blur();
    if (e.type === 'keyup') return up();
    if (e.repeat) return;
    if (pop.childElementCount) return pop.querySelector('[data-act="again"]')?.click();
    down();
  };
  const onKeyArrow = (e) => {
    if (!active || (state !== 'ready' && state !== 'charging')) return;
    if (e.key === 'ArrowLeft') aim = clamp(aim + 0.08, -AIM_MAX, AIM_MAX);
    if (e.key === 'ArrowRight') aim = clamp(aim - 0.08, -AIM_MAX, AIM_MAX);
  };
  // a long press is how you cast and reel, so it must not open the browser's context menu
  const onContextMenu = (e) => active && e.preventDefault();
  stage.addEventListener('contextmenu', onContextMenu);
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);
  window.addEventListener('keydown', onKey, true);
  window.addEventListener('keyup', onKey, true);
  window.addEventListener('keydown', onKeyArrow);

  hud.addEventListener('click', (e) => {
    const nav = e.target.closest('a[data-nav]');
    if (nav) {
      e.preventDefault();
      exit();
      navigate(nav.getAttribute('href'));
      return;
    }
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'leave') exit();
    else if (act === 'journal' && pop.querySelector('.fish-journal')) closePop();
    else if (act === 'journal') showJournal();
    else if (act === 'sound') e.target.closest('button').setAttribute('aria-pressed', sfx.toggle());
    else if (act === 'again' || act === 'close') closePop();
  });
  tag.addEventListener('click', (e) => {
    e.preventDefault();
    onEnter?.();
  });

  // --- the phases of a cast ----------------------------------------------------------------------------
  function cast() {
    castDist = castReach(power);
    const to = O.clone().addScaledVector(dirAt(aim), castDist);
    flight = { from: tipW.clone(), to, dur: 0.5 + castDist * 0.03, h: 1.6 + castDist * 0.22 };
    rodTiltTo = 1.15;
    aimRing.visible = false;
    sfx.play('cast');
    set('flying');
    say('…');
  }

  function land() {
    ripple(bobW, 1.6);
    splash(bobW, 5, 0.7);
    sfx.play('plop');
    catchS = choose(castDist);
    biteAt = now + rand(1.8, 4.8);
    nibbles = [biteAt - 1.1, biteAt - 0.55].filter(() => Math.random() < 0.7);
    biter = shadows.reduce((a, b) => (a.pos.distanceTo(bobW) < b.pos.distanceTo(bobW) ? a : b));
    rodTiltTo = 0.85;
    set('waiting');
    say(`waiting for a bite…<small>${press} the moment the float goes under</small>`);
  }

  function spooked() {
    flee();
    sfx.play('miss');
    say('too early, it swam off', { shake: true, hold: 1.8 });
    retrieve();
  }

  function hooked() {
    alert.classList.remove('show');
    reel = {
      dist: castDist, max: Math.min(castDist + 3.5, 15), T: 0.15, thrash: false, warned: false,
      next: now + rand(0.8, 1.5), aim, aimTo: aim, tick: 0, start: now, splashAt: 0,
    };
    sfx.play('splash');
    splash(bobW, 6, 0.8);
    set('reeling');
    say(`it’s on! hold to reel<small>ease off when it thrashes, or the line will snap</small>`);
  }

  function lost(text, sound = 'miss') {
    calm();
    flee();
    sfx.play(sound);
    say(text, { shake: true, hold: 2 });
    retrieve();
  }

  function flee() {
    if (!biter) return;
    biter.mode = 'flee';
    biter.until = now + 2;
    biter.heading = Math.atan2(biter.pos.x - O.x, biter.pos.z - O.z);
    biter = null;
  }

  function retrieve() {
    retrieveFrom = bobW.clone();
    reel = null;
    set('retrieve');
  }

  function landed() {
    const s = catchS;
    const [lo, hi] = s.size;
    const size = Math.round(lo + (hi - lo) * Math.pow(Math.random(), 1.6));
    const prev = log[s.id];
    log[s.id] = { n: (prev?.n ?? 0) + 1, best: Math.max(prev?.best ?? 0, size) };
    saveLog(log);
    refreshCounts();
    if (!s.junk) {
      tail.material = mat(hex(s.fin));
      tail.visible = true;
    }
    sfx.play('catch');
    showCard(s, size, !prev);
  }

  // --- pop-ups: the catch card and the journal ----------------------------------------------------------
  const stars = (r) => '★'.repeat(RARITY[r].stars) + '☆'.repeat(4 - RARITY[r].stars);
  function showCard(s, size, isNew) {
    const R = RARITY[s.rarity];
    const post = s.id === 'bottle' ? data.posts[Math.floor(Math.random() * data.posts.length)] : null;
    pop.innerHTML = `<div class="fish-card" role="dialog" aria-label="${esc(s.name)}">
      ${isNew ? '<span class="chip new" style="--c:var(--jelly-pink)">new!</span>' : ''}
      <div class="art">${fishSVG(s)}</div>
      <p class="hand">${s.junk ? 'you fished out' : 'you caught a'}</p>
      <h3>${esc(s.name)}</h3>
      <div class="meta">
        <span class="chip">${size} cm</span>
        <span class="chip" style="--c:${R.color}">${stars(s.rarity)} ${R.label}</span>
        ${!isNew ? `<span class="chip">best ${log[s.id].best} cm</span>` : ''}
      </div>
      <p class="flavor">${esc(s.note)}</p>
      ${post ? `<p class="letter" lang="zh-CN"><b>${esc(post.title)}</b>${esc(post.description)}</p>` : ''}
      <div class="actions">
        ${post ? `<a class="jelly" style="--c:var(--jelly-blue)" href="/blog/${esc(post.slug)}" data-nav>read the note →</a>` : ''}
        <button type="button" class="jelly" style="--c:var(--jelly-green)" data-act="again">keep fishing</button>
      </div>
    </div>`;
    pop.querySelector('[data-act="again"]').focus({ preventScroll: true });
    set('card');
  }

  function showJournal() {
    if (pop.querySelector('.fish-card')) closePop();
    const n = caughtCount();
    pop.innerHTML = `<div class="fish-journal" role="dialog" aria-label="Fishing journal">
      <header><div><p class="hand">fishing journal</p><h3>${n} of ${total} found</h3></div>
        <button type="button" class="jelly round close" data-act="close" aria-label="Close">×</button></header>
      <div class="fj-grid">${SPECIES.map((s) => {
        const got = log[s.id];
        return `<div class="fj-item ${got ? '' : 'unseen'}">
          <div class="art">${fishSVG(s)}</div>
          <b>${got ? esc(s.name) : '???'}</b>
          <span>${got ? `best ${got.best} cm · ×${got.n}` : s.night ? 'only comes out at night' : `${RARITY[s.rarity].label}${s.junk ? ' junk' : ''}`}</span>
        </div>`;
      }).join('')}</div>
    </div>`;
    pop.querySelector('[data-act="close"]').focus({ preventScroll: true });
  }

  function closePop() {
    const wasCard = !!pop.querySelector('.fish-card');
    pop.innerHTML = '';
    if (wasCard && leap) {
      root.remove(leap.model);
      leap = null;
      set('ready');
      say(readyText());
    }
  }

  // --- enter / exit --------------------------------------------------------------------------------------
  function enter() {
    if (active) return;
    active = true;
    stage.classList.add('is-fishing');
    rodTiltTo = 0.75;
    set('ready');
    say(readyText());
  }

  function exit() {
    if (!active) return;
    active = false;
    holding = false;
    pop.innerHTML = '';
    if (leap) root.remove(leap.model);
    leap = reel = flight = null;
    if (biter) flee();
    calm();
    aimRing.visible = false;
    stage.classList.remove('is-fishing');
    rodTiltTo = 0.4;
    set('off');
    onExit?.();
  }

  const view = (aspect) => {
    // looking fairly steeply down, so the frame is mostly sea rather than the paper beyond it
    const back = 6.5 * Math.max(1, 1.3 / aspect);
    return {
      pos: O.clone().addScaledVector(D, -back).addScaledVector(side, 1.2).setY(O.y + 4.5 + back * 0.62),
      target: O.clone().addScaledVector(D, 6.5).setY(-0.6),
    };
  };

  // --- per frame ------------------------------------------------------------------------------------------
  const hang = new THREE.Vector3();
  function update(t, dt) {
    now = t;
    if (sayTimer && now > sayTimer) {
      sayTimer = 0;
      if (state === 'ready') say(readyText());
    }

    // rod pose
    rodTilt += (rodTiltTo - rodTilt) * Math.min(1, dt * (state === 'flying' ? 14 : 6));
    if (state === 'charging') {
      power = 1 - Math.abs(((since === now ? 0 : (now - since) * 0.85) % 2) - 1);
      rodTiltTo = 0.75 - power * 0.95;
      powerEl.style.setProperty('--p', power.toFixed(3));
    }
    tilt.rotation.x = rodTilt;
    const bendTo = state === 'reeling' && reel ? 0.25 + reel.T * 0.9 + (reel.thrash ? Math.sin(now * 38) * 0.06 : 0) : state === 'waiting' ? 0.12 : 0;
    bend += (bendTo - bend) * Math.min(1, dt * 10);
    joints.forEach((j, i) => (j.rotation.x = bend * (0.2 + i * 0.4)));
    rod.updateMatrixWorld(true);
    tip.getWorldPosition(tipW);
    hang.copy(tipW).y -= 0.95;

    // where the float is
    let slack = 0.25;
    if (state === 'off' || state === 'ready' || state === 'charging' || state === 'card') {
      bobW.copy(hang);
      bobW.x += Math.sin(t * 1.3) * 0.05;
      slack = 0;
    } else if (state === 'flying') {
      const k = Math.min(1, (now - since) / flight.dur);
      bobW.lerpVectors(flight.from, flight.to, k);
      bobW.y = THREE.MathUtils.lerp(flight.from.y, surface(flight.to, t), k) + Math.sin(k * Math.PI) * flight.h;
      slack = 0.6 * (1 - k);
      if (k >= 1) land();
    } else if (state === 'waiting' || state === 'bite') {
      let dip = 0;
      for (const n of nibbles) if (now > n && now < n + 0.18) dip = -0.09 * Math.sin(((now - n) / 0.18) * Math.PI);
      if (nibbles.length && now > nibbles[0] + 0.01) {
        nibbles.shift();
        ripple(bobW, 0.7, 0.5);
        sfx.play('nibble');
      }
      if (state === 'waiting' && now >= biteAt) {
        set('bite');
        biteUntil = now + catchS.window;
        ripple(bobW, 2, 1);
        splash(bobW, 7, 0.9);
        sfx.play('bite');
        alert.textContent = '!';
        alert.classList.add('show');
        say(`${press} now!`);
      }
      if (state === 'bite') {
        dip = -0.32 + Math.sin(now * 40) * 0.04;
        if (now > biteUntil) lost('it got away…');
      }
      bobW.copy(flight.to);
      bobW.y = surface(bobW, t) + 0.04 + dip;
    } else if (state === 'reeling') {
      reelStep(dt);
      if (reel) {
        bobW.copy(O).addScaledVector(dirAt(reel.aim), reel.dist);
        bobW.y = surface(bobW, t) + (reel.thrash ? -0.18 + Math.sin(now * 33) * 0.06 : -0.04);
      }
      slack = 0;
    } else if (state === 'retrieve') {
      const k = Math.min(1, (now - since) / 0.45);
      bobW.lerpVectors(retrieveFrom, hang, k);
      bobW.y += Math.sin(k * Math.PI) * 0.8;
      if (k >= 1) {
        set(active ? 'ready' : 'off');
        rodTiltTo = active ? 0.75 : 0.4;
        if (active && !sayTimer) say(readyText());
      }
    } else if (state === 'leap') {
      bobW.copy(hang);
      slack = 0;
      const k = Math.min(1, (now - since) / 0.85);
      leap.model.position.lerpVectors(leap.from, leap.to, k);
      leap.model.position.y += Math.sin(k * Math.PI) * 2.6;
      leap.model.rotation.z = leap.spin * (1 - k) * 6;
      if (k >= 1) landed();
    }
    if (leap && state === 'card') {
      leap.model.rotation.y += dt * 1.2;
      leap.model.position.y = leap.to.y + Math.sin(t * 2.2) * 0.12;
    }
    bobber.position.copy(bobW);
    bobber.visible = state !== 'leap' && state !== 'card';

    // line from the rod tip to the float, sagging when slack
    for (let i = 0; i < LN; i++) {
      const u = i / (LN - 1);
      linePos[i * 3] = tipW.x + (bobW.x - tipW.x) * u;
      linePos[i * 3 + 1] = tipW.y + (bobW.y + 0.28 - tipW.y) * u - slack * 4 * u * (1 - u);
      linePos[i * 3 + 2] = tipW.z + (bobW.z - tipW.z) * u;
    }
    lineGeo.attributes.position.needsUpdate = true;
    line.visible = bobber.visible;

    // aim ring
    if (state === 'ready' || state === 'charging') {
      const d = state === 'charging' ? castReach(power) : 6;
      aimRing.position.copy(O).addScaledVector(dirAt(aim), d);
      aimRing.position.y = surface(aimRing.position, t) + 0.08;
      aimRing.scale.setScalar(state === 'charging' ? 1 + power * 0.6 : 1 + Math.sin(t * 4) * 0.08);
      aimRing.material.opacity = state === 'charging' ? 0.95 : 0.5;
      aimRing.visible = true;
    }

    // fish shadows
    for (const f of shadows) {
      let target = null;
      if (f === biter && (state === 'waiting' || state === 'bite') && now > biteAt - 2.4) target = bobW;
      else if (f === biter && state === 'reeling') target = bobW;
      if (f.mode === 'flee' && now > f.until) f.mode = 'roam';
      let sp;
      if (target) {
        turnToward(f, target, Math.min(1, dt * 4));
        const d = Math.hypot(target.x - f.pos.x, target.z - f.pos.z);
        sp = state === 'reeling' ? Math.min(d * 6, 6) : Math.min(d * 1.5, 1.4);
      } else {
        f.turn += (Math.sin(t * 0.7 + f.seed) * 0.8 - f.turn) * dt;
        if (f.mode === 'roam' && !inZone(f.pos)) turnToward(f, zoneCentre, Math.min(1, dt * 1.5));
        else f.heading += f.turn * dt;
        sp = f.mode === 'flee' ? 4 : f.speed;
      }
      f.pos.x += Math.sin(f.heading) * sp * dt;
      f.pos.z += Math.cos(f.heading) * sp * dt;
      f.m.position.set(f.pos.x, surface(f.pos, t) + 0.14, f.pos.z);
      f.m.rotation.y = f.heading + Math.sin(t * 6 + f.seed) * 0.12;
      // the hooked fish is right under the float, so its shadow fades rather than covering it
      const under = f === biter ? clamp(Math.hypot(bobW.x - f.pos.x, bobW.z - f.pos.z) / 1.5, 0, 1) : 1;
      f.m.material.opacity = (night ? 0.4 : 0.26) * under;
    }

    // ripples & droplets
    for (const r of ripples) {
      if (!r.m.visible) continue;
      r.k += dt / r.life;
      if (r.k >= 1) {
        r.m.visible = false;
        continue;
      }
      r.m.position.y = surface(r.m.position, t) + 0.06;
      r.m.scale.setScalar(0.2 + r.k * r.size);
      r.m.material.opacity = 0.85 * (1 - r.k);
    }
    for (const d of drops) {
      if (!d.m.visible) continue;
      d.v.y -= 12 * dt;
      d.m.position.addScaledVector(d.v, dt);
      if (d.v.y < 0 && d.m.position.y < surface(d.m.position, t)) d.m.visible = false;
    }

    // DOM bits that follow the scene
    if (alert.classList.contains('show')) placeAt(alert, bobW.clone().setY(bobW.y + 1.1), 'translate(-50%, -100%)');
    placeAt(tag, tagAt, 'translate(-50%, -100%) rotate(-3deg)');
  }

  function reelStep(dt) {
    const r = reel;
    const tire = 1 - 0.5 * Math.min(1, (now - r.start) / 25);
    const f = catchS.fight * tire;
    if (!r.thrash && !r.warned && now > r.next - 0.4) {
      r.warned = true;
      alert.textContent = '!!';
      alert.classList.add('show');
      hud.classList.add('warn');
    }
    if (now >= r.next) {
      r.thrash = !r.thrash;
      r.warned = false;
      r.next = now + (r.thrash ? rand(0.45, 0.8) + f * 0.35 : rand(1.0, 2.0) - f * 0.3);
      r.aimTo = clamp(r.aim + rand(-0.4, 0.4), -0.6, 0.6);
      if (r.thrash) sfx.play('splash');
      else calm();
    }
    if (holding) {
      r.T += dt * (r.thrash ? 0.5 + 0.7 * f : 0.1 + 0.12 * f);
      r.dist -= dt * (r.thrash ? 0.5 : 3.0 - 0.8 * f);
      if ((r.tick -= dt) < 0) {
        r.tick = 0.07;
        sfx.play('tick');
      }
    } else {
      r.T -= dt * 0.55;
      r.dist += dt * (r.thrash ? 0.6 + 0.9 * f : 0.2 + 0.3 * f);
    }
    if (r.thrash && now > r.splashAt) {
      r.splashAt = now + 0.22;
      ripple(bobW, 1.2, 0.6);
      splash(bobW, 2, 0.6);
    }
    r.aim += (r.aimTo - r.aim) * Math.min(1, dt * 1.5);
    r.T = clamp(r.T, 0, 1);
    tensionEl.style.setProperty('--p', r.T.toFixed(3));
    tensionEl.dataset.level = r.T > 0.8 ? 'danger' : r.T > 0.55 ? 'hot' : 'ok';
    dotEl.style.setProperty('--d', clamp((r.max - r.dist) / (r.max - 1.4), 0, 1).toFixed(3));
    if (!dotEl.innerHTML) dotEl.innerHTML = fishSVG({ ...catchS, junk: false, pattern: 'none', shape: 'oval', body: '#5d7896', fin: '#3e5670' });

    if (r.T >= 1) lost('snap! the line broke', 'snap');
    else if (r.dist >= r.max) lost('it pulled the line out and got away');
    else if (r.dist <= 1.4) {
      calm();
      dotEl.innerHTML = '';
      const model = catchModel(catchS);
      model.scale.setScalar(catchS.junk ? 0.8 : 0.55 + (catchS.size[1] / 110) * 0.5);
      model.rotation.y = Math.atan2(D.x, D.z) + Math.PI / 2;
      root.add(model);
      leap = { model, from: bobW.clone(), to: O.clone().addScaledVector(D, -0.6).setY(O.y + 2.3), spin: Math.random() < 0.5 ? -1 : 1 };
      splash(bobW, 10, 1.1);
      ripple(bobW, 2.2, 1);
      sfx.play('splash');
      biter = null;
      reel = null;
      set('leap');
      say('got it!');
    }
  }

  return {
    get active() {
      return active;
    },
    pickables: [rod, bucket],
    view,
    enter,
    exit,
    update,
    setNight(on) {
      night = on;
      if (state === 'ready') say(readyText());
    },
    dispose() {
      stage.removeEventListener('contextmenu', onContextMenu);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('keyup', onKey, true);
      window.removeEventListener('keydown', onKeyArrow);
      hud.remove();
      tag.remove();
      alert.remove();
    },
  };
}
