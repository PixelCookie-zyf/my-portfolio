import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { rng, css, stripeTexture, signTexture, codeTexture, handTexture } from './textures.js';

// Palette follows pixelcookie.me: paper, tomato, forest, ochre, blue and the sticky-note tints.
export const C = {
  stone: 0xe6dece, stoneDark: 0xcdc2ad,
  wall: 0xfbf9f4, wallBlue: 0xdde5f3, wallPink: 0xf5d3c5, wallMint: 0xd3e6d6, wallYellow: 0xf6e3a6,
  trim: 0xe3cfa8, brick: 0xe9dcc8,
  roofRed: 0xd9532f, roofGreen: 0x2e6a4f, roofBlue: 0x3253b3, roofYellow: 0xe3a63a,
  roofCoral: 0xe0866a, roofTeal: 0x4f8f7e, roofPurple: 0x7a6aa8,
  glass: 0x9cc3e6, white: 0xffffff,
  wood: 0xc08a5a, woodDark: 0x8a5d3b, woodLight: 0xe2bd8a, straw: 0xe6c88e, strawLight: 0xf3e0b2,
  door: 0x8a5d3b,
  pink: 0xef9aa6, red: 0xd9532f, orange: 0xe8873e, yellow: 0xf2c84b, teal: 0x4fa79a,
  blue: 0x3253b3, navy: 0x2b3a67, mint: 0xa9d6c0, cream: 0xfbf3df, waffle: 0xe0a35a,
  leaf: 0x7fb069, leafDark: 0x5a9160, leafLight: 0xa3c97f, pine: 0x3f7a5a,
  trunk: 0x8f6a4a, trunkLight: 0xaa8460, coconut: 0x7a5236,
  rock: 0xb5ab9f, rockDark: 0x988e83,
  metal: 0x3c4a4a, lamp: 0xfff0b0, ink: 0x1d1b18, fountain: 0x9fd0e0,
  cookie: 0xe0a25a, cookieDark: 0xbf7d3c, chocolate: 0x5a3a2a, laptop: 0xd8dadc,
  fur: 0x9c958d, furLight: 0xf4efe6, furDark: 0x4a4440, earPink: 0xe8b4a4,
};

const shade = (hex, f) => new THREE.Color(hex).multiplyScalar(f).getHex();
export const tint = (hex, f) => new THREE.Color(hex).lerp(new THREE.Color(0xffffff), f).getHex();

// ---------------------------------------------------------------------------
// helpers

const mats = new Map();
export function mat(color, o = {}) {
  const { map = null, emissive = 0, side = THREE.FrontSide, vertexColors = false } = o;
  const key = `${color}|${map ? map.uuid : ''}|${emissive}|${side}|${vertexColors}`;
  let m = mats.get(key);
  if (!m) {
    m = new THREE.MeshLambertMaterial({ color, map, emissive, side, vertexColors, flatShading: true });
    mats.set(key, m);
  }
  return m;
}

export function add(parent, geo, material, x = 0, y = 0, z = 0, o = {}) {
  const mesh = new THREE.Mesh(geo, typeof material === 'number' ? mat(material) : material);
  mesh.position.set(x, y, z);
  mesh.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0);
  if (Array.isArray(o.s)) mesh.scale.set(...o.s);
  else if (o.s !== undefined) mesh.scale.setScalar(o.s);
  mesh.castShadow = o.cast !== false;
  mesh.receiveShadow = o.receive !== false;
  parent.add(mesh);
  return mesh;
}

// box / cyl take the BOTTOM y; ball takes the centre
export const box = (p, w, h, d, c, x = 0, y = 0, z = 0, o) =>
  add(p, new THREE.BoxGeometry(w, h, d), c, x, y + h / 2, z, o);
export const cyl = (p, rt, rb, h, seg, c, x = 0, y = 0, z = 0, o) =>
  add(p, new THREE.CylinderGeometry(rt, rb, h, seg), c, x, y + h / 2, z, o);
export const ball = (p, r, detail, c, x = 0, y = 0, z = 0, o) =>
  add(p, new THREE.IcosahedronGeometry(r, detail), c, x, y, z, o);

function group(parent, x = 0, y = 0, z = 0, ry = 0) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = ry;
  parent.add(g);
  return g;
}

// Extrudes a shape drawn in (x, z) upward from y = 0 to y = depth.
export function extrudeXZ(shape, depth, o = {}) {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: !!o.bevel,
    bevelThickness: o.bevel || 0,
    bevelSize: o.bevel || 0,
    bevelSegments: 1,
    curveSegments: o.curve || 6,
  });
  geo.rotateX(Math.PI / 2);
  geo.translate(0, depth, 0);
  return geo;
}

