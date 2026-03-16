import Link from "next/link";
import { IoArrowBack, IoGridOutline, IoSparklesOutline } from "react-icons/io5";
import BlogCard from "@/components/ui/BlogCard";
import AsciiCanvas from "@/components/ui/AsciiCanvas";
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
    <main className="min-h-screen bg-background pb-24">
      <BlogThemeToggle />
      <div className="relative overflow-hidden">
        <AsciiCanvas variant="subtle" className="opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
      </div>

      <div className="relative z-10 mx-auto -mt-8 max-w-6xl px-6">
        <div className="rounded-[2rem] border border-border/70 bg-background/88 px-6 py-8 shadow-[0_30px_80px_rgba(0,0,0,0.08)] backdrop-blur sm:px-8 sm:py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
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
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:min-w-[320px]">
              <div className="rounded-2xl border border-border/70 bg-card-bg/65 p-4">
                <div className="mb-2 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-muted">
                  <IoGridOutline />
                  Archive
                </div>
                <div className="text-3xl font-semibold text-foreground">{posts.length}</div>
                <p className="mt-1 text-sm leading-6 text-muted">
                  Published posts and field notes so far.
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card-bg/65 p-4">
                <div className="text-xs font-mono uppercase tracking-[0.18em] text-muted">
                  Latest
                </div>
                <div className="mt-2 text-base font-semibold text-foreground">
                  {latestPost?.title ?? "Writing soon"}
                </div>
                <p className="mt-1 text-sm leading-6 text-muted">
                  {latestPost?.description ?? "A new post will show up here once it's published."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
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

        {posts.length === 0 ? (
          <p className="mt-12 text-muted">No posts yet. Stay tuned!</p>
        ) : (
          <div id="posts" className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
