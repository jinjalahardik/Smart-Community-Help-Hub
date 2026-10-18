import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export function FilterBar({ children, className }) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap', className)}>
      {children}
    </div>
  );
}

export function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold text-ink-light/50 dark:text-ink-dark/50 mb-1.5">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-teal-500/50" />}
          {item.href ? (
            <Link to={item.href} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-teal-700 dark:text-teal-300 font-bold">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function PageHeader({ title, description, breadcrumb, actions, className }) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 pt-2', className)}>
      <div className="space-y-1">
        {breadcrumb && <Breadcrumb items={breadcrumb} />}
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink-light dark:text-ink-dark tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-ink-light/65 dark:text-ink-dark/65 font-body max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
}
