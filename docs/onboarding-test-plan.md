# Client Onboarding Automation — Test Plan

## Environment Variables Required

Add ALL of these to `.env.local` before testing:

```bash
# Already exists
NEXT_PUBLIC_SUPABASE_URL=https://tcpynxcruaddahdhuugb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<already set>

# NEW — Supabase service role (Dashboard → Settings → API → service_role key)
SUPABASE_SERVICE_ROLE_KEY=

# NEW — Slack Bot Token (api.slack.com → Your Apps → OAuth & Permissions)
# Required scopes: channels:manage, channels:write.invites, chat:write, users:read, users:read.email
SLACK_BOT_TOKEN=xoxb-...

# NEW — Dropbox (dropbox.com/developers → App Console)
DROPBOX_APP_KEY=
DROPBOX_APP_SECRET=
DROPBOX_REFRESH_TOKEN=

# NEW — Google Drive (console.cloud.google.com → APIs → Drive API → Service Account)
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}
GOOGLE_DRIVE_PARENT_FOLDER_ID=

# NEW — Default Slack invite emails (comma-separated, no spaces)
ONBOARD_INVITE_EMAILS=clayton@knownlocal.com,andrew@knownlocal.com
```

### How to Get Each Value

| Variable | Where to get it |
|----------|----------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → `service_role` (secret) |
| `SLACK_BOT_TOKEN` | api.slack.com → Create New App → OAuth & Permissions → Bot User OAuth Token |
| `DROPBOX_APP_KEY` | dropbox.com/developers → Create App → App key |
| `DROPBOX_APP_SECRET` | Same page → App secret |
| `DROPBOX_REFRESH_TOKEN` | OAuth flow: authorize app, exchange code for refresh token (see Dropbox docs) |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | GCP Console → IAM → Service Accounts → Create → Keys → JSON (paste as single line) |
| `GOOGLE_DRIVE_PARENT_FOLDER_ID` | Open the "Clients" folder in Google Drive → copy ID from URL. Share folder with service account email. |
| `ONBOARD_INVITE_EMAILS` | Comma-separated Slack workspace emails to auto-invite to every new client channel |

---

## Pre-Test Setup

### 1. Apply migration
Run `007_onboarding.sql` in Supabase SQL Editor (Dashboard → SQL Editor → paste & run)

### 2. Enable Realtime
Supabase Dashboard → Database → Replication → verify `supabase_realtime` publication includes `onboarding_steps`

### 3. Install dependency
```bash
cd E:\1.Claude Code\knwn_local_app
npm install google-auth-library  # if not already installed
```

### 4. Restart dev server
```bash
npm run dev
```

---

## Test Cases

### Phase 0: Build Verification
- [ ] `npm run build` — zero TypeScript errors
- [ ] `cd mcp-server && npm run build` — zero errors
- [ ] Dev server starts without env var errors in console

### Phase 1: Happy Path — Full Onboarding
- [ ] Login as admin@knownlocal.com
- [ ] Navigate to /clients/new
- [ ] Fill in: Name = "Test Onboard Client", Market = "Test City"
- [ ] Click Create
- [ ] **VERIFY:** Modal appears with title "Onboarding Test Onboard Client..."
- [ ] **VERIFY:** "Client record created" shows green checkmark immediately (static, not from DB)
- [ ] **VERIFY:** 6 steps show spinning indicators
- [ ] **VERIFY:** Steps resolve one by one (spinners → green checkmarks)
- [ ] **VERIFY:** Expected step results:
  - Slack channel `#client-test-onboard-client` created
  - Dropbox folder `/Clients/Test Onboard Client/` created
  - Google Drive folder created in parent folder
  - Client invited to Slack (or skipped if no contact email)
  - Welcome message posted in Slack channel
  - Team notified (or skipped if no senior assignments)
- [ ] **VERIFY:** "Continue" button appears when all steps resolve
- [ ] Click Continue
- [ ] **VERIFY:** Navigated to client detail page
- [ ] **VERIFY:** Onboarding Status section visible showing all steps green
- [ ] **VERIFY:** Client record has `slack_channel_url` and `dropbox_upload_url` populated

