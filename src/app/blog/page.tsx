import PageShell from "@/components/layout/PageShell";
import PageTitle from "@/components/layout/PageTitle";
import { FeaturedPost, PostRow } from "@/components/sections/Blog";
import { getAllPosts, type PostMeta } from "@/lib/blog";

export const metadata = {
  title: "Writing",
  description: "PixelCookie 的学习笔记：人工智能、强化学习与工程实践。",
};

export default function BlogPage() {
  const [latest, ...rest] = getAllPosts();
  const restByYear = new Map<string, PostMeta[]>();

  for (const post of rest) {
    const year = post.date.slice(0, 4) || "Undated";
    restByYear.set(year, [...(restByYear.get(year) ?? []), post]);
  }

  return (
    <PageShell>
      <PageTitle kicker="notes to self" title="Writing">
        <p lang="zh-CN">关于人工智能与工程的学习笔记。把学过的东西，慢慢想清楚。</p>
      </PageTitle>

      <div className="wrap">
        {!latest ? (
          <p className="text-muted">还没有文章。</p>
        ) : (
          <>
            <FeaturedPost post={latest} label="Newest" />
            {Array.from(restByYear).map(([year, posts]) => (
              <section key={year} aria-labelledby={`year-${year}`} className="mt-16">
                <h2 id={`year-${year}`} className="font-display text-3xl font-medium italic text-muted">
                  {year}
                </h2>
                <ul className="mt-4 divide-y divide-dashed divide-line">
                  {posts.map((post) => (
                    <li key={post.slug}>
                      <PostRow post={post} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </>
        )}
      </div>
    </PageShell>
  );
}
