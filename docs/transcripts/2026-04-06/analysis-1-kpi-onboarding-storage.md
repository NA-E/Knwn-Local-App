# Analysis: Transcript 1 -- KPI Update, Onboarding, & Storage

**Date**: 2026-04-06
**Duration**: ~25 minutes
**Participants**:
- Clayton Mclemore -- CEO / Strategy
- Paulo Folly -- Operations
- Nourin Ahmed Eka -- PM / App Builder (joined ~12 min mark)

**Interview Type**: Impromptu Zoom (not a scheduled discovery interview -- Nourin joined an existing Paulo/Clayton call and asked discovery questions ad hoc)

**Recording**: https://fathom.video/share/s9kXZqutH69cAz3yWXKhMSs_YyU1TsB9

---

## Interview Summary (JTBD Framework)

**Background**: Known Local is a YouTube content agency running across 4 pods. Clayton and Paulo were reviewing KPI dashboards built in Notion. Nourin joined midway and pivoted to onboarding discovery questions. The call was cut short when Clayton had to leave for another meeting (~24:45).

**Current Solution**: Manual onboarding performed ad hoc by whoever is available (YouTube manager, Paulo, or Clayton). KPI tracking is done in Notion with relational databases and visual dashboards.

**What They Like About Current Solution**:
- Dropbox file-request links work well for client footage uploads (automated date/uploader tagging)
- Dropbox's video replay and commenting features are valued for editing workflows
- The A-roll / B-roll / Edited Videos / Projects / Assets folder structure is understood and used consistently
- Joe (strategist) tracks calls reliably -- proves the system works when people use it

**Problems With Current Solution**:
- Notion's relational database limitations make visual KPI dashboards painful to build (Paulo spent significant time on this)
- Videos launched showing 0% -- data integrity issue; tasks may not be tagged as "posted"
- Strategists not logging calls (0% calls this month, also 0% last month for some)
- Dropbox and Google Drive split across different accounts makes finding things annoying
- No single person owns onboarding -- it is whoever is available
- No structured pod assignment process -- manual/gut-feel by Clayton
- Pod 4 is new with 6 recently onboarded clients, so capacity numbers are misleading for assignment logic

**Key Insights**:
- Clayton explicitly said the app will handle KPI visualization better than Notion: "as long as you have the data tracking correctly... we can easily transfer that to the app and then make it look better"
- Paulo confirmed: "I really feel like this is probably much easier to do on the app. It will look much nicer."
- Clayton deprioritized "team count" as a KPI -- "it doesn't really tell me anything"
- The most important KPIs per Clayton: calls %, videos launched %, retention, capacity
- Ranking and CTR are secondary -- "going to average out across everybody"
- Clayton wants less tools and more organization, not necessarily new tools
- Retention data only exists for Pod 2 (the only pod with full contract start/end dates)

---

## 1. Gaps Filled from Discovery Script

### Gap 1 -- Trigger: "After a client signs, what literally happens?"
- **Status**: NOT ANSWERED
- **Notes**: Nourin did not reach this question before Clayton left. The conversation jumped straight to "who onboards."

### Gap 2 -- Source of truth: "Where do you first enter the client's info?"
- **Status**: NOT ANSWERED
- **Notes**: Nourin asked "who onboards" but did not ask "where info goes first."

### Gap 3 -- Pod assignment: "Walk me through how the pod gets decided."
- **Status**: PARTIALLY ANSWERED
- **Confidence**: High
- **Answer**: Clayton decides manually based on capacity, with contextual judgment. No formula or round-robin.
- **Quote (Clayton, 15:40)**: "Me. It depends on capacity. Usually me, I'll look and see, like, oh, pod one has 20 clients, pod three has 15 clients, we should probably give it to pod three."
- **Quote (Clayton, 15:56)**: "Pod four right now has the lowest numbers, but it's because we just started pod four. And we may want to give that client to pod three because we just onboarded six people in pod four."

### Gap 4 -- Capacity check: "Is there a capacity check? Or gut feel?"
- **Status**: ANSWERED
- **Confidence**: High
- **Answer**: Gut feel informed by visible numbers. No formal capacity calculation.
- **Quote (Clayton, 15:56)**: "There's like factors that are like pod four right now has the lowest numbers, but it's because we just started pod four... So even though they're lowest, maybe we don't want to give them another person right now, maybe want to wait a week."

