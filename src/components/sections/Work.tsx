import Link from "next/link";
import { IoArrowForward } from "react-icons/io5";
import { projects, type Project } from "@/data/projects";

function WorkRow({ project }: { project: Project }) {
  const primaryLink = project.github ?? project.demo;

  return (
    <article className="grid gap-4 border-t border-border py-7 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-12">
      <div>
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/icons/light/${project.icon}.svg`}
              alt=""
              width={30}
              height={30}
              className="h-[30px] w-[30px] dark:hidden"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/icons/dark/${project.icon}.svg`}
              alt=""
              width={30}
              height={30}
              className="hidden h-[30px] w-[30px] dark:block"
            />
          </span>
          <h3 className="text-xl font-medium tracking-tight text-foreground">
            {primaryLink ? (
              <a
                href={primaryLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 transition-colors hover:text-accent"
              >
                {project.title}
                <IoArrowForward aria-hidden="true" className="-rotate-45 text-sm text-muted transition-colors group-hover:text-accent" />
              </a>
            ) : (
              project.title
            )}
          </h3>
        </div>
        {project.highlight && (
          <p className="mt-2 text-xs font-medium text-accent">
            {project.highlight}
          </p>
        )}
        <p className="mt-2 font-mono text-[11px] leading-5 text-muted">
          {project.tags.join(" / ")}
        </p>
      </div>

      <div>
        <p className="text-sm leading-7 text-muted">{project.description}</p>
        {project.demo && project.github && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link mt-2 inline-flex items-center gap-1.5 text-xs"
          >
            Visit site <IoArrowForward aria-hidden="true" className="-rotate-45" />
          </a>
        )}
      </div>
    </article>
  );
}

export default function Work({ limit }: { limit?: number }) {
  const Heading = typeof limit === "number" ? "h2" : "h1";
  const shownProjects = typeof limit === "number" ? projects.slice(0, limit) : projects;

  return (
    <section id="work" className="site-section">
      <div className="site-container">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Things I make</p>
            <Heading className={typeof limit === "number" ? "section-heading" : "font-editorial mt-4 text-5xl tracking-tight sm:text-7xl"}>{typeof limit === "number" ? "Selected projects" : "Projects."}</Heading>
          </div>
          {typeof limit === "number" && limit < projects.length && (
            <Link href="/projects" className="text-link inline-flex items-center gap-2 text-sm">
              All projects <IoArrowForward aria-hidden="true" />
            </Link>
          )}
        </div>

        <div className="border-b border-border">
          {shownProjects.map((project) => (
            <WorkRow key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
