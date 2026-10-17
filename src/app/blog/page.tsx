import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import PageTitle from "@/components/layout/PageTitle";
import Row from "@/components/layout/Row";
import { getAllPosts, type PostMeta } from "@/lib/blog";
import { formatDate } from "@/lib/format";

export const metadata = {
  title: "Writing",
  description: "PixelCookie 的学习笔记：人工智能、强化学习与工程实践。",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const postsByYear = new Map<string, PostMeta[]>();

  for (const post of posts) {
    const year = post.date.slice(0, 4) || "Undated";
    postsByYear.set(year, [...(postsByYear.get(year) ?? []), post]);
  }

  return (
    <PageShell lang="zh-CN">
      <PageTitle title="Writing" note={`${posts.length} 篇`}>
        关于人工智能与工程的学习笔记。把学过的东西，慢慢想清楚。
      </PageTitle>

      {posts.length === 0 ? (
        <Row>
          <p className="text-muted">还没有文章。</p>
        </Row>
      ) : (
        Array.from(postsByYear).map(([year, yearPosts]) => (
          <section key={year} aria-labelledby={`year-${year}`} className="mb-16">
            <Row note={<h2 id={`year-${year}`} className="text-2xl not-italic text-foreground">{year}</h2>} className="mb-6 items-center">
              <div className="border-t border-border" />
            </Row>
            <ul className="space-y-8">
              {yearPosts.map((post) => (
                <li key={post.slug}>
                  <Row note={<time dateTime={post.date}>{formatDate(post.date, "zh-CN").replace(/^\d+年/, "")}</time>}>
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
        ))
      )}
    </PageShell>
  );
}
