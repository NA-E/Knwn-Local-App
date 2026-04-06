"""Review migration data from Notion export in table format."""
import csv
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Read both CSVs
with open('client database from notion/Clients DataBase (Main 2 0) 0805e95a25a34a66a1a46add5e449ecb.csv', 'r', encoding='utf-8-sig') as f:
    simple_rows = list(csv.DictReader(f))
with open('client database from notion/Clients DataBase (Main 2 0) 0805e95a25a34a66a1a46add5e449ecb_all.csv', 'r', encoding='utf-8-sig') as f:
    full_rows = list(csv.DictReader(f))

# Build full lookup
full_lookup = {}
for r in full_rows:
    name = r.get('Client Name', '').strip()
    status = r.get('Status', '').strip()
    if name:
        full_lookup[f'{name}|{status}'] = r
        if name not in full_lookup:
            full_lookup[name] = r

# Name normalization
name_normalize = {
    'Mae': 'Mae Ariate',
    'Anderson "Cirion" Ruan': 'Anderson Ruan',
    'Anderson "Cirion" Ruan ': 'Anderson Ruan',
}

def norm(n):
    n = n.strip().strip('"')
    return name_normalize.get(n, n)

def split_names(val):
    if not val:
        return []
    return [norm(n) for n in val.split(',') if n.strip() and n.strip() != '-']

# ====== BUILD CLIENTS ======
clients = []
seen_names = set()
for r in simple_rows:
    name = r.get('Client Name', '').strip()
    status = r.get('Status', '').strip()
    if not name or status not in ('Active', 'Onboarding'):
        continue
    if name in seen_names:
        continue
    seen_names.add(name)

    full = full_lookup.get(f'{name}|{status}') or full_lookup.get(name, {})

    pod_raw = r.get('POD', '').strip()
    pod_name = pod_raw.split(' (')[0].strip() if pod_raw else '-'

    cm = r.get('Communication Method', '').strip().lower()
    if 'slack' in cm:
        comm = 'slack'
    elif 'email' in cm:
        comm = 'email'
    elif 'asana' in cm:
        comm = 'other'
    else:
        comm = '-'

    sf = full.get('Script Format', '').strip()
    tz = full.get('Timezone', '').strip()
    csd = full.get('Contract Start Date', '').strip()
    yt = full.get('YouTube Channel', '').strip()
    slack_url = full.get('Slack URL', '').strip()
    dropbox = r.get('Dropbox Upload Link', '').strip()
    broll = full.get('B-roll folders', '').strip()
    vpw = r.get('Videos/week', '').strip() or '-'
    market = r.get('Market', '').strip() or '-'
    schedule = r.get('Posting Schedule', '').strip() or '-'
    pkg = r.get('Client Type (Offer)', '').strip() or '-'
    special = r.get('Special Instructions', '').strip()

    strat = ', '.join(split_names(r.get('Creative Strategist', ''))) or '-'
    mgr = ', '.join(split_names(r.get('Youtube Manager', ''))) or '-'
    editor = ', '.join(split_names(r.get('Editor(s)', ''))) or '-'
    se = ', '.join(split_names(full.get('Senior Editor', ''))) or '-'
    designer = ', '.join(split_names(r.get('Graphic Designer', ''))) or '-'
    approval = full.get('Approval Emails', '').strip() or '-'

    clients.append({
        'name': name,
        'status': status,
        'pod': pod_name,
        'market': market[:25],
        'vpw': vpw,
        'pkg': pkg[:20],
        'comm': comm,
        'schedule': schedule[:20],
        'tz': tz[:6] if tz else '-',
        'sf': sf[:15] if sf else '-',
        'csd': csd[:12] if csd else '-',
        'yt': 'Yes' if yt else '-',
        'slack': 'Yes' if slack_url else '-',
        'dropbox': 'Yes' if dropbox else '-',
        'broll': 'Yes' if broll else '-',
        'strategist': strat,
        'manager': mgr,
        'editor': editor,
        'senior_editor': se,
        'designer': designer,
        'approval': approval[:40] if approval != '-' else '-',
        'special': special[:30] if special else '-',
    })

# ====== TABLE 1: Client basics ======
print("=" * 140)
print("TABLE 1: CLIENT BASICS (80 clients)")
print("=" * 140)
print(f"{'#':<3} {'Name':<35} {'Status':<11} {'Pod':<6} {'Market':<25} {'V/wk':<5} {'Package':<20} {'Comm':<6}")
print("-" * 140)
for i, c in enumerate(clients, 1):
    print(f"{i:<3} {c['name']:<35} {c['status']:<11} {c['pod']:<6} {c['market']:<25} {c['vpw']:<5} {c['pkg']:<20} {c['comm']:<6}")

