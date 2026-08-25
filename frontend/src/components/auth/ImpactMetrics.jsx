import CountUp from '../ui/CountUp';

const METRICS = [
  { value: '12K+', label: 'Donations' },
  { value: '450+', label: 'Verified NGOs' },
  { value: '30K+', label: 'People Helped' },
];

export default function ImpactMetrics({ className }) {
  return (
    <div className={`grid grid-cols-3 gap-4 ${className ?? ''}`}>
      {METRICS.map((m) => (
        <div key={m.label}>
          <CountUp
            value={m.value}
            className="block font-display text-xl font-bold text-white sm:text-2xl"
          />
          <p className="mt-0.5 text-[11px] text-teal-100/70 sm:text-xs">{m.label}</p>
        </div>
      ))}
    </div>
  );
}
