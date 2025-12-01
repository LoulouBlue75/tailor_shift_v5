# Tailor Shift V5

> Luxury Retail Talent Matching Platform

A B2B platform connecting exceptional retail professionals with prestigious luxury maisons. Built with Next.js 15, Supabase, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Supabase account

### Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

3. **Run the development server:**

```bash
npm run dev
```

4. **Open [http://localhost:3000](http://localhost:3000)**

## 📁 Project Structure

```
tailor_shift_v5/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public routes (landing, auth)
│   ├── (talent)/          # Talent authenticated routes
│   ├── (brand)/           # Brand authenticated routes
│   └── api/               # Webhooks only
├── components/
│   ├── ui/                # Design system primitives
│   ├── talent/            # Talent-specific components
│   └── brand/             # Brand-specific components
├── lib/
│   ├── supabase/          # Supabase clients
│   ├── engines/           # Matching, Assessment, Learning, Projection
│   └── utils/             # Helpers, formatters, validators
├── data/
│   ├── mcs/               # Master Classification System constants
│   └── templates/         # Opportunity templates
├── docs/                  # Documentation & specs
└── supabase/
    └── migrations/        # SQL migrations
```

## 🎨 Design System

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `off-white` | #FAFAF8 | Backgrounds |
| `charcoal` | #1A1A1A | Primary text |
| `concrete` | #E0E0DA | Borders, dividers |
| `matte-gold` | #C2A878 | Accents, CTAs |
| `soft-grey` | #6B6B6B | Secondary text |

### Typography

- **Headings:** Playfair Display (serif)
- **Body:** Manrope (sans-serif)

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Auth & Database:** Supabase
- **Styling:** Tailwind CSS
- **Validation:** Zod
- **Deployment:** Vercel

## 📋 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # TypeScript type checking
```

## 🔐 Authentication Flow

1. User chooses "Professional" or "Brand" on signup
2. Authenticates via Email/Password or OAuth (Google/LinkedIn)
3. Profile auto-created via Supabase trigger
4. Redirected to appropriate onboarding flow
5. Middleware protects routes based on `user_type`

## 📊 Master Classification System (MCS)

The MCS is the backbone taxonomy for all matching and assessment:

- **8 Role Levels:** L1 (Sales Advisor) → L8 (Regional Director)
- **5 Store Tiers:** T1 (Flagship XXL) → T5 (Outlet/Travel)
- **9 Divisions:** Fashion, Leather Goods, Watches, High Jewelry, etc.
- **6 Experience Blocks:** FOH, BOH, Leadership, Clienteling, Operations, Business

## 🧠 Intelligence Engines

| Engine | Purpose |
|--------|---------|
| **Matching (7D)** | Scores talent-opportunity fit |
| **Assessment (4D)** | Evaluates retail excellence |
| **Learning** | Recommends development modules |
| **Projection** | Predicts career trajectory |

## 📚 Documentation

- [V5.1 Specification](./docs/Tailor_Shift_V5.1_Spec.md)
- [Development Stories](./docs/stories/)
- [Approach](./docs/APPROACH.md)

## 🤝 Contributing

1. Read the spec and approach documents
2. Pick a story from `/docs/stories/`
3. Follow the acceptance criteria
4. Submit a PR

## 📄 License

Proprietary - All rights reserved

---

Built with ❤️ for the luxury retail industry
