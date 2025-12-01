# STORY-008: Brand Onboarding Flow (5 Steps)

**Epic:** Brand Journey  
**Priority:** P1 (High)  
**Story Points:** 13  
**Dependencies:** STORY-002, STORY-003, STORY-004

---

## User Story

En tant que **nouveau brand**,  
Je veux **compléter un onboarding guidé en 5 étapes**,  
Afin de **créer mon profil brand et commencer à poster des opportunités**.

---

## Acceptance Criteria

### ✅ AC1: Onboarding Layout & Navigation
- [ ] Layout `/brand/onboarding` créé
- [ ] Progress indicator (1/5, 2/5, etc.)
- [ ] Navigation: "Previous", "Next"
- [ ] State management (URL-based)

### ✅ AC2: Step 1 - Account (Completed via Auth)
- [ ] Step 1 skipped si déjà authentifié
- [ ] Redirection directe vers Step 2

### ✅ AC3: Step 2 - Brand Identity
- [ ] Formulaire:
  - Brand name (text) - **required**
  - Logo (file upload, image) - optional
  - Website (URL) - optional
  - Segment (dropdown) - **required**:
    - Ultra Luxury
    - Luxury
    - Premium
    - Accessible Luxury
  - Divisions (multi-select, min 1):
    - Fashion, Leather Goods, Shoes, Beauty, Fragrance, Watches, High Jewelry, Eyewear, Accessories
  - Headquarters location (text, autocomplete city) - optional
- [ ] Logo upload vers Supabase Storage
- [ ] Save to `brands` table

### ✅ AC4: Step 3 - Contact Information
- [ ] Formulaire:
  - Contact name (text) - **required**
  - Contact role/title (text) - **required**
  - Contact email (email) - **required**
  - Contact phone (tel) - optional
- [ ] Validation: email format
- [ ] Save to `brands` table

### ✅ AC5: Step 4 - First Store
- [ ] Formulaire:
  - Store name (text) - **required**
  - Store code (text, internal reference) - optional
  - City (text, autocomplete) - **required**
  - Country (dropdown) - **required**
  - Region (auto-calculated from country or manual select):
    - EMEA, Americas, APAC, Middle East
  - Address (textarea) - optional
  - Complexity tier (dropdown) - **required**:
    - T1 - Flagship XXL
    - T2 - Flagship
    - T3 - Full Format
    - T4 - Boutique
    - T5 - Outlet/Travel Retail
  - Divisions (multi-select, inherited from brand but editable)
  - Team size (number) - optional
- [ ] Save to `stores` table
- [ ] Link "Add another store" (optionnel, peut skip)

### ✅ AC6: Step 5 - First Opportunity (Optional)
- [ ] Écran informatif:
  - Titre: "Ready to Post Your First Opportunity?"
  - Description rapide du flow
  - Benefits (access to top talent, 7D matching)
- [ ] CTAs:
  - "Create Opportunity Now" → redirect `/brand/opportunities/new`
  - "Skip for now" → redirect `/brand/dashboard`
- [ ] Pas de blocage si skip

### ✅ AC7: Completion & Redirect
- [ ] Après Step 5:
  - `brands.onboarding_completed = true`
- [ ] Redirect vers `/brand/dashboard`
- [ ] Toast/notification de succès

### ✅ AC8: Data Persistence
- [ ] Toutes les données sauvegardées dans DB
- [ ] Server Actions pour chaque étape
- [ ] Validation Zod côté serveur
- [ ] Gestion erreurs

---

## UI/UX Specifications

### Progress Indicator
```
[●][●][●][○][○]  Step 3 of 5: Contact Information
```

### File Upload (Logo)
- Accept: .png, .jpg, .jpeg, .svg
- Max size: 5MB
- Preview après upload
- Storage path: `brands/{brand_id}/logo.{ext}`

### Country → Region Mapping (Auto)
```typescript
const COUNTRY_REGION_MAP = {
  'France': 'EMEA',
  'United Kingdom': 'EMEA',
  'Germany': 'EMEA',
  'United States': 'Americas',
  'Japan': 'APAC',
  // ... etc
}
```

---

## Technical Implementation

