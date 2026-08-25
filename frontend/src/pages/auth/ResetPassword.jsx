import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Lock } from 'lucide-react';
import PasswordInput from '../../components/ui/PasswordInput';
import Button from '../../components/ui/Button';
import { resetPasswordSchema } from '../../validators/authSchemas';
import { authService } from '../../features/auth/authService';
import { PATHS } from '../../routes/paths';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(resetPasswordSchema), defaultValues: { password: '', confirmPassword: '' } });

  const onSubmit = async ({ password }) => {
    try {
      await authService.resetPassword(email, password);
      toast.success('Password reset successfully. Please log in.');
      navigate(PATHS.LOGIN);
    } catch (err) {
      toast.error(err.message || 'Failed to reset password');
    }
  };

  return (
    <div>
      <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-900/40 flex items-center justify-center mb-5">
        <Lock className="w-6 h-6 text-teal-600" />
      </div>
      <h1 className="text-2xl font-display font-bold">Set a new password</h1>
      <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mt-1.5">Choose a strong password you haven't used before.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
        <PasswordInput label="New Password" required showStrength value={watch('password')} {...register('password')} error={errors.password?.message} />
        <PasswordInput label="Confirm New Password" required {...register('confirmPassword')} error={errors.confirmPassword?.message} />
        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>Reset Password</Button>
      </form>
    </div>
  );
}
