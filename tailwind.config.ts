// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--pm-canvas) / <alpha-value>)",
        surface: "rgb(var(--pm-surface) / <alpha-value>)",
        surfaceStrong: "rgb(var(--pm-surface-strong) / <alpha-value>)",
        surfaceNested: "rgb(var(--pm-surface-nested) / <alpha-value>)",
        surfaceSubtle: "rgb(var(--pm-surface-subtle) / <alpha-value>)",
        ink: "rgb(var(--pm-ink) / <alpha-value>)",
        muted: "rgb(var(--pm-muted) / <alpha-value>)",
        line: "rgb(var(--pm-line) / <alpha-value>)",
        accent: "rgb(var(--pm-accent) / <alpha-value>)",
        accentStrong: "rgb(var(--pm-accent-strong) / <alpha-value>)",
        accentGold: "rgb(var(--pm-accent-gold) / <alpha-value>)",
        accentInk: "rgb(var(--pm-accent-ink) / <alpha-value>)",
        success: "rgb(var(--pm-success) / <alpha-value>)",
        danger: "rgb(var(--pm-danger) / <alpha-value>)",
        overlay: "rgb(var(--pm-overlay) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
        display: ["var(--font-cormorant)", "serif"],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        soft: "var(--pm-shadow-soft)",
        panel: "var(--pm-shadow-panel)",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -18px, 0)" },
        },
        "drift-reverse": {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(14px, 10px, 0)" },
        },
      },
      animation: {
        drift: "drift 12s ease-in-out infinite",
        "drift-reverse": "drift-reverse 14s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
