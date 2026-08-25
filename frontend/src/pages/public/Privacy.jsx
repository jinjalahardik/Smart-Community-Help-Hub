import Section, { SectionHeading } from '../../components/shared/Section';
import Reveal from '../../components/shared/Reveal';

const SECTIONS = [
  { title: '1. Information We Collect', body: 'We collect information you provide during registration (name, email, phone, address, city) and role-specific details such as organization registration numbers or blood group, needed to operate the platform.' },
  { title: '2. How We Use Your Information', body: 'Your information is used to match donations with requests, verify organizations, coordinate volunteer tasks, and send relevant notifications about your activity on the platform.' },
  { title: '3. Information Sharing', body: 'Contact details are shared only with the specific NGO, hospital or volunteer directly involved in fulfilling your donation or request. We do not sell personal data to third parties.' },
  { title: '4. Document Verification', body: 'NGOs and hospitals upload registration and identity documents for admin verification. These documents are reviewed solely for verification purposes.' },
  { title: '5. Data Security', body: 'We apply reasonable technical safeguards to protect your data. Production deployments must use secure, HTTP-only cookie-based authentication rather than client-side token storage.' },
  { title: '6. Your Rights', body: 'You may request access to, correction of, or deletion of your personal information at any time by contacting our support team.' },
  { title: '7. Changes to This Policy', body: 'We may update this policy periodically. Continued use of the platform after changes constitutes acceptance of the revised policy.' },
];

export default function Privacy() {
  return (
    <Section className="pt-14 max-w-3xl mx-auto">
      <SectionHeading center={false} eyebrow="Legal" title="Privacy Policy" description="Last updated: July 2026" />
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
