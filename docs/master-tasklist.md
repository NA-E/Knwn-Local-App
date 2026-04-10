# Master Task List — Known Local App

> **Single source of truth for all project work.** Completed items are archived in `docs/archive/`.

## How to Use
- Mark tasks: `[x]` done, `[ ]` not started, `[~]` in progress, `[!]` blocked
- When done, move to `docs/archive/completed-YYYY-MM-DD.md`
- Date-stamp completed items

---

## Blocked — Waiting on People

- [!] **C-2**: Populate `supervised_by` for real team members — needs mapping from Paulo/Clayton
- [!] **I-7**: Clarify writer/senior_writer roles — needs human input from Paulo/Clayton

## Open Bugs

- [ ] **BUG-C1**: Non-admin role access not tested (only admin account available). Sidebar section hiding, server action blocks, RLS enforcement unverified on production.

## Questions — Resolved

- [x] **Q-1**: Dashboard bar chart shows pipeline bottleneck detection — stronger colors + tooltip added (2026-04-10)
- [x] **Q-2**: Chart shows counts not percentages — no ambiguity. Percentages deferred to KPI dashboard (phase 2) (2026-04-10)

## Pre-Module 2: Outstanding Items

- [!] Get `supervised_by` mapping from Paulo/Clayton (C-2) — blocks Senior Writer/Editor boards
- [!] Clarify writer/senior_writer role question with Paulo/Clayton (I-7) — blocks Writer board
- [ ] Get Dropbox API credentials (app key, secret, refresh token)
- [ ] Remove Google Drive integration code (not integrating GDrive)
- [ ] Browser test full onboarding flow (9 test phases in `docs/onboarding-test-plan.md`)
- [ ] Reset admin@knownlocal.com password in Supabase Dashboard (login fails on production)
- [ ] Manual test: Google OAuth sign-in on production

## Module 2: Production Pipeline — IN PROGRESS

> Spec: `SPEC.md` lines 610-619. Plan: `docs/superpowers/specs/`

- [ ] Add bulk status update — multi-select projects, move to next valid status

## Module 3: Team Boards — COMPLETE

> All role boards implemented. My Board page at `/projects/my-board`.

Moved to archive: `docs/archive/completed-2026-04-10.md`

## Module 4: Migration & Polish — Remaining

> Spec: `SPEC.md` lines 635-643.

- [ ] Validate: spot-check 10 clients, 10 projects, all pod assignments, all team members
- [ ] QA with Paulo — verify client data, project statuses, team assignments
- [ ] Bug fixes from QA
- [ ] Set up custom domain (if needed)
- [ ] Team walkthrough — record Loom or live session

## Post-Launch: Security Hardening

- [ ] Consider domain restriction (e.g. only `@knownlocal.com`) as additional OAuth guard

---

*Last updated: 2026-04-10*
*Archive: `docs/archive/completed-2026-04-10.md`*
