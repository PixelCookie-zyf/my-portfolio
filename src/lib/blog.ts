import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  tags: string[];
}

export interface PostMeta extends PostFrontmatter {
  slug: string;
}

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

function normalizeMdxSource(raw: string): string {
  const withoutBom = raw.replace(/^\uFEFF/u, "");
  const strippedLeadingNoise = withoutBom.replace(
    /^(?:(?:\s+)|(?:\{\/\*[\s\S]*?\*\/\})|(?:<!--[\s\S]*?-->))+/u,
    ""
  );

  return strippedLeadingNoise.startsWith("---") ? strippedLeadingNoise : withoutBom;
}

function normalizeFrontmatter(
  slug: string,
  data: Record<string, unknown>
): PostFrontmatter {
  return {
    title: typeof data.title === "string" && data.title.trim() ? data.title : slug,
    date: typeof data.date === "string" ? data.date : "",
    description: typeof data.description === "string" ? data.description : "",
    tags: Array.isArray(data.tags)
      ? data.tags.filter((tag): tag is string => typeof tag === "string")
      : [],
  };
}

function parsePostFile(filename: string) {
  const slug = filename.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
  const { data, content } = matter(normalizeMdxSource(raw));

  return {
    slug,
    frontmatter: normalizeFrontmatter(slug, data),
    content,
  };
}

function getTimestamp(date: string): number {
  const timestamp = Date.parse(date);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const post = parsePostFile(filename);

    return {
      slug: post.slug,
      ...post.frontmatter,
    };
  });

  return posts.sort((a, b) => getTimestamp(b.date) - getTimestamp(a.date));
}

export function getPostBySlug(slug: string) {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const post = parsePostFile(`${slug}.mdx`);

  return {
    frontmatter: post.frontmatter,
    content: post.content,
  };
}
