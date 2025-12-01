/**
 * Master Classification System - Experience Blocks
 * Defines the 6 types of professional experience blocks
 */

export const EXPERIENCE_BLOCKS = {
  foh: {
    code: "foh",
    name: "Front of House",
    description: "Client-facing sales and service",
    examples: [
      "Sales floor responsibilities",
      "Client consultations",
      "Product presentations",
      "Transaction processing",
    ],
    relevantForLevels: ["L1", "L2", "L3", "L4"],
  },
  boh: {
    code: "boh",
    name: "Back of House",
    description: "Stock, operations, logistics",
    examples: [
      "Inventory management",
      "Stock receiving",
      "Visual merchandising setup",
      "Store maintenance",
    ],
    relevantForLevels: ["L1", "L2", "L3"],
  },
  leadership: {
    code: "leadership",
    name: "Leadership",
    description: "Team management and P&L",
    examples: [
      "Team supervision",
      "Performance management",
      "Scheduling and planning",
      "P&L responsibility",
    ],
    relevantForLevels: ["L3", "L4", "L5", "L6", "L7", "L8"],
  },
  clienteling: {
    code: "clienteling",
    name: "Clienteling",
    description: "CRM, VIC management, appointments",
    examples: [
      "VIC relationship management",
      "Client portfolio development",
      "Event hosting",
      "CRM system management",
    ],
    relevantForLevels: ["L2", "L3", "L4", "L5"],
  },
  operations: {
    code: "operations",
    name: "Operations",
    description: "Processes, compliance, inventory",
    examples: [
      "Process optimization",
      "Compliance management",
      "Inventory accuracy",
      "Loss prevention",
    ],
    relevantForLevels: ["L3", "L4", "L5", "L6"],
  },
  business: {
    code: "business",
    name: "Business",
    description: "Strategy, analytics, buying",
    examples: [
      "Business analysis",
      "Strategic planning",
      "Buying decisions",
      "Market intelligence",
    ],
    relevantForLevels: ["L4", "L5", "L6", "L7", "L8"],
  },
} as const;

export type ExperienceBlockCode = keyof typeof EXPERIENCE_BLOCKS;

export const EXPERIENCE_BLOCK_OPTIONS = Object.entries(EXPERIENCE_BLOCKS).map(
  ([code, data]) => ({
    value: code,
    label: data.name,
    description: data.description,
  })
);
