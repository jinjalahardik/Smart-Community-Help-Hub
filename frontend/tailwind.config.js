/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#CCFBF1', 100: '#99F6E4', 200: '#5EEAD4', 300: '#2DD4BF',
          400: '#14B8A6', 500: '#0F766E', 600: '#0D6861', 700: '#0A4A46',
          800: '#083B38', 900: '#052A28', 950: '#031B1A',
        },
        brand: {
          deep: '#0A4A46',
          vibrant: '#14B8A6',
          mint: '#CCFBF1',
          accent: '#06B6D4',
        },
        amber: {
          50: '#FFFBEB', 100: '#FEF3C7', 200: '#FDE68A', 300: '#FCD34D',
          400: '#FBBF24', 500: '#F59E0B', 600: '#D97706', 700: '#B45309',
          800: '#92400E', 900: '#78350F',
        },
        coral: {
          50: '#FFF1F2', 100: '#FFE1E3', 200: '#FECDD1', 300: '#FDA4AC',
          400: '#FB7185', 500: '#F43F5E', 600: '#E11D48', 700: '#BE123C',
          800: '#9F1239', 900: '#881337',
        },
        surface: {
          light: '#F8FAFA', teal: '#ECFDFB',
          dark: '#040E0C', darkSecondary: '#081A17', card: '#0D2622', darkElevated: '#12332D', darkSoft: '#18423B',
          elevated: '#12332D', soft: '#18423B',
        },
        ink: {
          light: '#0F2622', secondary: '#475569',
          dark: '#F8FAFC', darkSecondary: '#CBD5E1', darkMuted: '#829A94',
        },
        success: {
          50: '#ECFDF5', 100: '#D1FAE5', 400: '#34D399', 500: '#10B981', 600: '#059669', 900: '#064E3B',
        },
        border: { DEFAULT: 'rgba(15, 118, 110, 0.14)' },
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        sora: ['Sora', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(10, 74, 70, 0.08), 0 4px 16px -4px rgba(10, 74, 70, 0.06)',
        'soft-xl': '0 12px 36px -8px rgba(10, 74, 70, 0.14), 0 4px 12px -2px rgba(12, 33, 30, 0.08)',
        card: '0 1px 3px rgba(12, 33, 30, 0.04), 0 6px 16px -4px rgba(12, 33, 30, 0.06)',
        'card-hover': '0 16px 36px -8px rgba(10, 74, 70, 0.18), 0 4px 14px -2px rgba(20, 184, 166, 0.22)',
        glass: '0 12px 40px 0 rgba(12, 33, 30, 0.14), inset 0 1px 0 0 rgba(255, 255, 255, 0.4)',
        'glass-dark': '0 16px 48px 0 rgba(0, 0, 0, 0.45), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        premium: '0 20px 50px -10px rgba(10, 74, 70, 0.16), 0 10px 20px -5px rgba(10, 74, 70, 0.08)',
        'glow-primary': '0 0 0 3px rgba(20, 184, 166, 0.22), 0 8px 24px -4px rgba(20, 184, 166, 0.35)',
        'glow-teal': '0 0 25px rgba(20, 184, 166, 0.35)',
        'glow-amber': '0 0 25px rgba(245, 158, 11, 0.35)',
        'glow-coral': '0 0 25px rgba(244, 63, 94, 0.35)',
        'glow-emergency': '0 0 0 3px rgba(251, 90, 117, 0.22), 0 8px 24px -4px rgba(244, 63, 94, 0.35)',
        'dark-card': '0 8px 24px -6px rgba(0, 0, 0, 0.5), 0 2px 6px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '2.5xl': '1.5rem',
        '3xl': '1.75rem',
        '4xl': '2rem',
      },
      backdropBlur: { xs: '2px' },
      keyframes: {
        'fade-in': { '0%': { opacity: 0, transform: 'translateY(6px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        'scale-in': { '0%': { opacity: 0, transform: 'scale(0.96)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        shimmer: { '0%': { backgroundPosition: '-400px 0' }, '100%': { backgroundPosition: '400px 0' } },
        'pulse-soft': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.5 } },
        'gradient-mesh': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1)' },
          '33%': { transform: 'translate(5%, -8%) scale(1.08)' },
          '66%': { transform: 'translate(-6%, 6%) scale(0.95)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        shimmer: 'shimmer 1.6s infinite linear',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'gradient-mesh': 'gradient-mesh 8s ease infinite',
        'fade-up': 'fade-up 0.7s ease-out forwards',
        aurora: 'aurora 14s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
