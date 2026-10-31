# PAVORA — Portfolio of Paul Ademola

Personal portfolio website, built with **React**, **Tailwind CSS v4** and **Vite**, from the "My Portfolio" Figma design.

_Designed with Vision. Built for Impact._

## Run it

```bash
npm install
npm run dev      # local site at http://localhost:5173
npm run build    # production build in /dist
```

## Where to edit things

| What | File |
| --- | --- |
| Links, email, Upwork numbers | `src/data/site.js` |
| Projects (cards + project pages) | `src/data/projects.js` |
| Services, reviews, About lists, experience | `src/data/content.js` |
| Colours and fonts | `@theme` block at the top of `src/index.css` |
| Page layouts | `src/pages/` |
| Shared pieces (navbar, footer, buttons, cards) | `src/components/` |

## Replacing pictures

All pictures live in `public/images/`. To swap one, replace the file and keep the same name, or point to a new file in `src/data/projects.js`.

- `paul-ademola.jpg` — your photo (hero bubble, About page)
- `projects/` — project cover and detail pictures (the ones that say "Replace…" are placeholders)
- `about/photo-1.jpg` … `photo-4.jpg` — the photo row on the About page

## Pages

- `/` Home — hero, Upwork stats, selected works, services, about teaser, reviews
- `/work` All works with category filters
- `/work/:slug` Project case study
- `/about` About
- `/contact` Contact form + Upwork card

## Deploying

Works on Vercel or Netlify out of the box (`vercel.json` and `public/_redirects` send every route to the app).
