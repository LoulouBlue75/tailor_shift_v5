# Tailor Shift V6 — Roadmap & Feature Proposals

> **Status:** Planning  
> **Target:** Q3 2025  
> **Base:** V5.2 Master Specification

---

## 1. BRAND FEATURES

### 1.1 Custom Brand Assessments 🆕

**User Story:** En tant que marque, je veux créer mon propre module d'assessment pour évaluer les candidats selon mes critères spécifiques.

**Fonctionnalités:**
- Créateur de questions (drag & drop)
- Types de questions: QCM, échelle, situational judgment, texte libre
- Scoring personnalisé par question
- Intégration au flow de matching (score brand + score global)
- Templates par division (Fashion, Beauty, Watches, etc.)
- Branding du questionnaire (logo, couleurs)

**Data Model:**
```sql
CREATE TABLE brand_assessments (
  id UUID PRIMARY KEY,
  brand_id UUID REFERENCES brands(id),
  title TEXT NOT NULL,
  description TEXT,
  estimated_duration_minutes INTEGER,
  is_mandatory BOOLEAN DEFAULT FALSE,
  status TEXT CHECK (status IN ('draft','active','archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE brand_assessment_questions (
  id UUID PRIMARY KEY,
  assessment_id UUID REFERENCES brand_assessments(id),
  question_text TEXT NOT NULL,
  question_type TEXT CHECK (question_type IN ('mcq','scale','situational','open')),
  options JSONB, -- For MCQ: [{value, label, score}]
  max_score INTEGER,
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE talent_brand_assessment_results (
  talent_id UUID REFERENCES talents(id),
  assessment_id UUID REFERENCES brand_assessments(id),
  score INTEGER,
  answers JSONB, -- Encrypted or deleted after scoring
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (talent_id, assessment_id)
);
```

**Impact Matching:**
- Score brand assessment ajouté comme 8ème dimension (optionnel)
- Weight ajustable par brand: 0-15%
- Si pas complété: talent peut quand même matcher mais avec flag "Assessment pending"

---

### 1.2 Brand Space Customization (White-Label) 🆕

**User Story:** En tant que marque, je veux personnaliser mon espace aux couleurs de ma marque pour offrir une expérience cohérente aux candidats.

**Niveaux de personnalisation:**

| Niveau | Éléments | Disponibilité |
|--------|----------|---------------|
| **Basic** (V6.0) | Logo, couleur primaire, couleur secondaire | Inclus |
| **Advanced** (V6.1) | Font, fond, favicon custom | Premium |
| **Enterprise** (V6.2) | Domaine custom, suppression branding TS | Enterprise |

**Fonctionnalités Basic:**
- Upload logo (header + email templates)
- Couleur primaire (boutons, accents)
- Couleur secondaire (hover, badges)
- Preview en temps réel
- Application automatique sur: espace opportunités, page candidature, emails

**Data Model:**
```sql
ALTER TABLE brands ADD COLUMN branding JSONB DEFAULT '{
  "logo_url": null,
  "primary_color": "#C4A962",
  "secondary_color": "#9A7B4F",
  "custom_font": null,
  "background_style": "default",
  "favicon_url": null,
  "custom_domain": null
}';
```

**Expérience Talent:**
- Quand un talent consulte une opportunité → couleurs de la brand
- Quand il postule → branding cohérent
- Emails de notification → branded

---

### 1.3 Talent Pipeline Management

**User Story:** En tant que recruteur, je veux gérer mes candidats favoris et suivre leur progression dans le processus.

**Fonctionnalités:**
- Sauvegarder des talents (shortlist)
- Ajouter des notes privées
- Tags personnalisés (ex: "À recontacter", "En entretien", "Offre envoyée")
- Historique des interactions
- Export CSV/Excel

**Data Model:**
```sql
CREATE TABLE talent_pipeline (
  id UUID PRIMARY KEY,
  brand_id UUID REFERENCES brands(id),
  talent_id UUID REFERENCES talents(id),
  opportunity_id UUID REFERENCES opportunities(id), -- Optional
  status TEXT CHECK (status IN ('saved','contacted','interviewing','offer','hired','declined')),
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(brand_id, talent_id, opportunity_id)
);
```

---

### 1.4 Team Collaboration

**User Story:** En tant qu'entreprise, je veux que plusieurs recruteurs puissent accéder et collaborer sur notre espace brand.

**Fonctionnalités:**
- Inviter des membres (email)
- Rôles: Admin, Recruiter, Viewer
- Permissions granulaires
- Activity log

