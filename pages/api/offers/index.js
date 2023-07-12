import { getServerSession } from 'next-auth/next';

import { authOptions } from 'pages/api/auth/[...nextauth]';
import createOffer from 'services/offers/create';
import getRecentOffers from 'services/offers/getRecent';

export default async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const offers = await getRecentOffers(4);
      res.status(200).json(offers);

      break;
    }
    case 'POST': {
      try {
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
          return res.status(401).json({ error: 'not_authorized' });
        }

        const payload = req.body;
        const userId = session.user.id;
        const offer = await createOffer(payload, userId);
        res.status(200).json({ status: 'created', offer });
      } catch (error) {
        res.status(422).json({ status: 'not_created', error });
      }

      break;
    }
    default: {
      res.status(400);
    }
  }
};
