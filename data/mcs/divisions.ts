/**
 * Master Classification System - Divisions
 * Defines the 9 product divisions in luxury retail
 */

export const DIVISIONS = {
  fashion: {
    code: "fashion",
    name: "Fashion",
    description: "Ready-to-wear, haute couture, textiles",
    relatedDivisions: ["leather_goods", "shoes", "accessories"],
  },
  leather_goods: {
    code: "leather_goods",
    name: "Leather Goods",
    description: "Handbags, small leather goods, luggage",
    relatedDivisions: ["fashion", "shoes", "accessories"],
  },
  shoes: {
    code: "shoes",
    name: "Shoes",
    description: "Footwear for all occasions",
    relatedDivisions: ["fashion", "leather_goods"],
  },
  beauty: {
    code: "beauty",
    name: "Beauty",
    description: "Skincare, makeup, cosmetics",
    relatedDivisions: ["fragrance"],
  },
  fragrance: {
    code: "fragrance",
    name: "Fragrance",
    description: "Perfumes, colognes, home fragrances",
    relatedDivisions: ["beauty"],
  },
  watches: {
    code: "watches",
    name: "Watches",
    description: "Timepieces, watch accessories",
    relatedDivisions: ["high_jewelry", "accessories"],
  },
  high_jewelry: {
    code: "high_jewelry",
    name: "High Jewelry",
    description: "Fine jewelry, precious stones",
    relatedDivisions: ["watches", "accessories"],
  },
  eyewear: {
    code: "eyewear",
    name: "Eyewear",
    description: "Sunglasses, optical frames",
    relatedDivisions: ["accessories"],
  },
  accessories: {
    code: "accessories",
    name: "Accessories",
    description: "Scarves, belts, ties, costume jewelry",
    relatedDivisions: ["fashion", "leather_goods"],
  },
} as const;

export type DivisionCode = keyof typeof DIVISIONS;

export const DIVISION_OPTIONS = Object.entries(DIVISIONS).map(([code, data]) => ({
  value: code,
  label: data.name,
  description: data.description,
}));

/**
 * Get related divisions for cross-matching
 */
export function getRelatedDivisions(divisionCode: DivisionCode): readonly string[] {
  return DIVISIONS[divisionCode]?.relatedDivisions ?? [];
}
