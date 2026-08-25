import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Mail, KeyRound } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { forgotPasswordSchema } from '../../validators/authSchemas';
import { authService } from '../../features/auth/authService';
import { PATHS } from '../../routes/paths';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async ({ email }) => {
    try {
      await authService.requestOtp(email);
      toast.success('OTP sent to your email (demo OTP: 123456)');
      navigate(PATHS.VERIFY_EMAIL, { state: { email, mode: 'reset' } });
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP');
    }
  };

  return (
    <div>
      <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-900/40 flex items-center justify-center mb-5">
        <KeyRound className="w-6 h-6 text-teal-600" />
      </div>
      <h1 className="text-2xl font-display font-bold">Forgot your password?</h1>
      <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mt-1.5">Enter your email and we'll send you a one-time code to reset it.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
        <Input label="Email Address" type="email" icon={Mail} required {...register('email')} error={errors.email?.message} />
        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>Send Reset Code</Button>
      </form>

      <p className="text-sm text-center text-ink-light/60 dark:text-ink-dark/60 mt-6">
        Remembered it? <Link to={PATHS.LOGIN} className="text-teal-600 font-medium hover:underline">Back to login</Link>
      </p>
    </div>
  );
}
