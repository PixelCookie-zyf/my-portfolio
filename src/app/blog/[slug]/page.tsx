import { notFound } from "next/navigation";
import Link from "next/link";
import { IoArrowBack, IoChevronForward, IoHomeOutline, IoTimeOutline } from "react-icons/io5";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import type { Metadata } from "next";
import "katex/dist/katex.min.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function getReadingTime(content: string): number {
  const cjkChars = (content.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
  const nonCjkWords = content
    .replace(/[\u4e00-\u9fff\u3400-\u4dbf]/g, "")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(cjkChars / 400 + nonCjkWords / 200));
}

const mdxOptions = {
  remarkPlugins: [remarkGfm, remarkMath],
  rehypePlugins: [rehypeKatex],
};

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const readingTime = getReadingTime(post.content);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted">
          <Link href="/" className="inline-flex items-center gap-2 transition-colors hover:text-foreground">
            <IoHomeOutline className="text-base" />
            Home
          </Link>
          <IoChevronForward className="text-xs opacity-60" />
          <Link href="/blog" className="transition-colors hover:text-foreground">
            Blog
          </Link>
          <IoChevronForward className="text-xs opacity-60" />
          <span className="max-w-full truncate text-foreground/80">{post.frontmatter.title}</span>
        </nav>

        <div className="mb-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card-bg/70 px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-accent/40 hover:text-accent"
          >
            <IoArrowBack className="text-base" />
            Back Home
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-sm text-muted transition-colors hover:border-accent/25 hover:text-foreground"
          >
            All posts
          </Link>
        </div>

        <header className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card-bg/35 px-6 py-8 shadow-[0_30px_80px_rgba(0,0,0,0.08)] sm:px-8 sm:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.13),transparent_42%)]" />
          <div className="relative z-10">
            <div className="inline-flex items-center rounded-full border border-accent/20 bg-accent/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Article
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-mono text-muted">
              <time>
                {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span className="text-border">·</span>
              <span className="inline-flex items-center gap-1">
                <IoTimeOutline className="text-sm" />
                {readingTime} min read
              </span>
            </div>
            <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              {post.frontmatter.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted sm:text-lg">
              {post.frontmatter.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {post.frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        <div className="mt-10 w-full">
          <article className="prose-custom rounded-[2rem] border border-border/70 bg-background/92 px-7 py-8 shadow-[0_24px_60px_rgba(15,23,42,0.06)] sm:px-10 sm:py-10 lg:px-12">
            <MDXRemote
              source={post.content}
              options={{ mdxOptions }}
            />
          </article>

          <footer className="mt-8 rounded-[1.75rem] border border-border/70 bg-card-bg/40 px-7 py-6 sm:px-10 lg:px-12">
            <p className="text-sm uppercase tracking-[0.18em] text-muted">Continue reading</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm text-foreground transition-colors hover:border-accent/30 hover:text-accent"
              >
                <IoArrowBack className="text-base" />
                Back to all posts
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-sm text-muted transition-colors hover:border-accent/25 hover:text-foreground"
              >
                Visit homepage
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
