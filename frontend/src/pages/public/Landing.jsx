import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import {
  Siren, HandHeart, Shirt, Pill, Droplet, ArrowRight, Users, Building2, PackageCheck,
  MapPinned, UserCheck, ShieldCheck, Star, Mail,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Accordion from '../../components/ui/Accordion';
import CountUp from '../../components/ui/CountUp';
import Section, { SectionHeading } from '../../components/shared/Section';
import { RevealGroup, RevealItem } from '../../components/shared/Reveal';
import { PATHS } from '../../routes/paths';
import { useAuth } from '../../context/AuthContext';
import { ROLE_DASHBOARD_PATH } from '../../constants/roles';
import { cn } from '../../utils/cn';

// Per-category float timing/offset and a distinct, restrained hover gesture
// for each icon (rotate/scale/lift/pulse) as requested for the hero panel.
const CATEGORIES = [
  {
    label: 'Food', icon: HandHeart, desc: 'Cooked meals & ration kits',
    color: 'bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
    gradient: 'from-teal-100/80 to-teal-50/40 dark:from-teal-900/40 dark:to-teal-900/10',
    hoverGradient: 'group-hover:from-teal-200/90 group-hover:to-teal-100/60 dark:group-hover:from-teal-800/60 dark:group-hover:to-teal-900/30',
    floatDuration: 5, floatDelay: 0, floatOffset: 5,
    iconHover: { rotate: -8, scale: 1.12 },
  },
  {
    label: 'Clothes', icon: Shirt, desc: 'Seasonal wear for all ages',
    color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    gradient: 'from-amber-100/80 to-amber-50/40 dark:from-amber-900/30 dark:to-amber-900/10',
    hoverGradient: 'group-hover:from-amber-200/90 group-hover:to-amber-100/60 dark:group-hover:from-amber-800/50 dark:group-hover:to-amber-900/30',
    floatDuration: 6.5, floatDelay: 0.6, floatOffset: 4,
    iconHover: { y: -4, scale: 1.08 },
  },
  {
    label: 'Medicine', icon: Pill, desc: 'Unused, sealed medication',
    color: 'bg-coral-50 text-coral-700 dark:bg-coral-900/30 dark:text-coral-300',
    gradient: 'from-coral-100/80 to-coral-50/40 dark:from-coral-900/30 dark:to-coral-900/10',
    hoverGradient: 'group-hover:from-coral-200/90 group-hover:to-coral-100/60 dark:group-hover:from-coral-800/50 dark:group-hover:to-coral-900/30',
    floatDuration: 5.8, floatDelay: 1.2, floatOffset: 6,
    iconHover: { rotate: 10, scale: 1.1 },
  },
  {
    label: 'Blood', icon: Droplet, desc: 'Life-saving blood donations',
    color: 'bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
    gradient: 'from-teal-200/70 to-teal-50/40 dark:from-teal-800/40 dark:to-teal-900/10',
    hoverGradient: 'group-hover:from-teal-300/80 group-hover:to-teal-100/60 dark:group-hover:from-teal-700/50 dark:group-hover:to-teal-900/30',
    floatDuration: 7, floatDelay: 0.3, floatOffset: 3,
    iconHover: { scale: [1, 1.18, 1] },
  },
];

const STEPS = [
  { title: 'Sign up for your role', desc: 'Register as a Donor, NGO, Volunteer, Requester or Hospital in minutes.' },
  { title: 'Post or raise a need', desc: 'Donors list items, requesters raise emergency needs with urgency levels.' },
  { title: 'Get matched & verified', desc: 'NGOs and hospitals review and accept, backed by admin verification.' },
  { title: 'Volunteers deliver help', desc: 'Nearby volunteers pick up and deliver, tracked step by step in real time.' },
];

const BENEFITS = [
  { role: 'Donors', icon: HandHeart, desc: 'Turn spare food, clothes, medicine or blood into real impact for your city.' },
  { role: 'NGOs', icon: Building2, desc: 'Manage inventory, volunteers and distributions from a single dashboard.' },
  { role: 'Volunteers', icon: UserCheck, desc: 'Pick up nearby tasks, track impact hours, and earn recognition badges.' },
  { role: 'Requesters', icon: Siren, desc: 'Raise verified emergency requests and get matched to help fast.' },
];

const NGOS = [
  { name: 'Asha Seva Foundation', city: 'Ahmedabad', focus: 'Food • Clothes • Medicine' },
  { name: 'Karuna Relief Trust', city: 'Surat', focus: 'Food • Blood' },
  { name: 'Manav Seva Sangh', city: 'Pune', focus: 'Clothes • Medicine' },
];

const STORIES = [
  { name: 'Meena Patel', quote: 'We received insulin within hours of raising our emergency request. This platform saved us critical time.', city: 'Vadodara' },
  { name: 'Rohan Shah', quote: 'Donating leftover event food used to be a hassle. Now a volunteer picks it up the same evening.', city: 'Surat' },
  { name: 'Priya Desai', quote: 'Our NGO can finally track inventory and volunteer tasks in one place instead of scattered spreadsheets.', city: 'Ahmedabad' },
];

const FAQS = [
  { id: 1, question: 'Is Smart Community Help Hub free to use?', answer: 'Yes, the platform is completely free for donors, requesters, volunteers, NGOs and hospitals.' },
  { id: 2, question: 'How are NGOs and hospitals verified?', answer: 'Every organization submits registration documents which our admin team reviews before approval.' },
  { id: 3, question: 'How fast are emergency requests handled?', answer: 'Requests are scored by urgency and matched to the nearest available NGO or volunteer automatically.' },
];

// Continuous floating motion is subtle but still costs paint cycles on
// small/low-power devices, so it's disabled below the `sm` breakpoint.
function useEnableFloat() {
  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)');
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return enabled;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

// Mouse-tracking 3D tilt for the hero category panel: pointer position is
// mapped to a subtle rotateX/rotateY, smoothed with a spring, and reset to
// flat on mouse leave. Skipped entirely for touch devices (no meaningful
// pointer position) and for prefers-reduced-motion.
function use3DTilt({ enabled, maxTilt = 10 }) {
  const ref = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 22, mass: 0.6 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 22, mass: 0.6 });

  const onMouseMove = (e) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * maxTilt * 2);
    rotateX.set(-py * maxTilt * 2);
  };

  const onMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return { ref, rotateX: springX, rotateY: springY, onMouseMove, onMouseLeave };
}

