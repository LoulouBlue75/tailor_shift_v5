# Tailor Shift — Design System V2 (Quiet Luxury)

> **Philosophy**: Quiet Luxury. Minimalist, spacious, refined.
> **Core Principle**: "One focal point per section."

---

## 1. Foundations

### Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Ivory** | `#F5F0E6` | Main background (Body) |
| **Ivory Warm** | `#EDE8DC` | Secondary background |
| **Ivory Light** | `#FAF8F4` | Cards / Panels |
| **Gold Matte** | `#C4A962` | Primary Brand Color (Buttons, Accents) |
| **Gold Copper** | `#B8956E` | Hover States |
| **Gold Dark** | `#9A7B4F` | Text on light backgrounds |
| **Charcoal** | `#2C2C2C` | Primary Text |
| **Charcoal Soft** | `#4A4A4A` | Secondary Text |
| **Stone** | `#D1CCC4` | Borders / Separators |

### Typography

| Family | Usage | Weights |
|--------|-------|---------|
| **Cormorant Garamond** | Headings (H1, H2) | 300 (Light), 400 (Regular) |
| **Inter** | Body, Subtitles, H3, Labels | 400 (Regular), 500 (Medium) |

**Scale:**
- H1: `2.5rem` (40px) / Leading 1.2 / Weight 300
- H2: `2.0rem` (32px) / Leading 1.3 / Weight 400
- H3: `1.25rem` (20px) / Leading 1.4 / Weight 500
- Body: `1rem` (16px) / Leading 1.6 / Weight 400
- Caption: `0.875rem` (14px) / Leading 1.5 / Weight 400
- Label: `0.75rem` (12px) / Uppercase / Tracking 0.05em

### Spacing & Layout

**Grid:** 12-column grid for standard layouts.

**Spacing Scale:**
- `p-comfortable` (`24px`) — Standard padding
- `p-spacious` (`32px`) — Section padding (Internal)
- `py-expansive` (`64px`+) — Section vertical spacing (External)

**Container:** `max-w-7xl`, centered.

### Shadows (Replacing Borders)

Borders are removed in favor of subtle shadows to create depth without noise.

- `shadow-subtle`: Buttons, Inputs
- `shadow-card`: Cards (Default)
- `shadow-elevated`: Modals, Dropdowns, Hover states

---

## 2. Components

### Buttons

**Primary (`variant="primary"`)**
- Background: Gold Matte (`#C4A962`)
- Text: Charcoal (`#2C2C2C`)
- Border: None
- Shadow: `shadow-subtle`
- Hover: `bg-gold-copper`

**Secondary (`variant="secondary"`)**
- Background: Transparent
- Border: 1px solid Stone (`#D1CCC4`)
- Text: Charcoal
- Hover: Border Gold (`#C4A962`), Text Charcoal

**Ghost (`variant="ghost"`)**
- Background: Transparent
- Text: Gold Dark (`#9A7B4F`)
- Underline offset 4px
- Hover: Underline

### Cards

- Background: Ivory Light (`#FAF8F4`)
- Shadow: `shadow-card`
- Border: None
- Padding: `p-6` (24px)
- Radius: `rounded-lg` (8px)

### Inputs

- Background: White
- Border: 1px solid Stone (`#D1CCC4`)
- Text: Charcoal
- Focus: Border Gold, Ring Gold/30 (Subtle glow)

### Badges

- Shape: Pill (`rounded-full`)
- Text: Uppercase, Tracking Wide (`0.05em`)
- Backgrounds: Subtle washes (15% opacity) of semantic colors.

---

## 3. Visual Language

### Illustrations (Golden Threads)

- **Usage**: Sparingly. Anchored to edges (Top-Right, Bottom-Left).
- **Opacity**: 10-20% max.
- **Purpose**: Guide the eye, add texture without noise.

### Texture

- **Ivory Paper**: Used as a subtle overlay or background pattern to break the flatness of digital white.
- **Usage**: `bg-ivory` is the default.

---

## 4. Implementation Checklist

- [x] **Configuration**: Tailwind config updated with new palette, fonts, shadows.
- [x] **Global CSS**: CSS variables defined, defaults set.
- [x] **Components**:
    - [x] Button (Refactored)
    - [x] Card (Refactored)
    - [x] Input (Refactored)
    - [x] Badge (Refactored)
    - [x] Typography (H1, H2, H3 refactored)
- [x] **Pages**:
    - [x] Home (`/`) — Redesigned with Split Hero.
    - [x] Login (`/login`) — Redesigned with Centered Card.
    - [x] Signup (`/signup`) — Redesigned with Role Selection.
    - [x] Professionals (`/professionals`) — Redesigned Hero & Value Props.
- [x] **Layouts**:
    - [x] Talent Dashboard Layout (Verified)

---

*This document serves as the single source of truth for the UI implementation.*
