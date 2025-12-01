# STORY-013: Match Display (Both Sides)

**Epic:** Matching & Discovery  
**Priority:** P1 (High)  
**Story Points:** 13  
**Dependencies:** STORY-012

---

## User Story

En tant que **talent ou brand**,  
Je veux **voir mes matches avec scores et détails**,  
Afin de **découvrir des opportunités pertinentes / talents qualifiés**.

---

## Acceptance Criteria

### ✅ AC1: Talent - Opportunities List Page
- [ ] Route `/talent/opportunities` créée
- [ ] Liste de tous les matches (talent's matches)
- [ ] Triés par `score_total` DESC
- [ ] Filters (V1 basic):
  - All
  - High match (>80%)
  - Medium match (60-80%)
  - Role level
- [ ] Chaque opportunity card affiche:
  - Title
  - Brand name (peut être anonymisé V1)
  - Store location (city)
  - Role level badge
  - Division badge
  - Match score (ex: "87% match")
  - Score breakdown (hover ou expand)
  - Compensation alignment badge: "Within Range" / "Above Range" / "Unknown"
  - CTA: "View Details"
- [ ] Empty state: "No opportunities yet. Complete your profile to unlock matches."

### ✅ AC2: Talent - Opportunity Detail Page
- [ ] Route `/talent/opportunities/[id]` créée
- [ ] Display toutes les infos de l'opportunity:
  - Title
  - Brand (si visible)
  - Store (name, location, tier)
  - Role level
  - Division
  - Description
  - Responsibilities (list)
  - Required experience
  - Required languages
  - Match score (prominent)
  - Score breakdown (7 dimensions avec bars)
- [ ] **Compensation range JAMAIS affiché**
- [ ] Compensation alignment badge affiché
- [ ] CTA: "Express Interest" (V1: simple, peut être stub pour V2 Interaction Engine)

### ✅ AC3: Brand - Matches per Opportunity
- [ ] Route `/brand/opportunities/[id]/matches` créée
- [ ] Liste des matches pour cette opportunity
- [ ] Triés par `score_total` DESC
- [ ] Chaque talent card affiche:
  - Talent name (V1: full name, V2: peut être anonymisé)
  - Current role level + store tier
  - Years in luxury
  - Divisions expertise
  - Assessment summary (4D scores)
  - Match score (ex: "92% match")
  - Score breakdown
  - Compensation alignment badge
  - CTA: "View Profile"
- [ ] Empty state: "No matches yet. We'll notify you when qualified talents are found."

### ✅ AC4: Brand - Talent Profile View
- [ ] Route `/brand/talents/[id]` créée
- [ ] Display talent info (RLS: only via matches):
  - Full name
  - Current professional identity (role, maison, location)
  - Years in luxury
  - Divisions expertise
  - Experience blocks (list)
  - Assessment summary (scores + insights)
  - Career preferences (target roles, locations, timeline)
- [ ] **Compensation expectations JAMAIS affiché**
- [ ] Match score with this opportunity (context)
- [ ] CTA: "Express Interest" (V1 stub)

### ✅ AC5: Score Breakdown Display
- [ ] Visual bars pour chaque dimension:
  - Role Fit: 85/100
  - Division Fit: 90/100
  - Store Context: 75/100
  - Capability Fit: 88/100
  - Geography: 60/100
  - Experience Block: 95/100
  - Preference: 70/100
- [ ] Tooltip explications pour chaque dimension
- [ ] Color coding: >80 green, 60-80 yellow, <60 orange

### ✅ AC6: Compensation Alignment Badge
- [ ] Badge design:
  - "Within Range": green/success
  - "Above Range": orange/warning
  - "Below Range": (rare, no special style)
  - "Unknown": grey/default
- [ ] Tooltip: "Based on profile alignment, no numbers shared"

### ✅ AC7: Filters & Search (Basic V1)
- [ ] Talent side:
  - Filter by role level
  - Filter by match score range
  - Filter by location
- [ ] Brand side:
  - Filter by role level
  - Filter by match score
  - Filter by assessment completion
- [ ] Search by keyword (V2)

### ✅ AC8: Empty States
- [ ] Talent: no matches → encourage profile completion
- [ ] Brand: no matches → encourage more opportunities or broader criteria

### ✅ AC9: Loading States
- [ ] Skeleton loaders pendant fetch
- [ ] Infinite scroll ou pagination (V1: pagination)

---

## UI Layout

### Talent - Opportunities List
```
┌───────────────────────────────────────────────────────┐
│ Opportunities for You                [Filters ▼]     │
├───────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐   │
│ │ Senior Sales Advisor - Fashion                  │   │
│ │ Paris Flagship • L2                            │   │
│ │ [Fashion] [87% match] [Within Range]           │   │
│ │                                                 │   │
│ │ Role Fit: ████████░░ 85                        │   │
│ │ Division: █████████░ 90                        │   │
│ │ ...                                             │   │
│ │                                [View Details]   │   │
│ └─────────────────────────────────────────────────┘   │
│ [More opportunities...]                              │
└───────────────────────────────────────────────────────┘
```

### Brand - Matches List
```
┌───────────────────────────────────────────────────────┐
│ Matches for: Senior Advisor - Fashion      15 matches│
├───────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐   │
│ │ Sarah Martinez                                  │   │
│ │ L2 Senior Advisor • T1 Flagship • 4 years      │   │
│ │ [Fashion] [Leather Goods]                      │   │
│ │                                                 │   │
│ │ Assessment: SE 82 | CL 88 | OP 75 | LS 78     │   │
│ │ [92% match] [Within Range]                     │   │
│ │                                [View Profile]   │   │
│ └─────────────────────────────────────────────────┘   │
│ [More talents...]                                    │
└───────────────────────────────────────────────────────┘
```

---

## Technical Implementation

### Talent Opportunities Page
```typescript
// app/(talent)/talent/opportunities/page.tsx
import { createServerComponentClient } from '@/lib/supabase/server'
import { OpportunityCard } from '@/components/talent/OpportunityCard'

export default async function OpportunitiesPage() {
  const supabase = createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: talent } = await supabase
    .from('talents')
    .select('id')
    .eq('profile_id', user.id)
    .single()

  const { data: matches } = await supabase
    .from('matches')
    .select(`
      *,
      opportunity:opportunities(
        *,
        brand:brands(id, name),
        store:stores(id, name, city, country, complexity_tier)
      )
    `)
    .eq('talent_id', talent.id)
    .eq('status', 'suggested')
    .order('score_total', { ascending: false })

  return (
    <div className="container py-8">
      <h1>Opportunities for You</h1>
      
      {/* Filters */}
      <Filters />

      {matches?.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-8 space-y-4">
          {matches.map(match => (
            <OpportunityCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  )
}
```

### OpportunityCard Component
```typescript
// components/talent/OpportunityCard.tsx
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { ScoreBreakdown } from '@/components/matching/ScoreBreakdown'
import Link from 'next/link'

export function OpportunityCard({ match }) {
  const { opportunity, score_total, score_breakdown, compensation_alignment } = match

  return (
    <Card variant="interactive">
      <div className="flex justify-between items-start">
        <div>
          <h3>{opportunity.title}</h3>
          <p className="text-sm text-soft-grey mt-1">
            {opportunity.store?.city} • {opportunity.role_level}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="success">{score_total}% match</Badge>
          <Badge variant={getAlignmentVariant(compensation_alignment)}>
            {formatAlignment(compensation_alignment)}
          </Badge>
        </div>
      </div>

      {opportunity.division && (
        <div className="mt-3">
          <Badge>{opportunity.division}</Badge>
        </div>
      )}

      <ScoreBreakdown scores={score_breakdown} compact />

      <Link href={`/talent/opportunities/${opportunity.id}`}>
        <Button variant="secondary" size="sm" className="mt-4">
          View Details
        </Button>
      </Link>
    </Card>
  )
}
```

### ScoreBreakdown Component
```typescript
// components/matching/ScoreBreakdown.tsx
interface ScoreBreakdownProps {
  scores: {
    role_fit: number
    division_fit: number
    store_context: number
    capability_fit: number
    geography: number
    experience_block: number
    preference: number
  }
  compact?: boolean
}

export function ScoreBreakdown({ scores, compact }: ScoreBreakdownProps) {
  const dimensions = [
    { key: 'role_fit', label: 'Role Fit', tooltip: 'How well your level matches this role' },
    { key: 'division_fit', label: 'Division Fit', tooltip: 'Your expertise in this division' },
    { key: 'store_context', label: 'Store Context', tooltip: 'Experience with similar store complexity' },
    { key: 'capability_fit', label: 'Capability Fit', tooltip: 'Your skills match requirements' },
    { key: 'geography', label: 'Geography', tooltip: 'Location alignment' },
    { key: 'experience_block', label: 'Experience', tooltip: 'Relevant experience blocks' },
    { key: 'preference', label: 'Preference', tooltip: 'Alignment with your career goals' },
  ]

  if (compact) {
    return (
      <div className="mt-4 space-y-2">
        {dimensions.slice(0, 3).map(dim => (
          <DimensionBar key={dim.key} {...dim} score={scores[dim.key]} />
        ))}
        <button className="text-sm underline">Show all dimensions</button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {dimensions.map(dim => (
        <DimensionBar key={dim.key} {...dim} score={scores[dim.key]} />
      ))}
    </div>
  )
}

function DimensionBar({ label, score, tooltip }) {
  const color = score >= 80 ? 'bg-success' : score >= 60 ? 'bg-warning' : 'bg-error'

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="flex items-center gap-1">
          {label}
          <Tooltip content={tooltip}>ⓘ</Tooltip>
        </span>
        <span className="font-medium">{score}/100</span>
      </div>
      <div className="w-full bg-concrete h-2 rounded-full">
        <div 
          className={`${color} h-2 rounded-full transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}
