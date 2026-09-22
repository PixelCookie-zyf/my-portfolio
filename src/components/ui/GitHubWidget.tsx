"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type Dispatch, type SetStateAction } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { ActivityCalendar } from "react-activity-calendar";
import {
  FaArrowUpRightFromSquare,
  FaCodeFork,
  FaFireFlameCurved,
  FaGithub,
  FaStar,
  FaUserGroup,
} from "react-icons/fa6";
import {
  countActiveDays,
  calculateCurrentStreak,
  githubCalendarTheme,
  normalizeContributionDays,
  sumRecentContributions,
  toCalendarActivities,
  type GitHubContributionDay,
} from "@/lib/github-calendar";
import {
  fetchPinnedRepos,
  selectFeaturedRepos,
  type GitHubRepo,
  type FeaturedGitHubRepo,
} from "@/lib/github";
import {
  emptySubscribe,
  getClientHydratedSnapshot,
  getServerHydratedSnapshot,
} from "@/lib/hydration";

interface GitHubWidgetProps {
  username: string;
}

interface GitHubProfile {
  avatar_url?: string | null;
  name?: string | null;
  bio?: string | null;
  public_repos: number;
  followers: number;
}

type ResourceStatus = "loading" | "ready" | "error";
interface ResourceState<T> {
  data: T | null;
  status: ResourceStatus;
}

interface CachedResource<T> {
  version: number;
  username: string;
  savedAt: number;
  data: T;
}

const CACHE_VERSION = 1;
const CACHE_TTL = 5 * 60 * 1000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCount(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isOptionalText(value: unknown): value is string | null | undefined {
  return value == null || typeof value === "string";
}

function isProfile(value: unknown): value is GitHubProfile {
  return isRecord(value) && isCount(value.public_repos) && isCount(value.followers) &&
    isOptionalText(value.avatar_url) && isOptionalText(value.name) && isOptionalText(value.bio);
}

function isRepositories(value: unknown): value is GitHubRepo[] {
  return Array.isArray(value) && value.every((repo) =>
    isRecord(repo) && typeof repo.name === "string" &&
    typeof repo.html_url === "string" && typeof repo.updated_at === "string" &&
    typeof repo.fork === "boolean" && isCount(repo.stargazers_count) &&
    isCount(repo.forks_count) && isOptionalText(repo.description) && isOptionalText(repo.language)
  );
}

function isContributionDays(value: unknown): value is GitHubContributionDay[] {
  return Array.isArray(value) && value.length > 0 && value.every((day) =>
    isRecord(day) && typeof day.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(day.date) &&
    isCount(day.count) && isCount(day.level)
  );
}

function isPinnedRepos(value: unknown): value is FeaturedGitHubRepo[] {
  return Array.isArray(value) && value.length > 0 && value.every((repo) =>
    isRecord(repo) && typeof repo.name === "string" && typeof repo.url === "string" &&
    isCount(repo.stars) && isCount(repo.forks) &&
    isOptionalText(repo.description) && isOptionalText(repo.language)
  );
}

function cacheKey(username: string, resource: string) {
  return `portfolio.github.v${CACHE_VERSION}.${username.toLowerCase()}.${resource}`;
}

function readCache<T>(
  username: string,
  resource: string,
  validate: (value: unknown) => value is T
): CachedResource<T> | null {
  try {
    const raw = sessionStorage.getItem(cacheKey(username, resource));
    if (!raw) return null;
    const cached: unknown = JSON.parse(raw);
    if (
      !isRecord(cached) || cached.version !== CACHE_VERSION || cached.username !== username ||
      typeof cached.savedAt !== "number" || !Number.isFinite(cached.savedAt) ||
      cached.savedAt > Date.now() || !validate(cached.data)
    ) return null;
    return cached as unknown as CachedResource<T>;
  } catch {
    return null;
  }
}

function writeCache<T>(username: string, resource: string, data: T) {
  try {
    const cached: CachedResource<T> = { version: CACHE_VERSION, username, savedAt: Date.now(), data };
    sessionStorage.setItem(cacheKey(username, resource), JSON.stringify(cached));
  } catch {
    // Storage may be unavailable or full; live data still works independently.
  }
}

async function fetchJson(url: string, signal: AbortSignal): Promise<unknown> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error("GitHub request failed");
  return response.json();
}

