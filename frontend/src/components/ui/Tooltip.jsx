import { useState } from 'react';
import { cn } from '../../utils/cn';

export default function Tooltip({ children, content, side = 'top' }) {
  const [show, setShow] = useState(false);
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && (
        <span
          role="tooltip"
          className={cn(
            'absolute z-50 whitespace-nowrap rounded-lg bg-ink-light dark:bg-ink-dark text-white dark:text-ink-light text-xs px-2.5 py-1.5 shadow-glass pointer-events-none',
            positions[side]
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
