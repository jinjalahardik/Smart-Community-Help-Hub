import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { HeartHandshake } from 'lucide-react';
import FloatingNode from './FloatingNode';

const NODES = [
  { id: 'donor', emoji: '❤️', label: 'Donor', x: 16, y: 24, z: 80, accent: 'teal', floatDuration: 5.5, floatDelay: 0 },
  { id: 'ngo', emoji: '🏥', label: 'NGO', x: 82, y: 20, z: 90, accent: 'teal', floatDuration: 6.2, floatDelay: 0.6 },
  { id: 'hospital', emoji: '🩸', label: 'Hospital', x: 88, y: 55, z: 75, accent: 'coral', floatDuration: 5.8, floatDelay: 0.2 },
  { id: 'volunteer', emoji: '🤝', label: 'Volunteer', x: 74, y: 82, z: 95, accent: 'cyan', floatDuration: 6.8, floatDelay: 1.0 },
  { id: 'requester', emoji: '🧑', label: 'Requester', x: 20, y: 80, z: 65, accent: 'amber', floatDuration: 6.0, floatDelay: 0.4 },
];

const FLOW = [
  ['donor', 'ngo'],
  ['donor', 'hospital'],
  ['ngo', 'volunteer'],
  ['hospital', 'volunteer'],
  ['volunteer', 'requester'],
  ['donor', 'requester'],
];

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

function ConnectionLines() {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id="schh-edge-glow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(45, 212, 191, 0.7)" />
          <stop offset="50%" stopColor="rgba(34, 211, 238, 0.3)" />
          <stop offset="100%" stopColor="rgba(45, 212, 191, 0.6)" />
        </linearGradient>
      </defs>
      {FLOW.map(([a, b]) => {
        const A = byId[a];
        const B = byId[b];
        return (
          <motion.line
            key={`${a}-${b}`}
            x1={A.x}
            y1={A.y}
            x2={B.x}
            y2={B.y}
            stroke="url(#schh-edge-glow)"
            strokeWidth="0.45"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            filter="drop-shadow(0 0 4px rgba(45, 212, 191, 0.6))"
          />
        );
      })}
    </svg>
  );
}

function Particles({ paused }) {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden="true">
      {FLOW.map(([a, b], i) => {
        const A = byId[a];
        const B = byId[b];
        return (
          <motion.circle
            key={`p-${a}-${b}`}
            r="1.2"
            fill="#5EEAD4"
            initial={{ cx: A.x, cy: A.y, opacity: 0 }}
            animate={
              paused
                ? { cx: A.x, cy: A.y, opacity: 0.35 }
                : {
                    cx: [A.x, B.x],
                    cy: [A.y, B.y],
                    opacity: [0, 1, 0.3],
                    scale: [0.5, 1.4, 0.6],
                  }
            }
            transition={
              paused
                ? undefined
                : {
                    cx: { duration: 3.2 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 },
                    cy: { duration: 3.2 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 },
                    opacity: { duration: 3.2 + i * 0.4, repeat: Infinity, delay: i * 0.4 },
                    scale: { duration: 3.2 + i * 0.4, repeat: Infinity, delay: i * 0.4 },
                  }
            }
            filter="drop-shadow(0 0 6px rgba(94, 234, 212, 0.95))"
          />
        );
      })}
    </svg>
  );
}

export default function CommunityNetwork({ className }) {
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    setIsMobile(mq.matches);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useMotionValue(0), { stiffness: 90, damping: 20 });
  const rotateX = useSpring(useMotionValue(0), { stiffness: 90, damping: 20 });

  const handleMove = (e) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(px);
    my.set(py);
    rotateY.set(px * 14);
    rotateX.set(-py * 12);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
    rotateY.set(0);
    rotateX.set(0);
  };

  const parallaxActive = !reduceMotion && !isMobile;

  return (
    <div
      ref={wrapRef}
      onMouseMove={parallaxActive ? handleMove : undefined}
      onMouseLeave={parallaxActive ? reset : undefined}
      className={className}
      style={{ perspective: '1200px' }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: 'preserve-3d', rotateX, rotateY }}
      >
        {/* Core Hub */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ transform: 'translate(-50%, -50%) translateZ(45px)', transformStyle: 'preserve-3d' }}
        >
          <motion.div
            className="relative flex h-[130px] w-[130px] sm:h-[145px] sm:w-[145px] flex-col items-center justify-center rounded-full border border-teal-300/40 bg-[radial-gradient(circle_at_35%_35%,rgba(45,212,191,0.45),rgba(15,118,110,0.2)_50%,rgba(6,19,17,0.8))] text-center backdrop-blur-xl"
            style={{ aspectRatio: '1 / 1', boxShadow: '0 0 55px rgba(45,212,191,0.35), inset 0 0 35px rgba(45,212,191,0.2)' }}
            animate={reduceMotion ? undefined : { boxShadow: ['0 0 55px rgba(45,212,191,0.35), inset 0 0 35px rgba(45,212,191,0.2)', '0 0 85px rgba(45,212,191,0.65), inset 0 0 50px rgba(45,212,191,0.35)', '0 0 55px rgba(45,212,191,0.35), inset 0 0 35px rgba(45,212,191,0.2)'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="absolute inset-[-20%] rounded-full border border-teal-300/25" aria-hidden="true" />
            <motion.div
              className="absolute inset-[-40%] rounded-full border border-teal-300/15"
              aria-hidden="true"
              animate={reduceMotion ? undefined : { scale: [1, 1.15, 1], opacity: [0.8, 0.2, 0.8] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <HeartHandshake className="h-7 w-7 text-teal-200 filter drop-shadow-[0_0_10px_rgba(94,234,212,0.8)]" aria-hidden="true" />
            <span className="mt-1.5 px-2 font-display text-[10px] font-extrabold leading-tight text-white tracking-wider uppercase sm:text-[11px]">
              Smart Hub
            </span>
          </motion.div>
        </div>

        <ConnectionLines />

        {!reduceMotion && !isMobile && <Particles />}

        {NODES.map((n) => (
          <FloatingNode
            key={n.id}
            emoji={n.emoji}
            label={n.label}
            x={n.x}
            y={n.y}
            z={n.z}
            accent={n.accent}
            floatDuration={n.floatDuration}
            floatDelay={n.floatDelay}
          />
        ))}
      </motion.div>
    </div>
  );
}
