"""Generate migration 009 SQL from Notion exports."""
import csv
import sys
import io
import re
from datetime import datetime

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# ============================================================
# READ ALL CSV DATA
# ============================================================

with open('client database from notion/Clients DataBase (Main 2 0) 0805e95a25a34a66a1a46add5e449ecb.csv', 'r', encoding='utf-8-sig') as f:
    client_simple = list(csv.DictReader(f))

with open('client database from notion/Clients DataBase (Main 2 0) 0805e95a25a34a66a1a46add5e449ecb_all.csv', 'r', encoding='utf-8-sig') as f:
    client_full = list(csv.DictReader(f))

with open('team members from notion/Team Members (Main 2 0) 3b6b2c63bde04e119d93ad0f24796bd7_all.csv', 'r', encoding='utf-8-sig') as f:
    team_rows = list(csv.DictReader(f))

# Build client full lookup by name+status
client_full_lookup = {}
for r in client_full:
    name = r.get('Client Name', '').strip()
    status = r.get('Status', '').strip()
    if name:
        client_full_lookup[f'{name}|{status}'] = r
        if name not in client_full_lookup:
            client_full_lookup[name] = r

def normalize_pod_name(p):
    """Normalize pod names: 'POD 1' -> 'Pod 1', keep 'ELLA' as-is."""
    if not p:
        return p
    if p.upper().startswith('POD '):
        return 'Pod ' + p.split()[-1]
    return p

# ============================================================
# TEAM MEMBER PROCESSING
# ============================================================

# Build team member lookup from Notion export
# Key: normalized full name -> {email, phone, role, pods, status, first, last}
notion_team = {}
for r in team_rows:
    short_name = r.get('Name', '').strip()
    profile = r.get('Profile', '').strip()
    full_name = profile if profile else short_name
    if not full_name or full_name == 'Member Template' or full_name == 'Original template designer':
        continue

    email = r.get('Email', '').strip()
    phone = r.get('Telefone', '').strip()
    role_raw = r.get('Role', '').strip()
    pod_raw = r.get('Pod', '').strip()
    pods = [normalize_pod_name(p.split(' (')[0].strip()) for p in pod_raw.split(',') if p.strip()] if pod_raw else []
    status = r.get('Status', '').strip()

    # Skip offboarded and contract paused
    if status in ('Offboarded', 'Contract Paused', 'Template'):
        # Still store for lookup in case they're referenced in client assignments
        pass

    notion_team[full_name] = {
        'short_name': short_name,
        'full_name': full_name,
        'email': email,
        'phone': phone,
        'role_raw': role_raw,
        'pods': pods,
        'status': status,
    }

# Name mapping: client CSV name -> Notion team profile name
# (handles inconsistencies between the two exports)
client_to_notion_name = {
    'Mae Ariate': 'Mae',  # Notion Profile is "Mae" not "Mae Ariate"
    'Anderson Ruan': 'Anderson "Cirion" Ruan',
    'Juan Audiovisual': 'Juan Bravo',  # Juan Bravo's short name in Notion
    'Amarú': 'Amarú',  # Notion profile is "Amarú"
    'Marina': 'Marina',
    'Noor': 'Noor',
    'Subhan khan': 'Subhan',  # Notion short name
    'Igor Marques': 'igor marques',
    'Clayton Mclemore': 'Clayton Mclemore',  # May not be in team members export
}

def find_notion_member(name):
    """Find a team member in Notion export by name."""
    # Direct match
    if name in notion_team:
        return notion_team[name]
    # Try mapped name
    mapped = client_to_notion_name.get(name)
    if mapped and mapped in notion_team:
        return notion_team[mapped]
    # Try matching by short_name or partial match
    for key, val in notion_team.items():
        if val['short_name'] == name or name in key or key in name:
            return val
    return None

