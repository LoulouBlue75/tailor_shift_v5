# Store Context Model V6 — Operational Reality Framework

> **Version:** 1.0  
> **Date:** December 2025  
> **Purpose:** Define the multi-dimensional fingerprint for retail experiences  
> **Applies to:** Talent Experience Blocks + Brand Opportunities

---

## 1. OVERVIEW

### 1.1 Why Store Context Matters

Traditional job matching in luxury retail relies on simple criteria (level, division). But the **operational reality** of a boutique fundamentally shapes the experience required and gained.

A Department Manager in a 15-person boutique has a vastly different experience than one in a 150-person flagship. This model captures that nuance.

### 1.2 The Store Fingerprint Concept

Every retail position exists within a **Store Context** — a multi-dimensional fingerprint that describes:
- Physical characteristics (size, format)
- Operational scale (team, traffic, revenue)
- Organizational model (how the team is structured)
- Client dynamics (profile, traffic patterns)

This fingerprint enables:
- **Talent side:** Rich description of past experiences
- **Brand side:** Precise description of opportunity context
- **Matching:** Contextual comparison (not strict scoring)

---

## 2. THE 10 DIMENSIONS

### 2.1 Store Format

The physical and strategic positioning of the store.

| Code | Label | Description | Example Locations |
|------|-------|-------------|-------------------|
| `flagship_global` | Global Flagship | Iconic address, brand statement | Champs-Élysées, Fifth Ave, Bond Street |
| `flagship_city` | City Flagship | Capital city premium address | Milan Via Monte, Munich Maximilianstr |
| `department_store` | Department Store | Corner/shop-in-shop in major retailer | Harrods, Galeries Lafayette, SKP |
| `boutique` | Standalone Boutique | Independent boutique, city center | Most brand boutiques |
| `travel_retail` | Travel Retail | Airport, train station, cruise | CDG, Heathrow, Venice airport |
| `outlet` | Outlet | Brand village, value positioning | La Vallée Village, Bicester |
| `popup` | Pop-up / Concept | Temporary or experimental format | Seasonal, events |
| `resort` | Resort / Hotel | Hotel-based, seasonal clientele | St. Tropez, Courchevel, Maldives |

### 2.2 Surface Area (m²)

Physical selling and back-of-house space.

| Code | Range | Typical Context |
|------|-------|-----------------|
| `xs` | < 50 m² | Very small boutique, mono-product |
| `s` | 50–150 m² | Standard boutique |
| `m` | 150–400 m² | Medium format |
| `l` | 400–1000 m² | Large boutique |
| `xl` | 1000–2500 m² | Flagship |
| `xxl` | > 2500 m² | Global flagship |

### 2.3 Team Size (FTE)

Full-time equivalent headcount.

| Code | Range | Description |
|------|-------|-------------|
| `micro` | 1–5 | Owner-operator or minimal staff |
| `small` | 6–15 | Small team, flat structure |
| `medium` | 16–40 | Departmental structure emerges |
| `large` | 41–80 | Multiple N-1 managers |
| `xlarge` | 81–150 | Complex hierarchy |
| `xxlarge` | > 150 | Multi-shift, full departmentalization |

### 2.4 Daily Traffic (Visitors/Day)

Average daily footfall.

| Code | Range | Typical Context |
|------|-------|-----------------|
| `xs` | < 50 | Appointment-based, quiet location |
| `s` | 50–150 | Neighborhood boutique |
| `m` | 150–300 | City center boutique |
| `l` | 300–500 | High-traffic location |
| `xl` | > 500 | Flagship, tourist destination |

### 2.5 Revenue Scale (Annual)

Annual turnover range.

| Code | Range | Description |
|------|-------|-------------|
| `emerging` | < 1M€ | New or developing location |
| `established` | 1–5M€ | Stable, mid-tier |
| `performing` | 5–15M€ | Strong performer |
| `high_performing` | 15–50M€ | Top-tier |
| `exceptional` | > 50M€ | Global flagship level |

### 2.6 Product Complexity

Range and complexity of product offering.

| Code | Description | Example |
|------|-------------|---------|
| `mono_category` | Single product category | Perfume boutique, watch boutique |
| `focused` | 2–3 categories | Fashion + Accessories |
| `full_range` | Complete brand universe | All categories, including high-end |
| `multi_brand` | Multiple brands | Department store corner, group boutique |

### 2.7 SKU Depth

Number of product references managed.

| Code | Range | Context |
|------|-------|---------|
| `limited` | < 200 | Curated selection |
| `standard` | 200–1000 | Typical boutique |
| `extensive` | 1000–5000 | Full assortment |
| `comprehensive` | > 5000 | Flagship with all categories |

