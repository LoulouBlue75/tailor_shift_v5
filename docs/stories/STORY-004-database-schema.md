# STORY-004: Database Schema & Migrations

**Epic:** Infrastructure  
**Priority:** P0 (Blocker)  
**Story Points:** 13  
**Dependencies:** STORY-001

---

## User Story

En tant que **développeur backend**,  
Je veux **créer le schéma de base de données complet avec RLS**,  
Afin de **avoir une base de données sécurisée et structurée**.

---

## Acceptance Criteria

### ✅ AC1: Core Tables Created
- [ ] Table `profiles` créée avec trigger `handle_new_user()`
- [ ] Table `talents` créée
- [ ] Table `experience_blocks` créée
- [ ] Table `assessments` créée
- [ ] Table `brands` créée
- [ ] Table `stores` créée
- [ ] Table `opportunities` créée
- [ ] Table `matches` créée
- [ ] Table `learning_modules` créée
- [ ] Table `talent_learning_progress` créée

### ✅ AC2: Constraints & Relationships
- [ ] Foreign keys configurées
- [ ] CHECK constraints pour enums (role_level, store_tier, etc.)
- [ ] UNIQUE constraints (profile_id dans talents/brands)
- [ ] NOT NULL sur champs requis
- [ ] ON DELETE CASCADE/SET NULL appropriés

### ✅ AC3: Indexes
- [ ] Index sur `profiles.user_type`
- [ ] Index sur `talents.profile_id`
- [ ] Index sur `brands.profile_id`
- [ ] Index sur `experience_blocks.talent_id`
- [ ] Index sur `opportunities.brand_id`
- [ ] Index sur `matches.talent_id` et `matches.opportunity_id`
- [ ] Index sur `opportunities.status`

### ✅ AC4: RLS Policies
- [ ] RLS activé sur toutes les tables
- [ ] Policies `profiles`: users can view/update own
- [ ] Policies `talents`: own data only
- [ ] Policies `experience_blocks`: own talent's blocks
- [ ] Policies `assessments`: own assessments
- [ ] Policies `brands`: own data only
- [ ] Policies `stores`: own brand's stores
- [ ] Policies `opportunities`: 
  - Brands manage own
  - Talents view active only
- [ ] Policies `matches`: both parties can view

### ✅ AC5: Triggers & Functions
- [ ] `handle_new_user()` trigger function
- [ ] `updated_at` auto-update trigger (toutes les tables)
- [ ] `calculate_profile_completion()` function (optionnel V1)

### ✅ AC6: Seed Data
- [ ] MCS constants (role levels, tiers, divisions) documentés
- [ ] Learning modules de base (10-15 modules)
- [ ] Opportunity templates (10-15 templates)
- [ ] Test data pour dev (optionnel)

### ✅ AC7: Migration Files
- [ ] Migration initiale: `0001_initial_schema.sql`
- [ ] Migration RLS: `0002_rls_policies.sql`
- [ ] Migration seed: `0003_seed_data.sql`
- [ ] Migrations testées (up/down si applicable)

---

## Technical Implementation

### Migration Structure
```
supabase/
├── migrations/
│   ├── 0001_initial_schema.sql
│   ├── 0002_rls_policies.sql
│   └── 0003_seed_data.sql
└── seed.sql (development only)
```

