import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, CheckCircle2, AlertTriangle, Send, Sparkles } from 'lucide-react';
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
    <Section className="pt-16 pb-20">
      <Reveal>
        <SectionHeading
          eyebrow="Get in touch"
          title="Contact Us"
          description="Questions about donating, volunteering, or partnering as an NGO or hospital? We'd love to hear from you."
        />
      </Reveal>
      <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* LEFT CONTACT CARDS & MINI MAP */}
        <RevealGroup className="space-y-4" stagger={0.1}>
          {[
            { icon: Mail, title: 'Email', value: 'support@helpconnect.demo', color: 'from-teal-500 to-cyan-600' },
            { icon: Phone, title: 'Phone', value: '+91 79 4000 1234', color: 'from-amber-500 to-orange-600' },
            { icon: MapPin, title: 'Office', value: 'Piplod, Surat, Gujarat 395007', color: 'from-emerald-500 to-teal-600' },
          ].map((c) => (
            <RevealItem key={c.title} direction="left">
              <motion.div whileHover={{ y: -4, scale: 1.02 }}>
                <Card hover className="p-5 flex items-center gap-4 rounded-2xl border-teal-200/60 dark:border-teal-800/60 group">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                    <c.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">{c.title}</p>
                    <p className="text-sm font-bold text-ink-light dark:text-ink-dark mt-0.5">{c.value}</p>
                  </div>
                </Card>
              </motion.div>
            </RevealItem>
          ))}

          {/* MINI MAP SIMULATION GRAPHIC */}
          <RevealItem direction="left">
            <div className="p-5 rounded-[24px] bento-card bg-gradient-to-br from-teal-950 via-[#061815] to-slate-950 text-white relative overflow-hidden border border-teal-500/20 shadow-premium">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Surat Regional Office
                </span>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-400" />
                </span>
              </div>
              <p className="text-xs text-teal-100/80 font-body leading-relaxed">
                Piplod HQ Coordination Hub · 24/7 Live Emergency Monitoring Line Active
              </p>
            </div>
          </RevealItem>
        </RevealGroup>

        {/* RIGHT CONTACT FORM */}
        <Reveal direction="right" className="lg:col-span-2">
          <div className="p-8 rounded-[28px] bento-card bg-white/90 dark:bg-surface-card/90 border border-teal-200/60 dark:border-teal-400/20 shadow-premium backdrop-blur-2xl relative overflow-hidden">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
                    className="w-16 h-16 rounded-full bg-teal-500/15 text-teal-600 flex items-center justify-center mb-4 shadow-glow-teal"
                  >
                    <CheckCircle2 className="w-8 h-8" />
                  </motion.div>
                  <p className="font-display font-extrabold text-2xl text-ink-light dark:text-ink-dark">Message Sent Successfully!</p>
                  <p className="text-sm text-ink-light/75 dark:text-ink-dark/75 mt-2 font-body">Our team will respond to your inquiry within 24 hours.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input label="Your Name" required {...register('name')} error={errors.name?.message} className="rounded-2xl" />
                    <Input label="Email Address" type="email" required {...register('email')} error={errors.email?.message} className="rounded-2xl" />
                  </div>
                  <Textarea label="Message" required rows={5} {...register('message')} error={errors.message?.message} className="rounded-2xl" />
                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      role="alert"
                      className="flex items-center gap-2 text-sm font-semibold text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 rounded-xl px-4 py-3 border border-rose-300/40"
                    >
                      <AlertTriangle className="w-4 h-4 shrink-0" /> {submitError}
                    </motion.div>
                  )}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" loading={isSubmitting} icon={Send} iconPosition="right" size="lg" className="w-full bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 font-bold py-3.5 shadow-glow-primary rounded-2xl">
                      Send Message
                    </Button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
