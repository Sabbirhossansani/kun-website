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
        kun: {
          pink: "#ff70c0",
          pinkHover: "#e65cb0",
          dark: "#0F172A",
          accent: "#ec4899",
          softBg: "#F9FAFB",
          surface: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
};
export default config;
