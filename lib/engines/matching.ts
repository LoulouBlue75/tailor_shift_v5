/**
 * Matching Engine V1.0
 * 7-Dimensional algorithm for matching talents with opportunities
 */

import { Talent, Opportunity, Store, ExperienceBlock } from '@/lib/supabase/database.types'

export interface MatchResult {
  score_total: number
  score_breakdown: {
    role_fit: number
    division_fit: number
    store_context: number
    capability_fit: number
    geography: number
    experience_block: number
    preference: number
  }
  compensation_alignment: 'within_range' | 'above_range' | 'below_range' | 'unknown'
  engine_version: string
}

// Dimension weights (must sum to 1.0)
const WEIGHTS = {
  role_fit: 0.20,
  division_fit: 0.20,
  store_context: 0.15,
  capability_fit: 0.15,
  geography: 0.10,
  experience_block: 0.10,
  preference: 0.10,
}

// Minimum score threshold for match creation
export const MINIMUM_MATCH_SCORE = 40

/**
 * Calculate match between talent and opportunity
 */
export function calculateMatch(
  talent: Talent & { experience_blocks?: ExperienceBlock[] },
  opportunity: Opportunity & { stores?: Store | null }
): MatchResult {
  const scores = {
    role_fit: scoreRoleFit(talent, opportunity),
    division_fit: scoreDivisionFit(talent, opportunity),
    store_context: scoreStoreContext(talent, opportunity),
    capability_fit: scoreCapabilityFit(talent, opportunity),
    geography: scoreGeography(talent, opportunity),
    experience_block: scoreExperienceBlock(talent, opportunity),
    preference: scorePreference(talent, opportunity),
  }

  // Calculate weighted total
  const total = Object.entries(scores).reduce((sum, [key, score]) => {
    return sum + score * WEIGHTS[key as keyof typeof WEIGHTS]
  }, 0)

  const compensationAlignment = scoreCompensationAlignment(talent, opportunity)

  return {
    score_total: Math.round(total),
    score_breakdown: scores,
    compensation_alignment: compensationAlignment,
    engine_version: 'v1.0',
  }
}

/**
 * Dimension 1: Role Fit (Weight: 20%)
 * Compare talent's current role level with opportunity role level
 */
function scoreRoleFit(talent: Talent, opportunity: Opportunity): number {
  if (!talent.current_role_level) return 50 // No current role data

  const talentLevel = parseInt(talent.current_role_level.replace('L', ''))
  const oppLevel = parseInt(opportunity.role_level.replace('L', ''))

  const diff = oppLevel - talentLevel

  // Exact match
  if (diff === 0) return 100

  // One level up (growth opportunity)
  if (diff === 1) return 85

  // One level down (overqualified)
  if (diff === -1) return 70

  // Two levels difference
  if (Math.abs(diff) === 2) return 40

  // More than 2 levels
  return 0
}

/**
 * Dimension 2: Division Fit (Weight: 20%)
 * Compare talent's division expertise with opportunity division
 */
function scoreDivisionFit(talent: Talent, opportunity: Opportunity): number {
  // Generic role (no specific division)
  if (!opportunity.division) return 80

  const talentDivisions = talent.divisions_expertise || []

  // Exact match
  if (talentDivisions.includes(opportunity.division)) return 100

  // Related divisions
  const relatedDivisions: Record<string, string[]> = {
    fashion: ['leather_goods', 'shoes', 'accessories', 'eyewear'],
    leather_goods: ['fashion', 'shoes', 'accessories'],
    shoes: ['fashion', 'leather_goods', 'accessories'],
    beauty: ['fragrance'],
    fragrance: ['beauty'],
    watches: ['high_jewelry', 'eyewear'],
    high_jewelry: ['watches', 'eyewear'],
    eyewear: ['watches', 'accessories'],
    accessories: ['fashion', 'leather_goods', 'eyewear'],
  }

  const related = relatedDivisions[opportunity.division] || []
  if (talentDivisions.some((d) => related.includes(d))) return 60

  // Some transferability (luxury retail skills)
  return 20
}

/**
 * Dimension 3: Store Context (Weight: 15%)
 * Compare talent's current store tier with opportunity store tier
 */
function scoreStoreContext(talent: Talent, opportunity: Opportunity & { stores?: Store | null }): number {
  const oppStore = opportunity.stores
  
  if (!talent.current_store_tier || !oppStore?.tier) return 50

  const talentTier = parseInt(talent.current_store_tier.replace('T', ''))
  const oppTier = parseInt(oppStore.tier.replace('T', ''))

  const diff = Math.abs(oppTier - talentTier)

  // Exact match
  if (diff === 0) return 100

  // One tier difference
  if (diff === 1) return 60

  // More than one tier
  return 30
}

/**
 * Dimension 4: Capability Fit (Weight: 15%)
 * Compare talent's assessment scores with opportunity requirements
 */
