# 🦒 Jiraffic

> Project management, minus the pain.

A fast, minimal Kanban board with AI-powered priority suggestions — built with Next.js 15, React 19, TypeScript and Supabase.

![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

---

## Features

- **Drag & Drop** — Move and reorder tasks across columns with full persistence *(desktop only)*
- **Mobile Kanban** — On mobile, columns are replaced by collapsible accordions. Tasks can be moved between columns directly from the edit dialog.
- **AI Priority Suggestions** — Powered by Gemini 2.0 Flash, analyzes your tasks and suggests priorities with reasoning
- **Task management** — Create, edit, delete tasks with title, description and priority levels
- **Smart filters** — Filter tasks by priority (high / medium / low) or search by name, with drag & drop still active
- **Activity log** — Every action tracked in real time (task created, moved, deleted)
- **Authentication** — Secure sign up / sign in via Clerk with Google OAuth support

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| UI | React 19 + shadcn/ui + Tailwind CSS v4 |
| Auth | Clerk |
| Database | Supabase (PostgreSQL) |
| Drag & Drop | dnd-kit |
| AI | Google Gemini 2.0 Flash |
| Forms | React Hook Form + Zod |
| Deploy | Vercel |

---

## Project Structure

```
jiraffic/
├── app/
│   ├── (auth)/                  # Public auth routes
│   │   ├── sign-in/[[...rest]]/
│   │   └── sign-up/[[...rest]]/
│   ├── (dashboard)/             # Protected routes
│   │   ├── dashboard/           # Board list
│   │   └── board/[id]/          # Board view
│   ├── api/
│   │   └── ai/                  # Gemini API route
│   └── page.tsx                 # Landing page
├── components/
│   ├── ui/                      # shadcn/ui components
│   └── features/
│       ├── board/               # Board, columns, tasks, filters
│       ├── ai/                  # AI suggest button
│       └── activity/            # Activity log
├── lib/
│   ├── supabase/                # Client & server Supabase clients
│   └── actions/                 # Server Actions (boards, tasks, activity)
├── types/
│   └── database.ts              # Shared TypeScript types
└── proxy.ts                # Clerk route protection
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Clerk](https://clerk.com) account
- A [Supabase](https://supabase.com) account
- A [Google AI Studio](https://aistudio.google.com) account (for Gemini API key)

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/jiraffic.git
cd jiraffic
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables — create a `.env.local` file in the root:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Gemini
GEMINI_API_KEY=your-gemini-api-key
```

4. Set up the Supabase database — run this SQL in the Supabase SQL Editor:

```sql
create table boards (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  owner_id text not null,
  created_at timestamp with time zone default now()
);

create table columns (
  id uuid default gen_random_uuid() primary key,
  board_id uuid references boards(id) on delete cascade,
  name text not null,
  position integer not null,
  created_at timestamp with time zone default now()
);

create table tasks (
  id uuid default gen_random_uuid() primary key,
  column_id uuid references columns(id) on delete cascade,
  title text not null,
  description text,
  position integer not null,
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  created_at timestamp with time zone default now()
);

create table activity_log (
  id uuid default gen_random_uuid() primary key,
  board_id uuid references boards(id) on delete cascade,
  user_id text not null,
  action text not null,
  created_at timestamp with time zone default now()
);
```

5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

```bash
npm run dev        # Development server with Turbopack
npm run build      # Production build
npm run start      # Production server
npm run lint       # ESLint check
npm run format     # Prettier format
```

---

## Architecture Notes

**Server Components + Server Actions** — Data fetching happens on the server via Next.js Server Actions. The client never directly queries Supabase — all mutations go through typed server functions.

**Optimistic UI** — The drag & drop updates the local state immediately for instant feedback, then persists to the database asynchronously.

**SSR-safe DnD** — `BoardView` is loaded with `next/dynamic` and `ssr: false` to avoid hydration mismatches with dnd-kit, wrapped in a thin Client Component to comply with Next.js 15 constraints.

**AI integration** — The Gemini API is called exclusively from a server-side API route (`/api/ai`). The API key is never exposed to the client.

**Mobile layout** — On mobile the drag & drop is replaced by collapsible accordions, one per column. All filters and AI suggestions remain available. Tasks can be moved between columns via the edit dialog's column selector, which only appears on mobile (`showColumnSelect` prop).

---

## License

MIT
