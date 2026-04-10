# Data Cleanup — Instructions for Paulo

> Date: 2026-04-10
> From: Dev team
> What we need: Your answers to fill gaps in the team/client data we migrated from Notion

---

## How to Review

You have GitHub access to the repo. The files you need are in the `data-verification/` folder:

1. **`team_members_verification.csv`** — full list of all team members in the system, their roles, emails, pods, and status. Open this in Excel or Google Sheets.
2. **`questions-for-paulo.txt`** — the detailed questions below, in a plain text file.
3. **`clients_migration_data.txt`** — client data summary for cross-referencing.

You can download these from: `https://github.com/NA-E/Knwn-Local-App` → navigate to `data-verification/` folder.

**How to answer:** You can either edit the CSV directly and send it back, or just reply in a message/doc with your answers numbered to match below.

---

## Question 1: Missing Team Member Names (4 people)

These people have emails in Notion but no name. We need their real first and last names.

| # | Email | Current Role | Pods | What we need |
|---|-------|-------------|------|-------------|
| a | arthur.rubens3@gmail.com | Writer (Ghostwriter) | Pod 3, 2, 1 | Is this "Arthur Rubens"? Full name? |
| b | giancamposm@gmail.com | Writer (Ghostwriter) | Pod 1, 3, 2 | Real name? |
| c | karinadayone@gmail.com | Manager | Pod 4 | Real name? |
| d | milena.ortizhdz@gmail.com | Writer (Ghostwriter) | No pod | Real name? |

**Quick confirmations** — we guessed these names from emails. Correct?
- alejandroramoscorral@gmail.com → "Alejandro Ramos" (Senior Editor, Pod 1)
- sabriigues@gmail.com → "Sabrina Gues" (Editor, Pod 2)
- juanf.audiovisual@gmail.com → "Juan Bravo" (Manager, Pod 1)

---

## Question 2: Laura Carreno — Missing Role & Email

Laura Carreno is listed in Notion as "Onboarding" in Pod 2, but has no email and no role.

**We need:**
- What role should she have? (editor, writer, designer, manager, virtual_assistant, etc.)
- What is her email address?

---

## Question 3: Database Members Not in Notion (4 people)

These 4 exist in our database from earlier setup but do NOT appear in the Notion team export. Are they real and still active? What are their actual email addresses?

| # | Name | Current Role | Current Email (placeholder) |
|---|------|-------------|---------------------------|
| a | Austin Marks | Strategist | austin.marks@knownlocal.com |
| b | Clayton Mclemore | Strategist | clayton.mclemore@knownlocal.com |
| c | Noor | Designer | noor@knownlocal.com |
| d | Subhan | Designer | subhan@knownlocal.com |

These need real emails so they can sign in with Google OAuth.

---

## Question 4: Virtual Assistant Role

Efiphanie Abuyabor is listed as "Virtual Assistant" in Notion, status: Onboarding.

**Confirm:** Should "virtual_assistant" be a real role in the system? (We already added it.)

---

## Question 5: Supervised-By Mapping (IMPORTANT)

For the Senior Writer and Senior Editor boards to work correctly, we need to know who supervises whom.

**Senior Writers → Writers:**

| Senior Writer | Pods |
|--------------|------|
| Vivian Vardasca | Pod 1, 2, 3 |
| Rafael Stiborski | Pod 2, 3, 1 |

| Writer | Pods | Supervised by? |
|--------|------|---------------|
| Gabriela Aoki | Pod 2, 1, 3 | _____________ |
| Jessica Gonzatto | Pod 1, 2, 3 | _____________ |
| Livia Russi | Pod 2, 3, 1 | _____________ |
| [giancamposm@gmail.com] | Pod 1, 3, 2 | _____________ |
| [milena.ortizhdz@gmail.com] | No pod | _____________ |
| [arthur.rubens3@gmail.com] | Pod 3, 2, 1 | _____________ |

**Question:** Which Senior Writer supervises which writers? Or do both supervise all of them?

**Senior Editors → Editors:**

| Senior Editor | Pods |
|--------------|------|
| Diego Oliveira | Pod 1 |
| Alejandro Ramos | Pod 1 |

**Question:** Which editors does each Senior Editor supervise? (There are ~15 editors — please map them or tell us the rule, e.g., "Diego handles Pod 1+2, Alejandro handles Pod 3+4".)

---

## Question 6: Offboarded & Contract Paused Members (20 people)

The Notion export has 20 team members with non-active statuses:

**Offboarded (16):** Samuel C, Nuriel Canlas, Terence Chong, Juan Ignacio Valmaggia, M Anss, Lina Arrieta, Juwon Ibrahim, Aquiles Kaue, Dimcha, Nicole Berti Girotto, John Nouel, Laura Carreno, Cesar Carrasquel, + 3 unnamed

**Contract Paused (4):** Ana Escobar, Bonatti, Caio Porto, + 1 unnamed

**Should we add them?** They would show as "offboarded" or "contract_paused" — invisible on active boards, but useful for project history trails. If a past editor's name should appear on old projects, we need them in the system.

**Answer:** Yes add them / No skip them / Add only these: ___

---

## Question 7: Non-Active Clients (60 clients)

We imported 81 clients (77 active + 4 onboarding). Notion has 60 more:

| Status | Count |
|--------|-------|
| Inactive | 47 |
| Disengaged | 10 |
| Pending | 2 (Marlene Sedono, pod huddle) |
| Template | 1 |

**Should we import them?** They would be stored with their correct status and NOT appear in active dashboards or counts. But they'd preserve client history.

**Answer:** Yes import all / No skip them / Import only: ___

---

## Question 8: Review the Full Team CSV

Please open `data-verification/team_members_verification.csv` and confirm:

- All rows marked "ADD" should be added to the system
- All rows marked "OK" have correct roles, names, and emails
- Flag any corrections: wrong name spelling, wrong role, wrong pod, wrong email

---

## How to Send Answers

Just reply with your answers numbered Q1 through Q8. For Q5 (supervised-by), a simple list or even "Vivian handles all writers" is fine. For Q8, mark up the CSV or list corrections.

No rush on Q6 and Q7 (historical data) — those can wait. **Q1-Q5 are the priority** because they block features we're building now.
