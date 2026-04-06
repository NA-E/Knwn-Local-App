# Client Onboarding Automation — Design Spec

**Date:** 2026-04-03
**Status:** Draft (v2 — post-review)
**Scope:** Automated onboarding flow triggered on client creation

**Scope note:** SPEC.md lists "Automated Slack/Dropbox handoffs" and "Notification system" as V1 out-of-scope. This feature is explicitly promoted to V1 by stakeholder decision (2026-04-03). SPEC.md will be updated to reflect this.

---

## Overview

When a user creates a new client, the app automatically provisions all external resources (Slack channel, Dropbox folder, Google Drive folder), invites the client, sends a welcome message, and notifies team members. The user sees a real-time progress modal with spinners that resolve to success/failure as each step completes.

## Architecture

### Execution Model

1. **Client form submit** → `createClientAction` inserts client + 6 `onboarding_steps` rows (all `pending`) into DB, returns `{ id, error }`
2. **Modal opens** → Client-side opens the onboarding modal showing "Client record created" as a pre-filled checkmark + 6 steps with spinners
3. **Subscribe realtime** → Modal subscribes to `onboarding_steps` WHERE `client_id = ?`
4. **Fire-and-forget POST** → Client-side JS calls `/api/onboard` with the new client ID. Does not await response.
5. **API route** → `/api/onboard` validates auth, creates a **service-role Supabase client** (not the user's session), then runs steps — updating each `onboarding_steps` row as it completes
6. **Realtime updates** → Each DB update triggers a UI re-render in the modal — spinner becomes tick or X
7. **Modal resolves** → When all steps are non-pending/non-running, show final state. "Continue" navigates to client detail page.

### Why Service-Role Client

The API route uses `createClient(supabaseUrl, serviceRoleKey)` instead of the user's cookie-based session because:
- Fire-and-forget: the user's session may expire during the 10-30s onboarding window
- The user might close the tab — background work must continue
- Service role bypasses RLS, which is fine since the route validates auth upfront before starting

### Parallel Execution

Independent steps run in parallel to minimize total time:

```
Phase 1 (parallel):  slack_channel + dropbox_folder + gdrive_folder
Phase 2 (parallel):  slack_invite + welcome_message + team_notify
                      (invite/welcome depend on slack_channel result)
```

Total time: ~2 API round-trips instead of 6 sequential.

### Sequence Diagram

```
Browser                    Server Action         API Route              Supabase         External APIs
  │                            │                     │                      │                  │
  │─ submit form ─────────────>│                     │                      │                  │
  │                            │─ INSERT client ──────────────────────────>│                  │
  │                            │─ INSERT 6 steps (pending) ──────────────>│                  │
  │                            │<── return { id } ───────────────────────│                  │
  │<── { id } ────────────────│                     │                      │                  │
  │                            │                     │                      │                  │
  │─ open modal (✅ record + 6 spinners) ──────────────────────────────────│                  │
  │─ subscribe realtime(steps where client_id) ────────────────────────>│                  │
  │─ POST /api/onboard { clientId } ──────────────>│                      │                  │
  │  (fire & forget)           │                     │                      │                  │
  │                            │                     │─ validate auth ──────│                  │
  │                            │                     │─ create service client│                  │
  │                            │                     │                      │                  │
  │                            │                     │─ Phase 1 (parallel): │                  │
  │                            │                     │  ├─ slack_channel ──────────────────>│ Slack
  │                            │                     │  ├─ dropbox_folder ─────────────────>│ Dropbox
  │                            │                     │  └─ gdrive_folder ──────────────────>│ Google
  │                            │                     │<── results ─────────────────────────│
  │                            │                     │─ UPDATE steps → success/failed ───>│
  │<── realtime: 3 steps done ───────────────────────────────────────────│                  │
  │  (spinners → ✅/❌)        │                     │                      │                  │
  │                            │                     │─ Phase 2 (parallel): │                  │
  │                            │                     │  ├─ slack_invite ───────────────────>│ Slack
  │                            │                     │  ├─ welcome_message ────────────────>│ Slack
  │                            │                     │  └─ team_notify ────────────────────>│ Slack
  │                            │                     │<── results ─────────────────────────│
  │                            │                     │─ UPDATE steps → success/failed ───>│
  │<── realtime: all done ───────────────────────────────────────────────│                  │
  │  (show Continue button)    │                     │                      │                  │
```

## Database

### New ENUMs

```sql
CREATE TYPE onboarding_step_name AS ENUM (
  'slack_channel', 'dropbox_folder', 'gdrive_folder',
  'slack_invite', 'welcome_message', 'team_notify'
);

CREATE TYPE onboarding_step_status AS ENUM (
  'pending', 'running', 'success', 'failed', 'skipped'
);
```

### New Table: `onboarding_steps`

```sql
CREATE TABLE onboarding_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  step onboarding_step_name NOT NULL,
  status onboarding_step_status NOT NULL DEFAULT 'pending',
  result_data JSONB,
  error_message TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(client_id, step)
);
```

### RLS Policies

```sql
ALTER TABLE onboarding_steps ENABLE ROW LEVEL SECURITY;

-- Read: all authenticated users can view onboarding status
CREATE POLICY "onboarding_steps_select" ON onboarding_steps
  FOR SELECT TO authenticated USING (true);

-- Insert: only roles that can create clients
CREATE POLICY "onboarding_steps_insert" ON onboarding_steps
  FOR INSERT TO authenticated
  WITH CHECK (get_my_role() IN ('admin', 'strategist', 'jr_strategist'));

-- No UPDATE/DELETE policies for authenticated users.
-- The API route uses a service-role client (bypasses RLS) to update step statuses.
```

### Enable Realtime

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE onboarding_steps;
```

**Setup required:** Enable Realtime on the Supabase project via Dashboard → Database → Replication → enable `supabase_realtime` publication (or verify it's already enabled). This is a one-time setup.

### Step Names (in execution order)

| Step | Phase | Description |
|------|-------|-------------|
| `slack_channel` | 1 | Create Slack channel `#client-{slug}` |
| `dropbox_folder` | 1 | Create Dropbox folder `/Clients/{Name}/` |
| `gdrive_folder` | 1 | Create Google Drive folder `/Clients/{Name}/` |
| `slack_invite` | 2 | Invite client contact + Clayton + Andrew to channel |
| `welcome_message` | 2 | Post welcome message in channel |
| `team_notify` | 2 | DM Senior Editor, Senior Writer, Senior Designer |

Note: "Client record created" is shown as a pre-filled checkmark in the modal UI — it is NOT a database row. The client insert happens in the server action before onboarding begins and cannot fail at modal time.

### `result_data` Examples

```jsonc
// slack_channel
{ "channel_id": "C06ABCDEF", "channel_name": "#client-austin-klar", "channel_url": "https://app.slack.com/..." }

// dropbox_folder
{ "folder_path": "/Clients/Austin Klar", "shared_link": "https://www.dropbox.com/..." }

// gdrive_folder
{ "folder_id": "1aBcDeFgHi", "folder_url": "https://drive.google.com/drive/folders/..." }

// slack_invite
{ "invited_users": ["U01CLIENT", "U01CLAYTON", "U01ANDREW"] }

// welcome_message
{ "message_ts": "1234567890.123456" }

// team_notify
{ "notified": ["Raj Test (Senior Editor)", "Maria Test (Senior Writer)"] }
```

## Service Layer

### File Structure

```
lib/services/
  slack.ts          — Slack Web API wrapper
  dropbox.ts        — Dropbox API wrapper
  gdrive.ts         — Google Drive API wrapper
  onboarding.ts     — Orchestrator: runs all steps, updates DB
```

### `lib/services/slack.ts`

**Functions:**
- `createChannel(name: string)` → `{ channelId, channelName, channelUrl }`
  - Slack API: `conversations.create` (name = `client-{slug}`)
  - If name taken, append `-2`, `-3`, etc.
- `inviteToChannel(channelId: string, emails: string[])` → `{ invitedUsers }`
  - Slack API: `users.lookupByEmail` for each email → get user IDs
  - Then `conversations.invite` with the resolved user IDs
  - Silently skip emails that don't resolve (external clients may not be in workspace yet)
- `sendMessage(channelId: string, text: string)` → `{ messageTs }`
  - Slack API: `chat.postMessage`
- `sendDM(userEmail: string, text: string)` → `{ messageTs }`
  - Slack API: `users.lookupByEmail` → `chat.postMessage` (with user ID as channel)

**Auth:** Bot token (`SLACK_BOT_TOKEN`). Required scopes: `channels:manage`, `channels:write.invites`, `chat:write`, `users:read`, `users:read.email`.

**User lookup:** All Slack functions accept emails, not user IDs. The service resolves emails to IDs internally via `users.lookupByEmail`. This means no `slack_user_id` column is needed on `team_members` — we use the existing `email` field.

### `lib/services/dropbox.ts`

**Functions:**
- `createFolder(path: string)` → `{ folderPath, sharedLink }`
  - Dropbox API: `files/create_folder_v2`
  - Then `sharing/create_shared_link_with_settings` for the upload link
  - Store shared link as client's `dropbox_upload_url`

**Auth:** Uses app key + refresh token for long-lived access. On each call:
1. POST to `https://api.dropboxapi.com/oauth2/token` with `grant_type=refresh_token`
2. Use the returned short-lived access token for the API call

**Env vars:** `DROPBOX_APP_KEY`, `DROPBOX_APP_SECRET`, `DROPBOX_REFRESH_TOKEN`

### `lib/services/gdrive.ts`

**Functions:**
- `createFolder(name: string, parentFolderId: string)` → `{ folderId, folderUrl }`
  - Google Drive API: `files.create` with `mimeType = 'application/vnd.google-apps.folder'`
  - Set parent to the shared "Clients" folder

**Auth:** Service account with JWT. Flow:
1. Parse `GOOGLE_SERVICE_ACCOUNT_JSON` env var
2. Build JWT with claims: `iss` = service account email, `scope` = `https://www.googleapis.com/auth/drive.file`, `aud` = `https://oauth2.googleapis.com/token`
3. Sign with RSA private key using Node.js `crypto.sign`
4. Exchange JWT for access token via POST to `https://oauth2.googleapis.com/token`
5. Use access token for Drive API calls

**Dependency:** `google-auth-library` npm package — JWT signing with RSA is non-trivial (~80 lines). This lightweight package handles it cleanly.

**Env vars:** `GOOGLE_SERVICE_ACCOUNT_JSON`, `GOOGLE_DRIVE_PARENT_FOLDER_ID`

### `lib/services/onboarding.ts`

**Orchestrator function:** `runOnboarding(clientId: string, supabase: SupabaseClient)`

The `supabase` parameter is a service-role client passed from the API route.

```typescript
export async function runOnboarding(clientId: string, supabase: SupabaseClient) {
  const client = await getClientWithContacts(clientId, supabase)
  const slug = slugify(client.name)

  // Phase 1: Independent steps — run in parallel
  const [slackResult] = await Promise.allSettled([
    runStep(supabase, clientId, 'slack_channel', async () => {
      const result = await createChannel(`client-${slug}`)
      await updateClientField(supabase, clientId, 'slack_channel_url', result.channelUrl)
      return result
    }),
    runStep(supabase, clientId, 'dropbox_folder', async () => {
      const result = await createDropboxFolder(`/Clients/${client.name}`)
      await updateClientField(supabase, clientId, 'dropbox_upload_url', result.sharedLink)
      return result
    }),
    runStep(supabase, clientId, 'gdrive_folder', async () => {
      return await createGDriveFolder(client.name, GDRIVE_PARENT_FOLDER_ID)
    }),
  ])

  // Check if Slack channel was created (needed for Phase 2)
  const channelId = slackResult.status === 'fulfilled'
    ? slackResult.value?.channel_id
    : null

  // Phase 2: Slack-dependent steps + team notify — run in parallel
  await Promise.allSettled([
    channelId
      ? runStep(supabase, clientId, 'slack_invite', async () => {
          const contactEmail = client.contacts?.[0]?.email
          const inviteEmails = process.env.ONBOARD_INVITE_EMAILS?.split(',') ?? []
          const emails = [contactEmail, ...inviteEmails].filter(Boolean)
          return await inviteToChannel(channelId, emails)
        })
      : skipStep(supabase, clientId, 'slack_invite', 'Slack channel not created'),

    channelId
      ? runStep(supabase, clientId, 'welcome_message', async () => {
          const message = buildWelcomeMessage(client)
          return await sendMessage(channelId, message)
        })
      : skipStep(supabase, clientId, 'welcome_message', 'Slack channel not created'),

    runStep(supabase, clientId, 'team_notify', async () => {
      const assignments = await getClientAssignments(clientId, supabase)
      const toNotify = assignments.filter(a =>
        ['senior_editor', 'senior_writer', 'senior_designer'].includes(a.assignment_role)
      )
      // Look up each team member's email, send DM via Slack
      for (const assignment of toNotify) {
        const member = assignment.team_member
        if (member?.email) {
          await sendDM(member.email,
            `New client onboarded: ${client.name}. You've been assigned as ${assignment.assignment_role}.`
          )
        }
      }
      return { notified: toNotify.map(a => `${a.team_member.first_name} ${a.team_member.last_name} (${a.assignment_role})`) }
    }),
  ])
}

