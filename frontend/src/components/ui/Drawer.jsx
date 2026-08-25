import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Drawer({ open, onClose, title, children, side = 'left' }) {
  if (typeof document === 'undefined') return null;
  const x = side === 'left' ? [-320, 0] : [320, 0];
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink-light/40 dark:bg-black/60"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: x[0] }} animate={{ x: x[1] }} exit={{ x: x[0] }}
            transition={{ type: 'tween', duration: 0.22 }}
            className={`relative w-72 max-w-[85vw] h-full bg-white dark:bg-surface-elevated shadow-glass dark:shadow-dark-card flex flex-col ${side === 'right' ? 'ml-auto' : ''}`}
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-teal-100 dark:border-teal-900/50">
              <span className="font-display font-semibold">{title}</span>
              <button onClick={onClose} aria-label="Close menu" className="p-1.5 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/50">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
