-- ============================================================================
-- TAILOR SHIFT V5 - ROW LEVEL SECURITY POLICIES
-- Migration: 0002_rls_policies.sql
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE talents ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_learning_progress ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================================
-- TALENTS POLICIES
-- ============================================================================

-- Talents can view their own data
CREATE POLICY "Talents can view own data"
  ON talents FOR SELECT
  USING (profile_id = auth.uid());

-- Talents can insert their own data
CREATE POLICY "Talents can insert own data"
  ON talents FOR INSERT
  WITH CHECK (profile_id = auth.uid());

-- Talents can update their own data
CREATE POLICY "Talents can update own data"
  ON talents FOR UPDATE
  USING (profile_id = auth.uid());

-- Brands can view talents they have matches with
CREATE POLICY "Brands can view matched talents"
  ON talents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM matches m
      JOIN opportunities o ON m.opportunity_id = o.id
      JOIN brands b ON o.brand_id = b.id
      WHERE m.talent_id = talents.id
      AND b.profile_id = auth.uid()
      AND m.status IN ('talent_interested', 'brand_interested', 'mutual_interest')
    )
  );

-- ============================================================================
-- EXPERIENCE BLOCKS POLICIES
-- ============================================================================

-- Talents can view own experience blocks
CREATE POLICY "Talents can view own experience blocks"
  ON experience_blocks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM talents t
      WHERE t.id = experience_blocks.talent_id
      AND t.profile_id = auth.uid()
    )
  );

-- Talents can insert own experience blocks
CREATE POLICY "Talents can insert own experience blocks"
  ON experience_blocks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM talents t
      WHERE t.id = experience_blocks.talent_id
      AND t.profile_id = auth.uid()
    )
  );

-- Talents can update own experience blocks
CREATE POLICY "Talents can update own experience blocks"
  ON experience_blocks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM talents t
      WHERE t.id = experience_blocks.talent_id
      AND t.profile_id = auth.uid()
    )
  );

-- Talents can delete own experience blocks
CREATE POLICY "Talents can delete own experience blocks"
  ON experience_blocks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM talents t
      WHERE t.id = experience_blocks.talent_id
      AND t.profile_id = auth.uid()
    )
  );

-- ============================================================================
-- ASSESSMENTS POLICIES
-- ============================================================================

-- Talents can view own assessments
CREATE POLICY "Talents can view own assessments"
  ON assessments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM talents t
      WHERE t.id = assessments.talent_id
      AND t.profile_id = auth.uid()
    )
  );

-- Talents can insert own assessments
CREATE POLICY "Talents can insert own assessments"
  ON assessments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM talents t
      WHERE t.id = assessments.talent_id
      AND t.profile_id = auth.uid()
    )
  );

-- Talents can update own assessments (in_progress only)
CREATE POLICY "Talents can update own assessments"
  ON assessments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM talents t
      WHERE t.id = assessments.talent_id
      AND t.profile_id = auth.uid()
    )
    AND status = 'in_progress'
  );

-- ============================================================================
-- BRANDS POLICIES
-- ============================================================================

-- Brands can view their own data
CREATE POLICY "Brands can view own data"
  ON brands FOR SELECT
  USING (profile_id = auth.uid());

-- Brands can insert their own data
CREATE POLICY "Brands can insert own data"
  ON brands FOR INSERT
  WITH CHECK (profile_id = auth.uid());

-- Brands can update their own data
CREATE POLICY "Brands can update own data"
  ON brands FOR UPDATE
  USING (profile_id = auth.uid());

-- Talents can view brands they have matches with
CREATE POLICY "Talents can view matched brands"
  ON brands FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM matches m
      JOIN opportunities o ON m.opportunity_id = o.id
      JOIN talents t ON m.talent_id = t.id
      WHERE o.brand_id = brands.id
      AND t.profile_id = auth.uid()
    )
  );

-- ============================================================================
-- STORES POLICIES
-- ============================================================================

-- Brands can view their own stores
CREATE POLICY "Brands can view own stores"
  ON stores FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM brands b
      WHERE b.id = stores.brand_id
      AND b.profile_id = auth.uid()
    )
  );

