import Section, { SectionHeading } from '../../components/shared/Section';
import Accordion from '../../components/ui/Accordion';
import Reveal from '../../components/shared/Reveal';

const FAQS = [
  { id: 1, question: 'Is Smart Community Help Hub free to use?', answer: 'Yes, registration and use of the platform is completely free for all roles — donors, NGOs, hospitals, volunteers and requesters.' },
  { id: 2, question: 'How are NGOs and hospitals verified?', answer: 'Organizations submit registration certificates and identity documents during sign-up. Our admin team reviews these before approving the account.' },
  { id: 3, question: 'How is request priority calculated?', answer: 'We use a weighted score combining urgency level, number of affected people, and how soon the need must be met, to rank emergency requests.' },
  { id: 4, question: 'Can I edit or cancel a donation after posting it?', answer: 'Yes, donations can be edited or cancelled from your dashboard as long as they have not yet been picked up.' },
  { id: 5, question: 'How do volunteers get matched to tasks?', answer: 'Volunteers see tasks filtered by their city and availability, and can accept any open task that fits their schedule.' },
  { id: 6, question: 'What happens if my emergency request is not fulfilled quickly?', answer: 'Critical and high urgency requests are visible to all nearby verified NGOs simultaneously, increasing the chance of a fast match.' },
  { id: 7, question: 'Is my personal information kept private?', answer: 'Yes. Contact details are only shared with the organization or volunteer directly handling your donation or request.' },
];

export default function FAQ() {
  return (
    <Section className="pt-14">
      <Reveal><SectionHeading eyebrow="Help center" title="Frequently Asked Questions" /></Reveal>
      <Reveal delay={0.1} className="max-w-2xl mx-auto">
        <Accordion items={FAQS} allowMultiple defaultOpen={[1]} />
      </Reveal>
    </Section>
  );
}
