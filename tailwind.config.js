/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#FBFAF7",
          surface: "#FFFFFF",
          subtle: "#F6F3EC",
          muted: "#EDE7D8",
        },
        ink: {
          DEFAULT: "#1F2937",
          soft: "#475569",
          mute: "#6B7280",
          ghost: "#94A3B8",
        },
        line: {
          DEFAULT: "#EAE3D2",
          strong: "#D7CCB1",
        },
        rose: { soft: "#F4A6A6", deep: "#D88080", tint: "#FCE6E6" },
        mint: { soft: "#9FD8B6", deep: "#5FB286", tint: "#E2F4EA" },
        sky2: { soft: "#9DC5E8", deep: "#5C95C4", tint: "#E2EEF8" },
        lav: { soft: "#C5B4E3", deep: "#8E76C4", tint: "#EDE7F7" },
        peach: { soft: "#F8C896", deep: "#D69653", tint: "#FCEBD7" },
        sand: { soft: "#E8DCC4", deep: "#B59B6A", tint: "#F6EFDF" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "ui-sans-serif", "sans-serif"],
        display: ['"Fraunces"', "Georgia", "ui-serif", "serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(31, 41, 55, 0.04), 0 4px 16px rgba(31, 41, 55, 0.04)",
        lift: "0 6px 24px rgba(31, 41, 55, 0.08)",
        ring: "0 0 0 1px rgba(215, 204, 177, 0.6)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.85" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        shimmer: "shimmer 2.4s linear infinite",
        "pulse-soft": "pulse-soft 2.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
