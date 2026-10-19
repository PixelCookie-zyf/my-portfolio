import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import PageTitle from "@/components/layout/PageTitle";
import { ProjectList } from "@/components/sections/Work";

export const metadata: Metadata = {
  title: "Projects",
  description: "Open-source projects in recommendation systems, research tools, and game development.",
};

export default function ProjectsPage() {
  return (
    <PageShell>
      <PageTitle kicker="things I’ve built" title="Projects">
        Open-source work on recommendation systems, research tooling, and a few things made purely
        for fun.
      </PageTitle>
      <div className="wrap">
        <ProjectList />
      </div>
    </PageShell>
  );
}
