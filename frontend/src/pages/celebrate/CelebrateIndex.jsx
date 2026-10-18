import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PartyPopper, Zap, Share2, HandHeart, UtensilsCrossed, Shirt, Pill, Droplet,
  Cake, GraduationCap, Briefcase, Heart, Sparkles, ArrowRight, CheckCircle2,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import Section, { SectionHeading } from '../../components/shared/Section';
import Reveal, { RevealGroup, RevealItem } from '../../components/shared/Reveal';
import { CELEBRATION_CAUSES, CELEBRATION_OCCASIONS } from '../../constants/celebrations';
import { PATHS } from '../../routes/paths';

const CAUSE_ICONS = { food: UtensilsCrossed, clothes: Shirt, medicine: Pill, blood: Droplet };
const OCCASION_ICONS = {
  birthday: Cake, graduation: GraduationCap, newjob: Briefcase, anniversary: Heart, milestone: Sparkles,
};

const STEPS = [
  { icon: PartyPopper, title: 'Pick an occasion', text: 'Birthday, wedding, new job, in memory — anything worth celebrating.' },
  { icon: Zap, title: 'Give in a minute', text: 'Choose a verified NGO and a cause. Pay from ₹10 in seconds.' },
  { icon: Share2, title: 'Multiply the joy', text: 'Start a campaign and let friends & family add to your moment.' },
];

