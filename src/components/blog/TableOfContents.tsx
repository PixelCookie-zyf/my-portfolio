import type { BlogHeading } from "@/lib/blog-headings";

interface TableOfContentsProps {
  headings: BlogHeading[];
  /** "aside" is a sticky card beside the article on large screens; "inline" folds out above it elsewhere. */
  placement: "aside" | "inline";
}

export default function TableOfContents({ headings, placement }: TableOfContentsProps) {
  if (headings.length < 2) return null;

  const chapters = headings.some((heading) => heading.depth === 2)
    ? headings.filter((heading) => heading.depth === 2)
    : headings;

  const links = (
    <ol className="space-y-2.5 text-[13px] leading-5">
      {chapters.map((heading, index) => (
        <li key={heading.id} className="flex gap-2.5">
          <span className="font-display w-4 shrink-0 italic text-muted">{index + 1}</span>
          <a href={`#${heading.id}`} className="text-soft transition-colors hover:text-tomato">
            {heading.title}
          </a>
        </li>
      ))}
    </ol>
  );

  if (placement === "aside") {
    return (
      <aside className="hidden lg:block">
        <nav
          aria-label="文章目录"
          className="sticky top-8 max-h-[calc(100dvh-4rem)] overflow-y-auto rounded-2xl border border-line bg-card p-5"
        >
          <p className="font-hand mb-3 text-2xl leading-none text-tomato">目录</p>
          {links}
        </nav>
      </aside>
    );
  }

  return (
    <details className="mb-10 rounded-2xl border border-line bg-card px-5 py-4 lg:hidden">
      <summary className="cursor-pointer text-sm">目录</summary>
      <nav aria-label="文章目录" className="pt-4">{links}</nav>
    </details>
  );
}
