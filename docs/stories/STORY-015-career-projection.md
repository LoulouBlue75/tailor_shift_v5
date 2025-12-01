# STORY-015: Career Projection Engine (Basic)

**Epic:** Intelligence Engines  
**Priority:** P2 (Medium)  
**Story Points:** 8  
**Dependencies:** STORY-004, STORY-011

---

## User Story

En tant que **talent**,  
Je veux **voir une projection de ma prochaine évolution de carrière**,  
Afin de **comprendre mes opportunités de progression et les gaps à combler**.

---

## Acceptance Criteria

### ✅ AC1: Projection Engine Logic
- [ ] Module `/lib/engines/projection.ts` créé
- [ ] Fonction: `generateCareerProjection(talent)`
- [ ] Inputs:
  - Current role level
  - Current store tier
  - Years in luxury
  - Assessment scores
  - Career preferences (target roles)
- [ ] Outputs:
  - Next recommended role (level + typical titles)
  - Readiness indicator: `ready_now` / `ready_soon` / `developing`
  - Timeline estimate (min/max months)
  - Capability gaps (what to improve)
  - Recommended experiences (types of roles to gain)

### ✅ AC2: Readiness Logic (Simplified V1)
- [ ] **Ready Now:**
  - Years in luxury >= typical for next level
  - Assessment avg score >= 70
  - Has relevant experience blocks
- [ ] **Ready Soon (6-12 months):**
  - Years in luxury close to typical
  - Assessment avg score >= 60
  - Some relevant experience
- [ ] **Developing (12-24+ months):**
  - Years in luxury below typical
  - Assessment avg score < 60
  - Limited relevant experience

### ✅ AC3: Timeline Estimation
- [ ] Based on readiness + current level:
  - L1 → L2: 1-2 years typical
  - L2 → L3: 2-3 years typical
  - L3 → L4: 2-4 years typical
  - L4 → L5: 3-5 years typical
  - L5 → L6: 4-6 years typical
  - L6 → L7: 5-8 years typical
  - L7 → L8: 6-10 years typical
- [ ] Adjust based on readiness (ready_now = min, developing = max+)

### ✅ AC4: Capability Gaps Identification
- [ ] Compare assessment scores to requirements for next level
- [ ] Ex: L2 → L3 requires leadership_signals >= 65
- [ ] List gaps: "Develop leadership skills to 65+"

### ✅ AC5: Recommended Experiences
- [ ] Based on next role + gaps:
  - L1 → L2: "Gain clienteling experience, build VIC portfolio"
  - L2 → L3: "Take on informal leadership, mentor juniors"
  - L3 → L4: "Manage department, P&L exposure"
  - L4+: "Multi-site exposure, strategic projects"

### ✅ AC6: Projection Display on Dashboard
- [ ] Widget "Your Career Path" sur `/talent/dashboard`
- [ ] Display:
  - Current role level (ex: "L2 - Senior Advisor")
  - Next recommended role (ex: "L3 - Team Lead")
  - Readiness badge: "Ready Now" / "Ready Soon" / "Developing"
  - Timeline estimate (ex: "6-12 months")
- [ ] CTA: "View Full Projection" (optionnel V1, peut être stub)

### ✅ AC7: Projection Detail Page (Optional V1)
- [ ] Route `/talent/projection` créée
- [ ] Display full projection:
  - Current role + years in luxury
  - Next role details
  - Readiness explanation
  - Timeline breakdown
  - Capability gaps (list avec scores)
  - Recommended experiences (list)
  - Learning modules to bridge gaps (link to learning page)
- [ ] Visual career ladder (L1 → L2 → L3 → ... avec current highlighted)

### ✅ AC8: Engine Version Stamping
- [ ] Projection object has `engine_version` field
- [ ] Stored in DB (optionnel V1, can be computed on-the-fly)
- [ ] Allows evolution of logic over time

---

## Projection Logic Examples

### Example 1: L2 → L3
**Input:**
- Current: L2, T2, 3 years in luxury
- Assessment: SE 78, CL 82, OP 65, LS 58
- Preferences: target L3

**Output:**
```typescript
{
  next_role: {
    level: 'L3',
    typical_titles: ['Team Lead', 'Floor Manager'],
    readiness: 'ready_soon'
  },
  timeline_estimate: {
    min_months: 6,
    max_months: 12
  },
  capability_gaps: [
    'Leadership Signals: 58/100 → Develop to 65+ for team management'
  ],
  recommended_experiences: [
    'Take on informal leadership responsibilities',
    'Mentor 1-2 junior advisors',
    'Participate in team performance reviews'
  ],
  engine_version: 'v1.0'
}
```

### Example 2: L1 → L2
**Input:**
- Current: L1, T3, 1 year in luxury
- Assessment: SE 72, CL 55, OP 68, LS 60
- Preferences: target L2

