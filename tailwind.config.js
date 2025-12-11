/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Professional blue dark theme
        background: {
          DEFAULT: "#f8fafc",
          dark: "#020617",
        },
        surface: {
          DEFAULT: "#ffffff",
          dark: "#1e293b",
        },
        primary: "#2563eb", // blue-600
        "primary-dark": "#1d4ed8", // blue-700
        accent: "#38bdf8", // sky-400
        success: "#4ade80",
        warning: "#fbbf24",
        danger: "#ef4444",
        "text-primary": {
          DEFAULT: "#1e293b",
          dark: "#e5e7eb",
        },
        "text-muted": {
          DEFAULT: "#64748b",
          dark: "#94a3b8",
        },
        border: {
          DEFAULT: "rgba(148,163,184,0.3)",
          dark: "rgba(148,163,184,0.5)",
        },
      },
    },
  },
  plugins: [],
}

