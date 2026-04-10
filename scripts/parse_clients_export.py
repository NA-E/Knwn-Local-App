"""Parse the Notion clients export (April 2026) and produce structured data
for a Supabase migration.

Extracts:
1. New clients not already in the DB
2. New columns: brand_voice_guide_url, area_guide_url, health, approval_emails
3. Assignment data comparison (strategist, manager, senior_editor, editor, designer)

Output: data-verification/clients_migration_data.txt
"""

import csv
import sys
import io
import re
import os
from collections import defaultdict

# Fix Windows console encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(BASE_DIR, 'data export',
    'Clients DataBase (Main 2 0) 0805e95a25a34a66a1a46add5e449ecb_all.csv')
OUTPUT_DIR = os.path.join(BASE_DIR, 'data-verification')
OUTPUT_PATH = os.path.join(OUTPUT_DIR, 'clients_migration_data.txt')

# ============================================================
# EXISTING DB DATA (from migration 009 + actual DB state)
# ============================================================

EXISTING_CLIENTS = {
    'Adam Dow', 'Alex Yu', 'Alley Buscemi', 'Alyssa Curran', 'Amit Bhuta',
    'Amy Shrader', 'Arjun Dhingra', 'Austin Klar', 'Bern McGovern',
    'Blake Ginther', 'Brad Thornton', 'Brandon - Development Channel',
    'Brandon Blankenship', 'Breaking and Building Leaders', 'Brette Davis',
    'Charity & Joe Slawter', 'Charles Cherney', 'Chris Colgan', 'Chris Schwarz',
    'Connie Van', 'David Hargreaves', 'Devin Sheehan', 'Erik Throm',
    'Erin & Niki', 'Gary Bradler', 'Gary Gold', 'German Hernandez',
    'Golfi Team', 'Grant Irby', 'HHG', 'Hannah Dubyne', 'Isayas Theodros',
    'Jadde Rowe', 'Jason & Brooke', 'Joe Biscaha', 'John Garuti',
    'John Sintich', 'Justin Landis', 'Knwn Local', 'Kristin Prough',
    'Kyle Simmons', 'Kyle Talbot', 'LFG Energy (Arjun Podcast)',
    'LID Levi Lascsak', 'Landin Smith', 'Lindsey Tronolone', 'Mark Weinberg',
    'Marti Hampton', 'Matt Lunden', 'Matt Oneill', 'Matt Vance',
    'Matthew Hyde', 'Maynard Wagner', 'Micah Bleecher', 'Michael McCall',
    'Missy Yost', 'Oyler Hines', 'PP Levi Lascsak', 'Raziel Ungar',
    'Real NoVA Network (Chris Colgan)', 'Ryan Butler', 'Ryan Meeks',
    'Ryan Meeks - WHIP', 'Sally Daley', 'Sam Riddle', 'Sarah Newman',
    'Schmitz & Smith Group', 'Scott Moe', 'Sean McConnell',
    'Stephanie Cole Patterson', 'Stephen Cooley',
    'TEST CLIENT \u2014 Delete Me', 'The San Diego Scoop', 'Tiffany Pantozzi',
    'Tina Gamble', 'Valerie Gonzalez', 'WHID Levi Lascsak', 'Will Sawyer',
    'Will Van Wickler', 'William Burton', 'Wilson Leung',
}

