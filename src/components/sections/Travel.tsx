"use client";

import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { visitedCities, City } from "@/data/travel";

// ---------------------------------------------------------------------------
// Mercator projection helper
// ---------------------------------------------------------------------------
const MAP_W = 960;
const MAP_H = 480;

function project(lat: number, lng: number) {
  const x = ((lng + 180) / 360) * MAP_W;
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = MAP_H / 2 - (mercN / Math.PI) * (MAP_H / 2);
  return { x, y };
}

// ---------------------------------------------------------------------------
// Dot-matrix land grid
// Each entry is [latStart, lngStart] for a 10×10-degree cell that is mostly land.
// Cells are rendered as tiny dots using the cell's centre coordinate.
// ---------------------------------------------------------------------------
const LAND_CELLS: [number, number][] = [
  // ── Greenland / Arctic ──
  [70, -50], [70, -40], [70, -30], [70, -20],
  [80, -60], [80, -50], [80, -40], [80, -30],

  // ── North America ──
  [70, -140], [70, -130], [70, -120], [70, -110], [70, -100], [70, -90], [70, -80], [70, -70],
  [60, -140], [60, -130], [60, -120], [60, -110], [60, -100], [60, -90], [60, -80], [60, -70], [60, -60],
  [50, -130], [50, -120], [50, -110], [50, -100], [50, -90], [50, -80], [50, -70], [50, -60],
  [40, -130], [40, -120], [40, -110], [40, -100], [40, -90], [40, -80], [40, -70],
  [30, -120], [30, -110], [30, -100], [30, -90], [30, -80],
  [20, -110], [20, -100], [20, -90], [20, -80],
  // Central America / Caribbean
  [10, -90], [10, -80], [10, -70],
  [20, -70], [20, -60],

  // ── South America ──
  [10, -80], [10, -70], [10, -60], [10, -50],
  [0, -80], [0, -70], [0, -60], [0, -50],
  [-10, -80], [-10, -70], [-10, -60], [-10, -50], [-10, -40],
  [-20, -70], [-20, -60], [-20, -50], [-20, -40],
  [-30, -70], [-30, -60], [-30, -50],
  [-40, -70], [-40, -60],
  [-50, -70], [-50, -60],

  // ── Europe ──
  [70, 20], [70, 30], [70, 40],
  [60, -10], [60, 0], [60, 10], [60, 20], [60, 30], [60, 40], [60, 50],
  [50, -10], [50, 0], [50, 10], [50, 20], [50, 30], [50, 40],
  [40, -10], [40, 0], [40, 10], [40, 20], [40, 30], [40, 40],
  [30, -10], [30, 0], [30, 10],

  // ── Africa ──
  [30, 10], [30, 20], [30, 30],
  [20, -20], [20, -10], [20, 0], [20, 10], [20, 20], [20, 30], [20, 40], [20, 50],
  [10, -20], [10, -10], [10, 0], [10, 10], [10, 20], [10, 30], [10, 40],
  [0, 10], [0, 20], [0, 30], [0, 40],
  [-10, 10], [-10, 20], [-10, 30], [-10, 40],
  [-20, 20], [-20, 30], [-20, 40],
  [-30, 20], [-30, 30],
  [-40, 20],

  // ── Middle East / Western Asia ──
  [30, 40], [30, 50], [30, 60],
  [20, 40], [20, 50],
  [10, 40], [10, 50],

  // ── Asia (continental) ──
  [70, 60], [70, 70], [70, 80], [70, 90], [70, 100], [70, 110], [70, 120], [70, 130],
  [60, 60], [60, 70], [60, 80], [60, 90], [60, 100], [60, 110], [60, 120], [60, 130], [60, 140],
  [50, 50], [50, 60], [50, 70], [50, 80], [50, 90], [50, 100], [50, 110], [50, 120], [50, 130], [50, 140],
  [40, 40], [40, 50], [40, 60], [40, 70], [40, 80], [40, 90], [40, 100], [40, 110], [40, 120], [40, 130],
  [30, 60], [30, 70], [30, 80], [30, 90], [30, 100], [30, 110], [30, 120], [30, 130],
  [20, 70], [20, 80], [20, 90], [20, 100], [20, 110], [20, 120],
  [10, 70], [10, 80], [10, 90], [10, 100], [10, 110], [10, 120],
  [0, 100], [0, 110], [0, 120],

  // ── Southeast Asia / Indonesia ──
  [-10, 100], [-10, 110], [-10, 120], [-10, 130], [-10, 140],
  [0, 100], [0, 110], [0, 120],

  // ── Japan & Korea ──
  [30, 130], [30, 140],
  [40, 140],

  // ── Australia & New Zealand ──
  [-10, 130], [-10, 140], [-10, 150],
  [-20, 110], [-20, 120], [-20, 130], [-20, 140], [-20, 150],
  [-30, 110], [-30, 120], [-30, 130], [-30, 140], [-30, 150],
  [-40, 140], [-40, 150],
  [-40, 170], [-40, 180],
];

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

