import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import BlogCard from "@/components/ui/BlogCard";
import AsciiCanvas from "@/components/ui/AsciiCanvas";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog — PixelCookie",
  description: "Thoughts on AI, LLMs, game development, and open source.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <AsciiCanvas variant="subtle" className="opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="mx-auto max-w-6xl px-6 -mt-8 relative z-10 pb-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-primary/40 text-primary hover:bg-primary/10 hover:border-primary transition-all rounded-sm pixel-btn mb-8"
        >
          <IoArrowBack className="text-base" />
          <span>Back to Home</span>
        </Link>

        <h1 className="text-3xl font-bold text-foreground sm:text-4xl mb-2">Blog</h1>
        <p className="text-muted mb-10">Thoughts on AI, LLMs, game development, and more.</p>

        {posts.length === 0 ? (
          <p className="text-muted">No posts yet. Stay tuned!</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
