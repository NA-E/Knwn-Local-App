-- Migration 014: Test projects for Module 3 team board verification
-- Creates 10 projects across different clients, statuses, and team members
-- NOTE: No BEGIN/COMMIT — supabase db push wraps each migration in its own transaction

-- ============================================================
-- Project 1: Austin Klar — scriptwriting (Writer board)
-- ============================================================
INSERT INTO projects (title, client_id, status, writer_id, editor_id, last_status_change_at, notes)
VALUES (
  'Top 5 Neighborhoods in San Francisco for Young Professionals',
  (SELECT id FROM clients WHERE name = 'Austin Klar'),
  'scriptwriting',
  (SELECT id FROM team_members WHERE email = 'alexwillsilva@gmail.com'),       -- Alex Silva (editor role, assigned as writer)
  (SELECT id FROM team_members WHERE email = 'nelsonjkf@gmail.com'),            -- Nelson Filho (editor)
  NOW() - INTERVAL '2 days',
  'Script due by end of week'
);

-- Status history for Project 1
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Top 5 Neighborhoods in San Francisco for Young Professionals'),
  NULL, 'idea',
  (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'),
  'Project created'
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Top 5 Neighborhoods in San Francisco for Young Professionals'),
  'idea', 'brief',
  (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'),
  'Brief completed'
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Top 5 Neighborhoods in San Francisco for Young Professionals'),
  'brief', 'scriptwriting',
  (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'),
  'Assigned to writer'
);

-- ============================================================
-- Project 2: Brandon Blankenship — fix_script (Writer board)
-- ============================================================
INSERT INTO projects (title, client_id, status, writer_id, editor_id, last_status_change_at, notes)
VALUES (
  'Moving to Naperville IL - Complete Guide 2026',
  (SELECT id FROM clients WHERE name = 'Brandon Blankenship'),
  'fix_script',
  (SELECT id FROM team_members WHERE email = 'anderson.cirion.ruan@knownlocal.com'),  -- Anderson (editor role, assigned as writer)
  (SELECT id FROM team_members WHERE email = 'gabriel.borba.lopes@knownlocal.com'),
  NOW() - INTERVAL '1 day',
  'Senior writer requested script revisions — tighten the hook'
);

INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Moving to Naperville IL - Complete Guide 2026'),
  NULL, 'idea',
  (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'),
  'Project created'
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Moving to Naperville IL - Complete Guide 2026'),
  'idea', 'brief',
  (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'),
  NULL
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Moving to Naperville IL - Complete Guide 2026'),
  'brief', 'scriptwriting',
  (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'),
  NULL
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Moving to Naperville IL - Complete Guide 2026'),
  'scriptwriting', 'review_script',
  (SELECT id FROM team_members WHERE email = 'anderson.cirion.ruan@knownlocal.com'),
  'First draft submitted'
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Moving to Naperville IL - Complete Guide 2026'),
  'review_script', 'fix_script',
  (SELECT id FROM team_members WHERE email = 'admin@knownlocal.com'),
  'Needs hook revision'
);

-- ============================================================
-- Project 3: Bern McGovern — editing (Editor board)
-- ============================================================
INSERT INTO projects (title, client_id, status, writer_id, editor_id, last_status_change_at, notes)
VALUES (
  'San Diego Hidden Gems - Local Favorites Only',
  (SELECT id FROM clients WHERE name = 'Bern McGovern'),
  'editing',
  (SELECT id FROM team_members WHERE email = 'sabriigues@gmail.com'),
  (SELECT id FROM team_members WHERE email = 'japc1994@gmail.com'),           -- Jorge Perez (editor)
  NOW() - INTERVAL '3 days',
  'Client uploaded raw footage — editing in progress'
);

INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'San Diego Hidden Gems - Local Favorites Only'),
  NULL, 'idea',
  (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'),
  'Project created'
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'San Diego Hidden Gems - Local Favorites Only'),
  'idea', 'brief',
  (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'),
  NULL
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'San Diego Hidden Gems - Local Favorites Only'),
  'brief', 'scriptwriting',
  (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'),
  NULL
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'San Diego Hidden Gems - Local Favorites Only'),
  'scriptwriting', 'review_script',
  (SELECT id FROM team_members WHERE email = 'sabriigues@gmail.com'),
  NULL
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'San Diego Hidden Gems - Local Favorites Only'),
  'review_script', 'script_ready_to_send',
  (SELECT id FROM team_members WHERE email = 'admin@knownlocal.com'),
  NULL
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'San Diego Hidden Gems - Local Favorites Only'),
  'script_ready_to_send', 'script_sent_to_client',
  (SELECT id FROM team_members WHERE email = 'zargalio87@gmail.com'),
  NULL
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'San Diego Hidden Gems - Local Favorites Only'),
  'script_sent_to_client', 'client_uploaded',
  (SELECT id FROM team_members WHERE email = 'zargalio87@gmail.com'),
  'Client uploaded footage'
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'San Diego Hidden Gems - Local Favorites Only'),
  'client_uploaded', 'editing',
  (SELECT id FROM team_members WHERE email = 'japc1994@gmail.com'),
  'Started editing'
);

