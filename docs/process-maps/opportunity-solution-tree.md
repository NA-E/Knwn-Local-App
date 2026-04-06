# Opportunity Solution Tree — Known Local App

> **Date:** 2026-04-06
> **Framework:** Teresa Torres, *Continuous Discovery Habits*
> **Data Sources:** 2 discovery calls (Clayton+Paulo+Nourin), as-is process map (13 pain points), Clayton's Loom walkthrough
> **Constraint:** Notion is being fully replaced by this app — no Notion in any solution.

---

## Desired Outcome

**"100% operational consistency — no client falls through the cracks."**

Measurable targets:
- Zero missed onboarding steps (currently: unknown miss rate, no detection mechanism)
- <5 min active human time per client onboard (currently: unknown, ad-hoc, multi-person)
- 100% KPI data capture (currently: 0% call logging for some strategists, 0% videos-launched for some pods)
- Single app replaces Notion + GDrive + manual Slack coordination

---

## Opportunity Map

```
                    100% operational consistency
                    no client falls through the cracks
                                |
        ┌───────────┬───────────┼───────────┬───────────┬───────────┐
        |           |           |           |           |           |
   [O1] No one  [O2] Client  [O3] Clients [O4] KPI   [O5] File  [O6] Production
   owns onboard info is     have no      data is    system is  handoffs are
   -ing — steps scattered   self-service manual &   fragmented invisible &
   get missed   across 4+   visibility   unreliable & messy    unstructured
                tools
```

---

## Opportunities (Ranked by Opportunity Score)

Scoring: **Importance × (1 − Satisfaction)** where both are 0–1.

| # | Opportunity | Importance | Satisfaction | Score | Evidence |
|---|------------|------------|-------------|-------|----------|
| **O1** | No one owns onboarding — steps get missed, no checklist, no verification | 0.95 | 0.10 | **0.86** | Clayton: "We don't have it down to a super process." Paulo: "There's not like a set person." Both confirmed steps can be missed with no detection. |
| **O2** | Client info scattered across Notion, Dropbox, GDrive, Slack — no single source of truth | 0.90 | 0.15 | **0.77** | Clayton: "One's in this drive that's in another email... it's just a little annoying." Dropbox under team@, GDrive under management@, access methods differ per person. |
| **O3** | Clients have no self-service visibility — can't find upload link, no project status, review links sent ad-hoc | 0.80 | 0.10 | **0.72** | Paulo unsure how clients re-find File Request link: "I could be wrong." Upload links saved in Slack canvas (unreliable). Review links sent manually by YouTube manager. |
| **O4** | KPI data is manual and unreliable — people don't log things, Notion relations break | 0.85 | 0.20 | **0.68** | Strategists: 0% call logging two months running. Videos launched: 0% due to untagged tasks. Paulo spent "significant time" on Notion KPI dashboards that don't work. Retention data only exists for 1 of 4 pods. |
| **O5** | File system fragmented — B-roll disorganized, assets split across tools, GDrive "a bit messy" | 0.60 | 0.25 | **0.45** | B-roll: "not working like it should." Assets folder: "a bit broken." GDrive downloads fail for >10 GB. Only reason for GDrive: "great integration for docs." |
| **O6** | Production handoffs rely on Slack threads — no structured audit trail, review decisions scattered | 0.70 | 0.35 | **0.46** | Edit submission → Slack notification → review discussion in Slack threads. Senior editor reply = approval. YouTube manager relays client feedback. No log beyond Slack. |

**Focus:** O1, O2, O3 (top 3 by score). O4 is high importance but partially deferred to Module 4.

---

## Solutions & Experiments

### O1: No one owns onboarding — steps get missed (Score: 0.86)

| Solution | Perspective | Description |
|----------|------------|-------------|
| **S1a. Automated onboarding pipeline** | Engineer | Create client in app → fire-and-forget API triggers Slack channel + Dropbox folder + File Request link creation in parallel. Realtime modal shows progress (spinner/tick/X). Already designed in `docs/superpowers/specs/2026-04-03-client-onboarding-automation.md`. | 
| **S1b. Onboarding checklist with step tracking** | PM | Each client gets an `onboarding_steps` table with status per step (pending/in_progress/done/failed). App shows which steps are complete, which failed, which need manual action (like pod assignment). |
| **S1c. Pod assignment prompt** | Designer | After automated steps complete, surface a notification/task to Clayton: "New client [Name] ready for pod assignment. Current capacity: Pod 1: 20, Pod 2: 18, Pod 3: 15, Pod 4: 12." One-click assignment. |

**Experiments:**

