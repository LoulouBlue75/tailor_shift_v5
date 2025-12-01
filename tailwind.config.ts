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
        // Primary palette - Quiet Luxury V2
        ivory: {
          DEFAULT: "#F5F0E6",
          warm: "#EDE8DC",
          light: "#FAF8F4",
        },
        gold: {
          DEFAULT: "#C4A962",
          matte: "#C4A962",
          copper: "#B8956E",
          dark: "#9A7B4F",
          light: "#D4BC82",
        },
        charcoal: {
          DEFAULT: "#2C2C2C",
          soft: "#4A4A4A",
        },
        stone: "#D1CCC4",
        "grey-warm": "#8B8178",
        // Legacy aliases for compatibility
        "off-white": "#F5F0E6",
        concrete: "#D1CCC4",
        "matte-gold": "#C4A962",
        "soft-grey": "#8B8178",
        // Semantic colors - Luxury versions
        success: "#7A8B6E",
        warning: "#C4A962",
        error: "#A65D57",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Typography scale from spec
        h1: ["2.5rem", { lineHeight: "1.2", fontWeight: "300" }], // 40px
        h2: ["2rem", { lineHeight: "1.3", fontWeight: "400" }],   // 32px
        h3: ["1.25rem", { lineHeight: "1.4", fontWeight: "500" }],// 20px
        body: ["1rem", { lineHeight: "1.6", fontWeight: "400" }], // 16px
        caption: ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }], // 14px
        label: ["0.75rem", { lineHeight: "1.4", fontWeight: "500" }], // 12px
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
        subtle: "0 1px 2px rgba(0, 0, 0, 0.03)",
        card: "0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
        elevated: "0 4px 12px rgba(0, 0, 0, 0.06)",
        hover: "0 6px 16px rgba(0, 0, 0, 0.08)",
        // Legacy alias
        elevation: "0 4px 12px rgba(0, 0, 0, 0.06)",
      },
      letterSpacing: {
        "luxury-wide": "0.05em",
        "luxury-wider": "0.1em",
      },
    },
  },
  plugins: [],
};

export default config;
