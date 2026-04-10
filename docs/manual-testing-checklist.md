# Manual Testing Checklist

> Bug tracking: see `docs/master-tasklist.md` → Active Work section

## Auth & Login
- [ ] Email/password login works
- [ ] Google OAuth login works
- [ ] Redirect to /clients after login
- [ ] Auto-link to team_member record on first login
- [ ] Sign out works and redirects to login
- [ ] Unauthenticated users redirected to login

## Sidebar Navigation
- [ ] Sidebar shows correct user name and role
- [ ] Admin sees: Clients, Projects (Pipeline, My Board), Admin (Team, Pods)
- [ ] Non-admin roles do NOT see Admin section
- [ ] Dashboard link visible only for admin/strategist/jr_strategist
- [ ] Active nav item highlighted correctly
- [ ] All nav links navigate to correct pages

## Dashboard (/dashboard)
- [ ] Page loads without errors
- [ ] Active Clients count card (~74)
- [ ] Active Projects count card
- [ ] Stuck Projects count card (amber styling)
- [ ] Completed This Month count card
- [ ] Projects by Stage bar chart renders with percentages
- [ ] Stuck Projects table with linked project names + ages (if any)
- [ ] No console errors

## Client List (/clients)
- [ ] Client list loads with all clients
- [ ] Search by client name works
- [ ] Filter by status works
- [ ] Filter by pod works
- [ ] Pagination works (next/prev)
- [ ] Click row navigates to client detail

## Client Detail (/clients/[id])
- [ ] Back link to /clients works
- [ ] Client name, status badge, pod badge, market display correctly
- [ ] Edit button navigates to edit page
- [ ] **Client Info section**: Health badge (color-coded), Package, Contract Start, Posting Schedule, Script Format, Communication, Approval Emails, Special Notes — all show correct data
- [ ] **Links section**: Brand Voice Guide, Area Guide, Dropbox, Slack Channel, Website — "Open" links work
- [ ] Health badge shows correct color: green (On Track), amber (At Risk), red (Off Track), dash if unset
- [ ] **Team section**: All assignment roles shown, click to change works
- [ ] **YouTube Channels section**: Channel name, URL link, videos/wk shown
- [ ] Add/Edit/Remove channel works
- [ ] **Contacts section**: Name bold on top, email as mailto link, phone below
- [ ] Add/Edit contact works, Primary/Assistant badges show
- [ ] **Client Login Link section**: Generate link, copy link, open link, description text
- [ ] File Upload Link shown with copy/open buttons
- [ ] **Onboarding Status section**: Shows step statuses for onboarding clients

## Client Create (/clients/new)
- [ ] All form fields render (including Health dropdown, Approval Emails, Brand Voice Guide URL, Area Guide URL)
- [ ] Pod cards show with client counts and capacity bars
- [ ] Selecting a pod auto-assigns Strategist + Manager
- [ ] Role dropdowns filter to pod members
- [ ] Manual role override works
- [ ] Submit creates client and fires onboarding
- [ ] Onboarding modal appears with realtime step updates

## Client Edit (/clients/[id]/edit)
- [ ] All form fields pre-populated with existing data (health, approval emails, brand voice guide URL, area guide URL)
- [ ] Health dropdown shows current value
- [ ] Pod cards show with current pod selected (blue border)
- [ ] Existing team assignments pre-populated in dropdowns
- [ ] Changing pod re-fetches members and auto-assigns
- [ ] Save Changes updates client and assignments
- [ ] Cancel navigates back

## Team Management (/team) — Admin Only
- [ ] Team list shows all members with role, pod, status
- [ ] Status filter includes: Active, Inactive, Onboarding, Contract Paused, Offboarded
- [ ] Add team member form works (admin only) — includes phone field
- [ ] Edit team member works (admin only) — phone field pre-populated, all 5 statuses in dropdown
- [ ] Non-admin blocked by server action even if URL accessed directly

