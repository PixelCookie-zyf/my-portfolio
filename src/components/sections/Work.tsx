import SectionHeading from "@/components/layout/SectionHeading";
import PostCover from "@/components/ui/PostCover";
import { Sparkle } from "@/components/ui/Doodles";
import { projects, type Project } from "@/data/projects";

function FeaturedProject({ project }: { project: Project }) {
  const link = project.github ?? project.demo;
  return (
    <article className="paper-shadow relative overflow-hidden rounded-[28px] bg-[#2e6a4f] p-7 text-[#f5f1e8] md:p-12 dark:bg-[#21392d] dark:text-[#efe9dd]">
      <Sparkle className="absolute right-8 top-8 h-7 w-7 text-ochre" />
      <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-14">
        <div>
          <p className="font-hand text-[1.7rem] leading-none text-[#f6e3a6]">proudest of this one</p>
          <h3 className="font-display mt-3 text-[clamp(2.2rem,4.4vw,3.4rem)] font-medium leading-[1.05] tracking-[-0.02em]">
            {project.title}
          </h3>
          {project.highlight && <p className="mt-2 text-[15px] opacity-80">{project.highlight}</p>}
          <p className="mt-6 max-w-[34rem] text-[17px] leading-relaxed opacity-90">{project.description}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#f5f1e8] px-5 py-2.5 text-[15px] font-medium text-[#2e6a4f] transition-transform hover:-translate-y-0.5 dark:bg-[#efe9dd] dark:text-[#21392d]"
              >
                View on GitHub ↗
              </a>
            )}
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-current/30 px-3 py-1 text-xs opacity-85">
                {tag}
              </span>
            ))}
          </div>
        </div>
        {project.stats && (
          <dl className="grid grid-cols-3 gap-4 self-end md:grid-cols-1 md:gap-0">
            {project.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-6 md:border-t md:border-dashed md:border-current/30 md:py-4">
                <dt className="order-2 text-xs opacity-75 md:text-sm">{stat.label}</dt>
                <dd className="font-display order-1 text-[1.55rem] font-medium leading-none tracking-[-0.02em] sm:text-[2.2rem] md:text-[3.25rem]">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </article>
  );
}

function ProjectItem({ project }: { project: Project }) {
  const link = project.github ?? project.demo;
  return (
    <article className="flex gap-5 border-t border-dashed border-line pt-6">
      <PostCover seed={project.title} cols={2} rows={2} className="h-14 w-14 shrink-0 rounded-2xl" />
      <div className="min-w-0">
        <h3 className="font-display text-[1.4rem] font-medium leading-snug">
          {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer" className="group transition-colors hover:text-tomato">
              {project.title}
              <span className="ml-1.5 inline-block text-base text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                ↗
              </span>
            </a>
          ) : (
            project.title
          )}
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-soft">{project.description}</p>
        <p className="mt-3 text-[13px] text-muted">
          {project.tags.join(" · ")}
          {project.demo && project.github && (
            <>
              {" · "}
              <a href={project.demo} target="_blank" rel="noopener noreferrer" className="link text-soft">
                visit the site
              </a>
            </>
          )}
        </p>
      </div>
    </article>
  );
}

export function ProjectList({ limit }: { limit?: number }) {
  const [featured, ...others] = projects;
  const shown = typeof limit === "number" ? others.slice(0, limit) : others;

  return (
    <>
      <FeaturedProject project={featured} />
      <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
        {shown.map((project) => (
          <ProjectItem key={project.title} project={project} />
        ))}
      </div>
    </>
  );
}

export default function Work() {
  return (
    <section id="work" className="wrap pb-28">
      <SectionHeading
        kicker="things I’ve built"
        title="Projects"
        tone="text-forest"
        link={{ href: "/projects", label: "All projects" }}
      />
      <ProjectList limit={4} />
    </section>
  );
}
