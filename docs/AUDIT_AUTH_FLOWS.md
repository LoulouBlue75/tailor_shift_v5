# Authentication Flows Audit Report

**Date:** December 1, 2025  
**Auditor:** Cline  
**Application:** Tailor Shift v5  

---

## Executive Summary

This audit evaluates the registration ("Get Started") and sign-in flows in the Tailor Shift application, examining both user experience and underlying implementation logic. The audit identified **1 critical bug**, **3 high-priority issues**, and **7 UX improvement opportunities**.

---

## 1. Critical Issues

### 1.1 CRITICAL: `/brands` Page Incorrectly Protected (BUG)

**Severity:** Critical  
**Type:** Broken Functionality  
**Location:** `middleware.ts`

**Issue:**  
The `/brands` public landing page is incorrectly being treated as a protected route, redirecting users to the login page instead of displaying the marketing content.

**Root Cause:**  
In the middleware, the protected route check uses:
```javascript
if (path.startsWith("/talent") || path.startsWith("/brand")) {
```

This matches `/brands` because it starts with `/brand`. The public routes list does not include `/brands` or `/professionals`:
```javascript
const publicRoutes = ["/", "/login", "/signup", "/forgot-password", "/auth/callback", "/auth/reset-password", "/terms", "/privacy"];
```

**Impact:**  
- Users cannot access the "For Brands" landing page
- Links to `/brands` from homepage redirect to login
- Potential customers are blocked from learning about brand features

**Recommended Fix:**
```javascript
// Option 1: Add to public routes
const publicRoutes = ["/", "/login", "/signup", "/forgot-password", "/auth/callback", "/auth/reset-password", "/terms", "/privacy", "/brands", "/professionals"];

// Option 2: More specific path matching for protected routes
if (path.startsWith("/talent/") || path.startsWith("/brand/")) {
```

---

## 2. High-Priority Issues

### 2.1 OAuth Button Icons Displaying as Text

**Severity:** High  
**Type:** UX/Visual Bug  
**Location:** `app/(public)/signup/page.tsx`, `app/(public)/login/page.tsx`

**Issue:**  
The OAuth buttons display "G Google" and "in LinkedIn" where "G" and "in" are meant to be recognizable icons but appear as plain text letters.

**Current Implementation:**
```jsx
<Button variant="secondary" onClick={() => handleOAuthSignup("google")}>
  <span className="mr-2">G</span> Google
</Button>
<Button variant="secondary" onClick={() => handleOAuthSignup("linkedin_oidc")}>
  <span className="mr-2">in</span> LinkedIn
</Button>
```

**Impact:**  
- Looks unprofessional and inconsistent with luxury brand aesthetic
- Differs from industry-standard OAuth button designs
- May confuse users

**Recommended Fix:**  
Use proper SVG icons (similar to those in `OAuthButtons.tsx` component which has proper SVG icons but is not being used on these pages).

---

### 2.2 Duplicate OAuth Implementation

**Severity:** High  
**Type:** Code Quality/Redundancy  
**Locations:**  
- `components/auth/OAuthButtons.tsx` (standalone component with proper icons)
- `app/(public)/signup/page.tsx` (inline implementation with text icons)
- `app/(public)/login/page.tsx` (inline implementation with text icons)

**Issue:**  
There are two different implementations of OAuth buttons:
1. A well-designed `OAuthButtons.tsx` component with proper SVG icons, loading states, and consistent styling
2. Inline implementations in signup and login pages with text-based "icons"

**Impact:**  
- Code duplication
- Inconsistent UX
- Maintenance burden

**Recommended Fix:**  
Use the existing `OAuthButtons` component in signup and login pages.

---

### 2.3 Missing Autocomplete Attributes

**Severity:** High  
**Type:** Accessibility/Security  
**Location:** All form inputs in auth pages

**Issue:**  
Browser console shows warnings:
```
[DOM] Input elements should have autocomplete attributes (suggested: "current-password")
```

