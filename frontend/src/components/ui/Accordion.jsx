import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Accordion({ items, allowMultiple = false, defaultOpen = [] }) {
  const [openItems, setOpenItems] = useState(defaultOpen);

  const toggle = (id) => {
    setOpenItems((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      return allowMultiple ? [...prev, id] : [id];
    });
  };

  return (
    <div className="divide-y divide-teal-100 dark:divide-teal-900/50 rounded-2xl border border-teal-100 dark:border-teal-900/50 overflow-hidden">
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);
        return (
          <div key={item.id}>
            <button
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium hover:bg-teal-50/50 dark:hover:bg-teal-900/20 transition-colors"
            >
              {item.question}
              <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }} className="shrink-0">
                <ChevronDown className="w-4 h-4" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ height: { duration: 0.28, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.2 } }}
                  className="overflow-hidden"
                >
                  <div className={cn('px-5 pb-4 text-sm text-ink-light/70 dark:text-ink-dark/70')}>
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
