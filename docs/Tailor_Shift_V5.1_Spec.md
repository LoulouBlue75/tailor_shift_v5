# Tailor Shift V5.1 — Master Specification

> **Version:** 5.1 (Optimized)  
> **Date:** November 2025  
> **Status:** Ready for Development  
> **Stack:** Next.js 15 + Supabase + Vercel

---

## 1. Stack & Architecture

### 1.1 Technology Decisions

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 15 (App Router) | Server Components, Server Actions, modern patterns |
| Auth | Supabase Auth | Native RLS integration, OAuth built-in |
| Database | Supabase PostgreSQL | Managed, RLS, realtime, edge functions ready |
| Migrations | Supabase CLI (SQL) | Direct control, no ORM abstraction |
| File Storage | Supabase Storage | Avatars, documents, brand assets |
| Hosting | Vercel | Git-to-deploy, edge network, preview deployments |
| Styling | Tailwind CSS | Utility-first, design system alignment |

### 1.2 Architecture Principles

1. **Server Components First** — Client components only when interactivity required
2. **Server Actions for Mutations** — No API routes for CRUD
3. **Zero Global State** — URL + Server = State
4. **Privacy by Design** — Data minimization, RLS everywhere
5. **Deterministic Intelligence** — No ML black boxes, explainable scoring

### 1.3 Project Structure

```
tailor_shift_v5/
├── app/
│   ├── (public)/           # Landing, login, signup
│   ├── (talent)/           # Talent authenticated routes
│   ├── (brand)/            # Brand authenticated routes
│   └── api/                # Webhooks only
├── components/
│   ├── ui/                 # Design system primitives
│   ├── talent/             # Talent-specific components
│   └── brand/              # Brand-specific components
├── lib/
│   ├── supabase/           # Client, server, middleware clients
│   ├── engines/            # Matching, Assessment, Learning, Projection
│   └── utils/              # Helpers, formatters, validators
├── data/
│   ├── mcs/                # Master Classification System constants
│   └── templates/          # Opportunity templates
├── docs/
│   └── Luxury_assessment/  # Source materials for assessment questions
├── stories/                # Development stories (incremental)
└── supabase/
    ├── migrations/         # SQL migrations
    └── seed.sql            # Initial data
```

---

## 2. Master Classification System (MCS)

The MCS is the backbone taxonomy. All matching, assessment, and projection logic references these constants.

### 2.1 Role Ladder

| Level | Code | Title Examples | Scope |
|-------|------|----------------|-------|
| L1 | `sales_advisor` | Sales Advisor, Beauty Consultant | Individual contributor |
| L2 | `senior_advisor` | Senior Advisor, Expert | IC + informal mentoring |
| L3 | `team_lead` | Team Lead, Floor Manager | Small team (3-8) |
| L4 | `department_manager` | Department Manager, Category Lead | Department or category |
| L5 | `assistant_director` | Assistant Boutique Director, Deputy | Boutique-wide support |
| L6 | `boutique_director` | Boutique Director, Store Manager | Full boutique P&L |
| L7 | `area_manager` | Area Manager, District Director | Multi-store (3-10) |
| L8 | `regional_director` | Regional Director, Country Manager | Region or country |

### 2.2 Store Complexity Tiers

| Tier | Code | Description | Typical Team Size |
|------|------|-------------|-------------------|
| T1 | `flagship_xxl` | Global flagships (Champs-Élysées, 5th Ave) | 80-200+ |
| T2 | `flagship` | Major city flagships | 40-80 |
| T3 | `full_format` | Full assortment stores | 20-40 |
| T4 | `boutique` | Focused boutiques | 8-20 |
| T5 | `outlet_travel` | Outlets, travel retail, concessions | 4-15 |

### 2.3 Divisions

```typescript
const DIVISIONS = [
  'fashion',
  'leather_goods',
  'shoes',
  'beauty',
  'fragrance',
  'watches',
  'high_jewelry',
  'eyewear',
  'accessories'
] as const;
```

### 2.4 Experience Blocks

| Block | Code | Description |
|-------|------|-------------|
| Front of House | `foh` | Client-facing sales, service |
| Back of House | `boh` | Stock, operations, logistics |
| Leadership | `leadership` | Team management, P&L |
| Clienteling | `clienteling` | CRM, VIC, appointments |
| Operations | `operations` | Processes, compliance, inventory |
| Business | `business` | Strategy, analytics, buying |

### 2.5 Geography

