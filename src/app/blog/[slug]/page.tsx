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
import Row from "@/components/layout/Row";
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
      <Row
        className="mb-14 md:mb-20"
        note={
          <>
            <time dateTime={post.frontmatter.date} className="block">
              {formatDate(post.frontmatter.date, "zh-CN")}
            </time>
            <span className="block">约 {readingTime} 分钟</span>
          </>
        }
      >
        <Link href="/blog" className="link text-sm text-muted">
          ← 全部文章
        </Link>
        <h1 className="serif mt-6 max-w-[44rem] text-[clamp(2.1rem,4.4vw,3.25rem)] font-medium leading-[1.2] tracking-[-0.015em]">
          {post.frontmatter.title}
        </h1>
        <p className="mt-5 max-w-[40rem] text-[17px] leading-[1.75] text-muted">
          {post.frontmatter.description}
        </p>
        <p className="mt-4 text-[13px] text-faint">{post.frontmatter.tags.join(" · ")}</p>
      </Row>

      <Row note={<TableOfContents headings={headings} placement="margin" />}>
        <TableOfContents headings={headings} placement="inline" />
        <article className="prose-custom max-w-[42rem]">{content}</article>
        <p className="mt-16 text-sm">
          <Link href="/blog" className="link text-muted">
            ← 返回全部文章
          </Link>
        </p>
      </Row>
    </PageShell>
  );
}
