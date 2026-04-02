# Module 0+1 Testing & Code Review Tracker

## Testing Plan
1. [x] Module 0 browser test — Auth & Layout (PASS)
2. [x] Module 0.5 browser test — Pods & Team CRUD (PASS)
3. [x] Module 1 browser test — Clients (PASS)
4. [x] Code review all modules (4/4 agents done — 45 bugs found)
5. [x] Fix Phase 1 critical bugs (BUG-0,1,2,3,4,5,6,8,9,10,35,36 — all fixed + verified)
6. [x] Fix Phase 2 medium bugs (13/15 fixed, 2 deferred)
7. [x] Build verification passes (zero TS errors, all 12 routes)
8. [x] SQL migration 004_fixes.sql applied to Supabase
9. [x] Fix Phase 4 low-priority bugs (11/13 fixed, BUG-7 skipped, BUG-21 not a bug)
10. [x] SQL migration 005_phase4_fixes.sql applied to Supabase
11. [x] Browser battlefield test — all pages, CRUD, filters, console clean
12. [ ] Commit Module 0+1

## Browser Testing Results

### Module 0 — Auth & Layout ✅
- Unauthenticated → redirect to /login ✓
- Login page renders (Sora font, brand colors, centered card) ✓
- Login with admin@knownlocal.com / KnownLocal2026! → redirect to /dashboard ✓
- Sidebar: dark bg, role-based sections (CLIENTS, PROJECTS, ADMIN for admin) ✓
- User display "Admin U." at bottom ✓
- Sign Out link present ✓

### Module 0.5 — Pods & Team CRUD ✅
- Pods list shows 4 seed pods with count ✓
- Create Pod dialog works (created "Test Pod 5") ✓
- Edit Pod dialog pre-fills name, button says "Save" ✓
- Team list shows 9 members with Name/Role/Email/Pod(s)/Status columns ✓
- Add Member page: First/Last Name, Email, Role dropdown, Pod checkboxes, Supervised By ✓
- Edit Member page: all fields pre-filled, Pod 1 checked for Clayton ✓

### Module 1 — Clients ✅
- Client List: 3 seed clients, search bar, status/pod filter dropdowns ✓
- Status filter works (URL state ?status=onboarding) ✓
- Client Detail: CLIENT INFO, TEAM, CHANNELS, CONTACTS sections ✓
- Team assignment inline picker: loads eligible members, assignment persists ✓
- Channels: seed data with Edit/Remove/+Add ✓
- Contacts: Add Contact dialog with Name/Email/Phone/Primary/Assistant ✓
- Client Edit: all fields pre-filled ✓
- Client Create: correct defaults (Status=Onboarding, Pod=No pod) ✓

---

## Bug List (Consolidated)

### Phase 1 — Fixed & Verified ✅
- **BUG-0**: Hydration mismatch in `pod-form-dialog.tsx` — DialogTrigger render+children duplicate
- **BUG-1**: Login useActionState refactor (was stuck pending state)
- **BUG-2**: Login input validation (formData null safety)
- **BUG-3**: Middleware cookie forwarding on redirect (was losing token refresh)
- **BUG-4**: user.email null guard in app layout
- **BUG-5**: Missing team_member → redirect instead of silent writer default
- **BUG-6**: Generic login error message (was leaking Supabase internals)
- **BUG-8**: Auth checks added to all 13 mutation server actions
- **BUG-9**: upsertAssignment delete result now checked
- **BUG-10**: updateTeamMember pod delete/insert results now checked
- **BUG-35**: Checkbox hidden input pattern fixed (is_primary/is_assistant)
- **BUG-36**: Suspense boundary added for useSearchParams in client filters

### From Auth & Middleware Review

- **BUG-1 [CRITICAL]**: `login/page.tsx` + `login/actions.ts` — `redirect()` throws inside client-side `await`, manual `setPending` state never resets. Fix: use `useActionState` (React 19) instead of manual state. Action signature needs `prevState` first arg.

