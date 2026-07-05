import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Work from "@/components/sections/Work";
import Travel from "@/components/sections/Travel";
import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <Experience />
        <Skills />
        <Work />
        <Travel />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
