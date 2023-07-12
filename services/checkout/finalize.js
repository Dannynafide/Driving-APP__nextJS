import Stripe from 'stripe';

import airDB from 'services/airtableClient';
import getOfferById from 'services/offers/get';

export const finalize = async (offerId) => {
  let offer = await getOfferById(offerId);
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const checkout = await stripe.checkout.sessions.retrieve(offer.stripeCheckoutId);

  if (offer.stripeCheckoutStatus === 'succeeded' || checkout.payment_status === 'unpaid') {
    return { offer, checkout };
  }
  const paymentIntent = await stripe.paymentIntents.retrieve(checkout.payment_intent);

  if (paymentIntent.status === 'succeeded') {
    offer = await airDB('offers').update([
      {
        id: offer.airtableId,
        fields: {
          stripeCheckoutStatus: paymentIntent.status,
          highlightTill: new Date(Date.now() + 1000 * 60 * 60 * 24 * offer.highlightDuration) // next X days in future
        }
      }
    ]);

    return { offer: offer[0].fields, checkout };
  }
  return { offer, checkout };
};

export default finalize;
