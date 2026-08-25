import { cn } from '../../utils/cn';
import { initials } from '../../utils/format';

const SIZES = { xs: 'w-6 h-6 text-[10px]', sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg' };

export default function Avatar({ name = '', color = '#0F766E', size = 'md', className }) {
  return (
    <div
      className={cn('rounded-full flex items-center justify-center font-display font-semibold text-white shrink-0', SIZES[size], className)}
      style={{ backgroundColor: color }}
      aria-label={name}
    >
      {initials(name) || '?'}
    </div>
  );
}
