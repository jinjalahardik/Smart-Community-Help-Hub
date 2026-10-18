import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MailCheck } from 'lucide-react';
import Button from '../../components/ui/Button';
import { authService } from '../../features/auth/authService';
import { PATHS } from '../../routes/paths';

const COOLDOWN_SECONDS = 60;

export default function VerifyOtp() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(COOLDOWN_SECONDS);
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your registered email';
  const mode = location.state?.mode || 'register';
  const purpose = mode === 'reset' ? 'reset_password' : 'verify_email';

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

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

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const digits = pasted.split('');
    const next = ['', '', '', '', '', ''];
    digits.forEach((d, i) => { next[i] = d; });
    setOtp(next);
    const focusIdx = Math.min(digits.length, 5);
    inputsRef.current[focusIdx]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) return;

    setLoading(true);
    try {
      await authService.verifyOtp(email, code, purpose);
      toast.success('Verified successfully');
      if (mode === 'reset') {
        navigate(PATHS.RESET_PASSWORD, { state: { email } });
      } else {
        navigate(PATHS.EMAIL_VERIFIED);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Invalid verification code';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    try {
      await authService.requestOtp(email, purpose);
      toast.success('Verification code sent');
      setCooldown(COOLDOWN_SECONDS);
      setOtp(['', '', '', '', '', '']);
      inputsRef.current[0]?.focus();
    } catch (err) {
      const retryAfter = err?.response?.data?.retryAfter;
      if (retryAfter) {
        setCooldown(retryAfter);
      }
      const msg = err?.response?.data?.message || err?.message || 'Failed to send code';
      toast.error(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <div>
      <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-900/40 flex items-center justify-center mb-5">
        <MailCheck className="w-6 h-6 text-teal-600" />
      </div>
      <h1 className="text-2xl font-display font-bold">Verify your email</h1>
      <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mt-1.5">
        Enter the 6-digit code sent to <span className="font-medium text-ink-light dark:text-ink-dark">{email}</span>.
      </p>

      <div className="flex gap-2.5 mt-7" onPaste={handlePaste}>
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
            className="w-11 h-12 text-center text-lg font-semibold rounded-xl border border-teal-100 dark:border-teal-900/60 bg-white dark:bg-teal-950/40 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all outline-none"
          />
        ))}
      </div>

      <Button
        className="w-full mt-7"
        size="lg"
        loading={loading}
        onClick={handleVerify}
        disabled={otp.some((d) => !d) || loading}
      >
        Verify Code
      </Button>

      <p className="text-sm text-center text-ink-light/60 dark:text-ink-dark/60 mt-6">
        Didn't get the code?{' '}
        {cooldown > 0 ? (
          <span className="text-ink-light/50 dark:text-ink-dark/50 font-medium">
            Resend in {cooldown}s
          </span>
        ) : (
          <button
            type="button"
            className="text-teal-600 dark:text-teal-400 font-medium hover:underline disabled:opacity-60 transition-colors"
            onClick={handleResend}
            disabled={resending}
          >
            {resending ? 'Sending…' : 'Resend Code'}
          </button>
        )}
      </p>
    </div>
  );
}
