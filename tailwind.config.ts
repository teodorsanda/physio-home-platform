import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#24a19c",
          dark: "#1b7d79",
          light: "#4dc2bd"
        }
      },
      boxShadow: {
        elevated: "0 20px 45px -20px rgba(36,161,156,0.45)"
      }
    }
  },
  plugins: [tailwindcssAnimate]
};

export default config;
