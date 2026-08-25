import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import { NAV_CONFIG, MOBILE_NAV_LIMIT } from '../../routes/navConfig';

export default function MobileBottomNav({ onMore }) {
  const { user } = useAuth();
  const items = (NAV_CONFIG[user?.role] || []).slice(0, MOBILE_NAV_LIMIT - 1);
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white dark:bg-teal-950 border-t border-teal-100 dark:border-teal-900/50 flex items-stretch pb-[env(safe-area-inset-bottom)]">
      {items.map((item) => {
        const isActive = location.pathname === item.to;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={cn(
              'relative flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium',
              isActive ? 'text-teal-600' : 'text-ink-light/65 dark:text-ink-dark/65'
            )}
          >
            <motion.span animate={{ scale: isActive ? 1.15 : 1, y: isActive ? -1 : 0 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
              <item.icon className="w-5 h-5" />
            </motion.span>
            <span className="truncate max-w-[64px]">{item.label}</span>
            {isActive && (
              <motion.span
                layoutId="mobile-nav-dot"
                className="absolute bottom-1 w-1 h-1 rounded-full bg-teal-600"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </NavLink>
        );
      })}
      <button onClick={onMore} className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium text-ink-light/65 dark:text-ink-dark/65 active:scale-95 transition-transform">
        <Menu className="w-5 h-5" />
        More
      </button>
    </nav>
  );
}