**Impact:**  
- Password managers may not work correctly
- Poor accessibility
- Inconsistent autofill behavior

**Recommended Fix:**  
Add appropriate autocomplete attributes to Input components:
- Email fields: `autoComplete="email"`
- Password fields: `autoComplete="current-password"` (login) or `autoComplete="new-password"` (signup)
- Name fields: `autoComplete="name"`

---

## 3. UX Issues

### 3.1 Inconsistent Visual Design on Forgot Password Page

**Severity:** Medium  
**Type:** UX Inconsistency  
**Location:** `app/(public)/forgot-password/page.tsx`

**Issue:**  
The forgot password page uses text-based "Tailor Shift" heading instead of the logo monogram used on login and signup pages.

**Current:** Text header with `<H2>Tailor Shift</H2>`  
**Expected:** Logo monogram image consistent with other auth pages

**Impact:**  
- Visual inconsistency breaks premium feel
- Doesn't match Quiet Luxury design principles

---

### 3.2 Color Token Inconsistencies

**Severity:** Medium  
**Type:** UX/Design System  
**Location:** `app/(public)/forgot-password/page.tsx`, `app/auth/reset-password/page.tsx`

**Issue:**  
These pages use different color tokens than the rest of the auth flow:
- Uses `text-soft-grey` instead of `text-grey-warm`
- Uses `text-matte-gold` instead of `text-gold-dark`

**Impact:**  
- Subtle but noticeable color inconsistencies
- Breaks design system coherence

---

### 3.3 Missing Card Wrapper on Forgot Password Page

**Severity:** Medium  
**Type:** UX Inconsistency  
**Location:** `app/(public)/forgot-password/page.tsx`, `app/auth/reset-password/page.tsx`

**Issue:**  
Login and signup pages wrap the form in a `<Card>` component with `shadow-elevated` styling. The forgot password and reset password pages do not use this pattern.

**Impact:**  
- Visual inconsistency across auth flow
- Less premium feel on these pages

---

### 3.4 Back Button Visibility Issue

**Severity:** Low  
**Type:** UX  
**Location:** `app/(public)/signup/page.tsx`

**Issue:**  
The "← Back" button on the signup form uses `hidden sm:flex` which hides it on mobile devices where navigation back to user type selection would be valuable.

**Impact:**  
- Mobile users cannot easily navigate back to change their user type selection
- Must use browser back button

---

### 3.5 Error Message Styling Inconsistency

**Severity:** Low  
**Type:** UX/Design  
**Location:** Various auth pages

**Issue:**  
Error messages have slightly different styling across pages:
- Signup/Login: `rounded bg-error/10 p-4 text-sm text-error border border-error/20`
- Forgot/Reset: `rounded border border-error/20 bg-error/5 p-4 text-sm text-error`

Note the `bg-error/10` vs `bg-error/5` difference.

---

### 3.6 Missing Loading States for OAuth Redirects

**Severity:** Low  
**Type:** UX  
**Location:** `app/(public)/signup/page.tsx`, `app/(public)/login/page.tsx`

**Issue:**  
When clicking OAuth buttons, the page initiates a redirect but there's no visual feedback that the action was received. The inline OAuth implementation sets loading state but doesn't show a loading indicator on the OAuth buttons themselves (unlike the `OAuthButtons` component which has proper spinners).

---

### 3.7 Image Optimization Warnings

**Severity:** Low  
**Type:** Performance  
**Location:** Various pages

**Issue:**  
Console shows multiple Next.js Image optimization warnings:
- Missing `sizes` prop on images with `fill`
- Missing `width: "auto"` or `height: "auto"` styles for aspect ratio

---

## 4. Logic Review Findings

### 4.1 Server Action Not Used (Redundant Code)

**Location:** `app/actions/auth.ts`

