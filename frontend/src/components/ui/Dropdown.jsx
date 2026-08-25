import { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';

export default function Dropdown({ trigger, children, align = 'right', className }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            'absolute mt-2 min-w-[12rem] rounded-xl bg-white dark:bg-surface-elevated border border-teal-100 dark:border-teal-200/[0.14] shadow-glass py-1.5 z-40 animate-scale-in origin-top-right',
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ icon: Icon, children, className, ...props }) {
  return (
    <button
      className={cn('w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-left hover:bg-teal-50 dark:hover:bg-teal-900/40 transition-colors', className)}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 text-teal-600" />}
      {children}
    </button>
  );
}
