/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1F3D2B',
          light: '#2C5239',
          dark: '#142B1D',
        },
        moss: {
          DEFAULT: '#4C7A54',
          light: '#6B9873',
          dark: '#3A5F41',
        },
        sage: {
          DEFAULT: '#E8EFE4',
          dark: '#D3E0CC',
        },
        clay: {
          DEFAULT: '#C1693B',
          light: '#D98A5F',
          dark: '#A0522C',
        },
        cream: '#FAF8F3',
        ink: '#22281F',
        warn: {
          DEFAULT: '#D9A441',
          bg: '#FBF1DC',
        },
        critical: {
          DEFAULT: '#C1473B',
          bg: '#FBE4E1',
        },
        ok: {
          DEFAULT: '#4C7A54',
          bg: '#E4EFE0',
        },
      },
      fontFamily: {
        display: ["'Lora'", 'serif'],
        body: ["'Work Sans'", 'sans-serif'],
      },
      keyframes: {
        droplet: {
          '0%': { transform: 'translateY(-6px) scale(0.6)', opacity: '0' },
          '30%': { opacity: '1' },
          '100%': { transform: 'translateY(14px) scale(1)', opacity: '0' },
        },
        pulseBadge: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.08)', opacity: '0.75' },
        },
      },
      animation: {
        droplet: 'droplet 0.7s ease-out forwards',
        'pulse-badge': 'pulseBadge 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