**Regions:** EMEA, Americas, APAC, Middle East

**Key Hubs (examples):**
- EMEA: Paris, London, Milan, Munich, Dubai
- Americas: New York, Los Angeles, Miami, São Paulo
- APAC: Tokyo, Hong Kong, Shanghai, Singapore, Seoul

---

## 3. Database Schema

### 3.1 Core Tables

#### `profiles` (extends Supabase auth.users)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL CHECK (user_type IN ('talent', 'brand')),
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, user_type, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'talent'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

#### `talents`

```sql
CREATE TABLE talents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Identity
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  linkedin_url TEXT,
  
  -- Professional Identity
  current_role_level TEXT CHECK (current_role_level IN ('L1','L2','L3','L4','L5','L6','L7','L8')),
  current_store_tier TEXT CHECK (current_store_tier IN ('T1','T2','T3','T4','T5')),
  years_in_luxury INTEGER,
  current_maison TEXT,
  current_location TEXT,
  
  -- Divisions (array)
  divisions_expertise TEXT[] DEFAULT '{}',
  
  -- Career Preferences (JSONB)
  career_preferences JSONB DEFAULT '{
    "target_role_levels": [],
    "target_store_tiers": [],
    "target_divisions": [],
    "target_locations": [],
    "mobility": "local",
    "timeline": "passive"
  }',
  
  -- Compensation (never exposed, only for alignment)
  compensation_profile JSONB DEFAULT '{
    "current_base": null,
    "current_variable": null,
    "currency": "EUR",
    "expectations": null
  }',
  
  -- Assessment Summary (computed)
  assessment_summary JSONB DEFAULT '{
    "service_excellence": null,
    "clienteling": null,
    "operations": null,
    "leadership_signals": null,
    "version": null,
    "completed_at": null
  }',
  
  -- Profile Status
  onboarding_completed BOOLEAN DEFAULT FALSE,
  profile_completion_pct INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(profile_id)
);
```

#### `experience_blocks`

```sql
CREATE TABLE experience_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id UUID NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
  
  block_type TEXT NOT NULL CHECK (block_type IN ('foh','boh','leadership','clienteling','operations','business')),
  title TEXT NOT NULL,
  maison TEXT,
  location TEXT,
  
  start_date DATE,
  end_date DATE, -- NULL if current
  is_current BOOLEAN DEFAULT FALSE,
  
  role_level TEXT CHECK (role_level IN ('L1','L2','L3','L4','L5','L6','L7','L8')),
  store_tier TEXT CHECK (store_tier IN ('T1','T2','T3','T4','T5')),
  
  divisions_handled TEXT[] DEFAULT '{}',
  
  description TEXT,
  achievements TEXT[] DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `assessments`

```sql
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id UUID NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
  
  version TEXT NOT NULL DEFAULT 'v1',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed')),
  
  -- Answers stored temporarily, deleted after scoring
  answers_temp JSONB,
  
  -- Computed scores (permanent)
  scores JSONB DEFAULT '{
    "service_excellence": null,
    "clienteling": null,
    "operations": null,
    "leadership_signals": null
  }',
  
  -- Generated insights
  insights JSONB DEFAULT '{
    "strengths": [],
    "development_areas": [],
    "recommended_paths": []
  }',
  
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `brands`

```sql
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Brand Identity
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  
  -- Company Info
  segment TEXT CHECK (segment IN ('ultra_luxury','luxury','premium','accessible_luxury')),
  divisions TEXT[] DEFAULT '{}',
  headquarters_location TEXT,
  
  -- Contact
  contact_name TEXT,
  contact_role TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  
  -- Status
  onboarding_completed BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(profile_id)
);
```

#### `stores`

