import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { HeartHandshake } from 'lucide-react';
import FloatingNode from './FloatingNode';

const NODES = [
  { id: 'donor', emoji: '❤️', label: 'Donor', x: 17, y: 27, z: 70, accent: 'teal', floatDuration: 6.2, floatDelay: 0.1 },
  { id: 'ngo', emoji: '🏥', label: 'NGO', x: 81, y: 21, z: 85, accent: 'teal', floatDuration: 7.1, floatDelay: 0.7 },
  { id: 'hospital', emoji: '🩸', label: 'Hospital', x: 87, y: 53, z: 75, accent: 'coral', floatDuration: 6.6, floatDelay: 0.3 },
  { id: 'volunteer', emoji: '🤝', label: 'Volunteer', x: 76, y: 79, z: 95, accent: 'cyan', floatDuration: 7.4, floatDelay: 1.1 },
  { id: 'requester', emoji: '🧑', label: 'Requester', x: 21, y: 81, z: 60, accent: 'teal', floatDuration: 6.8, floatDelay: 0.5 },
];

const FLOW = [
  ['donor', 'ngo'],
  ['donor', 'hospital'],
  ['ngo', 'volunteer'],
  ['hospital', 'volunteer'],
  ['volunteer', 'requester'],
];

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

function ConnectionLines() {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id="schh-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(45,212,191,0.55)" />
          <stop offset="50%" stopColor="rgba(45,212,191,0.12)" />
          <stop offset="100%" stopColor="rgba(45,212,191,0.4)" />
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
            stroke="url(#schh-edge)"
            strokeWidth="0.35"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
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
            r="1.05"
            fill="#5EEAD4"
            initial={{ cx: A.x, cy: A.y, opacity: 0 }}
            animate={paused ? { cx: A.x, cy: A.y, opacity: 0.35 } : {
              cx: [A.x, B.x],
              cy: [A.y, B.y],
              opacity: [0, 1, 0.4],
              scale: [0.6, 1.15, 0.7],
            }}
            transition={
              paused
                ? undefined
                : { cx: { duration: 3.6 + i * 0.45, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }, cy: { duration: 3.6 + i * 0.45, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }, opacity: { duration: 3.6 + i * 0.45, repeat: Infinity, delay: i * 0.5 }, scale: { duration: 3.6 + i * 0.45, repeat: Infinity, delay: i * 0.5 } }
            }
            filter="drop-shadow(0 0 3px rgba(94,234,212,0.9))"
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
  const rotateY = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });
  const rotateX = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });

  const handleMove = (e) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(px);
    my.set(py);
    rotateY.set(px * 7);
    rotateX.set(-py * 6);
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
      style={{ perspective: '1100px' }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: 'preserve-3d', rotateX, rotateY }}
      >
        {/* Core */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ transform: 'translate(-50%, -50%) translateZ(35px)', transformStyle: 'preserve-3d' }}
        >
          <motion.div
            className="relative flex h-[42%] w-[42%] min-h-[120px] min-w-[120px] flex-col items-center justify-center rounded-full border border-teal-300/30 bg-[radial-gradient(circle_at_32%_30%,rgba(45,212,191,0.35),rgba(15,118,110,0.12)_48%,rgba(8,20,17,0.25))] text-center backdrop-blur-md"
            style={{ aspectRatio: '1 / 1', boxShadow: '0 0 45px rgba(45,212,191,0.28), inset 0 0 30px rgba(45,212,191,0.12)' }}
            animate={reduceMotion ? undefined : { boxShadow: ['0 0 45px rgba(45,212,191,0.28), inset 0 0 30px rgba(45,212,191,0.12)', '0 0 70px rgba(45,212,191,0.5), inset 0 0 40px rgba(45,212,191,0.2)', '0 0 45px rgba(45,212,191,0.28), inset 0 0 30px rgba(45,212,191,0.12)'] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="absolute inset-[-18%] rounded-full border border-teal-300/15" aria-hidden="true" />
            <motion.div
              className="absolute inset-[-36%] rounded-full border border-teal-300/10"
              aria-hidden="true"
              animate={reduceMotion ? undefined : { scale: [1, 1.12, 1], opacity: [0.7, 0.2, 0.7] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <HeartHandshake className="h-6 w-6 text-teal-200" aria-hidden="true" />
            <span className="mt-1 px-2 font-display text-[9px] font-bold leading-tight text-teal-50 sm:text-[10px]">
              Smart Community
              <br />
              Help Hub
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
