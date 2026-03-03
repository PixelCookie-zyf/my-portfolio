import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Benchmarks from "@/components/sections/Benchmarks";
import Projects from "@/components/sections/Projects";
import Favorites from "@/components/sections/Favorites";
import Travel from "@/components/sections/Travel";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Experience />
        <Skills />
        <Benchmarks />
        <Projects />
        <Favorites />
        <Travel />
      </main>
      <Footer />
    </>
  );
}