# Map Notion roles to our team_role enum
def map_team_role(role_raw, assignment_roles):
    """Map Notion role string to our team_role enum."""
    role_lower = role_raw.lower() if role_raw else ''
    if 'pod leader' in role_lower:
        return 'strategist'
    if 'senior editor' in role_lower:
        return 'senior_editor'
    if 'senior writer' in role_lower:
        return 'senior_writer'
    if 'senior designer' in role_lower:
        return 'senior_designer'
    if 'youtube manager' in role_lower:
        return 'manager'
    if 'graphic designer' in role_lower:
        return 'designer'
    if 'video editor' in role_lower or 'long-form' in role_lower:
        return 'editor'
    if 'short-form' in role_lower:
        return 'editor'
    if 'ghostwriter' in role_lower:
        return 'writer'
    if 'email marketing' in role_lower or 'social media' in role_lower:
        return 'manager'  # Closest match for email/social roles
    if 'virtual assistant' in role_lower:
        return 'admin'
    # Fall back to assignment roles
    for ar in ['strategist', 'manager', 'senior_editor', 'designer', 'editor']:
        if ar in assignment_roles:
            return ar
    return 'editor'

# ============================================================
# CLIENT NAME NORMALIZATION
# ============================================================

name_normalize = {
    'Mae': 'Mae Ariate',
    'Anderson "Cirion" Ruan': 'Anderson Ruan',
    'Anderson "Cirion" Ruan ': 'Anderson Ruan',
    'igor marques': 'Igor Marques',
}

def norm(n):
    n = n.strip().strip('"')
    return name_normalize.get(n, n)

def split_names(val):
    if not val:
        return []
    return [norm(n) for n in val.split(',') if n.strip() and n.strip() != '-']

# ============================================================
# BUILD CLIENT LIST (Active + Onboarding only)
# ============================================================

clients = []
seen_names = set()
all_assigned_members = {}  # name -> set of assignment_roles

for r in client_simple:
    name = r.get('Client Name', '').strip()
    status = r.get('Status', '').strip()
    if not name or status not in ('Active', 'Onboarding'):
        continue
    if name in seen_names:
        continue
    seen_names.add(name)

    full = client_full_lookup.get(f'{name}|{status}') or client_full_lookup.get(name, {})

    pod_raw = r.get('POD', '').strip()
    pod_name = normalize_pod_name(pod_raw.split(' (')[0].strip()) if pod_raw else None

    cm = r.get('Communication Method', '').strip().lower()
    if 'slack' in cm:
        comm = 'slack'
    elif 'email' in cm:
        comm = 'email'
    elif cm:
        comm = 'other'
    else:
        comm = None

    sf = full.get('Script Format', '').strip().lower()
    if 'word' in sf:
        script_fmt = 'word_for_word'
    elif 'outline' in sf or 'bullet' in sf:
        script_fmt = 'outline'
    else:
        script_fmt = None

    # Collect assignment names
    strategists = split_names(r.get('Creative Strategist', ''))
    managers = split_names(r.get('Youtube Manager', ''))
    editors = split_names(r.get('Editor(s)', ''))
    senior_editors = split_names(full.get('Senior Editor', ''))
    designers = split_names(r.get('Graphic Designer', ''))

    # Track all members
    for n in strategists:
        all_assigned_members.setdefault(n, set()).add('strategist')
    for n in managers:
        all_assigned_members.setdefault(n, set()).add('manager')
    for n in editors:
        all_assigned_members.setdefault(n, set()).add('editor')
    for n in senior_editors:
        all_assigned_members.setdefault(n, set()).add('senior_editor')
    for n in designers:
        all_assigned_members.setdefault(n, set()).add('designer')

    clients.append({
        'name': name,
        'status': status.lower(),
        'pod': pod_name,
        'market': r.get('Market', '').strip() or None,
        'timezone': full.get('Timezone', '').strip() or None,
        'website': full.get('Website', '').strip() or None,
        'youtube_channel_url': full.get('YouTube Channel', '').strip() or None,
        'dropbox_upload_url': r.get('Dropbox Upload Link', '').strip() or None,
        'broll_library_url': full.get('B-roll folders', '').strip() or None,
        'slack_channel_url': full.get('Slack URL', '').strip() or None,
        'package': r.get('Client Type (Offer)', '').strip() or None,
        'contract_start_date': full.get('Contract Start Date', '').strip() or None,
        'posting_schedule': r.get('Posting Schedule', '').strip() or None,
        'script_format': script_fmt,
        'communication_method': comm,
        'special_instructions': r.get('Special Instructions', '').strip() or None,
        'videos_per_week': r.get('Videos/week', '').strip() or None,
        'strategists': strategists,
        'managers': managers,
        'editors': editors,
        'senior_editors': senior_editors,
        'designers': designers,
        'approval_emails': full.get('Approval Emails', '').strip() or None,
    })

