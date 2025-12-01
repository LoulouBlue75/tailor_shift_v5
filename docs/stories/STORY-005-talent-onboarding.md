# STORY-005: Talent Onboarding Flow (7 Steps)

**Epic:** Talent Journey  
**Priority:** P0 (Blocker)  
**Story Points:** 21  
**Dependencies:** STORY-002, STORY-003, STORY-004

---

## User Story

En tant que **nouveau talent**,  
Je veux **compléter un onboarding guidé en 7 étapes**,  
Afin de **créer mon profil professionnel et accéder à la plateforme**.

---

## Acceptance Criteria

### ✅ AC1: Onboarding Layout & Navigation
- [ ] Layout `/talent/onboarding` créé
- [ ] Progress indicator (1/7, 2/7, etc.)
- [ ] Navigation: "Previous", "Next", "Skip" (si applicable)
- [ ] State management (URL params ou local state)
- [ ] Auto-save drafts (optionnel V1)

### ✅ AC2: Step 1 - Account (Completed via Auth)
- [ ] Step 1 skipped si déjà authentifié
- [ ] Redirection directe vers Step 2

### ✅ AC3: Step 2 - Identity
- [ ] Formulaire:
  - First name (required)
  - Last name (required)
  - Phone (optional)
  - LinkedIn URL (optional)
- [ ] Validation client + server
- [ ] Save via Server Action
- [ ] Update `talents` table

### ✅ AC4: Step 3 - Professional Identity
- [ ] Formulaire:
  - Current role level (dropdown L1-L8) (required)
  - Current store tier (dropdown T1-T5) (required)
  - Years in luxury (number input) (required)
  - Current maison (text input) (optional)
  - Current location (text input, autocomplete city) (optional)
- [ ] Dropdowns avec labels clairs (ex: "L1 - Sales Advisor")
- [ ] Save to `talents` table

### ✅ AC5: Step 4 - Divisions Expertise
- [ ] Multi-select checkboxes (min 1, max 5):
  - Fashion
  - Leather Goods
  - Shoes
  - Beauty
  - Fragrance
  - Watches
  - High Jewelry
  - Eyewear
  - Accessories
- [ ] Validation: au moins 1 sélectionné
- [ ] Save to `talents.divisions_expertise` (array)

### ✅ AC6: Step 5 - Career Preferences
- [ ] Formulaire:
  - Target role levels (multi-select) (min 1)
  - Target store tiers (multi-select)
  - Target divisions (multi-select)
  - Target locations (multi-input, autocomplete)
  - Mobility (radio: local / regional / national / international)
  - Timeline (radio: active / passive / not_looking)
- [ ] Save to `talents.career_preferences` (JSONB)

### ✅ AC7: Step 6 - First Experience Block
- [ ] Formulaire:
  - Block type (dropdown: FOH, BOH, Leadership, Clienteling, Operations, Business)
  - Title (text) (required)
  - Maison (text)
  - Location (text)
  - Start date (date picker)
  - End date (date picker or "Current position" checkbox)
  - Role level (dropdown L1-L8)
  - Store tier (dropdown T1-T5)
  - Divisions handled (multi-select)
  - Description (textarea)
  - Achievements (dynamic list, 0-5 items)
- [ ] Save to `experience_blocks` table
- [ ] Lien "Add another block" (optionnel)

### ✅ AC8: Step 7 - Assessment Teaser
- [ ] Écran informatif:
  - Titre: "Unlock Your Retail Excellence Profile"
  - Description de l'assessment (4D model)
  - Durée estimée: 15-20 min
  - Bénéfices (better matches, learning recommendations)
- [ ] CTAs:
  - "Start Assessment Now" → redirect `/talent/assessment`
  - "Skip for now" → redirect `/talent/dashboard`
- [ ] Pas de blocage si skip

### ✅ AC9: Completion & Redirect
- [ ] Après Step 7:
  - `talents.onboarding_completed = true`
  - `talents.profile_completion_pct` calculé (basique V1)
