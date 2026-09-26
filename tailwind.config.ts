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
        emons: {
          red: "#E5402C",
          redHover: "#CF3722",
          ink: "#1A1A1A",
          body: "#6E6E6E",
          muted: "#9A9A9A",
          soft: "#F6F6F5",
          pillOutline: "#F6C9BE",
          pillOutlineDark: "#F2A28E",
          mint: "#B7CEC1",
          mint2: "#DCE7DE",
          tealDark: "#7C9C8C",
        },
        paccar: {
          blue: "#005A9C",
          deep: "#003B64",
          red: "#E31837",
          darkred: "#B5122A",
          softblue: "#EFF6FF",
          softred: "#FFF1F2",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#F8FAFC",
          muted: "#F1F5F9",
          border: "#E4E7EC",
          borderDark: "#CBD5E1",
        },
        industrial: {
          dark: "#0F172A",
          charcoal: "#1E293B",
          metal: "#334155",
          steel: "#475569",
          muted: "#667085",
          caption: "#98A2B3",
        },
        status: {
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",
          info: "#005A9C",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Inter",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 24, 40, 0.04)",
        elevated: "0 8px 24px rgba(16, 24, 40, 0.06)",
        modal: "0 20px 60px rgba(16, 24, 40, 0.12)",
      },
      borderRadius: {
        sm: "8px",
        input: "10px",
        card: "14px",
        feature: "18px",
        modal: "20px",
      },
    },
  },
  plugins: [],
};
export default config;
