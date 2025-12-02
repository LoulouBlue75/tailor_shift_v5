# Tailor Shift V5 — Master Specification V2

> **Version:** 5.2 (Consolidated)  
> **Date:** December 2025  
> **Status:** Production Ready  
> **Stack:** Next.js 15 + Supabase + Vercel

---

## PART 1: FOUNDATIONS

### 1.1 Vision & Objectives

**Mission:** Connect luxury retail professionals with premium maisons through intelligent matching.

**Core Principles:**
1. **Privacy by Design** — Data minimization, compensation never exposed
2. **Deterministic Intelligence** — Explainable scoring, no ML black boxes
3. **Quiet Luxury UX** — Minimalist, spacious, refined
4. **Server-First Architecture** — Server Components, Server Actions, zero global state

### 1.2 Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 15 (App Router) | Server Components, Server Actions |
| Auth | Supabase Auth | Native RLS integration, OAuth built-in |
| Database | Supabase PostgreSQL | Managed, RLS, realtime |
| Migrations | Supabase CLI (SQL) | Direct control, no ORM |
| Hosting | Vercel | Git-to-deploy, edge network |
| Styling | Tailwind CSS | Utility-first, design system alignment |

### 1.3 Master Classification System (MCS)

#### Role Ladder

| Level | Code | Title Examples | Scope |
|-------|------|----------------|-------|
| L1 | sales_advisor | Sales Advisor, Beauty Consultant | Individual contributor |
| L2 | senior_advisor | Senior Advisor, Expert | IC + mentoring |
| L3 | team_lead | Team Lead, Floor Manager | Small team (3-8) |
| L4 | department_manager | Department Manager | Department P&L |
| L5 | assistant_director | Assistant Boutique Director | Boutique support |
| L6 | boutique_director | Boutique Director | Full boutique P&L |
| L7 | area_manager | Area Manager | Multi-store (3-10) |
| L8 | regional_director | Regional Director | Region/Country |

#### Store Complexity Tiers

| Tier | Code | Description | Team Size |
|------|------|-------------|-----------|
| T1 | flagship_xxl | Global flagships | 80-200+ |
| T2 | flagship | Major city flagships | 40-80 |
| T3 | full_format | Full assortment | 20-40 |
| T4 | boutique | Focused boutiques | 8-20 |
| T5 | outlet_travel | Outlets, travel retail | 4-15 |

#### Divisions

```typescript
const DIVISIONS = [
  'fashion', 'leather_goods', 'shoes', 'beauty', 'fragrance',
  'watches', 'high_jewelry', 'eyewear', 'accessories'
] as const;
```

#### Experience Blocks

| Block | Code | Description |
|-------|------|-------------|
| Front of House | foh | Client-facing sales |
| Back of House | boh | Stock, operations |
| Leadership | leadership | Team management |
| Clienteling | clienteling | CRM, VIC |
| Operations | operations | Processes, compliance |
| Business | business | Strategy, analytics |

### 1.4 Glossary

| Term | Definition |
|------|------------|
| MCS | Master Classification System - taxonomy backbone |
| RLS | Row Level Security - Postgres data access control |
| VIC | Very Important Client |
| 7D Matching | 7-dimension scoring algorithm |
| Profile | User account record (extends auth.users) |
| Talent | Professional user record |
| Brand | Company user record |

---

## PART 2: DATA CONTRACTS

### 2.1 User State Machine

