import Link from "next/link";
import { IoArrowForward } from "react-icons/io5";
import SectionTitle from "@/components/ui/SectionTitle";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { getAllPosts } from "@/lib/blog";

export default function Blog() {
  const posts = getAllPosts().slice(0, 4);

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="bg-card-bg/30 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          index="05"
          kicker="writing"
          title="Blog"
          subtitle="Long-form notes on AI systems, reinforcement learning, and things I learn while building."
        />

        <div className="border-b border-border">
          {posts.map((post, i) => (
            <ScrollReveal key={post.slug} delay={Math.min(i * 0.06, 0.25)}>
              <Link
                href={`/blog/${post.slug}`}
                className="group relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 border-t border-border py-6 sm:grid-cols-[7.5rem_minmax(0,1fr)_auto] sm:gap-x-8"
              >
                <div
                  aria-hidden="true"
                  className="absolute -inset-x-4 -inset-y-px -z-10 rounded-2xl bg-background/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:-inset-x-6"
                />

                <time className="col-span-2 font-mono text-xs uppercase tracking-[0.14em] text-muted sm:col-span-1">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>

                <div className="min-w-0 pt-1.5 sm:pt-0">
                  <h3 className="text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-accent sm:text-xl">
                    {post.title}
                  </h3>
                  <p className="mt-1 truncate text-sm leading-6 text-muted">
                    {post.description}
                  </p>
                </div>

                <IoArrowForward className="row-start-2 self-center text-lg text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent sm:row-start-auto" />
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/70 px-5 py-2.5 text-sm text-muted transition-colors hover:border-accent/30 hover:text-accent"
          >
            Read the full archive
            <IoArrowForward className="text-sm" />
          </Link>
        </div>
      </div>
    </section>
  );
}
