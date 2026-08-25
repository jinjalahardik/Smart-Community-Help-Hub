import { Card } from '../ui/Card';

export default function ChartCard({ title, subtitle, actions, children, height = 280 }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-display font-semibold">{title}</p>
          {subtitle && <p className="text-xs text-ink-light/65 dark:text-ink-dark/65 mt-0.5">{subtitle}</p>}
        </div>
        {actions}
      </div>
      <div style={{ width: '100%', height }}>{children}</div>
    </Card>
  );
}
