import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, ArrowRight, ArrowLeft, ShieldCheck, User, Check, ArrowUpRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Switch } from '../../components/ui/Toggle';
import { Card } from '../../components/ui/Card';
import Stepper from '../../features/celebrations/Stepper';
import { newIdempotencyKey, celebrationService } from '../../features/celebrations/celebrationService';
import { openRazorpayCheckout } from '../../features/celebrations/razorpay';
import { useVerifiedNgos, useQuickGive } from '../../hooks/useCelebrations';
import { useAuth } from '../../context/AuthContext';

import {
  CELEBRATION_OCCASIONS, CELEBRATION_CAUSES, CELEBRATION_AMOUNTS,
  CELEBRATION_AMOUNT_MIN, celebrationOccasionLabel, celebrationCauseById,
} from '../../constants/celebrations';
import { occasionImage } from '../../constants/celebrationImages';
import { formatNumber } from '../../utils/format';
import { PATHS } from '../../routes/paths';
import toast from 'react-hot-toast';

const STEPS = ['Occasion', 'Cause & NGO', 'Amount', 'Review', 'Payment'];

export default function QuickGive() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [occasion, setOccasion] = useState('');
  const [cause, setCause] = useState('');
  const [ngoId, setNgoId] = useState('');
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [starting, setStarting] = useState(false);

  const ngos = useVerifiedNgos();
  const give = useQuickGive();

  const amountValue = Number(customAmount ? amount : amount || 0);
  const ngo = ngos.data?.find((n) => n.id === ngoId);
  const selectedCause = celebrationCauseById(cause);

  const canProceed = {
    1: !!occasion,
    2: !!cause && !!ngoId,
    3: amountValue >= CELEBRATION_AMOUNT_MIN && (!!user || !!guestEmail?.trim()),
    4: true,
  }[step];

  const handleBack = () => setStep((s) => Math.max(1, s - 1));
  const handleNext = () => {
    if (!canProceed) return;
    if (step === 4) {
      handlePay();
      return;
    }
    setStep((s) => s + 1);
  };

  const navigate = useNavigate();

  const handlePay = async () => {
    const payload = {
      amount: amountValue,
      cause,
      ngoId,
      occasion,
      anonymous,
      donorName: user?.name || guestName || undefined,
      donorEmail: user?.email || guestEmail || undefined,
      idempotencyKey: newIdempotencyKey('qg'),
    };
    try {
      setStarting(true);
      const res = await give.mutateAsync(payload);
      if (res.reused) toast('Using your existing pending payment');
      const payment = res.payment;

      // Razorpay mode: open Standard Checkout, then verify server-side.
      // Success is only shown after the backend confirms the payment.
      if (payment?.gateway === 'razorpay') {
        try {
          const rzpResponse = await openRazorpayCheckout({
            keyId: payment.keyId,
            orderId: payment.orderId,
            amount: payment.amount,
            currency: payment.currency || 'INR',
            description: `Donation to ${ngo?.name || 'verified NGO'}`,
            prefill: {
              name: user?.name || guestName || undefined,
              email: user?.email || guestEmail || undefined,
            },
            notes: { donationId: res.donation?.id, ref: res.donation?.publicDonationReference },
          });
          const verified = await celebrationService.verifyRazorpayPayment({
            donationId: res.donation?.id,
            razorpay_order_id: rzpResponse.razorpay_order_id,
            razorpay_payment_id: rzpResponse.razorpay_payment_id,
            razorpay_signature: rzpResponse.razorpay_signature,
          });
          const donee = verified.donation || res.donation;
          toast.success('Donation verified successfully');
          navigate(
            `${PATHS.CELEBRATE.COMPLETE}?ref=${encodeURIComponent(donee.publicDonationReference || '')}&id=${encodeURIComponent(donee.id || '')}`,
          );
        } catch (checkoutErr) {
          if (checkoutErr?.code === 'dismissed') {
            toast('Payment window closed. Your donation is still pending — retry when ready.');
          } else {
            const rawMsg = checkoutErr?.message;
            const displayMsg =
              rawMsg && !rawMsg.includes('undefined')
                ? rawMsg
                : 'Payment gateway is temporarily unavailable. Please try again.';
            toast.error(displayMsg);
          }
        } finally {
          setStarting(false);
        }
        return;
      }

      // Sandbox mode: the donation is PENDING until the donor approves on
      // the hosted page; the signed webhook marks it COMPLETED server-side.
      // We redirect and never claim success ourselves.
      const approveUrl = payment?.approveUrl;
      if (!approveUrl) throw new Error('No payment session returned');
      window.location.assign(approveUrl);
    } catch {
      setStarting(false);
      /* toast shown by hook */
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/60 to-transparent dark:from-teal-950/30">
      <div className="container-app max-w-5xl py-12 sm:py-16">
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-[0_8px_24px_rgba(20,184,166,0.35)]"
          >
            <PartyPopper className="w-7 h-7 text-white" />
          </motion.div>
          <h1 className="mt-4 text-3xl font-display font-bold">Quick Give</h1>
          <p className="mt-2 text-ink-light/60 dark:text-ink-dark/60 max-w-md mx-auto">
            Four tiny steps and your celebration becomes charity. No login needed.
          </p>
        </div>

        <Stepper steps={STEPS} current={step} onStepClick={(idx) => idx < 5 && setStep(idx)} />

        <Card className="mt-8 p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.18 }}
            >
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What are you celebrating?</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {CELEBRATION_OCCASIONS.map((o, i) => {
                      const selected = occasion === o.value;
                      return (
                        <motion.button
                          key={o.value}
                          type="button"
                          initial={{ opacity: 0, y: 24 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.05, ease: 'easeOut' }}
                          onClick={() => setOccasion(o.value)}
                          className={
                            'group relative rounded-[20px] overflow-hidden aspect-[4/3] cursor-pointer border-2 text-left transition-all duration-300 ' +
                            (selected
                              ? 'border-teal-600 ring-2 ring-teal-600 ring-offset-2 ring-offset-white dark:ring-offset-slate-950 shadow-[0_12px_30px_rgba(13,148,136,0.35)]'
                              : 'border-white/50 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:border-teal-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)] hover:-translate-y-1.5')
                          }
                        >
                          <img
                            src={occasionImage(o.value)}
                            alt={`${o.label} celebration`}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="relative z-10 p-5 h-full flex flex-col justify-end">
                            <h3 className="font-bold text-[15px] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">{o.label}</h3>
                            <p className="text-[12px] text-white/85 mt-1.5 leading-snug line-clamp-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">{o.subtitle}</p>
                          </div>
                          <span className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${selected ? 'bg-teal-600 text-white opacity-100 scale-100' : 'bg-white/90 dark:bg-slate-900/80 text-teal-600 dark:text-teal-300 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100'}`}>
                            {selected ? <Check className="w-4 h-4" strokeWidth={3} /> : <ArrowUpRight className="w-4 h-4" />}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-display font-semibold">Your support can make a meaningful difference.</h2>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {CELEBRATION_CAUSES.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => setCause(c.value)}
                          className={
                            cause === c.value
                              ? 'rounded-xl border-2 border-teal-600 bg-teal-50 dark:bg-teal-900/30 p-3 text-left'
                              : 'rounded-xl border border-teal-100 dark:border-teal-900/60 p-3 text-left hover:border-teal-400'
                          }
                        >
                          <p className="font-semibold text-sm">{c.label}</p>
                          <p className="mt-1 text-xs text-ink-light/55 dark:text-ink-dark/55">{c.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-ink-light/70 dark:text-ink-dark/70">Verified NGO to receive the funds</h3>
                    {ngos.isLoading ? (
                      <p className="mt-3 text-sm text-ink-light/50">Loading verified NGOs…</p>
                    ) : ngos.data?.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {ngos.data.map((n) => (
                          <button
                            key={n.id}
                            type="button"
                            onClick={() => setNgoId(n.id)}
                            className={
                              ngoId === n.id
                                ? 'inline-flex items-center gap-2 rounded-full border-2 border-teal-600 bg-teal-50 dark:bg-teal-900/30 px-4 py-2 text-sm font-medium'
                                : 'inline-flex items-center gap-2 rounded-full border border-teal-100 dark:border-teal-900/60 px-4 py-2 text-sm font-medium hover:border-teal-400'
                            }
                          >
                            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                            {n.name}
                            <span className="text-xs text-ink-light/50 dark:text-ink-dark/50">· {n.city}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-coral-600">No verified NGOs available right now.</p>
                    )}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-lg font-display font-semibold">Every contribution helps create a brighter tomorrow.</h2>
                  <p className="mt-1 text-sm text-ink-light/60 dark:text-ink-dark/60">Every contribution helps bring hope, care, and support to those in need.</p>
                  <div className="mt-5 grid grid-cols-4 gap-3">
                    {CELEBRATION_AMOUNTS.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => { setAmount(String(amt)); setCustomAmount(false); }}
                        className={
                          !customAmount && amount === String(amt)
                            ? 'rounded-xl border-2 border-teal-600 bg-teal-50 dark:bg-teal-900/30 py-3.5 text-sm font-bold'
                            : 'rounded-xl border border-teal-100 dark:border-teal-900/60 py-3.5 text-sm font-semibold hover:border-teal-400'
                        }
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                  {customAmount ? (
                    <div className="mt-5">
                      <Input
                        label="Custom amount (₹)"
                        type="number"
                        min={CELEBRATION_AMOUNT_MIN}
                        placeholder="e.g. 500"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      {amountValue > 0 && amountValue < CELEBRATION_AMOUNT_MIN && (
                        <p className="mt-1.5 text-xs text-coral-600">Minimum amount is ₹{CELEBRATION_AMOUNT_MIN}.</p>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCustomAmount(true)}
                      className="mt-5 text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      Enter a custom amount
                    </button>
                  )}

                  {!user && (
                    <div className="mt-6 grid sm:grid-cols-2 gap-4">
                      <Input label="Your name (private)" placeholder="Optional" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
                      <Input
                        label="Email for receipt (required)"
                        type="email"
                        placeholder="For your receipt & lookup"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                      />
                    </div>
                  )}
                  <div className="mt-5 flex items-center justify-between rounded-xl border border-teal-100 dark:border-teal-900/60 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-ink-light/50 dark:text-ink-dark/50" />
                      <div>
                        <p className="text-sm font-medium">Give anonymously</p>
                        <p className="text-xs text-ink-light/60 dark:text-ink-dark/60">{user?.name || 'Guest'} will show as "Anonymous Donor"</p>
                      </div>
                    </div>
                    <Switch checked={anonymous} onChange={setAnonymous} />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="text-lg font-display font-semibold">Review your gift</h2>
                  <div className="mt-5 space-y-3">
                    <SummaryRow label="Occasion" value={celebrationOccasionLabel(occasion)} />
                    <SummaryRow label="Cause" value={selectedCause?.label || cause} />
                    <SummaryRow label="NGO" value={ngo?.name} sub={ngo?.city} />
                    <SummaryRow label="Amount" value={`₹${formatNumber(amountValue)}`} accent />
                    <SummaryRow label="Donor" value={anonymous ? 'Anonymous Donor' : (user?.name || guestName || 'Guest')} />
                    {!user && <SummaryRow label="Receipt email" value={guestEmail} />}
                  </div>
                  <p className="mt-5 flex items-center gap-2 text-xs text-ink-light/55 dark:text-ink-dark/55">
                    <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    You&apos;ll pay on our secure payment page. 100% goes to the NGO.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 pt-5 border-t border-teal-100 dark:border-teal-900/60">
            <div className="flex items-center justify-between gap-3">
              <Button variant="ghost" onClick={handleBack} disabled={step === 1} icon={ArrowLeft}>Back</Button>
              <Button
                onClick={handleNext}
                loading={give.isPending || starting}
                disabled={!canProceed}
                icon={step === 4 ? ShieldCheck : ArrowRight}
                iconPosition="right"
                className={
                  canProceed && !give.isPending && !starting
                    ? 'shadow-[0_10px_30px_rgba(13,148,136,0.4)] animate-pulse'
                    : ''
                }
              >
                {step === 4 ? 'Continue to secure payment' : 'Continue'}
              </Button>
            </div>
            <p className="mt-3 text-center text-xs text-ink-light/50 dark:text-ink-dark/50">
              Already donated? <Link to={PATHS.CELEBRATE.RECEIPTS} className="text-teal-600 dark:text-teal-400 font-medium hover:underline">Find my receipts</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, sub, accent }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-teal-100 dark:border-teal-900/60 px-4 py-3">
      <span className="text-sm text-ink-light/60 dark:text-ink-dark/60">{label}</span>
      <span className="text-right">
        <span className={accent ? 'text-base font-bold text-teal-700 dark:text-teal-300' : 'text-sm font-semibold'}>{value}</span>
        {sub && <span className="block text-xs text-ink-light/50 dark:text-ink-dark/50">{sub}</span>}
      </span>
    </div>
  );
}