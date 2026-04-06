# Fathom Recap: Impromptu Zoom Meeting (Call 2)

- **Date:** April 06, 2026
- **Duration:** 38 mins
- **Time:** 9:19 PM
- **Participants:** Nourin Ahmed Eka, Paulo Folly
- **Source:** Fathom AI Summary via email

---

## Meeting Purpose

To map the current video production workflow and file management systems.

## Key Takeaways

- **Dropbox is the primary video hub**, used for its superior handling of large files (avg. 10 GB/project) and integrated client feedback tools.
- **A Notion-driven workflow automates handoffs:** Editors submit videos via a Notion page, triggering Slack notifications that tag the senior editor and YouTube manager for review.
- **Google Drive is a secondary system** for text documents, but its role is redundant; Dropbox's native Google Docs integration makes a full migration feasible.
- **KPIs are automated in Notion** by comparing a script's submission timestamp against its due date, generating a 1 (on-time) or 0 (late) value for tracking.

## Topics

### Dropbox: The Video Hub

- **Structure:** A Client Template folder is duplicated for each new client, containing four subfolders:
  - **A-roll:** Raw client footage.
  - **B-roll:** Curated, reusable assets (e.g., drone shots). Note: This folder is underutilized and needs a clearer organization strategy.
  - **Edited Videos:** Final deliverables, organized by month and version (V1 Internal, V2 Client, V3 Final).
  - **Projects and Assets:** Client-specific files (logos, brand guides). Note: This folder is also underutilized; many clients still use Google Drive for these assets.

- **Client Uploads:** A one-time Dropbox File Request link is generated for each client.
  - **Why:** This method uploads files directly to the company's storage, preventing clients from hitting their own Dropbox storage limits.
  - **How:** Files are auto-named by upload date, ensuring unique identification.

- **Rationale for Dropbox:**
  - **Large File Handling:** Superior to Google Drive for downloading large folders, which Google Drive often splits into smaller, error-prone zips.
  - **Integrated Feedback:** Clients can leave timestamped comments directly on video files.

### Google Drive: The Document Repository

- **Current Use:** Exclusively for text documents (scripts, brand guides) due to its native Google Docs editing.
- **Scripts Folder:**
  - **Naming:** Scripts are named after the video's working title.
  - **KPI Automation:** A Notion automation tracks script timeliness.
  - **Process:** A writer pastes a script link into a Notion task -> A timestamp is auto-generated -> The timestamp is compared to the due date -> A 1 (on-time) or 0 (late) value is produced for KPI tracking.

### Workflow Automation: Notion & Slack

- **Editor Submission:** Editors use the Edit Submission page on the team board to submit videos.
  - **Process:** Paste the Notion task link -> Select the version (V1, V2) -> Submit.
- **Automated Notification:** Submission triggers a Slack message from the Notion app.
  - **Content:** Includes the task link and version status.
  - **Tagging:** Automatically tags the responsible senior editor and YouTube manager for immediate review.

## Next Steps

- **Nourin:** Evaluate a full migration of all document workflows from Google Drive to Dropbox, leveraging its native Google Docs integration to consolidate systems.

## Action Items

| Action | Owner |
|--------|-------|
| Review Nourin's app; send video Qs to Nourin | Paulo Folly |
