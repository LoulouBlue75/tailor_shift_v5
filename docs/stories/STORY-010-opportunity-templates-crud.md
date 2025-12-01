# STORY-010: Opportunity Templates & CRUD

**Epic:** Brand Journey  
**Priority:** P1 (High)  
**Story Points:** 13  
**Dependencies:** STORY-004, STORY-009

---

## User Story

En tant que **brand**,  
Je veux **créer des opportunités à partir de templates ou from scratch**,  
Afin de **publier des postes et attirer des talents qualifiés**.

---

## Acceptance Criteria

### ✅ AC1: Opportunity Templates Data
- [ ] 10-15 templates hardcodés dans `/data/templates/opportunities.ts`
- [ ] Chaque template contient:
  - Title
  - Role level
  - Division(s)
  - Typical requirements (years of experience, capabilities)
  - Responsibilities (array, 5-8 items)
  - Description template
- [ ] Templates couvrent L1-L8

### ✅ AC2: Template Selection
- [ ] Page `/brand/opportunities/new` créée
- [ ] Step 1: "Choose a template or start from scratch"
- [ ] Grid ou liste de templates avec:
  - Title (ex: "L1 Sales Advisor - Fashion")
  - Role level badge
  - Division badge
  - Description courte
  - Bouton "Use Template"
- [ ] Option: "Start from Scratch" (blank form)

