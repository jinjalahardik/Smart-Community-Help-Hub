import { Link } from 'react-router-dom';
import { Clock3, Mail } from 'lucide-react';
import Button from '../../components/ui/Button';
import { PATHS } from '../../routes/paths';

function PendingVerification({ orgLabel }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-5">
        <Clock3 className="w-8 h-8 text-amber-600" />
      </div>
      <h1 className="text-2xl font-display font-bold">Verification in progress</h1>
      <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mt-2 max-w-sm mx-auto">
        Thanks for registering your {orgLabel}! Our admin team is reviewing your submitted documents. This usually takes 1-2 business days.
      </p>
      <div className="flex items-center justify-center gap-2 text-xs text-ink-light/65 dark:text-ink-dark/65 mt-4">
        <Mail className="w-3.5 h-3.5" /> We'll email you once your account is approved.
      </div>
      <Link to={PATHS.LOGIN}>
        <Button variant="outline" className="mt-6">Back to Login</Button>
      </Link>
    </div>
  );
}

export function PendingNgoVerification() {
  return <PendingVerification orgLabel="NGO" />;
}

export function PendingHospitalVerification() {
  return <PendingVerification orgLabel="hospital" />;
}
