# Admin System V6 — Platform Administration & Talent Validation

> **Version:** 1.0  
> **Date:** December 2025  
> **Purpose:** Admin dashboard, talent validation, internal mobility  
> **Applies to:** Platform operators + Brand talent insights

---

## 1. OVERVIEW

### 1.1 Key Features

| Feature | Description |
|---------|-------------|
| **Talent Validation** | Admin approval before platform access |
| **Eligibility Engine** | Auto-score based on experience |
| **Admin Dashboard** | Metrics, approvals, platform health |
| **Internal Mobility** | Talent visible to own brand (opt-in) |
| **Brand Talent Insights** | Count of brand employees on platform |

### 1.2 User Flow Impact

```
BEFORE V6:
  Signup → Onboarding → Dashboard (immediate access)

V6:
  Signup → Onboarding → PENDING_REVIEW → [Admin] → APPROVED → Dashboard
                                              ↓
                                        REJECTED → Feedback
```

---

## 2. TALENT STATE MACHINE V6

### 2.1 States

| State | Description | Can Access |
|-------|-------------|------------|
| `onboarding` | Completing profile steps | Onboarding flow only |
| `pending_review` | Profile complete, awaiting admin | Pending page only |
| `approved` | Admin validated | Full platform |
| `rejected` | Admin rejected | Rejection page + resubmit |
| `suspended` | Temporarily blocked | Nothing |

### 2.2 State Transitions

```
┌─────────────────────────────────────────────────────────────────┐
│                    TALENT STATE MACHINE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│    ┌───────────────┐                                            │
│    │  onboarding   │                                            │
│    └───────┬───────┘                                            │
│            │ complete_onboarding()                              │
│            ▼                                                    │
│    ┌───────────────┐                                            │
│    │pending_review │←─────────────────────┐                     │
│    └───────┬───────┘                      │                     │
│            │                              │                     │
│      ┌─────┴─────┐                        │                     │
│      │           │                        │                     │
│      ▼           ▼                        │                     │
│ ┌─────────┐ ┌─────────┐                   │                     │
│ │approved │ │rejected │                   │                     │
│ └────┬────┘ └────┬────┘                   │                     │
│      │           │                        │                     │
│      │           └──── resubmit() ────────┘                     │
│      │                                                          │
│      ▼                                                          │
│ ┌─────────────┐                                                 │
│ │  suspended  │ ← admin_suspend()                               │
│ └─────────────┘                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Auto-Approve Conditions

A talent is automatically approved if:

```typescript
function shouldAutoApprove(talent: Talent): boolean {
  const experiences = talent.experience_blocks;
  
  // 1. Has experience at recognized luxury maison
  const hasLuxuryMaison = experiences.some(exp => 
    RECOGNIZED_MAISONS.includes(exp.maison_name)
  );
  
  // 2. Has 2+ years in luxury retail
  const luxuryYears = experiences
    .filter(exp => exp.industry === 'luxury_retail')
    .reduce((sum, exp) => sum + exp.duration_months, 0) / 12;
  
  return hasLuxuryMaison || luxuryYears >= 2;
}
```

---

## 3. ELIGIBILITY SCORING

### 3.1 Score Components

| Component | Weight | Description |
|-----------|--------|-------------|
| **Maison Recognition** | 40% | Is maison in recognized list? |
| **Industry Fit** | 30% | Luxury retail > Hospitality > Other |
| **Role Level** | 15% | Higher levels = more credible |
| **Duration** | 15% | Longer experience = more credible |

### 3.2 Industry Categories

| Category | Code | Auto-Approve | Score Multiplier |
|----------|------|--------------|------------------|
| Luxury Retail (Mono-brand) | `luxury_retail_mono` | ✓ | 1.0 |
| Luxury Retail (Multi-brand) | `luxury_retail_multi` | Maybe | 0.85 |
| Premium Retail | `premium_retail` | Review | 0.7 |
| Department Store (Luxury Floor) | `dept_store_luxury` | Review | 0.75 |
| Hospitality 5★ | `hospitality_5star` | Review | 0.7 |
| Hospitality 4★ | `hospitality_4star` | Review | 0.5 |
| Premium Service | `premium_service` | Review | 0.5 |
| Other Retail | `other_retail` | Review | 0.3 |
| No Relevant Experience | `none` | ✗ Reject | 0 |

### 3.3 Recognized Maisons

Pre-populated list (expandable by admin):

```typescript
const RECOGNIZED_MAISONS = {
  // LVMH
  lvmh: [
    'Louis Vuitton', 'Christian Dior', 'Fendi', 'Givenchy', 'Celine',
    'Loewe', 'Berluti', 'Loro Piana', 'Marc Jacobs', 'Kenzo',
    'TAG Heuer', 'Bulgari', 'Hublot', 'Zenith', 'Chaumet', 'Fred',
    'Tiffany & Co.', 'Sephora', 'DFS', 'Le Bon Marché'
  ],
  // Kering
  kering: [
    'Gucci', 'Saint Laurent', 'Bottega Veneta', 'Balenciaga',
    'Alexander McQueen', 'Brioni', 'Boucheron', 'Pomellato',
    'Qeelin', 'Kering Eyewear'
  ],
  // Richemont
  richemont: [
    'Cartier', 'Van Cleef & Arpels', 'Piaget', 'Vacheron Constantin',
    'Jaeger-LeCoultre', 'IWC', 'Panerai', 'Montblanc', 'Chloé',
    'Azzedine Alaïa', 'dunhill', 'Peter Millar'
  ],
  // Hermès
  hermes: ['Hermès'],
  // Chanel
  chanel: ['Chanel'],
  // Prada Group
  prada: ['Prada', 'Miu Miu', "Church's"],
  // Others
  independent: [
    'Burberry', 'Salvatore Ferragamo', 'Ermenegildo Zegna',
    'Brunello Cucinelli', 'Valentino', 'Versace', 'Armani',
    'Dolce & Gabbana', 'Rolex', 'Patek Philippe', 'Audemars Piguet',
    'Richard Mille', 'A. Lange & Söhne', 'Breguet', 'Blancpain',
    'Omega', 'Tissot', 'Longines', 'Chopard', 'Harry Winston',
    'Graff', 'De Beers', 'Swarovski'
  ]
};
```

### 3.4 Eligibility Score Calculation

```typescript
interface EligibilityResult {
  score: number; // 0-100
  decision: 'auto_approve' | 'requires_review' | 'auto_reject';
  reasons: string[];
  flags: string[];
}

