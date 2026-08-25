import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Cross, FlaskConical, HandHeart, HeartHandshake, ShieldCheck, UserPlus, Users } from 'lucide-react';

const ROLE_META = {
  Admin: { icon: ShieldCheck, accent: 'text-teal-400 bg-teal-400/10' },
  Donor: { icon: HeartHandshake, accent: 'text-coral-400 bg-coral-400/10' },
  NGO: { icon: HandHeart, accent: 'text-teal-400 bg-teal-400/10' },
  Volunteer: { icon: Users, accent: 'text-cyan-400 bg-cyan-400/10' },
  Requester: { icon: UserPlus, accent: 'text-emerald-400 bg-emerald-400/10' },
  Hospital: { icon: Cross, accent: 'text-coral-400 bg-coral-400/10' },
};

export default function DemoAccounts({ accounts, onUse }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-teal-200/70 bg-teal-50/40 backdrop-blur-md dark:border-teal-900/60 dark:bg-teal-950/30">
      <button
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-ink-light dark:text-ink-dark">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-500/10">
            <FlaskConical className="h-3.5 w-3.5 text-teal-500 dark:text-teal-400" aria-hidden="true" />
          </span>
          Try Demo Account
        </span>
        <ChevronDown
          className={`h-4 w-4 text-ink-light/50 transition-transform duration-300 dark:text-ink-dark/50 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-2 px-3 pb-3">
              {accounts.map((acc) => {
                const meta = ROLE_META[acc.role] || ROLE_META.Donor;
                const Icon = meta.icon;
                return (
                  <div
                    key={acc.role}
                    className="flex items-center gap-3 rounded-xl border border-teal-100/80 bg-white/70 px-3 py-2.5 dark:border-teal-900/50 dark:bg-surface-elevated/50"
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${meta.accent}`}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-ink-light dark:text-ink-dark">{acc.role}</p>
                      <p className="truncate text-[11px] text-ink-light/55 dark:text-ink-dark/55">{acc.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        onUse(acc);
                        setOpen(false);
                      }}
                      className="shrink-0 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:shadow-[0_0_14px_rgba(45,212,191,0.4)] active:scale-95"
                    >
                      Use account
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
