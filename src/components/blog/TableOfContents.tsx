import type { BlogHeading } from "@/lib/blog-headings";

export default function TableOfContents({ headings }: { headings: BlogHeading[] }) {
  if (headings.length < 2) return null;

  const chapters = headings.some((heading) => heading.depth === 2)
    ? headings.filter((heading) => heading.depth === 2)
    : headings;

  const links = (
    <ol className="space-y-3">
      {chapters.map((heading) => (
        <li key={heading.id}>
          <a href={`#${heading.id}`} className="block text-[13px] leading-6 text-muted transition-colors hover:text-accent">
            {heading.title}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <details className="mb-9 border-y border-border py-4 lg:hidden">
        <summary className="cursor-pointer text-sm text-foreground">文章目录</summary>
        <nav aria-label="文章目录" className="pt-5">{links}</nav>
      </details>
      <aside className="hidden lg:sticky lg:top-28 lg:order-2 lg:block">
        <nav aria-label="文章目录" className="max-h-[calc(100dvh-9rem)] overflow-y-auto border-l border-border pl-6 pr-2">
          <p className="mb-5 text-xs text-foreground">文章目录</p>
          {links}
        </nav>
      </aside>
    </>
  );
}
