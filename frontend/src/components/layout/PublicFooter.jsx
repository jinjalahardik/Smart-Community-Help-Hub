import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartHandshake, Share2, MessageCircle, Camera, Briefcase, Mail, ShieldCheck } from 'lucide-react';
import { PATHS } from '../../routes/paths';

const COLS = [
  {
    title: 'Platform',
    links: [
      { label: 'About Us', to: PATHS.ABOUT },
      { label: 'How It Works', to: PATHS.HOW_IT_WORKS },
      { label: 'Donation Categories', to: PATHS.CATEGORIES },
      { label: 'NGO Directory', to: PATHS.NGOS },
    ],
  },
  {
    title: 'Get Involved',
    links: [
      { label: 'Volunteer', to: PATHS.VOLUNTEER_INFO },
      { label: 'Emergency Help', to: PATHS.EMERGENCY_INFO },
      { label: 'Register Account', to: PATHS.REGISTER },
      { label: 'Contact Us', to: PATHS.CONTACT },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'FAQ & Support', to: PATHS.FAQ },
      { label: 'Privacy Policy', to: PATHS.PRIVACY },
      { label: 'Terms & Conditions', to: PATHS.TERMS },
    ],
  },
];

export default function PublicFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#040E0C] text-slate-200 mt-24 border-t border-teal-900/50">
      {/* Background ambient glowing gradient */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[350px] w-[800px] rounded-full bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-emerald-500/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(45,212,191,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} aria-hidden="true" />

      <div className="container-app relative z-10 py-16 grid grid-cols-1 md:grid-cols-5 gap-10">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.4)]">
              <HeartHandshake className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white tracking-tight">
              Smart Community <span className="bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">Help Hub</span>
            </span>
          </div>

          <p className="text-sm text-teal-100/70 leading-relaxed max-w-sm">
            Connecting donors, NGOs, hospitals, volunteers and requesters to build a stronger, more responsive community support network across India.
          </p>

          <div className="flex items-center gap-2 pt-2 text-xs font-medium text-teal-300">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>100% Document Verified Organizations</span>
          </div>

          <div className="flex items-center gap-3 pt-3">
            {[Share2, MessageCircle, Camera, Briefcase, Mail].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-2xl border border-teal-500/20 bg-white/5 flex items-center justify-center text-teal-300 hover:text-white hover:bg-teal-500/20 hover:border-teal-400/50 transition-all duration-200 shadow-sm"
                aria-label="Social link"
              >
                <Icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <p className="font-display font-bold text-sm text-white tracking-wider uppercase mb-4">{col.title}</p>
            <ul className="space-y-3">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-teal-100/70 hover:text-teal-300 transition-colors duration-150 inline-flex items-center gap-1 group"
                  >
                    <span className="transition-transform duration-150 group-hover:translate-x-1">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="relative z-10 border-t border-teal-900/40 py-6 text-center text-xs text-teal-200/50 font-medium">
        <div className="container-app flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Smart Community Help Hub. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with care for communities everywhere ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
