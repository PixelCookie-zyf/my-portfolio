"use client";

import ScrollReveal from "./ScrollReveal";
import TextScramble from "./TextScramble";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  index?: string;
  kicker?: string;
  align?: "left" | "center";
}

export default function SectionTitle({
  title,
  subtitle,
  index,
  kicker,
  align = "left",
}: SectionTitleProps) {
  const centered = align === "center";

  return (
    <ScrollReveal className={`mb-14 ${centered ? "text-center" : ""}`}>
      {(index || kicker) && (
        <div
          className={`mb-4 flex items-center gap-3 ${
            centered ? "justify-center" : ""
          }`}
        >
          {index && (
            <span className="font-mono text-sm font-medium text-accent">
              {index}
            </span>
          )}
          <span className="h-px w-12 bg-accent/40" aria-hidden="true" />
          {kicker && (
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
              {kicker}
            </span>
          )}
        </div>
      )}
      <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        <TextScramble text={title} trigger="inView" />
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-lg text-muted ${
            centered ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {subtitle}
        </p>
      )}
    </ScrollReveal>
  );
}