// Which city names get a visible SVG label (avoid clutter for tight clusters)
const LABELED = new Set(["Shanghai", "Fuzhou", "Beijing", "Tokyo", "New York", "Sydney", "Bali"]);

// City categories for the chip list below the map
const homeCity = visitedCities.find((c) => c.home);
const currentCity = visitedCities.find((c) => c.current);
const domesticCities = visitedCities.filter(
  (c) => c.country === "China" && !c.home && !c.current
);
const internationalCities = visitedCities.filter((c) => c.country !== "China");

// ---------------------------------------------------------------------------
// Dot colour helpers
// ---------------------------------------------------------------------------
function dotColor(city: City): string {
  if (city.home) return "#f97316"; // orange
  if (city.current) return "#3b82f6"; // blue
  if (city.country !== "China") return "#8b5cf6"; // purple for international
  return "#94a3b8"; // slate for domestic
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface PulsingDotProps {
  cx: number;
  cy: number;
  color: string;
  r?: number;
  delay?: number;
  label?: string;
  labelBelow?: boolean;
}

function PulsingDot({ cx, cy, color, r = 4, delay = 0, label, labelBelow }: PulsingDotProps) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
    >
      {/* Outer pulse ring */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={r + 4}
        fill={color}
        opacity={0}
        animate={{ r: [r + 2, r + 10], opacity: [0.4, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay }}
      />
      {/* Core dot */}
      <circle cx={cx} cy={cy} r={r} fill={color} />
      {/* Label */}
      {label && (
        <text
          x={cx}
          y={labelBelow ? cy + r + 12 : cy - r - 6}
          textAnchor="middle"
          fontSize={9}
          fontWeight={600}
          fill={color}
          style={{ userSelect: "none" }}
        >
          {label}
        </text>
      )}
    </motion.g>
  );
}

interface StatBadgeProps {
  value: number;
  label: string;
  delay?: number;
}

function StatBadge({ value, label, delay = 0 }: StatBadgeProps) {
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

interface CityChipProps {
  city: City;
  badge?: "home" | "current" | "international";
  delay?: number;
}

function CityChip({ city, badge, delay = 0 }: CityChipProps) {
  const badgeStyles: Record<string, string> = {
    home: "bg-orange-50 text-orange-600 border-orange-200",
    current: "bg-blue-50 text-blue-600 border-blue-200",
    international: "bg-violet-50 text-violet-600 border-violet-200",
  };
  const base = badge
    ? badgeStyles[badge]
    : "bg-slate-50 text-slate-500 border-slate-200";

  return (
    <motion.span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${base}`}
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
    >
      {city.name}
      {badge === "home" && <span className="ml-0.5 opacity-70">Home</span>}
      {badge === "current" && <span className="ml-0.5 opacity-70">Now</span>}
      {badge === "international" && (
        <span className="ml-0.5 opacity-60 font-normal">{city.country}</span>
      )}
    </motion.span>
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

        {/* Map card */}
        <ScrollReveal>
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <svg
              viewBox={`0 0 ${MAP_W} ${MAP_H}`}
              className="w-full"
              aria-label="World travel map"
            >
              {/* Ocean background */}
              <rect width={MAP_W} height={MAP_H} fill="#f8fafc" />

              {/* Dot-matrix land cells */}
              {LAND_CELLS.map(([latStart, lngStart], idx) => {
                const centreLat = latStart + 5;
                const centreLng = lngStart + 5;
                const { x, y } = project(centreLat, centreLng);
                return (
                  <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r={3.8}
                    fill="#e2e8f0"
                  />
                );
              })}

              {/* Equator and prime meridian reference lines */}
              {(() => {
                const eq = project(0, -180);
                const eqR = project(0, 180);
                const pm = project(90, 0);
                const pmB = project(-90, 0);
                return (
                  <>
                    <line
                      x1={eq.x} y1={eq.y} x2={eqR.x} y2={eq.y}
                      stroke="#cbd5e1" strokeWidth={0.5} strokeDasharray="4 4"
                    />
                    <line
                      x1={pm.x} y1={pm.y} x2={pmB.x} y2={pmB.y}
                      stroke="#cbd5e1" strokeWidth={0.5} strokeDasharray="4 4"
                    />
                  </>
                );
              })()}

              {/* Dashed arcs: home → international cities */}
              {homeCity &&
                internationalCities.map((dest) => {
                  const src = project(homeCity.lat, homeCity.lng);
                  const dst = project(dest.lat, dest.lng);
                  const mx = (src.x + dst.x) / 2;
                  const my = Math.min(src.y, dst.y) - 40;
                  return (
                    <path
                      key={`arc-${dest.name}`}
                      d={`M ${src.x} ${src.y} Q ${mx} ${my} ${dst.x} ${dst.y}`}
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth={0.8}
                      strokeDasharray="4 3"
                      opacity={0.6}
                    />
                  );
                })}

              {/* City markers — domestic first (smaller, no label for most) */}
              {visitedCities.map((city, i) => {
                const { x, y } = project(city.lat, city.lng);
                const color = dotColor(city);
                const isKey = city.home || city.current;
                const showLabel = LABELED.has(city.name);
                const r = isKey ? 6 : city.country !== "China" ? 5 : 3.5;
                const labelBelow = city.lat < 0; // put label below for southern hemisphere
                return (
                  <PulsingDot
                    key={city.name}
                    cx={x}
                    cy={y}
                    color={color}
                    r={r}
                    delay={0.05 * i}
                    label={showLabel ? city.name : undefined}
                    labelBelow={labelBelow}
                  />
                );
              })}
            </svg>

            {/* Map legend */}
            <div className="flex flex-wrap items-center justify-center gap-5 border-t border-border bg-slate-50/60 px-6 py-3">
              {[
                { color: "#f97316", label: "Home" },
                { color: "#3b82f6", label: "Current city" },
                { color: "#8b5cf6", label: "International" },
                { color: "#94a3b8", label: "Domestic" },
              ].map(({ color, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-xs text-muted">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: color }}
                  />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* City chips grouped by region */}
        <ScrollReveal delay={0.15} className="mt-8 space-y-4">
          {/* Home */}
          {homeCity && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-24 shrink-0 text-xs font-semibold uppercase tracking-widest text-muted">
                Home
              </span>
              <CityChip city={homeCity} badge="home" delay={0} />
            </div>
          )}

          {/* Current */}
          {currentCity && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-24 shrink-0 text-xs font-semibold uppercase tracking-widest text-muted">
                Current
              </span>
              <CityChip city={currentCity} badge="current" delay={0.05} />
            </div>
          )}

          {/* China domestic */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-24 shrink-0 text-xs font-semibold uppercase tracking-widest text-muted">
              China
            </span>
            <div className="flex flex-wrap gap-2">
              {domesticCities.map((city, i) => (
                <CityChip key={city.name} city={city} delay={0.05 * i} />
              ))}
            </div>
          </div>

          {/* International */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-24 shrink-0 text-xs font-semibold uppercase tracking-widest text-muted">
              Int&apos;l
            </span>
            <div className="flex flex-wrap gap-2">
              {internationalCities.map((city, i) => (
                <CityChip key={city.name} city={city} badge="international" delay={0.05 * i} />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
