# Presentation Script — Clayton & Paulo Walkthrough

---

## [Opening — 30 seconds]

"Hey Clayton, hey Paulo. So the last day and a half I've been thinking deeply about the operations — the end-to-end system, how everything connects, and how to build the app so it actually achieves what we need. The goal is: reduce manual tasks, make operations seamless, and make tracking automatic — not a separate thing people have to remember to do.

I want to walk you through my thinking. Some of this you already know — I just want to show you how I'm connecting the pieces. And wherever I have gaps or questions, I'll flag them. Jump in anytime."

---

## [Section 1 — Today: End-to-End Process] ~2 min

"So here's the full process as I understand it today, end to end. A new client signs, someone starts onboarding across Slack, Dropbox, GDrive, and Notion. Then Clayton does pod and team assignment. Welcome and kickoff. Then into production — writer writes the script, client films, editing and revision cycles, internal review, client review, and finally publish.

I know not all of these happen strictly in this order — some run in parallel. I've kept it linear here just so we can see every step and every tool involved in one view. Eleven steps, multiple tools at each one.

The main thing I want you to notice is how many different tools are touched. That's what the app consolidates."

---

## [Section 2 — Onboarding Deep Dive] ~2 min

"Now I'm zooming into onboarding specifically, because everything starts here. Every client hits this process, so getting it right matters most.

When a client signs, someone starts the setup — could be a YouTube manager, could be Paulo, could be whoever is available. That's fine for now. The five setup steps — Slack channel, Dropbox folder, File Request link, GDrive folder, Notion page — these all happen in parallel and don't depend on the pod. That was an important thing I picked up from our conversations: pod assignment comes after, not before.

Then Clayton assigns the pod and team. Welcome message goes out. First project gets created. Client is active.

This is what we're automating."

---

## [Section 3 — Onboarding in the App] ~4 min

"Here's the same onboarding, running through the app.

Step one: whoever gets the task creates the client in the app. Name, email, the basics — 30 seconds, like filling out a short form.

The moment they hit save, the app fires automatically: creates the Slack channel with the right naming convention, adds Clayton and Andrew, duplicates the Dropbox template folder, and creates the File Request link — all in about 15 seconds. There's a live progress modal showing each step completing with a checkmark or an error if something fails.

GDrive folder? Not needed anymore — the app is the record. Notion page? Same — the app replaces it.

Team assignment and pod assignment are still manual — Clayton does those in the app. The app will show pod capacity so it's an informed decision, not guesswork.

Two questions for you here:

First — once team assignment is done, should the app auto-add those team members to the client's Slack channel? Or do you want that manual?

Second — I think we should auto-send a welcome message to the client through the Slack channel with their dashboard login link. But I don't know if you prefer to keep a human touch there. Let me know what you think.

**Now let me explain the client side.**

This is the part I think we should build alongside onboarding, like we discussed. A client-facing dashboard.

Here's how the magic link works: when a client is created in the app, it generates a login link specific to that client. We don't want random people finding the app and signing up as clients — this is invite-only. The link lives in the client's Slack channel as a canvas, and also in their email. They click it, they're logged in. No signup, no password.

On their dashboard they see an upload button — they click it, it takes them directly to the Dropbox File Request page. Same familiar Dropbox upload experience, files go straight to Dropbox, never touch our server. But here's the key part: a Dropbox webhook detects the upload and captures the exact timestamp. So tracking has already started — we know when the client uploaded footage without anyone logging anything.

They can also see their project status, review links when a video is ready, and their brand documents. No more asking the team 'where's my upload link?' or 'what's the status of my video?'"

---

## [Section 4 — Production Flow + KPIs] ~3 min

"After onboarding — here's how each video moves through the system. I've covered this before so take a look and let me know if any step is missing or any process I got wrong.

Writer clicks 'Create Script' — a Google Doc is auto-created, named, and linked to the project. Client uploads footage through their dashboard. Editor submits the edit in the app — pastes the Dropbox link, selects the version. Senior editor and YouTube manager get auto-notified. Internal review, client review on Dropbox with their commenting, and finally publish.

