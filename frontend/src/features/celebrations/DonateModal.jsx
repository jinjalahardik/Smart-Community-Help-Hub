import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Switch } from '../../components/ui/Toggle';
import { celebrationCauseById, CELEBRATION_AMOUNTS, celebrationOccasionLabel } from '../../constants/celebrations';
import { formatNumber } from '../../utils/format';
import { useDonateToCampaign } from '../../hooks/useCelebrations';
import { useAuth } from '../../context/AuthContext';
import { newIdempotencyKey, celebrationService } from './celebrationService';
import { openRazorpayCheckout } from './razorpay';
import toast from 'react-hot-toast';

export default function DonateModal({ open, onClose, campaign, onSuccess }) {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [custom, setCustom] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');
  const donate = useDonateToCampaign();

  const amountValue = custom ? Number(amount) : Number(amount || 0);
  const cause = celebrationCauseById(campaign?.cause);

  const handleConfirm = async () => {
    if (!amountValue || amountValue < 10) return;
    if (!user && !guestEmail.trim()) return;
    const payload = {
      amount: amountValue,
      cause: campaign.cause,
      idempotencyKey: newIdempotencyKey(`cbd-${campaign.id}`),
      anonymous,
      ...(!user && { donorName: undefined, donorEmail: guestEmail }),
    };
    try {
      const result = await donate.mutateAsync({ id: campaign.id, payload });
      // Razorpay mode: Checkout + server verification before success.
      if (result.payment?.gateway === 'razorpay') {
        try {
          const rzpResponse = await openRazorpayCheckout({
            keyId: result.payment.keyId,
            orderId: result.payment.orderId,
            amount: result.payment.amount,
            currency: result.payment.currency || 'INR',
            description: `Donation to ${campaign?.ngoName || 'verified NGO'}`,
            prefill: { name: user?.name || undefined, email: user?.email || guestEmail || undefined },
            notes: { donationId: result.donation?.id, campaignId: campaign.id },
          });
          const verified = await celebrationService.verifyRazorpayPayment({
            donationId: result.donation?.id,
            razorpay_order_id: rzpResponse.razorpay_order_id,
            razorpay_payment_id: rzpResponse.razorpay_payment_id,
            razorpay_signature: rzpResponse.razorpay_signature,
          });
          toast.success('Donation verified successfully');
          onSuccess?.({ ...result, donation: verified.donation || result.donation });
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
        }
        return;
      }
      onSuccess?.(result);
      // Sandbox: PENDING until approved on the secure hosted page.
      if (result.payment?.approveUrl) window.location.assign(result.payment.approveUrl);
    } catch {
      /* toast shown by hook onError */
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Contribute"
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm} loading={donate.isPending} disabled={!amountValue || amountValue < 10 || (!user && !guestEmail.trim())}>
            Pay ₹{formatNumber(amountValue) || 0}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-ink-light/70 dark:text-ink-dark/70">
          {campaign?.eventTitle} · {cause?.label || campaign?.cause} to {campaign?.ngoName}
        </p>

        {!custom ? (
          <div className="grid grid-cols-4 gap-2">
            {CELEBRATION_AMOUNTS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => { setAmount(String(amt)); setCustom(false); }}
                className={
                  amount === String(amt) && !custom
                    ? 'rounded-xl border-2 border-teal-600 bg-teal-50 text-teal-700 py-2.5 text-sm font-semibold dark:bg-teal-900/40 dark:text-teal-300'
                    : 'rounded-xl border border-teal-100 dark:border-teal-900/60 py-2.5 text-sm font-medium hover:border-teal-400'
                }
              >
                ₹{amt}
              </button>
            ))}
          </div>
        ) : (
          <Input
            label={campaign?.occasion ? `Amount for ${celebrationOccasionLabel(campaign.occasion)}` : 'Amount (₹)'}
            type="number"
            min={10}
            placeholder="e.g. 500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        )}
        <button
          type="button"
          onClick={() => { setCustom(!custom); if (!custom) setAmount(''); }}
          className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline"
        >
          {custom ? 'Use quick amounts' : 'Enter custom amount'}
        </button>

        {!user && (
          <Input
            label="Email for receipt (required)"
            type="email"
            placeholder="For your receipt & lookup"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
          />
        )}

        <div className="flex items-center justify-between rounded-xl border border-teal-100 dark:border-teal-900/60 px-4 py-3">
          <div>
            <p className="text-sm font-medium">Give anonymously</p>
            <p className="text-xs text-ink-light/60 dark:text-ink-dark/60">Your name will show as "Anonymous Donor"</p>
          </div>
          <Switch checked={anonymous} onChange={setAnonymous} />
        </div>
      </div>
    </Modal>
  );
}