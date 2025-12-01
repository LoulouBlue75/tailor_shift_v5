export const STEPS = [
  { id: 1, name: "Account", path: null }, // Completed via auth
  { id: 2, name: "Identity", path: "identity" },
  { id: 3, name: "Professional", path: "professional" },
  { id: 4, name: "Divisions", path: "divisions" },
  { id: 5, name: "Preferences", path: "preferences" },
  { id: 6, name: "Experience", path: "experience" },
  { id: 7, name: "Assessment", path: "assessment-intro" },
] as const;

export type Step = (typeof STEPS)[number];
