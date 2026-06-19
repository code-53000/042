/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        workspace: {
          bg: '#141418',
          surface: '#1e1e24',
          card: '#26262e',
          border: '#3a3a44',
          borderHover: '#4a4a55',
          muted: '#8a8a95',
          text: '#e8e8ed',
          textDim: '#a8a8b3',
        },
        mecha: {
          blue: '#4f8cff',
          blueHover: '#6fa0ff',
          blueGlow: 'rgba(79, 140, 255, 0.25)',
          orange: '#ff8c42',
          orangeHover: '#ffa366',
          orangeGlow: 'rgba(255, 140, 66, 0.25)',
          green: '#4ade80',
          greenGlow: 'rgba(74, 222, 128, 0.25)',
          red: '#f87171',
          purple: '#a78bfa',
          yellow: '#fbbf24',
        },
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(79, 140, 255, 0.3)',
        'glow-orange': '0 0 20px rgba(255, 140, 66, 0.3)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.4)',
        'inner-groove': 'inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.3)',
      },
      backgroundImage: {
        'gradient-metal': 'linear-gradient(135deg, rgba(79,140,255,0.05), rgba(255,140,66,0.05))',
        'gradient-card': 'linear-gradient(180deg, #2a2a32 0%, #1e1e24 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [],
};
