import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#FFF9F1",
        linen: "#F8EFE2",
        wine: "#6F1D2D",
        maroon: "#8A2335",
        charcoal: "#171412",
        ink: "#2B2724",
        blush: "#F4D8D7",
        gold: "#B9852E",
        sage: "#66785F"
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Montserrat", "Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 60px rgba(43, 39, 36, 0.09)",
        line: "0 1px 0 rgba(111, 29, 45, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
