export interface GitHubStats {
  publicRepos: number;
  followers: number;
  totalStars: number;
}

export interface GitHubRepo {
  name: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  fork: boolean;
  html_url: string;
  updated_at: string;
}

export interface FeaturedGitHubRepo {
  name: string;
  stars: number;
  forks: number;
  language: string | null;
  url: string;
}

const FEATURED_REPO_NAMES = ["HotRecForCTR", "my-portfolio"] as const;

export function selectFeaturedRepos(
  repos: GitHubRepo[],
  limit = 2
): FeaturedGitHubRepo[] {
  const ownRepos = repos.filter((repo) => !repo.fork);
  const byName = new Map(ownRepos.map((repo) => [repo.name, repo]));

  const prioritizedRepos = FEATURED_REPO_NAMES.map((name) => byName.get(name)).filter(
    (repo): repo is GitHubRepo => Boolean(repo)
  );
  const fallbackRepos = ownRepos
    .filter((repo) => !FEATURED_REPO_NAMES.includes(repo.name as (typeof FEATURED_REPO_NAMES)[number]))
    .sort(
      (left, right) =>
        right.stargazers_count - left.stargazers_count ||
        right.updated_at.localeCompare(left.updated_at)
    );

  return [...prioritizedRepos, ...fallbackRepos]
    .slice(0, limit)
    .map((repo) => ({
      name: repo.name,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      url: repo.html_url,
    }));
}

export async function fetchGitHubStats(username: string): Promise<GitHubStats> {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers: { Accept: "application/vnd.github+json" },
      }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
        headers: { Accept: "application/vnd.github+json" },
      }),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      throw new Error("GitHub API request failed");
    }

    const user = await userRes.json();
    const repos = await reposRes.json();

    const totalStars = Array.isArray(repos)
      ? repos.reduce(
          (sum: number, repo: { stargazers_count?: number }) =>
            sum + (repo.stargazers_count ?? 0),
          0
        )
      : 0;

    return {
      publicRepos: user.public_repos ?? 0,
      followers: user.followers ?? 0,
      totalStars,
    };
  } catch {
    return { publicRepos: 0, followers: 0, totalStars: 0 };
  }
}
