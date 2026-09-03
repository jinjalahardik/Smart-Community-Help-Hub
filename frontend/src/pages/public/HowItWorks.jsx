import { UserPlus, PackagePlus, ShieldCheck, Truck, CheckCircle2, Siren, Sparkles } from 'lucide-react';
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
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const flow = tab === 'donor' ? DONOR_FLOW : REQUESTER_FLOW;

  return (
    <Section className="pt-16 pb-20">
      <Reveal>
        <SectionHeading
          eyebrow="Step by step"
          title="How Smart Community Help Hub works"
          description="Whether you're giving or receiving help, the process is designed to be fast, transparent and verified at every stage."
        />
      </Reveal>

      {/* Interactive Process Stepper Summary Bar */}
      <Reveal delay={0.1}>
        <div className="flex items-center justify-between max-w-3xl mx-auto mb-12 relative px-4">
          <div className="absolute top-1/2 left-8 right-8 h-1 bg-teal-200/50 dark:bg-teal-900/50 -translate-y-1/2 -z-0" aria-hidden="true" />
          {flow.map((step, i) => {
            const isActive = i <= activeStepIndex;
            return (
              <motion.button
                key={step.title}
                type="button"
                onClick={() => setActiveStepIndex(i)}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
                className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-glow-teal ring-4 ring-teal-500/20'
                    : 'bg-white dark:bg-surface-elevated text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-400/20'
                }`}
                title={step.title}
              >
                <step.icon className="w-5 h-5" />
              </motion.button>
            );
          })}
        </div>
      </Reveal>

      <Tabs
        tabs={[{ label: 'As a Donor', value: 'donor' }, { label: 'As a Requester', value: 'requester' }]}
        active={tab}
        onChange={(v) => { setTab(v); setActiveStepIndex(0); }}
        className="justify-center mb-12"
      />

      <div className="max-w-2xl mx-auto" role="tabpanel" id={`tabpanel-${tab}`} aria-labelledby={`tab-${tab}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {flow.map((step, i) => {
              const isSelected = i === activeStepIndex;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setActiveStepIndex(i)}
                  className="relative pl-16 pb-10 last:pb-0 cursor-pointer group"
                >
                  {i < flow.length - 1 && (
                    <span className="absolute left-[23px] top-12 bottom-0 w-0.5 bg-gradient-to-b from-teal-500 to-teal-200 dark:to-teal-900" aria-hidden="true" />
                  )}

                  <motion.span
                    animate={isSelected ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className={`absolute left-0 top-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-gradient-to-br from-teal-600 to-cyan-600 text-white shadow-glow-teal ring-4 ring-teal-500/20'
                        : 'bg-teal-500/10 text-teal-600 dark:text-teal-300 border border-teal-300/30'
                    }`}
                  >
                    <step.icon className="w-6 h-6" />
                  </motion.span>

                  <Card hover className={`p-6 rounded-[24px] transition-all duration-300 ${isSelected ? 'border-teal-400 ring-2 ring-teal-500/20 shadow-premium' : ''}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-teal-600 dark:text-teal-400">Step 0{i + 1}</span>
                      {isSelected && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-teal-500" /> Active Step
                        </span>
                      )}
                    </div>
                    <p className="font-display font-bold text-lg text-ink-light dark:text-ink-dark">{step.title}</p>
                    <p className="text-sm text-ink-light/70 dark:text-ink-dark/70 mt-1.5 leading-relaxed font-body">{step.desc}</p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
}
