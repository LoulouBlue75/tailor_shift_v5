# STORY-011: Assessment Engine (Retail Excellence Scan)

**Epic:** Intelligence Engines  
**Priority:** P0 (Blocker)  
**Story Points:** 21  
**Dependencies:** STORY-004

---

## User Story

En tant que **talent**,  
Je veux **compléter une évaluation de 10-12 questions sur 4 dimensions**,  
Afin de **recevoir un profil de compétences et améliorer mon matching**.

---

## Acceptance Criteria

### ✅ AC1: Assessment Questions Database
- [ ] 10-12 questions créées et stockées (hardcoded ou DB)
- [ ] Questions couvrent 4 dimensions:
  - Service Excellence (3 questions)
  - Clienteling (3 questions)
  - Operations (2-3 questions)
  - Leadership Signals (2-3 questions)
- [ ] Mix de types:
  - Multiple choice (3-5 options)
  - Situational judgment (scenario + best action)
  - Behavioral (Likert scale 1-5)
- [ ] Questions adaptées au role level déclaré (basic V1: same for all)

### ✅ AC2: Assessment Flow
- [ ] Route `/talent/assessment` créée
- [ ] Page intro:
  - Titre: "Retail Excellence Scan"
  - Description 4D model
  - Durée: 15-20 min
  - Privacy note: "Your answers are used only for scoring and are deleted after"
  - CTA: "Start Assessment"
- [ ] Progress indicator (Question 1/12, 2/12, etc.)
- [ ] Une question par page
- [ ] Navigation: "Previous", "Next"
- [ ] "Next" disabled si pas de réponse
- [ ] Save progress (answers_temp JSONB)
- [ ] Submit sur dernière question

### ✅ AC3: Question Display
- [ ] Question text affiché clairement
- [ ] Type de réponse adapté:
  - Radio buttons (multiple choice)
  - Radio buttons (Likert scale)
  - Scenario + options (situational)
- [ ] Optional: illustration ou contexte additionnel
- [ ] Helper text si nécessaire

### ✅ AC4: Scoring Engine
- [ ] Scoring algorithm pour chaque dimension
- [ ] Chaque question mapped à une dimension
- [ ] Score 0-100 par dimension
- [ ] Logique déterministe (same answers = same score)
- [ ] Weights par question (certaines comptent plus)
- [ ] Output: 4 scores + aggregate insights

### ✅ AC5: Scoring Logic (Simplified V1)
- [ ] Service Excellence:
  - Questions sur client experience, luxury standards
  - Scoring: correct answer = points, weighted average
- [ ] Clienteling:
  - Questions sur relationship building, VIC management
  - Similar scoring
- [ ] Operations:
  - Questions sur process efficiency, compliance
  - Similar scoring
- [ ] Leadership Signals:
  - Questions sur team influence, coaching
  - Similar scoring

### ✅ AC6: Results Generation
- [ ] Après submit:
  - Compute scores (4 dimensions)
  - Generate insights:
    - Top 2 strengths (highest scores)
    - Bottom 2 development areas (lowest scores)
    - Recommended career paths (based on profile)
  - Save scores to `assessments` table
  - Update `talents.assessment_summary`
  - **Delete `answers_temp`** (privacy)
- [ ] Redirect `/talent/assessment/results`

### ✅ AC7: Results Display
- [ ] Route `/talent/assessment/results` créée
- [ ] Display scores avec visual bars ou gauges:
  - Service Excellence: 78/100
  - Clienteling: 82/100
  - Operations: 65/100
  - Leadership Signals: 70/100
- [ ] Strengths section:
  - "Your top strengths: Clienteling, Service Excellence"
  - Brief explanation
- [ ] Development areas:
  - "Areas to develop: Operations, Leadership Signals"
  - Brief explanation
- [ ] Recommended paths:
  - "Based on your profile, consider: Client Advisor Expert, VIC Manager"
- [ ] CTAs:
  - "View Learning Recommendations" → `/talent/learning`
  - "Update Profile" → `/talent/profile`
  - "Browse Opportunities" → `/talent/opportunities`

### ✅ AC8: Retake Assessment
- [ ] Option "Retake Assessment" disponible
- [ ] Limite: 1 fois tous les 6 mois (optionnel V1, peut être unlocked)
- [ ] Nouvelle assessment row créée
- [ ] Update `talents.assessment_summary` avec latest

### ✅ AC9: Assessment Version Stamping
- [ ] Chaque assessment a `version` field (ex: 'v1')
- [ ] Si questions/scoring changent → new version
- [ ] Permet comparaison historique (V2)

### ✅ AC10: Privacy & Data Deletion
- [ ] `answers_temp` jamais exposé au front
- [ ] Deleted immédiatement après scoring
- [ ] Seuls scores + insights persistés
- [ ] Compliance note affiché

---

## Sample Questions

### Service Excellence (3 questions)

