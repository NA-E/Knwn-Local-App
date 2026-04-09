# Data Correction Plan

## Correction Sequence (must follow this order due to dependencies)

### 1. Pods
- Verify pod names are correct
- Current: ELLA, Pod 1, Pod 2, Pod 3, Pod 4, Test Pod 5
- **Action:** Clayton/Paulo confirm pod names, remove "Test Pod 5" if not real

### 2. Team Members (35 total)
- Verify: first name, last name, email, role, pod assignments
- 22/35 have real emails from Notion, 13 have `@knownlocal.com` placeholders
- **Critical:** `supervised_by` field needs to be populated for all writers and editors (Paulo/Clayton must provide the mapping of who supervises whom)
- **Action:** Export list, Clayton/Paulo fill in missing emails + supervised_by mapping

### 3. Clients (80 total — 74 active, 6 onboarding)
- Verify: name, market, pod, status, package, contract start date, timezone
- Verify URLs: website, YouTube, Dropbox upload, Dropbox folder, Slack channel
- Verify: posting schedule, script format, communication method, special instructions
- **Action:** Export list, Clayton/Paulo mark corrections

### 4. Client Assignments (306 total)
- Verify which team member fills which role for each client
- Roles: strategist, manager, senior editor, senior writer, designer, senior designer
- **Action:** Review in-app via client detail pages, flag any incorrect assignments

### 5. Client Channels (77 total)
- Verify: channel name, YouTube URL, videos per week
- **Action:** Review in-app, flag corrections

### 6. Client Contacts (40 total)
- Verify: contact name, email, phone, primary flag
- **Action:** Review in-app, flag corrections

### 7. Projects
- Mostly will be created fresh as real production begins
- Any existing test projects can be deleted

## Review Process

### Option A: In-App Review (Recommended)
1. Clayton and Paulo log in with admin accounts
2. Navigate through each client's detail page
3. Use Loom/screen recording to narrate what's wrong
4. Share recording links in Slack

### Option B: Google Sheets Review (Most Efficient)
1. Admin exports data via /admin/data-review page (to be built)
2. CSV exports imported into Google Sheets
3. Clayton/Paulo highlight cells that need correction in red
4. Add comments explaining the correct value
5. Share the annotated sheet back
6. Corrections applied programmatically via migration script

### Option C: Hybrid
1. Quick pass through the app to check the "feel" (are names right? pods right?)
2. Detailed corrections via annotated Google Sheet
3. Best of both worlds — catch obvious issues fast, then systematic correction

**Recommendation:** Option C (Hybrid). Quick app walkthrough first to catch big issues, then Google Sheets for systematic cell-by-cell corrections.
