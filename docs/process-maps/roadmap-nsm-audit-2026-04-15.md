# Roadmap NSM Audit — 2026-04-15

**Purpose:** Durable reference for which features are in / out of scope under the current North Star Metric. Use in scope discussions with Clayton, Paulo, and the team.

**North Star Metric:** **Reduce the number of steps/tasks per role in the daily workflow.**

**Rule:** If a feature reduces steps for at least one role without adding steps elsewhere → **GO**. If it adds steps, is neutral, or only serves leadership/reporting without reducing IC work → **NO-GO (for now)**.

**Source discovery:** Two interviews on 2026-04-14 with Senior Writers (Vivian + Rafael) + Writer (Jessica) + Paulo. Transcripts in `docs/transcripts/2026-04-14/`. As-is process map at `docs/process-maps/writer-process-as-is.md`.

---

## Build sequence (top 5, unambiguous ordering)

1. **Project detail page as SSOT** — foundational; nothing else lands without this
2. **Status machine + auto-notify** — highest daily leverage; kills 3 Slack channels' reason to exist
3. **Client magic-link view + Approve/Request changes** — biggest user pain point (client comm lag) fixed
4. **Bundle: inbox + comments + @-mentions + Tiptap** — communication layer; ship together
5. **Writer capacity view** — cheap, visible, trust-builder with Vivian + Rafael

After these five, the rest is polish: script format on card, auto-archive, keyboard shortcuts, digest emails, auto-reports.

---

## Top 5 features — concrete step walkthroughs

### 1. Project detail page as single source of truth

**Today — Writer opens a new script assignment:**
1. Get Notion inbox ping
2. Click → Notion project page
3. Read brief
4. Open new browser tab → Google Drive → client folder → scripts subfolder → create new Google Doc
5. Open another tab → brand voice guide
6. Open another tab → area guide
7. Open another tab → Script Writing Prompts page in Notion
8. Open Claude in a new tab
9. Open Perplexity in a new tab

**≈ 10 steps, 4 apps, 6+ tabs** before writing starts.

