import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartHandshake } from 'lucide-react';
import { PATHS } from '../../routes/paths';
import CommunityNetwork from './CommunityNetwork';
import ImpactMetrics from './ImpactMetrics';
import TrustBadges from './TrustBadges';

export default function LoginVisual() {
  return (
    <div className="relative flex min-h-[420px] flex-col overflow-hidden bg-gradient-to-br from-[#04100E] via-[#061311] to-[#0A2E2A] p-6 sm:p-10 lg:h-full">
      {/* Animated background glows */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 18% 22%, rgba(45,212,191,0.22) 0, transparent 40%), radial-gradient(circle at 82% 68%, rgba(34,211,238,0.16) 0, transparent 42%), radial-gradient(circle at 55% 55%, rgba(45,212,191,0.1) 0, transparent 55%)',
        }}
      />
      {/* Soft grid pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(94,234,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(94,234,212,0.5) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      {/* Brand header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 flex items-center gap-2.5"
      >
        <Link
          to={PATHS.HOME}
          aria-label="Go to Smart Community Help Hub home"
          className="group relative flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(45,212,191,0.3)]"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-[0_0_16px_rgba(45,212,191,0.45)]">
            <HeartHandshake className="h-5 w-5" aria-hidden="true" />
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-xl border border-white/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          </span>
          <span className="font-display text-sm font-bold leading-tight text-white">
            Smart Community
            <br />
            <span className="bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">Help Hub</span>
          </span>
        </Link>
      </motion.div>

      <div className="relative z-10 mt-4 flex flex-col justify-center lg:flex-1 lg:justify-center">
        {/* Badge */}
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="inline-flex w-fit items-center gap-1.5 rounded-full border border-teal-300/25 bg-teal-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-teal-200"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-teal-300 shadow-[0_0_8px_rgba(94,234,212,0.9)]" aria-hidden="true" />
          Community Support Network
        </motion.span>

        {/* Hero heading */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-4xl"
        >
          Every act of kindness
          <br />
          creates a{' '}
          <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
            stronger community.
          </span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 max-w-md text-sm text-teal-50/75"
        >
          Connect with donors, NGOs, hospitals and volunteers to turn help into real impact.
        </motion.p>

        {/* 3D community network */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-6 aspect-square w-full max-w-[340px] lg:mt-5"
        >
          <CommunityNetwork className="h-full w-full" />
        </motion.div>
      </div>

      {/* Metrics + trust badges */}
      <div className="relative z-10 mt-6 space-y-4 lg:mt-4">
        <ImpactMetrics />
        <TrustBadges />
      </div>
    </div>
  );
}
