import PageShell from "@/components/layout/PageShell";
import Hero from "@/components/sections/Hero";
import Blog from "@/components/sections/Blog";
import Work from "@/components/sections/Work";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Travel from "@/components/sections/Travel";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <PageShell>
      <Hero />
      <Blog />
      <Work />
      <Experience />
      <Skills />
      <Travel />
      <Contact />
    </PageShell>
  );
}
