import VerificationStatusView from '../../components/shared/VerificationStatusView';
import { useAuth } from '../../context/AuthContext';
import { useNgoProfile } from '../../hooks/useNgo';

export default function NgoVerification() {
  const { user } = useAuth();
  const { data: org, isLoading, error, refetch } = useNgoProfile(user.orgId);
  return <VerificationStatusView org={org} isLoading={isLoading} error={error} onRetry={refetch} />;
}
