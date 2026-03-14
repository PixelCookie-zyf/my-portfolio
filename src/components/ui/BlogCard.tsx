"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { IoArrowForward } from "react-icons/io5";
import type { PostMeta } from "@/lib/blog";

interface BlogCardProps {
  post: PostMeta;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="h-full">
      <motion.article
        whileHover={{
          y: -4,
          boxShadow:
            "0 0 0 1.5px rgba(59,130,246,0.3), 0 24px 60px rgba(15,23,42,0.14)",
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border/70 bg-background/95 p-6"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_42%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <time className="text-xs font-mono uppercase tracking-[0.16em] text-muted">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/80 text-muted transition-colors group-hover:border-accent/40 group-hover:text-accent">
            <IoArrowForward className="text-base transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>

        <h3 className="relative z-10 mt-5 text-xl font-semibold leading-8 text-foreground transition-colors group-hover:text-accent">
          {post.title}
        </h3>

        <p className="relative z-10 mt-3 flex-1 text-sm leading-7 text-muted">
          {post.description}
        </p>

        <div className="relative z-10 mt-5 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border/70 bg-card-bg/70 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-muted transition-colors duration-300 group-hover:border-accent/20 group-hover:bg-accent/10 group-hover:text-accent"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.article>
    </Link>
  );
}