function calculateEligibility(talent: Talent): EligibilityResult {
  const experiences = talent.experience_blocks;
  let score = 0;
  const reasons: string[] = [];
  const flags: string[] = [];
  
  // 1. Maison recognition (40%)
  const recognizedExp = experiences.filter(exp => 
    isRecognizedMaison(exp.maison_name)
  );
  if (recognizedExp.length > 0) {
    score += 40;
    reasons.push(`Recognized maison: ${recognizedExp[0].maison_name}`);
  } else if (experiences.some(exp => exp.industry === 'luxury_retail_mono')) {
    score += 30;
    reasons.push('Luxury retail experience (unrecognized maison)');
  }
  
  // 2. Industry fit (30%)
  const bestIndustry = getBestIndustry(experiences);
  const industryScore = INDUSTRY_MULTIPLIERS[bestIndustry] * 30;
  score += industryScore;
  if (bestIndustry !== 'luxury_retail_mono') {
    flags.push(`Primary industry: ${bestIndustry}`);
  }
  
  // 3. Role level (15%)
  const maxLevel = Math.max(...experiences.map(exp => exp.role_level));
  score += Math.min(15, maxLevel * 2);
  
  // 4. Duration (15%)
  const totalMonths = experiences.reduce((sum, exp) => 
    sum + exp.duration_months, 0
  );
  score += Math.min(15, totalMonths / 12 * 3);
  
  // Decision
  let decision: 'auto_approve' | 'requires_review' | 'auto_reject';
  if (score >= 70 && recognizedExp.length > 0) {
    decision = 'auto_approve';
  } else if (score >= 40) {
    decision = 'requires_review';
  } else {
    decision = 'auto_reject';
  }
  
  return { score: Math.round(score), decision, reasons, flags };
}
```

---

## 4. DATA MODEL

### 4.1 Platform Admins

```sql
-- Admin users
CREATE TABLE platform_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'moderator')),
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id)
);

