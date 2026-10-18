/**
 * Smart Community Help Hub - 2026 Design Tokens
 * 
 * Color Palette Hierarchy:
 * - Brand Action: Emerald & Deep Teal (#0F766E, #14B8A6, #2DD4BF)
 * - Information & Trust: Cyan & Electric Blue (#06B6D4, #38BDF8)
 * - Emergency / SOS Only: Coral & Crimson (#F43F5E, #FB7185, #BE123C)
 * - Neutral Dark: Deep Navy & Charcoal (#040E0C, #081A17, #0D2622, #12332D)
 * - Neutral Light: Porcelain (#F8FAFC), Pure White (#FFFFFF), Subtle Sage (#ECFDFB)
 */

export const TOKENS = {
  colors: {
    brand: {
      primary: '#0F766E',      // Emerald / Deep Teal
      primaryHover: '#115E59',
      primaryLight: '#2DD4BF', // Vibrant Teal
      accent: '#06B6D4',       // Electric Cyan
      glow: 'rgba(45, 212, 191, 0.35)',
    },
    emergency: {
      base: '#F43F5E',         // Coral / Rose
      hover: '#E11D48',
      light: '#FB7185',
      glow: 'rgba(244, 63, 94, 0.4)',
    },
    surface: {
      light: '#F8FAFC',
      lightCard: '#FFFFFF',
      lightBorder: 'rgba(15, 118, 110, 0.12)',
      dark: '#040E0C',
      darkSecondary: '#081A17',
      darkCard: '#0D2622',
      darkElevated: '#12332D',
      darkBorder: 'rgba(45, 212, 191, 0.18)',
    },
    ink: {
      light: '#0A1C19',
      lightMuted: '#475569',
      dark: '#F8FAFC',
      darkMuted: '#94A3B8',
    },
  },
  typography: {
    fonts: {
      display: 'Plus Jakarta Sans, Outfit, sans-serif',
      body: 'Inter, sans-serif',
    },
  },
  transitions: {
    smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
};
