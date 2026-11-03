import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Kannada Naadu palette — inspired by the Karnataka flag 🧡💛 ──
        // Kesari (saffron/red) — pride, energy
        kesari: {
          DEFAULT: "#E63329",
          light: "#F15A50",
          dark: "#C41E14",
          50: "#FEF2F1",
          100: "#FCE0DE",
        },
        // Haldi (gold/yellow) — prosperity, knowledge
        haldi: {
          DEFAULT: "#FFB300",
          light: "#FFD200",
          dark: "#E69500",
          50: "#FFFBEB",
          100: "#FFF3C4",
        },
        // Malnad green — growth, nature
        malnad: {
          DEFAULT: "#1B7A43",
          light: "#2EA866",
          dark: "#115C31",
        },
      },
      backgroundImage: {
        // Kesari → Haldi warm gradient for hero/branding
        "kannada-gradient": "linear-gradient(135deg, #C41E14 0%, #E63329 45%, #FFB300 100%)",
        "kannada-soft": "linear-gradient(135deg, #FEF2F1 0%, #FFFBEB 100%)",
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        warm: "0 10px 30px -10px rgba(230, 51, 41, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
