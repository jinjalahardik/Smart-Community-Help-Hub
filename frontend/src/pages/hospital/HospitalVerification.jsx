import VerificationStatusView from '../../components/shared/VerificationStatusView';
import { useAuth } from '../../context/AuthContext';
import { useHospitalProfile } from '../../hooks/useHospital';

export default function HospitalVerification() {
  const { user } = useAuth();
  const { data: org, isLoading, error, refetch } = useHospitalProfile(user.orgId);
  return <VerificationStatusView org={org} isLoading={isLoading} error={error} onRetry={refetch} />;
}
