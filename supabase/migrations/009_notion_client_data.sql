-- Migration 009: Real client + team data from Notion export
-- Generated from Clients DataBase + Team Members CSVs
-- 80 clients (Active + Onboarding), 35 team members
-- Generated: 2026-04-04 02:34

-- NOTE: No BEGIN/COMMIT — supabase db push wraps each migration in its own transaction

-- ============================================================
-- Step 1: Clean ALL existing data (fresh load)
--   Removes test/seed data + any manually created records
--   Keeps admin@knownlocal.com team member
-- ============================================================

-- Remove all dependent data first (respect FK constraints)
DELETE FROM project_status_history;
DELETE FROM projects;
DELETE FROM onboarding_steps;
DELETE FROM client_assignments;
DELETE FROM client_channels;
DELETE FROM client_contacts;
DELETE FROM clients;

-- Remove all non-admin team members and their pod assignments
DELETE FROM team_member_pods WHERE team_member_id IN (SELECT id FROM team_members WHERE email != 'admin@knownlocal.com');
DELETE FROM team_members WHERE email != 'admin@knownlocal.com';

-- ============================================================
-- Step 2: Ensure all pods exist (add ELLA)
-- ============================================================

INSERT INTO pods (name) VALUES ('Pod 1') ON CONFLICT (name) DO NOTHING;
INSERT INTO pods (name) VALUES ('Pod 2') ON CONFLICT (name) DO NOTHING;
INSERT INTO pods (name) VALUES ('Pod 3') ON CONFLICT (name) DO NOTHING;
INSERT INTO pods (name) VALUES ('Pod 4') ON CONFLICT (name) DO NOTHING;
INSERT INTO pods (name) VALUES ('ELLA') ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- Step 3: Insert 35 team members
-- ============================================================

INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Alejandro', 'Manrique', 'alemanrique8@gmail.com', 'manager', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Alejandro', 'Ramos', 'alejandroramoscorral@gmail.com', 'senior_editor', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Alex', 'Silva', 'alexwillsilva@gmail.com', 'editor', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Amarú', '', 'amarumon1998@gmail.com', 'editor', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Anderson', 'Cirion Ruan', 'anderson.cirion.ruan@knownlocal.com', 'editor', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Andrea', 'Carolina Osio Amaya', 'andreaosioamaya@gmail.com', 'editor', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Austin', 'Marks', 'austin.marks@knownlocal.com', 'strategist', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Blythe', 'Miller', 'blythe.miller@knownlocal.com', 'strategist', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Bruno', 'Ferreira', 'bruno.ferreira@knownlocal.com', 'designer', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Clayton', 'Mclemore', 'clayton.mclemore@knownlocal.com', 'strategist', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Diego', 'Oliveira', 'goedi_prod@hotmail.com', 'senior_editor', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Erivelton', 'Schmidt', 'erivelton.schmidt@knownlocal.com', 'editor', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Evellyn', 'Albuquerque', 'evellyn-albuquerque@hotmail.com', 'manager', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Gabriel', 'Borba Lopes', 'gabriel.borba.lopes@knownlocal.com', 'editor', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Igor', 'Marques', 'igor.marques@knownlocal.com', 'designer', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Joe', 'Porter', 'joe.porter@knownlocal.com', 'strategist', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Jorge', 'Perez', 'japc1994@gmail.com', 'editor', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('João', 'Leal Junior', 'joaolealjunior21@gmail.com', 'designer', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Juan', 'Bravo', 'juanf.audiovisual@gmail.com', 'manager', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Juliana', 'Antonello', 'juliana.antonello@gmail.com', 'editor', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Kadu', 'Zargalio', 'zargalio87@gmail.com', 'manager', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Késsia', 'Andrade', 'akessiaandrade@gmail.com', 'editor', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Luisa', 'Pinto', 'luisafernanda9608@gmail.com', 'editor', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Mae', '', 'collaborate.withmae@gmail.com', 'manager', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Manuela', 'Arias', 'manuela.ariasc1@hotmail.com', 'manager', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Marina', '', 'marina@knownlocal.com', 'editor', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Mateus', 'Silva', 'mateus.silva@knownlocal.com', 'editor', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Nelson', 'Filho', 'nelsonjkf@gmail.com', 'editor', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Noah', 'Halloran', 'noah@knwnlocal.com', 'strategist', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Noor', '', 'noor@knownlocal.com', 'designer', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Rafael', 'Borin', 'enodolectus@gmail.com', 'editor', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Sabrina', 'Gües', 'sabriigues@gmail.com', 'editor', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Subhan', '', 'subhan@knownlocal.com', 'designer', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Vitor', 'Aguilar', 'vitoraguilarbras@gmail.com', 'manager', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('William', 'Zheng Xie', 'william@vvsnet.us', 'editor', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;

-- ============================================================
-- Step 3b: Team member pod assignments
-- ============================================================

INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'alemanrique8@gmail.com'), (SELECT id FROM pods WHERE name = 'Pod 2'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'alejandroramoscorral@gmail.com'), (SELECT id FROM pods WHERE name = 'Pod 1'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'alexwillsilva@gmail.com'), (SELECT id FROM pods WHERE name = 'Pod 1'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'amarumon1998@gmail.com'), (SELECT id FROM pods WHERE name = 'Pod 2'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'anderson.cirion.ruan@knownlocal.com'), (SELECT id FROM pods WHERE name = 'Pod 1'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'andreaosioamaya@gmail.com'), (SELECT id FROM pods WHERE name = 'Pod 2'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'austin.marks@knownlocal.com'), (SELECT id FROM pods WHERE name = 'Pod 4'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'), (SELECT id FROM pods WHERE name = 'Pod 1'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'bruno.ferreira@knownlocal.com'), (SELECT id FROM pods WHERE name = 'Pod 1'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), (SELECT id FROM pods WHERE name = 'Pod 1'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'erivelton.schmidt@knownlocal.com'), (SELECT id FROM pods WHERE name = 'Pod 1'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'evellyn-albuquerque@hotmail.com'), (SELECT id FROM pods WHERE name = 'Pod 1'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'gabriel.borba.lopes@knownlocal.com'), (SELECT id FROM pods WHERE name = 'Pod 1'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'igor.marques@knownlocal.com'), (SELECT id FROM pods WHERE name = 'Pod 4'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'joe.porter@knownlocal.com'), (SELECT id FROM pods WHERE name = 'Pod 3'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'japc1994@gmail.com'), (SELECT id FROM pods WHERE name = 'Pod 2'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'joaolealjunior21@gmail.com'), (SELECT id FROM pods WHERE name = 'Pod 2'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'juanf.audiovisual@gmail.com'), (SELECT id FROM pods WHERE name = 'Pod 1'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'juliana.antonello@gmail.com'), (SELECT id FROM pods WHERE name = 'Pod 2'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'zargalio87@gmail.com'), (SELECT id FROM pods WHERE name = 'Pod 2'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'akessiaandrade@gmail.com'), (SELECT id FROM pods WHERE name = 'Pod 2'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'luisafernanda9608@gmail.com'), (SELECT id FROM pods WHERE name = 'Pod 2'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'collaborate.withmae@gmail.com'), (SELECT id FROM pods WHERE name = 'Pod 3'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'mateus.silva@knownlocal.com'), (SELECT id FROM pods WHERE name = 'Pod 1'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'nelsonjkf@gmail.com'), (SELECT id FROM pods WHERE name = 'Pod 1'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'), (SELECT id FROM pods WHERE name = 'Pod 2'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'noor@knownlocal.com'), (SELECT id FROM pods WHERE name = 'Pod 2'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'noor@knownlocal.com'), (SELECT id FROM pods WHERE name = 'Pod 4'), false)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'noor@knownlocal.com'), (SELECT id FROM pods WHERE name = 'Pod 1'), false)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'enodolectus@gmail.com'), (SELECT id FROM pods WHERE name = 'Pod 1'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'sabriigues@gmail.com'), (SELECT id FROM pods WHERE name = 'Pod 2'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'subhan@knownlocal.com'), (SELECT id FROM pods WHERE name = 'Pod 3'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'vitoraguilarbras@gmail.com'), (SELECT id FROM pods WHERE name = 'Pod 1'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'william@vvsnet.us'), (SELECT id FROM pods WHERE name = 'Pod 2'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;

-- ============================================================
-- Step 4: Insert 80 clients
-- ============================================================

INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Austin Klar', 'active', (SELECT id FROM pods WHERE name = 'Pod 1'), 'San Francisco', 'PST', NULL, 'https://www.youtube.com/@austinklar', 'https://www.dropbox.com/request/Cb0ZIwgyfNdh6QdUjwmI', NULL, 'https://aimpactmedia.slack.com/archives/C06AQ5E1QRY', 'YouTube', '2023-12-13', 'Thursday 8pm EST', 'outline', 'slack', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Brandon Blankenship', 'active', (SELECT id FROM pods WHERE name = 'Pod 1'), 'Chicago Suburbs (Western)', 'CST', NULL, 'https://www.youtube.com/@LivingChicagoSuburbs', 'https://www.dropbox.com/request/srtWXGe0Vzdb0Cd0k3hP', NULL, 'https://aimpactmedia.slack.com/archives/C080N9DEBNH', 'YouTube', '2024-11-06', 'Tuesday 8 PM EST', 'word_for_word', 'slack', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Breaking and Building Leaders', 'active', NULL, NULL, NULL, NULL, NULL, 'https://www.dropbox.com/request/Ki78NnRaXPTe7gTYLvzB', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Brette Davis', 'active', (SELECT id FROM pods WHERE name = 'Pod 1'), 'Raleigh, Research Triangle (Durham, Chapel Hill)', 'EST', 'https://davisandmain.com', 'https://www.youtube.com/@livinginraleighnc', 'https://www.dropbox.com/request/TV5vyTwuqC4bFBL5BlVG', 'https://drive.google.com/drive/folders/1YgkihH9nzQZwQVDge091s3YW7J3N1OrN?usp=sharing', 'https://aimpactmedia.slack.com/archives/C08585T991P', 'YouTube', '2024-11-26', 'Thursday 8 PM EST', 'word_for_word', 'slack', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Charles Cherney', 'active', (SELECT id FROM pods WHERE name = 'Pod 1'), 'Cambridge, Massachusetts', 'EST', NULL, 'https://www.youtube.com/@CharlesCherney', 'https://www.dropbox.com/request/pxySo85LECb0umSKbZJ3', NULL, NULL, 'YouTube', NULL, 'Wednesday 4PM EST', NULL, 'email', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Chris Colgan', 'active', (SELECT id FROM pods WHERE name = 'Pod 1'), 'Northern Virginia', 'EST', NULL, 'https://www.youtube.com/@ChrisColgan', 'https://www.dropbox.com/request/4KHyQqijuHcHBmSGvL4B', 'Area B roll - https://www.dropbox.com/scl/fo/h2qtpf5kf5ufvvaf3co89/h?rlkey=9czneepnpapwpf58201jtgcnf&st=bn3qp1z4&dl=0  Here is my whole folder with all the drone footage. Everywhere i mention in this video i have drone - https://www.dropbox.com/scl/fo/wdjm49nhdw6y6dg7zhl2x/h?rlkey=duq82tike29uupav9xfkq2x9c&st=0yr2ora2&dl=0', 'https://aimpactmedia.slack.com/archives/C084LC80ZCL', 'YouTube x Email x Social', '2024-12-09', 'Saturday 1pm eST', 'outline', 'slack', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('David Hargreaves', 'active', (SELECT id FROM pods WHERE name = 'Pod 1'), 'Sonoma County', 'PST', NULL, 'https://www.youtube.com/@bruingtonhargreaves', 'https://www.dropbox.com/request/LJeHDCDDbVJ6D1mxdFC1', NULL, NULL, 'YouTube', '2022-08-06', 'Thursday 8 PM EST', 'word_for_word', 'email', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Joe Biscaha', 'active', (SELECT id FROM pods WHERE name = 'Pod 1'), 'Miami', 'EST', NULL, 'https://www.youtube.com/@JoeSellsMiami', 'https://www.dropbox.com/request/MyDeDwbYFEehBdkoBmZL', NULL, 'https://aimpactmedia.slack.com/archives/C07SN2VK6KS', 'YouTube', '2024-10-11', 'Saturday 1PM EST', 'outline', 'slack', 'Please use this in every CTA for Joe (it’s a free home valuation) https://get.homebot.ai/?id=edb4721e-a245-46a9-b365-759f15d18799');
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Kyle Talbot', 'active', (SELECT id FROM pods WHERE name = 'Pod 4'), 'Kansas City', 'CST', 'www.movingtokc.net', 'https://www.youtube.com/@movingtokc', 'https://www.dropbox.com/request/g9cSFCl7ZHMKuFiKiNM6', 'https://drive.google.com/drive/folders/1i8peSWZscA4SSOm6W1LPmGnasTJTz6xp?usp=sharing', 'https://aimpactmedia.slack.com/archives/C080D06PG1L', 'YouTube', '2025-02-25', 'Friday 4 PM EST', 'outline', 'slack', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Maynard Wagner', 'active', (SELECT id FROM pods WHERE name = 'Pod 1'), 'Seattle Living', 'PT', 'mwagnerhomes.com', 'https://www.youtube.com/@seattlelivingandwealthbuilding', 'https://www.dropbox.com/request/gZN6ikDvnpMgEFRrVaQX', NULL, 'https://aimpactmedia.slack.com/archives/C06KFMANRUH', 'YouTube x Email x Social', NULL, 'Thursday 8PM EST', 'word_for_word', 'slack', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Matt Oneill', 'active', (SELECT id FROM pods WHERE name = 'Pod 3'), 'Charleston, SC', 'EST', 'https://www.mattoneillrealestate.com/property-search/results/', 'https://www.youtube.com/@MattONeillRealEstate', 'https://www.dropbox.com/request/sUfleFuyTNIUtSDCoIAu', NULL, 'https://aimpactmedia.slack.com/archives/C08QKPNJADV', 'YouTube', '2025-05-08', 'Saturday 12 PM EST', 'word_for_word', 'slack', 'LEAD MAGNET: To get in touch use the QR code on the screen (tying to the topic).');
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Oyler Hines', 'active', (SELECT id FROM pods WHERE name = 'Pod 1'), 'Cincinnati, OH', 'EST', 'oylerhines.com', 'https://www.youtube.com/@oylerhines', 'https://www.dropbox.com/request/KACm019Fbd2R64eKAZau', NULL, NULL, 'YouTube', '2023-12-23', 'Thursday 5 PM EST', 'word_for_word', 'email', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Raziel Ungar', 'active', (SELECT id FROM pods WHERE name = 'Pod 1'), 'San Mateo County CA', 'PT', NULL, 'https://www.youtube.com/@livinginsanmateocountyca', 'https://www.dropbox.com/request/LVGJ0ET11H7Nhdg9bY1M', NULL, NULL, 'YouTube x Email', '2024-07-11', 'Monday 8pm EST', 'word_for_word', 'email', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Wilson Leung', 'active', (SELECT id FROM pods WHERE name = 'Pod 1'), 'Bay Area, SF', 'PT', 'theownteam.com', 'https://www.youtube.com/@bayareawilson', 'https://www.dropbox.com/request/2jLoscwHnGcuvdrzZVcC', NULL, NULL, 'YouTube', '2024-11-20', 'Friday 8 PM EST', 'word_for_word', 'email', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Matt Lunden', 'active', (SELECT id FROM pods WHERE name = 'Pod 1'), 'Coastal Delaware', 'EST', NULL, 'https://www.youtube.com/@LivingInCoastalDelaware', 'https://www.dropbox.com/request/TbBdNiTrI0M092Cs3fvE', NULL, 'https://aimpactmedia.slack.com/archives/C0827H4MY92', 'YouTube', '2024-11-24', 'Sunday 1 PM EST / Monday 4 PM EST', 'word_for_word', 'slack', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Bern McGovern', 'active', (SELECT id FROM pods WHERE name = 'Pod 2'), 'San Diego, CA', 'PT', 'https://www.LivinginSanDiego.com/', 'https://www.youtube.com/channel/UCiDiYzzKoTi10fPWuPCRAbg/', 'https://www.dropbox.com/request/yvyYJUSpKpq5OwL2w139', 'https://drive.google.com/drive/folders/1Luwbm1DHLNkN4gqaUq1xAgd_-3avC86phttps://drive.google.com/drive/folders/1-L3NJFyRc-WI4TacGrSdMsecWGrYNR46 https://www.dropbox.com/work/Knwn%20Local%20Team/01_CLIENTS/Bern%20McGovern/02_B-ROLL?di=left_nav_browse', 'https://aimpactmedia.slack.com/archives/C08LYHTV150', 'YouTube x2', '2025-04-02', 'Sunday 2PM | Wednesday 5PM (The San Diego Scoop)', 'word_for_word', 'slack', 'Separate each paragraph into 1-2 sentences for the scripts. This helps bern when reading from teleprompter.');
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Isayas Theodros', 'active', (SELECT id FROM pods WHERE name = 'Pod 2'), 'Long Beach, Coastal LA', 'PT', 'https://www.theodrosteam.com/', 'https://www.youtube.com/@theodrosteam', 'https://www.dropbox.com/request/6824kSBd0wXnMH7Czq51', NULL, 'https://aimpactmedia.slack.com/archives/C08NE9S7N1G', 'YouTube x Social', '2025-04-09', 'Friday 8PM', 'word_for_word', NULL, NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('John Sintich', 'active', (SELECT id FROM pods WHERE name = 'Pod 2'), 'South Chicago Suburbs', 'CST', NULL, 'https://www.youtube.com/channel/UCMl6wQBbJ1GztMjkKPqS0IQ/', 'https://www.dropbox.com/request/fleHszhdBu2NGRwzvvjO', 'https://drive.google.com/drive/folders/1shQ5xZqw2vGfy3WqGapjNucrTEJJoZqn?usp=sharing', 'https://aimpactmedia.slack.com/archives/C08H2A3MZP0', 'YouTube', '2026-03-19', 'Friday 5PM or Sunday 5PM', 'word_for_word', NULL, NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Michael McCall', 'active', (SELECT id FROM pods WHERE name = 'Pod 3'), 'San Antonio, TX', 'CST', 'lifeinsanantoniotexas.com', 'https://www.youtube.com/@LifeinSATX', 'https://www.dropbox.com/request/vhxhls897CtUN4Wsq6VU', NULL, 'https://aimpactmedia.slack.com/archives/C08MN7779K4', 'YouTube', '2025-04-11', 'Sunday 3 PM EST', 'word_for_word', 'slack', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Ryan Butler', 'active', (SELECT id FROM pods WHERE name = 'Pod 2'), 'Washington DC', 'EST', 'https://www.coalitionpg.com/agent-profile/-13842525', 'https://www.youtube.com/channel/UCCAYootEw0GKr_LVtOEIhng/', 'https://www.dropbox.com/request/HgMi2MvQVxnZVXGnkZxR', 'https://www.dropbox.com/work/Knwn%20Local%20Team/01_CLIENTS/Ryan%20Butler/02_B-ROLL?di=left_nav_browse', 'https://aimpactmedia.slack.com/archives/C08BAEEBLDD', 'YouTube x Email', '2025-02-02', 'Friday 9PM', 'word_for_word', 'slack', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Scott Moe', 'active', (SELECT id FROM pods WHERE name = 'Pod 1'), 'British Columbia, Canada', 'PST', 'https://www.moeteam.ca', 'https://www.youtube.com/@moerealestateteam/videos', 'https://www.dropbox.com/request/7vdpqm8y0nrmcV2caKNQ', NULL, 'https://aimpactmedia.slack.com/archives/C08TYKGK63B', 'YouTube', '2023-04-08', 'Friday 8 PM EST', 'word_for_word', 'slack', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Stephanie Cole Patterson', 'active', (SELECT id FROM pods WHERE name = 'Pod 2'), 'Alpharetta, Milton, Forsyth County, Roswell, Johns Creek', 'EDT', 'https://www.coleteamrealestate.com/', 'https://www.youtube.com/@LivingintheAtlantaSuburbs/videos', 'https://www.dropbox.com/request/OQQ9JF0sl5Pptzz3CSqE', NULL, 'https://aimpactmedia.slack.com/archives/C0813N5PE9M', 'YouTube x Email x Social', '2024-11-11', 'Thursday 8PM EST', 'word_for_word', 'slack', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Tiffany Pantozzi', 'active', (SELECT id FROM pods WHERE name = 'Pod 2'), 'Orlando, FL', 'EST', 'https://alignagents.com/Youtube-work-with-us', 'https://www.youtube.com/channel/UCxc8C5V8ZrCYRC6TxjRabog/', 'https://www.dropbox.com/request/F6jsLzqyfmrR8mV0tSlW', 'https://drive.google.com/drive/folders/1thOy6EfZ_w5Sdh1RseIdADcETEXA8l5E', 'https://aimpactmedia.slack.com/archives/C08GDB82E0Z', 'YouTube', '2025-03-01', 'Friday', 'word_for_word', 'slack', 'For her solo scripts, add an introduction right after the hook. For scripts along with a lender (previously informed), add a loop/introdution to him. Follow this doc: https://docs.google.com/document/d/1rwzLMhiCFpSDLUQAQXeaXAKN5fAXmsQyRukzQRh1fV4/edit?tab=t.0');
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Will Van Wickler', 'active', (SELECT id FROM pods WHERE name = 'Pod 2'), 'Portland, Maine', 'EST', 'https://wvanwickler.kw.com/', 'https://www.youtube.com/channel/UC888aB8SFGYtN-X2L3TV4bg/', 'https://www.dropbox.com/request/4vlD93y2S66LOGdN5AN7', 'https://www.dropbox.com/scl/fo/5u38qf238yo6e0fldnd1m/AJrVJPGf_pSqeO0amhn9Be0?rlkey=hv6uytfa66l83f6its4m9om5t&st=w75ajomc&dl=0', 'https://aimpactmedia.slack.com/archives/C087G4F2D1U', 'YouTube', '2025-12-28', 'Friday', 'word_for_word', 'slack', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('LID Levi Lascsak', 'active', (SELECT id FROM pods WHERE name = 'Pod 3'), 'Dallas, TX', 'CST', 'https://call.livingindallastx.com/start', 'https://www.youtube.com/@LIVINGINDALLAS', 'https://www.dropbox.com/request/YFqGmObjx1589Xwf5qS3', 'https://drive.google.com/drive/folders/129NVtHq-GAIwRU1uvjK-4mPpfXz4LGaJ?usp=drive_link', 'https://aimpactmedia.slack.com/archives/C08PNJ5V0NP', 'YouTube x4', '2025-04-25', 'Wednesday 5 PM EST Saturday 12 PM EST', 'word_for_word', 'slack', 'This channel is focused on people RELOCATING to Dallas, so make sure the language and tone reflect that in the script.  LEAD MAGNET FOR CTA: Get in touch via the QR code on the screen (tying to the topic of relocating to Dallas)');
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('PP Levi Lascsak', 'active', (SELECT id FROM pods WHERE name = 'Pod 3'), 'Dallas, TX', 'CST', NULL, 'https://www.youtube.com/@PassiveProspecting/videos', NULL, NULL, 'https://aimpactmedia.slack.com/archives/C08PNJ5V0NP', 'YouTube x4', '2025-04-25', NULL, 'word_for_word', NULL, NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('WHID Levi Lascsak', 'active', (SELECT id FROM pods WHERE name = 'Pod 3'), 'Dallas, TX', 'CST', NULL, 'https://www.youtube.com/@WhatsHappeningInDallas', NULL, NULL, 'https://aimpactmedia.slack.com/archives/C08PNJ5V0NP', 'YouTube x4', '2025-04-25', NULL, 'word_for_word', NULL, 'This channel is focused on people ALREADY living in Dallas, so make sure the language and tone reflects that in the script.');
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Real NoVA Network (Chris Colgan)', 'active', (SELECT id FROM pods WHERE name = 'Pod 1'), 'Northern Virginia', 'EST', NULL, 'https://www.youtube.com/@RealNoVaNetwork', 'https://www.dropbox.com/request/bRz8L6LDR2aGlZie3wp1', NULL, 'https://aimpactmedia.slack.com/archives/C084LC80ZCL', 'YouTube', '2024-12-09', 'Sunday 1pm EST', 'word_for_word', 'slack', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Kristin Prough', 'active', (SELECT id FROM pods WHERE name = 'Pod 2'), 'Las Vegas', 'PST', 'https://getluxuryhomeslasvegas.com/', 'https://www.youtube.com/channel/UCtjFDh33oUYvXCCSRP6zeIA/', 'https://www.dropbox.com/request/p8Xh7YBtfbbBMopUXR22', 'https://drive.google.com/drive/folders/1xrrRuHX3galqXu8Uwu2uvNvprNUImd5D?usp=sharing', 'https://aimpactmedia.slack.com/archives/C094QS9357W', 'YouTube', '2025-07-01', 'Sunday', 'word_for_word', NULL, NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Sean McConnell', 'active', (SELECT id FROM pods WHERE name = 'Pod 1'), 'Seattle', 'PT', 'https://www.northernkeyteam.com/', 'https://www.youtube.com/channel/UCrygM63QyBez_OjjvfdgACQ/', 'https://www.dropbox.com/request/yXIQM11fKBC9iEPIcppK', 'https://www.dropbox.com/scl/fo/6qy0udf9xlqbf8st16kqr/AKIpMa1465m2rsN5PX6UjHs?rlkey=z8h17rwv239i6hha9ok4x85s7&st=1t0tbgjk&dl=0', 'https://aimpactmedia.slack.com/archives/C0944EKRXEY', 'YouTube x Social', '2025-06-27', 'Sunday', 'word_for_word', NULL, NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Kyle Simmons', 'active', (SELECT id FROM pods WHERE name = 'Pod 3'), 'Las Vegas', 'CST', 'N/A', 'https://www.youtube.com/@LivingInLasVegasWithVickyandKy', 'https://www.dropbox.com/request/U3w6DRFj4Bx7uYVuj50a', NULL, 'https://aimpactmedia.slack.com/archives/C0971J85X7E', 'YouTube', '2025-07-23', 'Friday 5 PM EST', 'word_for_word', 'slack', 'Each script will have a specific lead magnet in the CTA, taken from here: https://stan.store/vickylasvegasrealtor  The lead magnet has to be tailored to the correct type of video. Example: Neighborhood themed video - Buyers Guide/Relo Guide /// New Construction Video - New Construction Lead Magnet) etc');
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Alley Buscemi', 'active', (SELECT id FROM pods WHERE name = 'Pod 3'), 'Raleigh', 'EST', 'alleycohomes.com', 'https://www.youtube.com/@alleyinraleigh', 'https://www.dropbox.com/request/tK3S3vCvQzhT0crcT85Y', 'https://drive.google.com/drive/folders/12bULXtNzkj0jKk1r1ecFtc9J8zujMX7H?usp=drive_link', 'https://aimpactmedia.slack.com/archives/C096X82K5JS', 'YouTube', '2025-07-25', 'Friday 5 PM EST', 'word_for_word', 'slack', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Erik Throm', 'active', (SELECT id FROM pods WHERE name = 'Pod 2'), 'San Francisco Proper', 'PT', 'https://cityrealestatesf.com/agents/erik-throm', 'https://www.youtube.com/channel/UCX7CN6VKG_3kWAS0ZRse1Gw/', 'https://www.dropbox.com/request/Mg5xCylnJaqpde7xfwf0', 'https://www.dropbox.com/work/Knwn%20Local%20Team/01_CLIENTS/Erik%20Throm/02_B-ROLL?di=left_nav_browse  https://drive.google.com/drive/folders/1sntZUDtmBppXxiXxGd6RiyWFQKpxK32J?usp=sharing_eip_se_dm&ts=690bbc29', 'https://aimpactmedia.slack.com/archives/C097LB8KMRV', 'YouTube', '2025-07-29', 'Sunday 9PM', 'outline', 'slack', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Schmitz & Smith Group', 'active', (SELECT id FROM pods WHERE name = 'Pod 2'), 'Austin, Texas', 'CST', 'www.SchmitzandSmith.com', 'https://www.youtube.com/channel/UCR7g-r5DEzOgT36udtimtNQ/', 'https://www.dropbox.com/request/ZEeiRb2BTPn82UxQFC4P', 'https://www.dropbox.com/work/Knwn%20Local%20Team/01_CLIENTS/Schmitz%20%26%20Smith%20Group/02_B-ROLL?di=left_nav_browse', 'https://aimpactmedia.slack.com/archives/C098CBCK40M', 'YouTube', '2025-07-30', 'Saturday 10PM', 'word_for_word', 'slack', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Connie Van', 'active', (SELECT id FROM pods WHERE name = 'Pod 1'), 'Sacramento Suburbs', 'PST', NULL, 'https://www.youtube.com/@ConnieVanRealEstateGroup', 'https://www.dropbox.com/request/ghfyt7UZyc9biYV1eQm1', NULL, 'https://aimpactmedia.slack.com/archives/C097ZNDHK8F', 'YouTube', '2025-07-30', '1pm EST on Saturdays', 'word_for_word', 'slack', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Will Sawyer', 'active', (SELECT id FROM pods WHERE name = 'Pod 1'), 'Greenville SC, Lake Keowee', NULL, NULL, 'https://www.youtube.com/@gvlrealestate/videos', NULL, NULL, NULL, NULL, '2025-12-11', NULL, 'word_for_word', NULL, 'Will requires an intro and a specific ending for his videos. MAKE SURE you always copy this intro: “As always, my name is Will Sawyer, your friend in real estate here in the upstate of South Carolina. And if you are thinking about making a move to the Greenville area or possibly Lake Keowee, I have helped hundreds of families with their real estate transactions. And I would love to add you to our client family. So, please do me a favor, email me at my email below or shoot me a text at my cell phone number below. I would love to get you home to the upstate.” and this ending: “As always, my friends, my name is Will Sawyer, your friend in real estate. And until next time, stay safe.”');
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Jadde Rowe', 'active', (SELECT id FROM pods WHERE name = 'Pod 1'), 'Minneapolis - The Northwest & west Suburbs- Maple Grove (I live here)- Plymouth- Minnetonka- Golden Valley- Hopkins- Saint Louis Park- Wayzata- Champlin- Rogers', NULL, NULL, 'https://www.youtube.com/channel/UC_0ICAUz4219exKHtOXt5oQ', NULL, NULL, NULL, NULL, '2025-12-24', NULL, 'word_for_word', NULL, 'IMPORTANT: Jadde prefers sentences with commas because they make the text flow better, rather than short, choppy sentences with periods.');
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('John Garuti', 'active', (SELECT id FROM pods WHERE name = 'Pod 2'), 'Southwest Florida, Fort Mayers, Babcock Ranch, Punta Gorda, Cape Coral', 'EDT', 'https://www.swfloridarealestate.com/', 'https://www.youtube.com/@LivinginSouthwestFloridaJG3', 'https://www.dropbox.com/request/VOQyVikbitG6l3wpo1rz', 'https://www.dropbox.com/work/Knwn%20Local%20Team/01_CLIENTS/John%20Garuti/02_B-ROLL?di=left_nav_browse', 'https://app.slack.com/huddle/TUL49PQN4/C099VMQ2WDP', 'YouTube x Email', '2025-08-07', 'Tuesdat 9PM', 'word_for_word', 'slack', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Sarah Newman', 'active', (SELECT id FROM pods WHERE name = 'Pod 3'), 'Charleston, SC', 'EST', 'https://www.youtube.com/@LifeinCharlestonSouthCarolina', 'https://www.youtube.com/@LifeinCharlestonSouthCarolina', 'https://www.dropbox.com/request/zgyLFMxxhK4GWQf0LQme', 'https://drive.google.com/drive/folders/1XgCMDe0sBq08aJk0lDNvW2E8GYEnNO-k?usp=drive_link', 'https://aimpactmedia.slack.com/archives/C096WLQP8SK', 'YouTube', '2025-07-23', 'Thursday 3:30 PM EST', 'word_for_word', 'slack', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Gary Bradler', 'active', (SELECT id FROM pods WHERE name = 'Pod 3'), 'Denver', 'MST', 'N/A', 'https://www.youtube.com/@hometowndenver', 'https://www.dropbox.com/request/lkDOwW0MlRww5ypSueIJ', 'https://drive.google.com/drive/folders/1Na7bx6IdcfnpXpj6mtj2yQDwfPJMDNAY?usp=drive_link', 'https://aimpactmedia.slack.com/archives/C0992LR7HUG', 'YouTube', '2025-08-01', 'Wednesday 5 PM EST', 'word_for_word', 'slack', 'Gary needs his scripts to be written in 5th grade level.  Gary has a relocation guide to be used as a lead magnet in his CTAs: https://www.hometowndenver.co/relocation-guide');
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Tina Gamble', 'active', (SELECT id FROM pods WHERE name = 'Pod 4'), 'Hawaii', NULL, NULL, NULL, 'https://www.dropbox.com/scl/fo/fozzophu3h81ze9fzc6s1/ABBQvuGhqinl6GOf4yvtHFE/Listings?dl=0&rlkey=glyzesz0tb9mo6qpyb1c6gaqd&subfolder_nav_tracking=1', NULL, NULL, 'YouTube', '2026-01-01', NULL, 'word_for_word', NULL, 'IMPORTANT: Make sure the research and fact-checking are updated for O’ahu specifically, and that pricing is separated by property type. This is already in the Brand Voice Guide, but we should include it in the research and fact-checking section as well to ensure better results.  Tina is on O’ahu specifically. “Big Island” often dominates the search results (since it shares the state name of Hawaii), some of the general data can be skewed that way in research. Be sure you are pulling info on O’ahu specifically. If you don’t do that, you’ll get the wrong numbers for costs etc.  All pricing separated by property type (condo/townhome vs. single-family) and bedroom count where possible. Blanks can be left where verified O''ahu data is unavailable — no estimated or Big Island figures used.  Military buyer content reflects their advantages: BAH, VA loan, stable income, outdoor lifestyle. No intimidating language, but encouraging and friendly.  Do no use Hawaiian language, it offends the local native Hawaiian population.');
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Hannah Dubyne', 'active', (SELECT id FROM pods WHERE name = 'Pod 2'), 'Vancouver, WA', NULL, NULL, 'https://www.youtube.com/@LivingInVancouverCamasWash', 'https://www.dropbox.com/request/cIpTqM8pF6MIeBrEHJ27', NULL, NULL, NULL, '2025-11-24', NULL, 'outline', NULL, NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Brandon - Development Channel', 'active', (SELECT id FROM pods WHERE name = 'Pod 1'), NULL, NULL, NULL, 'https://www.youtube.com/channel/UCw0GMPwOA_6Vhm8hVxbTDBg', NULL, NULL, NULL, NULL, '2024-11-06', NULL, 'word_for_word', NULL, NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Valerie Gonzalez', 'active', (SELECT id FROM pods WHERE name = 'Pod 2'), 'Atlanta, GA', NULL, NULL, 'https://www.youtube.com/@LivinginAtlantaVG', NULL, 'https://www.dropbox.com/scl/fo/bga1s89wz1v67rae42sc6/AEkoDiAVFOvC79WNJiTuiB4?rlkey=faf54uxmz342o9t0x739hfqhc&st=u51vh572&dl=0', NULL, 'YouTube', NULL, 'Friday 4PM', 'word_for_word', 'slack', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Grant Irby', 'active', (SELECT id FROM pods WHERE name = 'Pod 2'), 'Virginia', 'EST', 'https://grantirby.kw.com/', 'https://www.youtube.com/@GrantIrby', NULL, 'https://www.dropbox.com/scl/fo/2gu1eacrjccrvbto49pfu/AAwJjjxE8I22xG_VtV3hs_w?rlkey=1cb73wr6p61alf4vzjo0zdm4e&st=ahpdk6kd&dl=0', 'https://knwnlocal.slack.com/archives/C0ABD5V0YR5', NULL, '2026-02-04', NULL, 'word_for_word', NULL, 'Grant prefers a more professional tone rather than a casual one.');
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Devin Sheehan', 'active', (SELECT id FROM pods WHERE name = 'Pod 2'), 'Rhode Island', NULL, NULL, 'https://www.youtube.com/@livinginri/videos', NULL, NULL, NULL, NULL, '2026-01-30', NULL, 'word_for_word', NULL, NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Gary Gold', 'active', (SELECT id FROM pods WHERE name = 'Pod 2'), 'Los Angeles', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-06', NULL, 'outline', NULL, NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Ryan Meeks', 'onboarding', (SELECT id FROM pods WHERE name = 'Pod 3'), 'SE Pheonix, Arizona', NULL, NULL, 'https://www.youtube.com/@EscapeToArizona/videos', 'https://www.dropbox.com/scl/fo/dp22i472xucb1ino1urtw/AKy--Y7qHvkbiNmlEa5GsMs?rlkey=h29pgg4wy8xcmhb9gn3cje88y&st=b2z5ebbu&dl=0', 'https://www.dropbox.com/scl/fo/07dsqkixwo1czr81q1iwr/ABkyiaJC3JKEDbCoa4-boCE?rlkey=qe009zpwugm27xph8gzrwx5lu&st=kqsrwrwb&dl=0', NULL, NULL, '2026-02-05', 'Sunday', 'word_for_word', NULL, 'ESCAPING TO PHOENIX is for people who ARE LOOKING TO RELOCATE there. Pay attention to the target audience. This is reflected in the brand voice guide.');
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Ryan Meeks - WHIP', 'onboarding', (SELECT id FROM pods WHERE name = 'Pod 3'), 'SE Pheonix, Arizona', NULL, NULL, 'https://www.youtube.com/channel/UCsDbnJBNLrO_tQEwFU8KlJA', NULL, 'https://www.dropbox.com/scl/fo/07dsqkixwo1czr81q1iwr/ABkyiaJC3JKEDbCoa4-boCE?rlkey=qe009zpwugm27xph8gzrwx5lu&st=kqsrwrwb&dl=0', NULL, NULL, '2026-02-05', NULL, 'word_for_word', NULL, 'WHATS HAPPENING IN PHOENIX is for people who ALREADY live there. Pay attention to the target audience. This is reflected in the brand voice guide.');
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Amy Shrader', 'onboarding', (SELECT id FROM pods WHERE name = 'Pod 2'), 'Morristown, TN', NULL, NULL, 'https://www.youtube.com/@AmyShraderTNRealEstateGal/videos', NULL, NULL, NULL, NULL, '2026-01-29', NULL, 'outline', NULL, 'To keep in mind: Morristown is in Hamblen County, NOT Morris County.');
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('William Burton', 'onboarding', (SELECT id FROM pods WHERE name = 'Pod 2'), 'Charleston, SC', 'EST', NULL, 'https://www.youtube.com/@WilliamBurtonCharlestonRealtor/videos', NULL, NULL, 'https://knwnlocal.slack.com/archives/C0AFFECPF1S', 'YouTube', '2026-01-31', NULL, 'word_for_word', NULL, NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('German Hernandez', 'onboarding', (SELECT id FROM pods WHERE name = 'Pod 1'), 'Cape Coral (Main area) + Fort Myers FL', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-09', NULL, 'word_for_word', NULL, NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Alex Yu', 'active', (SELECT id FROM pods WHERE name = 'ELLA'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Amit Bhuta', 'active', (SELECT id FROM pods WHERE name = 'ELLA'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Golfi Team', 'active', (SELECT id FROM pods WHERE name = 'ELLA'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('HHG', 'active', (SELECT id FROM pods WHERE name = 'ELLA'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Matt Vance', 'active', (SELECT id FROM pods WHERE name = 'ELLA'), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Stephen Cooley', 'active', (SELECT id FROM pods WHERE name = 'Pod 4'), 'Charlotte, NC', NULL, NULL, 'https://www.youtube.com/@StephencooleyREG/videos', NULL, NULL, 'https://knwnlocal.slack.com/archives/C0AN21KFZ1A', NULL, '2026-03-16', NULL, 'word_for_word', NULL, NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Knwn Local', 'active', NULL, NULL, NULL, NULL, NULL, 'https://www.dropbox.com/request/QRGFaEIkqevmkbjGuQCS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Missy Yost', 'active', (SELECT id FROM pods WHERE name = 'Pod 3'), 'Bluffton Sc', 'EST', 'https://blufftonhiltonheadhomes.com/', 'https://www.youtube.com/@CoastwardRealty/videos', NULL, 'https://drive.google.com/drive/folders/1I8fYDxRKfrcDmsaKSaIcVHs7x_z6qACg?usp=drive_link', NULL, 'YouTube', '2025-03-01', '5pm, Thursday', 'outline', 'slack', 'Missy uses less fear-based language and more information-based language.');
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Arjun Dhingra', 'active', (SELECT id FROM pods WHERE name = 'Pod 1'), 'San Francisco', 'PST', NULL, 'https://www.youtube.com/@arjunmortgage', NULL, NULL, 'https://aimpactmedia.slack.com/archives/C06E0B1141W', 'YouTube', '2023-04-23', 'Every Saturday 1pm EST', 'word_for_word', 'slack', 'Please don’t make Arjun’s scripts or CTA specific to SF, he is licensed all over the US so he can do deals anywhere. We don’t want to just target SF.');
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('LFG Energy (Arjun Podcast)', 'active', (SELECT id FROM pods WHERE name = 'Pod 1'), 'San Francisco', 'PST', NULL, 'https://www.youtube.com/@MyLFGenergy', NULL, NULL, 'https://aimpactmedia.slack.com/archives/C07G5BHAFAA', 'YouTube', '2023-04-23', 'Thursday 11am/12pm/1pm PST', 'word_for_word', 'slack', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Charity & Joe Slawter', 'active', (SELECT id FROM pods WHERE name = 'Pod 3'), 'Olympia', 'PST', 'livewellhomegroup.com', 'https://www.youtube.com/@thelivewellhomegroup', NULL, NULL, NULL, 'YouTube', '2024-06-22', 'Tuesday 6PM PST', 'word_for_word', 'slack', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Micah Bleecher', 'active', (SELECT id FROM pods WHERE name = 'Pod 3'), 'Las Vegas', 'CST', 'lv55homes.com', 'https://youtube.com/@ilovelivinginlasvegas?si=dmOpTuyyay5ey_jU', NULL, NULL, NULL, 'YouTube', '2024-10-03', 'Friday 3PM EST', 'word_for_word', 'slack', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Lindsey Tronolone', 'active', (SELECT id FROM pods WHERE name = 'Pod 3'), 'Jupiter, FL', 'EST', 'thejupgroup.com', 'https://www.youtube.com/@LivinginJupiterFL/featured', NULL, 'https://drive.google.com/drive/folders/1tkXjjrBqtlM2VlzUOa3forE3XbSOhHEN?usp=drive_link', NULL, 'YouTube', '2025-02-08', 'Thursday 5PM EST', 'outline', 'slack', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Brad Thornton', 'active', (SELECT id FROM pods WHERE name = 'Pod 3'), 'Washington, DC', 'EST', NULL, 'https://www.youtube.com/@LivingInWashington-DC', NULL, 'https://drive.google.com/drive/folders/1zXRpgU3Yy6H28oryR_m8qApZ19dryouL?usp=drive_link', NULL, 'YouTube', '2025-03-04', 'Friday 6PM EST', 'word_for_word', 'slack', '→ MID CTA SHOULD INCLUDE LEAD MAGNET WITH BRAD''S RELOCATION GUIDE:  Page: https://brad-thornton.myflodesk.com/yt-relocationguide Relocation guide: https://usercontent.flodesk.com/ace30d77-dc1f-46a5-8b7a-b3d8de9bbe15/upload/flnajzz22x/YT-RELOCATION_guide_compressed_copy.pdf  PS: Only include this when it fits the script organically (top neighborhoods, specific suburbs, neighborhoods good for families and other lifestyles etc). Other topics like market updates, development, ultra-wealthy etc we can keep the same get in touch CTA.  → LANGUAGE/TONE:  • Stacked adjectives or overly descriptive phrasing: no multiple descriptive words in a row (e.g., avoid "stunning, vibrant, tree-lined streetscape"). Keep descriptions simple and conversational. • Magazine-article tone or polished editorial writing: should always sound like a person talking, not a written article • Stating the obvious: don’t say things the audience already knows or can easily figure out  → REAL ESTATE PREFENCES:  • Apartment/rental references: do not mention apartments or apartment living • Median price as a standalone metric: use a price range instead, emphasizing the higher price point for 3-bedroom homes');
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Chris Schwarz', 'active', (SELECT id FROM pods WHERE name = 'Pod 3'), 'New Smyrna Beach, FL', 'EST', NULL, 'https://www.youtube.com/@newsmyrnabeachrealestate', NULL, 'https://drive.google.com/drive/folders/1KZviYnu5EtYayTq-j1NpYq30nu5KOhbn?usp=drive_link', NULL, 'YouTube', '2025-04-23', 'Tuesday or Wednesday 8AM EST', 'word_for_word', 'slack', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Sam Riddle', 'active', (SELECT id FROM pods WHERE name = 'Pod 3'), 'Lubbock, TX', 'CST', NULL, 'https://www.youtube.com/@LubbockTexasLiving/videos', NULL, NULL, NULL, 'YouTube', '2025-05-12', NULL, 'word_for_word', 'slack', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Landin Smith', 'active', (SELECT id FROM pods WHERE name = 'Pod 3'), 'Denver', 'MST', 'https://www.dreamsmithteam.com/', 'https://www.youtube.com/@landinbsmith', NULL, 'https://drive.google.com/drive/folders/11ZTp4xGhiCHRWvRxoYwf4qtVG8XQabgC?usp=drive_link', NULL, 'YouTube', '2025-02-21', 'Saturday 5PM EST', 'outline', 'slack', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Adam Dow', 'active', (SELECT id FROM pods WHERE name = 'Pod 3'), 'New Hampshire', NULL, 'adamdow.com', 'https://www.youtube.com/@AdamDow', 'https://www.dropbox.com/request/taj4f15C8qDHRQwIGcpp', 'https://www.dropbox.com/scl/fo/whrfchs9zv76hgnkxxbma/ACYIWAc0t9OVknTzXcIyBUo?rlkey=4mc6lzyss5x73q5llopd44xzj&st=z0w84koc&dl=0', 'https://aimpactmedia.slack.com/archives/C09JKRHECTH', 'YouTube', '2025-10-06', NULL, 'word_for_word', 'slack', 'For the LEAD MAGNET, mention that Adam works as part of a team, and he focuses on the lakes region. For the mountain and coastal regions, the team has other professionals. They’re the #1 team, so people should reach out.');
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Blake Ginther', 'active', (SELECT id FROM pods WHERE name = 'Pod 3'), 'Winston Salem, North Carolina', 'EST', NULL, 'https://www.youtube.com/@theginthergroup', 'https://www.dropbox.com/request/8AUnJqtaKxbcNXmF9Kfq', NULL, 'https://aimpactmedia.slack.com/archives/C09KFNL5A3H', 'YouTube', '2025-10-09', NULL, 'word_for_word', 'slack', NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Jason & Brooke', 'active', (SELECT id FROM pods WHERE name = 'Pod 3'), 'Minneapolis-St. Paul (Twin Cities)', NULL, NULL, 'https://www.youtube.com/@livinginminneapolis/featured', NULL, NULL, 'https://aimpactmedia.slack.com/archives/C09KYPM7XUN', 'YouTube', '2025-10-08', NULL, 'word_for_word', 'slack', '>>> JASON & BROOKE WRITE IN 3RD GRADE LANGUAGE <<<  GRAMMAR  - Never open sentences with “And” - Never start a sentence with a date - Make sure things are in a full sentence so if a comma structure is happening please end it with for example "cat, bird, dog" should be "cat, bird, and dog". - The tone should be 3rd grade conversational/newscast level intellect  TOPICS  - DO NOT talk about schools & families - Cut out societal pressures on communities (no talking about how uptight a place is etc.)  LENGTH  - Aim of the video is around 15-25 minutes max (no more than 7-8 pages)  MORE REQUESTS:  Keep sentences under 10–12 wordsIf a sentence runs longer than that, split it.Write scripts in “spoken rhythm”Structure like this:  Short line Short line Short line  Pause  Next thought  Avoid stacked ideas. Instead of:“The market is shifting and many homeowners approaching retirement are trying to determine the best timing strategy.”Use:“The market is shifting.And a lot of homeowners close to retirement are asking the same question…”Give Jason natural emphasis wordsWords he naturally emphasizes: • “Here’s the thing” • “What most people don’t realize” • “A lot of people ask us this” • “Here’s what we’re seeing”Scripts using these tend to flow better for him.Filming technique that will also helpEven with a perfect script, delivery improves if filming is structured like this:Record in short segmentsInstead of a 20-second script, break it into: 1. Hook 2. Insight 3. CTAThen stitch together.This removes pressure and improves confidence on camera.Biggest takeawayJason doesn’t struggle with delivery overall. The hesitations are almost certainly caused by script structure, not speaking ability.The fix is simple: • shorter lines • conversational phrasing • clear pauses • one idea per sentence');
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Sally Daley', 'active', (SELECT id FROM pods WHERE name = 'Pod 3'), 'Barrier Island (32963 zip code)  Vero Beach, FL', 'EST', NULL, 'https://www.youtube.com/@VeroBeachDaley/videos', NULL, NULL, 'https://aimpactmedia.slack.com/archives/C09KXCL0KB7', 'YouTube', '2025-09-23', 'Saturday 5PM EST', 'outline', 'slack', 'Sally speaks to a luxury buyer audience. She sells high-end homes without sounding uptight or snobby, so keep the tone friendly and approachable.  Her authority statement should reflect that. Instead of “I’ve been in real estate for XX years,” use something like “I’ve been selling luxury homes for XX years” or “I’ve worked in the luxury real estate market for XX years.”  Do the same for the CTAs. Her “get in touch” should speak directly to this audience, inviting people to reach out if they’re looking to buy a luxury home.');
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Marti Hampton', 'active', (SELECT id FROM pods WHERE name = 'Pod 3'), 'Raleigh, North Carolina & The Triangle Region', NULL, NULL, 'https://www.youtube.com/@martihamptonre/featured', 'https://www.dropbox.com/request/z7ouNQnbtaWQy1JOyxKQ', NULL, 'https://aimpactmedia.slack.com/archives/C09QJQH63KN', 'YouTube', '2025-11-03', NULL, 'word_for_word', NULL, NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Justin Landis', 'active', (SELECT id FROM pods WHERE name = 'Pod 3'), 'Atlanta Metropolitan Region, Georgia', NULL, NULL, 'https://www.youtube.com/@JustinLandisGroup', NULL, NULL, NULL, NULL, '2025-10-24', NULL, 'word_for_word', NULL, NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Mark Weinberg', 'active', (SELECT id FROM pods WHERE name = 'Pod 2'), 'Charlotte, NC', 'EST', 'https://markweinberg.lofty.me/', 'https://www.youtube.com/@MarkSellsCharlotte', NULL, NULL, 'https://knwnlocal.slack.com/archives/C09SUQRPE4C', 'YouTube', '2025-11-06', 'TBD', 'word_for_word', NULL, NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Matthew Hyde', 'active', (SELECT id FROM pods WHERE name = 'Pod 2'), 'Fairfield, Westport, Trumbull (Connecticut)', 'EST', 'hydehomesct.com', 'https://www.youtube.com/@ConnecticutLiving', 'https://www.dropbox.com/request/J8RBGphZEaOSedRuVvYB', 'A-ROLL: https://www.dropbox.com/scl/fo/nu6xwkz8rvkgoa0mxshjs/ADKwzwJ0LFIZugDlKh1S_7s?rlkey=vogunuhi5ddjagoq50kmxio1y&st=j14z0jm9&dl=0  B-ROLL: https://www.dropbox.com/scl/fo/q9e5rzym490erzwymgqbl/AHKfs2hccRhVmGr6O8z_Oeo?rlkey=k2dyl988mj7asv5mgp9yjz27u&st=hmc0ujt1&dl=0', 'https://knwnlocal.slack.com/archives/C09TST6GMRV', 'YouTube', '2025-11-14', NULL, 'word_for_word', NULL, NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('The San Diego Scoop', 'active', (SELECT id FROM pods WHERE name = 'Pod 2'), 'North County, San Diego (California)', 'PST', NULL, 'https://www.youtube.com/@TheSanDiegoScoop', NULL, 'https://www.dropbox.com/scl/fo/mn3mi1ukslotjke2beinw/AKRlNiT0aHdWNtZPG3URa2Q?rlkey=8jvp2na12e20huk548zi29adp&st=mytwvig9&dl=0', 'https://knwnlocal.slack.com/archives/C08LYHTV150', 'YouTube', NULL, 'Wednesday - 4PM EST', 'word_for_word', NULL, 'Separate each paragraph into 1-2 sentences for the scripts. This helps Bern when reading from the teleprompter.');
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Alyssa Curran', 'active', (SELECT id FROM pods WHERE name = 'Pod 4'), 'Vancouver, WA', 'PST', NULL, 'https://www.youtube.com/@alyssacurranrealtor/videos', NULL, NULL, 'https://join.slack.com/share/enQtMTA4MzA3MzQ2MzIyMTEtZWI2ZTNhZTZlZjMzZGQ4NTMwYjA3YTE1YjVlYmRmZmRkYmNmNWQwNjg4NmQ0NjM2Njk5YTMxNGI2ZGRlNWFmNw', 'YouTube', '2026-03-19', NULL, 'outline', NULL, NULL);
INSERT INTO clients (name, status, pod_id, market, timezone, website, youtube_channel_url, dropbox_upload_url, broll_library_url, slack_channel_url, package, contract_start_date, posting_schedule, script_format, communication_method, special_instructions)
  VALUES ('Erin & Niki', 'onboarding', (SELECT id FROM pods WHERE name = 'Pod 4'), 'Savannah, GA', 'EST', NULL, 'https://www.youtube.com/@sellingsavannahhomes', NULL, NULL, NULL, 'YouTube', NULL, NULL, 'word_for_word', NULL, NULL);

-- ============================================================
-- Step 5: Insert client channels
-- ============================================================

INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Austin Klar'), 'Austin Klar', 'https://www.youtube.com/@austinklar', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Brandon Blankenship'), 'Brandon Blankenship', 'https://www.youtube.com/@LivingChicagoSuburbs', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Brette Davis'), 'Brette Davis', 'https://www.youtube.com/@livinginraleighnc', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Charles Cherney'), 'Charles Cherney', 'https://www.youtube.com/@CharlesCherney', 0.5);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Chris Colgan'), 'Chris Colgan', 'https://www.youtube.com/@ChrisColgan', 2.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'David Hargreaves'), 'David Hargreaves', 'https://www.youtube.com/@bruingtonhargreaves', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Joe Biscaha'), 'Joe Biscaha', 'https://www.youtube.com/@JoeSellsMiami', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Kyle Talbot'), 'Kyle Talbot', 'https://www.youtube.com/@movingtokc', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Maynard Wagner'), 'Maynard Wagner', 'https://www.youtube.com/@seattlelivingandwealthbuilding', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Matt Oneill'), 'Matt Oneill', 'https://www.youtube.com/@MattONeillRealEstate', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Oyler Hines'), 'Oyler Hines', 'https://www.youtube.com/@oylerhines', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Raziel Ungar'), 'Raziel Ungar', 'https://www.youtube.com/@livinginsanmateocountyca', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Wilson Leung'), 'Wilson Leung', 'https://www.youtube.com/@bayareawilson', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Matt Lunden'), 'Matt Lunden', 'https://www.youtube.com/@LivingInCoastalDelaware', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Bern McGovern'), 'Bern McGovern', 'https://www.youtube.com/channel/UCiDiYzzKoTi10fPWuPCRAbg/', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Isayas Theodros'), 'Isayas Theodros', 'https://www.youtube.com/@theodrosteam', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'John Sintich'), 'John Sintich', 'https://www.youtube.com/channel/UCMl6wQBbJ1GztMjkKPqS0IQ/', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Michael McCall'), 'Michael McCall', 'https://www.youtube.com/@LifeinSATX', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Ryan Butler'), 'Ryan Butler', 'https://www.youtube.com/channel/UCCAYootEw0GKr_LVtOEIhng/', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Scott Moe'), 'Scott Moe', 'https://www.youtube.com/@moerealestateteam/videos', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Stephanie Cole Patterson'), 'Stephanie Cole Patterson', 'https://www.youtube.com/@LivingintheAtlantaSuburbs/videos', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Tiffany Pantozzi'), 'Tiffany Pantozzi', 'https://www.youtube.com/channel/UCxc8C5V8ZrCYRC6TxjRabog/', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Will Van Wickler'), 'Will Van Wickler', 'https://www.youtube.com/channel/UC888aB8SFGYtN-X2L3TV4bg/', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'LID Levi Lascsak'), 'LID Levi Lascsak', 'https://www.youtube.com/@LIVINGINDALLAS', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'PP Levi Lascsak'), 'PP Levi Lascsak', 'https://www.youtube.com/@PassiveProspecting/videos', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'WHID Levi Lascsak'), 'WHID Levi Lascsak', 'https://www.youtube.com/@WhatsHappeningInDallas', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Real NoVA Network (Chris Colgan)'), 'Real NoVA Network (Chris Colgan)', 'https://www.youtube.com/@RealNoVaNetwork', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Kristin Prough'), 'Kristin Prough', 'https://www.youtube.com/channel/UCtjFDh33oUYvXCCSRP6zeIA/', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Sean McConnell'), 'Sean McConnell', 'https://www.youtube.com/channel/UCrygM63QyBez_OjjvfdgACQ/', 2.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Kyle Simmons'), 'Kyle Simmons', 'https://www.youtube.com/@LivingInLasVegasWithVickyandKy', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Alley Buscemi'), 'Alley Buscemi', 'https://www.youtube.com/@alleyinraleigh', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Erik Throm'), 'Erik Throm', 'https://www.youtube.com/channel/UCX7CN6VKG_3kWAS0ZRse1Gw/', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Schmitz & Smith Group'), 'Schmitz & Smith Group', 'https://www.youtube.com/channel/UCR7g-r5DEzOgT36udtimtNQ/', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Connie Van'), 'Connie Van', 'https://www.youtube.com/@ConnieVanRealEstateGroup', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Will Sawyer'), 'Will Sawyer', 'https://www.youtube.com/@gvlrealestate/videos', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Jadde Rowe'), 'Jadde Rowe', 'https://www.youtube.com/channel/UC_0ICAUz4219exKHtOXt5oQ', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'John Garuti'), 'John Garuti', 'https://www.youtube.com/@LivinginSouthwestFloridaJG3', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Sarah Newman'), 'Sarah Newman', 'https://www.youtube.com/@LifeinCharlestonSouthCarolina', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Gary Bradler'), 'Gary Bradler', 'https://www.youtube.com/@hometowndenver', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Tina Gamble'), 'Tina Gamble', NULL, 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Hannah Dubyne'), 'Hannah Dubyne', 'https://www.youtube.com/@LivingInVancouverCamasWash', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Brandon - Development Channel'), 'Brandon - Development Channel', 'https://www.youtube.com/channel/UCw0GMPwOA_6Vhm8hVxbTDBg', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Valerie Gonzalez'), 'Valerie Gonzalez', 'https://www.youtube.com/@LivinginAtlantaVG', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Grant Irby'), 'Grant Irby', 'https://www.youtube.com/@GrantIrby', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Devin Sheehan'), 'Devin Sheehan', 'https://www.youtube.com/@livinginri/videos', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Gary Gold'), 'Gary Gold', NULL, 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Ryan Meeks'), 'Ryan Meeks', 'https://www.youtube.com/@EscapeToArizona/videos', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Ryan Meeks - WHIP'), 'Ryan Meeks - WHIP', 'https://www.youtube.com/channel/UCsDbnJBNLrO_tQEwFU8KlJA', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Amy Shrader'), 'Amy Shrader', 'https://www.youtube.com/@AmyShraderTNRealEstateGal/videos', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'William Burton'), 'William Burton', 'https://www.youtube.com/@WilliamBurtonCharlestonRealtor/videos', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'German Hernandez'), 'German Hernandez', NULL, 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Alex Yu'), 'Alex Yu', NULL, 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Amit Bhuta'), 'Amit Bhuta', NULL, 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Golfi Team'), 'Golfi Team', NULL, 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'HHG'), 'HHG', NULL, 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Stephen Cooley'), 'Stephen Cooley', 'https://www.youtube.com/@StephencooleyREG/videos', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Missy Yost'), 'Missy Yost', 'https://www.youtube.com/@CoastwardRealty/videos', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Arjun Dhingra'), 'Arjun Dhingra', 'https://www.youtube.com/@arjunmortgage', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'LFG Energy (Arjun Podcast)'), 'LFG Energy (Arjun Podcast)', 'https://www.youtube.com/@MyLFGenergy', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Charity & Joe Slawter'), 'Charity & Joe Slawter', 'https://www.youtube.com/@thelivewellhomegroup', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Micah Bleecher'), 'Micah Bleecher', 'https://youtube.com/@ilovelivinginlasvegas?si=dmOpTuyyay5ey_jU', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Lindsey Tronolone'), 'Lindsey Tronolone', 'https://www.youtube.com/@LivinginJupiterFL/featured', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Brad Thornton'), 'Brad Thornton', 'https://www.youtube.com/@LivingInWashington-DC', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Chris Schwarz'), 'Chris Schwarz', 'https://www.youtube.com/@newsmyrnabeachrealestate', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Sam Riddle'), 'Sam Riddle', 'https://www.youtube.com/@LubbockTexasLiving/videos', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Landin Smith'), 'Landin Smith', 'https://www.youtube.com/@landinbsmith', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Adam Dow'), 'Adam Dow', 'https://www.youtube.com/@AdamDow', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Blake Ginther'), 'Blake Ginther', 'https://www.youtube.com/@theginthergroup', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Jason & Brooke'), 'Jason & Brooke', 'https://www.youtube.com/@livinginminneapolis/featured', 2.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Sally Daley'), 'Sally Daley', 'https://www.youtube.com/@VeroBeachDaley/videos', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Marti Hampton'), 'Marti Hampton', 'https://www.youtube.com/@martihamptonre/featured', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Justin Landis'), 'Justin Landis', 'https://www.youtube.com/@JustinLandisGroup', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Mark Weinberg'), 'Mark Weinberg', 'https://www.youtube.com/@MarkSellsCharlotte', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Matthew Hyde'), 'Matthew Hyde', 'https://www.youtube.com/@ConnecticutLiving', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'The San Diego Scoop'), 'The San Diego Scoop', 'https://www.youtube.com/@TheSanDiegoScoop', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Alyssa Curran'), 'Alyssa Curran', 'https://www.youtube.com/@alyssacurranrealtor/videos', 1.0);
INSERT INTO client_channels (client_id, channel_name, channel_url, videos_per_week)
  VALUES ((SELECT id FROM clients WHERE name = 'Erin & Niki'), 'Erin & Niki', 'https://www.youtube.com/@sellingsavannahhomes', 1.0);

-- ============================================================
-- Step 6: Insert client contacts (from approval emails)
-- ============================================================

INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Charles Cherney'), 'cc@compass.com', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'David Hargreaves'), 'david@bruingtonhargreaves.com', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Kyle Talbot'), 'info@movingtokc.net', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Maynard Wagner'), 'maynard@mwagnerteam.com', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Matt Oneill'), 'matt@mattoneillteam.com', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Oyler Hines'), 'caroline@oylerhines.com', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Raziel Ungar'), 'raziel@burlingameproperties.com', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Raziel Ungar'), 'melissa@dubasikdigitalmarketing.com', false);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Wilson Leung'), 'marketing@theownteam.com', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Wilson Leung'), 'wilson@theownteam.com', false);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Michael McCall'), 'michael@lifeinsanantoniotexas.com', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'LID Levi Lascsak'), 'levi.lascsak@gmail.com', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Kyle Simmons'), 'kyle@kylesimmonsteam.com', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Alley Buscemi'), 'alley.buscemi@compass.com', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Sarah Newman'), 'sarah.newman@elevateteamcharleston.com', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Gary Bradler'), 'gary@garybradler.com', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Grant Irby'), 'grantirby@kw.com', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'William Burton'), 'william@williamburton.co', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Stephen Cooley'), 'stephen@stephencooley.com', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Stephen Cooley'), 'tanner@stephencooley.com', false);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Missy Yost'), 'missy@yostgroupproperties.com', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Charity & Joe Slawter'), 'charity@thelivewellgroup.com', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Micah Bleecher'), 'mj@bleecher.me', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Lindsey Tronolone'), 'Lindseytronolone@gmail.com', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Brad Thornton'), 'sbradthornton@gmail.com', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Chris Schwarz'), 'chris@whitewhalere.com', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Sam Riddle'), 'sam@lubbocktxliving.com', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Landin Smith'), 'landinbsmith@gmail.com', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Adam Dow'), 'adam@thedowgroup.com', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Blake Ginther'), 'blake.ginther@theginthergroup.com', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Blake Ginther'), 'blake@theginthergroup.com', false);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Blake Ginther'), 'Richard_carr@me.com', false);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Blake Ginther'), 'erin@theginthergroup.com', false);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Jason & Brooke'), 'brooke@hhgus.com', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Jason & Brooke'), 'Maria@hhgus.com', false);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Sally Daley'), 'sally.daley@elliman.com', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Marti Hampton'), 'nic@martihampton.com', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Justin Landis'), 'justin@justinlandisgroup.com', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Mark Weinberg'), 'mark@carolinaskyre.com', true);
INSERT INTO client_contacts (client_id, email, is_primary)
  VALUES ((SELECT id FROM clients WHERE name = 'Matthew Hyde'), 'mhydehomes@gmail.com', true);

