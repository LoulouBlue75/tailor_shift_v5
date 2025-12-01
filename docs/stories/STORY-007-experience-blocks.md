# STORY-007: Experience Blocks Management (CRUD)

**Epic:** Talent Journey  
**Priority:** P1 (High)  
**Story Points:** 8  
**Dependencies:** STORY-004, STORY-005

---

## User Story

En tant que **talent**,  
Je veux **gérer mes blocs d'expérience professionnelle**,  
Afin de **construire un CV structuré et précis pour le matching**.

---

## Acceptance Criteria

### ✅ AC1: View Experience Blocks
- [ ] Page `/talent/profile/experience` créée
- [ ] Liste de tous les experience blocks du talent
- [ ] Triés par date (most recent first)
- [ ] Chaque block affiche:
  - Block type badge (FOH, BOH, Leadership, etc.)
  - Title
  - Maison
  - Location
  - Date range (ex: "Jan 2020 - Present" ou "Jan 2020 - Dec 2022")
  - Role level + Store tier
  - Divisions handled (badges)
  - Description (truncated)
  - Achievements (list)
- [ ] Actions: "Edit", "Delete" pour chaque block
- [ ] Empty state: "No experience blocks yet. Add your first role!"

### ✅ AC2: Create Experience Block
- [ ] Bouton "Add Experience" affiché
- [ ] Modal ou page `/talent/profile/experience/new`
- [ ] Formulaire avec tous les champs:
  - Block type (dropdown) - **required**
  - Title (text) - **required**
  - Maison (text)
  - Location (text, autocomplete)
  - Start date (date picker) - **required**
  - End date (date picker or "Current position" checkbox)
  - Role level (dropdown L1-L8)
  - Store tier (dropdown T1-T5)
  - Divisions handled (multi-select)
  - Description (textarea, 500 chars max)
  - Achievements (dynamic list, max 5 items)
- [ ] Validation client + serveur (Zod)
- [ ] Save via Server Action
- [ ] Redirect vers liste avec toast success

### ✅ AC3: Edit Experience Block
- [ ] Clic "Edit" ouvre modal/page `/talent/profile/experience/[id]/edit`
- [ ] Formulaire pré-rempli avec données existantes
- [ ] Modification et save
- [ ] Update DB via Server Action
- [ ] Redirect avec toast success

### ✅ AC4: Delete Experience Block
- [ ] Clic "Delete" ouvre confirmation dialog
- [ ] "Are you sure you want to delete this experience?"
- [ ] Boutons: "Cancel", "Delete"
- [ ] Delete via Server Action
- [ ] Suppression de la DB
- [ ] Update liste avec toast success

### ✅ AC5: "Current Position" Logic
- [ ] Checkbox "I currently work here"
- [ ] Si checked: end_date = NULL, is_current = true
- [ ] Si unchecked: end_date required
- [ ] Affichage "Present" si is_current = true

### ✅ AC6: Achievements Dynamic List
- [ ] Input "Add achievement"
- [ ] Bouton "+" pour ajouter
- [ ] Liste d'achievements avec "Remove" button
- [ ] Max 5 achievements
- [ ] Saved as TEXT[] in DB

### ✅ AC7: Date Validation
- [ ] Start date cannot be in the future
- [ ] End date cannot be before start date
- [ ] Error messages clairs

### ✅ AC8: Profile Completion Update
- [ ] Après ajout/modification/suppression:
  - Recalculer `profile_completion_pct`
  - Update `talents` table

---

## UI/UX Specifications

### Experience Block Card
```
┌─────────────────────────────────────────────────────┐
│ [FOH] Senior Sales Advisor                    Edit │ Delete
│ Chanel • Paris                                      │
│ Jan 2020 - Present                                 │
│ L2 - Senior Advisor • T1 - Flagship XXL            │
│ [Fashion] [Leather Goods]                          │
│                                                     │
│ Led premium client experiences in flagship         │
│ store, achieving top 5% in sales...              │
│                                                     │
│ Achievements:                                      │
│ • Exceeded sales targets by 30% YoY               │
│ • Built VIC portfolio of 120+ clients             │
└─────────────────────────────────────────────────────┘
```

### Create/Edit Form
- Two columns on desktop (single on mobile)
- Required fields marked with *
- Date pickers avec format clair
- Save button disabled si validation échoue

---

## Technical Implementation

### Route Structure
```
app/(talent)/talent/profile/experience/
├── page.tsx              # List view
├── new/
│   └── page.tsx          # Create form
└── [id]/
    └── edit/
        └── page.tsx      # Edit form
```