function roundedRect(w, d, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -d / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + d - r);
  s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
  s.lineTo(x + r, y + d);
  s.quadraticCurveTo(x, y + d, x, y + d - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function ring(rOut, rIn) {
  const s = new THREE.Shape();
  s.absarc(0, 0, rOut, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absarc(0, 0, rIn, 0, Math.PI * 2, true);
  s.holes.push(hole);
  return s;
}

export const plate = (p, w, d, h, c, x = 0, y = 0, z = 0, r = 0.9) =>
  add(p, extrudeXZ(roundedRect(w, d, r), h, { curve: 4 }), c, x, y, z);

// Paints each triangle by the angular sector its centroid falls in (beach umbrellas, balls).
function sectorColors(geo, colors, sectors) {
  geo = geo.index ? geo.toNonIndexed() : geo;
  const pos = geo.attributes.position, col = new Float32Array(pos.count * 3), c = new THREE.Color();
  for (let i = 0; i < pos.count; i += 3) {
    const cx = (pos.getX(i) + pos.getX(i + 1) + pos.getX(i + 2)) / 3;
    const cz = (pos.getZ(i) + pos.getZ(i + 1) + pos.getZ(i + 2)) / 3;
    const a = (Math.atan2(cz, cx) + Math.PI * 2) % (Math.PI * 2);
    c.setHex(colors[Math.floor((a / (Math.PI * 2)) * sectors) % colors.length]);
    for (let k = 0; k < 3; k++) col.set([c.r, c.g, c.b], (i + k) * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return geo;
}

const texCache = new Map();
function stripes(colors, count = 8) {
  const key = colors.join(',') + count;
  if (!texCache.has(key)) texCache.set(key, stripeTexture(colors.map(css), count));
  return texCache.get(key);
}

// ---------------------------------------------------------------------------
// building parts (all face local +z)

function windowAt(p, x, y, z, ry, o = {}) {
  const { w = 0.8, h = 0.95, frame = C.white, glass = C.glass, shutter = null } = o;
  const g = group(p, x, y, z, ry);
  const t = 0.13;
  box(g, w, h, 0.1, glass, 0, -h / 2, 0);
  box(g, w + t * 2, t, 0.18, frame, 0, h / 2, 0.07);
  box(g, w + t * 2 + 0.16, t, 0.28, frame, 0, -h / 2 - t, 0.11);
  box(g, t, h, 0.18, frame, -w / 2 - t / 2, -h / 2, 0.07);
  box(g, t, h, 0.18, frame, w / 2 + t / 2, -h / 2, 0.07);
  box(g, 0.06, h, 0.1, frame, 0, -h / 2, 0.04);
  box(g, w, 0.06, 0.1, frame, 0, -0.03, 0.04);
  if (shutter) {
    for (const sx of [-1, 1]) box(g, 0.3, h + 0.1, 0.08, shutter, sx * (w / 2 + t + 0.19), -h / 2 - 0.05, 0.03);
  }
  return g;
}

function doorAt(p, x, y, z, ry, color = C.door, frame = C.white, canopy = null) {
  const g = group(p, x, y, z, ry);
  const w = 0.85, h = 1.5;
  box(g, w, h, 0.1, color, 0, 0, 0);
  box(g, 0.13, h + 0.13, 0.18, frame, -w / 2 - 0.065, 0, 0.03);
  box(g, 0.13, h + 0.13, 0.18, frame, w / 2 + 0.065, 0, 0.03);
  box(g, w + 0.26, 0.13, 0.18, frame, 0, h, 0.03);
  box(g, 0.32, 0.32, 0.06, C.glass, 0, h * 0.6, 0.05);
  ball(g, 0.06, 0, C.yellow, w * 0.3, h * 0.48, 0.1);
  box(g, w + 0.7, 0.14, 0.6, C.stoneDark, 0, 0, 0.32);
  if (canopy) box(g, w + 0.6, 0.1, 0.6, canopy, 0, h + 0.22, 0.3, { rx: 0.28 });
  return g;
}

function awning(p, width, x, y, z, ry, tex) {
  const g = group(p, x, y, z, ry);
  const depth = 1.25, tilt = 0.42, m = mat(0xffffff, { map: tex });
  add(g, new THREE.BoxGeometry(width, 0.1, depth), m, 0, (-Math.sin(tilt) * depth) / 2, (Math.cos(tilt) * depth) / 2, { rx: tilt });
  add(g, new THREE.BoxGeometry(width, 0.38, 0.08), m, 0, -Math.sin(tilt) * depth - 0.17, Math.cos(tilt) * depth);
  return g;
}

function flowerBox(p, x, y, z, ry, seed) {
  const R = rng(seed);
  const g = group(p, x, y, z, ry);
  box(g, 1.0, 0.24, 0.3, C.woodDark, 0, 0, 0);
  for (let i = 0; i < 4; i++) {
    ball(g, 0.13, 0, [C.pink, C.yellow, C.red, C.white][Math.floor(R() * 4)], -0.36 + i * 0.24, 0.3, (R() - 0.5) * 0.08);
  }
  return g;
}

// ---------------------------------------------------------------------------
// buildings

export function house(o = {}) {
  const { w = 4.2, d = 3.6, h = 2.5, wall = C.wall, roof = C.roofRed, trim = C.trim, shutter = null, seed = 1 } = o;
  const R = rng(seed);
  const g = new THREE.Group();
  const b = 0.2;
  plate(g, w + 3.0, d + 3.0, b, C.stone);
  box(g, w + 0.24, 0.42, d + 0.24, trim, 0, b, 0);
  box(g, w, h, d, wall, 0, b, 0);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(g, 0.2, h, 0.2, trim, (sx * w) / 2, b, (sz * d) / 2);
  box(g, w + 0.16, 0.16, d + 0.16, trim, 0, b + h - 0.16, 0);

  // gable walls + two roof slabs + ridge cap
  const pitch = 0.7, over = 0.5, t = 0.3, top = b + h;
  const gh = (d / 2) * Math.tan(pitch);
  const tri = new THREE.Shape([new THREE.Vector2(-d / 2, 0), new THREE.Vector2(d / 2, 0), new THREE.Vector2(0, gh)]);
  const gable = new THREE.ExtrudeGeometry(tri, { depth: w, bevelEnabled: false });
  gable.translate(0, 0, -w / 2);
  gable.rotateY(Math.PI / 2);
  add(g, gable, wall, 0, top, 0);
  const L = (d / 2 + over) / Math.cos(pitch) + 0.05;
  for (const side of [1, -1]) {
    const c = new THREE.Vector3(0, top + gh, 0)
      .addScaledVector(new THREE.Vector3(0, -Math.sin(pitch), side * Math.cos(pitch)), L / 2)
      .addScaledVector(new THREE.Vector3(0, Math.cos(pitch), side * Math.sin(pitch)), t / 2);
    add(g, new THREE.BoxGeometry(w + 1.0, t, L), roof, c.x, c.y, c.z, { rx: side * pitch });
  }
  box(g, w + 1.1, 0.26, 0.5, shade(roof, 0.8), 0, top + gh + t * 0.55, 0);

  // chimney
  const chx = w * 0.27, chz = -d * 0.2;
  const roofAt = top + gh - Math.abs(chz) * Math.tan(pitch);
  const chTop = top + gh + 0.85;
  box(g, 0.62, chTop - roofAt + 0.2, 0.62, C.brick, chx, roofAt - 0.2, chz);
  box(g, 0.8, 0.2, 0.8, shade(C.brick, 0.88), chx, chTop, chz);
  box(g, 0.46, 0.04, 0.46, C.ink, chx, chTop + 0.18, chz);

  // openings
  const wy = b + h * 0.6;
  doorAt(g, -w * 0.22, b, d / 2 + 0.12, 0, o.door ?? C.door, C.white, roof);
  windowAt(g, w * 0.24, wy, d / 2, 0, { shutter });
  windowAt(g, w / 2, wy, 0, Math.PI / 2, { shutter });
  windowAt(g, 0, wy, -d / 2, Math.PI);
  windowAt(g, -w / 2, wy, 0, -Math.PI / 2);
  windowAt(g, w / 2, top + gh * 0.38, 0, Math.PI / 2, { w: 0.55, h: 0.55 });
  windowAt(g, -w / 2, top + gh * 0.38, 0, -Math.PI / 2, { w: 0.55, h: 0.55 });
  flowerBox(g, w * 0.24, wy - 0.95 / 2 - 0.5, d / 2 + 0.2, 0, seed);

  ball(g, 0.5, 1, C.leaf, w / 2 + 0.9, b + 0.35, d / 2 + 0.9, { s: [1, 0.8, 1] });
  ball(g, 0.4, 1, C.leafDark, -w / 2 - 0.8, b + 0.3, -d / 2 - 0.7 + R() * 0.3, { s: [1, 0.8, 1] });
  return g;
}

// Writing: a stack of notebooks with a pencil on top.
export function booksTopper(p, y) {
  const g = group(p, 0, y, 0);
  const book = (yy, w, d, h, col, ry) => {
    const b = group(g, 0, yy, 0, ry);
    box(b, w, 0.08, d, col, 0, 0, 0);
    box(b, w, 0.08, d, col, 0, h - 0.08, 0);
    box(b, w - 0.16, h - 0.16, d - 0.14, C.cream, 0.06, 0.08, 0);
    box(b, 0.12, h, d, col, -w / 2 + 0.06, 0, 0);
    box(b, 0.14, h * 0.5, 0.5, C.cream, -w / 2 - 0.02, h * 0.25, 0);
  };
  book(0, 3.0, 2.1, 0.6, C.blue, 0.1);
  book(0.6, 2.7, 1.9, 0.52, C.red, -0.18);
  book(1.12, 2.4, 1.7, 0.46, C.roofGreen, 0.22);
  const pencil = group(g, 0.1, 1.58 + 0.12, 0.1, 0.7);
  add(pencil, new THREE.CylinderGeometry(0.12, 0.12, 2.0, 6), C.roofYellow, 0, 0, 0, { rz: Math.PI / 2 });
  add(pencil, new THREE.ConeGeometry(0.12, 0.38, 6), C.woodLight, 1.19, 0, 0, { rz: -Math.PI / 2 });
  add(pencil, new THREE.ConeGeometry(0.045, 0.14, 6), C.ink, 1.33, 0, 0, { rz: -Math.PI / 2 });
  add(pencil, new THREE.CylinderGeometry(0.125, 0.125, 0.14, 6), C.laptop, -1.07, 0, 0, { rz: Math.PI / 2 });
  add(pencil, new THREE.CylinderGeometry(0.12, 0.12, 0.22, 6), C.pink, -1.25, 0, 0, { rz: Math.PI / 2 });
  return g;
}

let screenMat = null;
// Projects: an open laptop with code on the screen (unlit, so it always reads as a screen).
export function laptopTopper(p, y) {
  const g = group(p, 0, y, 0, -0.35);
  box(g, 2.9, 0.16, 1.9, C.laptop, 0, 0, 0.1);
  box(g, 2.5, 0.03, 0.95, 0x3a3a3a, 0, 0.16, -0.08);
  box(g, 0.9, 0.03, 0.42, 0xb8bcc0, 0, 0.16, 0.66);
  const scr = group(g, 0, 0.12, -0.8);
  scr.rotation.x = -0.28;
  box(scr, 2.9, 1.9, 0.12, C.laptop, 0, 0, 0);
  screenMat ??= new THREE.MeshBasicMaterial({ map: codeTexture() });
  add(scr, new THREE.PlaneGeometry(2.6, 1.62), screenMat, 0, 0.95, 0.065, { cast: false });
  return g;
}

export function shop(o = {}) {
  const {
    w = 5.4, d = 4.4, h = 2.7, main = C.pink, wall = C.cream, name = 'SHOP',
    topper = null, stripeColors = [C.pink, C.white],
  } = o;
  const g = new THREE.Group();
  const b = 0.2, top = b + h;
  plate(g, w + 3.4, d + 3.4, b, C.stone);
  box(g, w + 0.24, 0.45, d + 0.24, main, 0, b, 0);
  box(g, w, h, d, wall, 0, b, 0);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(g, 0.24, h, 0.24, main, (sx * w) / 2, b, (sz * d) / 2);

  // flat roof with a raised rim
  const RW = w + 0.6, RD = d + 0.6, rt = 0.42, rh = 0.55;
  box(g, RW, 0.35, RD, main, 0, top, 0);
  box(g, RW, rh, rt, main, 0, top + 0.35, RD / 2 - rt / 2);
  box(g, RW, rh, rt, main, 0, top + 0.35, -RD / 2 + rt / 2);
  box(g, rt, rh, RD - rt * 2, main, RW / 2 - rt / 2, top + 0.35, 0);
  box(g, rt, rh, RD - rt * 2, main, -RW / 2 + rt / 2, top + 0.35, 0);
  box(g, RW - rt * 2, 0.04, RD - rt * 2, tint(main, 0.55), 0, top + 0.35, 0);

  // shop front
  const fz = d / 2;
  windowAt(g, -w * 0.29, b + 1.4, fz, 0, { w: 1.35, h: 1.15, frame: main });
  windowAt(g, w * 0.29, b + 1.4, fz, 0, { w: 1.35, h: 1.15, frame: main });
  doorAt(g, 0, b, fz + 0.12, 0, C.glass, main);
  windowAt(g, w / 2, b + 1.4, 0, Math.PI / 2, { w: 1.6, h: 1.1, frame: main });
  const tex = stripes(stripeColors, 10);
  awning(g, w + 0.3, 0, b + 2.45, fz + 0.05, 0, tex);
  awning(g, d * 0.7, w / 2 + 0.05, b + 2.45, 0, Math.PI / 2, tex);

  // sign
  const sw = w * 0.8, sh = 0.95, sy = top + 0.15, sz = RD / 2 + 0.1;
  box(g, sw, sh, 0.16, C.ink, 0, sy, sz);
  const signMat = mat(0xffffff, { map: signTexture(name, { bg: css(main), aspect: sw / sh, serif: true }) });
  add(g, new THREE.PlaneGeometry(sw, sh), signMat, 0, sy + sh / 2, sz + 0.085, { cast: false });

  topper?.(g, top + 0.39);

  ball(g, 0.45, 1, C.leaf, w / 2 + 1.1, b + 0.35, fz + 1.1, { s: [1, 0.85, 1] });
  ball(g, 0.45, 1, C.leafDark, -w / 2 - 1.1, b + 0.35, fz + 1.1, { s: [1, 0.85, 1] });
  return g;
}

function starShape(r = 0.2) {
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const a = Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r;
    s[i ? 'lineTo' : 'moveTo'](Math.cos(a) * rr, Math.sin(a) * rr);
  }
  return s;
}

// A beach resort: glass lobby under a canopy, balconied floors, a rooftop pool and a five-star sign.
export function hotel(o = {}) {
  const { w = 6.6, d = 5.0, floors = 2, main = C.roofTeal, wall = C.wall, name = 'Grand Hotel' } = o;
  const g = new THREE.Group();
  const b = 0.2, lobby = 2.3, fh = 1.85, fz = d / 2;
  const top = b + lobby + floors * fh;
  plate(g, w + 2.4, d + 3.6, b, C.stone);

  // lobby: plinth, glass shop-front either side of the doors
  box(g, w + 0.3, 0.42, d + 0.3, main, 0, b, 0);
  box(g, w, lobby, d, wall, 0, b, 0);
  for (const sx of [-1, 1]) {
    const pw = w / 2 - 1.25, px = sx * (0.85 + pw / 2);
    box(g, pw, 1.55, 0.1, C.glass, px, b + 0.5, fz + 0.02);
    for (let i = 0; i <= 2; i++) box(g, 0.13, 1.6, 0.18, C.white, px - pw / 2 + (i * pw) / 2, b + 0.48, fz + 0.06);
    box(g, pw + 0.2, 0.13, 0.22, C.white, px, b + 2.05, fz + 0.06);
  }
  doorAt(g, 0, b, fz + 0.12, 0, C.glass, C.yellow);
  for (const z of [-d / 4, d / 4]) windowAt(g, w / 2, b + 1.3, z, Math.PI / 2, { w: 1.2, h: 1.1, frame: main });

  // entrance canopy on gold posts, with a red carpet and potted palms
  const cy = b + lobby - 0.1;
  box(g, 2.7, 0.24, 2.1, main, 0, cy, fz + 1.05);
  box(g, 2.8, 0.08, 2.2, C.yellow, 0, cy - 0.08, fz + 1.05);
  for (const sx of [-1.2, 1.2]) cyl(g, 0.09, 0.09, cy - b, 6, C.yellow, sx, b, fz + 1.95);
  box(g, 1.1, 0.03, 2.6, C.red, 0, b, fz + 1.4);
  for (const sx of [-1.75, 1.75]) {
    cyl(g, 0.32, 0.24, 0.5, 8, C.roofCoral, sx, b, fz + 0.75);
    const tree = palm(sx > 0 ? 11 : 12, 3.2);
    tree.scale.setScalar(0.5);
    tree.position.set(sx, b + 0.45, fz + 0.75);
    g.add(tree);
  }

  // upper floors: a band per floor, French windows onto balconies at the front, shutters on the sides
  box(g, w, floors * fh, d, wall, 0, b + lobby, 0);
  const awnings = stripes([main, C.cream], 8), bays = 3, bw = w / bays;
  for (let f = 0; f < floors; f++) {
    const y0 = b + lobby + f * fh;
    box(g, w + 0.3, 0.2, d + 0.3, C.trim, 0, y0, 0);
    for (let i = 0; i < bays; i++) {
      const x = -w / 2 + bw * (i + 0.5);
      windowAt(g, x, y0 + 0.95, fz, 0, { w: 0.95, h: 1.2 });
      box(g, bw - 0.25, 0.14, 0.85, C.white, x, y0 + 0.1, fz + 0.42);
      box(g, bw - 0.25, 0.5, 0.06, tint(main, 0.55), x, y0 + 0.24, fz + 0.82);
      box(g, bw - 0.2, 0.08, 0.12, C.white, x, y0 + 0.74, fz + 0.82);
      for (const sx of [-1, 1]) box(g, 0.08, 0.6, 0.85, C.white, x + sx * (bw / 2 - 0.16), y0 + 0.2, fz + 0.42);
      awning(g, bw - 0.4, x, y0 + fh - 0.08, fz + 0.02, 0, awnings);
    }
    for (const z of [-d / 4, d / 4]) {
      windowAt(g, w / 2, y0 + 1.0, z, Math.PI / 2, { shutter: main });
      windowAt(g, -w / 2, y0 + 1.0, z, -Math.PI / 2, { shutter: main });
    }
    for (let i = 0; i < bays; i++) windowAt(g, -w / 2 + bw * (i + 0.5), y0 + 1.0, -fz, Math.PI);
  }

  // roof terrace: decking, parapet, a pool with loungers and an umbrella
  const RW = w + 0.4, RD = d + 0.4, rt = 0.25, rh = 0.45;
  box(g, RW, 0.3, RD, C.trim, 0, top, 0);
  box(g, RW - rt * 2, 0.04, RD - rt * 2, C.woodLight, 0, top + 0.3, 0);
  box(g, RW, rh, rt, C.white, 0, top + 0.3, RD / 2 - rt / 2);
  box(g, RW, rh, rt, C.white, 0, top + 0.3, -RD / 2 + rt / 2);
  box(g, rt, rh, RD - rt * 2, C.white, RW / 2 - rt / 2, top + 0.3, 0);
  box(g, rt, rh, RD - rt * 2, C.white, -RW / 2 + rt / 2, top + 0.3, 0);
  const pw = w * 0.48, pd = d * 0.56, px = -w * 0.2, pz = -0.25;
  box(g, pw + 0.4, 0.26, pd + 0.4, C.white, px, top + 0.3, pz);
  box(g, pw, 0.1, pd, 0x6fd0e0, px, top + 0.48, pz); // water sits just above the rim
  box(g, 0.5, 0.03, 0.9, C.white, px - pw * 0.25, top + 0.58, pz, { ry: 0.3 });
  const towels = [stripes([C.red, C.cream], 6), stripes([C.roofYellow, C.cream], 6)];
  [w * 0.17, w * 0.33].forEach((x, i) => deckChair(g, x, top + 0.34, 0.35, 0, towels[i]).scale.setScalar(0.75));
  umbrella(g, w * 0.25, top + 0.34, -1.45, [main, C.cream]).scale.setScalar(0.62);

  // name board on the front parapet, five gold stars on top
  const sw = w * 0.62, sh = 0.85, sy = top + 0.5, sz = RD / 2 + 0.05;
  box(g, sw, sh, 0.16, C.ink, 0, sy, sz);
  add(g, new THREE.PlaneGeometry(sw, sh), mat(0xffffff, { map: signTexture(name, { bg: css(main), aspect: sw / sh, serif: true }) }),
    0, sy + sh / 2, sz + 0.085, { cast: false });
  const star = new THREE.ExtrudeGeometry(starShape(0.21), { depth: 0.12, bevelEnabled: false });
  for (let i = 0; i < 5; i++) add(g, star, C.yellow, (i - 2) * 0.52, sy + sh + 0.3, sz - 0.06);

  ball(g, 0.5, 1, C.leaf, w / 2 + 0.8, b + 0.35, fz + 1.2, { s: [1, 0.85, 1] });
  ball(g, 0.45, 1, C.leafDark, -w / 2 - 0.8, b + 0.35, fz + 1.2, { s: [1, 0.85, 1] });
  return g;
}

export function hut() {
  const g = new THREE.Group();
  const R = rng(42);
  cyl(g, 3.1, 3.2, 0.22, 10, C.woodLight, 0, 0, 0);
  cyl(g, 2.15, 2.25, 1.2, 9, C.wood, 0, 0.22, 0);
  cyl(g, 2.27, 2.27, 0.16, 9, C.woodDark, 0, 0.32, 0);
  cyl(g, 2.55, 2.55, 0.18, 9, C.woodLight, 0, 1.42, 0);
  cyl(g, 1.5, 1.5, 1.35, 9, C.cream, 0, 1.6, 0);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + 0.3;
    cyl(g, 0.1, 0.12, 1.5, 6, C.woodDark, Math.cos(a) * 2.25, 1.6, Math.sin(a) * 2.25);
  }
  for (let i = 0; i < 5; i++) {
    const a = 0.9 + i * 0.32;
    cyl(g, 0.11, 0.09, 0.28, 6, [C.orange, C.pink, C.yellow, C.mint][i % 4], Math.cos(a) * 2.3, 1.6, Math.sin(a) * 2.3);
  }

  // thatched roof with loose planks
  const roofY = 2.95, roofR = 3.8, roofH = 1.6;
  add(g, new THREE.ConeGeometry(roofR, roofH, 10), C.straw, 0, roofY + roofH / 2, 0);
  add(g, new THREE.ConeGeometry(2.4, 1.6, 9), C.strawLight, 0, roofY + 1.8, 0, { ry: 0.2 });
  const slope = Math.atan2(roofH, roofR);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + R() * 0.2;
    const piv = group(g, 0, 0, 0, -a);
    const rm = 2.6 + R() * 0.5;
    const y = roofY + roofH * (1 - rm / roofR) + 0.07;
    add(piv, new THREE.BoxGeometry(1.3 + R() * 0.7, 0.06, 0.32 + R() * 0.15), R() < 0.5 ? C.strawLight : C.woodLight,
      rm, y, (R() - 0.5) * 0.3, { rz: -slope + (R() - 0.5) * 0.12, ry: (R() - 0.5) * 0.3 });
  }

  // giant coconut drink on top
  ball(g, 0.75, 1, C.coconut, 0, 5.85, 0, { s: [1, 0.9, 1] });
  cyl(g, 0.52, 0.52, 0.1, 8, C.cream, 0, 6.35, 0);
  cyl(g, 0.06, 0.06, 1.2, 5, C.pink, 0.2, 6.2, 0, { rz: -0.35 });
  cyl(g, 0.34, 0.34, 0.08, 8, C.yellow, 0.62, 6.0, 0.35, { rx: Math.PI / 2, ry: 0.6 });

  // sign leaning on the roof
  const sg = group(g, 0, roofY + 0.05, 3.35);
  sg.rotation.x = -0.35;
  box(sg, 2.8, 0.85, 0.14, C.ink, 0, 0, 0);
  add(sg, new THREE.PlaneGeometry(2.8, 0.85), mat(0xffffff, { map: signTexture('COCO BAR', { bg: css(C.orange), fg: css(C.yellow), aspect: 2.8 / 0.85 }) }),
    0, 0.425, 0.075, { cast: false });

  // stools
  [0.55, 1.2, 1.95, 2.6].forEach((a, i) => {
    const s = group(g, Math.cos(a) * 3.0, 0.22, Math.sin(a) * 3.0);
    for (let k = 0; k < 3; k++) {
      const la = (k / 3) * Math.PI * 2;
      box(s, 0.09, 0.72, 0.09, C.woodDark, Math.cos(la) * 0.24, 0, Math.sin(la) * 0.24);
    }
    cyl(s, 0.42, 0.42, 0.2, 8, [C.blue, C.yellow, C.leaf, C.pink][i], 0, 0.72, 0);
  });
  return g;
}

export function lighthouse() {
  const g = new THREE.Group();
  const R = rng(9);
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + R() * 0.4, r = 2.3 + R() * 1.0;
    rock(g, 0.8 + R() * 0.8, i % 2 ? C.rock : C.rockDark, Math.cos(a) * r, 0.1, Math.sin(a) * r, i + 3);
  }
  cyl(g, 2.3, 2.7, 1.0, 10, C.stone, 0, -0.2, 0);
  const H = 7.0, n = 5, r0 = 1.6, r1 = 1.05, y0 = 0.8;
  const rAt = (y) => r0 + (r1 - r0) * ((y - y0) / H);
  for (let i = 0; i < n; i++) {
    cyl(g, rAt(y0 + ((i + 1) * H) / n), rAt(y0 + (i * H) / n), H / n, 10, i % 2 ? C.red : C.white, 0, y0 + (i * H) / n, 0);
  }
  const top = y0 + H;
  cyl(g, 1.55, 1.2, 0.32, 10, C.navy, 0, top, 0);
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    box(g, 0.07, 0.55, 0.07, C.white, Math.cos(a) * 1.42, top + 0.32, Math.sin(a) * 1.42);
  }
  add(g, new THREE.TorusGeometry(1.42, 0.06, 4, 28), C.white, 0, top + 0.87, 0, { rx: Math.PI / 2 });
  cyl(g, 0.88, 0.88, 1.15, 10, mat(0xfff3b0, { emissive: 0xffc83d }), 0, top + 0.32, 0);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + 0.3;
    box(g, 0.1, 1.15, 0.1, C.navy, Math.cos(a) * 0.9, top + 0.32, Math.sin(a) * 0.9);
  }
  cyl(g, 1.1, 1.1, 0.15, 10, C.navy, 0, top + 1.47, 0);
  add(g, new THREE.ConeGeometry(1.15, 1.0, 10), C.red, 0, top + 2.12, 0);
  ball(g, 0.18, 0, C.yellow, 0, top + 2.75, 0);

  const face = group(g, 0, 0, 0, Math.PI / 4);
  doorAt(face, 0, y0, r0 + 0.02, 0, C.navy, C.white);
  windowAt(face, 0, y0 + 3.0, rAt(y0 + 3.0) - 0.04, 0, { w: 0.5, h: 0.65 });
  windowAt(face, 0, y0 + 5.3, rAt(y0 + 5.3) - 0.04, 0, { w: 0.45, h: 0.6 });
  return { group: g, lampY: top + 0.9 };
}

