"use client";

import SectionTitle from "@/components/ui/SectionTitle";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SkillWidget from "@/components/ui/SkillWidget";
import GitHubWidget from "@/components/ui/GitHubWidget";
import { skillCategories } from "@/data/skills";

export default function Skills() {
  return (
    <section id="skills" className="bg-card-bg/30 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionTitle title="Skills" subtitle="Technologies I work with" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 xl:grid-rows-2">
          {skillCategories.map((cat, catIdx) => (
            <ScrollReveal key={cat.label} delay={catIdx * 0.1}>
              <SkillWidget cat={cat} />
            </ScrollReveal>
          ))}

          <ScrollReveal
            delay={0.4}
            className="md:col-span-2 xl:col-start-3 xl:row-start-1 xl:row-span-2"
          >
            <GitHubWidget username="PixelCookie-zyf" />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
