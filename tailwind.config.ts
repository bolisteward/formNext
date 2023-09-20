import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  corePlugins: {
    aspectRatio: false,
  },
  darkMode: "class",
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    nextui({
      themes: {
        light: {
          colors: {
            background: "#FFFFFF", 
            foreground: "#000F2B", 
            primary: {
              foreground: "#FFFFFF",
              DEFAULT: "#1a6c7a",
            },
            secondary: {
              foreground: "#FFFFFF",
              DEFAULT: "#000F2B",
            },
          },
        },
        dark: {
          colors: {
            background: "#000000", // or DEFAULT
            foreground: "#ECEDEE", // or 50 to 900 DEFAULT
            primary: {
              //... 50 to 900
              foreground: "#FFFFFF",
              DEFAULT: "#006FEE",
            },
          },
          // ... rest of the colors
        },
      },
    }),
  ],
};
export default config;
