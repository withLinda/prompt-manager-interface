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
        // Everforest Dark (hard) palette
        everforest: {
          bgDim: '#1E2326',
          bg0: '#272E33',
          bg1: '#2E383C',
          bg2: '#374145',
          bg3: '#414B50',
          bg4: '#495156',
          bg5: '#4F5B58',
          bgVisual: '#4C3743',
          bgRed: '#493B40',
          bgYellow: '#45443c',
          bgGreen: '#3C4841',
          bgBlue: '#384B55',
          bgPurple: '#463F48',
          fg: '#D3C6AA',
          red: '#E67E80',
          orange: '#E69875',
          yellow: '#DBBC7F',
          green: '#A7C080',
          aqua: '#83C092',
          blue: '#7FBBB3',
          purple: '#D699B6',
          grey0: '#7A8478',
          grey1: '#859289',
          grey2: '#9DA9A0',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;