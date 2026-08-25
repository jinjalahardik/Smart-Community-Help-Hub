import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { cn } from '../../utils/cn';

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

// Minimal, safe markdown-lite renderer: supports **bold**, `inline code`,
// ```code blocks```, and "- " bullet lines. Deliberately does not use
// dangerouslySetInnerHTML — everything is built as React elements.
function renderInline(text, keyPrefix) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${keyPrefix}-${i}`} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={`${keyPrefix}-${i}`} className="px-1.5 py-0.5 rounded-md bg-teal-100/70 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 text-[13px] font-mono">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

function renderMarkdownLite(text) {
  const blocks = text.split(/```/g);
  return blocks.map((block, blockIdx) => {
    // Odd-indexed segments are inside triple-backtick code fences
    if (blockIdx % 2 === 1) {
      return (
        <pre key={`code-${blockIdx}`} className="my-1.5 rounded-lg bg-ink-light/90 dark:bg-black/40 text-teal-200 text-[12.5px] font-mono p-3 overflow-x-auto whitespace-pre-wrap">
          <code>{block.trim()}</code>
        </pre>
      );
    }

    const lines = block.split('\n').filter((l) => l.length > 0);
    return (
      <div key={`text-${blockIdx}`} className="space-y-1">
        {lines.map((line, lineIdx) => {
          const key = `${blockIdx}-${lineIdx}`;
          if (line.trim().startsWith('- ')) {
            return (
              <div key={key} className="flex items-start gap-1.5 pl-1">
                <span className="w-1 h-1 rounded-full bg-current mt-2 shrink-0 opacity-60" />
                <span>{renderInline(line.trim().slice(2), key)}</span>
              </div>
            );
          }
          if (/^\d+\.\s/.test(line.trim())) {
            return <div key={key}>{renderInline(line.trim(), key)}</div>;
          }
          return <p key={key}>{renderInline(line, key)}</p>;
        })}
      </div>
    );
  });
}

export default function ChatMessage({ message }) {
  const isBot = message.sender === 'bot';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, x: isBot ? -6 : 6 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={cn('flex items-end gap-2', isBot ? 'justify-start' : 'justify-end')}
    >
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center shrink-0 mb-0.5" aria-hidden="true">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      <div className={cn('max-w-[78%] flex flex-col', isBot ? 'items-start' : 'items-end')}>
        <div
          className={cn(
            'px-3.5 py-2.5 rounded-2xl text-[13.5px] leading-relaxed',
            isBot
              ? 'bg-teal-50 dark:bg-surface-soft text-ink-light dark:text-ink-dark rounded-bl-md'
              : 'bg-teal-600 text-white rounded-br-md'
          )}
        >
          {isBot ? renderMarkdownLite(message.text) : <p>{message.text}</p>}
        </div>
        <span className="text-[10.5px] text-ink-light/65 dark:text-ink-dark/65 mt-1 px-1">{formatTime(message.createdAt)}</span>
      </div>
      {!isBot && (
        <div className="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-900/60 flex items-center justify-center shrink-0 mb-0.5" aria-hidden="true">
          <User className="w-3.5 h-3.5 text-teal-700 dark:text-teal-300" />
        </div>
      )}
    </motion.div>
  );
}
