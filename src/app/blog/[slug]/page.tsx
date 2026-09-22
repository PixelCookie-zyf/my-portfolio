import { notFound } from "next/navigation";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { createHeadingCollector, type BlogHeading } from "@/lib/blog-headings";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TableOfContents from "@/components/blog/TableOfContents";
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
    <>
      <Header />
      <main id="main-content" lang="zh-CN" className="min-h-screen bg-background pb-16 pt-28 sm:pb-24 sm:pt-36">
        <ReadingProgress />
        <div className="site-container max-lg:max-w-[768px]">
          <header className="max-w-[720px]">
            <Link href="/blog" className="text-link inline-flex items-center gap-2 text-sm">
              <span aria-hidden="true">←</span> 全部文章
            </Link>
            <div className="mt-10 flex flex-wrap items-center gap-3 text-xs text-muted sm:mt-12 sm:text-sm">
              <time dateTime={post.frontmatter.date}>
                {new Date(post.frontmatter.date).toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  timeZone: "UTC",
                })}
              </time>
              <span aria-hidden="true">·</span>
              <span>约 {readingTime} 分钟</span>
            </div>
            <h1 className="font-editorial mt-5 text-[1.875rem] font-medium leading-[1.5] tracking-tight text-foreground sm:text-[2.75rem] sm:leading-[1.45]">
              {post.frontmatter.title}
            </h1>
            <p className="mt-5 text-base leading-8 text-muted sm:text-lg">
              {post.frontmatter.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
              {post.frontmatter.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            <div className="mb-9 mt-9 border-t border-border sm:mb-12 sm:mt-10" />
          </header>

          <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,720px)_minmax(0,1fr)] lg:items-start lg:gap-14">
            <TableOfContents headings={headings} />
            <div className="min-w-0 lg:order-1">
              <article className="prose-custom [&_h2]:scroll-mt-28 [&_h3]:scroll-mt-28">
                {content}
              </article>
              <div className="mt-14 border-t border-border pt-8">
                <Link href="/blog" className="text-link inline-flex items-center gap-2 text-sm">
                  <span aria-hidden="true">←</span> 返回全部文章
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
