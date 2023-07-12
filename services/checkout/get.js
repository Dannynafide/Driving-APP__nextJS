import Stripe from 'stripe';

export const getCheckout = async (stripeCheckoutId) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.retrieve(stripeCheckoutId);
  return session;
};

export default getCheckout;
