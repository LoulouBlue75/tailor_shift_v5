# STORY-012: Matching Engine (7D Algorithm)

**Epic:** Intelligence Engines  
**Priority:** P0 (Blocker)  
**Story Points:** 21  
**Dependencies:** STORY-004, STORY-011

---

## User Story

En tant que **système**,  
Je veux **calculer des scores de matching entre talents et opportunités selon 7 dimensions**,  
Afin de **proposer les meilleures opportunités aux talents et vice-versa**.

---

## Acceptance Criteria

### ✅ AC1: Matching Engine Architecture
- [ ] Module `/lib/engines/matching.ts` créé
- [ ] Fonction principale: `calculateMatch(talent, opportunity)`
- [ ] Output: `MatchResult` avec score total + breakdown
- [ ] Logique déterministe (same inputs = same outputs)
- [ ] Versioning: engine version stamped sur chaque match

### ✅ AC2: 7D Scoring Logic Implemented

#### Dimension 1: Role Fit (Weight: 20%)
- [ ] Compare `talent.current_role_level` vs `opportunity.role_level`
- [ ] Scoring:
  - Exact match: 100
  - ±1 level: 70
  - ±2 levels: 40
  - >2 levels: 0
- [ ] Account for upward mobility (talent L2 → opp L3 = good)

#### Dimension 2: Division Fit (Weight: 20%)
- [ ] Compare `talent.divisions_expertise` vs `opportunity.division`
- [ ] Scoring:
  - Exact match in array: 100
  - Related division: 60 (ex: Fashion & Leather Goods)
  - No match: 20 (still some transferability)

#### Dimension 3: Store Context (Weight: 15%)
- [ ] Compare `talent.current_store_tier` vs `opportunity.store.complexity_tier`
- [ ] Scoring:
  - Exact match: 100
  - ±1 tier: 60
  - >1 tier: 30

#### Dimension 4: Capability Fit (Weight: 15%)
- [ ] Compare `talent.assessment_summary` scores vs `opportunity.required_capabilities`
- [ ] V1 simplified: if assessment completed, boost score
- [ ] V2: match specific capabilities to requirements
- [ ] Scoring:
  - Assessment complete + high scores: 100
  - Assessment complete + medium scores: 70
  - No assessment: 40

#### Dimension 5: Geography (Weight: 10%)
- [ ] Compare `talent.current_location` + `talent.career_preferences.target_locations` vs `opportunity.store.city`
- [ ] Scoring:
  - Current city match: 100
  - Target location match: 90
  - Same region: 50
  - Different region + high mobility: 60
  - Different region + local mobility: 10

#### Dimension 6: Experience Block (Weight: 10%)
- [ ] Check if talent has relevant `experience_blocks` types
- [ ] Scoring:
  - Has exact block type for role: 100
  - Has related block type: 70
  - Has some relevant blocks: 40
  - No relevant blocks: 20

#### Dimension 7: Preference (Weight: 10%)
- [ ] Check `talent.career_preferences`:
  - Timeline (active = 100, passive = 70, not_looking = 20)
  - Role level in target list: +30
  - Store tier in target list: +20
- [ ] Scoring: 0-100 based on alignment

### ✅ AC3: Total Score Calculation
- [ ] Weighted sum of 7 dimensions
- [ ] Total score: 0-100
- [ ] Breakdown persisted in `matches.score_breakdown`

### ✅ AC4: Compensation Alignment Tagging
- [ ] Compare `talent.compensation_profile.expectations` vs `opportunity.compensation_range`
- [ ] Tag (never show numbers):
  - `within_range`: expectations between min-max
  - `above_range`: expectations > max
  - `below_range`: expectations < min (rare)
  - `unknown`: missing data
- [ ] **Privacy**: numbers never exposed to either party

### ✅ AC5: Match Creation Trigger
- [ ] When opportunity published (status = 'active'):
  - Query all talents with `onboarding_completed = true`
  - Calculate match for each
  - Insert into `matches` table if score > threshold (ex: 40)
- [ ] When talent completes profile/assessment:
  - Query all active opportunities
  - Calculate match for each
  - Insert into `matches` table if score > threshold

### ✅ AC6: Match Storage
- [ ] Insert into `matches` table:
  - talent_id, opportunity_id
  - score_total
  - score_breakdown (JSONB)
  - compensation_alignment
  - status = 'suggested'
  - created_at
- [ ] Unique constraint: (talent_id, opportunity_id)
- [ ] If match exists, update scores (re-matching)

### ✅ AC7: Re-matching Logic
- [ ] When opportunity edited (if active):
  - Delete existing matches
  - Re-calculate matches
- [ ] When talent updates profile/assessment:
  - Delete existing matches
  - Re-calculate matches
- [ ] Optionnel V1: batch re-matching job (nightly)

