"use client";

import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import { timelineEntries, type TimelineEntry } from "@/data/experience";

// ---------------------------------------------------------------------------
// Per-type styling
// ---------------------------------------------------------------------------
const branchBadge: Record<TimelineEntry["type"], string> = {
  education:
    "border-[#24837B]/40 bg-[#24837B]/10 text-[#24837B] dark:border-[#3AA99F]/40 dark:bg-[#3AA99F]/10 dark:text-[#3AA99F]",
  work: "border-accent/40 bg-accent/10 text-accent",
  future: "border-dashed border-border bg-transparent text-muted",
};

function CommitDot({ entry }: { entry: TimelineEntry }) {
  const isCurrent = entry.period.includes("Present");

  if (entry.type === "future") {
    return (
      <motion.span
        className="block h-3.5 w-3.5 rounded-full border-2 border-dashed border-muted/50 bg-background"
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ repeat: Infinity, duration: 3 }}
      />
    );
  }

  return (
    <span className="relative block">
      <span
        className={`block h-3.5 w-3.5 border-2 bg-background ${
          entry.type === "work"
            ? "rotate-45 border-accent bg-accent/20"
            : "rounded-full border-[#24837B] bg-[#24837B]/20 dark:border-[#3AA99F] dark:bg-[#3AA99F]/20"
        }`}
      />
      {isCurrent && (
        <motion.span
          className={`absolute inset-0 rounded-full border-2 ${
            entry.type === "work"
              ? "border-accent"
              : "border-[#24837B] dark:border-[#3AA99F]"
          }`}
          animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Commit row
// ---------------------------------------------------------------------------
function CommitRow({
  entry,
  isFirst,
  isLast,
  index,
}: {
  entry: TimelineEntry;
  isFirst: boolean;
  isLast: boolean;
  index: number;
}) {
  const isCurrent = entry.period.includes("Present");
  const isFuture = entry.type === "future";

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-4 sm:grid-cols-[8.5rem_1.25rem_minmax(0,1fr)] sm:gap-x-6"
    >
      {/* Hover wash */}
      <div
        aria-hidden="true"
        className="absolute -inset-x-4 -inset-y-2 -z-10 rounded-2xl bg-card-bg/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:-inset-x-6"
      />

      {/* Period — desktop, right-aligned against the spine */}
      <span
        className={`hidden pt-0.5 text-right font-mono text-xs sm:block ${
          isCurrent ? "font-medium text-accent" : "text-muted"
        }`}
      >
        {entry.period}
      </span>

      {/* Spine: line segments + commit dot */}
      <div className="relative flex justify-center">
        {!isFirst && (
          <span
            aria-hidden="true"
            className="absolute -top-2 h-3 border-l border-border"
          />
        )}
        {!isLast && (
          <span
            aria-hidden="true"
            className={`absolute top-6 -bottom-2 border-l border-border ${
              isFuture ? "border-dashed" : ""
            }`}
          />
        )}
        <span className="mt-1.5">
          <CommitDot entry={entry} />
        </span>
      </div>

      {/* Content */}
      <div className={`${isLast ? "pb-0" : "pb-12"} ${isFuture ? "opacity-80" : ""}`}>
        <p
          className={`mb-1 font-mono text-xs sm:hidden ${
            isCurrent ? "font-medium text-accent" : "text-muted"
          }`}
        >
          {entry.period}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h3 className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-xl">
            {entry.institution}
          </h3>
          <span
            className={`rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-wide ${branchBadge[entry.type]}`}
          >
            {entry.branch}
          </span>
          {isCurrent && (
            <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-[#fffcf0]">
              HEAD
            </span>
          )}
        </div>

        <p className="mt-1 text-sm font-medium text-muted">{entry.role}</p>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          {entry.description}
        </p>

        <p className="mt-2.5 font-mono text-xs tracking-wide text-muted/80">
          {entry.tags.join(" · ")}
        </p>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main section — career history rendered as a git log
// ---------------------------------------------------------------------------
export default function Experience() {
  const entries = [...timelineEntries].reverse(); // newest first, like git log

  return (
    <section id="experience" className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <SectionTitle
          index="01"
          kicker="career"
          title="Experience"
          subtitle="The journey so far, one commit at a time."
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="-mt-8 mb-10 font-mono text-xs text-muted/80"
        >
          <span className="select-none text-accent">$ </span>
          git log --graph --all
        </motion.p>

        <div>
          {entries.map((entry, i) => (
            <CommitRow
              key={entry.branch}
              entry={entry}
              index={i}
              isFirst={i === 0}
              isLast={i === entries.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
