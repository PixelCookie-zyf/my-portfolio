import Link from "next/link";
import { IoArrowForward } from "react-icons/io5";
import type { PostMeta } from "@/lib/blog";

interface BlogCardProps {
  post: PostMeta;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="grid gap-5 border-t border-border/80 py-8 transition-colors sm:grid-cols-[8.5rem_minmax(0,1fr)_auto] sm:gap-8 sm:py-9">
        <time className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>

        <div className="min-w-0">
          <h3 className="text-xl font-semibold leading-8 text-foreground transition-colors group-hover:text-accent sm:text-2xl">
            {post.title}
          </h3>

          <p className="mt-2 max-w-3xl text-sm leading-7 text-muted sm:text-base">
            {post.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            {post.tags.map((tag, index) => (
              <span key={tag} className="inline-flex items-center gap-3">
                {index > 0 && <span className="text-accent/55">/</span>}
                {tag}
              </span>
            ))}
          </div>
        </div>

        <span className="inline-flex items-center gap-2 self-start text-xs font-medium uppercase tracking-[0.12em] text-muted transition-colors group-hover:text-accent sm:mt-1">
          Read
          <IoArrowForward className="text-base transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </article>
    </Link>
  );
}
