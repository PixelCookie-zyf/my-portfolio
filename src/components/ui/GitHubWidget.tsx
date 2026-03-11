"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { FaGithub, FaStar, FaCodeFork, FaArrowUpRightFromSquare } from "react-icons/fa6";

interface GitHubWidgetProps {
  username: string;
}

interface RepoInfo {
  name: string;
  stars: number;
  forks: number;
  language: string | null;
}

interface Stats {
  publicRepos: number;
  followers: number;
  totalStars: number;
  topRepos: RepoInfo[];
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
  const [stats, setStats] = useState<Stats | null>(null);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = mounted ? resolvedTheme === "dark" : true;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    async function load() {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
        ]);
        if (!userRes.ok || !reposRes.ok) return;
        const user = await userRes.json();
        const repos: Array<{
          name: string;
          stargazers_count: number;
          forks_count: number;
          language: string | null;
          fork: boolean;
        }> = await reposRes.json();

        const ownRepos = repos.filter((r) => !r.fork);
        const totalStars = ownRepos.reduce((s, r) => s + r.stargazers_count, 0);
        const pinnedNames = ["my-portfolio", "HotRecForCTR"];
        const topRepos = pinnedNames
          .map((name) => ownRepos.find((r) => r.name === name))
          .filter(Boolean)
          .map((r) => ({
            name: r!.name,
            stars: r!.stargazers_count,
            forks: r!.forks_count,
            language: r!.language,
          }));

        setStats({
          publicRepos: user.public_repos ?? 0,
          followers: user.followers ?? 0,
          totalStars,
          topRepos,
        });
      } catch {
        // silently fail
      }
    }
    load();
  }, [username]);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative flex h-full flex-col overflow-hidden rounded-3xl border p-5 ${
        isDark
          ? "border-border bg-gradient-to-br from-[#0d1117] to-[#161b22] text-white"
          : "border-gray-200 bg-gradient-to-br from-white to-gray-50 text-gray-900"
      }`}
    >
      {/* Subtle gradient glow */}
      <div className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl ${isDark ? "bg-emerald-500/10" : "bg-emerald-500/5"}`} />
      <div className={`pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full blur-3xl ${isDark ? "bg-blue-500/8" : "bg-blue-500/5"}`} />

      {/* Header row */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <FaGithub className={`text-2xl ${isDark ? "text-white" : "text-gray-900"}`} />
          <div className="leading-tight">
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-semibold hover:text-emerald-500 transition-colors ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {username}
            </a>
          </div>
        </div>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${isDark ? "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-700"}`}
        >
          <FaArrowUpRightFromSquare className="text-[10px]" />
        </a>
      </div>

      {/* Stats row */}
      <div className="relative z-10 mt-4 flex gap-4">
        {[
          { value: stats?.publicRepos ?? "—", label: "repos" },
          { value: stats?.totalStars ?? "—", label: "stars" },
          { value: stats?.followers ?? "—", label: "followers" },
        ].map((s) => (
          <div key={s.label} className="flex items-baseline gap-1.5">
            <span className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{s.value}</span>
            <span className={`text-[11px] ${isDark ? "text-white/40" : "text-gray-400"}`}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Repos */}
      <div className="relative z-10 mt-4 flex flex-col gap-2">
        {stats?.topRepos.map((repo) => (
          <a
            key={repo.name}
            href={`https://github.com/${username}/${repo.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center justify-between rounded-xl border px-3.5 py-2.5 transition-all ${isDark ? "border-white/5 bg-white/[0.03] hover:border-emerald-500/30 hover:bg-emerald-500/[0.05]" : "border-gray-100 bg-gray-50 hover:border-emerald-500/30 hover:bg-emerald-50"}`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {repo.language && (
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: LANG_DOT[repo.language] ?? "#8b949e" }}
                />
              )}
              <span className={`text-[13px] font-medium group-hover:text-emerald-500 transition-colors truncate ${isDark ? "text-white/90" : "text-gray-800"}`}>
                {repo.name}
              </span>
            </div>
            <div className={`flex items-center gap-3 text-[11px] shrink-0 ml-2 ${isDark ? "text-white/30" : "text-gray-400"}`}>
              <span className="flex items-center gap-1">
                <FaStar className="text-[9px]" />
                {repo.stars}
              </span>
              <span className="flex items-center gap-1">
                <FaCodeFork className="text-[9px]" />
                {repo.forks}
              </span>
            </div>
          </a>
        ))}
      </div>

    </motion.div>
  );
}

export function GitHubActivityGraph({ username }: { username: string }) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = mounted ? resolvedTheme === "dark" : true;

  useEffect(() => setMounted(true), []);

  const graphUrl = isDark
    ? `https://github-readme-activity-graph.vercel.app/graph?username=${username}&bg_color=0d1117&color=9ca3af&line=4ade80&point=22c55e&area=true&area_color=4ade80&hide_border=true&custom_title=%20`
    : `https://github-readme-activity-graph.vercel.app/graph?username=${username}&bg_color=ffffff&color=6b7280&line=16a34a&point=15803d&area=true&area_color=bbf7d0&hide_border=true&custom_title=%20`;

  return (
    <div className={`overflow-hidden rounded-2xl border ${isDark ? "border-[#1e2530]" : "border-gray-200"}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={graphUrl}
        alt="GitHub activity graph"
        className="w-full h-auto block"
        loading="lazy"
      />
    </div>
  );
}
