import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export default function Section({ children, className, id }) {
  return (
    <motion.section
      id={id}
      className={cn('py-16 sm:py-20', className)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px 0px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container-app">{children}</div>
    </motion.section>
  );
}

export function SectionHeading({ eyebrow, title, description, center = true, className }) {
  return (
    <div className={cn('max-w-2xl mb-12', center && 'mx-auto text-center', className)}>
      {eyebrow && <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 mb-2">{eyebrow}</p>}
      <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink-light dark:text-ink-dark">{title}</h2>
      {description && <p className="text-ink-light/60 dark:text-ink-dark/60 mt-3">{description}</p>}
    </div>
  );
}