### Gap 5 -- Pod assignment errors: "Has a pod assignment ever been wrong or changed?"
- **Status**: NOT ANSWERED

### Gap 6 -- Slack channel members: "Beyond Clayton, Andrew, and pod team -- who else gets added?"
- **Status**: NOT ANSWERED
- **Notes**: Nourin asked about "the steps listed in Slack" but did not drill into the member list.

### Gap 7 -- Missed channel members: "Has anyone ever been missed from a channel?"
- **Status**: NOT ANSWERED

### Gap 8 -- Role changes in Slack: "When a team member changes, who updates the channel?"
- **Status**: NOT ANSWERED

### Gap 9 -- Dropbox template structure: "Can you show me every subfolder?"
- **Status**: PARTIALLY ANSWERED
- **Confidence**: High
- **Answer**: Paulo screen-shared the Dropbox structure. Confirmed subfolders: A-roll, B-roll, Edited Videos, Projects, Assets. Also confirmed the file-request link mechanism and the automation that stamps upload date + uploader name.
- **Quote (Paulo, ~21:00 paraphrased from screen share)**: "All the footage that the clients upload are over here. We generate links for them... each client has a link... they can just drag and drop the files... We set an automation to always add the data that was uploaded, and who uploaded the file."
- **Note**: Paulo also described B-roll as curated footage the team moves from A-roll for reuse. "Edited Videos" are final versions. "Projects and Assets" are things the client might need or editors create.

### Gap 10 -- Post-duplication steps: "After duplicating the template, is there anything else you do?"
- **Status**: PARTIALLY ANSWERED
- **Confidence**: Med
- **Answer**: File-request links are generated per client. An automation adds date + uploader metadata. The folder is renamed. No explicit mention of sharing steps or other post-duplication work -- but the call was cut short during the Dropbox walkthrough.

### Gap 11 -- Dropbox storage: "24/30 TB -- is there a plan?"
- **Status**: NOT DIRECTLY ANSWERED in this transcript
- **Notes**: The storage question came up in the broader Dropbox vs. GDrive discussion but no resolution was stated.

### Gap 12 -- Google Drive contents: "What exactly goes in the GDrive folder?"
- **Status**: CONFIRMED (from previous knowledge)
- **Confidence**: High
- **Answer**: Scripts created by the writing team. Clients access scripts there.
- **Quote (Clayton, ~18:20)**: "We use a Google Drive folder for writers to create the scripts and send to the clients."

### Gap 13 -- GDrive subfolder structure
- **Status**: NOT ANSWERED
- **Notes**: Paulo was about to show Google Drive when Clayton had to leave.

### Gap 14 -- Eliminating GDrive: "Has the writing team weighed in?"
- **Status**: PARTIALLY ANSWERED
- **Confidence**: Med
- **Answer**: Clayton raised the idea of consolidating everything into Dropbox but framed it as an open question, not a decision. No mention of writing team feedback.
- **Quote (Clayton, ~18:10)**: "My question was, could we not technically use Dropbox for everything related to editing and scripts and have clients access everything there? Or is that too much?"

### Gap 15 -- Team notification: "How does each team member find out about a new client?"
- **Status**: NOT ANSWERED

### Gap 16 -- Assignment order: "Is there a specific order to assignments?"
- **Status**: NOT ANSWERED

### Gap 17 -- Writer/editor/designer assignment authority
- **Status**: NOT ANSWERED

### Gap 18 -- Welcome message to client
- **Status**: PARTIALLY ANSWERED
- **Confidence**: Med
- **Answer**: Clayton listed "send a welcome message, invite the client" as part of the onboarding steps the YouTube manager is supposed to do, but no detail on content, format, or channel.
- **Quote (Clayton, 13:26)**: "Usually the YouTube manager is supposed to create the Notion page, the Dropbox, the folders, send a welcome message, invite the client."

### Gap 19 -- Internal kickoff
- **Status**: NOT ANSWERED

### Gap 20 -- First project creation
- **Status**: NOT ANSWERED

### Gap 21 -- Other hidden steps (contracts, billing, intake forms)
- **Status**: NOT ANSWERED

### Gap 22 -- Most annoying part of onboarding
- **Status**: NOT ANSWERED (Part 3 of the script was never reached)

### Gap 23 -- Frequency of errors
- **Status**: NOT ANSWERED

### Gap 24 -- Top 3 automation priorities
- **Status**: NOT ANSWERED

