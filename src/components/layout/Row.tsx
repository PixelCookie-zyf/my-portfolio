import Link from "next/link";

interface RowProps {
  /** Short note written in the margin, left of the rule. */
  note?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export default function Row({ note, className = "", children }: RowProps) {
  return (
    <div className={`row ${className}`}>
      <div className="note">{note}</div>
      <div className="relative min-w-0">{children}</div>
    </div>
  );
}

interface SectionHeadingProps {
  index: string;
  title: string;
  link?: { href: string; label: string };
}

export function SectionHeading({ index, title, link }: SectionHeadingProps) {
  return (
    <Row note={index} className="mb-8 items-baseline">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="serif text-[2rem] font-medium leading-tight tracking-[-0.01em]">{title}</h2>
        {link && (
          <Link href={link.href} className="link text-sm text-muted">
            {link.label} →
          </Link>
        )}
      </div>
    </Row>
  );
}
