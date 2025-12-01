/**
 * Master Classification System - Store Complexity Tiers
 * Defines the 5 tiers of store complexity from T1 (Global Flagship) to T5 (Outlet/Travel)
 */

export const STORE_TIERS = {
  T1: {
    code: "T1",
    name: "Flagship XXL",
    description: "Global flagships (Champs-Élysées, 5th Avenue, Bond Street)",
    typicalTeamSize: { min: 80, max: 200 },
    characteristics: [
      "Iconic location",
      "Full product offering",
      "VIC dedicated spaces",
      "Event capabilities",
      "Global visibility",
    ],
  },
  T2: {
    code: "T2",
    name: "Flagship",
    description: "Major city flagships",
    typicalTeamSize: { min: 40, max: 80 },
    characteristics: [
      "Prime city location",
      "Broad product range",
      "VIC services",
      "High footfall",
    ],
  },
  T3: {
    code: "T3",
    name: "Full Format",
    description: "Full assortment stores",
    typicalTeamSize: { min: 20, max: 40 },
    characteristics: [
      "Complete product categories",
      "Department structure",
      "Standard VIC services",
    ],
  },
  T4: {
    code: "T4",
    name: "Boutique",
    description: "Focused boutiques",
    typicalTeamSize: { min: 8, max: 20 },
    characteristics: [
      "Curated selection",
      "Intimate client experience",
      "Specialized focus",
    ],
  },
  T5: {
    code: "T5",
    name: "Outlet / Travel Retail",
    description: "Outlets, travel retail, concessions",
    typicalTeamSize: { min: 4, max: 15 },
    characteristics: [
      "Limited selection",
      "High volume",
      "Transactional focus",
      "Seasonal variations",
    ],
  },
} as const;

export type StoreTierCode = keyof typeof STORE_TIERS;

export const STORE_TIER_OPTIONS = Object.entries(STORE_TIERS).map(([code, data]) => ({
  value: code,
  label: `${code} - ${data.name}`,
  description: data.description,
}));
