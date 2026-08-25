import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_DASHBOARD_PATH } from '../constants/roles';

export default function GuestGuard() {
  const { isAuthenticated, user, bootstrapped } = useAuth();

  if (!bootstrapped) return null;

  if (isAuthenticated && user) {
    return <Navigate to={ROLE_DASHBOARD_PATH[user.role]} replace />;
  }

  return <Outlet />;
}
