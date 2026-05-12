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
        obsidian: {
          DEFAULT: "#0f0f1a",
          surface: "#1a1a2e",
          card: "#16213e",
        },
        accent: {
          DEFAULT: "#7c3aed", // violet-700
          light: "#a78bfa",   // violet-400
        },
        slate: {
          primary: "#f1f5f9", // slate-100
          muted: "#94a3b8",   // slate-400
        },
        "sleep-border": "#2d2d4e",
      },
    },
  },
  plugins: [],
};
export default config;