// ---------------------------------------------------------------------------
// harbour

function lifebuoy(p, x, y, z, ry, color = C.red) {
  return add(p, new THREE.TorusGeometry(0.36, 0.13, 6, 12), mat(0xffffff, { map: stripes([C.white, color], 8) }), x, y, z, { ry });
}

function crate(p, x, y, z, ry = 0, s = 1) {
  const g = group(p, x, y, z, ry);
  g.scale.setScalar(s);
  box(g, 0.7, 0.7, 0.7, C.woodLight, 0, 0, 0);
  for (const yy of [0, 0.56]) box(g, 0.76, 0.14, 0.76, C.wood, 0, yy, 0);
  return g;
}

function barrel(p, x, y, z) {
  const g = group(p, x, y, z);
  cyl(g, 0.32, 0.32, 0.8, 8, C.wood, 0, 0, 0);
  for (const yy of [0.12, 0.6]) cyl(g, 0.34, 0.34, 0.08, 8, C.metal, 0, yy, 0);
  return g;
}

export function pier(length = 18) {
  const g = new THREE.Group();
  const R = rng(77);
  const W = 2.6, top = 0.95, ph = 0.14, PW = 6.6, PL = 3.6;
  for (let z = 0.26; z < length; z += 0.52) {
    box(g, W + (R() - 0.5) * 0.1, ph, 0.46, R() < 0.5 ? C.wood : C.woodLight, (R() - 0.5) * 0.08, top - ph, z);
  }
  for (let z = length + 0.26; z < length + PL; z += 0.52) {
    box(g, PW + (R() - 0.5) * 0.1, ph, 0.46, R() < 0.5 ? C.wood : C.woodLight, 0, top - ph, z);
  }
  for (const sx of [-1, 1]) box(g, 0.24, 0.26, length + PL, C.woodDark, sx * (W / 2 - 0.2), top - ph - 0.26, (length + PL) / 2);
  const post = (x, z) => cyl(g, 0.17, 0.19, 2.9, 6, C.woodDark, x, -1.7, z);
  for (let z = 0.6; z < length; z += 2.8) {
    post(-W / 2 - 0.08, z);
    post(W / 2 + 0.08, z);
  }
  for (const x of [-PW / 2 - 0.08, PW / 2 + 0.08]) for (const z of [length + 0.4, length + PL - 0.3]) post(x, z);

  crate(g, -2.4, top, length + 1.2, 0.3);
  crate(g, -1.7, top, length + 1.0, -0.2, 0.8);
  crate(g, -2.2, top + 0.7, length + 1.15, 0.6, 0.75);
  barrel(g, 2.5, top, length + 2.7);
  barrel(g, 1.8, top, length + 2.9);
  lampPost(g, 2.7, top, length + 0.6);
  lifebuoy(g, -PW / 2 - 0.25, top + 0.35, length + 2.4, Math.PI / 2);
  return g;
}

