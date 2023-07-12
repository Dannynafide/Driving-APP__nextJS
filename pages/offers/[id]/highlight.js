import { loadStripe } from '@stripe/stripe-js';
import { getServerSession } from 'next-auth/next';
import { useRef, useState } from 'react';

import BaseLayout from 'components/BaseLayout';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import getOfferById from 'services/offers/get';
import isAuthorized from 'services/offers/isAuthorized';
import getAllProducts from 'services/products/getAll';

export const getServerSideProps = async ({ req, query, res }) => {
  const session = await getServerSession(req, res, authOptions);
  const offer = await getOfferById(query.id);

  if (!isAuthorized(offer, session) || !offer) {
    return {
      notFound: true
    };
  }

  const products = await getAllProducts();

  return {
    props: {
      offer,
      products
    }
  };
};

export default function OfferEdit({ offer, products }) {
  const offerForm = useRef();
  const [error, setError] = useState();
  const [formProcessing, setFormProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formProcessing) return;
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

    setError(null);
    setFormProcessing(true);
    const form = new FormData(offerForm.current);
    const payload = {
      id: form.get('productId'),
      offerId: offer.id,
      quantity: 1
    };

    const response = await fetch(`/api/checkout`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const { checkout } = await response.json();
      stripe.redirectToCheckout({ sessionId: checkout.id });
    } else {
      const payload = await response.json();
      setFormProcessing(false);
      setError(payload.error?.details[0]?.message);
    }
  };

  return (
    <BaseLayout>
      <section className="text-gray-600 body-font relative">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              Highlight that offer
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify.
            </p>
          </div>
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <form className="flex flex-wrap -m-2" ref={offerForm} onSubmit={handleSubmit}>
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="productId" className="leading-7 text-sm text-gray-600">
                    Choose type of product
                  </label>
                  <select
                    name="productId"
                    id="productId"
                    className="h-10 w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
                    {products.map((product) => (
                      <option value={product.airtableId} key={product.airtableId}>
                        {product.name} -{' '}
                        {(product.priceCents / 100).toLocaleString('en-US', {
                          style: 'currency',
                          currency: product.priceCurrency
                        })}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="p-2 w-full">
                <button
                  disabled={formProcessing}
                  className="disabled:opacity-50 flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                  {formProcessing ? 'Please wait...' : 'Promote this offer'}
                </button>
                {error && (
                  <div className="flex justify-center w-full my-5">
                    <span className="bg-red-600 w-full rounded text-white px-3 py-3 text-center">
                      Offer not promoted: {error}
                    </span>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}