# ============================================================
# BUILD TEAM MEMBER INSERT LIST
# ============================================================

# For each assigned member, find their Notion data
team_to_insert = []
email_tracker = set()

for member_name, assignment_roles in sorted(all_assigned_members.items()):
    notion = find_notion_member(member_name)

    if notion:
        full_name = notion['full_name']
        email = notion['email']
        phone = notion['phone']
        role = map_team_role(notion['role_raw'], assignment_roles)
        pods = notion['pods']
        notion_status = notion['status']
    else:
        full_name = member_name
        email = ''
        phone = ''
        role = None
        pods = []
        notion_status = 'Unknown'

    # Determine team_role
    if role is None:
        for ar in ['strategist', 'manager', 'senior_editor', 'designer', 'editor']:
            if ar in assignment_roles:
                role = ar
                break
        if role is None:
            role = 'editor'

    # Split name — strip stray quotes from nicknames like "Cirion"
    clean_name = full_name.strip().replace('"', '')
    parts = clean_name.split()
    first_name = parts[0].capitalize() if parts else member_name.capitalize()
    last_name = ' '.join(p.capitalize() for p in parts[1:]) if len(parts) > 1 else ''

    # Generate email if missing
    if not email:
        safe_name = full_name.lower().replace(' ', '.').replace('"', '').replace("'", '')
        # ASCII-safe
        safe_name = safe_name.replace('á', 'a').replace('é', 'e').replace('í', 'i')
        safe_name = safe_name.replace('ó', 'o').replace('ú', 'u').replace('ã', 'a')
        safe_name = safe_name.replace('ç', 'c').replace('ñ', 'n').replace('ü', 'u')
        safe_name = safe_name.replace('ë', 'e').replace('è', 'e')
        email = f'{safe_name}@knownlocal.com'

    # Avoid duplicate emails
    if email in email_tracker:
        email = email.replace('@', f'.2@')
    email_tracker.add(email)

    team_to_insert.append({
        'lookup_name': member_name,  # Name used in client CSV for assignment lookups
        'first_name': first_name,
        'last_name': last_name,
        'email': email,
        'phone': phone,
        'role': role,
        'pods': pods,
        'notion_status': notion_status,
        'assignment_roles': assignment_roles,
    })

# ============================================================
# SQL HELPERS
# ============================================================

def esc(s):
    if s is None:
        return 'NULL'
    s = str(s).replace("'", "''").replace('\n', ' ').replace('\r', '')
    return f"'{s}'"

def parse_date(s):
    if not s:
        return 'NULL'
    s = s.strip()
    for fmt in ['%B %d, %Y', '%m/%d/%Y', '%Y-%m-%d', '%b %d, %Y']:
        try:
            d = datetime.strptime(s, fmt)
            return f"'{d.strftime('%Y-%m-%d')}'"
        except ValueError:
            continue
    return 'NULL'

# ============================================================
# GENERATE SQL
# ============================================================

sql = []
sql.append('-- Migration 009: Real client + team data from Notion export')
sql.append('-- Generated from Clients DataBase + Team Members CSVs')
sql.append(f'-- {len(clients)} clients (Active + Onboarding), {len(team_to_insert)} team members')
sql.append(f'-- Generated: {datetime.now().strftime("%Y-%m-%d %H:%M")}')
sql.append('')
sql.append('-- NOTE: No BEGIN/COMMIT — supabase db push wraps each migration in its own transaction')
sql.append('')

