import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function SearchInput({ value, onChange, placeholder = 'Search...', debounceMs = 300, className }) {
  const [local, setLocal] = useState(value || '');

  useEffect(() => setLocal(value || ''), [value]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (local !== value) onChange(local);
    }, debounceMs);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local]);

  return (
    <div className={cn('relative', className)}>
      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-500/70" />
      <input
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-xl border border-teal-100 dark:border-teal-900/60 bg-white dark:bg-teal-950/40 pl-10 pr-9 py-2.5 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
      />
      {local && (
        <button
          onClick={() => setLocal('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-light/40 hover:text-ink-light"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
