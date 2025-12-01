/**
 * Master Classification System - Role Ladder
 * Defines the 8 levels of retail roles from L1 (Sales Advisor) to L8 (Regional Director)
 */

export const ROLE_LEVELS = {
  L1: {
    code: "L1",
    name: "Sales Advisor",
    titleExamples: ["Sales Advisor", "Beauty Consultant", "Client Advisor"],
    scope: "Individual contributor",
    typicalTeamSize: null,
    typicalYearsExperience: { min: 0, max: 2 },
  },
  L2: {
    code: "L2",
    name: "Senior Advisor",
    titleExamples: ["Senior Advisor", "Expert Advisor", "Senior Consultant"],
    scope: "Individual contributor with informal mentoring",
    typicalTeamSize: null,
    typicalYearsExperience: { min: 2, max: 4 },
  },
  L3: {
    code: "L3",
    name: "Team Lead",
    titleExamples: ["Team Lead", "Floor Manager", "Team Supervisor"],
    scope: "Small team (3-8 people)",
    typicalTeamSize: { min: 3, max: 8 },
    typicalYearsExperience: { min: 3, max: 6 },
  },
  L4: {
    code: "L4",
    name: "Department Manager",
    titleExamples: ["Department Manager", "Category Lead", "Section Manager"],
    scope: "Department or category",
    typicalTeamSize: { min: 5, max: 15 },
    typicalYearsExperience: { min: 5, max: 8 },
  },
  L5: {
    code: "L5",
    name: "Assistant Director",
    titleExamples: ["Assistant Boutique Director", "Deputy Manager", "Assistant Store Director"],
    scope: "Boutique-wide support",
    typicalTeamSize: { min: 15, max: 50 },
    typicalYearsExperience: { min: 7, max: 12 },
  },
  L6: {
    code: "L6",
    name: "Boutique Director",
    titleExamples: ["Boutique Director", "Store Manager", "Store Director"],
    scope: "Full boutique P&L responsibility",
    typicalTeamSize: { min: 20, max: 200 },
    typicalYearsExperience: { min: 10, max: 15 },
  },
  L7: {
    code: "L7",
    name: "Area Manager",
    titleExamples: ["Area Manager", "District Director", "Multi-Site Manager"],
    scope: "Multi-store (3-10 stores)",
    typicalTeamSize: { min: 50, max: 300 },
    typicalYearsExperience: { min: 12, max: 18 },
  },
  L8: {
    code: "L8",
    name: "Regional Director",
    titleExamples: ["Regional Director", "Country Manager", "VP Retail"],
    scope: "Region or country",
    typicalTeamSize: { min: 100, max: 1000 },
    typicalYearsExperience: { min: 15, max: 25 },
  },
} as const;

export type RoleLevelCode = keyof typeof ROLE_LEVELS;

export const ROLE_LEVEL_OPTIONS = Object.entries(ROLE_LEVELS).map(([code, data]) => ({
  value: code,
  label: `${code} - ${data.name}`,
  description: data.scope,
}));
