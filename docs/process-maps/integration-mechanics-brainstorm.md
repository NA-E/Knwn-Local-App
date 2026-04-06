# Integration Mechanics Brainstorm

> **Purpose:** Work through every UX and technical decision for how the app integrates with Dropbox and Google Docs — before we present to Clayton and Paulo. 
> **Constraint:** Zero extra clicks. If the team used to do something in 2 steps, the app must do it in 2 or fewer.
> **Date:** 2026-04-07

---

## 1. Google Docs — The Script & Resources Question

### What Exists Today

```
Writer's workflow (today):
1. Open Google Drive (under management@aimpactmedia email)
2. Navigate to client folder
3. Open "Scripts" subfolder
4. Click "New Google Doc"
5. Name it after the video working title
6. Write the script
7. Go to Notion, paste the doc URL into the task (captures KPI timestamp)
```

That's 7 steps. Step 7 is the one people skip (causing 0% KPI data).

### Option A: App Creates the Doc Automatically

```
Writer's workflow (Option A):
1. Open project page in app
2. Click "Create Script" button
3. Google Doc opens in new tab, auto-named "[Video Title] - Script"
4. Write the script
```

**What happens behind the scenes:**
- App calls Google Docs API → creates doc → auto-names it → shares with writer
- Doc URL auto-saved on project record
- **Timestamp captured at creation = "script started" KPI**
- When writer changes project status to "Script Complete" = **"script delivered" KPI**

**Pros:**
- 4 steps instead of 7
- No manual URL pasting — the link is captured by the system
- KPI timestamps are automatic (both "started" and "delivered")
- No GDrive navigation needed — writer never opens GDrive
- Doc naming is consistent (app enforces naming convention)

**Cons:**
- Requires Google API integration (service account or domain-wide delegation)
- Who "owns" the doc? (see ownership question below)
- What if the writer wants to create the doc on their own first?

### Option B: Writer Pastes URL Manually

```
Writer's workflow (Option B):
1. Create Google Doc anywhere (their own way)
2. Open project page in app
3. Paste the URL into "Script Link" field
4. Write the script
```

**Pros:**
- No Google API needed
- Writers keep their existing habits
- Simple to build

**Cons:**
- 4 steps, but step 3 is the same "paste a link" step people skip today in Notion
- We rebuild the exact problem we're trying to solve
- No "script started" timestamp — only "link pasted" timestamp
- Writer might forget to paste (same as Notion)

### Option C: Hybrid — Auto-Create, but Allow Manual Override

```
Writer's workflow (Option C):
1. Open project page in app
2. Script section shows "Create Script" button OR "Paste Link" field
3. If "Create Script" → doc auto-created, link saved, timestamp captured
4. If "Paste Link" → writer pastes their own URL
5. Either way, link is on the project record
```

**Pros:**
- Best of both worlds — automated path is easiest, manual path is available
- Handles edge cases (writer already started a doc before the project was created)
- Auto-create path captures the cleanest timestamps

**Cons:**
- Slightly more complex UI (two options instead of one)
- Still need Google API for the auto-create path

### **Recommendation: Option C (Hybrid)**

"Create Script" is the primary action (big button). "Already have a doc? Paste link" is secondary (text link below). This makes the automated path the path of least resistance, but doesn't lock anyone out.

---

### The Ownership Question

**Who owns Google Docs created by the app?**

| Approach | How It Works | Pros | Cons |
|----------|-------------|------|------|
| **Service account creates + shares** | App's service account creates doc, shares with writer (editor) and team email (viewer). Service account owns it. | Simple to implement. No domain-wide delegation needed. | Docs show as "owned by" a service account email. If service account is deleted, docs are lost. Writers can't transfer ownership. |
| **Domain-wide delegation** | Service account impersonates team@knownlocal.com (or a dedicated docs@knownlocal.com). Doc is created "as" that user. That user owns it. | Docs owned by a real account. Clean ownership. Familiar to team. | Requires Google Workspace admin setup. Only works if knownlocal.com is a Google Workspace domain. More complex auth. |
| **Impersonate the writer** | Service account impersonates the specific writer's Google account. Writer owns their own docs. | Natural ownership. Writer sees doc in "My Drive." | Requires domain-wide delegation + each writer must be on the same Workspace domain. More permission complexity. |

**Key question for Clayton/Paulo:** Is knownlocal.com on Google Workspace? Or are they using personal Gmail accounts?

