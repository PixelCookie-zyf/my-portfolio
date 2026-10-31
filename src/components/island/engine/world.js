import * as THREE from 'three';
import * as M from './models.js';
import { C, add, mat, plate, extrudeXZ } from './models.js';
import { rng, css, grassTexture, sandTexture, stripeTexture, paperTexture } from './textures.js';
import { mergeStatic } from './merge.js';

const SAND_TOP = 0.4;
const GRASS_TOP = 0.85;
const WATER_SIZE = 124;

const WATER = {
  day: { shallow: 0xa6dcd2, mid: 0x86bedb, deep: 0x77a6d6 },
  night: { shallow: 0x3a6f78, mid: 0x2c4f6e, deep: 0x26324a },
};

// Island coastline in polar form. The beach widens toward +x+z, which faces the default camera.
const rSand = (a) => 26 + 2.0 * Math.sin(3 * a + 1.0) + 1.4 * Math.sin(5 * a + 2.3) + 0.7 * Math.sin(9 * a + 0.4);
const beachWidth = (a) => {
  const c = Math.cos(a - Math.PI / 4);
  return c > 0 ? 9 * c * c : 0;
};
const rGrass = (a) => rSand(a) - 1.4 - beachWidth(a);

const smooth = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
const polar = (a, r) => [Math.cos(a) * r, Math.sin(a) * r];
const coastDist = (x, z) => Math.hypot(x, z) - rSand(Math.atan2(z, x));

const waveRaw = (x, z, t) =>
  Math.sin(x * 0.32 + t * 1.1) * 0.16 + Math.sin(z * 0.41 - t * 0.9) * 0.13 + Math.sin((x + z) * 0.7 + t * 1.7) * 0.06;
const waveAmp = (x, z) => {
  const d = coastDist(x, z);
  return smooth(0.5, 7, d) * (1 - smooth(12, 22, d));
};
export const waveAt = (x, z, t) => waveRaw(x, z, t) * waveAmp(x, z);

// ---------------------------------------------------------------------------

function buildIsland(parent) {
  const N = 180;
  const sand = new THREE.Shape(), grass = new THREE.Shape();
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2, fn = i ? 'lineTo' : 'moveTo';
    sand[fn](...polar(a, rSand(a)));
    grass[fn](...polar(a, rGrass(a)));
  }
  const sandTex = sandTexture();
  sandTex.repeat.set(1 / 12, 1 / 12);
  const grassTex = grassTexture();
  grassTex.repeat.set(1 / 14, 1 / 14);
  add(parent, extrudeXZ(sand, 2.3, { bevel: 0.25 }), mat(0xffffff, { map: sandTex }), 0, SAND_TOP - 2.3 - 0.25, 0);
  add(parent, extrudeXZ(grass, 0.4, { bevel: 0.12 }), mat(0xffffff, { map: grassTex }), 0, GRASS_TOP - 0.4 - 0.12, 0);
}

// The notebook page under everything: ruled lines plus a red margin, unlit so it matches the background.
function buildPaper(parent) {
  const maps = { day: paperTexture(false), night: paperTexture(true) };
  const paper = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: maps.day }));
  paper.position.y = -0.6; // below the deepest wave trough so it never pokes through
  paper.rotation.y = Math.PI / 4;
  const marginMat = new THREE.MeshBasicMaterial({ color: C.red, transparent: true, opacity: 0.45, depthWrite: false });
  for (const x of [-47, -46.2]) {
    const line = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 1400).rotateX(-Math.PI / 2), marginMat);
    line.position.set(x, 0.01, 0);
    line.layers.set(1);
    paper.add(line);
  }
  parent.add(paper);
  return (night) => (paper.material.map = night ? maps.night : maps.day);
}

