import { AnimatePresence, motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Tooltip from './Tooltip';
import { cn } from '../../utils/cn';

/**
 * Quick light/dark toggle for the navbar and dashboard topbar.
 * Shows a Moon in light mode (click to go dark) and a Sun in dark mode
 * (click to go light). For full Light/Dark/System control, see
 * <ThemeSelector /> used on the Settings pages.
 */
export default function ThemeToggle({ className }) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <Tooltip content={isDark ? 'Switch to light mode' : 'Switch to dark mode'} side="bottom">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className={cn(
          'relative inline-flex items-center justify-center w-11 h-11 rounded-xl',
          'text-ink-light/70 dark:text-ink-dark/70 hover:bg-teal-50 dark:hover:bg-teal-900/40',
          'transition-colors duration-200 active:scale-90',
          className
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? 'sun' : 'moon'}
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex"
          >
            {isDark ? <Sun className="w-[18px] h-[18px]" aria-hidden="true" /> : <Moon className="w-[18px] h-[18px]" aria-hidden="true" />}
          </motion.span>
        </AnimatePresence>
      </button>
    </Tooltip>
  );
}