- If **Google Workspace** → Domain-wide delegation. Impersonate a shared account (team@knownlocal.com). That account owns all docs. Clean.
- If **personal Gmail** → Service account creates + shares. Less clean but works. 

**Simplest viable approach:** Service account creates the doc, immediately shares it with the writer's email (editor access) and a team-wide email (viewer access). The doc URL is stored in the app. Nobody needs to navigate GDrive to find it.

---

### Resource Documents (Brand Voice Guide, Geographic Context, etc.)

These are per-client, not per-project. Created once during onboarding.

**Today:** AI-generated from client intake forms (Perplexity deep research) → stored in GDrive Resources folder.

**In the app:**
- Client profile has a "Resources" section with document links
- During onboarding, app could auto-create blank resource doc templates (optional)
- More realistically: strategist creates these docs (AI-assisted), pastes links into client profile
- These docs are rarely updated after initial creation — link storage is sufficient

**Recommendation:** Simple link storage for resources. Don't over-engineer. "Add Resource" button → paste Google Doc URL + select category (Brand Voice Guide, Geographic Context, Writing Guidelines, Other). The value is having them all in one place, not automating their creation.

---

### Existing 80 Clients — GDrive Migration

**Problem:** 80 active clients already have GDrive folders with script and resource docs. How do we get those links into the app?

**Options:**
1. **Script to crawl GDrive:** Use Google Drive API to list all files in each client's Scripts and Resources folders, extract URLs, match to app client records, auto-populate. One-time migration.
2. **Manual paste over time:** Team pastes links as they work with each client. Gradual migration.
3. **Hybrid:** Run the script for the high-confidence matches (file names contain client names), manually review the rest.

**Recommendation:** Option 3. Script handles the bulk, team cleans up edge cases. We already wrote a migration script for Notion data — same pattern.

---

## 2. Dropbox — Client Upload & Folder Management

### What the Dropbox API Actually Supports

| Capability | API Endpoint | Status |
|-----------|-------------|--------|
| **Create folder** | `/files/create_folder_v2` | Supported |
| **Copy/duplicate folder** (template) | `/files/copy_v2` — copies entire folder tree | Supported |
| **Create File Request** | `file_requests/create` — returns shareable URL | Supported |
| **Detect new uploads** (webhook) | Webhooks → `/files/list_folder/continue` | Supported (indirect) |
| **Get file metadata** | `/files/get_metadata` — name, size, modified date | Supported |
| **Create shared link** | `/sharing/create_shared_link_with_settings` | Supported |
| **List folder contents** | `/files/list_folder` | Supported |

### Onboarding Automation — Dropbox Steps

```
1. /files/copy_v2
   from: /Clients Template/
   to:   /[Client Name]/
   → Creates: A-roll, B-roll, Edited Videos, Projects and Assets

2. file_requests/create
   title: "[Client Name] Raw Footage"
   destination: /[Client Name]/A-roll/
   → Returns: File Request URL (permanent)
   → Store URL on client record in app

3. (Optional) /sharing/create_shared_link_with_settings
   path: /[Client Name]/
   → Returns: shared folder link for team access
   → Store on client record
```

**Total API calls:** 2-3. Runs in ~5 seconds.

---

### Client Upload UX — The Critical Path

**Today:**
```
Client uploads footage (today):
1. Find File Request link (search Slack canvas? old email? ask YouTube manager?)
2. Open link → Dropbox File Request page
3. Drag files, upload
4. Nobody is notified. Team discovers footage manually.
```

**With the app:**
```
Client uploads footage (with app):
1. Open client dashboard (bookmarked)
2. Click "Upload Footage" button
3. Dropbox File Request page opens (familiar, proven UI)
4. Client uploads files as usual
5. Dropbox webhook fires → app detects new files in A-roll folder
6. App captures: upload timestamp, file count, total size
7. App auto-notifies team: "[Client] uploaded footage for [Project]"
8. Project status auto-updates or team is prompted to update
```

**Why we redirect to Dropbox instead of building our own upload:**
- Files are 5-30 GB. Proxying through our server is insane.
- Dropbox's upload UI handles resume, chunking, progress bars for massive files
- Clients already know this UI — zero learning curve
- Dropbox File Request is specifically designed for external people uploading

**The timestamp question:**
- Client clicks "Upload Footage" → we could capture a "started upload" timestamp
- But the real timestamp is "upload completed" → Dropbox webhook
- **Dropbox webhooks don't tell you WHICH file changed** — they say "user X had changes"
- **Workaround:** Each client has a unique A-roll folder. When webhook fires, call `/files/list_folder` on the A-roll folder, compare to last known state → new files = footage received
- This gives us: filename, size, upload date — all we need for the KPI

