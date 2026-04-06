# Client Onboarding — Discovery Interview Script

> **Purpose:** Fill gaps in the as-is process map + surface pain points to inform the to-be automation design.
> **Participants:** Clayton (CEO/Strategy), Paulo (Operations)
> **Format:** 30-min structured interview (can be async via Loom/Slack if needed)
> **Reference:** [As-Is Process Map](client-onboarding-as-is.md) — review before the interview

---

## Opening (2 min)

- "We're mapping the exact onboarding steps so we can build it into the app. No right or wrong answers — we need to know what actually happens today, including the messy parts."
- Share the as-is process map so they can see what we already know vs the gaps marked with (?)

---

## Part 1 — Walk Me Through It (10 min)

> **Goal:** Get a real story, not a theoretical process. Past tense, specific client.

### For Paulo:
1. "Think about the **last client you onboarded**. Walk me through exactly what you did, step by step, from the moment you found out they signed."
   - Who told you? How? (Slack message, email, meeting?)
   - What was the first thing you did?
   - What did you do next?
   - How long did the whole thing take?

2. "Was there anything you forgot or had to go back and fix?"

3. "Did anyone else help with that onboarding, or was it all you?"

### For Clayton:
1. "Think about the **last client that was onboarded**. What was your involvement?"
   - Did you decide the pod? How?
   - Did you create any of the channels/folders, or delegate?
   - At what point did you consider them 'onboarded'?

2. "When things go wrong with onboarding — like a step gets missed — how do you find out?"

---

## Part 2 — The Gaps (15 min)

> **Goal:** Fill specific unknowns from the as-is map. Ask one at a time, get concrete answers.

### Trigger & Entry Point
| # | Question | Who | Notes |
|---|----------|-----|-------|
| 1 | "After a client signs, what literally happens? Is there a Slack message, an email, a CRM update? Who sends it?" | Paulo | We don't know the trigger |
| 2 | "Where do you first enter the client's info? Notion? A spreadsheet? Or straight into Slack/Dropbox?" | Paulo | Need to know the source of truth |

### Pod Assignment
| # | Question | Who | Notes |
|---|----------|-----|-------|
| 3 | "Walk me through how the pod gets decided. Last 3 clients — was it the same process each time?" | Clayton | He mentioned no clear process exists |
| 4 | "Is there a capacity check? Or is it gut feel / who has bandwidth?" | Clayton | |
| 5 | "Has a pod assignment ever been wrong or changed after the fact? What happened?" | Clayton | Surface real pain |

### Slack Channel
| # | Question | Who | Notes |
|---|----------|-----|-------|
| 6 | "Beyond Clayton, Andrew, and the pod team (strategist/manager/jr strategist) — who else gets added?" | Paulo | Writer? Editor? Designer? Client? |
| 7 | "Has anyone ever been missed from a channel? What happened?" | Paulo | Frequency of this pain |
| 8 | "When a team member changes (e.g., new strategist), who updates the Slack channel? How?" | Paulo | Clayton flagged this as a concern |

### Dropbox Folder
| # | Question | Who | Notes |
|---|----------|-----|-------|
| 9 | "Can you open the Clients Template folder right now and show me / list every subfolder?" | Paulo | We need the exact structure |
| 10 | "After duplicating the template, is there anything else you do to the folder? Rename subfolders? Add files? Share with anyone?" | Paulo | Hidden steps |
| 11 | "The Dropbox is at 24/30 TB. Is there a plan, or is this a ticking bomb?" | Clayton | Strategic decision needed |

### Google Drive
| # | Question | Who | Notes |
|---|----------|-----|-------|
| 12 | "What exactly goes in the Google Drive folder? Just scripts, or other docs too?" | Paulo | Writing team workflow |
| 13 | "Is there a subfolder structure, or just one folder per client?" | Paulo | |
| 14 | "You mentioned possibly eliminating GDrive if Dropbox can hold scripts. Has the writing team weighed in? Would they be okay with that?" | Clayton | Strategic — could simplify automation |

### Team Assignment
| # | Question | Who | Notes |
|---|----------|-----|-------|
| 15 | "When a new client is assigned to a pod, how does each team member find out? Slack message? Meeting? They just see it?" | Paulo | Notification gap |
| 16 | "Is there a specific order to assignments? (e.g., strategist first, then manager, then writer?)" | Paulo | Dependency chain |
| 17 | "Who assigns the writer and editor/designer? Is it the strategist, the manager, or you?" | Paulo | Decision authority |

### Post-Setup
| # | Question | Who | Notes |
|---|----------|-----|-------|
| 18 | "After channels/folders/team are set up — is there a welcome message to the client? What does it say? Who sends it?" | Paulo | Could be automated |
| 19 | "Is there an internal kickoff? A meeting, a brief, or does the team just start?" | Paulo | |
| 20 | "When is the first project created? Same day? After a kickoff? Who creates it?" | Paulo | Triggers Module 2 |
| 21 | "Are there any other steps we haven't talked about? Contracts, billing, intake forms, brand guidelines, content calendar setup?" | Both | Catch-all for hidden work |

---

## Part 3 — Pain & Priority (5 min)

> **Goal:** Identify what to automate first. Look for strong emotions — they signal real pain.

| # | Question | Who |
|---|----------|-----|
| 22 | "What's the single most annoying part of onboarding a new client today?" | Both |
| 23 | "How often does something go wrong? Once a month? Every client?" | Both |
| 24 | "If you could only automate 3 things from onboarding, what would they be?" | Both |
| 25 | "Is there anything that MUST stay manual? (e.g., a personal welcome call, custom intro)" | Both |
| 26 | "How many clients do you onboard per month on average?" | Paulo |

---

## Wrap-Up (2 min)

- "Is there anything I didn't ask that you think is important?"
- "Who else should I talk to about this?" (e.g., a strategist who does part of onboarding?)
- Thank them. Share the updated process map after incorporating their answers.

---

## Note-Taking Template

Use one per participant:

```
Participant: [Clayton / Paulo]
Date: [Date]
Interview Type: [Live / Async Loom / Slack]

### Key Steps Described:
- [Step 1]
- [Step 2]
- ...

### Gaps Filled:
| Gap # | Answer | Confidence |
|-------|--------|------------|
| 1     |        | High/Med/Low |
| 2     |        |            |

### Pain Points Surfaced:
1. [Pain] — Frequency: [every client / sometimes / rare] — Severity: [high/med/low]
2. ...

### Automation Priorities (their words):
1.
2.
3.

### Must Stay Manual:
-

### Surprise Findings:
-

### Follow-Up Needed:
-
```

---

## What We Already Know (from Clayton's Loom — Session 6)

Pre-filled so we don't re-ask what's confirmed:

- Slack naming: `client-firstname-lastname`
- Slack always includes: Clayton + Andrew + pod strategist + manager + jr strategist
- Dropbox: duplicate "Clients Template" folder under `team@knownlocal.com`
- Dropbox template has: A-roll, B-roll, Edited Videos, Projects, Assets (needs confirmation)
- GDrive: currently under `management@aimpactmedia`, transferring to `team@knwnlocal`
- GDrive is for scripts (writing team)
- Dropbox at 24/30 TB
- Clayton says Slack member add "takes two seconds" — prefers manual for now
- No clear pod assignment process exists
- Role changes (strategist swap) would break automated channel membership
