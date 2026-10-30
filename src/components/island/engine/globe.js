import * as THREE from 'three';
import { feature } from 'topojson-client';
import { OutlinePipeline } from './outline.js';
const D2R = Math.PI / 180;
const PIN_COLORS = [0xff9fae, 0x93b6ff, 0x8fdc9f, 0xffb370, 0x7fd6d0];

let landPromise = null;
const loadLand = () =>
  (landPromise ??= import('world-atlas/land-110m.json')
    .then((m) => m.default ?? m)
    .then((topo) => feature(topo, topo.objects.land))
    .catch(() => null));

export const toVec = (lat, lng, r = 1) =>
  new THREE.Vector3(
    Math.cos(lat * D2R) * Math.cos(lng * D2R) * r,
    Math.sin(lat * D2R) * r,
    -Math.cos(lat * D2R) * Math.sin(lng * D2R) * r
  );

// --- point-in-land test on the 110m coastline --------------------------------------
function landPolygons(geo) {
  const polys = [];
  for (const f of geo.features ?? [geo]) {
    const g = f.geometry ?? f;
    const list = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [];
    for (const rings of list) {
      let minX = 180, maxX = -180, minY = 90, maxY = -90;
      for (const [x, y] of rings[0]) {
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      }
      polys.push({ rings, minX, maxX, minY, maxY });
    }
  }
  return polys;
}
function inRing(x, y, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
const isLand = (polys, lng, lat) =>
  polys.some((p) => lng >= p.minX && lng <= p.maxX && lat >= p.minY && lat <= p.maxY &&
    inRing(lng, lat, p.rings[0]) && !p.rings.slice(1).some((h) => inRing(lng, lat, h)));

// --- globe mesh: icosphere faces painted land/ocean, land nudged up into low cliffs ---
function globeMesh(polys) {
  const geo = new THREE.IcosahedronGeometry(1, 13);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color(), v = new THREE.Vector3();
  const pick = (arr, i) => arr[(i * 7919) % arr.length];
  for (let i = 0; i < pos.count; i += 3) {
    v.set(0, 0, 0);
    for (let k = 0; k < 3; k++) v.add(new THREE.Vector3().fromBufferAttribute(pos, i + k));
    v.normalize();
    const lat = Math.asin(v.y) / D2R, lng = Math.atan2(-v.z, v.x) / D2R;
    const land = polys && isLand(polys, lng, lat);
    if (land) {
      c.setHex(Math.abs(lat) > 66 ? pick([0xf6f3ec, 0xebe6dc], i) : pick([0xa3c97f, 0x8fbb73, 0xb3d38f, 0x9cc285], i));
      for (let k = 0; k < 3; k++) {
        v.fromBufferAttribute(pos, i + k).multiplyScalar(1.022);
        pos.setXYZ(i + k, v.x, v.y, v.z);
      }
    } else {
      c.setHex(Math.abs(lat) > 72 ? 0xeef3f4 : pick([0x8ec5df, 0x86bedb, 0x97cbe4], i));
    }
    for (let k = 0; k < 3; k++) colors.set([c.r, c.g, c.b], (i + k) * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  // smooth normals for the edge pass: only the silhouette and coastline cliffs get ink
  const n = geo.attributes.normal;
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    n.setXYZ(i, v.x, v.y, v.z);
  }
  const mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }));
  mesh.castShadow = mesh.receiveShadow = true;
  return mesh;
}

function pin(color, home) {
  const g = new THREE.Group();
  const m = (hex) => new THREE.MeshLambertMaterial({ color: hex, flatShading: true });
  const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, home ? 0.13 : 0.09, 5), m(0x3c4a4a));
  stick.position.y = home ? 0.065 : 0.045;
  const head = new THREE.Mesh(new THREE.IcosahedronGeometry(home ? 0.042 : 0.027, 1), m(color));
  head.position.y = home ? 0.14 : 0.095;
  g.add(stick, head);
  if (home) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.009, 4, 14), m(0xd9532f));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.004;
    g.add(ring);
  }
  g.userData.head = head;
  return g;
}

function arcPoint(a, b, t, lift, out = new THREE.Vector3()) {
  return out.copy(a).lerp(b, t).normalize().multiplyScalar(1.03 + lift * Math.sin(Math.PI * t));
}

// ---------------------------------------------------------------------------------
// One globe per page; mount() moves its canvas into whichever modal is open.