-- Brands can insert their own stores
CREATE POLICY "Brands can insert own stores"
  ON stores FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands b
      WHERE b.id = stores.brand_id
      AND b.profile_id = auth.uid()
    )
  );

-- Brands can update their own stores
CREATE POLICY "Brands can update own stores"
  ON stores FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM brands b
      WHERE b.id = stores.brand_id
      AND b.profile_id = auth.uid()
    )
  );

-- Brands can delete their own stores
CREATE POLICY "Brands can delete own stores"
  ON stores FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM brands b
      WHERE b.id = stores.brand_id
      AND b.profile_id = auth.uid()
    )
  );

-- Talents can view stores with active opportunities
CREATE POLICY "Talents can view stores with active opportunities"
  ON stores FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM opportunities o
      WHERE o.store_id = stores.id
      AND o.status = 'active'
    )
  );

-- ============================================================================
-- OPPORTUNITIES POLICIES
-- ============================================================================

-- Brands can manage own opportunities
CREATE POLICY "Brands can view own opportunities"
  ON opportunities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM brands b
      WHERE b.id = opportunities.brand_id
      AND b.profile_id = auth.uid()
    )
  );

CREATE POLICY "Brands can insert own opportunities"
  ON opportunities FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands b
      WHERE b.id = opportunities.brand_id
      AND b.profile_id = auth.uid()
    )
  );

CREATE POLICY "Brands can update own opportunities"
  ON opportunities FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM brands b
      WHERE b.id = opportunities.brand_id
      AND b.profile_id = auth.uid()
    )
  );

CREATE POLICY "Brands can delete own opportunities"
  ON opportunities FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM brands b
      WHERE b.id = opportunities.brand_id
      AND b.profile_id = auth.uid()
    )
  );

-- Talents can view active opportunities
CREATE POLICY "Talents can view active opportunities"
  ON opportunities FOR SELECT
  USING (
    status = 'active'
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.user_type = 'talent'
    )
  );

-- ============================================================================
-- MATCHES POLICIES
-- ============================================================================

-- Talents can view their matches
CREATE POLICY "Talents can view own matches"
  ON matches FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM talents t
      WHERE t.id = matches.talent_id
      AND t.profile_id = auth.uid()
    )
  );

-- Talents can update their action on matches
CREATE POLICY "Talents can update own match action"
  ON matches FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM talents t
      WHERE t.id = matches.talent_id
      AND t.profile_id = auth.uid()
    )
  );

-- Brands can view matches for their opportunities
CREATE POLICY "Brands can view opportunity matches"
  ON matches FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM opportunities o
      JOIN brands b ON o.brand_id = b.id
      WHERE o.id = matches.opportunity_id
      AND b.profile_id = auth.uid()
    )
  );

-- Brands can update their action on matches
CREATE POLICY "Brands can update opportunity match action"
  ON matches FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM opportunities o
      JOIN brands b ON o.brand_id = b.id
      WHERE o.id = matches.opportunity_id
      AND b.profile_id = auth.uid()
    )
  );

-- ============================================================================
-- LEARNING MODULES POLICIES
-- ============================================================================

-- Everyone can view active learning modules
CREATE POLICY "Anyone can view active learning modules"
  ON learning_modules FOR SELECT
  USING (status = 'active');

-- ============================================================================
-- TALENT LEARNING PROGRESS POLICIES
-- ============================================================================

-- Talents can view their own progress
CREATE POLICY "Talents can view own learning progress"
  ON talent_learning_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM talents t
      WHERE t.id = talent_learning_progress.talent_id
      AND t.profile_id = auth.uid()
    )
  );

-- Talents can insert their own progress
CREATE POLICY "Talents can insert own learning progress"
  ON talent_learning_progress FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM talents t
      WHERE t.id = talent_learning_progress.talent_id
      AND t.profile_id = auth.uid()
    )
  );

-- Talents can update their own progress
CREATE POLICY "Talents can update own learning progress"
  ON talent_learning_progress FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM talents t
      WHERE t.id = talent_learning_progress.talent_id
      AND t.profile_id = auth.uid()
    )
  );