// A short fishing jetty: faces local +z with its deck at y = 0.95, like the pier.
// The rod, float and bucket are animated by fishing.js; this is the static part.
export function jetty(length = 7, endLength = 2.4) {
  const g = new THREE.Group();
  const R = rng(31);
  const W = 1.9, EW = 3.2, top = 0.95, ph = 0.14;
  const plank = () => (R() < 0.5 ? C.wood : C.woodLight);
  for (let z = 0.25; z < length; z += 0.5) box(g, W + (R() - 0.5) * 0.1, ph, 0.44, plank(), (R() - 0.5) * 0.08, top - ph, z);
  for (let z = length + 0.25; z < length + endLength; z += 0.5) box(g, EW + (R() - 0.5) * 0.1, ph, 0.44, plank(), 0, top - ph, z);
  for (const sx of [-1, 1]) box(g, 0.22, 0.24, length + endLength, C.woodDark, sx * (W / 2 - 0.2), top - ph - 0.24, (length + endLength) / 2);
  const post = (x, z, h = 2.9) => cyl(g, 0.15, 0.17, h, 6, C.woodDark, x, -1.7, z);
  for (let z = 0.5; z < length; z += 2.4) for (const sx of [-1, 1]) post(sx * (W / 2 + 0.06), z);
  // the corner posts of the end platform stand proud as bollards, with a rope between them
  for (const sx of [-1, 1]) for (const z of [length + 0.3, length + endLength - 0.3]) post(sx * (EW / 2 + 0.06), z, 3.55);
  for (const sx of [-1, 1]) {
    add(g, new THREE.CylinderGeometry(0.045, 0.045, endLength - 0.6, 4), C.straw, sx * (EW / 2 + 0.06), top + 0.62, length + endLength / 2, { rx: Math.PI / 2 });
  }

  // stool and tackle box on the platform, a lamp for night fishing
  const sz = length + endLength * 0.4;
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    add(g, new THREE.CylinderGeometry(0.04, 0.04, 0.55, 4), C.woodDark, -0.85 + Math.cos(a) * 0.18, top + 0.27, sz + Math.sin(a) * 0.18, { rz: Math.cos(a) * 0.2, rx: -Math.sin(a) * 0.2 });
  }
  cyl(g, 0.3, 0.3, 0.12, 8, C.roofTeal, -0.85, top + 0.52, sz);
  box(g, 0.72, 0.38, 0.46, C.red, -0.95, top, length + 0.55, { ry: 0.25 });
  box(g, 0.74, 0.06, 0.48, shade(C.red, 0.8), -0.95, top + 0.38, length + 0.55, { ry: 0.25 });
  box(g, 0.3, 0.06, 0.08, C.metal, -0.95, top + 0.44, length + 0.55, { ry: 0.25 });
  lampPost(g, EW / 2 - 0.35, top, length + endLength - 0.45);

  // "gone fishing" board at the shore end, facing the town
  const bw = 1.7, bh = 0.6;
  for (const z of [0.2, 0.2 + bw - 0.1]) cyl(g, 0.06, 0.06, 1.55, 5, C.woodDark, -W / 2 - 0.45, top - 0.3, z);
  box(g, 0.1, bh + 0.12, bw + 0.12, C.ink, -W / 2 - 0.45, top + 0.55, 0.15 + bw / 2);
  add(g, new THREE.PlaneGeometry(bw, bh), mat(0xffffff, { map: signTexture('gone fishing', { bg: css(C.roofTeal), aspect: bw / bh, serif: true }) }),
    -W / 2 - 0.51, top + 0.61 + bh / 2, 0.15 + bw / 2, { ry: -Math.PI / 2, cast: false });
  return g;
}