### Sample: talents table
```sql
-- 0001_initial_schema.sql
CREATE TABLE talents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Identity
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  linkedin_url TEXT,
  
  -- Professional Identity
  current_role_level TEXT CHECK (current_role_level IN (
    'L1','L2','L3','L4','L5','L6','L7','L8'
  )),
  current_store_tier TEXT CHECK (current_store_tier IN (
    'T1','T2','T3','T4','T5'
  )),
  years_in_luxury INTEGER CHECK (years_in_luxury >= 0),
  current_maison TEXT,
  current_location TEXT,
  
  -- Divisions (array)
  divisions_expertise TEXT[] DEFAULT '{}',
  
  -- Career Preferences (JSONB)
  career_preferences JSONB DEFAULT '{
    "target_role_levels": [],
    "target_store_tiers": [],
    "target_divisions": [],
    "target_locations": [],
    "mobility": "local",
    "timeline": "passive"
  }',
  
  -- Compensation (never exposed)
  compensation_profile JSONB DEFAULT '{
    "current_base": null,
    "current_variable": null,
    "currency": "EUR",
    "expectations": null
  }',
  
  -- Assessment Summary
  assessment_summary JSONB DEFAULT '{
    "service_excellence": null,
    "clienteling": null,
    "operations": null,
    "leadership_signals": null,
    "version": null,
    "completed_at": null
  }',
  
  -- Profile Status
  onboarding_completed BOOLEAN DEFAULT FALSE,
  profile_completion_pct INTEGER DEFAULT 0 CHECK (
    profile_completion_pct >= 0 AND profile_completion_pct <= 100
  ),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(profile_id)
);

-- Index
CREATE INDEX idx_talents_profile_id ON talents(profile_id);
CREATE INDEX idx_talents_role_level ON talents(current_role_level);
CREATE INDEX idx_talents_onboarding ON talents(onboarding_completed);

-- Updated_at trigger
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON talents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Sample: RLS Policy
```sql
-- 0002_rls_policies.sql
ALTER TABLE talents ENABLE ROW LEVEL SECURITY;

-- Talents can view own data
CREATE POLICY "Talents can view own data"
  ON talents FOR SELECT
  USING (profile_id = auth.uid());

-- Talents can update own data
CREATE POLICY "Talents can update own data"
  ON talents FOR UPDATE
  USING (profile_id = auth.uid());

-- Talents can insert own data
CREATE POLICY "Talents can insert own data"
  ON talents FOR INSERT
  WITH CHECK (profile_id = auth.uid());
```

### Updated_at Function
```sql
-- Helper function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Seed Data: Learning Modules
```sql
-- 0003_seed_data.sql
INSERT INTO learning_modules (title, description, category, duration_minutes, difficulty, content_type, target_role_levels) VALUES
  (
    'Service Excellence Fundamentals',
    'Master the core principles of luxury service delivery',
    'service_excellence',
    30,
    'beginner',
    'video',
    ARRAY['L1','L2']
  ),
  (
    'Advanced Clienteling Techniques',
    'Build lasting relationships with VIC clients',
    'clienteling',
    45,
    'intermediate',
    'article',
    ARRAY['L2','L3','L4']
  ),
  (
    'Inventory Management Best Practices',
    'Optimize stock levels and reduce shrinkage',
    'operations',
    40,
    'intermediate',
    'exercise',
    ARRAY['L3','L4','L5']
  ),
  (
    'Leading High-Performance Teams',
    'Coaching and motivating luxury retail teams',
    'leadership',
    60,
    'advanced',
    'video',
    ARRAY['L4','L5','L6']
  )
  -- ... 10-15 total modules
;
```

---

## Validation Queries

Après migration, valider avec ces queries:

```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check RLS enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check policies exist
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check triggers
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';

-- Check indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename;
```

---

## Testing Requirements

### Automated Tests (SQL)
- [ ] INSERT test rows dans chaque table
- [ ] Vérifier constraints (erreurs attendues)
- [ ] Tester RLS: 
  - User A ne peut pas voir data de User B
  - Talent ne peut pas voir data Brand
- [ ] Vérifier cascades (DELETE profile → DELETE talent)
- [ ] Vérifier triggers (updated_at modifié automatiquement)

### Manual Tests
- [ ] Créer un talent via Supabase UI
- [ ] Créer un brand via Supabase UI
- [ ] Vérifier relations foreign keys
- [ ] Tester RLS depuis Supabase SQL Editor (avec différents users)

---

## TypeScript Types Generation

Après migration, générer types:

```bash
npx supabase gen types typescript --project-id <project-id> > lib/supabase/database.types.ts
```

- [ ] Types TypeScript générés
- [ ] Importés dans code
- [ ] Validation que types matchent schema

---

## Documentation

Créer `/docs/DATABASE.md` avec:
- Schema diagram (ERD)
- Tables description
- RLS policies explanation
- Common queries examples
- Migration workflow

---

## Definition of Done

- [ ] Toutes les tables créées
- [ ] RLS activé et policies testées
- [ ] Migrations appliquées sans erreur
- [ ] Seed data chargée
- [ ] TypeScript types générés
- [ ] Validation queries passées
- [ ] Documentation DATABASE.md créée
- [ ] Code reviewed
