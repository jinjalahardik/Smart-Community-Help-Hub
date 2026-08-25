import { cn } from '../../utils/cn';

/**
 * Consistent wrapper for a titled block of dashboard content: a small
 * eyebrow-style heading, optional description/actions, and a body.
 * Used to keep spacing and heading style uniform across all dashboards.
 */
export default function DashboardSection({ title, description, actions, children, className, bodyClassName }) {
  return (
    <section className={cn('mb-6', className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <div>
            {title && <h2 className="font-display font-semibold text-base">{title}</h2>}
            {description && <p className="text-xs text-ink-light/65 dark:text-ink-dark/65 mt-0.5">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
