import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { HeartHandshake, ChevronsLeft, Settings, LogOut } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import { NAV_CONFIG } from '../../routes/navConfig';
import { toggleSidebarCollapsed } from '../../store/slices/uiSlice';
import { ROLE_LABELS } from '../../constants/roles';
import { PATHS } from '../../routes/paths';
import Avatar from '../ui/Avatar';
import Tooltip from '../ui/Tooltip';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const collapsed = useSelector((s) => s.ui.sidebarCollapsed);
  const dispatch = useDispatch();
  const items = NAV_CONFIG[user?.role] || [];
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(PATHS.LOGIN);
  };

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col shrink-0 h-screen sticky top-0 border-r border-teal-100 dark:border-teal-200/[0.14] bg-white dark:bg-surface-card transition-[width] duration-200',
        collapsed ? 'w-[76px]' : 'w-64'
      )}
    >
      <div className="flex items-center gap-2.5 px-4 h-16 border-b border-teal-100 dark:border-teal-200/[0.14] shrink-0">
        <motion.div
          initial={{ rotate: -8, scale: 0.9 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
          className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shrink-0"
        >
          <HeartHandshake className="w-5 h-5 text-white" />
        </motion.div>
        {!collapsed && <span className="font-display font-bold text-sm leading-tight">Smart Community<br />Help Hub</span>}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-1 no-scrollbar" aria-label="Primary navigation">
        {items.map((item) => {
          const isActive = location.pathname === item.to;
          const link = (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={cn(
                'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
                collapsed && 'justify-center',
                isActive ? 'text-white' : 'text-ink-light/70 dark:text-ink-dark/70 hover:bg-teal-50 dark:hover:bg-surface-soft'
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-xl bg-teal-600 shadow-soft"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <item.icon className="relative w-[18px] h-[18px] shrink-0" />
              {!collapsed && <span className="relative truncate">{item.label}</span>}
            </NavLink>
          );
          return collapsed ? (
            <Tooltip key={item.to} content={item.label} side="right">{link}</Tooltip>
          ) : link;
        })}
      </nav>

      <div className="border-t border-teal-100 dark:border-teal-200/[0.14] shrink-0">
        <div className={cn('flex items-center gap-2.5 px-4 py-3.5', collapsed && 'justify-center px-2')}>
          {collapsed ? (
            <Tooltip content={user?.name} side="right"><Avatar name={user?.name} color={user?.avatarColor} size="sm" /></Tooltip>
          ) : (
            <>
              <Avatar name={user?.name} color={user?.avatarColor} size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-[11px] text-ink-light/65 dark:text-ink-dark/65 truncate">{ROLE_LABELS[user?.role]}</p>
              </div>
            </>
          )}
        </div>
        <div className={cn('flex gap-1 px-2.5 pb-2.5', collapsed && 'flex-col items-center')}>
          {collapsed ? (
            <>
              <Tooltip content="Settings" side="right">
                <button onClick={() => navigate(PATHS.SETTINGS)} aria-label="Settings" className="p-2 rounded-lg hover:bg-teal-50 dark:hover:bg-surface-soft text-ink-light/60"><Settings className="w-4 h-4" /></button>
              </Tooltip>
              <Tooltip content="Logout" side="right">
                <button onClick={handleLogout} aria-label="Logout" className="p-2 rounded-lg hover:bg-coral-50 dark:hover:bg-coral-900/30 text-coral-600"><LogOut className="w-4 h-4" /></button>
              </Tooltip>
            </>
          ) : (
            <>
              <button onClick={() => navigate(PATHS.SETTINGS)} className="flex-1 flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-ink-light/60 hover:bg-teal-50 dark:hover:bg-surface-soft hover:text-teal-700">
                <Settings className="w-4 h-4" /> Settings
              </button>
              <button onClick={handleLogout} className="flex-1 flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-coral-600 hover:bg-coral-50 dark:hover:bg-coral-900/30">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          )}
        </div>
      </div>

      <button
        onClick={() => dispatch(toggleSidebarCollapsed())}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="flex items-center gap-2 px-4 py-3 border-t border-teal-100 dark:border-teal-200/[0.14] text-xs text-ink-light/60 hover:text-teal-600 transition-colors justify-center lg:justify-start"
      >
        <motion.span animate={{ rotate: collapsed ? 180 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
          <ChevronsLeft className="w-4 h-4" />
        </motion.span>
        {!collapsed && 'Collapse'}
      </button>
    </aside>
  );
}
