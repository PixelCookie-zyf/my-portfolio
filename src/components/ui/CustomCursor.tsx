"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const outline = useRef({ x: -100, y: -100 });
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
      outline.current.x += (mouse.current.x - outline.current.x) * 0.15;
      outline.current.y += (mouse.current.y - outline.current.y) * 0.15;
      if (outlineRef.current) {
        outlineRef.current.style.transform = `translate(${outline.current.x - 20}px, ${outline.current.y - 20}px)`;
      }
      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Dot - follows mouse exactly */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "white",
          mixBlendMode: "difference",
          zIndex: 9999,
          pointerEvents: "none",
          willChange: "transform",
        }}
      />
      {/* Outline - trails with lerp */}
      <div
        ref={outlineRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isHovering ? 60 : 40,
          height: isHovering ? 60 : 40,
          borderRadius: "50%",
          border: "1px solid white",
          mixBlendMode: "difference",
          zIndex: 9999,
          pointerEvents: "none",
          willChange: "transform",
          transition: "width 0.2s ease, height 0.2s ease",
          marginLeft: isHovering ? -10 : 0,
          marginTop: isHovering ? -10 : 0,
        }}
      />
    </>
  );
}
