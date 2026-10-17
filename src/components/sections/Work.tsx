import Row, { SectionHeading } from "@/components/layout/Row";
import { projects } from "@/data/projects";

export function ProjectList({ limit }: { limit?: number }) {
  const shownProjects = limit ? projects.slice(0, limit) : projects;

  return (
    <ol className="space-y-9">
      {shownProjects.map((project, index) => {
        const link = project.github ?? project.demo;
        return (
          <li key={project.title}>
            <Row note={`No. ${String(index + 1).padStart(2, "0")}`}>
              <div className="max-w-[42rem]">
                <h3 className="serif text-2xl font-medium leading-snug">
                  {link ? (
                    <a href={link} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">
                      {project.title}
                      <span className="ml-1.5 text-base text-faint">↗</span>
                    </a>
                  ) : (
                    project.title
                  )}
                  {project.highlight && (
                    <span className="serif ml-3 text-base font-normal italic text-accent">
                      {project.highlight}
                    </span>
                  )}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{project.description}</p>
                <p className="mt-2 text-[13px] text-faint">
                  {project.tags.join(" · ")}
                  {project.demo && project.github && (
                    <>
                      {" · "}
                      <a href={project.demo} target="_blank" rel="noopener noreferrer" className="link">
                        visit site
                      </a>
                    </>
                  )}
                </p>
              </div>
            </Row>
          </li>
        );
      })}
    </ol>
  );
}

export default function Work() {
  return (
    <section id="work" className="pb-24">
      <SectionHeading index="02" title="Projects" link={{ href: "/projects", label: "All projects" }} />
      <ProjectList limit={3} />
    </section>
  );
}