```sql
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  code TEXT, -- Internal store code
  
  complexity_tier TEXT CHECK (complexity_tier IN ('T1','T2','T3','T4','T5')),
  
  -- Location
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT CHECK (region IN ('EMEA','Americas','APAC','Middle_East')),
  address TEXT,
  
  divisions TEXT[] DEFAULT '{}',
  team_size INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `opportunities`

```sql
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  
  -- Role Definition
  title TEXT NOT NULL,
  role_level TEXT NOT NULL CHECK (role_level IN ('L1','L2','L3','L4','L5','L6','L7','L8')),
  division TEXT,
  
  -- Requirements
  required_experience_years INTEGER,
  required_languages TEXT[] DEFAULT '{}',
  required_capabilities JSONB DEFAULT '{}',
  
  -- Compensation Range (never exposed directly)
  compensation_range JSONB DEFAULT '{
    "min": null,
    "max": null,
    "currency": "EUR",
    "includes_variable": false
  }',
  
  -- Description
  description TEXT,
  responsibilities TEXT[] DEFAULT '{}',
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','active','paused','filled','cancelled')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);
```

#### `matches`

```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id UUID NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  
  -- 7D Scoring
  score_total DECIMAL(5,2),
  score_breakdown JSONB DEFAULT '{
    "role_fit": null,
    "division_fit": null,
    "store_context": null,
    "capability_fit": null,
    "geography": null,
    "experience_block": null,
    "preference": null
  }',
  
  -- Status
  status TEXT DEFAULT 'suggested' CHECK (status IN ('suggested','talent_interested','brand_interested','mutual','declined_talent','declined_brand','archived')),
  
  -- Compensation Alignment (tag only, no numbers)
  compensation_alignment TEXT CHECK (compensation_alignment IN ('within_range','above_range','below_range','unknown')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(talent_id, opportunity_id)
);
```

#### `learning_modules`

```sql
CREATE TABLE learning_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('service_excellence','clienteling','operations','leadership','product_knowledge','soft_skills')),
  
  duration_minutes INTEGER,
  difficulty TEXT CHECK (difficulty IN ('beginner','intermediate','advanced')),
  
  content_type TEXT CHECK (content_type IN ('article','video','quiz','exercise')),
  content_url TEXT,
  
  target_role_levels TEXT[] DEFAULT '{}',
  target_gaps TEXT[] DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `talent_learning_progress`

```sql
CREATE TABLE talent_learning_progress (
  talent_id UUID REFERENCES talents(id) ON DELETE CASCADE,
  module_id UUID REFERENCES learning_modules(id) ON DELETE CASCADE,
  
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started','in_progress','completed')),
  progress_pct INTEGER DEFAULT 0,
  
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  PRIMARY KEY (talent_id, module_id)
);
```

### 3.2 Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE talents ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only see/edit their own
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Talents: only own data
CREATE POLICY "Talents can view own data"
  ON talents FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Talents can update own data"
  ON talents FOR UPDATE
  USING (profile_id = auth.uid());

CREATE POLICY "Talents can insert own data"
  ON talents FOR INSERT
  WITH CHECK (profile_id = auth.uid());

-- Experience Blocks: only own
CREATE POLICY "Talents can manage own experience blocks"
  ON experience_blocks FOR ALL
  USING (talent_id IN (SELECT id FROM talents WHERE profile_id = auth.uid()));

-- Assessments: only own
CREATE POLICY "Talents can manage own assessments"
  ON assessments FOR ALL
  USING (talent_id IN (SELECT id FROM talents WHERE profile_id = auth.uid()));

-- Brands: only own
CREATE POLICY "Brands can view own data"
  ON brands FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Brands can update own data"
  ON brands FOR UPDATE
  USING (profile_id = auth.uid());

CREATE POLICY "Brands can insert own data"
  ON brands FOR INSERT
  WITH CHECK (profile_id = auth.uid());

-- Stores: only own brand's stores
CREATE POLICY "Brands can manage own stores"
  ON stores FOR ALL
  USING (brand_id IN (SELECT id FROM brands WHERE profile_id = auth.uid()));

-- Opportunities: brands manage own, talents see active
CREATE POLICY "Brands can manage own opportunities"
  ON opportunities FOR ALL
  USING (brand_id IN (SELECT id FROM brands WHERE profile_id = auth.uid()));

CREATE POLICY "Talents can view active opportunities"
  ON opportunities FOR SELECT
  USING (
    status = 'active' 
    AND EXISTS (SELECT 1 FROM talents WHERE profile_id = auth.uid())
  );

-- Matches: both parties can see their matches
CREATE POLICY "Users can view own matches"
  ON matches FOR SELECT
  USING (
    talent_id IN (SELECT id FROM talents WHERE profile_id = auth.uid())
    OR opportunity_id IN (
      SELECT id FROM opportunities 
      WHERE brand_id IN (SELECT id FROM brands WHERE profile_id = auth.uid())
    )
  );
