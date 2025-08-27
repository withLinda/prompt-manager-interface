// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Everforest Dark color palette
export const colors = {
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
  statusline1: '#A7C080',
  statusline2: '#D3C6AA',
  statusline3: '#E67E80'
};