function hullShape(L, W) {
  const s = new THREE.Shape(), r = Math.min(0.35, W * 0.2);
  s.moveTo(-L / 2, -W / 2 + r);
  s.quadraticCurveTo(-L / 2, -W / 2, -L / 2 + r, -W / 2);
  s.lineTo(L * 0.08, -W / 2);
  s.quadraticCurveTo(L * 0.4, -W / 2, L / 2, 0);
  s.quadraticCurveTo(L * 0.4, W / 2, L * 0.08, W / 2);
  s.lineTo(-L / 2 + r, W / 2);
  s.quadraticCurveTo(-L / 2, W / 2, -L / 2, W / 2 - r);
  s.closePath();
  return s;
}

function hull(body, L, W, hullColor, deckColor) {
  add(body, extrudeXZ(hullShape(L, W), 0.75), hullColor, 0, -0.5, 0);
  const rim = hullShape(L + 0.14, W + 0.14);
  rim.holes.push(hullShape(L - 0.5, W - 0.5));
  add(body, extrudeXZ(rim, 0.32), C.white, 0, 0.22, 0);
  add(body, extrudeXZ(hullShape(L - 0.45, W - 0.45), 0.1), deckColor, 0, 0.25, 0);
  for (const sz of [-1, 1]) {
    for (const x of [-L * 0.2, L * 0.12]) cyl(body, 0.12, 0.12, 0.34, 6, C.white, x, -0.05, sz * (W / 2 + 0.12));
  }
}

