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
        background: "#FFFFF5",
        foreground: "#111827",
        primary: {
          DEFAULT: "#C9940A",
          dark: "#B8922A",
        },
        burgundy: {
          DEFAULT: "#3D0C1A",
          dark: "#2A0812",
        },
        ivory: "#FFFFF5",
      },
      fontFamily: {
        serif: ["var(--font-sans)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
