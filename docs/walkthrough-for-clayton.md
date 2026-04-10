# Known Local App — Screen-by-Screen Walkthrough for Clayton

> Written: 2026-04-10
> URL: https://knwn-local-app-production.up.railway.app
> Login: admin@knownlocal.com (or Google OAuth with a known team email)

---

## Why This App Exists

You guys run ~80 clients across 4 pods using Notion. Notion works for tracking but it doesn't enforce your workflow — anyone can move anything, there's no status machine, no role-based views, no onboarding automation. This app replaces that with a purpose-built ops tool: client management, a production pipeline with enforced statuses, and role-specific boards so each person only sees what they need to act on.

---

## 1. Login Page (`/login`)

**What you see:** "Known Local" heading, Google OAuth button, email/password fields.

**How it works:** Two login methods — Google OAuth (preferred for the team) or email/password. When someone logs in with Google, the app looks up their email in the `team_members` table. If they match, they're linked automatically. If the email isn't recognized, they get bounced to an access-denied page — no stranger can create an account by signing in with Google.

**Why:** We need to control who gets in. No self-signup. Admin creates team members first, then they can sign in.

---

## 2. Dashboard (`/dashboard`)

**What you see:** Four count cards at the top — Active Clients (77), Active Projects (12), Stuck Projects (0), Completed This Month (0). Below that, a horizontal bar chart showing projects by stage (To-Do, Pre-Production, Production, Post-Production, Complete). At the bottom, a Stuck Projects table.

**What the data means:**
- **77 Active Clients** — these are the real clients from your Notion export. We imported 74 active + 6 onboarding + Tucker Cummings (new) + a couple test clients.
- **12 Active Projects** — these are dummy/test projects for now. Real project data will come once you and Paulo start creating projects through the pipeline.
- **Stuck Projects** — projects that have been sitting in the same status too long. Currently 0 because the test projects are fresh.
- **Bar chart** — shows where projects are bottlenecking. If 15 projects pile up in "Editing" and 0 are in "Post-Production", you know there's a jam.

**Who sees this:** Admin, Strategist, Jr Strategist only. Writers/Editors/etc don't see the dashboard — they go straight to their board.

---

## 3. Client List (`/clients`)

**What you see:** A searchable, filterable table of all 83 clients. Columns: CLIENT, MARKET, POD, CONTRACT START, STATUS. Filters for status (Active, Onboarding, etc.) and pod. Search box for quick name lookup.

**What the data means:** This is your real Notion data — every active and onboarding client, their market area, which pod they belong to, when they started, and their status. The pod badges (Pod 1, Pod 2, ELLA, etc.) match your existing pod structure.

**Why we built it this way:** The table is sorted alphabetically, all clients on one page (no pagination needed for ~80 clients). You can quickly filter to see "show me all Pod 2 onboarding clients" or search "Ryan" to find Ryan Butler, Ryan Meeks, and Ryan Meeks - WHIP.

**Known items to clean up:**
- 2 "TEST CLIENT — Delete Me" entries from earlier testing
- Long market names (e.g. "Raleigh, Research Triangle (Durham, Chapel Hill)") stretch the MARKET column — we need text wrapping
- Column sorting (click header to sort) coming soon

---

## 4. Client Detail (`/clients/[id]`)

**What you see:** Two-column layout. Left card is CLIENT INFO, right card is TEAM.

**Left card (CLIENT INFO):**
- **Health** — color-coded badge: green "On Track", amber "At Risk", red "Off Track". This is the new field Paulo's been filling in on clients.
- **Package** — YouTube, etc.
- **Contract Start** — when the client started.
- **Posting Schedule, Script Format, Communication** — operational details from Notion.
- **Approval Emails** — who needs to approve content before posting (pulled from Notion).
- **Special Notes** — free-text notes about the client (the stuff that used to live in Notion comments).
- **Links section** — Brand Voice Guide, Area Guide, Dropbox, Slack Channel, Website. Each has an "Open" link that takes you directly there.

**Right card (TEAM):**
- Shows every assignment role: Strategist, Manager, Senior Writer, Senior Editor, Editor, Designer, Senior Designer.
- Displays the actual team member name for each slot (or "—" if unassigned).
- These come from `client_assignments` — the same data structure as Notion's assignment columns but normalized.

**Below the cards (scroll down):**
- **YouTube Channels** — channel name, videos per week. Edit/Remove/Add buttons.
- **Contacts** — client contact info with Primary/Assistant badges, email as mailto link.
- **Client Access** — the portal link for sharing with clients. Copy/Open buttons.
- **File Upload Link** — Dropbox request link for client file uploads.

**Why this layout:** Everything the team needs about a client is on one page. No clicking through tabs. The two-column layout puts the operational info (left) next to the team assignments (right) so you can see both at a glance.

---

## 5. Client Create (`/clients/new`) & Client Edit (`/clients/[id]/edit`)

**What you see:** A form with all the same fields as the detail page, plus pod selection.

**Pod selection** is a row of visual cards showing each pod's name, current client count, and a capacity bar (X/20). Green bar means room, red means over capacity. Clicking a pod auto-populates the Strategist and Manager dropdowns with that pod's assigned team members.

**New fields we added:**
- **Health dropdown** — On Track / At Risk / Off Track
- **Approval Emails** — text field for comma-separated emails
- **Brand Voice Guide URL** — link to the Google Doc
- **Area Guide URL** — link to the Google Doc

**Why:** These fields came from the Notion client database. Paulo had been tracking health, approval contacts, and guide links there. Now they're first-class fields in the app.

---

