-- ============================================================================
-- FIX: RLS Infinite Recursion v2 - Using SECURITY DEFINER Functions
-- Migration: 0005_fix_rls_v2_security_definer.sql
-- 
-- Problem: Cross-table RLS policies cause infinite recursion when tables
--          reference each other (talents ↔ matches ↔ brands)
-- 
-- Solution: Use SECURITY DEFINER functions to bypass RLS during policy
--           evaluation, preventing circular dependency
-- ============================================================================

-- ============================================================================
-- STEP 1: Drop all problematic policies that cause recursion
-- ============================================================================

-- Drop talents policies that reference other tables with RLS
DROP POLICY IF EXISTS "Brands can view matched talents" ON talents;
DROP POLICY IF EXISTS "Talents can view own data" ON talents;
DROP POLICY IF EXISTS "Talents can insert own data" ON talents;
DROP POLICY IF EXISTS "Talents can update own data" ON talents;

-- Drop brands policies that reference other tables with RLS
DROP POLICY IF EXISTS "Talents can view matched brands" ON brands;
DROP POLICY IF EXISTS "Brands can view own data" ON brands;
DROP POLICY IF EXISTS "Brands can insert own data" ON brands;
DROP POLICY IF EXISTS "Brands can update own data" ON brands;

-- Drop matches policies (may also have circular issues)
DROP POLICY IF EXISTS "Talents can view own matches" ON matches;
DROP POLICY IF EXISTS "Talents can update own match action" ON matches;
DROP POLICY IF EXISTS "Brands can view opportunity matches" ON matches;
DROP POLICY IF EXISTS "Brands can update opportunity match action" ON matches;

-- ============================================================================
-- STEP 2: Create SECURITY DEFINER helper functions
-- These functions run with the privileges of the function owner (postgres)
-- and bypass RLS, allowing us to check permissions without recursion
-- ============================================================================

-- Function: Get talent IDs that a brand user can view (via matches)
CREATE OR REPLACE FUNCTION get_matched_talent_ids_for_brand(brand_user_id uuid)
RETURNS uuid[] AS $$
DECLARE
  result uuid[];
BEGIN
  SELECT ARRAY_AGG(DISTINCT m.talent_id)
  INTO result
  FROM matches m
  INNER JOIN opportunities o ON m.opportunity_id = o.id
  INNER JOIN brands b ON o.brand_id = b.id
  WHERE b.profile_id = brand_user_id
  AND m.status IN ('talent_interested', 'brand_interested', 'mutual_interest');
  
  RETURN COALESCE(result, ARRAY[]::uuid[]);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function: Get brand IDs that a talent user can view (via matches)
CREATE OR REPLACE FUNCTION get_matched_brand_ids_for_talent(talent_user_id uuid)
RETURNS uuid[] AS $$
DECLARE
  result uuid[];
BEGIN
  SELECT ARRAY_AGG(DISTINCT o.brand_id)
  INTO result
  FROM matches m
  INNER JOIN opportunities o ON m.opportunity_id = o.id
  INNER JOIN talents t ON m.talent_id = t.id
  WHERE t.profile_id = talent_user_id;
  
  RETURN COALESCE(result, ARRAY[]::uuid[]);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function: Get talent ID for a user (for use in other policies)
CREATE OR REPLACE FUNCTION get_talent_id_for_user(user_id uuid)
RETURNS uuid AS $$
DECLARE
  result uuid;
BEGIN
  SELECT id INTO result
  FROM talents
  WHERE profile_id = user_id
  LIMIT 1;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function: Get brand ID for a user
CREATE OR REPLACE FUNCTION get_brand_id_for_user(user_id uuid)
RETURNS uuid AS $$
DECLARE
  result uuid;
BEGIN
  SELECT id INTO result
  FROM brands
  WHERE profile_id = user_id
  LIMIT 1;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function: Check if user is a talent
