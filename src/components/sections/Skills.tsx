"use client";

import SectionTitle from "@/components/ui/SectionTitle";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SkillWidget from "@/components/ui/SkillWidget";
import GitHubWidget, { GitHubActivityGraph } from "@/components/ui/GitHubWidget";
import { skillCategories } from "@/data/skills";

export default function Skills() {
  return (
    <section id="skills" className="bg-card-bg/30 py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <SectionTitle title="Skills" subtitle="Technologies I work with" />

        {/* Widget grid: 4 skill squares + GitHub card */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:grid-rows-2">
          {skillCategories.map((cat, catIdx) => (
            <ScrollReveal key={cat.label} delay={catIdx * 0.1}>
              <SkillWidget cat={cat} />
            </ScrollReveal>
          ))}

          <ScrollReveal
            delay={0.4}
            className="col-span-2 lg:col-start-3 lg:row-start-1 lg:row-span-2"
          >
            <GitHubWidget username="PixelCookie-zyf" />
          </ScrollReveal>
        </div>

        {/* Full-width activity graph below */}
        <ScrollReveal delay={0.5} className="mt-4">
          <GitHubActivityGraph username="PixelCookie-zyf" />
        </ScrollReveal>
      </div>
    </section>
  );
}
