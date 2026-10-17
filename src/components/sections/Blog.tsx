import Link from "next/link";
import Row, { SectionHeading } from "@/components/layout/Row";
import { getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/format";

export default function Blog() {
  const posts = getAllPosts().slice(0, 4);
  if (!posts.length) return null;

  return (
    <section id="blog" className="pb-24">
      <SectionHeading index="01" title="Writing" link={{ href: "/blog", label: "All notes" }} />
      <ul className="space-y-8">
        {posts.map((post) => (
          <li key={post.slug}>
            <Row note={<time dateTime={post.date}>{formatDate(post.date)}</time>}>
              <Link href={`/blog/${post.slug}`} className="group block max-w-[42rem]">
                <h3 className="serif text-2xl font-medium leading-snug transition-colors group-hover:text-accent">
                  {post.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{post.description}</p>
                <p className="mt-2 text-[13px] text-faint">{post.tags.join(" · ")}</p>
              </Link>
            </Row>
          </li>
        ))}
      </ul>
    </section>
  );
}
