# Portfolio Enhancements Design

Date: 2026-03-11

## Overview

Three new features for the portfolio website:
1. Skills section redesign (iOS widget style) + GitHub activity widget
2. Contact section (replace Footer's "Let's Collaborate")
3. Blog system (MDX local files with dynamic routing)

---

## 1. Skills Redesign + GitHub Activity

### Current State
- 4 skill categories displayed as horizontal 3D tilt cards in a 2x2 grid
- Component: `src/components/sections/Skills.tsx` (98 lines)
- Data: `src/data/skills.ts` (4 categories with icons and skill chips)

### Design

**iOS Widget-style Layout:**
- Redesign skill cards as small square widgets with rounded corners and glassmorphism
- GitHub activity as a larger widget (spanning 2 columns) mixed into the grid
- Responsive: on mobile stack vertically, on desktop use a mixed grid

**Grid Layout (desktop):**
```
┌──────────┐ ┌──────────┐ ┌───────────────────────┐
│  AI & ML │ │Languages │ │     GitHub Activity    │
│  widget  │ │  widget  │ │  contribution graph    │
│  (1x1)   │ │  (1x1)   │ │  + stats counters     │
└──────────┘ └──────────┘ │       (2x1)            │
┌──────────┐ ┌──────────┐ └───────────────────────┘
│ Tools &  │ │ Creative │
│  Infra   │ │  widget  │
│  (1x1)   │ │  (1x1)   │
└──────────┘ └──────────┘
```

**Skill Widget (1x1):**
- Square aspect ratio with rounded-2xl corners
- Glassmorphism background (bg-card-bg/60 backdrop-blur)
- Category icon at top, category label below
- Skill chips/tags displayed inside
- Subtle hover scale effect (no 3D tilt to keep it clean)

**GitHub Widget (2x1):**
- Spans 2 columns on the right side
- Content:
  - Mini contribution graph (CSS grid, ~12 weeks of colored squares)
  - Stats row: total public repos, total stars, followers
  - "View on GitHub" link
- Data source: GitHub REST API (`https://api.github.com/users/PixelCookie-zyf`)
  - Fetch at build time (ISR with revalidate) via a server component or API route
  - For contribution graph: use GitHub GraphQL API or generate from public event data
  - Fallback: use `github-contributions-api` or embed GitHub's SVG contribution chart

### Files to Create/Modify
- `src/components/sections/Skills.tsx` — rewrite with new grid layout
- `src/components/ui/SkillWidget.tsx` — new: individual skill widget component
- `src/components/ui/GitHubWidget.tsx` — new: GitHub activity widget
- `src/lib/github.ts` — new: GitHub API fetching utilities
- `src/data/skills.ts` — may need minor adjustments for widget display

---

## 2. Contact Section

### Current State
- Footer (`src/components/layout/Footer.tsx`) has "Let's Collaborate" text, social icons, and copyright
- No dedicated contact section exists
- Email: metazyf@gmail.com (not currently shown anywhere)

### Design

**New Contact Section** (above Footer):
- Section ID: `#contact`
- Heading: "Get In Touch" or similar
- Email display with:
  - `mailto:metazyf@gmail.com` link
  - Copy-to-clipboard button with visual feedback (copied!)
- Social icons row (reuse existing social data from personal.ts)
- Simple, clean layout centered on the page

**Footer Simplification:**
- Remove "Let's Collaborate" content and social icons
- Keep only: copyright line + "Built with Next.js & Tailwind CSS"

**Navigation Update:**
- Add "Contact" to `navLinks` in `src/data/personal.ts`
- Header navigation will auto-pick it up

### Files to Create/Modify
- `src/components/sections/Contact.tsx` — new: contact section component
- `src/components/layout/Footer.tsx` — simplify to copyright only
- `src/data/personal.ts` — add email field + "Contact" nav link
- `src/app/page.tsx` — add Contact section before Footer

---

## 3. Blog System

### Current State
- No blog functionality exists
- Project uses Next.js App Router
- Existing pages: `/` (home), `/projects` (dedicated projects page)

### Design

**Content Structure:**
```
src/content/blog/
  hello-world.mdx
  building-ai-agents.mdx
  ...
```

**MDX Frontmatter Schema:**
```yaml
---
title: "Article Title"
date: "2026-03-11"
description: "Short description for cards and SEO"
tags: ["AI", "LLM"]
---
```

**Pages:**

1. **Home page Blog section** (after Travel, before Contact):
   - Section title: "Blog" / "Recent Posts"
   - Show latest 3 articles as cards (title, date, description, tags)
   - "View All Posts" link to `/blog`

2. **`/blog` page** — full article listing:
   - Header with ASCII canvas (similar to `/projects` page style)
   - Back button to home
   - All articles listed as cards, sorted by date descending
   - Each card links to `/blog/[slug]`

3. **`/blog/[slug]` page** — individual article:
   - Header with article title, date, tags
   - Back button to `/blog`
   - MDX content rendered with proper typography
   - Prose styling (max-width, readable line length)

**Technical Approach:**
- Use `next-mdx-remote` for MDX rendering (flexible, well-supported)
- Utility functions in `src/lib/blog.ts`:
  - `getAllPosts()` — read all MDX files, parse frontmatter, sort by date
  - `getPostBySlug(slug)` — read single post, return frontmatter + compiled MDX
- Static generation via `generateStaticParams` for blog post pages
- Code syntax highlighting with `rehype-pretty-code` or `rehype-highlight`

**Blog Card Component:**
- Title, date, description, tags
- Hover animation consistent with existing ProjectCard style
- Click navigates to `/blog/[slug]` (new page, not modal)

### Files to Create/Modify
- `src/content/blog/` — directory for MDX articles
- `src/content/blog/hello-world.mdx` — sample article
- `src/lib/blog.ts` — new: MDX parsing utilities
- `src/components/ui/BlogCard.tsx` — new: blog post card component
- `src/components/sections/Blog.tsx` — new: home page blog section
- `src/app/blog/page.tsx` — new: blog listing page
- `src/app/blog/[slug]/page.tsx` — new: individual blog post page
- `src/app/page.tsx` — add Blog section
- `src/data/personal.ts` — add "Blog" nav link

### Dependencies to Install
- `next-mdx-remote` — MDX rendering
- `gray-matter` — frontmatter parsing
- `rehype-pretty-code` (optional) — code syntax highlighting
- `shiki` (optional) — syntax highlighting engine

---

## Implementation Order

1. **Contact section** — simplest, quick win
2. **Skills redesign + GitHub widget** — visual refactor
3. **Blog system** — most complex, needs new dependencies and multiple pages

---

## Navigation Updates Summary

Current navLinks: Home, Experience, Skills, Projects, Travel

New navLinks: Home, Experience, Skills, Projects, Travel, Blog, Contact
