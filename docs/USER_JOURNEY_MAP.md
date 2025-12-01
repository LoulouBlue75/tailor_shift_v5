# User Journey Map - Tailor Shift

**Last Updated:** December 1, 2025  
**Version:** 1.0

---

## 📊 Application Architecture

### Route Structure
```
/ (Homepage)
├── /professionals (Landing page - Talents) ✅ Public
├── /brands (Landing page - Brands) ✅ Public
├── /login ✅ Public
├── /signup ✅ Public
├── /forgot-password ✅ Public
├── /auth/callback ✅ Public (OAuth callback)
├── /auth/reset-password ✅ Public
├── /terms ✅ Public
├── /privacy ✅ Public
│
├── /talent/* (Protected - requires user_type=talent)
│   ├── /talent/onboarding/* (6-step onboarding)
│   ├── /talent/dashboard
│   ├── /talent/profile/*
│   ├── /talent/opportunities/*
│   ├── /talent/assessment/*
│   ├── /talent/learning/*
│   ├── /talent/projection
│   └── /talent/settings
│
└── /brand/* (Protected - requires user_type=brand)
    ├── /brand/onboarding/*
    ├── /brand/dashboard
    ├── /brand/stores/*
    ├── /brand/opportunities/*
    └── /brand/settings
```

---

## 👤 TALENT JOURNEY (Retail Professionals)

### Entry Points

| Entry Point | Path | Description |
|-------------|------|-------------|
| Homepage Hero | / → /professionals | "I'm a Professional" button |
| Navigation | / → /professionals | "For Professionals" link |
| Direct Navigation | / → /signup | "Get Started" button |
| Direct URL | /professionals | Landing page |

### Registration Flow

```mermaid
graph TD
    A[Homepage] -->|"I'm a Professional"| B[/professionals]
    A -->|"Get Started"| C[/signup]
    B -->|"Create Your Profile"| D[/signup?type=talent]
    C -->|Select "Professional"| D
    
    D -->|Email/Password| E[Email Confirmation]
    D -->|Google OAuth| F[/auth/callback]
    D -->|LinkedIn OAuth| F
    
    E -->|Click Email Link| F
    F --> G{Profile Exists?}
    G -->|No| H[Create Profile]
    G -->|Yes| I{Onboarding Complete?}
    H --> I
    I -->|No| J[/talent/onboarding]
    I -->|Yes| K[/talent/dashboard]
```

### Onboarding Flow (6 Steps)

| Step | Route | Purpose | Fields |
|------|-------|---------|--------|
| 1 | /talent/onboarding/identity | Personal Information | Full name, Phone, Location |
| 2 | /talent/onboarding/professional | Current Role | Job title, Current employer, Level |
| 3 | /talent/onboarding/experience | Work History | Experience blocks, Years of experience |
| 4 | /talent/onboarding/divisions | Luxury Expertise | Division preferences (Fashion, Jewelry, etc.) |
| 5 | /talent/onboarding/preferences | Job Preferences | Salary, Location, Availability |
| 6 | /talent/onboarding/assessment-intro | Assessment Introduction | Explanation of Retail Excellence Scan |

### Post-Onboarding Flow

```
/talent/onboarding/assessment-intro
    └─→ /talent/assessment/start (Begin assessment)
        └─→ /talent/assessment (Questions)
            └─→ /talent/assessment/results (Scores)
                └─→ /talent/dashboard (Main hub)
```

### Dashboard Access Points

| Feature | Route | Description |
|---------|-------|-------------|
| Dashboard | /talent/dashboard | Main overview, matches, stats |
| Profile | /talent/profile | View/edit profile |
| Add Experience | /talent/profile/experience/new | Add work experience |
| Edit Experience | /talent/profile/experience/[id]/edit | Edit existing experience |
| Opportunities | /talent/opportunities | Browse matched opportunities |
| Opportunity Detail | /talent/opportunities/[id] | View specific opportunity |
| Learning | /talent/learning | Training modules |
| Learning Module | /talent/learning/[id] | Individual module |
| Career Projection | /talent/projection | Career path visualization |
| Settings | /talent/settings | Account settings |

---

## 🏢 BRAND JOURNEY (Luxury Maisons)

### Entry Points

| Entry Point | Path | Description |
|-------------|------|-------------|
| Homepage Hero | / → /brands | "I'm a Brand" button |
| Navigation | / → /brands | "For Brands" link |
| Direct Navigation | / → /signup | "Get Started" button |
| Direct URL | /brands | Landing page |

### Registration Flow

```mermaid
graph TD
    A[Homepage] -->|"I'm a Brand"| B[/brands]
    A -->|"Get Started"| C[/signup]
    B -->|"Start Hiring"| D[/signup?type=brand]
    C -->|Select "Brand"| D
    
    D -->|Email/Password| E[Email Confirmation]
    D -->|Google OAuth| F[/auth/callback]
    D -->|LinkedIn OAuth| F
    
    E -->|Click Email Link| F
    F --> G{Profile Exists?}
    G -->|No| H[Create Profile]
    G -->|Yes| I{Onboarding Complete?}
    H --> I
    I -->|No| J[/brand/onboarding]
    I -->|Yes| K[/brand/dashboard]
```