- **BUG-2 [MEDIUM]**: `login/actions.ts:9-10` — No input validation, `formData.get()` returns null cast as string. Fix: validate `typeof email !== 'string'` before calling Supabase.

- **BUG-3 [MEDIUM]**: `middleware.ts:30-41` — Redirect responses drop Supabase Set-Cookie headers. Token refresh during `getUser()` writes cookies to `supabaseResponse`, but redirect creates new NextResponse without those cookies. Can cause infinite redirect loop. Fix: copy cookies from `supabaseResponse` onto redirect response.

- **BUG-4 [MEDIUM]**: `(app)/layout.tsx:16,22` — `user.email!` non-null assertion can crash. Fix: guard with `if (!user.email) redirect('/login')`.

- **BUG-5 [MEDIUM]**: `(app)/layout.tsx:19` — Missing team_members record silently defaults to 'writer' role. Fix: redirect to error/not-provisioned page if no record found.

- **BUG-6 [LOW]**: `login/actions.ts:15` — Raw Supabase error messages leak to client (email enumeration). Fix: return generic "Invalid email or password."

- **BUG-7 [LOW]**: No rate limiting on login action. Acceptable for V1 internal app.

### From Server Actions Review

- **BUG-8 [CRITICAL]**: ALL mutation actions lack auth checks. Server actions are callable via direct POST, bypassing middleware. Fix: add `supabase.auth.getUser()` check at top of every mutation.

- **BUG-9 [CRITICAL]**: `client-assignments.ts:10-14` — `upsertAssignment` delete result unchecked. Could create duplicate assignments. Fix: check `{ error }` from delete.

- **BUG-10 [CRITICAL]**: `team-members.ts:106,117` — `updateTeamMember` pod delete and re-insert results unchecked. Delete succeeds + insert fails = data loss (zero pods). Fix: check both errors.

- **BUG-11 [MEDIUM]**: `pods.ts:18,29` — No validation that pod name is non-empty. Empty string passes NOT NULL but creates blank pod. Fix: `if (!name?.trim()) return { error }`.

- **BUG-12 [MEDIUM]**: `clients.ts:72` — `createClientAction` doesn't validate name. Raw Postgres error on null. Fix: validate required fields.

- **BUG-13 [MEDIUM]**: `team-members.ts:61-65` — `createTeamMember` doesn't validate required fields. Fix: validate before query.

- **BUG-14 [MEDIUM]**: `client-channels.ts:12` — `parseFloat("0") || 1` converts 0 to 1. Fix: use `Number.isNaN()` check instead of `||`.

- **BUG-15 [MEDIUM]**: `client-assignments.ts:7` — No role authorization check on assignment modifications. Relies entirely on RLS.

- **BUG-16 [LOW]**: Read actions throw errors vs mutations return them — inconsistent pattern.

- **BUG-17 [LOW]**: `client-assignments.ts:41` — `getEligibleMembers` swallows errors, returns empty array.

- **BUG-18 [LOW]**: `team-members.ts:100` — No status validation against allowed values.

- **BUG-19 [LOW]**: `formData.get() as string` pattern is unsafe across all files.

- **BUG-20 [LOW]**: `clients.ts:40-51` — Fallback query masks root cause of primary query failure. Should log error.

### From Pages & Components Review

- **BUG-35 [CRITICAL]**: `client-contacts-section.tsx:48-54` — Hidden input `value="false"` before checkbox means `formData.get()` always returns "false". is_primary/is_assistant checkboxes never save as true. Fix: remove hidden inputs, use `formData.has()` in server action.

- **BUG-36 [CRITICAL]**: `client-filters.tsx:14` — `useSearchParams()` without Suspense boundary. Will throw in production builds. Fix: wrap `<ClientFilters>` in `<Suspense>` in clients/page.tsx.

- **BUG-37 [MEDIUM]**: `sidebar.tsx:19` — Sidebar highlights two nav items for nested routes. `/clients/new` activates both "Client List" and "Add Client". Fix: check specific paths first or use exact match.

