import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MailCheck } from 'lucide-react';
import Button from '../../components/ui/Button';
import { authService } from '../../features/auth/authService';
import { PATHS } from '../../routes/paths';

export default function VerifyOtp() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your registered email';
  const mode = location.state?.mode || 'register';

  const handleChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) inputsRef.current[idx - 1]?.focus();
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      await authService.verifyOtp(email, otp.join(''));
      toast.success('Verified successfully');
      if (mode === 'reset') navigate(PATHS.RESET_PASSWORD, { state: { email } });
      else navigate(PATHS.EMAIL_VERIFIED);
    } catch (err) {
      toast.error(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-900/40 flex items-center justify-center mb-5">
        <MailCheck className="w-6 h-6 text-teal-600" />
      </div>
      <h1 className="text-2xl font-display font-bold">Verify your email</h1>
      <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mt-1.5">Enter the 6-digit code sent to <span className="font-medium">{email}</span>. (Demo code: 123456)</p>

      <div className="flex gap-2.5 mt-7">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputsRef.current[idx] = el)}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            maxLength={1}
            inputMode="numeric"
            aria-label={`Digit ${idx + 1}`}
            className="w-11 h-12 text-center text-lg font-semibold rounded-xl border border-teal-100 dark:border-teal-900/60 bg-white dark:bg-teal-950/40 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
        ))}
      </div>

      <Button className="w-full mt-7" size="lg" loading={loading} onClick={handleVerify} disabled={otp.some((d) => !d)}>
        Verify Code
      </Button>

      <p className="text-sm text-center text-ink-light/60 dark:text-ink-dark/60 mt-6">
        Didn't get the code? <button className="text-teal-600 font-medium hover:underline">Resend</button>
      </p>
    </div>
  );
}
