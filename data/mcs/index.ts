/**
 * Master Classification System (MCS)
 * Central export for all classification constants
 */

export * from "./roles";
export * from "./tiers";
export * from "./divisions";
export * from "./blocks";

// Geography constants
export const REGIONS = ["EMEA", "Americas", "APAC", "Middle_East"] as const;
export type Region = (typeof REGIONS)[number];

export const REGION_OPTIONS = [
  { value: "EMEA", label: "EMEA", description: "Europe, Middle East, Africa" },
  { value: "Americas", label: "Americas", description: "North and South America" },
  { value: "APAC", label: "APAC", description: "Asia Pacific" },
  { value: "Middle_East", label: "Middle East", description: "Gulf Region" },
] as const;

// Mobility preferences
export const MOBILITY_OPTIONS = [
  { value: "local", label: "Local", description: "Same city only" },
  { value: "regional", label: "Regional", description: "Same region/country" },
  { value: "national", label: "National", description: "Anywhere in country" },
  { value: "international", label: "International", description: "Open to relocation" },
] as const;

export type Mobility = "local" | "regional" | "national" | "international";

// Timeline preferences
export const TIMELINE_OPTIONS = [
  { value: "active", label: "Actively Looking", description: "Ready for new opportunities now" },
  { value: "passive", label: "Open to Opportunities", description: "Not actively searching but open" },
  { value: "not_looking", label: "Not Looking", description: "Not interested at this time" },
] as const;

export type Timeline = "active" | "passive" | "not_looking";

// Brand segments
export const BRAND_SEGMENTS = [
  { value: "ultra_luxury", label: "Ultra Luxury", description: "Hermès, Chanel, Patek Philippe" },
  { value: "luxury", label: "Luxury", description: "Louis Vuitton, Gucci, Cartier" },
  { value: "premium", label: "Premium", description: "Coach, Michael Kors, TAG Heuer" },
  { value: "accessible_luxury", label: "Accessible Luxury", description: "Entry luxury brands" },
] as const;

export type BrandSegment = "ultra_luxury" | "luxury" | "premium" | "accessible_luxury";
