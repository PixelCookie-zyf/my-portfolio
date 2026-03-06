"use client";

import { useEffect, useRef, useCallback } from "react";

const densityChars =
  " .'`^,:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

interface AsciiCanvasProps {
  variant?: "hero" | "subtle";
  className?: string;
}

function simpleNoise(x: number, y: number, t: number): number {
  return (
    Math.sin(x * 0.05 + t) * Math.cos(y * 0.05 + t) +
    Math.sin(x * 0.01 - t) * Math.cos(y * 0.12) * 0.5
  );
}

export default function AsciiCanvas({
  variant = "hero",
  className = "",
}: AsciiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const charSize = variant === "hero" ? 14 : 16;

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number, t: number) => {
      const isDark = document.documentElement.classList.contains("dark");
      ctx.clearRect(0, 0, width, height);
      ctx.font = `${charSize}px monospace`;
      ctx.textBaseline = "top";

      const cols = Math.ceil(width / charSize);
      const rows = Math.ceil(height / charSize);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Only render bottom portion (like reference — skip top 40%)
      const startRow = Math.floor(rows * 0.4);

      for (let row = startRow; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * charSize;
          const y = row * charSize;

          const noise = simpleNoise(col, row, t);

          // Normalized Y: 0 at bottom, 1 at top of rendered area
          const normalizedY = (rows - row) / rows;

          // Mountain height threshold
          const mountainHeight =
            0.3 +
            Math.sin(col * 0.05 + t * 0.1) * 0.1 +
            Math.cos(col * 0.2) * 0.05;

          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Mouse lens effect
          if (dist < 150) {
            const lensStrength = 1 - dist / 150;
            const shiftX = (dx / (dist + 1)) * 10 * lensStrength;
            const shiftY = (dy / (dist + 1)) * 10 * lensStrength;
            const bit = Math.random() > 0.5 ? "1" : "0";

            if (isDark) {
              ctx.fillStyle = `rgba(34, 197, 94, ${lensStrength * 0.9})`;
            } else {
              ctx.fillStyle = `rgba(0, 0, 0, ${lensStrength * 0.85})`;
            }
            ctx.fillText(bit, x + charSize / 2 - shiftX, y + charSize / 2 - shiftY);
          } else if (normalizedY < mountainHeight + noise * 0.1) {
            // Density char based on noise
            const index = Math.floor(Math.abs(noise) * densityChars.length);
            const char = densityChars[index % densityChars.length];
            const alpha = (1 - normalizedY * 2) * (variant === "hero" ? 0.7 : 0.4);

            if (alpha > 0.05) {
              if (isDark) {
                ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
              } else {
                ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
              }
              ctx.fillText(char, x + charSize / 2, y + charSize / 2);
            }
          }
        }
      }
    },
    [charSize, variant]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    const setSize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();

    const observer = new ResizeObserver(() => {
      setSize();
    });
    observer.observe(canvas);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const FPS = 15;
    const interval = 1000 / FPS;
    let t = 0;

    const animate = (timestamp: number) => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsed = timestamp - lastTimeRef.current;
      if (elapsed < interval) return;
      lastTimeRef.current = timestamp - (elapsed % interval);
      t += 0.02;
      draw(ctx, width, height, t);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      observer.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [draw]);

  const heightClass = variant === "hero" ? "h-[50vh]" : "h-[200px]";

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`w-full ${heightClass} ${className}`}
    />
  );
}
