/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#ECFDFB', 100: '#D8F3EE', 200: '#B4E7DD', 300: '#5EEAD4',
          400: '#2DD4BF', 500: '#0F766E', 600: '#0F766E', 700: '#115E59',
          800: '#0A4C47', 900: '#083F3B', 950: '#042321',
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
          // Layered dark-mode surfaces: page background -> card -> elevated (modals/dropdowns) -> soft (hover accents)
          dark: '#081411', darkSecondary: '#0D1D19', card: '#112824', darkElevated: '#17332D', darkSoft: '#1B3B34',
          // Aliases consumed via `dark:bg-surface-elevated` / `dark:bg-surface-soft` across the app.
          elevated: '#17332D', soft: '#1B3B34',
        },
        ink: {
          light: '#10221F', secondary: '#64748B',
          dark: '#F1F8F6', darkSecondary: '#BDD0CB', darkMuted: '#829A94',
        },
        success: {
          50: '#ECFDF5', 100: '#D1FAE5', 400: '#34D399', 500: '#10B981', 600: '#059669', 900: '#064E3B',
        },
        border: { DEFAULT: 'rgba(15, 118, 110, 0.14)' },
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(15, 118, 110, 0.08), 0 4px 16px -4px rgba(15, 118, 110, 0.06)',
        card: '0 1px 2px rgba(12, 33, 30, 0.04), 0 4px 12px -2px rgba(12, 33, 30, 0.06)',
        'card-hover': '0 4px 8px rgba(12, 33, 30, 0.06), 0 12px 24px -4px rgba(12, 33, 30, 0.10)',
        glass: '0 8px 32px rgba(12, 33, 30, 0.12)',
        'glow-primary': '0 0 0 3px rgba(45, 212, 191, 0.16)',
        'glow-emergency': '0 0 0 3px rgba(251, 90, 117, 0.16)',
        'dark-card': '0 4px 16px -4px rgba(0, 0, 0, 0.35)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      backdropBlur: { xs: '2px' },
      keyframes: {
        'fade-in': { '0%': { opacity: 0, transform: 'translateY(6px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        'scale-in': { '0%': { opacity: 0, transform: 'scale(0.96)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        shimmer: { '0%': { backgroundPosition: '-400px 0' }, '100%': { backgroundPosition: '400px 0' } },
        'pulse-soft': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.5 } },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        shimmer: 'shimmer 1.6s infinite linear',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
