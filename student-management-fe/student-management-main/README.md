# EduManage

EduManage is a Vietnamese-language school management frontend demo built with Next.js App Router. It currently uses mock data and has no connected backend.

## Stack

- Next.js 16 and React 19
- TypeScript
- Tailwind CSS 4
- Lucide React

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The root route redirects to `/dashboard`.

```bash
npm run lint   # TypeScript check (tsc --noEmit)
npm run build  # Production build
npm start      # Run the production build
```

## Project Structure

```text
src/
├── app/                 # URL routes, root layout, dashboard route group
├── components/
│   ├── layout/          # Shared dashboard shell and navigation
│   └── ui/              # Reusable UI primitives
├── lib/
│   ├── api/             # Generic REST client and endpoint constants
│   ├── auth/            # Demo authentication context
│   └── utils/
├── modules/             # Feature components, hooks, services, mocks, and types
└── types/               # Shared types
```

Feature modules are organized independently, for example:

```text
modules/student/
├── components/
├── hooks/
├── services/
├── mocks/
├── types/
└── constants/
```

The App Router pages should stay small and compose components from their feature modules. Dashboard routes share `DashboardLayout` through `app/(dashboard)/layout.tsx`; the login route is outside that group.

## Data Flow

Current flow:

```text
Route page -> feature component -> hook -> service -> mock data
```

The feature service is the data boundary. The REST client in `src/lib/api` is infrastructure only; existing feature services still use mocks. No frontend code should access Prisma or PostgreSQL directly.

`NEXT_PUBLIC_API_URL` is left blank in `.env.example`. Configure it when connecting the frontend to a backend. Endpoint paths in `src/lib/api/endpoints.ts` are provisional until the backend API contract is finalized. Authentication is also demo-only; the current mock session is not a security boundary.

## Routes

The current app includes login, dashboard, students, teachers, classes, subjects, grades, and attendance routes, including create/detail pages where implemented. `/grades/gradebook` and `/grades/statistics` currently reuse the existing grades screen; `/attendance/warnings` reuses the existing attendance screen with its warning widget.

Subject detail and edit routes are available at `/subjects/[id]` and `/subjects/[id]/edit`. Editing reuses the existing subject configuration modal and mock service.
