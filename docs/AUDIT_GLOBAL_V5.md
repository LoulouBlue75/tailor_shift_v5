# Tailor Shift V5 — Audit Global

> **Date:** 2 Décembre 2025  
> **Scope:** Revue complète du projet vs Master Spec V2  
> **Status:** ✅ = OK | ⚠️ = À améliorer | 🔴 = Bloquant

---

## 1. DÉVELOPPEMENT / TECHNIQUE

### 1.1 Structure Projet

| Item | Status | Notes |
|------|--------|-------|
| App Router structure | ✅ | `(public)`, `(talent)`, `(brand)` groups |
| Server Actions | ✅ | 10 fichiers: auth, talent-onboarding, brand-onboarding, etc. |
| Engines | ✅ | 4 moteurs: matching, assessment, learning, projection |
| Supabase client | ✅ | client.ts, server.ts, middleware.ts |
| TypeScript | ✅ | database.types.ts présent |

### 1.2 Migrations Database

| Migration | Status | Notes |
|-----------|--------|-------|
| 0001_initial_schema.sql | ✅ | Appliquée |
| 0002_rls_policies.sql | ⚠️ | Superseded by 0005 |
| 0003_seed_data.sql | ✅ | Données initiales |
| 0004_fix_rls_recursion.sql | ⚠️ | Superseded by 0005 |
| 0005_fix_rls_v2_security_definer.sql | 🔴 | **À APPLIQUER** - Corrige récursion infinie |

### 1.3 Middleware

