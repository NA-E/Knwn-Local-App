-- Update Nourin's team_member role to admin
UPDATE team_members
SET role = 'admin'
WHERE first_name = 'Nourin'
  AND role = 'editor';