-- ============================================================
-- Step 7: Insert client assignments
-- ============================================================

INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Austin Klar'), (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Austin Klar'), (SELECT id FROM team_members WHERE email = 'vitoraguilarbras@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Austin Klar'), (SELECT id FROM team_members WHERE email = 'enodolectus@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Austin Klar'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Austin Klar'), (SELECT id FROM team_members WHERE email = 'bruno.ferreira@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Brandon Blankenship'), (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Brandon Blankenship'), (SELECT id FROM team_members WHERE email = 'vitoraguilarbras@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Brandon Blankenship'), (SELECT id FROM team_members WHERE email = 'enodolectus@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Brandon Blankenship'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Brandon Blankenship'), (SELECT id FROM team_members WHERE email = 'joaolealjunior21@gmail.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Breaking and Building Leaders'), (SELECT id FROM team_members WHERE email = 'manuela.ariasc1@hotmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Breaking and Building Leaders'), (SELECT id FROM team_members WHERE email = 'marina@knownlocal.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Breaking and Building Leaders'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Breaking and Building Leaders'), (SELECT id FROM team_members WHERE email = 'bruno.ferreira@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Brette Davis'), (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Brette Davis'), (SELECT id FROM team_members WHERE email = 'vitoraguilarbras@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Brette Davis'), (SELECT id FROM team_members WHERE email = 'gabriel.borba.lopes@knownlocal.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Brette Davis'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Brette Davis'), (SELECT id FROM team_members WHERE email = 'bruno.ferreira@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Charles Cherney'), (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Charles Cherney'), (SELECT id FROM team_members WHERE email = 'vitoraguilarbras@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Charles Cherney'), (SELECT id FROM team_members WHERE email = 'evellyn-albuquerque@hotmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Charles Cherney'), (SELECT id FROM team_members WHERE email = 'anderson.cirion.ruan@knownlocal.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Charles Cherney'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Charles Cherney'), (SELECT id FROM team_members WHERE email = 'bruno.ferreira@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Chris Colgan'), (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Chris Colgan'), (SELECT id FROM team_members WHERE email = 'vitoraguilarbras@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Chris Colgan'), (SELECT id FROM team_members WHERE email = 'alejandroramoscorral@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Chris Colgan'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Chris Colgan'), (SELECT id FROM team_members WHERE email = 'bruno.ferreira@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'David Hargreaves'), (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'David Hargreaves'), (SELECT id FROM team_members WHERE email = 'vitoraguilarbras@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'David Hargreaves'), (SELECT id FROM team_members WHERE email = 'enodolectus@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'David Hargreaves'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'David Hargreaves'), (SELECT id FROM team_members WHERE email = 'bruno.ferreira@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Joe Biscaha'), (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Joe Biscaha'), (SELECT id FROM team_members WHERE email = 'vitoraguilarbras@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Joe Biscaha'), (SELECT id FROM team_members WHERE email = 'anderson.cirion.ruan@knownlocal.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Joe Biscaha'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Joe Biscaha'), (SELECT id FROM team_members WHERE email = 'joaolealjunior21@gmail.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Kyle Talbot'), (SELECT id FROM team_members WHERE email = 'austin.marks@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Kyle Talbot'), (SELECT id FROM team_members WHERE email = 'juanf.audiovisual@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Kyle Talbot'), (SELECT id FROM team_members WHERE email = 'erivelton.schmidt@knownlocal.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Kyle Talbot'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Kyle Talbot'), (SELECT id FROM team_members WHERE email = 'joaolealjunior21@gmail.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Maynard Wagner'), (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Maynard Wagner'), (SELECT id FROM team_members WHERE email = 'juanf.audiovisual@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Maynard Wagner'), (SELECT id FROM team_members WHERE email = 'mateus.silva@knownlocal.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Maynard Wagner'), (SELECT id FROM team_members WHERE email = 'marina@knownlocal.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Maynard Wagner'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Maynard Wagner'), (SELECT id FROM team_members WHERE email = 'bruno.ferreira@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Matt Oneill'), (SELECT id FROM team_members WHERE email = 'clayton.mclemore@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Matt Oneill'), (SELECT id FROM team_members WHERE email = 'joe.porter@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Matt Oneill'), (SELECT id FROM team_members WHERE email = 'collaborate.withmae@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Oyler Hines'), (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Oyler Hines'), (SELECT id FROM team_members WHERE email = 'juanf.audiovisual@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Oyler Hines'), (SELECT id FROM team_members WHERE email = 'erivelton.schmidt@knownlocal.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Oyler Hines'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Oyler Hines'), (SELECT id FROM team_members WHERE email = 'noor@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Raziel Ungar'), (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Raziel Ungar'), (SELECT id FROM team_members WHERE email = 'juanf.audiovisual@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Raziel Ungar'), (SELECT id FROM team_members WHERE email = 'nelsonjkf@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Raziel Ungar'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Raziel Ungar'), (SELECT id FROM team_members WHERE email = 'joaolealjunior21@gmail.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Wilson Leung'), (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Wilson Leung'), (SELECT id FROM team_members WHERE email = 'juanf.audiovisual@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Wilson Leung'), (SELECT id FROM team_members WHERE email = 'japc1994@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Wilson Leung'), (SELECT id FROM team_members WHERE email = 'alexwillsilva@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Wilson Leung'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Wilson Leung'), (SELECT id FROM team_members WHERE email = 'bruno.ferreira@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Matt Lunden'), (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Matt Lunden'), (SELECT id FROM team_members WHERE email = 'vitoraguilarbras@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Matt Lunden'), (SELECT id FROM team_members WHERE email = 'gabriel.borba.lopes@knownlocal.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Matt Lunden'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Matt Lunden'), (SELECT id FROM team_members WHERE email = 'bruno.ferreira@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Bern McGovern'), (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Bern McGovern'), (SELECT id FROM team_members WHERE email = 'zargalio87@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Bern McGovern'), (SELECT id FROM team_members WHERE email = 'akessiaandrade@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Bern McGovern'), (SELECT id FROM team_members WHERE email = 'alejandroramoscorral@gmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Bern McGovern'), (SELECT id FROM team_members WHERE email = 'joaolealjunior21@gmail.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Isayas Theodros'), (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Isayas Theodros'), (SELECT id FROM team_members WHERE email = 'zargalio87@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Isayas Theodros'), (SELECT id FROM team_members WHERE email = 'sabriigues@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Isayas Theodros'), (SELECT id FROM team_members WHERE email = 'alejandroramoscorral@gmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Isayas Theodros'), (SELECT id FROM team_members WHERE email = 'joaolealjunior21@gmail.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'John Sintich'), (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'John Sintich'), (SELECT id FROM team_members WHERE email = 'zargalio87@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'John Sintich'), (SELECT id FROM team_members WHERE email = 'amarumon1998@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'John Sintich'), (SELECT id FROM team_members WHERE email = 'alejandroramoscorral@gmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'John Sintich'), (SELECT id FROM team_members WHERE email = 'joaolealjunior21@gmail.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Michael McCall'), (SELECT id FROM team_members WHERE email = 'joe.porter@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Michael McCall'), (SELECT id FROM team_members WHERE email = 'collaborate.withmae@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Michael McCall'), (SELECT id FROM team_members WHERE email = 'bruno.ferreira@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Ryan Butler'), (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Ryan Butler'), (SELECT id FROM team_members WHERE email = 'zargalio87@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Ryan Butler'), (SELECT id FROM team_members WHERE email = 'andreaosioamaya@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Ryan Butler'), (SELECT id FROM team_members WHERE email = 'alejandroramoscorral@gmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Ryan Butler'), (SELECT id FROM team_members WHERE email = 'joaolealjunior21@gmail.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Scott Moe'), (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Scott Moe'), (SELECT id FROM team_members WHERE email = 'juanf.audiovisual@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Scott Moe'), (SELECT id FROM team_members WHERE email = 'mateus.silva@knownlocal.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Scott Moe'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Scott Moe'), (SELECT id FROM team_members WHERE email = 'bruno.ferreira@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Stephanie Cole Patterson'), (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Stephanie Cole Patterson'), (SELECT id FROM team_members WHERE email = 'alemanrique8@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Stephanie Cole Patterson'), (SELECT id FROM team_members WHERE email = 'nelsonjkf@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Stephanie Cole Patterson'), (SELECT id FROM team_members WHERE email = 'alejandroramoscorral@gmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Stephanie Cole Patterson'), (SELECT id FROM team_members WHERE email = 'joaolealjunior21@gmail.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Tiffany Pantozzi'), (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Tiffany Pantozzi'), (SELECT id FROM team_members WHERE email = 'alemanrique8@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Tiffany Pantozzi'), (SELECT id FROM team_members WHERE email = 'japc1994@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Tiffany Pantozzi'), (SELECT id FROM team_members WHERE email = 'alejandroramoscorral@gmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Tiffany Pantozzi'), (SELECT id FROM team_members WHERE email = 'joaolealjunior21@gmail.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Will Van Wickler'), (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Will Van Wickler'), (SELECT id FROM team_members WHERE email = 'alemanrique8@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Will Van Wickler'), (SELECT id FROM team_members WHERE email = 'amarumon1998@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Will Van Wickler'), (SELECT id FROM team_members WHERE email = 'alejandroramoscorral@gmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Will Van Wickler'), (SELECT id FROM team_members WHERE email = 'igor.marques@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'LID Levi Lascsak'), (SELECT id FROM team_members WHERE email = 'joe.porter@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'LID Levi Lascsak'), (SELECT id FROM team_members WHERE email = 'collaborate.withmae@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'LID Levi Lascsak'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'LID Levi Lascsak'), (SELECT id FROM team_members WHERE email = 'subhan@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'PP Levi Lascsak'), (SELECT id FROM team_members WHERE email = 'joe.porter@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'WHID Levi Lascsak'), (SELECT id FROM team_members WHERE email = 'joe.porter@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Real NoVA Network (Chris Colgan)'), (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Real NoVA Network (Chris Colgan)'), (SELECT id FROM team_members WHERE email = 'vitoraguilarbras@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Real NoVA Network (Chris Colgan)'), (SELECT id FROM team_members WHERE email = 'alejandroramoscorral@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Real NoVA Network (Chris Colgan)'), (SELECT id FROM team_members WHERE email = 'anderson.cirion.ruan@knownlocal.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Real NoVA Network (Chris Colgan)'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Real NoVA Network (Chris Colgan)'), (SELECT id FROM team_members WHERE email = 'bruno.ferreira@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Kristin Prough'), (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Kristin Prough'), (SELECT id FROM team_members WHERE email = 'alemanrique8@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Kristin Prough'), (SELECT id FROM team_members WHERE email = 'luisafernanda9608@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Kristin Prough'), (SELECT id FROM team_members WHERE email = 'japc1994@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Kristin Prough'), (SELECT id FROM team_members WHERE email = 'alejandroramoscorral@gmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Kristin Prough'), (SELECT id FROM team_members WHERE email = 'igor.marques@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Sean McConnell'), (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Sean McConnell'), (SELECT id FROM team_members WHERE email = 'juanf.audiovisual@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Sean McConnell'), (SELECT id FROM team_members WHERE email = 'andreaosioamaya@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Sean McConnell'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Sean McConnell'), (SELECT id FROM team_members WHERE email = 'bruno.ferreira@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Kyle Simmons'), (SELECT id FROM team_members WHERE email = 'joe.porter@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Kyle Simmons'), (SELECT id FROM team_members WHERE email = 'collaborate.withmae@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Kyle Simmons'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Alley Buscemi'), (SELECT id FROM team_members WHERE email = 'joe.porter@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Alley Buscemi'), (SELECT id FROM team_members WHERE email = 'collaborate.withmae@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Alley Buscemi'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Erik Throm'), (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Erik Throm'), (SELECT id FROM team_members WHERE email = 'zargalio87@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Erik Throm'), (SELECT id FROM team_members WHERE email = 'andreaosioamaya@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Erik Throm'), (SELECT id FROM team_members WHERE email = 'alejandroramoscorral@gmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Erik Throm'), (SELECT id FROM team_members WHERE email = 'joaolealjunior21@gmail.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Schmitz & Smith Group'), (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Schmitz & Smith Group'), (SELECT id FROM team_members WHERE email = 'zargalio87@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Schmitz & Smith Group'), (SELECT id FROM team_members WHERE email = 'sabriigues@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Schmitz & Smith Group'), (SELECT id FROM team_members WHERE email = 'alejandroramoscorral@gmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Schmitz & Smith Group'), (SELECT id FROM team_members WHERE email = 'joaolealjunior21@gmail.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Connie Van'), (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Connie Van'), (SELECT id FROM team_members WHERE email = 'vitoraguilarbras@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Connie Van'), (SELECT id FROM team_members WHERE email = 'alexwillsilva@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Connie Van'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Connie Van'), (SELECT id FROM team_members WHERE email = 'igor.marques@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Will Sawyer'), (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Will Sawyer'), (SELECT id FROM team_members WHERE email = 'juanf.audiovisual@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Will Sawyer'), (SELECT id FROM team_members WHERE email = 'luisafernanda9608@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Will Sawyer'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Will Sawyer'), (SELECT id FROM team_members WHERE email = 'bruno.ferreira@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Jadde Rowe'), (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Jadde Rowe'), (SELECT id FROM team_members WHERE email = 'vitoraguilarbras@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Jadde Rowe'), (SELECT id FROM team_members WHERE email = 'alexwillsilva@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Jadde Rowe'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Jadde Rowe'), (SELECT id FROM team_members WHERE email = 'joaolealjunior21@gmail.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'John Garuti'), (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'John Garuti'), (SELECT id FROM team_members WHERE email = 'zargalio87@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'John Garuti'), (SELECT id FROM team_members WHERE email = 'akessiaandrade@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'John Garuti'), (SELECT id FROM team_members WHERE email = 'alejandroramoscorral@gmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'John Garuti'), (SELECT id FROM team_members WHERE email = 'igor.marques@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Sarah Newman'), (SELECT id FROM team_members WHERE email = 'joe.porter@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Sarah Newman'), (SELECT id FROM team_members WHERE email = 'collaborate.withmae@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Gary Bradler'), (SELECT id FROM team_members WHERE email = 'joe.porter@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Gary Bradler'), (SELECT id FROM team_members WHERE email = 'collaborate.withmae@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Gary Bradler'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Tina Gamble'), (SELECT id FROM team_members WHERE email = 'austin.marks@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Tina Gamble'), (SELECT id FROM team_members WHERE email = 'juanf.audiovisual@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Tina Gamble'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Hannah Dubyne'), (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Hannah Dubyne'), (SELECT id FROM team_members WHERE email = 'alemanrique8@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Hannah Dubyne'), (SELECT id FROM team_members WHERE email = 'juliana.antonello@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Hannah Dubyne'), (SELECT id FROM team_members WHERE email = 'alejandroramoscorral@gmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Hannah Dubyne'), (SELECT id FROM team_members WHERE email = 'igor.marques@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Brandon - Development Channel'), (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Brandon - Development Channel'), (SELECT id FROM team_members WHERE email = 'vitoraguilarbras@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Brandon - Development Channel'), (SELECT id FROM team_members WHERE email = 'enodolectus@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Brandon - Development Channel'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Brandon - Development Channel'), (SELECT id FROM team_members WHERE email = 'joaolealjunior21@gmail.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Valerie Gonzalez'), (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Valerie Gonzalez'), (SELECT id FROM team_members WHERE email = 'alemanrique8@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Valerie Gonzalez'), (SELECT id FROM team_members WHERE email = 'william@vvsnet.us'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Valerie Gonzalez'), (SELECT id FROM team_members WHERE email = 'alejandroramoscorral@gmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Valerie Gonzalez'), (SELECT id FROM team_members WHERE email = 'joaolealjunior21@gmail.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Grant Irby'), (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Grant Irby'), (SELECT id FROM team_members WHERE email = 'zargalio87@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Grant Irby'), (SELECT id FROM team_members WHERE email = 'luisafernanda9608@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Grant Irby'), (SELECT id FROM team_members WHERE email = 'alejandroramoscorral@gmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Grant Irby'), (SELECT id FROM team_members WHERE email = 'joaolealjunior21@gmail.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Devin Sheehan'), (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Devin Sheehan'), (SELECT id FROM team_members WHERE email = 'zargalio87@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Devin Sheehan'), (SELECT id FROM team_members WHERE email = 'juliana.antonello@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Devin Sheehan'), (SELECT id FROM team_members WHERE email = 'alejandroramoscorral@gmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Devin Sheehan'), (SELECT id FROM team_members WHERE email = 'joaolealjunior21@gmail.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Gary Gold'), (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Gary Gold'), (SELECT id FROM team_members WHERE email = 'alemanrique8@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Gary Gold'), (SELECT id FROM team_members WHERE email = 'alejandroramoscorral@gmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Gary Gold'), (SELECT id FROM team_members WHERE email = 'joaolealjunior21@gmail.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Ryan Meeks'), (SELECT id FROM team_members WHERE email = 'joe.porter@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Ryan Meeks'), (SELECT id FROM team_members WHERE email = 'collaborate.withmae@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Ryan Meeks'), (SELECT id FROM team_members WHERE email = 'amarumon1998@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Ryan Meeks'), (SELECT id FROM team_members WHERE email = 'alejandroramoscorral@gmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Ryan Meeks - WHIP'), (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Ryan Meeks - WHIP'), (SELECT id FROM team_members WHERE email = 'collaborate.withmae@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Ryan Meeks - WHIP'), (SELECT id FROM team_members WHERE email = 'alejandroramoscorral@gmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Amy Shrader'), (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Amy Shrader'), (SELECT id FROM team_members WHERE email = 'alemanrique8@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Amy Shrader'), (SELECT id FROM team_members WHERE email = 'amarumon1998@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Amy Shrader'), (SELECT id FROM team_members WHERE email = 'alejandroramoscorral@gmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Amy Shrader'), (SELECT id FROM team_members WHERE email = 'joaolealjunior21@gmail.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'William Burton'), (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'William Burton'), (SELECT id FROM team_members WHERE email = 'alemanrique8@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'William Burton'), (SELECT id FROM team_members WHERE email = 'joaolealjunior21@gmail.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'German Hernandez'), (SELECT id FROM team_members WHERE email = 'vitoraguilarbras@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'German Hernandez'), (SELECT id FROM team_members WHERE email = 'bruno.ferreira@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Stephen Cooley'), (SELECT id FROM team_members WHERE email = 'austin.marks@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Stephen Cooley'), (SELECT id FROM team_members WHERE email = 'igor.marques@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Knwn Local'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Missy Yost'), (SELECT id FROM team_members WHERE email = 'joe.porter@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Missy Yost'), (SELECT id FROM team_members WHERE email = 'collaborate.withmae@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Arjun Dhingra'), (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Arjun Dhingra'), (SELECT id FROM team_members WHERE email = 'vitoraguilarbras@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Arjun Dhingra'), (SELECT id FROM team_members WHERE email = 'enodolectus@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Arjun Dhingra'), (SELECT id FROM team_members WHERE email = 'anderson.cirion.ruan@knownlocal.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Arjun Dhingra'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Arjun Dhingra'), (SELECT id FROM team_members WHERE email = 'bruno.ferreira@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'LFG Energy (Arjun Podcast)'), (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'LFG Energy (Arjun Podcast)'), (SELECT id FROM team_members WHERE email = 'vitoraguilarbras@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'LFG Energy (Arjun Podcast)'), (SELECT id FROM team_members WHERE email = 'enodolectus@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'LFG Energy (Arjun Podcast)'), (SELECT id FROM team_members WHERE email = 'marina@knownlocal.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'LFG Energy (Arjun Podcast)'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'LFG Energy (Arjun Podcast)'), (SELECT id FROM team_members WHERE email = 'bruno.ferreira@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Charity & Joe Slawter'), (SELECT id FROM team_members WHERE email = 'joe.porter@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Charity & Joe Slawter'), (SELECT id FROM team_members WHERE email = 'collaborate.withmae@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Charity & Joe Slawter'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Micah Bleecher'), (SELECT id FROM team_members WHERE email = 'joe.porter@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Micah Bleecher'), (SELECT id FROM team_members WHERE email = 'collaborate.withmae@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Lindsey Tronolone'), (SELECT id FROM team_members WHERE email = 'joe.porter@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Lindsey Tronolone'), (SELECT id FROM team_members WHERE email = 'collaborate.withmae@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Lindsey Tronolone'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Brad Thornton'), (SELECT id FROM team_members WHERE email = 'joe.porter@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Brad Thornton'), (SELECT id FROM team_members WHERE email = 'collaborate.withmae@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Brad Thornton'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Chris Schwarz'), (SELECT id FROM team_members WHERE email = 'joe.porter@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Chris Schwarz'), (SELECT id FROM team_members WHERE email = 'collaborate.withmae@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Chris Schwarz'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Sam Riddle'), (SELECT id FROM team_members WHERE email = 'joe.porter@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Sam Riddle'), (SELECT id FROM team_members WHERE email = 'collaborate.withmae@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Landin Smith'), (SELECT id FROM team_members WHERE email = 'joe.porter@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Landin Smith'), (SELECT id FROM team_members WHERE email = 'collaborate.withmae@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Landin Smith'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Adam Dow'), (SELECT id FROM team_members WHERE email = 'joe.porter@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Adam Dow'), (SELECT id FROM team_members WHERE email = 'collaborate.withmae@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Adam Dow'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Adam Dow'), (SELECT id FROM team_members WHERE email = 'subhan@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Blake Ginther'), (SELECT id FROM team_members WHERE email = 'joe.porter@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Blake Ginther'), (SELECT id FROM team_members WHERE email = 'collaborate.withmae@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Blake Ginther'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Blake Ginther'), (SELECT id FROM team_members WHERE email = 'subhan@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Jason & Brooke'), (SELECT id FROM team_members WHERE email = 'joe.porter@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Jason & Brooke'), (SELECT id FROM team_members WHERE email = 'collaborate.withmae@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Jason & Brooke'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Jason & Brooke'), (SELECT id FROM team_members WHERE email = 'subhan@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Sally Daley'), (SELECT id FROM team_members WHERE email = 'joe.porter@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Sally Daley'), (SELECT id FROM team_members WHERE email = 'collaborate.withmae@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Sally Daley'), (SELECT id FROM team_members WHERE email = 'subhan@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Marti Hampton'), (SELECT id FROM team_members WHERE email = 'joe.porter@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Marti Hampton'), (SELECT id FROM team_members WHERE email = 'collaborate.withmae@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Marti Hampton'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Marti Hampton'), (SELECT id FROM team_members WHERE email = 'subhan@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Justin Landis'), (SELECT id FROM team_members WHERE email = 'joe.porter@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Justin Landis'), (SELECT id FROM team_members WHERE email = 'goedi_prod@hotmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Mark Weinberg'), (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Mark Weinberg'), (SELECT id FROM team_members WHERE email = 'alemanrique8@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Mark Weinberg'), (SELECT id FROM team_members WHERE email = 'amarumon1998@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Mark Weinberg'), (SELECT id FROM team_members WHERE email = 'alejandroramoscorral@gmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Mark Weinberg'), (SELECT id FROM team_members WHERE email = 'igor.marques@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Matthew Hyde'), (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Matthew Hyde'), (SELECT id FROM team_members WHERE email = 'zargalio87@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Matthew Hyde'), (SELECT id FROM team_members WHERE email = 'luisafernanda9608@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Matthew Hyde'), (SELECT id FROM team_members WHERE email = 'alejandroramoscorral@gmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Matthew Hyde'), (SELECT id FROM team_members WHERE email = 'noor@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'The San Diego Scoop'), (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'The San Diego Scoop'), (SELECT id FROM team_members WHERE email = 'zargalio87@gmail.com'), 'manager')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'The San Diego Scoop'), (SELECT id FROM team_members WHERE email = 'akessiaandrade@gmail.com'), 'editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'The San Diego Scoop'), (SELECT id FROM team_members WHERE email = 'alejandroramoscorral@gmail.com'), 'senior_editor')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'The San Diego Scoop'), (SELECT id FROM team_members WHERE email = 'joaolealjunior21@gmail.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Alyssa Curran'), (SELECT id FROM team_members WHERE email = 'austin.marks@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Alyssa Curran'), (SELECT id FROM team_members WHERE email = 'igor.marques@knownlocal.com'), 'designer')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;
INSERT INTO client_assignments (client_id, team_member_id, assignment_role)
  VALUES ((SELECT id FROM clients WHERE name = 'Erin & Niki'), (SELECT id FROM team_members WHERE email = 'austin.marks@knownlocal.com'), 'strategist')
  ON CONFLICT (client_id, team_member_id, assignment_role) DO NOTHING;

-- Transaction managed by supabase db push