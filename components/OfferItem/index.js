import Image from 'next/image';
import Link from 'next/link';

const NO_IMAGE = '/noimg.png';

const OfferItem = ({ offer }) => {
  return (
    <div className="xl:w-1/4 md:w-1/2 p-4 cursor-pointer">
      <Link href={`/offers/${offer.id}`}>
        <div className="bg-gray-100 p-6 rounded-lg">
          <Image
            className="h-40 rounded w-full object-cover object-center mb-6"
            src={offer.imageUrl ?? NO_IMAGE}
            width={290}
            height={170}
            alt="content"
          />
          <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">
            {offer.category}
          </h3>
          <h2 className="text-lg text-gray-900 font-medium title-font mb-4">{offer.title}</h2>
          <p className="leading-relaxed text-base">
            {offer.description.length > 100
              ? offer.description.substring(0, 100) + '...'
              : offer.description}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default OfferItem;