### ✅ AC3: Create Opportunity Form
- [ ] Step 2: Formulaire (pre-filled si template)
- [ ] Champs:
  - Title (text) - **required**
  - Store (dropdown: select from brand's stores, or "Brand-level") - optional
  - Role level (dropdown L1-L8) - **required**
  - Division (dropdown) - optional
  - Required experience years (number) - optional
  - Required languages (multi-input) - optional
  - Required capabilities (JSONB, V1 simple: text array) - optional
  - Description (rich textarea, 2000 chars max) - **required**
  - Responsibilities (dynamic list, max 10) - **required**, min 3
  - Compensation range (min/max/currency/includes_variable) - optional
    - **Never displayed to talents, internal only**
- [ ] Validation client + serveur

### ✅ AC4: Compensation Range (Privacy)
- [ ] Section "Compensation Range (Internal Only)"
- [ ] Helper text: "This information is never shown to candidates. Used only for alignment tagging."
- [ ] Fields:
  - Min (number)
  - Max (number)
  - Currency (dropdown: EUR, USD, GBP, etc.)
  - Includes variable (checkbox)
- [ ] Validation: max >= min

### ✅ AC5: Save as Draft
- [ ] Bouton "Save as Draft"
- [ ] Status = 'draft'
- [ ] Redirect `/brand/opportunities` avec toast
- [ ] Drafts visibles dans liste avec badge "Draft"

### ✅ AC6: Publish Opportunity
- [ ] Bouton "Publish"
- [ ] Validation complète (tous champs requis remplis)
- [ ] Status = 'active'
- [ ] `published_at` = NOW()
- [ ] Trigger matching engine (V1: async job ou immédiat)
- [ ] Redirect avec toast "Opportunity published successfully"

### ✅ AC7: Opportunities List
- [ ] Route `/brand/opportunities` créée
- [ ] Tabs ou filters:
  - All
  - Active
  - Draft
  - Paused
  - Filled
- [ ] Chaque opportunity affiche:
  - Title
  - Store name (ou "Brand-level")
  - Role level
  - Status badge
  - Match count (si active)
  - Published date
  - Actions: "View", "Edit", "Pause/Unpause", "Mark Filled", "Delete"
- [ ] Empty state par status

### ✅ AC8: Edit Opportunity
- [ ] Page `/brand/opportunities/[id]/edit`
- [ ] Formulaire pré-rempli
- [ ] Update via Server Action
- [ ] Si status = 'active', re-trigger matching après edit
- [ ] Redirect avec toast

### ✅ AC9: Pause/Unpause Opportunity
- [ ] Bouton "Pause" si active
- [ ] Bouton "Unpause" si paused
- [ ] Update status via Server Action
- [ ] Paused opportunities ne sont plus visibles par talents

### ✅ AC10: Mark as Filled
- [ ] Bouton "Mark as Filled"
- [ ] Confirmation dialog
- [ ] Status = 'filled'
- [ ] Plus visible par talents
- [ ] Matches archivés (optionnel V1)

### ✅ AC11: Delete Opportunity
- [ ] Bouton "Delete" (draft ou filled uniquement)
- [ ] Confirmation dialog
- [ ] Delete via Server Action
- [ ] CASCADE matches (ou SET NULL si applicable)

### ✅ AC12: Opportunity Detail Page
- [ ] Route `/brand/opportunities/[id]`
- [ ] Affiche tous les détails
- [ ] Section "Matches" (top 10, link "View All")
- [ ] CTAs: "Edit", "View All Matches", "Pause/Unpause", "Mark Filled"

---

## Opportunity Templates Examples

```typescript
// data/templates/opportunities.ts
export const OPPORTUNITY_TEMPLATES = [
  {
    id: 'l1-sales-advisor-fashion',
    title: 'Sales Advisor - Fashion',
    roleLevel: 'L1',
    division: 'fashion',
    requiredExperienceYears: 0,
    description: `We are seeking a passionate Sales Advisor to join our fashion department. You will deliver exceptional client experiences while representing our brand's heritage and values.`,
    responsibilities: [
      'Provide personalized service to clients',
      'Achieve individual sales targets',
      'Maintain product knowledge and brand expertise',
      'Execute visual merchandising standards',
      'Process transactions accurately',
      'Build client relationships',
    ],
    requiredCapabilities: ['Service Excellence', 'Product Knowledge'],
  },
  {
    id: 'l2-senior-advisor',
    title: 'Senior Sales Advisor',
    roleLevel: 'L2',
    division: null, // Generic
    requiredExperienceYears: 2,
    description: `Join our team as a Senior Sales Advisor. Leverage your luxury retail expertise to drive sales, mentor junior team members, and build lasting client relationships.`,
    responsibilities: [
      'Deliver premium client experiences',
      'Exceed sales targets consistently',
      'Mentor and coach new team members',
      'Develop and maintain VIC portfolio',
      'Lead by example in service excellence',
      'Support team leads with daily operations',
    ],
    requiredCapabilities: ['Service Excellence', 'Clienteling', 'Informal Leadership'],
  },
  {
    id: 'l3-team-lead',
    title: 'Team Lead',
    roleLevel: 'L3',
    division: null,
    requiredExperienceYears: 3,
    description: `We are looking for an experienced Team Lead to oversee a team of 5-8 sales advisors. You will drive performance, coach your team, and ensure operational excellence.`,
    responsibilities: [
      'Lead and motivate a team of sales advisors',
      'Monitor and drive team performance',
      'Conduct regular coaching sessions',
      'Manage daily operations and schedules',
      'Resolve client escalations',
      'Support boutique management with reporting',
      'Ensure brand standards compliance',
    ],
    requiredCapabilities: ['Leadership', 'Coaching', 'Operations', 'Service Excellence'],
  },
  {
    id: 'l6-boutique-director-flagship',
    title: 'Boutique Director - Flagship',
    roleLevel: 'L6',
    division: null,
    requiredExperienceYears: 8,
    description: `Lead our flagship boutique as Boutique Director. You will own P&L, develop talent, and represent the brand at the highest level in a high-profile location.`,
    responsibilities: [
      'Full P&L ownership for flagship location',
      'Develop and execute business strategy',
      'Lead and develop a team of 40-80 people',
      'Build and maintain VIC relationships',
      'Drive sales performance and KPIs',
      'Ensure operational excellence',
      'Partner with corporate on initiatives',
      'Represent brand in local market',
    ],
    requiredCapabilities: ['Strategic Leadership', 'P&L Management', 'Talent Development', 'Client Relationships', 'Business Acumen'],
  },
  // ... 10-15 total templates
]
```

---

## Technical Implementation

### Route Structure
```
app/(brand)/brand/opportunities/
├── page.tsx              # List view
├── new/
│   └── page.tsx          # Create flow (template selection + form)
└── [id]/
    ├── page.tsx          # Detail view
    ├── edit/
    │   └── page.tsx      # Edit form
    └── matches/
        └── page.tsx      # Matches list
```

### Create Opportunity Flow
```typescript
// app/(brand)/brand/opportunities/new/page.tsx
'use client'

import { useState } from 'react'
import { OPPORTUNITY_TEMPLATES } from '@/data/templates/opportunities'
import { OpportunityForm } from '@/components/brand/OpportunityForm'

