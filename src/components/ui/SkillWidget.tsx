"use client";

import { motion } from "framer-motion";
import { type SkillCategory } from "@/data/skills";

interface SkillWidgetProps {
  cat: SkillCategory;
}

export default function SkillWidget({ cat }: SkillWidgetProps) {
  const CategoryIcon = cat.categoryIcon;
  const skillCountLabel = `${cat.skills.length} ${cat.skills.length === 1 ? "skill" : "skills"}`;

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      className="group relative h-full min-h-[15rem] overflow-hidden rounded-[2rem] border border-border/70 bg-background/80 p-5 shadow-[0_14px_34px_-30px_rgba(15,23,42,0.45)] backdrop-blur-sm"
    >
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full ${cat.bg} opacity-15 blur-3xl`}
      />
      <div
        className={`pointer-events-none absolute -bottom-8 left-4 h-16 w-16 rounded-full ${cat.bg} opacity-8 blur-2xl`}
      />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${cat.bg} text-white shadow-lg shadow-black/10`}
          >
            <CategoryIcon className="text-xl" />
          </div>
          <span className="rounded-full border border-border/70 bg-background/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-muted">
            {skillCountLabel}
          </span>
        </div>

        <div className="mt-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">stack</p>
          <h3 className="text-lg font-semibold text-foreground">{cat.label}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">
            {cat.description}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {cat.skills.map((skill) => {
            const SkillIcon = skill.icon;

            return (
              <span
                key={skill.name}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card-bg/65 px-3 py-1.5 text-xs font-medium text-foreground/80"
              >
                <SkillIcon className="shrink-0 text-[11px] text-muted" />
                {skill.name}
              </span>
            );
          })}
        </div>
      </div>
    </motion.article>
  );
}
