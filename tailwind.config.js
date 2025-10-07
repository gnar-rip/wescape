// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "osrs-black": "#0c0e0f",
        "osrs-stone": "#141618",
        "osrs-slate": "#1b1f22",
        "osrs-border": "#2a2f33",

        "osrs-gold": "#c8aa6e",

        "osrs-text-primary": "#e5e7eb",
        "osrs-text-secondary": "#a3a7ad",
        "osrs-text-muted": "#8b8f95",

        "osrs-accent-blue": "#66a3ff",
        "osrs-accent-green": "#6bbf59",
        "osrs-accent-red": "#e55c5c",
        "osrs-accent-orange": "#ffb547",
      },
      boxShadow: {
        "osrs-card": "0 6px 24px rgba(0,0,0,0.35)",
      },
      borderRadius: {
        xl: "0.75rem",
      },
    },
  },
  plugins: [],
};