### Gap 25 -- What must stay manual
- **Status**: NOT ANSWERED

### Gap 26 -- Clients onboarded per month
- **Status**: NOT ANSWERED

---

## 2. Pain Points Surfaced

| # | Pain Point | Who | Frequency | Severity | Evidence |
|---|-----------|-----|-----------|----------|----------|
| P1 | **No single owner for onboarding** -- "a YouTube manager or Paulo or someone on the team randomly does it." No set person, no set process. | Clayton, Paulo | Every client | High | Clayton (13:01): "A YouTube manager or Paulo or someone on the team randomly does it." Paulo (13:06): "There's not like a set person." |
| P2 | **Notion KPI dashboards are painful to build** -- relational database limitations prevent visual representations. Paulo spent significant time trying and failed to get videos-per-month relation working. | Paulo | Ongoing | Med | Paulo (0:12): "There are limitations. It's not as, for some things, it's not as intuitive." Paulo (6:15): "I really feel like this is probably much easier to do on the app." |
| P3 | **Strategists not logging calls** -- 0% call tracking this month AND last month for some strategists. Data integrity issue. | Paulo | Monthly/Ongoing | High | Paulo (4:33): "Last month, we also had 0%. So I don't know if they are not registering the calls." Clayton (5:03): "That's probably cause they're not tracking it." |
| P4 | **Account/tool fragmentation** -- Dropbox on one email, GDrive on another, different access methods for different team members. | Clayton | Every client | High | Clayton (~18:30): "How do I find this for the client? It's like, well, one's in this drive that's in another email. One's in this Dropbox that's in another email and different people access it different ways. It's just a little annoying." |
| P5 | **Videos launched showing 0%** -- KPI data is wrong because tasks may not be tagged as "posted." | Paulo | Unknown | Med | Paulo (5:16): "I thought that was weird as well." Clayton (5:43): "They should be in Notion." |
| P6 | **Pod capacity is misleading for new pods** -- Pod 4 has lowest numbers but just onboarded 6 clients, so raw numbers don't reflect true capacity. | Clayton | Situational | Med | Clayton (15:56): "Pod four right now has the lowest numbers, but it's because we just started pod four." |
| P7 | **Retention data incomplete** -- Only Pod 2 has contract start/end dates. Other pods lack this data. | Paulo | Ongoing | Low | Paulo (7:24): "We just have retention for Pod 2 because it's the only client that we have... the information from start, from when this contract started and when the contract ended." |
| P8 | **Onboarding steps can be missed with no detection mechanism** -- Nourin asked and Clayton confirmed there is no structured checklist or verification. | Clayton | Unknown | High | Clayton (13:26): "It just depends on who's available and there. And it's, we don't have it like down to like a super, super process thing at the moment." |

---

## 3. Process Map Updates

Based on new information from this transcript, the following changes should be made to `client-onboarding-as-is.md`:

### Confirmed / Updated Steps

1. **Who initiates onboarding**: Change from "(?) unknown" to "No set person -- YouTube manager, Paulo, or whoever is available." This is not a process gap to fill; it IS the current process (ad hoc).

2. **Pod assignment**: Update the decision node:
   - Decision maker: Clayton
   - Method: Manual, capacity-informed but with contextual judgment (not round-robin, not purely data-driven)
   - Add note: "Pod assignment happens AFTER resource creation (Slack, Dropbox, GDrive), not before"
   
3. **Pod assignment timing**: Critical update -- Clayton said pod assignment comes AFTER folder/channel creation, not before. Quote (15:25): "Not really. All the stuff that can be created is independent, and then we assign it to the pod afterwards, basically." The process map currently shows pod assignment driving everything -- it should show resource creation as parallel/independent, then pod assignment, then team assignment.

4. **Dropbox folder structure**: Confirm subfolders and add detail:
   - A-roll (raw client uploads via file-request link)
   - B-roll (curated footage moved from A-roll by editors for reuse)
   - Edited Videos (final versions)
   - Projects (editor-created assets)
   - Assets (client-needed materials)
   - Add: File-request link generation step
   - Add: Automation stamps date + uploader on uploaded files

5. **Welcome message**: Add as a confirmed step -- YouTube manager is supposed to send a welcome message and invite the client (per Clayton). Details TBD.

6. **Google Drive**: Confirmed as scripts for writing team. Clients access scripts here. Clayton is exploring consolidation into Dropbox but no decision made.