| Item | Status | Notes |
|------|--------|-------|
| Route protection | ✅ | /talent/*, /brand/* protégées |
| Profile null check | ✅ | Corrigé (commit dac9a36) |
| User_type null check | ✅ | Corrigé (commit dac9a36) |
| Public routes | ⚠️ | `/brands` vs `/brand/*` confusion résolue |

### 1.4 Actions Prioritaires - Technique

1. 🔴 **Appliquer migration 0005** dans Supabase Dashboard
2. ⚠️ Nettoyer migrations obsolètes (0002, 0004) ou documenter comme superseded

---

## 2. MOTEURS MÉTIER (Engines)

### 2.1 Matching Engine (7D)

| Dimension | Weight | Implementation | Status |
|-----------|--------|----------------|--------|
| Role Fit | 20% | ✅ Exact=100, ±1=85/70, ±2=40 | ✅ |
| Division Fit | 20% | ✅ Exact match + related divisions | ✅ |
| Store Context | 15% | ✅ Tier comparison | ✅ |
| Capability Fit | 15% | ✅ Assessment-based | ✅ |
| Geography | 10% | ✅ Location + mobility | ✅ |
| Experience Block | 10% | ✅ Block types check | ✅ |
| Preference | 10% | ✅ Timeline + targets | ✅ |

**Threshold:** 40 (MINIMUM_MATCH_SCORE) ✅

### 2.2 Assessment Engine (4D)

| Dimension | Status | Notes |
|-----------|--------|-------|
| Service Excellence | ⚠️ | Questions à valider vs framework Chanel |
| Clienteling | ⚠️ | Questions à valider |
| Operations | ⚠️ | Questions à valider |
| Leadership Signals | ⚠️ | Questions à valider |

**⚠️ Action requise:** Auditer `data/assessment/questions.ts` vs docs/Luxury_assessment/

### 2.3 Learning Engine

| Item | Status | Notes |
|------|--------|-------|
| Gap identification | ✅ | Basé sur assessment < 60 |
| Module matching | ✅ | Par catégorie + difficulté |
| Prioritization | ✅ | Gap × relevance |

**⚠️ Action requise:** Vérifier contenu réel des modules dans `data/learning/modules.ts`

### 2.4 Projection Engine

| Item | Status | Notes |
|------|--------|-------|
| Next role calculation | ✅ | Based on current level |
| Timeline estimation | ✅ | Min/max months |
| Gap identification | ✅ | Capability gaps |

---

## 3. UX / PARCOURS UTILISATEUR

### 3.1 Talent Onboarding

| Step | Route | Status | Notes |
|------|-------|--------|-------|
| 1. Welcome | /talent/onboarding | ✅ | |
| 2. Identity | /talent/onboarding/identity | ⚠️ | RLS error si migration 0005 pas appliquée |
| 3. Professional | /talent/onboarding/professional | ✅ | |
| 4. Divisions | /talent/onboarding/divisions | ✅ | |
| 5. Preferences | /talent/onboarding/preferences | ✅ | |
| 6. Experience | /talent/onboarding/experience | ✅ | Optional |
| 7. Assessment | /talent/onboarding/assessment | ✅ | Optional start |

### 3.2 Brand Onboarding

| Step | Route | Status | Notes |
|------|-------|--------|-------|
| 1. Identity | /brand/onboarding/identity | ✅ | |
| 2. Contact | /brand/onboarding/contact | ✅ | |
| 3. Store | /brand/onboarding/store | ✅ | |
| 4. Complete | /brand/onboarding/complete | ✅ | |

### 3.3 Error Handling

| Scenario | Status | Notes |
|----------|--------|-------|
| Profile missing | ✅ | Redirect /signup?error=profile_missing |
| User_type missing | ✅ | Redirect /signup?error=type_missing |
| RLS denied | ⚠️ | Doit afficher message, pas boucle infinie |
| Session expired | ✅ | Redirect /login |
| Form validation | ⚠️ | Messages à vérifier cohérence |

### 3.4 Actions Prioritaires - UX

1. ⚠️ Tester flow complet après application migration 0005
2. ⚠️ Vérifier retour arrière dans onboarding
3. ⚠️ Auditer empty states

---

## 4. UI / DESIGN SYSTEM

### 4.1 Tokens Couleurs

| Token | Hex | Usage | Status |
|-------|-----|-------|--------|
| ivory | #F5F0E6 | Main background | ⚠️ Vérifier usage global |
| ivory-warm | #EDE8DC | Secondary background | ⚠️ |
| ivory-light | #FAF8F4 | Card background | ⚠️ |
| gold | #C4A962 | Primary accent | ✅ |
| gold-dark | #9A7B4F | Text on light | ⚠️ |
| charcoal | #2C2C2C | Primary text | ✅ |
| stone | #D1CCC4 | Borders | ✅ |

### 4.2 Typographie

| Element | Spec | Status | Notes |
|---------|------|--------|-------|
| H1 | Cormorant Garamond 300 40px | ⚠️ | Vérifier import fonts |
| H2 | Cormorant Garamond 400 32px | ⚠️ | |
| Body | Inter 400 16px | ✅ | |

### 4.3 Composants

| Component | File | Status | Notes |
|-----------|------|--------|-------|
| Button | ui/Button.tsx | ✅ | Variants: primary, secondary, ghost |
| Card | ui/Card.tsx | ✅ | |
| Input | ui/Input.tsx | ✅ | |
| Badge | ui/Badge.tsx | ✅ | |
| OAuthButtons | auth/OAuthButtons.tsx | ⚠️ | Vérifier utilisation dans login/signup |
| StepProgress | onboarding/StepProgress.tsx | ✅ | |

### 4.4 Actions Prioritaires - UI

1. ⚠️ Audit cohérence couleurs dans tous les fichiers
2. ⚠️ Vérifier import Google Fonts (Cormorant Garamond)
3. ⚠️ S'assurer OAuthButtons utilisé partout (icônes vs texte)
4. ⚠️ Tester responsive mobile

---

## 5. TEXTES / COPYWRITING

### 5.1 Tone of Voice

| Page | Status | Notes |
|------|--------|-------|
| Landing (/) | ⚠️ | À auditer - ton luxe discret |
| Login | ⚠️ | À auditer |
| Signup | ⚠️ | À auditer |
| Dashboards | ⚠️ | À auditer |

### 5.2 Error Messages

| Type | Status | Notes |
|------|--------|-------|
| Form validation | ⚠️ | Cohérence à vérifier |
| Server errors | ⚠️ | Messages techniques vs user-friendly |
| Empty states | ⚠️ | Textes à auditer |

### 5.3 Actions Prioritaires - Textes

1. ⚠️ Créer guide de tone of voice
2. ⚠️ Auditer tous les messages d'erreur
3. ⚠️ Vérifier cohérence labels formulaires

---

## 6. GRAPHISME / ASSETS

### 6.1 Logo

| Asset | Location | Status | Notes |
|-------|----------|--------|-------|
| Monogramme | public/brand/logo-monogram.png | ⚠️ | Vérifier existence |
| Logo full | public/brand/la_grasset_Tailor_Shift_logo.png | ✅ | |
| Logo short | public/brand/la_grasset_Tailor_Shift_logo_short.png | ✅ | |

### 6.2 Illustrations Fil Doré

| Asset | Status | Notes |
|-------|--------|-------|
| Thread illustrations | ✅ | 30+ images dans public/brand/ |
| Intégration UI | ⚠️ | À vérifier si utilisées |

### 6.3 Favicon

| Item | Status | Notes |
|------|--------|-------|
| favicon.ico | ⚠️ | À vérifier si présent |
| apple-touch-icon | ⚠️ | À vérifier |

### 6.4 Actions Prioritaires - Graphisme

1. ⚠️ Vérifier/créer favicon
2. ⚠️ Intégrer illustrations fil doré dans pages clés
3. ⚠️ Optimiser images avec Next.js Image

---

## 7. DONNÉES / CONTENU

### 7.1 MCS Constants

| File | Status | Notes |
|------|--------|-------|
| data/mcs/roles.ts | ✅ | L1-L8 |
| data/mcs/tiers.ts | ✅ | T1-T5 |
| data/mcs/divisions.ts | ✅ | 9 divisions |
| data/mcs/blocks.ts | ✅ | 6 block types |

### 7.2 Assessment Questions

| Item | Status | Notes |
|------|--------|-------|
| Questions file | ✅ | data/assessment/questions.ts |
| Quantity | ⚠️ | À vérifier (10-12 requis) |
| Quality | ⚠️ | À valider vs framework Chanel |
| Adaptivité niveau | ⚠️ | À vérifier |

### 7.3 Opportunity Templates

| Item | Status | Notes |
|------|--------|-------|
| Templates file | ✅ | data/templates/opportunities.ts |
| Quantity | ⚠️ | À vérifier (10-15 requis) |
| Coverage | ⚠️ | L1-L8 tous couverts ? |

### 7.4 Learning Modules

| Item | Status | Notes |
|------|--------|-------|
| Modules file | ✅ | data/learning/modules.ts |
| Quantity | ⚠️ | À vérifier |
| Categories | ⚠️ | 6 catégories couvertes ? |

### 7.5 Actions Prioritaires - Données

1. ⚠️ Auditer questions assessment (qualité + quantité)
2. ⚠️ Vérifier couverture templates opportunities
3. ⚠️ Valider learning modules content

---

## 8. SYNTHÈSE PAR PRIORITÉ

### 🔴 BLOQUANT (à faire immédiatement)

1. **Appliquer migration 0005_fix_rls_v2_security_definer.sql**
   - Sans cela: erreur "infinite recursion" sur talent onboarding

### ⚠️ IMPORTANT (à faire rapidement)

| # | Item | Domaine | Effort |
|---|------|---------|--------|
| 1 | Auditer questions assessment | Données | 2h |
| 2 | Vérifier OAuthButtons utilisé partout | UI | 30min |
| 3 | Tester flow complet talent | UX | 1h |
| 4 | Tester flow complet brand | UX | 1h |
| 5 | Vérifier fonts Cormorant Garamond | UI | 30min |

### 📋 NICE TO HAVE (polish)

| # | Item | Domaine | Effort |
|---|------|---------|--------|
| 1 | Intégrer illustrations fil doré | Graphisme | 2h |
| 2 | Créer/vérifier favicon | Graphisme | 30min |
| 3 | Audit tone of voice textes | Copywriting | 2h |
| 4 | Responsive mobile test | UI | 2h |
| 5 | Empty states textes | UX | 1h |

---

## 9. MÉTHODOLOGIE PROJET (Leçons Apprises)

### Pour un Projet Futur ou V6

#### Avant le Développement
1. ✅ Valider User State Machine (tous les états)
2. ✅ Créer RLS Dependency Matrix (éviter récursion)
3. ✅ Définir Route Matrix (public vs protected)
4. ✅ Documenter Error State Catalog

#### Pendant le Développement
1. ✅ Utiliser Master Spec comme source de vérité
2. ✅ Tester edge cases après chaque feature
3. ✅ Maintenir Component Inventory à jour

#### Avant la Production
1. ✅ Appliquer TOUTES les migrations
2. ✅ Tester E2E flow complet
3. ✅ Vérifier middleware tous les états
4. ✅ Audit sécurité RLS policies

---

## APPENDIX A: Commandes Utiles

```bash
# Vérifier migrations non appliquées
supabase migration list

# Appliquer une migration
supabase db push

# Tester RLS policies
supabase test db

# Lancer dev local
npm run dev
```

---

## APPENDIX B: Fichiers Clés à Auditer

```
middleware.ts              # Route protection
app/auth/callback/route.ts # OAuth callback
lib/engines/matching.ts    # 7D algorithm
lib/supabase/middleware.ts # Session handling
data/assessment/questions.ts # Assessment content
tailwind.config.ts         # Design tokens
```

---

*Audit généré le 2 Décembre 2025 — Tailor Shift V5.2*
