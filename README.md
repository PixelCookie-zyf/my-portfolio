# PixelCookie — Personal notebook

A personal site for research notes, open-source projects and game-development experiments.
Built with Next.js 16, React 19, TypeScript and Tailwind CSS v4.

Live site: [www.pixelcookie.me](https://www.pixelcookie.me)

## Features

- A notebook-style layout: a rose margin line runs down every page, with dates, numbers and the table of contents written in the margin. Newsreader headings, Inter text, ink-blue links, light/dark themes.
- Writing-first homepage with projects, an experience timeline drawn on the margin line, GitHub activity and a travel map.
- MDX articles with GFM, KaTeX formulas, unique heading anchors and a sticky table of contents.
- An interactive pencil-sketch fox from [page-mascot](https://github.com/nilbuild/page-mascot), served from local spritesheets.

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

- `src/data/personal.ts`: introduction, “Now” facts, navigation and social links.
- `src/data/projects.ts`: project descriptions and links; the homepage shows the first three.
- `src/data/experience.ts`: career and education.
- `src/data/skills.ts`: tools and interests.
- `src/data/travel.ts`: visited cities.
- `src/content/blog/*.mdx`: articles with title, date, description and tags in frontmatter.
- `src/app/globals.css`: color tokens, the notebook grid and article typography.
- `src/components/layout/Row.tsx`: the margin-note + content row every section is built from.

Mascot assets live in `public/mascots` with their attribution and MIT license.

## Travel map

The map uses high-density OpenStreetMap tiles by default, shown in grayscale (inverted in dark mode).
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
