# STORY-001: Project Setup & Configuration

**Epic:** Infrastructure  
**Priority:** P0 (Blocker)  
**Story Points:** 5  
**Dependencies:** None

---

## User Story

En tant que **développeur**,  
Je veux **initialiser le projet Next.js 15 avec Supabase et la structure de dossiers**,  
Afin de **avoir une base de code prête pour le développement**.

---

## Acceptance Criteria

### ✅ AC1: Next.js 15 Project Initialized
- [ ] Next.js 15 créé avec App Router activé
- [ ] TypeScript configuré (`tsconfig.json` strict mode)
- [ ] `eslint` et `prettier` configurés
- [ ] `.gitignore` approprié (node_modules, .env.local, .next)

### ✅ AC2: Tailwind CSS Configured
- [ ] Tailwind CSS installé et configuré
- [ ] `tailwind.config.ts` avec les tokens de couleur du design system
- [ ] Fichier `globals.css` avec les styles de base

### ✅ AC3: Supabase Client Setup
- [ ] `@supabase/supabase-js` installé
- [ ] `@supabase/auth-helpers-nextjs` installé
- [ ] Clients Supabase créés dans `/lib/supabase/`:
  - `client.ts` (client-side)
  - `server.ts` (server components)
  - `middleware.ts` (middleware)
- [ ] Variables d'environnement définies (`.env.local.example`)

### ✅ AC4: Project Structure
- [ ] Tous les dossiers créés selon la spec:
```
tailor_shift_v5/
├── app/
│   ├── (public)/
│   ├── (talent)/
│   ├── (brand)/
│   └── api/
├── components/
│   ├── ui/
│   ├── talent/
│   └── brand/
├── lib/
│   ├── supabase/
│   ├── engines/
│   └── utils/
├── data/
│   ├── mcs/
│   └── templates/
└── supabase/
    └── migrations/
```

### ✅ AC5: Package Dependencies
- [ ] Dependencies essentielles installées:
  - `next@15`
  - `react@18`
  - `react-dom@18`
  - `typescript`
  - `tailwindcss`
  - `@supabase/supabase-js`
  - `@supabase/auth-helpers-nextjs`
  - `zod` (validation)

### ✅ AC6: Development Scripts
- [ ] `package.json` avec scripts:
  - `dev`: démarre le serveur de développement
  - `build`: build production
  - `start`: serveur production
  - `lint`: linting
  - `type-check`: vérification TypeScript

---

## Technical Notes

### Environment Variables (.env.local.example)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Tailor Shift
```

### Tailwind Color Tokens
```typescript
// tailwind.config.ts
colors: {
  'off-white': '#FAFAF8',
  'charcoal': '#1A1A1A',
  'concrete': '#E0E0DA',
  'matte-gold': '#C2A878',
  'soft-grey': '#6B6B6B',
  'success': '#2D5A3D',
  'warning': '#8B6914',
  'error': '#8B2D2D',
}
```

### Font Configuration
- Primary: Manrope (Google Fonts)
- Accent: Playfair Display (Google Fonts)

---

## Testing Requirements

- [ ] `npm run dev` démarre sans erreur
- [ ] `npm run build` compile sans erreur
- [ ] `npm run lint` passe sans erreur
- [ ] TypeScript type-checking passe
- [ ] Variables d'environnement sont correctement chargées

---

## Definition of Done

- [ ] Tous les AC sont satisfaits
- [ ] Code committed et pushé
- [ ] README.md avec instructions de setup
- [ ] .env.local.example créé
- [ ] Pas d'erreurs de build ou de lint
