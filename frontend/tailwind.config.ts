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
        primary: { DEFAULT: "#6366f1", dark: "#4f46e5", light: "#818cf8" },
        surface: { DEFAULT: "#1e1e2e", light: "#2a2a3e", lighter: "#363650" },
        accent: { green: "#a6e3a1", red: "#f38ba8", yellow: "#f9e2af", blue: "#89b4fa" },
      },
    },
  },
  plugins: [],
};
export default config;
