import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import { PATHS } from '../../routes/paths';

export default function EmailVerified() {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-900/40 flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 className="w-8 h-8 text-teal-600" />
      </div>
      <h1 className="text-2xl font-display font-bold">You're all set!</h1>
      <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mt-2 max-w-sm mx-auto">
        Your account has been created and verified successfully. You can now log in and start using Smart Community Help Hub.
      </p>
      <Link to={PATHS.LOGIN}>
        <Button className="mt-6" size="lg">Continue to Login</Button>
      </Link>
    </div>
  );
}