### Phase 2: External Verification
- [ ] Open Slack → verify `#client-test-onboard-client` channel exists
- [ ] Check channel members → Clayton + Andrew should be invited
- [ ] Check channel messages → welcome message present
- [ ] Open Dropbox → verify `/Clients/Test Onboard Client/` folder exists
- [ ] Open Google Drive → verify `Test Onboard Client` folder in parent folder
- [ ] Check Slack DMs → senior team members should have notification (if assigned)

### Phase 3: Failure & Retry
- [ ] Temporarily set `SLACK_BOT_TOKEN=invalid` in .env.local, restart
- [ ] Create another test client
- [ ] **VERIFY:** Modal shows slack_channel as ❌ failed
- [ ] **VERIFY:** slack_invite and welcome_message show as skipped (gray, "Slack channel not created")
- [ ] **VERIFY:** dropbox_folder and gdrive_folder still succeed (independent)
- [ ] **VERIFY:** Retry button appears next to failed step
- [ ] Fix `SLACK_BOT_TOKEN`, restart
- [ ] Click Retry on slack_channel
- [ ] **VERIFY:** slack_channel, slack_invite, and welcome_message all re-run (cascade retry)
- [ ] **VERIFY:** They resolve to green checkmarks
- [ ] **VERIFY:** dropbox_folder and gdrive_folder are NOT re-run (no duplicate folders)

### Phase 4: Modal Edge Cases
- [ ] Create a client → while modal is showing spinners, close the browser tab
- [ ] Re-open the client detail page → **VERIFY:** Onboarding Status section shows correct final states (background work continued despite tab close)
- [ ] Create a client → while modal is showing spinners, wait 30+ seconds without progress
- [ ] **VERIFY:** "Close" button appears after stall timeout
- [ ] Click Close → **VERIFY:** Modal closes, can navigate to client detail page

### Phase 5: Duplicate Handling
- [ ] Create a client named "Test Onboard Client" again (same name as Phase 1)
- [ ] **VERIFY:** Slack channel created as `#client-test-onboard-client-2` (auto-incremented)
- [ ] **VERIFY:** Dropbox folder handles "already exists" gracefully (uses existing or creates with different name)

### Phase 6: Auth & Security
- [ ] Call `POST /api/onboard` without being logged in → **VERIFY:** 401 Unauthorized
- [ ] Call `POST /api/onboard` with invalid JSON body → **VERIFY:** 400 Bad Request
- [ ] Login as a non-admin role (if test accounts exist) → **VERIFY:** 403 Forbidden on /api/onboard

### Phase 7: Client Detail Page — Onboarding Status Section
- [ ] Navigate to client detail for the test client
- [ ] **VERIFY:** Onboarding section shows all 6 steps with status icons
- [ ] **VERIFY:** Failed steps show Retry button
- [ ] Navigate to an OLD client (created before onboarding feature)
- [ ] **VERIFY:** No onboarding section shown (hidden when no steps exist)

### Phase 8: MCP Server
- [ ] Start MCP server: `cd mcp-server && node dist/index.js`
- [ ] Call `get_onboarding_status` with the test client's ID
- [ ] **VERIFY:** Returns all 6 steps with correct statuses and result_data

### Phase 9: Console Clean
- [ ] Open browser DevTools Console on every page visited during testing
- [ ] **VERIFY:** No JavaScript errors
- [ ] **VERIFY:** No React hydration warnings
- [ ] **VERIFY:** No uncaught promise rejections
- [ ] Check Next.js terminal — **VERIFY:** No server-side errors (except expected ones during Phase 3)

---

## Cleanup After Testing

- Delete test clients from Supabase: `DELETE FROM clients WHERE name LIKE 'Test Onboard%'`
- Delete test Slack channels: archive `#client-test-onboard-client` and `#client-test-onboard-client-2`
- Delete test Dropbox folders
- Delete test Google Drive folders
