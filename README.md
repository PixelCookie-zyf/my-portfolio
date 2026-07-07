# PixelCookie — Personal Portfolio

A warm, editorial developer portfolio built with the Next.js App Router. It pairs a
handcrafted **"Paper & Ember"** design system with generative ASCII art, a git-log
style career timeline, live GitHub activity, an interactive travel map, and an
MDX-powered blog with full math typesetting.

**🌐 Live demo → [www.pixelcookie.me](https://www.pixelcookie.me)**

---

## ✨ Highlights

- **Paper & Ember design system** — warm, Flexoki-inspired paper/ink neutrals with a
  single ember accent, film-grain texture, and light/dark themes that follow the
  visitor's OS preference by default.
- **Editorial, card-free layout** — hero, experience, work, and blog all share one
  hairline-list language instead of uniform card grids.
- **Generative ASCII canvas** — a mouse-reactive, animated ASCII "mountain range"
  rendered on `<canvas>` behind the hero.
- **`git log` career timeline** — experience rendered as a commit graph with branch
  badges (`work/meituan`, `edu/phd`…) and a `HEAD` marker on the current role.
- **Live GitHub widget** — followers, stars, streaks, and a contribution heatmap that
  auto-fits its week count to the available width, mirrored from public GitHub data.
- **MDX blog** — long-form posts with GitHub-Flavored Markdown, KaTeX math, and a
  reading-progress bar.
- **Interactive travel map** — Leaflet map of visited cities with themed markers.
- **Polished motion** — Framer Motion entrance animations, text-scramble effects, and
  a floating pill navbar.

## 🛠 Tech Stack

| Area            | Choice                                                            |
| --------------- | ---------------------------------------------------------------- |
| Framework       | [Next.js 16](https://nextjs.org) (App Router) + React 19         |
| Language        | TypeScript                                                       |
| Styling         | [Tailwind CSS v4](https://tailwindcss.com) + CSS custom properties |
| Typography      | Plus Jakarta Sans (sans) · JetBrains Mono (mono) via `next/font` |
| Animation       | [Framer Motion](https://www.framer.com/motion/)                  |
| Theming         | [next-themes](https://github.com/pacocoursey/next-themes)        |
| Content         | MDX via `next-mdx-remote` + `gray-matter`, `remark-gfm`, `remark-math`, `rehype-katex` |
| Map             | `react-leaflet` / Leaflet                                        |
| Icons           | `react-icons` + custom themed SVGs                               |
| Analytics       | Vercel Analytics                                                 |
| Deployment      | [Vercel](https://vercel.com)                                     |

## 🏗 Architecture

Content-driven and component-based: page sections are thin, and the data they render
lives in typed modules under `src/data`, so updating the site is mostly editing data
files — no layout surgery required.

```
src/
├── app/                     # Next.js App Router
│   ├── layout.tsx           # Root layout — fonts, theme provider, global widgets
│   ├── page.tsx             # Home: composes the section components
│   ├── globals.css          # Design tokens + "Paper & Ember" theme
│   ├── not-found.tsx        # Custom 404
│   ├── blog/                # Blog index + [slug] MDX post pages
│   └── projects/            # Standalone projects page
├── components/
│   ├── layout/              # Header (floating nav) + Footer
│   ├── sections/            # Hero, Experience, Skills, Work, Travel, Blog, Contact
│   └── ui/                  # AsciiCanvas, GitHubWidget, TravelMap, BackToTop, …
├── content/blog/            # MDX blog posts (front-matter + body)
├── data/                    # Typed content: personal, experience, projects, skills, travel
└── lib/                     # Helpers: blog parsing, GitHub calendar utils, hydration
```

**How content flows:** `src/data/*.ts` hold typed arrays (experience, projects,
skills, travel, personal info). Section components in `src/components/sections`
consume that data and render it; reusable presentation lives in `src/components/ui`.
Blog posts are MDX files in `src/content/blog`, parsed by `src/lib/blog.ts` and
rendered through `next-mdx-remote` with math and GFM plugins.

## 🚀 Getting Started

```bash
# install dependencies
npm install

# start the dev server (http://localhost:3000)
npm run dev

# production build
npm run build && npm run start

# lint
npm run lint
```

Run the test suite (Node's built-in test runner):

```bash
node --test 'tests/*.test.mjs'
```

## 📝 Customizing Content

Most of the site is data-driven — edit these and the UI updates:

- `src/data/personal.ts` — name, bio, roles, socials, nav links
- `src/data/experience.ts` — career timeline entries (with `branch` labels)
- `src/data/projects.ts` — featured work
- `src/data/skills.ts` — skill categories
- `src/data/travel.ts` — visited cities for the map
- `src/content/blog/*.mdx` — blog posts (front-matter: title, date, description, tags)

## 📦 Deployment

Deployed on **Vercel** with automatic builds on push to `main`, served at
[www.pixelcookie.me](https://www.pixelcookie.me).

## 📄 License

Personal project — feel free to draw inspiration, but please don't republish the
content or imagery as your own.
