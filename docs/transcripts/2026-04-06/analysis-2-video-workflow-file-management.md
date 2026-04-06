# Interview Analysis: Video Workflow & File Management (Call 2)

**Date:** April 06, 2026, 9:19 PM
**Duration:** 38 minutes
**Participants:** Nourin Ahmed Eka (PM/Developer), Paulo Folly (Operations)
**Interview Type:** Live Zoom with screen sharing
**Topic:** Video production workflow, Dropbox structure, Google Drive usage, editor submission flow, KPI automation

---

## 1. Gaps Filled

Cross-referencing against the 26 questions in the discovery script (`onboarding-discovery-script.md`).

### Answered or Partially Answered

| Gap # | Question | Answer | Evidence (Quote) | Confidence |
|-------|----------|--------|-------------------|------------|
| 9 | "Can you open the Clients Template folder and show me every subfolder?" | **Yes -- confirmed 4 subfolders:** A-roll (raw footage), B-roll (curated reusable clips), Edited Videos (final deliverables organized by month/version), Projects and Assets (logos, brand guides, project files). | Paulo: "We have a template over here. We just duplicate this folder." Screen share showed all 4 folders. | **High** |
| 10 | "After duplicating the template, is there anything else you do to the folder?" | **Yes -- a File Request link is created.** Navigate to Home > File Requests > Request File. Title it "[Client Name] Raw Footage", select the A-roll subfolder, set naming conventions (auto date stamp). This is a one-time setup per client. | Paulo: "We had to come over here in file requests... create like a title, like it's client name, raw footage, and then we choose the folder." | **High** |
| 12 | "What exactly goes in the Google Drive folder? Just scripts, or other docs too?" | **Scripts AND resource documents.** Resources include geographic context docs, climate info, brand voice guides, and writing guidelines for the scriptwriters. Some are AI-generated from client intake forms (50% manual, 50% AI via Perplexity deep research). | Paulo: "We have resources... docs as well, like geographic context, climate, basically core information. This is more for a script... how they should write, what they should avoid." | **High** |
| 13 | "Is there a subfolder structure, or just one folder per client?" | **Two subfolders per client:** Scripts (Google Docs named after video working titles) and Resources (brand voice guides, geographic context, etc.). | Paulo showed screen: "Scripts, and then we have all the Google Docs" + "here we have resources" | **High** |
| 14 | "You mentioned possibly eliminating GDrive if Dropbox can hold scripts. Has the writing team weighed in?" | **Paulo is open to it.** He confirmed Dropbox has Google Docs integration. He was unaware of this integration before the call. However, no writing team input was gathered. | Paulo: "So yeah, that's good news. Nice." / Nourin: "Dropbox offers direct integration with Docs, files, etc." | **Med** -- Paulo is open, but writing team not consulted and Clayton not present |
| 21 | "Are there any other steps we haven't talked about? Contracts, billing, intake forms, brand guidelines, content calendar setup?" | **Partial -- brand guidelines process surfaced.** Clients fill out a form, AI (Perplexity) generates brand voice guide and geographic context docs. Clayton (new team member) is building visual brand identity for all clients. This is still early / in progress. | Paulo: "We have like a form, and then the client answered the form... we use AI to do this template... I think this is 50% manual, 50% AI." | **Med** -- incomplete, more steps likely exist |

### Indirectly Addressed (Not Direct Answers, But Useful Signal)

| Gap # | Question | Signal Captured | Evidence | Confidence |
|-------|----------|-----------------|----------|------------|
| 6 | "Beyond Clayton, Andrew, and the pod team -- who else gets added to Slack?" | The editor submission workflow sends Slack notifications tagging the senior editor and YouTube manager. This implies they are in relevant Slack channels or at least receive cross-channel notifications. | Paulo: "It will tag the senior editor that is responsible for this task, and the YouTube manager responsible for this task." | **Low** -- this is about notification, not channel membership |
| 11 | "The Dropbox is at 24/30 TB. Is there a plan?" | Not directly addressed, but the file sizes were clarified: average project is ~10 GB, smallest ~5 GB, largest ~30 GB. Raw footage is ~40 min per video (2x final length). This data informs the storage burn rate. | Paulo: "The ones that are the smallest are around five gigabytes. And it can go up to 30 gigabytes... the midterm would be 10 gigabytes, like the average." | **Med** -- size data is useful, but no strategic answer on the plan |
| 15 | "How does each team member find out about new assignments?" | The edit submission flow shows how handoffs work mid-production (Notion submission triggers Slack notification), but the initial onboarding assignment notification was not discussed. | Paulo: "Once they submit this, it will send a message in Slack... the Notion app will add a message." | **Low** -- this is about production handoffs, not onboarding notification |

### Not Addressed

| Gap # | Question | Status |
|-------|----------|--------|
| 1 | Who initiates onboarding after a client signs? | Not discussed |
| 2 | Where is client info entered first? | Not discussed |
| 3 | How is pod assignment decided? | Not discussed (Clayton absent) |
| 4 | Is there a capacity check for pods? | Not discussed (Clayton absent) |
| 5 | Has a pod assignment ever been wrong? | Not discussed (Clayton absent) |
| 7 | Has anyone ever been missed from a Slack channel? | Not discussed |
| 8 | When a team member changes, who updates Slack? | Not discussed |
| 16 | Is there a specific order to assignments? | Not discussed |
| 17 | Who assigns writer/editor/designer? | Not discussed |
| 18 | Welcome message to client? | Not discussed |
| 19 | Internal kickoff? | Not discussed |
| 20 | When is the first project created? | Not discussed |
| 22 | Most annoying part of onboarding? | Not discussed |
| 23 | How often does something go wrong? | Not discussed |
| 24 | Top 3 things to automate? | Not discussed |
| 25 | Anything that MUST stay manual? | Not discussed |
| 26 | How many clients onboarded per month? | Not discussed |