The file contains `signupAction` and `loginAction` server actions, but the actual signup and login pages use client-side Supabase calls directly. These server actions are unused, leading to:
- Code duplication (validation logic duplicated)
- Maintenance burden
- Confusion about which approach is canonical

**Recommendation:** Either:
1. Use server actions consistently for all auth operations
2. Remove unused server actions

---

### 4.2 Profile Creation Race Condition Handling

**Location:** `app/auth/callback/route.ts`

The callback includes a 500ms delay to wait for trigger-based profile creation:
```javascript
await new Promise(resolve => setTimeout(resolve, 500));
```

This is fragile and may not be sufficient under load. The fallback manual profile creation is good, but the arbitrary delay adds unnecessary latency.

---

### 4.3 Inconsistent User Type Handling

**Issue:** The signup page allows selecting user type, but:
- The server action `signupAction` expects `userType` in form data
- The client-side implementation passes it via `options.data.user_type`
- OAuth signup passes it via URL parameter

This creates multiple code paths that could diverge.

---

## 5. Link Verification Summary

| Link/Button | Source | Destination | Status |
|-------------|--------|-------------|--------|
| "Get Started" (nav) | Home | /signup | ✅ Working |
| "Sign In" (nav) | Home | /login | ✅ Working |
| "I'm a Professional" (hero) | Home | /professionals | ✅ Working |
| "I'm a Brand" (hero) | Home | /brands | ❌ Redirects to login |
| "For Professionals" (nav) | Home | /professionals | ✅ Working |
| "For Brands" (nav) | Home | /brands | ❌ Redirects to login |
| "Terms" (footer) | Home | /terms | ✅ Working |
| "Privacy" (footer) | Home | /privacy | ✅ Working |
| "Get Started" | Professionals | /signup?type=talent | ✅ Working |
| "Get Started" | Brands | N/A | ❌ Page inaccessible |
| "Sign in" | Signup | /login | ✅ Working |
| "Sign up" | Login | /signup | ✅ Working |
| "Forgot password?" | Login | /forgot-password | ✅ Working |
| "Back to login" | Forgot Password | /login | ✅ Working |
| Logo (nav) | All pages | / | ✅ Working |

---

## 6. Recommendations Priority Matrix

| Priority | Issue | Effort | Impact |
|----------|-------|--------|--------|
| P0 | Fix /brands middleware bug | Low | Critical |
| P1 | Use OAuthButtons component | Medium | High |
| P1 | Add autocomplete attributes | Low | High |
| P2 | Standardize forgot/reset pages | Medium | Medium |
| P2 | Remove unused server actions | Low | Medium |
| P3 | Fix mobile back button | Low | Low |
| P3 | Standardize error styling | Low | Low |
| P3 | Fix image optimizations | Low | Low |

---

## 7. User Testing Documentation

### 7.1 Registration Flow ("Get Started") - Step-by-Step

#### Entry Point 1: Homepage Navigation
| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Click "Get Started" in nav bar | Navigate to /signup | Navigates to /signup, shows user type selection | ✅ Pass |
| 2 | View page content | See "Choose your journey" with two cards | Both cards visible with icons and descriptions | ✅ Pass |

#### Entry Point 2: "I'm a Professional" Hero Button
| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Click "I'm a Professional" on homepage | Navigate to /professionals | Navigates correctly | ✅ Pass |
| 2 | Click "Get Started" or "Create Your Profile" | Navigate to /signup?type=talent | Navigates correctly, skips type selection | ✅ Pass |

#### Entry Point 3: "I'm a Brand" Hero Button
| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Click "I'm a Brand" on homepage | Navigate to /brands | Redirects to /login?redirect=/brands | ❌ FAIL |
| 2 | Attempt to view brands landing | See marketing content | Login page shown instead | ❌ FAIL |

