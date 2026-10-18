import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const OFFSETS = {
  up: { y: 22 },
  down: { y: -22 },
  left: { x: 22 },
  right: { x: -22 },
  none: {},
};

/**
 * Single-element scroll-triggered fade + slide reveal.
 */
export default function Reveal({ children, direction = 'up', delay = 0, duration = 0.55, className, once = true, amount = 0.2 }) {
  const offset = OFFSETS[direction] || {};
  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealGroup({ children, className, stagger = 0.08 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px 0px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className, direction = 'up' }) {
  const offset = OFFSETS[direction] || {};
  return (
    <motion.div
      className={cn('min-w-0', className)}
      variants={{ hidden: { opacity: 0, ...offset }, show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } }}
    >
      {children}
    </motion.div>
  );
}
