import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: "rgba(255, 255, 255, 0.08)",
        "glass-strong": "rgba(255, 255, 255, 0.14)",
        "cine-bg": "#06070B",
        "cine-panel": "#0D111A",
        "cine-accent": "#22D3EE",
        "cine-violet": "#8B5CF6",
        "cine-rose": "#FB7185",
      },
      boxShadow: {
        glow: "0 24px 80px rgba(0, 0, 0, 0.42)",
        glass: "0 20px 70px rgba(0, 0, 0, 0.36), inset 0 1px 0 rgba(255, 255, 255, 0.14)",
      },
    },
  },
  plugins: [],
};

export default config;