#### User Type Selection (when no type pre-selected)
| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | View selection cards | Two clear options visible | Cards show "I'm a Professional" and "I'm a Brand" | ✅ Pass |
| 2 | Hover over Professional card | Visual feedback | Shadow effect, hover states | ✅ Pass |
| 3 | Click Professional card | Proceed to form | Shows form with "Join as a Professional" | ✅ Pass |
| 4 | Click Brand card | Proceed to form | Shows form with "Join as a Brand" | ✅ Pass |

#### Registration Form - Email/Password
| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | View form | 3 required fields visible | Full Name, Email, Password fields with * | ✅ Pass |
| 2 | Submit empty form | Validation errors | Browser native validation prevents submit | ✅ Pass |
| 3 | Enter invalid email | Email validation error | Browser validates email format | ✅ Pass |
| 4 | Enter short password | Password hint visible | Helper text "Must be at least 8 characters" shown | ✅ Pass |
| 5 | Submit valid form | Loading state, then success | Button shows spinner, success screen appears | ✅ Pass |
| 6 | View success state | Confirmation message | "Check Your Email" with email address displayed | ✅ Pass |
| 7 | Click "Back to login" | Navigate to login | Navigates correctly | ✅ Pass |

#### Registration Form - OAuth
| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | View OAuth section | Divider and buttons | "or continue with" divider, G Google, in LinkedIn | ⚠️ Partial (icons display as text) |
| 2 | Click Google button | Redirect to Google OAuth | Initiates OAuth flow | ✅ Pass (requires Supabase config) |
| 3 | Click LinkedIn button | Redirect to LinkedIn OAuth | Initiates OAuth flow | ✅ Pass (requires Supabase config) |

#### Registration - Error States
| Scenario | Trigger | Expected Behavior | Actual Behavior | Status |
|----------|---------|-------------------|-----------------|--------|
| Duplicate email | Submit with existing email | Error message displayed | "User already registered" error shown in red box | ✅ Pass |
| Weak password | < 8 characters | Validation error | Supabase returns error if bypasses client validation | ✅ Pass |
| Network error | Disconnect network | Error message | Generic error message shown | ✅ Pass |

---

### 7.2 Sign-In Flow - Step-by-Step

#### Entry Point
| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Click "Sign In" in nav bar | Navigate to /login | Navigates correctly | ✅ Pass |
| 2 | View page | Login form visible | Form with Email, Password, Forgot password link | ✅ Pass |

#### Sign-In Form - Email/Password
| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | View form | 2 required fields | Email and Password fields with asterisks | ✅ Pass |
| 2 | Submit empty form | Validation | Browser native validation | ✅ Pass |
| 3 | Enter invalid credentials | Error message | "Invalid login credentials" error shown | ✅ Pass |
| 4 | Enter valid credentials | Loading, then redirect | Button shows spinner, redirects to dashboard | ✅ Pass |
| 5 | Redirect logic (Talent) | To talent dashboard | Redirects to /talent/dashboard or /talent/onboarding | ✅ Pass |
| 6 | Redirect logic (Brand) | To brand dashboard | Redirects to /brand/dashboard or /brand/onboarding | ✅ Pass |

#### Sign-In Form - OAuth
| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | View OAuth section | Buttons visible | "G Google" and "in LinkedIn" buttons | ⚠️ Partial (icons as text) |
| 2 | Click Google button | OAuth flow starts | Redirect to Google | ✅ Pass |
| 3 | Click LinkedIn button | OAuth flow starts | Redirect to LinkedIn | ✅ Pass |

#### Sign-In - Error States
| Scenario | Trigger | Expected Behavior | Actual Behavior | Status |
|----------|---------|-------------------|-----------------|--------|
| Wrong password | Valid email, wrong password | Error message | "Invalid login credentials" | ✅ Pass |
| Non-existent email | Email not in system | Error message | "Invalid login credentials" | ✅ Pass |
| Empty password | Submit with empty password | Validation | Browser prevents submission | ✅ Pass |

---

