/**
 * Hand-drawn marks that sit around words, in the same pencil spirit as Fox.
 * Each one draws itself once on load (see .draw / .sweep in globals.css).
 */

type MarkProps = {
  children: React.ReactNode;
  /** Seconds before the mark starts drawing. */
  delay?: number;
};

const delayStyle = (delay: number) => ({ "--delay": `${delay}s` }) as React.CSSProperties;

/** A marker stroke behind the text. */
export function Highlight({ children, delay = 0.3 }: MarkProps) {
  return (
    <span className="relative isolate inline-block whitespace-nowrap">
      <svg
        aria-hidden="true"
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
        className="sweep absolute -inset-x-[4%] bottom-[0.06em] -z-10 h-[0.52em] w-[108%] text-ochre opacity-70 dark:opacity-45"
        style={delayStyle(delay)}
      >
        <path
          d="M2 11 C 20 8, 40 12, 60 9 S 90 11, 98 8 L 99 17 C 80 19, 50 15, 30 18 S 8 16, 1 18 Z"
          fill="currentColor"
        />
      </svg>
      {children}
    </span>
  );
}

/** A loose pencil circle around the text. */
export function Circled({ children, delay = 0.9 }: MarkProps) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      <svg
        aria-hidden="true"
        viewBox="0 0 200 80"
        preserveAspectRatio="none"
        className="draw pointer-events-none absolute -inset-x-[9%] -inset-y-[22%] h-[144%] w-[118%] text-tomato"
        style={delayStyle(delay)}
      >
        <path
          pathLength={1}
          d="M 18 44 C 14 20, 70 6, 120 8 C 170 10, 196 26, 192 44 C 188 64, 140 76, 96 74 C 50 72, 10 62, 12 40 C 14 26, 40 14, 70 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </svg>
      {children}
    </span>
  );
}

/** A wavy line underneath the text. */
export function Squiggle({ children, delay = 1.4 }: MarkProps) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 16"
        preserveAspectRatio="none"
        className="draw pointer-events-none absolute -bottom-[0.2em] left-0 h-[0.3em] w-full text-forest"
        style={delayStyle(delay)}
      >
        <path
          pathLength={1}
          d="M2 9 Q 12 2, 22 9 T 42 9 T 62 9 T 82 9 T 102 9 T 122 9 T 142 9 T 162 9 T 182 9 T 198 9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

/** A curved arrow, drawn left to right. */
export function Arrow({ className = "", delay = 1.8 }: { className?: string; delay?: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 44"
      className={`draw ${className}`}
      style={delayStyle(delay)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path pathLength={1} d="M4 8 C 18 32, 38 38, 56 24" />
      <path pathLength={1} d="M47 21 L 57 23 L 53 33" />
    </svg>
  );
}

/** A tiny four-point sparkle. */
export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 1 C 13 8, 16 11, 23 12 C 16 13, 13 16, 12 23 C 11 16, 8 13, 1 12 C 8 11, 11 8, 12 1 Z" />
    </svg>
  );
}
