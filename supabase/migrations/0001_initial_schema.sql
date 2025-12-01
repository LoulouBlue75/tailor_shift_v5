-- ============================================================================
-- TAILOR SHIFT V5 - INITIAL DATABASE SCHEMA
-- Migration: 0001_initial_schema.sql
-- ============================================================================

-- Helper function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PROFILES TABLE (extends auth.users)
-- ============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL CHECK (user_type IN ('talent', 'brand')),
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_user_type ON profiles(user_type);
CREATE INDEX idx_profiles_onboarding ON profiles(onboarding_completed);

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TRIGGER: Auto-create profile on auth.users insert
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, user_type, email, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'talent'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- TALENTS TABLE
-- ============================================================================
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
  profile_completion_pct INTEGER DEFAULT 0 CHECK (
    profile_completion_pct >= 0 AND profile_completion_pct <= 100
  ),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(profile_id)
);

CREATE INDEX idx_talents_profile_id ON talents(profile_id);
CREATE INDEX idx_talents_role_level ON talents(current_role_level);
CREATE INDEX idx_talents_location ON talents(current_location);

CREATE TRIGGER set_talents_updated_at
  BEFORE UPDATE ON talents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- EXPERIENCE BLOCKS TABLE
-- ============================================================================
CREATE TABLE experience_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id UUID NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
  
  -- Block Type
  block_type TEXT NOT NULL CHECK (block_type IN (
    'foh', 'boh', 'leadership', 'clienteling', 'operations', 'business'
  )),
  
  -- Position Details
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  brand_segment TEXT CHECK (brand_segment IN (
    'ultra_luxury', 'luxury', 'premium', 'accessible_luxury'
  )),
  division TEXT CHECK (division IN (
    'fashion', 'leather_goods', 'shoes', 'beauty', 'fragrance',
    'watches', 'high_jewelry', 'eyewear', 'accessories'
  )),
  store_tier TEXT CHECK (store_tier IN ('T1','T2','T3','T4','T5')),
  location TEXT,
  
  -- Duration
  start_date DATE NOT NULL,
  end_date DATE, -- NULL = current
  is_current BOOLEAN DEFAULT FALSE,
  
  -- Responsibilities & Achievements (JSONB)
  responsibilities TEXT[],
  achievements TEXT[],
  
  -- Skills demonstrated
  skills_demonstrated TEXT[],
  
  -- Team size (for leadership blocks)
  team_size INTEGER CHECK (team_size >= 0),
  
  -- Verification
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_experience_blocks_talent_id ON experience_blocks(talent_id);
CREATE INDEX idx_experience_blocks_type ON experience_blocks(block_type);
CREATE INDEX idx_experience_blocks_division ON experience_blocks(division);

CREATE TRIGGER set_experience_blocks_updated_at
  BEFORE UPDATE ON experience_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ASSESSMENTS TABLE
-- ============================================================================
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id UUID NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
  
  -- Assessment Version
  version TEXT NOT NULL DEFAULT 'v1',
  
  -- Scores (1-5 scale)
  service_excellence_score DECIMAL(3,2) CHECK (
    service_excellence_score >= 1 AND service_excellence_score <= 5
  ),
  clienteling_score DECIMAL(3,2) CHECK (
    clienteling_score >= 1 AND clienteling_score <= 5
  ),
  operations_score DECIMAL(3,2) CHECK (
    operations_score >= 1 AND operations_score <= 5
  ),
  leadership_score DECIMAL(3,2) CHECK (
    leadership_score >= 1 AND leadership_score <= 5
  ),
  
  -- Raw responses (JSONB)
  responses JSONB,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (
    status IN ('in_progress', 'completed', 'expired')
  ),
  
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_assessments_talent_id ON assessments(talent_id);
CREATE INDEX idx_assessments_status ON assessments(status);

CREATE TRIGGER set_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- BRANDS TABLE
-- ============================================================================
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Brand Identity
  name TEXT NOT NULL,
  segment TEXT CHECK (segment IN (
    'ultra_luxury', 'luxury', 'premium', 'accessible_luxury'
  )),
  parent_group TEXT, -- LVMH, Kering, Richemont, etc.
  
  -- Primary Division
  primary_division TEXT CHECK (primary_division IN (
    'fashion', 'leather_goods', 'shoes', 'beauty', 'fragrance',
    'watches', 'high_jewelry', 'eyewear', 'accessories'
  )),
  
  -- Additional divisions
  divisions TEXT[] DEFAULT '{}',
  
  -- Brand Details
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  
  -- Contact
  headquarters_location TEXT,
  
  -- Metadata
  verified BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(profile_id)
);

CREATE INDEX idx_brands_profile_id ON brands(profile_id);
CREATE INDEX idx_brands_segment ON brands(segment);
CREATE INDEX idx_brands_division ON brands(primary_division);

CREATE TRIGGER set_brands_updated_at
  BEFORE UPDATE ON brands
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STORES TABLE
-- ============================================================================
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  
  -- Store Identity
  name TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('T1','T2','T3','T4','T5')),
  
  -- Location
  address TEXT,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT CHECK (region IN ('EMEA', 'Americas', 'APAC', 'Middle_East')),
  
  -- Store Details
  store_size_sqm INTEGER CHECK (store_size_sqm > 0),
  team_size INTEGER CHECK (team_size > 0),
  
  -- Divisions offered
  divisions TEXT[] DEFAULT '{}',
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (
    status IN ('active', 'opening_soon', 'inactive')
  ),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stores_brand_id ON stores(brand_id);
