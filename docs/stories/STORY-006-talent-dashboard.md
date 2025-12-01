# STORY-006: Talent Dashboard

**Epic:** Talent Journey  
**Priority:** P1 (High)  
**Story Points:** 13  
**Dependencies:** STORY-004, STORY-005

---

## User Story

En tant que **talent**,  
Je veux **voir un dashboard personnalisé avec mes informations clés**,  
Afin de **suivre mon profil, mes matches, et mes prochaines actions**.

---

## Acceptance Criteria

### ✅ AC1: Dashboard Layout
- [ ] Route `/talent/dashboard` créée
- [ ] Layout responsive (mobile-first)
- [ ] Navigation principale (sidebar ou top nav):
  - Dashboard
  - Profile
  - Opportunities
  - Learning
  - Settings
- [ ] Header avec nom du talent + avatar

### ✅ AC2: Profile Completion Section
- [ ] Widget "Profile Completion" affiché
- [ ] Progress bar visuelle (ex: 65%)
- [ ] Liste des sections manquantes:
  - "Add more experience blocks"
  - "Complete your assessment"
  - "Update career preferences"
- [ ] CTA: "Complete Profile" → lien vers section appropriée

### ✅ AC3: Match Feed Section
- [ ] Titre: "Opportunities for You"
- [ ] Liste des top 5 matches (score DESC)
- [ ] Chaque match affiche:
  - Opportunity title (ex: "Senior Advisor - Fashion")
  - Brand name (si visible)
  - Store location (city)
  - Match score (ex: "87% match")
  - Compensation alignment tag: "Within Range" / "Above Range" / "Unknown"
  - CTA: "View Details"
- [ ] Empty state si aucun match: "No matches yet. Complete your profile to unlock opportunities."

### ✅ AC4: Assessment Status Section
- [ ] Widget "Retail Excellence Profile"
- [ ] Si assessment non complété:
  - Message: "Unlock personalized matches and learning"
  - CTA: "Start Assessment"
- [ ] Si assessment complété:
  - Display scores (4 dimensions):
    - Service Excellence: 78/100
    - Clienteling: 82/100
    - Operations: 65/100
    - Leadership Signals: 70/100
  - Visual bars ou gauges
  - CTA: "View Detailed Results" → `/talent/assessment/results`
  - CTA: "Retake Assessment" (si > 6 mois)

### ✅ AC5: Learning Recommendations Section
- [ ] Titre: "Recommended for You"
- [ ] Liste de 3 modules recommandés (basés sur assessment gaps)
- [ ] Chaque module affiche:
  - Title
  - Duration (ex: "30 min")
  - Difficulty badge
  - Progress (si déjà commencé)
  - CTA: "Start" / "Continue"
- [ ] Lien "View All Modules" → `/talent/learning`

### ✅ AC6: Career Projection Section (Basic V1)
- [ ] Widget "Your Career Path"
- [ ] Display:
  - Current role level (ex: "L2 - Senior Advisor")
  - Next recommended role (ex: "L3 - Team Lead")
  - Readiness indicator: "Ready Now" / "Ready Soon" / "Developing"
  - Timeline estimate (ex: "6-12 months")
- [ ] CTA: "View Projection Details" (optionnel V1, peut être stub)

### ✅ AC7: Quick Actions
- [ ] Floating action button ou section:
  - "Add Experience"
  - "Browse Opportunities"
  - "Update Preferences"

### ✅ AC8: Data Fetching
- [ ] Server Component pour data fetching
- [ ] Queries optimisées (select only needed fields)
- [ ] Error handling (DB down, no data)
- [ ] Loading states

---

## UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Header: Welcome back, [First Name] 👋                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────┐  ┌────────────────────────────┐ │
│  │ Profile Completion   │  │ Assessment Status          │ │
│  │ ████████░░░░ 65%     │  │ Service Excellence: 78    │ │
│  │ • Complete assessment│  │ Clienteling: 82           │ │
│  │ • Add 2 more blocks  │  │ [View Results]            │ │
│  └──────────────────────┘  └────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Opportunities for You                                 │ │
│  │ ┌─────────────────────────────────────────────────┐   │ │
│  │ │ Senior Advisor - Fashion                        │   │ │
│  │ │ Paris • 87% match • Within Range               │   │ │
│  │ └─────────────────────────────────────────────────┘   │ │
│  │ [2-3 more matches...]                                │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌──────────────────────┐  ┌────────────────────────────┐ │
│  │ Recommended Learning │  │ Your Career Path           │ │
│  │ • Module 1           │  │ Current: L2 Senior Advisor │ │
│  │ • Module 2           │  │ Next: L3 Team Lead         │ │
│  │ • Module 3           │  │ Readiness: Ready Soon      │ │
│  └──────────────────────┘  └────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Technical Implementation