-- ============================================================
-- Project 4: John Sintich — ready_for_internal_review (Editor board / Senior Editor board)
-- ============================================================
INSERT INTO projects (title, client_id, status, writer_id, editor_id, last_status_change_at, notes)
VALUES (
  'South Chicago Suburbs - Best School Districts 2026',
  (SELECT id FROM clients WHERE name = 'John Sintich'),
  'ready_for_internal_review',
  (SELECT id FROM team_members WHERE email = 'japc1994@gmail.com'),
  (SELECT id FROM team_members WHERE email = 'sabriigues@gmail.com'),          -- Sabrina (editor)
  NOW() - INTERVAL '1 day',
  'V1 edit complete, ready for senior editor review'
);

INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'South Chicago Suburbs - Best School Districts 2026'),
  NULL, 'idea',
  (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'),
  'Project created'
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'South Chicago Suburbs - Best School Districts 2026'),
  'idea', 'brief',
  (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'),
  NULL
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'South Chicago Suburbs - Best School Districts 2026'),
  'brief', 'scriptwriting',
  (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'),
  NULL
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'South Chicago Suburbs - Best School Districts 2026'),
  'scriptwriting', 'review_script',
  (SELECT id FROM team_members WHERE email = 'japc1994@gmail.com'),
  NULL
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'South Chicago Suburbs - Best School Districts 2026'),
  'review_script', 'script_ready_to_send',
  (SELECT id FROM team_members WHERE email = 'admin@knownlocal.com'),
  NULL
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'South Chicago Suburbs - Best School Districts 2026'),
  'script_ready_to_send', 'script_sent_to_client',
  (SELECT id FROM team_members WHERE email = 'zargalio87@gmail.com'),
  NULL
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'South Chicago Suburbs - Best School Districts 2026'),
  'script_sent_to_client', 'client_uploaded',
  (SELECT id FROM team_members WHERE email = 'zargalio87@gmail.com'),
  NULL
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'South Chicago Suburbs - Best School Districts 2026'),
  'client_uploaded', 'editing',
  (SELECT id FROM team_members WHERE email = 'sabriigues@gmail.com'),
  NULL
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'South Chicago Suburbs - Best School Districts 2026'),
  'editing', 'ready_for_internal_review',
  (SELECT id FROM team_members WHERE email = 'sabriigues@gmail.com'),
  'V1 edit submitted for review'
);

-- ============================================================
-- Project 5: Chris Colgan — script_ready_to_send (Manager board)
-- ============================================================
INSERT INTO projects (title, client_id, status, writer_id, editor_id, last_status_change_at, notes)
VALUES (
  'Northern Virginia Real Estate Market Update - Spring 2026',
  (SELECT id FROM clients WHERE name = 'Chris Colgan'),
  'script_ready_to_send',
  (SELECT id FROM team_members WHERE email = 'alexwillsilva@gmail.com'),
  (SELECT id FROM team_members WHERE email = 'nelsonjkf@gmail.com'),
  NOW() - INTERVAL '4 hours',
  'Script approved by senior writer — ready for manager to send to client'
);

INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Northern Virginia Real Estate Market Update - Spring 2026'),
  NULL, 'idea',
  (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'),
  'Project created'
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Northern Virginia Real Estate Market Update - Spring 2026'),
  'idea', 'brief',
  (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'),
  NULL
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Northern Virginia Real Estate Market Update - Spring 2026'),
  'brief', 'scriptwriting',
  (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'),
  NULL
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Northern Virginia Real Estate Market Update - Spring 2026'),
  'scriptwriting', 'review_script',
  (SELECT id FROM team_members WHERE email = 'alexwillsilva@gmail.com'),
  NULL
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Northern Virginia Real Estate Market Update - Spring 2026'),
  'review_script', 'script_ready_to_send',
  (SELECT id FROM team_members WHERE email = 'admin@knownlocal.com'),
  'Approved by senior writer'
);

-- ============================================================
-- Project 6: Ryan Butler — edit_ready_to_send (Manager board)
-- ============================================================
INSERT INTO projects (title, client_id, status, writer_id, editor_id, last_status_change_at, notes)
VALUES (
  'Washington DC First-Time Homebuyer Guide',
  (SELECT id FROM clients WHERE name = 'Ryan Butler'),
  'edit_ready_to_send',
  (SELECT id FROM team_members WHERE email = 'sabriigues@gmail.com'),
  (SELECT id FROM team_members WHERE email = 'japc1994@gmail.com'),
  NOW() - INTERVAL '6 hours',
  'Edit approved by senior editor — manager needs to send to client'
);

INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Washington DC First-Time Homebuyer Guide'),
  NULL, 'idea',
  (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'),
  'Project created'
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Washington DC First-Time Homebuyer Guide'),
  'idea', 'brief',
  (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'),
  NULL
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Washington DC First-Time Homebuyer Guide'),
  'brief', 'scriptwriting',
  (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'),
  NULL
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Washington DC First-Time Homebuyer Guide'),
  'scriptwriting', 'review_script',
  (SELECT id FROM team_members WHERE email = 'sabriigues@gmail.com'),
  NULL
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Washington DC First-Time Homebuyer Guide'),
  'review_script', 'script_ready_to_send',
  (SELECT id FROM team_members WHERE email = 'admin@knownlocal.com'),
  NULL
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Washington DC First-Time Homebuyer Guide'),
  'script_ready_to_send', 'script_sent_to_client',
  (SELECT id FROM team_members WHERE email = 'zargalio87@gmail.com'),
  NULL
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Washington DC First-Time Homebuyer Guide'),
  'script_sent_to_client', 'client_uploaded',
  (SELECT id FROM team_members WHERE email = 'zargalio87@gmail.com'),
  NULL
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Washington DC First-Time Homebuyer Guide'),
  'client_uploaded', 'editing',
  (SELECT id FROM team_members WHERE email = 'japc1994@gmail.com'),
  NULL
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Washington DC First-Time Homebuyer Guide'),
  'editing', 'ready_for_internal_review',
  (SELECT id FROM team_members WHERE email = 'japc1994@gmail.com'),
  NULL
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Washington DC First-Time Homebuyer Guide'),
  'ready_for_internal_review', 'edit_ready_to_send',
  (SELECT id FROM team_members WHERE email = 'alejandroramoscorral@gmail.com'),
  'Approved by senior editor'
);

-- ============================================================
-- Project 7: Scott Moe — review_script (Senior Writer board)
-- ============================================================
INSERT INTO projects (title, client_id, status, writer_id, editor_id, last_status_change_at, notes)
VALUES (
  'Living in British Columbia - Cost of Living Breakdown',
  (SELECT id FROM clients WHERE name = 'Scott Moe'),
  'review_script',
  (SELECT id FROM team_members WHERE email = 'nelsonjkf@gmail.com'),           -- Nelson Filho (writer)
  (SELECT id FROM team_members WHERE email = 'erivelton.schmidt@knownlocal.com'),
  NOW() - INTERVAL '12 hours',
  'First draft submitted — awaiting senior writer review'
);

INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Living in British Columbia - Cost of Living Breakdown'),
  NULL, 'idea',
  (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'),
  'Project created'
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Living in British Columbia - Cost of Living Breakdown'),
  'idea', 'brief',
  (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'),
  NULL
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Living in British Columbia - Cost of Living Breakdown'),
  'brief', 'scriptwriting',
  (SELECT id FROM team_members WHERE email = 'blythe.miller@knownlocal.com'),
  NULL
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Living in British Columbia - Cost of Living Breakdown'),
  'scriptwriting', 'review_script',
  (SELECT id FROM team_members WHERE email = 'nelsonjkf@gmail.com'),
  'First draft ready for review'
);

-- ============================================================
-- Project 8: Stephanie Cole Patterson — review_script (Senior Writer board)
-- ============================================================
INSERT INTO projects (title, client_id, status, writer_id, editor_id, last_status_change_at, notes)
VALUES (
  'Alpharetta GA vs Milton GA - Which is Right for You?',
  (SELECT id FROM clients WHERE name = 'Stephanie Cole Patterson'),
  'review_script',
  (SELECT id FROM team_members WHERE email = 'gabriel.borba.lopes@knownlocal.com'),
  (SELECT id FROM team_members WHERE email = 'juliana.antonello@gmail.com'),
  NOW() - INTERVAL '8 hours',
  'Script submitted — comparison format, needs senior writer sign-off'
);

INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Alpharetta GA vs Milton GA - Which is Right for You?'),
  NULL, 'idea',
  (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'),
  'Project created'
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Alpharetta GA vs Milton GA - Which is Right for You?'),
  'idea', 'brief',
  (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'),
  NULL
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Alpharetta GA vs Milton GA - Which is Right for You?'),
  'brief', 'scriptwriting',
  (SELECT id FROM team_members WHERE email = 'noah@knwnlocal.com'),
  NULL
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Alpharetta GA vs Milton GA - Which is Right for You?'),
  'scriptwriting', 'review_script',
  (SELECT id FROM team_members WHERE email = 'gabriel.borba.lopes@knownlocal.com'),
  'Draft submitted for review'
);

-- ============================================================
-- Project 9: Matt Oneill — brief (Strategist board)
-- ============================================================
INSERT INTO projects (title, client_id, status, writer_id, editor_id, last_status_change_at, notes)
VALUES (
  'Charleston SC Waterfront Properties - What to Know Before Buying',
  (SELECT id FROM clients WHERE name = 'Matt Oneill'),
  'brief',
  NULL,
  NULL,
  NOW() - INTERVAL '1 day',
  'Brief in progress — researching waterfront property regulations'
);

INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Charleston SC Waterfront Properties - What to Know Before Buying'),
  NULL, 'idea',
  (SELECT id FROM team_members WHERE email = 'joe.porter@knownlocal.com'),
  'Project created'
);
INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Charleston SC Waterfront Properties - What to Know Before Buying'),
  'idea', 'brief',
  (SELECT id FROM team_members WHERE email = 'joe.porter@knownlocal.com'),
  'Moving to brief stage'
);

-- ============================================================
-- Project 10: Kyle Talbot — idea (Strategist board)
-- ============================================================
INSERT INTO projects (title, client_id, status, writer_id, editor_id, last_status_change_at, notes)
VALUES (
  'Kansas City BBQ Trail - A Locals Guide',
  (SELECT id FROM clients WHERE name = 'Kyle Talbot'),
  'idea',
  NULL,
  NULL,
  NOW() - INTERVAL '3 days',
  'Topic approved in client call — needs brief'
);

INSERT INTO project_status_history (project_id, from_status, to_status, changed_by, notes)
VALUES (
  (SELECT id FROM projects WHERE title = 'Kansas City BBQ Trail - A Locals Guide'),
  NULL, 'idea',
  (SELECT id FROM team_members WHERE email = 'austin.marks@knownlocal.com'),
  'Project created'
);
