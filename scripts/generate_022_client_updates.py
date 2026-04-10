"""Generate 022_client_data_update.sql from Notion clients CSV (BOM-safe)."""
import csv
import re
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

CSV_PATH = 'client database from notion/Clients DataBase (Main 2 0) 0805e95a25a34a66a1a46add5e449ecb_all.csv'

# Read CSV with utf-8-sig to strip BOM
with open(CSV_PATH, 'r', encoding='utf-8-sig') as f:
    rows = list(csv.DictReader(f))

print(f"Total CSV rows: {len(rows)}")

def strip_notion_url(val):
    """Remove Notion inline URLs: 'Name (https://notion.so/...)' → 'Name'"""
    if not val:
        return val
    return re.sub(r'\s*\(https?://www\.notion\.so/[^)]+\)', '', val).strip()

def sql_escape(s):
    """Escape single quotes for SQL."""
    if not s:
        return ''
    return s.replace("'", "''")

def extract_url(val):
    """Extract a clean URL from Notion export value."""
    if not val:
        return None
    val = val.strip()
    # Notion sometimes wraps: "Title (https://...)"
    m = re.search(r'(https?://[^\s)]+)', val)
    return m.group(1) if m else None

def map_health(val):
    if not val:
        return None
    val = val.strip().lower()
    mapping = {'on track': 'on_track', 'at risk': 'at_risk', 'off track': 'off_track'}
    return mapping.get(val)

# Filter to active + onboarding only
active_rows = []
for r in rows:
    status = strip_notion_url(r.get('Status', '')).strip()
    if status.lower() in ('active', 'onboarding'):
        active_rows.append(r)

print(f"Active+Onboarding rows: {len(active_rows)}")

# Build UPDATE statements
updates = []
for r in active_rows:
    name = r.get('Client Name', '').strip()
    if not name:
        continue

    health = map_health(r.get('Health', ''))
    bvg_url = extract_url(r.get('Brand Voice Guide', ''))
    area_url = extract_url(r.get('Area Guide', ''))
    approval = r.get('Approval Emails', '').strip()

    # Build SET clauses
    sets = []
    if health:
        sets.append(f"health = '{health}'")
    if bvg_url:
        sets.append(f"brand_voice_guide_url = '{sql_escape(bvg_url)}'")
    if area_url:
        sets.append(f"area_guide_url = '{sql_escape(area_url)}'")
    if approval:
        sets.append(f"approval_emails = '{sql_escape(approval)}'")

    if sets:
        sql_name = sql_escape(name)
        set_clause = ', '.join(sets)
        updates.append(f"UPDATE clients SET {set_clause} WHERE name = '{sql_name}';")

print(f"UPDATE statements: {len(updates)}")

# Write the migration file
with open('supabase/migrations/022_client_data_update.sql', 'w', encoding='utf-8') as f:
    f.write("-- 022_client_data_update.sql — Client data: new fields + Tucker Cummings\n")
    f.write("-- Reference: data-verification/clients_migration_data.txt\n")
    f.write("-- NOTE: No BEGIN/COMMIT — supabase db push wraps each file in its own transaction\n\n\n")

    f.write("-- ═══════════ 1. Insert Tucker Cummings ═══════════\n\n")
    f.write("""INSERT INTO clients (name, status, pod_id)
  SELECT 'Tucker Cummings', 'active', p.id
  FROM pods p WHERE p.name = 'Pod 4'
  AND NOT EXISTS (SELECT 1 FROM clients WHERE name = 'Tucker Cummings');

INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  SELECT c.id, t.id, 'strategist'
  FROM clients c, team_members t
  WHERE c.name = 'Tucker Cummings' AND t.email = 'austin.marks@knownlocal.com'
  AND NOT EXISTS (
    SELECT 1 FROM client_assignments
    WHERE client_id = c.id AND assignment_role = 'strategist'
  );

""")

    f.write("-- ═══════════ 2. Status updates ═══════════\n\n")
    f.write("UPDATE clients SET status = 'active' WHERE name = 'Ryan Meeks' AND status = 'onboarding';\n")
    f.write("UPDATE clients SET status = 'active' WHERE name = 'Ryan Meeks - WHIP' AND status = 'onboarding';\n\n\n")

    f.write("-- ═══════════ 3. Update brand_voice_guide_url, area_guide_url, health, approval_emails ═══════════\n\n")
    for u in updates:
        f.write(u + '\n')
    f.write(f"\n-- Total updates: {len(updates)} clients\n")

print("Done — wrote supabase/migrations/022_client_data_update.sql")