**Q1: A VIP client enters the boutique looking frustrated. What is your first action?**
- A) Immediately approach and ask how you can assist
- B) Observe from a distance to assess their mood
- C) Alert your manager before approaching
- D) Wait for them to approach the counter

**Correct:** A  
**Dimension:** Service Excellence  
**Weight:** 1.0

**Q2: On a scale of 1-5, how important is it to follow up with a client after a significant purchase?**
- 1: Not important
- 2: Slightly important
- 3: Moderately important
- 4: Very important
- 5: Extremely important

**Correct:** 5  
**Dimension:** Service Excellence + Clienteling  
**Weight:** 0.8

**Q3: You notice a client admiring a product but hesitating. How do you proceed?**
- A) Give them space to decide on their own
- B) Approach and share the product story and craftsmanship
- C) Offer a discount to encourage purchase
- D) Suggest a cheaper alternative

**Correct:** B  
**Dimension:** Service Excellence  
**Weight:** 1.2

### Clienteling (3 questions)

**Q4: How often should you contact a VIC client?**
- A) Only when they visit the boutique
- B) Monthly, regardless of purchase activity
- C) Based on their preferences and purchase patterns
- D) Weekly to ensure top-of-mind

**Correct:** C  
**Dimension:** Clienteling  
**Weight:** 1.0

**Q5: A client mentions they're traveling to Paris next month. What do you do?**
- A) Note it in CRM for future reference
- B) Immediately connect them with Paris boutique and set an appointment
- C) Wish them a great trip
- D) Offer to ship products to Paris

**Correct:** B  
**Dimension:** Clienteling  
**Weight:** 1.3

### Operations (2-3 questions)

**Q6: During inventory, you find a discrepancy. What is your priority?**
- A) Report to manager immediately
- B) Re-count to verify the discrepancy
- C) Document and investigate root cause
- D) Adjust system to match physical count

**Correct:** C  
**Dimension:** Operations  
**Weight:** 1.0

### Leadership Signals (2-3 questions)

**Q7: A junior team member is struggling with clienteling. How do you help?**
- A) Do it for them to ensure quality
- B) Provide specific examples and coach through next interaction
- C) Tell them to read the training materials
- D) Escalate to manager

**Correct:** B  
**Dimension:** Leadership Signals  
**Weight:** 1.2

---

## Technical Implementation

### Questions Data Structure
```typescript
// data/assessment-questions.ts
interface AssessmentQuestion {
  id: string
  dimension: 'service_excellence' | 'clienteling' | 'operations' | 'leadership_signals'
  type: 'multiple_choice' | 'likert' | 'situational'
  text: string
  options: Array<{
    id: string
    text: string
    score: number // 0-1
  }>
  weight: number
  explanation?: string // Shown after answer (V2)
}

export const ASSESSMENT_QUESTIONS_V1: AssessmentQuestion[] = [
  {
    id: 'se-1',
    dimension: 'service_excellence',
    type: 'multiple_choice',
    text: 'A VIP client enters the boutique looking frustrated...',
    options: [
      { id: 'a', text: 'Immediately approach and ask how you can assist', score: 1 },
      { id: 'b', text: 'Observe from a distance to assess their mood', score: 0.3 },
      { id: 'c', text: 'Alert your manager before approaching', score: 0.5 },
      { id: 'd', text: 'Wait for them to approach the counter', score: 0 },
    ],
    weight: 1.0,
  },
  // ... 10-12 total
]
```

### Assessment Flow Component
```typescript
// app/(talent)/talent/assessment/page.tsx
'use client'

import { useState } from 'react'
import { ASSESSMENT_QUESTIONS_V1 } from '@/data/assessment-questions'
import { submitAssessment } from '@/app/actions/assessments'

export default function AssessmentPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const currentQuestion = ASSESSMENT_QUESTIONS_V1[currentIndex]
  const progress = ((currentIndex + 1) / ASSESSMENT_QUESTIONS_V1.length) * 100

  const handleNext = () => {
    if (currentIndex < ASSESSMENT_QUESTIONS_V1.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    const result = await submitAssessment(answers)
    if (result.success) {
      setSubmitted(true)
      // Redirect to results
      window.location.href = '/talent/assessment/results'
    }
  }

  return (
    <div className="container max-w-2xl py-8">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="w-full bg-concrete h-2 rounded-full">
          <div 
            className="bg-matte-gold h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm mt-2 text-soft-grey">
          Question {currentIndex + 1} of {ASSESSMENT_QUESTIONS_V1.length}
        </p>
      </div>

      {/* Question */}
      <Card>
        <h3 className="mb-6">{currentQuestion.text}</h3>
        
        <div className="space-y-3">
          {currentQuestion.options.map(option => (
            <label
              key={option.id}
              className="flex items-center p-4 border border-concrete rounded-lg cursor-pointer hover:border-matte-gold transition"
            >
              <input
                type="radio"
                name={currentQuestion.id}
                value={option.id}
                checked={answers[currentQuestion.id] === option.id}
                onChange={(e) => setAnswers({
                  ...answers,
                  [currentQuestion.id]: e.target.value
                })}
                className="mr-3"
              />
              <span>{option.text}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <Button
            variant="secondary"
            onClick={() => setCurrentIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!answers[currentQuestion.id]}
          >
            {currentIndex === ASSESSMENT_QUESTIONS_V1.length - 1 ? 'Submit' : 'Next'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
```