// Each resource gets its own deadline. Race the full operation (including body
// parsing) so a stalled endpoint cannot keep this section in a loading state.
async function withDeadline<T>(
  request: (signal: AbortSignal) => Promise<T>,
  lifecycleSignal: AbortSignal,
  timeoutMs = 10000
): Promise<T> {
  const controller = new AbortController();
  const abort = () => controller.abort();
  const interrupted = new Promise<never>((_, reject) => {
    controller.signal.addEventListener("abort", () => {
      reject(new DOMException("GitHub request timed out or was cancelled", "AbortError"));
    }, { once: true });
  });
  const timeout = setTimeout(abort, timeoutMs);
  lifecycleSignal.addEventListener("abort", abort, { once: true });
  if (lifecycleSignal.aborted) abort();

  try {
    return await Promise.race([request(controller.signal), interrupted]);
  } finally {
    clearTimeout(timeout);
    lifecycleSignal.removeEventListener("abort", abort);
  }
}

const LANG_DOT: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#3178C6",
  JavaScript: "#F1E05A",
  GDScript: "#355570",
  Rust: "#DEA584",
  Go: "#00ADD8",
};

export default function GitHubWidget({ username }: GitHubWidgetProps) {
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [profile, setProfile] = useState<ResourceState<GitHubProfile>>({ data: null, status: "loading" });
  const [repositories, setRepositories] = useState<ResourceState<GitHubRepo[]>>({ data: null, status: "loading" });
  const [contributions, setContributions] = useState<ResourceState<GitHubContributionDay[]>>({ data: null, status: "loading" });
  const [pins, setPins] = useState<ResourceState<FeaturedGitHubRepo[]>>({ data: null, status: "loading" });
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getClientHydratedSnapshot,
    getServerHydratedSnapshot
  );
  const { resolvedTheme } = useTheme();
  const isDark = mounted ? resolvedTheme === "dark" : true;
  const reduceMotion = useReducedMotion();
  const profileUrl = `https://github.com/${username}`;
  const calendarHostRef = useRef<HTMLDivElement>(null);
  const [weeks, setWeeks] = useState(26);

  useEffect(() => {
    const host = calendarHostRef.current;
    if (!host) return;

    const resize = () => {
      // Reserve the weekday gutter and a possible partial calendar week.
      const availableWidth = host.clientWidth - 40;
      if (availableWidth <= 0) return;
      setWeeks(Math.max(8, Math.min(52, Math.floor(availableWidth / 15) - 1)));
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const lifecycle = new AbortController();
    let active = true;
    setAvatarFailed(false);

    async function loadResource<T>(
      resource: string,
      request: (signal: AbortSignal) => Promise<unknown>,
      validate: (value: unknown) => value is T,
      setResource: Dispatch<SetStateAction<ResourceState<T>>>,
      timeoutMs = 10000
    ) {
      const cached = readCache(username, resource, validate);
      const fresh = cached !== null && Date.now() - cached.savedAt < CACHE_TTL;
      setResource({ data: cached?.data ?? null, status: fresh ? "ready" : "loading" });
      if (fresh) return;

      try {
        const data = await withDeadline(request, lifecycle.signal, timeoutMs);
        if (!validate(data)) throw new Error("GitHub response is incomplete");
        if (!active) return;
        setResource({ data, status: "ready" });
        writeCache(username, resource, data);
      } catch {
        // Keep real cached data visible if its refresh fails. Other resources
        // continue loading and rendering without depending on this request.
        if (active) setResource((previous) => ({ ...previous, status: "error" }));
      }
    }

    const encodedUsername = encodeURIComponent(username);
    const currentYear = new Date().getFullYear();
    void loadResource(
      "profile",
      (signal) => fetchJson(`https://api.github.com/users/${encodedUsername}`, signal),
      isProfile,
      setProfile
    );
    void loadResource(
      "repositories",
      (signal) => fetchJson(`https://api.github.com/users/${encodedUsername}/repos?per_page=100&sort=updated`, signal),
      isRepositories,
      setRepositories
    );
    void loadResource(
      "contributions",
      async (signal) => {
        const response = await fetchJson(
          `https://github-contributions-api.jogruber.de/v4/${encodedUsername}?y=${currentYear - 1}&y=${currentYear}`,
          signal
        );
        if (!isRecord(response) || !isContributionDays(response.contributions)) {
          throw new Error("GitHub contributions are unavailable");
        }
        return normalizeContributionDays(response.contributions, new Date().toISOString().slice(0, 10));
      },
      isContributionDays,
      setContributions
    );
    // Pins are optional and never delay the REST repository fallback. The
    // helper owns its fetch abort; our outer deadline also bounds body parsing.
    void loadResource("pins", () => fetchPinnedRepos(username, 2), isPinnedRepos, setPins, 6500);

    return () => {
      active = false;
      lifecycle.abort();
    };
  }, [username]);

  const days = contributions.data;
  const hasPinnedRepos = Boolean(pins.data?.length);
  const topRepos = hasPinnedRepos ? pins.data! : repositories.data ? selectFeaturedRepos(repositories.data, 2) : [];
  const repoStatus: ResourceStatus = repositories.data || hasPinnedRepos
    ? "ready"
    : repositories.status === "loading" || pins.status === "loading" ? "loading" : "error";
  const stats = {
    avatarUrl: profile.data?.avatar_url,
    displayName: profile.data?.name || username,
    bio: profile.data?.bio,
    publicRepos: profile.data?.public_repos,
    followers: profile.data?.followers,
    totalStars: repositories.data?.filter((repo) => !repo.fork)
      .reduce((total, repo) => total + repo.stargazers_count, 0),
    lastYearContributions: days ? sumRecentContributions(days, 365) : undefined,
    currentStreak: days ? calculateCurrentStreak(days) : undefined,
    recentWeekContributions: days ? sumRecentContributions(days, 7) : undefined,
    activeDays: days ? countActiveDays(days, 42) : undefined,
    topRepos,
    hasPinnedRepos,
  };
  const calendarData = days ? toCalendarActivities({ contributions: days }, weeks) : [];
  const showCalendar = mounted && calendarData.length > 0;
  const statItems = [
    { value: stats.lastYearContributions ?? "—", label: "last year" },
    { value: stats.publicRepos ?? "—", label: "repos" },
    { value: stats.totalStars ?? "—", label: "stars" },
    { value: stats.currentStreak ?? "—", label: "day streak" },
  ];
  const legendSwatches =
    (isDark ? githubCalendarTheme.dark : githubCalendarTheme.light) ??
    githubCalendarTheme.light ??
    [];

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative flex h-full min-w-0 flex-col overflow-hidden rounded-[2rem] border p-5 md:p-6 ${
        isDark
          ? "border-[#2e2a26] bg-gradient-to-br from-[#191512] via-[#141110] to-[#100f0f] text-white"
          : "border-[#dad5c8] bg-gradient-to-br from-[#f7f3e6] via-[#fffcf0] to-[#f2ecdb] text-[#100f0f]"
      }`}
    >
      <div
        className={`pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full blur-3xl ${
          isDark ? "bg-orange-500/12" : "bg-orange-400/15"
        }`}
      />
      <div
        className={`pointer-events-none absolute -bottom-8 left-0 h-32 w-32 rounded-full blur-3xl ${
          isDark ? "bg-amber-500/10" : "bg-amber-300/20"
        }`}
      />

      <div className="relative z-10 flex items-start justify-between gap-3 sm:gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${
              isDark
                ? "border-white/10 bg-white/[0.06]"
                : "border-stone-200 bg-white/80"
            }`}
          >
            {stats.avatarUrl && !avatarFailed ? (
              <Image
                src={stats.avatarUrl}
                alt={`${username} avatar`}
                width={48}
                height={48}
                className="h-full w-full rounded-2xl object-cover"
                onError={() => setAvatarFailed(true)}
                unoptimized
              />
            ) : (
              <FaGithub className={`text-2xl ${isDark ? "text-white" : "text-stone-900"}`} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p
              className={`text-xs uppercase tracking-[0.24em] ${
                isDark ? "text-white/45" : "text-stone-500"
              }`}
            >
              open source
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-2">
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`block min-w-0 max-w-full [overflow-wrap:anywhere] text-lg font-semibold transition-colors hover:text-accent ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                {stats.displayName}
              </a>
              <span
                className={`min-w-0 max-w-full text-sm [overflow-wrap:anywhere] ${
                  isDark ? "text-white/40" : "text-stone-500"
                }`}
              >
                @{username}
              </span>
              {profile.status === "error" && !profile.data && (
                <span className={`text-xs ${isDark ? "text-white/45" : "text-stone-500"}`}>
                  Profile details are temporarily unavailable.
                </span>
              )}
              {stats.bio && (
                <span
                  className={`break-words text-sm ${
                    isDark ? "text-white/62" : "text-stone-600"
                  }`}
                >
                  · {stats.bio}
                </span>
              )}
              <div
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] sm:ml-auto ${
                  isDark ? "bg-white/[0.06] text-white/60" : "bg-stone-900/5 text-stone-600"
                }`}
              >
                <FaUserGroup className="text-[10px]" />
                {stats.followers ?? "—"} followers
              </div>
              <div
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] ${
                  isDark ? "bg-orange-500/10 text-orange-300" : "bg-orange-500/10 text-orange-800"
                }`}
              >
                <FaFireFlameCurved className="text-[10px]" />
                {stats.recentWeekContributions ?? "—"} this week
              </div>
            </div>
          </div>
        </div>

        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${username} on GitHub`}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
            isDark
              ? "bg-white/[0.06] text-white/45 hover:bg-white/[0.12] hover:text-white"
              : "bg-stone-900/5 text-stone-500 hover:bg-stone-900/10 hover:text-stone-900"
          }`}
        >
          <FaArrowUpRightFromSquare className="text-xs" />
        </a>
      </div>

      <div className="relative z-10 mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {statItems.map((item) => (
          <div
            key={item.label}
            className={`rounded-2xl border p-3 ${
              isDark
                ? "border-white/8 bg-white/[0.04]"
                : "border-stone-200 bg-white/70"
            }`}
          >
            <p className={`text-xl font-semibold ${isDark ? "text-white" : "text-stone-900"}`}>
              {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
            </p>
            <p
              className={`mt-1 text-[11px] uppercase tracking-[0.18em] ${
                isDark ? "text-white/45" : "text-stone-500"
              }`}
            >
              {item.label}
            </p>
          </div>
        ))}
      </div>

      <div className="relative z-10 mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <div
        className={`min-w-0 rounded-[1.5rem] border p-4 ${
          isDark ? "border-white/8 bg-black/15" : "border-stone-200 bg-white/80"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className={`text-sm font-medium ${isDark ? "text-white" : "text-stone-900"}`}>
              Contribution graph
            </p>
            <p className={`mt-1 text-xs ${isDark ? "text-white/50" : "text-stone-500"}`}>
              Last {weeks} weeks of activity
            </p>
          </div>
          <div className="text-right">
            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] ${
                isDark ? "bg-white/[0.06] text-orange-300" : "bg-orange-500/10 text-orange-800"
              }`}
            >
              <FaFireFlameCurved className="text-[10px]" />
              {stats.currentStreak ?? "—"} day streak
            </div>
            <p className={`mt-2 text-[11px] ${isDark ? "text-white/42" : "text-stone-500"}`}>
              {stats.activeDays ?? "—"} active days in the last 6 weeks
            </p>
          </div>
        </div>

        <div
          className={`mt-4 overflow-hidden rounded-[1.25rem] border p-3 ${
            isDark ? "border-white/6 bg-white/[0.03]" : "border-stone-200 bg-stone-50/80"
          }`}
        >
          <div ref={calendarHostRef} className="scrollbar-hidden overflow-x-auto pb-2">
            <div>
              {showCalendar ? (
                <ActivityCalendar
                  data={calendarData}
                  blockMargin={4}
                  blockRadius={4}
                  blockSize={11}
                  colorScheme={isDark ? "dark" : "light"}
                  fontSize={12}
                  showColorLegend={false}
                  showTotalCount={false}
                  showWeekdayLabels={["mon", "wed", "fri"]}
                  theme={githubCalendarTheme}
                  weekStart={1}
                />
              ) : (
                <div
                  className={`flex min-h-[136px] flex-col items-start justify-center gap-2 text-sm ${
                    isDark ? "text-white/50" : "text-stone-500"
                  }`}
                  role="status"
                >
                  {contributions.status === "error" ? (
                    <>
                      <p>Activity is temporarily unavailable.</p>
                      <a
                        href={profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs underline decoration-current/40 underline-offset-4 transition-colors hover:text-accent"
                      >
                        View activity on GitHub
                      </a>
                    </>
                  ) : (
                    <p>Loading GitHub activity…</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className={`flex items-center gap-2 text-[11px] ${isDark ? "text-white/45" : "text-stone-500"}`}>
            <span>Less</span>
            <div className="flex items-center gap-1">
              {legendSwatches.map((color) => (
                <span
                  key={color}
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span>More</span>
          </div>
          <p className={`text-[11px] ${isDark ? "text-white/45" : "text-stone-500"}`}>
            Public contribution data mirrored from GitHub
          </p>
        </div>
      </div>

      <div className="flex h-full min-w-0 flex-col">
        <div className="mb-3 flex items-center justify-between">
          <p className={`text-sm font-medium ${isDark ? "text-white" : "text-stone-900"}`}>
            {stats.hasPinnedRepos ? "Pinned work" : "Selected work"}
          </p>
          <p className={`text-[11px] uppercase tracking-[0.18em] ${isDark ? "text-white/40" : "text-stone-500"}`}>
            top repositories
          </p>
        </div>
        <div className="grid flex-1 gap-2 sm:grid-cols-2 lg:auto-rows-fr lg:grid-cols-1">
        {!stats.topRepos.length && (
          <div className={`flex min-h-32 items-center rounded-2xl border px-4 py-3 text-xs ${
            isDark ? "border-white/8 bg-white/[0.04] text-white/45" : "border-stone-200 bg-white/70 text-stone-500"
          }`}>
            {repoStatus === "loading" ? "Loading repositories…" : repoStatus === "error" ? "Repositories are temporarily unavailable." : "No public repositories yet."}
          </div>
        )}
        {stats.topRepos.map((repo) => (
          <a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex min-w-0 flex-col justify-between rounded-2xl border px-4 py-3 transition-all ${
              isDark
                ? "border-white/8 bg-white/[0.04] hover:border-orange-500/30 hover:bg-orange-500/[0.06]"
                : "border-stone-200 bg-white/70 hover:border-orange-300 hover:bg-orange-100/50"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className={`text-[11px] uppercase tracking-[0.18em] ${isDark ? "text-white/35" : "text-stone-500"}`}>
                  repository
                </p>
                <div className="mt-2 flex items-center gap-2">
                  {repo.language && (
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: LANG_DOT[repo.language] ?? "#8b949e" }}
                    />
                  )}
                  <span
                    className={`block truncate text-sm font-medium transition-colors group-hover:text-accent ${
                      isDark ? "text-white/90" : "text-stone-800"
                    }`}
                  >
                    {repo.name}
                  </span>
                </div>
                {repo.description && (
                  <p className={`mt-2 line-clamp-2 break-words text-xs leading-5 ${isDark ? "text-white/45" : "text-stone-500"}`}>
                    {repo.description}
                  </p>
                )}
              </div>
              <FaArrowUpRightFromSquare
                className={`shrink-0 text-[10px] ${isDark ? "text-white/30" : "text-stone-400"}`}
              />
            </div>
            <div
              className={`mt-3 flex items-center gap-4 text-xs ${
                isDark ? "text-white/45" : "text-stone-500"
              }`}
            >
              <span className="flex items-center gap-1">
                <FaStar className="text-[10px]" />
                {repo.stars}
              </span>
              <span className="flex items-center gap-1">
                <FaCodeFork className="text-[10px]" />
                {repo.forks}
              </span>
            </div>
          </a>
        ))}
        </div>
      </div>
      </div>
    </motion.div>
  );
}
