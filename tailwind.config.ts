import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary palette - Quiet Luxury
        "off-white": "#FAFAF8",
        charcoal: "#1A1A1A",
        concrete: "#E0E0DA",
        "matte-gold": "#C2A878",
        "soft-grey": "#6B6B6B",
        // Semantic colors
        success: "#2D5A3D",
        warning: "#8B6914",
        error: "#8B2D2D",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "serif"],
        sans: ["var(--font-manrope)", "Manrope", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Typography scale from spec
        h1: ["36px", { lineHeight: "1.2", fontWeight: "500" }],
        h2: ["28px", { lineHeight: "1.3", fontWeight: "500" }],
        h3: ["22px", { lineHeight: "1.4", fontWeight: "600" }],
        body: ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        caption: ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        label: ["12px", { lineHeight: "1.4", fontWeight: "500" }],
      },
      spacing: {
        // Spacing scale
        "tight": "4px",
        "compact": "8px",
        "default": "16px",
        "comfortable": "24px",
        "spacious": "32px",
        "generous": "48px",
        "expansive": "64px",
      },
      borderRadius: {
        DEFAULT: "8px",
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        elevation: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
