import finalizeCheckout from 'services/checkout/finalize';

export default async (req, res) => {
  switch (req.method) {
    case 'PUT': {
      try {
        const { checkout, offer } = await finalizeCheckout(req.query.id);

        res.status(200).json({ checkout, offer });
      } catch (error) {
        res.status(422).json({ checkout: null, offer: null, error });
      }
      break;
    }

    default:
      res.status(400);
  }
};
