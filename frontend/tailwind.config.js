const colors = require("tailwindcss/colors");
const flowbite = require("flowbite-react/tailwind");

module.exports = {
  content: [
    "./layouts/**/*.html",
    "./content/**/*.md",
    "./content/**/*.html",
    "./src/**/*.js",
  ],
  safelist: [
    "w-64",
    "w-1/2",
    "rounded-l-lg",
    "rounded-r-lg",
    "bg-gray-200",
    "grid-cols-4",
    "grid-cols-7",
    "h-6",
    "leading-6",
    "h-9",
    "leading-9",
    "shadow-lg",
  ],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: [
        "Inter",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
      serif: ["Merriweather", "serif"],
    },
    extend: {
      colors: {
        primary: colors.blue,
        secondary: colors.green,
        // Add other custom colors if needed
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
