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
        // Everforest Light (hard) palette
        everforest: {
          bgDim: '#F2EFDF',
          bg0: '#FFFBEF',
          bg1: '#F8F5E4',
          bg2: '#F2EFDF',
          bg3: '#EDEADA',
          bg4: '#E8E5D5',
          bg5: '#BEC5B2',
          bgVisual: '#F0F2D4',
          bgRed: '#FFE7DE',
          bgYellow: '#FEF2D5',
          bgGreen: '#F3F5D9',
          bgBlue: '#ECF5ED',
          bgPurple: '#FCECED',
          fg: '#5C6A72',
          red: '#F85552',
          orange: '#F57D26',
          yellow: '#DFA000',
          green: '#8DA101',
          aqua: '#35A77C',
          blue: '#3A94C5',
          purple: '#DF69BA',
          grey0: '#A6B0A0',
          grey1: '#939F91',
          grey2: '#829181',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;