# Team member name mapping: CSV name -> DB first_name + last_name concatenated
# The DB stores first_name and last_name separately; we match on concatenation.
# Key = name as it appears in the Notion client CSV
# Value = "first_name last_name" as stored in the DB
TEAM_NAME_MAP = {
    # Exact matches (first last already correct)
    'Alejandro Manrique':        'Alejandro Manrique',
    'Alejandro Ramos':           'Alejandro Ramos',
    'Alex Silva':                'Alex Silva',
    'Austin Marks':              'Austin Marks',
    'Blythe Miller':             'Blythe Miller',
    'Bruno Ferreira':            'Bruno Ferreira',
    'Clayton Mclemore':          'Clayton Mclemore',
    'Diego Oliveira':            'Diego Oliveira',
    'Erivelton Schmidt':         'Erivelton Schmidt',
    'Evellyn Albuquerque':       'Evellyn Albuquerque',
    'Gabriel Borba Lopes':       'Gabriel Borba Lopes',
    'Joe Porter':                'Joe Porter',
    'Jorge Perez':               'Jorge Perez',
    'Juliana Antonello':         'Juliana Antonello',
    'Kadu Zargalio':             'Kadu Zargalio',
    'Luisa Pinto':               'Luisa Pinto',
    'Manuela Arias':             'Manuela Arias',
    'Mateus Silva':              'Mateus Silva',
    'Nelson Filho':              'Nelson Filho',
    'Noah Halloran':             'Noah Halloran',
    'Rafael Borin':              'Rafael Borin',
    'Vitor Aguilar':             'Vitor Aguilar',
    'William Zheng Xie':         'William Zheng Xie',
    'Andrea Carolina Osio Amaya':'Andrea Carolina Osio Amaya',
    'Karina Porter':             'Karina Porter',  # May not exist in DB yet

    # Names needing normalization
    'Anderson "Cirion" Ruan':    'Anderson Cirion Ruan',   # DB: first=Anderson, last=Cirion Ruan
    'Anderson "Cirion" Ruan ':   'Anderson Cirion Ruan',   # trailing space variant
    'Juan Audiovisual':          'Juan Bravo',             # DB uses real name
    'Mae':                       'Mae',                    # DB: first=Mae, last=''
    'Mae Ariate':                'Mae',                    # Alternate reference
    'Amarú':                     'Amarú',                  # DB: first=Amarú, last=''
    'Marina':                    'Marina',                 # DB: first=Marina, last=''
    'Noor':                      'Noor',                   # DB: first=Noor, last=''
    'Subhan khan':               'Subhan',                 # DB: first=Subhan, last=''
    'Subhan':                    'Subhan',
    'igor marques':              'Igor Marques',           # Case normalization
    'Igor Marques':              'Igor Marques',
    'Késsia Andrade':            'Késsia Andrade',
    'Sabrina Gües':              'Sabrina Gües',
    'João Leal Junior':          'João Leal Junior',
}


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def strip_notion_url(val):
    """Remove Notion URLs from values like 'Name (https://www.notion.so/...)'.
    Also handles multiple comma-separated values with URLs."""
    if not val:
        return ''
    # Strip Notion URL pattern
    cleaned = re.sub(r'\s*\(https?://www\.notion\.so/[^\)]*\)', '', val)
    return cleaned.strip()


def extract_pod_name(val):
    """Extract pod name from 'POD 1 (https://...)' -> 'Pod 1'."""
    if not val:
        return None
    # May have multiple pods comma-separated (e.g., Ryan Butler: "POD 2, ELLA")
    pods = []
    for part in val.split(','):
        part = strip_notion_url(part).strip()
        if not part:
            continue
        # Normalize casing: "POD 1" -> "Pod 1", "ELLA" stays "ELLA"
        if part.upper().startswith('POD '):
            pods.append('Pod ' + part.split()[-1])
        elif part.upper() == 'ELLA' or part.upper().startswith('ELL'):
            pods.append('ELLA')
        else:
            pods.append(part)
    return pods[0] if pods else None  # Return primary pod


def split_names(val):
    """Split comma-separated team member names, stripping Notion URLs and normalizing."""
    if not val:
        return []
    cleaned = strip_notion_url(val)
    names = []
    for n in cleaned.split(','):
        n = n.strip().strip('"').strip()
        if n and n != '-':
            # Apply name mapping
            mapped = TEAM_NAME_MAP.get(n, n)
            names.append(mapped)
    return names


def normalize_health(val):
    """Normalize health values: 'On Track' -> 'on_track', etc."""
    if not val or not val.strip():
        return None
    v = val.strip()
    mapping = {
        'On Track': 'on_track',
        'At Risk': 'at_risk',
        'Off Track': 'off_track',
    }
    return mapping.get(v, v.lower().replace(' ', '_'))


