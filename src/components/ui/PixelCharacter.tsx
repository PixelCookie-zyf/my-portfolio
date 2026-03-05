'use client';

interface PixelCharacterProps {
  character: 'undergrad' | 'master' | 'intern' | 'engineer' | 'phd';
  size?: number;
  className?: string;
  playing?: boolean;
  speed?: string;
}

export default function PixelCharacter({
  character,
  size = 150,
  className = '',
  playing = true,
  speed = '0.6s',
}: PixelCharacterProps) {
  const src = `/images/pixel-experience/characters/char-${character}.png`;

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <img
        src={src}
        alt={`${character} character`}
        loading="eager"
        draggable={false}
        style={{
          width: size * 4,
          height: size,
          imageRendering: 'pixelated',
          animation: `sprite-walk ${speed} steps(4) infinite`,
          animationPlayState: playing ? 'running' : 'paused',
          display: 'block',
        }}
      />
      <style>{`
        @keyframes sprite-walk {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