-- Permissions structure
/*
{
  "can_approve_talents": true,
  "can_reject_talents": true,
  "can_suspend_talents": true,
  "can_manage_brands": true,
  "can_manage_maisons": true,
  "can_view_analytics": true,
  "can_manage_admins": false // Only super_admin
}
*/
```

### 4.2 Recognized Maisons

```sql
CREATE TABLE recognized_maisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  group_name TEXT, -- LVMH, Kering, Richemont, Hermès, Chanel, etc.
  category TEXT, -- fashion, jewelry, watches, beauty, hospitality
  logo_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data
INSERT INTO recognized_maisons (name, group_name, category) VALUES
  ('Louis Vuitton', 'LVMH', 'fashion'),
  ('Christian Dior', 'LVMH', 'fashion'),
  ('Chanel', 'Chanel', 'fashion'),
  ('Hermès', 'Hermès', 'fashion'),
  ('Gucci', 'Kering', 'fashion'),
  ('Cartier', 'Richemont', 'jewelry'),
  ('Tiffany & Co.', 'LVMH', 'jewelry'),
  -- ... more
;
```

### 4.3 Eligible Industries

```sql
CREATE TABLE eligible_industries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- luxury_retail, hospitality, premium_service
  score_multiplier DECIMAL(3,2) NOT NULL, -- 0.00 to 1.00
  requires_review BOOLEAN DEFAULT TRUE,
  auto_reject BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data
INSERT INTO eligible_industries (code, name, category, score_multiplier, requires_review, auto_reject) VALUES
  ('luxury_retail_mono', 'Luxury Retail (Mono-brand)', 'luxury_retail', 1.00, FALSE, FALSE),
  ('luxury_retail_multi', 'Luxury Retail (Multi-brand)', 'luxury_retail', 0.85, TRUE, FALSE),
  ('dept_store_luxury', 'Department Store (Luxury)', 'retail', 0.75, TRUE, FALSE),
  ('premium_retail', 'Premium Retail', 'retail', 0.70, TRUE, FALSE),
  ('hospitality_5star', 'Hospitality 5★', 'hospitality', 0.70, TRUE, FALSE),
  ('hospitality_4star', 'Hospitality 4★', 'hospitality', 0.50, TRUE, FALSE),
  ('premium_service', 'Premium Service', 'service', 0.50, TRUE, FALSE),
  ('other_retail', 'Other Retail', 'retail', 0.30, TRUE, FALSE),
  ('other', 'Other', 'other', 0.10, TRUE, TRUE);
```

### 4.4 Talent Status Enhancement

```sql
-- Add status and validation fields to talents
ALTER TABLE talents 
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'onboarding'
    CHECK (status IN ('onboarding', 'pending_review', 'approved', 'rejected', 'suspended')),
  ADD COLUMN IF NOT EXISTS eligibility_score INTEGER,
  ADD COLUMN IF NOT EXISTS eligibility_decision TEXT,
  ADD COLUMN IF NOT EXISTS eligibility_reasons JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS eligibility_flags JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS review_notes TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS resubmit_count INTEGER DEFAULT 0;
```

### 4.5 Internal Mobility Fields

```sql
-- Add internal mobility fields to talents
ALTER TABLE talents
  ADD COLUMN IF NOT EXISTS current_maison TEXT,
  ADD COLUMN IF NOT EXISTS visible_to_current_brand BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS internal_mobility_interest BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS target_includes_current_brand BOOLEAN DEFAULT FALSE;
```

### 4.6 Validation Audit Log

```sql
CREATE TABLE talent_validation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id UUID NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN (
    'submitted', 'auto_approved', 'auto_rejected', 
    'admin_approved', 'admin_rejected', 'resubmitted', 'suspended'
  )),
  admin_id UUID REFERENCES platform_admins(id),
  notes TEXT,
  eligibility_snapshot JSONB, -- Score at time of action
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. ADMIN ROUTES & ACTIONS

