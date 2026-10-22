import Link from "next/link";
import SectionHeading from "@/components/layout/SectionHeading";
import PostCover from "@/components/ui/PostCover";
import { getAllPosts, type PostMeta } from "@/lib/blog";
import { formatDate } from "@/lib/format";

export function FeaturedPost({ post, label = "Latest" }: { post: PostMeta; label?: string }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="paper-shadow group grid overflow-hidden rounded-[28px] border border-line bg-card transition-transform duration-300 hover:-translate-y-1 md:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]"
    >
      <PostCover seed={post.slug} className="h-56 w-full md:h-full md:min-h-[320px]" />
      <div className="flex flex-col p-7 md:p-10">
        <p className="flex flex-wrap items-center gap-3 text-sm text-muted">
          <span className="rounded-full bg-tomato px-2.5 py-0.5 text-xs font-medium text-paper">{label}</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </p>
        <h3 lang="zh-CN" className="font-display mt-5 text-balance text-[1.7rem] font-medium leading-[1.3] tracking-[-0.01em] lg:text-[1.9rem]">
          {post.title}
        </h3>
        <p lang="zh-CN" className="mt-4 text-[15px] leading-relaxed text-soft">
          {post.description}
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-8">
          <ul className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li key={tag} className="rounded-full bg-inset px-3 py-1 text-xs text-soft">
                {tag}
              </li>
            ))}
          </ul>
          <span className="font-hand text-2xl text-tomato transition-transform group-hover:translate-x-1">
            read it →
          </span>
        </div>
      </div>
    </Link>
  );
}

export function PostRow({ post }: { post: PostMeta }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex items-center gap-5 py-5">
      <PostCover seed={post.slug} cols={2} rows={2} className="h-14 w-14 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1">
        <h3 lang="zh-CN" className="font-display text-xl font-medium leading-snug transition-colors group-hover:text-tomato">
          {post.title}
        </h3>
        <p className="mt-1 text-sm text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.tags.join(", ")}
        </p>
      </div>
      <span className="text-muted transition-transform group-hover:translate-x-1">→</span>
    </Link>
  );
}

export default function Blog() {
  const [latest, ...rest] = getAllPosts().slice(0, 5);
  if (!latest) return null;

  return (
    <section id="blog" className="wrap pb-28">
      <SectionHeading kicker="things I wrote down" title="Notes & writing" link={{ href: "/blog", label: "All notes" }} />
      <FeaturedPost post={latest} />
      {rest.length > 0 && (
        <ul className="mt-6 divide-y divide-dashed divide-line">
          {rest.map((post) => (
            <li key={post.slug}>
              <PostRow post={post} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
