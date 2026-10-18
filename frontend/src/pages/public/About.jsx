import { motion } from 'framer-motion';
import { Target, Eye, HeartHandshake, Users, FileCheck2, ShieldCheck, ClipboardCheck, Sparkles } from 'lucide-react';
import Section, { SectionHeading } from '../../components/shared/Section';
import { Card } from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Reveal, { RevealGroup, RevealItem } from '../../components/shared/Reveal';
import { missionVisionImages } from '../../constants/cardImages';

const TEAM = [
  { name: 'Kavita Mehta', role: 'Platform Administrator' },
  { name: 'Priya Desai', role: 'NGO Partnerships Lead' },
  { name: 'Aman Trivedi', role: 'Volunteer Community Lead' },
  { name: 'Dr. Sanjay Rao', role: 'Healthcare Coordination' },
];

const TIMELINE = [
  { year: '2024', title: 'Platform founded', desc: 'Smart Community Help Hub launches in Surat with a handful of pilot NGOs.' },
  { year: '2025', title: 'Hospital network joins', desc: 'Blood and medicine coordination goes live with verified hospital partners.' },
  { year: '2025', title: 'Expansion to Gujarat & Maharashtra', desc: 'Coverage grows to 6 major cities with a volunteer network of over 1,800.' },
  { year: '2026', title: 'Today', desc: '450+ verified organizations and 8,500+ community members coordinating help in real time.' },
];

const VERIFICATION_STEPS = [
  { icon: FileCheck2, step: '01', title: 'Documents submitted', desc: 'NGOs and hospitals upload registration certificates and identity proof.' },
  { icon: ClipboardCheck, step: '02', title: 'Admin review', desc: 'Our team manually reviews every submission before approval.' },
  { icon: ShieldCheck, step: '03', title: 'Verified badge issued', desc: 'Approved organizations receive a verified badge visible platform-wide.' },
  { icon: Sparkles, step: '04', title: 'Ongoing accountability', desc: 'Activity is logged and auditable for continued trust and transparency.' },
];

