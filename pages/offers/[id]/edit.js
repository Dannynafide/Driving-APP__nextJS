import { getServerSession } from 'next-auth/next';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';

import BaseLayout from 'components/BaseLayout';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import getOfferById from 'services/offers/get';
import isAuthorized from 'services/offers/isAuthorized';
import { uploadImage } from 'utils';

export const getServerSideProps = async ({ req, res, query }) => {
  const session = await getServerSession(req, res, authOptions);
  const offer = await getOfferById(query.id);

  if (!isAuthorized(offer, session) || !offer) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      offer
    }
  };
};

export default function OfferEdit({ offer }) {
  const offerForm = useRef();
  const [error, setError] = useState();
  const [formProcessing, setFormProcessing] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(offer.imageUrl);
  const router = useRouter();

  const handleImagePreview = (e) => {
    const url = window.URL.createObjectURL(e.target.files[0]);
    console.log(`url`, url);
    setImagePreviewUrl(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formProcessing) return;
    setError(null);
    setFormProcessing(true);
    const form = new FormData(offerForm.current);

    const payload = {
      title: form.get('title'),
      category: form.get('category'),
      mobile: form.get('phone'),
      price: form.get('price'),
      description: form.get('description'),
      location: form.get('location')
    };

    if (form.get('picture')) {
      const file = await uploadImage(form.get('picture'));
      payload.imageUrl = file.secure_url;
    }

    const response = await fetch(`/api/offers/${offer.id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      router.push(`/offers/${offer.id}`);
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
              Edit that offer
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify.
            </p>
          </div>
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <form className="flex flex-wrap -m-2" ref={offerForm} onSubmit={handleSubmit}>
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="category" className="leading-7 text-sm text-gray-600">
                    Category
                  </label>
                  <select
                    name="category"
                    id="category"
                    className="h-10 w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
                    <option value="rent">For rent</option>
                    <option value="sale">For sale</option>
                  </select>
                </div>
              </div>
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label htmlFor="title" className="leading-7 text-sm text-gray-600">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    defaultValue={offer.title}
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label htmlFor="location" className="leading-7 text-sm text-gray-600">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    defaultValue={offer.location}
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label htmlFor="price" className="leading-7 text-sm text-gray-600">
                    Price (PLN)
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    defaultValue={offer.price}
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label htmlFor="phone" className="leading-7 text-sm text-gray-600">
                    Mobile phone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    defaultValue={offer.mobile}
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="description" className="leading-7 text-sm text-gray-600">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    defaultValue={offer.description}
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
                </div>
              </div>
              {imagePreviewUrl && (
                <div className="p-2 w-full">
                  <img alt="cover preview" src={imagePreviewUrl} className="rounded" />
                </div>
              )}
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="picture" className="leading-7 text-sm text-gray-600">
                    Picture
                  </label>
                  <input
                    onChange={handleImagePreview}
                    type="file"
                    id="picture"
                    name="picture"
                    required
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <button
                  disabled={formProcessing}
                  className="disabled:opacity-50 flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                  {formProcessing ? 'Please wait...' : 'Edit offer'}
                </button>
                {error && (
                  <div className="flex justify-center w-full my-5">
                    <span className="bg-red-600 w-full rounded text-white px-3 py-3 text-center">
                      Offer not edited: {error}
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