## Pods Management (/pods) — Admin Only
- [ ] Pod list shows all pods
- [ ] Create pod works (admin only)
- [ ] Edit pod works (admin only)
- [ ] Non-admin blocked by server action even if URL accessed directly

## Create Project (/projects/new)
- [ ] Form loads: Title, Client dropdown, Writer dropdown, Editor dropdown, Notes
- [ ] Client dropdown populated with active/onboarding clients
- [ ] Writer/Editor dropdowns populated with active members
- [ ] Notes field accepts multiline text
- [ ] Validation: empty title → error
- [ ] Validation: no client selected → error
- [ ] Fill Title + Client → Create → success (redirect or toast)
- [ ] Writer and Editor are optional — form submits without them
- [ ] Cancel navigates back
- [ ] No console errors

## Projects Pipeline (/projects/pipeline)
- [ ] Kanban board renders with correct statuses per role
- [ ] Layout is stacked rows grouped by phase: To-Do, Pre-Production, Production, Post-Production, Complete
- [ ] Each phase group row has a labelled header with project count
- [ ] Click group header collapses/expands that row
- [ ] Collapsed group shows project count in header
- [ ] Expanded group shows all cards in that phase
- [ ] Project cards show title, client, writer, editor, design status (no task number on cards)
- [ ] Cards show days in status and relevant due date icon
- [ ] Drag and drop moves cards between statuses within the same row
- [ ] Drag and drop moves cards across phase rows (cross-group)
- [ ] Status transition validated (invalid moves rejected with error toast)
- [ ] Click card navigates to project detail (click, not drag)
- [ ] Drag does NOT trigger navigation (drag guard works)
- [ ] Filter: Pod dropdown works
- [ ] Filter: Client dropdown works
- [ ] Filter: Status Group dropdown works
- [ ] Filter: Team Member dropdown works
- [ ] Clear all filters → full pipeline returns

## Project Detail (/projects/[id])
- [ ] Back to Pipeline link navigates to /projects/pipeline
- [ ] Task number, title (editable), status badge, design status dot, version badge
- [ ] Title inline edit: click pencil → edit → Enter saves, Escape cancels
- [ ] Activity log shows status history with timestamps
- [ ] Sidebar: client link, writer/editor, dates, links section
- [ ] Status actions: transition buttons based on current status + role
- [ ] Forward transition: click → status updates, history logged
- [ ] Conditional forms: transitions requiring data (edit URL, feedback) show inline form
- [ ] Project links editable: script URL, edit URL, thumbnail URL + notes field
- [ ] Project links: empty fields show placeholder, saved values persist after reload

## My Board (/projects/my-board)
- [ ] Shows only projects relevant to current user's role
- [ ] Correct columns for role

## Client Portal (/client/[token])
- [ ] Generate portal link button on client detail page creates a magic link token
- [ ] Copy link and open link buttons work after generation
- [ ] Visit portal URL via magic link token — page loads without login
- [ ] Valid token shows client name, projects, and channels
- [ ] Projects list hides cancelled and idea statuses
- [ ] No sensitive data exposed (no team assignments, special instructions, contacts, internal notes)
- [ ] Upload link row visible and functional when a file upload link is provided
- [ ] Expired/invalid token shows not-found or error page

## Security
- [ ] RLS policies enforced (test with different roles)
- [ ] Server actions check role permissions
- [ ] Team/Pods actions require admin role
- [ ] Client assignment actions require admin/strategist/jr_strategist
- [ ] Project field updates respect role allowlists

## Responsive / Visual
- [ ] Sidebar fixed, content scrolls independently
- [ ] Forms readable and usable
- [ ] Pipeline board: no horizontal scroll — stacked rows layout fills viewport vertically
- [ ] No console errors on any page (ignore Chrome extension noise)
- [ ] No React hydration warnings
- [ ] No uncaught promise rejections
- [ ] No layout overflow issues
- [ ] Pages load within ~3 seconds
