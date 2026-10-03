# Muhammad Shoaib — Portfolio

Personal portfolio site for **Muhammad Shoaib**, a frontend engineer with 7+ years of experience building production web and mobile products.

Live focus: React, Next.js, React Native, and AI-assisted workflows.

## Stack

- **Next.js** (App Router)
- **React** + TypeScript
- **Framer Motion** + **Lenis** (motion & smooth scroll)
- **CSS Modules** with design tokens (dark / light themes)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start local development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project structure

```text
src/
  app/                 # Next.js routes & API
  site/                # Main portfolio UI, content, theme
  variations/          # Alternate layout experiments
public/
  v2/                  # Images, logos, favicon
  resume/              # Resume PDF
```

## Content

- Site copy & profile data: `src/variations/elian/data.ts` (re-exported from `src/site/data.ts`)
- Home sections content: `src/site/content.ts`
- Projects: `src/site/projects.ts`
- Resume PDF: `public/resume/Muhammad-Shoaib-Frontend-Engineer.pdf`
- Brand assets: `public/v2/main-logo.png`, `public/v2/fav-icon.png`

## Contact

- Email: shoaib.octachat@gmail.com
- LinkedIn: [mdshoaib195](https://www.linkedin.com/in/mdshoaib195/)
- Location: Karachi, Pakistan

## Admin panel

Protected CMS at `/admin` (Neon Postgres).

1. Create a Neon DB and set in `.env`:

```ash
DATABASE_URL="postgresql://..."
ADMIN_SESSION_SECRET="long-random-secret"
```

2. Push schema + seed default admin + portfolio data:

```ash
npm run db:setup
```

3. Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Default admin:

- **Email:** shoaib.octachat@gmail.com
- **Password:** Admin123@@

Admin areas: Dashboard, Projects, Experience, Settings, Messages.
