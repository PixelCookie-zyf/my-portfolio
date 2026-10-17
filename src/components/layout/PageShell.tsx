import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/** Every page sits on the same notebook sheet, margin line included. */
export default function PageShell({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang?: string;
}) {
  return (
    <div className="notebook">
      <Header />
      <main id="main-content" lang={lang} className="min-h-[70vh]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
