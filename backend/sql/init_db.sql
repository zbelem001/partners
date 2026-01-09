-- ==================================================================================
-- SCRIPT DE CRÉATION DE LA BASE DE DONNÉES - PARTNERS 2iE PROJECT
-- Compatible: PostgreSQL
-- Scope: Modules 1 à 8 (Prospects, Partenaires, Conventions, Projets, Documents, etc.)
-- ==================================================================================

-- Activation de l'extension pour les UUIDs (Nécessaire pour PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLE UTILISATEURS (ADMINISTRATION)
-- Gère les accès au Backoffice (Admin, Direction, Managers)
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "employeeId" VARCHAR(50) UNIQUE,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "role" VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'SRECIP', 'DFC', 'CAQ', 'DG', 'Manager', 'User', 'Viewer')),
    "department" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(50),
    "bio" TEXT,
    "status" VARCHAR(50) DEFAULT 'Active',
    "passwordHash" VARCHAR(255),
    "lastLogin" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLE PROSPECTS (PORTAIL PUBLIC)
-- Enregistre les demandes de partenariat soumises via le formulaire public
CREATE TABLE "prospects" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "reference" VARCHAR(50) UNIQUE NOT NULL, -- Ex: PR-2026-001
    "companyName" VARCHAR(255) NOT NULL,
    "type" VARCHAR(50), -- Académique, Recherche, Industriel, Institutionnel, ONG
    "sector" VARCHAR(100),
    "country" VARCHAR(100),
    "city" VARCHAR(100),
    "creationYear" INTEGER,
    "website" VARCHAR(255),
    "contactName" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50),
    "position" VARCHAR(100), -- Fonction/poste du contact
    "description" TEXT,
    "motivation" TEXT, -- Description détaillée du projet de partenariat (min 50 caractères)
    "collaborationAreas" VARCHAR(255), -- Axes d'intérêt (Recherche, Formation, Stages...)
    "agreementType" VARCHAR(50), -- Cadre, Specifique, Inconnu
    "estimatedBudget" VARCHAR(100),
    "deadline" VARCHAR(50), -- Urgent, Moyen, Long
    "priority" VARCHAR(50) DEFAULT 'Medium',
    "status" VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'Reviewed', 'Qualified', 'Rejected')),
    "submissionDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "reviewNotes" TEXT
);

-- 3. TABLE PARTENAIRES (RÉPERTOIRE)
-- Les prospects validés deviennent des partenaires
CREATE TABLE "partners" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "ref" VARCHAR(50) UNIQUE NOT NULL, -- Ex: P-2026-001
    "name" VARCHAR(255) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "country" VARCHAR(100) NOT NULL,
    "domain" VARCHAR(100),
    "status" VARCHAR(50) DEFAULT 'Active',
    "email" VARCHAR(255),
    "website" VARCHAR(255),
    "logoUrl" VARCHAR(500),
    "prospectId" UUID REFERENCES "prospects"("id"), -- Lien vers l'origine
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABLE CONVENTIONS (CADRE JURIDIQUE)
-- Lien 1-N : Un Partenaire a plusieurs Conventions
CREATE TABLE "conventions" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "ref" VARCHAR(50) UNIQUE NOT NULL, -- Ex: CONV-2026-042
    "partnerId" UUID NOT NULL REFERENCES "partners"("id") ON DELETE CASCADE,
    "type" VARCHAR(100) NOT NULL, -- Accord Cadre, Spécifique, Avenant
    "objectives" TEXT,
    "status" VARCHAR(50) DEFAULT 'Draft',
    "startDate" DATE,
    "endDate" DATE,
    "progress" INTEGER DEFAULT 0, -- Pourcentage 0-100
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABLE PARTENARIATS (PROJETS SPÉCIFIQUES)
-- Lien 1-N : Une Convention contient plusieurs Partenariats (Projets/Actions)
-- Demande spécifique Module 4
CREATE TABLE "partenariats" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "conventionId" UUID NOT NULL REFERENCES "conventions"("id") ON DELETE CASCADE,
    "title" VARCHAR(255) NOT NULL, -- Ex: "Programme Bourses 2026"
    "domain" VARCHAR(100), -- Recherche, Formation...
    "budget" DECIMAL(15, 2),
    "currency" VARCHAR(10) DEFAULT 'XOF',
    "status" VARCHAR(50) DEFAULT 'Planned',
    "description" TEXT
);

-- 6. TABLE WORKFLOW (CYCLE DE VIE)
-- Suit les étapes de validation d'une convention (Rédaction -> Signature)
CREATE TABLE "workflow_steps" (
    "id" SERIAL PRIMARY KEY,
    "conventionId" UUID NOT NULL REFERENCES "conventions"("id") ON DELETE CASCADE,
    "stepOrder" INTEGER NOT NULL,
    "label" VARCHAR(100) NOT NULL, -- Ex: "Validation Juridique", "Signature DG"
    "status" VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Current', 'Completed')),
    "completedAt" TIMESTAMP,
    "assignedTo" INTEGER REFERENCES "user"("id") -- Qui doit valider ?
);

-- 7. TABLE DOCUMENTS (GED / MODULE 6)
-- Centralise les fichiers PDF, DOCX etc.
CREATE TABLE "documents" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "type" VARCHAR(10) NOT NULL, -- PDF, DOCX...
    "size" VARCHAR(50),
    "url" VARCHAR(500) NOT NULL, -- Chemin de stockage
    "category" VARCHAR(50), -- Contrat, Rapport, Modèle
    "confidentialityLevel" VARCHAR(50) DEFAULT 'Interne',
    "uploadDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "ownerId" INTEGER REFERENCES "user"("id"),
    "conventionId" UUID REFERENCES "conventions"("id"), -- Lié à une convention ?
    "partnerId" UUID REFERENCES "partners"("id") -- Ou juste un partenaire ?
);

-- 8. TABLE JALONS / ALERTES (SUIVI ACTIVITÉS / MODULE 5)
-- Agenda des échéances importantes
CREATE TABLE "milestones" (
    "id" SERIAL PRIMARY KEY,
    "conventionId" UUID NOT NULL REFERENCES "conventions"("id"),
    "title" VARCHAR(255) NOT NULL,
    "dueDate" DATE NOT NULL,
    "status" VARCHAR(50) DEFAULT 'Pending', -- Pending, Completed, Late
    "type" VARCHAR(50), -- Rencontre, Livrable, Paiement
    "alertSent" BOOLEAN DEFAULT FALSE
);

-- Indexes pour la performance
CREATE INDEX idx_prospects_status ON "prospects"("status");
CREATE INDEX idx_partners_country ON "partners"("country");
CREATE INDEX idx_conventions_partner ON "conventions"("partnerId");
CREATE INDEX idx_partenariats_convention ON "partenariats"("conventionId");
CREATE INDEX idx_documents_refs ON "documents"("conventionId", "partnerId");
