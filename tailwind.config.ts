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
        canvas: "#f5efe7",
        mist: "#fbf8f3",
        ink: "#1f2430",
        muted: "#6f6a62",
        line: "#d9ccbc",
        accent: "#7a6552",
        accentSoft: "#ece1d6",
        success: "#2f6b58",
        danger: "#9b574d",
        gold: "#b48a56",
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
        xs: '2px',
      },
      boxShadow: {
        soft: "0 10px 24px rgba(42, 33, 24, 0.055)",
        panel: "0 16px 38px rgba(42, 33, 24, 0.075)",
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