- [ ] Redirect vers `/talent/dashboard`
- [ ] Toast/notification de succès

### ✅ AC10: Data Persistence
- [ ] Toutes les données sauvegardées dans DB
- [ ] Server Actions pour chaque étape
- [ ] Validation Zod côté serveur
- [ ] Gestion erreurs (DB down, validation fail)

---

## UI/UX Specifications

### Progress Indicator
```
[●][●][●][○][○][○][○]  Step 3 of 7: Professional Identity
```

### Form Layout
- Max width: 600px centré
- Labels au-dessus des inputs
- Helper text sous les inputs si nécessaire
- Error messages en rouge
- Boutons alignés à droite

### Navigation Buttons
- "Previous" (si pas step 1): secondary variant
- "Next" / "Continue": primary variant
- "Skip" (si applicable): ghost variant
- Disable "Next" si validation échoue

---

## Technical Implementation

### Route Structure
```
app/(talent)/talent/onboarding/
├── layout.tsx          # Progress bar, layout
├── page.tsx            # Redirect to step 2
├── identity/
│   └── page.tsx        # Step 2
├── professional/
│   └── page.tsx        # Step 3
├── divisions/
│   └── page.tsx        # Step 4
├── preferences/
│   └── page.tsx        # Step 5
├── experience/
│   └── page.tsx        # Step 6
└── assessment-intro/
    └── page.tsx        # Step 7
```

### Server Actions
```typescript
// app/actions/talent-onboarding.ts
'use server'

import { createServerActionClient } from '@/lib/supabase/server'
import { z } from 'zod'

const identitySchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().optional(),
  linkedinUrl: z.string().url().optional(),
})

export async function saveIdentity(data: z.infer<typeof identitySchema>) {
  const supabase = createServerActionClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')

  const validated = identitySchema.parse(data)

  const { error } = await supabase
    .from('talents')
    .update({
      first_name: validated.firstName,
      last_name: validated.lastName,
      phone: validated.phone,
      linkedin_url: validated.linkedinUrl,
    })
    .eq('profile_id', user.id)

  if (error) throw error
  return { success: true }
}

// Similar actions for other steps...
```

### Profile Completion Calculation (Basic V1)
```typescript
function calculateProfileCompletion(talent: Talent): number {
  let score = 0
  const fields = [
    talent.first_name,
    talent.last_name,
    talent.current_role_level,
    talent.current_store_tier,
    talent.years_in_luxury,
    talent.divisions_expertise?.length > 0,
    talent.career_preferences?.target_role_levels?.length > 0,
    // Check at least 1 experience block exists
  ]
  
  fields.forEach(field => {
    if (field) score += (100 / fields.length)
  })
  
  return Math.round(score)
}
```

---

## Testing Requirements

### Manual Tests
- [ ] Parcours complet 7 étapes sans erreur
- [ ] Données sauvegardées à chaque étape
- [ ] Navigation "Previous" fonctionne
- [ ] Validation affiche erreurs
- [ ] Skip step 7 redirige vers dashboard
- [ ] Compléter assessment redirige vers dashboard
- [ ] `onboarding_completed = true` après step 7

### Edge Cases
- [ ] Fermer navigateur mid-onboarding → reprendre où on était
- [ ] Double-clic "Next" → pas de double save
- [ ] Champs optionnels vraiment optionnels
- [ ] Refresh page → données persistent

### Accessibility
- [ ] Navigation clavier fonctionne
- [ ] Labels accessibles
- [ ] Error announcements (aria-live)

---

## Definition of Done

- [ ] 7 steps implémentés
- [ ] Toutes les données sauvegardées en DB
- [ ] Tests manuels passés
- [ ] Validation client + serveur
- [ ] UI conforme au design system
- [ ] Code reviewed
- [ ] onboarding_completed flag fonctionne
