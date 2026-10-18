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
import { donationCategoryImages } from '../../constants/cardImages';

const CATEGORIES = [
  {
    icon: HandHeart, title: 'Food Donations', image: donationCategoryImages.food, iconColor: 'text-amber-700', tint: 'bg-gradient-to-br from-amber-900/40 via-orange-800/20 to-transparent',
    points: ['Cooked meals from events or restaurants', 'Dry ration kits (rice, dal, oil, flour)', 'Packaged and hygienically sealed items only', 'Same-day pickup for perishables'],
    warning: 'Do not donate food past its safe consumption window — perishables must be picked up within hours of preparation.',
  },
  {
    icon: Shirt, title: 'Clothes Donations', image: donationCategoryImages.clothes, iconColor: 'text-cyan-700', tint: 'bg-gradient-to-br from-cyan-900/40 via-sky-800/20 to-transparent',
    points: ['Gently used clothing for all ages', 'Seasonal wear including winter jackets', 'Sorted by gender, age group and size', 'Distributed through verified NGOs'],
    warning: 'Please wash items before donating and avoid torn or heavily worn clothing.',
  },
  {
    icon: Pill, title: 'Medicine Donations', image: donationCategoryImages.medicine, iconColor: 'text-rose-700', tint: 'bg-gradient-to-br from-rose-900/40 via-pink-800/20 to-transparent',
    points: ['Unexpired, sealed medicines only', 'Batch number and manufacturer required', 'Prescription medicines flagged clearly', 'Routed to hospitals and NGO health camps'],
    warning: 'Never donate expired, opened, or unlabelled medication — it will be rejected during NGO/hospital review.',
  },
  {
    icon: Droplet, title: 'Blood Donations', image: donationCategoryImages.blood, iconColor: 'text-red-700', tint: 'bg-gradient-to-br from-red-900/45 via-red-800/20 to-transparent',
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
    <div className="group relative rounded-[28px] overflow-hidden min-h-[360px] h-full cursor-pointer border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-500">
      {/* 1. Background image */}
      <img
        src={c.image}
        alt={c.title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        loading="lazy"
      />
      {/* 2. Dark gradient - keeps text readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/15" />
      {/* 3. Brand tint overlay */}
      <div className={`absolute inset-0 ${c.tint}`} />

      {/* 4. Content */}
      <div className="relative z-10 p-7 flex flex-col h-full">
        <div className="w-12 h-12 rounded-2xl bg-white/95 backdrop-blur-xl shadow-lg flex items-center justify-center mb-4">
          <c.icon className={`w-6 h-6 ${c.iconColor}`} />
        </div>
        <p className="font-display font-semibold text-lg text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">{c.title}</p>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex items-center gap-1.5 text-xs font-medium text-white/90 mt-2 hover:underline hover:text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
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
                  <li key={p} className="text-sm text-white/90 flex items-start gap-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" /> {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-start gap-2 mt-4 text-xs text-amber-800 bg-amber-50/90 backdrop-blur-md rounded-xl px-3 py-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          {c.warning}
        </div>
      </div>
    </div>
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
