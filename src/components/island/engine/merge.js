import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const KEEP = new Set(['position', 'normal', 'uv', 'color']);

// Bakes every mesh under root into one mesh per (material, shadow flags, layers),
// so the whole static town costs a few dozen draw calls instead of thousands.
export function mergeStatic(root) {
  root.updateMatrixWorld(true);
  const buckets = new Map();

  root.traverse((o) => {
    if (!o.isMesh) return;
    const m = o.material;
    const key = `${m.uuid}|${o.castShadow}|${o.receiveShadow}|${o.layers.mask}`;
    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = { material: m, cast: o.castShadow, receive: o.receiveShadow, layers: o.layers.mask, geos: [] };
      buckets.set(key, bucket);
    }

    const g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
    g.applyMatrix4(o.matrixWorld);
    for (const name of Object.keys(g.attributes)) if (!KEEP.has(name)) g.deleteAttribute(name);
    const n = g.attributes.position.count;
    if (!g.attributes.normal) g.computeVertexNormals();
    if (!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(n * 2), 2));
    if (m.vertexColors) {
      if (!g.attributes.color) g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 3).fill(1), 3));
    } else if (g.attributes.color) {
      g.deleteAttribute('color');
    }
    g.morphAttributes = {};
    g.clearGroups();
    bucket.geos.push(g);
  });

  const out = new THREE.Group();
  for (const b of buckets.values()) {
    const mesh = new THREE.Mesh(mergeGeometries(b.geos, false), b.material);
    mesh.castShadow = b.cast;
    mesh.receiveShadow = b.receive;
    mesh.layers.mask = b.layers;
    out.add(mesh);
    b.geos.forEach((g) => g.dispose());
  }
  return out;
}
