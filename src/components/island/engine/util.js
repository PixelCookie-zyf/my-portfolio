// Small helpers shared by the island's modules.

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

// Pointer position over `el` in normalised device coordinates (-1..1, y up), written into `out` (a Vector2).
export function pointerNdc(e, el, out) {
  const r = el.getBoundingClientRect();
  return out.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
}
