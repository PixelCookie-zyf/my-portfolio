import * as THREE from 'three';

// Toon outline post-process: lines come from depth discontinuities (laplacian of 1/z,
// which is zero across any plane) and from sharp normal changes. Objects on layer 1
// only (foam, light beams, paper margin) are skipped by the edge pass.

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  #include <packing>
  uniform sampler2D tColor;
  uniform sampler2D tNormal;
  uniform sampler2D tDepth;
  uniform vec2 resolution;
  uniform float pixelRatio;
  uniform float thickness;
  uniform float cameraNear;
  uniform float cameraFar;
  uniform float outlineOn;
  uniform float depthThreshold;
  uniform float normalThreshold;
  uniform vec3 inkColor;
  uniform float grain;
  varying vec2 vUv;

  float viewDepth(vec2 uv) {
    return -perspectiveDepthToViewZ(texture2D(tDepth, uv).x, cameraNear, cameraFar);
  }
  vec3 viewNormal(vec2 uv) {
    return texture2D(tNormal, uv).xyz * 2.0 - 1.0;
  }

  void main() {
    vec3 col = texture2D(tColor, vUv).rgb;
    vec2 o = thickness * pixelRatio / resolution;
    vec2 ox = vec2(o.x, 0.0), oy = vec2(0.0, o.y);

    float zc = viewDepth(vUv);
    float wc = 1.0 / zc;
    float wl = 1.0 / viewDepth(vUv - ox), wr = 1.0 / viewDepth(vUv + ox);
    float wd = 1.0 / viewDepth(vUv - oy), wu = 1.0 / viewDepth(vUv + oy);
    float lap = (abs(wl + wr - 2.0 * wc) + abs(wu + wd - 2.0 * wc)) / wc;
    float depthEdge = smoothstep(depthThreshold, depthThreshold * 1.8, lap);

    vec3 nc = viewNormal(vUv);
    float nd = max(
      max(length(nc - viewNormal(vUv - ox)), length(nc - viewNormal(vUv + ox))),
      max(length(nc - viewNormal(vUv - oy)), length(nc - viewNormal(vUv + oy)))
    );
    float normalEdge = smoothstep(normalThreshold, normalThreshold + 0.15, nd);

    float edge = max(depthEdge, normalEdge) * outlineOn;
    edge *= 1.0 - smoothstep(170.0, 280.0, zc);
    col = mix(col, inkColor, edge);

    // paper grain, like the portfolio's background
    float n = fract(sin(dot(floor(gl_FragCoord.xy / pixelRatio), vec2(12.9898, 78.233))) * 43758.5453);
    col *= 1.0 + grain * (n - 0.5);

    vec2 v = vUv - 0.5;
    col *= 1.0 - 0.22 * dot(v, v);

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

export class OutlinePipeline {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.enabled = true;
    this.normalMaterial = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
    this.uniforms = {
      tColor: { value: null },
      tNormal: { value: null },
      tDepth: { value: null },
      resolution: { value: new THREE.Vector2() },
      pixelRatio: { value: 1 },
      thickness: { value: 1.0 },
      cameraNear: { value: camera.near },
      cameraFar: { value: camera.far },
      outlineOn: { value: 1 },
      depthThreshold: { value: 0.004 },
      normalThreshold: { value: 0.45 },
      inkColor: { value: new THREE.Color(0x1d1b18) },
      grain: { value: 0.1 },
    };
    const quad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({ uniforms: this.uniforms, vertexShader, fragmentShader, depthTest: false, depthWrite: false })
    );
    quad.frustumCulled = false;
    this.quadScene = new THREE.Scene();
    this.quadScene.add(quad);
    this.quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.clearColor = new THREE.Color();
    this.setSize();
  }

  setSize() {
    const size = this.renderer.getDrawingBufferSize(new THREE.Vector2());
    this.colorTarget?.dispose();
    this.normalTarget?.dispose();
    this.colorTarget = new THREE.WebGLRenderTarget(size.x, size.y, { samples: 4, type: THREE.HalfFloatType });
    this.normalTarget = new THREE.WebGLRenderTarget(size.x, size.y);
    this.normalTarget.depthTexture = new THREE.DepthTexture(size.x, size.y);
    this.uniforms.tColor.value = this.colorTarget.texture;
    this.uniforms.tNormal.value = this.normalTarget.texture;
    this.uniforms.tDepth.value = this.normalTarget.depthTexture;
    this.uniforms.resolution.value.copy(size);
    this.uniforms.pixelRatio.value = this.renderer.getPixelRatio();
  }

  dispose() {
    this.colorTarget.dispose();
    this.normalTarget.dispose();
    this.normalTarget.depthTexture.dispose();
    this.normalMaterial.dispose();
  }

  render() {
    const { renderer, scene, camera } = this;

    camera.layers.enableAll();
    renderer.setRenderTarget(this.colorTarget);
    renderer.render(scene, camera);

    if (this.enabled) {
      const { background, fog } = scene;
      const autoShadow = renderer.shadowMap.autoUpdate;
      const clearAlpha = renderer.getClearAlpha();
      renderer.getClearColor(this.clearColor);

      scene.background = null;
      scene.fog = null;
      scene.overrideMaterial = this.normalMaterial;
      renderer.shadowMap.autoUpdate = false;
      camera.layers.set(0);
      renderer.setClearColor(0x8080ff, 1);
      renderer.setRenderTarget(this.normalTarget);
      renderer.clear();
      renderer.render(scene, camera);

      renderer.setClearColor(this.clearColor, clearAlpha);
      camera.layers.enableAll();
      renderer.shadowMap.autoUpdate = autoShadow;
      scene.overrideMaterial = null;
      scene.background = background;
      scene.fog = fog;
    }

    this.uniforms.outlineOn.value = this.enabled ? 1 : 0;
    this.uniforms.cameraNear.value = camera.near;
    this.uniforms.cameraFar.value = camera.far;
    renderer.setRenderTarget(null);
    renderer.render(this.quadScene, this.quadCamera);
  }
}
