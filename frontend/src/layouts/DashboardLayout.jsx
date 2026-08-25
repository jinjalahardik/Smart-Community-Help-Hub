import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import Drawer from '../components/ui/Drawer';
import PageTransition from '../components/shared/PageTransition';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NAV_CONFIG } from '../routes/navConfig';
import { cn } from '../utils/cn';

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const items = NAV_CONFIG[user?.role] || [];

  return (
    <div className="min-h-screen flex bg-surface-light dark:bg-surface-dark">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-teal-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">
        Skip to main content
      </a>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onOpenMobileMenu={() => setMobileOpen(true)} />
        <main id="main-content" className="flex-1 min-w-0 w-full container-app py-6 pb-24 lg:pb-6">
          <PageTransition />
        </main>
      </div>
      <MobileBottomNav onMore={() => setMobileOpen(true)} />

      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} title="Menu">
        <nav className="py-2 px-2 space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
                  isActive ? 'bg-teal-600 text-white' : 'text-ink-light/70 dark:text-ink-dark/70 hover:bg-teal-50 dark:hover:bg-teal-900/40'
                )
              }
            >
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </Drawer>
    </div>
  );
}
