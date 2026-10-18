import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Copy, Receipt, Home, RefreshCw, CircleAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useMoneyDonation } from '../../hooks/useCelebrations';
import { formatNumber, formatDate } from '../../utils/format';
import { PATHS } from '../../routes/paths';
import toast from 'react-hot-toast';

export default function DonationComplete() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const ref = params.get('ref') || '';
  const id = params.get('id') || '';
  const hasReference = !!(id || ref);
  const { data: donation, isLoading, isError, error, refetch, isFetching } = useMoneyDonation(id || null);

  const copyRef = () => {
    navigator.clipboard?.writeText(donation?.publicDonationReference || ref).then(
      () => toast.success('Receipt ID copied'),
      () => toast.error('Could not copy')
    );
  };

  const canRetry = !!id && !isFetching;

  const renderBody = () => {
    // 1. Still verifying the payment (loading state).
    if (isLoading) {
      return (
        <div className="py-14">
          <div className="w-16 h-16 mx-auto rounded-full bg-teal-100 dark:bg-teal-900/40 animate-pulse flex items-center justify-center">
            <Receipt className="w-8 h-8 text-teal-600 dark:text-teal-400" />
          </div>
          <p className="mt-5 text-sm font-medium text-ink-light/70 dark:text-ink-dark/70">Processing payment…</p>
          <p className="mt-1 text-xs text-ink-light/50 dark:text-ink-dark/50">Confirming your donation with the payment provider</p>
        </div>
      );
    }

    // 2. Payment is not completed yet — ask the user to try again in a moment.
    if (donation && donation.paymentStatus !== 'COMPLETED') {
      return (
        <div className="py-12">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="mt-5 text-xl font-display font-bold">Payment still processing</h1>
          <p className="mt-2 text-sm text-ink-light/60 dark:text-ink-dark/60">
            Your payment has not been confirmed yet. It is still {donation.paymentStatus || 'PENDING'}.
          </p>
          <div className="mt-6">
            <Button icon={RefreshCw} onClick={refetch} disabled={!canRetry} loading={isFetching}>Try Again</Button>
          </div>
        </div>
      );
    }

    // 3. Failed to load / no reference — error state.
    if (isError || !donation) {
      return (
        <div className="py-12">
          <div className="w-16 h-16 mx-auto rounded-full bg-coral-100 dark:bg-coral-900/40 flex items-center justify-center">
            <CircleAlert className="w-8 h-8 text-coral-600 dark:text-coral-400" />
          </div>
          <h1 className="mt-5 text-xl font-display font-bold">Payment could not be completed</h1>
          <p className="mt-2 text-sm text-ink-light/60 dark:text-ink-dark/60">
            {!hasReference
              ? 'No receipt reference was provided, so nothing was charged.'
              : (error?.message || 'We could not confirm this donation right now.')}
          </p>
          {canRetry ? (
            <div className="mt-6">
              <Button icon={RefreshCw} onClick={refetch} disabled={!canRetry} loading={isFetching}>Try Again</Button>
            </div>
          ) : (
            <div className="mt-6 text-sm text-ink-light/60 dark:text-ink-dark/60">
              <button type="button" onClick={() => navigate(PATHS.CELEBRATE.GIVE)} className="font-medium text-teal-600 dark:text-teal-400 hover:underline">
                Start another donation
              </button>
            </div>
          )}
        </div>
      );
    }

    // 4. Success state — real values straight from the API.
    const isSandbox = donation.paymentProvider === 'sandbox';
    return (
      <>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
          className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-[0_10px_30px_rgba(20,184,166,0.4)]"
        >
          <Check className="w-8 h-8 text-white" strokeWidth={3} />
        </motion.div>
        <h1 className="mt-5 text-2xl font-display font-bold">Donation Successful</h1>

        <p className="mt-3 text-4xl font-extrabold text-teal-700 dark:text-teal-300">₹{formatNumber(donation.amount)}</p>
        <p className="mt-1 text-sm font-medium text-ink-light/70 dark:text-ink-dark/70">
          {donation.causeLabel || donation.cause || 'Donation'} donation
        </p>

        <div className="mt-6 rounded-2xl border border-teal-100 dark:border-teal-900/60 bg-teal-50/50 dark:bg-teal-900/20 p-5 text-left space-y-2.5 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-ink-light/60 dark:text-ink-dark/60">Donated to</span>
            <span className="font-semibold text-right">{donation.ngoName}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-ink-light/60 dark:text-ink-dark/60">Donor</span>
            <span className="font-medium">{donation.donorName}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-ink-light/60 dark:text-ink-dark/60">Receipt ID</span>
            <span className="inline-flex items-center gap-2">
              <span className="font-mono">{donation.publicDonationReference}</span>
              <button onClick={copyRef} type="button" className="text-teal-600 dark:text-teal-400" aria-label="Copy receipt ID">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-ink-light/60 dark:text-ink-dark/60">Date</span>
            <span>{formatDate(donation.createdAt, 'dd MMM yyyy')}</span>
          </div>
        </div>

        <p className="mt-5 text-sm text-ink-light/70 dark:text-ink-dark/70">
          Your donation has been recorded successfully.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Button icon={Receipt} onClick={() => navigate(PATHS.CELEBRATE.RECEIPTS)}>View Receipt</Button>
          <Button variant="outline" icon={Home} onClick={() => navigate(PATHS.HOME)}>Back to Home</Button>
        </div>

        {isSandbox && (
          <p className="mt-5 text-xs text-ink-light/55 dark:text-ink-dark/55">
            Demo payment — no real money was charged.
          </p>
        )}
        {donation.paymentProvider === 'razorpay' && (
          <p className="mt-5 text-xs text-ink-light/55 dark:text-ink-dark/55">
            Paid securely via Razorpay (test mode — no real money was charged).
          </p>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/60 to-transparent dark:from-teal-950/30">
      <div className="container-app max-w-lg py-16">
        <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}>
          <Card className="p-8 text-center overflow-hidden relative">
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-teal-400/10 blur-2xl" />
            {renderBody()}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}