export default function CelebrateIndex() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-dark">
      {/* ===== HERO ===== */}
      <div className="relative overflow-hidden" style={{ backgroundImage: "url('/celebrate.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        {/* Light teal overlay — lets the image breathe */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(15,118,110,0.50) 0%, rgba(14,116,144,0.38) 50%, rgba(15,23,42,0.55) 100%)' }} aria-hidden="true" />
        {/* Bottom vignette for text contrast */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)' }} aria-hidden="true" />
        {/* Subtle dot mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:22px_22px] pointer-events-none" />

        <Section className="relative py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto">

            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/50 bg-amber-400/10 backdrop-blur-md px-4 py-1.5 text-[13px] font-semibold text-amber-300" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
                <Sparkles className="w-4 h-4" />
                Introduce your loved ones to the joy of giving
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-6 text-[58px] sm:text-[68px] font-sora font-extrabold leading-[1.0] tracking-[-0.04em] text-white text-balance" style={{ textShadow: '0 4px 24px rgba(0,0,0,0.55)' }}>
                Celebrate
                <br />
                <span className="font-serif italic font-[700] bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                  your moments.
                </span>
                <br />
                <span className="text-[40px] sm:text-[48px] font-serif italic font-[600] bg-gradient-to-r from-teal-200 via-cyan-200 to-emerald-200 bg-clip-text text-transparent">
                  Create moments of hope.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-5 font-inter text-[17px] text-white/85 max-w-xl mx-auto leading-[1.85] text-pretty" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.5)' }}>
                Turn any occasion into an act of kindness. Give directly to a verified NGO in under a minute,
                or launch a celebration campaign so the people you love can give alongside you.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to={PATHS.CELEBRATE.GIVE}>
                  <Button size="lg" icon={HandHeart}
                    className="w-full sm:w-auto px-8 bg-amber-400 hover:bg-amber-300 text-teal-900 font-bold shadow-[0_8px_30px_rgba(251,191,36,0.4)] border-0">
                    Quick Give – start now
                  </Button>
                </Link>
                <Link to={PATHS.CELEBRATE.CREATE}>
                  <Button size="lg" icon={PartyPopper}
                    className="w-full sm:w-auto px-8 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/25">
                    Create a celebration campaign
                  </Button>
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.32}>
              <span className="mt-5 flex items-center justify-center gap-2 font-inter text-[13px] text-white/70" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                No login needed to give. Funds go to admin-verified NGOs only.
              </span>
            </Reveal>

          </div>
        </Section>
      </div>


      {/* Two paths */}
      <Section className="py-0">
        <SectionHeading
          eyebrow="Two ways to celebrate"
          title="Give quickly, or give together"
          description="Both paths put 100% of what you give toward verified NGOs working in food, clothes, medicine, and blood."
        />
        <RevealGroup className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <RevealItem>
            <Link to={PATHS.CELEBRATE.GIVE} className="block h-full group">
              <Card hover className="h-full p-8 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-teal-500/10 group-hover:bg-teal-500/20 transition-colors" />
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-[0_8px_24px_rgba(20,184,166,0.35)]">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <Badge tone="teal" className="mt-5">Quick Give</Badge>
                <h3 className="mt-3 text-2xl font-display font-bold">Give in 60 seconds</h3>
                <p className="mt-3 text-ink-light/60 dark:text-ink-dark/60">
                  No account, no forms. Pick an occasion and a cause, choose a verified NGO,
                  and send your gift with any amount from ₹10.
                </p>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold text-teal-700 dark:text-teal-300">
                  Start giving <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Card>
            </Link>
          </RevealItem>

          <RevealItem delay={0.1}>
            <Link to={PATHS.CELEBRATE.CREATE} className="block h-full group">
              <Card hover className="h-full p-8 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors" />
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-[0_8px_24px_rgba(245,158,11,0.35)]">
                  <PartyPopper className="w-7 h-7 text-white" />
                </div>
                <Badge tone="amber" className="mt-5">Celebration campaign</Badge>
                <h3 className="mt-3 text-2xl font-display font-bold">Give together</h3>
                <p className="mt-3 text-ink-light/60 dark:text-ink-dark/60">
                  Create a campaign for an event, share one link, and watch friends and family
                  add their contributions toward one shared goal.
                </p>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold text-amber-700 dark:text-amber-300">
                  Create your campaign <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Card>
            </Link>
          </RevealItem>
        </RevealGroup>
      </Section>

      {/* How it works */}
      <Section>
        <SectionHeading eyebrow="How it works" title="Joy in three simple steps" />
        <RevealGroup className="grid sm:grid-cols-3 gap-6">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <RevealItem key={title}>
              <Card className="h-full p-6 text-center">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <p className="mt-4 text-xs font-bold text-teal-600 dark:text-teal-400">STEP {i + 1}</p>
                <h3 className="mt-1 font-display font-semibold text-lg">{title}</h3>
                <p className="mt-2 text-sm text-ink-light/60 dark:text-ink-dark/60">{text}</p>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Causes */}
      <Section>
        <SectionHeading
          eyebrow="Choose your cause"
          title="Every occasion can feed, clothe, heal, or save"
          description="Contributions are directed in full to the NGO and cause you select."
        />
        <RevealGroup className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {CELEBRATION_CAUSES.map((cause) => {
            const Icon = CAUSE_ICONS[cause.value];
            return (
              <RevealItem key={cause.value}>
                <Link to={PATHS.CELEBRATE.GIVE} className="block group">
                  <Card hover className="overflow-hidden">
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={cause.image}
                        alt={cause.label}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                        <Icon className="w-4 h-4" />
                        <span className="font-semibold">{cause.label}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-ink-light/60 dark:text-ink-dark/60">{cause.description}</p>
                    </div>
                  </Card>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Section>

      {/* Occasions */}
      <Section className="pt-0">
        <SectionHeading eyebrow="Any moment works" title="Made for moments big and small" />
        <RevealGroup className="flex flex-wrap justify-center gap-3">
          {CELEBRATION_OCCASIONS.map((occasion) => {
            const Icon = OCCASION_ICONS[occasion.value] || PartyPopper;
            return (
              <RevealItem key={occasion.value}>
                <Link
                  to={PATHS.CELEBRATE.GIVE}
                  className="group inline-flex items-center gap-2.5 rounded-2xl border border-teal-100 dark:border-teal-900/60 bg-white dark:bg-surface-card px-5 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-400 hover:shadow-card-hover"
                >
                  <span className="text-teal-600 dark:text-teal-400"><Icon className="w-4 h-4" /></span>
                  <span className="font-medium text-sm">{occasion.label}</span>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Section>

      {/* Final CTA */}
      <Section>
        <Reveal>
          <motion.div
            whileHover={{ y: -4 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-700 p-10 sm:p-14 text-center"
          >
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none" />
            <div className="relative">
              <div className="flex justify-center gap-6 text-teal-50/80 text-sm font-medium">
                <p><Link to={PATHS.CELEBRATE.RECEIPTS} className="hover:text-white transition-colors">Find my receipts</Link></p>
                <p className="text-teal-50/40">·</p>
                <p><Link to={PATHS.CELEBRATE.MINE} className="hover:text-white transition-colors">My campaigns</Link></p>
              </div>
              <Heart className="w-10 h-10 mx-auto text-amber-300 drop-shadow-[0_0_12px_rgba(252,211,77,0.6)]" />
              <h2 className="mt-5 text-3xl sm:text-4xl font-display font-bold text-white">
                Your next big moment is a big chance to give
              </h2>
              <p className="mt-4 text-teal-50/90 max-w-xl mx-auto">
                Start small or start big — every contribution becomes meals served, medicines delivered,
                and lives touched through a verified NGO.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <Link to={PATHS.CELEBRATE.GIVE}>
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-amber-500 text-teal-700 " icon={HandHeart}>
                    Quick Give now
                  </Button>
                </Link>
                <Link to={PATHS.CELEBRATE.CREATE}>
                  <Button size="lg" className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white" icon={PartyPopper}>
                    Create a campaign
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </Reveal>
      </Section>
    </div>
  );
}