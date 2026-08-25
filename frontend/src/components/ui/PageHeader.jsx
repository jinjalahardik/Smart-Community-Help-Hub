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
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-light/60 dark:text-ink-dark/60 mb-1">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5" />}
          {item.href ? (
            <Link to={item.href} className="hover:text-teal-600 transition-colors">{item.label}</Link>
          ) : (
            <span className="text-ink-light dark:text-ink-dark font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function PageHeader({ title, description, breadcrumb, actions, className }) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6', className)}>
      <div>
        {breadcrumb && <Breadcrumb items={breadcrumb} />}
        <h1 className="text-2xl font-display font-bold text-ink-light dark:text-ink-dark">{title}</h1>
        {description && <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
}
