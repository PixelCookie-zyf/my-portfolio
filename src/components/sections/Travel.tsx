"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { visitedCities } from "@/data/travel";

const TravelMap = dynamic(() => import("@/components/ui/TravelMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] sm:h-[500px] animate-pulse rounded-2xl bg-gray-100" />
  ),
});

// ---------------------------------------------------------------------------
// Derived stats
// ---------------------------------------------------------------------------
const countries = [...new Set(visitedCities.map((c) => c.country))];
const continentMap: Record<string, string> = {
  China: "Asia",
  Japan: "Asia",
  Indonesia: "Asia",
  Australia: "Oceania",
  USA: "Americas",
};
const continents = [...new Set(countries.map((c) => continentMap[c] ?? "Other"))];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatBadge({ value, label, delay = 0 }: { value: number; label: string; delay?: number }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-0.5"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <span className="text-2xl font-bold text-foreground">{value}</span>
      <span className="text-xs text-muted uppercase tracking-widest">{label}</span>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main section
// ---------------------------------------------------------------------------

export default function Travel() {
  return (
    <section id="travel" className="py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <SectionTitle
          title="Travel"
          subtitle="Cities and places I've explored around the world"
        />

        {/* Stats bar */}
        <ScrollReveal className="mb-8">
          <div className="flex justify-center gap-10 sm:gap-16">
            <StatBadge value={visitedCities.length} label="Cities" delay={0} />
            <div className="w-px bg-border" />
            <StatBadge value={countries.length} label="Countries" delay={0.1} />
            <div className="w-px bg-border" />
            <StatBadge value={continents.length} label="Continents" delay={0.2} />
          </div>
        </ScrollReveal>

        {/* Map */}
        <ScrollReveal>
          <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
            <TravelMap />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
