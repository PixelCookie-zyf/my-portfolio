import * as THREE from 'three';

// Font families as resolved from next/font (set by mount.js before any texture is drawn).
export const fonts = { hand: 'cursive', serif: 'Georgia, serif' };

export const css = (hex) => '#' + hex.toString(16).padStart(6, '0');

export function rng(seed = 1) {
  let s = Math.floor(seed * 9973) % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function makeTexture(w, h, draw, repeat = true) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  draw(canvas.getContext('2d'), w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  if (repeat) tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// Calls fn for (x, y) and every wrapped copy that touches the canvas, so textures tile seamlessly.
function wrapped(w, h, x, y, r, fn) {
  for (const dx of [-w, 0, w]) {
    for (const dy of [-h, 0, h]) {
      const px = x + dx, py = y + dy;
      if (px + r < 0 || px - r > w || py + r < 0 || py - r > h) continue;
      fn(px, py);
    }
  }
}

function blotches(ctx, w, h, R, count, rMin, rMax, colors, alpha) {
  for (let i = 0; i < count; i++) {
    const x = R() * w, y = R() * h, r = rMin + R() * (rMax - rMin);
    const c = colors[Math.floor(R() * colors.length)];
    wrapped(w, h, x, y, r, (px, py) => {
      const g = ctx.createRadialGradient(px, py, 0, px, py, r);
      g.addColorStop(0, `rgba(${c},${alpha})`);
      g.addColorStop(1, `rgba(${c},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}

export function grassTexture() {
  const R = rng(11);
  return makeTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#9fc685';
    ctx.fillRect(0, 0, w, h);
    blotches(ctx, w, h, R, 60, 40, 110, ['184,214,150', '122,168,104', '150,192,120'], 0.45);
    ctx.lineCap = 'round';
    ctx.lineWidth = 2.4;
    for (let i = 0; i < 70; i++) {
      const x = R() * w, y = R() * h, s = 5 + R() * 5;
      ctx.strokeStyle = R() < 0.6 ? 'rgba(196,224,160,0.85)' : 'rgba(104,150,90,0.7)';
      wrapped(w, h, x, y, s * 2, (px, py) => {
        ctx.beginPath();
        ctx.moveTo(px - s * 0.5, py);
        ctx.lineTo(px - s * 0.9, py - s);
        ctx.moveTo(px, py);
        ctx.lineTo(px, py - s * 1.3);
        ctx.moveTo(px + s * 0.5, py);
        ctx.lineTo(px + s * 0.9, py - s);
        ctx.stroke();
      });
    }
  });
}

export function sandTexture() {
  const R = rng(23);
  return makeTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#f0dcb0';
    ctx.fillRect(0, 0, w, h);
    blotches(ctx, w, h, R, 50, 40, 100, ['250,238,206', '224,196,146'], 0.4);
    for (let i = 0; i < 260; i++) {
      const x = R() * w, y = R() * h, r = 1 + R() * 1.6;
      ctx.fillStyle = R() < 0.5 ? 'rgba(208,170,112,0.7)' : 'rgba(255,246,222,0.8)';
      wrapped(w, h, x, y, r, (px, py) => {
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  });
}

export function stripeTexture(colors, count = 8) {
  return makeTexture(256, 256, (ctx, w, h) => {
    const sw = w / count;
    for (let i = 0; i < count; i++) {
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect(Math.floor(i * sw), 0, Math.ceil(sw) + 1, h);
    }
  });
}

export function signTexture(text, { bg = '#d9532f', fg = '#fbf9f4', ink = '#1d1b18', aspect = 3.2, serif = false } = {}) {
  const h = 160, w = Math.round(h * aspect);
  return makeTexture(w, h, (ctx) => {
    ctx.fillStyle = ink;
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 30);
    ctx.fill();
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(10, 10, w - 20, h - 20, 22);
    ctx.fill();
    const font = serif
      ? (s) => `italic 600 ${s}px ${fonts.serif}`
      : (s) => `bold ${s}px "Arial Rounded MT Bold", "Trebuchet MS", "Avenir Next", sans-serif`;
    let size = 92;
    ctx.font = font(size);
    while (ctx.measureText(text).width > w - 70 && size > 30) ctx.font = font((size -= 4));
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 16;
    ctx.strokeStyle = ink;
    ctx.strokeText(text, w / 2, h / 2 + 6);
    ctx.fillStyle = fg;
    ctx.fillText(text, w / 2, h / 2 + 6);
  }, false);
}

// Ruled notebook paper; the sea fades into it.
export function paperTexture(dark) {
  const R = rng(dark ? 5 : 3);
  const tex = makeTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = dark ? '#191815' : '#f5f1e8';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 1600; i++) {
      ctx.fillStyle = dark ? `rgba(255,240,220,${R() * 0.05})` : `rgba(120,100,70,${R() * 0.08})`;
      ctx.fillRect(R() * w, R() * h, 1.6, 1.6);
    }
    ctx.strokeStyle = dark ? 'rgba(138,162,242,0.16)' : 'rgba(50,83,179,0.2)';
    ctx.lineWidth = 2;
    for (let y = 32; y < h; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  });
  tex.repeat.set(44, 44);
  return tex;
}

export function codeTexture() {
  const R = rng(8);
  return makeTexture(512, 320, (ctx, w, h) => {
    ctx.fillStyle = '#1d1b18';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#2a2723';
    ctx.fillRect(0, 0, w, 34);
    ['#f0745b', '#f0c062', '#63b38d'].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(22 + i * 22, 17, 7, 0, Math.PI * 2);
      ctx.fill();
    });
    const cols = ['#8aa2f2', '#63b38d', '#f0c062', '#f0745b', '#cbc4b6'];
    for (let line = 0; line < 9; line++) {
      let x = 26 + [0, 28, 56, 28, 0, 28, 56, 56, 0][line];
      const y = 58 + line * 28;
      const parts = 1 + Math.floor(R() * 3);
      for (let k = 0; k < parts; k++) {
        const len = 30 + R() * 110;
        ctx.fillStyle = cols[Math.floor(R() * cols.length)];
        ctx.beginPath();
        ctx.roundRect(x, y, len, 12, 6);
        ctx.fill();
        x += len + 14;
      }
    }
    ctx.fillStyle = '#f0745b';
    ctx.fillRect(26, 58 + 9 * 28 - 2, 14, 18);
  }, false);
}

// Hand-lettered label (Caveat) on a coloured board.
export function handTexture(text, bg, aspect = 4) {
  const h = 96, w = Math.round(h * aspect);
  return makeTexture(w, h, (ctx) => {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#1d1b18';
    ctx.font = `700 68px ${fonts.hand}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, w / 2, h / 2 + 4);
  }, false);
}