export default function NewOpportunityPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  if (!selectedTemplate) {
    return (
      <div className="container py-8">
        <h1>Create New Opportunity</h1>
        <p className="mt-2 text-soft-grey">
          Choose a template to get started, or create from scratch.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {OPPORTUNITY_TEMPLATES.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={() => setSelectedTemplate(template)}
            />
          ))}
          
          <Card
            variant="interactive"
            onClick={() => setSelectedTemplate({})}
          >
            <h3>Start from Scratch</h3>
            <p className="text-sm text-soft-grey mt-2">
              Create a custom opportunity
            </p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1>Create Opportunity</h1>
      <OpportunityForm initialData={selectedTemplate} mode="create" />
    </div>
  )
}
```

### Server Actions
```typescript
// app/actions/opportunities.ts
'use server'

import { createServerActionClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const opportunitySchema = z.object({
  title: z.string().min(5).max(200),
  storeId: z.string().uuid().optional().nullable(),
  roleLevel: z.enum(['L1','L2','L3','L4','L5','L6','L7','L8']),
  division: z.string().optional().nullable(),
  requiredExperienceYears: z.number().int().min(0).optional(),
  requiredLanguages: z.array(z.string()).default([]),
  requiredCapabilities: z.record(z.any()).default({}),
  description: z.string().min(100).max(2000),
  responsibilities: z.array(z.string()).min(3).max(10),
  compensationRange: z.object({
    min: z.number().positive().optional(),
    max: z.number().positive().optional(),
    currency: z.string().default('EUR'),
    includesVariable: z.boolean().default(false),
  }).optional(),
}).refine(data => {
  if (data.compensationRange?.min && data.compensationRange?.max) {
    return data.compensationRange.max >= data.compensationRange.min
  }
  return true
}, { message: 'Max compensation must be >= min' })

export async function createOpportunity(
  data: z.infer<typeof opportunitySchema>,
  status: 'draft' | 'active' = 'draft'
) {
  const supabase = createServerActionClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: brand } = await supabase
    .from('brands')
    .select('id')
    .eq('profile_id', user.id)
    .single()

  const validated = opportunitySchema.parse(data)

  const { data: opportunity, error } = await supabase
    .from('opportunities')
    .insert({
      brand_id: brand.id,
      store_id: validated.storeId,
      title: validated.title,
      role_level: validated.roleLevel,
      division: validated.division,
      required_experience_years: validated.requiredExperienceYears,
      required_languages: validated.requiredLanguages,
      required_capabilities: validated.requiredCapabilities,
      description: validated.description,
      responsibilities: validated.responsibilities,
      compensation_range: validated.compensationRange,
      status,
      published_at: status === 'active' ? new Date().toISOString() : null,
    })
    .select()
    .single()

  if (error) throw error

  // Trigger matching if published
  if (status === 'active') {
    // TODO: Trigger matching engine (STORY-013)
  }

  revalidatePath('/brand/opportunities')
  return { id: opportunity.id }
}

export async function updateOpportunityStatus(
  id: string,
  status: 'active' | 'paused' | 'filled' | 'cancelled'
) {
  const supabase = createServerActionClient()
  // ... verify ownership ...

  const { error } = await supabase
    .from('opportunities')
    .update({ status })
    .eq('id', id)

  if (error) throw error

  revalidatePath('/brand/opportunities')
  return { success: true }
}
```

---

## Testing Requirements

### Manual Tests
- [ ] Template selection fonctionne
- [ ] Form pré-rempli avec template data
- [ ] Save as draft → status = draft
- [ ] Publish → status = active, published_at set
- [ ] Edit opportunity → changes sauvegardées
- [ ] Pause/Unpause toggle status
- [ ] Mark as filled → status = filled
- [ ] Delete draft → supprimé
- [ ] Compensation range validation (max >= min)

### Edge Cases
- [ ] Delete opportunity avec matches → CASCADE ou error?
- [ ] Edit active opportunity → re-trigger matching
- [ ] Très long description → truncation ou error

---

## Definition of Done

- [ ] Templates créés (10-15)
- [ ] Create/edit/delete fonctionnel
- [ ] Status management (draft/active/paused/filled)
- [ ] Compensation privacy respectée
- [ ] Tests manuels passés
- [ ] Code reviewed
