import { getServerSession } from 'next-auth/next';

import { authOptions } from 'pages/api/auth/[...nextauth]';
import deleteOffer from 'services/offers/delete';
import getOfferById from 'services/offers/get';
import isAuthorized from 'services/offers/isAuthorized';
import updateOffer from 'services/offers/update';

export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  let offer = await getOfferById(req.query.id);

  if (!isAuthorized(offer, session)) {
    return res.status(401).json({ error: 'not_authorized' });
  }

  switch (req.method) {
    case 'DELETE': {
      try {
        offer = await deleteOffer(offer.airtableId);
        res.status(200).json({ status: 'updated', offer });
      } catch (error) {
        res.status(422).json({ status: 'not_updated', error });
      }
      break;
    }
    case 'PUT': {
      try {
        const payload = req.body;
        offer = await updateOffer(offer.airtableId, payload);
        res.status(200).json({ status: 'updated', offer });
      } catch (error) {
        res.status(422).json({ status: 'not_updated', error });
      }
      break;
    }

    default:
      res.status(400);
  }
};
