import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, KeyRound, Receipt, PartyPopper, UserCheck, ArrowRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useRequestReceiptOtp, useVerifyReceiptOtp, useClaimDonation } from '../../hooks/useCelebrations';
import { formatNumber, formatDate } from '../../utils/format';
import { PATHS } from '../../routes/paths';

export default function GuestReceipts() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [sent, setSent] = useState(false);
  const [receipts, setReceipts] = useState(null);
  const [cooldown, setCooldown] = useState(0);

  const request = useRequestReceiptOtp();
  const verify = useVerifyReceiptOtp();
  const claim = useClaimDonation();

  const handleRequest = async () => {
    if (!email.trim() || cooldown > 0) return;
    try {
      await request.mutateAsync(email);
      setSent(true);
      setCooldown(60);
    } catch (err) {
      const retryAfter = err?.response?.data?.retryAfter;
      if (retryAfter) setCooldown(retryAfter);
    }
  };

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = async () => {
    try {
      const res = await verify.mutateAsync({ email, otp });
      if (res.receipts) setReceipts(res.receipts);
    } catch {
      // Error toast is already shown by useVerifyReceiptOtp onError.
    }
  };

  const claimRef = (reference) => {
    claim.mutate(reference);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/60 to-transparent dark:from-teal-950/30">
      <div className="container-app max-w-2xl py-12 sm:py-16">
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-[0_8px_24px_rgba(20,184,166,0.35)]"
          >
            <Receipt className="w-7 h-7 text-white" />
          </motion.div>
          <h1 className="mt-4 text-3xl font-display font-bold">Find my receipts</h1>
          <p className="mt-2 text-ink-light/60 dark:text-ink-dark/60 max-w-md mx-auto">
            Enter the email you donated with and we&apos;ll send a one-time code to unlock your receipts.
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          {!sent ? (
            <div className="space-y-4">
              <h2 className="text-lg font-display font-semibold">Step 1 — your email</h2>
              <Input
                label="Email used while donating"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={handleRequest} loading={request.isPending} disabled={!email.trim() || cooldown > 0} icon={Mail}>
                {cooldown > 0 ? `Wait ${cooldown}s` : user && user.email === email.trim().toLowerCase() ? 'Send code to my email' : 'Send one-time code'}
              </Button>
              {user && (
                <p className="text-xs text-ink-light/55 dark:text-ink-dark/55">
                  Signed in as {user.email} — receipts donated with that email can be linked to your account below.
                </p>
              )}
            </div>
          ) : !receipts ? (
            <div className="space-y-4">
              <h2 className="text-lg font-display font-semibold">Step 2 — enter the code</h2>
              <p className="text-sm text-ink-light/60 dark:text-ink-dark/60">
                We sent a 6-digit code to <span className="font-medium">{email}</span>.
              </p>
              <Input
                label="One-time code"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
              <div className="flex items-center gap-3">
                <Button onClick={handleVerify} loading={verify.isPending} disabled={otp.length !== 6} icon={KeyRound} iconPosition="right">
                  Unlock receipts
                </Button>
                {cooldown > 0 ? (
                  <span className="text-xs text-ink-light/50 dark:text-ink-dark/50">Resend in {cooldown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleRequest}
                    disabled={request.isPending}
                    className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    Resend code
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => { setSent(false); setOtp(''); }}
                  className="text-xs font-medium text-ink-light/55 dark:text-ink-dark/55 hover:underline"
                >
                  Change email
                </button>
              </div>
            </div>
          ) : receipts.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-ink-light/60 dark:text-ink-dark/60">No completed donations found for this email.</p>
              <Link to={PATHS.CELEBRATE.GIVE} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline">
                <PartyPopper className="w-4 h-4" /> Make your first gift
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-display font-semibold">{receipts.length} receipt{receipts.length > 1 ? 's' : ''}</h2>
                <button type="button" onClick={() => setReceipts(null)} className="text-xs font-medium text-ink-light/55 dark:text-ink-dark/55 hover:underline">
                  Look up another email
                </button>
              </div>
              {receipts.map((d) => (
                <div key={d.id} className="rounded-xl border border-teal-100 dark:border-teal-900/60 p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-semibold">{d.publicDonationReference}</p>
                    <p className="mt-0.5 text-sm text-ink-light/70 dark:text-ink-dark/70">
                      ₹{formatNumber(d.amount)} · {d.causeLabel || d.cause} · {d.ngoName}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-light/50 dark:text-ink-dark/50">
                      {d.occasionLabel || 'Occasion'} · {formatDate(d.createdAt, 'dd MMM yyyy')} · {d.donorName}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <Link
                      to={`${PATHS.CELEBRATE.COMPLETE}?ref=${encodeURIComponent(d.publicDonationReference)}&id=${encodeURIComponent(d.id)}`}
                      className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      View <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    {user && (
                      <Button size="sm" variant="subtle" icon={UserCheck} onClick={() => claimRef(d.publicDonationReference)}>
                        Link to my account
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}