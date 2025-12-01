# STORY-002: Design System Foundation

**Epic:** UI/UX  
**Priority:** P0 (Blocker)  
**Story Points:** 8  
**Dependencies:** STORY-001

---

## User Story

En tant que **designer/développeur**,  
Je veux **créer les composants UI de base du design system**,  
Afin de **avoir une bibliothèque réutilisable cohérente avec l'identité "Quiet Luxury"**.

---

## Acceptance Criteria

### ✅ AC1: Typography System
- [ ] Composants `<H1>`, `<H2>`, `<H3>` créés
- [ ] Composant `<Text>` avec variants: `body`, `caption`, `label`
- [ ] Fonts Playfair Display et Manrope chargées via next/font
- [ ] Classes Tailwind pour typography créées et documentées

### ✅ AC2: Color System
- [ ] Toutes les couleurs définies dans `tailwind.config.ts`
- [ ] Classes utilitaires testées (text-, bg-, border-)
- [ ] Documentation avec exemples visuels

### ✅ AC3: Button Component
- [ ] Variants: `primary`, `secondary`, `ghost`
- [ ] Sizes: `sm`, `md`, `lg`
- [ ] States: default, hover, active, disabled
- [ ] Props: `variant`, `size`, `disabled`, `loading`, `onClick`
- [ ] Loading state avec spinner

### ✅ AC4: Input Components
- [ ] `<Input>` (text, email, password, tel, url)
- [ ] `<Textarea>`
- [ ] `<Select>`
- [ ] States: default, focus, error, disabled
- [ ] Label + helper text + error message intégrés

### ✅ AC5: Card Component
- [ ] Style de base (white bg, border, radius, padding)
- [ ] Variants: `default`, `elevated`, `interactive`
- [ ] Hover states pour interactive

### ✅ AC6: Layout Components
- [ ] `<Container>` (max-width centré)
- [ ] `<Stack>` (vertical spacing)
- [ ] `<Grid>` (responsive grid)
- [ ] `<Divider>`

### ✅ AC7: Badge/Tag Component
- [ ] Variants: `default`, `success`, `warning`, `error`, `info`
- [ ] Sizes: `sm`, `md`

### ✅ AC8: Modal/Dialog Component
- [ ] Overlay avec backdrop
- [ ] Content container
- [ ] Close button
- [ ] Animations (fade in/out)
- [ ] Trap focus accessibility

---

## Component Specifications

### Button
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}
```

**Styles:**
- Primary: `bg-matte-gold text-charcoal hover:bg-matte-gold/90`
- Secondary: `border border-charcoal text-charcoal hover:bg-charcoal/5`
- Ghost: `text-charcoal underline-offset-4 hover:underline`

### Input
```typescript
interface InputProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
}
```

### Card
```typescript
interface CardProps {
  variant?: 'default' | 'elevated' | 'interactive';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}
```

---

## Spacing Scale

Tailwind utilities déjà disponibles, mais documentation:
- `gap-1` → 4px
- `gap-2` → 8px
- `gap-4` → 16px
- `gap-6` → 24px
- `gap-8` → 32px
- `gap-12` → 48px
- `gap-16` → 64px

---

## File Structure

```
components/ui/
├── typography/
│   ├── H1.tsx
│   ├── H2.tsx
│   ├── H3.tsx
│   └── Text.tsx
├── Button.tsx
├── Input.tsx
├── Textarea.tsx
├── Select.tsx
├── Card.tsx
├── Badge.tsx
├── Modal.tsx
├── Container.tsx
├── Stack.tsx
├── Grid.tsx
└── Divider.tsx
```

---

## Testing Requirements

- [ ] Storybook ou page de démo créée (`/design-system`)
- [ ] Tous les variants testés visuellement
- [ ] Accessibility: keyboard navigation, focus states
- [ ] Responsive: mobile, tablet, desktop

---

## Documentation

Créer `/docs/DESIGN_SYSTEM.md` avec:
- Philosophie design
- Color palette avec hex codes
- Typography scale
- Component usage examples
- Spacing guidelines
- Accessibility notes

---

## Definition of Done

- [ ] Tous les composants créés et fonctionnels
- [ ] Design system documenté
- [ ] Page de démo accessible en dev
- [ ] Code reviewed
- [ ] Pas de violations d'accessibilité
