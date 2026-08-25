import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, X } from 'lucide-react';
import { useChat } from './ChatContext';

export default function ChatButton() {
  const { isOpen, toggleChat, showWelcomePopup, dismissWelcomePopup, openChat } = useChat();
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 650);
    toggleChat();
  };

  return (
    <div className="fixed bottom-[88px] right-4 lg:bottom-6 lg:right-6 z-[70] flex flex-col items-end gap-3">
      {/* Welcome popup */}
      <AnimatePresence>
        {showWelcomePopup && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="w-64 sm:w-72 rounded-2xl p-4 bg-white dark:bg-surface-elevated border border-teal-100 dark:border-teal-200/[0.18] shadow-glass dark:shadow-dark-card ring-1 ring-black/[0.03] dark:ring-white/[0.06]"
            role="dialog"
            aria-label="Chat assistant welcome message"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shrink-0 shadow-soft">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink-light dark:text-ink-dark leading-snug">👋 Hi! Need help?</p>
                <p className="text-xs mt-0.5 text-ink-light/75 dark:text-ink-dark/75">I'm your Smart Community AI Assistant.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3.5">
              <button
                type="button"
                onClick={() => { openChat(); }}
                className="flex-1 text-xs font-semibold px-3 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 shadow-soft transition-colors"
              >
                Ask Me
              </button>
              <button
                type="button"
                onClick={dismissWelcomePopup}
                aria-label="Dismiss welcome message"
                className="text-xs font-medium px-3 py-2 rounded-lg text-ink-light/75 dark:text-ink-dark/75 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-surface-soft transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        type="button"
        onClick={handleClick}
        aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
        aria-expanded={isOpen}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{
          opacity: 1,
          scale: [1, 1.07, 1],
          y: [0, -6, 0],
        }}
        transition={{
          opacity: { duration: 0.3 },
          scale: { duration: 0.6, repeat: Infinity, repeatDelay: 7.4, ease: 'easeInOut' },
          y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
        }}
        whileHover={{ scale: 1.08, boxShadow: '0 0 0 10px rgba(45, 212, 191, 0.16), 0 12px 32px -4px rgba(15, 118, 110, 0.45)' }}
        whileTap={{ scale: 0.94 }}
        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-teal-500 to-teal-700 shadow-[0_8px_24px_-4px_rgba(15,118,110,0.5)] border border-white/20 backdrop-blur-sm"
      >
        {/* Glass sheen overlay */}
        <span className="absolute inset-0 bg-gradient-to-br from-white/25 via-white/5 to-transparent pointer-events-none" aria-hidden="true" />

        {/* Ripple click effect */}
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            initial={{ opacity: 0.5, scale: 0 }}
            animate={{ opacity: 0, scale: 4 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute w-8 h-8 rounded-full bg-white/60 pointer-events-none"
            style={{ left: r.x - 16, top: r.y - 16 }}
          />
        ))}

        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? 'close' : 'chat'}
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
            transition={{ duration: 0.2 }}
            className="relative inline-flex"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            )}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
