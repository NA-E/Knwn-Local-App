# Writer Interview Summary — Jessica Gonzatto

**Date:** 2026-04-14 (Session 2, Jessica's portion starts ~17:10, ~16 min)
**Participants:**
- Jessica Gonzatto — Writer
- Paulo Folly — Operations (observing)
- Nourin — PM (interviewer)
- Vivian Vardasca, Rafael Stiborski — Senior Writers (observing)

**Background:**
Jessica is a writer on the content team. She writes YouTube scripts for clients using a workflow centered on Notion for task tracking, Google Drive for client resources, Perplexity for research, and Claude for script drafting. She is not a senior writer, so she does not handle distribution or review — she executes the writing itself.

---

## Current Solution

Jessica's day-to-day stack:
- **Notion** — receives notifications in inbox, opens project page, reads brief and special instructions, reports status
- **Google Drive** — opens the client's folder to access the `scripts/` and `resources/` subfolders (brand voice guide, area guide)
- **Perplexity (Deep Research plan)** — topic research and fact-checking
- **Claude** — drafts the script using team-maintained prompts
- **Google Docs** — the actual script document; shares the link back into Notion
- **Notion Script Writing Prompts page** — shared prompt library maintained by senior writers

---

## What She Likes About Current Solution

| Job to be Done | What She Likes | Importance | Satisfaction |
|----------------|----------------|------------|--------------|
| Know what to work on | Notion inbox notifications land the right task at the right time | High | High |
| Understand the client's requirements | The project page has everything in one place: brief, special instructions, format, client resources | High | High |
| Keep craft consistent across writers | The shared Script Writing Prompts page acts as "a dictionary for prompts" — tested, senior-approved prompts everyone can use | High | High |
| Find client-specific resources | Google Drive client folder is linked directly from the Notion project page — brand voice and area guide are one click away | Medium | High |
| Communicate small clarifications to the strategist without demanding their immediate attention | Notion comments/notes field routes to strategist's Notion inbox — "cleaner and faster than Slack" | Medium | High |
| Signal that a script is done | One status change in Notion triggers the `#ghostwriters` Slack automation — no manual handoff needed | High | High |

---

## Problems With Current Solution

| Job to be Done | The Pain | Importance | Satisfaction |
|----------------|----------|------------|--------------|
| Communicate a detail to the strategist that shouldn't be in the script | Currently she uses the Notion notes field — but acknowledges there is no standard: *"I think I'm the only one who leaves comments. I don't know."* | Medium | Medium |
| Know which script format the client wants | Must remember to scroll down and check the "word for word vs bullet" field every time — easy to miss | Medium | Medium |
| Decide whether to use Slack or Notion for a clarification | Ambiguous — she sometimes uses Slack, sometimes the script itself, sometimes Notion. No clear rule. | Low | Medium |
| Submit quality-check form | Optional for writers (mandatory for editors). No enforcement mechanism, no signal of value. | Low | Low |
| Know which client folder structure to use | `content/` and `thumbs/` subfolders aren't for writers — she has to remember which ones apply to her | Low | Medium |

**Note:** Jessica did not raise strong frustrations. Her overall tone was *"it's working for us the way that the project page is right now."* The pains above are inferred from behavioral inconsistencies (e.g., being "the only one" who comments) rather than explicit complaints.

---

## Key Insights

1. **Shared prompts are a load-bearing asset.** The Script Writing Prompts page is described as "a dictionary for prompts" — senior-tested, senior-approved, used by most writers. Any app that doesn't preserve or replicate this loses significant value.

2. **Writers do real research work.** Jessica described perplexity + Claude as a workflow, not a crutch: research with deep prompts, then draft, then fact-check, then rewrite sections. "We had to fight for this" (getting the right Perplexity plan approved) signals this is considered essential.

3. **Notion comments > Slack for async clarifications.** Jessica explicitly prefers Notion comments for strategist questions because they land in the strategist's inbox but don't demand immediate attention. This is a subtle but important design signal — the app needs the same semantics: async, addressed, but non-urgent.

4. **Inconsistency across writers.** Jessica thinks she may be the only writer using the Notion comments field. Other writers may use Slack for the same purpose, or skip the communication entirely. The team lacks a shared convention here.

5. **Script format (word-for-word vs bullet) is a meaningful branch.** It changes the entire writing approach. Currently this is a field buried in the Notion page — Jessica has to remember to check it every time. The app should surface this prominently on the card.

6. **The writer's workflow is tool-rich but app-light.** Notion is only used for task metadata and status. The *work itself* happens in Perplexity, Claude, and Google Docs. The app needs to be a hub that links out gracefully, not a place writers write inside.

7. **Quote worth keeping:** *"It's basically like a workflow for us. And it's mostly for everyone to be on the same page, like Vivian said and Rafael said, on the writing prompts that we are using."* — the team's cohesion comes from the shared prompt library, not from the task tracker.

---

## Action Items

| Date | Owner | Action |
|------|-------|--------|
| 2026-04-14 | Nourin | Fold insights 1–6 into `docs/process-maps/writer-process-as-is.md` |
| 2026-04-14 | Nourin | Confirm: should the app replicate the Script Writing Prompts page, or keep it in Notion? (question for Clayton) |
| 2026-04-14 | Nourin | Confirm: standardize writer-to-strategist async comms (Notion comments vs Slack)? — question for Clayton/Paulo |
| 2026-04-14 | Nourin | Add `script_format` (word-for-word / bullet) as a prominent card field on the writer's My Board |
| Next review | Paulo | Decide whether Writer Submission Form should be mandatory (like it is for editors) |
