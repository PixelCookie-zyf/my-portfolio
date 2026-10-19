"use client";

import dynamic from "next/dynamic";
import SectionHeading from "@/components/layout/SectionHeading";
import { Sparkle } from "@/components/ui/Doodles";
import { visitedCities } from "@/data/travel";

const TravelMap = dynamic(() => import("@/components/ui/TravelMap"), {
  ssr: false,
  loading: () => <div className="h-[340px] bg-inset md:h-full md:min-h-[440px]" aria-label="Loading travel map" />,
});

const citiesByCountry = Object.entries(
  visitedCities.reduce<Record<string, string[]>>((groups, city) => {
    (groups[city.country] ??= []).push(city.name);
    return groups;
  }, {}),
);
const current = visitedCities.find((city) => city.current);

export default function Travel() {
  return (
    <section id="travel" className="wrap pb-28">
      <SectionHeading kicker="postcards from" title="Places I’ve been" tone="text-blue" />

      {/* A postcard: map on the front, notes and a stamp on the back. */}
      <div className="paper-shadow -rotate-[0.4deg] rounded-md bg-card p-3 md:p-4">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
          <div className="overflow-hidden rounded-sm md:h-full">
            <TravelMap />
          </div>

          <div className="relative px-3 pb-4 pt-2 md:border-l md:border-dashed md:border-line md:px-6">
            <div className="stamp absolute right-3 top-2 h-[110px] w-[90px] rotate-3 md:right-5">
              <div className="absolute inset-[5px] flex flex-col items-center justify-center bg-tomato text-paper">
                <Sparkle className="h-4 w-4 text-note-yellow" />
                <span className="font-display mt-1 text-3xl font-medium leading-none">{visitedCities.length}</span>
                <span className="mt-1 text-[10px] uppercase tracking-[0.14em]">cities</span>
              </div>
            </div>
            <span
              aria-hidden="true"
              className="font-hand absolute right-[7.5rem] top-4 flex h-20 w-20 -rotate-12 items-center justify-center rounded-full border-2 border-dashed border-blue/50 text-center text-base leading-tight text-blue/70 md:right-[8.5rem]"
            >
              {current?.name ?? "home"}
              <br />
              2026
            </span>

            <p className="font-hand max-w-[11rem] text-[1.75rem] leading-[1.1] text-soft">
              greetings from {citiesByCountry.length} countries!
            </p>

            <dl className="mt-14 space-y-3 text-[15px] md:mt-16">
              {citiesByCountry.map(([country, cities]) => (
                <div key={country} className="border-b border-dashed border-line pb-3 last:border-0">
                  <dt className="font-display font-medium italic">{country}</dt>
                  <dd className="mt-0.5 text-sm leading-relaxed text-soft">{cities.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