### Dashboard Page (Server Component)
```typescript
// app/(talent)/talent/dashboard/page.tsx
import { createServerComponentClient } from '@/lib/supabase/server'
import { ProfileCompletion } from '@/components/talent/ProfileCompletion'
import { MatchFeed } from '@/components/talent/MatchFeed'
import { AssessmentStatus } from '@/components/talent/AssessmentStatus'
import { LearningRecommendations } from '@/components/talent/LearningRecommendations'

export default async function TalentDashboard() {
  const supabase = createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch talent data
  const { data: talent } = await supabase
    .from('talents')
    .select(`
      *,
      experience_blocks(count),
      assessments(*)
    `)
    .eq('profile_id', user.id)
    .single()

  // Fetch top matches
  const { data: matches } = await supabase
    .from('matches')
    .select(`
      *,
      opportunities(
        id,
        title,
        opportunities.brands(name),
        opportunities.stores(city)
      )
    `)
    .eq('talent_id', talent.id)
    .eq('status', 'suggested')
    .order('score_total', { ascending: false })
    .limit(5)

  return (
    <div className="container py-8">
      <h1>Welcome back, {talent.first_name} 👋</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <ProfileCompletion talent={talent} />
        <AssessmentStatus assessment={talent.assessments?.[0]} />
      </div>

      <MatchFeed matches={matches} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <LearningRecommendations talentId={talent.id} />
        <CareerProjection talent={talent} />
      </div>
    </div>
  )
}
```

### Profile Completion Component
```typescript
// components/talent/ProfileCompletion.tsx
'use client'

interface ProfileCompletionProps {
  talent: Talent
}

export function ProfileCompletion({ talent }: ProfileCompletionProps) {
  const completion = talent.profile_completion_pct || 0
  const missingItems = getMissingProfileItems(talent)

  return (
    <Card>
      <h3>Profile Completion</h3>
      <div className="mt-4">
        <div className="w-full bg-concrete h-2 rounded-full">
          <div 
            className="bg-matte-gold h-2 rounded-full transition-all"
            style={{ width: `${completion}%` }}
          />
        </div>
        <p className="text-sm mt-2">{completion}% complete</p>
      </div>

      {missingItems.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium">To improve your profile:</p>
          <ul className="mt-2 space-y-1">
            {missingItems.map(item => (
              <li key={item.key} className="text-sm text-soft-grey">
                • {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button variant="primary" className="mt-4">
        Complete Profile
      </Button>
    </Card>
  )
}

function getMissingProfileItems(talent: Talent) {
  const items = []
  if (!talent.assessments?.some(a => a.status === 'completed')) {
    items.push({ key: 'assessment', label: 'Complete your assessment' })
  }
  if ((talent.experience_blocks?.count || 0) < 2) {
    items.push({ key: 'experience', label: 'Add more experience blocks' })
  }
  // ... more checks
  return items
}
```

### Match Feed Component
```typescript
// components/talent/MatchFeed.tsx
interface MatchFeedProps {
  matches: Match[]
}

export function MatchFeed({ matches }: MatchFeedProps) {
  if (!matches || matches.length === 0) {
    return (
      <Card className="mt-8">
        <h3>Opportunities for You</h3>
        <p className="mt-4 text-soft-grey">
          No matches yet. Complete your profile to unlock opportunities.
        </p>
      </Card>
    )
  }

  return (
    <Card className="mt-8">
      <div className="flex justify-between items-center">
        <h3>Opportunities for You</h3>
        <a href="/talent/opportunities" className="text-sm underline">
          View All
        </a>
      </div>

      <div className="mt-6 space-y-4">
        {matches.map(match => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </Card>
  )
}

function MatchCard({ match }) {
  return (
    <div className="border border-concrete rounded-lg p-4 hover:border-matte-gold transition">
      <h4 className="font-medium">{match.opportunity.title}</h4>
      <p className="text-sm text-soft-grey mt-1">
        {match.opportunity.store?.city}
      </p>
      <div className="flex items-center gap-4 mt-3">
        <Badge variant="success">{match.score_total}% match</Badge>
        <Badge variant="default">{match.compensation_alignment}</Badge>
      </div>
      <Button variant="secondary" size="sm" className="mt-3">
        View Details
      </Button>
    </div>
  )
}
```

---

## Testing Requirements

### Manual Tests
- [ ] Dashboard affiche données correctes
- [ ] Profile completion % correct
- [ ] Matches triés par score DESC
- [ ] Empty states affichés si pas de données
- [ ] Links fonctionnent (CTA vers bonnes pages)
- [ ] Responsive design (mobile, tablet, desktop)

### Edge Cases
- [ ] Nouveau talent (pas de matches, pas d'assessment) → empty states
- [ ] Talent avec profil 100% → aucun CTA completion
- [ ] Pas de connexion DB → error handling

---

## Performance Considerations

- [ ] Use Server Components pour data fetching
- [ ] Limit queries (select only needed fields)
- [ ] Cache dashboard data (stale-while-revalidate)
- [ ] Pagination si > 5 matches (V2)

---

## Definition of Done

- [ ] Dashboard affiche toutes les sections
- [ ] Data fetching optimisé
- [ ] Empty states implémentés
- [ ] Responsive design
- [ ] Tests manuels passés
- [ ] Code reviewed
