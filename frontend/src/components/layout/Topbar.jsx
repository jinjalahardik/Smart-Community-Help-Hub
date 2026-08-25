import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, User, Settings, LogOut, Search } from 'lucide-react';
import IconButton from '../ui/IconButton';
import ThemeToggle from '../ui/ThemeToggle';
import Avatar from '../ui/Avatar';
import Dropdown, { DropdownItem } from '../ui/Dropdown';
import { useAuth } from '../../context/AuthContext';
import { useNotifications, useMarkNotificationRead } from '../../hooks/useNotifications';
import NotificationItem from '../shared/NotificationItem';
import EmptyState from '../ui/EmptyState';
import { PATHS } from '../../routes/paths';
import { ROLE_LABELS } from '../../constants/roles';

export default function Topbar({ onOpenMobileMenu }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { data: notifications = [] } = useNotifications(user?.id);
  const markRead = useMarkNotificationRead();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = async () => {
    await logout();
    navigate(PATHS.LOGIN);
  };

  return (
    <header className="sticky top-0 z-20 h-16 flex items-center gap-3 px-4 sm:px-6 border-b border-teal-100 dark:border-teal-200/[0.14] bg-white/90 dark:bg-surface-card/90 backdrop-blur-md">
      <button onClick={onOpenMobileMenu} aria-label="Open menu" className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/40">
        <Menu className="w-5 h-5" />
      </button>

      <div className="hidden sm:block relative flex-1 max-w-sm">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-500/60" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          aria-label="Search"
          className="w-full rounded-xl border border-teal-100 dark:border-teal-200/[0.14] bg-teal-50/50 dark:bg-surface-soft/40 pl-10 pr-3 py-2 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <ThemeToggle />

        <Dropdown
          trigger={
            <span className="relative inline-flex">
              <motion.span
                animate={unreadCount > 0 ? { rotate: [0, -12, 10, -6, 0] } : {}}
                transition={{ duration: 0.6, repeat: unreadCount > 0 ? Infinity : 0, repeatDelay: 4 }}
                className="inline-flex"
              >
                <IconButton icon={Bell} label="Notifications" />
              </motion.span>
              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-coral-500 text-white text-[10px] flex items-center justify-center font-semibold"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          }
          className="w-80 max-h-96 overflow-y-auto"
        >
          <div className="px-4 py-2.5 border-b border-teal-100 dark:border-teal-900/50 flex items-center justify-between">
            <span className="font-display font-semibold text-sm">Notifications</span>
            <button onClick={() => navigate(PATHS.NOTIFICATIONS)} className="text-xs text-teal-600 hover:underline">View all</button>
          </div>
          {notifications.length === 0 ? (
            <EmptyState title="No notifications" className="py-8" />
          ) : (
            notifications.slice(0, 6).map((n) => (
              <NotificationItem key={n.id} notification={n} onClick={() => !n.read && markRead.mutate(n.id)} />
            ))
          )}
        </Dropdown>

        <Dropdown
          trigger={
            <button className="flex items-center gap-2 pl-1 pr-1 py-1 rounded-full hover:bg-teal-50 dark:hover:bg-teal-900/40">
              <Avatar name={user?.name} color={user?.avatarColor} size="sm" />
            </button>
          }
        >
          <div className="px-3.5 py-2.5 border-b border-teal-100 dark:border-teal-900/50">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-ink-light/65 dark:text-ink-dark/65">{ROLE_LABELS[user?.role]}</p>
          </div>
          <DropdownItem icon={User} onClick={() => navigate(PATHS.PROFILE)}>Profile</DropdownItem>
          <DropdownItem icon={Settings} onClick={() => navigate(PATHS.SETTINGS)}>Settings</DropdownItem>
          <DropdownItem icon={LogOut} onClick={handleLogout} className="text-coral-600">Logout</DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
