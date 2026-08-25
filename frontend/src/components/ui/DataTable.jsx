import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from './Skeleton';
import EmptyState from './EmptyState';

const MAX_STAGGER_ROWS = 10;

export default function DataTable({ columns, data, loading, emptyMessage = 'No records found', keyField = 'id', renderMobileCard, className }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
        <EmptyState title={emptyMessage} />
      </motion.div>
    );
  }

  const rowDelay = (i) => Math.min(i, MAX_STAGGER_ROWS) * 0.035;

  return (
    <div className={className}>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-teal-100 dark:border-teal-900/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-teal-50/70 dark:bg-teal-900/30 text-left">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-medium text-ink-light/70 dark:text-ink-dark/70 whitespace-nowrap">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-teal-100 dark:divide-teal-900/50">
            <AnimatePresence initial={false}>
              {data.map((row, i) => (
                <motion.tr
                  key={row[keyField]}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: rowDelay(i), ease: [0.22, 1, 0.36, 1] }}
                  className="hover:bg-teal-50/40 dark:hover:bg-teal-900/20 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 align-middle">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        <AnimatePresence initial={false}>
          {data.map((row, i) => (
            <motion.div
              key={row[keyField]}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: rowDelay(i), ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-teal-100 dark:border-teal-900/50 p-4 bg-white dark:bg-teal-950/30"
            >
              {renderMobileCard ? renderMobileCard(row) : (
                <div className="space-y-1.5">
                  {columns.map((col) => (
                    <div key={col.key} className="flex justify-between text-xs gap-3">
                      <span className="text-ink-light/65 dark:text-ink-dark/65">{col.header}</span>
                      <span className="text-right">{col.render ? col.render(row) : row[col.key]}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