---

## 2. Pain Points Surfaced

| # | Pain Point | Who Said It | Frequency | Severity | Evidence |
|---|-----------|------------|-----------|----------|----------|
| 1 | **B-roll folder is disorganized and underutilized.** The intended system (curated reusable footage organized by type, e.g., drone shots) is not working. Editors dump files with inconsistent naming and no clear structure. | Paulo | Every client | Med | "This is not working like it should. But the idea was to have only selected videos over here... But we, I think we can rethink this structure." |
| 2 | **Projects and Assets folder is largely empty / broken.** Meant to hold brand assets (logos, brand guides, color palettes) but most clients still use Google Drive for this. Only a few clients have assets here. | Paulo | Most clients | Med | "It's also a bit broken, because a lot of clients still use Google Drive for this type of things. A few of them have assets over here, but it's not a lot." |
| 3 | **Google Drive downloading fails for large folders.** GDrive splits downloads into 2 GB zip files, and individual zips often fail mid-download for projects over 10 GB. | Paulo | Sometimes (large projects) | High | "Google Drive will split the folder in two gigabytes files... usually if it's like more than 10 gigabytes, usually one file will fail the download." |
| 4 | **Dual file system (Dropbox + GDrive) creates confusion.** Some assets are in Dropbox, some in GDrive, with no clear rule about what goes where. | Paulo | Every client | Med | The entire discussion around GDrive vs Dropbox redundancy. Paulo confirmed scripts/resources in GDrive while video in Dropbox, but assets split across both. |
| 5 | **Client upload link discovery is unclear.** After the initial File Request link is shared, it is unclear how clients re-find it for subsequent uploads. Paulo thinks they save it via a Slack canvas but is not certain. | Paulo | Unknown | Low | "That's a good question. We sent the link for them, and I think they have saved... I think they add a canvas over here... and put the links under there." |
| 6 | **Brand asset creation is nascent and inconsistent.** Clayton is just starting to build visual brand identity for all clients. Until he finishes, most clients lack proper brand assets in the file system. | Paulo | Most clients (currently) | Low | "He's just starting, so I think it will take some time until he gets to all clients." |

---

## 3. Process Map Updates

Based on new information from this call, the following changes should be made to `client-onboarding-as-is.md`:

### Dropbox Section -- Update Template Structure

**Current (as-is map):**
> Template subfolders: A-roll, B-roll, Edited Videos, Projects, Assets (? more subfolders under these?)

**Should be updated to:**
- **A-roll** -- raw client footage, auto-organized by upload date
- **B-roll** -- curated reusable footage (drone, landmarks, etc.) -- *currently underutilized*
- **Edited Videos** -- organized by month, then by video title folder, containing V1 (internal review), V2 (client review), V3 (final/published)
- **Projects and Assets** -- brand guides, logos, color palettes, Premiere/After Effects files -- *currently underutilized, being built by Clayton*

### Dropbox Section -- Add File Request Step

**Add new step after "Rename folder to client name":**
- Create Dropbox File Request: Home > File Requests > Request File
- Title: "[Client Name] Raw Footage"
- Target folder: client's A-roll subfolder
- Set naming convention (auto-date stamp)
- Share generated link with client (one-time setup)

### Google Drive Section -- Update Folder Structure

**Current (as-is map):**
> What's the folder structure? Just a single folder per client? Subfolders?

**Should be updated to:**
- Per-client folder containing:
  - **Scripts** subfolder -- Google Docs named after video working titles
  - **Resources** subfolder -- brand voice guide, geographic context, climate info, writing guidelines (partially AI-generated via Perplexity from client intake forms)

### Add New Section -- Edit Submission & Review Workflow

This is post-onboarding (production), but it connects the Dropbox structure to the Notion/Slack workflow. Add as a reference note or separate production process section:

1. Editor completes edit, uploads to Edited Videos > [Month] > [Video Title] folder
2. Editor goes to Notion "Edit Submission" page on team board
3. Pastes Notion task link, selects version (V1/V2/V3), submits
4. Notion automation sends Slack message tagging senior editor + YouTube manager
5. Senior editor reviews; if approved, YouTube manager sends V2 link to client
6. Client reviews via Dropbox comment feature (timestamped, pinpoint annotations)
7. If client requests changes, editor produces V3

### Remove/Update Uncertainties

- Remove "(? more subfolders under these?)" from Dropbox template -- now confirmed
- Remove "What's the folder structure?" from Google Drive -- now confirmed
- Update the gap for "How does the client get the link?" to note: File Request link, shared once, client saves it (likely via Slack canvas)

---

## 4. Scope Expansion Signals

