-- 003_seed.sql — Development seed data

-- Pods
INSERT INTO pods (name) VALUES ('Pod 1'), ('Pod 2'), ('Pod 3'), ('Pod 4');

-- Create admin auth user first in Supabase Dashboard → Auth → Users
-- Then link with:
-- INSERT INTO team_members (auth_user_id, first_name, last_name, email, role)
-- VALUES ('AUTH_USER_UUID', 'Admin', 'User', 'admin@knownlocal.com', 'admin');

-- Sample team members (no auth accounts — for testing display)
INSERT INTO team_members (first_name, last_name, email, role) VALUES
  ('Clayton', 'Test', 'clayton@test.com', 'strategist'),
  ('Paulo', 'Test', 'paulo@test.com', 'manager'),
  ('Maria', 'Test', 'maria@test.com', 'senior_writer'),
  ('Raj', 'Test', 'raj@test.com', 'senior_editor'),
  ('Tess', 'Test', 'tess@test.com', 'designer'),
  ('Marcus', 'Test', 'marcus@test.com', 'writer'),
  ('Sofia', 'Test', 'sofia@test.com', 'writer'),
  ('Leo', 'Test', 'leo@test.com', 'editor');

-- Assign strategist + manager to Pod 1
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
SELECT tm.id, p.id, true
FROM team_members tm, pods p
WHERE tm.email = 'clayton@test.com' AND p.name = 'Pod 1';

INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
SELECT tm.id, p.id, true
FROM team_members tm, pods p
WHERE tm.email = 'paulo@test.com' AND p.name = 'Pod 1';

-- Sample clients
INSERT INTO clients (name, market, status, pod_id) VALUES
  ('Acme Co', 'Chicago', 'active', (SELECT id FROM pods WHERE name = 'Pod 1')),
  ('BrightPath Media', 'Austin', 'active', (SELECT id FROM pods WHERE name = 'Pod 2')),
  ('GreenLeaf Health', 'Miami', 'onboarding', (SELECT id FROM pods WHERE name = 'Pod 1'));

-- Sample channels
INSERT INTO client_channels (client_id, channel_name, videos_per_week) VALUES
  ((SELECT id FROM clients WHERE name = 'Acme Co'), 'Acme Official', 2),
  ((SELECT id FROM clients WHERE name = 'Acme Co'), 'Acme Shorts', 1);