### 7.3 Forgot Password Flow - Step-by-Step

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Click "Forgot password?" on login | Navigate to /forgot-password | Navigates correctly | ✅ Pass |
| 2 | View page | Email input form | Single email field with instructions | ✅ Pass |
| 3 | Submit empty form | Validation | Browser prevents submission | ✅ Pass |
| 4 | Submit invalid email | Email validation | Browser validates format | ✅ Pass |
| 5 | Submit valid email | Loading, then success | "Check Your Email" confirmation | ✅ Pass |
| 6 | View success state | Non-revealing message | "If an account exists..." message (security best practice) | ✅ Pass |
| 7 | Click "Back to login" | Navigate to login | Navigates correctly | ✅ Pass |

---

### 7.4 Reset Password Flow - Step-by-Step

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Click reset link in email | Navigate to /auth/reset-password | Opens reset form | ✅ Pass |
| 2 | View form | Password and confirm fields | Two password fields visible | ✅ Pass |
| 3 | Enter mismatched passwords | Validation error | "Passwords do not match" error | ✅ Pass |
| 4 | Enter short password | Validation error | "Password must be at least 8 characters" | ✅ Pass |
| 5 | Submit valid password | Loading, then success | Success message, auto-redirect to login | ✅ Pass |
| 6 | View success state | Confirmation | "Password Updated" with redirect countdown | ✅ Pass |

---

### 7.5 OAuth Callback Flow - Step-by-Step

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Return from OAuth provider | Hit /auth/callback | Code exchanged for session | ✅ Pass |
| 2 | New user (signup) | Create profile | Profile created with user_type from URL param | ✅ Pass |
| 3 | Existing user (login) | Retrieve profile | Profile fetched, user_type determined | ✅ Pass |
| 4 | Redirect (talent, onboarding incomplete) | To /talent/onboarding | Redirects correctly | ✅ Pass |
| 5 | Redirect (talent, onboarding complete) | To /talent/dashboard | Redirects correctly | ✅ Pass |
| 6 | Redirect (brand, onboarding incomplete) | To /brand/onboarding | Redirects correctly | ✅ Pass |
| 7 | Redirect (brand, onboarding complete) | To /brand/dashboard | Redirects correctly | ✅ Pass |
| 8 | Custom redirect param | To specified URL | Respects redirect query param | ✅ Pass |

---

### 7.6 Protected Route Behavior

| Route | User State | Expected | Actual | Status |
|-------|------------|----------|--------|--------|
| /talent/dashboard | Not logged in | Redirect to login | Redirects to /login?redirect=/talent/dashboard | ✅ Pass |
| /brand/dashboard | Not logged in | Redirect to login | Redirects to /login?redirect=/brand/dashboard | ✅ Pass |
| /talent/dashboard | Logged in as brand | Redirect to brand dashboard | Redirects to /brand/dashboard | ✅ Pass |
| /brand/dashboard | Logged in as talent | Redirect to talent dashboard | Redirects to /talent/dashboard | ✅ Pass |
| /talent/dashboard | Logged in as talent | Access granted | Page loads | ✅ Pass |
| /brand/dashboard | Logged in as brand | Access granted | Page loads | ✅ Pass |

---

## 8. Validation Logic Analysis

### 8.1 Client-Side Validation

| Field | Page | Validation | Implementation |
|-------|------|------------|----------------|
| Full Name | Signup | Required | HTML `required` attribute |
| Email | Signup/Login | Required, email format | HTML `required` + `type="email"` |
| Password | Signup | Required, min 8 chars hint | HTML `required` + helper text (no enforcement) |
| Password | Login | Required | HTML `required` attribute |

**Gap Identified:** Password minimum length is shown as helper text but not enforced client-side. User can submit shorter passwords which Supabase then rejects.

### 8.2 Server-Side Validation

**In `app/actions/auth.ts` (unused server actions):**
```javascript
const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  userType: z.enum(["talent", "brand"]),
});
```

**In actual pages (client-side):**
- No Zod validation
- Relies on HTML5 validation + Supabase errors

