import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { HeartHandshake, Menu, Siren } from 'lucide-react';
import Button from '../ui/Button';
import Drawer from '../ui/Drawer';
import ThemeToggle from '../ui/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { PATHS } from '../../routes/paths';
import { ROLE_DASHBOARD_PATH } from '../../constants/roles';
import { cn } from '../../utils/cn';

const LINKS = [
  { label: 'About', to: PATHS.ABOUT },
  { label: 'How It Works', to: PATHS.HOW_IT_WORKS },
  { label: 'Donate', to: PATHS.CATEGORIES },
  { label: 'NGOs', to: PATHS.NGOS },
  { label: 'Volunteer', to: PATHS.VOLUNTEER_INFO },
  { label: 'Contact', to: PATHS.CONTACT },
];

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400 origin-left z-50 shadow-[0_0_12px_rgba(45,212,191,0.8)]"
        style={{ scaleX }}
      />

      <header className="sticky top-0 z-40 bg-white/80 dark:bg-surface-dark/85 backdrop-blur-xl border-b border-teal-100/80 dark:border-teal-900/60 shadow-sm transition-all duration-300">
        <div className="container-app h-16 sm:h-20 flex items-center gap-4">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="shrink-0"
          >
            <Link
              to={PATHS.HOME}
              className="group flex items-center gap-3 py-1 transition-transform duration-200 hover:scale-[1.015] active:scale-[0.99]"
            >
              <motion.div
                whileHover={{ rotate: -5, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shrink-0 shadow-[0_4px_16px_rgba(15,118,110,0.35)] group-hover:shadow-[0_6px_24px_rgba(45,212,191,0.45)]"
              >
                <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6 text-white filter drop-shadow" />
              </motion.div>
              <span className="hidden sm:flex flex-col leading-[1.1] min-w-[132px]">
                <span className="font-display font-extrabold text-[17px] lg:text-[19px] text-ink-light dark:text-ink-dark whitespace-nowrap tracking-tight">
                  Smart Community
                </span>
                <span className="font-display font-extrabold text-[17px] lg:text-[19px] text-teal-600 dark:text-teal-400 whitespace-nowrap tracking-tight">
                  Help Hub
                </span>
              </span>
            </Link>
          </motion.div>

          <nav className="hidden lg:flex items-center gap-1 ml-6" aria-label="Primary">
            {LINKS.map((l) => {
              const isActive = location.pathname === l.to;
              return (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={cn(
                    'relative px-3 py-2 rounded-xl text-sm font-semibold transition-colors duration-200',
                    isActive ? 'text-teal-700 dark:text-teal-300' : 'text-ink-light/75 dark:text-ink-dark/75 hover:text-teal-600 dark:hover:text-teal-300'
                  )}
                >
                  {l.label}
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active-underline"
                      className="absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 shadow-[0_0_8px_rgba(45,212,191,0.7)]"
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="coral"
              size="sm"
              icon={Siren}
              onClick={() => navigate(isAuthenticated ? PATHS.REQUESTER.CREATE : PATHS.LOGIN)}
              className="hidden sm:inline-flex shadow-glow-emergency font-semibold"
            >
              Get Help
            </Button>
            {isAuthenticated ? (
              <Button size="sm" onClick={() => navigate(ROLE_DASHBOARD_PATH[user.role])} className="font-semibold">
                Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate(PATHS.LOGIN)} className="hidden sm:inline-flex font-semibold">
                  Login
                </Button>
                <Button size="sm" onClick={() => navigate(PATHS.REGISTER)} className="font-semibold shadow-glow-primary">
                  Sign Up
                </Button>
              </>
            )}
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="lg:hidden p-2 rounded-xl border border-teal-100 dark:border-teal-800/60 hover:bg-teal-50 dark:hover:bg-teal-900/40"
            >
              <Menu className="w-5 h-5 text-ink-light dark:text-ink-dark" />
            </button>
          </div>
        </div>

        <Drawer open={open} onClose={() => setOpen(false)} title="Menu" side="right">
          <nav className="p-3 space-y-1" aria-label="Mobile">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'block px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
                    isActive ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md' : 'hover:bg-teal-50 dark:hover:bg-teal-900/40 text-ink-light dark:text-ink-dark'
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="pt-4 mt-4 border-t border-teal-100 dark:border-teal-900/50 space-y-2.5">
              <Button
                variant="coral"
                icon={Siren}
                className="w-full font-semibold"
                onClick={() => { setOpen(false); navigate(isAuthenticated ? PATHS.REQUESTER.CREATE : PATHS.LOGIN); }}
              >
                Get Help
              </Button>
              {!isAuthenticated && (
                <Button variant="outline" className="w-full font-semibold" onClick={() => { setOpen(false); navigate(PATHS.LOGIN); }}>
                  Login
                </Button>
              )}
            </div>
          </nav>
        </Drawer>
      </header>
    </>
  );
}