**Webhook architecture:**
```
Dropbox cloud
    |
    | POST webhook (account changed)
    v
App API endpoint (/api/webhooks/dropbox)
    |
    | For each changed user: call /files/list_folder/continue
    v
Compare with stored cursor → detect new files in A-roll folders
    |
    | Match A-roll folder → client record
    v
Capture timestamp, update project status, notify team
```

**Important:** Webhook response must happen within 10 seconds. Heavy processing must be async (queue or background job).

---

### Edit Submission — Version Upload UX

**Today:**
```
Editor submits edit (today):
1. Upload video to Dropbox: /[Client]/Edited Videos/[Month]/[Video Title]/V1.mp4
2. Go to Notion "Edit Submission" page
3. Paste Notion task link
4. Select version checkbox (V1/V2/V3)
5. Click Submit
6. Notion automation sends Slack notification
```

**With the app:**
```
Editor submits edit (with app):
1. Upload video to Dropbox (same as today — Dropbox is best for this)
2. Open project page in app
3. Click "Submit Edit"
4. Paste Dropbox link to the video file
5. Select version (V1/V2/V3)
6. Submit
→ App captures: timestamp, version, Dropbox link
→ App auto-notifies: Sr. Editor + YouTube Manager
→ Project status updates to "Ready for Internal Review"
```

**Same number of steps.** But:
- No Notion task link to paste (the project IS the record)
- Notification is automatic (no Notion automation to set up/maintain)
- Timestamp is captured (edit on-time KPI)
- Version + Dropbox link stored on the project record (accessible to everyone)

---

### Client Video Review UX

**Today:**
```
Client reviews video (today):
1. YouTube manager finds Dropbox link for V2
2. YouTube manager sends link to client via Slack
3. Client opens link in browser
4. Client watches video, leaves timestamped comments
5. YouTube manager relays feedback to editor via Slack thread
```

**With the app:**
```
Client reviews video (with app):
1. Editor submits V2 → Dropbox link on project record
2. YouTube manager clicks "Send to Client" → link appears on client dashboard
   → App captures: "sent for review" timestamp
3. Client opens dashboard → sees "Video Ready for Review" with link
4. Client clicks → Dropbox video player opens → comments as usual
5. YouTube manager sees "Awaiting Client Feedback" status on project
   → Can check Dropbox comments from the stored link
```

**Client commenting stays in Dropbox** — it's excellent for this (timestamped, pinpoint video annotations). We don't rebuild it. The app just makes the link discoverable.

---

## 3. Questions We Must Answer Before Building

### Google Docs

| # | Question | Why It Matters | Options |
|---|----------|---------------|---------|
| 1 | Is knownlocal.com on Google Workspace? | Determines doc ownership model (domain-wide delegation vs service account) | Ask Clayton/Paulo |
| 2 | What email account should own auto-created docs? | Affects who sees docs in "My Drive", who can delete them | team@knownlocal.com, docs@knownlocal.com, or individual writer |
| 3 | Should the app auto-create docs or just store links? | Affects whether we need Google Docs API at all | Recommend: auto-create for scripts (captures start timestamp), paste-link for resources |
| 4 | Do clients need access to script docs? | If yes, app needs to share docs with client email | Ask Clayton/Paulo — currently clients may not see scripts at all |
| 5 | Do brand voice guides need client approval? | Paulo said "we send this to the client so the client can approve" | If yes, client needs viewer/commenter access to the doc |
| 6 | How many docs per client per month? | Affects API quota planning | Likely 4-8 scripts/month (one per video) + stable resources |

### Dropbox

| # | Question | Why It Matters | Options |
|---|----------|---------------|---------|
| 7 | Which Dropbox account is the "master"? | team@knownlocal.com? management@aimpactmedia? | Need the main business account for API access |
| 8 | Is it Dropbox Business or Personal? | Business has team folder features, admin API. Personal doesn't. | Affects folder structure and sharing |
| 9 | Does the existing template folder path match our assumptions? | API needs exact path: `/Clients Template/` | Verify with Paulo |
| 10 | Can we set up a webhook endpoint? | Requires a publicly accessible URL | Vercel serverless function or separate webhook service |
| 11 | What's the Dropbox app permission scope? | `files.content.write` + `file_requests.write` + `sharing.write` minimum | Configure in Dropbox developer console |
| 12 | Do we need a Dropbox Business API app or a regular Scoped app? | Business API has additional team management features | Depends on answer to #8 |