### Scoring Engine
```typescript
// lib/engines/assessment.ts
import { ASSESSMENT_QUESTIONS_V1 } from '@/data/assessment-questions'

interface AssessmentAnswers {
  [questionId: string]: string // option ID
}

interface AssessmentScores {
  service_excellence: number
  clienteling: number
  operations: number
  leadership_signals: number
}

export function scoreAssessment(answers: AssessmentAnswers): AssessmentScores {
  const dimensionScores: Record<string, { total: number; weight: number }> = {
    service_excellence: { total: 0, weight: 0 },
    clienteling: { total: 0, weight: 0 },
    operations: { total: 0, weight: 0 },
    leadership_signals: { total: 0, weight: 0 },
  }

  ASSESSMENT_QUESTIONS_V1.forEach(question => {
    const selectedOptionId = answers[question.id]
    if (!selectedOptionId) return

    const selectedOption = question.options.find(o => o.id === selectedOptionId)
    if (!selectedOption) return

    const dimension = question.dimension
    dimensionScores[dimension].total += selectedOption.score * question.weight
    dimensionScores[dimension].weight += question.weight
  })

  // Normalize to 0-100
  const scores: AssessmentScores = {
    service_excellence: Math.round((dimensionScores.service_excellence.total / dimensionScores.service_excellence.weight) * 100),
    clienteling: Math.round((dimensionScores.clienteling.total / dimensionScores.clienteling.weight) * 100),
    operations: Math.round((dimensionScores.operations.total / dimensionScores.operations.weight) * 100),
    leadership_signals: Math.round((dimensionScores.leadership_signals.total / dimensionScores.leadership_signals.weight) * 100),
  }

  return scores
}

export function generateInsights(scores: AssessmentScores) {
  const entries = Object.entries(scores)
  const sorted = entries.sort((a, b) => b[1] - a[1])

  const strengths = sorted.slice(0, 2).map(([dim]) => dim)
  const developmentAreas = sorted.slice(-2).map(([dim]) => dim)

  // Basic recommendation logic
  const recommendedPaths = []
  if (scores.clienteling >= 75 && scores.service_excellence >= 70) {
    recommendedPaths.push('Client Relationship Specialist', 'VIC Manager')
  }
  if (scores.leadership_signals >= 70) {
    recommendedPaths.push('Team Lead', 'Floor Manager')
  }
  if (scores.operations >= 75) {
    recommendedPaths.push('Operations Coordinator', 'Stock Manager')
  }

  return {
    strengths,
    development_areas: developmentAreas,
    recommended_paths: recommendedPaths,
  }
}
```

### Server Action
```typescript
// app/actions/assessments.ts
'use server'

import { createServerActionClient } from '@/lib/supabase/server'
import { scoreAssessment, generateInsights } from '@/lib/engines/assessment'

export async function submitAssessment(answers: Record<string, string>) {
  const supabase = createServerActionClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: talent } = await supabase
    .from('talents')
    .select('id')
    .eq('profile_id', user.id)
    .single()

  // Score assessment
  const scores = scoreAssessment(answers)
  const insights = generateInsights(scores)

  // Save to DB
  const { error } = await supabase
    .from('assessments')
    .insert({
      talent_id: talent.id,
      version: 'v1',
      status: 'completed',
      scores,
      insights,
      completed_at: new Date().toISOString(),
      // answers_temp NOT saved (privacy)
    })

  if (error) throw error

  // Update talent summary
  await supabase
    .from('talents')
    .update({
      assessment_summary: {
        ...scores,
        version: 'v1',
        completed_at: new Date().toISOString(),
      }
    })
    .eq('id', talent.id)

  return { success: true }
}
```

---

## Testing Requirements

### Manual Tests
- [ ] Assessment flow complet sans erreur
- [ ] Progress bar update
- [ ] Answers sauvegardées
- [ ] Scores calculés correctement
- [ ] Insights générés
- [ ] Results page affiche scores
- [ ] Retake crée nouvelle assessment

### Edge Cases
- [ ] Refresh mid-assessment → resume où on était (V2, V1 = restart)
- [ ] Submit sans toutes les réponses → disabled
- [ ] Same answers → same scores (deterministic)

---

## Definition of Done

- [ ] 10-12 questions créées
- [ ] Assessment flow complet
- [ ] Scoring engine implémenté
- [ ] Results page fonctionnelle
- [ ] Privacy: answers deleted
- [ ] Tests manuels passés
- [ ] Code reviewed
