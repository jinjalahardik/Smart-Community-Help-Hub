import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PATHS } from './paths';

export default function RoleGuard({ allowedRoles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to={PATHS.LOGIN} replace />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={PATHS.ACCESS_DENIED} replace />;
  }

  return <Outlet />;
}
