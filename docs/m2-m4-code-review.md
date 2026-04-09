# Module 2-4 Code Review — 2026-04-09

3 parallel review agents, consolidated findings. Fixes applied inline.

---

## Summary

| Area | Critical | Medium | Low | Total |
|------|----------|--------|-----|-------|
| Backend (actions, migrations) | 3 | 10 | 12 | 25 |
| Kanban & Board UI | 0 | 4 | 21 | 25 |
| Detail & Portal UI | 2 | 11 | 15 | 28 |
| **Total** | **5** | **25** | **48** | **78** |

---

## Critical Findings (all fixed)

### 1. Portal RLS exposes full client data to anon users
**File:** `supabase/migrations/011_client_portal_token.sql`
**Issue:** `portal_token_public_read` policy granted SELECT on ALL columns to anon role.
**Fix:** Removed anon RLS policy entirely — portal uses service-role client.

### 2. Portal tokens have no expiry
**File:** `lib/actions/client-portal.ts`, migration 011
**Issue:** Once generated, tokens were valid forever.
**Fix:** Added `portal_token_expires_at` column. Tokens expire in 90 days. Checked on lookup.

### 3. Portal returns all client/project columns via service-role
**File:** `lib/actions/client-portal.ts`
**Issue:** `select('*')` exposed email, phone, special_instructions, etc.
**Fix:** Restricted to only portal-needed columns. Added UUID format validation on token.

### 4. Feedback field mismatch breaks rejection transitions
**Files:** `components/projects/status-actions.tsx`, `components/projects/project-sidebar.tsx`
**Issue:** Form sends `notes` but server action checks `metadata.feedback`. All fix_script and internal_adjustments_needed transitions would fail.
**Fix:** Sidebar's handleTransition now maps `data.notes` to both `metadata.feedback` and `metadata.notes`.

### 5. Null dereference in project detail page
**File:** `app/(app)/projects/[id]/page.tsx`
**Issue:** `user!.id` crashes if session expired. No member check.
**Fix:** Added null guards for both user and member with redirect to /login.

---

## Medium Findings (fixed)

### Fixed

- **PostgREST filter injection** (`project-filters.ts`): `team_member_id` interpolated into `.or()` without validation. Added UUID regex check.
- **Column injection via date_field** (`project-filters.ts`): Server action accepted any column name. Added runtime allowlist check.
- **Senior role permission gap** (`projects.ts`): senior_editor, senior_writer, senior_designer blocked by app-level check despite having DB-level permission. Added to FULL_UPDATE_ROLES.
- **Stuck count inconsistency** (`project-filters.ts` vs `dashboard.ts`): getStuckProjects didn't exclude on_hold; dashboard did. Added on_hold to exclusion.
- **Card hover lift violates brand.md** (`project-card.tsx`): `hover:-translate-y-0.5` removed.
- **Duplicate STATUS_LABELS** (`project-transitions.ts`): Replaced with canonical PROJECT_STATUS_LABELS import.
- **TOCTOU race condition** (`project-transitions.ts`): Added `.eq('status', fromStatus)` optimistic concurrency check.
- **Pipeline page missing auth guard** (`pipeline/page.tsx`): Added null checks matching my-board pattern.
- **Internal status labels shown to clients** (`client/[token]/page.tsx`): Added client-friendly status mapping. Hidden cancelled/idea projects.
- **Task number font weight** (`project-detail-header.tsx`): Changed from font-bold to font-normal per brand.md.

### Deferred to next sprint

- **Keyboard DnD accessibility**: @atlaskit/pragmatic-drag-and-drop needs separate keyboard package
- **defaultValue vs value on filter selects**: Won't sync with back/forward navigation (consistent with client-filters.tsx pattern)
- **Activity log cleanup on unmount**: useTransition fetch has no abort mechanism
- **Version radio hardcoded [1,2,3]**: Should be dynamic based on edit_version
- **Portal rate limiting**: UUID space is large enough for V1 but should be added
- **Create form label-input association**: Missing htmlFor/id pairs (a11y)
- **Pipeline/my-board client wrapper duplication**: Could extract shared KanbanBoardClient

---

## Low Findings (not fixed — acceptable for V1)

### Backend
- Duplicated getCurrentTeamMember across 5 files (extract later)
- getProject throws vs returns error (inconsistent but matches M1 pattern)
- `as any` casts on Supabase join data
- Missing revalidatePath for client page on project update
- No auth check in getProjectsForPipeline (RLS handles it)
- No auth check in getDashboardStats (RLS handles it)
- Slack .single() could fail if multiple senior editors assigned

### Kanban & Board UI
- GROUP_PILL_COLORS duplicates STATUS_GROUP_COLORS concept
- Drop zone is inner scroll area only (not column header)
- Cyan drop feedback not in brand system
- Valid/invalid only shown on hover, not all valid columns during drag
- Drag shadow heavier than brand.md max
- Design status tinted container not in brand spec
- Card padding py mismatch (14px vs 12px spec)
- Drag preconditions not checked client-side (server rejects with toast)
- kanban-filters hardcodes /projects/pipeline path
- `{} as any` for projectsByStatus init
- Dashboard bar chart text class has no effect on fill div
- Dashboard stat cards grid not responsive
- Stat card accent colors not in brand system
- Table header text-muted-foreground vs brand.md text-3

### Detail & Portal UI
- Header bg hardcoded instead of CSS var
- No feedback when empty title silently reverts
- Notes save button briefly incorrect during re-render
- No URL validation on project links (javascript: defense)
- Activity log timeline dot centering is pixel-precise
- Load more button missing focus outline
- Cancel button uses router.back() not predictable route
- Portal layout lacks footer
- Portal table not responsive for mobile
- Portal regenerate link has no confirmation dialog

---

## Overall Assessment

**Code quality: Strong.** Architecture is clean — server/client boundaries are correct, the status machine is well-implemented with precondition checks and Slack notifications, and the brand design system is followed consistently.

**Security: Good after fixes.** The portal security surface was the main concern — now addressed with column restriction, token expiry, UUID validation, and removed anon RLS policy. The TOCTOU fix adds optimistic concurrency to transitions.

**UI consistency: Good.** All components follow brand.md conventions (font sizes, colors, spacing, shadows). The portal has a distinct light theme. Minor deviations noted but acceptable for V1.

**Build: Clean.** Zero TypeScript errors across all 20 routes.
