# PixelCookie — Personal notebook

A personal site for research notes, open-source projects and game-development experiments.
Built with Next.js 16, React 19, TypeScript and Tailwind CSS v4.

Live site: [www.pixelcookie.me](https://www.pixelcookie.me)

## Features

- Warm paper and ink colors, serif headings, and light/dark themes.
- Writing-first homepage with selected projects, experience and a travel map.
- MDX articles with GFM, KaTeX formulas, unique heading anchors and a responsive table of contents.
- GitHub profile, contribution calendar and pinned repositories, with independent loading and a short-lived cache.
- Horizontal experience timeline with keyboard and mobile scrolling.
- Interactive pencil-sketch fox from [page-mascot](https://github.com/nilbuild/page-mascot), with local spritesheets, keyboard/touch input and reduced-motion support.

## Development

```sh
npm install
npm run dev
```

The development site is available at http://localhost:3000.

```sh
npm run lint
npm test
npm run build
npm run start
```

## Content

- `src/data/personal.ts`: introduction, navigation and social links.
- `src/data/projects.ts`: project descriptions and links; the homepage shows the first three.
- `src/data/experience.ts`: career and education.
- `src/data/skills.ts`: tools and interests.
- `src/data/travel.ts`: visited cities.
- `src/content/blog/*.mdx`: articles with title, date, description and tags in frontmatter.
- `src/app/globals.css`: colors, shared layout and article typography.
- `src/components/ui/PageMascot.tsx`: mascot appearance and accessibility.

Mascot assets are served from `public/mascots`. Attribution, the upstream revision,
and the MIT license are recorded in that directory. No third-party script or
remote image service is required for the mascot.

## Travel map

The map uses high-density OpenStreetMap tiles by default, without color filters.
To use the original CARTO Voyager basemap, request a free project key at
https://carto.com/basemaps/apikey/ and add this to `.env.local`:

```sh
NEXT_PUBLIC_CARTO_BASEMAP_KEY=your_project_key
```

Restart development or rebuild the production site after changing the key.
This is a public browser key; restrict it to the site's domains in CARTO.
Map attribution remains visible for either provider.

## Deployment

The repository is configured for Vercel, with production served at
[www.pixelcookie.me](https://www.pixelcookie.me).

## License

Personal project. Please do not republish the personal content or imagery as your own.
Third-party mascot assets retain their MIT license in `public/mascots/LICENSE`.
