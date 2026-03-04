"use client";

import { motion } from "framer-motion";
import { FaGithub, FaArrowUpRightFromSquare } from "react-icons/fa6";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const Icon = project.thumbnail.icon;

  return (
    <motion.div
      whileHover={{
        y: -4,
        boxShadow:
          "0 0 0 1.5px rgba(59,130,246,0.65), 0 20px 40px rgba(59,130,246,0.12)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white"
    >
      {/* Shimmer sweep effect */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/2 -skew-x-12 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 ease-out group-hover:translate-x-[300%]"
      />

      {/* Thumbnail area */}
      <div
        className={`relative aspect-video w-full overflow-hidden bg-gradient-to-br ${project.thumbnail.gradient}`}
      >
        {/* Floating decorative circles */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/10" />
        <div className="absolute right-10 top-6 h-10 w-10 rounded-full bg-white/15" />
        <div className="absolute bottom-8 left-1/3 h-6 w-6 rounded-full bg-white/10" />

        {/* Centered icon */}
        <div className="relative z-10 flex h-full items-center justify-center">
          <Icon className="text-7xl text-white/90 drop-shadow-lg transition-transform duration-300 group-hover:scale-110" />
        </div>

        {/* Hover overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-foreground">
          {project.title}
        </h3>
        <p className="mt-2 flex-1 text-sm text-muted leading-relaxed">
          {project.description}
        </p>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <motion.span
              key={tag}
              whileHover={{ scale: 1.08, y: -1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="cursor-default rounded-full bg-card-bg px-2.5 py-0.5 text-xs font-medium text-muted transition-colors duration-300 group-hover:bg-accent/10 group-hover:text-accent"
            >
              {tag}
            </motion.span>
          ))}
        </div>

        <div className="mt-4 flex gap-3">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
            >
              <FaGithub className="text-base" />
              Code
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-accent transition-colors hover:text-accent/80"
            >
              <FaArrowUpRightFromSquare className="text-xs" />
              Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
