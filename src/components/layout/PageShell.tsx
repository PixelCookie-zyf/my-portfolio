import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PageShell({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang?: string;
}) {
  return (
    <>
      <Header />
      <main id="main-content" lang={lang} className="min-h-[70vh]">
        {children}
      </main>
      <Footer />
    </>
  );
}
