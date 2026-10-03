# Taskio 🚀

🔗 **[Live Demo](https://taskio-14.vercel.app/)**
📱 **[Mobile companion app (React Native / Expo)](https://github.com/HastiNavabian/taskio-mobile)**

A Trello-style task management board built from scratch as a hands-on React learning project — now a fully-featured, deployed app with real authentication, a Postgres backend, row-level security, and a responsive UI that works from desktop down to mobile.

> Built step-by-step to master React fundamentals through advanced patterns: hooks, component composition, server state, client state management, auth, and responsive/mobile-safe CSS.

## ✨ Features

- **Full authentication** — sign up, sign in, password reset via email, duplicate-account detection, and guest access via Supabase anonymous auth
- **Real backend with Supabase** — Postgres database with Row Level Security, so every user only ever sees their own data
- **Full CRUD** — create, read, update, delete, and rename tasks, with due dates and task detail views
- **Categories / Lists** — user-created, color-coded categories with task counts, used to filter the board from the sidebar
- **Drag & drop** — move tasks between Today / This Week / Completed columns, built with `@dnd-kit`, tuned to work smoothly on both desktop (mouse) and mobile (touch)
- **Optimistic UI updates** — status changes, task creation, deletion, and category changes feel instant, with automatic rollback if the server request fails
- **Live search** — filter tasks by title in real time, powered by a global Zustand store
- **Collapsible sidebar navigation** — categories, search, and theme/account controls, with a mobile-friendly drawer behavior
- **Light / dark theme** — defaults to the user's system preference and updates live if it changes, with a manual override saved per user
- **Fully responsive** — usable from desktop down to small phone screens, including iOS-specific fixes (no unwanted zoom on form focus, correct native date-picker theming, safe-area-aware layout)
- **Tests** — component tests with Vitest + Testing Library

## 🛠 Tech Stack

| Layer          | Choice                                        | Why                                                                                            |
| -------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| UI              | React 18 + Vite                                | Fast dev server, modern React with hooks                                                         |
| Backend         | [Supabase](https://supabase.com) (Postgres + Auth) | Real database and authentication without standing up custom backend infrastructure               |
| Server state    | [TanStack Query](https://tanstack.com/query)   | Caching, background refetching, and mutation handling instead of manual `useState`/`useEffect` fetch logic |
| Client state    | [Zustand](https://github.com/pmndrs/zustand)   | Minimal global state (search term, active category filter) without prop drilling or Context boilerplate |
| Drag & drop     | [@dnd-kit](https://dndkit.com)                 | Accessible, touch- and mouse-friendly drag and drop                                              |
| Testing         | [Vitest](https://vitest.dev) + Testing Library | Fast, Vite-native test runner for component tests                                                |
| Styling         | Plain CSS                                      | Hand-written design system (spacing/type scale, CSS custom properties for theming), no framework |

## 🏗 Architecture

```
src/
├── services/
│   ├── supabaseClient.js     # Supabase client init
│   ├── taskApi.js            # All task-related Supabase queries
│   └── categoryApi.js        # All category-related Supabase queries
├── store/
│   └── searchStore.js        # Zustand store: search term + active category filter
├── context/
│   ├── AuthContext.jsx        # Auth state + sign up/in/out, password reset, guest login
│   └── ThemeContext.jsx       # Light/dark theme, system-preference aware
└── features/
    └── tasks/
        ├── hooks/
        │   ├── useTasks.js       # React Query hooks: fetching + optimistic mutations
        │   └── useCategories.js  # React Query hooks for categories
        ├── auth/
        │   ├── LoginForm.jsx
        │   └── ResetPasswordForm.jsx
        └── components/
            ├── BoardView.jsx      # Top-level layout: sidebar + board
            ├── Sidebar.jsx        # Navigation, search, categories, theme/account controls
            ├── Column.jsx
            ├── TaskCard.jsx
            ├── Modal.jsx
            ├── Button.jsx
            └── SearchInput.jsx
```

**Design decisions worth calling out:**

- **Why Supabase instead of a hand-rolled backend?** It gives a real Postgres database, authentication, and Row Level Security out of the box, letting the project focus on frontend architecture while still being backed by production-grade infrastructure.
- **Why Row Level Security?** Every table (`tasks`, `categories`) has policies scoped to `auth.uid() = user_id`, so access control is enforced at the database layer — not just hidden by frontend filtering.
- **Why TanStack Query instead of manual `fetch` + `useState`?** Manual data-fetching means every component that needs the same data re-fetches independently, with no shared cache and no built-in way to know when data goes stale. TanStack Query solves this with a centralized cache, automatic background refetching, and a consistent loading/error API.
- **Why Zustand instead of React Context for search/filters?** Context works, but requires writing a `Provider`, wrapping the tree, and a bit of boilerplate for something as small as a search string or filter id. Zustand gives any component direct read/write access to shared client state with far less ceremony — and only re-renders components that actually subscribe to the piece of state that changed.
- **Why optimistic updates?** Waiting for a server round-trip before updating the UI makes a task board feel sluggish. Optimistic updates apply the change immediately, then roll back automatically (via TanStack Query's `onMutate`/`onError`/`onSettled`) if the request fails — giving a fast, native-app feel without sacrificing correctness.
- **Why `@dnd-kit`?** It handles both mouse and touch input, which mattered a lot here — getting drag-and-drop to feel right on mobile (without triggering accidental scrolls, text selection, or double-tap issues) took real tuning on top of the library's defaults.
- **Why separate `taskApi.js` / `categoryApi.js` layers?** Keeps a single responsibility per file: these only know _how to talk to Supabase_; the hooks only know _how to manage that data in React_ (caching, optimistic updates). If the backend changes, only the service layer needs to change.

## 🚀 Getting Started

```bash
npm install
```

Create a `.env.local` file with your Supabase project credentials:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Then run the dev server:

```bash
npm run dev          # http://localhost:5173
```

### Running tests

```bash
npm test
```

## 📍 Roadmap

- [x] Phase 1 — Git & project setup
- [x] Phase 2 — Board skeleton + data flow (props, lifting state up)
- [x] Phase 3 — Hooks (useEffect, Context concepts)
- [x] Phase 4 — Component composition (Modal, Card, Button)
- [x] Phase 5 — REST API integration
- [x] Phase 6 — State management (TanStack Query + Zustand)
- [x] Phase 7 — Clean Code refactor (custom hooks, DRY, SRP, services layer)
- [x] Migration to Supabase (Postgres + Auth + Row Level Security)
- [x] Authentication (sign up/in, password reset, duplicate-account detection, guest login)
- [x] Categories/Lists with filtering
- [x] Sidebar navigation with responsive mobile drawer
- [x] Drag & drop with `@dnd-kit` (desktop + mobile)
- [x] Light/dark theme, system-preference aware
- [x] Component tests with Vitest
- [x] Bonus — React Native companion app with Expo ([taskio-mobile](https://github.com/HastiNavabian/taskio-mobile))
