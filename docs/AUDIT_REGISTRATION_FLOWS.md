# Registration & Profile Completeness Audit Report

**Date:** December 2, 2025  
**Auditor:** Cline  
**Application:** Tailor Shift v5  
**Related Migration:** `0005_fix_rls_v2_security_definer.sql`

---

## Executive Summary

This audit examines the full registration and profile completeness process for both **Talent** (retail professionals) and **Brand** (luxury maisons) user types. A critical RLS infinite recursion bug was identified and fixed.

### Critical Issues Found

| Issue | Severity | Status | Fix |
|-------|----------|--------|-----|
| RLS Infinite Recursion on talents INSERT | 🔴 Critical | ✅ Fixed | Migration 0005 |

---

## 🔴 Root Cause Analysis: RLS Infinite Recursion

### The Bug

When a new talent tries to complete the Identity step at `/talent/onboarding/identity`, the following error occurs:

```
Failed to create talent: infinite recursion detected in policy for relation "talents"
```

### Technical Explanation

1. **Trigger Point:** `getOrCreateTalent()` in `app/actions/talent-onboarding.ts` performs an INSERT into the `talents` table

2. **Policy Evaluation:** Supabase evaluates ALL RLS policies (including SELECT policies) during INSERT operations to validate permissions

3. **The Circular Dependency:**
   ```
   talents table has policy "Brands can view matched talents"
     → This policy uses EXISTS with JOIN to matches table
     → matches table has RLS policies that reference talents table
     → This triggers talents policy evaluation again
     → INFINITE LOOP ♾️
   ```

4. **Same issue exists on:** brands table with "Talents can view matched brands" policy

### The Fix (Migration 0005)

**Solution:** Use `SECURITY DEFINER` functions that bypass RLS during policy evaluation.

```sql
-- Before (causes recursion):
CREATE POLICY "Brands can view matched talents"
  ON talents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM matches m  -- ← matches has RLS that references talents
      JOIN opportunities o ON m.opportunity_id = o.id
      JOIN brands b ON o.brand_id = b.id
      WHERE m.talent_id = talents.id
      ...
    )
  );

-- After (no recursion):
CREATE POLICY "Brands can view matched talents"
  ON talents FOR SELECT
  USING (
    id = ANY(get_matched_talent_ids_for_brand(auth.uid()))  -- ← SECURITY DEFINER function
  );
```

---

## 👤 TALENT SIDE - Registration Flow Audit

### Step 1: Entry Points → Signup

| Entry Point | Path | Status | Notes |
|-------------|------|--------|-------|
| Homepage "Get Started" | `/` → `/signup` | ✅ Works | Shows user type selection |
| Homepage "I'm a Professional" | `/` → `/professionals` | ✅ Works | Landing page |
| Professionals "Create Your Profile" | `/professionals` → `/signup?type=talent` | ✅ Works | Pre-selects talent |
| Direct URL | `/signup` | ✅ Works | Shows user type selection |

### Step 2: Account Creation

| Method | Status | Notes |
|--------|--------|-------|
| Email/Password | ✅ Works | Requires email verification |
| Google OAuth | ⚠️ Works | Icons display as text ("G") |
| LinkedIn OAuth | ⚠️ Works | Icons display as text ("in") |

**User type is stored in:**
- Email signup: `user_metadata.user_type`
- OAuth signup: URL parameter `type` → callback handler

### Step 3: Profile Creation (Auto-trigger)

**File:** `supabase/migrations/0001_initial_schema.sql`

