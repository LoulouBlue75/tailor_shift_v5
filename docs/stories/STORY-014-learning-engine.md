# STORY-014: Learning Engine & Recommendations

**Epic:** Intelligence Engines  
**Priority:** P2 (Medium)  
**Story Points:** 8  
**Dependencies:** STORY-004, STORY-011

---

## User Story

En tant que **talent**,  
Je veux **recevoir des recommandations de modules d'apprentissage basées sur mes gaps**,  
Afin de **développer mes compétences et améliorer mon profil**.

---

## Acceptance Criteria

### ✅ AC1: Learning Module Seed Data
- [ ] 10-15 learning modules créés dans DB (`learning_modules`)
- [ ] Catégories couvertes:
  - Service Excellence (3-4 modules)
  - Clienteling (3-4 modules)
  - Operations (2-3 modules)
  - Leadership (2-3 modules)
  - Product Knowledge (1-2 modules)
  - Soft Skills (1-2 modules)
- [ ] Chaque module a:
  - Title
  - Description
  - Category
  - Duration (minutes)
  - Difficulty (beginner/intermediate/advanced)
  - Content type (article/video/quiz/exercise)
  - Target role levels
  - Target gaps (dimension names)

### ✅ AC2: Recommendation Engine Logic
- [ ] Module `/lib/engines/learning.ts` créé
- [ ] Fonction: `getRecommendedModules(talent)`
- [ ] Logic:
  1. Identify gaps from assessment (dimensions < 60)
  2. Consider target role (what capabilities needed?)
  3. Match to modules by category + difficulty
  4. Prioritize by: gap severity × role relevance × not completed
  5. Return top 3-5 modules

### ✅ AC3: Learning Page
- [ ] Route `/talent/learning` créée
- [ ] Section "Recommended for You" (top 3)
- [ ] Section "All Modules" (grid/list par catégorie)
- [ ] Chaque module card affiche:
  - Title
  - Category badge
  - Difficulty badge
  - Duration (ex: "30 min")
  - Progress bar (si started)
  - CTA: "Start" / "Continue" / "Completed" ✓
- [ ] Empty state: "Complete your assessment to get personalized recommendations"

### ✅ AC4: Module Detail Page
- [ ] Route `/talent/learning/[id]` créée
- [ ] Display:
  - Title
  - Description
  - Category
  - Difficulty
  - Duration
  - Content type
  - Why recommended (if applicable)
- [ ] CTA: "Start Module" / "Continue"
- [ ] V1: External link ou placeholder
- [ ] V2: Embedded content

### ✅ AC5: Progress Tracking
- [ ] Table `talent_learning_progress` utilisée
- [ ] Status: `not_started`, `in_progress`, `completed`
- [ ] Progress % (V1: 0 or 100, V2: granular)
- [ ] Started_at, completed_at timestamps
- [ ] Update via Server Action

### ✅ AC6: Mark as Started
- [ ] Clic "Start Module" → insert row dans progress table
- [ ] Status = `in_progress`
- [ ] Progress = 0%
- [ ] Redirect vers module (externe ou stub)

### ✅ AC7: Mark as Completed
- [ ] Clic "Mark as Completed" (V1 manual)
- [ ] V2: Auto via content consumption
- [ ] Status = `completed`
- [ ] Progress = 100%
- [ ] Completed_at = NOW()
- [ ] Toast success

### ✅ AC8: Dashboard Integration
- [ ] Widget "Recommended Learning" sur `/talent/dashboard`
- [ ] Display top 3 modules
- [ ] Link "View All Modules" → `/talent/learning`

---

## Learning Module Examples

