"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { ActivityCalendar } from "react-activity-calendar";
import {
  calculateCurrentStreak,
  githubCalendarTheme,
  normalizeContributionDays,
  sumRecentContributions,
  toCalendarActivities,
  type GitHubContributionDay,
} from "@/lib/github-calendar";
import {
  emptySubscribe,
  getClientHydratedSnapshot,
  getServerHydratedSnapshot,
} from "@/lib/hydration";

interface GitHubData {
  publicRepos?: number;
  stars?: number;
  days: GitHubContributionDay[];
}

const CACHE_TTL = 5 * 60 * 1000;
const MIN_BLOCK = 10;
const MAX_BLOCK = 16;
const MARGIN = 3;

function cacheKey(username: string) {
  return `portfolio.github.v2.${username.toLowerCase()}`;
}

function readCache(username: string): GitHubData | null {
  try {
    const cached = JSON.parse(sessionStorage.getItem(cacheKey(username)) ?? "null");
    if (!cached || Date.now() - cached.savedAt > CACHE_TTL || !Array.isArray(cached.data?.days)) {
      return null;
    }
    return cached.data;
  } catch {
    return null;
  }
}

function writeCache(username: string, data: GitHubData) {
  try {
    sessionStorage.setItem(cacheKey(username), JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    // Storage may be unavailable; live data still renders.
  }
}

async function fetchJson(url: string, signal: AbortSignal) {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Request failed: ${url}`);
  return response.json();
}

async function loadGitHubData(username: string, signal: AbortSignal): Promise<GitHubData> {
  const user = encodeURIComponent(username);
  const year = new Date().getFullYear();
  // The REST API is rate-limited for anonymous visitors; profile numbers are
  // optional, only the contribution calendar is required.
  const [profile, repos, calendar] = await Promise.all([
    fetchJson(`https://api.github.com/users/${user}`, signal).catch(() => null),
    fetchJson(`https://api.github.com/users/${user}/repos?per_page=100`, signal).catch(() => null),
    fetchJson(`https://github-contributions-api.jogruber.de/v4/${user}?y=${year - 1}&y=${year}`, signal),
  ]);

  if (!Array.isArray(calendar?.contributions)) throw new Error("Unexpected GitHub response");

  return {
    publicRepos: typeof profile?.public_repos === "number" ? profile.public_repos : undefined,
    stars: Array.isArray(repos)
      ? repos
          .filter((repo: { fork: boolean }) => !repo.fork)
          .reduce((total: number, repo: { stargazers_count: number }) => total + repo.stargazers_count, 0)
      : undefined,
    days: normalizeContributionDays(calendar.contributions, new Date().toISOString().slice(0, 10)),
  };
}

export default function GitHubWidget({ username }: { username: string }) {
  const [data, setData] = useState<GitHubData | null>(null);
  const [failed, setFailed] = useState(false);
  const [grid, setGrid] = useState({ weeks: 40, block: 12 });
  const hostRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(emptySubscribe, getClientHydratedSnapshot, getServerHydratedSnapshot);
  const { resolvedTheme } = useTheme();
  const profileUrl = `https://github.com/${username}`;

  // Show up to a year and stretch the cells so the calendar spans the full row.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const resize = () => {
      const width = host.clientWidth - 32; // weekday labels
      if (width <= 0) return;
      const weeks = Math.max(8, Math.min(52, Math.floor(width / (MIN_BLOCK + MARGIN)) - 1));
      const block = Math.min(MAX_BLOCK, Math.floor(width / (weeks + 1)) - MARGIN);
      setGrid({ weeks, block });
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const cached = readCache(username);
    (cached ? Promise.resolve(cached) : loadGitHubData(username, controller.signal))
      .then((fresh) => {
        if (!active) return;
        setData(fresh);
        if (!cached) writeCache(username, fresh);
      })
      .catch(() => active && setFailed(true))
      .finally(() => clearTimeout(timeout));

    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [username]);

  const days = data?.days ?? [];
  const calendarData = toCalendarActivities({ contributions: days }, grid.weeks);
  const number = (value?: number) => (
    <span className="serif text-[1.35em] font-medium text-foreground tabular-nums">
      {typeof value === "number" ? value.toLocaleString("en-US") : "—"}
    </span>
  );

  return (
    <div>
      <p className="max-w-[40rem] text-[17px] leading-[1.8] text-muted">
        {failed ? (
          <>
            GitHub numbers are unavailable right now —{" "}
            <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="link text-foreground">
              see the profile instead
            </a>
            .
          </>
        ) : (
          <>
            {number(data ? sumRecentContributions(days, 365) : undefined)} contributions in the last
            year, across {number(data?.publicRepos)} public repositories with {number(data?.stars)}{" "}
            stars. Current streak: {number(data ? calculateCurrentStreak(days) : undefined)} days.
          </>
        )}
      </p>

      <div ref={hostRef} className="mt-7 min-h-[120px] overflow-hidden">
        {mounted && calendarData.length > 0 && (
          <ActivityCalendar
            data={calendarData}
            blockMargin={MARGIN}
            blockRadius={2}
            blockSize={grid.block}
            colorScheme={resolvedTheme === "dark" ? "dark" : "light"}
            fontSize={12}
            showColorLegend={false}
            showTotalCount={false}
            showWeekdayLabels={["mon", "wed", "fri"]}
            theme={githubCalendarTheme}
            weekStart={1}
          />
        )}
      </div>

      <p className="mt-3 flex flex-wrap justify-between gap-2 text-[13px] text-faint">
        <span>Last {grid.weeks} weeks</span>
        <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="link">
          @{username}
        </a>
      </p>
    </div>
  );
}