### 5.1 Routes

| Route | Access | Purpose |
|-------|--------|---------|
| `/admin` | Admin+ | Dashboard |
| `/admin/talents` | Admin+ | List all talents |
| `/admin/talents/pending` | Admin+ | Pending validation queue |
| `/admin/talents/[id]` | Admin+ | Talent detail + actions |
| `/admin/brands` | Admin+ | List all brands |
| `/admin/analytics` | Admin+ | Platform metrics |
| `/admin/maisons` | Admin+ | Manage recognized maisons |
| `/admin/industries` | Admin+ | Manage eligible industries |
| `/admin/team` | Super Admin | Manage admin users |
| `/admin/settings` | Super Admin | Platform configuration |

### 5.2 Server Actions

```typescript
// app/actions/admin.ts
'use server'

export async function approveTalent(talentId: string, notes?: string): Promise<ActionResult> {
  const supabase = await createClient()
  const admin = await getAdminUser(supabase)
  
  if (!admin || !admin.permissions.can_approve_talents) {
    return { success: false, error: 'Unauthorized' }
  }
  
  const { error } = await supabase
    .from('talents')
    .update({
      status: 'approved',
      reviewed_at: new Date().toISOString(),
      reviewed_by: admin.profile_id,
      review_notes: notes
    })
    .eq('id', talentId)
  
  if (error) return { success: false, error: error.message }
  
  // Log the action
  await logValidationAction(supabase, talentId, 'admin_approved', admin.id, notes)
  
  // Send approval email
  await sendApprovalEmail(talentId)
  
  return { success: true }
}

export async function rejectTalent(
  talentId: string, 
  reason: string, 
  notes?: string
): Promise<ActionResult> {
  // Similar pattern...
}

export async function suspendTalent(
  talentId: string, 
  reason: string
): Promise<ActionResult> {
  // Similar pattern...
}

export async function getValidationQueue(): Promise<Talent[]> {
  // Get pending talents ordered by submission time
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  // Aggregate metrics
}
```

---

## 6. ADMIN DASHBOARD UI

### 6.1 Main Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  TAILOR SHIFT ADMIN                               [Louis] [↗]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ PENDING  │  │  TOTAL   │  │  TOTAL   │  │  ACTIVE  │        │
│  │ REVIEW   │  │ TALENTS  │  │  BRANDS  │  │ MATCHES  │        │
│  │   23 ⚠️  │  │  1,245   │  │    48    │  │   892    │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                 │
│  VALIDATION QUEUE                          [View All →]        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🟡 Marie D.    │ 68% │ Hospitality    │ 2h ago  │ [→]  │   │
│  │ 🟢 Jean P.     │ 95% │ Chanel 5yrs    │ 4h ago  │ [→]  │   │
│  │ 🟡 Sophie L.   │ 55% │ Dept Store     │ 6h ago  │ [→]  │   │
│  │ 🔴 Pierre M.   │ 25% │ Other retail   │ 8h ago  │ [→]  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  THIS WEEK                                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Signups: 45  │  Approved: 38  │  Rejected: 4  │  Pending: 3│
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  TALENTS BY STATUS            │  TOP MAISONS                   │
│  ┌─────────────────────────┐  │  ┌─────────────────────────┐  │
│  │ ████████████████ 1,102  │  │  │ Chanel         234     │  │
│  │ Approved                │  │  │ Louis Vuitton  189     │  │
│  │ ████ 89 Onboarding      │  │  │ Dior           156     │  │
│  │ ██ 23 Pending           │  │  │ Hermès         134     │  │
│  │ █ 18 Rejected           │  │  │ Gucci          112     │  │
│  │ ░ 13 Suspended          │  │  │ [See all →]            │  │
│  └─────────────────────────┘  │  └─────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Validation Detail View

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back to Queue                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TALENT VALIDATION: Marie Dupont                                │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  ELIGIBILITY SCORE: 68%                                │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━░░░░░░░░░░░░░░░░░░░░░░ │   │
│  │                                                         │   │
│  │  Decision: REQUIRES REVIEW                              │   │
│  │                                                         │   │
│  │  Reasons:                                               │   │
│  │  • Hospitality 5★ experience (not luxury retail)        │   │
│  │  • 3 years total experience                             │   │
│  │                                                         │   │
│  │  Flags:                                                 │   │
│  │  ⚠ No recognized luxury maison                         │   │
│  │  ⚠ Primary industry: hospitality_5star                 │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  EXPERIENCE                                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  1. Four Seasons Paris                                  │   │
│  │     Guest Relations Manager • 3 years                   │   │
│  │     Industry: Hospitality 5★                            │   │
│  │     ✓ VIP clientele  ✓ High-end service                │   │
│  │                                                         │   │
│  │  2. Galeries Lafayette — Chanel Corner                  │   │
│  │     Sales Advisor • 2 years                             │   │
│  │     Industry: Department Store (Luxury)                 │   │
│  │     Note: Multi-brand environment                       │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ASSESSMENT: 82%  •  PROFILE: 95% complete                     │
│                                                                 │
│  ADMIN NOTES:                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │ [Write notes here...]                                   │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐       │
│  │   APPROVE     │  │ REQUEST INFO  │  │    REJECT     │       │
│  │               │  │               │  │               │       │
│  └───────────────┘  └───────────────┘  └───────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. INTERNAL MOBILITY

