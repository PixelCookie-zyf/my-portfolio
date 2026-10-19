/**
 * A small geometric pattern generated from a string, so every post or
 * project gets its own stable "cover" without needing an image.
 */

const COLORS = ["var(--tomato)", "var(--forest)", "var(--ochre)", "var(--blue)", "var(--ink)"];
const CELL = 40;

function seededRandom(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i += 1) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let state = h >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Shape({ kind, x, y, color, turn }: { kind: number; x: number; y: number; color: string; turn: number }) {
  const r = CELL / 2;
  const transform = `rotate(${turn * 90} ${x + r} ${y + r})`;
  const style = { fill: color };
  switch (kind) {
    case 0:
      return <circle cx={x + r} cy={y + r} r={r * 0.78} style={style} />;
    case 1: // quarter circle anchored in a corner
      return <path d={`M${x} ${y} h${CELL} a${CELL} ${CELL} 0 0 1 -${CELL} ${CELL} z`} transform={transform} style={style} />;
    case 2: // half circle
      return <path d={`M${x} ${y + r} a${r} ${r} 0 0 1 ${CELL} 0 z`} transform={transform} style={style} />;
    case 3: // triangle
      return <path d={`M${x} ${y} L${x + CELL} ${y} L${x} ${y + CELL} z`} transform={transform} style={style} />;
    case 4: // small dot
      return <circle cx={x + r} cy={y + r} r={r * 0.28} style={style} />;
    default:
      return null;
  }
}

export default function PostCover({
  seed,
  cols = 6,
  rows = 4,
  className = "",
}: {
  seed: string;
  cols?: number;
  rows?: number;
  className?: string;
}) {
  const random = seededRandom(seed);
  const pick = <T,>(items: T[]) => items[Math.floor(random() * items.length)];
  const cells = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const filled = random() < 0.32;
      const background = filled ? pick(COLORS) : undefined;
      const foreground = pick(COLORS.filter((color) => color !== background));
      cells.push({
        x: col * CELL,
        y: row * CELL,
        background,
        foreground,
        kind: random() < 0.15 ? -1 : Math.floor(random() * 5),
        turn: Math.floor(random() * 4),
      });
    }
  }

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${cols * CELL} ${rows * CELL}`}
      preserveAspectRatio="xMidYMid slice"
      className={`block bg-inset ${className}`}
    >
      {cells.map((cell, index) => (
        <g key={index}>
          {cell.background && (
            <rect x={cell.x} y={cell.y} width={CELL} height={CELL} style={{ fill: cell.background }} />
          )}
          <Shape kind={cell.kind} x={cell.x} y={cell.y} color={cell.foreground} turn={cell.turn} />
        </g>
      ))}
    </svg>
  );
}
