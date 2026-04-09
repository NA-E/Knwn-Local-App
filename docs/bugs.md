# Bug & Issue Tracker

> Running list of bugs, issues, and improvements. Move to Fixed when resolved.

---

## Open

### From Production Testing (2026-04-10)

- **BUG-P1**: Pipeline project cards are drag-only — no click-to-navigate to project detail page. Cards use `cursor-grab` with no onClick handler. Users must access project detail via direct URL or other means.
- **BUG-P2**: Google OAuth sign-in untested on production — cross-origin redirect blocks automation. Needs manual human test.
- **BUG-P3**: Client portal magic link sign-in untested on production.

### From Checklist Items Not Yet Verified

- **BUG-C1**: Non-admin role access not tested (only admin account available for testing). Sidebar section hiding, server action blocks, RLS enforcement all unverified on production.
- **BUG-C2**: Drag-and-drop transition validation untested on production (complex browser interaction).
- **BUG-C3**: Pagination on client list untested (need to filter to >25 results and verify Previous/Next).

### Deferred from Module 0+1

- **BUG-38**: `client-team-section.tsx` — getEligibleMembers called in useEffect with no .catch(), no loading state. Low impact.
- **BUG-41**: `team-member-form.tsx` — Primary pod select uses defaultValue which doesn't update when selectedPods changes. Low impact.

### Blocked

- **C-2**: Populate `supervised_by` for real team members — needs mapping from Paulo/Clayton.
- **I-7**: Clarify writer/senior_writer roles — needs human input from Paulo/Clayton.

---

## Recently Fixed (2026-04-10)

- Removed "Add Client" from sidebar nav (user request)
- Removed Vid/wk column from client list table (user request)
- Removed KN-#### task number from kanban project cards (user request)
- Removed card count badges from kanban column headers (user request)

---

## Fixed (Module 0+1 — Full History)

> See `docs/module01-test-review.md` for complete Phase 1-4 bug fix history (45 bugs).

---

*Last updated: 2026-04-10*
