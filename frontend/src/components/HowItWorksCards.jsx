import StepCard from './StepCard';
import { UserPlus, Package, ShieldCheck, CreditCard, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const STEPS = [
  { number: 1, icon: UserPlus, title: 'Create Account', subtitle: 'Sign up in seconds to start your giving journey.', badgeBg: '#10B981', iconBg: '#D1FAE5', iconColor: '#10B981' },
  { number: 2, icon: Package, title: 'Give / Request', subtitle: 'Choose to donate or raise a verified community need.', badgeBg: '#3B82F6', iconBg: '#DBEAFE', iconColor: '#3B82F6' },
  { number: 3, icon: ShieldCheck, title: 'Verification', subtitle: 'NGOs and requests are verified by our trust team.', badgeBg: '#8B5CF6', iconBg: '#EDE9FE', iconColor: '#8B5CF6' },
  { number: 4, icon: CreditCard, title: 'Secure Payment', subtitle: 'Donate confidently with encrypted payment processing.', badgeBg: '#F59E0B', iconBg: '#FEF3C7', iconColor: '#F59E0B' },
  { number: 5, icon: Users, title: 'Real Impact', subtitle: 'Track your contribution reaching real people in need.', badgeBg: '#EC4899', iconBg: '#FCE7F3', iconColor: '#EC4899' },
];

export function LandingStepCards({ activeStep = 1 }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible">
      {STEPS.map((step, i) => (
        <StepCard key={step.number} step={step} index={i} isActive={step.number === activeStep} showArrow={true} />
      ))}
    </div>
  );
}

export default function HowItWorksStepCards() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible">
      {STEPS.map((step, i) => (
        <motion.div
          key={step.number}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <StepCard step={step} index={i} showArrow={true} />
        </motion.div>
      ))}
    </div>
  );
}
