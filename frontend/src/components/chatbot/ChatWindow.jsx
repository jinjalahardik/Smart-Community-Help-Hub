import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Send, X } from 'lucide-react';
import { useChat } from './ChatContext';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import QuickQuestions from './QuickQuestions';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return isMobile;
}

export default function ChatWindow() {
  const { isOpen, closeChat, messages, isTyping, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);
  const isMobile = useIsMobile();

  // Auto-scroll to the latest message whenever the list or typing state changes.
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const sheetVariants = {
    initial: { opacity: 0, y: '100%' },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: '100%' },
  };
  const popoverVariants = {
    initial: { opacity: 0, y: 24, scale: 0.94 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 16, scale: 0.96 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-label="Smart Community AI Assistant chat"
          variants={isMobile ? sheetVariants : popoverVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="fixed z-[70] flex flex-col overflow-hidden
            bottom-0 right-0 w-full h-[85vh] rounded-t-3xl
            sm:bottom-24 sm:right-6 sm:w-[340px] sm:h-[520px] sm:rounded-3xl
            lg:w-[380px] lg:h-[600px]
            bg-white dark:bg-surface-elevated backdrop-blur-xl
            border border-teal-100 dark:border-teal-200/[0.14] shadow-glass dark:shadow-dark-card"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-teal-100 dark:border-teal-200/[0.14] bg-gradient-to-r from-teal-600 to-teal-700 shrink-0">
            <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-display font-semibold text-white truncate">🤖 Smart Community AI</p>
              <p className="text-[11px] text-teal-50/85 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success-400 shrink-0" aria-hidden="true" />
                Online · Always here to help
              </p>
            </div>
            <button
              type="button"
              onClick={closeChat}
              aria-label="Close chat"
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3.5 py-4 space-y-3.5">
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}
            <AnimatePresence>
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center shrink-0" aria-hidden="true">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <TypingIndicator />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick questions */}
          <div className="px-3.5 pb-2.5 border-t border-teal-100 dark:border-teal-200/[0.14] pt-2.5 shrink-0">
            <QuickQuestions onSelect={sendMessage} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3.5 py-3 border-t border-teal-100 dark:border-teal-200/[0.14] shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about donations, requests, volunteering..."
              aria-label="Type a message"
              className="flex-1 min-w-0 rounded-full border border-teal-100 dark:border-teal-200/[0.14] bg-teal-50/50 dark:bg-surface-soft px-4 py-2.5 text-[13px] text-ink-light dark:text-ink-dark placeholder:text-ink-light/60 dark:placeholder:text-ink-dark/60 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
            />
            <motion.button
              type="submit"
              disabled={!input.trim()}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Send message"
              className="w-10 h-10 rounded-full bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center shrink-0 transition-colors"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
