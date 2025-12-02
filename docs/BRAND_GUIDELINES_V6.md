# Tailor Shift V6 — Brand Guidelines

> **Version:** 1.0  
> **Date:** December 2025  
> **Status:** Pre-Development  
> **Language:** English (Default)

---

## 1. BRAND IDENTITY

### 1.1 Brand Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                      IRBIS PARTNERS                             │
│               Executive Search Boutique — Paris                 │
│           "From Paris with adaptive precision"                  │
│                    www.irbis.fr                                 │
│             SIRET: 831 642 608 00010                           │
│                                                                 │
│                          ↓                                      │
│                                                                 │
│                    ┌─────────────┐                              │
│                    │TAILOR SHIFT │                              │
│                    │             │                              │
│                    │ Luxury      │                              │
│                    │ Retail      │                              │
│                    │ Talent      │                              │
│                    │ Platform    │                              │
│                    └─────────────┘                              │
│                                                                 │
│              "An Irbis Partners company"                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Brand Essence

| Attribute | Description |
|-----------|-------------|
| **Mission** | Connect luxury retail professionals with premium maisons through intelligent matching |
| **Positioning** | The refined platform for luxury talent mobility |
| **Personality** | Elegant, discreet, precise, confident |
| **Promise** | Quality over quantity — curated connections |

### 1.3 Tagline Options (V6)

Primary:
> **"Where luxury meets opportunity."**

Alternatives:
- "Crafting careers in luxury."
- "Precision matching for luxury retail."
- "Your next chapter in luxury."

---

## 2. VISUAL DIRECTION

### 2.1 Design Philosophy

**Inspiration:** Smythson.com, Moynat, The Row

**Principles:**
1. **Space is luxury** — 70%+ white space
2. **Restraint** — Minimal elements, maximum impact
3. **Precision** — Every pixel intentional
4. **Timelessness** — Classic, not trendy

### 2.2 Reference Moodboard

| Element | Reference |
|---------|-----------|
| Layout | Smythson.com — expansive, centered |
| Typography | Moynat — light serif, generous tracking |
| Photography | The Row — minimal, tonal |
| Interactions | Apple — subtle, purposeful |

### 2.3 Do's and Don'ts

| ✅ Do | ❌ Don't |
|-------|---------|
| Embrace white space | Fill every corner |
| Use subtle transitions | Add flashy animations |
| Let content breathe | Crowd information |
| Keep CTAs minimal | Use loud buttons |
| Trust simplicity | Over-design |

---

## 3. COLOR SYSTEM

### 3.1 Primary Palette (Minimal)

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `white` | #FFFFFF | 255, 255, 255 | Primary background |
| `ivory` | #FAF8F4 | 250, 248, 244 | Secondary background |
| `charcoal` | #1A1A1A | 26, 26, 26 | Primary text |

### 3.2 Secondary Palette

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `grey-600` | #666666 | 102, 102, 102 | Secondary text |
| `grey-400` | #999999 | 153, 153, 153 | Placeholder text |
| `grey-200` | #E5E5E5 | 229, 229, 229 | Borders, dividers |

### 3.3 Accent (Use Sparingly)

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `gold` | #B8A068 | 184, 160, 104 | Thread illustration, selected states |
| `gold-dark` | #9A8052 | 154, 128, 82 | Hover on gold |

**Rule:** Gold appears in maximum 5% of any page. It's precious because it's rare.

### 3.4 Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `success` | #4A7C59 | Positive feedback |
| `error` | #A65D57 | Error states |
| `warning` | #C4A962 | Warnings (use gold) |

---

## 4. TYPOGRAPHY

### 4.1 Font Stack

