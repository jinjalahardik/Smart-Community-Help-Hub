import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useInView } from 'framer-motion';
import {
  Siren, HandHeart, Shirt, Pill, Droplet, ArrowRight, Users, Building2, PackageCheck,
  MapPinned, UserCheck, ShieldCheck, Star, Mail, Quote, CheckCircle2, Sparkles, Navigation,
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

const CATEGORIES = [
  {
    label: 'Food',
    icon: HandHeart,
    desc: 'Fresh cooked meals, dry rations & emergency food packs.',
    bentoSpan: 'sm:col-span-2 lg:col-span-2',
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-300/30',
    glowColor: 'shadow-[0_0_30px_rgba(245,158,11,0.25)] hover:border-amber-400/70',
    gradient: 'from-amber-500/15 via-amber-500/5 to-transparent',
    floatDuration: 5,
    floatOffset: 6,
  },
  {
    label: 'Clothes',
    icon: Shirt,
    desc: 'Seasonal wear, blankets & shoes for all age groups.',
    bentoSpan: 'sm:col-span-1 lg:col-span-1',
    color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-300/30',
    glowColor: 'shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:border-cyan-400/70',
    gradient: 'from-cyan-500/15 via-cyan-500/5 to-transparent',
    floatDuration: 6.2,
    floatOffset: 5,
  },
  {
    label: 'Medicine',
    icon: Pill,
    desc: 'Sealed prescription drugs, medical kits & healthcare essentials.',
    bentoSpan: 'sm:col-span-1 lg:col-span-1',
    color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-300/30',
    glowColor: 'shadow-[0_0_30px_rgba(244,63,94,0.25)] hover:border-rose-400/70',
    gradient: 'from-rose-500/15 via-rose-500/5 to-transparent',
    floatDuration: 5.8,
    floatOffset: 7,
  },
  {
    label: 'Blood',
    icon: Droplet,
    desc: 'Urgent donor matching & direct hospital blood bank support.',
    bentoSpan: 'sm:col-span-2 lg:col-span-2',
    color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-300/30',
    glowColor: 'shadow-[0_0_30px_rgba(239,68,68,0.25)] hover:border-red-400/70',
    gradient: 'from-red-500/15 via-red-500/5 to-transparent',
    floatDuration: 7,
    floatOffset: 4,
  },
];

const STEPS = [
  { step: '01', title: 'Sign up for your role', desc: 'Register in seconds as a Donor, NGO, Volunteer, Requester or Hospital.', icon: UserCheck },
  { step: '02', title: 'Post or raise a need', desc: 'Donors list items to share; requesters log verified emergency needs.', icon: Siren },
  { step: '03', title: 'Get matched & verified', desc: 'NGOs & hospitals verify requests with real-time admin monitoring.', icon: ShieldCheck },
  { step: '04', title: 'Volunteers deliver help', desc: 'Nearby volunteers pick up and deliver assistance step-by-step.', icon: Navigation },
];

const BENEFITS = [
  { role: 'Donors', icon: HandHeart, desc: 'Turn spare food, clothes, medicine or blood into direct, verified community relief.' },
  { role: 'NGOs', icon: Building2, desc: 'Manage inventory, assign volunteers, and orchestrate distribution from a single dashboard.' },
  { role: 'Volunteers', icon: UserCheck, desc: 'Pick up nearby tasks, track impact hours, and earn digital recognition badges.' },
  { role: 'Requesters', icon: Siren, desc: 'Raise verified emergency requests and get matched to fast local assistance.' },
];

const NGOS = [
  { name: 'Asha Seva Foundation', city: 'Ahmedabad', focus: 'Food • Clothes • Medicine', rating: '4.9 ★' },
  { name: 'Karuna Relief Trust', city: 'Surat', focus: 'Food • Blood Donations', rating: '5.0 ★' },
  { name: 'Manav Seva Sangh', city: 'Pune', focus: 'Clothes • Emergency Medicine', rating: '4.8 ★' },
];

const STORIES = [
  { name: 'Meena Patel', quote: 'We received emergency insulin within hours of submitting our request. This platform saved critical time for my family.', city: 'Vadodara' },
  { name: 'Rohan Shah', quote: 'Donating event meals used to be so complex. Now a local volunteer picks up surplus food within 45 minutes.', city: 'Surat' },
  { name: 'Priya Desai', quote: 'Our NGO can track volunteer tasks and real-time inventory in one place instead of lost spreadsheet records.', city: 'Ahmedabad' },
];

const FAQS = [
  { id: 1, question: 'Is Smart Community Help Hub free to use?', answer: 'Yes, the platform is completely free for donors, requesters, volunteers, NGOs and hospitals.' },
  { id: 2, question: 'How are NGOs and hospitals verified?', answer: 'Every organization submits official registration documents which our admin team inspects before approving access.' },
  { id: 3, question: 'How fast are emergency requests handled?', answer: 'Requests are scored by urgency level and matched automatically to nearest available volunteers or partner NGOs.' },
];

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

function use3DTilt({ enabled, maxTilt = 12 }) {
  const ref = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const springX = useSpring(rotateX, { stiffness: 220, damping: 22, mass: 0.5 });
  const springY = useSpring(rotateY, { stiffness: 220, damping: 22, mass: 0.5 });

  const onMouseMove = (e) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * maxTilt * 2);
    rotateX.set(-py * maxTilt * 2);
    glareX.set(((e.clientX - rect.left) / rect.width) * 100);
    glareY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  const onMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(50);
  };

  return { ref, rotateX: springX, rotateY: springY, glareX, glareY, onMouseMove, onMouseLeave };
}