### ✅ AC8: Minimum Score Threshold
- [ ] Only create match if `score_total >= 40`
- [ ] Configurable threshold (V2)
- [ ] Prevents spam matches

---

## Technical Implementation

### Matching Engine
```typescript
// lib/engines/matching.ts

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

const WEIGHTS = {
  role_fit: 0.20,
  division_fit: 0.20,
  store_context: 0.15,
  capability_fit: 0.15,
  geography: 0.10,
  experience_block: 0.10,
  preference: 0.10,
}

export function calculateMatch(
  talent: Talent & { experience_blocks: ExperienceBlock[] },
  opportunity: Opportunity & { store: Store }
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

  const total = Object.entries(scores).reduce((sum, [key, score]) => {
    return sum + (score * WEIGHTS[key as keyof typeof WEIGHTS])
  }, 0)

  const compensationAlignment = scoreCompensationAlignment(talent, opportunity)

  return {
    score_total: Math.round(total),
    score_breakdown: scores,
    compensation_alignment: compensationAlignment,
    engine_version: 'v1.0',
  }
}

function scoreRoleFit(talent: Talent, opportunity: Opportunity): number {
  const talentLevel = parseInt(talent.current_role_level?.replace('L', '') || '0')
  const oppLevel = parseInt(opportunity.role_level.replace('L', ''))
  
  const diff = Math.abs(oppLevel - talentLevel)
  
  if (diff === 0) return 100
  if (diff === 1) return 70
  if (diff === 2) return 40
  return 0
}

function scoreDivisionFit(talent: Talent, opportunity: Opportunity): number {
  if (!opportunity.division) return 80 // Generic role
  
  const talentDivisions = talent.divisions_expertise || []
  
  if (talentDivisions.includes(opportunity.division)) return 100
  
  // Related divisions logic (V1 simplified)
  const relatedDivisions: Record<string, string[]> = {
    'fashion': ['leather_goods', 'shoes', 'accessories'],
    'leather_goods': ['fashion', 'shoes'],
    'beauty': ['fragrance'],
    // ... etc
  }
  
  const related = relatedDivisions[opportunity.division] || []
  if (talentDivisions.some(d => related.includes(d))) return 60
  
  return 20 // Some transferability
}

function scoreStoreContext(talent: Talent, opportunity: Opportunity): number {
  if (!talent.current_store_tier || !opportunity.store?.complexity_tier) return 50
  
  const talentTier = parseInt(talent.current_store_tier.replace('T', ''))
  const oppTier = parseInt(opportunity.store.complexity_tier.replace('T', ''))
  
  const diff = Math.abs(oppTier - talentTier)
  
  if (diff === 0) return 100
  if (diff === 1) return 60
  return 30
}

function scoreCapabilityFit(talent: Talent, opportunity: Opportunity): number {
  // V1 simplified: boost if assessment completed
  if (!talent.assessment_summary?.completed_at) return 40
  
  const avgScore = (
    (talent.assessment_summary.service_excellence || 0) +
    (talent.assessment_summary.clienteling || 0) +
    (talent.assessment_summary.operations || 0) +
    (talent.assessment_summary.leadership_signals || 0)
  ) / 4
  
  if (avgScore >= 75) return 100
  if (avgScore >= 60) return 70
  return 50
}

function scoreGeography(talent: Talent, opportunity: Opportunity): number {
  const currentLocation = talent.current_location?.toLowerCase() || ''
  const oppLocation = opportunity.store?.city?.toLowerCase() || ''
  const targetLocations = (talent.career_preferences?.target_locations || []).map(l => l.toLowerCase())
  const mobility = talent.career_preferences?.mobility || 'local'
  
  if (currentLocation === oppLocation) return 100
  if (targetLocations.includes(oppLocation)) return 90
  
  // Same region check (simplified V1)
  // TODO: implement region matching
  
  if (mobility === 'international') return 60
  if (mobility === 'national') return 40
  if (mobility === 'regional') return 30
  return 10 // local only, different location
}

function scoreExperienceBlock(talent: Talent, opportunity: Opportunity): number {
  const blocks = talent.experience_blocks || []
  
  // Map role level to expected block types
  const oppLevel = parseInt(opportunity.role_level.replace('L', ''))
  const expectedBlocks = oppLevel >= 4 ? ['leadership', 'business'] : ['foh', 'clienteling']
  
  const hasExpected = blocks.some(b => expectedBlocks.includes(b.block_type))
  if (hasExpected) return 100
  
  const hasRelated = blocks.some(b => 
    ['foh', 'clienteling', 'operations'].includes(b.block_type)
  )
  if (hasRelated) return 70
  
  return blocks.length > 0 ? 40 : 20
}

function scorePreference(talent: Talent, opportunity: Opportunity): number {
  const prefs = talent.career_preferences || {}
  let score = 0
  
  // Timeline
  if (prefs.timeline === 'active') score += 40
  else if (prefs.timeline === 'passive') score += 28
  else score += 8
  
  // Target role levels
  if (prefs.target_role_levels?.includes(opportunity.role_level)) {
    score += 30
  }
  
  // Target store tiers
  if (opportunity.store?.complexity_tier && 
      prefs.target_store_tiers?.includes(opportunity.store.complexity_tier)) {
    score += 20
  }
  
  // Target divisions
  if (opportunity.division && 
      prefs.target_divisions?.includes(opportunity.division)) {
    score += 10
  }
  
  return Math.min(score, 100)
}

function scoreCompensationAlignment(
  talent: Talent, 
  opportunity: Opportunity
): 'within_range' | 'above_range' | 'below_range' | 'unknown' {
  const expectations = talent.compensation_profile?.expectations
  const range = opportunity.compensation_range
  
  if (!expectations || !range?.min || !range?.max) return 'unknown'
  
  // Ensure same currency (V1 assumes EUR, V2 convert)
  if (expectations >= range.min && expectations <= range.max) {
    return 'within_range'
  }
  if (expectations > range.max) return 'above_range'
  return 'below_range'
}
```

