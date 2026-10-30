import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildWorld } from './world.js';
import { OutlinePipeline } from './outline.js';
import { createModal } from './ui.js';
import { createFishing } from './fishing.js';
import { fonts } from './textures.js';

const THEMES = {
  day: { paper: 0xf5f1e8, sky: 0xfff6e6, ground: 0xb8c9a0, hemi: 1.6, sun: 0xfff0d8, sunI: 2.1, grain: 0.1 },
  night: { paper: 0x191815, sky: 0x6a7fb8, ground: 0x2a2d36, hemi: 1.05, sun: 0xa9bcff, sunI: 0.75, grain: 0.14 },
};
const TILT = { writing: -3, projects: 2, about: -2, travel: 3, contact: -1.5 };
const ease = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

// Mounts the island into `stage` (a sized, positioned element). With `fullscreen` the island owns the
// whole viewport (zoom, pan, touch rotate); otherwise it behaves as a section inside a scrolling page.
export async function mountIsland(stage, { data, navigate, night = false, fullscreen = false, onModal, onFishing }) {
  // Canvas textures need the next/font families, which live behind hashed names in CSS variables.
  const cssVar = (name) => getComputedStyle(document.body).getPropertyValue(name).trim();
  fonts.hand = `${cssVar('--font-caveat') || 'Caveat'}, cursive`;
  fonts.serif = `${cssVar('--font-fraunces') || 'Fraunces'}, Georgia, serif`;
  await Promise.race([
    Promise.all([`700 64px ${fonts.hand}`, `italic 600 64px ${fonts.serif}`].map((f) => document.fonts.load(f).catch(() => null))),
    new Promise((r) => setTimeout(r, 2500)),
  ]);

  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const canvas = document.createElement('canvas');
  canvas.className = 'isl-canvas';
  const labelLayer = document.createElement('div');
  labelLayer.className = 'isl-labels';
  stage.append(canvas, labelLayer);
  const size = () => ({ w: stage.clientWidth || 1, h: stage.clientHeight || 1 });

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarse ? 1.5 : 2));
  renderer.setSize(size().w, size().h, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color();
  scene.fog = new THREE.Fog(0, 160, 340);
  const hemi = new THREE.HemisphereLight();
  const sun = new THREE.DirectionalLight();
  sun.position.set(18, 45, -28);
  sun.castShadow = true;
  sun.shadow.mapSize.setScalar(coarse ? 2048 : 4096);
  Object.assign(sun.shadow.camera, { left: -50, right: 50, top: 50, bottom: -50, near: 1, far: 140 });
  sun.shadow.camera.updateProjectionMatrix();
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.05;
  scene.add(hemi, sun, sun.target);

  const camera = new THREE.PerspectiveCamera(30, size().w / size().h, 1, 600);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.screenSpacePanning = false;
  controls.minDistance = 25;
  controls.minPolarAngle = 0.25;
  controls.maxPolarAngle = 1.25;
  controls.autoRotateSpeed = 0.6;
  // Inside a scrolling page the wheel and touch swipes must keep scrolling it; taps still open landmarks.
  const interactive = fullscreen || !coarse;
  controls.enableZoom = fullscreen;
  controls.enablePan = fullscreen;
  controls.enabled = interactive;
  canvas.style.touchAction = interactive ? 'none' : 'pan-y';
  // On touch screens the island handles like a map: one finger moves it, two fingers pinch to zoom
  // and turn it. (With a mouse: left-drag turns, right-drag or shift-drag moves, the wheel zooms.)
  if (coarse) controls.touches = { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_ROTATE };
  const PAN_LIMIT = 26;

  const frame = () => {
    const { w, h } = size();
    const dist = 104 * Math.max(1, 1.35 / (w / h));
    const el = THREE.MathUtils.degToRad(52), az = THREE.MathUtils.degToRad(45);
    controls.target.set(-1, 1, 1);
    camera.position.set(-1 + dist * Math.cos(el) * Math.cos(az), 1 + dist * Math.sin(el), 1 + dist * Math.cos(el) * Math.sin(az));
    controls.maxDistance = Math.max(150, dist + 20);
    controls.update();
  };

  const world = buildWorld(scene);
  const post = new OutlinePipeline(renderer, scene, camera);
  frame();

  let fishing = null;
  const setNight = (on) => {
    const th = on ? THEMES.night : THEMES.day;
    scene.background.setHex(th.paper);
    scene.fog.color.setHex(th.paper);
    hemi.color.setHex(th.sky);
    hemi.groundColor.setHex(th.ground);
    hemi.intensity = th.hemi;
    sun.color.setHex(th.sun);
    sun.intensity = th.sunI;
    post.uniforms.grain.value = th.grain;
    world.setNight(on);
    fishing?.setNight(on);
  };
  setNight(night);

  const ro = new ResizeObserver(() => {
    const { w, h } = size();
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    post.setSize();
  });
  ro.observe(stage);

  // --- camera glide toward a landmark while its pop-up is open ---------------------
  let glide = null, home = null, spinWas = false;
  const glideTo = (pos, target, dur = 0.9) => {
    glide = { p0: camera.position.clone(), t0: controls.target.clone(), p1: pos, t1: target, k: 0, dur };
  };
  const modal = createModal({
    data,
    navigate,
    onClose: () => {
      if (home) glideTo(home.p, home.t);
      home = null;
      controls.enabled = interactive;
      controls.autoRotate = spinWas;
      onModal?.(null);
    },
  });

  const v = new THREE.Vector3();
  const toStage = (p) => {
    v.copy(p).project(camera);
    const { w, h } = size();
    return { x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h, behind: v.z > 1 };
  };

  const openSpot = (h) => {
    if (modal.isOpen || fishing?.active) return;
    const s = toStage(h.anchor), r = stage.getBoundingClientRect();
    home = glide ? { p: glide.p1.clone(), t: glide.t1.clone() } : { p: camera.position.clone(), t: controls.target.clone() };
    controls.enabled = false;
    spinWas = controls.autoRotate;
    controls.autoRotate = false;
    const target = new THREE.Vector3(h.anchor.x, 2, h.anchor.z);
    const dir = camera.position.clone().sub(controls.target).normalize();
    glideTo(target.clone().addScaledVector(dir, 46), target);
    modal.open(h.key, { x: r.left + s.x, y: r.top + s.y });
    onModal?.(h.key);
  };

  // --- sticky-note labels (real links, so they still work without the pop-ups) ------
  // The canvas and the notes track hover separately: moving from a building onto its note (or back)
  // must not drop the hover for a frame, or the building sinks, the note slides away, and it flickers.
  let canvasHover = null, noteHover = null, down = null, beepUntil = 0;
  const travel = world.hotspots.find((h) => h.key === 'travel');
  if (travel && data.cities.length) travel.sub = `${data.cities.length} cities & counting`;
  for (const h of world.hotspots) {
    const a = document.createElement('a');
    a.className = `note note-${h.note}`;
    a.href = h.href;
    a.innerHTML = `<b>${h.label}</b><small>${h.sub}</small>`;
    a.addEventListener('pointerenter', () => (noteHover = h));
    a.addEventListener('pointerleave', () => noteHover === h && (noteHover = null));
    a.addEventListener('click', (e) => {
      e.preventDefault();
      openSpot(h);
    });
    labelLayer.appendChild(a);
    h.el = a;
  }
  const beep = document.createElement('div');
  beep.className = 'bubble';
  beep.textContent = 'beep beep!';
  labelLayer.appendChild(beep);

  const placeAt = (el, p, transform) => {
    const s = toStage(p);
    el.style.visibility = s.behind ? 'hidden' : 'visible';
    if (!s.behind) el.style.transform = `translate(${s.x}px, ${s.y}px) ${transform}`;
  };

  // --- the fishing jetty: the camera settles behind the rod while the game runs ----------
  let fishHome = null;
  const startFishing = () => {
    if (modal.isOpen || fishing.active) return;
    fishHome = glide ? { p: glide.p1.clone(), t: glide.t1.clone() } : { p: camera.position.clone(), t: controls.target.clone() };
    spinWas = controls.autoRotate;
    controls.autoRotate = false;
    controls.enabled = false;
    canvasHover = noteHover = null;
    const { w, h } = size(), v = fishing.view(w / h);
    glideTo(v.pos, v.target, 1.3);
    fishing.enter();
    onFishing?.(true);
  };
  fishing = createFishing({
    scene, camera, canvas, stage, labels: labelLayer, spot: world.fishing, data, placeAt, navigate,
    onEnter: startFishing,
    onExit: () => {
      if (fishHome) glideTo(fishHome.p, fishHome.t, 1.1);
      fishHome = null;
      controls.enabled = interactive;
      controls.autoRotate = spinWas;
      onFishing?.(false);
    },
  });
  fishing.setNight(night);

  // --- picking -------------------------------------------------------------------
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const pick = (e) => {
    const r = canvas.getBoundingClientRect();
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects([world.bus, ...fishing.pickables, ...world.hotspots.map((h) => h.object)], true)[0];
    let o = hit?.object;
    while (o && !o.userData.hotspot && o !== world.bus && !fishing.pickables.includes(o)) o = o.parent;
    if (!o) return { spot: null, bus: false };
    if (o === world.bus) return { spot: null, bus: true };
    if (fishing.pickables.includes(o)) return { spot: null, bus: false, fish: true };
    return { spot: world.hotspots.find((h) => h.key === o.userData.hotspot) ?? null, bus: false };
  };
  canvas.addEventListener('pointermove', (e) => {
    if (down || modal.isOpen || fishing.active || e.pointerType === 'touch') return;
    const p = pick(e);
    canvasHover = p.spot;
    canvas.classList.toggle('pointing', !!p.spot || p.bus || !!p.fish);
  });
  canvas.addEventListener('pointerleave', () => (canvasHover = null));
  canvas.addEventListener('pointerdown', (e) => (down = { x: e.clientX, y: e.clientY }));
  canvas.addEventListener('pointercancel', () => (down = null));
  canvas.addEventListener('pointerup', (e) => {
    const moved = down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6;
    down = null;
    if (moved || modal.isOpen || fishing.active) return;
    const p = pick(e);
    if (p.bus) {
      world.bus.userData.honk();
      beepUntil = clock.elapsedTime + 1.3;
    } else if (p.fish) {
      startFishing();
    } else if (p.spot) {
      openSpot(p.spot);
    }
  });

  // --- loop (only while the island is on screen) ------------------------------------
  const clock = new THREE.Clock();
  const anchor = new THREE.Vector3();
  const loop = () => {
    const raw = clock.getDelta(), dt = Math.min(raw, 0.05);
    world.update(clock.elapsedTime, dt);
    fishing.update(clock.elapsedTime, dt);
    if (glide) {
      glide.k = Math.min(1, glide.k + Math.min(raw, 0.3) / glide.dur);
      const k = ease(glide.k);
      camera.position.lerpVectors(glide.p0, glide.p1, k);
      controls.target.lerpVectors(glide.t0, glide.t1, k);
      if (glide.k >= 1) glide = null;
    }
    controls.update();
    // keep the island in reach: panning can't drag the view centre out past the coast
    if (!glide && !modal.isOpen && !fishing.active) {
      const t = controls.target, r = Math.hypot(t.x, t.z);
      if (r > PAN_LIMIT) {
        const k = PAN_LIMIT / r - 1;
        camera.position.x += t.x * k;
        camera.position.z += t.z * k;
        t.x += t.x * k;
        t.z += t.z * k;
      }
    }
    const hovered = noteHover ?? canvasHover;
    for (const h of world.hotspots) {
      const active = hovered === h && !modal.isOpen;
      h.object.position.y += ((active ? h.lift : 0) - h.object.position.y) * 0.18;
      h.el.classList.toggle('active', active);
      anchor.copy(h.anchor).y += h.object.position.y;
      placeAt(h.el, anchor, `translate(-50%, -100%) rotate(${TILT[h.key] ?? 0}deg)`);
    }
    anchor.copy(world.bus.position).y += 3.2;
    beep.classList.toggle('show', clock.elapsedTime < beepUntil);
    placeAt(beep, anchor, 'translate(-50%, -100%)');
    post.render();
  };
  const io = new IntersectionObserver(([entry]) => {
    clock.getDelta();
    renderer.setAnimationLoop(entry.isIntersecting ? loop : null);
  });
  io.observe(stage);
  loop();

  return {
    setNight,
    setOutline(on) {
      post.enabled = on;
    },
    setSpin(on) {
      controls.autoRotate = on;
    },
    fish: startFishing,
    open: (key) => {
      const h = world.hotspots.find((x) => x.key === key);
      if (!h) return;
      fishing.exit();
      if (!modal.isOpen) return openSpot(h);
      modal.close();
      setTimeout(() => openSpot(h), 360);
    },
    close: () => modal.close(),
    dispose() {
      renderer.setAnimationLoop(null);
      io.disconnect();
      ro.disconnect();
      modal.dispose();
      fishing.dispose();
      controls.dispose();
      post.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
      labelLayer.remove();
    },
  };
}
