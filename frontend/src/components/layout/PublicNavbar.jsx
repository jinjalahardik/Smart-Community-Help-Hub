import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { HeartHandshake, Menu, Siren, ArrowRight, LayoutDashboard, Sparkles, ChevronRight } from 'lucide-react';
import Drawer from '../ui/Drawer';
import ThemeToggle from '../ui/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { PATHS } from '../../routes/paths';
import { ROLE_DASHBOARD_PATH } from '../../constants/roles';
import { cn } from '../../utils/cn';

const LINKS = [
  { label: 'How It Works', to: PATHS.HOW_IT_WORKS },
  { label: 'Donate', to: PATHS.CATEGORIES },
  { label: 'Celebrate', to: PATHS.CELEBRATE.INDEX, badge: 'sparkle' },
  { label: 'NGOs', to: PATHS.NGOS },
  { label: 'Volunteer', to: PATHS.VOLUNTEER_INFO },
  { label: 'About', to: PATHS.ABOUT },
  { label: 'Contact', to: PATHS.CONTACT },
];

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { scrollY, scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setScrolled(latest > 16);
    });
  }, [scrollY]);

  return (
    <>
      {/* 2026 Precision Hairline Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-400 origin-left z-50 shadow-[0_1px_6px_rgba(20,184,166,0.35)]"
        style={{ scaleX }}
      />

      {/* Floating Dynamic Island Header */}
      <header
        className={cn(
          'sticky top-0 z-40 transition-all duration-300 select-none',
          scrolled
            ? 'py-2 sm:py-2.5 bg-white/85 dark:bg-[#040E0C]/85 backdrop-blur-2xl border-b border-slate-200/70 dark:border-teal-900/30 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
            : 'py-3 sm:py-3.5 bg-white/60 dark:bg-[#040E0C]/60 backdrop-blur-xl border-b border-slate-200/40 dark:border-teal-950/40'
        )}
      >
        <div className="container-app flex items-center justify-between gap-3 lg:gap-4">
          
          {/* Logo & Brand (100% UNTOUCHED) */}
          <Link
            to={PATHS.HOME}
            aria-label="Go to Smart Community Help Hub home"
            className="group flex items-center gap-3 py-1 transition-transform duration-200 hover:scale-[1.015] active:scale-[0.99] shrink-0"
          >
            <motion.div
              whileHover={{ rotate: -6, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(45,212,191,0.4)] border border-white/25"
            >
              <HeartHandshake className="w-5 h-5 text-white filter drop-shadow" />
            </motion.div>
            <span className="flex flex-col leading-tight min-w-0 whitespace-nowrap sm:min-w-[140px]">
              <span className="font-display font-extrabold text-[17px] sm:text-[19px] text-ink-light dark:text-ink-dark tracking-tight">
                Smart Community
              </span>
              <span className="font-display font-bold text-xs tracking-wider uppercase text-teal-600 dark:text-teal-400">
                Help Hub
              </span>
            </span>
          </Link>

          {/* Desktop Navigation Links Island (2026 Tactile Frosted Glass Capsule) */}
          <nav
            onMouseLeave={() => setHoveredIndex(null)}
            className="hidden xl:flex items-center p-1 rounded-full bg-slate-900/[0.03] dark:bg-white/[0.04] border border-slate-200/75 dark:border-white/[0.08] backdrop-blur-xl shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.9),0_1px_3px_rgba(0,0,0,0.02)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
            aria-label="Primary"
          >
            {LINKS.map((l, index) => {
              const isActive = location.pathname === l.to;
              return (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onMouseEnter={() => setHoveredIndex(index)}
                  className={cn(
                    'relative px-3.5 py-1.5 rounded-full text-[13px] font-medium tracking-tight transition-colors duration-150 flex items-center gap-1.5 select-none',
                    isActive
                      ? 'text-teal-900 dark:text-teal-100 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                  )}
                >
                  <span>{l.label}</span>
                  {l.badge === 'sparkle' && (
                    <Sparkles className="w-3 h-3 text-amber-500 dark:text-amber-400 opacity-90 animate-pulse" />
                  )}

                  {/* Active Elevated Card Pill */}
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 rounded-full bg-white dark:bg-teal-950/85 shadow-[0_1px_4px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_8px_rgba(0,0,0,0.4)] border border-slate-200/90 dark:border-teal-500/30 -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}

                  {/* Fluid Hover Glider Pill */}
                  {!isActive && hoveredIndex === index && (
                    <motion.span
                      layoutId="navbar-hover-pill"
                      className="absolute inset-0 rounded-full bg-slate-900/[0.04] dark:bg-white/[0.08] -z-20"
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Actions Command Cluster: Theme Toggle, Hairline Divider, Emergency CTA, Auth CTAs */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Theme Toggle with Refined Glass Housing */}
            <div className="flex items-center justify-center">
              <ThemeToggle className="w-9 h-9 sm:w-9 sm:h-9 rounded-full border border-slate-200/70 dark:border-teal-900/60 bg-slate-100/60 dark:bg-white/[0.04] hover:bg-slate-200/60 dark:hover:bg-white/[0.08] text-slate-700 dark:text-slate-300 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] dark:shadow-none" />
            </div>

            {/* Micro Hairline Separator */}
            <div className="h-4 w-[1px] bg-slate-200/80 dark:bg-white/10 hidden sm:block mx-0.5" />

            {/* Emergency CTA ("Get Help") - Balanced Coral Gradient with Urgent Ping Beacon */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate(isAuthenticated ? PATHS.REQUESTER.CREATE : PATHS.LOGIN)}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-display font-bold tracking-tight text-white bg-gradient-to-r from-rose-500 via-coral-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-[0_2px_12px_rgba(244,63,94,0.3),inset_0_1px_1px_rgba(255,255,255,0.35)] hover:shadow-[0_4px_18px_rgba(244,63,94,0.45)] border border-rose-400/40 active:scale-95 transition-all cursor-pointer group"
            >
              <Siren className="w-3.5 h-3.5 text-white/95 group-hover:rotate-12 transition-transform duration-200 shrink-0" />
              <span>Get Help</span>
            </motion.button>

            {/* Auth State CTAs */}
            {isAuthenticated ? (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(ROLE_DASHBOARD_PATH[user.role])}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-teal-800 dark:text-teal-200 bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60 hover:bg-teal-100/70 dark:hover:bg-teal-900/50 shadow-sm transition-all cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Dashboard</span>
              </motion.button>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(PATHS.LOGIN)}
                  className="hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-slate-100/80 dark:hover:bg-white/[0.06] transition-all cursor-pointer"
                >
                  Log In
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate(PATHS.REGISTER)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-display font-bold text-white bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 hover:from-teal-500 hover:to-cyan-600 shadow-[0_2px_12px_rgba(15,118,110,0.28),inset_0_1px_1px_rgba(255,255,255,0.35)] hover:shadow-[0_4px_18px_rgba(20,184,166,0.42)] border border-teal-400/35 active:scale-95 transition-all cursor-pointer group"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-3.5 h-3.5 text-teal-200 group-hover:translate-x-0.5 transition-transform duration-150 shrink-0" />
                </motion.button>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="xl:hidden p-2 rounded-xl border border-slate-200/70 dark:border-teal-900/60 bg-slate-100/60 dark:bg-white/[0.04] hover:bg-slate-200/70 dark:hover:bg-white/[0.08] text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <Drawer open={open} onClose={() => setOpen(false)} title="Menu" side="right">
          <div className="flex flex-col h-full p-4 space-y-4 justify-between" aria-label="Mobile">
            <div className="space-y-1">
              <div className="px-3 py-2 mb-2">
                <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                  Navigation
                </span>
              </div>
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 font-semibold border border-teal-200/60 dark:border-teal-700/40'
                        : 'hover:bg-slate-100/80 dark:hover:bg-white/[0.05] text-slate-700 dark:text-slate-200'
                    )
                  }
                >
                  <span className="flex items-center gap-2">
                    {l.label}
                    {l.badge === 'sparkle' && (
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    )}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                </NavLink>
              ))}
            </div>

            {/* Mobile Drawer Bottom Actions */}
            <div className="pt-4 border-t border-slate-200/70 dark:border-teal-900/50 space-y-2.5">
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setOpen(false);
                  navigate(isAuthenticated ? PATHS.REQUESTER.CREATE : PATHS.LOGIN);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-rose-500 via-coral-500 to-rose-600 shadow-[0_2px_10px_rgba(244,63,94,0.3)] border border-rose-400/40 cursor-pointer"
              >
                <Siren className="w-4 h-4" />
                <span>Get Emergency Help</span>
              </motion.button>
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    navigate(ROLE_DASHBOARD_PATH[user.role]);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-teal-800 dark:text-teal-200 bg-teal-50 dark:bg-teal-900/40 border border-teal-200 dark:border-teal-800/60 transition-colors"
                >
                  Go to Dashboard
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    className="py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/10 hover:bg-slate-200/70 transition-colors cursor-pointer"
                    onClick={() => {
                      setOpen(false);
                      navigate(PATHS.LOGIN);
                    }}
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    className="py-2.5 px-3 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors cursor-pointer"
                    onClick={() => {
                      setOpen(false);
                      navigate(PATHS.REGISTER);
                    }}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </Drawer>
      </header>
    </>
  );
}




