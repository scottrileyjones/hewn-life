/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#181714',
        charcoal: '#242220',
        stone: '#F5F0E8',
        marble: '#EDE8DF',
        cream: '#F5F0E8',
        ash: '#A89F92',
        ink: '#1A1814',
        slate: '#6B6560',
        copper: '#B87A40',
        gold: '#C9A84C',
        silver: '#9BA4AE',
        bronze: '#B87A40',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        hero: ['6.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
