import { Target, Eye, HeartHandshake, Users, FileCheck2, ShieldCheck, ClipboardCheck, Sparkles } from 'lucide-react';
import Section, { SectionHeading } from '../../components/shared/Section';
import { Card } from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Reveal, { RevealGroup, RevealItem } from '../../components/shared/Reveal';

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
  { icon: FileCheck2, title: 'Documents submitted', desc: 'NGOs and hospitals upload registration certificates and identity proof.' },
  { icon: ClipboardCheck, title: 'Admin review', desc: 'Our team manually reviews every submission before approval.' },
  { icon: ShieldCheck, title: 'Verified badge issued', desc: 'Approved organizations receive a verified badge visible platform-wide.' },
  { icon: Sparkles, title: 'Ongoing accountability', desc: 'Activity is logged and auditable for continued trust and transparency.' },
];

export default function About() {
  return (
    <>
      <Section className="pt-14 pb-10">
        <Reveal>
          <SectionHeading eyebrow="Our story" title="Built to make community help faster, fairer and traceable" description="Smart Community Help Hub started with a simple observation: generosity and need rarely find each other quickly enough. We built a platform where donors, NGOs, hospitals, volunteers and requesters can coordinate in real time." />
        </Reveal>
      </Section>

      <Section className="pt-0">
        <RevealGroup className="grid sm:grid-cols-2 gap-6" stagger={0.12}>
          <RevealItem>
            <Card hover className="relative p-7 h-full overflow-hidden">
              <Target className="absolute -right-4 -top-4 w-28 h-28 text-teal-600/[0.06] dark:text-teal-400/[0.08]" strokeWidth={1} aria-hidden="true" />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-900/40 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-teal-600" />
                </div>
                <p className="font-display font-semibold text-lg">Our Mission</p>
                <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mt-2">
                  To eliminate the gap between surplus and scarcity by giving every community member a fast, transparent way to give or get help — food, clothes, medicine, blood, or emergency shelter.
                </p>
              </div>
            </Card>
          </RevealItem>
          <RevealItem>
            <Card hover className="relative p-7 h-full overflow-hidden">
              <Eye className="absolute -right-4 -top-4 w-28 h-28 text-amber-600/[0.06] dark:text-amber-400/[0.08]" strokeWidth={1} aria-hidden="true" />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-amber-600" />
                </div>
                <p className="font-display font-semibold text-lg">Our Vision</p>
                <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mt-2">
                  A future where no verified request for help goes unanswered, powered by a network of trusted NGOs, hospitals and volunteers working from a shared, accountable platform.
                </p>
              </div>
            </Card>
          </RevealItem>
        </RevealGroup>
      </Section>

      {/* Story timeline */}
      <Section className="bg-teal-50/50 dark:bg-teal-950/40">
        <Reveal><SectionHeading eyebrow="Our journey" title="How we got here" /></Reveal>
        <div className="max-w-2xl mx-auto">
          <RevealGroup stagger={0.12}>
            {TIMELINE.map((t, i) => (
              <RevealItem key={t.title} direction="left">
                <div className="relative pl-10 pb-10 last:pb-0">
                  {i < TIMELINE.length - 1 && (
                    <span className="absolute left-[15px] top-8 w-0.5 h-[calc(100%-1rem)] bg-teal-200 dark:bg-teal-800" aria-hidden="true" />
                  )}
                  <span className="absolute left-0 top-0 w-8 h-8 rounded-full bg-teal-600 text-white text-xs font-display font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-xs font-semibold text-teal-600 dark:text-teal-300">{t.year}</p>
                  <p className="font-display font-semibold mt-0.5">{t.title}</p>
                  <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mt-1">{t.desc}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      <Section>
        <Reveal><SectionHeading eyebrow="What drives us" title="Our core values" /></Reveal>
        <RevealGroup className="grid sm:grid-cols-3 gap-6" stagger={0.1}>
          {[
            { icon: HeartHandshake, title: 'Compassion first', desc: 'Every feature is designed around the urgency of real human need.' },
            { icon: Users, title: 'Community-powered', desc: 'Donors, NGOs, hospitals and volunteers all contribute to a shared mission.' },
            { icon: Target, title: 'Radical transparency', desc: 'Verification, tracking and audit trails build lasting trust.' },
          ].map((v) => (
            <RevealItem key={v.title}>
              <Card hover className="p-6 text-center h-full">
                <v.icon className="w-6 h-6 text-teal-600 mx-auto mb-3" />
                <p className="font-display font-semibold">{v.title}</p>
                <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mt-1.5">{v.desc}</p>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Transparency & verification process */}
      <Section className="bg-teal-50/50 dark:bg-teal-950/40">
        <Reveal><SectionHeading eyebrow="Trust & transparency" title="How we verify every organization" description="No NGO or hospital can accept donations or fulfil requests until it passes this process." /></Reveal>
        <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5" stagger={0.1}>
          {VERIFICATION_STEPS.map((s, i) => (
            <RevealItem key={s.title}>
              <Card hover className="p-6 h-full relative">
                <span className="absolute top-4 right-4 text-xs font-display font-bold text-teal-600/40">0{i + 1}</span>
                <div className="w-11 h-11 rounded-xl bg-white dark:bg-teal-900/40 shadow-card flex items-center justify-center mb-4">
                  <s.icon className="w-5 h-5 text-teal-600" />
                </div>
                <p className="font-display font-semibold text-sm">{s.title}</p>
                <p className="text-xs text-ink-light/60 dark:text-ink-dark/60 mt-1.5">{s.desc}</p>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section>
        <Reveal><SectionHeading eyebrow="The people behind it" title="Platform coordination team" /></Reveal>
        <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5" stagger={0.08}>
          {TEAM.map((t) => (
            <RevealItem key={t.name}>
              <Card hover className="p-6 text-center h-full">
                <Avatar name={t.name} size="lg" className="mx-auto mb-3" />
                <p className="font-display font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-ink-light/65 dark:text-ink-dark/65 mt-0.5">{t.role}</p>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>
    </>
  );
}
