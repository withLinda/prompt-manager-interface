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
        // Everforest Dark palette
        everforest: {
          bgDim: '#232A2E',
          bg0: '#2D353B',
          bg1: '#343F44',
          bg2: '#3D484D',
          bg3: '#475258',
          bg4: '#4F585E',
          bg5: '#56635f',
          bgVisual: '#543A48',
          bgRed: '#514045',
          bgYellow: '#4D4C43',
          bgGreen: '#425047',
          bgBlue: '#3A515D',
          bgPurple: '#4A444E',
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
    },
  },
  plugins: [],
};

export default config;