### Route Structure
```
app/(brand)/brand/onboarding/
├── layout.tsx          # Progress bar
├── page.tsx            # Redirect to step 2
├── identity/
│   └── page.tsx        # Step 2
├── contact/
│   └── page.tsx        # Step 3
├── store/
│   └── page.tsx        # Step 4
└── opportunity-intro/
    └── page.tsx        # Step 5
```

### Server Actions
```typescript
// app/actions/brand-onboarding.ts
'use server'

import { createServerActionClient } from '@/lib/supabase/server'
import { z } from 'zod'

const identitySchema = z.object({
  name: z.string().min(2).max(200),
  logoUrl: z.string().url().optional(),
  website: z.string().url().optional(),
  segment: z.enum(['ultra_luxury', 'luxury', 'premium', 'accessible_luxury']),
  divisions: z.array(z.string()).min(1),
  headquartersLocation: z.string().optional(),
})

export async function saveBrandIdentity(data: z.infer<typeof identitySchema>) {
  const supabase = createServerActionClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const validated = identitySchema.parse(data)

  const { error } = await supabase
    .from('brands')
    .upsert({
      profile_id: user.id,
      name: validated.name,
      logo_url: validated.logoUrl,
      website: validated.website,
      segment: validated.segment,
      divisions: validated.divisions,
      headquarters_location: validated.headquartersLocation,
    }, { onConflict: 'profile_id' })

  if (error) throw error
  return { success: true }
}

const storeSchema = z.object({
  name: z.string().min(2),
  code: z.string().optional(),
  city: z.string().min(2),
  country: z.string().min(2),
  region: z.enum(['EMEA', 'Americas', 'APAC', 'Middle_East']),
  address: z.string().optional(),
  complexityTier: z.enum(['T1', 'T2', 'T3', 'T4', 'T5']),
  divisions: z.array(z.string()).min(1),
  teamSize: z.number().int().positive().optional(),
})

export async function saveFirstStore(data: z.infer<typeof storeSchema>) {
  const supabase = createServerActionClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Get brand ID
  const { data: brand } = await supabase
    .from('brands')
    .select('id')
    .eq('profile_id', user.id)
    .single()

  const validated = storeSchema.parse(data)

  const { error } = await supabase
    .from('stores')
    .insert({
      brand_id: brand.id,
      name: validated.name,
      code: validated.code,
      city: validated.city,
      country: validated.country,
      region: validated.region,
      address: validated.address,
      complexity_tier: validated.complexityTier,
      divisions: validated.divisions,
      team_size: validated.teamSize,
    })

  if (error) throw error
  return { success: true }
}
```

### Logo Upload
```typescript
// app/actions/upload-logo.ts
'use server'

export async function uploadBrandLogo(formData: FormData) {
  const supabase = createServerActionClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const file = formData.get('logo') as File
  if (!file) throw new Error('No file provided')

  // Validate file type and size
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type')
  }
  if (file.size > 5 * 1024 * 1024) { // 5MB
    throw new Error('File too large (max 5MB)')
  }

  const { data: brand } = await supabase
    .from('brands')
    .select('id')
    .eq('profile_id', user.id)
    .single()

  const ext = file.name.split('.').pop()
  const filePath = `brands/${brand.id}/logo.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('brand-assets')
    .upload(filePath, file, { upsert: true })

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('brand-assets')
    .getPublicUrl(filePath)

  return { url: publicUrl }
}
```

---

## Testing Requirements

### Manual Tests
- [ ] Parcours complet 5 étapes sans erreur
- [ ] Données sauvegardées à chaque étape
- [ ] Logo upload fonctionne
- [ ] Country → Region auto-mapping
- [ ] Skip step 5 redirige vers dashboard
- [ ] Create opportunity redirige vers form
- [ ] `onboarding_completed = true` après step 5

### Edge Cases
- [ ] Upload logo > 5MB → erreur
- [ ] Upload non-image → erreur
- [ ] Divisions min 1 → validation
- [ ] Refresh mid-onboarding → données persistent

### Accessibility
- [ ] Keyboard navigation
- [ ] Form labels accessibles
- [ ] File upload accessible

---

## Definition of Done

- [ ] 5 steps implémentés
- [ ] Toutes les données sauvegardées
- [ ] Logo upload fonctionnel
- [ ] Tests manuels passés
- [ ] Validation client + serveur
- [ ] UI conforme design system
- [ ] Code reviewed
