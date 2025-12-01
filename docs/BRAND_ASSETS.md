# Tailor Shift — Brand Assets Guide

> Direction Artistique V1 — Décembre 2024  
> Style : "Quiet Luxury" — Fil d'Ariane × Haute Couture

---

## 1. Logo (OBLIGATOIRE — Ne pas modifier)

| Asset | Fichier | Usage |
|-------|---------|-------|
| Monogramme TS | `/public/brand/logo-monogram.png` | Header principal, Favicon (crop), Loader |
| Logotype | `/public/brand/logo-wordmark.png` | Footer, Header mobile (fallback), OG Image |

### Notes logo
- Le monogramme TS est composé de fils striés dorés sur fond ivoire texturé
- Le "S" script avec le fil qui s'échappe = signature visuelle
- **Ne jamais** : recadrer, recolorer, ajouter d'ombre, mettre sur fond coloré
- **Toujours** : conserver le fond ivoire texturé d'origine ou fond transparent

---

## 2. Palette de couleurs

### Couleurs principales (extraites des assets)

```css
:root {
  /* Fonds */
  --ivory:          #F5F0E6;   /* Fond principal */
  --ivory-warm:     #EDE8DC;   /* Fond alternatif */
  --ivory-light:    #FAF8F4;   /* Fond cards */
  
  /* Or — Accent principal */
  --gold-matte:     #C4A962;   /* Or mat — textes, accents */
  --gold-copper:    #B8956E;   /* Or cuivré — hover, secondaire */
  --gold-dark:      #9A7B4F;   /* Or foncé — textes sur clair */
  --gold-light:     #D4BC82;   /* Or clair — highlights subtils */
  
  /* Neutres */
  --charcoal:       #2C2C2C;   /* Texte principal */
  --charcoal-soft:  #4A4A4A;   /* Texte secondaire */
  --grey-warm:      #8B8178;   /* Texte tertiaire, placeholders */
  --stone:          #D1CCC4;   /* Bordures subtiles, séparateurs */
  
  /* Sémantiques (versions luxe) */
  --success:        #7A8B6E;   /* Vert sauge — discret */
  --warning:        #C4A962;   /* Utiliser gold-matte */
  --error:          #A65D57;   /* Rouge terre — pas agressif */
}
```

### Tailwind config

```js
// tailwind.config.js
colors: {
  ivory: {
    DEFAULT: '#F5F0E6',
    warm: '#EDE8DC',
    light: '#FAF8F4',
  },
  gold: {
    DEFAULT: '#C4A962',
    matte: '#C4A962',
    copper: '#B8956E',
    dark: '#9A7B4F',
    light: '#D4BC82',
  },
  charcoal: {
    DEFAULT: '#2C2C2C',
    soft: '#4A4A4A',
  },
  stone: '#D1CCC4',
  'grey-warm': '#8B8178',
}
```

---

## 3. Typographie

### Recommandations fonts

| Usage | Font suggérée | Fallback | Style |
|-------|---------------|----------|-------|
| H1, H2 (Titres élégants) | Cormorant Garamond | Georgia, serif | 300-400 weight |
| H3, Labels | Inter | system-ui, sans-serif | 500-600 weight |
| Body | Inter | system-ui, sans-serif | 400 weight |
| Monogramme style | Playfair Display | serif | Display only |

### Import Google Fonts

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@400;500;600&display=swap');
```

### Hiérarchie

```css
--font-serif: 'Cormorant Garamond', Georgia, serif;
--font-sans: 'Inter', system-ui, sans-serif;

/* Tailles */
--text-h1: 2.5rem;      /* 40px */
--text-h2: 2rem;        /* 32px */
--text-h3: 1.25rem;     /* 20px */
--text-body: 1rem;      /* 16px */
--text-caption: 0.875rem; /* 14px */
--text-label: 0.75rem;  /* 12px */