| Signal | Detail | Source | Impact on App |
|--------|--------|--------|---------------|
| **KPI automation in Notion** | Paulo built KPI tracking using Notion automations -- script submission timestamp vs due date generates 1/0 on-time score. "A lot of the KPIs are built in this type of logic." | Paulo | When the app takes over project tracking, it will need to replicate this KPI logic. The app should capture timestamp when a script link is pasted and compare against due dates. This is a **Module 3/4 concern**. |
| **Edit submission workflow** | Editors currently use a Notion "Edit Submission" page that triggers Slack notifications. This is a structured handoff workflow the app will eventually need to support. | Paulo | The Kanban board (Module 2) needs to support version submission with automated notifications -- not just status changes. Consider an "edit submission" action on project cards. |
| **Dropbox comment/review integration** | Clients leave timestamped, pinpoint video comments directly in Dropbox. This is a critical review workflow. | Paulo | The app should link to or embed Dropbox review links rather than trying to build its own video review. Consider storing the V1/V2/V3 Dropbox links on project records. |
| **Brand asset management** | Clayton is building visual brand identity for all clients (logo, brand guide, color palette). This is a new workflow not previously discussed. | Paulo | Could become a client profile feature -- storing brand assets or linking to them in Dropbox. Low priority but worth noting for future. |
| **AI-generated client resources** | Client intake forms are processed through AI (Perplexity deep research) to generate brand voice guides and geographic context docs. | Paulo | If the app handles onboarding, it could trigger or link to this AI generation step. Currently 50% manual so not easily automated in V1. |
| **Google Drive elimination feasible** | Dropbox has native Google Docs integration that Paulo was unaware of. This could consolidate the two file systems into one (Dropbox only). | Nourin + Paulo | If GDrive is eliminated, the onboarding automation only needs to create a Dropbox folder (not both Dropbox + GDrive). This would simplify the current automation spec at `docs/superpowers/specs/2026-04-03-client-onboarding-automation.md`. |

---

## 5. Surprise Findings

1. **The folder is called "A-roll" not "Aero."** Fathom's transcription incorrectly rendered "A-roll" as "Aero" throughout. Clayton's prior session correctly referenced "A-roll." The actual template folder name is "A-roll."

2. **File Request links are one-time setup, not per-video.** Nourin initially assumed a new link was needed for each video upload ("So we have to do these steps every time we need a client to upload a new YouTube video"). Paulo corrected this -- the link is permanent, and files are differentiated by auto-date naming. This means the onboarding automation only needs to create one File Request per client, not an ongoing process.

3. **Dropbox was chosen over specialized video production tools.** Paulo mentioned they tried "other services more focused on video production" but had reliability issues ("the server was down and we couldn't work for an entire day"). Dropbox won on reliability and download/upload speed, not features.

4. **The edit review workflow is more sophisticated than expected.** There is an existing structured handoff system: Notion edit submission page > automated Slack notification > senior editor review > client Dropbox review with timestamped comments. This is a well-defined process that the app will need to match or exceed.

5. **Resource documents are partially AI-generated.** Brand voice guides are created from client intake form responses using Perplexity AI deep research. This is a semi-automated content generation workflow that was not previously documented.

6. **Version control is built into the folder structure.** Edited Videos are organized as V1 (internal review), V2 (client review), V3 (published). This maps directly to project status transitions in the app's state machine.

7. **Some clients still use Google Drive for legacy reasons.** Paulo mentioned "this is an old client, so we were using still Google Drive" -- confirming that the GDrive-to-Dropbox migration is incomplete and some clients are in a hybrid state.

8. **Paulo was unaware of Dropbox's Google Docs integration.** This is significant because it means the dual-system pain (GDrive + Dropbox) may have been unnecessary. Nourin surfaced this during the call and Paulo reacted positively ("So yeah, that's good news").

---

## 6. Action Items from the Call

| Action | Owner | Status |
|--------|-------|--------|
| Review Nourin's app (the Known Local app in its current state) | Paulo Folly | Pending -- "I didn't have the time yet, but I will take a look" |
| Send follow-up video questions to Nourin | Paulo Folly | Pending |
| Evaluate full migration of document workflows from Google Drive to Dropbox | Nourin Ahmed Eka | Open -- needs writing team input + Clayton's sign-off |

---

## 7. Still Open Gaps

The following discovery questions from the script remain **completely unanswered** after this call. These should be prioritized for a follow-up session, ideally with both Clayton and Paulo present.

### Critical (Block App Design)

| Gap # | Question | Why It Matters | Best Respondent |
|-------|----------|---------------|-----------------|
| 1 | Who initiates onboarding after a client signs? What's the trigger? | Determines the entry point for the app's onboarding flow | Paulo + Clayton |
| 2 | Where is client info entered first? | Determines whether the app is the source of truth or Notion is | Paulo |
| 3 | How is pod assignment decided? | Core onboarding logic the app needs to support or automate | Clayton |
| 15 | How does each team member find out about new assignments? | Notification design in the app | Paulo |
| 16 | Is there a specific order to team assignments? | Dependency chain for onboarding automation | Paulo |
| 17 | Who assigns writer/editor/designer? | Decision authority mapping for the app | Paulo + Clayton |
| 20 | When is the first project created? Who creates it? | Transition from onboarding to production (Module 1 to Module 2 handoff) | Paulo |

### Important (Inform Automation Design)

| Gap # | Question | Why It Matters | Best Respondent |
|-------|----------|---------------|-----------------|
| 4 | Is there a capacity check for pod assignment? | Whether to build capacity visibility into the app | Clayton |
| 5 | Has a pod assignment ever been wrong or changed? | Error handling and reassignment UX | Clayton |
| 6 | Who else gets added to Slack channels? | Automation scope for Slack channel creation | Paulo |
| 7 | Has anyone been missed from a channel? | Validates the need for automation | Paulo |
| 8 | Who updates Slack when a team member changes? | Ongoing maintenance the app could handle | Paulo |
| 18 | Welcome message to client? | Could be automated as part of onboarding | Paulo |
| 19 | Internal kickoff process? | App could trigger or track this | Paulo |

