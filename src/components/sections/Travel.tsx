"use client";

import dynamic from "next/dynamic";
import Row, { SectionHeading } from "@/components/layout/Row";
import { visitedCities } from "@/data/travel";

const TravelMap = dynamic(() => import("@/components/ui/TravelMap"), {
  ssr: false,
  loading: () => <div className="h-[340px] rounded-lg bg-surface md:h-[420px]" aria-label="Loading travel map" />,
});

const citiesByCountry = Object.entries(
  visitedCities.reduce<Record<string, string[]>>((groups, city) => {
    (groups[city.country] ??= []).push(city.name);
    return groups;
  }, {}),
);

export default function Travel() {
  return (
    <section id="travel" className="pb-24">
      <SectionHeading index="05" title="Places I’ve been" />
      <Row note={`${visitedCities.length} cities, ${citiesByCountry.length} countries`}>
        <div className="overflow-hidden rounded-lg border border-border">
          <TravelMap />
        </div>
        <dl className="mt-6 max-w-[42rem] space-y-2.5 text-[15px]">
          {citiesByCountry.map(([country, cities]) => (
            <div key={country} className="flex gap-4">
              <dt className="w-24 shrink-0 text-muted">{country}</dt>
              <dd>{cities.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </Row>
    </section>
  );
}
