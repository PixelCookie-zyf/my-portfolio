"use client";

import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import PixelScene from "@/components/ui/PixelScene";
import { timelineEntries, type TimelineEntry } from "@/data/experience";

// ---------------------------------------------------------------------------
// Node dot styles by type
// ---------------------------------------------------------------------------
const dotStyles: Record<TimelineEntry["type"], string> = {
  education: "border-blue-500 bg-blue-100",
  work: "border-violet-500 bg-violet-100",
  future: "border-dashed border-gray-400 bg-transparent",
};

const accentColors: Record<TimelineEntry["type"], string> = {
  education: "text-blue-600",
  work: "text-violet-600",
  future: "text-gray-400",
};

const borderLeft: Record<TimelineEntry["type"], string> = {
  education: "border-l-blue-500",
  work: "border-l-violet-500",
  future: "border-l-gray-300",
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
      className={`w-[320px] rounded-2xl border border-border ${borderLeft[entry.type]} border-l-[3px] bg-white/80 px-5 py-4 shadow-sm backdrop-blur transition-shadow hover:shadow-md`}
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
        <SectionTitle title="Experience" subtitle="My journey so far" />

        {/* ---- Pixel Scene ---- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="overflow-x-auto"
        >
          <PixelScene className="mx-auto" />
        </motion.div>

        {/* ---- Scene → Timeline connector ---- */}
        <div className="flex flex-col items-center my-6 gap-1.5">
          <div className="w-px h-6 bg-gradient-to-b from-yellow-200 to-blue-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-300" />
          <div className="w-px h-3 bg-gradient-to-b from-blue-300 to-violet-300" />
        </div>

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
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-blue-300 via-violet-300 to-gray-200"
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
                    className={`h-4 w-4 rounded-full border-2 bg-white ${dotStyles[entry.type]} ${
                      entry.type === "work" ? "rotate-45" : ""
                    }`}
                  />
                  {entry.period.includes("Present") && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-violet-400"
                      animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}
                  {entry.type === "future" && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-dashed border-gray-300"
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
          <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 via-violet-300 to-gray-200" />

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
                    className={`h-4 w-4 rounded-full border-2 bg-white ${dotStyles[entry.type]} ${
                      entry.type === "work" ? "rotate-45" : ""
                    }`}
                  />
                  {entry.period.includes("Present") && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-violet-400"
                      animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}
                </div>

                <div
                  className={`rounded-2xl border border-border ${borderLeft[entry.type]} border-l-[3px] bg-white/80 p-5 shadow-sm`}
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
