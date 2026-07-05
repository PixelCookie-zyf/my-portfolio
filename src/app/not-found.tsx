import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import AsciiCanvas from "@/components/ui/AsciiCanvas";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      {/* Ember mountains along the bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42vh] opacity-70">
        <AsciiCanvas variant="subtle" className="h-full" />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background to-transparent" />
      </div>

      <div className="relative z-10">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted">
          HTTP 404 — page not found
        </p>

        <h1 className="mt-4 text-8xl font-extrabold tracking-tight text-foreground sm:text-9xl">
          404<span className="text-accent">.</span>
        </h1>

        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-border bg-card-bg/60 px-5 py-4 text-left font-mono text-xs leading-6 text-muted backdrop-blur-sm sm:text-sm">
          <p>
            <span className="select-none text-accent">$ </span>
            git checkout this-page
          </p>
          <p className="mt-1 text-muted/80">
            error: pathspec &apos;this-page&apos; did not match any commits
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#fffcf0] shadow-[0_14px_36px_-14px_rgba(188,82,21,0.6)] transition-colors hover:bg-accent-strong"
          >
            <IoArrowBack className="text-base" />
            cd ~/home
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent/40 hover:text-accent"
          >
            Browse the blog
          </Link>
        </div>
      </div>
    </main>
  );
}