**⚠️ CRITICAL: All states must be handled by middleware to prevent redirect loops**

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER STATE MACHINE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐                                                │
│  │  ANONYMOUS  │ ─────────────────────────────────────────┐     │
│  │ (no session)│                                          │     │
│  └──────┬──────┘                                          │     │
│         │ signup/login                                    │     │
│         ▼                                                 │     │
│  ┌──────────────────┐                                     │     │
│  │ AUTH_NO_PROFILE  │ ──────────────────────────┐         │     │
│  │  (session only)  │  trigger failed/RLS error │         │     │
│  └────────┬─────────┘                           │         │     │
│           │ profile created                     │         │     │
│           ▼                                     │         │     │
│  ┌──────────────────┐                           │         │     │
│  │  AUTH_NO_TYPE    │ ──────────────────────────┤         │     │
│  │ (user_type=null) │  OAuth without type       │         │     │
│  └────────┬─────────┘                           │         │     │
│           │ type selected                       │         │     │
│           ▼                                     │         │     │
│  ┌────────┴────────┐                            │         │     │
│  │                 │                            │         │     │
│  ▼                 ▼                            ▼         ▼     │
│ TALENT           BRAND                       /signup   /signup │
│ ONBOARDING       ONBOARDING                  ?error=   ?error= │
│  │                 │                         profile   type    │
│  │ complete        │ complete                                  │
│  ▼                 ▼                                           │
│ TALENT           BRAND                                         │
│ ACTIVE           ACTIVE                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### State Definitions

