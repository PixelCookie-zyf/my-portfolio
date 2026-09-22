import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getAllPosts, type PostMeta } from "@/lib/blog";

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
    <>
      <Header />
      <main id="main-content" lang="zh-CN" className="min-h-[76vh] bg-background pb-24 pt-32 sm:pb-36 sm:pt-40">
        <div className="site-container">
          <header className="mb-14 max-w-2xl sm:mb-20">
            <p className="eyebrow mb-5">学习 · 记录</p>
            <h1 className="font-editorial text-5xl tracking-tight text-foreground sm:text-7xl">
              Writing<span className="text-accent">.</span>
            </h1>
            <p className="mt-6 text-base leading-8 text-muted sm:text-lg">
              关于人工智能与工程的学习笔记。把学过的东西，慢慢想清楚。
            </p>
          </header>

          {posts.length === 0 ? (
            <p className="border-t border-border pt-8 text-muted">还没有文章。</p>
          ) : (
            <div className="border-t border-border">
              {Array.from(postsByYear).map(([year, yearPosts]) => (
                <section key={year} aria-labelledby={`year-${year}`} className="grid gap-4 border-b border-border py-8 sm:grid-cols-[100px_minmax(0,1fr)] sm:gap-10 sm:py-10">
                  <h2 id={`year-${year}`} className="font-editorial text-xl text-muted">
                    {year}
                  </h2>
                  <div className="divide-y divide-border">
                    {yearPosts.map((post) => (
                      <article key={post.slug} className="py-7 first:pt-0 last:pb-0">
                        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
                          {post.date && (
                            <time dateTime={post.date} className="tabular-nums">
                              {post.date.slice(5).replace("-", ".")}
                            </time>
                          )}
                          {post.tags.length > 0 && <span>{post.tags.join(" / ")}</span>}
                        </div>
                        <h3 className="font-editorial text-2xl font-medium leading-relaxed text-foreground sm:text-[1.75rem]">
                          <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-accent">
                            {post.title}
                          </Link>
                        </h3>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
                          {post.description}
                        </p>
                        <Link href={`/blog/${post.slug}`} className="text-link mt-5 inline-flex items-center gap-2 text-sm">
                          阅读全文 <span aria-hidden="true">↗</span>
                        </Link>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