```css
/* Headings */
font-family: 'Cormorant Garamond', Georgia, serif;

/* Body */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

### 4.2 Type Scale

| Element | Font | Weight | Size | Line Height | Tracking |
|---------|------|--------|------|-------------|----------|
| Display | Cormorant | 300 | 72px | 1.1 | 0.02em |
| H1 | Cormorant | 300 | 48px | 1.2 | 0.02em |
| H2 | Cormorant | 400 | 36px | 1.25 | 0.01em |
| H3 | Inter | 500 | 20px | 1.4 | 0 |
| H4 | Inter | 500 | 16px | 1.4 | 0 |
| Body Large | Inter | 400 | 18px | 1.6 | 0.01em |
| Body | Inter | 400 | 15px | 1.6 | 0.01em |
| Small | Inter | 400 | 13px | 1.5 | 0.02em |
| Caption | Inter | 500 | 11px | 1.4 | 0.08em |

### 4.3 Special Treatments

**CTA Text:**
```css
font-family: Inter;
font-size: 12px;
font-weight: 500;
letter-spacing: 0.12em;
text-transform: uppercase;
```

**Navigation:**
```css
font-family: Inter;
font-size: 13px;
font-weight: 400;
letter-spacing: 0.05em;
```

---

## 5. LOGO & ASSETS

### 5.1 Logo Versions

| Version | Usage | File |
|---------|-------|------|
| Full (horizontal) | Headers, large spaces | `logo/tailor-shift-full.svg` |
| Monogram | Favicon, mobile, small | `logo/tailor-shift-monogram.svg` |
| Wordmark | Footer, minimal contexts | `logo/tailor-shift-wordmark.svg` |

### 5.2 Clear Space

Minimum clear space = height of the "T" in Tailor

### 5.3 Logo Don'ts

- ❌ Don't stretch or distort
- ❌ Don't change colors beyond brand palette
- ❌ Don't add effects (shadows, gradients)
- ❌ Don't place on busy backgrounds

### 5.4 Asset Structure

```
public/
├── logo/
│   ├── tailor-shift-full.svg
│   ├── tailor-shift-monogram.svg
│   ├── tailor-shift-wordmark.svg
│   └── irbis-partners.svg
│
├── illustrations/
│   ├── thread-hero.svg          # Landing hero
│   ├── thread-divider.svg       # Section separator
│   ├── thread-accent.svg        # Small decorative
│   └── pattern-subtle.svg       # Optional background
│
├── images/
│   ├── og-image.png             # 1200x630 OpenGraph
│   ├── og-image-brand.png       # For brand pages
│   └── og-image-talent.png      # For talent pages
│
├── icons/
│   ├── favicon.svg
│   ├── apple-touch-icon.png     # 180x180
│   └── icon-192.png             # PWA
│
└── fonts/                        # If self-hosted
    ├── CormorantGaramond-Light.woff2
    ├── CormorantGaramond-Regular.woff2
    └── Inter-Variable.woff2
```

---

## 6. UI COMPONENTS

### 6.1 Buttons

**Primary (Rare use):**
```css
background: #1A1A1A;
color: #FFFFFF;
padding: 14px 32px;
font-size: 12px;
letter-spacing: 0.12em;
text-transform: uppercase;
border: none;
```

**Secondary (Preferred):**
```css
background: transparent;
color: #1A1A1A;
padding: 14px 32px;
font-size: 12px;
letter-spacing: 0.12em;
text-transform: uppercase;
border: 1px solid #E5E5E5;
```

**Text (Most common):**
```css
background: none;
color: #1A1A1A;
padding: 0;
font-size: 12px;
letter-spacing: 0.12em;
text-transform: uppercase;
border-bottom: 1px solid #1A1A1A;
```

### 6.2 Inputs

**Underline style (preferred):**
```css
border: none;
border-bottom: 1px solid #E5E5E5;
padding: 12px 0;
background: transparent;
font-size: 15px;