| State | Conditions | Allowed Routes | Redirect To |
|-------|------------|----------------|-------------|
| ANONYMOUS | `session = null` | Public only | /login |
| AUTH_NO_PROFILE | `session ✓`, `profile = null` | /signup | /signup?error=profile_missing |
| AUTH_NO_TYPE | `profile ✓`, `user_type = null` | /signup | /signup?error=type_missing |
| TALENT_ONBOARDING | `user_type = 'talent'`, `onboarding = false` | /talent/* | N/A |
| TALENT_ACTIVE | `user_type = 'talent'`, `onboarding = true` | /talent/* | N/A |
| BRAND_ONBOARDING | `user_type = 'brand'`, `onboarding = false` | /brand/* | N/A |
| BRAND_ACTIVE | `user_type = 'brand'`, `onboarding = true` | /brand/* | N/A |

### 2.2 Database Schema

#### Core Tables Overview

```
profiles ─────────┬───────────── talents ──────── experience_blocks
    │             │                  │                    │
    │             │                  └─────── assessments │
    │             │                           │           │
    └─────────── brands ──────── stores ── opportunities │
                                      │         │         │
                                      └────── matches ────┘
                                                │
                                   talent_learning_progress
                                                │
                                         learning_modules
```

#### Table: profiles

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL CHECK (user_type IN ('talent', 'brand')),
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Table: talents

```sql
CREATE TABLE talents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  
  -- Identity
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  linkedin_url TEXT,
  
  -- Professional
  current_role_level TEXT CHECK (current_role_level IN ('L1','L2','L3','L4','L5','L6','L7','L8')),
  current_store_tier TEXT CHECK (current_store_tier IN ('T1','T2','T3','T4','T5')),
  years_in_luxury INTEGER,
  current_maison TEXT,
  current_location TEXT,
  divisions_expertise TEXT[] DEFAULT '{}',
  
  -- Preferences (JSONB)
  career_preferences JSONB DEFAULT '{}',
  compensation_profile JSONB DEFAULT '{}',
  
  -- Assessment (JSONB)
  assessment_summary JSONB DEFAULT '{}',
  
  -- Status
  profile_completion_pct INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Table: brands

```sql
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  segment TEXT CHECK (segment IN ('ultra_luxury','luxury','premium','accessible_luxury')),
  primary_division TEXT,
  divisions TEXT[] DEFAULT '{}',
  headquarters_location TEXT,
  description TEXT,
  verified BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Table: stores

```sql
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('T1','T2','T3','T4','T5')),
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT CHECK (region IN ('EMEA','Americas','APAC','Middle_East')),
  address TEXT,
  store_size_sqm INTEGER,
  team_size INTEGER,
  divisions TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active','opening_soon','inactive')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Table: opportunities

```sql
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  
  title TEXT NOT NULL,
  role_level TEXT NOT NULL CHECK (role_level IN ('L1','L2','L3','L4','L5','L6','L7','L8')),
  division TEXT,
  required_experience_years INTEGER,
  required_languages TEXT[] DEFAULT '{}',
  required_skills TEXT[] DEFAULT '{}',
  description TEXT,
  responsibilities TEXT[],
  benefits TEXT[],
  compensation_range JSONB DEFAULT '{}',
  matching_criteria JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','active','paused','filled','cancelled')),
  
  published_at TIMESTAMPTZ,
  deadline_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Table: matches

```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id UUID NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  score_breakdown JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','talent_interested','brand_interested','mutual_interest','declined','expired')),
  
  talent_action TEXT CHECK (talent_action IN ('interested','declined')),
  talent_action_at TIMESTAMPTZ,
  brand_action TEXT CHECK (brand_action IN ('interested','declined')),
  brand_action_at TIMESTAMPTZ,
  brand_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(talent_id, opportunity_id)
);
```

### 2.3 RLS Dependency Matrix

**⚠️ CRITICAL: Cross-table policies MUST use SECURITY DEFINER functions to avoid recursion**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    RLS DEPENDENCY GRAPH                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  profiles ◀──────────── Direct (auth.uid() = id)                   │
│      │                                                              │
│      ├──▶ talents ◀──── Direct (profile_id = auth.uid())           │
│      │       │                                                      │
│      │       └──▶ experience_blocks ◀── Via get_talent_id_for_user │
│      │       └──▶ assessments ◀──────── Via get_talent_id_for_user │
│      │       └──▶ matches ◀──────────── Via get_talent_id_for_user │
│      │                                                              │
│      └──▶ brands ◀───── Direct (profile_id = auth.uid())           │
│              │                                                      │
│              └──▶ stores ◀──────────── Via get_brand_id_for_user   │
│              └──▶ opportunities ◀───── Via get_brand_id_for_user   │
│              └──▶ matches ◀──────────── Via get_brand_id_for_user  │
│                                                                     │
│  ⚠️ DANGER ZONE (Circular Dependencies):                           │
│                                                                     │
│  talents.SELECT ──▶ brands (via matches)  ═══╗                     │
│                                               ║ CIRCULAR!           │
│  brands.SELECT ──▶ talents (via matches)  ═══╝                     │
│                                                                     │
│  SOLUTION: SECURITY DEFINER functions bypass RLS during checks      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Required Helper Functions

```sql
-- Get talent ID for current user (SECURITY DEFINER = bypasses RLS)
CREATE FUNCTION get_talent_id_for_user(user_id uuid) RETURNS uuid
  LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Get brand ID for current user
CREATE FUNCTION get_brand_id_for_user(user_id uuid) RETURNS uuid
  LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Get matched talent IDs for a brand
CREATE FUNCTION get_matched_talent_ids_for_brand(brand_user_id uuid) RETURNS uuid[]
  LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Get matched brand IDs for a talent
CREATE FUNCTION get_matched_brand_ids_for_talent(talent_user_id uuid) RETURNS uuid[]
  LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if user is talent/brand
CREATE FUNCTION is_talent(user_id uuid) RETURNS boolean
  LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE FUNCTION is_brand(user_id uuid) RETURNS boolean
  LANGUAGE plpgsql SECURITY DEFINER STABLE;
```

### 2.4 Data Validation Rules

| Table | Field | Validation | Error Message |
|-------|-------|------------|---------------|
| profiles | user_type | IN ('talent', 'brand') | Invalid user type |
| talents | first_name | MIN 2 chars | First name too short |
| talents | divisions_expertise | MAX 5 items | Select up to 5 divisions |
| brands | name | MIN 2 chars | Brand name required |
| opportunities | role_level | IN ('L1'..'L8') | Invalid role level |
| matches | score | 0-100 | Score out of range |

### 2.5 Error State Catalog

| Code | Condition | User Message | Recovery Action |
|------|-----------|--------------|-----------------|
| `profile_missing` | session ✓, profile null | "Account setup incomplete" | Redirect /signup |
| `type_missing` | profile ✓, user_type null | "Please select your role" | Redirect /signup |
| `rls_denied` | RLS policy rejected | "Access denied" | Log error, show support |
| `auth_expired` | Token expired | "Session expired" | Redirect /login |
| `redirect_loop` | ERR_TOO_MANY_REDIRECTS | "Navigation error" | Clear cookies |
| `recursion` | RLS infinite recursion | Server error | Fix policies |

---

## PART 3: ARCHITECTURE

### 3.1 Route Matrix

#### Public Routes (No Auth)

| Route | Purpose | Query Params |
|-------|---------|--------------|
| `/` | Landing page | - |
| `/login` | Sign in | `?redirect=`, `?error=` |
| `/signup` | Registration | `?type=`, `?error=` |
| `/forgot-password` | Password reset request | - |
| `/auth/callback` | OAuth callback | `?code=`, `?type=`, `?redirect=` |
| `/auth/reset-password` | Password reset form | `?code=` |
| `/terms` | Terms of service | - |
| `/privacy` | Privacy policy | - |
| `/brands` | Brand landing page | - |
| `/professionals` | Talent landing page | - |

#### Protected Routes (Auth Required)

| Route | User Type | Purpose |
|-------|-----------|---------|
| `/talent/onboarding/*` | talent | Onboarding flow |
| `/talent/dashboard` | talent | Main dashboard |
| `/talent/profile/*` | talent | Profile management |
| `/talent/opportunities/*` | talent | Browse matches |
| `/talent/assessment/*` | talent | Take/view assessment |
| `/talent/learning/*` | talent | Learning modules |
| `/talent/projection` | talent | Career projection |
| `/talent/settings` | talent | Account settings |
| `/brand/onboarding/*` | brand | Onboarding flow |
| `/brand/dashboard` | brand | Main dashboard |
| `/brand/stores/*` | brand | Store management |
| `/brand/opportunities/*` | brand | Opportunity management |
| `/brand/talents/*` | brand | View matched talents |
| `/brand/settings` | brand | Account settings |

### 3.2 Middleware Rules

```typescript
// MIDDLEWARE DECISION TREE
// 
// 1. Is route public? → YES → Allow
// 2. Is user authenticated? → NO → Redirect /login
// 3. Does profile exist? → NO → Redirect /signup?error=profile_missing
// 4. Is user_type set? → NO → Redirect /signup?error=type_missing
// 5. Does route match user_type?
//    - /talent/* + type=brand → Redirect /brand/dashboard
//    - /brand/* + type=talent → Redirect /talent/dashboard
// 6. Allow request
```

### 3.3 Server Actions Catalog

| Action | File | Input | Output |
|--------|------|-------|--------|
| `saveIdentity` | talent-onboarding.ts | FormData | Redirect or error |
| `saveProfessional` | talent-onboarding.ts | FormData | Redirect or error |
| `saveDivisions` | talent-onboarding.ts | FormData | Redirect or error |
| `savePreferences` | talent-onboarding.ts | FormData | Redirect or error |
| `saveExperience` | talent-onboarding.ts | FormData | Redirect or error |
| `completeOnboarding` | talent-onboarding.ts | - | Redirect |
| `saveBrandIdentity` | brand-onboarding.ts | BrandIdentityData | {success, error} |
| `saveBrandContact` | brand-onboarding.ts | BrandContactData | {success, error} |
| `saveFirstStore` | brand-onboarding.ts | StoreData | {success, error} |
| `completeBrandOnboarding` | brand-onboarding.ts | - | {success, error} |

### 3.4 Auth Flow Diagrams

```
EMAIL/PASSWORD SIGNUP
=====================
1. User fills form (/signup)
2. supabase.auth.signUp() with user_type in metadata
3. Supabase creates auth.users record
4. Trigger creates profiles record
5. Email sent to user
6. User clicks link
7. /auth/callback receives code
8. Exchange code for session
9. Verify profile exists (create if missing)
10. Redirect to onboarding

OAUTH SIGNUP
============
1. User clicks Google/LinkedIn (/signup)
2. Pass user_type in redirect URL
3. Provider authenticates user
4. Callback with code + type param
5. Exchange code for session
6. Check/create profile with user_type
7. Redirect to onboarding
```

---

## PART 4: DESIGN SYSTEM

### 4.1 Tokens

#### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| ivory | #F5F0E6 | Main background |
| ivory-warm | #EDE8DC | Secondary background |
| ivory-light | #FAF8F4 | Card background |
| gold | #C4A962 | Primary accent, CTAs |
| gold-dark | #9A7B4F | Text on light |
| charcoal | #2C2C2C | Primary text |
| grey-warm | #8B8178 | Secondary text |
| stone | #D1CCC4 | Borders |
| success | #7A8B6E | Positive states |
| error | #A65D57 | Error states |

#### Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| H1 | Cormorant Garamond | 300 | 40px |
| H2 | Cormorant Garamond | 400 | 32px |
| H3 | Inter | 500 | 20px |
| Body | Inter | 400 | 16px |
| Caption | Inter | 400 | 14px |
| Label | Inter | 500 | 12px |

#### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| tight | 4px | Icon gaps |
| compact | 8px | Form elements |
| comfortable | 24px | Card padding |
| spacious | 32px | Section padding |
| expansive | 64px | Page sections |

#### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| shadow-subtle | 0 1px 2px rgba(0,0,0,0.03) | Inputs |
| shadow-card | 0 1px 3px rgba(0,0,0,0.04) | Cards |
| shadow-elevated | 0 4px 12px rgba(0,0,0,0.06) | Modals |

### 4.2 Component Inventory

| Component | File | Variants | Used In |
|-----------|------|----------|---------|
| Button | ui/Button.tsx | primary, secondary, ghost | All forms |
| Card | ui/Card.tsx | default, hover | Dashboards, forms |
| Input | ui/Input.tsx | default, error | All forms |
| Badge | ui/Badge.tsx | default, success, warning, error | Status indicators |
| PhoneInput | ui/PhoneInput.tsx | default | Onboarding |
| OAuthButtons | auth/OAuthButtons.tsx | default | /login, /signup |
| StepProgress | onboarding/StepProgress.tsx | default | Onboarding flows |

### 4.3 Page Templates

#### Centered Card (Auth Pages)

```
┌──────────────────────────────────────┐
│                                      │
│           ┌──────────┐               │
│           │   Logo   │               │
│           └──────────┘               │
│                                      │
│     ┌──────────────────────────┐     │
│     │                          │     │
│     │         CARD             │     │
│     │                          │     │
│     │   [Form Content]         │     │
│     │                          │     │
│     └──────────────────────────┘     │
│                                      │
└──────────────────────────────────────┘
```

#### Dashboard Layout

```
┌──────────────────────────────────────┐
│  [Logo]    [Nav Links]    [Avatar ▼] │ ← Header
├──────────────────────────────────────┤
│                                      │
│  ┌─────────┐  ┌─────────┐  ┌──────┐  │
│  │  MAIN   │  │ SIDEBAR │  │ CARD │  │
│  │ CONTENT │  │         │  │      │  │
│  │         │  │         │  │      │  │
│  └─────────┘  └─────────┘  └──────┘  │
│                                      │
└──────────────────────────────────────┘
```

---

## PART 5: FEATURES

### 5.1 Talent Journey

#### Onboarding Steps

| Step | Route | Fields | Validation |
|------|-------|--------|------------|
| 1 | Welcome | - | - |
| 2 | Identity | first_name, last_name, phone, linkedin | Names required |
| 3 | Professional | role_level, store_tier, years, maison, location | Role required |
| 4 | Divisions | divisions[] | 1-5 selections |
| 5 | Preferences | target_roles[], mobility, timeline | Min 1 target |
| 6 | Experience | experience_block | Optional |
| 7 | Assessment Intro | - | Optional start |

#### Dashboard Sections

1. Profile Completion — Progress bar, next steps
2. Match Feed — Top opportunities with scores
3. Assessment Status — Complete/incomplete CTA
4. Learning Recommendations — Gap-based modules
5. Career Projection — Next role forecast

### 5.2 Brand Journey

#### Onboarding Steps

| Step | Route | Fields | Validation |
|------|-------|--------|------------|
| 1 | Identity | name, segment, divisions | Name required |
| 2 | Contact | contact_name, role, email | Email required |
| 3 | Store | store details | 1 store required |
| 4 | Opportunity Intro | - | Optional |

#### Dashboard Sections

1. Active Opportunities — Count, status
2. Top Matches — Best talent matches
3. Store Overview — Store stats
4. Quick Actions — Post opportunity, add store

### 5.3 Matching Engine (7D)

| Dimension | Weight | Logic |
|-----------|--------|-------|
| Role Fit | 20% | Level match (exact=100, ±1=70, ±2=40) |
| Division Fit | 20% | Overlap between expertise & requirement |
| Store Context | 15% | Tier match (exact=100, ±1=60) |
| Capability Fit | 15% | Assessment scores vs requirements |
| Geography | 10% | Location × mobility |
| Experience Block | 10% | Relevant block types present |
| Preference | 10% | Timeline alignment |

### 5.4 Assessment Engine (4D)

| Dimension | Measures | Question Types |
|-----------|----------|----------------|
| Service Excellence | Luxury standards | Situational judgment |
| Clienteling | VIC management | Behavioral |
| Operations | Process efficiency | Knowledge |
| Leadership Signals | Team influence | Behavioral |

**Format:**
- 10-12 questions
- 15-20 minutes
- Adaptive to role level
- Raw answers deleted after scoring

### 5.5 Learning Engine

**Logic:**
1. Identify gaps (assessment < 60)
2. Consider target role requirements
3. Match to modules by category + difficulty
4. Prioritize by gap × relevance

---

## PART 6: QUALITY

### 6.1 E2E Test Scenarios

#### Talent Happy Path

```
1. Visit /signup
2. Select "Professional"
3. Complete email signup
4. Verify email
5. Complete all onboarding steps
6. Reach dashboard
7. View opportunities
8. Express interest in match
```

#### Brand Happy Path

```
1. Visit /signup
2. Select "Brand"
3. Complete email signup
4. Verify email
5. Complete brand onboarding
6. Add store
7. Create opportunity
8. View matched talents
```

### 6.2 Integration Test Cases

| ID | Scenario | Expected Result |
|----|----------|-----------------|
| INT-01 | Signup with null user_type | Redirect to /signup?error=type_missing |
| INT-02 | Profile trigger fails | Fallback creates profile in callback |
| INT-03 | RLS denies access | Error shown, not redirect loop |
| INT-04 | Talent accesses /brand/* | Redirect to /talent/dashboard |
| INT-05 | Brand accesses /talent/* | Redirect to /brand/dashboard |

### 6.3 Edge Case Coverage

| Case | Handling | Tested |
|------|----------|--------|
| Session exists, profile null | Redirect /signup?error=profile_missing | ✓ |
| Profile exists, user_type null | Redirect /signup?error=type_missing | ✓ |
| OAuth without type param | Default to 'talent' | ✓ |
| Trigger fails silently | Manual creation in callback | ✓ |
| RLS circular dependency | SECURITY DEFINER functions | ✓ |
| Middleware redirect loop | Explicit null checks | ✓ |

### 6.4 Performance Criteria

| Metric | Target | Critical Path |
|--------|--------|---------------|
| TTFB | < 200ms | All pages |
| LCP | < 2.5s | Dashboard |
| Auth callback | < 1s | /auth/callback |
| Matching query | < 500ms | Dashboard load |
| Page transition | < 300ms | Navigation |

---

## APPENDIX A: Migration History

| Migration | Description | Status |
|-----------|-------------|--------|
| 0001_initial_schema.sql | Tables, triggers | Applied |
| 0002_rls_policies.sql | Basic RLS | Applied |
| 0003_seed_data.sql | Initial data | Applied |
| 0004_fix_rls_recursion.sql | First recursion fix | Superseded |
| 0005_fix_rls_v2_security_definer.sql | SECURITY DEFINER fix | Required |

---

## APPENDIX B: Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_NAME=Tailor Shift

# OAuth (configured in Supabase dashboard)
# Google and LinkedIn credentials in Supabase Auth settings
```

---

## APPENDIX C: Version History

| Version | Date | Changes |
|---------|------|---------|
| 5.0 | Nov 2025 | Initial specification |
| 5.1 | Nov 2025 | Optimized structure |
| 5.2 | Dec 2025 | Added state machine, RLS matrix, error catalog, edge cases |

---

*End of V5.2 Specification — Consolidated from lessons learned*
