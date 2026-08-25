import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, CheckCircle2, AlertTriangle } from 'lucide-react';
import Section, { SectionHeading } from '../../components/shared/Section';
import { Card } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Reveal, { RevealGroup, RevealItem } from '../../components/shared/Reveal';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    setSubmitError(null);
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => (data.message ? resolve() : reject(new Error('Message could not be sent'))), 700);
      });
      toast.success('Message sent! Our team will respond within 24 hours.');
      reset();
      setSent(true);
      setTimeout(() => setSent(false), 3200);
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
      toast.error('Failed to send your message.');
    }
  };

  return (
    <Section className="pt-14">
      <Reveal><SectionHeading eyebrow="Get in touch" title="Contact Us" description="Questions about donating, volunteering, or partnering as an NGO or hospital? We'd love to hear from you." /></Reveal>
      <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <RevealGroup className="space-y-4" stagger={0.1}>
          {[
            { icon: Mail, title: 'Email', value: 'support@helpconnect.demo' },
            { icon: Phone, title: 'Phone', value: '+91 79 4000 1234' },
            { icon: MapPin, title: 'Office', value: 'Piplod, Surat, Gujarat 395007' },
          ].map((c) => (
            <RevealItem key={c.title} direction="left">
              <Card hover className="p-5 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/40 flex items-center justify-center shrink-0">
                  <c.icon className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-xs text-ink-light/65 dark:text-ink-dark/65">{c.title}</p>
                  <p className="text-sm font-medium">{c.value}</p>
                </div>
              </Card>
            </RevealItem>
          ))}
          <RevealItem direction="left">
            <Card className="p-5 bg-teal-50/60 dark:bg-teal-900/20">
              <p className="text-xs font-semibold text-teal-700 dark:text-teal-300 mb-2">Office Hours</p>
              <div className="space-y-1 text-sm text-ink-light/70 dark:text-ink-dark/70">
                <div className="flex justify-between"><span>Mon – Fri</span><span>9:00 AM – 7:00 PM</span></div>
                <div className="flex justify-between"><span>Saturday</span><span>10:00 AM – 4:00 PM</span></div>
                <div className="flex justify-between"><span>Sunday</span><span>Closed</span></div>
              </div>
              <p className="text-xs text-coral-600 dark:text-coral-300 mt-3 font-medium">Emergency requests are handled 24/7.</p>
            </Card>
          </RevealItem>
        </RevealGroup>

        <Reveal direction="right" className="lg:col-span-2">
          <Card className="p-7 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center text-center py-10"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
                  >
                    <CheckCircle2 className="w-12 h-12 text-teal-600 mb-3" />
                  </motion.div>
                  <p className="font-display font-semibold">Message sent</p>
                  <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mt-1">We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Your Name" required {...register('name')} error={errors.name?.message} />
                    <Input label="Email Address" type="email" required {...register('email')} error={errors.email?.message} />
                  </div>
                  <Textarea label="Message" required rows={5} {...register('message')} error={errors.message?.message} />
                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      role="alert"
                      className="flex items-center gap-2 text-sm text-coral-600 dark:text-coral-300 bg-coral-50 dark:bg-coral-900/20 rounded-xl px-3.5 py-2.5"
                    >
                      <AlertTriangle className="w-4 h-4 shrink-0" /> {submitError}
                    </motion.div>
                  )}
                  <Button type="submit" loading={isSubmitting}>Send Message</Button>
                </motion.form>
              )}
            </AnimatePresence>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}