### Server Actions
```typescript
// app/actions/experience-blocks.ts
'use server'

import { createServerActionClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const blockSchema = z.object({
  blockType: z.enum(['foh', 'boh', 'leadership', 'clienteling', 'operations', 'business']),
  title: z.string().min(2).max(200),
  maison: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().date(),
  endDate: z.string().date().optional().nullable(),
  isCurrent: z.boolean().default(false),
  roleLevel: z.enum(['L1','L2','L3','L4','L5','L6','L7','L8']).optional(),
  storeTier: z.enum(['T1','T2','T3','T4','T5']).optional(),
  divisionsHandled: z.array(z.string()).default([]),
  description: z.string().max(500).optional(),
  achievements: z.array(z.string()).max(5).default([]),
}).refine(data => {
  // If not current, end date required
  if (!data.isCurrent && !data.endDate) {
    return false
  }
  return true
}, { message: 'End date required if not current position' })

export async function createExperienceBlock(formData: FormData) {
  const supabase = createServerActionClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Get talent ID
  const { data: talent } = await supabase
    .from('talents')
    .select('id')
    .eq('profile_id', user.id)
    .single()

  const validated = blockSchema.parse({
    blockType: formData.get('blockType'),
    title: formData.get('title'),
    maison: formData.get('maison'),
    location: formData.get('location'),
    startDate: formData.get('startDate'),
    endDate: formData.get('isCurrent') === 'true' ? null : formData.get('endDate'),
    isCurrent: formData.get('isCurrent') === 'true',
    roleLevel: formData.get('roleLevel'),
    storeTier: formData.get('storeTier'),
    divisionsHandled: JSON.parse(formData.get('divisionsHandled') as string),
    description: formData.get('description'),
    achievements: JSON.parse(formData.get('achievements') as string),
  })

  const { error } = await supabase
    .from('experience_blocks')
    .insert({
      talent_id: talent.id,
      block_type: validated.blockType,
      title: validated.title,
      maison: validated.maison,
      location: validated.location,
      start_date: validated.startDate,
      end_date: validated.endDate,
      is_current: validated.isCurrent,
      role_level: validated.roleLevel,
      store_tier: validated.storeTier,
      divisions_handled: validated.divisionsHandled,
      description: validated.description,
      achievements: validated.achievements,
    })

  if (error) throw error

  // Revalidate profile completion
  await updateProfileCompletion(talent.id)

  revalidatePath('/talent/profile/experience')
  return { success: true }
}

export async function updateExperienceBlock(id: string, formData: FormData) {
  // Similar to create...
}

export async function deleteExperienceBlock(id: string) {
  const supabase = createServerActionClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Verify ownership
  const { data: block } = await supabase
    .from('experience_blocks')
    .select('talent_id, talents!inner(profile_id)')
    .eq('id', id)
    .single()

  if (block?.talents?.profile_id !== user.id) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('experience_blocks')
    .delete()
    .eq('id', id)

  if (error) throw error

  revalidatePath('/talent/profile/experience')
  return { success: true }
}
```

### List Page (Server Component)
```typescript
// app/(talent)/talent/profile/experience/page.tsx
import { createServerComponentClient } from '@/lib/supabase/server'
import { ExperienceBlockCard } from '@/components/talent/ExperienceBlockCard'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default async function ExperiencePage() {
  const supabase = createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: talent } = await supabase
    .from('talents')
    .select('id')
    .eq('profile_id', user.id)
    .single()

  const { data: blocks } = await supabase
    .from('experience_blocks')
    .select('*')
    .eq('talent_id', talent.id)
    .order('start_date', { ascending: false })

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center">
        <h1>Experience</h1>
        <Link href="/talent/profile/experience/new">
          <Button variant="primary">Add Experience</Button>
        </Link>
      </div>

      {blocks?.length === 0 ? (
        <div className="mt-8 text-center py-12">
          <p className="text-soft-grey">No experience blocks yet.</p>
          <Link href="/talent/profile/experience/new">
            <Button variant="primary" className="mt-4">
              Add Your First Role
            </Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {blocks?.map(block => (
            <ExperienceBlockCard key={block.id} block={block} />
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## Testing Requirements

### Manual Tests
- [ ] Create block → sauvegardé en DB → affiché dans liste
- [ ] Edit block → modifications sauvegardées
- [ ] Delete block → supprimé de DB et liste
- [ ] "Current position" → end_date = NULL
- [ ] Validation dates → erreur si end < start
- [ ] Max 5 achievements → erreur si plus
- [ ] Empty state affiché si aucun block

### Edge Cases
- [ ] Delete dernier block → empty state
- [ ] Concurrent edits (rare mais possible)
- [ ] Très long description/title → truncation

### Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader announcements
- [ ] Focus management (modal open/close)

---

## Definition of Done

- [ ] CRUD complet fonctionnel
- [ ] Validation client + serveur
- [ ] Server Actions implémentées
- [ ] UI conforme design system
- [ ] Tests manuels passés
- [ ] Code reviewed