export default function Landing() {
  const { isAuthenticated, user } = useAuth();
  const primaryCta = isAuthenticated ? ROLE_DASHBOARD_PATH[user.role] : PATHS.REGISTER;
  const enableFloat = useEnableFloat();
  const prefersReducedMotion = usePrefersReducedMotion();
  const tilt = use3DTilt({ enabled: enableFloat && !prefersReducedMotion });

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-amber-50 dark:from-teal-950 dark:via-surface-dark dark:to-teal-950">
        <div className="container-app py-20 sm:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.15 }}
              className="inline-flex items-center gap-2 bg-white/70 dark:bg-teal-900/40 border border-teal-100 dark:border-teal-800 rounded-full px-3.5 py-1.5 text-xs font-medium text-teal-700 dark:text-teal-300 mb-5"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Verified NGOs & Hospitals across Gujarat & beyond
            </motion.span>
            <h1 className="text-4xl sm:text-5xl font-display font-bold leading-tight text-ink-light dark:text-ink-dark">
              One platform to give help, get help, and never miss a moment.
            </h1>
            <p className="text-ink-light/70 dark:text-ink-dark/70 mt-5 text-lg max-w-xl">
              Smart Community Help Hub connects donors, NGOs, hospitals, volunteers and people in need — turning generosity into fast, coordinated community support.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Link to={primaryCta}>
                <Button size="lg" className="group">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to={PATHS.REQUESTER.CREATE}><Button size="lg" variant="coral" icon={Siren}>Raise Emergency Request</Button></Link>
            </div>
            <div className="flex items-center gap-6 mt-10 text-sm text-ink-light/60 dark:text-ink-dark/60">
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-teal-500" /> <CountUp value="8,500+" className="font-semibold text-ink-light dark:text-ink-dark" /> community members</span>
              <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-teal-500" /> <CountUp value="450+" className="font-semibold text-ink-light dark:text-ink-dark" /> NGOs & hospitals</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative [perspective:1200px]"
          >
            {/* Ambient outer glow */}
            <div className="absolute -inset-6 bg-gradient-to-br from-teal-300/30 via-amber-200/20 to-coral-200/20 blur-3xl rounded-full pointer-events-none" aria-hidden="true" />

            <motion.div
              ref={tilt.ref}
              onMouseMove={tilt.onMouseMove}
              onMouseLeave={tilt.onMouseLeave}
              style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformStyle: 'preserve-3d' }}
              className="relative glass-panel rounded-3xl p-6 bg-white/60 dark:bg-teal-900/30 shadow-glass overflow-hidden"
            >
              {/* Soft blurred decorative circles behind the cards */}
              <motion.span
                aria-hidden="true"
                className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-teal-300/25 blur-2xl pointer-events-none"
                animate={enableFloat ? { scale: [1, 1.15, 1], opacity: [0.5, 0.7, 0.5] } : undefined}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.span
                aria-hidden="true"
                className="absolute top-1/3 -right-10 w-36 h-36 rounded-full bg-amber-200/25 blur-2xl pointer-events-none"
                animate={enableFloat ? { scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] } : undefined}
                transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              />
              <motion.span
                aria-hidden="true"
                className="absolute -bottom-10 left-1/4 w-28 h-28 rounded-full bg-coral-200/20 blur-2xl pointer-events-none"
                animate={enableFloat ? { scale: [1, 1.12, 1], opacity: [0.35, 0.55, 0.35] } : undefined}
                transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
              />

              {/* Faint connective lines between the four cards, kept behind content */}
              <svg
                className="absolute inset-6 w-[calc(100%-3rem)] h-[calc(100%-3rem)] pointer-events-none"
                aria-hidden="true"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
              >
                <motion.line
                  x1="25" y1="25" x2="75" y2="75" stroke="currentColor" strokeWidth="0.4" strokeDasharray="2 3"
                  className="text-teal-500"
                  animate={enableFloat ? { opacity: [0.12, 0.28, 0.12] } : { opacity: 0.15 }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.line
                  x1="75" y1="25" x2="25" y2="75" stroke="currentColor" strokeWidth="0.4" strokeDasharray="2 3"
                  className="text-teal-500"
                  animate={enableFloat ? { opacity: [0.12, 0.28, 0.12] } : { opacity: 0.15 }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />
              </svg>

              <div className="relative grid grid-cols-2 gap-4" style={{ transformStyle: 'preserve-3d' }}>
                {CATEGORIES.map((c, i) => (
                  <motion.div
                    key={c.label}
                    initial={{ opacity: 0, y: 14 }}
                    animate={
                      enableFloat
                        ? { opacity: 1, y: [0, -c.floatOffset, 0] }
                        : { opacity: 1, y: 0 }
                    }
                    transition={
                      enableFloat
                        ? {
                            opacity: { duration: 0.45, delay: 0.25 + i * 0.12, ease: [0.22, 1, 0.36, 1] },
                            y: { duration: c.floatDuration, repeat: Infinity, ease: 'easeInOut', delay: 0.25 + i * 0.12 + c.floatDelay },
                          }
                        : { opacity: { duration: 0.45, delay: 0.25 + i * 0.12, ease: [0.22, 1, 0.36, 1] } }
                    }
                    whileHover={{ y: -5, z: 40 }}
                    style={{ translateZ: 18 + (i % 2) * 8, transformStyle: 'preserve-3d' }}
                    className="group relative"
                  >
                    <div
                      className={cn(
                        'relative rounded-2xl p-5 bg-gradient-to-br border border-white/40 dark:border-white/5',
                        'transition-all duration-[250ms] ease-out',
                        'group-hover:border-teal-400/70 dark:group-hover:border-teal-500/40 group-hover:shadow-card-hover',
                        c.gradient, c.hoverGradient, c.color
                      )}
                    >
                      <motion.div whileHover={c.iconHover} transition={{ type: 'spring', stiffness: 300, damping: 12 }} className="inline-flex" style={{ translateZ: 12 }}>
                        <c.icon className="w-6 h-6 mb-3" />
                      </motion.div>
                      <p className="font-display font-semibold">{c.label}</p>
                      <p className="text-xs opacity-70 mt-1">{c.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Process line */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="relative mt-5 pt-5 border-t border-teal-900/10 dark:border-white/10 flex items-center justify-between gap-1.5 text-[11px] font-medium text-ink-light/60 dark:text-ink-dark/60"
              >
                {['Donation', 'Verified NGO', 'Volunteer', 'Requester'].map((step, i) => (
                  <span key={step} className="flex items-center gap-1.5">
                    <span className="whitespace-nowrap">{step}</span>
                    {i < 3 && <ArrowRight className="w-3 h-3 text-teal-500/60 shrink-0" />}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Donation categories */}
      <Section>
        <SectionHeading eyebrow="Give what you can" title="Donation categories that make a real difference" description="Every item finds its way to someone who needs it, tracked from pickup to delivery." />
        <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((c) => (
            <RevealItem key={c.label}>
              <Card hover className="p-6 text-center h-full">
                <div className={`w-12 h-12 rounded-2xl ${c.color} flex items-center justify-center mx-auto mb-4`}>
                  <c.icon className="w-6 h-6" />
                </div>
                <p className="font-display font-semibold">{c.label}</p>
                <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mt-1.5">{c.desc}</p>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Live stats */}
      <Section className="bg-teal-600 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Donations Delivered', value: '12,480+', icon: PackageCheck },
            { label: 'Emergency Requests Fulfilled', value: '3,210+', icon: Siren },
            { label: 'Active Volunteers', value: '1,860+', icon: UserCheck },
            { label: 'Cities Covered', value: '6', icon: MapPinned },
          ].map((s) => (
            <div key={s.label}>
              <s.icon className="w-6 h-6 mx-auto mb-2 text-teal-100" />
              <CountUp value={s.value} className="block text-3xl font-display font-bold" />
              <p className="text-sm text-teal-100 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section>
        <SectionHeading eyebrow="Simple, transparent process" title="How the platform works" description="From sign-up to delivery, every step is tracked and verified." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, i) => (
            <div key={s.title} className="relative">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-display font-bold mb-4">{i + 1}</div>
              <p className="font-display font-semibold">{s.title}</p>
              <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mt-1.5">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Role-based benefits */}
      <Section className="bg-teal-50/50 dark:bg-teal-950/40">
        <SectionHeading eyebrow="Built for everyone" title="Whichever role you play, we've got you covered" />
        <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BENEFITS.map((b) => (
            <RevealItem key={b.role}>
              <Card hover className="p-6 h-full">
                <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-900/40 flex items-center justify-center mb-4">
                  <b.icon className="w-5 h-5 text-teal-600" />
                </div>
                <p className="font-display font-semibold">{b.role}</p>
                <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mt-1.5">{b.desc}</p>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Featured NGOs */}
      <Section>
        <SectionHeading eyebrow="Trusted partners" title="Featured verified NGOs" description="All organizations undergo document verification before joining the platform." />
        <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {NGOS.map((n) => (
            <RevealItem key={n.name}>
              <Card hover className="p-6 h-full">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={n.name} />
                  <div>
                    <p className="font-display font-semibold text-sm">{n.name}</p>
                    <p className="text-xs text-ink-light/65 dark:text-ink-dark/65">{n.city}</p>
                  </div>
                </div>
                <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">{n.focus}</p>
                <span className="inline-flex items-center gap-1 text-xs text-teal-600 mt-3"><ShieldCheck className="w-3.5 h-3.5" /> Verified Organization</span>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
        <div className="text-center mt-8">
          <Link to={PATHS.NGOS}><Button variant="outline">View NGO Directory</Button></Link>
        </div>
      </Section>

      {/* Success stories / Testimonials */}
      <Section className="bg-teal-50/50 dark:bg-teal-950/40">
        <SectionHeading eyebrow="Real stories" title="Recent success stories" />
        <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STORIES.map((s) => (
            <RevealItem key={s.name}>
              <Card className="p-6 h-full">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-ink-light/80 dark:text-ink-dark/80 italic">"{s.quote}"</p>
                <div className="flex items-center gap-2.5 mt-4">
                  <Avatar name={s.name} size="sm" />
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-ink-light/65 dark:text-ink-dark/65">{s.city}</p>
                  </div>
                </div>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Trust & transparency */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <SectionHeading center={false} eyebrow="Why trust us" title="Transparency at every step of the journey" description="Every donation and request is tracked from creation to delivery. Organizations are verified with documents reviewed by our admin team, and all activity is logged for accountability." />
            <ul className="space-y-3">
              {['Document-verified NGOs & hospitals', 'Real-time status tracking for every request', 'Transparent priority scoring for emergencies', 'Full audit trail for admin oversight'].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-sm text-ink-light/80 dark:text-ink-dark/80">
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <Card className="p-8 bg-gradient-to-br from-teal-600 to-teal-700 text-white">
            <p className="font-display text-xl font-bold">98.6% verified organization rate</p>
            <p className="text-teal-100 text-sm mt-2">Only document-verified NGOs and hospitals can accept donations or fulfil emergency requests on the platform.</p>
          </Card>
        </div>
      </Section>

      {/* FAQ preview */}
      <Section className="bg-teal-50/50 dark:bg-teal-950/40">
        <SectionHeading eyebrow="Questions?" title="Frequently asked questions" />
        <div className="max-w-2xl mx-auto">
          <Accordion items={FAQS} defaultOpen={[1]} />
          <div className="text-center mt-6">
            <Link to={PATHS.FAQ} className="text-teal-600 dark:text-teal-300 text-sm font-medium hover:underline">View all FAQs →</Link>
          </div>
        </div>
      </Section>

      {/* Newsletter / community CTA */}
      <Section>
        <Card className="p-10 sm:p-14 bg-gradient-to-br from-amber-600 to-coral-600 text-white text-center">
          <Mail className="w-8 h-8 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-display font-bold">Join the community driving real change</h2>
          <p className="text-white/95 mt-3 max-w-lg mx-auto">Sign up today as a donor, volunteer, NGO or hospital and start making an impact in your city.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
            <Link to={PATHS.REGISTER}><Button size="lg" className="!bg-white !text-amber-700 hover:!bg-amber-50">Create Free Account</Button></Link>
          </div>
        </Card>
      </Section>
    </>
  );
}
