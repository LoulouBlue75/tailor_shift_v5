# STORY-003: Authentication System

**Epic:** Authentication  
**Priority:** P0 (Blocker)  
**Story Points:** 13  
**Dependencies:** STORY-001, STORY-002

---

## User Story

En tant qu'**utilisateur (Talent ou Brand)**,  
Je veux **créer un compte et me connecter de manière sécurisée**,  
Afin de **accéder à la plateforme avec mon rôle approprié**.

---

## Acceptance Criteria

### ✅ AC1: Supabase Auth Configuration
- [ ] Auth settings configurés dans Supabase Dashboard:
  - Email/Password activé
  - Google OAuth configuré
  - LinkedIn OAuth configuré
- [ ] Redirect URLs configurées (dev + production)
- [ ] Email templates personnalisés (optionnel V1)

### ✅ AC2: Signup Flow
- [ ] Page `/signup` créée
- [ ] Choix du type d'utilisateur: "I'm a Professional" / "I'm a Brand"
- [ ] Formulaire signup avec:
  - Full name
  - Email
  - Password (8+ chars, validation)
  - User type (hidden, déterminé par le choix)
- [ ] Boutons OAuth: "Continue with Google", "Continue with LinkedIn"
- [ ] Validation côté client (Zod)
- [ ] Metadata `user_type` passée à Supabase
- [ ] Redirect après signup vers onboarding approprié

### ✅ AC3: Login Flow
- [ ] Page `/login` créée
- [ ] Formulaire login:
  - Email
  - Password
  - "Remember me" (optionnel)
- [ ] Boutons OAuth
- [ ] "Forgot password?" link
- [ ] Redirect après login vers dashboard approprié selon `user_type`
- [ ] Gestion erreurs (wrong password, user not found)

### ✅ AC4: OAuth Handlers
- [ ] Callback routes pour Google (`/auth/callback/google`)
- [ ] Callback routes pour LinkedIn (`/auth/callback/linkedin`)
- [ ] Gestion des erreurs OAuth
- [ ] Création automatique du profile si nouveau user

### ✅ AC5: Profile Auto-creation Trigger
- [ ] Trigger SQL `handle_new_user()` créé dans Supabase
- [ ] Trigger crée automatiquement `profiles` row avec:
  - `id` = `auth.users.id`
  - `user_type` depuis metadata
  - `email` depuis auth.users
- [ ] Testé avec signup email et OAuth

### ✅ AC6: Middleware Protection
- [ ] `middleware.ts` créé
- [ ] Routes `/talent/*` protégées (auth required)
- [ ] Routes `/brand/*` protégées (auth required)
- [ ] Vérification `user_type` vs route
- [ ] Redirect vers login si non authentifié
- [ ] Redirect vers bon dashboard si mauvais type

### ✅ AC7: Session Management
- [ ] Session persistée dans cookie
- [ ] Session refresh automatique
- [ ] Logout fonctionnel (clear session)
- [ ] Auth state accessible dans composants (hook `useUser()`)

### ✅ AC8: Auth UI Components
- [ ] `<AuthForm>` component réutilisable
- [ ] `<OAuthButtons>` component
- [ ] Loading states durant auth
- [ ] Error display component
- [ ] Success messages (email confirmation, etc.)

---

## Technical Implementation

### Signup Server Action
```typescript
// app/actions/auth.ts
'use server'

import { createServerActionClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
  userType: z.enum(['talent', 'brand']),
})

export async function signup(formData: FormData) {
  const data = signupSchema.parse({
    email: formData.get('email'),
    password: formData.get('password'),
    fullName: formData.get('fullName'),
    userType: formData.get('userType'),
  })

  const supabase = createServerActionClient()
  
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        user_type: data.userType,
        full_name: data.fullName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Redirect to onboarding
  const redirectPath = data.userType === 'talent' 
    ? '/talent/onboarding' 
    : '/brand/onboarding'
  
  redirect(redirectPath)
}
```

### Middleware
```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const { data: { session } } = await supabase.auth.getSession()
  const path = req.nextUrl.pathname

  // Protect authenticated routes
  if (path.startsWith('/talent') || path.startsWith('/brand')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Verify user_type matches route
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

### useUser Hook
```typescript
// lib/hooks/useUser.ts
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  return { user, loading }
}
```

---

## Routes Structure

```
app/
├── (public)/
│   ├── login/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   └── auth/
│       └── callback/
│           └── route.ts
├── actions/
│   └── auth.ts
└── middleware.ts
```

---

## Testing Requirements

### Manual Tests
- [ ] Signup avec email → profile créé → redirect onboarding
- [ ] Signup avec Google → profile créé → redirect onboarding
- [ ] Signup avec LinkedIn → profile créé → redirect onboarding
- [ ] Login email/password → redirect dashboard
- [ ] Login avec mauvais credentials → erreur affichée
- [ ] Logout → session cleared → redirect login
- [ ] Accès `/talent/dashboard` sans auth → redirect login
- [ ] Accès `/talent/dashboard` avec user_type=brand → redirect `/brand/dashboard`
- [ ] Password reset flow (forgot password)

### Edge Cases
- [ ] Email déjà existant → erreur explicite
- [ ] OAuth annulé → retour signup avec message
- [ ] Session expirée → refresh automatique ou redirect login

---

## Security Checklist

- [ ] Passwords jamais loggés
- [ ] HTTPS obligatoire en production
- [ ] CSRF protection (Server Actions natif)
- [ ] Rate limiting sur auth endpoints (Supabase natif)
- [ ] Email verification (optionnel V1, recommandé V2)

---

## Definition of Done

- [ ] Tous les AC satisfaits
- [ ] Tests manuels passés
- [ ] Middleware testé avec différents scénarios
- [ ] OAuth Google et LinkedIn fonctionnels
- [ ] Documentation auth flow dans README
- [ ] Code reviewed