// Boats face local +x and rock via userData.body.
export function sailBoat(o = {}) {
  const { hull: hc = C.teal, sail = 0xb3263a, cushion = C.navy, buoy = C.yellow } = o;
  const L = 4.2, W = 2.0;
  const g = new THREE.Group();
  const body = group(g);
  hull(body, L, W, hc, C.woodLight);
  box(body, 0.9, 0.32, W - 0.55, cushion, -L / 2 + 0.8, 0.35, 0);
  cyl(body, 0.07, 0.08, 2.6, 6, C.metal, 0.3, 0.35, 0);
  cyl(body, 0.16, 0.16, 0.12, 6, hc, 0.3, 0.35, 0);
  ball(body, 0.13, 1, C.yellow, 0.3, 3.02, 0);
  const tri = new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(0, 2.0), new THREE.Vector2(-1.7, 0)]);
  const sailGeo = new THREE.ExtrudeGeometry(tri, { depth: 0.05, bevelEnabled: false });
  sailGeo.translate(0, 0, -0.025);
  add(body, sailGeo, sail, 0.24, 0.85, 0);
  lifebuoy(body, -L / 2 - 0.08, 0.42, 0, Math.PI / 2, buoy);
  g.userData.body = body;
  return g;
}

export function motorBoat() {
  const L = 5.2, W = 2.5, hc = 0xdc8a4c;
  const g = new THREE.Group();
  const body = group(g);
  hull(body, L, W, hc, C.cream);
  add(body, new RoundedBoxGeometry(2.1, 1.1, W - 0.8, 2, 0.25), C.white, 0.1, 0.87, 0);
  box(body, 2.16, 0.42, W - 0.74, C.glass, 0.1, 0.84, 0);
  add(body, new THREE.BoxGeometry(2.25, 0.18, W - 0.6), mat(0xffffff, { map: stripes([C.pink, C.yellow, C.teal, C.orange], 8) }), 0.1, 1.44, 0);
  cyl(body, 0.04, 0.04, 1.3, 5, C.white, -0.7, 1.4, 0.35);
  box(body, 0.04, 0.32, 0.45, C.red, -0.7, 2.35, 0.58);
  for (const sz of [-1, 1]) {
    box(body, L * 0.5, 0.09, 0.09, hc, -L * 0.05, 0.86, sz * (W / 2 - 0.1));
    for (const x of [-L * 0.27, 0, L * 0.18]) box(body, 0.08, 0.32, 0.08, hc, x, 0.54, sz * (W / 2 - 0.1));
  }
  lifebuoy(body, -L / 2 - 0.08, 0.42, 0.45, Math.PI / 2, C.red);
  g.userData.body = body;
  return g;
}

export function buoy(color = C.red) {
  const g = new THREE.Group();
  const body = group(g);
  cyl(body, 0.5, 0.6, 0.6, 8, color, 0, -0.3, 0);
  cyl(body, 0.42, 0.5, 0.25, 8, C.white, 0, 0.3, 0);
  cyl(body, 0.07, 0.07, 0.8, 5, C.metal, 0, 0.55, 0);
  ball(body, 0.16, 0, mat(C.lamp, { emissive: 0x806020 }), 0, 1.4, 0);
  g.userData.body = body;
  return g;
}

export function seagull() {
  const g = new THREE.Group();
  g.rotation.order = 'YXZ';
  add(g, new THREE.SphereGeometry(0.2, 7, 5), C.white, 0, 0, 0, { s: [2, 0.85, 0.85] });
  ball(g, 0.14, 0, C.white, 0.36, 0.08, 0);
  add(g, new THREE.ConeGeometry(0.05, 0.2, 4), C.orange, 0.55, 0.06, 0, { rz: -Math.PI / 2 });
  const wings = [-1, 1].map((sz) => {
    const pivot = group(g, 0, 0.05, sz * 0.1);
    box(pivot, 0.42, 0.04, 0.85, C.white, 0, 0, sz * 0.42);
    box(pivot, 0.3, 0.045, 0.3, C.metal, -0.04, 0, sz * 0.9);
    return pivot;
  });
  g.userData.flap = (t) => {
    const f = Math.sin(t * 7) * 0.55 * (Math.sin(t * 0.6) > -0.3 ? 1 : 0.15);
    wings[0].rotation.x = f;
    wings[1].rotation.x = -f;
  };
  return g;
}

// ---------------------------------------------------------------------------
// nature

function leafGeometry(L, W, droop) {
  const S = 6, pos = [], idx = [];
  for (let i = 0; i <= S; i++) {
    const t = i / S, x = t * L, y = -t * t * droop;
    const w = Math.sin(Math.PI * Math.min(1, t * 1.15)) * W * (1 - t * 0.3);
    pos.push(x, y + 0.12 * Math.sin(Math.PI * t), 0, x, y, -w, x, y, w);
  }
  for (let i = 0; i < S; i++) {
    const c0 = i * 3, l0 = c0 + 1, r0 = c0 + 2, c1 = c0 + 3, l1 = c0 + 4, r1 = c0 + 5;
    idx.push(c0, c1, l0, l0, c1, l1, c0, r0, c1, r0, r1, c1);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

export function palm(seed = 1, height = 4.4) {
  const R = rng(seed);
  const g = new THREE.Group();
  const segs = 6, segLen = height / segs, lean = 0.05 + R() * 0.07, dirA = R() * Math.PI * 2;
  const p = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  let tilt = 0;
  for (let i = 0; i < segs; i++) {
    tilt += lean * (0.6 + i * 0.25);
    const dir = new THREE.Vector3(Math.sin(tilt) * Math.cos(dirA), Math.cos(tilt), Math.sin(tilt) * Math.sin(dirA));
    const r = 0.26 - i * 0.022;
    const m = add(g, new THREE.CylinderGeometry(r * 0.82, r, segLen * 1.02, 6), i % 2 ? C.trunk : C.trunkLight);
    m.position.copy(p).addScaledVector(dir, segLen / 2);
    m.quaternion.setFromUnitVectors(up, dir);
    p.addScaledVector(dir, segLen * 0.96);
  }
  const crown = group(g, p.x, p.y, p.z);
  const n = 7;
  for (let i = 0; i < n; i++) {
    const leaf = add(crown, leafGeometry(2.2 + R() * 0.6, 0.42, 1.0 + R() * 0.5), mat(i % 2 ? C.leaf : C.leafDark, { side: THREE.DoubleSide }));
    leaf.rotation.set(0, (i / n) * Math.PI * 2 + R() * 0.3, 0.25 + R() * 0.2);
  }
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    ball(crown, 0.17, 0, C.coconut, Math.cos(a) * 0.2, -0.2, Math.sin(a) * 0.2);
  }
  return g;
}

export function tree(seed = 1, s = 1) {
  const R = rng(seed);
  const g = new THREE.Group();
  const col = [C.leaf, C.leafDark, C.leafLight][Math.floor(R() * 3)];
  cyl(g, 0.15 * s, 0.24 * s, 1.4 * s, 6, C.trunk, 0, 0, 0);
  ball(g, 1.15 * s, 1, col, 0, 2.1 * s, 0, { s: [1, 0.92, 1], ry: R() * 3 });
  ball(g, 0.75 * s, 1, shade(col, 1.08), (R() - 0.5) * s, 2.8 * s, (R() - 0.5) * s, { ry: R() * 3 });
  ball(g, 0.62 * s, 1, shade(col, 0.92), (R() - 0.5) * 1.6 * s, 1.75 * s, (R() - 0.5) * 1.6 * s);
  return g;
}

export function pine(seed = 1, s = 1) {
  const R = rng(seed);
  const g = new THREE.Group();
  cyl(g, 0.15 * s, 0.2 * s, 0.9 * s, 5, C.trunk, 0, 0, 0);
  for (let i = 0; i < 3; i++) {
    const r = (1.25 - i * 0.3) * s, h = (1.4 - i * 0.15) * s;
    add(g, new THREE.ConeGeometry(r, h, 7), i % 2 ? C.pine : shade(C.pine, 1.15), 0, (0.8 + i * 0.85) * s + h / 2, 0, { ry: R() * 3 });
  }
  return g;
}

export function bush(p, x, y, z, s = 1, color = C.leaf) {
  return ball(p, 0.55 * s, 1, color, x, y + 0.3 * s, z, { s: [1, 0.8, 1] });
}

export function flowers(p, x, y, z, seed) {
  const R = rng(seed);
  const g = group(p, x, y, z);
  const col = [C.pink, C.yellow, C.white, C.red, C.roofPurple][Math.floor(R() * 5)];
  ball(g, 0.38, 1, C.leafDark, 0, 0.12, 0, { s: [1, 0.55, 1] });
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + R(), r = 0.18 + R() * 0.12;
    ball(g, 0.12, 0, col, Math.cos(a) * r, 0.3, Math.sin(a) * r);
  }
  return g;
}