# Step 1: Clean ALL existing data (fresh load)
sql.append('-- ============================================================')
sql.append('-- Step 1: Clean ALL existing data (fresh load)')
sql.append('--   Removes test/seed data + any manually created records')
sql.append('--   Keeps admin@knownlocal.com team member')
sql.append('-- ============================================================')
sql.append('')
sql.append("-- Remove all dependent data first (respect FK constraints)")
sql.append("DELETE FROM project_status_history;")
sql.append("DELETE FROM projects;")
sql.append("DELETE FROM onboarding_steps;")
sql.append("DELETE FROM client_assignments;")
sql.append("DELETE FROM client_channels;")
sql.append("DELETE FROM client_contacts;")
sql.append("DELETE FROM clients;")
sql.append('')
sql.append("-- Remove all non-admin team members and their pod assignments")
sql.append("DELETE FROM team_member_pods WHERE team_member_id IN (SELECT id FROM team_members WHERE email != 'admin@knownlocal.com');")
sql.append("DELETE FROM team_members WHERE email != 'admin@knownlocal.com';")
sql.append('')

# Step 2: Add ELLA pod
sql.append('-- ============================================================')
sql.append('-- Step 2: Ensure all pods exist (add ELLA)')
sql.append('-- ============================================================')
sql.append('')
for pod in ['Pod 1', 'Pod 2', 'Pod 3', 'Pod 4', 'ELLA']:
    sql.append(f"INSERT INTO pods (name) VALUES ({esc(pod)}) ON CONFLICT (name) DO NOTHING;")
sql.append('')

# Step 3: Insert team members
sql.append('-- ============================================================')
sql.append(f'-- Step 3: Insert {len(team_to_insert)} team members')
sql.append('-- ============================================================')
sql.append('')
for tm in team_to_insert:
    sql.append(f"INSERT INTO team_members (first_name, last_name, email, role, status)")
    sql.append(f"  VALUES ({esc(tm['first_name'])}, {esc(tm['last_name'])}, {esc(tm['email'])}, {esc(tm['role'])}, 'active')")
    sql.append(f"  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;")

sql.append('')

# Step 3b: Team member pod assignments
sql.append('-- ============================================================')
sql.append('-- Step 3b: Team member pod assignments')
sql.append('-- ============================================================')
sql.append('')
for tm in team_to_insert:
    for i, pod in enumerate(tm['pods']):
        is_primary = 'true' if i == 0 else 'false'
        sql.append(f"INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)")
        sql.append(f"  VALUES ((SELECT id FROM team_members WHERE email = {esc(tm['email'])}), (SELECT id FROM pods WHERE name = {esc(pod)}), {is_primary})")
        sql.append(f"  ON CONFLICT (team_member_id, pod_id) DO NOTHING;")

sql.append('')

# Step 4: Insert clients
sql.append('-- ============================================================')
sql.append(f'-- Step 4: Insert {len(clients)} clients')
sql.append('-- ============================================================')
sql.append('')
for c in clients:
    pod_ref = f"(SELECT id FROM pods WHERE name = {esc(c['pod'])})" if c['pod'] else 'NULL'
    date_val = parse_date(c['contract_start_date'])
    sf = f"'{c['script_format']}'" if c['script_format'] else 'NULL'
    cm = f"'{c['communication_method']}'" if c['communication_method'] else 'NULL'

    sql.append(f"INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)")
    sql.append(f"  VALUES ({esc(c['name'])}, '{c['status']}', {pod_ref}, {esc(c['market'])}, {esc(c['timezone'])}, {esc(c['website'])}, {esc(c['youtube_channel_url'])}, {esc(c['dropbox_upload_url'])}, {esc(c['broll_library_url'])}, {esc(c['slack_channel_url'])}, {esc(c['package'])}, {date_val}, {esc(c['posting_schedule'])}, {sf}, {cm}, {esc(c['special_instructions'])});")

sql.append('')