CREATE INDEX idx_stores_tier ON stores(tier);
CREATE INDEX idx_stores_region ON stores(region);
CREATE INDEX idx_stores_city ON stores(city);

CREATE TRIGGER set_stores_updated_at
  BEFORE UPDATE ON stores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- OPPORTUNITIES TABLE
-- ============================================================================
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  
  -- Position Details
  title TEXT NOT NULL,
  role_level TEXT NOT NULL CHECK (role_level IN (
    'L1','L2','L3','L4','L5','L6','L7','L8'
  )),
  division TEXT CHECK (division IN (
    'fashion', 'leather_goods', 'shoes', 'beauty', 'fragrance',
    'watches', 'high_jewelry', 'eyewear', 'accessories'
  )),
  
  -- Requirements
  required_experience_years INTEGER CHECK (required_experience_years >= 0),
  required_languages TEXT[] DEFAULT '{}',
  required_skills TEXT[] DEFAULT '{}',
  
  -- Description
  description TEXT,
  responsibilities TEXT[],
  benefits TEXT[],
  
  -- Compensation Range (JSONB, never exposed to talents)
  compensation_range JSONB DEFAULT '{
    "min_base": null,
    "max_base": null,
    "variable_pct": null,
    "currency": "EUR"
  }',
  
  -- Matching Criteria (JSONB)
  matching_criteria JSONB DEFAULT '{
    "min_assessment_scores": {},
    "preferred_maisons": [],
    "preferred_divisions": [],
    "weight_overrides": {}
  }',
  
  -- Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (
    status IN ('draft', 'active', 'paused', 'filled', 'cancelled')
  ),
  
  -- Dates
  published_at TIMESTAMPTZ,
  deadline_at TIMESTAMPTZ,
  filled_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_opportunities_brand_id ON opportunities(brand_id);
CREATE INDEX idx_opportunities_store_id ON opportunities(store_id);
CREATE INDEX idx_opportunities_status ON opportunities(status);
CREATE INDEX idx_opportunities_role_level ON opportunities(role_level);
CREATE INDEX idx_opportunities_division ON opportunities(division);

CREATE TRIGGER set_opportunities_updated_at
  BEFORE UPDATE ON opportunities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MATCHES TABLE
-- ============================================================================
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id UUID NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  
  -- Match Score (0-100)
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  
  -- Score Breakdown (JSONB)
  score_breakdown JSONB DEFAULT '{
    "role_fit": 0,
    "experience_fit": 0,
    "division_fit": 0,
    "location_fit": 0,
    "assessment_fit": 0,
    "culture_fit": 0,
    "timing_fit": 0
  }',
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'talent_interested', 'brand_interested', 
               'mutual_interest', 'declined', 'expired')
  ),
  
  -- Actions
  talent_action TEXT CHECK (talent_action IN ('interested', 'declined', NULL)),
  talent_action_at TIMESTAMPTZ,
  brand_action TEXT CHECK (brand_action IN ('interested', 'declined', NULL)),
  brand_action_at TIMESTAMPTZ,
  
  -- Notes (internal)
  brand_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(talent_id, opportunity_id)
);

CREATE INDEX idx_matches_talent_id ON matches(talent_id);
CREATE INDEX idx_matches_opportunity_id ON matches(opportunity_id);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_score ON matches(score DESC);

CREATE TRIGGER set_matches_updated_at
  BEFORE UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- LEARNING MODULES TABLE
-- ============================================================================
CREATE TABLE learning_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Module Identity
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'service_excellence', 'clienteling', 'operations', 'leadership', 'product_knowledge'
  )),
  
  -- Content
  content_type TEXT NOT NULL CHECK (content_type IN (
    'video', 'article', 'exercise', 'quiz'
  )),
  content_url TEXT,
  duration_minutes INTEGER CHECK (duration_minutes > 0),
  
  -- Targeting
  target_role_levels TEXT[] DEFAULT '{}',
  target_divisions TEXT[] DEFAULT '{}',
  
  -- Difficulty
  difficulty TEXT NOT NULL CHECK (difficulty IN (
    'beginner', 'intermediate', 'advanced'
  )),
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (
    status IN ('draft', 'active', 'archived')
  ),
  
  -- Order
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_learning_modules_category ON learning_modules(category);
CREATE INDEX idx_learning_modules_difficulty ON learning_modules(difficulty);
CREATE INDEX idx_learning_modules_status ON learning_modules(status);

CREATE TRIGGER set_learning_modules_updated_at
  BEFORE UPDATE ON learning_modules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TALENT LEARNING PROGRESS TABLE
-- ============================================================================
CREATE TABLE talent_learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id UUID NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES learning_modules(id) ON DELETE CASCADE,
  
  -- Progress
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (
    status IN ('not_started', 'in_progress', 'completed')
  ),
  progress_pct INTEGER DEFAULT 0 CHECK (
    progress_pct >= 0 AND progress_pct <= 100
  ),
  
  -- Quiz Results (if applicable)
  quiz_score INTEGER CHECK (quiz_score >= 0 AND quiz_score <= 100),
  
  -- Timestamps
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(talent_id, module_id)
);

CREATE INDEX idx_talent_learning_talent_id ON talent_learning_progress(talent_id);
CREATE INDEX idx_talent_learning_module_id ON talent_learning_progress(module_id);
CREATE INDEX idx_talent_learning_status ON talent_learning_progress(status);

CREATE TRIGGER set_talent_learning_updated_at
  BEFORE UPDATE ON talent_learning_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
