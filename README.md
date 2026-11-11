# Flotrafic frontend

React single-page app for Flotrafic, a platform that gives small businesses a hosted website and a dashboard for enquiries, bookings and billing.

Status: beta, last updated February 2026. Flotrafic is an earlier product that preceded [DeskCaptain](https://github.com/JoeWat2005/deskcaptain).

## Features

- Marketing homepage with feature, pricing and call-to-action sections
- Sign-up, login, email verification and password reset in a modal, with Cloudflare Turnstile on the verification and reset steps
- Business dashboard at `/:slug/dashboard` with overview, website, enquiries, bookings and billing pages
- Enquiry inbox with read state, a status workflow (new, in progress, resolved) and deletion
- Bookings list, with bookings created from an existing enquiry
- Website editor for hero, about and contact content, brand colours, fonts, component styles, section order, testimonials and pricing plans, with desktop and mobile previews
- Public business site at `/:slug`, rendered from the saved customisation, with visit tracking and an enquiry form

## Tech stack

- React 19 and TypeScript 5.9
- Vite 7 with the SWC React plugin
- React Router 7
- Tailwind CSS 4 (through PostCSS)
- lucide-react icons and react-turnstile (Cloudflare Turnstile)
- ESLint 9 with typescript-eslint

## Getting started

### Prerequisites

- Node.js and npm. No Node version is pinned in `package.json`, so use one supported by Vite 7.
- A running [Flotrafic FastAPI backend](https://github.com/JoeWat2005/flotrafic-fastapi-backend). Its CORS settings already allow `http://localhost:5173`.
- A Cloudflare Turnstile site key. The matching secret key is configured on the backend.

### Installation

```bash
npm install
```

### Configuration

Vite reads `VITE_`-prefixed variables from `.env` files in the project root. The repository includes a `.env` with local development values; to use different ones, put them in `.env.local`, which is ignored by git.

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Base URL of the Flotrafic API, used by the dashboard and public site pages |
| `VITE_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key for the verification and password reset forms |

Note: the authentication hook (`src/features/auth/useAuth.ts`) calls `http://localhost:8000` directly instead of using `VITE_API_URL`, so login and sign-up only work against a backend at that address.

### Running locally

```bash
npm run dev
```

The dev server runs on port 5173 and listens on all network interfaces (`server.host: true` in `vite.config.ts`). It also accepts `*.flotrafic.local` hostnames.

### Linting

```bash
npm run lint
```

There are no automated tests in this repository.

### Building

```bash
npm run build     # type-check with tsc -b, then build into dist/
npm run preview   # serve the production build locally
```

The repository has no hosting configuration. The app uses `BrowserRouter`, so whichever host serves `dist/` must fall back to `index.html` for client-side routes such as `/:slug/dashboard`.

## How it works

- **Routing.** `src/main.tsx` mounts the app inside `BrowserRouter`, and `src/App.tsx` defines four routes: the marketing homepage at `/`, the dashboard at `/:slug/dashboard/*`, the public business site at `/:slug` and a catch-all error page.
- **Authentication.** `src/features/auth/useAuth.ts` drives a multi-step modal. Sign-up calls `/auth/pre-register`. The emailed six-digit code is then checked by `/auth/verify-email-code` along with a Turnstile token, and the user is logged in through `/auth/login`. The returned JWT is stored in `localStorage` under `token` and sent as a bearer token on dashboard requests. The Pro plan is shown as "coming soon" and cannot be selected.
- **Dashboard.** `src/pages/dashboard/DashboardLayout.tsx` loads `/me/` to identify the business. It redirects to the correct slug, or back to `/` if the token is missing or rejected. Each page fetches its own data from `/enquiries/`, `/bookings/`, `/customisation/` or `/billing/overview`. A 403 response from the enquiries or bookings API is shown as an upgrade prompt.
- **Public site.** `src/pages/public/BusinessSite.tsx` fetches `/public/business?slug=<slug>`, records the visit with `/public/visit`, loads the chosen Google Font and renders the sections in the saved order. The contact form posts to `/public/enquiry`. Slugs reserved for platform routes are listed in `src/pages/public/slug.ts`.

## Project structure

```
src/
  assets/        Logo image
  components/
    layout/      Navbar, footer and public layout
    marketing/   Homepage sections (hero, features, pricing, call to action)
  features/
    auth/        Auth modal, forms, validation and the useAuth hook
  pages/
    dashboard/   Dashboard layout and pages
    public/      Public business site, error page and reserved slugs
  styles/        Tailwind entry stylesheet
  utils/         Password strength helper
public/          Static assets
```

## Related repositories

- [flotrafic-fastapi-backend](https://github.com/JoeWat2005/flotrafic-fastapi-backend): the API this frontend talks to
- [flotrafic-flask-backend](https://github.com/JoeWat2005/flotrafic-flask-backend): the original Flask backend (deprecated)
- [deskcaptain](https://github.com/JoeWat2005/deskcaptain): the later AI receptionist product
