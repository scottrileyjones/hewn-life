/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary darks
        iron:    '#1A1815',
        forge:   '#0E0D0B',
        // Warm neutrals
        bone:    '#F2ECE0',
        stone:   '#E8DFC0',
        oat:     '#DCCFB6',
        // Accents (use sparingly)
        copper:  '#B5621C',
        ember:   '#7CB550',
        hewn:    '#8C4612',
        // Earth (primary palette)
        slate:   '#3F4A47',
        moss:    '#4A5348',
        clay:    '#685544',
        // Legacy aliases (mapped to brand)
        obsidian: '#1A1815',
        charcoal: '#2A2824',
        cream:   '#F2ECE0',
        marble:  '#E8DFC0',
        ash:     '#A89F92',
        ink:     '#1A1815',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', '-apple-system', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
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