**Recommendation:** Either use server actions with proper validation, or add client-side Zod validation before Supabase calls.

### 8.3 Error Message Mapping

| Supabase Error | Current Display | Suggested Improvement |
|----------------|-----------------|----------------------|
| "User already registered" | Raw message | "An account with this email already exists. Try signing in instead." |
| "Invalid login credentials" | Raw message | "The email or password you entered is incorrect." |
| Other errors | Raw message | Consider friendlier wording |

---

## 9. State Management Analysis

### 9.1 Form State
- Uses React `useState` for all form fields
- Loading state managed with `loading` state variable
- Error state managed with `error` state variable
- Success state managed with `success` boolean

### 9.2 Session State
- Managed by Supabase client
- Persisted in cookies via middleware
- Refreshed on each request via `updateSession`

### 9.3 User Profile State
- Fetched from `profiles` table after login
- Used to determine redirect destination
- `user_type` determines dashboard access

---

## 10. Design System Compliance

### 10.1 Quiet Luxury Principles Assessment

| Principle | Login/Signup | Forgot/Reset | Score |
|-----------|--------------|--------------|-------|
| Minimalism | ✅ Clean forms, ample whitespace | ✅ Simple layout | 9/10 |
| Premium feel | ✅ Card shadow, refined typography | ⚠️ Missing card wrapper | 7/10 |
| Consistency | ✅ Same structure | ❌ Different header style | 6/10 |
| Attention to detail | ⚠️ Text icons on OAuth | ⚠️ Color token differences | 6/10 |
| Loading states | ✅ Button spinners | ✅ Button spinners | 9/10 |
| Error handling | ✅ Styled error boxes | ✅ Styled error boxes | 8/10 |

### 10.2 Component Usage

| Component | Login | Signup | Forgot | Reset |
|-----------|-------|--------|--------|-------|
| Card wrapper | ✅ | ✅ | ❌ | ❌ |
| Logo monogram | ✅ | ✅ | ❌ | ❌ |
| H2 typography | ✅ | ✅ | ✅ | ✅ |
| Input component | ✅ | ✅ | ✅ | ✅ |
| Button component | ✅ | ✅ | ✅ | ✅ |
| Stack layout | ❌ | ❌ | ✅ | ✅ |

---

## 11. What Works Well

1. **User type selection flow** - Intuitive cards with clear descriptions and icons
2. **Form validation feedback** - Helper text on password field, required field indicators
3. **Loading states** - Button spinners prevent double-submission
4. **OAuth type propagation** - User type correctly passed through callback
5. **Password reset flow** - Complete with security best practices (non-revealing messages)
6. **Protected route redirects** - Login preserves intended destination via query param
7. **Error display** - Styled error boxes with clear messaging
8. **Success states** - Clear confirmation with next steps

---

## 12. Areas Needing Attention

1. **Critical: /brands page inaccessible** - Middleware bug blocks public landing page
2. **OAuth icons** - Display as plain text instead of recognizable logos
3. **Visual consistency** - Forgot/reset pages differ from login/signup
4. **Validation gaps** - Password length not enforced client-side
5. **Code duplication** - OAuth implementation duplicated, server actions unused
6. **Mobile UX** - Back button hidden on mobile signup
7. **Accessibility** - Missing autocomplete attributes

---

## Appendix: Files Reviewed

- `app/(public)/signup/page.tsx`
- `app/(public)/login/page.tsx`
- `app/(public)/forgot-password/page.tsx`
- `app/(public)/professionals/page.tsx`
- `app/(public)/brands/page.tsx`
- `app/auth/callback/route.ts`
- `app/auth/reset-password/page.tsx`
- `app/actions/auth.ts`
- `components/auth/OAuthButtons.tsx`
- `components/ui/Input.tsx`
- `components/ui/Button.tsx`
- `middleware.ts`
- `app/page.tsx`
