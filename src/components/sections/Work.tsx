"use client";

import { FaGithub } from "react-icons/fa6";
import { IoArrowForward } from "react-icons/io5";
import SectionTitle from "@/components/ui/SectionTitle";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { projects, type Project } from "@/data/projects";

function WorkRow({ project, index }: { project: Project; index: number }) {
  const primaryLink = project.github ?? project.demo;

  return (
    <div className="group relative grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-start gap-x-4 gap-y-3 border-t border-border py-7 md:grid-cols-[3rem_minmax(0,1.05fr)_minmax(0,0.95fr)_auto] md:items-center md:gap-x-8 md:py-8">
      {/* Hover wash */}
      <div
        aria-hidden="true"
        className="absolute -inset-x-4 -inset-y-px -z-10 rounded-2xl bg-card-bg/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:-inset-x-6"
      />

      {/* Index */}
      <span className="row-start-1 pt-1.5 font-mono text-sm text-accent md:pt-0">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Title block */}
      <div className="col-start-2 row-start-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card-bg/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/icons/light/${project.icon}.svg`}
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 dark:hidden"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/icons/dark/${project.icon}.svg`}
              alt=""
              width={28}
              height={28}
              className="hidden h-7 w-7 dark:block"
            />
          </span>
          <h3 className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-accent md:text-2xl">
            {primaryLink ? (
              <a
                href={primaryLink}
                target="_blank"
                rel="noopener noreferrer"
                className="after:absolute after:inset-0"
              >
                {project.title}
              </a>
            ) : (
              project.title
            )}
          </h3>
          {project.highlight && (
            <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
              {project.highlight}
            </span>
          )}
        </div>
        <p className="mt-2 font-mono text-xs tracking-wide text-muted">
          {project.tags.join(" · ")}
        </p>
      </div>

      {/* Description */}
      <p className="col-start-2 row-start-2 text-sm leading-6 text-muted md:col-start-3 md:row-start-1 md:line-clamp-4">
        {project.description}
      </p>

      {/* Links */}
      <div className="col-start-3 row-start-1 flex items-center gap-3 md:col-start-4">
        {project.demo && project.github && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} live site`}
            className="relative z-10 hidden font-mono text-[11px] uppercase tracking-[0.16em] text-muted underline-offset-4 transition-colors hover:text-accent hover:underline sm:block"
          >
            live
          </a>
        )}
        {project.github && (
          <FaGithub aria-hidden="true" className="hidden text-lg text-muted sm:block" />
        )}
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-all duration-300 group-hover:border-accent/40 group-hover:text-accent">
          <IoArrowForward className="-rotate-45 text-base transition-transform duration-300 group-hover:rotate-0" />
        </span>
      </div>
    </div>
  );
}

export default function Work() {
  return (
    <section id="work" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          index="03"
          kicker="selected work"
          title="Projects"
          subtitle="Shipped, ranked, and tinkered with — mostly in public."
        />

        <div className="border-b border-border">
          {projects.map((project, i) => (
            <ScrollReveal key={project.title} delay={Math.min(i * 0.06, 0.3)}>
              <WorkRow project={project} index={i} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
