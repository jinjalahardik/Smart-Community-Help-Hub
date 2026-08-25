import Section, { SectionHeading } from '../../components/shared/Section';
import Reveal from '../../components/shared/Reveal';

const SECTIONS = [
  { title: '1. Acceptance of Terms', body: 'By registering for Smart Community Help Hub, you agree to use the platform responsibly and provide accurate information for your role.' },
  { title: '2. Eligibility', body: 'Users must be at least 18 years old. NGOs and hospitals must provide valid registration or license documentation to be verified.' },
  { title: '3. User Responsibilities', body: 'Donors are responsible for the accuracy and safety of donated items. Requesters must provide truthful information about their needs. Volunteers must complete accepted tasks responsibly.' },
  { title: '4. Verification & Suspension', body: 'Accounts may be suspended if information provided is found to be false, or if platform guidelines are violated. Organization accounts require admin approval before activation.' },
  { title: '5. Limitation of Liability', body: 'Smart Community Help Hub facilitates connections between donors, NGOs, hospitals, volunteers and requesters, but is not directly responsible for the condition of donated goods or outcomes of coordinated assistance.' },
  { title: '6. Content Guidelines', body: 'Users must not post false, harmful, or misleading donation or request listings. Repeated violations may result in permanent account suspension.' },
  { title: '7. Changes to Terms', body: 'These terms may be updated periodically. Continued use of the platform after changes constitutes acceptance of the revised terms.' },
];

export default function Terms() {
  return (
    <Section className="pt-14 max-w-3xl mx-auto">
      <SectionHeading center={false} eyebrow="Legal" title="Terms and Conditions" description="Last updated: July 2026" />
      <Reveal duration={0.4} className="space-y-7">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <h2 className="font-display font-semibold text-lg mb-2">{s.title}</h2>
            <p className="text-sm text-ink-light/65 dark:text-ink-dark/65 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