export function rock(p, r, color, x, y, z, seed = 1) {
  const geo = new THREE.DodecahedronGeometry(r, 0);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const vx = pos.getX(i), vy = pos.getY(i), vz = pos.getZ(i);
    const k = 1 + 0.22 * Math.sin(vx * 4.1 + vy * 3.3 + vz * 2.7 + seed * 1.7);
    pos.setXYZ(i, vx * k, vy * k * 0.75, vz * k);
  }
  geo.computeVertexNormals();
  return add(p, geo, color, x, y, z, { ry: seed });
}

// ---------------------------------------------------------------------------
// beach & street props

export function umbrella(p, x, y, z, colors, tiltDir = 0) {
  const g = group(p, x, y, z, tiltDir);
  g.rotation.z = 0.12;
  cyl(g, 0.05, 0.05, 2.6, 5, C.white, 0, -0.2, 0);
  const canopy = sectorColors(new THREE.ConeGeometry(1.7, 0.7, 8, 1, true), colors, 8);
  add(g, canopy, mat(0xffffff, { vertexColors: true, side: THREE.DoubleSide }), 0, 2.4, 0);
  ball(g, 0.1, 0, C.white, 0, 2.8, 0);
  return g;
}

export function deckChair(p, x, y, z, ry, tex) {
  const g = group(p, x, y, z, ry);
  const tilt = 0.5;
  add(g, new THREE.BoxGeometry(0.9, 0.05, 1.8), mat(0xffffff, { map: tex }), 0, 0.62, -0.05, { rx: tilt });
  for (const sx of [-1, 1]) {
    add(g, new THREE.BoxGeometry(0.08, 0.1, 2.0), C.wood, sx * 0.5, 0.58, -0.05, { rx: tilt });
    box(g, 0.08, 0.26, 0.08, C.wood, sx * 0.5, 0, 0.8);
    add(g, new THREE.BoxGeometry(0.08, 1.2, 0.08), C.wood, sx * 0.44, 0.52, -0.5, { rx: -0.51 });
  }
  box(g, 1.0, 0.08, 0.08, C.wood, 0, 1.0, -0.88);
  return g;
}

export function towel(p, x, y, z, ry, tex) {
  return add(p, new THREE.BoxGeometry(1.0, 0.03, 1.9), mat(0xffffff, { map: tex }), x, y + 0.015, z, { ry });
}

export function surfboard(p, x, y, z, ry, c1, c2) {
  const g = group(p, x, y, z, ry);
  const s = new THREE.Shape();
  s.absellipse(0, 0, 0.42, 1.25, 0, Math.PI * 2, false, 0);
  add(g, extrudeXZ(s, 0.06, { bevel: 0.03, curve: 10 }), c1, 0, 0.03, 0);
  box(g, 0.66, 0.02, 0.2, c2, 0, 0.12, 0.35);
  box(g, 0.74, 0.02, 0.1, c2, 0, 0.12, 0.05);
  return g;
}

export function beachBall(p, x, y, z) {
  const geo = sectorColors(new THREE.SphereGeometry(0.35, 12, 8), [C.red, C.white, C.blue, C.white, C.yellow, C.white], 6);
  return add(p, geo, mat(0xffffff, { vertexColors: true }), x, y + 0.33, z);
}

export function sandCastle(p, x, y, z, ry = 0) {
  const g = group(p, x, y, z, ry);
  const s = 0xe7c58c;
  box(g, 1.4, 0.4, 1.4, s, 0, 0, 0);
  for (const [tx, tz] of [[-0.6, -0.6], [0.6, -0.6], [-0.6, 0.6], [0.6, 0.6]]) {
    cyl(g, 0.24, 0.28, 0.75, 6, s, tx, 0, tz);
    add(g, new THREE.ConeGeometry(0.3, 0.35, 6), s, tx, 0.93, tz);
  }
  cyl(g, 0.34, 0.4, 1.0, 6, s, 0, 0.3, 0);
  add(g, new THREE.ConeGeometry(0.42, 0.45, 6), s, 0, 1.52, 0);
  cyl(g, 0.02, 0.02, 0.5, 3, C.woodDark, 0, 1.7, 0);
  box(g, 0.02, 0.18, 0.28, C.red, 0, 2.0, 0.14);
  return g;
}

export function lampPost(p, x, y, z) {
  const g = group(p, x, y, z);
  cyl(g, 0.22, 0.26, 0.3, 6, C.metal, 0, 0, 0);
  cyl(g, 0.07, 0.09, 2.6, 6, C.metal, 0, 0.3, 0);
  ball(g, 0.26, 1, mat(C.lamp, { emissive: 0x6b5a1a }), 0, 3.12, 0);
  add(g, new THREE.ConeGeometry(0.36, 0.3, 6), C.metal, 0, 3.48, 0);
  return g;
}

export function bench(p, x, y, z, ry) {
  const g = group(p, x, y, z, ry);
  for (const sx of [-0.7, 0.7]) {
    box(g, 0.08, 0.42, 0.5, C.metal, sx, 0, 0);
    box(g, 0.08, 0.6, 0.08, C.metal, sx, 0.42, -0.22);
  }
  for (const zz of [-0.12, 0.12]) box(g, 1.7, 0.08, 0.2, C.wood, 0, 0.42, zz);
  for (const yy of [0.62, 0.86]) box(g, 1.7, 0.16, 0.06, C.wood, 0, yy, -0.24);
  return g;
}

