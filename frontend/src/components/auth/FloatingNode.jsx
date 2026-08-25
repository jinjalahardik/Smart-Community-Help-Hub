import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const ACCENTS = {
  teal: 'border-teal-300/30 bg-teal-400/10 text-teal-50 shadow-[0_0_24px_rgba(45,212,191,0.25)]',
  coral: 'border-coral-300/30 bg-coral-400/10 text-coral-50 shadow-[0_0_24px_rgba(244,63,94,0.25)]',
  cyan: 'border-cyan-300/30 bg-cyan-400/10 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.25)]',
};

export default function FloatingNode({
  icon: Icon,
  emoji,
  label,
  x,
  y,
  z = 40,
  accent = 'teal',
  floatDuration = 6,
  floatDelay = 0,
  className,
}) {
  return (
    <div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translateZ(${z}px)`,
        willChange: 'transform',
      }}
    >
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2"
        animate={{ y: [0, -8, 0], rotate: [0, 2, -2, 0] }}
        transition={{ duration: floatDuration, delay: floatDelay, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className={cn(
            'flex items-center gap-2 rounded-2xl border px-3.5 py-2 backdrop-blur-md',
            ACCENTS[accent],
            className
          )}
        >
          {emoji ? (
            <span className="text-base leading-none" aria-hidden="true">{emoji}</span>
          ) : (
            Icon && <Icon className="w-4 h-4" aria-hidden="true" />
          )}
          <span className="text-[11px] font-semibold tracking-wide">{label}</span>
        </div>
      </motion.div>
    </div>
  );
}
