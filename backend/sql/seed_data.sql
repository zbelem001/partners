-- ==================================================================================
-- SCRIPT DE DONNÉES DE TEST (SEEDING) - PARTNERS 2iE
-- Compatible: PostgreSQL
-- ==================================================================================

-- Vider les tables existantes (ordre inverse des dépendances)
DELETE FROM milestones;
DELETE FROM workflow_steps;
DELETE FROM partenariats;
DELETE FROM conventions;
DELETE FROM partners;
DELETE FROM prospects;
DELETE FROM "user";

-- ==================================================================================
-- 0. USERS (Utilisateurs)
-- ==================================================================================
INSERT INTO "user" (
    "id", "employeeId", "firstName", "lastName", "email", "role", 
    "department", "status", "passwordHash", "phone", "createdAt"
) VALUES
(1, 'EMP001', 'Jean', 'Dupont', 'srecip@2ie.edu', 'SRECIP', 'Relations Internationales', 'Active', 'hash_placeholder', NULL, NOW()),
(2, 'EMP002', 'Marie', 'Curie', 'dfc@2ie.edu', 'DFC', 'Finance', 'Active', 'hash_placeholder', NULL, NOW()),
(3, 'EMP003', 'Albert', 'Einstein', 'caq@2ie.edu', 'CAQ', 'Qualité', 'Active', 'hash_placeholder', NULL, NOW()),
(4, 'EMP004', 'Nelson', 'Mandela', 'dg@2ie.edu', 'DG', 'Direction Générale', 'Active', 'hash_placeholder', NULL, NOW()),
(5, 'EMP005', 'Admin', 'Super', 'admin@2ie.edu', 'Admin', 'IT', 'Active', 'hash_placeholder', NULL, NOW()),
(6, 'ADMIN001', 'Zakaria', 'BELEM', 'zakaria.belem@2ie-edu.org', 'Admin', 'IT', 'Active', '$2b$10$ecvmvtV1HynS8aK8YUJ4k.FE7C5g494kF6us2CE1W/Sa4gM5/MmAO', '54884207', NOW());

-- Reset sequence for user id to avoid conflicts with future inserts
SELECT setval('user_id_seq', (SELECT MAX(id) FROM "user"));

-- ==================================================================================
-- 1. PROSPECTS (Candidatures de partenariat)
-- ==================================================================================
INSERT INTO "prospects" (
    "id", "reference", "companyName", "type", "sector", "country", "city", 
    "creationYear", "website", "contactName", "email", "phone", "position", 
    "description", "motivation", "collaborationAreas", "agreementType", 
    "estimatedBudget", "deadline", "priority", "status", "submissionDate", "reviewNotes"
) VALUES 
(
    '11111111-1111-1111-1111-111111111111', 'PR-2026-001', 'Tech Innov Africa', 'Entreprise', 
    'Technologies', 'Sénégal', 'Dakar', 2018, 'https://techinnov.sn', 
    'Moussa Diop', 'moussa.diop@techinnov.sn', '+221 77 123 45 67', 'Directeur Général',
    'Leader dans la transformation digitale en Afrique de l''Ouest.',
    'Nous souhaitons collaborer avec 2iE pour recruter des ingénieurs talentueux et développer des projets IoT communs.',
    'Recherche & Innovation, Stages & Emploi', 'Cadre', '10000000 FCFA', 'Moyen', 'High',
    'pending', NOW(), NULL
),
(
    '22222222-2222-2222-2222-222222222222', 'PR-2026-002', 'Green Energy Solutions', 'Industriel',
    'Énergie Renouvelable', 'Côte d''Ivoire', 'Abidjan', 2015, 'https://greenenergy.ci',
    'Sophie Kouassi', 'contact@greenenergy.ci', '+225 07 08 09 10', 'DRH',
    'Fournisseur de solutions solaires pour les zones rurales.',
    'Intéressés par la formation continue de nos techniciens via les programmes 2iE.',
    'Formation Continue', 'Specifique', '5000000 FCFA', 'Urgent', 'Medium',
    'Reviewed', NOW() - INTERVAL '2 days', 'Dossier complet, à qualifier.'
),
(
    '33333333-3333-3333-3333-333333333333', 'PR-2026-003', 'Université de Ouagadougou', 'Académique',
    'Enseignement Supérieur', 'Burkina Faso', 'Ouagadougou', 1974, 'https://ujkz.bf',
    'Pr. Jean Kaboré', 'jean.kabore@ujkz.bf', '+226 25 30 11 11', 'Recteur',
    'Université publique majeure du Burkina Faso.',
    'Renouvellement de notre accord de mobilité étudiante et professorale.',
    'Recherche, Mobilité', 'Cadre', NULL, 'Moyen', 'High',
    'Qualified', NOW() - INTERVAL '10 days', 'Partenaire historique, validation rapide recommandée.'
);

