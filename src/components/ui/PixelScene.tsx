'use client';

import PixelCharacter from '@/components/ui/PixelCharacter';

interface PixelSceneProps {
  className?: string;
}

const ROAD_H = 80;

// Animation speed per character role — makes the scene feel alive
const CHARACTER_SPEEDS: Record<string, string> = {
  undergrad: '0.5s',  // energetic
  master:    '0.7s',  // calm
  intern:    '0.4s',  // fast typing
  engineer:  '0.65s', // confident
  phd:       '0.8s',  // thoughtful
};

// A single prop image, blended so white bg becomes transparent
function Prop({
  src,
  width,
  height,
  left,
  extraBottom = 0,
}: {
  src: string;
  width: number;
  height: number;
  left: number;
  extraBottom?: number;
}) {
  return (
    <img
      src={src}
      alt=""
      width={width}
      height={height}
      loading="eager"
      draggable={false}
      style={{
        position: 'absolute',
        left,
        bottom: ROAD_H + extraBottom,
        imageRendering: 'pixelated',
        mixBlendMode: 'multiply',
        display: 'block',
      } as React.CSSProperties}
    />
  );
}

// A character wrapper with hover lift + scale effect
function Char({
  character,
  left,
  size = 128,
}: {
  character: 'undergrad' | 'master' | 'intern' | 'engineer' | 'phd';
  left: number;
  size?: number;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left,
        bottom: ROAD_H,
        mixBlendMode: 'multiply',
        transition: 'transform 0.2s ease, filter 0.2s ease',
        cursor: 'default',
      } as React.CSSProperties}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.12) translateY(-6px)';
        (e.currentTarget as HTMLDivElement).style.filter = 'drop-shadow(0 6px 10px rgba(0,0,0,0.18))';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = '';
        (e.currentTarget as HTMLDivElement).style.filter = '';
      }}
    >
      <PixelCharacter
        character={character}
        size={size}
        playing
        speed={CHARACTER_SPEEDS[character]}
      />
    </div>
  );
}

export default function PixelScene({ className = '' }: PixelSceneProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        minWidth: 1350,
        height: 220,
        // Sky gradient fading to near-white at bottom so road blends naturally
        background:
          'linear-gradient(to bottom, #bfdbfe 0%, #e0f2fe 30%, #fef9c3 72%, #fffbeb 100%)',
        // Inner depth shadow
        boxShadow:
          'inset 0 2px 8px rgba(0,0,0,0.06), inset 0 -2px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.08)',
      }}
    >
      {/* ── Road ── */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: ROAD_H,
          backgroundImage: 'url(/images/pixel-experience/scenes/road.png)',
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 100%',
          imageRendering: 'pixelated',
        }}
      />

      {/* ── Station 1 — Undergrad ── */}
      <Prop src="/images/pixel-experience/props/tree.png"          width={64} height={80} left={0} />
      <Char character="undergrad" left={55} />
      <Prop src="/images/pixel-experience/props/books-stack.png"   width={48} height={48} left={190} />

      {/* ── Ambiance 1→2 ── */}
      <Prop src="/images/pixel-experience/props/bench.png"         width={72} height={48} left={218} />
      <Prop src="/images/pixel-experience/props/streetlamp.png"    width={32} height={96} left={300} />

      {/* ── Station 2 — Master ── */}
      <Prop src="/images/pixel-experience/props/graduation-arch.png" width={96} height={80} left={330} />
      <Char character="master" left={365} />

      {/* ── Ambiance 2→3 ── */}
      <Prop src="/images/pixel-experience/props/streetlamp.png"    width={32} height={96} left={515} />

      {/* ── Station 3 — Intern ── */}
      <Char character="intern" left={560} />
      <Prop src="/images/pixel-experience/props/computer-desk.png" width={96} height={72} left={695} />

      {/* ── Ambiance 3→4 ── */}
      <Prop src="/images/pixel-experience/props/streetlamp.png"    width={32} height={96} left={805} />

      {/* ── Station 4 — Engineer ── */}
      <Char character="engineer" left={850} />
      <Prop src="/images/pixel-experience/props/meituan-kangaroo.png" width={72} height={72} left={990} />

      {/* ── Ambiance 4→5 ── */}
      <Prop src="/images/pixel-experience/props/streetlamp.png"    width={32} height={96} left={1070} />

      {/* ── Station 5 — PhD ── */}
      <Char character="phd" left={1115} />
      <Prop src="/images/pixel-experience/props/signpost.png"      width={32} height={80} left={1255} />
      <Prop src="/images/pixel-experience/props/bench.png"         width={72} height={48} left={1268} />

      {/* ── Right-edge scroll hint gradient ── */}
      <div
        className="absolute right-0 top-0 bottom-0 pointer-events-none"
        style={{
          width: 80,
          background: 'linear-gradient(to right, transparent, rgba(255,251,235,0.7))',
        }}
      />

      {/* ── Left-edge fade ── */}
      <div
        className="absolute left-0 top-0 bottom-0 pointer-events-none"
        style={{
          width: 32,
          background: 'linear-gradient(to left, transparent, rgba(191,219,254,0.4))',
        }}
      />
    </div>
  );
}
