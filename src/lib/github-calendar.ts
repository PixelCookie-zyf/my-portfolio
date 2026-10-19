import type { Activity, ThemeInput } from "react-activity-calendar";

export interface GitHubContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface GitHubContributionResponse {
  total?: Record<string, number>;
  contributions?: GitHubContributionDay[];
}

/**
 * The calendar-year API returns days out of order and includes future dates
 * (zero-filled to Dec 31) — drop anything after `todayIso` and sort ascending
 * so trailing-window helpers see a continuous day series ending today.
 */
export function normalizeContributionDays(
  days: GitHubContributionDay[],
  todayIso: string
): GitHubContributionDay[] {
  return days
    .filter((day) => day.date <= todayIso)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export const githubCalendarTheme: ThemeInput = {
  light: ["#e9e3d5", "#c6dccb", "#8ec0a1", "#4f9573", "#2e6a4f"],
  dark: ["#2a2723", "#24392e", "#305b45", "#448760", "#63b38d"],
};

export function toCalendarActivities(
  response: GitHubContributionResponse,
  weeks = 26
): Activity[] {
  const contributionDays = response.contributions ?? [];
  const recentDays = contributionDays.slice(-weeks * 7);

  return recentDays.map((day) => ({
    date: day.date,
    count: day.count,
    level: Math.max(0, Math.min(day.level, 4)),
  }));
}

export function calculateCurrentStreak(days: GitHubContributionDay[]): number {
  let streak = 0;
  let index = days.length - 1;

  // Normalized days are consecutive and end today. Allow today to remain
  // empty while it is in progress, but yesterday must keep the streak alive.
  if (index >= 0 && days[index].count === 0) index -= 1;

  for (; index >= 0 && days[index].count > 0; index -= 1) {
    streak += 1;
  }

  return streak;
}

export function sumRecentContributions(
  days: GitHubContributionDay[],
  windowSize: number
): number {
  return days
    .slice(-windowSize)
    .reduce((total, day) => total + day.count, 0);
}