### Structural Change to Process Map

The current map shows a linear flow: Client signs -> Pod decision -> Create Slack/Dropbox/GDrive -> Team assignment. The actual flow is:

```
Client signs
  |
  v
[Ad hoc -- whoever is available starts]
  |
  +---> Create Slack channel (independent)
  +---> Create Dropbox folder + file-request link (independent)
  +---> Create GDrive folder (independent)
  +---> Create Notion page (independent) <-- NEW: not in current map
  |
  v
Clayton decides pod assignment (after resources exist)
  |
  v
Team assignment
  |
  v
Welcome message + client invite
```

### New Step to Add

- **Create Notion page**: Clayton explicitly mentioned this as part of onboarding (13:26): "the YouTube manager is supposed to create the Notion page, the Dropbox, the folders." This is not in the current as-is map and should be added as a parallel step alongside Slack/Dropbox/GDrive creation.

---

## 4. Scope Expansion Signals

### 4a. KPI Dashboard (Strong signal -- near-term)

Clayton and Paulo spent the first 11 minutes discussing KPI tracking pain in Notion. This is a clear signal that KPI dashboards should be prioritized in the app.

**Priority KPIs identified by Clayton** (in order of importance):
1. **Calls this month %** -- strategist accountability metric
2. **Videos launched %** -- production throughput (planned vs actual)
3. **Retention** -- client churn tracking (needs contract date data)
4. **Capacity** -- clients per pod/team member

**Deprioritized KPIs**:
- Team count ("doesn't really tell me anything" -- Clayton)
- Ranking (will "average out across everybody" -- useful later for outlier detection)
- CTR (same as ranking -- useful later but not priority)

**Key quote (Clayton, 10:12)**: "As long as we have a dashboard with all the data, me and Andrew can check it, and then we'll start looking at the data over time, and then Nourin can basically understand what we're tracking slightly, like how we're tracking."

**Key quote (Clayton, 10:28)**: "A lot of this can be made a lot quicker... tracking based off less user management and more automation would be the goal."

**Implication**: The app's KPI module should pull data from project records (videos launched, call logs) rather than requiring manual entry. This aligns with Module 3/4 scope but the demand is clearly present now.

### 4b. Dropbox/GDrive Consolidation (Medium signal -- strategic)

Clayton wants to explore whether Dropbox can replace GDrive for scripts, reducing tool fragmentation. This is outside app scope but could affect the automation design (e.g., if scripts move to Dropbox, the onboarding automation only needs to create one storage location instead of two).

### 4c. Notion Database Relation Review (Low signal -- defensive)

Paulo wants to review the database relations Nourin is building to ensure they don't repeat past mistakes with Notion relations. This is a "trust but verify" moment -- not a scope change, but a process step.

---

## 5. Surprise Findings

### S1. Pod assignment happens AFTER resource creation, not before
The as-is process map assumed pod assignment drives everything downstream. In reality, Slack channels, Dropbox folders, and GDrive folders can all be created independently of pod assignment. Pod assignment only matters for team member assignment. This simplifies automation -- resource creation can be fully automated without waiting for Clayton's pod decision.

### S2. There is NO set person for onboarding
This was suspected but now confirmed by both Clayton and Paulo. The lack of ownership is not a temporary gap -- it is the actual operating model. Anyone available does it. This means the app's onboarding automation provides even more value than expected because it replaces not just manual steps but also the need for someone to remember to do them.

### S3. Notion page creation is an onboarding step
This was not in the original as-is process map at all. Clayton listed it alongside Dropbox and Slack creation. Since the app will replace Notion for client management, this step effectively becomes "create client record in the app" -- which is already the trigger for onboarding automation.

### S4. Dropbox has automations already running
Paulo mentioned an existing automation that stamps date + uploader on files uploaded via file-request links. This means the team is already comfortable with Dropbox automation and the file-request API is a known pattern. The onboarding automation should create the folder AND generate the file-request link.

### S5. KPI data integrity is worse than expected
Two separate data issues surfaced: (1) strategists not logging calls at all, and (2) videos not tagged as "posted" so launched % shows 0%. The app's KPI module will only be useful if data entry is enforced or automated through status transitions.

### S6. Clayton explicitly endorsed the app for KPI visualization
This is not a surprise in direction, but the strength of the signal is notable. Both Clayton and Paulo independently said the app would be better for this than Notion. This gives confidence that KPI dashboards should be on the roadmap.

