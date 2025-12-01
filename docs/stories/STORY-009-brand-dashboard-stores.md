# STORY-009: Brand Dashboard & Store Management

**Epic:** Brand Journey  
**Priority:** P1 (High)  
**Story Points:** 13  
**Dependencies:** STORY-004, STORY-008

---

## User Story

En tant que **brand**,  
Je veux **voir un dashboard avec mes stores et opportunités, et gérer mes stores**,  
Afin de **avoir une vue d'ensemble de mes activités de recrutement**.

---

## Acceptance Criteria

### ✅ AC1: Dashboard Layout
- [ ] Route `/brand/dashboard` créée
- [ ] Navigation principale:
  - Dashboard
  - Stores
  - Opportunities
  - Settings
- [ ] Header avec brand name + logo

### ✅ AC2: Active Opportunities Section
- [ ] Widget "Active Opportunities"
- [ ] Liste des opportunities avec status = 'active'
- [ ] Chaque opportunity affiche:
  - Title
  - Store name (ou "Brand-level" si pas de store)
  - Role level
  - Match count (nombre de matches)
  - Published date
  - CTA: "View Matches"
- [ ] Lien "View All Opportunities" → `/brand/opportunities`
- [ ] Empty state: "No active opportunities. Post your first role!"

### ✅ AC3: Top Matches Section
- [ ] Widget "Top Talent Matches"
- [ ] Top 5 matches across all opportunities (score DESC)
- [ ] Chaque match affiche:
  - Talent name (anonymized V1: "Talent #1234" ou partial: "Sarah M.")
  - Current role level + store tier
  - Match score (ex: "92% match")
  - Opportunity title
  - CTA: "View Profile"
- [ ] Empty state: "No matches yet. Post opportunities to see talent."

### ✅ AC4: Store Overview Section
- [ ] Widget "Your Stores"
- [ ] Liste ou grid des stores (limit 5 sur dashboard)
- [ ] Chaque store affiche:
  - Store name
  - Location (city, country)
  - Complexity tier badge
  - Active opportunities count
  - CTA: "View Details"
- [ ] Lien "Manage All Stores" → `/brand/stores`
- [ ] Bouton "Add Store"

### ✅ AC5: Quick Actions
- [ ] Boutons/cards pour actions rapides:
  - "Post New Opportunity"
  - "Add Store"
  - "Search Talents" (optionnel V1, peut être disabled)

### ✅ AC6: Stores List Page
- [ ] Route `/brand/stores` créée
- [ ] Liste complète de tous les stores
- [ ] Tableau ou cards avec:
  - Name
  - Code
  - Location (city, country)
  - Region
  - Tier
  - Divisions
  - Team size
  - Active opportunities count
  - Actions: "View", "Edit", "Delete"
- [ ] Bouton "Add Store"
- [ ] Empty state

### ✅ AC7: Create Store
- [ ] Page/modal `/brand/stores/new`
- [ ] Formulaire identique à onboarding step 4
- [ ] Validation + save via Server Action
- [ ] Redirect vers `/brand/stores` avec toast

### ✅ AC8: Edit Store
- [ ] Page/modal `/brand/stores/[id]/edit`
- [ ] Formulaire pré-rempli
- [ ] Update via Server Action
- [ ] Redirect avec toast

### ✅ AC9: Delete Store
- [ ] Bouton "Delete" avec confirmation
- [ ] Warning si store a des opportunities actives
- [ ] Delete via Server Action (CASCADE ou SET NULL opportunities)
- [ ] Redirect avec toast

### ✅ AC10: Store Detail Page
- [ ] Route `/brand/stores/[id]` créée
- [ ] Affiche toutes les infos du store
- [ ] Liste des opportunities liées à ce store
- [ ] CTA: "Edit Store", "Post Opportunity for this Store"

---

## UI Layout

### Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│ [Brand Logo] Brand Name                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────┐  ┌────────────────────────────┐ │
│  │ Active Opportunities │  │ Top Talent Matches         │ │
│  │ • Senior Advisor (3) │  │ • Sarah M. - 92% match    │ │
│  │ • Team Lead (1)      │  │ • John D. - 89% match     │ │
│  └──────────────────────┘  └────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Your Stores                              [Add Store]  │ │
│  │ ┌─────────────────────────────────────────────────┐   │ │
│  │ │ Paris Flagship • T1 • 3 active opportunities   │   │ │
│  │ └─────────────────────────────────────────────────┘   │ │
│  │ [More stores...]                                     │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  Quick Actions:                                            │
│  [Post New Opportunity] [Add Store]                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Technical Implementation

