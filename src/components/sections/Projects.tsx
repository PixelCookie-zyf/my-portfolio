"use client";

import SectionTitle from "@/components/ui/SectionTitle";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ProjectCard from "@/components/ui/ProjectCard";
import { projects } from "@/data/projects";

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionTitle title="Projects" subtitle="Things I've built" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ScrollReveal key={project.title} delay={i * 0.1} className="h-full">
              <ProjectCard project={project} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
