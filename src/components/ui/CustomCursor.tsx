"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const outlinePos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number>(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    const isTouch =
      "ontouchstart" in window || window.matchMedia("(hover: none)").matches;
    setIsTouchDevice(isTouch);
    if (isTouch) return;

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest("a, button, [role=button]")) {
        setIsHovering(true);
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest("a, button, [role=button]")) {
        setIsHovering(false);
      }
    };

    const animate = () => {
      outlinePos.current.x += (mouse.current.x - outlinePos.current.x) * 0.15;
      outlinePos.current.y += (mouse.current.y - outlinePos.current.y) * 0.15;
      if (outlineRef.current) {
        outlineRef.current.style.transform = `translate(${outlinePos.current.x - 20}px, ${outlinePos.current.y - 20}px)`;
      }
      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (isTouchDevice) return null;

  const size = isHovering ? 60 : 40;
  const offset = isHovering ? -10 : 0;

  return (
    <>
      <div
        ref={dotRef}
        className="dark:bg-emerald-400 bg-black"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          zIndex: 9999,
          pointerEvents: "none",
          willChange: "transform",
        }}
      />
      <div
        ref={outlineRef}
        className="dark:border-emerald-400 border-black"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: size,
          height: size,
          borderRadius: "50%",
          borderWidth: 1,
          borderStyle: "solid",
          zIndex: 9999,
          pointerEvents: "none",
          willChange: "transform",
          transition: "width 0.2s ease, height 0.2s ease",
          marginLeft: offset,
          marginTop: offset,
        }}
      />
    </>
  );
}
