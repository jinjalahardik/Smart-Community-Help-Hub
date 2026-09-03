import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const ACCENTS = {
  teal: 'border-teal-300/40 bg-teal-500/15 text-teal-100 shadow-[0_0_30px_rgba(45,212,191,0.35)] hover:border-teal-300 hover:shadow-[0_0_40px_rgba(45,212,191,0.6)] hover:bg-teal-400/25',
  coral: 'border-coral-300/40 bg-coral-500/15 text-coral-100 shadow-[0_0_30px_rgba(244,63,94,0.35)] hover:border-coral-300 hover:shadow-[0_0_40px_rgba(244,63,94,0.6)] hover:bg-coral-400/25',
  cyan: 'border-cyan-300/40 bg-cyan-500/15 text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.35)] hover:border-cyan-300 hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] hover:bg-cyan-400/25',
  amber: 'border-amber-300/40 bg-amber-500/15 text-amber-100 shadow-[0_0_30px_rgba(245,158,11,0.35)] hover:border-amber-300 hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] hover:bg-amber-400/25',
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
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2 cursor-pointer"
        animate={{ y: [0, -10, 0], rotate: [0, 1.5, -1.5, 0] }}
        transition={{ duration: floatDuration, delay: floatDelay, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.12, z: z + 20 }}
        whileTap={{ scale: 0.96 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className={cn(
            'flex items-center gap-2 rounded-2xl border px-4 py-2.5 backdrop-blur-xl transition-all duration-300',
            ACCENTS[accent],
            className
          )}
        >
          {emoji ? (
            <span className="text-lg leading-none filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" aria-hidden="true">{emoji}</span>
          ) : (
            Icon && <Icon className="w-4 h-4" aria-hidden="true" />
          )}
          <span className="font-display text-[12px] font-bold tracking-wide text-white drop-shadow-sm">{label}</span>
        </div>
      </motion.div>
    </div>
  );
}