## 6. Team Management (`/team`) — Admin Only

**What you see:** Table of all 57 team members. Columns: NAME, ROLE, EMAIL, POD(S), STATUS. Filters for role, pod, and status.

**What the data means:** This is your full team roster from Notion, including the 20 new members we added in the latest migration. Every person has a role (Admin, Strategist, Manager, Senior Editor, Editor, Writer, Designer, Virtual Assistant), one or more pod assignments, and a status.

**Status values:** Active, Inactive, Onboarding, Contract Paused, Offboarded. These match the statuses Paulo tracks in Notion.

**Edit form** includes: first name, last name, email, phone (new field), role dropdown, status dropdown, pod checkboxes, supervised_by dropdown.

**Why admin only:** Only admins should be adding/editing team members. The server actions enforce this — even if someone types the URL directly, they get blocked.

---

## 7. Pods Management (`/pods`) — Admin Only

**What you see:** Left panel lists all 6 pods (ELLA, Pod 1-4, Test Pod 5) with member counts. Click a pod to see its members on the right: NAME, ROLE, STATUS.

**What the data means:** Pods are your organizational units. ELLA has 4 members, Pod 1 has 26, Pod 2 has 22, etc. This matches your Notion pod structure. Members can belong to multiple pods (you'll see editors assigned to Pod 1 and Pod 2, for example).

**Why:** Gives you a quick view of pod composition and balance. When onboarding a new client, you can see which pods have capacity.

---

## 8. Project Pipeline (`/projects/pipeline`)

**What you see:** A Kanban-style board with projects grouped into phase rows: To-Do, Pre-Production, Production, Post-Production, Complete. Each row can be collapsed/expanded. Cards show project title, client name, writer, editor, design status, and days in current status.

**Filters:** Pod, Client, Status Group, Team Member. You can drill down to "show me all Pod 2 projects in Production" or "show me everything assigned to Diego".

**Drag and drop:** You can drag a card from one status to another. The app validates the move and logs it in the status history.

**Current state:** We just relaxed the transition rules — for now, you can move any project to any status. This is intentional for the testing/setup phase. Once roles are locked in and Paulo confirms the workflow, we'll re-enable the strict state machine (e.g., can't skip from "Script Writing" to "Posted" without going through review).

**Why stacked rows instead of horizontal scroll:** With 17 possible statuses, a single horizontal row would require endless scrolling. The grouped rows (5 phases) keep everything visible and let you collapse phases you don't care about.

---

## 9. Project Detail (`/projects/[id]`)

**What you see:** Project title (editable inline), status badge, design status dot, version badge. Activity log showing status history with timestamps. Sidebar with client link, writer/editor, dates, and project links (script URL, edit URL, thumbnail URL).

**Status actions:** Buttons to move the project to its next valid status. Since we relaxed transitions, you'll see all possible statuses listed.

**Conditional forms:** Some transitions require data — moving to "Fix Script" requires feedback text, moving to "Ready for Internal Review" requires an edit URL. The form pops up inline.

**Why:** This is where the actual work happens. A writer opens their project, sees the script URL, clicks "Submit for Review", and the senior writer gets notified. The activity log creates an audit trail.

---

## 10. My Board (`/projects/my-board`)

**What you see:** A filtered Kanban board showing only projects relevant to YOUR role. If you're a writer, you see your writing assignments. If you're a senior editor, you see projects waiting for your review.

**Why:** The full pipeline shows everything. My Board shows only what YOU need to act on today. Reduces noise.

---

## 11. Client Portal (`/client/[token]`)

**What you see:** A simple public page (no login required) showing the client's name, their active projects with statuses, and YouTube channels. No internal data exposed — no team assignments, contacts, or special notes.

**How it works:** Each client gets a unique magic link token. You share the link via Slack. The client can bookmark it and check project status anytime without needing to message the team.

**Why:** Clients kept asking "where's my video?" This gives them self-service visibility without exposing your internal process.

---

## What's Real vs. Test Data

| Data | Source | Status |
|------|--------|--------|
| Clients (83) | Notion export | Real — 77 active, 6 onboarding, all fields migrated |
| Team Members (57) | Notion export | Real — names, emails, roles, pods, phones |
| Client Assignments (306) | Notion export | Real — strategist, manager, editor, designer per client |
| YouTube Channels (77) | Notion export | Real |
| Contacts (40) | Notion export | Real |
| Projects (12) | Test/dummy data | NOT real — placeholder for testing the pipeline |
| Health / Brand Voice / Area Guide | Notion export | Real — 71 clients updated |

---

## What's Still in Progress

1. **Data cleanup** — Paulo needs to answer questions about missing names, roles, and the supervised_by mapping (see separate doc)
2. **Real projects** — the 12 projects are dummies. Real projects will be created through the pipeline once you start using it.
3. **Dropbox integration** — onboarding automation creates Slack channels automatically, but Dropbox folder creation needs API credentials
4. **Non-admin role testing** — we've only tested as admin. Need to verify that writers/editors see the right things.
5. **Column sorting and text wrapping** on the client list table
6. **YouTube channel URLs** need to show on the channel section in client detail

---

## How to Test

1. Go to https://knwn-local-app-production.up.railway.app
2. Sign in with Google (your Known Local email must be in the team_members table) or email/password
3. Click through: Client List → pick a client → see their detail → click Edit → see the form
4. Go to Pipeline → drag a test project between statuses
5. Check My Board — it shows projects based on your role
6. Try the filters on every page

If anything looks wrong or missing, note the client name and what you expected vs. what you saw. We'll fix it.
