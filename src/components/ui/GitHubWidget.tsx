"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  sumRecentContributions,
  toCalendarActivities,
  type GitHubContributionDay,
  type GitHubContributionResponse,
} from "@/lib/github-calendar";

interface GitHubWidgetProps {
  username: string;
}

interface RepoInfo {
  name: string;
  stars: number;
  forks: number;
  language: string | null;
  url: string;
}

interface Stats {
  avatarUrl: string | null;
  displayName: string;
  bio: string;
  publicRepos: number;
  followers: number;
  totalStars: number;
  lastYearContributions: number;
  currentStreak: number;
  recentWeekContributions: number;
  activeDays: number;
  topRepos: RepoInfo[];
  contributions: GitHubContributionDay[];
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
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = mounted ? resolvedTheme === "dark" : true;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setAvatarFailed(false);
  }, [stats?.avatarUrl]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const [userRes, reposRes, contributionsRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
          fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`),
        ]);

        if (!userRes.ok || !reposRes.ok || !contributionsRes.ok) {
          return;
        }

        const user = await userRes.json();
        const repos: Array<{
          name: string;
          stargazers_count: number;
          forks_count: number;
          language: string | null;
          fork: boolean;
          html_url: string;
          updated_at: string;
        }> = await reposRes.json();
        const contributions: GitHubContributionResponse = await contributionsRes.json();

        const ownRepos = repos.filter((repo) => !repo.fork);
        const totalStars = ownRepos.reduce(
          (sum, repo) => sum + repo.stargazers_count,
          0
        );
        const topRepos = [...ownRepos]
          .sort(
            (left, right) =>
              right.stargazers_count - left.stargazers_count ||
              right.updated_at.localeCompare(left.updated_at)
          )
          .slice(0, 2)
          .map((repo) => ({
            name: repo.name,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            url: repo.html_url,
          }));
        const contributionDays = contributions.contributions ?? [];

        setStats({
          avatarUrl: user.avatar_url ?? null,
          displayName: user.name ?? username,
          bio: user.bio ?? "Building, shipping, and learning in public.",
          publicRepos: user.public_repos ?? 0,
          followers: user.followers ?? 0,
          totalStars,
          lastYearContributions: contributions.total?.lastYear ?? 0,
          currentStreak: calculateCurrentStreak(contributionDays),
          recentWeekContributions: sumRecentContributions(contributionDays, 7),
          activeDays: countActiveDays(contributionDays, 42),
          topRepos,
          contributions: contributionDays,
        });
      } catch {
        // Silently fall back to placeholders.
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [username]);

  const calendarData = stats
    ? toCalendarActivities({ contributions: stats.contributions }, 26)
    : [];
  const showCalendar = mounted && !loading && calendarData.length > 0;
  const statItems = [
    { value: stats?.lastYearContributions ?? "—", label: "last year" },
    { value: stats?.publicRepos ?? "—", label: "repos" },
    { value: stats?.totalStars ?? "—", label: "stars" },
    { value: stats?.currentStreak ?? "—", label: "day streak" },
  ];
  const legendSwatches =
    (isDark ? githubCalendarTheme.dark : githubCalendarTheme.light) ??
    githubCalendarTheme.light ??
    [];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative flex h-full min-h-[30rem] flex-col overflow-hidden rounded-[2rem] border p-5 md:p-6 ${
        isDark
          ? "border-[#30363d] bg-gradient-to-br from-[#0d1117] via-[#111827] to-[#0f172a] text-white"
          : "border-[#d0d7de] bg-gradient-to-br from-[#f6f8fa] via-white to-[#eef2ff] text-[#0f172a]"
      }`}
    >
      <div
        className={`pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full blur-3xl ${
          isDark ? "bg-emerald-500/12" : "bg-emerald-400/15"
        }`}
      />
      <div
        className={`pointer-events-none absolute -bottom-8 left-0 h-32 w-32 rounded-full blur-3xl ${
          isDark ? "bg-sky-500/10" : "bg-sky-300/20"
        }`}
      />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
              isDark
                ? "border-white/10 bg-white/[0.06]"
                : "border-slate-200 bg-white/80"
            }`}
          >
            {stats?.avatarUrl && !avatarFailed ? (
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
              <FaGithub className={`text-2xl ${isDark ? "text-white" : "text-slate-900"}`} />
            )}
          </div>

          <div className="min-w-0">
            <p
              className={`text-xs uppercase tracking-[0.24em] ${
                isDark ? "text-white/45" : "text-slate-500"
              }`}
            >
              open source
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-2">
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`block text-lg font-semibold transition-colors hover:text-emerald-500 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {stats?.displayName ?? username}
              </a>
              <span
                className={`text-sm ${
                  isDark ? "text-white/40" : "text-slate-500"
                }`}
              >
                @{username}
              </span>
            </div>
            <p
              className={`mt-2 max-w-xl text-sm leading-6 ${
                isDark ? "text-white/62" : "text-slate-600"
              }`}
            >
              {stats?.bio ?? "Building, shipping, and learning in public."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <div
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] ${
                  isDark ? "bg-white/[0.06] text-white/60" : "bg-slate-900/5 text-slate-600"
                }`}
              >
                <FaUserGroup className="text-[10px]" />
                {stats?.followers ?? "—"} followers
              </div>
              <div
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] ${
                  isDark ? "bg-emerald-500/10 text-emerald-300" : "bg-emerald-50 text-emerald-700"
                }`}
              >
                <FaFireFlameCurved className="text-[10px]" />
                {stats?.recentWeekContributions ?? "—"} this week
              </div>
            </div>
          </div>
        </div>

        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
            isDark
              ? "bg-white/[0.06] text-white/45 hover:bg-white/[0.12] hover:text-white"
              : "bg-slate-900/5 text-slate-500 hover:bg-slate-900/10 hover:text-slate-900"
          }`}
        >
          <FaArrowUpRightFromSquare className="text-xs" />
        </a>
      </div>

      <div className="relative z-10 mt-5 grid grid-cols-2 gap-3">
        {statItems.map((item) => (
          <div
            key={item.label}
            className={`rounded-2xl border p-3 ${
              isDark
                ? "border-white/8 bg-white/[0.04]"
                : "border-slate-200 bg-white/70"
            }`}
          >
            <p className={`text-xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
              {item.value}
            </p>
            <p
              className={`mt-1 text-[11px] uppercase tracking-[0.18em] ${
                isDark ? "text-white/45" : "text-slate-500"
              }`}
            >
              {item.label}
            </p>
          </div>
        ))}
      </div>

      <div
        className={`relative z-10 mt-5 rounded-[1.5rem] border p-4 ${
          isDark ? "border-white/8 bg-black/15" : "border-slate-200 bg-white/80"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
              Contribution graph
            </p>
            <p className={`mt-1 text-xs ${isDark ? "text-white/50" : "text-slate-500"}`}>
              Last 26 weeks of activity
            </p>
          </div>
          <div className="text-right">
            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] ${
                isDark ? "bg-white/[0.06] text-emerald-300" : "bg-emerald-50 text-emerald-700"
              }`}
            >
              <FaFireFlameCurved className="text-[10px]" />
              {stats?.currentStreak ?? "—"} day streak
            </div>
            <p className={`mt-2 text-[11px] ${isDark ? "text-white/42" : "text-slate-500"}`}>
              {stats?.activeDays ?? "—"} active days in the last 6 weeks
            </p>
          </div>
        </div>

        <div
          className={`mt-4 overflow-hidden rounded-[1.25rem] border p-3 ${
            isDark ? "border-white/6 bg-white/[0.03]" : "border-slate-200 bg-slate-50/80"
          }`}
        >
          <div className="overflow-x-auto pb-2">
            <div className="min-w-[34rem]">
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
                  className={`grid min-h-[136px] grid-cols-[auto_1fr] gap-3 ${
                    isDark ? "text-white/18" : "text-slate-300"
                  }`}
                >
                  <div className="grid gap-[6px] pt-7">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <span key={index} className="text-[10px] uppercase tracking-[0.18em]">
                        {["Mon", "Wed", "Fri"][index]}
                      </span>
                    ))}
                  </div>
                  <div className="grid gap-[4px]">
                    <div className="mb-[6px] grid grid-cols-6 gap-[12px] text-[10px] uppercase tracking-[0.18em]">
                      {["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"].map((month) => (
                        <span key={month}>{month}</span>
                      ))}
                    </div>
                    <div className="grid grid-cols-[repeat(26,minmax(0,11px))] gap-[4px]">
                      {Array.from({ length: 26 * 7 }).map((_, index) => (
                        <span
                          key={index}
                          className={`h-[11px] w-[11px] rounded-[4px] ${
                            isDark ? "bg-white/[0.05]" : "bg-slate-200/90"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className={`flex items-center gap-2 text-[11px] ${isDark ? "text-white/45" : "text-slate-500"}`}>
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
          <p className={`text-[11px] ${isDark ? "text-white/45" : "text-slate-500"}`}>
            Public contribution data mirrored from GitHub
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-5">
        <div className="mb-3 flex items-center justify-between">
          <p className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
            Pinned work
          </p>
          <p className={`text-[11px] uppercase tracking-[0.18em] ${isDark ? "text-white/40" : "text-slate-500"}`}>
            top repositories
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
        {stats?.topRepos.map((repo) => (
          <a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group rounded-2xl border px-4 py-3 transition-all ${
              isDark
                ? "border-white/8 bg-white/[0.04] hover:border-emerald-500/30 hover:bg-emerald-500/[0.06]"
                : "border-slate-200 bg-white/70 hover:border-emerald-300 hover:bg-emerald-50/80"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className={`text-[11px] uppercase tracking-[0.18em] ${isDark ? "text-white/35" : "text-slate-500"}`}>
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
                    className={`block truncate text-sm font-medium transition-colors group-hover:text-emerald-500 ${
                      isDark ? "text-white/90" : "text-slate-800"
                    }`}
                  >
                    {repo.name}
                  </span>
                </div>
                <p className={`mt-2 text-xs leading-5 ${isDark ? "text-white/45" : "text-slate-500"}`}>
                  {repo.language
                    ? `${repo.language} project with active iteration and public source.`
                    : "Public project with visible source and ongoing updates."}
                </p>
              </div>
              <FaArrowUpRightFromSquare
                className={`shrink-0 text-[10px] ${isDark ? "text-white/30" : "text-slate-400"}`}
              />
            </div>
            <div
              className={`mt-3 flex items-center gap-4 text-xs ${
                isDark ? "text-white/45" : "text-slate-500"
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
    </motion.div>
  );
}