**In app:**
1. Get app inbox ping → click
2. Project page: brief + script format flag + "Copy prompt" buttons + brand voice link + area guide link + "Create script in GDocs" all in one place
3. Open Claude + Perplexity (stay external — writer's tools, not ours)

**≈ 3 steps. Saving: ~7 steps per script. ~20+ steps saved per writer per week.**

---

### 2. Status machine + auto-notify

**Today — Strategist assigns a new script:**
1. Open Notion
2. Duplicate task template
3. Fill brief + due date + pod
4. Save task
5. Copy Notion link
6. Open Slack
7. Navigate to `#writing-work` channel
8. Paste link + message ("@Vivian, new one for you")
9. Post
10. Check Slack later for ack

**≈ 10 steps, 2 apps.**

**In app:**
1. Click "New Project"
2. Fill form
3. Save

**≈ 3 steps. Senior writer auto-gets inbox notification. Saving: 7 steps + tool switch per script.**

---

### 3. Writer capacity view

**Today — Vivian/Rafael assign a writer (transcript 8:04–9:40):**
1. Open Notion task
2. Check client due date
3. Open writer 1's page → read calendar
4. Open writer 2's page → read calendar
5. Open writer 3's page → read
6. Open writer 4's page → read
7. Open writer 5's page → read
8. Open writer 6's page → read
9. Mentally rebalance
10. Return to the task
11. Set writer + date

**≈ 11 steps** (6 tabs + mental juggling).

**In app — Capacity view:**
1. Open Capacity view
2. See all 6 writers + their load side-by-side
3. Drag task onto a writer

**≈ 3 steps. Saving: ~8 steps per assignment. Senior writers do this 30–40×/week.**

---

### 4. Client magic-link + Approve / Request changes

**Today — client feedback loop (transcript 28:00–28:40):**
1. Senior writer approves → status change in Notion
2. Automation posts in strategist's "client goes to" Slack channel
3. Strategist opens Slack, sees it
4. Strategist opens the Google Doc → copies link
5. Strategist opens client's Slack or email
6. Strategist pastes link + message to client
7. 1–3 days pass
8. Client DMs strategist with feedback
9. Strategist reads + parses feedback
10. Strategist opens `#writing-important`
11. Strategist types summary + Notion link + posts
12. Senior writer sees, opens project, interprets the feedback
13. If senior writer has a question → DM strategist → wait → context-switch

**≈ 13+ steps**, strategist is the bottleneck on 6 of them.

**In app:**
1. Senior writer approves → app auto-emails client: "Your script is ready: [magic link]"
2. Client clicks → sees script + 2 buttons (Approve / Request changes) + comment box
3. Client clicks Approve OR types feedback
4. Senior writer gets inbox notification on that exact project with client's comment threaded

**≈ 4 steps. Strategist is out of the critical path. Strategist saving: ~6 steps → 0. Single biggest step reduction in the entire roadmap.**

---

### 5. Bundle: inbox + comments + @-mentions + Tiptap

**Today — Writer asks strategist a clarification (Jessica's case, transcript 31:35–32:39):**

Option A (Slack — what most writers do):
1. Open Slack
2. Navigate to `#writing-brief`
3. Type `@strategist` + paste context + ask
4. Post
5. Wait for reply (time-zone dependent)
6. Context-switch back to Notion/GDoc when reply arrives

Option B (Notion comment — only Jessica does this):
1. Click comment field on Notion project page
2. Type `@strategist` + question
3. Post

**Option A: 6 steps. Option B: 3 steps. Team split, no shared convention.**

**In app:**
1. On the project page, type `@strategist` + question in the comment box
2. Strategist gets inbox notification on that project
3. Reply threads inline, visible to everyone on the project

**≈ 3 steps + one convention for the whole team. Saving: 3 steps per clarification + kills the Slack-vs-Notion ambiguity.**

---

## GO table — full (24 items)

| # | Feature | Role impact | Step reduction | Additions | Verdict |
|---|---|---|---|---|---|
| 1 | Project detail page as SSOT | All | 10 → 3 per script (writer) | None | GO — foundational |
| 2 | Status machine + auto-notify | Strategist, Sr Writer, Writer | 10 → 3 per new script | None | GO — highest daily leverage |
| 3 | Reusable Kanban + My Board | All 6 roles | Multiple views collapsed into one | None | GO — in flight |
| 4 | Project CRUD (Module 2) | Strategist, Sr Writer | 6 → 2 per new script | None | GO — in flight |
| 5 | Client + Team CRUD (Module 0/1) | Admin | ~15 → ~5 per client onboard | None | GO — built |
| 6 | Client detail page | Strategist, Manager, Writer | 2–3 clicks → 1 per lookup | None | GO — built |
| 7 | Onboarding automation (Slack + Dropbox) | Strategist, Admin | ~8 → 1 per client | None | GO — built |
| 8 | Google OAuth | All | 3 → 1 per login | None | GO — built |
| 9 | Script format field on card | Writer | Kills hidden-field rework | None | GO — trivial |
| 10 | Writer Submission Form integrated | Writer, Sr Writer | 4 → 1 (inline) | None | GO |
| 11 | Auto-archive completed projects | All | 1/week → 0 | None | GO — trivial |
| 12 | In-app notification inbox | All | 3 places → 1 | None | GO — prerequisite |
| 13 | Inline comments on projects | Writer, Sr Writer, Strategist | 3 → 1 per clarification | None | GO — bundle with #12/14/15 |
| 14 | @-mentions with routing | All | Removes "pick channel" decision | None | GO — bundle |
| 15 | Rich-text editor (Tiptap) | All | Enables #13/#14 fluency | Build cost only | GO — bundle |
| 16 | Client magic-link + Approve/Request changes | Strategist, Client, Sr Writer | 13 → 4 per feedback loop | +1 click for client | GO — biggest pain point fixed |
| 17 | Email-reply threading | Strategist | 1 → 0 per email feedback | Engineering cost only | GO if #16 adoption < 70% |
| 18 | Email notifications (digest only) | Remote/async writers | Replaces "check later → miss" | +0 if digest default | GO — digest only. Per-item = NO-GO. |
| 19 | Writer capacity view | Sr Writer | 11 → 3 per assignment | None | GO — direct Vivian/Rafael save |
| 20 | Keyboard shortcuts for status changes | Sr Writer | 3 clicks → 1 keystroke per card | +1 learning step once | GO — high-volume win |
| 21 | Slack DM forwarding of project notifications | Slack-native users | Saves "check app" during transition | +1 config unless default-on | GO — DM-only, default-on, bridge feature |
| 22 | Script Writing Prompts library in app | Writer | 3 → 1 per prompt use | +maintenance if mirrored not replaced | **GO only if it REPLACES the Notion page. Ask Vivian/Rafael first.** |
| 23 | Auto-generated weekly reports | Everyone | 1/week → 0 | None | GO — pending Clayton OK to kill manual reports |
| 24 | Auto-subscribe on assignment | All | Invisible, zero steps | None | GO on auto-subscribe. Manual toggle = NO-GO for V1. |

---

## NO-GO table (for now, under this NSM)

| # | Feature | Why NO-GO | Revisit trigger |
|---|---|---|---|
| 25 | KPI dashboard for leadership | Zero IC step reduction | When NSM shifts to "throughput quality" (~6 months post-launch) |
| 26 | Full client portal with login | Magic link gets 95% at 0 client steps | When a client asks for login-gated multi-project access |
| 27 | General team chat outside project context | Duplicates Slack → +1 place to monitor | Never under this NSM |
| 28 | Custom branded client emails | Cosmetic; adds setup step | Never under this NSM |
| 29 | Advanced reporting filters | Leadership-only | Same as #25 |
| 30 | Feature flags framework | Internal infra; zero end-user impact | When >100 users and gradual rollouts are needed |
| 31 | In-app video recording (Loom-style) | Adds a new channel; doesn't replace existing steps | Only if async video becomes a documented recurring workflow |
| 32 | Gamification / leaderboards | Zero step reduction; likely distraction | Never under this NSM |
| 33 | Native mobile app | Same flows on smaller screen; huge build cost | Never — PWA + responsive covers it |

---

## Elephants in the room (political/organizational — not captured by NSM)

These are the risks that the NSM table will not catch. Surface them in conversations with Clayton and Paulo.

1. **Clayton wants the app for leadership + KPI visibility; the team wants workflow relief.** If those goals conflict (e.g., a KPI dashboard needs fields writers won't fill), who wins?
   - *Conversation starter:* "Clayton — if KPI completeness and writer ease-of-use conflict, which wins on day one?"

2. **No strategist has been interviewed.** The strategist is the load-bearing role for every real pain in the process map (client comm lag, feedback routing). We are building half the app with eyes closed.
   - *Action:* Schedule a strategist interview this week. Non-negotiable before Module 3.

3. **"Replace Notion" was decided before discovery.** The as-is mapping is justifying the decision, not testing it. Everyone senses this.
   - *Conversation starter:* "Paulo — is there a scenario where we keep Notion for review and only replace planning/KPIs?" If his answer is "no, Clayton is firm," then it's political — fine, but scope accordingly.

4. **Vivian is at 30–40 scripts/week.** Asking her to dogfood without reducing her load means dogfooding will be shallow or resented.
   - *Action:* "Paulo — can we give Vivian one day a week of reduced load during pilot?"

5. **Paulo is ops lead, not PM.** PM work is being done by Nourin. Explicit alignment on the project-as-conversation thesis has not been confirmed with him.
   - *Conversation starter:* "Paulo, walk me through why you think this thesis is right. Where do you disagree with me?"

---

## 3 genuinely ambiguous calls — what evidence settles them

| # | Question | Evidence needed |
|---|---|---|
| 22 | Prompts library in app — replace or mirror? | Direct ask to Vivian/Rafael: *"If we moved the prompts page into the app and retired the Notion one, would that hurt or help?"* If they flinch, keep in Notion and deep-link. |
| 21 | How long do we run Slack DM forwarding? | After 2 weeks of #12 (in-app inbox), poll the team: *"Do you still check Slack for project notifications?"* If >50% yes → keep forwarding. If <50% → retire. |
| 17 | Is email-reply threading worth building? | After #16 magic link ships, measure: *what % of client feedback comes via magic link vs. email reply to strategist?* If magic link >70%, #17 is marginal. |

---

## Next actions (prioritized)

1. **Interview a strategist this week.** Unblocks Elephant #2.
2. **Ask Clayton: "name 3 KPIs that would make this app feel worth the effort."** Unblocks Elephant #1 and gates whether #25 goes from NO-GO → GO later.
3. **Technical spike (2 days): build a throwaway comments + notifications proof on one project.** Tiptap + `comments` table + Supabase Realtime + one Resend email. Show to Vivian. De-risks #13/#14/#15 + tests the "no downgrade" promise.
4. **Feature-parity checklist session (45 min) with Vivian + Rafael** against their current Notion workflow. Becomes Module 2 acceptance test.

---

## Related docs

- `docs/process-maps/writer-process-as-is.md` — the as-is process map
- `docs/process-maps/writer-interview-summary-jessica-2026-04-14.md` — Jessica JTBD summary
- `docs/transcripts/2026-04-14/` — raw transcripts
- `docs/master-tasklist.md` — active task list (add follow-ups here)