### Nice to Have (Context for Prioritization)

| Gap # | Question | Why It Matters | Best Respondent |
|-------|----------|---------------|-----------------|
| 22 | Most annoying part of onboarding? | Prioritization of what to automate first | Both |
| 23 | How often does something go wrong? | Severity assessment | Both |
| 24 | Top 3 things to automate? | Direct input on automation priorities | Both |
| 25 | Anything that MUST stay manual? | Guardrails for automation scope | Both |
| 26 | How many clients onboarded per month? | Volume sizing for automation ROI | Paulo |

---

## 8. Summary Assessment

**This call was narrowly focused on file management and production workflow**, not onboarding. It answered 5 of 26 discovery questions directly (gaps 9, 10, 12, 13, 14) and provided partial signal on 3 more (6, 11, 21). The remaining 18 questions are still open.

**Highest-value new information:**
- The exact Dropbox template structure and File Request setup process
- The Google Drive folder structure (Scripts + Resources)
- The edit submission and review workflow (Notion > Slack > Dropbox comments)
- The feasibility of eliminating Google Drive entirely
- KPI automation logic in Notion (timestamps vs due dates)

**Recommended next steps:**
1. Schedule a focused onboarding-specific call with both Clayton and Paulo to cover the 18 remaining gaps
2. Get Clayton's input on pod assignment process (gaps 3-5) -- he was absent from this call
3. ~~Validate the "A-roll" vs "Aero" naming~~ -- RESOLVED: Fathom transcription error. The folder is "A-roll." No further validation needed.
4. Decide on GDrive elimination with Clayton + writing team input before finalizing the onboarding automation spec
5. Update the onboarding automation spec to include Dropbox File Request creation as an onboarding step

---

## Deep-Dive Findings (Re-Analysis)

> **Date:** April 06, 2026
> **Purpose:** Second pass through the transcript to extract details missed in the initial analysis, with focus on production workflow, client interaction points, GDrive replacement feasibility, KPI logic, file sizes, team handoffs, broken processes, and future ideas.
> **Correction:** All instances of "Aero" in the transcript and original analysis were Fathom transcription errors. The folder is called **"A-roll"**. Fixed throughout.

---

### 1. Production Workflow Details (Informs Module 2 -- Kanban/Production Pipeline)

#### The Edit Submission Process -- Step by Step

The current system uses a Notion form called "Edit Submission" located under the team board. The exact flow:

1. **Editor completes an edit** and uploads the video file to the client's Dropbox folder under `Edited Videos > [Month] > [Video Title]`
2. **Editor navigates** to the "Edit Submission" page in Notion (under the team board section)
3. **Editor pastes** the Notion task link (i.e., the project/task URL from Notion) -- this links the submission to a specific project
4. **Editor selects the version** via a checkbox: V1, V2, or V3
5. **Editor clicks "Submit"**
6. **Notion automation fires** -- sends a Slack message to the relevant channel

The Slack notification includes:
- The Notion task link (clickable)
- Which version was submitted (e.g., "V1")
- The project status (e.g., "Ready for internal review")
- **Tags the senior editor** responsible for that project
- **Tags the YouTube manager** responsible for that project

Evidence: Paulo showed this live on screen -- "Once they submit that, the Notion app will add a message, like, with the link of the task, the project, which version it is... it will tag the senior editor that is responsible for this task, and the YouTube manager responsible for this task."

#### Version Management -- V1, V2, V3

The version convention is critical for the app's state machine:

| Version | Purpose | Who Reviews | Where Stored |
|---------|---------|-------------|-------------|
| **V1** | Internal review only | Senior editor | `Edited Videos > [Month] > [Video Title] > V1` |
| **V2** | Client review | Client (via Dropbox link) | `Edited Videos > [Month] > [Video Title] > V2` |
| **V3** | Final / published version | YouTube manager (final check before publish) | `Edited Videos > [Month] > [Video Title] > V3` |

Key nuances:
- V1 is "usually internal" but **sometimes V1 goes directly to the client** when the edit is very good: "Sometimes the V1 is sent to the client. When it's like perfect."
- V2 is "usually" the client-facing version
- V3 "should be the one that goes to YouTube, that is published"
- Not every video goes through all 3 versions -- if client approves V2 with no changes, V3 may not be needed (or V2 becomes the published version)

**App implication:** The project status machine should support optional version skipping (V1 -> publish without V2/V3 if internally approved and client has no notes). The version field on a project should track which version is current.

#### Edited Videos Folder Organization

Two organizing patterns observed (Paulo showed both on screen):
1. **Flat by month:** `Edited Videos > [Month] > [file1.mp4, file2.mp4]` -- just files directly in the month folder
2. **Nested by video:** `Edited Videos > [Month] > [Video Title Folder] > [V1.mp4, V2.mp4, V3.mp4]` -- all versions grouped under a video-named folder

The second pattern is the intended structure but not always followed consistently.

#### Slack Thread as Review Log

After the automated notification, the Slack thread becomes a review discussion log. Paulo showed an example where:
- The **senior editor** replied: "Great work, this version is approved, should be sent to the client"
- The **YouTube manager** replied: "The client left some notes for the editor"