```

---

## 4. Authentication Flow

### 4.1 Supabase Auth Configuration

**Providers:**
- Email/Password
- Google OAuth
- LinkedIn OAuth

**User Metadata:**
On signup, pass `user_type` in metadata:
```typescript
await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      user_type: 'talent' | 'brand',
      full_name: name
    }
  }
})
```

### 4.2 Auth Flow

```
1. User lands on /login or /signup
2. Chooses "I'm a Professional" or "I'm a Brand"
3. Signs up via Email or OAuth
4. Trigger creates profile with user_type
5. Redirect to appropriate onboarding:
   - Talent → /talent/onboarding
   - Brand → /brand/onboarding
6. After onboarding → Dashboard
```

### 4.3 Middleware Protection

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()
  
  const path = req.nextUrl.pathname
  
  // Protect talent routes
  if (path.startsWith('/talent') && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  // Protect brand routes
  if (path.startsWith('/brand') && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  // Verify user_type matches route
  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', session.user.id)
      .single()
    
    if (path.startsWith('/talent') && profile?.user_type !== 'talent') {
      return NextResponse.redirect(new URL('/brand/dashboard', req.url))
    }
    if (path.startsWith('/brand') && profile?.user_type !== 'brand') {
      return NextResponse.redirect(new URL('/talent/dashboard', req.url))
    }
  }
  
  return res
}

export const config = {
  matcher: ['/talent/:path*', '/brand/:path*']
}
```

---

## 5. Talent Journey V1

### 5.1 Onboarding Flow (7 Steps)

| Step | Name | Fields | Validation |
|------|------|--------|------------|
| 1 | Account | Email, Password (or OAuth) | Auth complete |
| 2 | Identity | First name, Last name, Phone, LinkedIn | Required fields |
| 3 | Professional Identity | Current role level, Store tier, Years in luxury, Current maison, Location | Role level required |
| 4 | Divisions | Select 1-5 divisions of expertise | Min 1 |
| 5 | Career Preferences | Target roles, tiers, locations, mobility, timeline | Min 1 target |
| 6 | First Experience Block | Most recent/current position | At least 1 block |
| 7 | Assessment Teaser | Introduction to Retail Excellence Scan | Optional start |

### 5.2 Talent Dashboard

**Sections:**
1. **Profile Completion Bar** — Visual progress, next steps CTA
2. **Match Feed** — Top 5 suggested opportunities (score + alignment tag)
3. **Assessment Status** — Complete/Incomplete, retake available
4. **Learning Recommendations** — 3 modules based on gaps
5. **Career Projection** — Next possible role, timeline estimate

### 5.3 Talent Profile (View/Edit)

**Tabs:**
- Overview (public-facing summary)
- Experience Blocks (CRUD)
- Career Preferences (edit)
- Skills & Divisions (edit)
- Settings (account, notifications, privacy)

---

## 6. Brand Journey V1

### 6.1 Onboarding Flow (5 Steps)

| Step | Name | Fields | Validation |
|------|------|--------|------------|
| 1 | Account | Email, Password (or OAuth) | Auth complete |
| 2 | Brand Identity | Brand name, Logo, Website, Segment | Name required |
| 3 | Contact | Contact name, Role, Email, Phone | Email required |
| 4 | First Store | Store name, City, Country, Tier, Divisions | At least 1 store |
| 5 | First Opportunity (Optional) | Use template or custom | Skip allowed |

### 6.2 Brand Dashboard

**Sections:**
1. **Active Opportunities** — List with match counts
2. **Top Matches** — Best talent matches across all opportunities
3. **Store Overview** — Quick stats per store
4. **Quick Actions** — Post opportunity, Add store, Search talents

### 6.3 Opportunity Management

**Create Flow:**
1. Select from template OR start blank
2. Assign to store (or brand-level)
3. Define requirements (role level, divisions, experience, languages)
4. Set compensation range (internal only)
5. Write description
6. Publish → triggers matching

**Templates (10-15 hardcoded V1):**
- L1 Sales Advisor (Fashion)
- L1 Beauty Consultant
- L2 Senior Advisor
- L3 Team Lead
- L4 Department Manager
- L5 Assistant Boutique Director
- L6 Boutique Director (Flagship)
- L6 Boutique Director (Boutique)
- L7 Area Manager
- L8 Regional Director

Each template pre-fills: title, role level, typical requirements, responsibilities skeleton.

---

## 7. Intelligence Engines

### 7.1 Design Principles

1. **Deterministic** — Same inputs = same outputs, always
2. **Explainable** — Every score has visible breakdown
3. **Versioned** — Engine version stamped on every output
4. **Privacy-First** — No PII in scoring, compensation = alignment tags only

### 7.2 Matching Engine (7D)

**Dimensions & Weights:**