### Match Creation Server Action
```typescript
// app/actions/matching.ts
'use server'

import { createServerActionClient } from '@/lib/supabase/server'
import { calculateMatch } from '@/lib/engines/matching'

export async function generateMatchesForOpportunity(opportunityId: string) {
  const supabase = createServerActionClient()
  
  // Get opportunity with store
  const { data: opportunity } = await supabase
    .from('opportunities')
    .select('*, store:stores(*)')
    .eq('id', opportunityId)
    .single()
  
  if (!opportunity || opportunity.status !== 'active') return
  
  // Get all eligible talents
  const { data: talents } = await supabase
    .from('talents')
    .select('*, experience_blocks(*)')
    .eq('onboarding_completed', true)
  
  // Calculate matches
  const matches = talents
    .map(talent => {
      const result = calculateMatch(talent, opportunity)
      return {
        talent_id: talent.id,
        opportunity_id: opportunity.id,
        ...result,
      }
    })
    .filter(match => match.score_total >= 40) // Minimum threshold
  
  // Insert matches (upsert to handle re-matching)
  const { error } = await supabase
    .from('matches')
    .upsert(matches, { 
      onConflict: 'talent_id,opportunity_id',
      ignoreDuplicates: false 
    })
  
  if (error) throw error
  
  return { count: matches.length }
}

export async function generateMatchesForTalent(talentId: string) {
  const supabase = createServerActionClient()
  
  // Get talent with experience blocks
  const { data: talent } = await supabase
    .from('talents')
    .select('*, experience_blocks(*)')
    .eq('id', talentId)
    .single()
  
  if (!talent || !talent.onboarding_completed) return
  
  // Get all active opportunities
  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('*, store:stores(*)')
    .eq('status', 'active')
  
  // Calculate matches
  const matches = opportunities
    .map(opportunity => {
      const result = calculateMatch(talent, opportunity)
      return {
        talent_id: talent.id,
        opportunity_id: opportunity.id,
        ...result,
      }
    })
    .filter(match => match.score_total >= 40)
  
  // Insert matches
  const { error } = await supabase
    .from('matches')
    .upsert(matches, { 
      onConflict: 'talent_id,opportunity_id',
      ignoreDuplicates: false 
    })
  
  if (error) throw error
  
  return { count: matches.length }
}
```

---

## Testing Requirements

### Unit Tests (Matching Logic)
- [ ] scoreRoleFit: exact match = 100
- [ ] scoreRoleFit: ±1 level = 70
- [ ] scoreDivisionFit: exact = 100, related = 60
- [ ] scoreStoreContext: exact tier = 100
- [ ] scoreGeography: current city = 100
- [ ] Total score calculation: weighted sum correct
- [ ] Compensation alignment: correct tags

### Integration Tests
- [ ] Generate matches for new opportunity
- [ ] Generate matches for new talent
- [ ] Re-matching updates existing matches
- [ ] Matches below threshold not created

### Manual Tests
- [ ] Create opportunity → matches generated
- [ ] Talent completes onboarding → matches generated
- [ ] Edit opportunity → re-matching triggered
- [ ] Match scores visible in dashboard

---

## Performance Considerations

- [ ] Batch matching (V1: on-demand, V2: background job)
- [ ] Index on `matches.score_total` for sorting
- [ ] Limit queries (pagination)
- [ ] Consider caching (V2)

---

## Definition of Done

- [ ] 7D matching algorithm implémenté
- [ ] Match generation pour opportunities
- [ ] Match generation pour talents
- [ ] Scores stockés en DB
- [ ] Compensation alignment tagging
- [ ] Tests unitaires passés
- [ ] Integration tests passés
- [ ] Code reviewed