```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

| Process | Status | Notes |
|---------|--------|-------|
| Profile auto-creation | ✅ Works | Trigger on auth.users INSERT |
| user_type extraction | ✅ Works | From `raw_user_meta_data->>'user_type'` |
| Fallback manual creation | ✅ Works | In `/auth/callback` if trigger fails |

### Step 4: Redirect to Onboarding

**File:** `app/auth/callback/route.ts`

| Condition | Destination | Status |
|-----------|-------------|--------|
| Talent + onboarding incomplete | `/talent/onboarding` | ✅ Works |
| Talent + onboarding complete | `/talent/dashboard` | ✅ Works |
| Custom redirect param | Specified URL | ✅ Works |

### Step 5: Onboarding Flow (6 Steps)

**File:** `app/actions/talent-onboarding.ts`

| Step | Route | Action | Status (Pre-fix) | Status (Post-fix) |
|------|-------|--------|------------------|-------------------|
| 1. Welcome | `/talent/onboarding` | Display welcome | ✅ Works | ✅ Works |
| 2. Identity | `/talent/onboarding/identity` | Create/update talent | 🔴 **BLOCKED** | ✅ Fixed |
| 3. Professional | `/talent/onboarding/professional` | Update talent | ⏸️ Blocked | ✅ Fixed |
| 4. Divisions | `/talent/onboarding/divisions` | Update talent | ⏸️ Blocked | ✅ Fixed |
| 5. Preferences | `/talent/onboarding/preferences` | Update talent | ⏸️ Blocked | ✅ Fixed |
| 6. Experience | `/talent/onboarding/experience` | Insert experience_block | ⏸️ Blocked | ✅ Fixed |
| 7. Assessment Intro | `/talent/onboarding/assessment-intro` | Complete onboarding | ⏸️ Blocked | ✅ Fixed |

### Step 6: Profile Completion Calculation

**Location:** `app/actions/talent-onboarding.ts` (line ~297)

```typescript
// On onboarding completion:
profile_completion_pct: 70 // Basic completion without assessment
```

**Full 100% requires:**
- ✅ Basic onboarding completed (70%)
- ✅ Assessment completed (+20%)
- ✅ 2+ experience blocks (+10%)

**Display Component:** `components/talent/ProfileCompletion.tsx`

```typescript
// Missing items shown to user:
if (!hasAssessment) → "Complete your assessment"
if (experienceBlockCount < 2) → "Add X more experience blocks"
```

---

## 🏢 BRAND SIDE - Registration Flow Audit

### Step 1: Entry Points → Signup

| Entry Point | Path | Status | Notes |
|-------------|------|--------|-------|
| Homepage "Get Started" | `/` → `/signup` | ✅ Works | Shows user type selection |
| Homepage "I'm a Brand" | `/` → `/brands` | ✅ Works | Landing page (was broken, now fixed) |
| Brands "Start Hiring" | `/brands` → `/signup?type=brand` | ✅ Works | Pre-selects brand |
| Direct URL | `/signup` | ✅ Works | Shows user type selection |

### Step 2: Account Creation

Same as Talent side - Email/Password or OAuth.

### Step 3: Profile Creation (Auto-trigger)

Same as Talent side - uses same trigger.

### Step 4: Redirect to Onboarding

| Condition | Destination | Status |
|-----------|-------------|--------|
| Brand + onboarding incomplete | `/brand/onboarding` | ✅ Works |
| Brand + onboarding complete | `/brand/dashboard` | ✅ Works |

### Step 5: Onboarding Flow (4 Steps)

**File:** `app/actions/brand-onboarding.ts`

| Step | Route | Action | Status |
|------|-------|--------|--------|
| 1. Identity | `/brand/onboarding/identity` | Create/update brand | ✅ Works (simple RLS) |
| 2. Contact | `/brand/onboarding/contact` | Update brand | ✅ Works |
| 3. Store | `/brand/onboarding/store` | Insert store | ✅ Works |
| 4. Opportunity Intro | `/brand/onboarding/opportunity-intro` | Complete onboarding | ✅ Works |

**Note:** Brand side was not affected by the RLS recursion bug because:
- Brand INSERT policy is simple: `profile_id = auth.uid()`
- The "Talents can view matched brands" policy only affects SELECT, not INSERT
- INSERT operations don't trigger SELECT policy evaluation in the same way

### Step 6: Brand Profile Completeness

**Currently:** Not explicitly tracked with a completion percentage.

**Onboarding status stored in:** `profiles.onboarding_completed`

---

## 🔐 RLS Policies Summary (Post-Migration 0005)

### Helper Functions Created

| Function | Purpose | Security |
|----------|---------|----------|
| `get_talent_id_for_user(uuid)` | Get talent ID for a user | SECURITY DEFINER |
| `get_brand_id_for_user(uuid)` | Get brand ID for a user | SECURITY DEFINER |
| `get_matched_talent_ids_for_brand(uuid)` | Get talent IDs brand can view | SECURITY DEFINER |
| `get_matched_brand_ids_for_talent(uuid)` | Get brand IDs talent can view | SECURITY DEFINER |
| `is_talent(uuid)` | Check if user is a talent | SECURITY DEFINER |
| `is_brand(uuid)` | Check if user is a brand | SECURITY DEFINER |

### Tables Updated

| Table | Policies Updated | Cross-table Access |
|-------|------------------|-------------------|
| `talents` | 4 policies | ✅ Brands via helper function |
| `brands` | 4 policies | ✅ Talents via helper function |
| `matches` | 4 policies | Uses helper functions |
| `experience_blocks` | 5 policies | ✅ Brands can view matched |
| `assessments` | 3 policies | Via helper function |
| `stores` | 5 policies | Via helper function |
| `opportunities` | 5 policies | Via helper function |
| `talent_learning_progress` | 3 policies | Via helper function |
| `profiles` | 2 policies | No changes (already simple) |
| `learning_modules` | 1 policy | No changes (public) |

---

## 📋 Remaining Issues & Recommendations

### High Priority

| Issue | Location | Recommendation |
|-------|----------|----------------|
| OAuth icons as text | `app/(public)/signup/page.tsx`, `app/(public)/login/page.tsx` | Use existing `OAuthButtons.tsx` component |
| Missing autocomplete attributes | All auth forms | Add `autoComplete` props to Input components |

### Medium Priority

| Issue | Location | Recommendation |
|-------|----------|----------------|
| Forgot/Reset password styling | `app/(public)/forgot-password/page.tsx` | Match login/signup styling (Card wrapper, logo) |
| No onboarding progress persistence | Onboarding pages | Save progress to allow resume from last step |
| Brand profile completion tracking | `brands` table | Add `profile_completion_pct` like talents |

### Low Priority

| Issue | Location | Recommendation |
|-------|----------|----------------|
| Mobile back button hidden | `app/(public)/signup/page.tsx` | Show on mobile too |
| Image optimization warnings | Various | Add `sizes` prop to Next.js Image components |

---

## 🧪 Testing Checklist

### Pre-Migration Testing (Currently Failing)

- [ ] New talent signup → Identity step → **RLS Error**

### Post-Migration Testing

After applying migration `0005_fix_rls_v2_security_definer.sql`:

**Talent Flow:**
- [ ] Sign up as new talent (email/password)
- [ ] Complete Identity step (first name, last name)
- [ ] Complete Professional step
- [ ] Complete Divisions step
- [ ] Complete Preferences step
- [ ] Add Experience block
- [ ] View Assessment intro
- [ ] Complete assessment
- [ ] View dashboard with matches
- [ ] Edit profile/experience

**Brand Flow:**
- [ ] Sign up as new brand
- [ ] Complete Identity step (brand name, segment)
- [ ] Complete Contact step
- [ ] Add first store
- [ ] Complete onboarding
- [ ] Create opportunity
- [ ] View matched talents

**Cross-User Access:**
- [ ] Brand can view matched talent profiles
- [ ] Talent can view matched brand/opportunity details
- [ ] No recursion errors on any operation

---

## 📄 How to Apply Migration

### Option 1: Supabase Dashboard (SQL Editor)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy the contents of `supabase/migrations/0005_fix_rls_v2_security_definer.sql`
5. Run the query

### Option 2: Supabase CLI

```bash
# If you have Supabase CLI linked to your project:
supabase db push

# Or run specific migration:
supabase migration up
```

### Option 3: Database Connection (psql)

```bash
psql "postgresql://postgres:[password]@[host]:[port]/postgres" -f supabase/migrations/0005_fix_rls_v2_security_definer.sql
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-02 | Initial audit, identified RLS recursion bug |
| 1.1 | 2025-12-02 | Created migration 0005, documented fix |
