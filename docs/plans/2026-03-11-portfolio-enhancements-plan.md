# Portfolio Enhancements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Contact section, redesign Skills as iOS widgets with GitHub activity, and build a full MDX blog system.

**Architecture:** Three independent features layered onto the existing Next.js App Router portfolio. Contact is a new section component. Skills is a rewrite of the existing section with a mixed grid of skill widgets and a GitHub stats widget. Blog uses `next-mdx-remote` + `gray-matter` for MDX content with static generation.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion, next-mdx-remote, gray-matter

---

## Task 1: Add Contact Section

**Files:**
- Modify: `src/data/personal.ts`
- Create: `src/components/sections/Contact.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Add email and Contact nav link to personal data**

Modify `src/data/personal.ts`:

```ts
// Add email field to personalInfo
export const personalInfo = {
  name: "PixelCookie",
  email: "metazyf@gmail.com",  // ADD THIS
  city: "Shanghai, China",
  // ... rest unchanged
} as const;

// Add Blog and Contact to navLinks
export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Travel", href: "#travel" },
  { label: "Blog", href: "#blog" },       // ADD
  { label: "Contact", href: "#contact" },  // ADD
] as const;
```

**Step 2: Create Contact section component**

Create `src/components/sections/Contact.tsx`:

```tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaRegCopy, FaCheck, FaEnvelope } from "react-icons/fa6";
import SectionTitle from "@/components/ui/SectionTitle";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { personalInfo } from "@/data/personal";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-24 px-6">
      <div className="mx-auto max-w-3xl text-center">
        <SectionTitle title="Contact" subtitle="Get in touch" />

        <ScrollReveal>
          <div className="flex flex-col items-center gap-6">
            {/* Email card */}
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card-bg/60 backdrop-blur-sm px-6 py-4">
              <FaEnvelope className="text-accent text-lg" />
              <a
                href={`mailto:${personalInfo.email}`}
                className="text-foreground font-mono text-sm sm:text-base hover:text-accent transition-colors"
              >
                {personalInfo.email}
              </a>
              <motion.button
                onClick={handleCopy}
                className="ml-2 flex h-8 w-8 items-center justify-center rounded-lg bg-card-bg hover:bg-accent/10 text-muted hover:text-accent transition-colors"
                whileTap={{ scale: 0.9 }}
                aria-label="Copy email"
              >
                {copied ? (
                  <FaCheck className="text-emerald-500 text-sm" />
                ) : (
                  <FaRegCopy className="text-sm" />
                )}
              </motion.button>
            </div>

            {/* Social icons */}
            <div className="flex gap-4">
              {personalInfo.socials.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-card-bg text-muted hover:bg-accent hover:text-white transition-all"
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="text-lg" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
```

**Step 3: Simplify Footer**

Rewrite `src/components/layout/Footer.tsx`:

```tsx
import { personalInfo } from "@/data/personal";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <p className="text-center text-xs text-muted/60">
          Built with Next.js & Tailwind CSS. &copy; {new Date().getFullYear()}{" "}
          {personalInfo.name}
        </p>
      </div>
    </footer>
  );
}
```

**Step 4: Add Contact to home page**

Modify `src/app/page.tsx` — add import and place `<Contact />` between `<Travel />` and `<Footer />`.

```tsx
import Contact from "@/components/sections/Contact";
// ...
<Travel />
<Contact />
<Footer />
```

**Step 5: Verify and commit**

Run: `npm run build`
Expected: Build succeeds, no errors.

```bash
git add src/data/personal.ts src/components/sections/Contact.tsx src/components/layout/Footer.tsx src/app/page.tsx
git commit -m "feat: add Contact section with email copy and simplify Footer"
```

---

## Task 2: Redesign Skills Section as iOS Widgets

**Files:**
- Modify: `src/data/skills.ts`
- Create: `src/components/ui/SkillWidget.tsx`
- Modify: `src/components/sections/Skills.tsx`

**Step 1: Add icon to each skill category for widget display**

Modify `src/data/skills.ts` — add a `categoryIcon` field to each category. Use the first skill's icon or a dedicated one:

```ts
import { IconType } from "react-icons";
import { SiPython, SiGodotengine, SiDocker, SiTypescript } from "react-icons/si";
import { FaRobot, FaGamepad } from "react-icons/fa6";
import { LuBrainCircuit } from "react-icons/lu";
import { TbBinaryTree } from "react-icons/tb";

