# Known Local App

## What This Is
Internal ops app for a YouTube content agency. Client management, production pipeline (Kanban), role-specific team boards. Read SPEC.md before doing anything.

## Stack
- Next.js 14+ (App Router, Server Actions, Server Components)
- Supabase (PostgreSQL, Auth, RLS)
- TypeScript (strict mode)
- Tailwind CSS + shadcn/ui
- Deployed on Vercel

## Code Style
- Use ES modules (import/export)
- Prefer Server Components. Use 'use client' only when needed (interactivity, hooks)
- Server Actions for all data mutations — no API routes
- Use Supabase SSR client pattern (createServerClient / createBrowserClient)
- Colocate components with their page when page-specific
- Shared components go in /components/ui (shadcn) or /components/shared

## Project Structure
```
/app              → Pages (App Router)
/app/api          → Only if absolutely necessary
/components       → Shared and UI components
/lib              → Supabase client, utils, types, constants
/lib/supabase     → Server/client Supabase helpers
/lib/types        → TypeScript types matching DB schema
/lib/constants    → Enums, status machine config, role configs
/lib/actions      → Server Actions organized by entity
```

## Database
- All queries through Supabase JS client — no raw SQL in app code
- RLS policies enforce access — never filter by role in application code alone
- Status transitions validated in server actions before DB update
- Use the status machine config in /lib/constants — single source of truth

## Key Patterns
- Kanban board is a reusable component configured per role
- Role → board config mapping lives in /lib/constants
- Project cards are a shared component used across all boards
- Client assignments use a junction table, not separate columns per role

## Build Order
Module 0 → 1 → 2 → 3 → 4. Commit after each module. See SPEC.md for details.

## Do NOT
- Implement anything listed in "Out of Scope for V1" in SPEC.md
- Add API routes when Server Actions work
- Use client-side state management libraries (no Redux, Zustand) — server components + URL state
- Over-engineer auth — email/password only, no social providers