// Water that fades out into the paper; returns a repaint function for day/night.
function buildWater(parent, updaters) {
  const seg = 62;
  const geo = new THREE.PlaneGeometry(WATER_SIZE, WATER_SIZE, seg, seg);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position, n = pos.count;
  const bx = new Float32Array(n), bz = new Float32Array(n), amp = new Float32Array(n), dist = new Float32Array(n);
  const baseY = new Float32Array(n);
  const colors = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) {
    bx[i] = pos.getX(i);
    bz[i] = pos.getZ(i);
    dist[i] = coastDist(bx[i], bz[i]);
    amp[i] = waveAmp(bx[i], bz[i]);
    // where the water has faded out it sinks onto the paper, so its square edge leaves no outline
    baseY[i] = -0.6 * smooth(25, 31, dist[i]);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 4));
  const water = new THREE.Mesh(
    geo,
    new THREE.MeshPhongMaterial({ vertexColors: true, flatShading: true, shininess: 60, specular: 0x33505a, transparent: true })
  );
  water.receiveShadow = true;
  parent.add(water);

  const paint = (night) => {
    const p = night ? WATER.night : WATER.day;
    const shallow = new THREE.Color(p.shallow), mid = new THREE.Color(p.mid), deep = new THREE.Color(p.deep), c = new THREE.Color();
    for (let i = 0; i < n; i++) {
      c.copy(shallow).lerp(mid, smooth(-1, 6, dist[i])).lerp(deep, smooth(5, 18, dist[i]));
      colors.set([c.r, c.g, c.b, 1 - smooth(15, 30, dist[i])], i * 4);
    }
    geo.attributes.color.needsUpdate = true;
  };

  updaters.push((t) => {
    for (let i = 0; i < n; i++) pos.setY(i, baseY[i] + waveRaw(bx[i], bz[i], t) * amp[i]);
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  });

  const foamRing = (inner, outerOff) => {
    const s = new THREE.Shape(), hole = new THREE.Path(), N = 180;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2, fn = i ? 'lineTo' : 'moveTo';
      const ro = rSand(a) + outerOff, ri = rSand(a) + inner;
      s[fn](Math.cos(a) * ro, -Math.sin(a) * ro);
      hole[fn](Math.cos(a) * ri, -Math.sin(a) * ri);
    }
    s.holes.push(hole);
    const m = new THREE.Mesh(
      new THREE.ShapeGeometry(s).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6, depthWrite: false })
    );
    m.layers.set(1);
    parent.add(m);
    return m;
  };
  let foamStrength = 1;
  const foamA = foamRing(0.2, 0.75);
  const foamB = foamRing(0.9, 1.25);
  updaters.push((t) => {
    const k = 0.5 + 0.5 * Math.sin(t * 1.2);
    foamA.position.y = 0.04;
    foamA.scale.setScalar(1 + 0.008 * k);
    foamA.material.opacity = (0.45 + 0.3 * k) * foamStrength;
    foamB.position.y = 0.03;
    foamB.scale.setScalar(1 + 0.012 * (1 - k));
    foamB.material.opacity = 0.35 * (1 - k) * foamStrength;
  });
  return (night) => {
    paint(night);
    foamStrength = night ? 0.4 : 1;
  };
}

function buildRoads(parent) {
  const y = GRASS_TOP, h = 0.1, W = 2.8;
  const x0 = -(rGrass(Math.PI) - 1.3), x1 = rGrass(0) - 1.3;
  plate(parent, x1 - x0, W, h, C.stone, (x0 + x1) / 2, y, 0, 0.6);
  const z0 = -(rGrass(-Math.PI / 2) - 1.3), z1 = rGrass(Math.PI / 2) - 0.2;
  plate(parent, W, z1 - z0, h, C.stone, 0, y, (z0 + z1) / 2, 0.6);
  add(parent, new THREE.CylinderGeometry(4.7, 4.7, h, 20), C.stone, 0, y + h / 2, 0);
  add(parent, new THREE.CylinderGeometry(3.6, 3.6, 0.02, 20), M.tint(C.stoneDark, 0.3), 0, y + h + 0.01, 0);
}

// ---------------------------------------------------------------------------

