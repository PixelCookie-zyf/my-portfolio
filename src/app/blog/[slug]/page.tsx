import { notFound } from "next/navigation";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { createHeadingCollector, type BlogHeading } from "@/lib/blog-headings";
import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import PostCover from "@/components/ui/PostCover";
import TableOfContents from "@/components/blog/TableOfContents";
import ReadingProgress from "@/components/ui/ReadingProgress";
import { formatDate } from "@/lib/format";
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
  const headings: BlogHeading[] = [];
  const { content } = await compileMDX({
    source: post.content,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkMath, createHeadingCollector(headings)],
        rehypePlugins: [rehypeKatex],
      },
    },
  });

  return (
    <PageShell lang="zh-CN">
      <ReadingProgress />
      <header className="wrap pb-12 pt-6 md:pt-10">
        <Link href="/blog" className="text-sm text-muted transition-colors hover:text-ink">
          ← 全部文章
        </Link>
        <PostCover seed={slug} cols={12} rows={3} className="mt-6 h-28 w-full rounded-[22px] md:h-40" />
        <div className="mt-10 text-center">
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-muted">
            <time dateTime={post.frontmatter.date}>{formatDate(post.frontmatter.date, "zh-CN")}</time>
            <span aria-hidden="true">·</span>
            <span>约 {readingTime} 分钟</span>
          </p>
          <h1 className="font-display mt-5 text-balance text-[clamp(2rem,3.6vw,3rem)] font-medium leading-[1.2] tracking-[-0.015em]">
            {post.frontmatter.title}
          </h1>
          <p className="mx-auto mt-5 max-w-[52rem] text-lg leading-relaxed text-soft">{post.frontmatter.description}</p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {post.frontmatter.tags.map((tag) => (
              <li key={tag} className="rounded-full bg-inset px-3 py-1 text-xs text-soft">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className="wrap lg:grid lg:grid-cols-[minmax(0,1fr)_250px] lg:gap-14">
        <div className="min-w-0">
          <TableOfContents headings={headings} placement="inline" />
          <article className="prose-custom">{content}</article>
          <p className="mt-16 border-t border-dashed border-line pt-6 text-sm">
            <Link href="/blog" className="text-muted transition-colors hover:text-ink">
              ← 返回全部文章
            </Link>
          </p>
        </div>
        <TableOfContents headings={headings} placement="aside" />
      </div>
    </PageShell>
  );
}