// Helper: runs a step, catches errors, updates DB status
async function runStep(supabase: SupabaseClient, clientId: string, step: string, fn: () => Promise<any>) {
  await updateStep(supabase, clientId, step, 'running')
  try {
    const result = await fn()
    await updateStep(supabase, clientId, step, 'success', result)
    return result
  } catch (error) {
    await updateStep(supabase, clientId, step, 'failed', null, error.message)
    return null
  }
}

// Helper: marks a step as skipped (dependency not met)
async function skipStep(supabase: SupabaseClient, clientId: string, step: string, reason: string) {
  await updateStep(supabase, clientId, step, 'skipped', null, reason)
}
```

## API Route

### `app/api/onboard/route.ts`

```typescript
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@/lib/supabase/server'
import { runOnboarding } from '@/lib/services/onboarding'

export async function POST(request: Request) {
  // 1. Validate the user is authenticated (via cookie session)
  const userSupabase = await createServerClient()
  const { data: { user }, error } = await userSupabase.auth.getUser()
  if (!user || error) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { clientId } = await request.json()
  if (!clientId) {
    return Response.json({ error: 'Missing clientId' }, { status: 400 })
  }

  // 2. Create a service-role client for background work
  const serviceSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 3. Fire and forget — respond immediately
  runOnboarding(clientId, serviceSupabase).catch(console.error)
  return Response.json({ started: true })
}
```

### Retry Endpoint: `app/api/onboard/retry/route.ts`

```typescript
export async function POST(request: Request) {
  // Validate auth (same as above)
  const { clientId, step } = await request.json()

  // Reset the target step + any dependent steps
  const stepsToReset = getStepsToReset(step) // e.g., 'slack_channel' → also reset slack_invite, welcome_message
  for (const s of stepsToReset) {
    await resetStep(serviceSupabase, clientId, s)
  }

  // Re-run from the target step
  retryOnboarding(clientId, step, serviceSupabase).catch(console.error)
  return Response.json({ retried: true })
}
```

**Cascade retry logic:**
- Retrying `slack_channel` also resets `slack_invite` and `welcome_message` to `pending` and re-runs them
- Retrying `dropbox_folder` or `gdrive_folder` only retries that single step
- Retrying `slack_invite`, `welcome_message`, or `team_notify` only retries that single step

## Frontend

### Onboarding Modal Component

**File:** `components/clients/onboarding-modal.tsx`

**Props:** `{ clientId: string, clientName: string, open: boolean, onOpenChange: (open: boolean) => void }`

**This is a `'use client'` component** (uses hooks for state and realtime subscription).

**Behavior:**
1. On mount, subscribe to Supabase realtime: `onboarding_steps` changes WHERE `client_id = clientId`
2. Initial state: "Client record created" with green checkmark (static, not from DB) + 6 steps with spinners
3. As realtime events arrive, update each step's display:
   - `pending` / `running` → spinner (animated CSS)
   - `success` → green checkmark
   - `failed` → red X + "Retry" button
   - `skipped` → gray dash + reason tooltip
4. When all 6 DB steps are resolved (success/failed/skipped), show "Continue" button
5. "Continue" navigates to `/clients/{clientId}`
6. "Retry" calls `/api/onboard/retry` with step name, resets that step (+ dependents) to spinner
7. On unmount, unsubscribe from realtime channel

**Uses shadcn v4 Dialog** with `render` prop pattern (not `asChild`).

**Step display labels:**
| Step key | Display text (spinner) | Display text (success) |
|----------|----------------------|----------------------|
| *(static)* | — | Client record created |
| `slack_channel` | Creating Slack channel | Slack channel created |
| `dropbox_folder` | Creating Dropbox folder | Dropbox folder created |
| `gdrive_folder` | Creating Google Drive folder | Google Drive folder created |
| `slack_invite` | Inviting to Slack | Invited to Slack |
| `welcome_message` | Sending welcome message | Welcome message sent |
| `team_notify` | Notifying team | Team notified |

### Changes to Client Form

**File:** `components/clients/client-form.tsx`

Current flow: form submit → `createClientAction` → returns `{ id, error }` → `router.push(/clients/${id})`

New flow:
1. Form submit → `createClientAction` → returns `{ id, error }`
2. If error, show error message (unchanged)
3. If success, set state: `onboardingClientId = id`, `onboardingClientName = name`
4. This opens the `OnboardingModal`
5. Fire `fetch('/api/onboard', { method: 'POST', body: JSON.stringify({ clientId: id }) })` — no await needed
6. Modal handles the rest (realtime updates → Continue → navigate to detail page)

### Changes to Client Detail Page

**New section:** `OnboardingStatusSection` — shows onboarding step history.

- Queries `onboarding_steps` for this client
- Shows compact list: step name + status icon (✅/❌/⏭)
- If any failed steps, shows "Retry" button
- If no onboarding steps exist (old clients), section is hidden
- If all succeeded, shows "Onboarding complete" with timestamp of last `completed_at`

## Welcome Message Template

```
Welcome to Known Local, {client_name}!

