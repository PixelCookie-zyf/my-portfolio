"use client";

import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { benchmarks, modelColors } from "@/data/benchmarks";
import type { BenchmarkCategory } from "@/data/benchmarks";

const BAR_MAX_HEIGHT = 140;

interface BenchmarkCardProps {
  category: BenchmarkCategory;
  cardIndex: number;
}

function BenchmarkCard({ category, cardIndex }: BenchmarkCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-white flex flex-col p-5">
      {/* Bar chart area — fixed height, bars aligned to bottom */}
      <div
        className="flex items-end justify-center gap-2"
        style={{ height: `${BAR_MAX_HEIGHT + 28}px` }}
      >
        {category.entries.map((entry, i) => {
          const barHeight = Math.round((entry.score / 100) * BAR_MAX_HEIGHT);
          const color = modelColors[entry.model] ?? "#9CA3AF";
          return (
            <div key={entry.model} className="flex flex-col items-center gap-1 w-8">
              {/* Score label above bar */}
              <span
                className="text-[10px] font-bold leading-none tabular-nums"
                style={{ color }}
              >
                {entry.score}
              </span>
              {/* Animated bar */}
              <motion.div
                className="w-full rounded-t-md"
                style={{
                  height: barHeight,
                  backgroundColor: color,
                  transformOrigin: "bottom",
                }}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.55,
                  delay: cardIndex * 0.05 + i * 0.07,
                  ease: "easeOut",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Category name */}
      <div className="mt-4 border-t border-border pt-3 text-center">
        <span className="text-sm font-semibold text-foreground">
          {category.name}
        </span>
      </div>
    </div>
  );
}

export default function Benchmarks() {
  const allModels = Object.keys(modelColors);

  return (
    <section id="benchmarks" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          title="Benchmarks"
          subtitle="Performance comparison across standard evaluations"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benchmarks.map((category, i) => (
            <ScrollReveal key={category.name} delay={i * 0.08}>
              <BenchmarkCard category={category} cardIndex={i} />
            </ScrollReveal>
          ))}
        </div>

        {/* Legend */}
        <ScrollReveal delay={0.5}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {allModels.map((model) => (
              <div key={model} className="flex items-center gap-1.5">
                <div
                  className="h-3 w-3 flex-shrink-0 rounded-sm"
                  style={{ backgroundColor: modelColors[model] }}
                />
                <span className="text-sm text-muted">{model}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
