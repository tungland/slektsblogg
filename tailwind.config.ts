import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        warm: {
          50: "#fdf8f0",
          100: "#faefd9",
          200: "#f3d9a8",
          300: "#e8be72",
          400: "#dba040",
          500: "#c8872a",
          600: "#a66d22",
          700: "#85541c",
          800: "#6b4319",
          900: "#573618",
        },
        stone: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
