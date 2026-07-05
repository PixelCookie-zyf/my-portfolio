"use client";

import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import { timelineEntries, type TimelineEntry } from "@/data/experience";

// ---------------------------------------------------------------------------
// Node dot styles by type
// ---------------------------------------------------------------------------
const dotStyles: Record<TimelineEntry["type"], string> = {
  education: "border-[#24837B] bg-[#24837B]/15 dark:border-[#3AA99F] dark:bg-[#3AA99F]/20",
  work: "border-accent bg-accent/15 dark:bg-accent/20",
  future: "border-dashed border-muted/60 bg-transparent",
};

const accentColors: Record<TimelineEntry["type"], string> = {
  education: "text-[#24837B] dark:text-[#3AA99F]",
  work: "text-accent",
  future: "text-muted/70",
};

const borderLeft: Record<TimelineEntry["type"], string> = {
  education: "border-l-[#24837B] dark:border-l-[#3AA99F]",
  work: "border-l-accent",
  future: "border-l-border",
};

// ---------------------------------------------------------------------------
// Timeline card (landscape)
// ---------------------------------------------------------------------------
function TimelineCard({
  entry,
  position,
  index,
}: {
  entry: TimelineEntry;
  position: "above" | "below";
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: position === "above" ? -20 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.12 }}
      whileHover={{ y: position === "above" ? -4 : 4 }}
      className={`w-[320px] rounded-2xl border border-border ${borderLeft[entry.type]} border-l-[3px] bg-background/80 px-5 py-4 shadow-sm backdrop-blur transition-shadow hover:shadow-md`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-foreground leading-snug">
            {entry.institution}
          </h3>
          <p className="text-xs font-medium text-muted">{entry.role}</p>
        </div>
        <span className={`shrink-0 text-[11px] font-semibold ${accentColors[entry.type]}`}>
          {entry.period}
        </span>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-muted">
        {entry.description}
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {entry.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-card-bg px-2.5 py-0.5 text-[10px] text-muted"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main section
// ---------------------------------------------------------------------------
export default function Experience() {
  return (
    <section id="experience" className="py-24 px-6 overflow-hidden">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          index="01"
          kicker="career"
          title="Experience"
          subtitle="My journey so far"
        />

        {/* ---- Desktop: horizontal timeline (lg+) ---- */}
        <div className="hidden lg:block">
          {/* Cards above (index 0, 2, 4) */}
          <div className="relative flex justify-between mb-3">
            {timelineEntries.map((entry, i) => (
              <div
                key={`above-${i}`}
                className="flex-1 flex justify-center"
              >
                {i % 2 === 0 ? (
                  <TimelineCard entry={entry} position="above" index={i} />
                ) : (
                  <div />
                )}
              </div>
            ))}
          </div>

          {/* Timeline line + dots */}
          <div className="relative flex items-center py-3">
            <motion.div
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-[#24837B]/50 via-accent/50 to-border dark:from-[#3AA99F]/40 dark:via-accent/40"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{ transformOrigin: "left" }}
            />
            <div className="relative z-10 flex w-full justify-between px-[10%]">
              {timelineEntries.map((entry, i) => (
                <motion.div
                  key={`dot-${i}`}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.2 + i * 0.12,
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  className="relative"
                >
                  <div
                    className={`h-4 w-4 rounded-full border-2 bg-background ${dotStyles[entry.type]} ${
                      entry.type === "work" ? "rotate-45" : ""
                    }`}
                  />
                  {entry.period.includes("Present") && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-accent"
                      animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}
                  {entry.type === "future" && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-dashed border-muted/40"
                      animate={{ opacity: [0.3, 0.8, 0.3] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Cards below (index 1, 3) */}
          <div className="relative flex justify-between mt-3">
            {timelineEntries.map((entry, i) => (
              <div
                key={`below-${i}`}
                className="flex-1 flex justify-center"
              >
                {i % 2 === 1 ? (
                  <TimelineCard entry={entry} position="below" index={i} />
                ) : (
                  <div />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ---- Mobile / Tablet: vertical timeline ---- */}
        <div className="lg:hidden relative">
          <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#24837B]/50 via-accent/50 to-border dark:from-[#3AA99F]/40 dark:via-accent/40" />

          <div className="space-y-8">
            {timelineEntries.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative pl-8"
              >
                <div className="absolute left-0 top-4">
                  <div
                    className={`h-4 w-4 rounded-full border-2 bg-background ${dotStyles[entry.type]} ${
                      entry.type === "work" ? "rotate-45" : ""
                    }`}
                  />
                  {entry.period.includes("Present") && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-accent"
                      animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}
                </div>

                <div
                  className={`rounded-2xl border border-border ${borderLeft[entry.type]} border-l-[3px] bg-background/80 p-5 shadow-sm`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-foreground">
                        {entry.institution}
                      </h3>
                      <p className="text-xs font-medium text-muted">{entry.role}</p>
                    </div>
                    <span className={`shrink-0 text-[11px] font-semibold ${accentColors[entry.type]}`}>
                      {entry.period}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    {entry.description}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-card-bg px-2.5 py-0.5 text-[10px] text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