- **BUG-38 [MEDIUM]**: `client-team-section.tsx:21-24` — getEligibleMembers called in useEffect with no .catch(), no loading state, stale data from previous role shown. Fix: add error handling, loading state, reset eligible on role change.

- **BUG-39 [MEDIUM]**: `client-filters.tsx:29-34` — Search fires router.push on every keystroke. No debounce. Fix: add 300ms debounce.

- **BUG-40 [MEDIUM]**: `client-channels-section.tsx:81` — Delete channel has no confirmation and no error feedback. Fix: add confirm dialog, check error result.

- **BUG-41 [MEDIUM]**: `team-member-form.tsx:98-109` — Primary pod select uses defaultValue which doesn't update when selectedPods changes. Fix: use controlled value+onChange or key prop.

- **BUG-42 [MEDIUM]**: `pod-form-dialog.tsx:19,42` — trigger typed as ReactNode but cast to ReactElement. Fix: type prop as ReactElement.

- **BUG-43 [LOW]**: `client-table.tsx:40` — Table rows have cursor-pointer but no onClick. Fix: add row click handler or remove cursor-pointer.

- **BUG-44 [LOW]**: `client-filters.tsx:35-53` — Filter selects missing aria-labels. Fix: add aria-label attrs.

- **BUG-45 [LOW]**: `client-team-section.tsx:21-24` — Race condition: switching roles quickly shows stale eligible list. Fix: add cleanup/abort in useEffect.

- *(Duplicates of earlier bugs: user.email! = BUG-4, upsertAssignment = BUG-9, role default = BUG-5)*

### From SQL Migrations & Types Review

- **BUG-21 [LOW]**: `002_rls.sql:50-55` — Overlapping FOR ALL + FOR SELECT on client_channels/contacts/assignments/projects. Inconsistent pattern but functionally correct.

- **BUG-22 [CRITICAL]**: `002_rls.sql:62-64` — Projects FOR ALL policy blocks Managers/Editors/Writers from UPDATE. No role except admin/strategist/jr_strategist can move projects. Module 2 blocker. Fix: add broad UPDATE policy or plan for Module 2 migration.

- **BUG-23 [MEDIUM]**: `002_rls.sql:67` — project_status_history INSERT allows any user to fabricate audit entries with arbitrary `changed_by`. Fix: `WITH CHECK (changed_by = get_my_team_member_id())`.

- **BUG-24 [LOW]**: `001_schema.sql:132` — Task number LPAD 4 will produce 5+ digit numbers after KN-9999. Not urgent at 2700 start.

- **BUG-25 [MEDIUM]**: `003_seed.sql` — Seed team members have no auth_user_id, so get_my_role()/get_my_team_member_id() return NULL for them. Only admin is linked.

- **BUG-26 [MEDIUM]**: `003_seed.sql` — No seed client_assignments. Board filters will be empty.

- **BUG-27 [MEDIUM]**: `003_seed.sql` — No seed supervised_by. Senior Writer/Editor boards broken.

- **BUG-28 [MEDIUM]**: `003_seed.sql` — No seed projects. Pipeline/Kanban will be empty for Module 2 dev.

- **BUG-29 [MEDIUM]**: `lib/constants/status.ts` — Missing status transition map and transition ownership map. CLAUDE.md references "status machine config" that doesn't exist yet. Required before Module 2.

- **BUG-30 [MEDIUM]**: `lib/constants/status.ts` — Missing status group mapping (TO-DO, PRE-PRODUCTION, etc.) for badge colors and pipeline sections.

- **BUG-31 [LOW]**: No `lib/constants/index.ts` barrel export file.

- **BUG-32 [LOW]**: `001_schema.sql` — No `updated_at` auto-update trigger. `updated_at` will always equal `created_at`. Fix: add trigger function + per-table triggers.

- **BUG-33 [LOW]**: `001_schema.sql` — No index on `client_assignments.assignment_role`. Minor perf for board queries.

