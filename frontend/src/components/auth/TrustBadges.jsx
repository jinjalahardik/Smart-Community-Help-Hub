import { motion } from 'framer-motion';
import { BadgeCheck, Users, ShieldCheck } from 'lucide-react';

const BADGES = [
  { icon: BadgeCheck, label: 'Verified Organizations' },
  { icon: Users, label: 'Community Driven' },
  { icon: ShieldCheck, label: 'Trusted since 2024' },
];

export default function TrustBadges({ className }) {
  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className ?? ''}`}>
      {BADGES.map((b, i) => (
        <motion.span
          key={b.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.5 + i * 0.08 }}
          whileHover={{ y: -2 }}
          className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white/90 backdrop-blur-md"
        >
          <b.icon className="h-3.5 w-3.5 text-teal-300" aria-hidden="true" />
          {b.label}
        </motion.span>
      ))}
    </div>
  );
}