This means Slack threads currently serve as the audit trail for review decisions. The app's Kanban comments/activity log will need to replace this.

---

### 2. Client Interaction Points (Informs Client-Facing Dashboard)

#### How Clients Upload Raw Footage

1. **Mechanism:** Dropbox File Request link (not a shared folder)
2. **Setup:** One-time during onboarding -- `Home > File Requests > Request File`
3. **Configuration:**
   - Title: "[Client Name] Raw Footage"
   - Target: client's A-roll subfolder
   - Naming convention: auto-date stamped by Dropbox based on upload date
4. **Why File Request instead of shared folder:** If you share a regular folder, "Dropbox will occupy storage both in your Dropbox and the client's Dropbox." Clients were running out of space, deleting files, and "things start missing." File Requests upload only to the agency's storage.
5. **Link persistence:** The link is permanent -- used for all future uploads, not just the first video. Paulo: "Just when we were onboarded, this link will be the same for all videos that this client uploads."

#### How Clients Find Their Upload Link

- **Uncertain process.** Paulo thinks clients save the File Request link in a Slack canvas in their client channel: "I think they add a canvas over here, like the one we have on our chat, and put the links under there."
- Paulo explicitly was not sure: "I could be wrong."
- One older client's channel showed a Google Drive link instead (from before the Dropbox migration): "This is an old client, so we were using still Google Drive."

**App implication for client dashboard:** The File Request link should be permanently stored on the client record and displayed on a client-facing dashboard. This eliminates the current problem where clients need to hunt for the link in Slack canvases.

#### How Clients Review Edited Videos

1. YouTube manager shares a **Dropbox link** to the video file (V2, sometimes V1)
2. Client opens the link in their browser (no Dropbox account needed)
3. Client can:
   - **Watch the video** in the Dropbox player
   - **Leave timestamped, pinpoint comments** -- click on a specific moment in the video and type a note
   - **Select specific versions** to comment on (version picker in the Dropbox UI)
4. Paulo demonstrated the comment feature live: "He can come over here, for example, in this part... please change that."
5. Both internal team and clients can comment -- Paulo distinguished between "internal comments" and "client comments" on the same video

**App implication for client dashboard:** The app does NOT need to build its own video review tool. Dropbox's native comment/annotation feature is sufficient and already adopted by clients. The app should:
- Store the V1/V2/V3 Dropbox links on the project record
- Display the appropriate link on the client dashboard
- Potentially pull comment status via Dropbox API (has comments / no comments) to show review status

#### Notion Task Links on Project Records

The Notion task URL is currently the glue between submissions and projects. Editors paste the "link of the Notion task" to connect their submission to the right project. In the app, this becomes the project ID / project detail page URL.

---

### 3. Google Drive Specifics (What the App Needs to Replace GDrive)

#### Current GDrive Structure Per Client

```
[Client Name]/
  Scripts/
    [Video Title 1].gdoc
    [Video Title 2].gdoc
    ...
  Resources/
    Geographic Context.gdoc
    Climate.gdoc
    Brand Voice Guide.gdoc
    [Other core information docs].gdoc
```

#### What Is Stored in Google Drive

| Document Type | Format | Purpose | Created By | Used By |
|--------------|--------|---------|------------|---------|
| **Scripts** | Google Docs | Video scripts, one per video, named after video working title | Writers | Writers, strategists, editors |
| **Brand Voice Guide** | Google Doc | Personal writing guidelines -- what to say, what to avoid, tone of voice | AI-generated from client intake form (Perplexity deep research), then client-approved | Writers |
| **Geographic Context** | Google Doc | Location-specific info about the client's city/region | AI-generated (Perplexity) | Writers |
| **Climate Info** | Google Doc | Climate/weather context for the client's area | AI-generated (Perplexity) | Writers |
| **Writing Guidelines** | Google Doc | "How they should write, what they should avoid, what they should do" | Strategist / Clayton | Writers |

#### The AI-Assisted Brand Guide Creation Process

Paulo described the brand voice guide creation as "50% manual, 50% AI":

1. **Client fills out a form** (intake questionnaire -- format/tool not specified, possibly Google Forms or Typeform)
2. **Team uses Perplexity AI "deep research"** to generate documents from the form responses -- specifically the brand voice guide and geographic context docs
3. **Generated docs are sent to the client** for review and approval: "I think we send this to the client, so the client can approve and see if it's all accurate"
4. **Approved docs are stored in GDrive** under the client's Resources folder

Paulo was not 100% certain of every detail: "I'm not 100% sure, but I think they like this for the brand voice guide... I think they answer a form or something like that."

**App implication:** To replace GDrive, the app needs:
- A way to store/link Google Doc URLs per client (scripts + resources)
- A "Resources" section on the client profile with categorized document links
- A "Scripts" section on the project record with links to the relevant Google Doc
- The actual documents remain as Google Docs (collaborative editing) -- the app just stores the URLs and provides easy access
- Future: the intake form + AI generation could be built into the app's onboarding flow

#### Why GDrive Is Still Used

Paulo was clear: the only reason is native Google Docs editing. "We basically use Google Drive because it has a great integration for docs." He could not think of any other reason. When Nourin pointed out that Dropbox has Google Docs integration, Paulo was surprised and positive: "So yeah, that's good news. Nice."

#### What the App Needs to Fully Replace GDrive

Based on the discussion, the app would need to provide:

1. **Per-client document library** -- organized sections for Scripts and Resources
2. **Clickable Google Doc links** -- clicking a doc link opens it in a new tab in Google Docs for editing. Nourin: "If we just build it into the app, then it will also just show a clickable link and it will directly open the Google Docs."
3. **Ability to paste/add Google Doc URLs** -- Nourin: "We can add features of creating and adding or just pasting Google Doc link"
4. **Per-project script link** -- the script for a specific video linked from the project record (this also feeds the KPI system)
5. **Resource categorization** -- brand voice guide, geographic context, climate, writing guidelines, etc.

Paulo confirmed: "We could have both of these folders inside Dropbox as well" -- meaning the organizational need is simple (scripts + resources per client) and does not require GDrive-specific features.

---

### 4. KPI Tracking Logic (Must Replicate in App)

#### Script On-Time KPI -- Exact Mechanism

Paulo built this automation in Notion. The exact logic:

1. Each project/task in Notion has a **"Link to Script"** field and a **"Script Due Date"** property
2. The project also has a **"Scripting Writer"** assignment field (Paulo showed this was empty for the example: "This should not be empty, but okay")
3. **When the writer pastes the Google Doc link** into the "Link to Script" field, a **Notion automation generates a timestamp** recording the exact moment the link was pasted
4. A **computed property compares** the paste timestamp against the Script Due Date
5. Result: **1** if on-time (pasted before or on due date), **0** if late (pasted after due date)
6. KPI dashboards aggregate these 1s and 0s to calculate on-time percentage per writer

Paulo: "I have a property that compares the timestamp that was generated when the writer pasted the link. And this compares with the script due date. And then if it's on time, it's marked as one, and if it's not on time, it's marked as zero."

Paulo also noted: **"A lot of the KPIs are built in this type of logic"** -- meaning multiple KPIs across different roles follow the same pattern: an action triggers a timestamp, which is compared to a due date, producing a binary on-time/late value.

**App implication for KPI system:**
- The app needs to capture timestamps for key actions (script link pasted, edit submitted, video published, etc.)
- Each project should have due dates for each phase (script due, edit due, publish due)
- KPI calculation: `COUNT(on_time) / COUNT(total) * 100` per team member per time period
- This is not just for writers -- the same pattern applies to editors (edit submission vs edit due date) and potentially other roles
- The timestamp must be auto-generated on the action (not manually entered) to prevent gaming

#### Other KPIs Implied (Not Explicitly Named)

Based on the "same logic" comment, these likely exist:
- **Edit on-time KPI:** Edit submission timestamp vs edit due date
- **Publish on-time KPI:** Publish date vs publish due date
- Possibly: **Client review turnaround** (time between V2 sent and client feedback received)

---

### 5. File Sizes and Storage Implications

#### Raw Numbers from Paulo

| Metric | Value | Source Quote |
|--------|-------|-------------|
| **Raw footage duration** | ~40 minutes per video | "The raw record, I would say around 40 minutes" |
| **Final video duration** | 15-20 minutes | "The final videos are around 15 to 20 minutes" |
| **Raw-to-final ratio** | ~2x | "Usually we have like the double the time in raw footage" |
| **Smallest project size** | ~5 GB | "The ones that are the smallest are around five gigabytes" |
| **Average project size** | ~10 GB | "I think the midterm would be 10 gigabytes, like the average" |
| **Largest project size** | ~30 GB (can exceed) | "It can go up to 30 gigabytes... It could be even more" |
| **Exception cases** | >30 GB for podcasts | "We are talking probably about podcasts and it's not like the rule, it's the exception" |

#### Factors Affecting Size

- **Exterior/outdoor shoots** produce much larger files: "If it's like a video that was recorded on the exterior, like out. Then it's much longer the duration of the footage because we have a lot of B-rolls [supplementary footage]."
- Podcasts are outliers that can exceed the 30 GB upper range

#### Storage Implications for Dropbox API Integration

