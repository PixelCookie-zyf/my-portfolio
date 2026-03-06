"use client";

import ScrollReveal from "./ScrollReveal";
import TextScramble from "./TextScramble";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

export default function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <ScrollReveal className="mb-12 text-center">
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        <TextScramble text={title} trigger="inView" />
      </h2>
      {subtitle && (
        <p className="mt-3 text-muted text-lg">{subtitle}</p>
      )}
    </ScrollReveal>
  );
}
