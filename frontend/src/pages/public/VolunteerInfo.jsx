import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Radar, Award, CalendarClock, Truck, ArrowRight, Star, Clock, MapPin,
  PackageCheck, Trophy, Sparkles, Flame, CheckCircle2, Siren, UserCheck,
} from 'lucide-react';
import Section, { SectionHeading } from '../../components/shared/Section';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import CountUp from '../../components/ui/CountUp';
import { PATHS } from '../../routes/paths';
import Reveal, { RevealGroup, RevealItem } from '../../components/shared/Reveal';
import { cn } from '../../utils/cn';

const PERKS = [
  { icon: Radar, title: 'Nearby tasks only', desc: 'See tasks matched to your city and availability, never far from home.', span: 'sm:col-span-2' },
  { icon: CalendarClock, title: 'Flexible scheduling', desc: 'Set your own availability and pick up tasks whenever you have time.', span: 'sm:col-span-1' },
  { icon: Truck, title: 'Clear task workflow', desc: 'Every task follows a simple accept → pickup → deliver → complete flow.', span: 'sm:col-span-1' },
  { icon: Award, title: 'Recognition & badges', desc: 'Earn impact hours and achievement badges as you help more people.', span: 'sm:col-span-2' },
];

const SAMPLE_TASKS = [
  { title: 'Pickup cooked meals for shelter', category: 'Food', priority: 'high', distance: '1.2 km', city: 'Surat', urgencyColor: 'bg-amber-500/10 text-amber-600 border-amber-300/40' },
  { title: 'Deliver emergency insulin strips', category: 'Medicine', priority: 'critical', distance: '2.8 km', city: 'Vadodara', urgencyColor: 'bg-rose-500/10 text-rose-600 border-rose-300/40' },
  { title: 'Winter clothes distribution drive', category: 'Clothes', priority: 'medium', distance: '4.5 km', city: 'Ahmedabad', urgencyColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-300/40' },
];

const BADGES = [
  { icon: Sparkles, label: 'First Delivery', color: 'from-amber-400 to-orange-500', shadow: 'shadow-glow-amber' },
  { icon: PackageCheck, label: '10 Tasks Done', color: 'from-teal-400 to-cyan-500', shadow: 'shadow-glow-teal' },
  { icon: Flame, label: '50 Impact Hours', color: 'from-rose-500 to-red-600', shadow: 'shadow-glow-coral' },
  { icon: Trophy, label: 'Community Hero', color: 'from-amber-300 to-yellow-500', shadow: 'shadow-glow-amber' },
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
      {/* HERO HEADER */}
      <Section className="pt-16 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-300/40 text-xs font-bold mb-6">
            <UserCheck className="w-4 h-4 text-teal-500" /> Join 1,860+ Verified Community Volunteers
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-ink-light dark:text-ink-dark tracking-tight">
            Volunteer your time, multiply the impact
          </h1>
          <p className="text-ink-light/75 dark:text-ink-dark/75 mt-5 text-lg leading-relaxed font-body">
            Volunteers are the bridge between donors and the people who need help. Join a growing network of everyday heroes across Gujarat and Maharashtra.
          </p>
          <div className="flex justify-center mt-8">
            <Link to={PATHS.REGISTER}>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" icon={ArrowRight} iconPosition="right" className="bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 hover:from-teal-800 hover:to-cyan-700 font-bold px-8 py-3.5 shadow-glow-primary rounded-2xl">
                  Become a Volunteer
                </Button>
              </motion.div>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-12 max-w-lg mx-auto p-6 rounded-[28px] glass-card bg-white/80 dark:bg-surface-elevated/80 border border-teal-200/60 dark:border-teal-400/20 shadow-premium">
            <div>
              <CountUp value="1,860+" className="block text-3xl font-display font-extrabold text-teal-600 dark:text-teal-300" />
              <p className="text-xs text-ink-light/70 dark:text-ink-dark/70 mt-1 font-semibold">Active Volunteers</p>
            </div>
            <div>
              <CountUp value="12,400+" className="block text-3xl font-display font-extrabold text-teal-600 dark:text-teal-300" />
              <p className="text-xs text-ink-light/70 dark:text-ink-dark/70 mt-1 font-semibold">Impact Hours</p>
            </div>
            <div>
              <CountUp value="6" className="block text-3xl font-display font-extrabold text-teal-600 dark:text-teal-300" />
              <p className="text-xs text-ink-light/70 dark:text-ink-dark/70 mt-1 font-semibold">Cities Covered</p>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* 1. WHY VOLUNTEER BENTO GRID */}
      <Section className="bg-teal-50/60 dark:bg-[#051714]">
        <Reveal>
          <SectionHeading eyebrow="Why volunteer with us" title="Designed to fit your schedule" />
        </Reveal>
        <RevealGroup className="grid grid-cols-1 sm:grid-cols-3 gap-6" stagger={0.09}>
          {PERKS.map((p) => (
            <RevealItem key={p.title} className={p.span}>
              <motion.div whileHover={{ y: -6, rotateX: 2 }} className="h-full [perspective:1000px]">
                <div className="bento-card p-7 text-left h-full border border-teal-200/60 dark:border-teal-800/60 bg-white/90 dark:bg-surface-card/90">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-5 text-teal-600 dark:text-teal-300 border border-teal-300/30">
                    <p.icon className="w-6 h-6" />
                  </div>
                  <p className="font-display font-bold text-xl text-ink-light dark:text-ink-dark">{p.title}</p>
                  <p className="text-sm text-ink-light/70 dark:text-ink-dark/70 mt-2 leading-relaxed font-body">{p.desc}</p>
                </div>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* 2. LINEAR STYLE AVAILABLE TASKS PREVIEW */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Right now, near you"
            title="Tasks available today"
            description="A live preview of real-time community tasks matched to your area."
          />
        </Reveal>
        <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.1}>
          {SAMPLE_TASKS.map((t) => (
            <RevealItem key={t.title}>
              <motion.div whileHover={{ y: -8 }} className="h-full">
                <div className="bento-card p-6 h-full border border-teal-200/60 dark:border-teal-800/60 bg-white/90 dark:bg-surface-card/90 group flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-300/30">
                        {t.category}
                      </span>
                      {/* Live Dot Priority Tag */}
                      <span className={cn('inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border', t.urgencyColor)}>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
                        </span>
                        {t.priority.toUpperCase()}
                      </span>
                    </div>

                    <p className="font-display font-bold text-lg text-ink-light dark:text-ink-dark group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                      {t.title}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-medium text-ink-light/65 dark:text-ink-dark/65 mt-3">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-teal-500" /> {t.distance}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-teal-500" /> {t.city}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-teal-900/10 dark:border-white/10">
                    <Button size="sm" className="w-full bg-teal-500/10 hover:bg-teal-600 text-teal-700 hover:text-white dark:text-teal-300 font-bold border border-teal-300/40 rounded-xl transition-all">
                      Accept Task →
                    </Button>
                  </div>
                </div>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* 3. WORKFLOW & 3D COLLECTIBLE BADGES */}
      <Section className="bg-teal-50/60 dark:bg-[#051714]">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Reveal><SectionHeading center={false} eyebrow="Simple by design" title="Your task workflow" /></Reveal>
            <Reveal delay={0.1}>
              <div className="relative flex items-center justify-between max-w-md mt-6">
                <div className="absolute top-5 left-4 right-4 h-1 bg-teal-200 dark:bg-teal-900 -z-0" />
                {WORKFLOW.map((step, i) => (
                  <div key={step} className="relative z-10 flex flex-col items-center gap-2 text-center">
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-glow-teal flex items-center justify-center font-display font-extrabold text-sm"
                    >
                      {i === WORKFLOW.length - 1 ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                    </motion.div>
                    <p className="text-xs font-bold text-ink-light dark:text-ink-dark">{step}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal><SectionHeading center={false} eyebrow="Milestones" title="Collectible achievement badges" /></Reveal>
            <RevealGroup className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6" stagger={0.08}>
              {BADGES.map((b) => (
                <RevealItem key={b.label}>
                  <motion.div
                    whileHover={{ y: -8, rotateY: 15, scale: 1.05 }}
                    className="flex flex-col items-center text-center gap-3 p-4 rounded-2xl bento-card bg-white/90 dark:bg-surface-card/90 cursor-pointer group"
                  >
                    <div className={cn('w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110', b.color, b.shadow)}>
                      <b.icon className="w-7 h-7 filter drop-shadow" />
                    </div>
                    <p className="text-xs font-bold text-ink-light dark:text-ink-dark">{b.label}</p>
                  </motion.div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Section>

      {/* 4. TESTIMONIALS */}
      <Section>
        <Reveal><SectionHeading eyebrow="From our volunteers" title="What it's like to volunteer with us" /></Reveal>
        <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.1}>
          {TESTIMONIALS.map((t) => (
            <RevealItem key={t.name}>
              <motion.div whileHover={{ y: -6 }}>
                <Card className="p-7 h-full rounded-[24px] border-teal-200/60 dark:border-teal-800/60">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-ink-light/85 dark:text-ink-dark/85 italic leading-relaxed">"{t.quote}"</p>
                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-teal-900/10 dark:border-white/10">
                    <Avatar name={t.name} size="sm" className="ring-2 ring-teal-500/30" />
                    <div>
                      <p className="text-sm font-bold text-ink-light dark:text-ink-dark">{t.name}</p>
                      <p className="text-xs text-ink-light/65 dark:text-ink-dark/65">{t.city}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>
    </>
  );
}