export function buildWorld(scene) {
  const stat = new THREE.Group();
  const dyn = new THREE.Group();
  const updaters = [];
  const hotspots = [];
  const R = rng(2024);

  const obstacles = [];
  const block = (x, z, r) => obstacles.push({ x, z, r });
  const free = (x, z, r) => obstacles.every((o) => Math.hypot(o.x - x, o.z - z) > o.r + r);
  const onRoad = (x, z, r) => Math.abs(x) < 1.5 + r || Math.abs(z) < 1.5 + r || Math.hypot(x, z) < 4.7 + r;
  const place = (obj, x, y, z, ry = 0, r = 0, parent = stat) => {
    obj.position.set(x, y, z);
    obj.rotation.y = ry;
    parent?.add(obj);
    if (r) block(x, z, r);
    return obj;
  };
  // A clickable landmark keeps its own merged meshes so it can be picked and lifted on hover.
  const hotspot = (info, obj, anchor) => {
    const merged = mergeStatic(obj);
    merged.userData.hotspot = info.key;
    scene.add(merged);
    hotspots.push({ ...info, object: merged, anchor: new THREE.Vector3(...anchor), lift: info.lift ?? 0.35 });
  };

  const repaintPaper = buildPaper(dyn);
  buildIsland(stat);
  const repaintWater = buildWater(dyn, updaters);
  buildRoads(stat);
  place(M.fountain(), 0, GRASS_TOP + 0.1, 0, 0, 4.7);

  // --- town -----------------------------------------------------------------
  const G = GRASS_TOP;
  place(M.house({ roof: C.roofGreen, wall: C.wallBlue, shutter: C.roofGreen, seed: 2 }), -14.6, G, -7.2, 0, 4.6);
  place(M.house({ roof: C.roofBlue, w: 3.8, wall: C.wallYellow, seed: 3 }), -7.2, G, -15.2, Math.PI / 2, 4.6);
  place(M.hotel(), 15.2, G, -7.4, 0, 5.4);
  place(M.house({ roof: C.roofTeal, wall: C.wallPink, shutter: C.roofTeal, seed: 5 }), 7.2, G, -15.2, 0, 4.6);
  place(M.house({ roof: C.roofCoral, seed: 6 }), -14.6, G, 7.2, Math.PI / 2, 4.6);
  place(M.house({ roof: C.roofPurple, wall: C.wallBlue, seed: 7 }), -7.2, G, 14.6, Math.PI / 2, 4.6);

  // --- the four sections + contact --------------------------------------------
  hotspot(
    { key: 'writing', label: 'writing', sub: 'notes on LLMs & agents', href: '/blog', note: 'yellow' },
    place(M.shop({ name: 'Writing', main: C.roofBlue, wall: C.wall, topper: M.booksTopper, stripeColors: [C.roofBlue, C.cream] }), 7.6, G, -7.4, 0, 5, null),
    [7.6, 7.6, -7.4]
  );
  hotspot(
    { key: 'projects', label: 'projects', sub: 'open-source & experiments', href: '/projects', note: 'green' },
    place(M.shop({ name: 'Projects', main: C.roofGreen, wall: C.wall, topper: M.laptopTopper, stripeColors: [C.roofGreen, C.cream] }), -7.6, G, 7.6, Math.PI / 2, 5, null),
    [-7.6, 7.2, 7.6]
  );
  hotspot(
    { key: 'about', label: 'about me', sub: 'research & timeline', href: '/#about', note: 'pink' },
    place(M.house({ roof: C.roofRed, wall: C.wallYellow, shutter: C.roofRed, seed: 1 }), -6.9, G, -7.2, 0, 4.6, null),
    [-6.9, 12.4, -7.2]
  );

  // PixelCookie's mark floats over the "about" house
  const cookie = mergeStatic(M.pixelCookie());
  const cookieRoot = new THREE.Group();
  cookieRoot.position.set(-6.9, 9.2, -7.2);
  cookieRoot.add(cookie);
  dyn.add(cookieRoot);
  updaters.push((t) => {
    cookie.rotation.y = t * 0.7;
    cookie.position.y = Math.sin(t * 1.4) * 0.25;
  });

  // lighthouse = contact
  const lhA = -2.36;
  const [lx, lz] = polar(lhA, rSand(lhA) - 0.2);
  const lh = M.lighthouse();
  hotspot(
    { key: 'contact', label: 'say hi', sub: 'email · GitHub · X', href: '/#contact', note: 'yellow' },
    place(lh.group, lx, 0.3, lz, 0, 3.8, null),
    [lx + 4.5, 0.3 + lh.lampY, lz - 4.5]
  );
  const beam = new THREE.Group();
  beam.position.set(lx, 0.3 + lh.lampY, lz);
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xfff1a6, transparent: true, opacity: 0.1, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  });
  for (const ry of [0, Math.PI]) {
    const geo = new THREE.ConeGeometry(1.6, 14, 18, 1, true).rotateZ(Math.PI / 2).translate(7, 0, 0);
    const m = new THREE.Mesh(geo, beamMat);
    m.rotation.set(0, ry, -0.06);
    m.layers.set(1);
    beam.add(m);
  }
  dyn.add(beam);
  updaters.push((t) => (beam.rotation.y = t * 0.6));

  // pier + signpost = travel
  const S = SAND_TOP;
  const pierZ = rGrass(Math.PI / 2) - 0.3;
  const harbour = new THREE.Group();
  harbour.add(M.pier(18));
  M.signpost(harbour, -3.0, S - 0.05, 0.6, [
    { text: 'Tokyo', ry: -0.4, color: C.wallPink },
    { text: 'Sydney', ry: 2.4, color: C.wallMint },
    { text: 'New York', ry: 0.9, color: C.wallYellow },
    { text: 'home: Fuzhou', ry: -2.2, color: C.wallBlue },
  ]);
  hotspot(
    { key: 'travel', label: 'travel', sub: 'places I’ve been', href: '/#travel', note: 'blue', lift: 0.15 },
    place(harbour, 0, 0, pierZ, 0, 0, null),
    [0, 4.6, pierZ + 9]
  );
  block(0, pierZ, 2);
  block(-3.0, pierZ + 0.6, 1.2);

  // --- fishing jetty off the east beach, by the hotel ---------------------------
  const jA = -0.33, JL = 7, JE = 2.4;
  const jOut = new THREE.Vector3(Math.cos(jA), 0, Math.sin(jA));
  const [jx, jz] = polar(jA, rSand(jA) - 2.2);
  place(M.jetty(JL, JE), jx, 0, jz, Math.PI / 2 - jA, 0);
  for (let k = 0; k < 3; k++) block(jx + jOut.x * k * 1.5, jz + jOut.z * k * 1.5, 1.6);
  const fishing = {
    origin: new THREE.Vector3(jx, 0.95, jz).addScaledVector(jOut, JL + JE - 0.45),
    dir: jOut,
  };

  // --- park & lamps -----------------------------------------------------------
  M.bench(stat, 6.2, G, 6.2, -Math.PI * 0.75);
  M.flowerBed(stat, 9.2, G, 3.6, 0, 11);
  M.flowerBed(stat, 3.6, G, 9.2, Math.PI / 2, 12);
  block(6.2, 6.2, 1.2);
  block(9.2, 3.6, 1.2);
  block(3.6, 9.2, 1.2);
  for (const [x, z, s] of [[11.4, 6.2, 1.0], [6.2, 11.6, 0.9], [10.2, 10.0, 0.8]]) {
    place(M.tree(x * 7 + z, s), x, G, z, 0, 1.3 * s);
  }
  for (const [x, z] of [[2.3, -9], [-2.3, -17], [9, 2.3], [17, -2.3], [-9, 2.3], [-17, -2.3], [-2.3, 10], [2.3, 15.5]]) {
    M.lampPost(stat, x, G + 0.05, z);
    block(x, z, 0.5);
  }
  block(2.7, 11, 1.3); // bus stop, placed with the bus below

  // --- beach ----------------------------------------------------------------
  const [hx, hz] = polar(0.74, 19.6);
  place(M.hut(), hx, S, hz, Math.PI / 4, 4.2);

  const beachColors = [[C.red, C.cream], [C.roofTeal, C.cream], [C.roofYellow, C.cream], [C.roofBlue, C.cream]];
  const fabrics = beachColors.map((cols) => stripeTexture(cols.map(css), 8));
  [0.08, 0.36, 1.08, 1.36].forEach((a, i) => {
    const [x, z] = polar(a, rSand(a) - 3.4);
    const out = new THREE.Vector2(Math.cos(a), Math.sin(a));
    const lat = new THREE.Vector2(-out.y, out.x);
    const ry = Math.atan2(out.x, out.y);
    M.umbrella(stat, x - out.x * 0.4, S, z - out.y * 0.4, beachColors[i], ry);
    for (const side of [-1, 1]) {
      const cx = x + lat.x * side * 1.0 + out.x * 0.4, cz = z + lat.y * side * 1.0 + out.y * 0.4;
      if (side < 0 || i % 2 === 0) M.deckChair(stat, cx, S, cz, ry, fabrics[(i + (side > 0 ? 1 : 0)) % 4]);
      else M.towel(stat, cx, S, cz, ry + 0.15, fabrics[(i + 2) % 4]);
    }
    block(x, z, 2.6);
  });
  {
    const [x, z] = polar(0.5, 21.4);
    M.surfboard(stat, x, S, z, 0.4, C.cream, C.roofTeal);
    M.surfboard(stat, x + 1.1, S, z - 0.6, 0.6, C.glass, C.cream);
    block(x + 0.5, z - 0.3, 1.6);
  }
  {
    const [x, z] = polar(0.9, 22.6);
    M.sandCastle(stat, x, S, z, 0.3);
    M.beachBall(stat, x - 1.6, S, z + 0.6);
    block(x - 0.5, z, 1.8);
  }

  // --- boats ------------------------------------------------------------------
  const floatOn = (obj, phase) => (t) => {
    obj.position.y = waveAt(obj.position.x, obj.position.z, t) * 0.85;
    obj.userData.body.rotation.x = Math.sin(t * 1.3 + phase) * 0.045;
    obj.userData.body.rotation.z = Math.sin(t * 1.0 + phase * 1.7) * 0.035;
  };
  const moor = (boat, x, z, ry, phase) => {
    boat.position.set(x, 0, z);
    boat.rotation.y = ry;
    dyn.add(boat);
    updaters.push(floatOn(boat, phase));
  };
  moor(M.sailBoat({ hull: C.roofTeal, sail: C.red, buoy: C.roofYellow }), -3.4, pierZ + 9.5, -Math.PI / 2, 0);
  moor(M.sailBoat({ hull: C.pink, sail: C.roofBlue, cushion: C.roofBlue, buoy: C.pink }), 3.4, pierZ + 12.5, Math.PI / 2, 1.3);
  moor(M.motorBoat(), -3.6, pierZ + 14.6, -Math.PI / 2 + 0.05, 2.1);

  const cruiser = M.sailBoat({ hull: C.navy, sail: C.cream, cushion: C.red, buoy: C.red });
  cruiser.scale.setScalar(1.25);
  dyn.add(cruiser);
  const cruise = floatOn(cruiser, 0.7);
  updaters.push((t) => {
    const a = 0.2 + t * 0.035;
    cruiser.position.x = Math.cos(a) * 42;
    cruiser.position.z = Math.sin(a) * 42;
    cruiser.rotation.y = -a - Math.PI / 2;
    cruise(t);
  });
  for (const [a, r, col] of [[0.22, 33, C.red], [1.95, 32, C.roofYellow], [-0.8, 32, C.red], [2.9, 31, C.roofYellow]]) {
    const [x, z] = polar(a, r);
    moor(M.buoy(col), x, z, 0, a * 3);
  }

  // --- greenery ---------------------------------------------------------------
  const palmSpots = [[2.9, pierZ + 1.2]];
  for (let a = -0.7; a < 2.3; a += 0.22) {
    const aa = a + (R() - 0.5) * 0.1, w = rSand(aa) - rGrass(aa);
    if (w < 3.4) continue;
    palmSpots.push(polar(aa, rGrass(aa) + 1.1 + R() * (w - 3.2)));
  }
  palmSpots.forEach(([x, z], i) => {
    if ((i > 0 && Math.abs(x) < 2.6 && z > 15) || !free(x, z, 1.3)) return;
    place(M.palm(i + 3, 3.8 + R() * 1.4), x, S, z, R() * 6, 1.3);
  });
  for (let a = -Math.PI; a < Math.PI; a += 0.19) {
    if (beachWidth(a) > 2.5) continue;
    for (const inset of [1.6, 4.2]) {
      if (inset > 2 && R() < 0.45) continue;
      const aa = a + (R() - 0.5) * 0.12, r = rGrass(aa) - inset - R() * 1.2;
      const [x, z] = polar(aa, r);
      if (onRoad(x, z, 1.2) || !free(x, z, 1.4)) continue;
      const s = 0.8 + R() * 0.4;
      place(R() < 0.35 ? M.pine(R() * 100, s) : M.tree(R() * 100, s), x, G, z, 0, 1.3 * s);
    }
  }
  for (let i = 0; i < 160; i++) {
    const a = R() * Math.PI * 2, r = Math.sqrt(R()) * 24;
    const [x, z] = polar(a, r);
    if (r > rGrass(a) - 1 || onRoad(x, z, 0.5) || !free(x, z, 0.6)) continue;
    if (i % 2) M.bush(stat, x, G, z, 0.7 + R() * 0.5, R() < 0.5 ? C.leaf : C.leafLight);
    else M.flowers(stat, x, G, z, i);
    block(x, z, 0.6);
  }
  for (let a = 1.9; a < 5.9; a += 0.2) {
    const aa = a + (R() - 0.5) * 0.15;
    if (Math.abs(aa - (lhA + Math.PI * 2)) < 0.22 || Math.abs(aa - (jA + Math.PI * 2)) < 0.2 || R() < 0.35) continue;
    const [x, z] = polar(aa, rSand(aa) + 0.3 + R() * 0.7);
    M.rock(stat, 0.5 + R() * 0.7, R() < 0.5 ? C.rock : C.rockDark, x, 0.05, z, R() * 10);
  }

  // --- a little bus does laps: out along each road, U-turn, back round the fountain ---
  const vehicle = M.bus();
  vehicle.scale.setScalar(1.15);
  dyn.add(vehicle);
  const lane = 0.62, d = 3.55 * Math.SQRT1_2, ry = G + 0.1;
  const xE = rGrass(0) - 2.4, xW = -(rGrass(Math.PI) - 2.4);
  const zN = -(rGrass(-Math.PI / 2) - 2.4), zS = rGrass(Math.PI / 2) - 3;
  const route = new THREE.CatmullRomCurve3([
    [5, lane], [xE - 1.5, lane], [xE - 0.2, 0], [xE - 1.5, -lane], [5, -lane],
    [d, -d],
    [lane, -5], [lane, zN + 1.5], [0, zN + 0.2], [-lane, zN + 1.5], [-lane, -5],
    [-d, -d],
    [-5, -lane], [xW + 1.5, -lane], [xW + 0.2, 0], [xW + 1.5, lane], [-5, lane],
    [-d, d],
    [-lane, 5], [-lane, zS - 1.5], [0, zS - 0.2], [lane, zS - 1.5], [lane, 5],
    [d, d],
  ].map(([x, z]) => new THREE.Vector3(x, ry, z)), true, 'centripetal');
  const routeLen = route.getLength();

  // the bus stop sits on the pier road; the bus waits there for a moment each lap
  M.busStop(stat, 2.15, G, 11, -Math.PI / 2);
  let stopU = 0;
  for (let i = 0, best = Infinity; i < 600; i++) {
    const p = route.getPointAt(i / 600), dd = Math.hypot(p.x - lane, p.z - 11);
    if (dd < best) [best, stopU] = [dd, i / 600];
  }

  let travelled = 0, waitUntil = 0, lastU = 0;
  const tangent = new THREE.Vector3();
  updaters.push((t, dt) => {
    const moving = t < waitUntil ? 0 : 1;
    travelled += dt * 3.4 * moving;
    const u = (travelled / routeLen) % 1;
    if (lastU < stopU && u >= stopU) waitUntil = t + 2.5;
    lastU = u;
    route.getPointAt(u, vehicle.position);
    route.getTangentAt(u, tangent);
    vehicle.rotation.y = Math.atan2(-tangent.z, tangent.x);
    vehicle.userData.pose(t, travelled, moving);
  });

  // --- gulls ----------------------------------------------------------------
  for (let i = 0; i < 4; i++) {
    const gull = M.seagull();
    dyn.add(gull);
    const cx = (R() - 0.5) * 20, cz = (R() - 0.5) * 20, rad = 10 + R() * 10, h = 11 + R() * 4;
    const dir = i % 2 ? 1 : -1, sp = (0.25 + R() * 0.15) * dir, ph = R() * 6;
    gull.rotation.x = -0.25 * dir;
    updaters.push((t) => {
      const a = ph + t * sp;
      gull.position.set(cx + Math.cos(a) * rad, h + Math.sin(t * 0.7 + ph) * 0.6, cz + Math.sin(a) * rad);
      gull.rotation.y = dir > 0 ? -a - Math.PI / 2 : -a + Math.PI / 2;
      gull.userData.flap(t + ph);
    });
  }

  scene.add(mergeStatic(stat));
  scene.add(dyn);

  const setNight = (night) => {
    repaintPaper(night);
    repaintWater(night);
    M.setNight(night);
    beamMat.opacity = night ? 0.32 : 0.1;
  };
  setNight(false);

  return {
    hotspots,
    bus: vehicle,
    fishing,
    setNight,
    update: (t, dt) => updaters.forEach((u) => u(t, dt)),
  };
}