- **BUG-34 [LOW]**: `types/database.ts:49` — `TeamMemberPod.is_primary` typed as `boolean` but SQL column is nullable (no NOT NULL). Fix: add NOT NULL to SQL or make type `boolean | null`.

---

## Fix Priority Plan

### Phase 1 — Critical (fix now, Module 0+1)
- BUG-1: Login useActionState refactor
- BUG-3: Middleware cookie forwarding on redirect
- BUG-8: Auth checks in all mutation server actions
- BUG-9: upsertAssignment error check on delete
- BUG-10: updateTeamMember pod delete/insert error checks
- BUG-35: Checkbox hidden input pattern broken (is_primary/is_assistant always false)
- BUG-36: useSearchParams without Suspense boundary

### Phase 2 — Medium (DONE ✅ — except BUG-38,41 deferred to Phase 3)
- BUG-2: ✅ Login input validation (fixed in Phase 1)
- BUG-4: ✅ user.email null guard (fixed in Phase 1)
- BUG-5: ✅ Missing team_member → redirect (fixed in Phase 1)
- BUG-6: ✅ Generic login error message (fixed in Phase 1)
- BUG-11,12,13: ✅ Input validation in pods/clients/team-members actions
- BUG-14: ✅ parseFloat 0 edge case
- BUG-23: ✅ project_status_history changed_by constraint (004_fixes.sql)
- BUG-32: ✅ updated_at trigger (004_fixes.sql)
- BUG-34: ✅ is_primary/is_assistant NOT NULL (004_fixes.sql)
- BUG-37: ✅ Sidebar exact match only (no double-highlight)
- BUG-38: DEFERRED — getEligibleMembers error handling (low impact, fix in Module 2)
- BUG-39: ✅ Search input 300ms debounce
- BUG-40: ✅ Delete channel confirmation + error feedback
- BUG-41: DEFERRED — Primary pod select stale defaultValue (low impact, fix in Module 2)
- BUG-42: ✅ PodFormDialog trigger typed as ReactElement

### Phase 3 — Module 2 prep (fix before Module 2)
- BUG-22: Projects RLS write policies for non-admin roles
- BUG-25,26,27,28: Seed data improvements (auth_user_id, assignments, supervised_by, projects)
- BUG-29,30: Status transition map + status groups in constants
- BUG-31: Constants barrel export
- BUG-38: getEligibleMembers error handling (deferred from Phase 2)
- BUG-41: Primary pod select stale defaultValue (deferred from Phase 2)

### Phase 4 — Low priority (DONE ✅ — BUG-7 skipped per user, BUG-21 not a real bug)
- BUG-7: SKIPPED — Rate limiting (acceptable for internal app)
- BUG-15: ✅ Role authorization on assignments (admin/strategist/jr_strategist check)
- BUG-16: ✅ Error handling consistency (reads log before throw/fallback)
- BUG-17: ✅ getEligibleMembers logs error before returning empty
- BUG-18: ✅ Status validation in updateTeamMember (active/inactive only)
- BUG-19: ✅ formData.get validation (channel_name, email required checks)
- BUG-20: ✅ getClients fallback now logs primary error
- BUG-21: NOT A BUG — FOR ALL + FOR SELECT overlap is intentional (SELECT allows all reads, FOR ALL restricts writes)
- BUG-24: ✅ Task number LPAD 5 (005_phase4_fixes.sql)
- BUG-33: ✅ Index on client_assignments.assignment_role (005_phase4_fixes.sql)
- BUG-43: ✅ Table rows clickable (router.push on row click)
- BUG-44: ✅ Filter selects have aria-labels
- BUG-45: ✅ Race condition fix (ignore flag in useEffect)

## Supabase Details
- Project ref: tcpynxcruaddahdhuugb
- Admin user: admin@knownlocal.com / KnownLocal2026!
- Admin auth UUID: 2ef7e063-6fe3-418e-ab53-0595d7111fa7
- All 5 migrations ran successfully (001_schema, 002_rls, 003_seed, 004_fixes, 005_phase4_fixes)
- Admin team_member INSERT ran successfully
