import Link from "next/link";
import { Arrow } from "@/components/ui/Doodles";

interface SectionHeadingProps {
  /** Handwritten aside above the title. */
  kicker: string;
  title: React.ReactNode;
  link?: { href: string; label: string };
  /** Tailwind text color class for the kicker. */
  tone?: string;
}

export default function SectionHeading({ kicker, title, link, tone = "text-tomato" }: SectionHeadingProps) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 md:mb-14">
      <div>
        <p className={`font-hand flex items-end gap-1 text-[1.6rem] leading-none ${tone}`}>
          {kicker}
          <Arrow className="mb-[-14px] h-8 w-11 rotate-[18deg]" delay={0.2} />
        </p>
        <h2 className="font-display mt-2 text-[clamp(2.25rem,4.6vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.02em]">
          {title}
        </h2>
      </div>
      {link && (
        <Link
          href={link.href}
          className="group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-soft transition-colors hover:border-ink hover:text-ink"
        >
          {link.label}
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      )}
    </div>
  );
}