### 7.1 Concept

**Tailor Shift as Internal Mobility Tool:**
- Talent can target their own maison
- Talent can opt-in to be visible to their current employer
- Brand sees their own employees who want internal moves

### 7.2 Talent Preferences

```
┌─────────────────────────────────────────────────────────────────┐
│  PREFERENCES — Target Brands                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Your current maison: Chanel                                    │
│                                                                 │
│  Target brands:                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ☑ Chanel          ← Include my current brand            │   │
│  │ ☑ Hermès                                                │   │
│  │ ☑ Louis Vuitton                                         │   │
│  │ ☑ Dior                                                  │   │
│  │ ☐ Gucci                                                 │   │
│  │ [+ Add more]                                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ────────────────────────────────────────────────────────────  │
│                                                                 │
│  INTERNAL MOBILITY                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  ☑ I'm interested in internal mobility within Chanel   │   │
│  │                                                         │   │
│  │  ☑ Make my profile visible to Chanel recruiters        │   │
│  │                                                         │   │
│  │  ℹ️ This allows Chanel HR to see you're open to         │   │
│  │    opportunities in other locations or roles.          │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Target locations:                                              │
│  ☑ Paris  ☑ London  ☑ Singapore  ☐ Dubai  ☐ New York          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.3 Brand Dashboard — Talent Insights

```
┌─────────────────────────────────────────────────────────────────┐
│  CHANEL — Talent Insights                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  YOUR EMPLOYEES ON TAILOR SHIFT                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │   INTERNAL   │  │  TARGETING   │  │   TARGETING  │  │   │
│  │  │   MOVERS     │  │   CHANEL     │  │    OTHER     │  │   │
│  │  │     45       │  │     23       │  │     78       │  │   │
│  │  │  (visible)   │  │  (internal)  │  │  (leaving?)  │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  │                                                         │   │
│  │  Note: Only employees who opted-in are visible.        │   │
│  │  "Targeting Other" count is anonymous (no names).      │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  INTERNAL MOBILITY CANDIDATES                [View All →]      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  Marie D. • Chanel Singapore                            │   │
│  │  L4 Department Manager • Fashion                        │   │
│  │  Wants: Paris, London                                   │   │
│  │  [View Profile]                                         │   │
│  │                                                         │   │
│  │  Jean P. • Chanel Dubai                                 │   │
│  │  L5 Assistant Director • W&J                            │   │
│  │  Wants: Geneva, Milan                                   │   │
│  │  [View Profile]                                         │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  EXTERNAL CANDIDATES TARGETING CHANEL          [View All →]    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  234 talents have Chanel in their target brands        │   │
│  │  [Browse Matched Talents →]                             │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.4 RLS for Internal Mobility