---

## 6. Action Items from the Call

| # | Action | Owner | Source Timestamp | Status |
|---|--------|-------|-----------------|--------|
| A1 | Finish Notion KPI tables (filter by department), send to Clayton for review | Paulo | 3:00 | In progress -- Paulo said "I can finish today" |
| A2 | Double-check Pod 3 and Pod 4 data accuracy in KPI tables | Paulo | 6:53 | Pending |
| A3 | Investigate why "videos launched" shows 0% (tasks not tagged as posted?) | Paulo | 5:16 | Pending |
| A4 | Talk to strategists about why calls are not being logged | Paulo + Clayton | 4:33 | Pending |
| A5 | Review Notion database relations that Nourin is building | Paulo | 10:46 | Pending -- Paulo said "I will take a look" |
| A6 | Share the as-is process map with Paulo and Clayton for gap-filling | Nourin | 11:54 | Pending |
| A7 | Send Paulo a new Zoom link to continue the Dropbox/GDrive walkthrough | Paulo | 24:45 | Immediate (Clayton left for another call) |
| A8 | Clayton + Andrew to review KPI dashboard once data is verified | Clayton, Andrew | 10:12 | Blocked on A1, A2 |

---

## 7. Still Open Gaps

The following discovery questions remain fully unanswered and need a follow-up session:

| Gap # | Question | Priority | Notes |
|-------|----------|----------|-------|
| 1 | What is the literal trigger after a client signs? (Slack msg, email, CRM update?) | **High** | Needed for automation trigger design |
| 2 | Where is client info entered first? | **High** | Source of truth for the app |
| 5 | Has a pod assignment ever been wrong or changed? | Med | Informs whether pod reassignment needs to be easy |
| 6 | Who else gets added to Slack channels beyond the core group? | **High** | Needed for Slack automation |
| 7 | Has anyone ever been missed from a Slack channel? | Med | Validates automation value |
| 8 | When a team member changes, who updates the Slack channel? | Med | Informs role-change workflow |
| 11 | Dropbox at 24/30 TB -- what's the plan? | Med | Strategic, affects storage automation |
| 13 | Google Drive subfolder structure per client | **High** | Needed for GDrive automation |
| 15 | How does each team member find out about a new client? | **High** | Notification design |
| 16 | Is there a specific order to team assignments? | Med | Dependency chain for automation |
| 17 | Who assigns writer/editor/designer? | **High** | Decision authority -- needed for the app's assignment workflow |
| 19 | Is there an internal kickoff meeting or brief? | Med | Post-onboarding workflow |
| 20 | When/how is the first project created? | **High** | Triggers Module 2 |
| 21 | Are there other hidden steps? (contracts, billing, intake forms, brand guidelines) | Med | Catch-all |
| 22 | What's the single most annoying part of onboarding? | Med | Prioritization input |
| 23 | How often does something go wrong? | Med | Error rate baseline |
| 24 | Top 3 things to automate | Med | Prioritization input |
| 25 | What must stay manual? | Med | Guardrails for automation |
| 26 | How many clients onboarded per month? | Med | Volume baseline |

**Recommendation**: Schedule a dedicated 30-minute follow-up with Paulo (and Clayton if possible) to work through the remaining 19 gaps. The call should focus on gaps 1, 2, 6, 13, 15, 17, and 20 first -- these are blocking automation design. Paulo's Dropbox/GDrive screen-share was cut short and should be resumed.

---

## 8. Transcript Coverage Assessment

- **Minutes 0:00 -- 11:41**: KPI dashboard discussion (Paulo + Clayton only). Rich data on KPI priorities and Notion pain points. Not related to onboarding discovery.
- **Minutes 11:42 -- 17:27**: Nourin joins. Onboarding discovery questions begin. Covered: who onboards (Gap answered), pod assignment process (Gap 3+4 answered), timing of pod assignment vs resource creation (surprise finding).
- **Minutes 17:28 -- 24:45**: Dropbox vs GDrive discussion + Paulo screen-shares Dropbox structure. Covered: Gap 9 (partial), Gap 12 (confirmed), Gap 14 (partial). Clayton leaves at 24:45.
- **Minutes 24:45 -- end**: Clayton asks Paulo to send Nourin a new Zoom link to continue. Call ends.

**Effective discovery time**: ~13 minutes out of 25. The remaining 19 gaps require at least one more focused session.
