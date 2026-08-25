import { useRef, useId } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export default function Tabs({ tabs, active, onChange, className }) {
  const refs = useRef([]);
  const instanceId = useId();

  const onKeyDown = (e, index) => {
    let nextIndex = null;
    if (e.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') nextIndex = 0;
    else if (e.key === 'End') nextIndex = tabs.length - 1;
    if (nextIndex !== null) {
      e.preventDefault();
      onChange(tabs[nextIndex].value);
      refs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className={cn('flex items-center gap-1 border-b border-teal-100 dark:border-teal-900/50 overflow-x-auto no-scrollbar', className)} role="tablist">
      {tabs.map((tab, i) => {
        const isActive = active === tab.value;
        return (
          <button
            key={tab.value}
            ref={(el) => (refs.current[i] = el)}
            role="tab"
            id={`tab-${tab.value}`}
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.value}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              'relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2',
              isActive ? 'text-teal-700 dark:text-teal-300' : 'text-ink-light/65 dark:text-ink-dark/65 hover:text-ink-light dark:hover:text-ink-dark'
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="text-xs bg-teal-50 dark:bg-teal-900/40 px-1.5 py-0.5 rounded-full">{tab.count}</span>
            )}
            {isActive && (
              <motion.span
                layoutId={`tabs-underline-${instanceId}`}
                className="absolute left-2 right-2 -bottom-px h-0.5 rounded-full bg-teal-600"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
