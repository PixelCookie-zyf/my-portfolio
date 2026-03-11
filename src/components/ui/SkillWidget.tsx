"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { type SkillCategory } from "@/data/skills";

interface SkillWidgetProps {
  cat: SkillCategory;
}

export default function SkillWidget({ cat }: SkillWidgetProps) {
  const [flipped, setFlipped] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const CategoryIcon = cat.categoryIcon;

  // Click outside to flip back
  useEffect(() => {
    if (!flipped) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setFlipped(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [flipped]);

  return (
    <div
      ref={ref}
      className="aspect-square [perspective:600px]"
      onClick={() => setFlipped((f) => !f)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative h-full w-full cursor-pointer [transform-style:preserve-3d]"
      >
        {/* Front face — detail view */}
        <div
          className={`absolute inset-0 overflow-hidden rounded-3xl ${cat.bg} p-4 shadow-lg [backface-visibility:hidden]`}
        >
          <div className="pointer-events-none absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
          <div className="relative z-10 flex h-full flex-col">
            <div className="flex items-center gap-1.5 mb-1.5">
              <CategoryIcon className="text-lg text-white/90" />
              <h3 className="text-base font-bold text-white">{cat.label}</h3>
            </div>
            <p className="text-xs leading-snug text-white/70 mb-2 line-clamp-3">
              {cat.description}
            </p>
            <div className="mt-auto flex flex-wrap gap-1.5">
              {cat.skills.map((skill) => {
                const SkillIcon = skill.icon;
                return (
                  <span
                    key={skill.name}
                    className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white"
                  >
                    <SkillIcon className="shrink-0 text-xs text-white/80" />
                    {skill.name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Back face — icon view */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-3xl ${cat.bg} p-4 shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]`}
        >
          <div className="pointer-events-none absolute inset-0 bg-white/5 backdrop-blur-[1px]" />
          <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10 flex flex-col items-center gap-2 text-center">
            <CategoryIcon className="text-4xl text-white/90" />
            <span className="text-sm font-bold text-white">{cat.label}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