def normalize_script_format(val):
    """Normalize script format: 'Word-for-word' -> 'word_for_word', 'Bullet Points' -> 'outline'."""
    if not val or not val.strip():
        return None
    v = val.strip().lower()
    if 'word' in v:
        return 'word_for_word'
    if 'bullet' in v or 'outline' in v:
        return 'outline'
    return None


def sql_str(val):
    """Escape a value for SQL single-quote string."""
    if val is None:
        return 'NULL'
    s = str(val).replace("'", "''")
    return f"'{s}'"


def sql_val(val):
    """Return SQL value: NULL for empty, or quoted string."""
    if val is None or (isinstance(val, str) and not val.strip()):
        return 'NULL'
    return sql_str(val.strip())


# ============================================================
# READ CSV
# ============================================================

with open(CSV_PATH, 'r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    all_rows = list(reader)

# Filter to Active + Onboarding only
active_rows = []
for row in all_rows:
    status = row.get('Status', '').strip()
    name = row.get('Client Name', '').strip()
    if status in ('Active', 'Onboarding') and name:
        active_rows.append(row)

print(f'Total rows in CSV: {len(all_rows)}')
print(f'Active + Onboarding rows: {len(active_rows)}')


# ============================================================
# ANALYSIS
# ============================================================

new_clients = []
update_data = []  # (name, brand_voice_url, area_guide_url, health, approval_emails, script_format)
assignment_data = []  # (client_name, role, member_names)

for row in active_rows:
    name = row.get('Client Name', '').strip()
    status = row.get('Status', '').strip()
    pod_raw = row.get('POD', '').strip()
    pod = extract_pod_name(pod_raw)

    # New columns
    brand_voice = row.get('Brand Voice Guide', '').strip()
    area_guide = row.get('Area Guide', '').strip()
    health_raw = row.get('Health', '').strip()
    health = normalize_health(health_raw)
    approval_emails = row.get('Approval Emails', '').strip()
    script_format = normalize_script_format(row.get('Script Format', ''))

    # Check if new client
    if name not in EXISTING_CLIENTS:
        new_clients.append({
            'name': name,
            'status': status.lower(),
            'pod': pod,
            'brand_voice_guide_url': brand_voice,
            'area_guide_url': area_guide,
            'health': health,
            'approval_emails': approval_emails,
            'script_format': script_format,
        })

    # Collect update data for all active/onboarding clients
    update_data.append({
        'name': name,
        'brand_voice_guide_url': brand_voice or None,
        'area_guide_url': area_guide or None,
        'health': health,
        'approval_emails': approval_emails or None,
        'script_format': script_format,
    })

    # Collect assignment data
    cs = split_names(row.get('Creative Strategist', ''))
    ym = split_names(row.get('Youtube Manager', ''))
    se = split_names(row.get('Senior Editor', ''))
    ed = split_names(row.get('Editor(s)', ''))
    gd = split_names(row.get('Graphic Designer', ''))

    for member in cs:
        assignment_data.append((name, 'strategist', member))
    for member in ym:
        assignment_data.append((name, 'manager', member))
    for member in se:
        assignment_data.append((name, 'senior_editor', member))
    for member in ed:
        assignment_data.append((name, 'editor', member))
    for member in gd:
        assignment_data.append((name, 'designer', member))


# ============================================================
# GENERATE OUTPUT
# ============================================================

os.makedirs(OUTPUT_DIR, exist_ok=True)

lines = []


def out(s=''):
    lines.append(s)
    print(s)


out('=' * 80)
out('CLIENTS MIGRATION DATA — Parsed from Notion Export')
out(f'Source: {os.path.basename(CSV_PATH)}')
out(f'Total CSV rows: {len(all_rows)}, Active+Onboarding: {len(active_rows)}')
out('=' * 80)
out()

# ── Section 1: New Clients ──
out('─' * 60)
out('1. NEW CLIENTS (not in existing DB)')
out('─' * 60)
if new_clients:
    for c in new_clients:
        out(f'  + {c["name"]} (status={c["status"]}, pod={c["pod"]})')
        if c['brand_voice_guide_url']:
            out(f'    brand_voice_guide_url: {c["brand_voice_guide_url"]}')
        if c['area_guide_url']:
            out(f'    area_guide_url: {c["area_guide_url"]}')
        if c['health']:
            out(f'    health: {c["health"]}')
        if c['approval_emails']:
            out(f'    approval_emails: {c["approval_emails"]}')
        if c['script_format']:
            out(f'    script_format: {c["script_format"]}')
else:
    out('  (none — all active/onboarding clients already exist)')
out()

# ── Section 2: Health Data ──
out('─' * 60)
out('2. HEALTH STATUS DATA')
out('─' * 60)
health_counts = defaultdict(int)
clients_with_health = []
clients_without_health = []
for d in update_data:
    if d['health']:
        health_counts[d['health']] += 1
        clients_with_health.append(d['name'])
    else:
        clients_without_health.append(d['name'])
out(f'  Clients with health set: {len(clients_with_health)}')
for h, cnt in sorted(health_counts.items()):
    out(f'    {h}: {cnt}')
out(f'  Clients WITHOUT health: {len(clients_without_health)}')
for n in clients_without_health:
    out(f'    - {n}')
out()

# ── Section 3: Brand Voice Guide URLs ──
out('─' * 60)
out('3. BRAND VOICE GUIDE URLs')
out('─' * 60)
bvg_count = sum(1 for d in update_data if d['brand_voice_guide_url'])
out(f'  Clients with BVG URL: {bvg_count} / {len(update_data)}')
for d in update_data:
    if d['brand_voice_guide_url']:
        out(f'    {d["name"]}: {d["brand_voice_guide_url"][:80]}')
out()

# ── Section 4: Area Guide URLs ──
out('─' * 60)
out('4. AREA GUIDE URLs')
out('─' * 60)
ag_count = sum(1 for d in update_data if d['area_guide_url'])
out(f'  Clients with Area Guide URL: {ag_count} / {len(update_data)}')
for d in update_data:
    if d['area_guide_url']:
        out(f'    {d["name"]}: {d["area_guide_url"][:80]}')
out()

# ── Section 5: Approval Emails ──
out('─' * 60)
out('5. APPROVAL EMAILS')
out('─' * 60)
ae_count = sum(1 for d in update_data if d['approval_emails'])
out(f'  Clients with approval emails: {ae_count} / {len(update_data)}')
for d in update_data:
    if d['approval_emails']:
        out(f'    {d["name"]}: {d["approval_emails"]}')
out()

# ── Section 6: Assignment Comparison ──
out('─' * 60)
out('6. ASSIGNMENTS FROM EXPORT (all active/onboarding)')
out('─' * 60)
role_counts = defaultdict(int)
for client, role, member in assignment_data:
    role_counts[role] += 1
out(f'  Total assignment rows: {len(assignment_data)}')
for role in ['strategist', 'manager', 'senior_editor', 'editor', 'designer']:
    out(f'    {role}: {role_counts[role]}')
out()

# Group by client
client_assignments = defaultdict(lambda: defaultdict(list))
for client, role, member in assignment_data:
    client_assignments[client][role].append(member)

for client in sorted(client_assignments.keys()):
    roles = client_assignments[client]
    out(f'  {client}:')
    for role in ['strategist', 'manager', 'senior_editor', 'editor', 'designer']:
        members = roles.get(role, [])
        if members:
            out(f'    {role}: {", ".join(members)}')
out()

# ── Section 7: Unique team member names referenced ──
out('─' * 60)
out('7. UNIQUE TEAM MEMBERS REFERENCED')
out('─' * 60)
all_members = set()
for _, _, member in assignment_data:
    all_members.add(member)
for m in sorted(all_members):
    out(f'  {m}')
out()


# ============================================================
# GENERATE SQL
# ============================================================

out('=' * 80)
out('SQL MIGRATION STATEMENTS')
out('=' * 80)
out()

# ── Part A: Schema changes (new enum + new columns) ──
out('-- ═══════════════════════════════════════════════════════════════')
out('-- Part A: Schema changes — add health enum type and new columns')
out('-- ═══════════════════════════════════════════════════════════════')
out()
out("DO $$ BEGIN")
out("  CREATE TYPE client_health AS ENUM ('on_track', 'at_risk', 'off_track');")
out("EXCEPTION WHEN duplicate_object THEN NULL;")
out("END $$;")
out()
out("ALTER TABLE clients ADD COLUMN IF NOT EXISTS brand_voice_guide_url TEXT;")
out("ALTER TABLE clients ADD COLUMN IF NOT EXISTS area_guide_url TEXT;")
out("ALTER TABLE clients ADD COLUMN IF NOT EXISTS health client_health;")
out("ALTER TABLE clients ADD COLUMN IF NOT EXISTS approval_emails TEXT;")
out()

# ── Part B: Insert new clients ──
out('-- ═══════════════════════════════════════════════════════════════')
out('-- Part B: Insert new clients')
out('-- ═══════════════════════════════════════════════════════════════')
out()
if new_clients:
    out('-- NOTE: clients.name has no UNIQUE constraint, so we use INSERT ... WHERE NOT EXISTS')
    for c in new_clients:
        name_sql = sql_str(c['name'])
        status_sql = sql_str(c['status'])
        pod_clause = f"(SELECT id FROM pods WHERE name = {sql_str(c['pod'])})" if c['pod'] else 'NULL'
        bvg = sql_val(c['brand_voice_guide_url'])
        ag = sql_val(c['area_guide_url'])
        health_sql = sql_str(c['health']) + '::client_health' if c['health'] else 'NULL'
        ae = sql_val(c['approval_emails'])
        sf = sql_str(c['script_format']) + '::script_format' if c['script_format'] else 'NULL'

        out(f"INSERT INTO clients (name, status, pod_id, brand_voice_guide_url, area_guide_url, health, approval_emails, script_format)")
        out(f"  SELECT {name_sql}, {status_sql}::client_status, {pod_clause}, {bvg}, {ag}, {health_sql}, {ae}, {sf}")
        out(f"  WHERE NOT EXISTS (SELECT 1 FROM clients WHERE name = {name_sql});")
        out()
else:
    out('-- No new clients to insert.')
    out()

# ── Part C: Update existing clients with new column data ──
out('-- ═══════════════════════════════════════════════════════════════')
out('-- Part C: Update existing clients with new column data')
out('--   brand_voice_guide_url, area_guide_url, health, approval_emails')
out('-- ═══════════════════════════════════════════════════════════════')
out()

updates_generated = 0
for d in update_data:
    set_clauses = []
    if d['brand_voice_guide_url']:
        set_clauses.append(f"brand_voice_guide_url = {sql_val(d['brand_voice_guide_url'])}")
    if d['area_guide_url']:
        set_clauses.append(f"area_guide_url = {sql_val(d['area_guide_url'])}")
    if d['health']:
        set_clauses.append(f"health = {sql_str(d['health'])}::client_health")
    if d['approval_emails']:
        set_clauses.append(f"approval_emails = {sql_val(d['approval_emails'])}")
    # Also update script_format if we have it and it may differ
    if d['script_format']:
        set_clauses.append(f"script_format = {sql_str(d['script_format'])}::script_format")

    if set_clauses:
        name_sql = sql_str(d['name'])
        out(f"UPDATE clients SET")
        out(f"  {', '.join(set_clauses)}")
        out(f"  WHERE name = {name_sql};")
        out()
        updates_generated += 1

if updates_generated == 0:
    out('-- No updates needed.')
out()

# ── Part D: Assignments — INSERT for new client only ──
out('-- ═══════════════════════════════════════════════════════════════')
out('-- Part D: Client assignments for NEW clients')
out('-- ═══════════════════════════════════════════════════════════════')
out()

new_client_names = {c['name'] for c in new_clients}
assignment_count = 0

for client, role, member in assignment_data:
    if client not in new_client_names:
        continue
    # Build team member lookup subquery
    # We match on first_name || ' ' || last_name or just first_name for single-name members
    if member in ('Mae', 'Amarú', 'Marina', 'Noor', 'Subhan'):
        member_subq = f"(SELECT id FROM team_members WHERE first_name = {sql_str(member)} AND (last_name IS NULL OR last_name = '') LIMIT 1)"
    else:
        parts = member.split(' ', 1)
        first = parts[0]
        last = parts[1] if len(parts) > 1 else ''
        if last:
            member_subq = f"(SELECT id FROM team_members WHERE first_name = {sql_str(first)} AND last_name = {sql_str(last)} LIMIT 1)"
        else:
            member_subq = f"(SELECT id FROM team_members WHERE first_name = {sql_str(first)} LIMIT 1)"

    client_subq = f"(SELECT id FROM clients WHERE name = {sql_str(client)})"

    out(f"INSERT INTO client_assignments (client_id, team_member_id, assignment_role)")
    out(f"  VALUES ({client_subq}, {member_subq}, '{role}'::assignment_role)")
    out(f"  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;")
    out()
    assignment_count += 1

if assignment_count == 0:
    out('-- No new assignments for new clients (or new clients have no assignments).')
out()

# ── Part E: Full assignment diff reference (not SQL, for manual review) ──
out('-- ═══════════════════════════════════════════════════════════════')
out('-- Part E: REFERENCE — Full assignment data from export')
out('--   Compare against existing DB assignments to find discrepancies')
out('--   This is NOT executed as SQL — review manually')
out('-- ═══════════════════════════════════════════════════════════════')
out()
out('-- Existing DB counts: strategist=73, manager=69, editor=49, senior_editor=61, designer=54')
out(f'-- Export counts:      strategist={role_counts["strategist"]}, manager={role_counts["manager"]}, editor={role_counts["editor"]}, senior_editor={role_counts["senior_editor"]}, designer={role_counts["designer"]}')
out()
out('-- Differences to investigate:')
out(f'--   strategist: DB=73 vs export={role_counts["strategist"]} (diff={role_counts["strategist"]-73})')
out(f'--   manager: DB=69 vs export={role_counts["manager"]} (diff={role_counts["manager"]-69})')
out(f'--   editor: DB=49 vs export={role_counts["editor"]} (diff={role_counts["editor"]-49})')
out(f'--   senior_editor: DB=61 vs export={role_counts["senior_editor"]} (diff={role_counts["senior_editor"]-61})')
out(f'--   designer: DB=54 vs export={role_counts["designer"]} (diff={role_counts["designer"]-54})')
out()

# ── Summary ──
out('=' * 80)
out('SUMMARY')
out('=' * 80)
out(f'New clients to insert:     {len(new_clients)}')
if new_clients:
    for c in new_clients:
        out(f'  + {c["name"]}')
out(f'Clients needing UPDATE:    {updates_generated}')
out(f'  - with brand_voice_guide_url: {sum(1 for d in update_data if d["brand_voice_guide_url"])}')
out(f'  - with area_guide_url:        {sum(1 for d in update_data if d["area_guide_url"])}')
out(f'  - with health:                {sum(1 for d in update_data if d["health"])}')
out(f'  - with approval_emails:       {sum(1 for d in update_data if d["approval_emails"])}')
out(f'  - with script_format:         {sum(1 for d in update_data if d["script_format"])}')
out(f'New client assignments:    {assignment_count}')
out(f'Total export assignments:  {len(assignment_data)}')
out(f'Schema changes needed:     client_health enum + 4 new columns on clients table')
out()
out('SQL is ready to be copied into a migration file.')
out('Review Part E assignment diff manually before creating assignment correction SQL.')

# Write to file
with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f'\nOutput written to: {OUTPUT_PATH}')