export function flowerBed(p, x, y, z, ry, seed) {
  const R = rng(seed);
  const g = group(p, x, y, z, ry);
  box(g, 1.8, 0.3, 0.9, C.stoneDark, 0, 0, 0);
  box(g, 1.6, 0.04, 0.7, 0x7a5236, 0, 0.3, 0);
  for (let i = 0; i < 7; i++) {
    ball(g, 0.15, 0, [C.pink, C.yellow, C.red, C.white][Math.floor(R() * 4)], -0.65 + i * 0.22, 0.45, (R() - 0.5) * 0.4);
  }
  return g;
}

export function fountain() {
  const g = new THREE.Group();
  add(g, extrudeXZ(ring(2.0, 1.62), 0.55, { curve: 5 }), C.stoneDark);
  cyl(g, 1.66, 1.66, 0.42, 10, C.fountain, 0, 0, 0);
  cyl(g, 0.3, 0.38, 1.3, 8, C.stone, 0, 0.4, 0);
  cyl(g, 0.85, 0.35, 0.3, 8, C.stoneDark, 0, 1.6, 0);
  cyl(g, 0.72, 0.72, 0.04, 8, C.fountain, 0, 1.86, 0);
  ball(g, 0.24, 0, tint(C.fountain, 0.4), 0, 2.08, 0);
  return g;
}

// ---------------------------------------------------------------------------
// portfolio pieces

// The PixelCookie mark: a voxel cookie with chocolate chips and a bite taken out.
export function pixelCookie() {
  const g = new THREE.Group();
  const R = rng(31), cell = 0.44, rad = 5.2;
  const cube = new THREE.BoxGeometry(cell, cell, cell);
  for (let i = -6; i <= 6; i++) {
    for (let j = -6; j <= 6; j++) {
      const d = Math.hypot(i, j);
      if (d > rad || Math.hypot(i - 4.3, j - 3.4) < 2.3) continue;
      const edge = d > rad - 1.1;
      const base = edge ? C.cookieDark : C.cookie;
      for (const k of [-0.5, 0.5]) add(g, cube, base, i * cell, j * cell, k * cell);
      if (!edge && R() < 0.2) {
        const side = R() < 0.5 ? 1 : -1;
        add(g, cube, C.chocolate, i * cell, j * cell, side * cell * 1.2);
      }
    }
  }
  return g;
}

// A chubby little bus (ochre, like the site's accent). Faces +x.
// userData.pose(t, travelled, moving) spins the wheels and bounces the body; userData.honk() squashes it.
export function bus() {
  const g = new THREE.Group();
  const body = group(g);
  const L = 2.8, W = 1.35, H = 1.35, y0 = 0.32;
  add(body, new RoundedBoxGeometry(L, H, W, 3, 0.32), C.roofYellow, 0, y0 + H / 2, 0);
  box(body, L + 0.04, 0.16, W + 0.04, C.cream, 0, y0 + 0.42, 0);
  box(body, L - 0.6, 0.32, W + 0.06, C.glass, -0.2, y0 + 0.66, 0);
  for (const x of [-1.05, -0.5, 0.05, 0.6]) box(body, 0.1, 0.34, W + 0.08, C.roofYellow, x, y0 + 0.65, 0);
  box(body, 0.06, 0.42, W - 0.34, C.glass, L / 2, y0 + 0.56, 0);
  box(body, 0.55, 0.62, 0.05, C.cream, 0.55, y0 + 0.08, W / 2);
  box(body, 0.06, 0.28, W - 0.5, C.ink, -L / 2, y0 + 0.62, 0);
  add(body, new RoundedBoxGeometry(1.3, 0.22, 0.8, 2, 0.08), C.cream, -0.15, y0 + H + 0.06, 0);
  box(body, 0.1, 0.3, 0.9, C.red, 0.9, y0 + H - 0.02, 0);
  for (const sz of [-1, 1]) {
    ball(body, 0.1, 1, mat(C.lamp, { emissive: 0x6b5a1a }), L / 2 + 0.02, y0 + 0.28, sz * 0.42);
    ball(body, 0.08, 0, C.red, -L / 2 - 0.02, y0 + 0.3, sz * 0.45);
  }
  for (const sx of [-1, 1]) box(body, 0.12, 0.18, W + 0.06, C.metal, sx * (L / 2 + 0.02), y0 - 0.02, 0);

  const wheels = [];
  for (const x of [-0.85, 0.85]) {
    for (const sz of [-1, 1]) {
      const w = group(g, x, 0.3, sz * (W / 2 - 0.08));
      add(w, new THREE.CylinderGeometry(0.3, 0.3, 0.24, 10), C.ink, 0, 0, 0, { rx: Math.PI / 2 });
      add(w, new THREE.CylinderGeometry(0.13, 0.13, 0.26, 6), C.cream, 0, 0, 0, { rx: Math.PI / 2 });
      wheels.push(w);
    }
  }

  let honkAt = -10;
  g.userData.honk = () => (honkAt = performance.now() / 1000);
  g.userData.pose = (t, travelled, moving) => {
    for (const w of wheels) w.rotation.z = -travelled / 0.3;
    body.position.y = Math.abs(Math.sin(t * 11)) * 0.035 * moving;
    body.rotation.z = Math.sin(t * 3.1) * 0.01 * moving;
    // jelly squash after a honk
    const h = performance.now() / 1000 - honkAt;
    const k = h < 0.9 ? Math.exp(-h * 5) * Math.sin(h * 26) : 0;
    body.scale.set(1 - k * 0.12, 1 + k * 0.2, 1 - k * 0.12);
  };
  return g;
}

// A bus-stop sign with a little bench.
export function busStop(p, x, y, z, ry) {
  const g = group(p, x, y, z, ry);
  cyl(g, 0.06, 0.06, 2.4, 6, C.metal, 0, 0, 0);
  add(g, new THREE.CylinderGeometry(0.42, 0.42, 0.08, 12), C.red, 0, 2.4, 0, { rx: Math.PI / 2 });
  add(g, new THREE.PlaneGeometry(0.62, 0.3), mat(0xffffff, { map: handTexture('BUS', css(C.cream), 2) }), 0, 2.4, 0.045, { cast: false });
  bench(g, 0, 0, -0.9, 0);
  return g;
}

function arrowShape(L, H) {
  return new THREE.Shape([[0, -H / 2], [L - 0.32, -H / 2], [L, 0], [L - 0.32, H / 2], [0, H / 2]].map(([x, y]) => new THREE.Vector2(x, y)));
}

// Travel: a signpost pointing at places visited, hand-lettered.
export function signpost(p, x, y, z, signs) {
  const g = group(p, x, y, z);
  cyl(g, 0.09, 0.11, 3.2, 6, C.woodDark, 0, 0, 0);
  ball(g, 0.14, 0, C.woodDark, 0, 3.25, 0);
  signs.forEach(({ text, ry, color }, i) => {
    const a = group(g, 0, 2.75 - i * 0.52, 0, ry);
    const geo = new THREE.ExtrudeGeometry(arrowShape(1.9, 0.4), { depth: 0.08, bevelEnabled: false }).translate(0, 0, -0.04);
    add(a, geo, color, 0.08, 0, 0);
    const m = mat(0xffffff, { map: handTexture(text, css(color), 1.5 / 0.34) });
    add(a, new THREE.PlaneGeometry(1.5, 0.34), m, 0.85, 0, 0.045, { cast: false });
    add(a, new THREE.PlaneGeometry(1.5, 0.34), m, 0.85, 0, -0.045, { cast: false, ry: Math.PI });
  });
  return g;
}

// Night mode: glowing windows, lamps and lantern. Works because materials are shared.
export function setNight(on) {
  mat(C.glass).emissive.setHex(on ? 0xffa940 : 0x000000);
  mat(C.lamp, { emissive: 0x6b5a1a }).emissive.setHex(on ? 0xffd36a : 0x6b5a1a);
  mat(0xfff3b0, { emissive: 0xffc83d }).emissive.setHex(on ? 0xffe08a : 0xffc83d);
  mat(C.lamp, { emissive: 0x806020 }).emissive.setHex(on ? 0xffd36a : 0x806020);
}
