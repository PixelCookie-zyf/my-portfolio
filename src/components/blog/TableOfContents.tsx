import type { BlogHeading } from "@/lib/blog-headings";

interface TableOfContentsProps {
  headings: BlogHeading[];
  /** "margin" sits sticky in the notebook margin on large screens; "inline" is a fold-out above the article elsewhere. */
  placement: "margin" | "inline";
}

export default function TableOfContents({ headings, placement }: TableOfContentsProps) {
  if (headings.length < 2) return null;

  const chapters = headings.some((heading) => heading.depth === 2)
    ? headings.filter((heading) => heading.depth === 2)
    : headings;

  const links = (
    <ol className="sans space-y-2 text-[13px] leading-5">
      {chapters.map((heading) => (
        <li key={heading.id}>
          <a href={`#${heading.id}`} className="text-muted transition-colors hover:text-accent">
            {heading.title}
          </a>
        </li>
      ))}
    </ol>
  );

  if (placement === "margin") {
    return (
      <nav
        aria-label="文章目录"
        className="sticky top-8 hidden max-h-[calc(100dvh-4rem)] overflow-y-auto text-left lg:block"
      >
        <p className="mb-3">目录</p>
        {links}
      </nav>
    );
  }

  return (
    <details className="mb-10 max-w-[42rem] rounded-lg bg-surface px-4 py-3 lg:hidden">
      <summary className="cursor-pointer text-sm">目录</summary>
      <nav aria-label="文章目录" className="pt-4">{links}</nav>
    </details>
  );
}