# ====== TABLE 2: Schedule + details ======
print()
print("=" * 130)
print("TABLE 2: SCHEDULE & DETAILS")
print("=" * 130)
print(f"{'#':<3} {'Name':<35} {'Schedule':<20} {'TZ':<6} {'Script Fmt':<15} {'Contract Start':<15} {'Special Instr':<30}")
print("-" * 130)
for i, c in enumerate(clients, 1):
    print(f"{i:<3} {c['name']:<35} {c['schedule']:<20} {c['tz']:<6} {c['sf']:<15} {c['csd']:<15} {c['special']:<30}")

# ====== TABLE 3: Links ======
print()
print("=" * 100)
print("TABLE 3: LINKS (Yes = has data)")
print("=" * 100)
print(f"{'#':<3} {'Name':<35} {'YouTube':<8} {'Slack':<6} {'Dropbox':<8} {'B-Roll':<7} {'Contacts':<40}")
print("-" * 100)
for i, c in enumerate(clients, 1):
    print(f"{i:<3} {c['name']:<35} {c['yt']:<8} {c['slack']:<6} {c['dropbox']:<8} {c['broll']:<7} {c['approval']:<40}")

# ====== TABLE 4: Team assignments ======
print()
print("=" * 160)
print("TABLE 4: TEAM ASSIGNMENTS")
print("=" * 160)
print(f"{'#':<3} {'Name':<30} {'Strategist':<20} {'Manager':<22} {'Sr. Editor':<18} {'Editor':<28} {'Designer':<18}")
print("-" * 160)
for i, c in enumerate(clients, 1):
    print(f"{i:<3} {c['name']:<30} {c['strategist']:<20} {c['manager']:<22} {c['senior_editor']:<18} {c['editor'][:27]:<28} {c['designer']:<18}")

# ====== TABLE 5: Team members ======
print()
print("=" * 80)
print("TABLE 5: TEAM MEMBERS TO CREATE (35)")
print("=" * 80)

team_members = {}
role_field_map = {
    'Creative Strategist': 'strategist',
    'Youtube Manager': 'manager',
    'Editor(s)': 'editor',
    'Graphic Designer': 'designer',
}

for r in simple_rows:
    status = r.get('Status', '').strip()
    if status not in ('Active', 'Onboarding'):
        continue
    for field, role in role_field_map.items():
        for name in split_names(r.get(field, '')):
            if name not in team_members:
                team_members[name] = set()
            team_members[name].add(role)
    cname = r.get('Client Name', '').strip()
    full = full_lookup.get(f'{cname}|{status}') or full_lookup.get(cname, {})
    for name in split_names(full.get('Senior Editor', '')):
        if name not in team_members:
            team_members[name] = set()
        team_members[name].add('senior_editor')

def get_team_role(assignment_roles):
    for ar in ['strategist', 'manager', 'senior_editor', 'designer', 'editor']:
        if ar in assignment_roles:
            return ar
    return 'editor'

print(f"{'#':<3} {'Name':<35} {'Team Role':<15} {'Assignment Roles':<40} {'Generated Email':<35}")
print("-" * 130)
for i, name in enumerate(sorted(team_members.keys()), 1):
    roles = team_members[name]
    tr = get_team_role(roles)
    email = name.lower().replace(' ', '.').replace('"', '').replace('(', '').replace(')', '') + '@knownlocal.com'
    print(f"{i:<3} {name:<35} {tr:<15} {', '.join(sorted(roles)):<40} {email:<35}")

# Summary
print()
print("=" * 60)
print("SUMMARY")
print("=" * 60)
active = sum(1 for c in clients if c['status'] == 'Active')
onboard = sum(1 for c in clients if c['status'] == 'Onboarding')
print(f"Active clients:     {active}")
print(f"Onboarding clients: {onboard}")
print(f"Total clients:      {len(clients)}")
print(f"Team members:       {len(team_members)}")
print(f"Pods needed:        Pod 1, Pod 2, Pod 3, Pod 4, ELLA")
print(f"Clients with YouTube:  {sum(1 for c in clients if c['yt'] == 'Yes')}")
print(f"Clients with Slack:    {sum(1 for c in clients if c['slack'] == 'Yes')}")
print(f"Clients with Dropbox:  {sum(1 for c in clients if c['dropbox'] == 'Yes')}")
print(f"Clients with contacts: {sum(1 for c in clients if c['approval'] != '-')}")
