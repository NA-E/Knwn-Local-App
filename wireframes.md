# Known Local — Wireframes (Pre-Build Review)

Minimal wireframes for Clayton + Paulo sign-off before any code is written.
Pages covered: Client List, Add Client, Client Detail, Project Detail, Full Pipeline Kanban, My Board (Strategist), Dashboard.

---

## 1. App Shell (All Pages)

```
┌─────────────────────────────────────────────────────────────────────┐
│  KNOWN LOCAL                                        [User: Paulo ▾] │
├──────────────┬──────────────────────────────────────────────────────┤
│              │                                                       │
│  Dashboard   │                                                       │
│              │         [page content]                                │
│  Clients ▾   │                                                       │
│   Client List│                                                       │
│   Add Client │                                                       │
│              │                                                       │
│  Projects ▾  │                                                       │
│   Pipeline   │                                                       │
│   My Board   │                                                       │
│              │                                                       │
│  Team        │                                                       │
│  Pods        │                                                       │
│              │                                                       │
└──────────────┴──────────────────────────────────────────────────────┘
```

Sidebar is always visible. Active item is highlighted.
"Team" and "Pods" visible to Admin only.

---

## 2. Client List Page (`/clients`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Clients                                              [+ Add Client]      │
├──────────────────────────────────────────────────────────────────────────┤
│  Search: [________________________]  Status: [All ▾]  Pod: [All ▾]       │
├────────────────────┬──────────┬───────┬────────┬───────────┬─────────────┤
│  Client Name       │ Market   │ Pod   │ Status │ Vid/Week  │ Strategist  │
├────────────────────┼──────────┼───────┼────────┼───────────┼─────────────┤
│  Acme Co           │ Chicago  │ Pod 1 │ active │     3     │ Clayton     │
│  BrightPath Media  │ Austin   │ Pod 2 │ active │     2     │ Ana         │
│  GreenLeaf Health  │ Miami    │ Pod 1 │ onboard│     4     │ Clayton     │
│  ...               │          │       │        │           │             │
└────────────────────┴──────────┴───────┴────────┴───────────┴─────────────┘
  Showing 1–25 of 68                                   [< Prev]  [Next >]
