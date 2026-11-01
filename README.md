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
| Assistant answers, FAQ, Upwork reviews | `src/data/assistant.js` |
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
- `/faq` FAQ, big assistant, Upwork reviews

## Deploying

Works on Vercel or Netlify out of the box (`vercel.json` and `public/_redirects` send every route to the app).

## Website assistant (chatbot)

The round blue button on every page opens the PAVORA Assistant. It runs entirely in the browser — no paid AI, no API key needed — and answers from `src/data/assistant.js`.

- **Add or edit an answer:** find the topic in `topics` and change `answer`. Add words people might type to `keywords` / `phrases`.
- **Show it on the FAQ page:** give the topic a `faq: { group, question, answer }`.
- **Add a client quote:** in `upworkReviews`, add `quote: "..."` and `client: "Name"` to a review.
- **If someone asks something it doesn't know**, it suggests the closest questions and offers "Start a project".
- It never quotes prices or delivery times — it asks the visitor to send a brief instead.

### Getting briefs by email

When a visitor finishes "Start a project", the brief is sent to `api/lead.js`, which emails it to you with [Resend](https://resend.com) (free plan is fine).

1. Create a Resend account and copy an API key.
2. In Vercel → your project → **Settings → Environment Variables**, add:
   - `RESEND_API_KEY` — the key
   - `LEAD_TO_EMAIL` — your email address
   - `LEAD_FROM_EMAIL` *(optional)* — e.g. `PAVORA <hello@yourdomain.com>` once your domain is verified in Resend
3. Redeploy. Hitting **Reply** on the email answers the client directly.

Until this is set up, the assistant shows your Upwork and Contact links instead. `npm run dev` doesn't run the `api/` folder; use `npx vercel dev` to test emails locally.
