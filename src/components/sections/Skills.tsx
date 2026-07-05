"use client";

import SectionTitle from "@/components/ui/SectionTitle";
import ScrollReveal from "@/components/ui/ScrollReveal";
import GitHubWidget from "@/components/ui/GitHubWidget";
import { skillCategories } from "@/data/skills";

export default function Skills() {
  return (
    <section id="skills" className="bg-card-bg/30 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          index="02"
          kicker="craft"
          title="Skills & Activities"
          subtitle="The tools I reach for — and the commit graph that keeps me honest."
        />

        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* Skills — editorial hairline rows */}
          <div className="divide-y divide-border">
            {skillCategories.map((cat, i) => {
              const CategoryIcon = cat.categoryIcon;
              return (
                <ScrollReveal
                  key={cat.label}
                  delay={i * 0.08}
                  className="py-6 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cat.bg} text-base text-white shadow-sm`}
                    >
                      <CategoryIcon />
                    </span>
                    <h3 className="text-lg font-bold tracking-tight text-foreground">
                      {cat.label}
                    </h3>
                    <span className="ml-auto shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                      {cat.skills.length}{" "}
                      {cat.skills.length === 1 ? "skill" : "skills"}
                    </span>
                  </div>

                  <p className="mt-2.5 text-sm leading-6 text-muted">
                    {cat.description}
                  </p>

                  <div className="mt-3.5 flex flex-wrap gap-2">
                    {cat.skills.map((skill) => {
                      const SkillIcon = skill.icon;
                      return (
                        <span
                          key={skill.name}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/60 px-3 py-1.5 text-xs font-medium text-foreground/80"
                        >
                          <SkillIcon className="shrink-0 text-[11px] text-muted" />
                          {skill.name}
                        </span>
                      );
                    })}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Activities — live GitHub data */}
          <ScrollReveal delay={0.2}>
            <GitHubWidget username="PixelCookie-zyf" />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
