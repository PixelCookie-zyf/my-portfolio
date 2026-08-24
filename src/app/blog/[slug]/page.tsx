import { notFound } from "next/navigation";
import Link from "next/link";
import { IoArrowBack, IoChevronForward, IoHomeOutline, IoTimeOutline } from "react-icons/io5";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import type { Metadata } from "next";
import BlogThemeToggle from "@/components/blog/ThemeToggle";
import ReadingProgress from "@/components/ui/ReadingProgress";
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
    <main id="main-content" className="min-h-screen bg-background">
      <ReadingProgress />
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <nav className="mx-auto mb-10 flex max-w-4xl items-center justify-between gap-4 text-sm text-muted">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Link href="/" className="inline-flex shrink-0 items-center gap-2 transition-colors hover:text-foreground">
              <IoHomeOutline className="text-base" />
              Home
            </Link>
            <IoChevronForward className="shrink-0 text-xs opacity-60" />
            <Link href="/blog" className="shrink-0 transition-colors hover:text-foreground">
              Blog
            </Link>
            <IoChevronForward className="shrink-0 text-xs opacity-60" />
            <span className="truncate text-foreground/80">{post.frontmatter.title}</span>
          </div>
          <BlogThemeToggle />
        </nav>

        <header className="mx-auto max-w-4xl border-y border-border/80 py-10 sm:py-12">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-accent after:ml-1 after:h-px after:w-10 after:bg-accent/40">
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
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              {post.frontmatter.tags.map((tag, index) => (
                <span key={tag} className="inline-flex items-center gap-3">
                  {index > 0 && <span className="text-accent/55">/</span>}
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        <div className="mx-auto mt-12 max-w-4xl">
          <article className="prose-custom">
            <MDXRemote
              source={post.content}
              options={{ mdxOptions }}
            />
          </article>

          <footer className="mt-14 border-t border-border/80 py-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Continue reading</p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-foreground transition-colors hover:text-accent"
              >
                <IoArrowBack className="text-base" />
                Back to all posts
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
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
