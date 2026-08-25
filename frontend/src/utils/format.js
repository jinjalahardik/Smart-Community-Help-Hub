import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

export function formatDate(value, pattern = 'dd MMM yyyy') {
  if (!value) return '—';
  const date = typeof value === 'string' ? parseISO(value) : new Date(value);
  if (!isValid(date)) return '—';
  return format(date, pattern);
}

export function formatDateTime(value) {
  return formatDate(value, 'dd MMM yyyy, hh:mm a');
}

export function timeAgo(value) {
  if (!value) return '—';
  const date = typeof value === 'string' ? parseISO(value) : new Date(value);
  if (!isValid(date)) return '—';
  return formatDistanceToNow(date, { addSuffix: true });
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');
}

export function formatNumber(n) {
  if (n === null || n === undefined) return '0';
  return new Intl.NumberFormat('en-IN').format(n);
}

export function titleCase(str = '') {
  return str
    .replace(/_/g, ' ')
    .replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
}
