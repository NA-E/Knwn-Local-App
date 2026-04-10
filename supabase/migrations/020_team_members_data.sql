-- 020_team_members_data.sql — New team members + phone updates
-- Reference: data-verification/team_members_verification.csv
-- Depends on 019 (virtual_assistant role, onboarding status, phone column)
-- NOTE: No BEGIN/COMMIT — supabase db push wraps each file in its own transaction


-- ═══════════ 1. Update phone numbers for existing members ═══════���═══

UPDATE team_members SET phone = '+57 312 369 8582' WHERE email = 'alemanrique8@gmail.com';
UPDATE team_members SET phone = '+59971529957' WHERE email = 'alejandroramoscorral@gmail.com';
UPDATE team_members SET phone = '11956374409' WHERE email = 'alexwillsilva@gmail.com';
UPDATE team_members SET phone = '+57 3208826629' WHERE email = 'amarumon1998@gmail.com';
UPDATE team_members SET phone = '+57 3012103350' WHERE email = 'andreaosioamaya@gmail.com';
UPDATE team_members SET phone = '(11) 9 4137-6738' WHERE email = 'goedi_prod@hotmail.com';
UPDATE team_members SET phone = '+55 84 99214-2192' WHERE email = 'evellyn-albuquerque@hotmail.com';
UPDATE team_members SET phone = '+573043281007' WHERE email = 'japc1994@gmail.com';
UPDATE team_members SET phone = '+5541997005505' WHERE email = 'joaolealjunior21@gmail.com';
UPDATE team_members SET phone = '55 53981242672' WHERE email = 'juliana.antonello@gmail.com';
UPDATE team_members SET phone = '+55 21 995849038' WHERE email = 'zargalio87@gmail.com';
UPDATE team_members SET phone = '+52 442 3459337' WHERE email = 'luisafernanda9608@gmail.com';
UPDATE team_members SET phone = '+55 48 991933167' WHERE email = 'nelsonjkf@gmail.com';
UPDATE team_members SET phone = '+55 51 98150-4442' WHERE email = 'enodolectus@gmail.com';
UPDATE team_members SET phone = '+55 (41) 9 9862-4957' WHERE email = 'sabriigues@gmail.com';
UPDATE team_members SET phone = '+55 11 913314224' WHERE email = 'vitoraguilarbras@gmail.com';


-- ════��══════ 2. Insert 20 new team members ═══════════
-- Members needing Paulo's input (4 missing names, 1 missing role, 4 DB-only verify)
-- will be handled in a follow-up migration.

-- Senior Writers (2)
INSERT INTO team_members (first_name, last_name, email, role, status, phone)
  VALUES ('Vivian', 'Vardasca', 'vivihamp@outlook.com', 'senior_writer', 'active', '+55 11 980908515')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role, phone = EXCLUDED.phone;

INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Rafael', 'Stiborski', 'rafaelstiborski@gmail.com', 'senior_writer', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;

-- Writers / Ghostwriters (3)
INSERT INTO team_members (first_name, last_name, email, role, status, phone)
  VALUES ('Gabriela', 'Aoki', 'aokigabriela@gmail.com', 'writer', 'active', '+5512997061995')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role, phone = EXCLUDED.phone;

INSERT INTO team_members (first_name, last_name, email, role, status, phone)
  VALUES ('Jessica', 'Gonzatto', 'jessicagonzattoo@yahoo.com.br', 'writer', 'active', '+55 54 991492319')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role, phone = EXCLUDED.phone;

INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Lívia', 'Russi', 'livia.russi@knownlocal.com', 'writer', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;

-- Managers (7)
INSERT INTO team_members (first_name, last_name, email, role, status, phone)
  VALUES ('Paulo', 'Folly', 'paulo.folly@gmail.com', 'manager', 'active', '+5541995033788')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role, phone = EXCLUDED.phone;

INSERT INTO team_members (first_name, last_name, email, role, status, phone)
  VALUES ('Dani', 'Moreno', 'daniela.morenog@hotmail.com', 'manager', 'active', '+57 3005282208')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role, phone = EXCLUDED.phone;

INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Beatriz', 'Salmaso', 'salmasobeatriz@gmail.com', 'manager', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;

INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Hannah', 'Lockhart', 'hannah@ellaemail.com', 'manager', 'onboarding')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role, status = EXCLUDED.status;

INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Laís', 'Fretin', 'lais@ellaemail.com', 'manager', 'onboarding')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role, status = EXCLUDED.status;

INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Behçet', 'Beyazçiçek', 'behcetbeyazcicek@gmail.com', 'manager', 'onboarding')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role, status = EXCLUDED.status;

INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Omar', 'Arif', 'omar@ellaemail.com', 'manager', 'onboarding')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role, status = EXCLUDED.status;

-- Editors (7)
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Andrés', 'Felipe', 'andres.felipe@vvsnet.us', 'editor', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;

INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Jonatan', 'Vargas', 'jovarav@gmail.com', 'editor', 'onboarding')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role, status = EXCLUDED.status;

INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Salazar', '', 'rafaelsalazar@outlook.com', 'editor', 'onboarding')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role, status = EXCLUDED.status;

INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Anna', 'Karpova', 'anna.karpova@knownlocal.com', 'editor', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;

INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Nikolai', 'Teimurazov', 'nikolai.teimurazov@knownlocal.com', 'editor', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;

INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Mahir', 'Ahmed', 'mahir.ahmed@knownlocal.com', 'editor', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;

INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Giuliana', 'Z', 'giuliana.z@knownlocal.com', 'editor', 'active')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role;

-- Virtual Assistant (1)
INSERT INTO team_members (first_name, last_name, email, role, status)
  VALUES ('Efiphanie', 'Abuyabor', 'efiphanie.abuyabor@knownlocal.com', 'virtual_assistant', 'onboarding')
  ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role, status = EXCLUDED.status;


-- ═══════════ 3. Pod assignments for new members ═══════════

-- Vivian Vardasca → POD 1 (primary), POD 2, POD 3
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'vivihamp@outlook.com'), (SELECT id FROM pods WHERE name = 'Pod 1'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'vivihamp@outlook.com'), (SELECT id FROM pods WHERE name = 'Pod 2'), false)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'vivihamp@outlook.com'), (SELECT id FROM pods WHERE name = 'Pod 3'), false)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;

-- Rafael Stiborski → POD 2 (primary), POD 3, POD 1
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'rafaelstiborski@gmail.com'), (SELECT id FROM pods WHERE name = 'Pod 2'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'rafaelstiborski@gmail.com'), (SELECT id FROM pods WHERE name = 'Pod 3'), false)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'rafaelstiborski@gmail.com'), (SELECT id FROM pods WHERE name = 'Pod 1'), false)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;

-- Gabriela Aoki → POD 2 (primary), POD 1, POD 3
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'aokigabriela@gmail.com'), (SELECT id FROM pods WHERE name = 'Pod 2'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'aokigabriela@gmail.com'), (SELECT id FROM pods WHERE name = 'Pod 1'), false)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'aokigabriela@gmail.com'), (SELECT id FROM pods WHERE name = 'Pod 3'), false)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;

-- Jessica Gonzatto → POD 1 (primary), POD 2, POD 3
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'jessicagonzattoo@yahoo.com.br'), (SELECT id FROM pods WHERE name = 'Pod 1'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'jessicagonzattoo@yahoo.com.br'), (SELECT id FROM pods WHERE name = 'Pod 2'), false)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'jessicagonzattoo@yahoo.com.br'), (SELECT id FROM pods WHERE name = 'Pod 3'), false)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;

-- Lívia Russi → POD 2 (primary), POD 3, POD 1
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'livia.russi@knownlocal.com'), (SELECT id FROM pods WHERE name = 'Pod 2'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'livia.russi@knownlocal.com'), (SELECT id FROM pods WHERE name = 'Pod 3'), false)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'livia.russi@knownlocal.com'), (SELECT id FROM pods WHERE name = 'Pod 1'), false)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;

-- Paulo Folly → POD 1
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'paulo.folly@gmail.com'), (SELECT id FROM pods WHERE name = 'Pod 1'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;

-- Dani Moreno → POD 1
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'daniela.morenog@hotmail.com'), (SELECT id FROM pods WHERE name = 'Pod 1'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;

-- Beatriz Salmaso → POD 2
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'salmasobeatriz@gmail.com'), (SELECT id FROM pods WHERE name = 'Pod 2'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;

-- Hannah Lockhart → ELLA
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'hannah@ellaemail.com'), (SELECT id FROM pods WHERE name = 'ELLA'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;

-- Laís Fretin → ELLA
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'lais@ellaemail.com'), (SELECT id FROM pods WHERE name = 'ELLA'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;

-- Behçet Beyazçiçek → ELLA
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'behcetbeyazcicek@gmail.com'), (SELECT id FROM pods WHERE name = 'ELLA'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;

-- Omar Arif → ELLA
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'omar@ellaemail.com'), (SELECT id FROM pods WHERE name = 'ELLA'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;

-- Andrés Felipe → POD 2 (primary), POD 4
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'andres.felipe@vvsnet.us'), (SELECT id FROM pods WHERE name = 'Pod 2'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'andres.felipe@vvsnet.us'), (SELECT id FROM pods WHERE name = 'Pod 4'), false)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;

-- Jonatan Vargas → POD 1
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'jovarav@gmail.com'), (SELECT id FROM pods WHERE name = 'Pod 1'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;

-- Salazar → POD 1
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'rafaelsalazar@outlook.com'), (SELECT id FROM pods WHERE name = 'Pod 1'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;

-- Anna Karpova → POD 2 (primary), POD 1
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'anna.karpova@knownlocal.com'), (SELECT id FROM pods WHERE name = 'Pod 2'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'anna.karpova@knownlocal.com'), (SELECT id FROM pods WHERE name = 'Pod 1'), false)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;

-- Nikolai Teimurazov → POD 1 (primary), POD 2
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'nikolai.teimurazov@knownlocal.com'), (SELECT id FROM pods WHERE name = 'Pod 1'), true)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
  VALUES ((SELECT id FROM team_members WHERE email = 'nikolai.teimurazov@knownlocal.com'), (SELECT id FROM pods WHERE name = 'Pod 2'), false)
  ON CONFLICT (team_member_id, pod_id) DO NOTHING;

-- No pod assignments for: Mahir Ahmed, Giuliana Z, Efiphanie Abuyabor (no pod in Notion)
