"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { PostMeta } from "@/lib/blog";

interface BlogCardProps {
  post: PostMeta;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.article
        whileHover={{
          y: -4,
          boxShadow:
            "0 0 0 1.5px rgba(59,130,246,0.65), 0 20px 40px rgba(59,130,246,0.12)",
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background p-5"
      >
        {/* Shimmer sweep */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/2 -skew-x-12 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 ease-out group-hover:translate-x-[300%]"
        />

        <time className="text-xs text-muted font-mono">
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>

        <h3 className="mt-2 text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
          {post.title}
        </h3>

        <p className="mt-2 flex-1 text-sm text-muted leading-relaxed">
          {post.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-card-bg px-2.5 py-0.5 text-xs font-medium text-muted transition-colors duration-300 group-hover:bg-accent/10 group-hover:text-accent"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.article>
    </Link>
  );
}
