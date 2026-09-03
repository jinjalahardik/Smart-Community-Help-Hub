import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Send, X, Sparkles } from 'lucide-react';
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
    initial: { opacity: 0, y: 24, scale: 0.92 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 16, scale: 0.94 },
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
          transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          className="fixed z-[70] flex flex-col overflow-hidden
            bottom-0 right-0 w-full h-[85vh] rounded-t-[28px]
            sm:bottom-24 sm:right-6 sm:w-[360px] sm:h-[540px] sm:rounded-[24px]
            lg:w-[400px] lg:h-[620px]
            bg-white/95 dark:bg-[#061815]/95 backdrop-blur-2xl
            border border-teal-200/60 dark:border-teal-400/20 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-teal-100/60 dark:border-teal-400/15 bg-gradient-to-r from-slate-950 via-teal-950 to-teal-900 shrink-0 relative overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shrink-0 shadow-glow-teal">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-display font-bold text-white truncate flex items-center gap-1.5">
                <span>Smart Community AI</span>
                <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              </p>
              <p className="text-[11px] text-teal-200/90 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" aria-hidden="true" />
                Online · Instant Support
              </p>
            </div>
            <motion.button
              type="button"
              onClick={closeChat}
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close chat"
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </motion.button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5">
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}
            <AnimatePresence>
              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shrink-0 shadow-sm" aria-hidden="true">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <TypingIndicator />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick questions */}
          <div className="px-4 pb-3 border-t border-teal-100/60 dark:border-teal-400/15 pt-3 shrink-0 bg-teal-50/30 dark:bg-surface-dark/40">
            <QuickQuestions onSelect={sendMessage} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-teal-100/60 dark:border-teal-400/15 shrink-0 bg-white/60 dark:bg-[#061815]/80 backdrop-blur-md">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about donations, emergency help, NGOs..."
              aria-label="Type a message"
              className="flex-1 min-w-0 rounded-full border border-teal-200/70 dark:border-teal-400/25 bg-teal-50/60 dark:bg-surface-soft px-4 py-2.5 text-[13px] text-ink-light dark:text-ink-dark placeholder:text-ink-light/60 dark:placeholder:text-ink-dark/60 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
            />
            <motion.button
              type="submit"
              disabled={!input.trim()}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Send message"
              className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center shrink-0 shadow-md shadow-teal-500/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