| Dimension | Weight | Scoring Logic |
|-----------|--------|---------------|
| Role Fit | 20% | Level match (exact=100, ±1=70, ±2=40, >2=0) |
| Division Fit | 20% | Overlap between talent expertise & opportunity division |
| Store Context | 15% | Tier match (exact=100, ±1=60, >1=30) |
| Capability Fit | 15% | Assessment scores vs. required capabilities |
| Geography | 10% | Location match × mobility willingness |
| Experience Block | 10% | Relevant block types present |
| Preference | 10% | Timeline alignment, stated interest |

**Output:**
```typescript
interface MatchResult {
  score_total: number; // 0-100
  score_breakdown: {
    role_fit: number;
    division_fit: number;
    store_context: number;
    capability_fit: number;
    geography: number;
    experience_block: number;
    preference: number;
  };
  compensation_alignment: 'within_range' | 'above_range' | 'below_range' | 'unknown';
  engine_version: string;
}
```

### 7.3 Assessment Engine (4D)

**Dimensions:**

| Dimension | What it Measures | Question Types |
|-----------|------------------|----------------|
| Service Excellence | Client experience delivery, luxury standards | Situational judgment |
| Clienteling | Relationship building, VIC management | Behavioral |
| Operations | Process efficiency, inventory, compliance | Knowledge + situational |
| Leadership Signals | Team influence, coaching, vision | Behavioral + situational |

**Retail Excellence Scan:**
- 10-12 questions total
- Mix of multiple choice + situational judgment
- 15-20 minutes to complete
- Adaptive difficulty based on declared role level

**Scoring:**
- Each dimension: 0-100
- Aggregate not averaged (dimensions are independent)
- Generates: strengths (top 2), development areas (bottom 2), recommended paths

**Privacy:**
- Raw answers deleted immediately after scoring
- Only scores + insights persisted

### 7.4 Learning Engine

**Logic:**
1. Identify gaps from assessment (dimensions < 60)
2. Consider target role (what capabilities needed?)
3. Match to learning modules by category + difficulty
4. Prioritize by gap severity × role relevance

**Output:**
- Top 3-5 recommended modules
- Estimated time investment
- Expected impact on capabilities

### 7.5 Projection Engine

**Inputs:**
- Current role level
- Current store tier
- Years in luxury
- Assessment scores
- Career preferences

**Outputs:**
```typescript
interface ProjectionResult {
  next_role: {
    level: string;
    typical_titles: string[];
    readiness: 'ready_now' | 'ready_soon' | 'developing';
  };
  timeline_estimate: {
    min_months: number;
    max_months: number;
  };
  capability_gaps: string[];
  recommended_experiences: string[];
  engine_version: string;
}
```

---

## 8. UX/UI Guidelines

### 8.1 Design Philosophy

> **"Quiet Luxury. High Signal. Zero Noise."**

- No gradients
- No drop shadows (except subtle elevation)
- No visual gimmicks
- Generous whitespace
- Content density appropriate to context

### 8.2 Color System

| Token | Hex | Usage |
|-------|-----|-------|
| `--off-white` | #FAFAF8 | Backgrounds |
| `--charcoal` | #1A1A1A | Primary text |
| `--concrete` | #E0E0DA | Borders, dividers |
| `--matte-gold` | #C2A878 | Accents, CTAs |
| `--soft-grey` | #6B6B6B | Secondary text |
| `--success` | #2D5A3D | Positive states |
| `--warning` | #8B6914 | Caution states |
| `--error` | #8B2D2D | Error states |

### 8.3 Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| H1 | Playfair Display | 500 | 36px |
| H2 | Playfair Display | 500 | 28px |
| H3 | Manrope | 600 | 22px |
| Body | Manrope | 400 | 16px |
| Caption | Manrope | 400 | 14px |
| Label | Manrope | 500 | 12px |

### 8.4 Component Patterns

**Buttons:**
- Primary: Matte gold background, charcoal text
- Secondary: Transparent, charcoal border
- Ghost: Text only, underline on hover

**Cards:**
- White background
- 1px concrete border
- 8px border radius
- 24px padding

**Forms:**
- Labels above inputs
- 8px gap
- Clear validation states
- Helper text in soft grey

### 8.5 Spacing Scale

```
4px  — tight (icon gaps)
8px  — compact (form elements)
16px — default (component padding)
24px — comfortable (card padding)
32px — spacious (section gaps)
48px — generous (page sections)
64px — expansive (hero areas)
```

