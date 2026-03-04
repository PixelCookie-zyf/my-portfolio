"use client";

import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { skills, skillCategories } from "@/data/skills";

export default function Skills() {
  return (
    <section id="skills" className="bg-card-bg/30 py-24 px-6">
      <div className="mx-auto max-w-4xl">
        <SectionTitle title="Skills" subtitle="Technologies I work with" />

        <div className="space-y-10">
          {skillCategories.map((cat, catIdx) => {
            const catSkills = skills.filter((s) => s.category === cat.label);
            if (catSkills.length === 0) return null;

            return (
              <ScrollReveal key={cat.label} delay={catIdx * 0.1}>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-1 w-6 rounded-full bg-gradient-to-r ${cat.color}`} />
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted">
                      {cat.label}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {catSkills.map((skill, i) => {
                      const Icon = skill.icon;
                      return (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, scale: 0.8, y: 10 }}
                          whileInView={{ opacity: 1, scale: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.4,
                            delay: catIdx * 0.1 + i * 0.06,
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                          }}
                          whileHover={{
                            scale: 1.08,
                            y: -2,
                          }}
                          whileTap={{ scale: 0.95 }}
                          className={`group flex cursor-default items-center gap-2.5 rounded-full border border-border bg-white px-4 py-2.5 shadow-sm transition-all duration-200 hover:shadow-md ${cat.bgHover}`}
                        >
                          <Icon className={`text-lg ${cat.iconColor} transition-transform duration-200 group-hover:scale-110`} />
                          <span className="text-sm font-medium text-foreground">
                            {skill.name}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
