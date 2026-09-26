import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paccar-aligned palette
        primary: {
          DEFAULT: "#005A9C",
          50: "#E6F0F9",
          100: "#CCE1F3",
          200: "#99C3E7",
          300: "#66A5DB",
          400: "#3387CF",
          500: "#005A9C",
          600: "#004B82",
          700: "#003C68",
          800: "#002D4E",
          900: "#001E34",
        },
        accent: {
          DEFAULT: "#E31837",
          50: "#FDE8EB",
          100: "#FBD1D8",
          200: "#F7A3B1",
          300: "#F3758A",
          400: "#EF4763",
          500: "#E31837",
          600: "#BC132E",
          700: "#940F24",
          800: "#6D0B1B",
          900: "#460711",
        },
        surface: {
          DEFAULT: "#F8FAFC",
          50: "#FFFFFF",
          100: "#F8FAFC",
          200: "#F1F5F9",
          300: "#E2E8F0",
          400: "#CBD5E1",
          500: "#94A3B8",
        },
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        dark: {
          DEFAULT: "#0F172A",
          100: "#1E293B",
          200: "#334155",
          300: "#475569",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px",
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 90, 156, 0.15)",
        "glow-accent": "0 0 20px rgba(227, 24, 55, 0.15)",
        card: "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 10px 25px rgba(0, 0, 0, 0.08), 0 4px 10px rgba(0, 0, 0, 0.04)",
      },
      animation: {
        "slide-in": "slideIn 0.3s ease-out",
        "fade-in": "fadeIn 0.4s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "bar-fill": "barFill 0.8s ease-out forwards",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        barFill: {
          "0%": { width: "0%" },
          "100%": { width: "var(--bar-width)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