**Data Model:**
```sql
CREATE TABLE brand_members (
  id UUID PRIMARY KEY,
  brand_id UUID REFERENCES brands(id),
  user_id UUID REFERENCES profiles(id),
  role TEXT CHECK (role IN ('admin','recruiter','viewer')),
  invited_by UUID REFERENCES profiles(id),
  status TEXT CHECK (status IN ('pending','active','deactivated')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 1.5 Analytics Dashboard

**User Story:** En tant que marque, je veux comprendre mes performances de recrutement et l'efficacité de mes opportunités.

**Métriques:**
- Vues par opportunité
- Taux de match (suggestions vs intérêts)
- Temps moyen avant premier contact
- Sources des talents (division, région, niveau)
- Score moyen des candidats
- Funnel conversion (vue → intérêt → mutual → hire)

---

## 2. TALENT FEATURES

### 2.1 Talent Networking (Community) 🆕

**User Story:** En tant que talent, je veux me connecter avec d'autres professionnels de ma maison ou de mon groupe pour échanger et networker.

**Fonctionnalités:**
- Découvrir des talents de la même maison (opt-in)
- Découvrir des talents du même groupe (LVMH, Kering, Richemont...)
- Demandes de connexion
- Messagerie privée entre connectés
- Discussion groups par division/région

**Privacy Controls:**
- Opt-in requis pour être visible
- Contrôle de ce qui est partagé (nom, rôle, maison)
- Possibilité de bloquer

**Data Model:**
```sql
CREATE TABLE talent_connections (
  id UUID PRIMARY KEY,
  requester_id UUID REFERENCES talents(id),
  receiver_id UUID REFERENCES talents(id),
  status TEXT CHECK (status IN ('pending','accepted','declined','blocked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, receiver_id)
);

CREATE TABLE talent_visibility_settings (
  talent_id UUID PRIMARY KEY REFERENCES talents(id),
  visible_to_same_maison BOOLEAN DEFAULT FALSE,
  visible_to_same_group BOOLEAN DEFAULT FALSE,
  share_current_role BOOLEAN DEFAULT TRUE,
  share_location BOOLEAN DEFAULT TRUE,
  share_divisions BOOLEAN DEFAULT TRUE
);

-- Luxury groups for matching
CREATE TABLE luxury_groups (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL, -- LVMH, Kering, Richemont, Hermès, Chanel...
  maisons TEXT[] -- List of maison names belonging to this group
);
```

---

### 2.2 Skills Endorsements

**User Story:** En tant que talent, je veux que mes compétences soient validées par mes pairs ou anciens managers.

**Fonctionnalités:**
- Demander un endorsement (email à un contact)
- Recevoir des endorsements (badge sur profil)
- Voir qui a endorsé quoi
- Impact sur le matching score (capability fit boost)

---

### 2.3 Salary Benchmark

**User Story:** En tant que talent, je veux savoir si ma rémunération est compétitive par rapport au marché.

**Fonctionnalités:**
- Données agrégées anonymes
- Filtres: niveau, division, région, type de store
- Comparaison avec mon profil
- Tendances (évolution sur 12 mois)

**Privacy:** 
- Aucune donnée individuelle exposée
- Minimum 10 profils pour afficher une moyenne
- Contribution anonyme encouragée

---

### 2.4 Career Path Visualization

**User Story:** En tant que talent, je veux visualiser les différentes trajectoires possibles pour ma carrière.

**Fonctionnalités:**
- Graphe interactif des progressions L1 → L8
- Chemins typiques par division
- Durée moyenne entre niveaux
- Compétences requises pour chaque transition
- Success stories anonymisées

---

### 2.5 Learning Certifications

**User Story:** En tant que talent, je veux obtenir des certifications qui valorisent mon profil.

**Fonctionnalités:**
- Quiz de certification après modules
- Badge visible sur profil
- Partage LinkedIn
- Impact sur matching (capability fit)

---

### 2.6 Mobile App

**User Story:** En tant que talent, je veux accéder à Tailor Shift depuis mon mobile.

**Fonctionnalités:**
- PWA ou React Native
- Push notifications
- Swipe sur opportunités (Tinder-style)
- Chat
- Profile management basique

---

## 3. PLATFORM FEATURES

### 3.1 Messaging System

**User Story:** En tant qu'utilisateur, je veux communiquer directement avec mes matches.

**Fonctionnalités:**
- Chat 1-to-1 (brand ↔ talent)
- Historique des conversations
- Notifications
- Partage de documents
- Templates de messages (pour brands)

**Data Model:**
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  match_id UUID REFERENCES matches(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  sender_id UUID REFERENCES profiles(id),
  content TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 3.2 Notifications Center

**User Story:** En tant qu'utilisateur, je veux être notifié des événements importants.

**Canaux:**
- In-app (notification center)
- Email
- Push (mobile)

**Events:**
- Nouveau match
- Intérêt mutuel
- Nouveau message
- Assessment complété
- Opportunité expirée/filled

---

### 3.3 Multi-Language (i18n)

**User Story:** En tant qu'utilisateur non-anglophone, je veux utiliser la plateforme dans ma langue.

**Langues prioritaires:**
1. English (default)
2. Français
3. Italiano
4. Deutsch
5. 中文 (Mandarin)
6. 日本語 (Japanese)

---

### 3.4 Admin Dashboard

**User Story:** En tant qu'opérateur Tailor Shift, je veux superviser la plateforme.

**Fonctionnalités:**
- User management (talents, brands)
- Content moderation
- Analytics globales
- Feature flags
- Support tickets

---

### 3.5 API & Integrations

**User Story:** En tant que brand enterprise, je veux intégrer Tailor Shift avec mon ATS.

**Intégrations prioritaires:**
- Workday
- SAP SuccessFactors
- Lever
- Greenhouse
- LinkedIn Recruiter

**API:**
- REST API pour brands
- Webhooks pour events
- OAuth2 pour auth

---

## 4. PRIORITIZATION MATRIX

| Feature | Impact | Effort | Priority V6 |
|---------|--------|--------|-------------|
| Brand Custom Assessments | 🔥🔥🔥 | Medium | P1 |
| Brand Space Customization | 🔥🔥🔥 | Medium | P1 |
| Talent Networking | 🔥🔥🔥 | High | P1 |
| Messaging System | 🔥🔥🔥 | Medium | P1 |
| Notifications Center | 🔥🔥 | Low | P2 |
| Talent Pipeline | 🔥🔥 | Low | P2 |
| Team Collaboration | 🔥🔥 | Medium | P2 |
| Analytics Dashboard | 🔥🔥 | Medium | P2 |
| Skills Endorsements | 🔥 | Medium | P3 |
| Salary Benchmark | 🔥🔥 | High | P3 |
| Career Path Viz | 🔥 | Medium | P3 |
| Learning Certifications | 🔥 | Low | P3 |
| Mobile App | 🔥🔥 | High | P3 |
| Multi-Language | 🔥🔥 | High | P3 |
| Admin Dashboard | 🔥 | Medium | P3 |
| API & Integrations | 🔥🔥 | High | P4 |

---

## 5. V6 RELEASE PLAN

### V6.0 — Core Features (Q3 2025)
- [ ] Brand Custom Assessments
- [ ] Brand Space Customization (Basic)
- [ ] Talent Networking (Same Maison)
- [ ] Messaging System
- [ ] Notifications Center

### V6.1 — Collaboration (Q4 2025)
- [ ] Talent Pipeline Management
- [ ] Team Collaboration
- [ ] Analytics Dashboard (Basic)
- [ ] Talent Networking (Same Group)

### V6.2 — Growth (Q1 2026)
- [ ] Skills Endorsements
- [ ] Salary Benchmark
- [ ] Career Path Visualization
- [ ] Multi-Language (FR, IT)

### V6.3 — Scale (Q2 2026)
- [ ] Mobile App (PWA)
- [ ] Admin Dashboard
- [ ] API & Integrations
- [ ] Brand Space Customization (Enterprise)

---

## 6. TECHNICAL CONSIDERATIONS

### Database Changes
- ~10 nouvelles tables
- Extension du schema brands avec branding JSONB
- Tables conversations/messages pour messaging
- Tables connections pour networking

### RLS Implications
- Conversations: visible uniquement par les participants
- Connections: visible uniquement par le demandeur et le receveur
- Brand assessments: visible par la brand et les talents qui postulent
- Pipeline: visible uniquement par la brand

### Performance
- Messaging: Consider realtime subscriptions (Supabase Realtime)
- Analytics: Consider materialized views ou aggregate tables
- Search: Consider full-text search pour talents (pg_trgm)

### Security
- Messaging: encryption at rest
- Salary data: strict anonymization
- Brand assessments: answers ephemeral

---

*Document créé le 2 Décembre 2025 — Tailor Shift V6 Planning*