CREATE OR REPLACE FUNCTION is_talent(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id AND user_type = 'talent'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function: Check if user is a brand
CREATE OR REPLACE FUNCTION is_brand(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id AND user_type = 'brand'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================================
-- STEP 3: Recreate TALENTS policies using helper functions
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

-- Brands can view talents they have matches with (using helper function)
CREATE POLICY "Brands can view matched talents"
  ON talents FOR SELECT
  USING (
    id = ANY(get_matched_talent_ids_for_brand(auth.uid()))
  );

-- ============================================================================
-- STEP 4: Recreate BRANDS policies using helper functions
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

-- Talents can view brands they have matches with (using helper function)
CREATE POLICY "Talents can view matched brands"
  ON brands FOR SELECT
  USING (
    id = ANY(get_matched_brand_ids_for_talent(auth.uid()))
  );

-- ============================================================================
-- STEP 5: Recreate MATCHES policies using helper functions
-- ============================================================================

-- Talents can view their own matches
CREATE POLICY "Talents can view own matches"
  ON matches FOR SELECT
  USING (
    talent_id = get_talent_id_for_user(auth.uid())
  );

-- Talents can update their action on matches
CREATE POLICY "Talents can update own match action"
  ON matches FOR UPDATE
  USING (
    talent_id = get_talent_id_for_user(auth.uid())
  );

-- Brands can view matches for their opportunities
CREATE POLICY "Brands can view opportunity matches"
  ON matches FOR SELECT
  USING (
    opportunity_id IN (
      SELECT o.id FROM opportunities o
      WHERE o.brand_id = get_brand_id_for_user(auth.uid())
    )
  );

-- Brands can update their action on matches
CREATE POLICY "Brands can update opportunity match action"
  ON matches FOR UPDATE
  USING (
    opportunity_id IN (
      SELECT o.id FROM opportunities o
      WHERE o.brand_id = get_brand_id_for_user(auth.uid())
    )
  );

-- ============================================================================
-- STEP 6: Grant execute permissions on helper functions
-- ============================================================================

GRANT EXECUTE ON FUNCTION get_matched_talent_ids_for_brand(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_matched_brand_ids_for_talent(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_talent_id_for_user(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_brand_id_for_user(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION is_talent(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION is_brand(uuid) TO authenticated;

-- ============================================================================
-- STEP 7: Update EXPERIENCE_BLOCKS policies to use helper functions
-- ============================================================================

-- Drop existing experience_blocks policies
DROP POLICY IF EXISTS "Talents can view own experience blocks" ON experience_blocks;
DROP POLICY IF EXISTS "Talents can insert own experience blocks" ON experience_blocks;
DROP POLICY IF EXISTS "Talents can update own experience blocks" ON experience_blocks;
DROP POLICY IF EXISTS "Talents can delete own experience blocks" ON experience_blocks;

-- Recreate using helper function
CREATE POLICY "Talents can view own experience blocks"
  ON experience_blocks FOR SELECT
  USING (talent_id = get_talent_id_for_user(auth.uid()));

CREATE POLICY "Talents can insert own experience blocks"
  ON experience_blocks FOR INSERT
  WITH CHECK (talent_id = get_talent_id_for_user(auth.uid()));

CREATE POLICY "Talents can update own experience blocks"
  ON experience_blocks FOR UPDATE
  USING (talent_id = get_talent_id_for_user(auth.uid()));

CREATE POLICY "Talents can delete own experience blocks"
  ON experience_blocks FOR DELETE
  USING (talent_id = get_talent_id_for_user(auth.uid()));

-- Brands can view experience blocks of matched talents
CREATE POLICY "Brands can view matched talent experience"
  ON experience_blocks FOR SELECT
  USING (talent_id = ANY(get_matched_talent_ids_for_brand(auth.uid())));

-- ============================================================================
-- STEP 8: Update ASSESSMENTS policies to use helper functions
-- ============================================================================

-- Drop existing assessments policies
DROP POLICY IF EXISTS "Talents can view own assessments" ON assessments;
DROP POLICY IF EXISTS "Talents can insert own assessments" ON assessments;
DROP POLICY IF EXISTS "Talents can update own assessments" ON assessments;

-- Recreate using helper function
CREATE POLICY "Talents can view own assessments"
  ON assessments FOR SELECT
  USING (talent_id = get_talent_id_for_user(auth.uid()));

CREATE POLICY "Talents can insert own assessments"
  ON assessments FOR INSERT
  WITH CHECK (talent_id = get_talent_id_for_user(auth.uid()));

CREATE POLICY "Talents can update own assessments"
  ON assessments FOR UPDATE
  USING (
    talent_id = get_talent_id_for_user(auth.uid())
    AND status = 'in_progress'
  );

-- ============================================================================
-- STEP 9: Update STORES policies to use helper functions
-- ============================================================================

-- Drop existing stores policies
DROP POLICY IF EXISTS "Brands can view own stores" ON stores;
DROP POLICY IF EXISTS "Brands can insert own stores" ON stores;
DROP POLICY IF EXISTS "Brands can update own stores" ON stores;
DROP POLICY IF EXISTS "Brands can delete own stores" ON stores;
DROP POLICY IF EXISTS "Talents can view stores with active opportunities" ON stores;

-- Recreate using helper function
CREATE POLICY "Brands can view own stores"
  ON stores FOR SELECT
  USING (brand_id = get_brand_id_for_user(auth.uid()));

CREATE POLICY "Brands can insert own stores"
  ON stores FOR INSERT
  WITH CHECK (brand_id = get_brand_id_for_user(auth.uid()));

CREATE POLICY "Brands can update own stores"
  ON stores FOR UPDATE
  USING (brand_id = get_brand_id_for_user(auth.uid()));

CREATE POLICY "Brands can delete own stores"
  ON stores FOR DELETE
  USING (brand_id = get_brand_id_for_user(auth.uid()));

-- Talents can view stores with active opportunities (simple, no recursion risk)
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
-- STEP 10: Update OPPORTUNITIES policies to use helper functions
-- ============================================================================

-- Drop existing opportunities policies
DROP POLICY IF EXISTS "Brands can view own opportunities" ON opportunities;
DROP POLICY IF EXISTS "Brands can insert own opportunities" ON opportunities;
DROP POLICY IF EXISTS "Brands can update own opportunities" ON opportunities;
DROP POLICY IF EXISTS "Brands can delete own opportunities" ON opportunities;
DROP POLICY IF EXISTS "Talents can view active opportunities" ON opportunities;

-- Recreate using helper function
CREATE POLICY "Brands can view own opportunities"
  ON opportunities FOR SELECT
  USING (brand_id = get_brand_id_for_user(auth.uid()));

CREATE POLICY "Brands can insert own opportunities"
  ON opportunities FOR INSERT
  WITH CHECK (brand_id = get_brand_id_for_user(auth.uid()));

CREATE POLICY "Brands can update own opportunities"
  ON opportunities FOR UPDATE
  USING (brand_id = get_brand_id_for_user(auth.uid()));

CREATE POLICY "Brands can delete own opportunities"
  ON opportunities FOR DELETE
  USING (brand_id = get_brand_id_for_user(auth.uid()));

-- Talents can view active opportunities
CREATE POLICY "Talents can view active opportunities"
  ON opportunities FOR SELECT
  USING (
    status = 'active'
    AND is_talent(auth.uid())
  );

-- ============================================================================
-- STEP 11: Update TALENT_LEARNING_PROGRESS policies to use helper functions
-- ============================================================================

-- Drop existing learning progress policies
DROP POLICY IF EXISTS "Talents can view own learning progress" ON talent_learning_progress;
DROP POLICY IF EXISTS "Talents can insert own learning progress" ON talent_learning_progress;
DROP POLICY IF EXISTS "Talents can update own learning progress" ON talent_learning_progress;

-- Recreate using helper function
CREATE POLICY "Talents can view own learning progress"
  ON talent_learning_progress FOR SELECT
  USING (talent_id = get_talent_id_for_user(auth.uid()));

CREATE POLICY "Talents can insert own learning progress"
  ON talent_learning_progress FOR INSERT
  WITH CHECK (talent_id = get_talent_id_for_user(auth.uid()));

CREATE POLICY "Talents can update own learning progress"
  ON talent_learning_progress FOR UPDATE
  USING (talent_id = get_talent_id_for_user(auth.uid()));

-- ============================================================================
-- VERIFICATION COMMENTS
-- ============================================================================

-- After applying this migration, test the following:
-- 1. New talent can sign up and create talent record
-- 2. Existing talent can view/update their own data
-- 3. Talent can add/view/edit experience blocks
-- 4. Talent can take assessments
-- 5. Talent can view active opportunities
-- 6. Brand can create/manage stores
-- 7. Brand can create/manage opportunities
-- 8. Brand can see matched talents
-- 9. Talent can see matched brands
-- 10. No infinite recursion errors on any operation
