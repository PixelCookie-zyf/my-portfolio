"use client";

import { useEffect, useRef, useState } from "react";

export default function TelemetryWidget() {
  const [fps, setFps] = useState(60);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState("");

  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const rafId = useRef<number>(0);

  useEffect(() => {
    const loop = (now: number) => {
      frameCount.current++;
      const delta = now - lastTime.current;
      if (delta >= 1000) {
        setFps(Math.round((frameCount.current * 1000) / delta));
        frameCount.current = 0;
        lastTime.current = now;
      }
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toTimeString().slice(0, 8));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 hidden md:block pointer-events-none text-right font-mono text-xs text-gray-500 dark:text-gray-500 opacity-40 hover:opacity-80 transition-opacity">
      <div>FPS: {fps}</div>
      <div>
        X: {mouse.x} Y: {mouse.y}
      </div>
      <div>{time}</div>
    </div>
  );
}