| # | Hypothesis | Method | Metric | Threshold |
|---|-----------|--------|--------|-----------|
| E1a | Automated onboarding reduces active time to <5 min | Build the API route + modal (already spec'd). Test with next 3 real client onboards. | Active human time per onboard | <5 min (currently unknown but "whoever is available" implies >15 min) |
| E1b | Step tracking prevents missed steps | After automation, review `onboarding_steps` table for 10 clients. Check for any steps left in "pending" after 24h. | Missed step rate | 0% |

---

### O2: Client info scattered across 4+ tools (Score: 0.77)

| Solution | Perspective | Description |
|----------|------------|-------------|
| **S2a. Client profile as single source of truth** | PM | Client record in app stores: contact info, pod, team assignments, Dropbox File Request URL, Google Doc links (scripts/resources), brand assets, channel info. Everything linkable from one page. |
| **S2b. Per-client document library (replaces GDrive navigation)** | Engineer | Two sections on client profile: "Scripts" (links to Google Docs, one per project) and "Resources" (brand voice guide, geographic context, climate, writing guidelines). Clickable links open Docs in new tab. GDrive folder becomes unnecessary. |
| **S2c. Dropbox integration links** | Engineer | Store Dropbox folder URL + File Request URL on client record. Display prominently. Team never needs to navigate Dropbox to find a client's folder — they click from the app. |

**Experiments:**

| # | Hypothesis | Method | Metric | Threshold |
|---|-----------|--------|--------|-----------|
| E2a | Team stops opening GDrive directly after doc links are in the app | Add doc link fields to client profile. Ask Paulo + 2 team members to use for 1 week. | "Did you open GDrive directly this week?" | 0 times for routine doc access |
| E2b | File Request link on client profile eliminates Slack canvas hunting | Store link on client record, show it on the profile page. Ask YouTube managers if they still need Slack canvas for the link. | Usage of Slack canvas for upload links | Drops to 0 |

---

### O3: Clients have no self-service visibility (Score: 0.72)

| Solution | Perspective | Description |
|----------|------------|-------------|
| **S3a. Client-facing dashboard** | Designer | Read-only portal per client: upload link (always visible), videos in review (with Dropbox comment link), published video archive, brand documents, project status. No Dropbox/Slack hunting. |
| **S3b. Auto-share review links** | Engineer | When project status changes to "ready for client review," auto-generate a notification with the Dropbox V2 link. Store V1/V2/V3 links on the project record. YouTube manager clicks "send to client" instead of manually finding and sharing links. |
| **S3c. Upload link persistence** | PM | File Request URL stored on client record and displayed on client dashboard. Client bookmarks the dashboard — never needs to search Slack canvas again. |

**Experiments:**

| # | Hypothesis | Method | Metric | Threshold |
|---|-----------|--------|--------|-----------|
| E3a | Client dashboard reduces "where's my upload link?" questions | Build MVP dashboard (upload link + project status only). Deploy for 5 clients. Track Slack questions about upload links. | "Where's my link?" messages per week | Drop by >80% |
| E3b | Auto-share review links reduces YouTube manager manual work | Add "send review link" button to project card. Track if YouTube managers stop manually finding Dropbox links. | Manual link-hunting time per review cycle | <1 min (vs current unknown) |

---

### O4: KPI data is manual and unreliable (Score: 0.68)

*Deferred to Module 4, but the data capture must be built into Modules 2-3.*

| Solution | Perspective | Description |
|----------|------------|-------------|
| **S4a. Auto-timestamp on key actions** | Engineer | When a script link is pasted on a project → capture timestamp. When an edit is submitted → capture timestamp. When video is published → capture timestamp. Compare each against due dates. Binary 1/0 on-time score. Replicates Notion's KPI logic but without manual entry. |
| **S4b. KPI dashboard (Module 4)** | PM | Per-team-member and per-pod rollups: calls %, videos launched %, on-time %, retention. Clayton + Andrew view. Replaces Notion's broken visual dashboards. |
| **S4c. Required fields prevent empty data** | Engineer | Script link field required before project can move to "script complete." Writer assignment required on project creation. Prevents the "this should not be empty, but okay" problem. |

**Experiments:**

| # | Hypothesis | Method | Metric | Threshold |
|---|-----------|--------|--------|-----------|
| E4a | Auto-timestamps eliminate 0% KPI problem | Build timestamp capture into project status transitions. After 1 month, compare on-time data completeness vs Notion. | Data completeness (% of projects with timestamps) | >95% (vs current ~50% estimated) |

---

### O5: File system fragmented (Score: 0.45)

*Lower priority — addressed partially by O2 solutions.*

| Solution | Perspective | Description |
|----------|------------|-------------|
| **S5a. App as link aggregator** | PM | App doesn't store files — it stores URLs. Dropbox for video, Google Docs for scripts (opened via links from app). One tool to navigate, actual files stay where they work best. |
| **S5b. Deprecate GDrive folder creation in onboarding** | Engineer | If doc links live in the app, stop creating per-client GDrive folders. Scripts created as standalone Google Docs, linked from project records. Resources linked from client profile. Requires Clayton + writing team sign-off. |

---

### O6: Production handoffs invisible (Score: 0.46)

*Addressed in Module 2 (Kanban) + Module 3 (Role Boards).*

| Solution | Perspective | Description |
|----------|------------|-------------|
| **S6a. Kanban status transitions replace Slack threads** | PM | Project card status changes trigger notifications (in-app + Slack). Each status change logged in `project_status_history`. Replaces Slack thread as audit trail. |
| **S6b. Edit submission as project action** | Engineer | "Submit Edit" button on project card. Selects version (V1/V2/V3), pastes Dropbox link. Triggers notification to senior editor + YouTube manager. Replaces Notion edit submission form. |
| **S6c. Version tracking on project record** | Designer | Project detail page shows V1/V2/V3 with Dropbox links and review status. Senior editor clicks "approve" or "request changes." YouTube manager clicks "send to client." All logged. |

---

## Visual Tree Summary

```
100% operational consistency — no client falls through the cracks
│
├── O1: No one owns onboarding (0.86) ★ TOP PRIORITY
│   ├── S1a: Automated onboarding pipeline (API + realtime modal)
│   │   └── E1a: Test with next 3 real onboards → <5 min active time
│   ├── S1b: Onboarding checklist with step tracking
│   │   └── E1b: Check onboarding_steps for 10 clients → 0% missed
│   └── S1c: Pod assignment prompt with capacity data
│
├── O2: Client info scattered across 4+ tools (0.77) ★ HIGH
│   ├── S2a: Client profile as single source of truth
│   ├── S2b: Per-client document library (replaces GDrive navigation)
│   │   └── E2a: 1-week test → 0 direct GDrive opens for routine access
│   └── S2c: Dropbox integration links on client record
│       └── E2b: Upload link on profile → Slack canvas usage drops to 0
│
├── O3: Clients have no self-service visibility (0.72) ★ HIGH
│   ├── S3a: Client-facing dashboard (upload link, review links, status)
│   │   └── E3a: MVP for 5 clients → 80% drop in "where's my link?" msgs
│   ├── S3b: Auto-share review links on status change
│   │   └── E3b: "Send review link" button → <1 min per review cycle
│   └── S3c: Upload link persistence on client record
│
├── O4: KPI data manual & unreliable (0.68) — Module 4, data capture in M2-3
│   ├── S4a: Auto-timestamp on key actions (script pasted, edit submitted, published)
│   │   └── E4a: 1-month comparison → >95% data completeness
│   ├── S4b: KPI dashboard (calls %, videos launched %, on-time %, retention)
│   └── S4c: Required fields prevent empty data
│
├── O5: File system fragmented (0.45) — partially solved by O2
│   ├── S5a: App as link aggregator (URLs, not files)
│   └── S5b: Deprecate GDrive folder creation (needs Clayton sign-off)
│
└── O6: Production handoffs invisible (0.46) — Module 2-3
    ├── S6a: Kanban status transitions replace Slack threads
    ├── S6b: Edit submission as project action (replaces Notion form)
    └── S6c: Version tracking on project record (V1/V2/V3 + Dropbox links)
```

---

## Mapping to Build Order

| Module | Opportunities Addressed | Key Solutions |
|--------|------------------------|---------------|
| **Module 1 (Clients)** — done | O2 (partial) | S2a: client profile as source of truth |
| **Module 1.5 (Onboarding Automation)** — spec'd, not built | O1, O2 (partial) | S1a, S1b, S1c, S2c |
| **Module 2 (Kanban)** — next | O6, O4 (data capture) | S6a, S6b, S6c, S4a, S4c |
| **Module 3 (Role Boards)** | O6 | S6a (role-specific views) |
| **Module 4 (Admin/KPIs)** | O4 | S4b: KPI dashboard |
| **New: Client Dashboard** | O3 | S3a, S3b, S3c |
| **New: GDrive Replacement** | O2, O5 | S2b, S5a, S5b |

---

## Decisions Needed

1. **When to build client dashboard?** Depends on project status data (Module 2). Suggested: after Module 2, before or alongside Module 3.
2. **GDrive elimination:** Need Clayton + writing team sign-off. Can be phased — start by adding doc links to client profiles (Module 1 enhancement), then stop creating GDrive folders once links are reliable.
3. **KPI module priority:** Clayton and Paulo both said the app would handle it better than Notion. Data capture should be built into Module 2 status transitions so KPI dashboards (Module 4) have data from day one.

---

## Open Risks

| Risk | Type | Mitigation |
|------|------|------------|
| Onboarding automation depends on 3 external APIs (Slack, Dropbox, GDrive) — any could fail | Feasibility | Already designed with retry + manual fallback in the automation spec |
| Writing team may resist losing GDrive | Value | Phase it — add doc links first, deprecate GDrive creation only after confirmed adoption |
| KPI auto-capture requires disciplined status transitions | Value | Required fields (S4c) + team training. If people skip status updates, KPIs will still be wrong |
| Client dashboard scope could expand unboundedly | Viability | MVP: upload link + project status + review links only. No messaging, no billing, no analytics |
| 15 discovery gaps still open — we may be designing with incomplete information | Value | Schedule focused follow-up call for the 5 critical gaps (trigger, source of truth, notifications, assignment authority, first project creation) |