export interface Skill {
  name: string;
  icon: IconType;
}

export interface SkillCategory {
  label: string;
  description: string;
  bg: string;
  categoryIcon: IconType;  // ADD THIS
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    label: "AI & ML",
    description: "Building intelligent agents and exploring the frontier of large language models, RAG pipelines, and prompt engineering.",
    bg: "bg-violet-600",
    categoryIcon: LuBrainCircuit,  // ADD
    skills: [
      { name: "LLM / Prompt Eng", icon: LuBrainCircuit },
      { name: "AI Agent Frameworks", icon: FaRobot },
    ],
  },
  {
    label: "Languages",
    description: "Proficient in Python for AI/backend and TypeScript for full-stack web development. Strong foundation in data structures and algorithms.",
    bg: "bg-blue-600",
    categoryIcon: SiPython,  // ADD
    skills: [
      { name: "Python", icon: SiPython },
      { name: "TypeScript / JS", icon: SiTypescript },
      { name: "DSA", icon: TbBinaryTree },
    ],
  },
  {
    label: "Tools & Infra",
    description: "Containerized deployments, CI/CD pipelines, and cloud infrastructure for scalable AI applications.",
    bg: "bg-emerald-600",
    categoryIcon: SiDocker,  // ADD
    skills: [{ name: "Docker / DevOps", icon: SiDocker }],
  },
  {
    label: "Creative",
    description: "Indie game development with Godot engine. Designing mechanics, narratives, and interactive experiences from scratch.",
    bg: "bg-orange-500",
    categoryIcon: FaGamepad,  // ADD
    skills: [
      { name: "Godot / GDScript", icon: SiGodotengine },
      { name: "Game Design", icon: FaGamepad },
    ],
  },
];
```

**Step 2: Create SkillWidget component**

Create `src/components/ui/SkillWidget.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import type { SkillCategory } from "@/data/skills";

interface SkillWidgetProps {
  cat: SkillCategory;
}

