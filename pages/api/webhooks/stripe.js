import { buffer } from 'micro';
import Stripe from 'stripe';

import finalize from 'services/checkout/finalize';

export const config = {
  api: {
    bodyParser: false
  }
};

export default async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
    if (event.type === 'payment_intent.succeeded') {
      const offerId = event.data.object.metadata.offerId;
      await finalize(offerId);
      console.log(`event processed...`);
    }

    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
