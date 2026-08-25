import { motion } from 'framer-motion';
import { SUGGESTED_QUESTIONS } from './knowledgeBase';

export default function QuickQuestions({ onSelect, className }) {
  return (
    <div className={className}>
      <p className="text-[11px] font-medium text-ink-light/65 dark:text-ink-dark/65 mb-2 px-0.5">Suggested questions</p>
      <div className="flex flex-wrap gap-1.5">
        {SUGGESTED_QUESTIONS.map((q, i) => (
          <motion.button
            key={q}
            type="button"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.04 }}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(q)}
            className="text-[12px] font-medium px-3 py-1.5 rounded-full bg-teal-50 dark:bg-surface-soft text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-200/[0.14] hover:border-teal-400 dark:hover:border-teal-400/50 hover:bg-teal-100/70 dark:hover:bg-teal-900/40 transition-colors"
          >
            {q}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