export default function SkillWidget({ cat }: SkillWidgetProps) {
  const CategoryIcon = cat.categoryIcon;

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`group relative aspect-square overflow-hidden rounded-3xl ${cat.bg} p-5 shadow-lg`}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />

      {/* Background glow */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Icon */}
        <CategoryIcon className="text-3xl text-white/90 mb-2" />

        {/* Label */}
        <h3 className="text-base font-bold text-white">{cat.label}</h3>

        {/* Skill chips - pushed to bottom */}
        <div className="mt-auto flex flex-wrap gap-1.5">
          {cat.skills.map((skill) => {
            const Icon = skill.icon;
            return (
              <span
                key={skill.name}
                className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm"
              >
                <Icon className="text-[10px] text-white/80" />
                {skill.name}
              </span>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
```

**Step 3: Rewrite Skills section with widget grid**

Rewrite `src/components/sections/Skills.tsx`:

```tsx
"use client";

import SectionTitle from "@/components/ui/SectionTitle";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SkillWidget from "@/components/ui/SkillWidget";
import GitHubWidget from "@/components/ui/GitHubWidget";
import { skillCategories } from "@/data/skills";

export default function Skills() {
  return (
    <section id="skills" className="bg-card-bg/30 py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <SectionTitle title="Skills" subtitle="Technologies I work with" />

        {/* iOS widget-style grid: 4 columns on desktop, 2 on mobile */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:grid-rows-2">
          {/* 4 skill widgets — top-left 2x2 */}
          {skillCategories.map((cat, i) => (
            <ScrollReveal key={cat.label} delay={i * 0.08}>
              <SkillWidget cat={cat} />
            </ScrollReveal>
          ))}

          {/* GitHub widget — spans 2 columns on the right, 2 rows tall on desktop */}
          {/* On mobile: full width below skill widgets */}
          <ScrollReveal
            delay={0.35}
            className="col-span-2 lg:col-start-3 lg:row-start-1 lg:row-span-2"
          >
            <GitHubWidget username="PixelCookie-zyf" />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
```

**Step 4: Build check (will fail until GitHubWidget exists — that's Task 3)**

This step completes after Task 3.

---

## Task 3: Create GitHub Activity Widget

**Files:**
- Create: `src/lib/github.ts`
- Create: `src/components/ui/GitHubWidget.tsx`

**Step 1: Create GitHub API utility**

Create `src/lib/github.ts`:

```ts
export interface GitHubStats {
  publicRepos: number;
  followers: number;
  totalStars: number;
}

export async function fetchGitHubStats(username: string): Promise<GitHubStats> {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { next: { revalidate: 3600 } }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { next: { revalidate: 3600 } }),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      return { publicRepos: 0, followers: 0, totalStars: 0 };
    }

    const user = await userRes.json();
    const repos = await reposRes.json();

    const totalStars = Array.isArray(repos)
      ? repos.reduce((sum: number, r: { stargazers_count: number }) => sum + r.stargazers_count, 0)
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
```

**Step 2: Create GitHubWidget component**

Create `src/components/ui/GitHubWidget.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaStar, FaCodeBranch, FaUsers } from "react-icons/fa6";
import type { GitHubStats } from "@/lib/github";

interface GitHubWidgetProps {
  username: string;
}

export default function GitHubWidget({ username }: GitHubWidgetProps) {
  const [stats, setStats] = useState<GitHubStats | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
        ]);
        if (!userRes.ok || !reposRes.ok) return;
        const user = await userRes.json();
        const repos = await reposRes.json();
        const totalStars = Array.isArray(repos)
          ? repos.reduce((sum: number, r: { stargazers_count: number }) => sum + r.stargazers_count, 0)
          : 0;
        setStats({
          publicRepos: user.public_repos ?? 0,
          followers: user.followers ?? 0,
          totalStars,
        });
      } catch {
        // silently fail
      }
    }
    load();
  }, [username]);

  // Generate a placeholder contribution grid pattern
  const weeks = 12;
  const days = 7;
  const generateGrid = () => {
    const grid: number[][] = [];
    for (let w = 0; w < weeks; w++) {
      const week: number[] = [];
      for (let d = 0; d < days; d++) {
        week.push(Math.floor(Math.random() * 5)); // 0-4 intensity levels
      }
      grid.push(week);
    }
    return grid;
  };

  const [grid] = useState(generateGrid);

  const intensityColors = [
    "bg-muted/20",
    "bg-emerald-500/30",
    "bg-emerald-500/50",
    "bg-emerald-500/70",
    "bg-emerald-500",
  ];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative h-full overflow-hidden rounded-3xl border border-border bg-card-bg/60 backdrop-blur-sm p-5 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <FaGithub className="text-xl text-foreground" />
        <span className="text-sm font-semibold text-foreground">GitHub Activity</span>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-xs text-muted hover:text-accent transition-colors"
        >
          @{username}
        </a>
      </div>

      {/* Contribution grid */}
      <div className="mb-4 flex gap-[3px] justify-center">
        {grid.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((intensity, di) => (
              <div
                key={di}
                className={`h-[10px] w-[10px] rounded-[2px] ${intensityColors[intensity]} transition-colors`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="flex justify-around text-center">
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-1 text-foreground">
            <FaCodeBranch className="text-xs text-muted" />
            <span className="text-lg font-bold">
              {stats?.publicRepos ?? "—"}
            </span>
          </div>
          <span className="text-[10px] text-muted uppercase tracking-wider">Repos</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-1 text-foreground">
            <FaStar className="text-xs text-amber-400" />
            <span className="text-lg font-bold">
              {stats?.totalStars ?? "—"}
            </span>
          </div>
          <span className="text-[10px] text-muted uppercase tracking-wider">Stars</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-1 text-foreground">
            <FaUsers className="text-xs text-muted" />
            <span className="text-lg font-bold">
              {stats?.followers ?? "—"}
            </span>
          </div>
          <span className="text-[10px] text-muted uppercase tracking-wider">Followers</span>
        </div>
      </div>
    </motion.div>
  );
}
```

**Step 3: Verify Skills + GitHub widget build**

Run: `npm run build`
Expected: Build succeeds.

```bash
git add src/data/skills.ts src/components/ui/SkillWidget.tsx src/components/ui/GitHubWidget.tsx src/lib/github.ts src/components/sections/Skills.tsx
git commit -m "feat: redesign Skills as iOS widgets and add GitHub activity widget"
```

---

## Task 4: Install Blog Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install dependencies**

```bash
npm install next-mdx-remote gray-matter
```

**Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add next-mdx-remote and gray-matter for blog"
```

---

## Task 5: Create Blog Library and Sample Post

**Files:**
- Create: `src/lib/blog.ts`
- Create: `src/content/blog/hello-world.mdx`

**Step 1: Create blog utility library**

Create `src/lib/blog.ts`:

```ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  tags: string[];
}

export interface PostMeta extends PostFrontmatter {
  slug: string;
}

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
    const { data } = matter(raw);

    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? "",
      description: data.description ?? "",
      tags: data.tags ?? [],
    };
  });

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPostBySlug(slug: string) {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    frontmatter: {
      title: data.title ?? slug,
      date: data.date ?? "",
      description: data.description ?? "",
      tags: data.tags ?? [],
    } as PostFrontmatter,
    content,
  };
}
```

**Step 2: Create sample MDX blog post**

Create `src/content/blog/hello-world.mdx`:

```mdx
---
title: "Hello World"
date: "2026-03-11"
description: "Welcome to my blog! This is where I'll share thoughts on AI, LLMs, game development, and more."
tags: ["Introduction", "Blog"]
---

# Hello World

Welcome to my blog! I'm PixelCookie, an AI Agent Engineer and LLM Researcher.

## What to expect

I'll be writing about:

- **AI & LLM Research** — exploring the frontier of large language models
- **Building AI Agents** — practical frameworks and patterns
- **Game Development** — indie game dev with Godot engine
- **Open Source** — projects and contributions

Stay tuned for more posts!
```

**Step 3: Commit**

```bash
git add src/lib/blog.ts src/content/blog/hello-world.mdx
git commit -m "feat: add blog utility library and sample MDX post"
```

---

## Task 6: Create BlogCard Component and Home Section

**Files:**
- Create: `src/components/ui/BlogCard.tsx`
- Create: `src/components/sections/Blog.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Create BlogCard component**

Create `src/components/ui/BlogCard.tsx`:

```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { PostMeta } from "@/lib/blog";

interface BlogCardProps {
  post: PostMeta;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.article
        whileHover={{
          y: -4,
          boxShadow:
            "0 0 0 1.5px rgba(59,130,246,0.65), 0 20px 40px rgba(59,130,246,0.12)",
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background p-5"
      >
        {/* Shimmer sweep */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/2 -skew-x-12 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 ease-out group-hover:translate-x-[300%]"
        />

        {/* Date */}
        <time className="text-xs text-muted font-mono">
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>

        {/* Title */}
        <h3 className="mt-2 text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
          {post.title}
        </h3>

        {/* Description */}
        <p className="mt-2 flex-1 text-sm text-muted leading-relaxed">
          {post.description}
        </p>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-card-bg px-2.5 py-0.5 text-xs font-medium text-muted transition-colors duration-300 group-hover:bg-accent/10 group-hover:text-accent"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.article>
    </Link>
  );
}
```

**Step 2: Create Blog section for home page**

Create `src/components/sections/Blog.tsx`:

```tsx
import Link from "next/link";
import SectionTitle from "@/components/ui/SectionTitle";
import ScrollReveal from "@/components/ui/ScrollReveal";
import BlogCard from "@/components/ui/BlogCard";
import { getAllPosts } from "@/lib/blog";

export default function Blog() {
  const posts = getAllPosts().slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="bg-card-bg/30 py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionTitle title="Blog" subtitle="Recent posts" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <ScrollReveal key={post.slug} delay={i * 0.1} className="h-full">
              <BlogCard post={post} />
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
          >
            View all posts &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
```

**Step 3: Add Blog section to home page**

Modify `src/app/page.tsx` — place `<Blog />` between `<Travel />` and `<Contact />`:

```tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Travel from "@/components/sections/Travel";
import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Experience />
        <Skills />
        <Projects />
        <Travel />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
```

**Step 4: Commit**

```bash
git add src/components/ui/BlogCard.tsx src/components/sections/Blog.tsx src/app/page.tsx
git commit -m "feat: add Blog section to home page with BlogCard component"
```

---

## Task 7: Create Blog Listing Page

**Files:**
- Create: `src/app/blog/page.tsx`

**Step 1: Create blog listing page**

Create `src/app/blog/page.tsx`:

```tsx
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import BlogCard from "@/components/ui/BlogCard";
import AsciiCanvas from "@/components/ui/AsciiCanvas";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog — PixelCookie",
  description: "Thoughts on AI, LLMs, game development, and open source.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen bg-background">
      {/* Decorative ASCII header */}
      <div className="relative overflow-hidden">
        <AsciiCanvas variant="subtle" className="opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="mx-auto max-w-6xl px-6 -mt-8 relative z-10 pb-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-primary/40 text-primary hover:bg-primary/10 hover:border-primary transition-all rounded-sm pixel-btn mb-8"
        >
          <IoArrowBack className="text-base" />
          <span>Back to Home</span>
        </Link>

        <h1 className="text-3xl font-bold text-foreground sm:text-4xl mb-2">Blog</h1>
        <p className="text-muted mb-10">Thoughts on AI, LLMs, game development, and more.</p>

        {posts.length === 0 ? (
          <p className="text-muted">No posts yet. Stay tuned!</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/blog/page.tsx
git commit -m "feat: add /blog listing page"
```

---

## Task 8: Create Blog Post Detail Page

**Files:**
- Create: `src/app/blog/[slug]/page.tsx`
- Modify: `src/app/globals.css` (add prose styling)

**Step 1: Create blog post page**

Create `src/app/blog/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.frontmatter.title} — PixelCookie`,
    description: post.frontmatter.description,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-10"
        >
          <IoArrowBack className="text-base" />
          Back to Blog
        </Link>

        {/* Article header */}
        <header className="mb-10">
          <time className="text-sm text-muted font-mono">
            {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
            {post.frontmatter.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {post.frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-card-bg px-3 py-1 text-xs font-medium text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* MDX content */}
        <article className="prose-custom">
          <MDXRemote source={post.content} />
        </article>
      </div>
    </main>
  );
}
```

**Step 2: Add prose typography styles**

Append to `src/app/globals.css`:

```css
/* Blog prose typography */
.prose-custom {
  color: var(--foreground);
  line-height: 1.8;
  font-size: 1rem;
}

.prose-custom h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  color: var(--foreground);
}

.prose-custom h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  color: var(--foreground);
}

.prose-custom h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--foreground);
}

.prose-custom p {
  margin-bottom: 1.25rem;
}

.prose-custom ul, .prose-custom ol {
  margin-bottom: 1.25rem;
  padding-left: 1.5rem;
}

.prose-custom ul {
  list-style-type: disc;
}

.prose-custom ol {
  list-style-type: decimal;
}

.prose-custom li {
  margin-bottom: 0.5rem;
}

.prose-custom a {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.prose-custom a:hover {
  opacity: 0.8;
}

.prose-custom strong {
  font-weight: 600;
  color: var(--foreground);
}

.prose-custom code {
  font-family: var(--font-mono), monospace;
  font-size: 0.875em;
  background: var(--card-bg);
  padding: 0.2em 0.4em;
  border-radius: 4px;
}

.prose-custom pre {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
  margin-bottom: 1.5rem;
}

.prose-custom pre code {
  background: none;
  padding: 0;
  font-size: 0.875rem;
}

.prose-custom blockquote {
  border-left: 3px solid var(--accent);
  padding-left: 1rem;
  color: var(--muted);
  font-style: italic;
  margin-bottom: 1.25rem;
}

.prose-custom hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 2rem 0;
}

.prose-custom img {
  border-radius: 8px;
  margin: 1.5rem 0;
}
```

**Step 3: Build and verify**

Run: `npm run build`
Expected: Build succeeds, `/blog` and `/blog/hello-world` pages generated.

**Step 4: Commit**

```bash
git add src/app/blog/[slug]/page.tsx src/app/globals.css
git commit -m "feat: add blog post detail page with MDX rendering and prose styles"
```

---

## Summary

| Task | Description | Depends On |
|------|-------------|------------|
| 1 | Contact section + Footer simplification | — |
| 2 | Skills data + SkillWidget component | — |
| 3 | GitHubWidget component | — |
| 4 | Install blog dependencies | — |
| 5 | Blog library + sample MDX post | 4 |
| 6 | BlogCard + Blog home section | 5 |
| 7 | Blog listing page `/blog` | 6 |
| 8 | Blog post detail page `/blog/[slug]` | 7 |

Tasks 1, 2, 3, 4 are independent and can be parallelized.