**Output:**
```typescript
{
  next_role: {
    level: 'L2',
    typical_titles: ['Senior Advisor', 'Expert Advisor'],
    readiness: 'developing'
  },
  timeline_estimate: {
    min_months: 12,
    max_months: 18
  },
  capability_gaps: [
    'Clienteling: 55/100 → Develop VIC management skills to 65+'
  ],
  recommended_experiences: [
    'Build a VIC client portfolio (20+ clients)',
    'Focus on repeat client relationships',
    'Increase product knowledge across divisions'
  ],
  engine_version: 'v1.0'
}
```

---

## Technical Implementation

### Projection Engine
```typescript
// lib/engines/projection.ts

export interface ProjectionResult {
  next_role: {
    level: string
    typical_titles: string[]
    readiness: 'ready_now' | 'ready_soon' | 'developing'
  }
  timeline_estimate: {
    min_months: number
    max_months: number
  }
  capability_gaps: string[]
  recommended_experiences: string[]
  engine_version: string
}

const ROLE_PROGRESSION: Record<string, { next: string; titles: string[] }> = {
  'L1': { next: 'L2', titles: ['Senior Advisor', 'Expert Advisor'] },
  'L2': { next: 'L3', titles: ['Team Lead', 'Floor Manager'] },
  'L3': { next: 'L4', titles: ['Department Manager', 'Category Lead'] },
  'L4': { next: 'L5', titles: ['Assistant Boutique Director', 'Deputy Manager'] },
  'L5': { next: 'L6', titles: ['Boutique Director', 'Store Manager'] },
  'L6': { next: 'L7', titles: ['Area Manager', 'District Director'] },
  'L7': { next: 'L8', titles: ['Regional Director', 'Country Manager'] },
}

const TYPICAL_YEARS: Record<string, number> = {
  'L1→L2': 2,
  'L2→L3': 3,
  'L3→L4': 3,
  'L4→L5': 4,
  'L5→L6': 5,
  'L6→L7': 6,
  'L7→L8': 8,
}

const TIMELINE_RANGES: Record<string, { min: number; max: number }> = {
  'L1→L2': { min: 12, max: 24 },
  'L2→L3': { min: 18, max: 36 },
  'L3→L4': { min: 24, max: 48 },
  'L4→L5': { min: 36, max: 60 },
  'L5→L6': { min: 48, max: 72 },
  'L6→L7': { min: 60, max: 96 },
  'L7→L8': { min: 72, max: 120 },
}

export function generateCareerProjection(talent: Talent): ProjectionResult {
  const currentLevel = talent.current_role_level || 'L1'
  const progression = ROLE_PROGRESSION[currentLevel]
  
  if (!progression) {
    // Max level reached
    return {
      next_role: {
        level: currentLevel,
        typical_titles: ['Continue developing in current role'],
        readiness: 'ready_now',
      },
      timeline_estimate: { min_months: 0, max_months: 0 },
      capability_gaps: [],
      recommended_experiences: ['Explore lateral moves or strategic projects'],
      engine_version: 'v1.0',
    }
  }

  const readiness = assessReadiness(talent, currentLevel, progression.next)
  const timeline = estimateTimeline(currentLevel, progression.next, readiness)
  const gaps = identifyGaps(talent, progression.next)
  const experiences = recommendExperiences(currentLevel, progression.next, gaps)

  return {
    next_role: {
      level: progression.next,
      typical_titles: progression.titles,
      readiness,
    },
    timeline_estimate: timeline,
    capability_gaps: gaps,
    recommended_experiences: experiences,
    engine_version: 'v1.0',
  }
}

function assessReadiness(
  talent: Talent, 
  currentLevel: string, 
  nextLevel: string
): 'ready_now' | 'ready_soon' | 'developing' {
  const yearsInLuxury = talent.years_in_luxury || 0
  const typicalYears = TYPICAL_YEARS[`${currentLevel}→${nextLevel}`] || 3
  
  const assessmentScores = talent.assessment_summary || {}
  const avgScore = (
    (assessmentScores.service_excellence || 0) +
    (assessmentScores.clienteling || 0) +
    (assessmentScores.operations || 0) +
    (assessmentScores.leadership_signals || 0)
  ) / 4

  // Ready now: exceeds typical years AND high scores
  if (yearsInLuxury >= typicalYears && avgScore >= 70) {
    return 'ready_now'
  }

  // Ready soon: close to typical years OR good scores
  if (yearsInLuxury >= typicalYears * 0.75 && avgScore >= 60) {
    return 'ready_soon'
  }

  return 'developing'
}

function estimateTimeline(
  currentLevel: string,
  nextLevel: string,
  readiness: 'ready_now' | 'ready_soon' | 'developing'
): { min_months: number; max_months: number } {
  const range = TIMELINE_RANGES[`${currentLevel}→${nextLevel}`] || { min: 12, max: 24 }
  
  if (readiness === 'ready_now') {
    return { min_months: range.min / 2, max_months: range.min }
  }
  if (readiness === 'ready_soon') {
    return { min_months: range.min, max_months: (range.min + range.max) / 2 }
  }
  return { min_months: range.max, max_months: range.max * 1.5 }
}

function identifyGaps(talent: Talent, nextLevel: string): string[] {
  const gaps: string[] = []
  const scores = talent.assessment_summary || {}

  // Leadership required for L3+
  if (['L3', 'L4', 'L5', 'L6', 'L7', 'L8'].includes(nextLevel)) {
    if ((scores.leadership_signals || 0) < 65) {
      gaps.push(`Leadership Signals: ${scores.leadership_signals || 0}/100 → Develop to 65+ for team management`)
    }
  }

  // Operations important for L4+
  if (['L4', 'L5', 'L6', 'L7', 'L8'].includes(nextLevel)) {
    if ((scores.operations || 0) < 70) {
      gaps.push(`Operations: ${scores.operations || 0}/100 → Develop to 70+ for department oversight`)
    }
  }

  // Clienteling for L2+
  if (['L2', 'L3', 'L4'].includes(nextLevel)) {
    if ((scores.clienteling || 0) < 65) {
      gaps.push(`Clienteling: ${scores.clienteling || 0}/100 → Develop VIC management to 65+`)
    }
  }

  return gaps
}

function recommendExperiences(
  currentLevel: string,
  nextLevel: string,
  gaps: string[]
): string[] {
  const experiences: string[] = []

  if (nextLevel === 'L2') {
    experiences.push('Build a VIC client portfolio (20+ clients)')
    experiences.push('Increase product knowledge across divisions')
    if (gaps.some(g => g.includes('Clienteling'))) {
      experiences.push('Focus on repeat client relationships and follow-ups')
    }
  }

  if (nextLevel === 'L3') {
    experiences.push('Take on informal leadership responsibilities')
    experiences.push('Mentor 1-2 junior advisors')
    experiences.push('Participate in team performance reviews')
  }

  if (nextLevel === 'L4') {
    experiences.push('Manage a category or small department')
    experiences.push('Gain P&L exposure and inventory management')
    experiences.push('Lead cross-functional projects')
  }

  if (['L5', 'L6'].includes(nextLevel)) {
    experiences.push('Assistant manager role in flagship or full-format store')
    experiences.push('Develop strategic planning skills')
    experiences.push('Build relationships with corporate stakeholders')
  }

  if (['L7', 'L8'].includes(nextLevel)) {
    experiences.push('Multi-site management experience')
    experiences.push('Regional strategic initiatives')
    experiences.push('Executive-level stakeholder management')
  }

  return experiences
}
```