### 2.8 Client Profile

Primary client demographics.

| Code | Description | Characteristics |
|------|-------------|-----------------|
| `local_focused` | > 80% local residents | Relationship-driven, repeat customers |
| `mixed` | 50–80% local | Balanced approach |
| `tourist_heavy` | < 50% local | High turnover, transactional |
| `vip_focused` | > 30% revenue from VIC | Private appointments, high service |
| `appointment_based` | Primarily by appointment | Ultra-luxury, high jewelry |

### 2.9 Operating Hours Model

Operational complexity indicator.

| Code | Description |
|------|-------------|
| `standard` | Single shift, regular hours (9h/day) |
| `extended` | Extended hours (10–12h/day) |
| `multi_shift` | Multiple shifts, 12h+ operation |
| `24_7` | Round-the-clock (rare, travel retail) |

### 2.10 Organizational Model

How the management team is structured.

| Code | Description | Characteristics |
|------|-------------|-----------------|
| `flat` | No formal N-1 layer | Small boutiques, direct HOB management |
| `generalist` | N-1 managers with rotating responsibilities | Flexibility, pipeline development |
| `specialist` | N-1 managers by category/function | Deep expertise, clear scope |
| `hybrid` | Mix of specialist and generalist | Large flagships |

---

## 3. DATA MODEL

### 3.1 JSON Schema

```typescript
interface StoreContext {
  format: 'flagship_global' | 'flagship_city' | 'department_store' | 'boutique' | 'travel_retail' | 'outlet' | 'popup' | 'resort';
  surface: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
  team_size: 'micro' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';
  daily_traffic: 'xs' | 's' | 'm' | 'l' | 'xl';
  revenue_scale: 'emerging' | 'established' | 'performing' | 'high_performing' | 'exceptional';
  product_complexity: 'mono_category' | 'focused' | 'full_range' | 'multi_brand';
  sku_depth: 'limited' | 'standard' | 'extensive' | 'comprehensive';
  client_profile: 'local_focused' | 'mixed' | 'tourist_heavy' | 'vip_focused' | 'appointment_based';
  operating_hours: 'standard' | 'extended' | 'multi_shift' | '24_7';
  org_model: 'flat' | 'generalist' | 'specialist' | 'hybrid';
}
```

### 3.2 Database Column

```sql
-- For experience_blocks table (Talent)
ALTER TABLE experience_blocks 
ADD COLUMN store_context JSONB DEFAULT NULL;

-- For stores table (Brand)
ALTER TABLE stores
ADD COLUMN context_fingerprint JSONB DEFAULT NULL;

-- For opportunities table (Brand - if different from store)
ALTER TABLE opportunities
ADD COLUMN position_context JSONB DEFAULT NULL;
```

### 3.3 Validation

```typescript
const VALID_CONTEXTS = {
  format: ['flagship_global', 'flagship_city', 'department_store', 'boutique', 'travel_retail', 'outlet', 'popup', 'resort'],
  surface: ['xs', 's', 'm', 'l', 'xl', 'xxl'],
  team_size: ['micro', 'small', 'medium', 'large', 'xlarge', 'xxlarge'],
  daily_traffic: ['xs', 's', 'm', 'l', 'xl'],
  revenue_scale: ['emerging', 'established', 'performing', 'high_performing', 'exceptional'],
  product_complexity: ['mono_category', 'focused', 'full_range', 'multi_brand'],
  sku_depth: ['limited', 'standard', 'extensive', 'comprehensive'],
  client_profile: ['local_focused', 'mixed', 'tourist_heavy', 'vip_focused', 'appointment_based'],
  operating_hours: ['standard', 'extended', 'multi_shift', '24_7'],
  org_model: ['flat', 'generalist', 'specialist', 'hybrid']
};
```

---

## 4. POSITION SCOPE (Additional Layer)

Beyond store context, each position has specific scope characteristics.

### 4.1 Management Span

| Code | Direct Reports | Description |
|------|----------------|-------------|
| `individual` | 0 | Individual contributor |
| `small_team` | 1–5 | Small team lead |
| `department` | 6–15 | Department management |
| `large_team` | 16–40 | Large team management |
| `multi_team` | 40+ | Multi-team/full boutique |

### 4.2 FOH/BOH Split

| Code | FOH % | BOH % | Typical Role |
|------|-------|-------|--------------|
| `full_foh` | 100% | 0% | Sales Advisor |
| `foh_heavy` | 70–90% | 10–30% | Team Lead, N-1 |
| `balanced` | 40–60% | 40–60% | Operations Manager |
| `boh_heavy` | 10–30% | 70–90% | Stock Manager |
| `full_boh` | 0% | 100% | Warehouse, Admin |