---

## 9. V1 Scope — IN / OUT

### 9.1 IN V1

| Feature | Talent | Brand |
|---------|--------|-------|
| Auth (Email + Google + LinkedIn) | ✅ | ✅ |
| Onboarding Flow | ✅ 7 steps | ✅ 5 steps |
| Profile Management | ✅ | ✅ |
| Experience Blocks CRUD | ✅ | — |
| Career Preferences | ✅ | — |
| Store Management | — | ✅ |
| Opportunity CRUD | — | ✅ |
| Opportunity Templates | — | ✅ 10-15 |
| Assessment (Retail Excellence Scan) | ✅ | — |
| Dashboard | ✅ | ✅ |
| Matching Engine | ✅ | ✅ |
| Match Display | ✅ Top matches | ✅ Top talents |
| Learning Recommendations | ✅ Basic | — |
| Projection Insights | ✅ Basic | — |
| Settings | ✅ | ✅ |

### 9.2 OUT V1 (V2+)

| Feature | Reason |
|---------|--------|
| Facebook OAuth | Low value for B2B luxury |
| 7D Capability Model | 4D sufficient for V1, expand V3 |
| Full Interaction Engine (handshakes) | Requires mutual interest flow |
| Messaging | V2 with Interaction Engine |
| Advanced Search/Filters | V2 |
| Edge Functions | V2 optimization |
| i18n (multi-language) | V2+, English-only V1 |
| Community Features | V2+ |
| Analytics Dashboard | V2 |
| Admin Panel | V2 |
| Mobile App | V2+ |

### 9.3 Routes Summary

**Public:**
```
/                   — Landing
/professionals      — Talent value prop
/brands             — Brand value prop
/login              — Login (both types)
/signup             — Signup (choose type)
/terms              — Terms
/privacy            — Privacy
```

**Talent:**
```
/talent/onboarding  — 7-step flow
/talent/dashboard   — Main dashboard
/talent/profile     — View profile
/talent/profile/edit — Edit identity
/talent/profile/experience — Manage blocks
/talent/profile/preferences — Career prefs
/talent/assessment  — Take/retake scan
/talent/assessment/results — View results
/talent/opportunities — Browse matches
/talent/learning    — Module recommendations
/talent/settings    — Account settings
```

**Brand:**
```
/brand/onboarding   — 5-step flow
/brand/dashboard    — Main dashboard
/brand/profile      — Brand profile
/brand/stores       — Manage stores
/brand/stores/[id]  — Store detail
/brand/opportunities — List opportunities
/brand/opportunities/new — Create
/brand/opportunities/[id] — Detail/edit
/brand/opportunities/[id]/matches — View matches
/brand/settings     — Account settings
```

---

## 10. Development Sequence

**Recommended story order:**

1. **Project Setup** — Next.js 15, Supabase client, Tailwind, folder structure
2. **Design System** — Color tokens, typography, base components
3. **Auth** — Supabase Auth, signup/login, middleware
4. **Database** — Migrations, RLS policies
5. **Talent Onboarding** — Steps 1-7
6. **Talent Dashboard** — Skeleton + profile completion
7. **Experience Blocks** — CRUD
8. **Brand Onboarding** — Steps 1-5
9. **Brand Dashboard** — Skeleton
10. **Store Management** — CRUD
11. **Opportunity Templates** — Data + selection
12. **Opportunity CRUD** — Create, edit, publish
13. **Assessment Engine** — Questions, scoring, results
14. **Matching Engine** — 7D algorithm
15. **Match Display** — Both sides
16. **Learning Engine** — Basic recommendations
17. **Projection Engine** — Basic insights
18. **Polish** — Error handling, edge cases, UX refinements

---

## Appendix A: Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OAuth (configured in Supabase dashboard)
# Google and LinkedIn credentials set in Supabase Auth settings

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_NAME=Tailor Shift

# Optional
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

---

## Appendix B: File Naming Conventions

- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Routes: `kebab-case` folders
- Constants: `SCREAMING_SNAKE_CASE`
- Database: `snake_case`

---

## Appendix C: Assessment Questions (To Be Developed)

Source materials in `/docs/Luxury_assessment/`:
- Chanel HOB Capability Framework
- Additional matrices (to be processed)

Questions to be generated:
- 10-12 questions covering 4D model
- Adapted from Chanel framework to be maison-agnostic
- Mix of situational judgment + behavioral
- Difficulty scaled to declared role level

---

*End of V5.1 Specification*
