import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

const ThemeContext = createContext(null);

export const THEME_STORAGE_KEY = 'smart-community-theme';
const VALID_THEMES = ['light', 'dark', 'system'];

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return VALID_THEMES.includes(stored) ? stored : 'system';
  } catch {
    // localStorage may be unavailable (privacy mode, etc.)
    return 'system';
  }
}

function getSystemPrefersDark() {
  return typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false;
}

function resolve(theme, systemPrefersDark) {
  return theme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : theme;
}

/**
 * Theme priority:
 *   1. Explicit user choice persisted in localStorage (`light` | `dark`)
 *   2. OS-level `prefers-color-scheme` when the stored/selected value is `system`
 *   3. Light mode, if neither of the above is available
 *
 * `theme` is the user's raw selection (`light` | `dark` | `system`).
 * `resolvedTheme` is the actual applied appearance (`light` | `dark`).
 */
export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readStoredTheme);
  const [systemPrefersDark, setSystemPrefersDark] = useState(getSystemPrefersDark);

  // Track OS-level theme changes so `system` mode stays live.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => setSystemPrefersDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const resolvedTheme = useMemo(() => resolve(theme, systemPrefersDark), [theme, systemPrefersDark]);

  // Apply the resolved theme to the document and persist the raw selection.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', resolvedTheme === 'dark');
    root.setAttribute('data-theme', resolvedTheme);

    const themeColorMeta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', resolvedTheme === 'dark' ? '#081411' : '#F8FAFA');
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore write failures (e.g. storage quota, privacy mode).
    }
  }, [theme, resolvedTheme]);

  const setTheme = useCallback((value) => {
    if (!VALID_THEMES.includes(value)) return;
    setThemeState(value);
  }, []);

  // Quick toggle for the navbar/topbar button: flips between light and dark,
  // always resulting in an explicit (non-system) user preference.
  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const currentlyResolved = resolve(current, getSystemPrefersDark());
      return currentlyResolved === 'dark' ? 'light' : 'dark';
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
