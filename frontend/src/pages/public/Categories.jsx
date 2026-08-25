import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HandHeart, Shirt, Pill, Droplet, ArrowRight, ChevronDown, AlertTriangle, ListChecks, FileEdit, ShieldCheck, Truck } from 'lucide-react';
import Section, { SectionHeading } from '../../components/shared/Section';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { PATHS } from '../../routes/paths';
import { useAuth } from '../../context/AuthContext';
import Reveal, { RevealGroup, RevealItem } from '../../components/shared/Reveal';
import { cn } from '../../utils/cn';

const CATEGORIES = [
  {
    icon: HandHeart, title: 'Food Donations', color: 'bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300', gradient: 'from-teal-50 to-white dark:from-teal-900/20 dark:to-transparent',
    points: ['Cooked meals from events or restaurants', 'Dry ration kits (rice, dal, oil, flour)', 'Packaged and hygienically sealed items only', 'Same-day pickup for perishables'],
    warning: 'Do not donate food past its safe consumption window — perishables must be picked up within hours of preparation.',
  },
  {
    icon: Shirt, title: 'Clothes Donations', color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', gradient: 'from-amber-50 to-white dark:from-amber-900/20 dark:to-transparent',
    points: ['Gently used clothing for all ages', 'Seasonal wear including winter jackets', 'Sorted by gender, age group and size', 'Distributed through verified NGOs'],
    warning: 'Please wash items before donating and avoid torn or heavily worn clothing.',
  },
  {
    icon: Pill, title: 'Medicine Donations', color: 'bg-coral-50 text-coral-700 dark:bg-coral-900/30 dark:text-coral-300', gradient: 'from-coral-50 to-white dark:from-coral-900/20 dark:to-transparent',
    points: ['Unexpired, sealed medicines only', 'Batch number and manufacturer required', 'Prescription medicines flagged clearly', 'Routed to hospitals and NGO health camps'],
    warning: 'Never donate expired, opened, or unlabelled medication — it will be rejected during NGO/hospital review.',
  },
  {
    icon: Droplet, title: 'Blood Donations', color: 'bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300', gradient: 'from-teal-100 to-white dark:from-teal-800/20 dark:to-transparent',
    points: ['Coordinated directly with partner hospitals', 'Medical eligibility self-declaration required', 'Blood group and availability tracked', 'Priority routing for critical requirements'],
    warning: 'Ensure at least 90 days have passed since your last blood donation before pledging again.',
  },
];

const PROGRESS_STEPS = [
  { icon: ListChecks, label: 'Choose category' },
  { icon: FileEdit, label: 'Fill in details' },
  { icon: ShieldCheck, label: 'Get matched to NGO' },
  { icon: Truck, label: 'Track delivery' },
];

function CategoryCard({ c, index }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <Card hover className={cn('h-full overflow-hidden bg-gradient-to-b', c.gradient)}>
      <div className="p-7">
        <div className={`w-12 h-12 rounded-2xl ${c.color} flex items-center justify-center mb-4`}>
          <c.icon className="w-6 h-6" />
        </div>
        <p className="font-display font-semibold text-lg">{c.title}</p>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex items-center gap-1.5 text-xs font-medium text-teal-600 dark:text-teal-300 mt-2 hover:underline"
        >
          What can be donated
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}><ChevronDown className="w-3.5 h-3.5" /></motion.span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <ul className="mt-3 space-y-2">
                {c.points.map((p) => (
                  <li key={p} className="text-sm text-ink-light/65 dark:text-ink-dark/65 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" /> {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-start gap-2 mt-4 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-3 py-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          {c.warning}
        </div>
      </div>
    </Card>
  );
}

export default function Categories() {
  const { isAuthenticated } = useAuth();
  return (
    <Section className="pt-14">
      <Reveal><SectionHeading eyebrow="What you can give" title="Donation categories" description="Every category has its own guided form so your donation reaches the right place, in the right condition." /></Reveal>

      <RevealGroup className="grid sm:grid-cols-2 gap-6" stagger={0.1}>
        {CATEGORIES.map((c, i) => (
          <RevealItem key={c.title}>
            <CategoryCard c={c} index={i} />
          </RevealItem>
        ))}
      </RevealGroup>

      {/* Guided donation progress preview */}
      <Reveal delay={0.1}>
        <Card className="mt-10 p-6 sm:p-8 bg-teal-50/50 dark:bg-teal-950/30">
          <p className="text-xs font-semibold text-teal-600 dark:text-teal-300 mb-5 text-center">What happens after you donate</p>
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {PROGRESS_STEPS.map((s, i) => (
              <div key={s.label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-11 h-11 rounded-full bg-white dark:bg-teal-900/50 shadow-card flex items-center justify-center">
                    <s.icon className="w-5 h-5 text-teal-600" />
                  </div>
                  <p className="text-[11px] sm:text-xs font-medium max-w-[80px]">{s.label}</p>
                </div>
                {i < PROGRESS_STEPS.length - 1 && <span className="flex-1 h-px bg-teal-200 dark:bg-teal-800 mx-2 mb-6" />}
              </div>
            ))}
          </div>
        </Card>
      </Reveal>

      <div className="text-center mt-10">
        <Link to={isAuthenticated ? PATHS.DONOR.CREATE : PATHS.REGISTER}>
          <Button size="lg" variant="coral" icon={ArrowRight} iconPosition="right" className="shadow-glass">Start a Donation</Button>
        </Link>
      </div>
    </Section>
  );
}
