import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Siren, Clock, Phone, ShieldAlert } from 'lucide-react';
import Section, { SectionHeading } from '../../components/shared/Section';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { PriorityBadge } from '../../components/ui/Badge';
import { PATHS } from '../../routes/paths';
import Reveal, { RevealGroup, RevealItem } from '../../components/shared/Reveal';

const URGENCY_INFO = [
  { level: 'critical', desc: 'Life-threatening or time-critical needs (e.g. urgent blood, medicine before surgery). Matched within minutes.' },
  { level: 'high', desc: 'Serious needs requiring same-day response, such as food for displaced families.' },
  { level: 'medium', desc: 'Important needs that should be addressed within a few days, like temporary shelter.' },
  { level: 'low', desc: 'Non-urgent needs such as school supplies, handled within a week.' },
];

export default function EmergencyInfo() {
  return (
    <>
      <Section className="pt-14 pb-10 bg-gradient-to-br from-coral-50 to-white dark:from-coral-950/30 dark:to-surface-dark">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto"
        >
          <span className="relative inline-flex w-16 h-16 items-center justify-center mb-4">
            <span className="absolute inset-0 rounded-full bg-coral-400/25 animate-pulse-soft" aria-hidden="true" />
            <ShieldAlert className="relative w-10 h-10 text-coral-500" />
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold">Need urgent help? We're here.</h1>
          <p className="text-ink-light/60 dark:text-ink-dark/60 mt-4">
            Raise a verified emergency request in minutes. Our priority algorithm ensures critical needs are matched to the nearest NGO or hospital first.
          </p>
          <Link to={PATHS.REQUESTER.CREATE}>
            <Button size="lg" variant="coral" icon={Siren} className="mt-6">Raise Emergency Request</Button>
          </Link>
        </motion.div>
      </Section>

      <Section>
        <Reveal><SectionHeading eyebrow="How urgency works" title="Understanding priority levels" /></Reveal>
        <RevealGroup className="grid sm:grid-cols-2 gap-5" stagger={0.1}>
          {URGENCY_INFO.map((u) => (
            <RevealItem key={u.level}>
              <Card hover className="p-6 flex items-start gap-4 h-full">
                <PriorityBadge level={u.level} className="mt-0.5" />
                <p className="text-sm text-ink-light/65 dark:text-ink-dark/65">{u.desc}</p>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section className="bg-teal-50/50 dark:bg-teal-950/40">
        <RevealGroup className="grid sm:grid-cols-3 gap-6 text-center" stagger={0.1}>
          {[
            { icon: Clock, title: 'Fast Response', desc: 'Critical requests are typically matched within 15-30 minutes.' },
            { icon: Phone, title: 'Direct Contact', desc: 'NGOs and volunteers can reach you directly via the contact number provided.' },
            { icon: ShieldAlert, title: 'For real emergencies', desc: 'For life-threatening emergencies, always call local emergency services first.' },
          ].map((item) => (
            <RevealItem key={item.title}>
              <item.icon className="w-6 h-6 text-teal-600 mx-auto mb-2" />
              <p className="font-display font-semibold">{item.title}</p>
              <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mt-1">{item.desc}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>
    </>
  );
}
