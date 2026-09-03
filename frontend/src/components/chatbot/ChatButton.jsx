import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, X, Sparkles } from 'lucide-react';
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
            className="w-64 sm:w-72 rounded-2xl p-4 bg-white/90 dark:bg-surface-elevated/90 backdrop-blur-xl border border-teal-200/60 dark:border-teal-400/25 shadow-premium ring-1 ring-black/[0.03] dark:ring-white/[0.06]"
            role="dialog"
            aria-label="Chat assistant welcome message"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 flex items-center justify-center shrink-0 shadow-glow-teal">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-display font-bold text-ink-light dark:text-ink-dark leading-snug">👋 Need Help Instant?</p>
                <p className="text-xs mt-0.5 text-ink-light/75 dark:text-ink-dark/75 font-body">Ask our Smart Community AI Assistant.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3.5">
              <button
                type="button"
                onClick={() => { openChat(); }}
                className="flex-1 text-xs font-bold px-3 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 shadow-sm transition-all"
              >
                Ask AI Assistant
              </button>
              <button
                type="button"
                onClick={dismissWelcomePopup}
                aria-label="Dismiss welcome message"
                className="text-xs font-medium px-3 py-2 rounded-xl text-ink-light/75 dark:text-ink-dark/75 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-surface-soft transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating 3D Orb Button */}
      <div className="relative group">
        {/* Pulsing rings background */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-teal-400/40 animate-ping pointer-events-none" aria-hidden="true" />
        )}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 blur-md opacity-60 group-hover:opacity-100 transition-opacity" aria-hidden="true" />

        {/* Hover Tooltip */}
        {!isOpen && (
          <div className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-bold shadow-lg backdrop-blur-md flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>Ask AI Assistant</span>
          </div>
        )}

        <motion.button
          type="button"
          onClick={handleClick}
          aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
          aria-expanded={isOpen}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1, y: [0, -4, 0] }}
          transition={{
            y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
          }}
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.92 }}
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500 shadow-[0_0_25px_rgba(20,184,166,0.5)] border border-white/40 backdrop-blur-xl cursor-pointer"
        >
          {/* Glass sheen overlay */}
          <span className="absolute inset-0 bg-gradient-to-br from-white/35 via-white/10 to-transparent pointer-events-none" aria-hidden="true" />

          {/* Unread badge dot */}
          {!isOpen && (
            <span className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-rose-500 ring-2 ring-white animate-bounce" />
          )}

          {/* Ripple click effect */}
          {ripples.map((r) => (
            <motion.span
              key={r.id}
              initial={{ opacity: 0.6, scale: 0 }}
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
                <X className="w-7 h-7 text-white" />
              ) : (
                <Bot className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow" />
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
