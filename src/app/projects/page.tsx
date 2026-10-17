import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import PageTitle from "@/components/layout/PageTitle";
import { ProjectList } from "@/components/sections/Work";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Open-source projects in recommendation systems, research tools, and game development.",
};

export default function ProjectsPage() {
  return (
    <PageShell>
      <PageTitle title="Projects" note={`${projects.length} so far`}>
        Open-source work on recommendation systems, research tooling, and a few things made for fun.
      </PageTitle>
      <ProjectList />
    </PageShell>
  );
}