export default function About() {
  return (
    <>
      {/* HERO / STORY HEADER */}
      <Section className="pt-16 pb-12">
        <Reveal>
          <SectionHeading
            eyebrow="Our story"
            title="Built to make community help faster, fairer and traceable"
            description="Smart Community Help Hub started with a simple observation: generosity and need rarely find each other quickly enough. We built a platform where donors, NGOs, hospitals, volunteers and requesters can coordinate in real time."
          />
        </Reveal>
      </Section>

      {/* MISSION & VISION IMAGE-BACKGROUND CARDS */}
      <Section className="pt-0">
        <RevealGroup className="grid sm:grid-cols-2 gap-8" stagger={0.12}>
          <RevealItem>
            <motion.div whileHover={{ y: -8, rotateX: 3, rotateY: -3 }} className="h-full [perspective:1000px]">
              <div className="group relative rounded-[28px] overflow-hidden min-h-[320px] md:min-h-[380px] cursor-pointer border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-500">
                {/* 1. Background image */}
                <img
                  src={missionVisionImages.mission}
                  alt="Volunteers packing surplus food boxes for community distribution"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                {/* 2. Dark gradient - keeps text readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/15" />
                {/* 3. Brand tint overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-900/30 via-transparent to-transparent" />

                {/* 4. Content */}
                <div className="relative z-10 h-full p-7 flex flex-col">
                  <div className="w-12 h-12 rounded-2xl bg-white/95 backdrop-blur-xl shadow-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-teal-700" />
                  </div>
                  <div className="mt-auto">
                    <p className="font-display font-extrabold text-2xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] leading-tight">Our Mission</p>
                    <p className="text-white/90 text-sm mt-3 leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] line-clamp-4">
                      To eliminate the gap between surplus and scarcity by giving every community member a fast, transparent way to give or get help — food, clothes, medicine, blood, or emergency shelter.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </RevealItem>

          <RevealItem>
            <motion.div whileHover={{ y: -8, rotateX: -3, rotateY: 3 }} className="h-full [perspective:1000px]">
              <div className="group relative rounded-[28px] overflow-hidden min-h-[320px] md:min-h-[380px] cursor-pointer border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-500">
                {/* 1. Background image */}
                <img
                  src={missionVisionImages.vision}
                  alt="Diverse community members and volunteers working together"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                {/* 2. Dark gradient - keeps text readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/15" />
                {/* 3. Brand tint overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-transparent to-transparent" />

                {/* 4. Content */}
                <div className="relative z-10 h-full p-7 flex flex-col">
                  <div className="w-12 h-12 rounded-2xl bg-white/95 backdrop-blur-xl shadow-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-amber-700" />
                  </div>
                  <div className="mt-auto">
                    <p className="font-display font-extrabold text-2xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] leading-tight">Our Vision</p>
                    <p className="text-white/90 text-sm mt-3 leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] line-clamp-4">
                      A future where no verified request for help goes unanswered, powered by a network of trusted NGOs, hospitals and volunteers working from a shared, accountable platform.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </RevealItem>
        </RevealGroup>
      </Section>

      {/* STORY TIMELINE WITH STICKY LEFT NARRATIVE */}
      <Section className="bg-teal-50/60 dark:bg-[#051714]">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Our Journey</span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-ink-light dark:text-ink-dark mt-2 tracking-tight">
              How we grew from a pilot project into a regional relief hub
            </h2>
            <p className="text-sm text-ink-light/75 dark:text-ink-dark/75 mt-4 leading-relaxed font-body">
              Every milestone represents thousands of lives touched through verified community collaboration and volunteer action.
            </p>
          </div>

          <div className="lg:col-span-7">
            <RevealGroup stagger={0.15}>
              {TIMELINE.map((t, i) => (
                <RevealItem key={t.title}>
                  <div className="relative pl-10 pb-10 last:pb-0 group">
                    {i < TIMELINE.length - 1 && (
                      <span className="absolute left-[15px] top-9 bottom-0 w-0.5 bg-gradient-to-b from-teal-500 to-teal-200 dark:to-teal-900" aria-hidden="true" />
                    )}
                    <span className="absolute left-0 top-0 w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-white text-xs font-display font-bold flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      {i + 1}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-300/30">
                      {t.year}
                    </span>
                    <p className="font-display font-bold text-lg text-ink-light dark:text-ink-dark mt-2">{t.title}</p>
                    <p className="text-sm text-ink-light/70 dark:text-ink-dark/70 mt-1 leading-relaxed">{t.desc}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Section>

      {/* CORE VALUES */}
      <Section>
        <Reveal><SectionHeading eyebrow="What drives us" title="Our core values" /></Reveal>
        <RevealGroup className="grid sm:grid-cols-3 gap-6" stagger={0.1}>
          {[
            { icon: HeartHandshake, title: 'Compassion first', desc: 'Every feature is designed around the urgency of real human need.' },
            { icon: Users, title: 'Community-powered', desc: 'Donors, NGOs, hospitals and volunteers all contribute to a shared mission.' },
            { icon: Target, title: 'Radical transparency', desc: 'Verification, tracking and audit trails build lasting trust.' },
          ].map((v) => (
            <RevealItem key={v.title}>
              <motion.div whileHover={{ y: -6 }}>
                <Card hover className="p-7 text-center h-full rounded-[24px] border-teal-200/60 dark:border-teal-800/60">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center mx-auto mb-4 text-teal-600 dark:text-teal-300">
                    <v.icon className="w-6 h-6" />
                  </div>
                  <p className="font-display font-bold text-lg text-ink-light dark:text-ink-dark">{v.title}</p>
                  <p className="text-sm text-ink-light/65 dark:text-ink-dark/65 mt-2 leading-relaxed">{v.desc}</p>
                </Card>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* CONNECTED TRUST ROADMAP (01-04) */}
      <Section className="bg-teal-50/60 dark:bg-[#051714]">
        <Reveal>
          <SectionHeading
            eyebrow="Trust & transparency"
            title="How we verify every organization"
            description="No NGO or hospital can accept donations or fulfill requests until it passes this process."
          />
        </Reveal>
        <div className="relative">
          {/* Desktop connecting dashed line */}
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 border-t-2 border-dashed border-teal-400/40 -z-0" aria-hidden="true" />

          <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10" stagger={0.1}>
            {VERIFICATION_STEPS.map((s) => (
              <RevealItem key={s.title}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bento-card p-7 h-full relative group bg-white/90 dark:bg-surface-card/90"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-300 border border-teal-300/30">
                      <s.icon className="w-6 h-6" />
                    </div>
                    {/* Large 3D Outlined Step Number */}
                    <span className="text-4xl font-display font-black text-teal-500/25 dark:text-teal-400/20 group-hover:text-teal-500 transition-colors">
                      {s.step}
                    </span>
                  </div>

                  <p className="font-display font-bold text-lg text-ink-light dark:text-ink-dark">{s.title}</p>
                  <p className="text-xs text-ink-light/65 dark:text-ink-dark/65 mt-2 leading-relaxed">{s.desc}</p>
                </motion.div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* TEAM */}
      <Section>
        <Reveal><SectionHeading eyebrow="The people behind it" title="Platform coordination team" /></Reveal>
        <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" stagger={0.08}>
          {TEAM.map((t) => (
            <RevealItem key={t.name}>
              <motion.div whileHover={{ y: -6 }}>
                <Card hover className="p-6 text-center h-full rounded-[24px]">
                  <Avatar name={t.name} size="lg" className="mx-auto mb-4 ring-2 ring-teal-500/30" />
                  <p className="font-display font-bold text-base text-ink-light dark:text-ink-dark">{t.name}</p>
                  <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold mt-1">{t.role}</p>
                </Card>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>
    </>
  );
}
