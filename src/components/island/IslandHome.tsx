"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { personalInfo } from "@/data/personal";
import { projects } from "@/data/projects";
import { skillCategories } from "@/data/skills";
import { timelineEntries } from "@/data/experience";
import { visitedCities } from "@/data/travel";
import type { PostMeta } from "@/lib/blog";
import type { IslandHandle, IslandSpot } from "@/components/island/engine/mount";
import "@/components/island/island.css";

const SPOTS: IslandSpot[] = ["writing", "projects", "about", "travel", "contact"];
const spotFromHash = () => SPOTS.find((s) => window.location.hash === `#${s}`);

/** The homepage: a full-screen low-poly island; each landmark opens one section of the site. */
export default function IslandHome({ posts }: { posts: PostMeta[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const island = useRef<IslandHandle | null>(null);
  const night = useRef(false);
  const [outline, setOutline] = useState(true);
  const [spin, setSpin] = useState(false);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    night.current = isDark;
    island.current?.setNight(isDark);
  }, [isDark]);
  // braces matter: an effect's return value is treated as its cleanup function
  useEffect(() => {
    island.current?.setOutline(outline);
  }, [outline]);
  useEffect(() => {
    island.current?.setSpin(spin);
  }, [spin]);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let cancelled = false;
    const data = {
      personal: personalInfo,
      skills: skillCategories,
      timeline: timelineEntries,
      projects,
      posts,
      cities: visitedCities,
    };
    // Open pop-ups are mirrored in the hash, so /#travel or /#about can be linked to directly.
    const onModal = (key: IslandSpot | null) =>
      history.replaceState(null, "", key ? `#${key}` : window.location.pathname);
    const onFishing = (on: boolean) =>
      history.replaceState(null, "", on ? "#fishing" : window.location.pathname);
    const onHash = () => {
      if (window.location.hash === "#fishing") {
        island.current?.fish();
        return;
      }
      const spot = spotFromHash();
      if (spot) island.current?.open(spot);
    };

    import("@/components/island/engine/mount")
      .then(({ mountIsland }) =>
        cancelled ? null : mountIsland(el, { data, navigate: router.push, night: night.current, fullscreen: true, onModal, onFishing }),
      )
      .then((handle) => {
        if (!handle) return;
        if (cancelled) return handle.dispose();
        island.current = handle;
        onHash();
      });
    window.addEventListener("hashchange", onHash);

    return () => {
      cancelled = true;
      window.removeEventListener("hashchange", onHash);
      island.current?.dispose();
      island.current = null;
    };
  }, [posts, router]);

  return (
    <div ref={stage} className="isl isl-stage isl-full">
      <div className="isl-poster" aria-hidden="true">unfolding the map…</div>

      <div className="isl-intro">
        <p className="hand">hi, I’m {personalInfo.name} —</p>
        <h1>
          welcome to my <em>little island</em>
        </h1>
        <p>Each sticky note is a page of my notebook. Click one to open it.</p>
      </div>

      <div className="isl-controls">
        <button
          type="button"
          className="jelly"
          aria-pressed={isDark}
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {isDark ? "☀ day" : "☾ night"}
        </button>
        <button type="button" className="jelly" aria-pressed={outline} onClick={() => setOutline((v) => !v)}>
          outline
        </button>
        <button type="button" className="jelly" aria-pressed={spin} onClick={() => setSpin((v) => !v)}>
          spin
        </button>
      </div>

      <p className="isl-hint">drag to look around · scroll to zoom · honk the bus · go fishing off the jetty</p>
    </div>
  );
}