```typescript
// Seed data
const LEARNING_MODULES = [
  {
    title: 'Service Excellence Fundamentals',
    description: 'Master the core principles of luxury service delivery',
    category: 'service_excellence',
    duration_minutes: 30,
    difficulty: 'beginner',
    content_type: 'video',
    content_url: 'https://example.com/modules/service-fundamentals', // V1: external
    target_role_levels: ['L1', 'L2'],
    target_gaps: ['service_excellence'],
  },
  {
    title: 'Advanced Clienteling Techniques',
    description: 'Build lasting relationships with VIC clients through strategic engagement',
    category: 'clienteling',
    duration_minutes: 45,
    difficulty: 'intermediate',
    content_type: 'article',
    content_url: 'https://example.com/modules/advanced-clienteling',
    target_role_levels: ['L2', 'L3', 'L4'],
    target_gaps: ['clienteling'],
  },
  {
    title: 'Inventory Management Best Practices',
    description: 'Optimize stock levels, reduce shrinkage, and maintain accuracy',
    category: 'operations',
    duration_minutes: 40,
    difficulty: 'intermediate',
    content_type: 'exercise',
    content_url: 'https://example.com/modules/inventory-management',
    target_role_levels: ['L3', 'L4', 'L5'],
    target_gaps: ['operations'],
  },
  {
    title: 'Leading High-Performance Teams',
    description: 'Coaching, motivating, and developing luxury retail teams',
    category: 'leadership',
    duration_minutes: 60,
    difficulty: 'advanced',
    content_type: 'video',
    content_url: 'https://example.com/modules/leading-teams',
    target_role_levels: ['L4', 'L5', 'L6'],
    target_gaps: ['leadership_signals'],
  },
  {
    title: 'Product Knowledge: Leather Goods Craftsmanship',
    description: 'Deep dive into luxury leather goods materials and techniques',
    category: 'product_knowledge',
    duration_minutes: 35,
    difficulty: 'intermediate',
    content_type: 'article',
    target_role_levels: ['L1', 'L2', 'L3'],
    target_gaps: [],
  },
  // ... 10-15 total
]
```

---

## Technical Implementation

### Learning Engine
```typescript
// lib/engines/learning.ts

export function getRecommendedModules(
  talent: Talent,
  allModules: LearningModule[]
): LearningModule[] {
  // 1. Identify gaps
  const assessmentScores = talent.assessment_summary || {}
  const gaps: string[] = []
  
  if (assessmentScores.service_excellence < 60) gaps.push('service_excellence')
  if (assessmentScores.clienteling < 60) gaps.push('clienteling')
  if (assessmentScores.operations < 60) gaps.push('operations')
  if (assessmentScores.leadership_signals < 60) gaps.push('leadership_signals')

  // 2. Filter modules by gaps
  let recommended = allModules.filter(module => 
    module.target_gaps.some(gap => gaps.includes(gap))
  )

  // If no gaps (high performer), recommend advanced modules
  if (recommended.length === 0) {
    recommended = allModules.filter(m => m.difficulty === 'advanced')
  }

  // 3. Filter by role level
  const currentLevel = talent.current_role_level
  if (currentLevel) {
    recommended = recommended.filter(m => 
      m.target_role_levels.includes(currentLevel)
    )
  }

  // 4. Sort by priority (gap severity)
  recommended.sort((a, b) => {
    const aGapScore = Math.min(...a.target_gaps.map(g => assessmentScores[g] || 100))
    const bGapScore = Math.min(...b.target_gaps.map(g => assessmentScores[g] || 100))
    return aGapScore - bGapScore
  })

  return recommended.slice(0, 5)
}
```

### Learning Page
```typescript
// app/(talent)/talent/learning/page.tsx
import { createServerComponentClient } from '@/lib/supabase/server'
import { getRecommendedModules } from '@/lib/engines/learning'
import { ModuleCard } from '@/components/talent/ModuleCard'

export default async function LearningPage() {
  const supabase = createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: talent } = await supabase
    .from('talents')
    .select('*')
    .eq('profile_id', user.id)
    .single()

  const { data: allModules } = await supabase
    .from('learning_modules')
    .select('*')
    .order('category')

  const { data: progress } = await supabase
    .from('talent_learning_progress')
    .select('*')
    .eq('talent_id', talent.id)

  const recommended = getRecommendedModules(talent, allModules)

  // Group by category
  const byCategory = allModules.reduce((acc, module) => {
    if (!acc[module.category]) acc[module.category] = []
    acc[module.category].push(module)
    return acc
  }, {})

  return (
    <div className="container py-8">
      <h1>Learning & Development</h1>

      {talent.assessment_summary?.completed_at ? (
        <>
          <section className="mt-8">
            <h2>Recommended for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {recommended.map(module => (
                <ModuleCard 
                  key={module.id} 
                  module={module} 
                  progress={progress.find(p => p.module_id === module.id)}
                  highlighted
                />
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h2>All Modules</h2>
            {Object.entries(byCategory).map(([category, modules]) => (
              <div key={category} className="mt-8">
                <h3 className="capitalize">{category.replace('_', ' ')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  {modules.map(module => (
                    <ModuleCard 
                      key={module.id} 
                      module={module}
                      progress={progress.find(p => p.module_id === module.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>
        </>
      ) : (
        <div className="mt-8 text-center py-12">
          <p className="text-soft-grey">
            Complete your assessment to get personalized learning recommendations
          </p>
          <Link href="/talent/assessment">
            <Button variant="primary" className="mt-4">
              Start Assessment
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
```