```

### Brand Matches Page
```typescript
// app/(brand)/brand/opportunities/[id]/matches/page.tsx
import { createServerComponentClient } from '@/lib/supabase/server'

export default async function OpportunityMatchesPage({ params }) {
  const supabase = createServerComponentClient()
  
  const { data: opportunity } = await supabase
    .from('opportunities')
    .select('*')
    .eq('id', params.id)
    .single()

  const { data: matches } = await supabase
    .from('matches')
    .select(`
      *,
      talent:talents(
        *,
        experience_blocks(*)
      )
    `)
    .eq('opportunity_id', params.id)
    .order('score_total', { ascending: false })

  return (
    <div className="container py-8">
      <h1>Matches for: {opportunity.title}</h1>
      <p className="text-soft-grey mt-2">{matches.length} qualified talents</p>

      <div className="mt-8 space-y-4">
        {matches.map(match => (
          <TalentMatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  )
}
```

---

## Testing Requirements

### Manual Tests
- [ ] Talent voit ses matches triés par score
- [ ] Brand voit matches par opportunity
- [ ] Score breakdown affiché correctement
- [ ] Compensation alignment badge affiché
- [ ] Compensation numbers JAMAIS visibles
- [ ] Filters fonctionnent
- [ ] Empty states affichés
- [ ] Links vers detail pages fonctionnent

### Edge Cases
- [ ] Aucun match → empty state
- [ ] Très haut score (>95%) → visual correct
- [ ] Très bas score (40-50%) → toujours affiché si >threshold

---

## Definition of Done

- [ ] Talent opportunities list fonctionnelle
- [ ] Brand matches list fonctionnelle
- [ ] Score breakdown visuel implémenté
- [ ] Compensation privacy respectée
- [ ] Filters basiques fonctionnels
- [ ] Empty states
- [ ] Tests manuels passés
- [ ] Code reviewed
