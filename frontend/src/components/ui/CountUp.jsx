import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';

// Parses values like 12480, "12,480+", "450+", "98.6%", "—" and animates
// the numeric portion while preserving any non-numeric prefix/suffix.
function parseValue(raw) {
  const str = String(raw);
  const match = str.match(/-?[\d,]+\.?\d*/);
  if (!match) return null;
  const number = parseFloat(match[0].replace(/,/g, ''));
  if (Number.isNaN(number)) return null;
  const prefix = str.slice(0, match.index);
  const suffix = str.slice(match.index + match[0].length);
  const decimals = match[0].includes('.') ? match[0].split('.')[1].length : 0;
  return { number, prefix, suffix, decimals };
}

export default function CountUp({ value, duration = 0.9, className }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const parsed = parseValue(value);
  const motionVal = useMotionValue(0);
  const display = useTransform(motionVal, (v) =>
    parsed
      ? `${parsed.prefix}${v.toLocaleString('en-IN', { minimumFractionDigits: parsed.decimals, maximumFractionDigits: parsed.decimals })}${parsed.suffix}`
      : String(value)
  );

  useEffect(() => {
    if (!isInView || !parsed) return;
    const controls = animate(motionVal, parsed.number, { duration, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, value]);

  if (!parsed) {
    return <span ref={ref} className={className}>{value}</span>;
  }

  return <motion.span ref={ref} className={className}>{display}</motion.span>;
}
