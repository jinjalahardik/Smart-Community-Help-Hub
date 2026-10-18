import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export default function StepCard({
  step,
  index,
  isActive = false,
  showArrow = true,
}) {
  const Icon = step.icon;
  return (
    <div className="relative shrink-0">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'relative bg-white rounded-2xl border border-slate-200 shadow-sm p-6 min-w-[200px] text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1',
          isActive && 'border-2 border-[#14B8A6]',
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[12px]"
            style={{ backgroundColor: step.badgeBg }}
          >
            {step.number}
          </div>
        </div>
        <div
          className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-4"
          style={{ backgroundColor: step.iconBg }}
        >
          <Icon className="w-6 h-6" style={{ color: step.iconColor }} />
        </div>
        <h3 className="font-sora text-[14px] font-bold text-[#0F172A] mb-1">{step.title}</h3>
        <p className="font-inter text-[12px] font-normal text-[#64748B] leading-[1.5]">{step.subtitle}</p>
        {showArrow && index < 4 && (
          <div className="hidden lg:flex absolute top-1/2 -right-5 transform -translate-y-1/2 z-10">
            <span className="text-[#14B8A6] text-lg">→</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