### Dashboard Page
```typescript
// app/(brand)/brand/dashboard/page.tsx
import { createServerComponentClient } from '@/lib/supabase/server'

export default async function BrandDashboard() {
  const supabase = createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('profile_id', user.id)
    .single()

  // Active opportunities
  const { data: opportunities } = await supabase
    .from('opportunities')
    .select(`
      *,
      stores(name),
      matches(count)
    `)
    .eq('brand_id', brand.id)
    .eq('status', 'active')
    .limit(5)

  // Top matches across all opportunities
  const { data: topMatches } = await supabase
    .from('matches')
    .select(`
      *,
      opportunities(title),
      talents(id, first_name, last_name, current_role_level, current_store_tier)
    `)
    .in('opportunity_id', opportunities.map(o => o.id))
    .order('score_total', { ascending: false })
    .limit(5)

  // Stores
  const { data: stores } = await supabase
    .from('stores')
    .select(`
      *,
      opportunities(count)
    `)
    .eq('brand_id', brand.id)
    .limit(5)

  return (
    <div className="container py-8">
      <h1>Welcome, {brand.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <ActiveOpportunities opportunities={opportunities} />
        <TopMatches matches={topMatches} />
      </div>

      <StoresOverview stores={stores} brandId={brand.id} />

      <QuickActions />
    </div>
  )
}
```

### Stores List Page
```typescript
// app/(brand)/brand/stores/page.tsx
import { createServerComponentClient } from '@/lib/supabase/server'
import { StoreCard } from '@/components/brand/StoreCard'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default async function StoresPage() {
  const supabase = createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: brand } = await supabase
    .from('brands')
    .select('id')
    .eq('profile_id', user.id)
    .single()

  const { data: stores } = await supabase
    .from('stores')
    .select(`
      *,
      opportunities!stores_id_fkey(
        count,
        status
      )
    `)
    .eq('brand_id', brand.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center">
        <h1>Stores</h1>
        <Link href="/brand/stores/new">
          <Button variant="primary">Add Store</Button>
        </Link>
      </div>

      {stores?.length === 0 ? (
        <div className="mt-8 text-center py-12">
          <p className="text-soft-grey">No stores yet.</p>
          <Link href="/brand/stores/new">
            <Button variant="primary" className="mt-4">
              Add Your First Store
            </Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores?.map(store => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      )}
    </div>
  )
}
```

### Store CRUD Server Actions
```typescript
// app/actions/stores.ts
'use server'

import { createServerActionClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const storeSchema = z.object({
  name: z.string().min(2).max(200),
  code: z.string().max(50).optional(),
  city: z.string().min(2),
  country: z.string().min(2),
  region: z.enum(['EMEA', 'Americas', 'APAC', 'Middle_East']),
  address: z.string().optional(),
  complexityTier: z.enum(['T1', 'T2', 'T3', 'T4', 'T5']),
  divisions: z.array(z.string()).min(1),
  teamSize: z.number().int().positive().optional(),
})

export async function createStore(data: z.infer<typeof storeSchema>) {
  const supabase = createServerActionClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

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

  revalidatePath('/brand/stores')
  return { success: true }
}

export async function updateStore(id: string, data: z.infer<typeof storeSchema>) {
  // Similar to create, with UPDATE
}

export async function deleteStore(id: string) {
  const supabase = createServerActionClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Verify ownership
  const { data: store } = await supabase
    .from('stores')
    .select('brand_id, brands!inner(profile_id)')
    .eq('id', id)
    .single()

  if (store?.brands?.profile_id !== user.id) {
    throw new Error('Unauthorized')
  }

  // Check for active opportunities
  const { data: activeOpps } = await supabase
    .from('opportunities')
    .select('id')
    .eq('store_id', id)
    .eq('status', 'active')

  if (activeOpps && activeOpps.length > 0) {
    throw new Error('Cannot delete store with active opportunities')
  }

  const { error } = await supabase
    .from('stores')
    .delete()
    .eq('id', id)

  if (error) throw error

  revalidatePath('/brand/stores')
  return { success: true }
}
```

---

## Testing Requirements

### Manual Tests
- [ ] Dashboard affiche données correctes
- [ ] Active opportunities listées
- [ ] Top matches affichés
- [ ] Stores overview visible
- [ ] Create store → sauvegardé + affiché
- [ ] Edit store → modifications sauvegardées
- [ ] Delete store → supprimé (ou erreur si active opps)
- [ ] Links fonctionnent

### Edge Cases
- [ ] Nouveau brand (pas de stores, pas d'opps) → empty states
- [ ] Store avec active opportunities → delete blocked
- [ ] Très long store name → truncation

---

## Definition of Done

- [ ] Dashboard complet avec toutes sections
- [ ] Store CRUD fonctionnel
- [ ] Empty states implémentés
- [ ] Responsive design
- [ ] Tests manuels passés
- [ ] Code reviewed
