-- ============================================================================
-- FIX: Infinite Recursion in Talents RLS Policy
-- Migration: 0004_fix_rls_recursion.sql
-- ============================================================================

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Brands can view matched talents" ON talents;

-- Drop other potentially problematic policies that reference talents from other tables
DROP POLICY IF EXISTS "Talents can view matched brands" ON brands;

-- Recreate a simpler policy for brands viewing matched talents
-- This uses a subquery that doesn't trigger RLS recursion
CREATE POLICY "Brands can view matched talents"
  ON talents FOR SELECT
  USING (
    profile_id = auth.uid()
    OR
    id IN (
      SELECT DISTINCT m.talent_id 
      FROM matches m
      INNER JOIN opportunities o ON m.opportunity_id = o.id
      INNER JOIN brands b ON o.brand_id = b.id
      WHERE b.profile_id = auth.uid()
      AND m.status IN ('talent_interested', 'brand_interested', 'mutual_interest')
    )
  );

-- Recreate a simpler policy for talents viewing matched brands
CREATE POLICY "Talents can view matched brands"
  ON brands FOR SELECT
  USING (
    profile_id = auth.uid()
    OR
    id IN (
      SELECT DISTINCT o.brand_id
      FROM matches m
      INNER JOIN opportunities o ON m.opportunity_id = o.id
      INNER JOIN talents t ON m.talent_id = t.id
      WHERE t.profile_id = auth.uid()
    )
  );