This is your dedicated channel for all project communication and updates.

Your team:
• Strategist: {strategist_name}
• Manager: {manager_name}

If you have any questions, drop them here and we'll get back to you quickly.
```

Team names are pulled from `client_assignments` joined with `team_members`. If a role is unassigned, that line is omitted.

## Environment Variables

Add to `.env.local`:

```
# Supabase service role (for background onboarding — bypasses RLS)
SUPABASE_SERVICE_ROLE_KEY=...

# Slack
SLACK_BOT_TOKEN=xoxb-...

# Dropbox (refresh token flow)
DROPBOX_APP_KEY=...
DROPBOX_APP_SECRET=...
DROPBOX_REFRESH_TOKEN=...

# Google Drive (service account)
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
GOOGLE_DRIVE_PARENT_FOLDER_ID=...

# Onboarding defaults
ONBOARD_INVITE_EMAILS=clayton@knownlocal.com,andrew@knownlocal.com
```

## MCP Server Changes

- No new onboarding tools. `create_client` continues to insert directly into DB.
- New read tool: `get_onboarding_status(client_id)` — returns all steps with statuses
- The MCP `create_client` does NOT trigger onboarding (only app UI does). If MCP-triggered onboarding is needed later, add an `onboard_client` tool that calls the API route.

## Dependencies

**New npm package:** `google-auth-library` — for Google service account JWT signing. The RSA signing logic is non-trivial (~80 lines) and this lightweight package handles it cleanly.

All other APIs use plain `fetch`:
- Slack Web API: `https://slack.com/api/*`
- Dropbox API: `https://api.dropboxapi.com/2/*`