- With 74 active clients, assuming ~2 videos/month each at ~10 GB average = ~1.48 TB/month of new raw footage
- Current Dropbox capacity: 24/30 TB used (from Clayton's earlier call)
- At this burn rate, they have roughly 4 months before hitting the limit (though old footage may be archived/deleted)
- **The app should NOT attempt to proxy or cache video files** -- it should only store Dropbox URLs/metadata and link to the Dropbox-hosted files
- **File Request creation via Dropbox API** is feasible and should be part of onboarding automation
- **Dropbox API rate limits** should be tested for batch operations (creating 80+ client folders)

---

### 6. Team Roles and Handoffs -- Full Production Chain

#### Complete Production Handoff Chain (Mapped from Transcript)

```
Writer                    Strategist/Jr Strategist         Editor
  |                            |                              |
  | writes script              | assigns topic/title          | receives assignment
  | pastes link in Notion      | sets due dates               |
  | (triggers KPI timestamp)   | reviews script (?)           |
  |                            |                              |
  +----------------------------+---> Client films footage ---->|
                                                              |
                                                    edits video (V1)
                                                    uploads to Dropbox
                                                    submits via Notion form
                                                    (triggers Slack notification)
                                                              |
                                                              v
                                                    Senior Editor
                                                    reviews V1
                                                    approves or requests changes
                                                    (responds in Slack thread)
                                                              |
                                                    if approved:
                                                              |
                                                              v
                                                    YouTube Manager
                                                    sends V2 link to client
                                                              |
                                                              v
                                                    Client
                                                    reviews on Dropbox
                                                    leaves timestamped comments
                                                              |
                                                    if changes requested:
                                                              |
                                                              v
                                                    Editor
                                                    revises based on client notes
                                                    produces V3
                                                    re-submits via Notion form
                                                              |
                                                              v
                                                    YouTube Manager
                                                    final review
                                                    publishes to YouTube
```

#### Role Responsibilities Confirmed in This Call

| Role | Responsibilities (from this transcript) |
|------|----------------------------------------|
| **Editor** | Edits video, uploads versions to Dropbox `Edited Videos` folder, submits via Notion edit submission form, revises based on feedback |
| **Senior Editor** | Reviews V1 internally, approves or rejects, responds in Slack thread with review decision |
| **YouTube Manager** | Sends V2 Dropbox link to client, relays client feedback to editor, handles final publish to YouTube |
| **Writer** | Writes scripts in Google Docs, pastes script link in Notion task (triggering KPI timestamp) |
| **Editor/YouTube Manager/Someone Responsible** | Curates B-roll -- moves reusable footage from A-roll to B-roll folder |
| **Clayton** (new role) | Building visual brand identity (logos, brand guides, color palettes) for all clients -- "kind of his job, it's kind of building this for all the clients" |

#### Key Handoff Observations

- **Editor does NOT send the video to the client.** The YouTube manager does. Paulo explicitly corrected Nourin: "No, no, it's not the editor that does that, it's the YouTube manager."
- **The senior editor and YouTube manager are BOTH notified simultaneously** when an editor submits -- they are both tagged in the same Slack message. But the review is sequential: senior editor first, then YouTube manager handles client communication.
- **Client feedback is relayed indirectly.** The client comments on Dropbox, but it is the YouTube manager who tells the editor what needs to change (via the Slack thread). The editor may or may not look at Dropbox comments directly.

---

### 7. Broken/Underutilized Processes

#### B-roll Folder -- "Not Working Like It Should"

- **Intended purpose:** Curated library of reusable footage per client, organized by type (drone footage, landmarks, etc.)
- **Actual state:** Editors dump files loosely, organized only by date (e.g., "2025 September", "2025 October") without descriptive categorization
- **Paulo's assessment:** "This is not working like it should. But the idea was to have only selected videos over here... It's not working as it should, basically. Sometimes it is, but not always."
- **Paulo's suggestion:** "We can also organize by, I don't know, by describing, for example, drone footage. That was the intention, actually, to have, like, a folder just with the drone and et cetera."
- **Root cause:** No enforcement of structure, no naming conventions, personal preference drives organization

**App implication:** If the app manages file metadata, it could provide a tagged/searchable B-roll library per client -- tagging clips as "drone", "landmark", "exterior", etc. This would fix the organizational problem without requiring strict folder hierarchies. However, this is likely Phase 2+ scope.

#### Projects and Assets Folder -- "A Bit Broken"

- **Intended purpose:** Store client-specific production assets (logos, brand guides, color palettes, Premiere/After Effects project files)
- **Actual state:** "We rarely use this folder" -- most clients still use Google Drive for brand assets
- **Why it is broken:** Dual-system problem -- assets split between Dropbox and GDrive with no clear rule
- **What is stored when it IS used:** PDFs, JPGs, PNGs, .prproj (Premiere), .aep (After Effects) files, brand guides, color palettes
- **Clayton's role:** Clayton is a new team member building visual brand identity for all clients, which will eventually populate these folders. "He's just starting, so I think it will take some time until he gets to all clients."

**App implication:** The client profile should have a "Brand Assets" section where links to brand guide docs, logos, and color palettes can be stored. This provides a single source of truth regardless of whether the actual files live in Dropbox or GDrive.

#### Google Drive -- Becoming Secondary/Redundant

- Paulo described GDrive as having "become more secondary" after the Dropbox migration about a year ago
- "A year, more or less a year ago, this was kind of had the same usability or the same function as Dropbox"
- Some clients are in a **hybrid state** -- older clients still use GDrive for some things: "This is an old client, so we were using still Google Drive"
- The GDrive folder structure was described as "a bit messy"
- Paulo acknowledged: "We don't use it for anything else. We basically use Google Drive because it has a great integration for docs."

#### Scripting Writer Field Often Empty

- When Paulo showed the Notion task, the "Scripting Writer" field was empty for the example: "This should not be empty, but okay."
- This suggests data hygiene issues in Notion that the app should prevent (required fields on project creation)

---

### 8. Brainstorming and Future Ideas (Nourin + Paulo)

#### Replacing Google Drive with App Features

Nourin explicitly proposed this during the call:

> "Under client... we can add features of creating and adding or just pasting Google Doc link and that way maybe we can just replace Google Drive, but we need Dropbox for the videos."

Paulo agreed with the concept. The idea is:
- The app stores clickable Google Doc links (scripts, resources) per client
- Clicking a link opens Google Docs in a new tab for editing
- GDrive as a storage/navigation layer becomes unnecessary
- Only Dropbox remains as the external file system

#### Consolidating to Dropbox-Only (for Files)

The discussion around Dropbox's Google Docs integration was a pivotal moment:
- Nourin discovered that "Dropbox offers direct integration with Docs, files, etc."
- Paulo was surprised: "So yeah, that's good news. Nice."
- This means scripts could potentially live in Dropbox Paper or as linked Google Docs within Dropbox folders
- However, Paulo was uncertain about editing capabilities: "I know that we can have docs inside Dropbox, I'm not really sure if we can edit them"
- Nourin clarified that links would just open in Google Docs regardless of where they are stored

**Decision still pending:** Whether to migrate document storage to Dropbox or simply have the app act as the link aggregator, making the underlying storage location irrelevant.

#### Client-Facing Dashboard Concept

While not explicitly discussed in this transcript as a "dashboard," the building blocks were laid:
- Clients need easy access to their **File Request upload link** (currently saved in Slack canvas, unreliably)
- Clients need access to **video review links** (currently sent ad-hoc by YouTube manager)
- Clients review and approve **brand voice guides** (currently sent as Google Docs links)

A client dashboard could consolidate:
1. Upload link (always available, no searching Slack)
2. Videos in review (with link to Dropbox for commenting)
3. Published videos (archive)
4. Brand documents (brand voice guide, geographic context, etc.)
5. Project status (what is in progress, what is due)

#### Rethinking B-roll Organization

Paulo explicitly said: "I think we can think, rethink this structure." He suggested organizing by descriptive labels (drone footage, etc.) rather than by date. This is an open design problem that the app could solve with tagging/metadata rather than folder hierarchies.

---

### 9. Additional Micro-Details Worth Capturing

#### Dropbox File Request -- Naming Convention Mechanics

- When creating a File Request, Paulo navigates to: Home > File Requests > Request File
- He demonstrated a specific client (was going to create one for "Add and All" as an example but stopped to avoid creating a duplicate link)
- The naming convention auto-stamps the upload date -- Nourin confirmed: "When you set up the convention, the date instructs Dropbox to auto take the date uploaded." Paulo: "Yes, exactly."
- Individual files within an upload are differentiated by this auto-date, not by client action

#### Dropbox Reliability vs. Competitors

- Paulo tried other video-focused services but they failed: "We tried other services more focused on video production, but we didn't have a good experience."
- The specific failure: "The server was down and then we couldn't work for entire day."
- Dropbox advantage: "Dropbox so far has been the best option" -- fast, always available
- GDrive download problem is specific: GDrive "splits the folder in two gigabytes files, like .zip files, and then... usually one file will fail the download during the download." Dropbox downloads a single file, and if it fails, only that one file needs re-downloading.

#### Exterior vs. Interior Shoots

- Exterior/outdoor shoots produce significantly more raw footage than interior shoots
- Reason: "a lot of B-rolls, etc." (supplementary footage of landscapes, buildings, landmarks)
- This affects project size estimates -- outdoor-focused clients will trend toward the 30 GB range

#### Edit Submission Links to Notion Task

The edit submission form has a field where the editor **pastes the Notion task URL** (not the Dropbox link). This is how the submission is connected to a specific project. In the app, this field would be replaced by a project selector or would be triggered from within the project detail page.

#### Version Checkbox in Edit Submission

The Notion form includes a **checkbox** for selecting the version being submitted (V1, V2, V3). This is a simple selection, not a complex workflow -- the editor just checks which version they are submitting. The app should replicate this as a version selector in the edit submission flow.

#### Dropbox Video Comments -- Both Internal and Client

Paulo explicitly distinguished between two types of comments on Dropbox videos:
- **Internal comments** -- team members (senior editor, YouTube manager) leaving notes
- **Client comments** -- the client leaving feedback with timestamps

Both coexist on the same video file. The Dropbox comment thread serves as the review discussion for each version.

---

### 10. Summary of Implications by App Module

| Module | What This Transcript Informs | Priority Details |
|--------|------------------------------|-----------------|
| **Module 1 (Clients)** | Client profile needs: File Request link field, brand assets section, document links (scripts/resources), brand voice guide status | Store Dropbox File Request URL on client record; add "Resources" section with categorized doc links |
| **Module 2 (Kanban)** | Edit submission workflow, version tracking (V1/V2/V3), Dropbox link storage per version, automated notifications on submission | Project cards need: version field, Dropbox link per version, edit submission action, auto-notify senior editor + YouTube manager on status change |
| **Module 3 (Role Boards)** | Senior editor reviews V1, YouTube manager sends V2 to client, editor revises for V3 -- each role needs to see projects at their review stage | Senior editor board: filter for "ready for internal review"; YouTube manager board: filter for "ready for client review" + "client feedback received"; Editor board: filter for "in editing" + "revision requested" |
| **Module 4 (KPIs)** | Script on-time KPI (timestamp vs due date), edit on-time KPI (same pattern), binary 1/0 scoring, aggregation per team member | Capture auto-timestamps on: script link pasted, edit submitted, video published. Compare each against due dates. Calculate on-time % per person per period. |
| **Client Dashboard (new)** | Upload link always visible, video review links per project, published video archive, brand document access, project status visibility | Would consolidate scattered client touchpoints (Slack canvas, ad-hoc Dropbox links, GDrive docs) into a single interface |
| **GDrive Replacement (new)** | App stores clickable Google Doc links for scripts + resources, organized per client. GDrive folder structure replaced by app UI. Docs remain in Google Docs for editing. | Minimal build: per-client doc link library with categories (Script, Brand Voice Guide, Geographic Context, etc.) |
| **Onboarding Automation** | Add Dropbox File Request creation step; brand guide generation could be triggered or tracked; client upload link should be stored in app, not just Slack canvas | Update onboarding spec to include: (1) create File Request, (2) store link on client record, (3) optionally trigger brand guide creation workflow |
