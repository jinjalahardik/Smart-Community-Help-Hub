import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function LoginCard({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full"
    >
      {/* Soft animated glow behind the card */}
      <motion.div
        aria-hidden="true"
        className="absolute -inset-6 -z-10 rounded-[40px] bg-gradient-to-tr from-teal-500/25 via-cyan-400/15 to-emerald-400/20 blur-3xl"
        animate={{ opacity: [0.55, 0.9, 0.55] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative overflow-hidden rounded-[28px] border border-teal-200/60 bg-white/85 p-6 shadow-glass backdrop-blur-2xl sm:p-8 dark:border-teal-400/15 dark:bg-surface-elevated/80 dark:shadow-dark-card">
        {/* Decorative corner glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-teal-400/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl"
        />

        <div className="relative">
          <div className="mb-5 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-300/40 bg-teal-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-teal-700 dark:border-teal-400/25 dark:text-teal-300">
              <ShieldCheck className="h-3 w-3" aria-hidden="true" />
              Secure Community Access
            </span>
          </div>

          <h1 className="font-display text-2xl font-bold text-ink-light dark:text-ink-dark sm:text-[1.75rem]">
            Welcome back <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-1.5 text-sm text-ink-light/65 dark:text-ink-dark/65">
            Continue making a difference in your community.
          </p>

          <div className="mt-6">{children}</div>
        </div>
      </div>
    </motion.div>
  );
}
