import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <nav className="flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Previous page"
        className="p-2 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/40 disabled:opacity-40"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {pages.map((p, i) => (
        <span key={p} className="flex items-center">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-ink-light/40">…</span>}
          <button
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              'w-8 h-8 rounded-lg text-sm font-medium',
              p === page ? 'bg-teal-600 text-white' : 'hover:bg-teal-50 dark:hover:bg-teal-900/40'
            )}
          >
            {p}
          </button>
        </span>
      ))}
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Next page"
        className="p-2 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/40 disabled:opacity-40"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