```sql
-- Brand can only see talents from their maison if talent opted-in
CREATE OR REPLACE FUNCTION talent_visible_to_brand(
  p_talent_id UUID,
  p_brand_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_talent_maison TEXT;
  v_brand_name TEXT;
  v_visible_to_brand BOOLEAN;
BEGIN
  -- Get talent's current maison and visibility setting
  SELECT current_maison, visible_to_current_brand
  INTO v_talent_maison, v_visible_to_brand
  FROM talents WHERE id = p_talent_id;
  
  -- Get brand name
  SELECT name INTO v_brand_name FROM brands WHERE id = p_brand_id;
  
  -- If talent works for this brand, check opt-in
  IF v_talent_maison = v_brand_name THEN
    RETURN v_visible_to_brand;
  END IF;
  
  -- Otherwise visible (external candidate)
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 8. MIDDLEWARE UPDATES

### 8.1 Admin Route Protection

```typescript
// middleware.ts
const ADMIN_ROUTES = ['/admin', '/admin/(.*)']

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Admin routes
  if (ADMIN_ROUTES.some(route => new RegExp(route).test(pathname))) {
    const supabase = createMiddlewareClient(...)
    const { data: admin } = await supabase
      .from('platform_admins')
      .select('role')
      .eq('profile_id', user.id)
      .single()
    
    if (!admin) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  // Talent pending check
  if (pathname.startsWith('/talent') && pathname !== '/talent/pending') {
    const { data: talent } = await supabase
      .from('talents')
      .select('status')
      .eq('profile_id', user.id)
      .single()
    
    if (talent?.status === 'pending_review') {
      return NextResponse.redirect(new URL('/talent/pending', request.url))
    }
    if (talent?.status === 'rejected') {
      return NextResponse.redirect(new URL('/talent/rejected', request.url))
    }
  }
}
```

---

## 9. EMAIL TEMPLATES

### 9.1 Application Received

```
Subject: Welcome to Tailor Shift — Application Received

Dear [Name],

Thank you for completing your profile on Tailor Shift.

Your application is now under review. We carefully verify all 
profiles to maintain the quality of our luxury retail community.

You can expect a response within 24-48 hours.

In the meantime, you can:
• Review your profile at [link]
• Learn more about how matching works

Best regards,
The Tailor Shift Team
```

### 9.2 Application Approved

```
Subject: 🎉 Welcome to Tailor Shift — You're Approved!

Dear [Name],

Great news! Your profile has been approved.

You now have full access to Tailor Shift:
• View matched opportunities
• Connect with brands
• Explore career paths

[Access Your Dashboard →]

Welcome to the community!

The Tailor Shift Team
```

### 9.3 Application Rejected

```
Subject: Tailor Shift — Application Update

Dear [Name],

Thank you for your interest in Tailor Shift.

After reviewing your profile, we were unable to approve your 
application at this time. Tailor Shift is focused on professionals 
with direct experience in luxury retail or closely related fields.

Reason: [reason]

If you believe this was an error or have additional experience 
to add, you can update your profile and resubmit:

[Update My Profile →]

Best regards,
The Tailor Shift Team
```

---

## 10. SETUP CHECKLIST

### 10.1 Database Migrations

```
0014_admin_system.sql
├── platform_admins table
├── recognized_maisons table
├── eligible_industries table
├── talent status fields
├── internal mobility fields
├── validation_log table
└── RLS policies
```

### 10.2 Seed Data

- [ ] Recognized maisons (50+ brands)
- [ ] Industry categories
- [ ] Initial admin user (you!)

### 10.3 Routes

- [ ] `/admin/*` routes
- [ ] `/talent/pending` page
- [ ] `/talent/rejected` page

### 10.4 Actions

- [ ] `approveTalent`
- [ ] `rejectTalent`
- [ ] `suspendTalent`
- [ ] `getDashboardMetrics`
- [ ] `getValidationQueue`

---

*Admin System V6 — Platform Administration & Talent Validation*
*Last updated: December 2025*
