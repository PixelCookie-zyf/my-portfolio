import Link from "next/link";
import { IoArrowBack, IoArrowForward, IoGridOutline, IoSparklesOutline } from "react-icons/io5";
import BlogCard from "@/components/ui/BlogCard";
import { getAllPosts } from "@/lib/blog";
import BlogThemeToggle from "@/components/blog/ThemeToggle";

export const metadata = {
  title: "Blog",
  description: "Technical essays on AI, reinforcement learning, engineering systems, and the things I'm building.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const latestPost = posts[0];

  return (
    <main id="main-content" className="min-h-screen bg-background pb-24">
      <div className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-6 pt-7">
        <Link href="/" className="text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-accent">
          PixelCookie<span className="text-accent">.</span>
        </Link>
        <BlogThemeToggle />
      </div>
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-10 sm:pt-12">
        <div className="border-y border-border/80 bg-background/72 px-2 py-10 sm:px-4 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:gap-10">
            <div className="flex max-w-3xl flex-col">
              <div className="mb-5 inline-flex w-fit items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-accent after:ml-1 after:h-px after:w-10 after:bg-accent/40">
                <IoSparklesOutline className="text-sm" />
                Blog
              </div>
              <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Notes from building, learning, and figuring things out in public.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-muted sm:text-lg">
                This is the long-form side of the portfolio: essays on AI systems, reinforcement
                learning, product engineering, and the ideas behind what I make.
              </p>

              <div className="mt-8 flex flex-wrap gap-3 lg:mt-auto lg:pt-8">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card-bg/70 px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-accent/40 hover:text-accent"
                >
                  <IoArrowBack className="text-base" />
                  Back Home
                </Link>
                <a
                  href="#posts"
                  className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition-all hover:bg-accent/15"
                >
                  Browse posts
                </a>
              </div>
            </div>

            <div className="grid h-full gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-[0.72fr_1.28fr]">
              <div className="flex min-h-36 flex-col justify-between border-l-2 border-accent/35 px-5 py-4">
                <div className="mb-2 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-muted">
                  <IoGridOutline />
                  Archive
                </div>
                <div>
                  <div className="text-3xl font-semibold text-foreground">{posts.length}</div>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    Published posts and field notes so far.
                  </p>
                </div>
              </div>

              <div className="flex min-h-56 flex-col border-l border-border/90 px-5 py-4">
                <div className="text-xs font-mono uppercase tracking-[0.18em] text-muted">
                  Latest
                </div>
                <div className="mt-auto pt-6">
                  <div className="text-base font-semibold text-foreground">
                    {latestPost?.title ?? "Writing soon"}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {latestPost?.description ?? "A new post will show up here once it's published."}
                  </p>
                  {latestPost && (
                    <Link
                      href={`/blog/${latestPost.slug}`}
                      className="mt-5 flex items-center justify-between border-t border-border/70 pt-4 text-sm font-medium text-foreground transition-colors hover:text-accent"
                    >
                      Read latest
                      <IoArrowForward className="text-base" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {posts.length === 0 ? (
          <p className="mt-12 text-muted">No posts yet. Stay tuned!</p>
        ) : (
          <div id="posts" className="mt-12">
            <div className="mb-5 flex items-end justify-between gap-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
                  Index
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                  All writing
                </h2>
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
                {String(posts.length).padStart(2, "0")} entries
              </p>
            </div>
            <div className="border-b border-border/80">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
