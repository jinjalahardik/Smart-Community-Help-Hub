import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLE_DASHBOARD_PATH } from '../../constants/roles';

export default function DashboardRedirect() {
  const { user } = useAuth();
  if (!user) return null;
  return <Navigate to={ROLE_DASHBOARD_PATH[user.role]} replace />;
}
