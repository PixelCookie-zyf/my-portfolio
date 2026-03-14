"use client";

import { useEffect, useRef } from "react";

export default function TelemetryWidget() {
  const fpsRef = useRef<HTMLSpanElement>(null);
  const mouseRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const frameCount = useRef(0);
  const lastTime = useRef(0);
  const rafId = useRef<number>(0);

  useEffect(() => {
    lastTime.current = performance.now();

    const loop = (now: number) => {
      frameCount.current++;
      const delta = now - lastTime.current;
      if (delta >= 1000) {
        if (fpsRef.current) {
          fpsRef.current.textContent = String(Math.round((frameCount.current * 1000) / delta));
        }
        frameCount.current = 0;
        lastTime.current = now;
      }
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (mouseRef.current) {
        mouseRef.current.textContent = `X: ${e.clientX} Y: ${e.clientY}`;
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const tick = () => {
      if (timeRef.current) {
        timeRef.current.textContent = new Date().toTimeString().slice(0, 8);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 hidden md:block pointer-events-none text-right font-mono text-xs text-gray-500 dark:text-emerald-400/50 opacity-40 hover:opacity-80 transition-opacity">
      <div>FPS: <span ref={fpsRef}>--</span></div>
      <div><span ref={mouseRef}>X: 0 Y: 0</span></div>
      <div><span ref={timeRef}>--:--:--</span></div>
    </div>
  );
}
