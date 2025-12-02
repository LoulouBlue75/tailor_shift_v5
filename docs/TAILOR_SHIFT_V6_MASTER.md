# Tailor Shift V6 — Master Specification

> **Version:** 6.0  
> **Date:** Q3 2025 (Target)  
> **Status:** Planning  
> **Base:** V5.2 Consolidated  
> **Stack:** Next.js 15 + Supabase + Vercel

---

## TABLE OF CONTENTS

1. [PART 1: FOUNDATIONS](#part-1-foundations)
2. [PART 2: DATA CONTRACTS](#part-2-data-contracts)
3. [PART 3: ARCHITECTURE](#part-3-architecture)
4. [PART 4: DESIGN SYSTEM](#part-4-design-system)
5. [PART 5: FEATURES V6](#part-5-features-v6)
6. [PART 6: QUALITY](#part-6-quality)
7. [PART 7: MÉTHODOLOGIE PROJET (AI-Ready)](#part-7-méthodologie-projet-ai-ready)
8. [APPENDICES](#appendices)

---

## PART 1: FOUNDATIONS

### 1.1 Vision & Objectives

**Mission:** Connect luxury retail professionals with premium maisons through intelligent matching, networking, and personalized experiences.

**V6 Evolution:**
- V5: MVP — Matching + Assessment + Learning
- V6: Platform — + Community + Personalization + Communication

**Core Principles:**
1. **Privacy by Design** — Data minimization, compensation never exposed
2. **Deterministic Intelligence** — Explainable scoring, no ML black boxes
3. **Quiet Luxury UX** — Minimalist, spacious, refined
4. **Server-First Architecture** — Server Components, Server Actions, minimal client state
5. **Community-Driven** — Networking and peer validation
6. **Brand Empowerment** — Customization and autonomy

### 1.2 Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 15 (App Router) | Server Components, Server Actions |
| Auth | Supabase Auth | Native RLS integration, OAuth built-in |
| Database | Supabase PostgreSQL | Managed, RLS, realtime |
| Realtime | Supabase Realtime | For messaging & notifications |
| Migrations | Supabase CLI (SQL) | Direct control, no ORM |
| Hosting | Vercel | Git-to-deploy, edge network |
| Styling | Tailwind CSS | Utility-first, design system alignment |
| i18n | next-intl | Server-first internationalization |

### 1.3 Master Classification System (MCS)

*(Unchanged from V5)*

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

### 1.4 Glossary V6

| Term | Definition |
|------|------------|
| MCS | Master Classification System |
| RLS | Row Level Security |
| VIC | Very Important Client |
| 8D Matching | 8-dimension scoring (V6: +brand assessment) |
| Community | Talent networking feature |
| White-Label | Brand customization feature |
| Pipeline | Brand's saved talents |

---

## PART 2: DATA CONTRACTS

### 2.1 User State Machine V6

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER STATE MACHINE V6                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐                                                │
│  │  ANONYMOUS  │                                                │
│  └──────┬──────┘                                                │
│         │ signup/login                                          │
│         ▼                                                       │
│  ┌──────────────────┐                                           │
│  │ AUTH_NO_PROFILE  │ → /signup?error=profile_missing           │
│  └────────┬─────────┘                                           │
│           │ profile created                                     │
│           ▼                                                     │
│  ┌──────────────────┐                                           │
│  │  AUTH_NO_TYPE    │ → /signup?error=type_missing              │
│  └────────┬─────────┘                                           │
│           │ type selected                                       │
│           ▼                                                     │
│  ┌────────┴────────┐                                            │
│  │                 │                                            │
│  ▼                 ▼                                            │
│ TALENT           BRAND                                          │
│ ONBOARDING       ONBOARDING                                     │
│  │                 │                                            │
│  │ complete        │ complete                                   │
│  ▼                 ▼                                            │
│ TALENT           BRAND                                          │
│ ACTIVE           ACTIVE                                         │
│  │                 │                                            │
│  │ [V6]            │ [V6]                                       │
│  ▼                 ▼                                            │
│ TALENT           BRAND                                          │
│ CONNECTED        TEAM_MEMBER (invited user)                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Database Schema V6

#### V5 Tables (Unchanged)
- `profiles`
- `talents`
- `brands`
- `stores`
- `opportunities`
- `matches`
- `experience_blocks`
- `assessments`
- `talent_learning_progress`
- `learning_modules`

#### V6 NEW Tables

```sql
-- =====================================================
-- BRAND ASSESSMENTS (Custom brand questionnaires)
-- =====================================================
CREATE TABLE brand_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  estimated_duration_minutes INTEGER DEFAULT 15,
  is_mandatory BOOLEAN DEFAULT FALSE,
  passing_score INTEGER DEFAULT 60,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','active','archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE brand_assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES brand_assessments(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('mcq','scale','situational','open')),
  options JSONB, -- [{value, label, score}]
  max_score INTEGER DEFAULT 10,
  order_index INTEGER NOT NULL,
  is_required BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE talent_brand_assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id UUID NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL REFERENCES brand_assessments(id) ON DELETE CASCADE,
  score INTEGER,
  max_possible_score INTEGER,
  answers_snapshot JSONB, -- Deleted after 30 days for privacy
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(talent_id, assessment_id)
);

-- =====================================================
-- BRAND CUSTOMIZATION (White-label)
-- =====================================================
ALTER TABLE brands ADD COLUMN IF NOT EXISTS branding JSONB DEFAULT '{
  "logo_url": null,
  "primary_color": "#C4A962",
  "secondary_color": "#9A7B4F",
  "font_family": null,
  "background_style": "default",
  "custom_domain": null,
  "hide_ts_branding": false
}';

-- =====================================================
-- TALENT PIPELINE (Brand's saved talents)
-- =====================================================
CREATE TABLE talent_pipeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  talent_id UUID NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
  stage TEXT DEFAULT 'saved' CHECK (stage IN (
    'saved','contacted','screening','interviewing','offer','hired','rejected','withdrawn'
  )),
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  added_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(brand_id, talent_id, opportunity_id)
);

-- =====================================================
-- BRAND TEAM (Multi-user collaboration)
-- =====================================================
CREATE TABLE brand_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner','admin','recruiter','viewer')),
  invited_by UUID REFERENCES profiles(id),
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','active','deactivated')),
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(brand_id, profile_id)
);

-- =====================================================
-- TALENT NETWORKING (Community)
-- =====================================================
CREATE TABLE talent_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined','blocked')),
  message TEXT, -- Optional connection request message
  created_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  UNIQUE(requester_id, receiver_id),
  CHECK (requester_id != receiver_id)
);

CREATE TABLE talent_visibility_settings (
  talent_id UUID PRIMARY KEY REFERENCES talents(id) ON DELETE CASCADE,
  visible_to_same_maison BOOLEAN DEFAULT FALSE,
  visible_to_same_group BOOLEAN DEFAULT FALSE,
  share_full_name BOOLEAN DEFAULT TRUE,
  share_current_role BOOLEAN DEFAULT TRUE,
  share_location BOOLEAN DEFAULT TRUE,
  share_divisions BOOLEAN DEFAULT TRUE,
  share_years_experience BOOLEAN DEFAULT FALSE,
  accept_connection_requests BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE luxury_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- LVMH, Kering, Richemont, etc.
  maisons TEXT[] NOT NULL, -- List of maison names
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- MESSAGING SYSTEM
-- =====================================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  talent_id UUID NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ,
  talent_unread_count INTEGER DEFAULT 0,
  brand_unread_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','archived','blocked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(talent_id, brand_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('talent','brand')),
  sender_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text','system','file')),
  metadata JSONB DEFAULT '{}', -- For files: {filename, url, size}
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- NOTIFICATIONS CENTER
-- =====================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- new_match, mutual_interest, new_message, etc.
  title TEXT NOT NULL,
  body TEXT,
  data JSONB DEFAULT '{}', -- {match_id, conversation_id, etc.}
  read_at TIMESTAMPTZ,
  sent_email BOOLEAN DEFAULT FALSE,
  sent_push BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notification_preferences (
  profile_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  email_new_match BOOLEAN DEFAULT TRUE,
  email_mutual_interest BOOLEAN DEFAULT TRUE,
  email_new_message BOOLEAN DEFAULT TRUE,
  email_weekly_digest BOOLEAN DEFAULT TRUE,
  push_enabled BOOLEAN DEFAULT FALSE,
  in_app_enabled BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SKILLS ENDORSEMENTS
-- =====================================================
CREATE TABLE skill_endorsements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id UUID NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
  skill_category TEXT NOT NULL, -- service_excellence, clienteling, etc.
  endorser_name TEXT NOT NULL,
  endorser_email TEXT NOT NULL,
  endorser_relationship TEXT, -- manager, colleague, etc.
  endorsement_text TEXT,
  verification_token TEXT UNIQUE,
  verified_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','verified','expired')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ANALYTICS (Aggregated, privacy-safe)
-- =====================================================
CREATE TABLE salary_benchmark_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_level TEXT NOT NULL,
  division TEXT,
  region TEXT,
  store_tier TEXT,
  sample_size INTEGER NOT NULL,
  min_salary INTEGER,
  median_salary INTEGER,
  max_salary INTEGER,
  currency TEXT DEFAULT 'EUR',
  period TEXT NOT NULL, -- 2025-Q1, 2025-Q2, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role_level, division, region, store_tier, period)
);
```

### 2.3 RLS Matrix V6

#### New RLS Policies (SECURITY DEFINER pattern)

```sql
-- Brand Assessments: Brand owns, talents can view active
CREATE POLICY "Brand owns assessments" ON brand_assessments
  FOR ALL USING (brand_id = get_brand_id_for_user(auth.uid()));

CREATE POLICY "Talents view active assessments" ON brand_assessments
  FOR SELECT USING (status = 'active' AND is_talent(auth.uid()));

-- Pipeline: Brand only
CREATE POLICY "Brand owns pipeline" ON talent_pipeline
  FOR ALL USING (brand_id = get_brand_id_for_user(auth.uid()));

-- Brand Members: Owner/Admin can manage, members see own
CREATE POLICY "Brand members access" ON brand_members
  FOR SELECT USING (
    profile_id = auth.uid() OR
    brand_id = get_brand_id_for_user(auth.uid())
  );

-- Connections: Both parties can see
CREATE POLICY "Talent connections" ON talent_connections
  FOR SELECT USING (
    requester_id = get_talent_id_for_user(auth.uid()) OR
    receiver_id = get_talent_id_for_user(auth.uid())
  );

-- Conversations: Participants only
CREATE POLICY "Conversation participants" ON conversations
  FOR SELECT USING (
    talent_id = get_talent_id_for_user(auth.uid()) OR
    brand_id = get_brand_id_for_user(auth.uid())
  );

-- Messages: Via conversation
CREATE POLICY "Message access" ON messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM conversations c
      WHERE c.talent_id = get_talent_id_for_user(auth.uid())
         OR c.brand_id = get_brand_id_for_user(auth.uid())
    )
  );

-- Notifications: User only
CREATE POLICY "User notifications" ON notifications
  FOR ALL USING (user_id = auth.uid());
```

### 2.4 Data Validation Rules V6

*(V5 rules + new)*

| Table | Field | Validation | Error |
|-------|-------|------------|-------|
| brand_assessments | title | 3-100 chars | Title required |
| brand_assessment_questions | max_score | 1-100 | Invalid score |
| talent_pipeline | stage | Valid enum | Invalid stage |
| messages | content | 1-5000 chars | Message too long |
| talent_connections | - | requester != receiver | Cannot connect to self |

---

## PART 3: ARCHITECTURE

### 3.1 Route Matrix V6

#### New Routes

| Route | Type | User | Purpose |
|-------|------|------|---------|
| `/talent/network` | Protected | Talent | Community/connections |
| `/talent/network/[id]` | Protected | Talent | View connection profile |
| `/talent/messages` | Protected | Talent | Conversations list |
| `/talent/messages/[id]` | Protected | Talent | Conversation detail |
| `/talent/notifications` | Protected | Talent | Notification center |
| `/talent/salary-benchmark` | Protected | Talent | Salary data |
| `/brand/assessments` | Protected | Brand | Assessment list |
| `/brand/assessments/new` | Protected | Brand | Create assessment |
| `/brand/assessments/[id]` | Protected | Brand | Edit assessment |
| `/brand/pipeline` | Protected | Brand | Saved talents |
| `/brand/team` | Protected | Brand | Team members |
| `/brand/messages` | Protected | Brand | Conversations |
| `/brand/analytics` | Protected | Brand | Dashboard metrics |
| `/brand/customize` | Protected | Brand | White-label settings |

### 3.2 Server Actions V6

#### New Actions

| Action | File | Input | Output |
|--------|------|-------|--------|
| `createBrandAssessment` | brand-assessment.ts | AssessmentData | {success, id} |
| `updateBrandAssessment` | brand-assessment.ts | id, data | {success} |
| `publishBrandAssessment` | brand-assessment.ts | id | {success} |
| `submitBrandAssessment` | brand-assessment.ts | answers | {success, score} |
| `saveToPipeline` | pipeline.ts | talentId, oppId | {success} |
| `updatePipelineStage` | pipeline.ts | id, stage | {success} |
| `inviteTeamMember` | team.ts | email, role | {success} |
| `updateTeamMember` | team.ts | id, role | {success} |
| `removeTeamMember` | team.ts | id | {success} |
| `sendConnectionRequest` | network.ts | receiverId | {success} |
| `respondToConnection` | network.ts | id, accept | {success} |
| `updateVisibilitySettings` | network.ts | settings | {success} |
| `sendMessage` | messaging.ts | convId, content | {success, message} |
| `markAsRead` | messaging.ts | convId | {success} |
| `updateBranding` | branding.ts | BrandingData | {success} |
| `requestEndorsement` | endorsements.ts | email, skill | {success} |
| `verifyEndorsement` | endorsements.ts | token | {success} |

### 3.3 API Routes (for integrations)

```
/api/v1/
├── /auth (OAuth for integrations)
├── /opportunities (CRUD)
├── /matches (Read)
├── /candidates (Read pipeline)
└── /webhooks (Events)
```

---

## PART 4: DESIGN SYSTEM

**📌 See `docs/BRAND_GUIDELINES_V6.md` for complete visual direction**

### 4.0 Design Evolution V5 → V6

| Aspect | V5 | V6 |
|--------|----|----|
| Background | Ivory (#F5F0E6) | White (#FFFFFF) |
| Gold usage | Frequent (20%) | Sparse (5%) |
| Buttons | Shadow, filled | Minimal, outline/text |
| Cards | Shadow | Border only |
| Typography | Cormorant 40px | Cormorant 48-72px |
| Philosophy | "Quiet Luxury" | "Extreme Restraint" |

**Inspiration:** Smythson.com, Moynat, The Row

### 4.1 Revised Color Palette

| Token | V5 Hex | V6 Hex | Note |
|-------|--------|--------|------|
| background | #F5F0E6 | #FFFFFF | More minimal |
| secondary | #EDE8DC | #FAF8F4 | Lighter |
| text | #2C2C2C | #1A1A1A | Darker |
| gold | #C4A962 | #B8A068 | More muted |

### 4.2 Language

**Default:** English
**Future:** French (V6.2)

All content in dictionaries for i18n-ready architecture.

### 4.1 New Components V6

| Component | File | Purpose |
|-----------|------|---------|
| MessageBubble | messaging/MessageBubble.tsx | Chat message |
| ConversationList | messaging/ConversationList.tsx | Inbox list |
| ConnectionCard | network/ConnectionCard.tsx | Connection preview |
| NotificationItem | notifications/NotificationItem.tsx | Single notification |
| BrandingPreview | brand/BrandingPreview.tsx | White-label preview |
| PipelineKanban | brand/PipelineKanban.tsx | Drag & drop pipeline |
| AssessmentBuilder | brand/AssessmentBuilder.tsx | Question editor |

---

## PART 5: FEATURES V6

### 5.1 Talent Journey V6

#### Enhanced Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  Profile Completion    [████████░░] 80%                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ New Matches │  │  Messages   │  │ Connections │              │
│  │     12      │  │      3      │  │     24      │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                 │
│  TOP OPPORTUNITIES                           NETWORK            │
│  ┌─────────────────────────────┐   ┌──────────────────────┐    │
│  │ ★ 87% Chanel - BD Paris    │   │ Marie D. - Same team │    │
│  │ ★ 82% Dior - AM London     │   │ Jean P. - Same group │    │
│  │ ★ 78% LV - TL Dubai        │   │ + 5 suggestions      │    │
│  └─────────────────────────────┘   └──────────────────────┘    │
│                                                                 │
│  LEARNING                          CAREER                       │
│  ┌─────────────────────────────┐   ┌──────────────────────┐    │
│  │ Continue: VIC Management   │   │ Next: L4 in 8-12 mo  │    │
│  └─────────────────────────────┘   └──────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Networking Flow

1. Talent enables visibility in settings (opt-in)
2. Discovers talents from same maison/group
3. Sends connection request
4. Accepted → can message directly
5. Build professional network

### 5.2 Brand Journey V6

#### Enhanced Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  Welcome back, [Brand Name]                           ⚙ Theme  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Active Opps │  │  Pipeline   │  │   Mutual    │              │
│  │      8      │  │     45      │  │     12      │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                 │
│  PIPELINE OVERVIEW                                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Saved(12) → Contacted(8) → Interview(5) → Offer(2)      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  TOP MATCHES                       ASSESSMENTS                  │
│  ┌─────────────────────────────┐   ┌──────────────────────┐    │
│  │ ★ 92% Jean D. - BD exp     │   │ Client Exp Quiz ✓   │    │
│  │ ★ 88% Marie L. - AM exp    │   │ Culture Fit (draft) │    │
│  │ ★ 85% Pierre M. - TL exp   │   │ + Create new        │    │
│  └─────────────────────────────┘   └──────────────────────┘    │
│                                                                 │
│  TEAM                              ANALYTICS                    │
│  ┌─────────────────────────────┐   ┌──────────────────────┐    │
│  │ 3 recruiters • 1 viewer    │   │ 23 views this week  │    │
│  │ + Invite member            │   │ View full report →  │    │
│  └─────────────────────────────┘   └──────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 Matching Engine 8D

| Dimension | Weight | Logic | V6 Change |
|-----------|--------|-------|-----------|
| Role Fit | 18% | Level match | Reduced from 20% |
| Division Fit | 18% | Division overlap | Reduced from 20% |
| Store Context | 13% | Tier match | Reduced from 15% |
| Capability Fit | 13% | Assessment scores | Reduced from 15% |
| Geography | 10% | Location × mobility | Unchanged |
| Experience Block | 10% | Block types | Unchanged |
| Preference | 8% | Timeline | Reduced from 10% |
| **Brand Assessment** | **10%** | **Brand-specific score** | **NEW** |

**Logic for Brand Assessment dimension:**
- If brand has no active assessment → weight redistributed
- If talent hasn't completed → score = 50% (neutral)
- If completed → actual % score
- If failed (< passing) → score capped at 40

### 5.4 Assessment Engine V6

**Two assessment types:**

1. **Global Assessment (Tailor Shift)**
   - 4 dimensions: Service, Clienteling, Operations, Leadership
   - 10-12 questions
   - Results in talent profile

2. **Brand Assessment (Custom)**
   - Created by brand
   - Any number of questions
   - Results visible to that brand only
   - Can be mandatory for opportunities

### 5.5 Messaging System

**Rules:**
- Messaging unlocks after "mutual interest"
- Brand initiates first (to prevent spam)
- Talent can respond once brand messages
- Templates available for brands
- File sharing limited (PDF, images)

### 5.6 Analytics & Insights

**For Brands:**
- Views per opportunity
- Match → Interest → Mutual conversion
- Time to first contact
- Talent source breakdown
- Assessment completion rates

**For Talents (Privacy-Safe):**
- Profile views (count only, not who)
- Match rate vs. average
- Salary benchmark (if contributed)

---

## PART 6: QUALITY

### 6.1 E2E Test Scenarios V6

#### Talent Path

```
1. Signup → Onboarding → Dashboard
2. Take global assessment
3. Enable network visibility
4. Send connection request
5. Accept connection
6. Express interest in opportunity
7. Complete brand assessment
8. Receive mutual interest
9. Chat with brand
10. Update pipeline status
```

#### Brand Path

```
1. Signup → Onboarding → Dashboard
2. Invite team member
3. Accept team invite
4. Create custom assessment
5. Create opportunity with assessment
6. View matched talents
7. Save to pipeline
8. Express interest
9. Chat with talent
10. Update pipeline stage
11. View analytics
```

### 6.2 Performance Criteria V6

| Metric | Target | Notes |
|--------|--------|-------|
| TTFB | < 200ms | All pages |
| LCP | < 2.5s | Dashboard |
| Realtime latency | < 500ms | Messages |
| Notification delivery | < 3s | In-app |

---

## PART 7: MÉTHODOLOGIE PROJET (AI-Ready)

### 7.1 Structure des Dossiers

```
tailor_shift_v6/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public routes (login, signup, etc.)
│   ├── (talent)/talent/          # Talent protected routes
│   ├── (brand)/brand/            # Brand protected routes
│   ├── actions/                  # Server Actions
│   ├── api/                      # API routes (webhooks, integrations)
│   └── auth/                     # Auth callbacks
│
├── components/                   # React components
│   ├── ui/                       # Design system primitives
│   ├── auth/                     # Auth-related components
│   ├── talent/                   # Talent-specific components
│   ├── brand/                    # Brand-specific components
│   ├── messaging/                # [V6] Chat components
│   ├── network/                  # [V6] Community components
│   ├── matching/                 # Matching display components
│   └── onboarding/               # Onboarding components
│
├── data/                         # Static data & constants
│   ├── mcs/                      # Master Classification System
│   ├── assessment/               # Assessment questions
│   ├── learning/                 # Learning modules
│   └── templates/                # Opportunity templates
│
├── docs/                         # Documentation
│   ├── TAILOR_SHIFT_V6_MASTER.md # This file (source of truth)
│   ├── stories/                  # User stories
│   └── *.md                      # Other docs
│
├── lib/                          # Shared utilities
│   ├── engines/                  # Business logic engines
│   ├── hooks/                    # React hooks
│   ├── supabase/                 # Supabase client config
│   └── utils/                    # Utility functions
│
├── public/                       # Static assets
│   └── brand/                    # Brand images
│
├── supabase/                     # Database
│   └── migrations/               # SQL migrations
│
└── Configuration files
    ├── middleware.ts             # Auth middleware
    ├── tailwind.config.ts        # Design tokens
    └── package.json              # Dependencies
```

### 7.2 Système de Stories

#### Template de Story

```markdown
# STORY-XXX: [Title]

## Status: TODO | IN_PROGRESS | DONE

## Dependencies
- STORY-YYY (must be done first)

## User Story
As a [user type], I want to [action], so that [benefit].

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Technical Notes
- Tables involved: X, Y
- New migrations: Yes/No
- RLS changes: Yes/No
- New components: List

## Files to Create/Modify
- `app/[route]/page.tsx`
- `components/[component].tsx`
- `app/actions/[action].ts`
- `supabase/migrations/00XX_[name].sql`

## Testing Checklist
- [ ] Happy path works
- [ ] Error cases handled
- [ ] RLS tested
- [ ] Mobile responsive
```

#### Story Numérotation V6

```
V6 Stories (starting from STORY-021):
├── STORY-021: Brand custom assessments
├── STORY-022: Brand white-label customization
├── STORY-023: Talent networking (same maison)
├── STORY-024: Talent networking (same group)
├── STORY-025: Messaging system
├── STORY-026: Notifications center
├── STORY-027: Talent pipeline
├── STORY-028: Team collaboration
├── STORY-029: Analytics dashboard
├── STORY-030: Skills endorsements
├── STORY-031: Salary benchmark
├── STORY-032: Matching engine 8D
└── STORY-033: Mobile PWA
```

### 7.3 Workflow de Développement

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT WORKFLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STEP 1: SPEC → STORY                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. Read relevant section in this Master doc             │   │
│  │ 2. Create story file in docs/stories/                   │   │
│  │ 3. List acceptance criteria                             │   │
│  │ 4. Identify dependencies                                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                         ↓                                       │
│  STEP 2: STORY → DATA MODEL                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. Identify tables needed (new or modified)             │   │
│  │ 2. Define columns, types, constraints                   │   │
│  │ 3. Map relationships (FK)                               │   │
│  │ 4. Plan indexes                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                         ↓                                       │
│  STEP 3: DATA MODEL → MIGRATION SQL                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. Create migration file: 00XX_[feature].sql            │   │
│  │ 2. Write CREATE/ALTER statements                        │   │
│  │ 3. APPLY MIGRATION IN SUPABASE BEFORE CODING            │   │
│  │ 4. Update database.types.ts                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                         ↓                                       │
│  STEP 4: MIGRATION → RLS POLICIES                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. Enable RLS on new tables                             │   │
│  │ 2. Write policies using SECURITY DEFINER helpers        │   │
│  │ 3. Check RLS Matrix for circular dependencies           │   │
│  │ 4. TEST RLS before proceeding                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                         ↓                                       │
│  STEP 5: RLS → SERVER ACTIONS                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. Create action file in app/actions/                   │   │
│  │ 2. Use 'use server' directive                           │   │
│  │ 3. Get Supabase client from server                      │   │
│  │ 4. Handle errors consistently                           │   │
│  │ 5. Return typed responses                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                         ↓                                       │
│  STEP 6: ACTIONS → UI COMPONENTS                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. Use Design System components (ui/)                   │   │
│  │ 2. Server Components by default                         │   │
│  │ 3. Client Components only when needed ('use client')    │   │
│  │ 4. Handle loading/error states                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                         ↓                                       │
│  STEP 7: UI → TESTS MANUELS                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. Test happy path end-to-end                           │   │
│  │ 2. Test error cases                                     │   │
│  │ 3. Test as different user types                         │   │
│  │ 4. Test on mobile viewport                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                         ↓                                       │
│  STEP 8: TESTS → COMMIT & PUSH                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. Write descriptive commit message                     │   │
│  │ 2. Reference story number in commit                     │   │
│  │ 3. Update story status to DONE                          │   │
│  │ 4. Push to branch                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.4 Commandes Essentielles

```bash
# =====================================================
# DÉVELOPPEMENT LOCAL
# =====================================================

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build de production
npm run build

# =====================================================
# SUPABASE / DATABASE
# =====================================================

# Voir les migrations locales
ls supabase/migrations/

# Appliquer les migrations (dans Supabase Dashboard SQL Editor)
# 1. Ouvrir https://supabase.com/dashboard
# 2. SQL Editor → New Query
# 3. Copier/coller le contenu de la migration
# 4. Run

# Générer les types TypeScript après changement de schema
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/database.types.ts

# =====================================================
# GIT WORKFLOW
# =====================================================

# Voir le statut
git status

# Ajouter les fichiers
git add .

# Commit avec message descriptif
git commit -m "feat(story-021): add brand custom assessments

- Create brand_assessments table
- Add RLS policies
- Implement CRUD actions
- Build AssessmentBuilder component"

# Push
git push origin main

# =====================================================
# DÉPLOIEMENT
# =====================================================

# Vercel déploie automatiquement sur push vers main
# Pour preview: push vers une branche feature/*
```

### 7.5 Documents de Référence

```
┌─────────────────────────────────────────────────────────────────┐
│                 HIÉRARCHIE DES DOCUMENTS                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  NIVEAU 1: SOURCE DE VÉRITÉ                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ docs/TAILOR_SHIFT_V6_MASTER.md                          │   │
│  │ → Spec complète, features, data models                  │   │
│  │ → À LIRE EN PREMIER                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                         ↓                                       │
│  NIVEAU 2: DOCUMENTS TECHNIQUES                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ docs/DESIGN_SYSTEM_V2.md  → UI tokens, composants       │   │
│  │ lib/supabase/database.types.ts → Types générés          │   │
│  │ supabase/migrations/*.sql → Schema définitif            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                         ↓                                       │
│  NIVEAU 3: STORIES & IMPLÉMENTATION                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ docs/stories/STORY-XXX.md → Détails par feature         │   │
│  │ app/actions/*.ts → Server Actions                       │   │
│  │ components/**/*.tsx → Composants React                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

QUAND METTRE À JOUR QUOI:
- Master V6 → Changement de spec ou nouvelle feature majeure
- Stories → Pendant le développement d'une feature
- database.types.ts → Après chaque migration
- DESIGN_SYSTEM → Nouveau composant ou token
```

### 7.6 Checklist Agent IA

#### Avant de Commencer une Tâche

```markdown
□ Lire docs/TAILOR_SHIFT_V6_MASTER.md (ce document)
□ Identifier la story correspondante ou en créer une
□ Lister les tables/routes/actions impactées
□ Vérifier les dépendances (autres stories)
□ Estimer la complexité (S/M/L)
```

#### Pendant le Développement

```markdown
□ Créer migration SQL AVANT le code
□ Appliquer migration dans Supabase AVANT de coder
□ Tester RLS policy AVANT de coder l'UI
□ Utiliser les composants du Design System (ui/)
□ Suivre les patterns existants (copier/adapter)
□ Gérer les états de chargement et d'erreur
□ Ne pas inventer de nouveaux patterns sans raison
```

#### Avant de Commit

```markdown
□ Tous les fichiers sauvegardés
□ Pas d'erreurs TypeScript (npm run build)
□ Tester le flow complet manuellement
□ Message de commit descriptif avec numéro de story
□ Story mise à jour (status, notes)
```

#### Après Chaque Feature

```markdown
□ database.types.ts régénéré si schema changé
□ Documentation mise à jour si comportement changé
□ Middleware mis à jour si nouvelles routes protégées
□ README mis à jour si nouvelle commande/config
```

### 7.7 Patterns & Anti-Patterns

#### ✅ Patterns à Suivre

**Server Actions:**
```typescript
// ✅ BON: Structure standard
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function myAction(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  
  const { data, error } = await supabase
    .from('table')
    .insert({ ... })
  
  if (error) {
    return { success: false, error: error.message }
  }
  
  return { success: true, data }
}
```

**Composants:**
```typescript
// ✅ BON: Server Component par défaut
import { Card } from '@/components/ui'

export default async function MyPage() {
  const data = await fetchData()
  return <Card>{data.title}</Card>
}

// ✅ BON: Client Component seulement si nécessaire
'use client'
import { useState } from 'react'

export function InteractiveComponent() {
  const [state, setState] = useState()
  return <button onClick={() => setState(...)}>Click</button>
}
```

**RLS Policies:**
```sql
-- ✅ BON: Utiliser SECURITY DEFINER helper
CREATE POLICY "Users can view own data"
  ON my_table FOR SELECT
  USING (user_id = get_user_id_for_auth(auth.uid()));

-- ✅ BON: auth.uid() direct quand possible
CREATE POLICY "Users own their profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());
```

#### ❌ Anti-Patterns à Éviter

```typescript
// ❌ MAUVAIS: Client-side data fetching
'use client'
export function MyComponent() {
  const [data, setData] = useState()
  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData)
  }, [])
}
// ✅ Utiliser Server Component + fetch direct

// ❌ MAUVAIS: Global state pour tout
const globalStore = create((set) => ({ ... }))
// ✅ Utiliser Server Components, props, ou URL state

// ❌ MAUVAIS: Ignorer les erreurs
const { data } = await supabase.from('x').select()
// ✅ Toujours vérifier error
const { data, error } = await supabase.from('x').select()
if (error) { /* handle */ }
```

```sql
-- ❌ MAUVAIS: Sous-requête sur table avec RLS
CREATE POLICY "Bad" ON talents FOR SELECT
USING (id IN (SELECT talent_id FROM matches WHERE ...));

-- ✅ Utiliser SECURITY DEFINER function
CREATE POLICY "Good" ON talents FOR SELECT
USING (id = ANY(get_matched_talents(auth.uid())));
```

---

## APPENDICES

### APPENDIX A: Migration History V6

| Migration | Description | Status |
|-----------|-------------|--------|
| 0001-0005 | V5 migrations | Applied |
| 0006_brand_assessments.sql | Brand assessments tables | TODO |
| 0007_talent_pipeline.sql | Pipeline table | TODO |
| 0008_brand_team.sql | Team collaboration | TODO |
| 0009_talent_networking.sql | Connections & visibility | TODO |
| 0010_messaging.sql | Conversations & messages | TODO |
| 0011_notifications.sql | Notifications center | TODO |
| 0012_endorsements.sql | Skills endorsements | TODO |
| 0013_analytics.sql | Salary benchmark | TODO |

### APPENDIX B: Environment Variables V6

```env
# Supabase (unchanged)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_NAME=Tailor Shift

# [V6] Realtime
SUPABASE_REALTIME_KEY=

# [V6] Email (for notifications)
RESEND_API_KEY=

# [V6] Push Notifications (optional)
WEB_PUSH_VAPID_PUBLIC=
WEB_PUSH_VAPID_PRIVATE=
```

### APPENDIX C: Release Plan V6

| Version | Target | Features | Status |
|---------|--------|----------|--------|
| V6.0 | Q3 2025 | Assessments, Networking, Messaging | Planning |
| V6.1 | Q4 2025 | Pipeline, Team, Analytics | Planning |
| V6.2 | Q1 2026 | Endorsements, Benchmark, i18n | Planning |
| V6.3 | Q2 2026 | Mobile PWA, API, Enterprise | Planning |

### APPENDIX D: RLS Prevention Guide

*(Inherited from V5 Master V2 — see Appendix D)*

### APPENDIX E: Pre-Development Checklist

*(Inherited from V5 Master V2 — see Appendix E)*

---

## CHANGELOG

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 6.0-draft | Dec 2025 | AI | Initial V6 specification |

---

*End of V6 Master Specification*
*Base: V5.2 Consolidated + V6 Feature Set*
*Target: Q3 2025*
