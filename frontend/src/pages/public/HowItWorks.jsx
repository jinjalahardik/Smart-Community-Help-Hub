import { UserPlus, PackagePlus, ShieldCheck, Truck, CheckCircle2, Siren } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import Section, { SectionHeading } from '../../components/shared/Section';
import { Card } from '../../components/ui/Card';
import Tabs from '../../components/ui/Tabs';
import Reveal from '../../components/shared/Reveal';

const DONOR_FLOW = [
  { icon: UserPlus, title: 'Create your donor account', desc: 'Sign up in under two minutes with your basic details.' },
  { icon: PackagePlus, title: 'List your donation', desc: 'Choose a category — food, clothes, medicine or blood — and fill in the details.' },
  { icon: ShieldCheck, title: 'A verified NGO accepts it', desc: 'Nearby verified NGOs review and accept donations matching their capacity.' },
  { icon: Truck, title: 'A volunteer picks it up', desc: 'Track pickup and delivery status in real time from your dashboard.' },
  { icon: CheckCircle2, title: 'See your impact', desc: 'View how many people your donation helped in your impact history.' },
];

const REQUESTER_FLOW = [
  { icon: UserPlus, title: 'Register as a requester', desc: 'Quick sign-up so you can raise verified requests.' },
  { icon: Siren, title: 'Raise an emergency request', desc: 'Specify category, urgency and details — critical requests are prioritized instantly.' },
  { icon: ShieldCheck, title: 'Get matched to an NGO', desc: 'Our priority algorithm connects you to the nearest capable organization.' },
  { icon: Truck, title: 'Track delivery live', desc: 'Follow your request from assignment through to delivery on a status timeline.' },
  { icon: CheckCircle2, title: 'Confirm & give feedback', desc: 'Confirm delivery and share feedback to help us improve response times.' },
];

export default function HowItWorks() {
  const [tab, setTab] = useState('donor');
  const flow = tab === 'donor' ? DONOR_FLOW : REQUESTER_FLOW;

  return (
    <Section className="pt-14">
      <Reveal>
        <SectionHeading eyebrow="Step by step" title="How Smart Community Help Hub works" description="Whether you're giving or receiving help, the process is designed to be fast, transparent and verified at every stage." />
      </Reveal>

      {/* Compact visual process summary */}
      <Reveal delay={0.1}>
        <div className="flex items-center justify-center gap-1.5 sm:gap-3 mb-10 max-w-2xl mx-auto overflow-x-auto no-scrollbar px-2">
          {flow.map((step, i) => (
            <div key={step.title} className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              <div className="w-9 h-9 rounded-full bg-teal-50 dark:bg-teal-900/40 flex items-center justify-center" title={step.title}>
                <step.icon className="w-4 h-4 text-teal-600" />
              </div>
              {i < flow.length - 1 && <span className="w-6 sm:w-10 h-px bg-teal-200 dark:bg-teal-800" />}
            </div>
          ))}
        </div>
      </Reveal>

      <Tabs
        tabs={[{ label: 'As a Donor', value: 'donor' }, { label: 'As a Requester', value: 'requester' }]}
        active={tab}
        onChange={setTab}
        className="justify-center mb-10"
      />

      <div className="max-w-2xl mx-auto" role="tabpanel" id={`tabpanel-${tab}`} aria-labelledby={`tab-${tab}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {flow.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                className="relative pl-14 pb-9 last:pb-0"
              >
                {i < flow.length - 1 && (
                  <motion.span
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.09 + 0.2, ease: [0.22, 1, 0.36, 1] }}
                    style={{ originY: 0 }}
                    className="absolute left-[19px] top-10 w-0.5 h-[calc(100%-1.5rem)] bg-gradient-to-b from-teal-400 to-teal-100 dark:to-teal-900"
                    aria-hidden="true"
                  />
                )}
                <span className="absolute left-0 top-0 w-10 h-10 rounded-2xl bg-teal-600 text-white shadow-soft flex items-center justify-center">
                  <step.icon className="w-5 h-5" />
                </span>
                <Card hover className="p-5">
                  <p className="text-xs text-teal-600 font-semibold">Step {i + 1}</p>
                  <p className="font-display font-semibold mt-0.5">{step.title}</p>
                  <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mt-1">{step.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
}
