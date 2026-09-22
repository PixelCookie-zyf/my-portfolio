import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content" className="site-container flex min-h-[80vh] flex-col justify-center py-32">
        <p className="eyebrow">Page not found</p>
        <h1 className="font-editorial mt-5 text-8xl tracking-tight">404<span className="text-accent">.</span></h1>
        <p className="mt-6 text-muted">This page may have moved, or the address may be incomplete.</p>
        <div className="mt-8 flex gap-8"><Link href="/" className="text-link">← Back home</Link><Link href="/blog" className="text-link">Browse the notes →</Link></div>
      </main>
      <Footer />
    </>
  );
}