### ModuleCard Component
```typescript
// components/talent/ModuleCard.tsx
export function ModuleCard({ module, progress, highlighted }) {
  const status = progress?.status || 'not_started'
  const progressPct = progress?.progress_pct || 0

  return (
    <Card variant={highlighted ? 'elevated' : 'default'}>
      {highlighted && <Badge variant="success">Recommended</Badge>}
      
      <h4 className="mt-2">{module.title}</h4>
      <p className="text-sm text-soft-grey mt-2">{module.description}</p>

      <div className="flex gap-2 mt-4">
        <Badge>{module.category.replace('_', ' ')}</Badge>
        <Badge>{module.difficulty}</Badge>
        <Badge>{module.duration_minutes} min</Badge>
      </div>

      {status !== 'not_started' && (
        <div className="mt-4">
          <div className="w-full bg-concrete h-2 rounded-full">
            <div 
              className="bg-matte-gold h-2 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-soft-grey mt-1">{progressPct}% complete</p>
        </div>
      )}

      <Link href={`/talent/learning/${module.id}`}>
        <Button 
          variant={status === 'not_started' ? 'primary' : 'secondary'} 
          size="sm" 
          className="mt-4 w-full"
        >
          {status === 'completed' ? 'Review' : status === 'in_progress' ? 'Continue' : 'Start'}
        </Button>
      </Link>
    </Card>
  )
}
```

### Server Actions
```typescript
// app/actions/learning.ts
'use server'

import { createServerActionClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function startModule(moduleId: string) {
  const supabase = createServerActionClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: talent } = await supabase
    .from('talents')
    .select('id')
    .eq('profile_id', user.id)
    .single()

  const { error } = await supabase
    .from('talent_learning_progress')
    .upsert({
      talent_id: talent.id,
      module_id: moduleId,
      status: 'in_progress',
      progress_pct: 0,
      started_at: new Date().toISOString(),
    }, { onConflict: 'talent_id,module_id' })

  if (error) throw error

  revalidatePath('/talent/learning')
  return { success: true }
}

export async function completeModule(moduleId: string) {
  const supabase = createServerActionClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: talent } = await supabase
    .from('talents')
    .select('id')
    .eq('profile_id', user.id)
    .single()

  const { error } = await supabase
    .from('talent_learning_progress')
    .update({
      status: 'completed',
      progress_pct: 100,
      completed_at: new Date().toISOString(),
    })
    .eq('talent_id', talent.id)
    .eq('module_id', moduleId)

  if (error) throw error

  revalidatePath('/talent/learning')
  return { success: true }
}
```

---

## Testing Requirements

### Manual Tests
- [ ] Recommendations basées sur assessment gaps
- [ ] Modules affichés par catégorie
- [ ] Start module → progress créé
- [ ] Complete module → status updated
- [ ] Progress bar affichée correctement
- [ ] Empty state si no assessment

### Edge Cases
- [ ] No gaps (high performer) → advanced modules
- [ ] No assessment → no recommendations
- [ ] Complete all modules → what to show?

---

## Definition of Done

- [ ] Learning modules seed data (10-15)
- [ ] Recommendation engine implémenté
- [ ] Learning page fonctionnelle
- [ ] Progress tracking fonctionnel
- [ ] Dashboard integration
- [ ] Tests manuels passés
- [ ] Code reviewed
