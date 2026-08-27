/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'harlow-navy': '#0b1222',
        'harlow-cream': '#f4ede0',
        'harlow-gold': '#c9a96e',
        'harlow-card': '#111a2e',
        'harlow-border': '#3d301d',
        'harlow-muted': '#baa58b',
        background: 'hsl(220, 43%, 9%)',
        foreground: 'hsl(34, 33%, 92%)',
        primary: {
          DEFAULT: 'hsl(38, 48%, 60%)',
          foreground: 'hsl(220, 43%, 9%)',
        },
        muted: {
          DEFAULT: 'hsl(220, 40%, 12%)',
          foreground: 'hsl(34, 20%, 65%)',
        },
        border: 'hsl(38, 30%, 22%)',
        card: 'hsl(220, 40%, 12%)',
      },
      fontFamily: {
        serif: ['Libre Baskerville', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,169,110,0.3)',
        'gold-glow': '0 0 30px rgba(201,169,110,0.25)',
      },
    },
  },
  plugins: [],
};
