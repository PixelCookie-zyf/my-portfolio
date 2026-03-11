import Link from "next/link";
import SectionTitle from "@/components/ui/SectionTitle";
import ScrollReveal from "@/components/ui/ScrollReveal";
import BlogCard from "@/components/ui/BlogCard";
import { getAllPosts } from "@/lib/blog";

export default function Blog() {
  const posts = getAllPosts().slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="bg-card-bg/30 py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionTitle title="Blog" subtitle="Recent posts" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <ScrollReveal key={post.slug} delay={i * 0.1} className="h-full">
              <BlogCard post={post} />
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
          >
            View all posts &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
