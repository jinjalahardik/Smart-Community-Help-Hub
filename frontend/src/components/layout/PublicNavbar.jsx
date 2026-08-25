import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
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

  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-surface-dark/85 backdrop-blur-md border-b border-teal-100 dark:border-teal-900/50">
      <div className="container-app h-16 flex items-center gap-4">
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
              whileHover={{ rotate: -4, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 320, damping: 14 }}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-teal-600 flex items-center justify-center shrink-0 shadow-soft transition-shadow duration-200 group-hover:shadow-card-hover"
            >
              <HeartHandshake className="w-6 h-6 sm:w-[26px] sm:h-[26px] text-white" />
            </motion.div>
            <span className="hidden sm:flex flex-col leading-[1.1] min-w-[132px]">
              <span className="font-display font-extrabold text-[18px] lg:text-[20px] text-ink-light dark:text-ink-dark whitespace-nowrap">
                Smart Community
              </span>
              <span className="font-display font-extrabold text-[18px] lg:text-[20px] text-teal-600 whitespace-nowrap">
                Help Hub
              </span>
            </span>
          </Link>
        </motion.div>

        <nav className="hidden lg:flex items-center gap-0.5 ml-4" aria-label="Primary">
          {LINKS.map((l) => {
            const isActive = location.pathname === l.to;
            return (
              <NavLink
                key={l.to}
                to={l.to}
                className={cn(
                  'relative px-2.5 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive ? 'text-teal-700 dark:text-teal-300' : 'text-ink-light/70 dark:text-ink-dark/70 hover:text-teal-600'
                )}
              >
                {l.label}
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-underline"
                    className="absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-teal-600"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
<ThemeToggle />
          <Button variant="coral" size="sm" icon={Siren} onClick={() => navigate(isAuthenticated ? PATHS.REQUESTER.CREATE : PATHS.LOGIN)} className="hidden sm:inline-flex">
            Get Help
          </Button>
          {isAuthenticated ? (
            <Button size="sm" onClick={() => navigate(ROLE_DASHBOARD_PATH[user.role])}>Dashboard</Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate(PATHS.LOGIN)} className="hidden sm:inline-flex">Login</Button>
              <Button size="sm" onClick={() => navigate(PATHS.REGISTER)}>Sign Up</Button>
            </>
          )}
          <button onClick={() => setOpen(true)} aria-label="Open menu" className="lg:hidden p-2 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/40">
            <Menu className="w-5 h-5" />
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
                cn('block px-3.5 py-3 rounded-xl text-sm font-medium transition-colors', isActive ? 'bg-teal-600 text-white' : 'hover:bg-teal-50 dark:hover:bg-teal-900/40')
              }
            >
              {l.label}
            </NavLink>
          ))}
          <div className="pt-3 mt-3 border-t border-teal-100 dark:border-teal-900/50 space-y-2">
            <Button
              variant="coral"
              icon={Siren}
              className="w-full"
              onClick={() => { setOpen(false); navigate(isAuthenticated ? PATHS.REQUESTER.CREATE : PATHS.LOGIN); }}
            >
              Get Help
            </Button>
            {!isAuthenticated && (
              <Button variant="outline" className="w-full" onClick={() => { setOpen(false); navigate(PATHS.LOGIN); }}>Login</Button>
            )}
          </div>
        </nav>
      </Drawer>
    </header>
  );
}
