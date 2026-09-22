"use client";

import dynamic from "next/dynamic";
import { visitedCities } from "@/data/travel";

const TravelMap = dynamic(() => import("@/components/ui/TravelMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-card-bg sm:h-[500px]" aria-label="Loading travel map" />
  ),
});

const countryCount = new Set(visitedCities.map((city) => city.country)).size;

export default function Travel() {
  return (
    <section id="travel" className="site-section">
      <div className="site-container">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Away from the desk</p>
            <h2 className="section-heading">A few places</h2>
          </div>
          <p className="text-sm text-muted">
            {visitedCities.length} cities, {countryCount} countries
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          <TravelMap />
        </div>
      </div>
    </section>
  );
}
