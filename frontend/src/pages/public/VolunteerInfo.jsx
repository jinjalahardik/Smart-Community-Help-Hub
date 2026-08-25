import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Radar, Award, CalendarClock, Truck, ArrowRight, Star, Clock, MapPin,
  PackageCheck, Trophy, Sparkles, Flame, CheckCircle2,
} from 'lucide-react';
import Section, { SectionHeading } from '../../components/shared/Section';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import { PriorityBadge } from '../../components/ui/Badge';
import CountUp from '../../components/ui/CountUp';
import { PATHS } from '../../routes/paths';
import Reveal, { RevealGroup, RevealItem } from '../../components/shared/Reveal';

const PERKS = [
  { icon: Radar, title: 'Nearby tasks only', desc: 'See tasks matched to your city and availability, never far from home.' },
  { icon: CalendarClock, title: 'Flexible scheduling', desc: 'Set your own availability and pick up tasks whenever you have time.' },
  { icon: Truck, title: 'Clear task workflow', desc: 'Every task follows a simple accept → pickup → deliver → complete flow.' },
  { icon: Award, title: 'Recognition & badges', desc: 'Earn impact hours and achievement badges as you help more people.' },
];

const SAMPLE_TASKS = [
  { title: 'Pickup cooked meals', category: 'Food', priority: 'high', distance: '1.2 km', city: 'Surat' },
  { title: 'Deliver medicine strips', category: 'Medicine', priority: 'critical', distance: '2.8 km', city: 'Vadodara' },
  { title: 'Winter clothes distribution', category: 'Clothes', priority: 'medium', distance: '4.5 km', city: 'Ahmedabad' },
];

const BADGES = [
  { icon: Sparkles, label: 'First Delivery' },
  { icon: PackageCheck, label: '10 Tasks Done' },
  { icon: Flame, label: '50 Impact Hours' },
  { icon: Trophy, label: 'Community Champion' },
];

const WORKFLOW = ['Accepted', 'Pickup', 'In Transit', 'Delivered'];

const TESTIMONIALS = [
  { name: 'Aman Trivedi', city: 'Surat', quote: 'Volunteering here fits perfectly around my work schedule. I pick up a task whenever I have a free evening.' },
  { name: 'Foram Shukla', city: 'Ahmedabad', quote: 'Seeing the delivery confirmation after every task genuinely makes my week. It never feels like a chore.' },
  { name: 'Devansh Joshi', city: 'Pune', quote: 'The task workflow is so clear — I always know exactly what to do next, from pickup to drop-off.' },
];

export default function VolunteerInfo() {
  return (
    <>
      <Section className="pt-14 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto"
        >
          <h1 className="text-3xl sm:text-4xl font-display font-bold">Volunteer your time, multiply the impact</h1>
          <p className="text-ink-light/60 dark:text-ink-dark/60 mt-4">
            Volunteers are the bridge between donors and the people who need help. Join a growing network of everyday heroes across Gujarat and Maharashtra.
          </p>
          <Link to={PATHS.REGISTER}>
            <Button size="lg" icon={ArrowRight} iconPosition="right" className="mt-6">Become a Volunteer</Button>
          </Link>

          <div className="grid grid-cols-3 gap-6 mt-10 max-w-md mx-auto">
            <div><CountUp value="1,860+" className="block text-2xl font-display font-bold text-teal-600" /><p className="text-xs text-ink-light/65 mt-1">Active Volunteers</p></div>
            <div><CountUp value="12,400+" className="block text-2xl font-display font-bold text-teal-600" /><p className="text-xs text-ink-light/65 mt-1">Impact Hours</p></div>
            <div><CountUp value="6" className="block text-2xl font-display font-bold text-teal-600" /><p className="text-xs text-ink-light/65 mt-1">Cities Covered</p></div>
          </div>
        </motion.div>
      </Section>

      <Section className="bg-teal-50/50 dark:bg-teal-950/40">
        <Reveal><SectionHeading eyebrow="Why volunteer with us" title="Designed to fit your schedule" /></Reveal>
        <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5" stagger={0.09}>
          {PERKS.map((p) => (
            <RevealItem key={p.title}>
              <Card hover className="p-6 text-center h-full">
                <p.icon className="w-6 h-6 text-teal-600 mx-auto mb-3" />
                <p className="font-display font-semibold text-sm">{p.title}</p>
                <p className="text-xs text-ink-light/60 dark:text-ink-dark/60 mt-1.5">{p.desc}</p>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Available task preview */}
      <Section>
        <Reveal><SectionHeading eyebrow="Right now, near you" title="Tasks available today" description="A live preview of the kind of tasks you could pick up in your city." /></Reveal>
        <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" stagger={0.1}>
          {SAMPLE_TASKS.map((t) => (
            <RevealItem key={t.title}>
              <Card hover className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-medium text-teal-600 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/40 px-2.5 py-1 rounded-full">{t.category}</span>
                  <PriorityBadge level={t.priority} />
                </div>
                <p className="font-display font-semibold text-sm">{t.title}</p>
                <div className="flex items-center gap-3 text-xs text-ink-light/65 dark:text-ink-dark/65 mt-2.5">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {t.distance}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {t.city}</span>
                </div>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Workflow + badges */}
      <Section className="bg-teal-50/50 dark:bg-teal-950/40">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <Reveal><SectionHeading center={false} eyebrow="Simple by design" title="Your task workflow" /></Reveal>
            <Reveal delay={0.1}>
              <div className="flex items-center justify-between max-w-md">
                {WORKFLOW.map((step, i) => (
                  <div key={step} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-teal-900/50 shadow-card flex items-center justify-center">
                        {i === WORKFLOW.length - 1 ? <CheckCircle2 className="w-5 h-5 text-teal-600" /> : <span className="text-sm font-display font-bold text-teal-600">{i + 1}</span>}
                      </div>
                      <p className="text-[11px] font-medium max-w-[64px]">{step}</p>
                    </div>
                    {i < WORKFLOW.length - 1 && <span className="flex-1 h-px bg-teal-200 dark:bg-teal-800 mx-1.5 mb-6" />}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <div>
            <Reveal><SectionHeading center={false} eyebrow="Milestones" title="Achievement badges you can earn" /></Reveal>
            <RevealGroup className="grid grid-cols-2 sm:grid-cols-4 gap-4" stagger={0.08}>
              {BADGES.map((b) => (
                <RevealItem key={b.label}>
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-teal-100 dark:from-amber-900/30 dark:to-teal-900/30 flex items-center justify-center">
                      <b.icon className="w-6 h-6 text-amber-600" />
                    </div>
                    <p className="text-[11px] font-medium">{b.label}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section>
        <Reveal><SectionHeading eyebrow="From our volunteers" title="What it's like to volunteer with us" /></Reveal>
        <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" stagger={0.1}>
          {TESTIMONIALS.map((t) => (
            <RevealItem key={t.name}>
              <Card className="p-6 h-full">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-ink-light/80 dark:text-ink-dark/80 italic">"{t.quote}"</p>
                <div className="flex items-center gap-2.5 mt-4">
                  <Avatar name={t.name} size="sm" />
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-ink-light/65 dark:text-ink-dark/65">{t.city}</p>
                  </div>
                </div>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>
    </>
  );
}
