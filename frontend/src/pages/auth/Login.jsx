import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Toggle';
import LoginCard from '../../components/auth/LoginCard';
import LoginField from '../../components/auth/LoginField';
import DemoAccounts from '../../components/auth/DemoAccounts';
import { loginSchema } from '../../validators/authSchemas';
import { useAuth } from '../../context/AuthContext';
import { PATHS } from '../../routes/paths';
import { ROLE_DASHBOARD_PATH, ROLES } from '../../constants/roles';
import { USER_STATUS, VERIFICATION_STATUS } from '../../constants/categories';

const DEMO_ACCOUNTS = [
  { role: 'Admin', email: 'admin@helpconnect.demo', password: 'Admin@123' },
  { role: 'Donor', email: 'donor@helpconnect.demo', password: 'Donor@123' },
  { role: 'NGO', email: 'ngo@helpconnect.demo', password: 'Ngo@123' },
  { role: 'Volunteer', email: 'volunteer@helpconnect.demo', password: 'Volunteer@123' },
  { role: 'Requester', email: 'requester@helpconnect.demo', password: 'Requester@123' },
  { role: 'Hospital', email: 'hospital@helpconnect.demo', password: 'Hospital@123' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  // The login form must ALWAYS start empty. Browsers (especially Chrome) may
  // autofill these fields on page load with a previously saved value (e.g. a
  // stray "hero" token), which would otherwise show inside the email input.
  // We reset once on mount so any browser prefill is cleared while still
  // allowing legitimate autofill suggestions once the user focuses. This runs
  // immediately (not on a timer) so it can never race with fast typing.
  useEffect(() => {
    reset({ email: '', password: '', rememberMe: false });
  }, [reset]);

  // Browser autofill can also fire slightly after first paint. Chrome exposes
  // this via an `animationstart` event (see the `schh-autofill` keyframe in
  // styles/index.css). During the initial-load window we clear any such
  // prefill; after that window, normal autofill-on-focus still works.
  useEffect(() => {
    const onAnimationStart = (e) => {
      if (e.animationName !== 'schh-autofill') return;
      const el = e.target;
      if (el && el.matches && (el.matches('input[type="email"]') || el.matches('input[type="password"]'))) {
        reset({ email: '', password: '', rememberMe: false });
      }
    };
    document.addEventListener('animationstart', onAnimationStart);
    const stop = setTimeout(() => document.removeEventListener('animationstart', onAnimationStart), 5000);
    return () => {
      document.removeEventListener('animationstart', onAnimationStart);
      clearTimeout(stop);
    };
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      const { user, orgStatus } = await login(data);
      if (user.status === USER_STATUS.PENDING) {
        navigate(user.role === ROLES.NGO ? PATHS.PENDING_NGO : PATHS.PENDING_HOSPITAL);
        return;
      }
      if (orgStatus === VERIFICATION_STATUS.REJECTED) {
        toast.error('Your organization verification was rejected. Please contact support.');
        return;
      }
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(location.state?.from || ROLE_DASHBOARD_PATH[user.role]);
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };

  const fillDemo = (acc) => {
    setValue('email', acc.email);
    setValue('password', acc.password);
  };

  return (
    <LoginCard>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <LoginField
          label="Email address"
          type="email"
          icon={Mail}
          autoComplete="email"
          {...register('email')}
          error={errors.email?.message}
        />

        <LoginField
          label="Password"
          type="password"
          icon={Lock}
          autoComplete="current-password"
          {...register('password')}
          error={errors.password?.message}
        />

        <div className="flex items-center justify-between pt-1">
          <Checkbox label="Remember me" {...register('rememberMe')} />
          <Link
            to={PATHS.FORGOT_PASSWORD}
            className="text-sm font-medium text-teal-600 transition-colors duration-150 hover:text-teal-700 hover:underline dark:text-teal-300 dark:hover:text-teal-200"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          size="lg"
          loading={isSubmitting}
          className="group relative w-full overflow-hidden bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 shadow-[0_8px_24px_-6px_rgba(15,118,110,0.5)] hover:shadow-[0_10px_32px_-4px_rgba(45,212,191,0.55)]"
        >
          <span className="relative">Log In</span>
          <ArrowRight
            className="relative h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
          />
        </Button>
      </form>

      <div className="mt-6">
        <DemoAccounts
          accounts={DEMO_ACCOUNTS}
          onUse={fillDemo}
        />
      </div>

      <p className="mt-6 text-sm text-center text-ink-light/60 dark:text-ink-dark/60">
        Don't have an account?{' '}
        <Link
          to={PATHS.REGISTER}
          className="font-semibold text-teal-600 transition-colors duration-150 hover:text-teal-700 hover:underline dark:text-teal-300 dark:hover:text-teal-200"
        >
          Sign up
        </Link>
      </p>

      <p className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-ink-light/45 dark:text-ink-dark/45">
        <ShieldCheck className="h-3.5 w-3.5 text-teal-500 dark:text-teal-400" aria-hidden="true" />
        Secure login • Your data stays protected
      </p>
    </LoginCard>
  );
}