/* Letter spacing luxe */
--tracking-wide: 0.05em;   /* Pour labels, nav */
--tracking-wider: 0.1em;   /* Pour titres uppercase */
```

---

## 4. Assets visuels — Mapping d'usage

### Assets obligatoires

| Fichier | Description | Usage UI |
|---------|-------------|----------|
| `logo-monogram.png` | Monogramme TS strié | Header, Favicon |
| `logo-wordmark.png` | "TAILOR SHIFT" lettrage | Footer, Mobile header |

### Assets illustrations

| Fichier | Description | Usage UI suggéré |
|---------|-------------|------------------|
| `hero-thread.png` | Fil horizontal traversant | Landing hero background |
| `thread-ascending.png` | Fil courbe ascendante | Section Talent, Career projection |
| `thread-converging.png` | Fils qui convergent | Section Matching |
| `needle-thread.png` | Aiguille avec fil | Section Brand, Craft accent |
| `thread-serpentine.png` | Fil ondulant vertical | Backgrounds, Transitions |
| `thread-curl.png` | Petit enroulement de fil | Empty states, Placeholders |

### Assets textures

| Fichier | Description | Usage UI |
|---------|-------------|----------|
| `bg-ivory-paper.png` | Texture papier ivoire | Body background (tileable) |
| `bg-ivory-subtle.png` | Ivoire quasi uni | Cards background |

---

## 5. Principes de design

### Do ✓

- Beaucoup d'espace vide (negative space = luxe)
- Ombres très subtiles (`shadow-sm` ou custom)
- Transitions douces (300ms ease)
- Hover states élégants (légère montée d'opacité or)
- Coins légèrement arrondis (`rounded` ou `rounded-lg`, jamais `rounded-full` sauf badges)
- Le fil doré comme élément de liaison entre sections

### Don't ✗

- Bordures dures et visibles partout
- Noir pur (#000) ou blanc pur (#FFF)
- Couleurs saturées (vert vif, rouge vif, bleu)
- Ombres prononcées
- Animations brusques
- Trop de contenu par écran

---

## 6. Composants — Guidelines de refonte

### Buttons

```css
/* Primary */
background: var(--gold-matte);
color: var(--charcoal);
border: none;
/* Hover: légère luminosité */

/* Secondary */
background: transparent;
color: var(--charcoal);
border: 1px solid var(--stone);
/* Hover: border gold-matte */

/* Ghost */
background: transparent;
color: var(--gold-dark);
text-decoration: underline;
```

### Cards

```css
background: var(--ivory-light);
border: none; /* Supprimer les bordures */
box-shadow: 0 1px 3px rgba(0,0,0,0.04);
/* Hover: shadow légèrement plus prononcée */
```

### Inputs

```css
background: white;
border: 1px solid var(--stone);
/* Focus: border-color gold-matte, subtle glow */
```

### Badges

```css
/* Default */
background: var(--ivory-warm);
color: var(--charcoal-soft);

/* Success */
background: rgba(122, 139, 110, 0.15);
color: #5A6B4E;

/* Info/Gold */
background: rgba(196, 169, 98, 0.15);
color: var(--gold-dark);
```

---

## 7. Espacement

```css
/* Plus généreux que défaut */
--space-section: 6rem;    /* Entre sections */
--space-card: 2rem;       /* Padding cards */
--space-stack: 1.5rem;    /* Entre éléments */
--space-inline: 1rem;     /* Gaps horizontaux */
```

---

## 8. Shadows (remplacent les bordures)

```css
--shadow-subtle: 0 1px 2px rgba(0,0,0,0.03);
--shadow-card: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02);
--shadow-elevated: 0 4px 12px rgba(0,0,0,0.06);
--shadow-hover: 0 6px 16px rgba(0,0,0,0.08);
```

---

## 9. Checklist refonte

- [ ] Remplacer `bg-white` par `bg-ivory` ou `bg-ivory-light`
- [ ] Remplacer `border-concrete` par shadows
- [ ] Remplacer `text-black` par `text-charcoal`
- [ ] Remplacer badges verts/rouges par palette luxe
- [ ] Ajouter fonts Cormorant + Inter
- [ ] Intégrer logo monogramme dans header
- [ ] Ajouter texture ivoire en background body
- [ ] Augmenter espacements généraux
- [ ] Ajouter transitions hover (300ms)
- [ ] Intégrer illustrations fil aux sections clés

---

*Document de référence pour la refonte UI Tailor Shift V5*