function scoreCapabilityFit(talent: Talent, opportunity: Opportunity): number {
  const assessment = talent.assessment_summary

  // No assessment completed
  if (!assessment?.completed_at) return 40

  // Calculate average assessment score
  const avgScore =
    ((assessment.service_excellence || 0) +
      (assessment.clienteling || 0) +
      (assessment.operations || 0) +
      (assessment.leadership_signals || 0)) /
    4

  // High performer
  if (avgScore >= 75) return 100

  // Good performer
  if (avgScore >= 60) return 70

  // Developing
  return 50
}

/**
 * Dimension 5: Geography (Weight: 10%)
 * Compare talent's location preferences with opportunity location
 */
function scoreGeography(talent: Talent, opportunity: Opportunity & { stores?: Store | null }): number {
  const oppStore = opportunity.stores
  
  if (!oppStore?.city) return 50

  const currentLocation = talent.current_location?.toLowerCase() || ''
  const oppLocation = oppStore.city.toLowerCase()
  const targetLocations = (talent.career_preferences?.target_locations || []).map((l) =>
    l.toLowerCase()
  )
  const mobility = talent.career_preferences?.mobility || 'local'

  // Current city match
  if (currentLocation && currentLocation === oppLocation) return 100

  // Target location match
  if (targetLocations.includes(oppLocation)) return 90

  // Same region (simplified - could be enhanced with region mapping)
  const oppRegion = oppStore.region?.toLowerCase() || ''
  if (currentLocation && oppRegion && currentLocation.includes(oppRegion)) return 50

  // Mobility-based scoring
  if (mobility === 'international') return 60
  if (mobility === 'national') return 40
  if (mobility === 'regional') return 30

  // Local only, different location
  return 10
}

/**
 * Dimension 6: Experience Block (Weight: 10%)
 * Check if talent has relevant experience blocks
 */
function scoreExperienceBlock(talent: Talent & { experience_blocks?: ExperienceBlock[] }, opportunity: Opportunity): number {
  const blocks = talent.experience_blocks || []

  if (blocks.length === 0) return 20

  const oppLevel = parseInt(opportunity.role_level.replace('L', ''))

  // For senior roles (L4+), look for leadership/business blocks
  if (oppLevel >= 4) {
    const hasLeadershipOrBusiness = blocks.some((b: ExperienceBlock) =>
      ['leadership', 'business'].includes(b.block_type)
    )
    if (hasLeadershipOrBusiness) return 100

    // Has operations (shows some management experience)
    if (blocks.some((b: ExperienceBlock) => b.block_type === 'operations')) return 70
  }

  // For junior-mid roles, look for FOH/clienteling
  const hasFohOrClienteling = blocks.some((b: ExperienceBlock) =>
    ['foh', 'clienteling'].includes(b.block_type)
  )
  if (hasFohOrClienteling) return 100

  // Has operations
  if (blocks.some((b: ExperienceBlock) => b.block_type === 'operations')) return 70

  // Has some relevant experience
  if (blocks.some((b: ExperienceBlock) => ['boh', 'operations'].includes(b.block_type))) return 40

  return 20
}

/**
 * Dimension 7: Preference (Weight: 10%)
 * Check talent's career preferences alignment
 */
function scorePreference(talent: Talent, opportunity: Opportunity & { stores?: Store | null }): number {
  const prefs = talent.career_preferences
  const oppStore = opportunity.stores

  if (!prefs) return 50

  let score = 0

  // Timeline (40 points)
  if (prefs.timeline === 'active') score += 40
  else if (prefs.timeline === 'passive') score += 28
  else if (prefs.timeline === 'not_looking') score += 8

  // Target role levels (30 points)
  if (prefs.target_role_levels?.includes(opportunity.role_level)) {
    score += 30
  }

  // Target store tiers (20 points)
  if (oppStore?.tier && prefs.target_store_tiers?.includes(oppStore.tier)) {
    score += 20
  }

  // Target divisions (10 points)
  if (opportunity.division && prefs.target_divisions?.includes(opportunity.division)) {
    score += 10
  }

  return Math.min(score, 100)
}

/**
 * Compensation Alignment Tagging
 * Compare talent expectations with opportunity range (privacy-preserved)
 */
function scoreCompensationAlignment(
  talent: Talent,
  opportunity: Opportunity
): 'within_range' | 'above_range' | 'below_range' | 'unknown' {
  const expectations = talent.compensation_profile?.expectations
  const range = opportunity.compensation_range

  // Missing data
  if (!expectations || !range?.min_base || !range?.max_base) {
    return 'unknown'
  }

  // V1: Assumes same currency (EUR)
  // V2: Convert currencies if needed

  if (expectations >= range.min_base && expectations <= range.max_base) {
    return 'within_range'
  }

  if (expectations > range.max_base) {
    return 'above_range'
  }

  return 'below_range'
}

/**
 * Check if match score meets minimum threshold
 */
export function meetsThreshold(score: number): boolean {
  return score >= MINIMUM_MATCH_SCORE
}
