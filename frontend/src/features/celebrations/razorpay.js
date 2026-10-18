// Razorpay Standard Checkout loader/opener (TEST MODE ONLY).
// Secrets never touch the frontend: the backend returns key_id + order_id
// per donation, and the server re-verifies every payment before COMPLETED.
// "Payment successful" is only shown after backend confirmation.

const CHECKOUT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

let loadPromise = null;

export function loadRazorpayCheckoutJs() {
  if (typeof window !== 'undefined' && window.Razorpay) return Promise.resolve(true);
  if (loadPromise) return loadPromise;
  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = CHECKOUT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      loadPromise = null;
      reject(new Error('Could not load the Razorpay checkout. Check your connection and try again.'));
    };
    document.body.appendChild(script);
  });
  return loadPromise;
}

// Opens Checkout for a backend-created order. Resolves with the Razorpay
// success callback payload; rejects on dismiss/failure/load error so callers
// can show pending/failed states instead of claiming success.
export async function openRazorpayCheckout({
  keyId,
  orderId,
  amount,
  currency = 'INR',
  name = 'Smart Community Help Hub',
  description = 'Donation',
  prefill = {},
  notes = {},
  themeColor = '#0F766E',
}) {
  await loadRazorpayCheckoutJs();
  if (!keyId || !orderId) throw new Error('Payment session is incomplete. Please start again.');
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: keyId,
      order_id: orderId,
      amount,
      currency,
      name,
      description,
      prefill,
      notes,
      theme: { color: themeColor },
      handler(response) {
        resolve(response); // { razorpay_payment_id, razorpay_order_id, razorpay_signature }
      },
      modal: {
        ondismiss() {
          reject(Object.assign(new Error('Payment window closed before completion.'), { code: 'dismissed' }));
        },
      },
    });
    rzp.on('payment.failed', (resp) => {
      reject(Object.assign(
        new Error(resp?.error?.description || 'Payment failed. No amount was charged.'),
        { code: 'failed', detail: resp?.error },
      ));
    });
    rzp.open();
  });
}