-- ==================================================================================
-- 2. PARTNERS (Partenaires Actifs)
-- ==================================================================================
INSERT INTO "partners" (
    "id", "ref", "name", "type", "country", "domain", 
    "status", "email", "website", "prospectId", "createdAt"
) VALUES 
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'P-2025-042', 'TotalEnergies Burkina', 'Industriel', 'Burkina Faso', 
    'Énergie', 'Active', 'contact@totalenergies.bf', 'https://totalenergies.bf', NULL, NOW() - INTERVAL '1 year'
),
(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'P-2024-015', 'WaterAid International', 'ONG', 'Royaume-Uni', 
    'Eau & Assainissement', 'Active', 'partnerships@wateraid.org', 'https://wateraid.org', NULL, NOW() - INTERVAL '2 years'
),
(
    'cccccccc-cccc-cccc-cccc-cccccccccccc', 'P-2026-001', 'SONABEL', 'Institutionnel', 'Burkina Faso', 
    'Électricité', 'Siengning', 'info@sonabel.bf', 'https://sonabel.bf', NULL, NOW() - INTERVAL '1 month'
);

-- ==================================================================================
-- 3. CONVENTIONS (Accords Juridiques)
-- ==================================================================================
INSERT INTO "conventions" (
    "id", "ref", "partnerId", "type", "objectives", "status", 
    "startDate", "endDate", "progress", "createdAt"
) VALUES 
(
    'dddddddd-dddd-dddd-dddd-dddddddddddd', 'CONV-2025-T01', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Accord Cadre',
    'Collaboration globale sur la recherche en biocarburants et stages étudiants.', 'Active',
    '2025-01-01', '2028-12-31', 25, NOW() - INTERVAL '1 year'
),
(
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'CONV-2024-W01', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Accord Spécifique',
    'Projet d''adduction d''eau potable dans la région du Centre-Nord.', 'Active',
    '2024-06-01', '2026-06-01', 60, NOW() - INTERVAL '18 months'
),
(
    'ffffffff-ffff-ffff-ffff-ffffffffffff', 'CONV-2026-S01', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Avenant',
    'Extension de la convention cadre pour inclure le volet solaire photovoltaïque.', 'Draft',
    '2026-03-01', '2027-03-01', 0, NOW()
);

-- ==================================================================================
-- 4. PARTENARIATS (Projets/Actions spécifiques)
-- ==================================================================================
INSERT INTO "partenariats" (
    "id", "conventionId", "title", "domain", "budget", "currency", 
    "status", "description"
) VALUES 
(
    '11111111-1111-1111-1111-11111111111a', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Programme Stages 2025', 
    'Formation', 0, 'XOF', 'Ongoing', 'Accueil de 15 stagiaires PFE sur les sites miniers.'
),
(
    '22222222-2222-2222-2222-22222222222b', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Recherche Biomasse', 
    'Recherche', 15000000, 'XOF', 'Planned', 'Étude de faisabilité pour la valorisation des déchets agricoles.'
),
(
    '33333333-3333-3333-3333-33333333333c', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Forages Kaya', 
    'Eau', 75000000, 'XOF', 'Ongoing', 'Réalisation de 10 forages équipés de pompes solaires.'
);

-- ==================================================================================
-- 5. WORKFLOW_STEPS (Circuit de validation pour CONV-2026-S01)
-- ==================================================================================
-- Convention 'ffffffff...' est en Draft, simulons un workflow en cours
INSERT INTO "workflow_steps" (
    "conventionId", "stepOrder", "label", "status", "completedAt", "assignedTo"
) VALUES 
(
    'ffffffff-ffff-ffff-ffff-ffffffffffff', 1, 'Validation SRECIP', 'Completed', NOW() - INTERVAL '1 day', 1
),
(
    'ffffffff-ffff-ffff-ffff-ffffffffffff', 2, 'Validation DFC', 'Current', NULL, 2
),
(
    'ffffffff-ffff-ffff-ffff-ffffffffffff', 3, 'Validation CAQ', 'Pending', NULL, 3
),
(
    'ffffffff-ffff-ffff-ffff-ffffffffffff', 4, 'Validation DG', 'Pending', NULL, 4
);

-- ==================================================================================
-- 6. MILESTONES (Jalons / Échéances)
-- ==================================================================================
INSERT INTO "milestones" (
    "conventionId", "title", "dueDate", "status", "type", "alertSent"
) VALUES 
(
    'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Rapport Annuel 2025', '2025-12-15', 'Completed', 'Livrable', TRUE
),
(
    'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Comité de Pilotage S1 2026', '2026-06-30', 'Pending', 'Rencontre', FALSE
),
(
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Fin des travaux forage 1-5', '2026-02-28', 'Pending', 'Livrable', FALSE
),
(
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Paiement Tranche 2', '2026-03-15', 'Pending', 'Paiement', FALSE
);
