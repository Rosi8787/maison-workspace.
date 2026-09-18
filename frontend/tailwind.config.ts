import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Legacy primary (kept for admin pages)
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
        // New dark warm brown palette
        warm: {
          50:  '#faf6f1',
          100: '#f4ece0',
          200: '#e8d5bc',
          300: '#d9b896',
          400: '#c9976a',
          500: '#b87d4a',
          600: '#a0652f',
          700: '#7d4e22',
          800: '#5c3a1a',
          900: '#3d2710',
          950: '#261a0e',
        },
        // Base dark browns
        base: {
          bg:      '#120d0b',
          surface: '#1c1410',
          card:    '#221a14',
          border:  '#2e231b',
          muted:   '#3d3028',
        },
        // Accent gold/amber
        accent: {
          DEFAULT: '#c9a77a',
          light:   '#ddc09a',
          dark:    '#a07a4a',
          muted:   '#8b6b3d',
        },
        // Foreground
        fg: {
          DEFAULT: '#f4eee7',
          muted:   '#b8a898',
          subtle:  '#7a6a5a',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-geist-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['4.5rem',  { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-xl':  ['3.75rem', { lineHeight: '1.08', letterSpacing: '-0.025em' }],
        'display-lg':  ['3rem',    { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
        'display-md':  ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        'display-sm':  ['1.875rem',{ lineHeight: '1.2',  letterSpacing: '-0.01em' }],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
        'glass-sm': '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
        'card-hover': '0 24px 64px rgba(0, 0, 0, 0.6), 0 8px 24px rgba(0, 0, 0, 0.4)',
        'accent': '0 0 24px rgba(201, 167, 122, 0.2)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      backdropBlur: {
        xs: '4px',
      },
      animation: {
        'fade-in':     'fadeIn 0.5s ease-out forwards',
        'fade-up':     'fadeUp 0.6s ease-out forwards',
        'fade-up-sm':  'fadeUpSm 0.5s ease-out forwards',
        'slide-in':    'slideIn 0.4s ease-out forwards',
        'shimmer':     'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeUpSm: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-sm': 'cubic-bezier(0.34, 1.3, 0.64, 1)',
      },
    },
  },
  plugins: [],
}

export default config