// Mouse Spotlight Glass Card component
function SpotlightCard({ children, className }) {
  const divRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    divRef.current.style.setProperty('--spotlight-x', `${x}px`);
    divRef.current.style.setProperty('--spotlight-y', `${y}px`);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={cn('spotlight-card bento-card p-7 h-full hover:border-teal-400/80 hover:shadow-card-hover group', className)}
    >
      {children}
    </div>
  );
}

export default function Landing() {
  const { isAuthenticated, user } = useAuth();
  const primaryCta = isAuthenticated ? ROLE_DASHBOARD_PATH[user.role] : PATHS.REGISTER;
  const enableFloat = useEnableFloat();
  const prefersReducedMotion = usePrefersReducedMotion();
  const tilt = use3DTilt({ enabled: enableFloat && !prefersReducedMotion });

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50/90 via-white to-amber-50/80 dark:from-[#031512] dark:via-surface-dark dark:to-[#051C18]">
        {/* Animated Aurora Blobs */}
        <div className="pointer-events-none absolute -top-44 -left-44 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-teal-400/30 via-cyan-400/20 to-transparent blur-3xl animate-aurora" aria-hidden="true" />
        <div className="pointer-events-none absolute top-1/2 -right-44 h-[550px] w-[550px] rounded-full bg-gradient-to-tr from-emerald-400/25 via-teal-300/15 to-transparent blur-3xl animate-aurora" style={{ animationDelay: '-7s' }} aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(rgba(20,184,166,0.8) 1.2px, transparent 1.2px)', backgroundSize: '32px 32px' }} aria-hidden="true" />

        <div className="container-app relative z-10 py-20 sm:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.15 }}
              className="inline-flex items-center gap-2 bg-white/80 dark:bg-teal-900/50 border border-teal-200/80 dark:border-teal-700/60 backdrop-blur-md rounded-full px-4 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300 mb-6 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Verified NGOs & Hospitals across Gujarat & India
            </motion.span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold leading-[1.15] text-ink-light dark:text-ink-dark tracking-tight">
              One platform to{' '}
              <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 dark:from-teal-300 dark:via-cyan-300 dark:to-emerald-300 bg-clip-text text-transparent">
                give help, get help
              </span>
              , and impact lives.
            </h1>
            <p className="text-ink-light/75 dark:text-ink-dark/75 mt-6 text-lg max-w-xl leading-relaxed font-body">
              Smart Community Help Hub connects donors, NGOs, hospitals, volunteers and people in need — turning generosity into fast, coordinated community support.
            </p>
            <div className="flex flex-wrap items-center gap-3.5 mt-8">
              <Link to={primaryCta}>
                <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 hover:from-teal-800 hover:to-cyan-700 shadow-glow-primary font-bold">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1.5" />
                </Button>
              </Link>
              <Link to={PATHS.REQUESTER.CREATE}>
                <Button size="lg" variant="coral" icon={Siren} className="font-bold shadow-glow-emergency">
                  Raise Emergency Request
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-8 mt-10 text-sm text-ink-light/65 dark:text-ink-dark/65">
              <span className="flex items-center gap-2"><Users className="w-4.5 h-4.5 text-teal-600 dark:text-teal-400" /> <CountUp value="8,500+" className="font-bold text-ink-light dark:text-ink-dark text-base" /> community members</span>
              <span className="flex items-center gap-2"><Building2 className="w-4.5 h-4.5 text-teal-600 dark:text-teal-400" /> <CountUp value="450+" className="font-bold text-ink-light dark:text-ink-dark text-base" /> NGOs & hospitals</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative [perspective:1200px]"
          >
            <div className="absolute -inset-6 bg-gradient-to-br from-teal-400/30 via-cyan-300/20 to-emerald-400/20 blur-3xl rounded-full pointer-events-none" aria-hidden="true" />

            <motion.div
              ref={tilt.ref}
              onMouseMove={tilt.onMouseMove}
              onMouseLeave={tilt.onMouseLeave}
              style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformStyle: 'preserve-3d' }}
              className="relative glass-card rounded-[28px] p-6 sm:p-8 bg-white/70 dark:bg-teal-950/40 shadow-glass overflow-hidden border border-white/60 dark:border-teal-400/20"
            >
              <motion.div
                aria-hidden="true"
                style={{
                  background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.35) 0%, transparent 65%)`,
                }}
                className="pointer-events-none absolute inset-0 z-20 rounded-[28px]"
              />

              <div className="relative z-10 grid grid-cols-2 gap-4" style={{ transformStyle: 'preserve-3d' }}>
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
                            y: { duration: c.floatDuration, repeat: Infinity, ease: 'easeInOut', delay: 0.25 + i * 0.12 },
                          }
                        : { opacity: { duration: 0.45, delay: 0.25 + i * 0.12, ease: [0.22, 1, 0.36, 1] } }
                    }
                    whileHover={{ y: -8, rotateX: 5, rotateY: -5 }}
                    style={{ translateZ: 20 + (i % 2) * 10, transformStyle: 'preserve-3d' }}
                    className="group relative cursor-pointer"
                  >
                    <div
                      className={cn(
                        'relative rounded-2xl p-5 bg-gradient-to-br border border-white/60 dark:border-white/10 backdrop-blur-md',
                        'transition-all duration-300 ease-out',
                        'group-hover:border-teal-400 group-hover:shadow-[0_12px_32px_-6px_rgba(45,212,191,0.35)]',
                        c.gradient, c.color
                      )}
                    >
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }} className="inline-flex" style={{ translateZ: 14 }}>
                        <c.icon className="w-6 h-6 mb-3" />
                      </motion.div>
                      <p className="font-display font-bold text-base tracking-tight">{c.label}</p>
                      <p className="text-xs opacity-80 mt-1 font-medium">{c.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="relative z-10 mt-6 pt-5 border-t border-teal-900/10 dark:border-white/15 flex items-center justify-between gap-1.5 text-[11px] font-semibold text-ink-light/70 dark:text-ink-dark/70"
              >
                {['Donation', 'Verified NGO', 'Volunteer', 'Requester'].map((step, i) => (
                  <span key={step} className="flex items-center gap-1.5">
                    <span className="whitespace-nowrap">{step}</span>
                    {i < 3 && <ArrowRight className="w-3 h-3 text-teal-500 shrink-0" />}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 1. DONATION CATEGORIES (BENTO GRID WITH DEPTH) */}
      <Section>
        <SectionHeading
          eyebrow="Give what you can"
          title="Donation categories that make a real difference"
          description="Every item finds its way to someone who needs it, tracked from pickup to delivery."
        />
        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((c) => (
            <RevealItem key={c.label} className={c.bentoSpan}>
              <motion.div
                whileHover={{ y: -8, rotateX: 4, rotateY: -4 }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                className="h-full [perspective:1000px]"
              >
                <div
                  className={cn(
                    'bento-card p-7 text-left h-full border backdrop-blur-xl relative group',
                    c.color, c.glowColor, 'bg-gradient-to-br', c.gradient
                  )}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="flex items-start justify-between">
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: c.floatDuration, repeat: Infinity, ease: 'easeInOut' }}
                      className={`w-14 h-14 rounded-2xl ${c.color} flex items-center justify-center mb-5 shadow-sm border border-teal-200/50 dark:border-teal-700/40`}
                    >
                      <c.icon className="w-7 h-7" />
                    </motion.div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/60 dark:bg-teal-950/60 border border-teal-200/40 dark:border-teal-800/40 text-teal-700 dark:text-teal-300">
                      <Sparkles className="w-3 h-3 text-teal-500" /> Active Category
                    </span>
                  </div>

                  <p className="font-display text-2xl font-extrabold text-ink-light dark:text-ink-dark tracking-tight">{c.label}</p>
                  <p className="text-sm text-ink-light/75 dark:text-ink-dark/75 mt-2 leading-relaxed">{c.desc}</p>

                  <div className="mt-6 pt-4 border-t border-teal-900/10 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-teal-700 dark:text-teal-300 group-hover:text-teal-800 dark:group-hover:text-teal-200">
                    <span>Explore {c.label} Requests</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5" />
                  </div>
                </div>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* 2. LIVE STATS SECTION */}
      <Section className="relative overflow-hidden bg-[#04120F] text-white py-20 border-y border-teal-900/40">
        <div className="pointer-events-none absolute -top-32 left-1/4 h-[400px] w-[400px] rounded-full bg-teal-500/15 blur-3xl animate-aurora" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-32 right-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/15 blur-3xl animate-aurora" style={{ animationDelay: '-6s' }} aria-hidden="true" />

        <div className="container-app relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Donations Delivered', value: '12,480+', icon: PackageCheck },
            { label: 'Emergency Requests Fulfilled', value: '3,210+', icon: Siren },
            { label: 'Active Volunteers', value: '1,860+', icon: UserCheck },
            { label: 'Cities Covered', value: '6', icon: MapPinned },
          ].map((s) => (
            <motion.div
              key={s.label}
              whileHover={{ y: -5, scale: 1.03 }}
              className="glass-card bg-teal-950/50 p-6 text-center rounded-[24px] border border-teal-500/20 shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-400/30 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(20,184,166,0.35)]">
                <s.icon className="w-6 h-6 text-teal-300" />
              </div>
              <CountUp value={s.value} className="block text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight" />
              <p className="text-xs sm:text-sm text-teal-200/80 mt-1.5 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* 3. "HOW THE PLATFORM WORKS" (CONNECTED JOURNEY TIMELINE) */}
      <Section>
        <SectionHeading
          eyebrow="Simple, transparent process"
          title="How the platform works"
          description="From sign-up to delivery, every step is tracked and verified."
        />
        <div className="relative">
          {/* Desktop connecting path */}
          <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-0.5 border-t-2 border-dashed border-teal-400/40 -z-0" aria-hidden="true" />

          <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {STEPS.map((s, i) => (
              <RevealItem key={s.title}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="bento-card p-6 h-full text-center group bg-white/80 dark:bg-surface-card/90"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 6 }}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center font-display font-extrabold text-lg mx-auto mb-5 shadow-md shadow-teal-500/25 border border-teal-300/40"
                  >
                    {s.step}
                  </motion.div>

                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/40 flex items-center justify-center mx-auto mb-3 text-teal-600 dark:text-teal-300">
                    <s.icon className="w-5 h-5" />
                  </div>

                  <p className="font-display font-bold text-lg text-ink-light dark:text-ink-dark">{s.title}</p>
                  <p className="text-sm text-ink-light/65 dark:text-ink-dark/65 mt-2 leading-relaxed">{s.desc}</p>
                </motion.div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* 4. "WHICHEVER ROLE YOU PLAY" (SPOTLIGHT GLASS CARDS) */}
      <Section className="bg-teal-50/60 dark:bg-[#051714]">
        <SectionHeading eyebrow="Built for everyone" title="Whichever role you play, we've got you covered" />
        <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((b) => (
            <RevealItem key={b.role}>
              <SpotlightCard>
                <div className="frosted-square w-12 h-12 mb-5">
                  <b.icon className="w-6 h-6 text-teal-600 dark:text-teal-300" />
                </div>
                <p className="font-display text-xl font-bold text-ink-light dark:text-ink-dark">{b.role}</p>
                <p className="text-sm text-ink-light/65 dark:text-ink-dark/65 mt-2.5 leading-relaxed">{b.desc}</p>
              </SpotlightCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* 5. "FEATURED VERIFIED NGOS" (STRIPE STYLE CUSTOMER CARDS) */}
      <Section>
        <SectionHeading
          eyebrow="Trusted partners"
          title="Featured verified NGOs"
          description="All organizations undergo document verification before joining the platform."
        />
        <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {NGOS.map((n) => (
            <RevealItem key={n.name}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                className="h-full"
              >
                <Card hover className="p-7 h-full rounded-[24px] border-teal-200/60 dark:border-teal-800/60 hover:border-teal-400 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={n.name} className="shadow-sm border border-teal-200 dark:border-teal-700" />
                      <div>
                        <p className="font-display font-bold text-base text-ink-light dark:text-ink-dark">{n.name}</p>
                        <p className="text-xs text-ink-light/65 dark:text-ink-dark/65 flex items-center gap-1 mt-0.5">
                          <MapPinned className="w-3 h-3 text-teal-500" /> {n.city}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full">{n.rating}</span>
                  </div>

                  <p className="text-xs text-teal-600 dark:text-teal-300 font-semibold bg-teal-500/10 px-3 py-1.5 rounded-xl inline-block">{n.focus}</p>

                  <div className="mt-5 pt-4 border-t border-teal-900/10 dark:border-white/10 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-teal-500" /> Verified Organization
                    </span>
                    <ArrowRight className="w-4 h-4 text-teal-600 dark:text-teal-400 transition-transform duration-200 group-hover:translate-x-1.5" />
                  </div>
                </Card>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
        <div className="text-center mt-10">
          <Link to={PATHS.NGOS}>
            <Button variant="outline" className="font-semibold rounded-2xl px-6 py-3 border-teal-500 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/30">
              View NGO Directory
            </Button>
          </Link>
        </div>
      </Section>

      {/* 6. "RECENT SUCCESS STORIES" (ROTATED STACK TESTIMONIAL CARDS) */}
      <Section className="bg-teal-50/60 dark:bg-[#051714]">
        <SectionHeading eyebrow="Real stories" title="Recent success stories" />
        <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STORIES.map((s, idx) => (
            <RevealItem key={s.name}>
              <motion.div
                whileHover={{ y: -6, rotate: 0 }}
                className={cn(
                  'h-full rounded-[24px] bento-card p-7 bg-white/90 dark:bg-surface-elevated/90 shadow-md transition-all duration-300 relative group',
                  idx % 2 === 0 ? 'rotate-1' : '-rotate-1'
                )}
              >
                <Quote className="w-10 h-10 text-teal-500/20 absolute top-5 right-5 pointer-events-none" />
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-ink-light/85 dark:text-ink-dark/85 italic leading-relaxed">"{s.quote}"</p>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-teal-900/10 dark:border-white/10">
                  <Avatar name={s.name} size="sm" className="ring-2 ring-teal-500/30" />
                  <div>
                    <p className="text-sm font-bold text-ink-light dark:text-ink-dark">{s.name}</p>
                    <p className="text-xs text-ink-light/65 dark:text-ink-dark/65">{s.city}</p>
                  </div>
                </div>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* 7. TRUST & TRANSPARENCY */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <SectionHeading
              center={false}
              eyebrow="Why trust us"
              title="Transparency at every step of the journey"
              description="Every donation and request is tracked from creation to delivery. Organizations are verified with documents reviewed by our admin team, and all activity is logged for accountability."
            />
            <ul className="space-y-4">
              {['Document-verified NGOs & hospitals', 'Real-time status tracking for every request', 'Transparent priority scoring for emergencies', 'Full audit trail for admin oversight'].map((t) => (
                <li key={t} className="flex items-center gap-3 text-sm font-medium text-ink-light/85 dark:text-ink-dark/85">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-8 rounded-[28px] bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-600 text-white shadow-premium relative overflow-hidden"
          >
            <Sparkles className="w-12 h-12 text-teal-200/30 absolute top-4 right-4" />
            <p className="font-display text-3xl font-extrabold">98.6% verified rate</p>
            <p className="text-teal-100 text-sm mt-3 leading-relaxed font-body">
              Only document-verified NGOs and hospitals can accept donations or fulfill emergency requests on the platform.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* 8. FAQ PREVIEW */}
      <Section className="bg-teal-50/60 dark:bg-[#051714]">
        <SectionHeading eyebrow="Questions?" title="Frequently asked questions" />
        <div className="max-w-2xl mx-auto">
          <Accordion items={FAQS} defaultOpen={[1]} />
          <div className="text-center mt-8">
            <Link to={PATHS.FAQ} className="text-teal-600 dark:text-teal-300 text-sm font-bold hover:underline inline-flex items-center gap-1">
              View all FAQs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Section>

      {/* 9. JOIN COMMUNITY 3D CTA */}
      <Section>
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="p-10 sm:p-14 bg-gradient-to-br from-amber-600 via-coral-600 to-rose-600 rounded-[32px] text-white text-center shadow-[0_20px_50px_rgba(244,63,94,0.3)] relative overflow-hidden"
        >
          <Mail className="w-10 h-10 mx-auto mb-4 text-amber-100 filter drop-shadow" />
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight">Join the community driving real change</h2>
          <p className="text-white/95 mt-4 max-w-lg mx-auto text-base leading-relaxed font-body">
            Sign up today as a donor, volunteer, NGO or hospital and start making an impact in your city.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link to={PATHS.REGISTER}>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" className="!bg-white !text-amber-800 hover:!bg-amber-50 font-bold px-8 py-3.5 rounded-2xl shadow-lg">
                  Create Free Account
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </Section>
    </>
  );
}
