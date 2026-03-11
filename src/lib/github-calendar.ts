import type { Activity, ThemeInput } from "react-activity-calendar";

export interface GitHubContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface GitHubContributionResponse {
  total?: {
    lastYear?: number;
  };
  contributions?: GitHubContributionDay[];
}

export const githubCalendarTheme: ThemeInput = {
  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
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
