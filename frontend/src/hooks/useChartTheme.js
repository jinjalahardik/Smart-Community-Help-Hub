import { useTheme } from '../context/ThemeContext';

/**
 * Recharts renders raw SVG attributes (stroke/fill) which can't respond to
 * Tailwind's `dark:` class variant, so chart colors need actual JS values.
 * This hook is the single place those values are defined for both themes,
 * consumed by every dashboard/report chart instead of each page hardcoding
 * its own hex strings.
 */
export function useChartTheme() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return {
    axisColor: isDark ? '#829A94' : '#0F766E',
    axisTick: { fontSize: 12, fill: isDark ? '#BDD0CB' : '#10221F' },
    gridColor: isDark ? '#2DD4BF' : '#0F766E',
    gridOpacity: isDark ? 0.12 : 0.1,
    primary: isDark ? '#2DD4BF' : '#0F766E',
    secondary: isDark ? '#FBBF24' : '#F59E0B',
    emergency: isDark ? '#FB5A75' : '#F43F5E',
    success: isDark ? '#34D399' : '#059669',
    pieColors: isDark
      ? ['#2DD4BF', '#FBBF24', '#FB5A75', '#5EEAD4']
      : ['#0F766E', '#F59E0B', '#FB7185', '#4FB8A6'],
    tooltipStyle: {
      borderRadius: 12,
      fontSize: 13,
      background: isDark ? '#17332D' : '#FFFFFF',
      color: isDark ? '#F1F8F6' : '#10221F',
      border: `1px solid ${isDark ? 'rgba(148, 210, 198, 0.14)' : '#D8F3EE'}`,
      boxShadow: isDark ? '0 4px 16px -4px rgba(0, 0, 0, 0.35)' : '0 4px 12px -2px rgba(12, 33, 30, 0.08)',
    },
    tooltipLabelStyle: { color: isDark ? '#F1F8F6' : '#10221F', fontWeight: 600 },
    tooltipItemStyle: { color: isDark ? '#BDD0CB' : '#64748B' },
    legendStyle: { fontSize: 12, color: isDark ? '#BDD0CB' : '#64748B' },
  };
}
