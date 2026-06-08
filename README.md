# NoteHub

A full-stack note-taking app built with Next.js 15 (App Router) and React 19. NoteHub lets users sign up, organize notes by tags, search and paginate through them, and manage their profile — all wrapped in a custom-built dark premium UI.

## Features

- **Authentication** — sign up, sign in, forgot/reset password, and session-based auth via httpOnly cookies
- **Notes management** — create, view, filter by tag, search, and paginate notes
- **Parallel routes & intercepted modals** — note details open in a modal on top of the list (via Next.js `@modal` parallel routes) while still being deep-linkable as a full page
- **Profile page** — view and manage account details
- **Custom UI components** — hand-built dropdown menus and a cross-browser custom `<select>` replacement (native option popups can't be styled consistently across browsers)
- **Dark premium design system** — CSS Modules + CSS custom properties, fully responsive (mobile-first: ≤768px, tablet 769–1024px, desktop ≥1025px)

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org) (App Router, Turbopack)
- **UI:** React 19, CSS Modules (no Tailwind, no inline styles)
- **State & data:** [Zustand](https://github.com/pmndrs/zustand) for auth state, [TanStack Query](https://tanstack.com/query) for server state
- **Forms & validation:** [Formik](https://formik.org) + [Yup](https://github.com/jquense/yup)
- **HTTP:** [Axios](https://axios-http.com)
- **Pagination:** [react-paginate](https://github.com/AdeleD/react-paginate)
- **Language:** TypeScript

## Architecture

The app follows a **Backend-for-Frontend (BFF) proxy pattern**:

- The browser talks only to Next.js API routes under `app/api/`
- Those route handlers proxy requests to the real backend, attaching/refreshing auth tokens server-side
- This keeps the `refreshToken` in an httpOnly cookie (never exposed to client JS) and avoids CORS issues entirely

```
Browser → Next.js API routes (app/api/*) → External backend
```

### Project structure

```
app/
  (auth routes)/      sign-in, sign-up, forgot/reset password
  (private routes)/   notes, profile (require authentication)
  @modal/             intercepted modal routes for note details
  api/                BFF proxy routes (auth, notes, users)
components/           reusable UI components (CSS Modules)
lib/
  api/                axios instances & API client functions
  store/              Zustand auth store
types/                shared TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 18.18+ and npm

### Setup

1. Clone the repo and install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root:

   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

   This should point to your running Next.js app (the BFF proxy), not the backend directly. In production (e.g. on Vercel), set it to your deployed app URL, such as `https://your-app.vercel.app`.

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the dev server (Turbopack)     |
| `npm run build` | Build the app for production         |
| `npm run start` | Start the production server          |
| `npm run lint`  | Run ESLint                           |

## Deployment

The app is deployed on [Vercel](https://vercel.com). Make sure `NEXT_PUBLIC_API_URL` is set to the deployed app's own URL (not the backend), since all client requests are proxied through the app's own API routes.