### Dashboard Access Points

| Feature | Route | Description |
|---------|-------|-------------|
| Dashboard | /brand/dashboard | Main overview, matches |
| Stores | /brand/stores | Manage store locations |
| Opportunities | /brand/opportunities | Post and manage job listings |
| Settings | /brand/settings | Account settings |

---

## 🔐 AUTHENTICATION FLOWS

### Sign In Flow

```
/login
├── Email/Password
│   ├── Success → Check profile.user_type
│   │   ├── talent → /talent/dashboard or /talent/onboarding
│   │   └── brand → /brand/dashboard or /brand/onboarding
│   └── Error → Show error message
│
├── Google OAuth → /auth/callback → Profile check → Dashboard/Onboarding
└── LinkedIn OAuth → /auth/callback → Profile check → Dashboard/Onboarding
```

### Password Reset Flow

```
/login → "Forgot password?"
    └── /forgot-password
        └── Enter email → Submit
            └── Success message
                └── Email received
                    └── /auth/reset-password?code=xxx
                        └── Enter new password
                            └── Success → Auto-redirect to /login
```

### OAuth Callback Logic

**Route:** `/auth/callback`

```javascript
1. Extract code, type, redirect from URL params
2. Exchange code for session
3. Wait 500ms for trigger-based profile creation
4. Check if profile exists
   - No → Create profile with user_type from URL param
   - Yes → Continue
5. If type param exists → Update profile.user_type
6. Determine redirect:
   - Custom redirect param? → Use it
   - Brand + onboarding incomplete → /brand/onboarding
   - Brand + onboarding complete → /brand/dashboard
   - Talent + onboarding incomplete → /talent/onboarding
   - Talent + onboarding complete → /talent/dashboard
```

---

## 🛡️ ROUTE PROTECTION (Middleware)

### Public Routes (No Auth Required)
- `/` - Homepage
- `/login` - Sign in
- `/signup` - Registration
- `/forgot-password` - Password reset request
- `/auth/callback` - OAuth callback
- `/auth/reset-password` - Password reset form
- `/terms` - Terms of service
- `/privacy` - Privacy policy
- `/brands` - Brand landing page
- `/professionals` - Professional landing page

### Protected Routes (Auth Required)
- `/talent/*` - Requires authenticated user with `user_type = 'talent'`
- `/brand/*` - Requires authenticated user with `user_type = 'brand'`

### Cross-Type Protection
- Talent user accessing `/brand/*` → Redirected to `/talent/dashboard`
- Brand user accessing `/talent/*` → Redirected to `/brand/dashboard`

### Unauthenticated Access
- Accessing protected route without auth → `/login?redirect={original_path}`
- After login → Redirect to original intended destination

---

## ⚠️ KNOWN ISSUES & CONSIDERATIONS

### Resolved Issues (v1.0)
- ✅ `/brands` was incorrectly matched by `/brand` route protection
- ✅ `/professionals` and `/brands` added to public routes

### Remaining Considerations
1. **Email Resend** - No mechanism to resend confirmation email
2. **OAuth Loading State** - OAuth buttons don't show loading spinners
3. **Forgot/Reset Page Styling** - Different visual style from login/signup
4. **Mobile Back Button** - Hidden on mobile in signup flow

---

## 📱 RESPONSIVE CONSIDERATIONS

### Mobile Navigation
- Hamburger menu for navigation (not implemented - only hides links)
- Back button hidden on mobile signup form (`hidden sm:flex`)

### Desktop Navigation
- Full navigation links visible
- Hero section with two-column layout on lg+

---

## 🎨 UX DESIGN PRINCIPLES (Quiet Luxury)

### Applied Across Flows
- Minimalist forms with ample whitespace
- Gold accent colors for CTAs and highlights
- Card-based layouts with subtle shadows
- Serif typography for headings
- Sans-serif for body text
- Loading states with spinners
- Error states with colored borders and backgrounds

### Consistency Requirements
- All auth pages should use logo monogram
- All forms should use Card wrapper
- All CTAs should use Button component
- All error messages should use same styling

---

## 📈 ANALYTICS TOUCHPOINTS (Recommended)

| Event | Location | Purpose |
|-------|----------|---------|
| `page_view` | All pages | Track navigation |
| `signup_started` | /signup | Conversion funnel |
| `signup_type_selected` | /signup | Talent vs Brand split |
| `signup_completed` | Email confirmed | Registration success |
| `onboarding_step_completed` | Each step | Onboarding progress |
| `onboarding_completed` | Final step | Onboarding success |
| `assessment_started` | /talent/assessment/start | Assessment engagement |
| `assessment_completed` | /talent/assessment/results | Assessment completion |
| `opportunity_viewed` | /*/opportunities/[id] | Engagement tracking |
| `match_interest_expressed` | Dashboard | Match conversion |

---

## 🔄 VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-01 | Initial documentation, middleware fix for /brands |
