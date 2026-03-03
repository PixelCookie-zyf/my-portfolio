"use client";

import { motion } from "framer-motion";
import { FaGithub, FaArrowUpRightFromSquare } from "react-icons/fa6";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -4,
        boxShadow:
          "0 0 0 1.5px rgba(59,130,246,0.65), 0 20px 40px rgba(59,130,246,0.12)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-white"
    >
      {/* Shimmer sweep effect */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/2 -skew-x-12 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 ease-out group-hover:translate-x-[300%]"
      />

      {/* Image area */}
      <div className="relative aspect-video w-full overflow-hidden bg-card-bg flex items-center justify-center">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="text-4xl text-muted/30 font-bold">
            {project.title[0]}
          </div>
        )}

        {/* Gradient glass overlay on hover */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-accent/25 via-accent/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-foreground">
          {project.title}
        </h3>
        <p className="mt-2 text-sm text-muted leading-relaxed">
          {project.description}
        </p>

        {/* Tags with individual hover + group-hover color shift */}
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
