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
    <span className="font-display text-[1.45em] font-medium text-ink tabular-nums">
      {typeof value === "number" ? value.toLocaleString("en-US") : "—"}
    </span>
  );

  return (
    <div className="paper-shadow rounded-[28px] border border-line bg-card p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-soft transition-colors hover:text-ink"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          @{username}
        </a>
        <span className="font-hand text-xl text-muted">last {grid.weeks} weeks</span>
      </div>

      <p className="mt-5 max-w-[42rem] text-[17px] leading-[1.8] text-soft">
        {failed ? (
          <>
            GitHub numbers are unavailable right now —{" "}
            <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="link text-ink">
              see the profile instead
            </a>
            .
          </>
        ) : (
          <>
            {number(data ? sumRecentContributions(days, 365) : undefined)} contributions this past
            year, across {number(data?.publicRepos)} public repos and {number(data?.stars)} stars.
            Current streak: {number(data ? calculateCurrentStreak(days) : undefined)} days.
          </>
        )}
      </p>

      <div ref={hostRef} className="mt-6 min-h-[120px] overflow-hidden">
        {mounted && calendarData.length > 0 && (
          <ActivityCalendar
            data={calendarData}
            blockMargin={MARGIN}
            blockRadius={3}
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
    </div>
  );
}