### Client Dashboard

| # | Question | Why It Matters | Options |
|---|----------|---------------|---------|
| 13 | How do clients authenticate? | Separate login? Magic link? Shared secret? | Recommend: magic link (email-based, no password to forget) |
| 14 | Does the client see ALL their projects or just current ones? | Scope of the dashboard | Recommend: all, with status filters |
| 15 | Should the client be notified when a video is ready for review? | If yes, app needs to send email or in-app notification | Email is most reliable for external clients |
| 16 | Should the client upload through the app page or just get the Dropbox link? | The app page captures the click, the Dropbox page does the actual upload | Recommend: app page with "Upload" button that opens Dropbox File Request |

### UX / Data

| # | Question | Why It Matters | Options |
|---|----------|---------------|---------|
| 17 | When a project is created, do we auto-create the script doc? | Would mean every project automatically has a script doc ready | Recommend: yes, if Google API is available. Creates the "path of least resistance" for writers. |
| 18 | Should the app auto-detect which project footage belongs to? | Client may upload footage for multiple videos in one session | Hard problem. Recommend: manual association by team member for now. |
| 19 | What happens to Notion's edit submission form? | It's currently a Notion page under the team board | Replaced by "Submit Edit" action on project cards in the app |
| 20 | How do we handle the transition period? | Team uses both Notion and app during rollout | Recommend: cut over per module. When Kanban is live, Notion boards stop. Clean break. |

---

## 4. The UX Principle

**The app should be the path of least resistance for every action.**

If doing the work through the app is easier than the old way, people will use it. If it's harder, they won't — and KPIs will be broken again.

| Action | Old Way (steps) | App Way (steps) | Delta |
|--------|----------------|-----------------|-------|
| Create script doc | 7 (navigate GDrive → create → name → paste in Notion) | 2 (click "Create Script" → write) | **-5 steps** |
| Paste script link for KPI | 1 step people skip | 0 steps (auto-captured on creation) | **Eliminated** |
| Upload client footage | 3+ (find link → open → upload, no notification) | 2 (click Upload → upload, auto-notification) | **-1 step + notification** |
| Submit edit | 6 (upload → Notion form → paste → select → submit → notification) | 4 (upload → Submit Edit → paste Dropbox link → select version) | **-2 steps** |
| Find client's docs | 5+ (open GDrive → find client → find subfolder → find doc) | 1 (open client profile → click link) | **-4 steps** |
| Check project status | Open Notion → find board → find card | Open app → Kanban | **Same, but better UI** |
| Log a call for KPI | Separate Notion entry (often skipped) | Log call in app → auto-timestamp | **Same steps, but captured** |

**Every row is equal or better.** No action requires more steps in the app than the old way. That's the requirement.

---

## 5. What to Present to Clayton & Paulo

We don't need to present all this detail. But we need confident answers to these questions they WILL ask:

1. **"How will writers create scripts?"** → Click "Create Script" on the project page. Google Doc opens automatically, already named. No GDrive navigation.

2. **"Where do the docs live?"** → In Google Docs (same as today for editing). The app stores the link. GDrive folders become unnecessary.

3. **"How will clients upload footage?"** → Same Dropbox File Request they use today. But the link is always on their dashboard — no more searching Slack. The team gets auto-notified when footage arrives.

4. **"What about our existing Dropbox folders?"** → They stay. We just add the File Request URLs to the app. For new clients, folders are auto-created.

5. **"Will this slow the team down?"** → Every workflow is equal or fewer steps. The difference is the app captures data automatically — no manual KPI entry needed.

---

## Sources

- [Dropbox File Request API](https://dropbox.tech/developers/streamline-file-collection-with-the-file-request-api)
- [Dropbox File Request Python SDK](https://dropbox-sdk-python.readthedocs.io/en/latest/api/file_requests.html)
- [Dropbox Webhooks](https://www.dropbox.com/developers/reference/webhooks)
- [Dropbox Detecting Changes Guide](https://developers.dropbox.com/detecting-changes-guide)
- [Dropbox Webhooks for File Request Uploads (Community)](https://www.dropboxforum.com/discussions/101000014/webhooks-for-file-request-uploads/551068)
- [Google Workspace Domain-Wide Delegation](https://support.google.com/a/answer/162106?hl=en)
- [Google Drive API — Manage Sharing/Permissions](https://developers.google.com/drive/api/guides/manage-sharing)
- [Service Account Overview (Google Cloud)](https://cloud.google.com/iam/docs/service-account-overview)
