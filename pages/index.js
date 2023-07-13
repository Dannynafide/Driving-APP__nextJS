import BaseLayout from 'components/BaseLayout';
import useSWR from 'swr';

import OfferItem from 'components/OfferItem';
import getRecentOffers from 'services/offers/getRecent';
import { jsonFetcher } from 'utils/index';

export const getStaticProps = async () => {
  const offers = await getRecentOffers(4);

  return {
    props: {
      offers
    }
  };
};

export default function Home({ offers }) {
  // If there is a new post, download it without having to refresh the page.
  const { data } = useSWR('/api/offers', jsonFetcher, { fallbackData: offers });

  return (
    <BaseLayout>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap w-full mb-20">
            <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
                Best Private Yacht Rentals
              </h1>
              <div className="h-1 w-20 bg-indigo-500 rounded"></div>
            </div>
            <p className="lg:w-1/2 w-full leading-relaxed text-gray-500">
              Pick your favorite provider and search for all types of boat rentals near you,
              including sailing boats, motorboats, and luxury yachts.
            </p>
          </div>
          <div className="flex flex-wrap -m-4">
            {data.map((offer) => (
              <OfferItem key={offer.id} offer={offer} />
            ))}
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}