&:focus {
  border-bottom-color: #1A1A1A;
}
```

### 6.3 Cards

**Minimal card:**
```css
background: #FFFFFF;
border: 1px solid #E5E5E5;
padding: 32px;
/* No shadow, no border-radius */
```

### 6.4 Navigation

**Header (Floating, transparent):**
```css
position: fixed;
background: rgba(255, 255, 255, 0.95);
backdrop-filter: blur(10px);
border-bottom: 1px solid rgba(0, 0, 0, 0.05);
```

---

## 7. TONE OF VOICE

### 7.1 Writing Principles

| Principle | Example |
|-----------|---------|
| **Confident** | "Join the platform" not "Why not try?" |
| **Concise** | One idea per sentence |
| **Elegant** | "Discover" not "Check out" |
| **Direct** | State facts, no fluff |
| **Human** | Warm but professional |

### 7.2 Do's and Don'ts

| ✅ Do | ❌ Don't |
|-------|---------|
| "Explore opportunities" | "Browse our amazing jobs!" |
| "Your profile" | "My awesome profile" |
| "Contact us" | "Reach out to our incredible team!" |
| "Sign in" | "Login to your account now!" |
| "Learn more" | "Click here for more info!!!" |

### 7.3 Key Messages

**For Talents:**
- "Shape your career in luxury retail."
- "Connect with maisons that value your expertise."
- "Confidential. Intelligent. Precise."

**For Brands:**
- "Find talent that elevates your boutiques."
- "Precision matching, not mass applications."
- "The platform built for luxury retail."

### 7.4 Microcopy Examples

| Context | Copy |
|---------|------|
| Empty state | "No matches yet. Complete your profile to get started." |
| Success | "Saved." |
| Error | "Something went wrong. Please try again." |
| Loading | No text, use subtle animation |
| 404 | "This page doesn't exist." |

---

## 8. LEGAL REQUIREMENTS

### 8.1 Footer Content

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  TAILOR SHIFT                                                   │
│  An Irbis Partners company                                      │
│                                                                 │
│  Terms · Privacy                                                │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Irbis Partners · Paris                                         │
│  SIRET 831 642 608 00010                                        │
│  www.irbis.fr                                                   │
│                                                                 │
│  © 2025 Tailor Shift. All rights reserved.                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Legal Pages Required

| Page | Content |
|------|---------|
| `/terms` | Terms of Service (CGU) |
| `/privacy` | Privacy Policy (RGPD compliant) |

### 8.3 Email Footer

```
Tailor Shift — An Irbis Partners company
Paris | www.irbis.fr
This email was sent to {email}. Unsubscribe
```

---

## 9. INTERNATIONALIZATION

### 9.1 Language Strategy

| Phase | Languages | Scope |
|-------|-----------|-------|
| V6.0 | English (default) | Full site |
| V6.2 | + French | Full site |
| Future | + Italian, German | Key pages |

### 9.2 Architecture (i18n-Ready)

```
app/
├── [locale]/                    # Dynamic locale
│   ├── layout.tsx               # Locale-aware layout
│   ├── page.tsx                 # Landing
│   ├── (public)/
│   │   ├── login/
│   │   ├── signup/
│   │   └── ...
│   ├── (talent)/
│   └── (brand)/
│
lib/
├── i18n/
│   ├── config.ts
│   │   export const locales = ['en', 'fr'] as const
│   │   export const defaultLocale = 'en'
│   │
│   ├── dictionaries/
│   │   ├── en.json              # Default
│   │   └── fr.json              # French
│   │
│   └── getDictionary.ts
│
middleware.ts                    # Locale detection & routing
```

### 9.3 Content Keys Structure

```json
{
  "common": {
    "signIn": "Sign in",
    "signUp": "Sign up",
    "learnMore": "Learn more"
  },
  "landing": {
    "hero": {
      "title": "Where luxury meets opportunity",
      "subtitle": "The refined platform for luxury retail careers"
    }
  },
  "auth": {
    "emailLabel": "Email address",
    "passwordLabel": "Password"
  }
}
```

---

## 10. ASSET CHECKLIST

### 10.1 Required Before Development

**Logo:**
- [ ] Full logo (SVG, horizontal)
- [ ] Monogram (SVG)
- [ ] Wordmark (SVG)
- [ ] Irbis Partners logo (SVG)

**Illustrations:**
- [ ] Hero thread illustration
- [ ] Section divider
- [ ] Background pattern (optional)

**Meta:**
- [ ] Favicon (SVG preferred)
- [ ] OG Image (1200x630)
- [ ] Apple Touch Icon (180x180)

**Fonts:**
- [ ] Cormorant Garamond (Light, Regular)
- [ ] Inter (Variable or 400, 500)

### 10.2 Content Required

**Core:**
- [ ] Tagline finalized
- [ ] Landing page copy (EN)
- [ ] Value propositions (3)
- [ ] CTA texts standardized

**Legal:**
- [ ] Terms of Service draft
- [ ] Privacy Policy draft

---

## 11. IMPLEMENTATION NOTES

### 11.1 Tailwind Config V6

```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        ivory: '#FAF8F4',
        charcoal: '#1A1A1A',
        gold: '#B8A068',
        'gold-dark': '#9A8052',
        success: '#4A7C59',
        error: '#A65D57',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        'extra-wide': '0.12em',
      },
    },
  },
}
```

### 11.2 Global CSS Reset

```css
/* Minimal base for luxury feel */
body {
  font-family: var(--font-sans);
  font-size: 15px;
  line-height: 1.6;
  color: #1A1A1A;
  background: #FFFFFF;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3 {
  font-family: var(--font-serif);
  font-weight: 300;
}
```

---

*Brand Guidelines V6 — Pre-Development Foundation*
*Last updated: December 2025*