### Dashboard Widget
```typescript
// components/talent/CareerProjection.tsx
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

export function CareerProjection({ projection }) {
  const { next_role, timeline_estimate } = projection

  const readinessVariant = {
    ready_now: 'success',
    ready_soon: 'warning',
    developing: 'default',
  }[next_role.readiness]

  return (
    <Card>
      <h3>Your Career Path</h3>
      
      <div className="mt-4">
        <p className="text-sm text-soft-grey">Current Role</p>
        <p className="font-medium">{talent.current_role_level} - {getRoleName(talent.current_role_level)}</p>
      </div>

      <div className="mt-4">
        <p className="text-sm text-soft-grey">Next Step</p>
        <p className="font-medium">{next_role.level} - {next_role.typical_titles[0]}</p>
      </div>

      <div className="flex gap-2 mt-4">
        <Badge variant={readinessVariant}>
          {next_role.readiness.replace('_', ' ')}
        </Badge>
        <Badge variant="default">
          {timeline_estimate.min_months}-{timeline_estimate.max_months} months
        </Badge>
      </div>

      <Link href="/talent/projection">
        <Button variant="secondary" size="sm" className="mt-4 w-full">
          View Full Projection
        </Button>
      </Link>
    </Card>
  )
}
```

---

## Testing Requirements

### Manual Tests
- [ ] Projection calculée correctement pour différents niveaux
- [ ] Readiness logic cohérente
- [ ] Timeline estimate raisonnable
- [ ] Gaps identifiés basés sur assessment
- [ ] Experiences recommandées pertinentes
- [ ] Dashboard widget affiché

### Edge Cases
- [ ] L8 (max level) → no next role
- [ ] No assessment → conservative projection
- [ ] Very high scores → ready_now

---

## Definition of Done

- [ ] Projection engine implémenté
- [ ] Dashboard widget fonctionnel
- [ ] Projection detail page (si V1)
- [ ] Tests manuels passés
- [ ] Code reviewed