```

- Row click → Client Detail
- Status badge: green = active, yellow = onboarding, grey = inactive
- Sort by clicking column headers

---

## 3. Add Client Page (`/clients/new`)

```
┌────────────────────────────────────────────────────────────┐
│  Add Client                                                 │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  Client Name *        [__________________________________]  │
│  Market               [__________________________________]  │
│  Pod                  [Pod 1                           ▾]  │
│  Status               [onboarding                     ▾]  │
│  Package              [__________________________________]  │
│  Contract Start Date  [__________________________________]  │
│  Timezone             [__________________________________]  │
│  Posting Schedule     [__________________________________]  │
│  Script Format        [__________________________________]  │
│  Communication Method [__________________________________]  │
│  Website URL          [__________________________________]  │
│  YouTube Channel URL  [__________________________________]  │
│  Dropbox Upload URL   [__________________________________]  │
│  B-Roll Library URL   [__________________________________]  │
│  Slack Channel URL    [__________________________________]  │
│  Special Instructions [__________________________________]  │
│                       [__________________________________]  │
│                                                             │
│                       [Cancel]         [Create Client →]   │
└────────────────────────────────────────────────────────────┘
```

After creating → redirect to Client Detail to add channels, contacts, team.

---

## 4. Client Detail Page (`/clients/[id]`)

### 4a. Header

```
┌────────────────────────────────────────────────────────────────────┐
│  ← Clients                                                          │
│                                                                     │
│  Acme Co                             [active]  [Pod 1]  [Edit]     │
│  Chicago · 3 videos/week · EST                                      │
└────────────────────────────────────────────────────────────────────┘
```

### 4b. Info Section (collapsible)

```
┌────────────────────────────────────────────────────────────────────┐
│  ▼ Client Info                                                      │
├─────────────────────────┬──────────────────────────────────────────┤
│  Package                │  Growth Pro                              │
│  Contract Start         │  2024-01-15                              │
│  Posting Schedule       │  Mon / Thu                               │
│  Script Format          │  Teleprompter                            │
│  Communication          │  Slack                                   │
│  Slack Channel          │  #acme-co [↗]                            │
│  Dropbox                │  [↗ Open Dropbox]                        │
│  B-Roll Library         │  [↗ Open B-Roll]                         │
│  YouTube Channel        │  [↗ Open Channel]                        │
│  Special Instructions   │  Avoid competitor mentions               │
└─────────────────────────┴──────────────────────────────────────────┘
```

### 4c. Team Section

```
┌────────────────────────────────────────────────────────────────────┐
│  ▼ Team                                              [Edit Team]   │
├──────────────────┬─────────────────────────────────────────────────┤
│  Strategist      │  Clayton                                        │
│  Jr Strategist   │  —                                              │
│  Manager         │  Paulo                                          │
│  Senior Writer   │  Maria                                          │
│  Senior Editor   │  Raj                                            │
│  Designer        │  Tess                                           │
└──────────────────┴─────────────────────────────────────────────────┘
```

Edit Team → inline role picker (one dropdown per slot).

### 4d. Channels Section

```
┌────────────────────────────────────────────────────────────────────┐
│  ▼ Channels                                     [+ Add Channel]    │
├───────────────────────────────────┬────────────┬───────────────────┤
│  Channel Name                     │ Videos/Wk  │                   │
├───────────────────────────────────┼────────────┼───────────────────┤
│  Acme Official                    │     2      │  [Edit] [Remove]  │
│  Acme Shorts                      │     1      │  [Edit] [Remove]  │
└───────────────────────────────────┴────────────┴───────────────────┘
```

### 4e. Contacts Section

```
┌────────────────────────────────────────────────────────────────────┐
│  ▼ Contacts                                     [+ Add Contact]    │
├───────────────┬───────────────────────────┬────────────┬───────────┤
│  Name         │  Email                    │ Type       │           │
├───────────────┼───────────────────────────┼────────────┼───────────┤
│  John Doe     │  john@acmeco.com          │ Primary    │  [Edit]   │
│  Jane Smith   │  jane@acmeco.com          │ Assistant  │  [Edit]   │
└───────────────┴───────────────────────────┴────────────┴───────────┘
```

### 4f. Projects Section

```
┌────────────────────────────────────────────────────────────────────┐
│  ▼ Projects                                     [+ Add Project]    │
├─────────┬──────────────────────────┬────────────────┬──────────────┤
│  ID     │  Title                   │ Status         │ Design       │
├─────────┼──────────────────────────┼────────────────┼──────────────┤
│  KN-142 │  "5 Foods to Avoid..."   │ Script Writing │ Not Started  │
│  KN-139 │  "How to Save on Taxes"  │ Edit Sent      │ In Progress  │
│  KN-135 │  "Top 10 Chicago Eats"   │ Posted         │ Completed    │
└─────────┴──────────────────────────┴────────────────┴──────────────┘
  [Load more]
```

Row click → Project Detail modal (or page).

---

## 5. Project Detail (`/projects/[id]` or modal)

```
┌────────────────────────────────────────────────────────────────────┐
│  KN-142 · Acme Co                                          [Close] │
│  "5 Foods to Avoid if You Have High Cholesterol"                   │
├────────────────────┬───────────────────────────────────────────────┤
│  Status            │  [Script Writing              ▾]  [Move →]   │
│  Design Status     │  [Not Started                 ▾]              │
│  Writer            │  [Assign Writer               ▾]              │
│  Editor            │  [Assign Editor               ▾]              │
│  Script Due        │  [________________]                            │
│  Edit Due          │  [________________]                            │
│  Post Date         │  [________________]                            │
├────────────────────┴───────────────────────────────────────────────┤
│  Notes                                                              │
│  [____________________________________________________________]    │
│  [____________________________________________________________]    │
├────────────────────────────────────────────────────────────────────┤
│  Activity Log                                                       │
│  2026-03-28 · Clayton → moved Idea → Script Writing                │
│  2026-03-25 · Clayton → created project                            │
└────────────────────────────────────────────────────────────────────┘
```

"Move →" button advances to next valid status. Dropdown shows all valid transitions.

---

## 6. Full Pipeline Kanban (`/projects/pipeline`) — Admin Only

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  Full Pipeline                           Filter: Client [All ▾]  Pod [All ▾]  Writer [All ▾] │
├───────────┬────────────────┬─────────────┬──────────────┬──────────────────┬─────────────────┤
│  IDEA     │ SCRIPT WRITING │ REVIEW SCRP │ SCRPT READY  │ SCRIPT SENT      │ EDIT WRITING    │
│  (8)      │  (12)          │  (5)        │  (3)         │  (4)             │  (7)            │
├───────────┼────────────────┼─────────────┼──────────────┼──────────────────┼─────────────────┤
│ ┌───────┐ │ ┌───────────┐  │ ┌─────────┐ │ ┌──────────┐ │ ┌─────────────┐  │ ┌─────────────┐ │
│ │KN-150 │ │ │KN-142     │  │ │KN-138   │ │ │KN-131    │ │ │KN-129       │  │ │KN-126       │ │
│ │Acme   │ │ │Acme Co    │  │ │BrightPth│ │ │GreenLeaf │ │ │Acme Co      │  │ │BrightPath   │ │
│ │       │ │ │M· R· ●    │  │ │M· R·    │ │ │M· R· ◆   │ │ │M· R· ●      │  │ │M· R· ◆      │ │
│ └───────┘ │ └───────────┘  │ └─────────┘ │ └──────────┘ │ └─────────────┘  │ └─────────────┘ │
│ ┌───────┐ │ ┌───────────┐  │             │              │                  │                 │
│ │KN-149 │ │ │KN-141     │  │             │              │                  │                 │
│ │...    │ │ │...        │  │             │              │                  │                 │
│ └───────┘ │ └───────────┘  │             │              │                  │                 │
└───────────┴────────────────┴─────────────┴──────────────┴──────────────────┴─────────────────┘
  [scroll right for more columns →]
```

