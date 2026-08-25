import { Link } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { ROLE_DASHBOARD_PATH } from '../../constants/roles';
import { PATHS } from '../../routes/paths';

export default function AccessDenied() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface-light dark:bg-surface-dark">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-coral-50 dark:bg-coral-900/30 flex items-center justify-center mx-auto mb-5">
          <ShieldOff className="w-8 h-8 text-coral-500" />
        </div>
        <h1 className="text-2xl font-display font-bold">Access Denied</h1>
        <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mt-2">
          You don't have permission to view this page with your current role.
        </p>
        <Link to={user ? ROLE_DASHBOARD_PATH[user.role] : PATHS.HOME}>
          <Button className="mt-6">{user ? 'Back to Dashboard' : 'Back to Home'}</Button>
        </Link>
      </div>
    </div>
  );
}