### 4.3 Responsibility Areas

Checkbox list of key responsibilities:

| Area | Description |
|------|-------------|
| `p_and_l` | P&L accountability |
| `recruitment` | Hiring decisions |
| `training` | Team development |
| `client_strategy` | Client engagement strategy |
| `visual_merchandising` | VM decisions |
| `stock_management` | Inventory control |
| `events` | Events & activations |
| `vip_clients` | Personal VIC portfolio |
| `reporting` | Business analysis & reporting |
| `external_partners` | Vendor/partner management |

### 4.4 Data Model (Position Scope)

```typescript
interface PositionScope {
  management_span: 'individual' | 'small_team' | 'department' | 'large_team' | 'multi_team';
  foh_boh_split: 'full_foh' | 'foh_heavy' | 'balanced' | 'boh_heavy' | 'full_boh';
  responsibilities: string[]; // Array of responsibility codes
  reports_to: string; // Role level or title
}
```

---

## 5. COMPARISON LOGIC

### 5.1 Dimension Comparison Types

Each dimension compares differently:

| Dimension | Comparison Type | Up | Down | Match | Shift |
|-----------|----------------|-----|------|-------|-------|
| Format | Categorical | flagship_city→flagship_global | flagship_global→boutique | Same | Different category |
| Surface | Ordinal | s→m→l→xl | xl→l→m→s | Same range | - |
| Team Size | Ordinal | Same | Same | Same range | - |
| Daily Traffic | Ordinal | Same | Same | Same range | - |
| Revenue | Ordinal | Same | Same | Same range | - |
| Product Complexity | Ordinal | mono→full | full→mono | Same | - |
| SKU Depth | Ordinal | Same | Same | Same range | - |
| Client Profile | Categorical | - | - | Same | Different profile |
| Operating Hours | Ordinal | standard→multi_shift | multi_shift→standard | Same | - |
| Org Model | Categorical | - | - | Same | Different model |

### 5.2 Comparison Output

```typescript
interface ContextComparison {
  dimension: string;
  candidate_value: string;
  opportunity_value: string;
  delta: 'match' | 'up' | 'down' | 'shift';
  delta_size: number; // 0 = match, positive = up, negative = down
}
```

### 5.3 Summary Generation

Auto-generated narrative based on comparison:

| Pattern | Summary Text |
|---------|-------------|
| All match | "Strong alignment across all context dimensions." |
| Mostly up | "Significant upward progression in operational complexity." |
| Mostly down | "Transition to a more focused environment." |
| Mixed | "Varied context transition with new exposure areas." |
| Major shift | "Pivot to a fundamentally different retail context." |

---

## 6. UX DESIGN — PROGRESSIVE DISCLOSURE

### 6.1 Talent Onboarding Flow

**Step-by-step approach for each experience:**

```
STEP 1: BASICS (Always visible)
┌───────────────────────────────────────────────────────────────┐
│  Tell us about your experience at [Maison]                    │
│                                                               │
│  Role:      [Select ▼]     Duration: [Select ▼]               │
│  Location:  [City ▼]                                          │
└───────────────────────────────────────────────────────────────┘

STEP 2: STORE TYPE (One question, smart defaults)
┌───────────────────────────────────────────────────────────────┐
│  What type of store was this?                                 │
│                                                               │
│  ○ Flagship (major city, iconic location)                     │
│  ○ Standalone Boutique (city center)                          │
│  ○ Department Store (shop-in-shop)                            │
│  ○ Travel Retail (airport, station)                           │
│  ○ Outlet                                                     │
│  ○ Other [specify]                                            │
└───────────────────────────────────────────────────────────────┘

STEP 3: SCALE (Smart sliders, optional)
┌───────────────────────────────────────────────────────────────┐
│  Help us understand the scale:                                │
│                                                               │
│  Team size:   ○ Small   ○ Medium   ○ Large   ○ Very Large     │
│               (1-15)    (16-40)    (41-80)   (80+)            │
│                                                               │
│  Store size:  ○ Small   ○ Medium   ○ Large   ○ Flagship       │
│               (<150m²)  (150-400)  (400-1000) (1000+)         │
└───────────────────────────────────────────────────────────────┘

STEP 4: DETAILS (Expandable, optional)
┌───────────────────────────────────────────────────────────────┐
│  [+] Add more details (optional)                              │
│                                                               │
│  Product range: [Select ▼]                                    │
│  Client type: [Select ▼]                                      │
│  Operations model: [Select ▼]                                 │
└───────────────────────────────────────────────────────────────┘
```

### 6.2 Smart Defaults

Based on format selection, pre-fill likely values:

| Format Selected | Default Surface | Default Team | Default Traffic |
|-----------------|-----------------|--------------|-----------------|
| Global Flagship | xxl | xxlarge | xl |
| City Flagship | xl | xlarge | l |
| Boutique | m | medium | m |
| Travel Retail | s | small | l |
| Outlet | m | medium | l |

### 6.3 Validation

- **Minimum required:** Format, Team Size
- **Encouraged:** Surface, Client Profile
- **Optional:** Everything else
- **Profile completeness:** Each additional field adds +2% to profile score

---

## 7. DISPLAY COMPONENTS

### 7.1 Context Badge (Compact)

```
┌─────────────────────────────────────────┐
│ 🏛️ Flagship • XL Team • Full Range     │
└─────────────────────────────────────────┘
```

### 7.2 Context Card (Expanded)

```
┌─────────────────────────────────────────────────────────────────┐
│  STORE CONTEXT                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Format        Flagship City                                    │
│  Surface       L (400-1000 m²)                                  │
│  Team          Large (41-80 FTE)                                │
│  Traffic       L (300-500/day)                                  │
│  Revenue       High Performing                                  │
│  Products      Full Range                                       │
│  Clients       Mixed (local + tourist)                          │
│  Operations    Multi-shift                                      │
│  Organization  Specialist model                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.3 Comparison View

```
┌─────────────────────────────────────────────────────────────────┐
│  CONTEXT COMPARISON                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Dimension        Your Exp.       Opportunity      Delta        │
│  ────────────────────────────────────────────────────────────── │
│  Format           Flagship City   Global Flagship  ↗ UP         │
│  Surface          L               XXL              ↗ UP         │
│  Team Size        Large (50)      XXLarge (180)    ↗ UP         │
│  Traffic          L               XL               ↗ UP         │
│  Revenue          High Perf       Exceptional      ↗ UP         │
│  Products         Full Range      Full Range       ✓ MATCH      │
│  Clients          Mixed           Tourist Heavy    → SHIFT      │
│  Operations       Extended        Multi-shift      ↗ UP         │
│  Organization     Specialist      Hybrid           → SHIFT      │
│                                                                 │
│  ────────────────────────────────────────────────────────────── │
│  SUMMARY                                                        │
│  Significant upward progression in scale. New exposure to       │
│  high-tourist environment and hybrid org structure.             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. INTEGRATION WITH MATCHING

### 8.1 Not a Score — A Context

The Store Context comparison is **NOT** added to the matching score. It provides:

- **Qualitative context** for recruiters
- **Self-awareness** for candidates
- **Discussion points** for interviews
- **Transition readiness** indicators

### 8.2 Display Position

```
┌─────────────────────────────────────────────────────────────────┐
│  MATCH: 87%                                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                 │
│  Score Breakdown:                                               │
│  ├── Role Fit: 85%                                              │
│  ├── Division: 90%                                              │
│  ├── Capabilities: 88%                                          │
│  └── [...]                                                      │
│                                                                 │
│  ────────────────────────────────────────────────────────────── │
│                                                                 │
│  CONTEXT FIT                                                    │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ ↗ Scale Progression  • → Client Shift  • ✓ Products Match │ │
│  └───────────────────────────────────────────────────────────┘ │
│  "Upward move to larger format. New tourist clientele."        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. APPENDIX: TYPICAL PROFILES

### 9.1 XXL Flagship Profile

```json
{
  "format": "flagship_global",
  "surface": "xxl",
  "team_size": "xxlarge",
  "daily_traffic": "xl",
  "revenue_scale": "exceptional",
  "product_complexity": "full_range",
  "sku_depth": "comprehensive",
  "client_profile": "tourist_heavy",
  "operating_hours": "multi_shift",
  "org_model": "hybrid"
}
```

### 9.2 City Boutique Profile

```json
{
  "format": "boutique",
  "surface": "m",
  "team_size": "medium",
  "daily_traffic": "m",
  "revenue_scale": "performing",
  "product_complexity": "focused",
  "sku_depth": "standard",
  "client_profile": "local_focused",
  "operating_hours": "standard",
  "org_model": "flat"
}
```

### 9.3 Travel Retail Profile

```json
{
  "format": "travel_retail",
  "surface": "s",
  "team_size": "small",
  "daily_traffic": "l",
  "revenue_scale": "performing",
  "product_complexity": "focused",
  "sku_depth": "limited",
  "client_profile": "tourist_heavy",
  "operating_hours": "extended",
  "org_model": "flat"
}
```

---

*Store Context Model V6 — Operational Reality Framework*
*Based on luxury retail best practices*
*Last updated: December 2025*
