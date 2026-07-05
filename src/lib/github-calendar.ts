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
  light: ["#ece9dd", "#f6d7a8", "#eda659", "#d3722a", "#a04309"],
  dark: ["#201e1b", "#3d2410", "#6e3a12", "#a55317", "#da702c"],
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

  for (let index = days.length - 1; index >= 0; index -= 1) {
    if (days[index].count > 0) {
      streak += 1;
      continue;
    }

    if (streak > 0) {
      break;
    }
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

export function countActiveDays(
  days: GitHubContributionDay[],
  windowSize: number
): number {
  return days.slice(-windowSize).filter((day) => day.count > 0).length;
}
