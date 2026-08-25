import { Sun, Moon, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';

const OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

/**
 * Full Light / Dark / System control. The quick navbar/topbar toggle
 * (<ThemeToggle />) only flips between light and dark; this segmented
 * control is where "follow system preference" can be selected.
 */
export default function ThemeSelector({ className }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Theme preference"
      className={cn('inline-flex items-center gap-1 p-1 rounded-xl bg-teal-50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-900/50', className)}
    >
      {OPTIONS.map((opt) => {
        const active = theme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(opt.value)}
            className={cn(
              'relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-200 min-h-[44px] sm:min-h-0',
              active ? 'text-white' : 'text-ink-light/60 dark:text-ink-dark/60 hover:text-ink-light dark:hover:text-ink-dark'
            )}
          >
            {active && (
              <motion.span
                layoutId="theme-selector-active"
                className="absolute inset-0 rounded-lg bg-teal-600"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <opt.icon className="relative w-4 h-4" aria-hidden="true" />
            <span className="relative">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
