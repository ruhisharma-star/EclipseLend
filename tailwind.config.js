/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        titanium: {
          950: '#06090F',
          900: '#0B0F19',
          850: '#101726',
          800: '#162033',
          700: '#23334D',
          600: '#334766',
          500: '#4E6587',
          400: '#7C93B3',
        },
        ice: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          accent: '#00F2FE',
          glow: 'rgba(56, 189, 248, 0.25)',
        },
        cyber: {
          emerald: '#10B981',
          gold: '#F59E0B',
          platinum: '#38BDF8',
          rose: '#F43F5E',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'ice-gradient': 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(14, 165, 233, 0.05) 100%)',
        'titanium-card': 'linear-gradient(180deg, rgba(22, 32, 51, 0.7) 0%, rgba(11, 15, 25, 0.85) 100%)',
        'metallic-glow': 'radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.18), transparent 70%)',
      },
      boxShadow: {
        'ice-sm': '0 0 15px -3px rgba(56, 189, 248, 0.15)',
        'ice-md': '0 0 25px -5px rgba(56, 189, 248, 0.25)',
        'ice-lg': '0 0 40px -8px rgba(56, 189, 248, 0.35)',
        'titanium-inset': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-sweep': 'sweep 3s ease-in-out infinite',
      },
      keyframes: {
        sweep: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.9' },
        }
      }
    },
  },
  plugins: [],
};
