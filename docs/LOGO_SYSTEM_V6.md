# Tailor Shift V6 - Logo System

> Documentation complète du système de logos et monogrammes

---

## 📁 Fichiers Sources

### Logo Principal (Sélectionné)
```
docs/magnifics_upscaleTS_premier_choix.svg
```
- **Type**: Monogramme "TS" en fil d'or
- **Style**: Lettres entrelacées élégantes
- **Usage**: Logo principal sur tous supports

### Variations Disponibles
| Fichier | Description | Usage |
|---------|-------------|-------|
| `magnifics_upscaleTS_premier_choix.svg` | Monogramme principal | Header, favicon, signatures |
| `magnifics_upscaleTS_premier_choixsds.svg` | Variation alternative | À évaluer |
| `logo_vectorized_tailor_shift_V1.svg` | Logo complet avec texte | Pages marketing |
| `logo_vectorized_tailor_shift_texte_seul.svg` | Texte seul | Footer, documents |
| `Logo_TS_5.svg` | Version V5 legacy | Archive |

---

## 🎨 Implémentation

### Formats Requis pour V6
```
public/logo/
├── logo-full.svg          # Logo complet (monogramme + texte)
├── logo-monogram.svg      # Monogramme seul (TS)
├── logo-text.svg          # Texte seul
├── favicon.ico            # Favicon 32x32
├── favicon-16.png         # 16x16
├── favicon-32.png         # 32x32
├── apple-touch-icon.png   # 180x180
├── og-image.png           # 1200x630 (Open Graph)
└── logo-white.svg         # Version blanche pour fonds sombres
```

### Couleurs du Logo
```css
/* Fil d'or */
--logo-gold: #C9A962;
--logo-gold-light: #D4BC7B;
--logo-gold-dark: #A68B4D;

/* Fond */
--logo-bg-ivory: #F5F3EF;
--logo-bg-charcoal: #2C2C2C;
```

---

## 📐 Zones de Protection

```
┌─────────────────────────────┐
│          X spacing          │
│    ┌─────────────────┐      │
│ X  │                 │  X   │
│    │   TS MONOGRAM   │      │
│    │                 │      │
│ X  └─────────────────┘  X   │
│          X spacing          │
└─────────────────────────────┘

X = Hauteur de la lettre "T"
```

### Tailles Minimales
- **Print**: 15mm de largeur minimum
- **Digital**: 32px de largeur minimum
- **Favicon**: 16px (version simplifiée)

---

## 🖼️ Contextes d'Usage

### Header Navigation
```tsx
<Image 
  src="/logo/logo-monogram.svg"
  alt="Tailor Shift"
  width={40}
  height={40}
/>
```

### Footer
```tsx
<Image 
  src="/logo/logo-full.svg"
  alt="Tailor Shift"
  width={160}
  height={40}
/>
```

### Favicon (next.config)
```tsx
// app/layout.tsx
export const metadata = {
  icons: {
    icon: '/logo/favicon.ico',
    apple: '/logo/apple-touch-icon.png',
  },
}
```

---

## ✅ Décisions V6

| Aspect | Décision |
|--------|----------|
| Logo principal | `magnifics_upscaleTS_premier_choix.svg` |
| Typographie logo | Cormorant Garamond (approximation) |
| Couleur fil | Gold #C9A962 |
| Style monogramme | TS entrelacés, fil d'or élégant |

---

## 📋 Tasks pour V6

- [ ] Exporter SVG propres depuis fichiers sources
- [ ] Générer toutes les tailles PNG
- [ ] Créer favicon.ico multi-résolution
- [ ] Créer version white pour dark mode
- [ ] Générer og-image.png pour réseaux sociaux
- [ ] Organiser dans `public/logo/`
- [ ] Mettre à jour metadata dans layout.tsx

---

*Logo System V6 - Partie intégrante de BRAND_GUIDELINES_V6.md*
