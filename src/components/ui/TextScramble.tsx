'use client';

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  ElementType,
} from 'react';

const CHARS = '!<>-_\\/[]{}—=+*^?#________';

interface OutputChar {
  char: string;
  scrambling: boolean;
}

interface QueueItem {
  from: string;
  to: string;
  start: number;
  end: number;
  char: string;
}

function randomChar(): string {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

export function useTextScramble(text: string) {
  const [output, setOutput] = useState<OutputChar[]>(() =>
    text.split('').map((char) => ({ char, scrambling: false }))
  );
  const rafRef = useRef<number | null>(null);
  const frameRef = useRef(0);
  const queueRef = useRef<QueueItem[]>([]);
  const resolvedTextRef = useRef('');
  const textRef = useRef(text);
  textRef.current = text;

  const animate = useCallback(function animateFrame() {
    const currentText = textRef.current;
    let complete = true;
    const next: OutputChar[] = [];

    for (const item of queueRef.current) {
      if (frameRef.current >= item.end) {
        next.push({ char: item.to, scrambling: false });
      } else if (frameRef.current >= item.start) {
        complete = false;
        if (!item.char || Math.random() < 0.28) {
          item.char = randomChar();
        }
        next.push({ char: item.char, scrambling: true });
      } else {
        complete = false;
        next.push({ char: item.from, scrambling: false });
      }
    }

    setOutput(next);
    frameRef.current++;

    if (!complete) {
      rafRef.current = requestAnimationFrame(animateFrame);
    } else {
      resolvedTextRef.current = currentText;
      rafRef.current = null;
    }
  }, []);

  const scramble = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    frameRef.current = 0;

    const fromText = resolvedTextRef.current;
    const toText = textRef.current;
    const length = Math.max(fromText.length, toText.length);
    const queue: QueueItem[] = [];

    for (let i = 0; i < length; i++) {
      const from = fromText[i] ?? '';
      const to = toText[i] ?? '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      queue.push({ from, to, start, end, char: '' });
    }

    queueRef.current = queue;
    rafRef.current = requestAnimationFrame(animate);
  }, [animate]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return { output, scramble };
}

interface TextScrambleProps {
  text: string;
  trigger?: 'mount' | 'hover' | 'inView';
  className?: string;
  as?: ElementType;
}

export default function TextScramble({
  text,
  trigger = 'mount',
  className,
  as: Tag = 'span',
}: TextScrambleProps) {
  const { output, scramble } = useTextScramble(text);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const containerRef = useRef<any>(null);

  useEffect(() => {
    if (trigger === 'mount') {
      scramble();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  useEffect(() => {
    if (trigger !== 'inView' || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          scramble();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return (
    <Tag
      ref={containerRef}
      className={className}
      onMouseEnter={trigger === 'hover' ? scramble : undefined}
    >
      {output.map((item, i) =>
        item.scrambling ? (
          <span key={i} className="opacity-50 font-mono">
            {item.char}
          </span>
        ) : (
          item.char || '\u00A0'
        )
      )}
    </Tag>
  );
}