## Error Handling

- Each step is independent within its phase. A failure in one step does not block other steps in the same phase.
- **Dependency handling:** `slack_invite` and `welcome_message` depend on `slack_channel`. If channel creation fails, these are marked `skipped` with reason "Slack channel not created".
- **Cascade retry:** Retrying `slack_channel` automatically resets and re-runs `slack_invite` and `welcome_message`.
- Failed/skipped steps can be retried from the onboarding modal or from the client detail page.
- All errors are logged server-side (`console.error`) and stored in `onboarding_steps.error_message`.

## Vercel Timeout Consideration

Vercel Hobby plan has a 10-second function timeout. With parallel execution (2 phases), total time should be ~4-8 seconds. If this becomes an issue:
- Upgrade to Vercel Pro (60s timeout)
- Or add `export const maxDuration = 30` to the route (Pro plan feature)
- Or migrate background work to Supabase Edge Functions (150s timeout)

For V1, parallel execution should stay within the 10s Hobby limit. Monitor and adjust if needed.

## Migration Plan

- New migration: `007_onboarding.sql`
  - Two new ENUMs: `onboarding_step_name`, `onboarding_step_status`
  - `onboarding_steps` table
  - RLS policies (SELECT for all auth, INSERT restricted to admin/strategist/jr_strategist)
  - Realtime publication
- **One-time setup:** Enable Supabase Realtime on the project via Dashboard → Database → Replication
- Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` (get from Supabase Dashboard → Settings → API)
- No changes to existing tables

## SPEC.md Updates Required

Remove from "Out of Scope for V1":
- "Automated Slack/Dropbox handoffs" → now in scope (this feature)
- "Notification system (Slack, email, in-app)" → partially in scope (Slack DMs for onboarding only)

Add to Module 1 or as new Module:
- Client onboarding automation: Slack channel, Dropbox folder, Google Drive folder, invites, welcome message, team notification

## Testing Strategy

- Unit test each service function with mocked API responses
- Integration test: create client → verify 6 steps created → verify statuses update
- Browser test: create client → watch modal → verify all steps resolve
- Edge cases: duplicate channel name, Dropbox folder already exists, invalid client contact email, no team assignments yet, Slack user not found by email