**Card legend:** `M·` = writer avatar  `R·` = editor avatar  `●` = design in progress  `◆` = design complete

---

## 7. My Board — Strategist View (`/board`)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  My Board (Strategist)                              [+ Add Project]          │
├─────────┬──────────────┬─────────────┬──────────────┬────────────┬───────────┤
│  IDEA   │ SCRPT WRITING│ REVIEW SCRP │ SCRPT READY  │ SCRPT SENT │ ...       │
│  (3)    │  (5)         │  (2)        │  (1)         │  (2)       │           │
├─────────┼──────────────┼─────────────┼──────────────┼────────────┼───────────┤
│ ┌─────┐ │ ┌──────────┐ │ ┌─────────┐ │ ┌──────────┐ │ ┌────────┐ │           │
│ │KN150│ │ │KN-142    │ │ │KN-138   │ │ │KN-131    │ │ │KN-129  │ │           │
│ │Acme │ │ │Acme Co   │ │ │BrightPth│ │ │GreenLeaf │ │ │Acme    │ │           │
│ │     │ │ │M· R· ●   │ │ │M· R·    │ │ │M· R· ◆   │ │ │M· R· ● │ │           │
│ └─────┘ │ └──────────┘ │ └─────────┘ │ └──────────┘ │ └────────┘ │           │
└─────────┴──────────────┴─────────────┴──────────────┴────────────┴───────────┘
  [scroll right →]
```

Same card design as Full Pipeline. Scoped to this strategist's clients only.

---

## 8. Dashboard (`/`)

### Admin Dashboard

```
┌────────────────────────────────────────────────────────────────────┐
│  Dashboard                                                          │
├──────────────┬──────────────┬──────────────┬────────────────────────┤
│  68 Clients  │ 47 Active    │ 142 Projects │  12 Stuck > 3 days     │
│  total       │ in pipeline  │ this month   │  [View →]              │
├──────────────┴──────────────┴──────────────┴────────────────────────┤
│  Needs Attention                                                     │
│  KN-115 · GreenLeaf Health · Edit Writing · 5 days    [View →]     │
│  KN-108 · Acme Co · Review Script · 4 days            [View →]     │
└────────────────────────────────────────────────────────────────────┘
```

### Strategist / Jr Strategist Dashboard → redirect to My Board

### All other roles → redirect to My Board

---

## Notes for Clayton + Paulo

- [ ] Client Detail: should Team section use a table (as shown) or cards/avatars per role?
- [ ] Project cards: what info is most critical at a glance? (current: task ID, client name, writer, editor, design status)
- [ ] Full Pipeline: should columns scroll horizontally, or wrap to a second row?
- [ ] Project Detail: modal overlay, or dedicated page?
- [ ] Dashboard "Stuck > 3 days" — is 3 days the right threshold, or per-status thresholds?
