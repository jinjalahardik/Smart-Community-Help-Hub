import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Button from '../../components/ui/Button';
import { PATHS } from '../../routes/paths';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface-light dark:bg-surface-dark">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-900/40 flex items-center justify-center mx-auto mb-5">
          <Compass className="w-8 h-8 text-teal-600" />
        </div>
        <p className="text-5xl font-display font-bold text-teal-600">404</p>
        <h1 className="text-xl font-display font-bold mt-2">Page not found</h1>
        <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mt-2">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link to={PATHS.HOME}>
          <Button className="mt-6">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
