import Link from "next/link";
import { IoArrowForward } from "react-icons/io5";
import { FiArrowUpRight } from "react-icons/fi";
import { getAllPosts } from "@/lib/blog";

export default function Blog() {
  const posts = getAllPosts().slice(0, 4);
  if (!posts.length) return null;
  return (
    <section id="blog" className="site-section">
      <div className="site-container">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="section-heading">Recent writing</h2>
          <Link href="/blog" className="text-link">
            All notes <IoArrowForward aria-hidden="true" />
          </Link>
        </div>
        <div className="border-b border-border">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group grid gap-4 border-t border-border py-8 sm:grid-cols-[140px_minmax(0,1fr)_24px] sm:gap-8 sm:py-10"
            >
              <time
                dateTime={post.date}
                className="pt-1 font-mono text-xs text-muted"
              >
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  timeZone: "UTC",
                })}
              </time>
              <div className="min-w-0">
                <h3 className="font-editorial text-[24px] leading-[1.6] tracking-tight transition-colors group-hover:text-accent sm:text-[27px]">
                  {post.title}
                </h3>
                <p className="mt-3 max-w-[41rem] text-sm leading-[1.9] text-muted">
                  {post.description}
                </p>
                <p className="mt-5 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[10px] text-muted">
                  {post.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </p>
              </div>
              <FiArrowUpRight
                aria-hidden="true"
                className="hidden text-xl text-muted transition-colors group-hover:text-accent sm:block"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
