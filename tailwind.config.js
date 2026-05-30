/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary darks
        iron:    '#0D0D0D',
        forge:   '#080808',
        // Cool neutrals
        bone:    '#F7F6F3',
        stone:   '#EDEAE4',
        oat:     '#E0DBD2',
        // Accents (use sparingly)
        copper:  '#B5621C',
        ember:   '#6BAD3D',
        hewn:    '#8C4612',
        // Earth (primary palette)
        slate:   '#44514D',
        moss:    '#3D4A3F',
        clay:    '#685544',
        // Legacy aliases (mapped to brand)
        obsidian: '#0D0D0D',
        charcoal: '#222222',
        cream:   '#F7F6F3',
        marble:  '#EDEAE4',
        ash:     '#9A9590',
        ink:     '#0D0D0D',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', '-apple-system', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        accent: ['var(--font-accent)', 'Georgia', 'serif'],
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