# Step 5: Client channels (one per client that has videos_per_week)
sql.append('-- ============================================================')
sql.append('-- Step 5: Insert client channels')
sql.append('-- ============================================================')
sql.append('')
for c in clients:
    vpw = c['videos_per_week']
    if not vpw:
        continue
    try:
        vpw_num = float(vpw)
    except ValueError:
        vpw_num = 1
    yt_url = c['youtube_channel_url']
    sql.append(f"INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)")
    sql.append(f"  VALUES ((SELECT id FROM clients WHERE name = {esc(c['name'])}), {esc(c['name'])}, {esc(yt_url)}, {vpw_num});")

sql.append('')

# Step 6: Client contacts (from approval emails)
sql.append('-- ============================================================')
sql.append('-- Step 6: Insert client contacts (from approval emails)')
sql.append('-- ============================================================')
sql.append('')
for c in clients:
    ae = c['approval_emails']
    if not ae:
        continue
    # Parse emails - split by comma, semicolon, or space
    emails = re.split(r'[,;\s]+', ae)
    emails = [e.strip() for e in emails if '@' in e]
    for i, email in enumerate(emails):
        is_primary = 'true' if i == 0 else 'false'
        sql.append(f"INSERT INTO client_contacts (client_id, email, is_primary)")
        sql.append(f"  VALUES ((SELECT id FROM clients WHERE name = {esc(c['name'])}), {esc(email)}, {is_primary});")

sql.append('')

# Step 7: Client assignments
sql.append('-- ============================================================')
sql.append('-- Step 7: Insert client assignments')
sql.append('-- ============================================================')
sql.append('')

# Build a lookup from assignment name -> email for team members
assignment_email_lookup = {}
for tm in team_to_insert:
    assignment_email_lookup[tm['lookup_name']] = tm['email']

for c in clients:
    role_map = {
        'strategist': c['strategists'],
        'manager': c['managers'],
        'editor': c['editors'],
        'senior_editor': c['senior_editors'],
        'designer': c['designers'],
    }
    for role, names in role_map.items():
        for name in names:
            email = assignment_email_lookup.get(name)
            if not email:
                print(f"WARNING: No email found for team member '{name}' (client: {c['name']}, role: {role})")
                continue
            sql.append(f"INSERT INTO client_assignments (client_id, team_member_id, assignment_role)")
            sql.append(f"  VALUES ((SELECT id FROM clients WHERE name = {esc(c['name'])}), (SELECT id FROM team_members WHERE email = {esc(email)}), '{role}')")
            sql.append(f"  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;")

sql.append('')
sql.append('-- Transaction managed by supabase db push')

# Write to file
output = '\n'.join(sql)
with open('supabase/migrations/009_notion_client_data.sql', 'w', encoding='utf-8') as f:
    f.write(output)

# ============================================================
# PRINT SUMMARY
# ============================================================
print(f'Migration written: supabase/migrations/009_notion_client_data.sql')
print(f'SQL lines: {len(sql)}')
print()
print(f'=== TEAM MEMBERS ({len(team_to_insert)}) ===')
print(f'{"#":<3} {"Name":<30} {"Email":<40} {"Role":<15} {"Pods":<20} {"Source"}')
print('-' * 130)
for i, tm in enumerate(team_to_insert, 1):
    source = 'Notion' if not tm['email'].endswith('@knownlocal.com') else 'Generated'
    print(f'{i:<3} {tm["lookup_name"]:<30} {tm["email"]:<40} {tm["role"]:<15} {", ".join(tm["pods"]):<20} {source}')

print()
print(f'Clients: {len(clients)}')
total_assignments = sum(len(c['strategists']) + len(c['managers']) + len(c['editors']) + len(c['senior_editors']) + len(c['designers']) for c in clients)
print(f'Total assignments: {total_assignments}')
contacts_count = sum(1 for c in clients if c['approval_emails'])
print(f'Clients with contacts: {contacts_count}')
channels_count = sum(1 for c in clients if c['videos_per_week'])
print(f'Client channels: {channels_count}')
