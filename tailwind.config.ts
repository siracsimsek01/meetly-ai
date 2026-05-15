import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Surface palette - inky greens
        ink: {
          950: '#06090A',
          900: '#0A0F10',
          850: '#0E1416',
          800: '#121A1C',
          700: '#192123',
          600: '#1F292B',
          500: '#2A3537',
        },
        // Vibrant mint/teal accent
        mint: {
          50: '#E7FFF8',
          100: '#C8FFEC',
          200: '#9CFFDD',
          300: '#5FFCC8',
          400: '#36F0B6',
          500: '#1FDBA0',
          600: '#15B583',
          700: '#0E8C66',
        },
        // Coral / leave call
        coral: {
          400: '#FF7A5C',
          500: '#FF5340',
          600: '#E63E2D',
        },
        // Soft accents for tags / status
        amber: {
          400: '#FFB547',
        },
        // Neutral text variants
        muted: {
          DEFAULT: '#7F8B8E',
          soft: '#A6B0B3',
          strong: '#D6DDDF',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(54, 240, 182, 0.18), 0 12px 40px -12px rgba(54, 240, 182, 0.35)',
        panel: '0 30px 80px -40px rgba(0, 0, 0, 0.65)',
        ring: 'inset 0 0 0 1px rgba(255,255,255,0.04)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
        'fade-up': 'fade-up 0.4s ease-out both',
        shimmer: 'shimmer 2.4s linear infinite',
      },
      backgroundImage: {
        'mesh-dark':
          'radial-gradient(circle at 0% 0%, rgba(54, 240, 182, 0.10), transparent 50%), radial-gradient(circle at 100% 100%, rgba(255, 83, 64, 0.06), transparent 45%), radial-gradient(circle at 50% 50%, rgba(31, 219, 160, 0.04), transparent 60%)',
        'hero-grid':
          'linear-gradient(135deg, rgba(54, 240, 182, 0.12), rgba(54, 240, 182, 0.02) 60%, transparent 100%)',
        noise:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.06 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;

export default config;