Now here's the part I want to highlight. I've added some examples of KPIs just to give you a sense of what we'll be capturing. A lot more is possible, but these are the key ones.

Every action in this flow generates a timestamp. Writer clicks 'Create Script' — that's a script-started timestamp. Compare it to the due date — that's your script on-time percentage. Editor submits — edit-submitted timestamp versus due date — edit on-time percentage. Client uploads footage — we know exactly when via the webhook — that's client turnaround time. YouTube manager moves a card to 'Published' — that's your videos-launched percentage, accurate for the first time.

The point is: nobody is doing separate KPI entry. The act of doing the work IS the data. That's why we're building it this way."

---

## [Section 5 — Before & After] ~2 min

"Section 5 — I've listed out every key process by role: how many steps it takes today versus in the app. Writer creating a script goes from 7 steps to 2. YouTube manager sending a video for review goes from 3 steps to 1 click. Onboarding goes from 15-plus minutes across 4 tools to 30 seconds plus one decision.

No action gets harder. Most get dramatically simpler.

As we start building each part, it would be really valuable to have the person in that role review these steps. They'll catch things I missed or got wrong. For example, once we're past onboarding and the client dashboard, can we start involving a writer to review their workflow? Same with editors, YouTube managers, strategists.

They don't need to review the whole app — just their section. Quick conversation, 15 minutes."

---

## [Section 6 — What Goes, What Stays] ~2 min

"What gets replaced: Notion — fully. Client records, project boards, KPI dashboards, edit submission forms, all of it moves into the app. Google Drive folder navigation — gone. Doc links live in the app, you click and it opens the Google Doc directly. No more navigating to the right folder under the right email.

What stays: Dropbox for video files — nothing else handles 5 to 30 gig files the way Dropbox does. Client commenting with timestamps, File Request links, the team already knows it. Google Docs stays for collaborative script editing — writers and strategists editing simultaneously. The app just links to the docs. And Slack stays for notifications and client communication — the app sends notifications to Slack, but Slack is no longer the source of truth for process coordination.

**On Dropbox storage** — Clayton, you mentioned you're at 24 of 30 terabytes. I looked into this. You're on Dropbox Advanced, which gives you 5 TB per license, pooled.

Three options. Option A: Dropbox Advanced lets you buy extra storage directly from the Admin Console in 1 TB increments at $10 per TB per month. No extra user seats — just storage. Option B: add more licenses at $24 per user per month, which gives you 5 TB each — cheaper per terabyte but you'd have unused seats. Option C: we build an archival process into the app — active work across 74 clients is only about 2 to 3 terabytes, so the other 22 TB is completed projects. We could move those to cold storage after 60 or 90 days at $6 per terabyte per month.

I don't think archival is urgent right now, but as the company grows and you're adding more clients and more files, it's worth building in. For the short term, the add-on or license route removes the pressure immediately. Take a look at the comparison table here and let me know which direction you prefer."

---

## [Section 7 — Build Order] ~1.5 min

"Finally — the build order. Each step creates the data the next step needs.

Step 1, done: auth and client management. The system now knows who your clients are, who your team members are, what roles they have. 80 clients and 35 team members migrated from Notion. This replaces the Notion client database.

Step 2, what I'm working on now: onboarding automation and the client dashboard. This is how clients enter the system. Step 1 gave us the records — this step gives clients their entry point. Replaces the manual 4-tool onboarding setup.

Step 3: the production pipeline. Step 2 brought clients in — this step tracks what the team does for each client. Kanban board, edit submissions, script creation, version tracking. Every status change captures a timestamp. This is where KPI data starts generating itself. Replaces Notion project boards and GDrive.

Step 4: role boards and KPI dashboards. By this point, steps 2 and 3 have been capturing every timestamp. This step just reads that data. No manual KPI entry, no broken Notion formulas. Building this last means the dashboards have real data from day one — not zeros.

That's the plan. What questions do you have?"

---

## Tips for delivery

- Don't rush Sections 3 and 4 — that's where the value clicks
- Pause after each question box — give them space to react
- Section 5 is a scan, not a read — point to the table and let them look, then highlight 1-2 standout numbers
- On Dropbox storage, don't push a recommendation — present the options and let them decide