let instance = null;
export function getGlobe(cities) {
  return (instance ??= createGlobe(cities));
}

function createGlobe(cities) {
  const canvas = document.createElement('canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfbf9f4);
  const camera = new THREE.PerspectiveCamera(30, 1, 1, 20);
  camera.position.set(0, 0.2, 5.3);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xfff6e6, 0xa8b8c8, 1.7));
  const sun = new THREE.DirectionalLight(0xfff0d8, 2.0);
  sun.position.set(-3, 4, 5);
  scene.add(sun);

  const spin = new THREE.Group();
  scene.add(spin);
  const inner = new THREE.Mesh(new THREE.SphereGeometry(0.998, 48, 32), new THREE.MeshLambertMaterial({ color: 0x86bedb }));
  spin.add(inner);

  const home = cities.find((c) => c.current);
  const homeV = toVec(home.lat, home.lng).normalize();
  const pins = cities.map((city, i) => {
    const p = pin(city.current ? 0xffd36b : PIN_COLORS[i % PIN_COLORS.length], city.current);
    const n = toVec(city.lat, city.lng).normalize();
    p.position.copy(n).multiplyScalar(1.02);
    p.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), n);
    p.userData.city = city;
    p.userData.normal = n;
    spin.add(p);
    return p;
  });

  // dotted routes home → each city, plus a paper plane that flies them in turn
  const routes = cities.filter((c) => !c.current).map((c) => {
    const b = toVec(c.lat, c.lng).normalize();
    const ang = homeV.angleTo(b);
    return { a: homeV, b, lift: 0.03 + ang * 0.085, n: Math.max(5, Math.round(ang * 46)) };
  });
  const dotCount = routes.reduce((s, r) => s + r.n, 0);
  const dots = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.0075, 0), new THREE.MeshBasicMaterial({ color: 0xd9532f }), dotCount);
  dots.layers.set(1);
  {
    const m = new THREE.Matrix4(), p = new THREE.Vector3();
    let k = 0;
    for (const r of routes) {
      for (let i = 1; i < r.n; i++) {
        arcPoint(r.a, r.b, i / r.n, r.lift, p);
        dots.setMatrixAt(k++, m.makeTranslation(p.x, p.y, p.z));
      }
    }
    dots.count = k;
  }
  spin.add(dots);

  const planeGeo = new THREE.BufferGeometry();
  planeGeo.setAttribute('position', new THREE.Float32BufferAttribute([
    0, 0, 0.07, -0.045, 0, -0.04, 0, 0.004, -0.03,
    0, 0, 0.07, 0, 0.004, -0.03, 0.045, 0, -0.04,
    0, 0, 0.07, 0, 0.004, -0.03, 0, -0.022, -0.035,
  ], 3));
  planeGeo.computeVertexNormals();
  const plane = new THREE.Mesh(planeGeo, new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide, flatShading: true }));
  plane.castShadow = true;
  spin.add(plane);
  let flight = { r: routes[0], t: 0 };
  const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3();

  let globe = null;
  loadLand().then((geo) => {
    globe = globeMesh(geo ? landPolygons(geo) : null);
    spin.add(globe);
    wrapEl?.querySelector('.loading')?.remove();
  });

  const post = new OutlinePipeline(renderer, scene, camera);
  post.uniforms.grain.value = 0.05;

  // --- interaction: drag to spin, click a pin, or select from the list -------------
  const rot = { x: 0.35, y: -Math.PI / 2 - home.lng * D2R };
  const goal = { ...rot };
  let dragging = null, idleAt = 0, selected = null, onSelect = null, wrapEl = null, bubble = null, raf = 0;
  const raycaster = new THREE.Raycaster();

  const selectCity = (name) => {
    const p = pins.find((q) => q.userData.city.name === name);
    if (!p) return;
    selected = p;
    const { lat, lng } = p.userData.city;
    goal.x = THREE.MathUtils.clamp(lat * D2R * 0.85, -1.1, 1.1);
    let y = -Math.PI / 2 - lng * D2R;
    while (y - rot.y > Math.PI) y -= Math.PI * 2;
    while (y - rot.y < -Math.PI) y += Math.PI * 2;
    goal.y = y;
    idleAt = performance.now() + 5000;
    p.userData.bounce = performance.now();
    if (bubble) {
      bubble.textContent = `${p.userData.city.name}${p.userData.city.current ? ' · home' : ''}`;
      bubble.classList.remove('show');
      void bubble.offsetWidth;
      bubble.classList.add('show');
    }
    onSelect?.(name);
  };

  canvas.addEventListener('pointerdown', (e) => {
    dragging = { x: e.clientX, y: e.clientY, moved: 0 };
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragging.x, dy = e.clientY - dragging.y;
    dragging.moved += Math.abs(dx) + Math.abs(dy);
    dragging.x = e.clientX;
    dragging.y = e.clientY;
    goal.y += dx * 0.009;
    goal.x = THREE.MathUtils.clamp(goal.x + dy * 0.009, -1.1, 1.1);
    idleAt = performance.now() + 3000;
  });
  canvas.addEventListener('pointerup', (e) => {
    const click = dragging && dragging.moved < 5;
    dragging = null;
    if (!click) return;
    const r = canvas.getBoundingClientRect();
    raycaster.setFromCamera({ x: ((e.clientX - r.left) / r.width) * 2 - 1, y: -((e.clientY - r.top) / r.height) * 2 + 1 }, camera);
    const hit = raycaster.intersectObjects(pins, true)[0];
    let o = hit?.object;
    while (o && !o.userData.city) o = o.parent;
    if (o) selectCity(o.userData.city.name);
  });

  const resize = () => {
    if (!wrapEl) return;
    const w = wrapEl.clientWidth, h = wrapEl.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < 1 ? 38 : 30;
    camera.updateProjectionMatrix();
    post.setSize();
  };
  const ro = new ResizeObserver(resize);

  const v = new THREE.Vector3(), toCam = new THREE.Vector3();
  let last = performance.now();
  const tick = () => {
    raf = requestAnimationFrame(tick);
    const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!dragging && now > idleAt) goal.y -= dt * 0.12;
    rot.x += (goal.x - rot.x) * 0.08;
    rot.y += (goal.y - rot.y) * 0.08;
    spin.rotation.set(rot.x, rot.y, 0);

    flight.t += dt * 0.35;
    if (flight.t >= 1) flight = { r: routes[Math.floor(Math.random() * routes.length)], t: 0 };
    arcPoint(flight.r.a, flight.r.b, flight.t, flight.r.lift, tmpA);
    arcPoint(flight.r.a, flight.r.b, Math.min(1, flight.t + 0.02), flight.r.lift, tmpB);
    plane.position.copy(tmpA);
    spin.updateMatrixWorld();
    plane.up.copy(tmpA).normalize().applyQuaternion(spin.quaternion);
    plane.lookAt(spin.localToWorld(tmpB));

    for (const p of pins) {
      const b = p.userData.bounce ? (now - p.userData.bounce) / 1000 : 9;
      const k = b < 1 ? Math.exp(-b * 4) * Math.sin(b * 22) : 0;
      const s = (p === selected ? 1.5 : 1) * (1 + k * 0.6);
      p.scale.set(s, s * (1 + k * 0.4), s);
    }

    if (bubble && selected) {
      selected.userData.head.getWorldPosition(v);
      toCam.copy(camera.position).sub(v);
      const facing = selected.userData.normal.clone().applyQuaternion(spin.quaternion).dot(toCam) > 0;
      v.project(camera);
      bubble.style.visibility = facing ? 'visible' : 'hidden';
      bubble.style.transform = `translate(${(v.x * 0.5 + 0.5) * wrapEl.clientWidth}px, ${(-v.y * 0.5 + 0.5) * wrapEl.clientHeight}px) translate(-50%, -135%)`;
    }
    post.render();
  };

  return {
    mount(wrap, { onSelect: cb } = {}) {
      wrapEl = wrap;
      onSelect = cb;
      const dark = document.documentElement.classList.contains('dark');
      scene.background.setHex(dark ? 0x26231f : 0xfbf9f4);
      post.uniforms.inkColor.value.setHex(0x1d1b18);
      if (globe) wrap.querySelector('.loading')?.remove();
      wrap.appendChild(canvas);
      bubble = document.createElement('div');
      bubble.className = 'bubble';
      wrap.appendChild(bubble);
      ro.observe(wrap);
      resize();
      last = performance.now();
      cancelAnimationFrame(raf);
      tick();
      setTimeout(() => selectCity(home.name), 650);
    },
    unmount() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      bubble?.remove();
      canvas.remove();
      wrapEl = bubble = null;
      selected = null;
    },
    select: selectCity,
  };
}
